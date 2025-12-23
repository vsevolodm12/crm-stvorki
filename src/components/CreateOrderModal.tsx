import { useEffect, useMemo, useState } from 'react';
import { X, Minus } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { DatePicker } from './DatePicker';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (order: { amount: number; cost: number; payDate: string }) => void;
}

export const CreateOrderModal = ({ isOpen, onClose, onSubmit }: CreateOrderModalProps) => {
  const [amount, setAmount] = useState('');
  const [cost, setCost] = useState('');
  const [payDate, setPayDate] = useState('');

  const formatNumberInput = (value: string) => {
    const normalized = value.replace(/\s+/g, '').replace(',', '.');
    if (!normalized) return '';
    const [intPartRaw, fracRaw] = normalized.split('.');
    const intPartNum = Number(intPartRaw);
    if (Number.isNaN(intPartNum)) return '';
    const formattedInt = intPartNum
      .toLocaleString('ru-RU')
      .replace(/\u00A0/g, ' ');
    if (fracRaw !== undefined) {
      const cleanedFrac = fracRaw.replace(/\D/g, '').slice(0, 2);
      return cleanedFrac ? `${formattedInt}.${cleanedFrac}` : formattedInt;
    }
    return formattedInt;
  };

  const parseNumber = (value: string) => {
    if (!value) return NaN;
    const normalized = value.replace(/\s+/g, '').replace(',', '.');
    return Number(normalized);
  };

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      setPayDate(formatted);
    } else {
      setAmount('');
      setCost('');
      setPayDate('');
    }
  }, [isOpen]);

  const margin = useMemo(() => {
    const parsedAmount = parseNumber(amount);
    const parsedCost = parseNumber(cost);
    if (isNaN(parsedAmount) || isNaN(parsedCost)) return '';
    const value = parsedAmount - parsedCost;
    return formatNumberInput(value.toFixed(2));
  }, [amount, cost]);

  const marginPercent = useMemo(() => {
    const parsedAmount = parseNumber(amount);
    const parsedCost = parseNumber(cost);
    if (isNaN(parsedAmount) || isNaN(parsedCost) || parsedCost === 0) return '';
    const percent = ((parsedAmount - parsedCost) / parsedCost) * 100;
    return `${percent.toFixed(1)}%`;
  }, [amount, cost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseNumber(amount);
    const parsedCost = parseNumber(cost);
    if (isNaN(parsedAmount) || isNaN(parsedCost) || !payDate) {
      return;
    }
    onSubmit?.({ amount: parsedAmount, cost: parsedCost, payDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-visible border border-gray-100">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Создать заказ</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <Input
            label="Сумма (₽)"
            value={amount}
            type="text"
            inputMode="decimal"
            onChange={(e) => setAmount(formatNumberInput(e.target.value))}
            placeholder="0.00"
            className="bg-gray-50 border-gray-200"
            required
          />

          <Input
            label="Себестоимость (₽)"
            value={cost}
            type="text"
            inputMode="decimal"
            onChange={(e) => setCost(formatNumberInput(e.target.value))}
            placeholder="0.00"
            className="bg-gray-50 border-gray-200"
            required
          />

          <DatePicker
            label="Дата оплаты"
            value={payDate}
            onChange={setPayDate}
            className="bg-white"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Наценка:
            </label>
            <div className="flex items-stretch gap-3">
              <div className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 font-semibold text-base flex items-center justify-between">
                <span>Наценка</span>
                <span>{margin || '0.00'}</span>
              </div>
              <div className="px-4 py-3 bg-primary-50 text-primary-700 border border-primary-100 rounded-lg text-base font-semibold min-w-[110px] text-center flex items-center justify-center">
                {marginPercent || '0%'}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-1">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!amount || !cost || !payDate}
            >
              Создать заказ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

