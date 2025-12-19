import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CreateMeasurementModal } from '../components/CreateMeasurementModal';
import { AddMeasurerModal } from '../components/AddMeasurerModal';
import { ManageMeasurersModal } from '../components/ManageMeasurersModal';
import { MeasurerDropdown } from '../components/MeasurerDropdown';
import { ViewMeasurementsModal } from '../components/ViewMeasurementsModal';
import { ViewSingleMeasurementModal } from '../components/ViewSingleMeasurementModal';
import { Plus, ChevronLeft, ChevronRight, UserPlus, Eye, Settings } from 'lucide-react';

interface Measurement {
  id: number;
  date: string;
  time: string;
  client: string;
  phone: string;
  measurer: string;
  address: string;
}

interface Measurer {
  id: number;
  name: string;
  phone: string;
}

export const MeasurementsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMeasurer, setSelectedMeasurer] = useState<number | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isAddMeasurerModalOpen, setIsAddMeasurerModalOpen] = useState(false);
  const [isManageMeasurersModalOpen, setIsManageMeasurersModalOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<string | null>(null);
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewModalDate, setViewModalDate] = useState<string>('');
  const [isSingleMeasurementModalOpen, setIsSingleMeasurementModalOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [measurers, setMeasurers] = useState<Measurer[]>([
    { id: 1, name: 'Иван Смирнов', phone: '+7 (999) 111-22-33' },
    { id: 2, name: 'Петр Иванов', phone: '+7 (999) 222-33-44' },
    { id: 3, name: 'Алексей Петров', phone: '+7 (999) 333-44-55' },
  ]);

  const [measurements, setMeasurements] = useState<Measurement[]>([
    {
      id: 1,
      date: '2025-01-15',
      time: '10:00',
      client: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      measurer: 'Иван Смирнов',
      address: 'ул. Ленина, д. 10, кв. 5',
    },
    {
      id: 2,
      date: '2025-01-15',
      time: '14:00',
      client: 'Мария Сидорова',
      phone: '+7 (999) 234-56-78',
      measurer: 'Петр Иванов',
      address: 'ул. Пушкина, д. 25, кв. 12',
    },
    {
      id: 3,
      date: '2025-01-16',
      time: '11:00',
      client: 'Алексей Козлов',
      phone: '+7 (999) 345-67-89',
      measurer: 'Иван Смирнов',
      address: 'ул. Гагарина, д. 5, кв. 8',
    },
    {
      id: 4,
      date: '2025-01-17',
      time: '15:30',
      client: 'Елена Волкова',
      phone: '+7 (999) 456-78-90',
      measurer: 'Алексей Петров',
      address: 'ул. Мира, д. 15, кв. 3',
    },
    {
      id: 5,
      date: '2025-12-17',
      time: '10:00',
      client: 'Сергей Николаев',
      phone: '+7 (999) 555-11-22',
      measurer: 'Иван Смирнов',
      address: 'ул. Советская, д. 20, кв. 7',
    },
    {
      id: 6,
      date: '2025-12-17',
      time: '14:30',
      client: 'Ольга Семенова',
      phone: '+7 (999) 666-33-44',
      measurer: 'Петр Иванов',
      address: 'пр. Победы, д. 45, кв. 12',
    },
    {
      id: 7,
      date: '2025-12-17',
      time: '16:00',
      client: 'Дмитрий Федоров',
      phone: '+7 (999) 777-55-66',
      measurer: 'Алексей Петров',
      address: 'ул. Центральная, д. 8, кв. 3',
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
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getMeasurementsForDate = (date: string) => {
    return measurements.filter(m => m.date === date);
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
    const date = formatDate(currentYear, currentMonth, day);
    const dayMeasurements = getMeasurementsForDate(date).filter(m =>
      selectedMeasurer === 'all' || measurers.find(me => me.name === m.measurer)?.id === selectedMeasurer
    );

    if (dayMeasurements.length > 0) {
      // Если есть замеры - показываем кнопки
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setClickedDate(date);
      setClickedPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      // Если замеров нет - открываем модальное окно создания
      setSelectedDate(date);
      setIsCreateModalOpen(true);
    }
  };

  const handleViewMeasurements = () => {
    if (clickedDate) {
      setViewModalDate(clickedDate);
      setIsViewModalOpen(true);
      setClickedDate(null);
      setClickedPosition(null);
    }
  };

  const handleAddMeasurement = () => {
    if (clickedDate) {
      setSelectedDate(clickedDate);
      setIsCreateModalOpen(true);
      setClickedDate(null);
      setClickedPosition(null);
    }
  };

  const handleCreateMeasurement = (data: {
    date: string;
    time: string;
    client: string;
    phone: string;
    measurerId: number;
    address: string;
  }) => {
    const measurer = measurers.find(m => m.id === data.measurerId);
    const newMeasurement: Measurement = {
      id: Date.now(),
      date: data.date,
      time: data.time,
      client: data.client,
      phone: data.phone,
      measurer: measurer?.name || '',
      address: data.address,
    };
    setMeasurements([...measurements, newMeasurement]);
  };

  const handleEditMeasurement = (id: number, updatedData: Partial<Measurement>) => {
    setMeasurements(measurements.map(m => 
      m.id === id ? { ...m, ...updatedData } : m
    ));
  };

  const handleDeleteMeasurement = (id: number) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  const handleAddMeasurer = (name: string, phone: string) => {
    const newMeasurer: Measurer = {
      id: Date.now(),
      name: name,
      phone: phone,
    };
    setMeasurers([...measurers, newMeasurer]);
  };

  const handleEditMeasurer = (id: number, name: string, phone: string) => {
    setMeasurers(measurers.map(m => 
      m.id === id ? { ...m, name, phone } : m
    ));
  };

  const handleDeleteMeasurer = (id: number) => {
    setMeasurers(measurers.filter(m => m.id !== id));
    // Также удаляем замеры этого замерщика
    setMeasurements(measurements.filter(m => {
      const measurer = measurers.find(me => me.id === id);
      return measurer ? m.measurer !== measurer.name : true;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Календарь замеров</h1>
          <p className="text-gray-600 mt-1">Управление замерами</p>
        </div>
        <Button onClick={() => {
          setSelectedDate('');
          setIsCreateModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить замер
        </Button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Календарь */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="font-semibold text-gray-900 min-w-[160px] text-center">
                  {months[currentMonth]} {currentYear} г.
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <MeasurerDropdown
                  measurers={measurers}
                  selectedMeasurer={selectedMeasurer}
                  onSelect={setSelectedMeasurer}
                />
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
                  return <div key={index} className="aspect-square" />;
                }

                const date = formatDate(currentYear, currentMonth, day);
                const dayMeasurements = getMeasurementsForDate(date).filter(m =>
                  selectedMeasurer === 'all' || measurers.find(me => me.name === m.measurer)?.id === selectedMeasurer
                );
                const today = new Date();
                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();
                const isClicked = clickedDate === date;

                return (
                  <div
                    key={day}
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
                      {dayMeasurements.length > 0 && (
                        <span className="text-xs bg-primary-600 text-white rounded-full px-1.5">
                          {dayMeasurements.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {dayMeasurements.slice(0, 2).map((m) => (
                        <div
                          key={m.id}
                          className="text-[10px] bg-primary-100 text-primary-700 rounded px-1 truncate"
                          title={`${m.time} - ${m.client}`}
                        >
                          {m.time}
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
                    handleViewMeasurements();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Посмотреть замеры
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
                    handleAddMeasurement();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Добавить замер
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Управление замерщиками */}
        <div>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Замерщики
            </h2>
            

            {/* Добавить замерщика */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddMeasurerModalOpen(true)}
                  className="flex-1"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Добавить замерщика
                </Button>
                <button
                  onClick={() => setIsManageMeasurersModalOpen(true)}
                  className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title="Управление замерщиками"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </Card>

          {/* Ближайшие замеры */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ближайшие замеры
            </h2>
            <div className="space-y-2">
              {measurements
                .filter(m =>
                  selectedMeasurer === 'all' || measurers.find(me => me.name === m.measurer)?.id === selectedMeasurer
                )
                .sort((a, b) => {
                  const dateA = new Date(`${a.date}T${a.time}`);
                  const dateB = new Date(`${b.date}T${b.time}`);
                  return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 5)
                .map((measurement) => (
                  <div
                    key={measurement.id}
                    onClick={() => {
                      setSelectedMeasurement(measurement);
                      setIsSingleMeasurementModalOpen(true);
                    }}
                    className="p-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {measurement.client}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(measurement.date).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                          })} в {measurement.time}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {measurement.address}
                    </p>
                  </div>
                ))}
              {measurements.filter(m =>
                selectedMeasurer === 'all' || measurers.find(me => me.name === m.measurer)?.id === selectedMeasurer
              ).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Нет запланированных замеров
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <CreateMeasurementModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedDate('');
        }}
        selectedDate={selectedDate}
        measurers={measurers}
        onSubmit={handleCreateMeasurement}
      />

      <AddMeasurerModal
        isOpen={isAddMeasurerModalOpen}
        onClose={() => setIsAddMeasurerModalOpen(false)}
        onSubmit={handleAddMeasurer}
      />

      <ManageMeasurersModal
        isOpen={isManageMeasurersModalOpen}
        onClose={() => setIsManageMeasurersModalOpen(false)}
        measurers={measurers}
        onEdit={handleEditMeasurer}
        onDelete={handleDeleteMeasurer}
      />

      <ViewMeasurementsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        date={viewModalDate}
        measurements={viewModalDate 
          ? getMeasurementsForDate(viewModalDate).filter(m =>
              selectedMeasurer === 'all' || measurers.find(me => me.name === m.measurer)?.id === selectedMeasurer
            )
          : []
        }
        measurers={measurers}
        onEdit={handleEditMeasurement}
        onDelete={handleDeleteMeasurement}
      />

      <ViewSingleMeasurementModal
        isOpen={isSingleMeasurementModalOpen}
        onClose={() => {
          setIsSingleMeasurementModalOpen(false);
          setSelectedMeasurement(null);
        }}
        measurement={selectedMeasurement}
        measurers={measurers}
        onEdit={handleEditMeasurement}
        onDelete={handleDeleteMeasurement}
      />
    </div>
  );
};

