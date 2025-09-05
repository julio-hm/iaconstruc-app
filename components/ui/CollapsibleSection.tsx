
import React, { useState, ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transform transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="md:col-span-2 border border-white/10 rounded-lg bg-white/5">
      <button
        type="button"
        className="w-full flex justify-between items-center p-3 text-base font-medium text-gray-100 hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-white/10">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
