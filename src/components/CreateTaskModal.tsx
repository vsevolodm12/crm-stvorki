import { useState, useEffect } from 'react';
import { X, Bot, User, ChevronDown, Search } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { DatePicker } from './DatePicker';

interface Client {
  id: number;
  name: string;
  phone: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  appealId?: number;
  appealTitle?: string;
  clientName?: string;
  clientId?: number;
  clients?: Client[];
  onSubmit: (task: {
    title: string;
    description: string;
    type: 'bot' | 'manual';
    dueDate: string;
    clientId: number;
  }) => void;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  appealId: _appealId,
  appealTitle: _appealTitle,
  clientName: _clientName,
  clientId,
  clients = [],
  onSubmit,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'bot' | 'manual'>('manual');
  const [dueDate, setDueDate] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  // Автоматически выбираем клиента при открытии модального окна
  useEffect(() => {
    if (isOpen && clientId) {
      setSelectedClientId(clientId);
    } else if (isOpen && !clientId) {
      setSelectedClientId('');
    }
  }, [isOpen, clientId]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setType('manual');
      setDueDate('');
      setSelectedClientId(clientId || '');
      setIsClientDropdownOpen(false);
      setClientSearchQuery('');
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert('Пожалуйста, выберите клиента');
      return;
    }
    onSubmit({
      title,
      description,
      type,
      dueDate,
      clientId: selectedClientId as number,
    });
    onClose();
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Фильтрация клиентов по поисковому запросу
  const filteredClients = clients.filter(client => {
    if (!clientSearchQuery) return true;
    const query = clientSearchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Создать задачу</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Выбор клиента */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Клиент <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsClientDropdownOpen(!isClientDropdownOpen);
                  if (!isClientDropdownOpen) {
                    setClientSearchQuery('');
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-colors ${
                  !selectedClientId ? 'text-gray-400' : 'text-gray-900'
                }`}
              >
                <span>
                  {selectedClient ? `${selectedClient.name} (${selectedClient.phone})` : 'Выберите клиента'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isClientDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => {
                      setIsClientDropdownOpen(false);
                      setClientSearchQuery('');
                    }}
                  />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden flex flex-col">
                    {/* Поле поиска */}
                    <div className="p-2 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={clientSearchQuery}
                          onChange={(e) => setClientSearchQuery(e.target.value)}
                          placeholder="Поиск по имени или телефону..."
                          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {/* Список клиентов */}
                    <div className="overflow-y-auto max-h-60">
                      {filteredClients.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          {clientSearchQuery ? 'Клиенты не найдены' : 'Нет доступных клиентов'}
                        </div>
                      ) : (
                        filteredClients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => {
                              setSelectedClientId(client.id);
                              setIsClientDropdownOpen(false);
                              setClientSearchQuery('');
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                              selectedClientId === client.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {client.name} ({client.phone})
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

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

