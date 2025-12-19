import { Card } from '../components/Card';
import { 
  DollarSign, 
  Phone, 
  Users, 
  Ruler, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const Statistics = () => {
  const mainStats = [
    {
      label: 'Выручка',
      value: '2 450 000 ₽',
      change: '+15%',
      changeType: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      period: 'за месяц',
    },
    {
      label: 'Добавлено номеров',
      value: '89',
      change: '+12',
      changeType: 'up',
      icon: Phone,
      color: 'text-blue-600',
      period: 'за неделю',
    },
    {
      label: 'Всего клиентов',
      value: '156',
      change: '+8',
      changeType: 'up',
      icon: Users,
      color: 'text-purple-600',
      period: 'за месяц',
    },
    {
      label: 'Замеров',
      value: '42',
      change: '+5',
      changeType: 'up',
      icon: Ruler,
      color: 'text-orange-600',
      period: 'за неделю',
    },
  ];

  const revenueData = [
    { month: 'Янв', value: 1800000 },
    { month: 'Фев', value: 2100000 },
    { month: 'Мар', value: 1950000 },
    { month: 'Апр', value: 2300000 },
    { month: 'Май', value: 2450000 },
  ];

  const phonesData = [
    { day: 'Пн', value: 12 },
    { day: 'Вт', value: 15 },
    { day: 'Ср', value: 18 },
    { day: 'Чт', value: 14 },
    { day: 'Пт', value: 20 },
    { day: 'Сб', value: 8 },
    { day: 'Вс', value: 2 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.value));
  const maxPhones = Math.max(...phonesData.map(d => d.value));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Статистика</h1>
        <p className="text-gray-600 mt-1">Аналитика и метрики работы</p>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {stat.changeType === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">{stat.period}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График выручки */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Выручка</h2>
            <span className="text-sm text-gray-500">Последние 5 месяцев</span>
          </div>
          <div className="space-y-4">
            {revenueData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.value.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${(item.value / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* График добавленных номеров */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Добавлено номеров</h2>
            <span className="text-sm text-gray-500">За неделю</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {phonesData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-primary-600 rounded-t-lg transition-all hover:bg-primary-700"
                    style={{ height: `${(item.value / maxPhones) * 100}%` }}
                    title={`${item.value} номеров`}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{item.day}</span>
                <span className="text-xs font-medium text-gray-900 mt-1">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Конверсия</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">24%</p>
              <p className="text-xs text-gray-500 mt-1">+2% к прошлому месяцу</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Средний чек</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">58 333 ₽</p>
              <p className="text-xs text-gray-500 mt-1">+3% к прошлому месяцу</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Активных замеров</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">18</p>
              <p className="text-xs text-gray-500 mt-1">На этой неделе</p>
            </div>
            <Ruler className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>
    </div>
  );
};

