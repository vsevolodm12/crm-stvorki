import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Tag as TagIcon } from 'lucide-react';
import { Tag } from './Tag';
import type { TagType } from './Tag';

interface TagDropdownProps {
  selectedTags: TagType[];
  onTagsChange: (tags: TagType[]) => void;
  className?: string;
}

const allTags: TagType[] = [
  'return-later',
  'refusal',
  'non-target',
  'measurement',
  'non-standard',
  'no-phone',
  'for-manager',
];

export const TagDropdown = ({ selectedTags, onTagsChange, className = '' }: TagDropdownProps) => {
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

  const toggleTag = (tag: TagType) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <TagIcon className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">
          {selectedTags.length > 0 ? `${selectedTags.length} тегов` : 'Теги'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 min-w-[280px]">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="cursor-pointer"
              >
                <Tag
                  type={tag}
                  className={selectedTags.includes(tag) ? 'ring-2 ring-primary-500' : ''}
                />
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 mb-1 w-full">Выбрано:</span>
                {selectedTags.map((tag) => (
                  <Tag
                    key={tag}
                    type={tag}
                    onRemove={() => toggleTag(tag)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

