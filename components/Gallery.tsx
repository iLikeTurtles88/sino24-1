import React, { useRef, useEffect } from 'react';
import { ArtPiece } from '../types';
import { Star } from 'lucide-react';

const SAMPLE_ART: ArtPiece[] = [
  { id: '1', title: "Le Renard en Bus", description: "Un renard qui prend le bus 71 à Flagey. Il a oublié son abonnement !", category: "Bruxelles", imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80", year: 2024 },
  { id: '2', title: "La Grande Place la Nuit", description: "Les pavés dorés racontent des histoires quand tout le monde dort.", category: "Magie", imageUrl: "https://images.unsplash.com/photo-1615315429627-5b6e6b19e3f2?auto=format&fit=crop&w=800&q=80", year: 2023 },
  { id: '3', title: "Monstres Gentils", description: "Gérard le monstre qui a peur du noir et dort avec une veilleuse.", category: "Personnages", imageUrl: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80", year: 2024 },
  { id: '4', title: "Pluie de Bonbons", description: "Ce n'est pas de la drache, c'est du sucre qui tombe du ciel !", category: "Rêve", imageUrl: "https://images.unsplash.com/photo-1581795775489-aba415f7f82d?auto=format&fit=crop&w=800&q=80", year: 2023 },
  { id: '5', title: "L'Atomium Géant", description: "Et si on pouvait jongler avec les boules de l'Atomium ?", category: "Bruxelles", imageUrl: "https://images.unsplash.com/photo-1565254481937-c42863c14b86?auto=format&fit=crop&w=800&q=80", year: 2022 },
  { id: '6', title: "Le Chat du Toit", description: "Minou observe toute la ville depuis les cheminées.", category: "Animaux", imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=800&q=80", year: 2024 },
];

const PolaroidCard: React.FC<{ art: ArtPiece; index: number }> = ({ art, index }) => {
  // Variation aléatoire de rotation pour l'effet "tas de photos"
  const rotation = React.useMemo(() => (Math.random() - 0.5) * 6, []);

  return (
    <div 
      className="relative group animate-fade-in-up"
      style={{ 
        animationDelay: `${index * 100}ms`
      }}
    >
      <div 
        className="bg-white p-4 pb-12 rounded-sm shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transform transition-all duration-500 hover:scale-105 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.2)] hover:z-10 cursor-pointer border border-gray-100"
        style={{ 
            transform: `rotate(${rotation}deg)`,
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = `rotate(0deg) scale(1.05)`;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`;
        }}
      >
        {/* Image */}
        <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-100 mb-4 relative">
          <img 
            src={art.imageUrl} 
            alt={art.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x800/FFD166/000000?text=Dessin+en+cours...";
            }}
          />
          {/* Sticker catégorie */}
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full transform rotate-3 shadow-sm">
            {art.category}
          </div>
        </div>

        {/* Caption (Handwritten style) */}
        <div className="text-center">
            <h3 className="font-hand text-2xl font-bold text-gray-800 mb-1">{art.title}</h3>
            <p className="font-hand text-gray-500 text-lg leading-tight">{art.description}</p>
        </div>
        
        {/* Date Stamp */}
        <div className="absolute bottom-4 right-4 text-gray-300 font-mono text-xs opacity-50">
            {art.year}
        </div>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col pt-32 pb-24 px-4 md:px-12 animate-fade-in">
      {/* Gallery Header */}
      <div className="mb-12 max-w-4xl mx-auto w-full text-center">
        <div className="inline-block bg-orange-100 px-4 py-2 rounded-full text-orange-600 font-bold text-sm mb-4 uppercase tracking-wider">
          Le coin des dessins
        </div>
        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">Mes Petites Histoires</h2>
        <p className="font-hand text-2xl text-gray-500">
            Des bouts de Bruxelles et des rêves en couleurs. 🖍️
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto w-full p-4">
        {SAMPLE_ART.map((art, index) => (
          <PolaroidCard key={art.id} art={art} index={index} />
        ))}
      </div>
      
      {/* Footer note */}
      <div className="text-center mt-24">
         <div className="inline-flex items-center gap-2 text-gray-400 font-hand text-xl">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <span>Reviens bientôt, je dessine tous les jours !</span>
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
         </div>
      </div>
    </div>
  );
};

export default Gallery;