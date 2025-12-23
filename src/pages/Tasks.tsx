import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { Plus, Calendar, Bot, User, CheckCircle2, ChevronDown, ChevronLeft } from 'lucide-react';

export const Tasks = () => {
  const [filter, setFilter] = useState<'all' | 'bot' | 'manual'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'month' | 'calendar'>('today');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'months' | 'days'>('months');
  const [selectedMonth, setSelectedMonth] = useState<{ month: number; year: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const tasks = [
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
      dueDate: 'Сегодня, 18:00',
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
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
        setCalendarView('months');
        setSelectedMonth(null);
      }
    };

    if (isDateDropdownOpen || isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDateDropdownOpen, isCalendarOpen]);

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'all':
        return 'Все даты';
      case 'today':
        return 'Сегодня';
      case 'tomorrow':
        return 'Завтра';
      case 'week':
        return 'На неделе';
      case 'month':
        return 'В этом месяце';
      case 'calendar':
        return selectedDate ? selectedDate : 'Календарь';
      default:
        return 'Сегодня';
    }
  };

  // Функции для работы с календарем
  const parseTaskDate = (dueDate: string): { date: Date; isValid: boolean } | null => {
    const dateMatch = dueDate.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return { date, isValid: true };
    }
    return null;
  };

  const getTasksByMonths = () => {
    const monthsMap: { [key: string]: { month: number; year: number; count: number } } = {};
    
    tasks.forEach(task => {
      const parsed = parseTaskDate(task.dueDate);
      if (parsed && parsed.isValid) {
        const month = parsed.date.getMonth();
        const year = parsed.date.getFullYear();
        const key = `${year}-${month}`;
        
        if (!monthsMap[key]) {
          monthsMap[key] = { month, year, count: 0 };
        }
        monthsMap[key].count++;
      }
    });

    return Object.values(monthsMap).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  };

  const getTasksByDaysInMonth = (month: number, year: number) => {
    const daysMap: { [key: number]: number } = {};
    
    tasks.forEach(task => {
      const parsed = parseTaskDate(task.dueDate);
      if (parsed && parsed.isValid) {
        const taskMonth = parsed.date.getMonth();
        const taskYear = parsed.date.getFullYear();
        
        if (taskMonth === month && taskYear === year) {
          const day = parsed.date.getDate();
          daysMap[day] = (daysMap[day] || 0) + 1;
        }
      }
    });

    return daysMap;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const matchesDateFilter = (task: typeof tasks[0]): boolean => {
    if (dateFilter === 'all') return true;
    
    if (dateFilter === 'calendar') {
      if (!selectedDate) return true;
      const parsed = parseTaskDate(task.dueDate);
      if (parsed && parsed.isValid) {
        const taskDateStr = `${String(parsed.date.getDate()).padStart(2, '0')}.${String(parsed.date.getMonth() + 1).padStart(2, '0')}.${parsed.date.getFullYear()}`;
        return taskDateStr === selectedDate;
      }
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDateLower = task.dueDate.toLowerCase();

    if (dateFilter === 'today') {
      return taskDateLower.includes('сегодня');
    }

    if (dateFilter === 'tomorrow') {
      return taskDateLower.includes('завтра');
    }

    if (dateFilter === 'week') {
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      
      // Парсим дату из формата DD.MM.YYYY
      const dateMatch = task.dueDate.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        const taskDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        taskDate.setHours(0, 0, 0, 0);
        return taskDate >= today && taskDate <= weekFromNow;
      }
      return taskDateLower.includes('сегодня') || taskDateLower.includes('завтра');
    }

    if (dateFilter === 'month') {
      const monthFromNow = new Date(today);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);
      
      const dateMatch = task.dueDate.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        const taskDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        taskDate.setHours(0, 0, 0, 0);
        return taskDate >= today && taskDate <= monthFromNow;
      }
      return true; // Если не можем распарсить, показываем
    }

    return true;
  };

  const filteredTasks = tasks.filter((task) => {
    // Фильтр по типу
    const typeMatch = filter === 'all' || 
      (filter === 'bot' && task.type === 'bot') ||
      (filter === 'manual' && task.type === 'manual');
    
    // Фильтр по дате
    const dateMatch = matchesDateFilter(task);
    
    return typeMatch && dateMatch;
  });

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
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex-1 sm:flex-initial"
            >
              Все
            </Button>
            <Button
              variant={filter === 'bot' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('bot')}
              className="flex items-center flex-1 sm:flex-initial"
            >
              <Bot className="w-4 h-4 mr-1.5" />
              Бот
            </Button>
            <Button
              variant={filter === 'manual' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('manual')}
              className="flex items-center flex-1 sm:flex-initial"
            >
              <User className="w-4 h-4 mr-1.5" />
              Ручная
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Кнопка календаря */}
            <div className="relative" ref={calendarRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  if (!isCalendarOpen) {
                    setCalendarView('months');
                    setSelectedMonth(null);
                  }
                }}
                className="w-10 h-10 p-0 flex items-center justify-center"
                title="Календарь"
              >
                <Calendar className="w-4 h-4" />
              </Button>
              
              {isCalendarOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => {
                      setIsCalendarOpen(false);
                      setCalendarView('months');
                      setSelectedMonth(null);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[320px] max-w-[400px] overflow-hidden">
                    {calendarView === 'months' ? (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Выберите месяц</h3>
                        <button
                          onClick={() => setIsCalendarOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-600 rotate-180" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                        {getTasksByMonths().map((monthData) => {
                          const months = [
                            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                          ];
                          return (
                            <button
                              key={`${monthData.year}-${monthData.month}`}
                              onClick={() => {
                                setSelectedMonth({ month: monthData.month, year: monthData.year });
                                setCalendarView('days');
                              }}
                              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className="font-medium text-gray-900 text-sm">
                                {months[monthData.month]} {monthData.year}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {monthData.count} {monthData.count === 1 ? 'задача' : monthData.count < 5 ? 'задачи' : 'задач'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : selectedMonth && (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => {
                            setCalendarView('months');
                            setSelectedMonth(null);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {(() => {
                            const months = [
                              'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                              'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                            ];
                            return `${months[selectedMonth.month]} ${selectedMonth.year}`;
                          })()}
                        </h3>
                        <button
                          onClick={() => setIsCalendarOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-600 rotate-180" />
                        </button>
                      </div>
                      
                      <div className="mb-2">
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1">
                          {(() => {
                            const daysInMonth = getDaysInMonth(selectedMonth.month, selectedMonth.year);
                            const firstDay = getFirstDayOfMonth(selectedMonth.month, selectedMonth.year);
                            const tasksByDays = getTasksByDaysInMonth(selectedMonth.month, selectedMonth.year);
                            const days = [];
                            
                            for (let i = 0; i < firstDay; i++) {
                              days.push(null);
                            }
                            
                            for (let day = 1; day <= daysInMonth; day++) {
                              days.push(day);
                            }
                            
                            return days.map((day, index) => {
                              if (day === null) {
                                return <div key={index} className="aspect-square" />;
                              }
                              
                              const taskCount = tasksByDays[day] || 0;
                              const dateStr = `${String(day).padStart(2, '0')}.${String(selectedMonth.month + 1).padStart(2, '0')}.${selectedMonth.year}`;
                              const isSelected = selectedDate === dateStr;
                              
                              return (
                                <button
                                  key={day}
                                  onClick={() => {
                                    setSelectedDate(dateStr);
                                    setDateFilter('calendar');
                                    setIsCalendarOpen(false);
                                    setCalendarView('months');
                                    setSelectedMonth(null);
                                  }}
                                  className={`aspect-square flex flex-col items-center justify-center text-xs rounded-lg transition-colors ${
                                    isSelected
                                      ? 'bg-primary-600 text-white font-semibold'
                                      : taskCount > 0
                                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                      : 'hover:bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <span>{day}</span>
                                  {taskCount > 0 && (
                                    <span className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                                      {taskCount}
                                    </span>
                                  )}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            </div>

            {/* Кнопка быстрых фильтров */}
            <div className="relative" ref={dateDropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDateDropdownOpen(!isDateDropdownOpen);
                }}
                className="h-10 flex items-center gap-2"
              >
                <span>{getDateFilterLabel()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {isDateDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDateDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] overflow-hidden">
                    <button
                      onClick={() => {
                        setDateFilter('all');
                        setIsDateDropdownOpen(false);
                        setSelectedDate(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        dateFilter === 'all' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Все даты
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('today');
                        setIsDateDropdownOpen(false);
                        setSelectedDate(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        dateFilter === 'today' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Сегодня
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('tomorrow');
                        setIsDateDropdownOpen(false);
                        setSelectedDate(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        dateFilter === 'tomorrow' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Завтра
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('week');
                        setIsDateDropdownOpen(false);
                        setSelectedDate(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        dateFilter === 'week' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      На неделе
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('month');
                        setIsDateDropdownOpen(false);
                        setSelectedDate(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        dateFilter === 'month' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      В этом месяце
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
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
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
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
                    <h3 className={`font-semibold text-sm sm:text-base ${completed ? 'line-through text-gray-400' : 'text-gray-900'} break-words`}>
                      {task.title}
                    </h3>
                    {task.type === 'bot' ? (
                      <Badge variant="info" className="flex items-center gap-1 flex-shrink-0">
                        <Bot className="w-3 h-3" />
                        <span className="hidden sm:inline">Бот</span>
                      </Badge>
                    ) : (
                      <Badge variant="default" className="flex items-center gap-1 flex-shrink-0">
                        <User className="w-3 h-3" />
                        <span className="hidden sm:inline">Ручная</span>
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm mb-2 ${completed ? 'line-through text-gray-400' : 'text-gray-600'} break-words`}>
                    {task.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="text-primary-600 hover:underline cursor-pointer break-words">
                      {task.clientName}
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
                  className="w-full sm:w-auto sm:ml-4"
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
        clients={[
          { id: 1, name: 'Иван Петров', phone: '+7 (999) 123-45-67' },
          { id: 2, name: 'Мария Сидорова', phone: '+7 (999) 234-56-78' },
          { id: 3, name: 'Алексей Козлов', phone: '+7 (999) 345-67-89' },
          { id: 4, name: 'Елена Волкова', phone: '+7 (999) 456-78-90' },
          { id: 5, name: 'Дмитрий Соколов', phone: '+7 (999) 567-89-01' },
        ]}
        onSubmit={(task) => {
          console.log('Создана задача:', task);
          // Здесь будет логика создания задачи
        }}
      />
    </div>
  );
};

