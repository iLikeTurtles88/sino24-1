import React from 'react';
import { ViewState } from '../types';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: ViewState.HOME, label: 'La Maison 🏠' },
    { id: ViewState.GALLERY, label: 'Mes Dessins 🎨' },
    { id: ViewState.ABOUT, label: 'Qui est Sino ? 🧢' },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <div 
          className="pointer-events-auto cursor-pointer bg-white px-6 py-2 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] border-2 border-black hover:translate-y-1 hover:shadow-none transition-all duration-200" 
          onClick={() => setView(ViewState.HOME)}
        >
          <h1 className="text-2xl font-bold tracking-wide text-black">Sino<span className="text-orange-500">.</span></h1>
        </div>

        <ul className="hidden md:flex space-x-6 pointer-events-auto">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className={`
                  px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 border-2
                  ${currentView === item.id 
                    ? 'bg-yellow-300 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                    : 'bg-white/80 border-transparent text-gray-600 hover:bg-white hover:border-black hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]'}
                `}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden pointer-events-auto bg-white text-black border-2 border-black rounded-full p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-[#FFD166] z-40 flex items-center justify-center transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <ul className="flex flex-col items-center space-y-6 w-full px-8 relative z-10">
          {navItems.map((item, index) => (
            <li key={item.id} className="w-full flex justify-center">
              <button
                onClick={() => {
                  setView(item.id);
                  setIsOpen(false);
                }}
                className={`
                    w-full max-w-xs py-4 rounded-xl border-4 border-black bg-white text-2xl font-bold text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                    transform transition-all duration-300 active:scale-95 active:shadow-none
                    ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                `}
                style={{ transitionDelay: `${isOpen ? index * 100 : 0}ms` }}
              >
                 {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navigation;