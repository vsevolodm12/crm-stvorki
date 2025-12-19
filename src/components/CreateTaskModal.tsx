import { useState } from 'react';
import { X, Bot, User } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { DatePicker } from './DatePicker';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  appealId?: number;
  appealTitle?: string;
  clientName?: string;
  onSubmit: (task: {
    title: string;
    description: string;
    type: 'bot' | 'manual';
    dueDate: string;
  }) => void;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  appealId,
  appealTitle,
  clientName,
  onSubmit,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'bot' | 'manual'>('manual');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      type,
      dueDate,
    });
    // Сброс формы
    setTitle('');
    setDescription('');
    setType('manual');
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Создать задачу</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {appealId && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Обращение:</span> {appealTitle || `#${appealId}`}
              </p>
              {clientName && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Клиент:</span> {clientName}
                </p>
              )}
            </div>
          )}

          <Input
            label="Название задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Например: Написать клиенту через 3 месяца"
          />

          <Textarea
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Опишите задачу..."
            className="min-h-[100px]"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Тип задачи
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('manual')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  type === 'manual'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Ручная</span>
              </button>
              <button
                type="button"
                onClick={() => setType('bot')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  type === 'bot'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Bot className="w-5 h-5" />
                <span className="font-medium">Бот</span>
              </button>
            </div>
          </div>

          <DatePicker
            label="Срок выполнения"
            value={dueDate}
            onChange={setDueDate}
            required
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
              Создать задачу
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

