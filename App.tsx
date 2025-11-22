
import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import Navigation from './components/Navigation';
import InteractiveBackground from './components/InteractiveBackground';
import CustomCursor from './components/CustomCursor';
import Gallery from './components/Gallery';
import SprayPaint from './components/SprayPaint';
import { Instagram, Twitter, Mail, Heart, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const renderContent = () => {
    switch (view) {
      case ViewState.HOME:
        return (
          <div className={`flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative z-10 max-w-4xl mx-auto">
              
              <div className="inline-block mb-4 animate-fade-in-up">
                 <span className="bg-white border-2 border-black text-black px-4 py-1 rounded-full font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   👋 Salut ! Je m'appelle Sino
                 </span>
              </div>

              <h1 className="relative mb-6">
                <span className="block text-5xl md:text-9xl font-bold text-black mb-2 tracking-tight animate-fade-in-up delay-100">
                  DESSINER
                </span>
                <span className="block text-5xl md:text-9xl font-bold text-[#118AB2] mb-2 tracking-tight animate-fade-in-up delay-200 transform -rotate-2">
                  LE BONHEUR
                </span>
              </h1>

              <p className="max-w-xl mx-auto text-gray-600 font-hand text-2xl md:text-3xl leading-relaxed animate-fade-in-up delay-300 mb-8">
                Illustrateur bruxellois. Je raconte des histoires pour les petits géants et les grands enfants.
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-fade-in-up delay-300">
                  <button 
                    onClick={() => setView(ViewState.GALLERY)}
                    className="px-8 py-4 bg-[#FFD166] border-2 border-black text-black text-lg font-bold rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                  >
                    <Sparkles size={20} />
                    Voir mes dessins
                  </button>
                  
                  <button 
                    onClick={() => setView(ViewState.ABOUT)}
                    className="px-8 py-4 bg-white border-2 border-black text-black text-lg font-bold rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    C'est qui Sino ?
                  </button>
              </div>
            </div>
          </div>
        );
      case ViewState.GALLERY:
        return <Gallery />;
      case ViewState.ABOUT:
        return (
          <div className="min-h-screen flex items-center justify-center px-4 md:px-20 pt-36 md:pt-44 pb-20">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full animate-fade-in items-center">
                
                {/* Image Section */}
                <div className="relative group">
                  {/* Effet cadre décalé */}
                  <div className="absolute inset-0 bg-[#06D6A0] rounded-3xl transform rotate-3 translate-x-4 translate-y-4 border-2 border-black"></div>
                  <div className="relative h-[500px] w-full overflow-hidden bg-gray-100 rounded-3xl border-2 border-black">
                    {/* Image de remplacement fournie par l'utilisateur */}
                    <img 
                      src="https://i.ibb.co/wFdTr6bD/sino24.png" 
                      alt="Sino le créatif" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback si l'image échoue
                        e.currentTarget.src = "https://via.placeholder.com/800x1000/EF476F/FFFFFF?text=Sino+au+travail";
                      }}
                    />
                    
                    {/* Badge flottant */}
                    <div className="absolute bottom-6 left-6 bg-white px-4 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                        <Heart className="text-red-500 fill-red-500" size={16} />
                        <span className="font-bold text-sm">Amoureux de Bruxelles</span>
                    </div>
                  </div>
                </div>
                
                {/* Text Section */}
                <div className="flex flex-col justify-center">
                  <div className="mb-6">
                    <span className="text-[#EF476F] font-bold text-lg tracking-wider uppercase mb-2 block">À propos de moi</span>
                    <h2 className="text-5xl font-bold text-black mb-6 leading-tight">Du papier, un crayon et beaucoup de <span className="text-[#118AB2] underline decoration-wavy decoration-[#FFD166]">chocolat</span>.</h2>
                  </div>
                  
                  <div className="space-y-6 text-gray-700 font-hand text-2xl leading-relaxed text-justify">
                    <p>
                      Salut ! Moi c'est Sino. J'habite à Bruxelles, la ville où il pleut souvent mais où les gens ont du soleil dans le cœur.
                    </p>
                    <p>
                      Depuis que je suis tout petit, je dessine partout : sur les nappes, dans les marges de mes cahiers et parfois même sur les murs (comme sur la photo !).
                    </p>
                    <p>
                      Aujourd'hui, je crée des mondes colorés pour les livres d'enfants. J'aime cacher des petits détails rigolos que seuls les plus attentifs peuvent trouver.
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-4 mt-8 pt-8 border-t-2 border-dashed border-gray-200">
                    <span className="font-bold text-gray-500">On papote ?</span>
                    <div className="flex space-x-6">
                      <a href="#" className="p-3 bg-[#EF476F] text-white rounded-full border-2 border-black hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Instagram size={24} /></a>
                      <a href="#" className="p-3 bg-[#118AB2] text-white rounded-full border-2 border-black hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Twitter size={24} /></a>
                      <a href="mailto:bonjour@sino.be" className="p-3 bg-[#FFD166] text-black rounded-full border-2 border-black hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Mail size={24} /></a>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-[#FFD166] selection:text-black overflow-hidden">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Spray Paint Effect (Highest Z-Index Overlay) */}
      <SprayPaint />

      {/* Background at Z-0 */}
      <InteractiveBackground />
      
      {/* Navigation at Z-50 */}
      <Navigation currentView={view} setView={setView} />
      
      {/* Main Content at Z-10 */}
      <main className="relative z-10 min-h-screen transition-all duration-500">
        {renderContent()}
      </main>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translate3d(0, 30px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>
    </div>
  );
};

export default App;
