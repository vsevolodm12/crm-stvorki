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

interface ViewSingleMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurement: Measurement | null;
  measurers: Measurer[];
  onEdit: (id: number, measurement: Partial<Measurement>) => void;
  onDelete: (id: number) => void;
}

export const ViewSingleMeasurementModal = ({
  isOpen,
  onClose,
  measurement,
  measurers,
  onEdit,
  onDelete,
}: ViewSingleMeasurementModalProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen || !measurement) return null;

  const formattedDate = new Date(measurement.date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот замер?')) {
      onDelete(measurement.id);
      onClose();
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
    const measurer = measurers.find(m => m.id === data.measurerId);
    onEdit(measurement.id, {
      date: data.date,
      time: data.time,
      client: data.client,
      phone: data.phone,
      measurer: measurer?.name || '',
      address: data.address,
    });
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Замер от {formattedDate}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Редактировать"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Удалить"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 text-xl sm:text-2xl mb-2">
                  {measurement.client}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                  Замерщик: {measurement.measurer}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-base text-gray-700">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="font-medium">Время:</span>
                    <span className="ml-2">{measurement.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-base text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="font-medium">Телефон:</span>
                    <a
                      href={`tel:${measurement.phone}`}
                      className="ml-2 text-primary-600 hover:text-primary-700"
                    >
                      {measurement.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-base text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <span className="font-medium">Адрес:</span>
                    <span className="ml-2">{measurement.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {measurement && (
        <CreateMeasurementModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          selectedDate={measurement.date}
          measurers={measurers}
          initialData={measurement}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};

