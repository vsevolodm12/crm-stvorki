import { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { Plus, Calendar, Bot, User, CheckCircle2 } from 'lucide-react';

export const Tasks = () => {
  const [filter, setFilter] = useState<'all' | 'bot' | 'manual'>('all');
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const tasks = [
    {
      id: 1,
      title: 'Написать клиенту через 3 месяца',
      description: 'Уточнить, как прошла установка, есть ли вопросы',
      appeal: 'Обращение #45 - Иван Петров',
      dueDate: '15.04.2025',
      type: 'bot',
      status: 'pending',
      context: 'Дополнить сообщение: "Также можем предложить услуги по уходу за окнами"',
    },
    {
      id: 2,
      title: 'Отправить коммерческое предложение',
      description: 'Подготовить КП с учетом замера',
      appeal: 'Обращение #42 - Мария Сидорова',
      dueDate: '16.01.2025',
      type: 'manual',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Проверить замер',
      description: 'Связаться с замерщиком по обращению #40',
      appeal: 'Обращение #40 - Алексей Козлов',
      dueDate: 'Сегодня, 18:00',
      type: 'manual',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Написать клиенту через неделю',
      description: 'Уточнить решение по предложению',
      appeal: 'Обращение #38 - Елена Волкова',
      dueDate: '22.01.2025',
      type: 'bot',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Отправить договор',
      description: 'Отправить подписанный договор клиенту',
      appeal: 'Обращение #35 - Дмитрий Соколов',
      dueDate: '10.01.2025',
      type: 'manual',
      status: 'completed',
    },
  ];

  const filteredTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((task) =>
          filter === 'bot'
            ? task.type === 'bot'
            : task.type === 'manual'
        );

  const handleCompleteTask = (taskId: number) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const isTaskCompleted = (taskId: number) => completedTasks.includes(taskId) || tasks.find(t => t.id === taskId)?.status === 'completed';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Задачи</h1>
          <p className="text-gray-600 mt-1">Управление задачами</p>
        </div>
        <Button
          className="flex items-center"
          onClick={() => setIsTaskModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать задачу
        </Button>
      </div>

      {/* Фильтры */}
      <Card>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Все
          </Button>
          <Button
            variant={filter === 'bot' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('bot')}
            className="flex items-center"
          >
            <Bot className="w-4 h-4 mr-1.5" />
            Бот
          </Button>
          <Button
            variant={filter === 'manual' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('manual')}
            className="flex items-center"
          >
            <User className="w-4 h-4 mr-1.5" />
            Ручная
          </Button>
        </div>
      </Card>

      {/* Список задач */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const completed = isTaskCompleted(task.id);
          return (
            <Card
              key={task.id}
              className={completed ? 'opacity-70' : ''}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                    )}
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
                {task.context && (
                  <div className="p-2 bg-blue-50 rounded-lg mb-2">
                    <p className="text-xs text-blue-900">
                      <span className="font-medium">Контекст для бота:</span>{' '}
                      {task.context}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="text-primary-600 hover:underline cursor-pointer">
                    {task.appeal}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{task.dueDate}</span>
                  </div>
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
          </Card>
          );
        })}
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={(task) => {
          console.log('Создана задача:', task);
          // Здесь будет логика создания задачи
        }}
      />
    </div>
  );
};

