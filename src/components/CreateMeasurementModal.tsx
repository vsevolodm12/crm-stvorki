import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { DatePicker } from './DatePicker';

interface Measurer {
  id: number;
  name: string;
}

interface CreateMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  measurers: Measurer[];
  initialData?: {
    id: number;
    date: string;
    time: string;
    client: string;
    phone: string;
    measurer: string;
    address: string;
  };
  onSubmit: (measurement: {
    date: string;
    time: string;
    client: string;
    phone: string;
    measurerId: number;
    address: string;
  }) => void;
}

export const CreateMeasurementModal = ({
  isOpen,
  onClose,
  selectedDate = '',
  measurers,
  initialData,
  onSubmit,
}: CreateMeasurementModalProps) => {
  const [date, setDate] = useState(initialData?.date || selectedDate);
  const [time, setTime] = useState(initialData?.time || '');
  const [client, setClient] = useState(initialData?.client || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [measurerId, setMeasurerId] = useState<number>(() => {
    if (initialData?.measurer) {
      const measurer = measurers.find(m => m.name === initialData.measurer);
      return measurer?.id || measurers[0]?.id || 0;
    }
    return measurers[0]?.id || 0;
  });
  const [address, setAddress] = useState(initialData?.address || '');

  // Обновляем данные когда initialData или selectedDate меняются
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDate(initialData.date);
        setTime(initialData.time);
        setClient(initialData.client);
        setPhone(initialData.phone);
        setAddress(initialData.address);
        const measurer = measurers.find(m => m.name === initialData.measurer);
        setMeasurerId(measurer?.id || measurers[0]?.id || 0);
      } else if (selectedDate) {
        setDate(selectedDate);
      }
    }
  }, [isOpen, selectedDate, initialData, measurers]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen && !initialData) {
      setDate('');
      setTime('');
      setClient('');
      setPhone('');
      setMeasurerId(measurers[0]?.id || 0);
      setAddress('');
    }
  }, [isOpen, measurers, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      time,
      client,
      phone,
      measurerId,
      address,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Редактировать замер' : 'Добавить замер'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <DatePicker
            label="Дата замера"
            value={date}
            onChange={setDate}
            required
          />

          <Input
            label="Время"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <Input
            label="Имя клиента"
            value={client}
            onChange={(e) => setClient(e.target.value)}
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
              Замерщик
            </label>
            <select
              value={measurerId}
              onChange={(e) => setMeasurerId(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              required
            >
              {measurers.map((measurer) => (
                <option key={measurer.id} value={measurer.id}>
                  {measurer.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="ул. Ленина, д. 10, кв. 5"
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
              {initialData ? 'Сохранить изменения' : 'Создать замер'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

