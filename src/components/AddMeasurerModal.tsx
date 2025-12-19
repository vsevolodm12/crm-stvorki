import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface AddMeasurerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => void;
}

export const AddMeasurerModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddMeasurerModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, phone);
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Добавить замерщика</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Имя замерщика"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Введите имя замерщика"
          />

          <Input
            label="Номер телефона"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+7 (999) 123-45-67"
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
              Добавить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

