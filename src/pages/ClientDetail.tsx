import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { MessageInput } from '../components/MessageInput';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { ArrowLeft, Phone, Plus, Bot, User, ExternalLink, Copy, Check, CheckSquare2, Calendar, CheckCircle2 } from 'lucide-react';
import { CreateAppealModal } from '../components/CreateAppealModal';

export const ClientDetail = () => {
  const { id } = useParams();
  const [isBotMode, setIsBotMode] = useState(true);
  const [contextMessage, setContextMessage] = useState('');
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'context' | 'tasks'>('context');
  const [completedTasks, setCompletedTasks] = useState<number[]>([3]); // Задача с id 3 уже выполнена

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

  const contextMessages = [
    {
      id: 1,
      text: `Обращение #45 - 15.01.2025

Клиент интересуется пластиковыми окнами для двухкомнатной квартиры. Предложен бесплатный замер. Ожидает обратной связи.

Предпочтения: Пластиковые окна`,
      date: '15.01.2025',
    },
    {
      id: 2,
      text: `Обращение #32 - 10.12.2024

Клиент консультировался по остеклению балкона. Выбрал вариант с раздвижными створками. Заказ выполнен.

Предпочтения: Раздвижные створки для балкона`,
      date: '10.12.2024',
    },
    {
      id: 3,
      text: `Обращение #18 - 05.11.2024

Обращение по ремонту окна. Заменена фурнитура. Клиент доволен результатом.

Статус: Активный клиент, доволен качеством услуг`,
      date: '05.11.2024',
    },
  ];

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
    console.log('Добавлен контекст:', message, attachments);
    setContextMessage('');
    // Здесь будет логика сохранения контекста
  };

  const handleCompleteTask = (taskId: number) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const isTaskCompleted = (taskId: number) => completedTasks.includes(taskId);

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-start gap-4">
        <Link to="/clients" className="flex items-center">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{client.phone}</span>
            <button
              onClick={handleCopyPhone}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
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
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Новый клиент
        </Button>
      </div>

      {/* Тумблер и ссылки на переписки */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {isBotMode ? (
                <>
                  <Bot className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Бот ведет переписку
                  </span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Оператор ведет переписку
                  </span>
                </>
              )}
            </div>
            <Toggle
              checked={isBotMode}
              onChange={setIsBotMode}
              label={isBotMode ? 'Бот' : 'Оператор'}
            />
          </div>
          <div className="flex items-center gap-3">
            <a
              href={client.conversationLinks.avito}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
            >
              <span className="w-5 h-5 rounded bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xs">А</span>
              </span>
              Авито
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <a
              href={client.conversationLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
            >
              <span className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xs">W</span>
              </span>
              WhatsApp
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <a
              href={client.conversationLinks.max}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
            >
              <span className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">М</span>
              </span>
              МАХ
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>
        </div>
      </Card>

      {/* Контекст переписки / Задачи */}
      <Card className="flex flex-col h-[600px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('context')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'context'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Контекст переписки
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CheckSquare2 className="w-4 h-4" />
              Задачи
            </button>
          </div>
          {activeTab === 'context' && <Badge variant="info">Автоматически</Badge>}
          {activeTab === 'tasks' && (
            <Button size="sm" onClick={() => setIsTaskModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать задачу
            </Button>
          )}
        </div>

        {activeTab === 'context' ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Контекст как сообщения - каждое обращение отдельно */}
              {contextMessages.map((msg) => (
                <div key={msg.id} className="flex justify-start">
                  <div className="max-w-[80%] bg-primary-600 text-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                    {msg.date && (
                      <div className="text-xs text-primary-100 mt-2 opacity-80">
                        {msg.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <MessageInput
              value={contextMessage}
              onChange={setContextMessage}
              onSubmit={handleContextSubmit}
              placeholder="Добавить информацию в контекст для бота..."
            />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {clientTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Нет задач для этого клиента
              </div>
            ) : (
              clientTasks.map((task) => {
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
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        {completed ? 'Отменить' : 'Выполнить'}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Card>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        clients={clients}
        clientName={client.name}
        clientId={Number(id)}
        onSubmit={(task) => {
          console.log('Создана задача:', task);
          // Здесь будет логика создания задачи
        }}
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

