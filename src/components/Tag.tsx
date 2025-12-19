import { X } from 'lucide-react';

export type TagType = 
  | 'return-later'
  | 'refusal'
  | 'non-target'
  | 'measurement'
  | 'non-standard'
  | 'no-phone'
  | 'for-manager';

interface TagProps {
  type: TagType;
  count?: number;
  onRemove?: () => void;
  className?: string;
}

const tagConfig: Record<TagType, { label: string }> = {
  'return-later': {
    label: 'Вернуться позже',
  },
  'refusal': {
    label: 'Отказ',
  },
  'non-target': {
    label: 'Нецелевой',
  },
  'measurement': {
    label: 'Замер',
  },
  'non-standard': {
    label: 'Нестандарт',
  },
  'no-phone': {
    label: 'Не дал телефон',
  },
  'for-manager': {
    label: 'Для руководителя',
  },
};

export const Tag = ({ type, count, onRemove, className = '' }: TagProps) => {
  const config = tagConfig[type];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
    >
      <span className="text-sm font-medium">{config.label}</span>
      {count !== undefined && (
        <span className="text-xs font-semibold text-gray-500">({count})</span>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>
      )}
    </div>
  );
};

