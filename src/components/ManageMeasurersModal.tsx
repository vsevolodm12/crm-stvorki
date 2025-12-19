import { useState } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface Measurer {
  id: number;
  name: string;
  phone: string;
}

interface ManageMeasurersModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurers: Measurer[];
  onEdit: (id: number, name: string, phone: string) => void;
  onDelete: (id: number) => void;
}

export const ManageMeasurersModal = ({
  isOpen,
  onClose,
  measurers,
  onEdit,
  onDelete,
}: ManageMeasurersModalProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (measurer: Measurer) => {
    setEditingId(measurer.id);
    setEditName(measurer.name);
    setEditPhone(measurer.phone);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onEdit(editingId, editName, editPhone);
      setEditingId(null);
      setEditName('');
      setEditPhone('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPhone('');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого замерщика?')) {
      onDelete(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Управление замерщиками</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {measurers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Нет замерщиков
            </p>
          ) : (
            <div className="space-y-3">
              {measurers.map((measurer) => (
                <div
                  key={measurer.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  {editingId === measurer.id ? (
                    <div className="space-y-3">
                      <Input
                        label="Имя замерщика"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                      <Input
                        label="Номер телефона"
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        required
                        placeholder="+7 (999) 123-45-67"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={!editName.trim() || !editPhone.trim()}
                        >
                          Сохранить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{measurer.name}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{measurer.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(measurer)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(measurer.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

