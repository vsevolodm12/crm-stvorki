import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users,
  Bot,
  BarChart3,
  Calendar,
  Menu,
  ChevronLeft
} from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggle: () => void;
  onCollapse: () => void;
}

export const Navigation = ({ isOpen, isCollapsed, onClose, onToggle, onCollapse }: NavigationProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Главная' },
    { path: '/clients', icon: Users, label: 'Клиенты' },
    { path: '/tasks', icon: CheckSquare, label: 'Задачи' },
    { path: '/statistics', icon: BarChart3, label: 'Статистика' },
    { path: '/measurements', icon: Calendar, label: 'Календарь замеров' },
    { path: '/bot', icon: Bot, label: 'Настройки бота' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      {/* Кнопка меню когда закрыто (только на мобильных) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}
      
      <nav
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 transform transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-[72px]' : 'w-64'}`}
      >
        <div className="h-full flex flex-col">
          <div className={`flex items-center justify-between ${isCollapsed ? 'p-6 pb-0 h-0 overflow-hidden opacity-0 pointer-events-none' : 'p-6 pb-0 h-auto'}`}>
            <h2 className="text-lg font-semibold text-gray-900">Меню</h2>
          </div>
          
          <div className={`flex-1 ${isCollapsed ? 'px-2 pt-6' : 'px-6 pt-6'}`}>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center rounded-lg transition-colors ${
                        isCollapsed 
                          ? 'justify-center p-[14px]' 
                          : 'px-4 py-3 gap-3'
                      } ${
                        isActive
                          ? isCollapsed 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`flex-shrink-0 ${isCollapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Кнопка свернуть/развернуть */}
          <div className={`${isCollapsed ? 'px-2 pb-6' : 'px-6 pb-6'}`}>
            <button
              onClick={onCollapse}
              className={`w-full flex items-center rounded-lg hover:bg-gray-50 transition-colors text-gray-700 ${
                isCollapsed 
                  ? 'justify-center p-[14px]' 
                  : 'px-3 py-2 gap-2'
              }`}
              title={isCollapsed ? 'Развернуть' : 'Свернуть'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform flex-shrink-0 ${isCollapsed ? 'rotate-180' : ''}`} />
              {!isCollapsed && <span className="text-sm">Свернуть</span>}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

