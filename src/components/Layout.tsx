import { useState, useEffect, ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Загружаем состояние из localStorage при инициализации
  const [isMenuOpen, setIsMenuOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('menuOpen');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // По умолчанию открыто на десктопе, закрыто на мобильных
    return window.innerWidth >= 768;
  });
  
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('menuCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // На мобильных закрываем меню, на десктопе открываем
      if (mobile) {
        setIsMenuOpen(false);
      } else {
        // На десктопе проверяем сохраненное состояние или открываем по умолчанию
        const saved = localStorage.getItem('menuOpen');
        if (saved === null) {
          setIsMenuOpen(true);
        }
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
    // На мобильных меню скрыто, на десктопе всегда видно
    if (isMobile) {
      return isMenuOpen ? (isMenuCollapsed ? 72 : 256) : 0;
    }
    // На десктопе меню всегда видно
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

