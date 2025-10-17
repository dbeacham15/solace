"use client";

import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  label: string;
  id: string;
}

interface DropdownPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  openUpward: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  label,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dropdown position with viewport detection
  const calculateDropdownPosition = (): DropdownPosition | null => {
    if (!buttonRef.current) return null;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Dropdown base dimensions
    const dropdownMaxHeight = 300; // max-h-60 + search input + padding
    const spaceBelow = viewportHeight - buttonRect.bottom - 8; // 8px margin
    const spaceAbove = buttonRect.top - 8; // 8px margin

    // Determine if dropdown should open upward or downward
    const shouldOpenUpward = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;

    // Calculate available height
    const maxHeight = shouldOpenUpward
      ? Math.min(spaceAbove, dropdownMaxHeight)
      : Math.min(spaceBelow, dropdownMaxHeight);

    // Calculate horizontal position
    let left = buttonRect.left;
    const dropdownWidth = buttonRect.width;

    // Adjust if dropdown would overflow viewport on the right
    if (left + dropdownWidth > viewportWidth) {
      left = viewportWidth - dropdownWidth - 16; // 16px margin
    }

    // Adjust if dropdown would overflow viewport on the left
    if (left < 16) {
      left = 16; // 16px margin
    }

    return {
      top: shouldOpenUpward ? undefined : buttonRect.bottom + 8,
      bottom: shouldOpenUpward ? viewportHeight - buttonRect.top + 8 : undefined,
      left,
      width: dropdownWidth,
      maxHeight,
      openUpward: shouldOpenUpward,
    };
  };

  // Update dropdown position when opened or on scroll/resize
  useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        setDropdownPosition(calculateDropdownPosition());
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchTerm("");
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
    // Return focus to button after selection
    setTimeout(() => buttonRef.current?.focus(), 0);
  };

  const handleClear = () => {
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
    // Return focus to button after clearing
    setTimeout(() => buttonRef.current?.focus(), 0);
  };

  const displayValue = value || placeholder;

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-2">
        {label}
      </label>

      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left cursor-pointer focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all flex items-center justify-between ${
          value ? "text-gray-700" : "text-gray-400"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{displayValue}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && dropdownPosition && (
        <div
          ref={dropdownRef}
          className="fixed z-[100] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
          style={{
            top: dropdownPosition.top !== undefined ? `${dropdownPosition.top}px` : undefined,
            bottom: dropdownPosition.bottom !== undefined ? `${dropdownPosition.bottom}px` : undefined,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: `${dropdownPosition.maxHeight}px`,
          }}
          role="listbox"
          aria-label={label}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              aria-label={`Search ${label.toLowerCase()}`}
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {/* Clear Option */}
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear selection
              </button>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  role="option"
                  aria-selected={value === option}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {value === option && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
