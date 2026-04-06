import { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import Logo from './Logo';
import { usePathname } from 'next/navigation';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const path = usePathname();

  const links = [
    { name: 'Inicio', href: '/', active: path === '/' },
    { name: 'Acerca de', href: '/about', active: path === '/about' },
    { name: 'Contacto', href: '/contact', active: path === '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-[#fdfaf5]/80 backdrop-blur-xl border-b border-black/5 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-20">
        <Logo />

        <nav aria-label="Menú principal" className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 no-underline ${link.active
                ? 'text-blue-600 bg-blue-600/10'
                : 'text-[#171717] hover:text-blue-600 hover:bg-blue-600/5'
                }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href="/login" className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-[#171717] hover:text-blue-600 transition-colors no-underline">
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 no-underline"
          >
            Registrarse
          </a>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menú"
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-black/5 p-4 flex flex-col gap-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-3 text-base font-medium text-[#171717] hover:bg-gray-50 rounded-lg no-underline"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-black/5 my-2" />
          <a href="/login" className="px-4 py-3 text-base font-medium text-[#171717] no-underline">
            Iniciar sesión
          </a>
        </div>
      )}
    </header>
  );
};

export default Menu;