import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { TagDropdown } from './TagDropdown';
import type { TagType } from './Tag';

interface CreateAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: {
    clientName: string;
    phone: string;
    notes?: string;
    tags: TagType[];
  }) => void;
}

export const CreateAppealModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateAppealModalProps) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<TagType[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientName,
      phone,
      notes,
      tags,
    });
    // Сброс формы
    setClientName('');
    setPhone('');
    setNotes('');
    setTags([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Новый клиент</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <Input
            label="Имя клиента"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            placeholder="Введите имя клиента"
          />

          <Input
            label="Номер телефона"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+7 (999) 123-45-67"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Теги
            </label>
            <TagDropdown
              selectedTags={tags}
              onTagsChange={setTags}
            />
          </div>

          <Textarea
            label="Заметки (необязательно)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Дополнительная информация..."
            className="min-h-[100px]"
          />

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Создать клиента
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

