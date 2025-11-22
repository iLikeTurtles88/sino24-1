
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

const SprayPaint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const isDrawing = useRef(false);
  const currentColor = useRef('#EF476F');
  const mousePos = useRef({ x: 0, y: 0 });

  // Palette de couleurs vibrantes (Sino style)
  const PALETTE = [
    '#EF476F', // Rose
    '#FFD166', // Jaune
    '#06D6A0', // Vert menthe
    '#118AB2', // Bleu
    '#073B4C', // Bleu nuit
    '#9D4EDD', // Violet
    '#FF9F1C', // Orange
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gestion de la taille et du ratio pixel (DPI)
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Logique de dessin (création de particules)
    const spawnParticles = (x: number, y: number, color: string) => {
      const density = 10; // Nombre de gouttes par frame
      const sprayRadius = 25; // Rayon de la bombe

      for (let i = 0; i < density; i++) {
        // Distribution aléatoire dans un cercle (plus dense au centre)
        const angle = Math.random() * Math.PI * 2;
        // Math.random() * Math.random() crée une concentration au centre
        const radius = Math.random() * Math.random() * sprayRadius; 
        
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;

        particles.current.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 0.2, // Mouvement réduit
          vy: (Math.random() - 0.5) * 0.2, // Mouvement réduit
          size: Math.random() * 2 + 0.5, // Taille variée
          color: color,
          life: 1.0, // Opacité de départ (100%)
          // Durée de vie longue (1 à 3 secondes)
          maxLife: 0.005 + Math.random() * 0.005 
        });
      }
    };

    // Boucle d'animation
    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Si on dessine, ajouter des particules
      if (isDrawing.current) {
        spawnParticles(mousePos.current.x, mousePos.current.y, currentColor.current);
      }

      // Mettre à jour et dessiner les particules
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        
        // Mouvement
        p.x += p.vx;
        p.y += p.vy;
        
        // Vieillissement
        p.life -= p.maxLife;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life; // Transparence basée sur la vie
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    // --- MOUSE EVENTS ---
    const handleMouseDown = (e: MouseEvent) => {
      currentColor.current = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      isDrawing.current = true;
      mousePos.current = { x: e.clientX, y: e.clientY };
      spawnParticles(e.clientX, e.clientY, currentColor.current);
    };

    const handleMouseUp = () => { isDrawing.current = false; };
    const handleMouseMove = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };

    // --- TOUCH EVENTS (Mobile) ---
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        currentColor.current = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        isDrawing.current = true;
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        spawnParticles(e.touches[0].clientX, e.touches[0].clientY, currentColor.current);
      }
    };

    const handleTouchEnd = () => { isDrawing.current = false; };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
         // On ne preventDefault PAS pour permettre le scroll, mais on dessine quand même
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    // Attach Mouse
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Attach Touch
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9000]"
      style={{ touchAction: 'none' }}
    />
  );
};

export default SprayPaint;
