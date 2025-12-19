import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { User, Bell, Shield, Save } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-1">Управление настройками системы</p>
      </div>

      {/* Профиль */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Профиль</h2>
        </div>
        <div className="space-y-4 max-w-md">
          <Input label="Имя" defaultValue="Иван Иванов" />
          <Input label="Email" type="email" defaultValue="ivan@example.com" />
          <Input label="Телефон" defaultValue="+7 (999) 123-45-67" />
        </div>
        <div className="mt-6">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Сохранить изменения
          </Button>
        </div>
      </Card>

      {/* Уведомления */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Уведомления</h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Настройки уведомлений будут добавлены позже
          </p>
        </div>
      </Card>

      {/* Безопасность */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Безопасность</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Input label="Текущий пароль" type="password" />
          </div>
          <div>
            <Input label="Новый пароль" type="password" />
          </div>
          <div>
            <Input label="Подтвердите пароль" type="password" />
          </div>
          <Button variant="outline">Изменить пароль</Button>
        </div>
      </Card>
    </div>
  );
};

