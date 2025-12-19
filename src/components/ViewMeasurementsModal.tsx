import { useState } from 'react';
import { X, Phone, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { CreateMeasurementModal } from './CreateMeasurementModal';

interface Measurement {
  id: number;
  date: string;
  time: string;
  client: string;
  phone: string;
  measurer: string;
  address: string;
}

interface Measurer {
  id: number;
  name: string;
  phone: string;
}

interface ViewMeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  measurements: Measurement[];
  measurers: Measurer[];
  onEdit: (id: number, measurement: Partial<Measurement>) => void;
  onDelete: (id: number) => void;
}

export const ViewMeasurementsModal = ({
  isOpen,
  onClose,
  date,
  measurements,
  measurers,
  onEdit,
  onDelete,
}: ViewMeasurementsModalProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen) return null;

  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleEdit = (measurement: Measurement) => {
    setEditingId(measurement.id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот замер?')) {
      onDelete(id);
    }
  };

  const handleEditSubmit = (data: {
    date: string;
    time: string;
    client: string;
    phone: string;
    measurerId: number;
    address: string;
  }) => {
    if (editingId) {
      const measurer = measurers.find(m => m.id === data.measurerId);
      onEdit(editingId, {
        date: data.date,
        time: data.time,
        client: data.client,
        phone: data.phone,
        measurer: measurer?.name || '',
        address: data.address,
      });
      setEditingId(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Замеры на {formattedDate}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {measurements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              На эту дату замеров не запланировано
            </p>
          ) : (
            <div className="space-y-4">
              {measurements.map((measurement) => (
                <div
                  key={measurement.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {measurement.client}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mt-1">
                        Замерщик: {measurement.measurer}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(measurement)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(measurement.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Время:</span>
                      <span>{measurement.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Телефон:</span>
                      <a
                        href={`tel:${measurement.phone}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {measurement.phone}
                      </a>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="font-medium">Адрес:</span>
                      <span>{measurement.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingId && (
        <CreateMeasurementModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          selectedDate={date}
          measurers={measurers}
          initialData={measurements.find(m => m.id === editingId)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

