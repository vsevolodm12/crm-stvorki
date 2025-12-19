import { useState, useEffect, ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  // Загружаем состояние из localStorage при инициализации
  const [isMenuOpen, setIsMenuOpen] = useState(() => {
    const saved = localStorage.getItem('menuOpen');
    return saved ? JSON.parse(saved) : false; // По умолчанию закрыто на мобильных
  });
  
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(() => {
    const saved = localStorage.getItem('menuCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsMenuOpen(false); // Закрываем меню на мобильных
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('menuOpen', JSON.stringify(isMenuOpen));
  }, [isMenuOpen]);

  useEffect(() => {
    localStorage.setItem('menuCollapsed', JSON.stringify(isMenuCollapsed));
  }, [isMenuCollapsed]);

  const getMenuWidth = () => {
    if (isMobile || !isMenuOpen) return 0;
    return isMenuCollapsed ? 72 : 256;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        isOpen={isMenuOpen} 
        isCollapsed={isMenuCollapsed}
        onClose={() => setIsMenuOpen(false)}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
        onCollapse={() => setIsMenuCollapsed(!isMenuCollapsed)}
      />
      <main 
        className="transition-all duration-300" 
        style={{ marginLeft: `${getMenuWidth()}px` }}
      >
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

