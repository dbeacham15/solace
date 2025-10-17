import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './Badge';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleSelectAll = () => {
    onChange([...options]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-healthcare-neutral-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-left border-2 border-healthcare-neutral-200 rounded-healthcare bg-white hover:border-healthcare-primary-300 focus:border-healthcare-primary-500 focus:ring-2 focus:ring-healthcare-primary-500 focus:outline-none transition-colors duration-200"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="block truncate text-healthcare-neutral-900">
            {selected.length === 0 ? (
              <span className="text-healthcare-neutral-400">{placeholder}</span>
            ) : (
              <span className="flex items-center gap-2">
                <span>{selected.length} selected</span>
                <Badge variant="primary" size="sm">{selected.length}</Badge>
              </span>
            )}
          </span>
          <svg
            className={`w-5 h-5 text-healthcare-neutral-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white border-2 border-healthcare-neutral-200 rounded-healthcare shadow-soft-lg max-h-80 overflow-hidden">
            {searchable && (
              <div className="p-3 border-b border-healthcare-neutral-200">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-healthcare-neutral-200 rounded-healthcare focus:border-healthcare-primary-500 focus:ring-2 focus:ring-healthcare-primary-500 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="p-2 border-b border-healthcare-neutral-200 flex gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex-1 px-3 py-1.5 text-sm text-healthcare-primary-700 hover:bg-healthcare-primary-50 rounded transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 px-3 py-1.5 text-sm text-healthcare-neutral-600 hover:bg-healthcare-neutral-100 rounded transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="overflow-y-auto max-h-60">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-healthcare-neutral-500">
                  No options found
                </div>
              ) : (
                <ul role="listbox">
                  {filteredOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => toggleOption(option)}
                      className="px-4 py-2.5 hover:bg-healthcare-primary-50 cursor-pointer flex items-center gap-3 transition-colors"
                      role="option"
                      aria-selected={selected.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => {}}
                        className="w-4 h-4 text-healthcare-primary-600 border-healthcare-neutral-300 rounded focus:ring-healthcare-primary-500"
                      />
                      <span className="text-sm text-healthcare-neutral-900">{option}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
