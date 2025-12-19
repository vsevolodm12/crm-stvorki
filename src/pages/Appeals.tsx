import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { CreateAppealModal } from '../components/CreateAppealModal';
import { TagDropdown } from '../components/TagDropdown';
import type { TagType } from '../components/Tag';
import { Tag } from '../components/Tag';
import { Plus, Bot, User, X } from 'lucide-react';

export const Appeals = () => {
  const [selectedFilterTags, setSelectedFilterTags] = useState<TagType[]>([]);
  const [appealTags, setAppealTags] = useState<Record<number, TagType[]>>({
    1: ['return-later'],
    2: ['measurement'],
    3: ['refusal'],
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const appeals = [
    {
      id: 1,
      client: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      lastMessage: 'Интересует установка окон в двухкомнатной квартире',
      time: '5 мин назад',
      status: 'active',
      isBot: true,
      unread: 2,
    },
    {
      id: 2,
      client: 'Мария Сидорова',
      phone: '+7 (999) 234-56-78',
      lastMessage: 'Уточнить стоимость доставки',
      time: '15 мин назад',
      status: 'active',
      isBot: false,
      unread: 0,
    },
    {
      id: 3,
      client: 'Алексей Козлов',
      phone: '+7 (999) 345-67-89',
      lastMessage: 'Назначить встречу для замера',
      time: '1 час назад',
      status: 'pending',
      isBot: true,
      unread: 1,
    },
    {
      id: 4,
      client: 'Елена Волкова',
      phone: '+7 (999) 456-78-90',
      lastMessage: 'Спасибо за консультацию',
      time: '2 часа назад',
      status: 'closed',
      isBot: false,
      unread: 0,
    },
    {
      id: 5,
      client: 'Дмитрий Соколов',
      phone: '+7 (999) 567-89-01',
      lastMessage: 'Когда будет готов заказ?',
      time: '3 часа назад',
      status: 'active',
      isBot: true,
      unread: 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Активно</Badge>;
      case 'pending':
        return <Badge variant="warning">Ожидание</Badge>;
      case 'closed':
        return <Badge variant="default">Закрыто</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Обращения</h1>
          <p className="text-gray-600 mt-1">Управление обращениями клиентов</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Новое обращение
        </Button>
      </div>

      {/* Фильтры по тегам */}
      <Card>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Фильтр по тегам:</span>
          <TagDropdown
            selectedTags={selectedFilterTags}
            onTagsChange={setSelectedFilterTags}
          />
          {selectedFilterTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {selectedFilterTags.map((tag) => (
                <div key={tag} className="flex items-center gap-1">
                  <Tag type={tag} />
                  <button
                    onClick={() => {
                      setSelectedFilterTags(selectedFilterTags.filter((t) => t !== tag));
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFilterTags([])}
                className="text-xs"
              >
                Сбросить
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Список обращений */}
      <div className="space-y-3">
        {appeals
          .filter((appeal) => {
            // Фильтрация по тегам
            if (selectedFilterTags.length === 0) return true;
            const appealTagList = appealTags[appeal.id] || [];
            return selectedFilterTags.some((tag) => appealTagList.includes(tag));
          })
          .map((appeal) => (
          <Card key={appeal.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <Link to={`/appeals/${appeal.id}`} className="hover:underline">
                    <h3 className="font-semibold text-gray-900">
                      {appeal.client}
                    </h3>
                  </Link>
                  {getStatusBadge(appeal.status)}
                  {appeal.isBot ? (
                    <Badge variant="info" className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      Бот
                    </Badge>
                  ) : (
                    <Badge variant="default" className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Оператор
                    </Badge>
                  )}
                  {appeal.unread > 0 && (
                    <Badge variant="danger">{appeal.unread}</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{appeal.phone}</p>
                <p className="text-sm text-gray-500 mb-3">{appeal.lastMessage}</p>
                
                {/* Теги */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {appealTags[appeal.id]?.map((tag) => (
                    <Tag key={tag} type={tag} />
                  ))}
                  <TagDropdown
                    selectedTags={appealTags[appeal.id] || []}
                    onTagsChange={(tags) => {
                      setAppealTags({ ...appealTags, [appeal.id]: tags });
                    }}
                  />
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500">{appeal.time}</p>
              </div>
            </div>
          </Card>
          ))}
      </div>

      <CreateAppealModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(appeal) => {
          console.log('Создано обращение:', appeal);
          // Здесь будет логика создания обращения
        }}
      />
    </div>
  );
};

