import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TagDropdown } from '../components/TagDropdown';
import { Tag } from '../components/Tag';
import type { TagType } from '../components/Tag';
import { Search, Plus, Phone, X } from 'lucide-react';
import { CreateAppealModal } from '../components/CreateAppealModal';

export const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterTags, setSelectedFilterTags] = useState<TagType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const clients = [
    {
      id: 1,
      name: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      lastContact: '5 мин назад',
      tags: ['return-later', 'measurement'] as TagType[],
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      phone: '+7 (999) 234-56-78',
      lastContact: '15 мин назад',
      tags: ['measurement'] as TagType[],
    },
    {
      id: 3,
      name: 'Алексей Козлов',
      phone: '+7 (999) 345-67-89',
      lastContact: '1 час назад',
      tags: ['refusal'] as TagType[],
    },
    {
      id: 4,
      name: 'Елена Волкова',
      phone: '+7 (999) 456-78-90',
      lastContact: '2 дня назад',
      tags: ['non-target'] as TagType[],
    },
    {
      id: 5,
      name: 'Дмитрий Соколов',
      phone: '+7 (999) 567-89-01',
      lastContact: '3 дня назад',
      tags: ['for-manager'] as TagType[],
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Клиенты</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">База клиентов</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Новый клиент
        </Button>
      </div>

      {/* Поиск и фильтры */}
      <div className="space-y-4">
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по имени, телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </Card>

        {/* Фильтр по тегам */}
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
      </div>

      {/* Список клиентов */}
      <div className="space-y-2">
        {clients
          .filter((client) => {
            // Фильтрация по тегам
            if (selectedFilterTags.length === 0) return true;
            return selectedFilterTags.some((tag) => client.tags.includes(tag));
          })
          .map((client) => (
          <Link key={client.id} to={`/clients/${client.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-semibold text-sm">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600 truncate">{client.phone}</span>
                    </div>
                    {client.tags && client.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {client.tags.map((tag) => (
                          <Tag key={tag} type={tag} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-gray-500 block whitespace-nowrap">
                    {client.lastContact}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
          ))}
      </div>

      <CreateAppealModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(client) => {
          console.log('Создан клиент:', client);
          // Здесь будет логика создания клиента
        }}
      />
    </div>
  );
};

