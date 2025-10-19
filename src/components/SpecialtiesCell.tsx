"use client";

import { useState, useRef, useEffect } from "react";

interface SpecialtiesCellProps {
  specialties: string[];
  maxVisible?: number;
}

interface PopoverPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  openUpward: boolean;
}

export default function SpecialtiesCell({ specialties, maxVisible = 3 }: SpecialtiesCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate popover position with viewport detection
  const calculatePopoverPosition = (): PopoverPosition | null => {
    if (!buttonRef.current) return null;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Popover dimensions
    const popoverWidth = 320; // w-80
    const popoverMaxHeight = 280; // max content height
    const spaceBelow = viewportHeight - buttonRect.bottom - 8;
    const spaceAbove = buttonRect.top - 8;

    // Determine if popover should open upward
    const shouldOpenUpward = spaceBelow < popoverMaxHeight && spaceAbove > spaceBelow;

    // Calculate horizontal position
    let left = buttonRect.left;

    // Adjust if popover would overflow viewport on the right
    if (left + popoverWidth > viewportWidth) {
      left = Math.max(16, viewportWidth - popoverWidth - 16);
    }

    // Adjust if popover would overflow viewport on the left
    if (left < 16) {
      left = 16;
    }

    return {
      top: shouldOpenUpward ? undefined : buttonRect.bottom + 8,
      bottom: shouldOpenUpward ? viewportHeight - buttonRect.top + 8 : undefined,
      left,
      width: popoverWidth,
      openUpward: shouldOpenUpward,
    };
  };

  // Update position when hovering
  useEffect(() => {
    if (isHovered) {
      const updatePosition = () => {
        setPopoverPosition(calculatePopoverPosition());
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setPopoverPosition(null);
    }
  }, [isHovered]);

  if (!Array.isArray(specialties) || specialties.length === 0) {
    return <span className="text-gray-400">None</span>;
  }

  const visibleSpecialties = specialties.slice(0, maxVisible);
  const remainingCount = specialties.length - maxVisible;
  const hasMore = remainingCount > 0;

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {visibleSpecialties.map((specialty, idx) => (
          <span
            key={idx}
            className="inline-block px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-md font-medium"
          >
            {specialty}
          </span>
        ))}
        {hasMore && (
          <button
            ref={buttonRef}
            type="button"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="inline-flex items-center px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            +{remainingCount} more
          </button>
        )}
      </div>

      {/* Popover */}
      {isHovered && hasMore && popoverPosition && (
        <div
          className="fixed z-[100] bg-white rounded-xl shadow-xl border border-gray-200 p-4"
          style={{
            top: popoverPosition.top !== undefined ? `${popoverPosition.top}px` : undefined,
            bottom: popoverPosition.bottom !== undefined ? `${popoverPosition.bottom}px` : undefined,
            left: `${popoverPosition.left}px`,
            width: `${popoverPosition.width}px`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="text-xs font-semibold text-gray-700 mb-3">
            All Specialties ({specialties.length})
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
            {specialties.map((specialty, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-md font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
