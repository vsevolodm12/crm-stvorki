import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { Plus, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  clientName: string;
  dueDate: string;
  type: 'bot' | 'manual';
  status: 'pending' | 'completed';
}

export const MeasurementsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [clickedDate, setClickedDate] = useState<string | null>(null);
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null);
  const [isViewTasksModalOpen, setIsViewTasksModalOpen] = useState(false);
  const [viewModalDate, setViewModalDate] = useState<string>('');
  const calendarRef = useRef<HTMLDivElement>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Написать клиенту через 3 месяца',
      description: 'Уточнить, как прошла установка, есть ли вопросы',
      clientName: 'Иван Петров',
      dueDate: '15.04.2025',
      type: 'bot',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Отправить коммерческое предложение',
      description: 'Подготовить КП с учетом замера',
      clientName: 'Мария Сидорова',
      dueDate: '16.01.2025',
      type: 'manual',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Проверить замер',
      description: 'Связаться с замерщиком по обращению #40',
      clientName: 'Алексей Козлов',
      dueDate: '10.01.2025',
      type: 'manual',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Написать клиенту через неделю',
      description: 'Уточнить решение по предложению',
      clientName: 'Елена Волкова',
      dueDate: '22.01.2025',
      type: 'bot',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Отправить договор',
      description: 'Отправить подписанный договор клиенту',
      clientName: 'Дмитрий Соколов',
      dueDate: '10.01.2025',
      type: 'manual',
      status: 'completed',
    },
    {
      id: 6,
      title: 'Подготовить спецификацию',
      description: 'Подготовить детальную спецификацию для клиента',
      clientName: 'Иван Петров',
      dueDate: '15.12.2025',
      type: 'manual',
      status: 'pending',
    },
    {
      id: 7,
      title: 'Связаться по поводу установки',
      description: 'Уточнить удобное время для установки окон',
      clientName: 'Мария Сидорова',
      dueDate: '20.12.2025',
      type: 'bot',
      status: 'pending',
    },
  ]);

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

  // Форматирование даты в формат YYYY-MM-DD для сравнения
  const formatDateToISO = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Форматирование даты задачи (DD.MM.YYYY) в Date объект
  // Используем создание даты с 12:00 для избежания проблем с часовыми поясами
  const parseTaskDate = (dueDate: string): { date: Date; isValid: boolean; year: number; month: number; day: number } | null => {
    const dateMatch = dueDate.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (dateMatch) {
      const [, dayStr, monthStr, yearStr] = dateMatch;
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      // Создаем дату с 12:00 для избежания проблем с часовыми поясами
      const date = new Date(year, month - 1, day, 12, 0, 0);
      return { date, isValid: true, year, month: month - 1, day };
    }
    return null;
  };

  // Получить задачи для определенной даты (формат YYYY-MM-DD)
  const getTasksForDate = (date: string) => {
    const [targetYear, targetMonth, targetDay] = date.split('-').map(Number);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      // Парсим дату задачи из формата DD.MM.YYYY
      const dateMatch = task.dueDate.trim().match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (!dateMatch) return false;
      
      const [, taskDay, taskMonth, taskYear] = dateMatch.map(Number);
      
      // Сравниваем числовые значения напрямую
      return taskYear === targetYear && taskMonth === targetMonth && taskDay === targetDay;
    });
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Добавляем пустые ячейки в конце, чтобы заполнить сетку до 42 ячеек (6 недель)
  const totalCells = 42; // 7 дней * 6 недель
  const remainingCells = Math.max(0, totalCells - days.length);
  for (let i = 0; i < remainingCells; i++) {
    days.push(null);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setClickedDate(null);
        setClickedPosition(null);
      }
    };

    if (clickedDate) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [clickedDate]);

  const handleDateClick = (day: number, event: React.MouseEvent) => {
    const date = formatDateToISO(currentYear, currentMonth, day);
    const dayTasks = getTasksForDate(date);

    if (dayTasks.length > 0) {
      // Если есть задачи - показываем кнопки
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setClickedDate(date);
      setClickedPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      // Если задач нет - открываем модальное окно создания
      const formattedDate = `${String(day).padStart(2, '0')}.${String(currentMonth + 1).padStart(2, '0')}.${currentYear}`;
      setSelectedDate(formattedDate);
      setIsCreateModalOpen(true);
      setEditingTaskId(null);
    }
  };

  const handleViewTasks = () => {
    if (clickedDate) {
      const [year, month, day] = clickedDate.split('-').map(Number);
      const formattedDate = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
      setViewModalDate(formattedDate);
      setIsViewTasksModalOpen(true);
      setClickedDate(null);
      setClickedPosition(null);
    }
  };

  const handleAddTask = () => {
    if (clickedDate) {
      const [year, month, day] = clickedDate.split('-').map(Number);
      const formattedDate = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
      setSelectedDate(formattedDate);
      setIsCreateModalOpen(true);
      setEditingTaskId(null);
      setClickedDate(null);
      setClickedPosition(null);
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
      setTasks(tasks.map(t => 
        t.id === editingTaskId 
          ? { ...t, ...taskData, clientName: 'Клиент' } 
          : t
      ));
      setEditingTaskId(null);
    } else {
      // Создание новой задачи
      const newTask: Task = {
        id: Date.now(),
        ...taskData,
        clientName: 'Клиент',
        status: 'pending',
      };
      setTasks([...tasks, newTask]);
    }
    setIsCreateModalOpen(false);
    setSelectedDate('');
  };

  // Получить ближайшие задачи
  const getUpcomingTasks = () => {
    const today = new Date();
    // Создаем дату сегодня с 12:00 для корректного сравнения
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
    const todayTime = todayDate.getTime();

    return tasks
      .filter(task => {
        const parsed = parseTaskDate(task.dueDate);
        if (parsed && parsed.isValid) {
          const taskTime = parsed.date.getTime();
          return taskTime >= todayTime && task.status === 'pending';
        }
        return false;
      })
      .sort((a, b) => {
        const parsedA = parseTaskDate(a.dueDate);
        const parsedB = parseTaskDate(b.dueDate);
        if (!parsedA || !parsedB) return 0;
        return parsedA.date.getTime() - parsedB.date.getTime();
      })
      .slice(0, 5);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Календарь задач</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Управление задачами</p>
        </div>
        <Button onClick={() => {
          setSelectedDate('');
          setIsCreateModalOpen(true);
          setEditingTaskId(null);
        }} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Добавить задачу
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Календарь */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="font-semibold text-gray-900 min-w-[140px] sm:min-w-[160px] text-center text-sm sm:text-base">
                  {months[currentMonth]} {currentYear} г.
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Дни недели */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Календарная сетка */}
            <div className="grid grid-cols-7 gap-1 relative" ref={calendarRef}>
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`${currentYear}-${currentMonth}-empty-${index}`} className="aspect-square min-h-[44px]" />;
                }

                const date = formatDateToISO(currentYear, currentMonth, day);
                const dayTasks = getTasksForDate(date);
                const today = new Date();
                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();
                const isClicked = clickedDate === date;

                return (
                  <div
                    key={`${currentYear}-${currentMonth}-${day}`}
                    className={`aspect-square border border-gray-200 rounded-lg p-1 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                      isToday ? 'border-primary-500 bg-primary-50' : ''
                    } ${isClicked ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateClick(day, e);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-medium ${
                          isToday ? 'text-primary-700' : 'text-gray-700'
                        }`}
                      >
                        {day}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-xs bg-primary-600 text-white rounded-full px-1.5">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className="text-[10px] bg-primary-100 text-primary-700 rounded px-1 truncate"
                          title={task.title}
                        >
                          {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Всплывающие кнопки */}
            {clickedDate && clickedPosition && (
              <div
                className="fixed z-[60] flex flex-col gap-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
                style={{
                  left: `${clickedPosition.x}px`,
                  top: `${clickedPosition.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleViewTasks();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Посмотреть задачи
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleAddTask();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Добавить задачу
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Ближайшие задачи */}
        <div>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ближайшие задачи
            </h2>
            <div className="space-y-2">
              {getUpcomingTasks().map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setIsCreateModalOpen(true);
                  }}
                  className="p-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {task.dueDate}
                      </p>
                    </div>
                    {task.type === 'bot' && (
                      <Badge variant="info" className="text-xs ml-2 flex-shrink-0">
                        Бот
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                    {task.description}
                  </p>
                </div>
              ))}
              {getUpcomingTasks().length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Нет запланированных задач
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedDate('');
          setEditingTaskId(null);
        }}
        clients={[]}
        task={editingTaskId !== null 
          ? tasks.find(t => t.id === editingTaskId) 
          : selectedDate 
            ? { title: '', description: '', type: 'manual', dueDate: selectedDate, clientId: 0 }
            : undefined
        }
        onSubmit={handleCreateOrUpdateTask}
      />

      {/* Модальное окно просмотра задач на дату */}
      {isViewTasksModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Задачи на {viewModalDate}
              </h2>
              <button
                onClick={() => setIsViewTasksModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {(() => {
                const dateMatch = viewModalDate.match(/(\d{2})\.(\d{2})\.(\d{4})/);
                if (!dateMatch) return null;
                const [, day, month, year] = dateMatch;
                // Форматируем дату в формат YYYY-MM-DD с ведущими нулями
                const dateISO = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dateTasks = getTasksForDate(dateISO);

                if (dateTasks.length === 0) {
                  return (
                    <p className="text-gray-500 text-center py-8">
                      На эту дату задач не запланировано
                    </p>
                  );
                }

                return (
                  <div className="space-y-3">
                    {dateTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setIsCreateModalOpen(true);
                          setIsViewTasksModalOpen(false);
                        }}
                        className="p-4 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 mb-1">
                              {task.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
                          </div>
                          {task.type === 'bot' && (
                            <Badge variant="info" className="ml-2 flex-shrink-0">
                              Бот
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            Клиент: {task.clientName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
