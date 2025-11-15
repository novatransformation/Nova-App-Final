import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, Home, History, Star, LayoutDashboard, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const menuRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      if (e.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const menuItems = [
    { icon: Home, label: 'Startseite', path: '/home' },
    { icon: BookOpen, label: 'Tutorial ansehen', path: '/tutorial' },
    { icon: History, label: 'Meine Transformationen', path: '/history' },
    { icon: Star, label: 'Favoriten', path: '/favorites' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  ];

  const handleNavigate = (path: string) => {
    setLocation(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={closeButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all"
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Menu */}
      <nav
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-[#1F4E5F] to-[#2C5F6F] border-l border-white/20 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Hauptnavigation"
        role="navigation"
        aria-hidden={!isOpen}
      >
        <div className="p-8 pt-24">
          <h2 className="text-2xl font-bold text-white mb-8">Navigation</h2>
          
          <div className="space-y-4" role="menu">
            {menuItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full justify-start gap-3 border text-lg py-6 transition-all ${
                    isActive 
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-semibold shadow-lg shadow-[#D4AF37]/20' 
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <span className="ml-auto text-[#D4AF37]">●</span>}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

