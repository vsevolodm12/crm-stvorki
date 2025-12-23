import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Measurer {
  id: number;
  name: string;
  phone: string;
}

interface MeasurerDropdownProps {
  measurers: Measurer[];
  selectedMeasurer: number | 'all';
  onSelect: (id: number | 'all') => void;
}

export const MeasurerDropdown = ({
  measurers,
  selectedMeasurer,
  onSelect,
}: MeasurerDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedName = selectedMeasurer === 'all' 
    ? 'Все замерщики' 
    : measurers.find(m => m.id === selectedMeasurer)?.name || 'Выбрать замерщика';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-900"
      >
        <span>{selectedName}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              onSelect('all');
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
              selectedMeasurer === 'all' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
            }`}
          >
            Все замерщики
          </button>
          {measurers.map((measurer) => (
            <button
              key={measurer.id}
              onClick={() => {
                onSelect(measurer.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                selectedMeasurer === measurer.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
              }`}
            >
              {measurer.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


