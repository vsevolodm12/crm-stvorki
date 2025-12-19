import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { Textarea } from '../components/Textarea';
import { Bot, MessageSquare, Clock, Save } from 'lucide-react';

export const BotSettings = () => {
  const [isBotEnabled, setIsBotEnabled] = useState(true);
  const [autoResponse, setAutoResponse] = useState(true);
  const [defaultMessage, setDefaultMessage] = useState(
    'Здравствуйте! Спасибо за обращение. Я помогу вам с выбором окон.'
  );
  const [contextInstructions, setContextInstructions] = useState(
    'При общении с клиентом всегда будь вежлив, предлагай бесплатный замер, уточняй детали заказа.'
  );

  const botStats = [
    { label: 'Активных диалогов', value: '9', change: '+2' },
    { label: 'Сообщений сегодня', value: '156', change: '+23' },
    { label: 'Успешных продаж', value: '12', change: '+3' },
    { label: 'Средний ответ', value: '2 сек', change: '-0.5 сек' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Настройки бота</h1>
        <p className="text-gray-600 mt-1">Управление нейроботом</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {botStats.map((stat) => (
          <Card key={stat.label}>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-600">{stat.change}</span> за неделю
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Основные настройки */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-6 h-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Основные настройки
          </h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Включить бота</p>
              <p className="text-sm text-gray-600 mt-1">
                Бот будет автоматически отвечать на новые обращения
              </p>
            </div>
            <Toggle checked={isBotEnabled} onChange={setIsBotEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Автоответ</p>
              <p className="text-sm text-gray-600 mt-1">
                Бот будет сразу отвечать на входящие сообщения
              </p>
            </div>
            <Toggle checked={autoResponse} onChange={setAutoResponse} />
          </div>
        </div>
      </Card>

      {/* Настройки сообщений */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Настройки сообщений
          </h2>
        </div>
        <div className="space-y-4">
          <Textarea
            label="Приветственное сообщение"
            value={defaultMessage}
            onChange={(e) => setDefaultMessage(e.target.value)}
            placeholder="Введите приветственное сообщение..."
            className="min-h-[100px]"
          />
          <Textarea
            label="Инструкции для бота (контекст)"
            value={contextInstructions}
            onChange={(e) => setContextInstructions(e.target.value)}
            placeholder="Опишите, как должен вести себя бот..."
            className="min-h-[150px]"
          />
        </div>
      </Card>

      {/* Планирование задач */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Планирование задач
          </h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              Бот может автоматически создавать задачи на написание клиенту через
              определенное время. Например:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Написать через 3 месяца после установки</li>
              <li>Написать через неделю после консультации</li>
              <li>Написать через месяц с предложением дополнительных услуг</li>
            </ul>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                Автоматическое планирование
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Бот будет автоматически создавать задачи на основе контекста
                общения
              </p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
        </div>
      </Card>

      {/* Сохранение */}
      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
};

