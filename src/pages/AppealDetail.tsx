import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { ArrowLeft, Phone, Bot, User, Plus, Calendar, FileText, ExternalLink, MessageCircle } from 'lucide-react';

export const AppealDetail = () => {
  const { id } = useParams();
  const [isBotActive, setIsBotActive] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Заглушка данных
  const appeal = {
    id: id,
    client: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    status: 'active',
    isBot: true,
    conversationLinks: {
      avito: 'https://www.avito.ru/messages/12345',
      whatsapp: 'https://wa.me/79991234567',
      max: 'https://max.telegram.org/chat/12345',
    },
  };

  const tasks = [
    {
      id: 1,
      title: 'Написать клиенту через 3 месяца',
      description: 'Уточнить, как прошла установка, есть ли вопросы',
      dueDate: '15.04.2025',
      type: 'bot',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Отправить коммерческое предложение',
      description: 'Подготовить КП с учетом замера',
      dueDate: '16.01.2025',
      type: 'manual',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center gap-4">
        <Link to="/appeals">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Обращение #{appeal.id}
          </h1>
          <p className="text-gray-600 mt-1">{appeal.client}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная переписка */}
        <div className="lg:col-span-2 space-y-6">
          {/* Информация о клиенте и переключатель */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {appeal.client}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{appeal.phone}</span>
                  </div>
                </div>
                <Badge variant="success">Активно</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {isBotActive ? (
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
                checked={isBotActive}
                onChange={setIsBotActive}
                label={isBotActive ? 'Бот' : 'Оператор'}
              />
            </div>
          </Card>

          {/* Ссылки на переписку */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Переписка
              </h2>
            </div>
            <div className="space-y-3">
              <a
                href={appeal.conversationLinks.avito}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">А</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Авито</p>
                    <p className="text-sm text-gray-500">Перейти к переписке</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
              </a>

              <a
                href={appeal.conversationLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">W</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-500">Открыть чат</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
              </a>

              <a
                href={appeal.conversationLinks.max}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">М</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">МАХ</p>
                    <p className="text-sm text-gray-500">Перейти к диалогу</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </a>
            </div>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Задачи */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Задачи</h2>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm text-gray-900">
                      {task.title}
                    </p>
                    {task.type === 'bot' && (
                      <Badge variant="info" className="text-xs">
                        Бот
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              size="sm"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать задачу
            </Button>
          </Card>

          {/* Контекст */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Контекст</h2>
              <Button variant="ghost" size="sm">
                <FileText className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Интересует:</span> Пластиковые
                окна для двухкомнатной квартиры
              </p>
              <p>
                <span className="font-medium">Статус:</span> Ожидает замера
              </p>
              <p>
                <span className="font-medium">Источник:</span> Сайт
              </p>
            </div>
          </Card>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        appealId={Number(id)}
        appealTitle={`Обращение #${id}`}
        clientName={appeal.client}
        onSubmit={(task) => {
          console.log('Создана задача:', task);
          // Здесь будет логика создания задачи
        }}
      />
    </div>
  );
};

