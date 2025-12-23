import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { MessageSquare, CheckSquare, Users, Clock, Phone } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    {
      label: 'Активных обращений',
      value: '12',
      change: '+3',
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      label: 'Задач на неделю',
      value: '8',
      change: '+2',
      icon: CheckSquare,
      color: 'text-green-600',
    },
    {
      label: 'Всего клиентов',
      value: '156',
      change: '+12',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      label: 'Собрано номеров',
      value: '89',
      change: '+15',
      icon: Phone,
      color: 'text-orange-600',
    },
  ];

  const recentAppeals = [
    {
      id: 1,
      client: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      time: '5 мин назад',
      status: 'active',
      isBot: true,
    },
    {
      id: 2,
      client: 'Мария Сидорова',
      phone: '+7 (999) 234-56-78',
      time: '15 мин назад',
      status: 'active',
      isBot: false,
    },
    {
      id: 3,
      client: 'Алексей Козлов',
      phone: '+7 (999) 345-67-89',
      time: 'Вчера',
      status: 'pending',
      isBot: true,
    },
  ];

  const allTasks = [
    {
      id: 1,
      title: 'Написать клиенту через 3 месяца',
      clientName: 'Иван Петров',
      dueDate: '15.01.2025',
      type: 'bot',
    },
    {
      id: 2,
      title: 'Проверить замер',
      clientName: 'Мария Сидорова',
      dueDate: 'Сегодня, 18:00',
      type: 'manual',
    },
    {
      id: 3,
      title: 'Отправить коммерческое предложение',
      clientName: 'Алексей Козлов',
      dueDate: 'Завтра, 10:00',
      type: 'manual',
    },
    {
      id: 4,
      title: 'Связаться с клиентом',
      clientName: 'Елена Волкова',
      dueDate: 'Сегодня, 14:00',
      type: 'bot',
    },
  ];

  // Фильтруем только задачи на сегодня
  const upcomingTasks = allTasks.filter(task => {
    return task.dueDate.toLowerCase().includes('сегодня');
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Главная</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Обзор вашей CRM системы</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="text-green-600">{stat.change}</span> за неделю
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Последние обращения */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Последние клиенты
            </h2>
            <a
              href="/clients"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Все →
            </a>
          </div>
          <div className="space-y-2">
            {recentAppeals.map((appeal) => (
              <Link
                key={appeal.id}
                to={`/clients/${appeal.id}`}
                className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-semibold text-sm">
                      {appeal.client.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 truncate">
                        {appeal.client}
                      </p>
                      {appeal.isBot ? (
                        <Badge variant="info" className="text-xs flex-shrink-0">
                          Бот
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs flex-shrink-0">
                          Оператор
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-0.5">{appeal.phone}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{appeal.time}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Ближайшие задачи */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Ближайшие задачи
            </h2>
            <a
              href="/tasks"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Все →
            </a>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <Link
                key={task.id}
                to="/tasks"
                className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    task.type === 'bot' ? 'bg-primary-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 mb-0.5 line-clamp-1">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-600 mb-0.5">{task.clientName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{task.dueDate}</span>
                      </div>
                      {task.type === 'bot' && (
                        <Badge variant="info" className="text-xs">
                          Бот
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

