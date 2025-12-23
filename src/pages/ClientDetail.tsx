import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { MessageInput } from '../components/MessageInput';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { ArrowLeft, Phone, Plus, Bot, User, ExternalLink, Copy, Check, CheckSquare2, Calendar, CheckCircle2, ChevronLeft, ChevronRight, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { CreateAppealModal } from '../components/CreateAppealModal';
import { CreateOrderModal } from '../components/CreateOrderModal';

export const ClientDetail = () => {
  const { id } = useParams();
  const [isBotMode, setIsBotMode] = useState(true);
  const [contextMessage, setContextMessage] = useState('');
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'context' | 'tasks' | 'orders'>('context');
  const [completedTasks, setCompletedTasks] = useState<number[]>([3]); // Задача с id 3 уже выполнена
  const [orders, setOrders] = useState<Array<{
    id: number;
    amount: number;
    cost: number;
    payDate: string;
    createdAt: string;
  }>>([]);
  const [tasksCalendarMonth, setTasksCalendarMonth] = useState(new Date().getMonth());
  const [tasksCalendarYear, setTasksCalendarYear] = useState(new Date().getFullYear());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [contextMessages, setContextMessages] = useState<Array<{
    id: number;
    text: string;
    date: string;
    type: 'summary' | 'manager';
  }>>([
    {
      id: 1,
      type: 'summary',
      text: `Сводка диалога:

1) Клиент заказал окна: 1300×1400 — 3 шт и 800×1200 — 2 шт.  

2) Приняты стандартные варианты: для 1300×1400 — 2 створки (1 — глухая слева; 2 — поворотно-откидная, открывается вправо); для 800×1200 — 1 створка, глухая. Профиль указан: 70.  

3) Контактный телефон для отправки спецификации в WhatsApp не предоставлен (ассистент предлагал пример +79991234567).

Изделие 1:
- Профиль: 70
- Стеклопакет: 4-16-4
- Фурнитура: Fornax
- Цвет (внутри/снаружи): Белый/Белый
- Размеры: 1300 × 1400 мм (3 шт)
- Количество створок: 2 створки (1 — глухая; 2 — поворотно-откидная, открывается вправо)
- Москитная сетка: нет

Изделие 2:
- Профиль: 70
- Стеклопакет: 4-16-4
- Фурнитура: Fornax
- Цвет (внутри/снаружи): Белый/Белый
- Размеры: 800 × 1200 мм (2 шт)
- Количество створок: 1 створка (1 — глухая)
- Москитная сетка: нет`,
      date: '15.01.2025',
    },
    {
      id: 2,
      type: 'manager',
      text: `Клиенту дорого, смотрит у других. Просит написать через неделю.`,
      date: '16.01.2025',
    },
  ]);

  const clientTasks = [
    {
      id: 1,
      title: 'Написать клиенту через 3 месяца',
      description: 'Уточнить, как прошла установка, есть ли вопросы',
      dueDate: '15.04.2025',
      type: 'bot' as const,
      status: 'pending' as const,
    },
    {
      id: 2,
      title: 'Отправить коммерческое предложение',
      description: 'Подготовить КП с учетом замера',
      dueDate: '16.01.2025',
      type: 'manual' as const,
      status: 'pending' as const,
    },
    {
      id: 3,
      title: 'Проверить замер',
      description: 'Связаться с замерщиком',
      dueDate: '10.01.2025',
      type: 'manual' as const,
      status: 'completed' as const,
    },
  ];

  const clients = [
    { id: 1, name: 'Иван Петров', phone: '+7 (999) 123-45-67' },
    { id: 2, name: 'Мария Сидорова', phone: '+7 (999) 234-56-78' },
    { id: 3, name: 'Алексей Козлов', phone: '+7 (999) 345-67-89' },
    { id: 4, name: 'Елена Волкова', phone: '+7 (999) 456-78-90' },
    { id: 5, name: 'Дмитрий Соколов', phone: '+7 (999) 567-89-01' },
  ];

  // Заглушка данных
  const client = {
    id: id,
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    status: 'active',
    conversationLinks: {
      avito: 'https://www.avito.ru/messages/12345',
      whatsapp: 'https://wa.me/79991234567',
      max: 'https://max.telegram.org/chat/12345',
    },
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(client.phone);
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2000);
    } catch (err) {
      console.error('Не удалось скопировать номер', err);
    }
  };

  const handleContextSubmit = (message: string, attachments?: File[]) => {
    if (message.trim()) {
      const newMessage = {
        id: contextMessages.length + 1,
        text: message.trim(),
        date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        type: 'manager' as const,
      };
      setContextMessages([...contextMessages, newMessage]);
      setContextMessage('');
    }
  };

  // Автоматическая прокрутка вниз при добавлении сообщения или открытии вкладки контекста
  useEffect(() => {
    if (activeTab === 'context' && messagesContainerRef.current) {
      // Небольшая задержка для того, чтобы DOM обновился
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [contextMessages, activeTab]);

  const handleCompleteTask = (taskId: number) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const handleEditTask = (taskId: number) => {
    setEditingTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      // Здесь будет логика удаления задачи
      console.log('Удалена задача:', taskId);
    }
  };

  const handleCreateOrUpdateTask = (taskData: {
    title: string;
    description: string;
    type: 'bot' | 'manual';
    dueDate: string;
    clientId: number;
  }) => {
    if (editingTaskId !== null) {
      // Редактирование существующей задачи
      console.log('Обновлена задача:', editingTaskId, taskData);
      setEditingTaskId(null);
    } else {
      // Создание новой задачи
      console.log('Создана задача:', taskData);
    }
    setIsTaskModalOpen(false);
  };

  const handleCreateOrder = (order: { amount: number; cost: number; payDate: string }) => {
    if (editingOrderId !== null) {
      // Редактирование существующего заказа
      setOrders(orders.map(o => 
        o.id === editingOrderId 
          ? { ...o, ...order }
          : o
      ));
      setEditingOrderId(null);
    } else {
      // Создание нового заказа
      const newOrder = {
        id: orders.length + 1,
        ...order,
        createdAt: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
    }
    setIsOrderModalOpen(false);
  };

  const handleEditOrder = (orderId: number) => {
    setEditingOrderId(orderId);
    setIsOrderModalOpen(true);
  };

  const handleDeleteOrder = (orderId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const isTaskCompleted = (taskId: number) => completedTasks.includes(taskId);

  // Функции для работы с датами и группировки задач
  const parseDate = (dateStr: string): Date | null => {
    // Формат: DD.MM.YYYY
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const formatDateLabel = (dateStr: string): string => {
    const date = parseDate(dateStr);
    if (!date) return dateStr;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      return 'Сегодня';
    } else if (taskDate.getTime() === yesterday.getTime()) {
      return 'Вчера';
    } else {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}.${month}.${year}`;
    }
  };

  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: typeof clientTasks } = {};
    
    clientTasks.forEach(task => {
      const dateKey = task.dueDate;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });

    // Сортируем группы по дате (от ближайших к дальним)
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const dateA = parseDate(a);
      const dateB = parseDate(b);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });

    return sortedKeys.map(key => ({
      date: key,
      label: formatDateLabel(key),
      tasks: groups[key],
    }));
  }, [clientTasks]);

  // Функции для календаря задач
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    // month от 0 до 11 (0 = январь, 11 = декабрь)
    // Создаем дату в локальном времени для правильной работы с часовыми поясами
    const firstDay = new Date(year, month, 1, 12, 0, 0).getDay();
    // Преобразуем: Вс(0)->6, Пн(1)->0, Вт(2)->1, ..., Сб(6)->5
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const getTasksForDate = (day: number, month: number, year: number) => {
    const dateStr = `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
    return clientTasks.filter(task => task.dueDate === dateStr);
  };

  const prevTasksMonth = () => {
    if (tasksCalendarMonth === 0) {
      setTasksCalendarMonth(11);
      setTasksCalendarYear(tasksCalendarYear - 1);
    } else {
      setTasksCalendarMonth(tasksCalendarMonth - 1);
    }
  };

  const nextTasksMonth = () => {
    if (tasksCalendarMonth === 11) {
      setTasksCalendarMonth(0);
      setTasksCalendarYear(tasksCalendarYear + 1);
    } else {
      setTasksCalendarMonth(tasksCalendarMonth + 1);
    }
  };

  const tasksDaysInMonth = getDaysInMonth(tasksCalendarMonth, tasksCalendarYear);
  const tasksFirstDay = getFirstDayOfMonth(tasksCalendarMonth, tasksCalendarYear);
  const tasksDays = [];
  for (let i = 0; i < tasksFirstDay; i++) {
    tasksDays.push(null);
  }
  for (let day = 1; day <= tasksDaysInMonth; day++) {
    tasksDays.push(day);
  }

  // Добавляем пустые ячейки в конце, чтобы заполнить сетку до 42 ячеек (6 недель)
  const totalCells = 42; // 7 дней * 6 недель
  const remainingCells = Math.max(0, totalCells - tasksDays.length);
  for (let i = 0; i < remainingCells; i++) {
    tasksDays.push(null);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <Link to="/clients" className="flex items-center self-start">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{client.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm sm:text-base text-gray-600 break-all">{client.phone}</span>
            <button
              onClick={handleCopyPhone}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
              title="Скопировать номер"
            >
              {phoneCopied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Новый клиент</span>
          <span className="sm:hidden">Новый</span>
        </Button>
      </div>

      {/* Тумблер и ссылки на переписки */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBotMode(!isBotMode)}
              className={`w-12 h-12 p-0 flex-shrink-0 border-gray-300 ${
                isBotMode ? 'bg-primary-600 hover:bg-primary-700' : 'bg-white hover:bg-gray-100'
              }`}
              title={isBotMode ? 'Сменить на оператора' : 'Сменить на бота'}
            >
              {isBotMode ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-black" />
              )}
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              {isBotMode ? (
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  Бот ведет переписку
                </span>
              ) : (
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  Оператор ведет переписку
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <a
              href={client.conversationLinks.avito}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">А</span>
              </span>
              <span className="hidden sm:inline">Авито</span>
              <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </a>
            <a
              href={client.conversationLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="w-5 h-5 rounded bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">W</span>
              </span>
              <span className="hidden sm:inline">WhatsApp</span>
              <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </a>
            <a
              href={client.conversationLinks.max}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">М</span>
              </span>
              <span className="hidden sm:inline">МАХ</span>
              <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </a>
          </div>
        </div>
      </Card>

      {/* Контекст переписки / Задачи */}
      <Card className="flex flex-col h-[600px] sm:h-[700px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <button
              onClick={() => setActiveTab('context')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base flex-1 sm:flex-initial ${
                activeTab === 'context'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="hidden sm:inline">Контекст переписки</span>
              <span className="sm:hidden">Контекст</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-initial justify-center ${
                activeTab === 'tasks'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CheckSquare2 className="w-4 h-4" />
              <span>Задачи</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-initial justify-center ${
                activeTab === 'orders'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Заказы</span>
            </button>
          </div>
          <div className="flex items-center justify-end gap-2">
            {activeTab === 'context' && (
              <Button
                size="sm"
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать заказ
              </Button>
            )}
            {activeTab === 'tasks' && (
              <Button size="sm" onClick={() => setIsTaskModalOpen(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Создать задачу</span>
                <span className="sm:hidden">Создать</span>
              </Button>
            )}
            {activeTab === 'orders' && (
              <Button size="sm" onClick={() => setIsOrderModalOpen(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Создать заказ</span>
                <span className="sm:hidden">Создать</span>
              </Button>
            )}
          </div>
        </div>

        {activeTab === 'context' ? (
          <>
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {/* Контекст как сообщения - каждое обращение отдельно */}
              {contextMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'manager' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.type === 'manager' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                    {msg.date && (
                      <div className={`text-xs mt-2 ${
                        msg.type === 'manager' 
                          ? 'text-primary-100 opacity-80' 
                          : 'text-gray-900 opacity-70'
                      }`}>
                        {msg.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <MessageInput
              value={contextMessage}
              onChange={setContextMessage}
              onSubmit={handleContextSubmit}
              placeholder="Добавить информацию в контекст для бота..."
            />
          </>
        ) : activeTab === 'tasks' ? (
          <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {groupedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Нет задач для этого клиента
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedTasks.map((group) => (
                    <div key={group.date}>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        {group.label}:
                      </h3>
                      <div className="space-y-3">
                        {group.tasks.map((task) => {
                          const completed = isTaskCompleted(task.id) || task.status === 'completed';
                          return (
                            <div
                              key={task.id}
                              className={`p-4 border border-gray-200 rounded-lg ${
                                completed ? 'opacity-70 bg-gray-50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <button
                                      onClick={() => handleCompleteTask(task.id)}
                                      className="flex-shrink-0"
                                      title={completed ? 'Отменить выполнение' : 'Выполнить задачу'}
                                    >
                                      {completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                      ) : (
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-primary-500 transition-colors cursor-pointer"></div>
                                      )}
                                    </button>
                                    <h3 className={`font-semibold ${completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                      {task.title}
                                    </h3>
                                    {task.type === 'bot' ? (
                                      <Badge variant="info" className="flex items-center gap-1">
                                        <Bot className="w-3 h-3" />
                                        Бот
                                      </Badge>
                                    ) : (
                                      <Badge variant="default" className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        Ручная
                                      </Badge>
                                    )}
                                  </div>
                                  <p className={`text-sm mb-2 ${completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                    {task.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <button
                                    onClick={() => handleEditTask(task.id)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Редактировать задачу"
                                  >
                                    <Edit className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Удалить задачу"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCompleteTask(task.id)}
                                  >
                                    {completed ? 'Отменить' : 'Выполнить'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Нет заказов для этого клиента
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const margin = order.amount - order.cost;
                  const marginPercent = order.cost > 0 ? ((margin / order.cost) * 100).toFixed(1) : '0';
                  const formatNumber = (num: number) => {
                    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                  };
                  const formatDate = (dateStr: string) => {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  };
                  const formatPayDate = (dateStr: string) => {
                    // Формат YYYY-MM-DD
                    const [year, month, day] = dateStr.split('-');
                    return `${day}.${month}.${year}`;
                  };
                  
                  return (
                    <div
                      key={order.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Заказ #{order.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Создан: {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditOrder(order.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Редактировать заказ"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Удалить заказ"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Сумма</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatNumber(order.amount)} ₽
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Себестоимость</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatNumber(order.cost)} ₽
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Наценка</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatNumber(margin)} ₽
                          </p>
                          <p className="text-lg font-semibold text-gray-500 opacity-60">
                            {marginPercent}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTaskId(null);
        }}
        clients={clients}
        clientName={client.name}
        clientId={Number(id)}
        task={editingTaskId !== null ? {
          ...clientTasks.find(t => t.id === editingTaskId)!,
          clientId: Number(id),
        } : undefined}
        onSubmit={handleCreateOrUpdateTask}
      />

      <CreateOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setEditingOrderId(null);
        }}
        onSubmit={handleCreateOrder}
        order={editingOrderId !== null ? orders.find(o => o.id === editingOrderId) : undefined}
      />


      <CreateAppealModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(client) => {
          console.log('Создан клиент:', client);
          // Здесь будет логика создания клиента
        }}
      />
    </div>
  );
};

