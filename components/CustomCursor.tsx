import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  
  // Position brute de la souris
  const mousePos = useRef({ x: 0, y: 0 });
  // Position lissée du curseur
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Créer une onde avec un ID unique
      const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() };
      setRipples((prev) => [...prev, newRipple]);
      
      // Supprimer l'onde après l'animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const onMouseUp = () => {
      setIsClicking(false);
    };

    // Détection des éléments interactifs
    const onMouseEnterInteractive = () => setIsHovering(true);
    const onMouseLeaveInteractive = () => setIsHovering(false);

    // Attacher les écouteurs
    const attachListeners = () => {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .cursor-pointer');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnterInteractive);
            el.addEventListener('mouseleave', onMouseLeaveInteractive);
        });
        return interactiveElements;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    let interactiveEls = attachListeners();

    const observer = new MutationObserver(() => {
        interactiveEls.forEach(el => {
            el.removeEventListener('mouseenter', onMouseEnterInteractive);
            el.removeEventListener('mouseleave', onMouseLeaveInteractive);
        });
        interactiveEls = attachListeners();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    let rafId: number;
    const animate = () => {
      const lerpFactor = 0.2; // Plus réactif
      
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerpFactor;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
      return null;
  }

  return (
    <>
      <style>{`
        body {
            cursor: none;
        }
        a, button, input, textarea {
            cursor: none; 
        }
        @keyframes ripple-effect {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; border-width: 4px; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; border-width: 0px; }
        }
        .ripple {
          position: fixed;
          border-radius: 50%;
          border: 3px solid #118AB2; /* Bleu Sino */
          background: transparent;
          width: 40px;
          height: 40px;
          pointer-events: none;
          z-index: 9998;
          animation: ripple-effect 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      
      {/* Curseurs Ondes (Ripples) */}
      {ripples.map((ripple) => (
        <div 
            key={ripple.id}
            className="ripple"
            style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {/* Curseur Principal */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-all duration-150 ease-out flex items-center justify-center rounded-full border-2 border-black`}
        style={{ 
            width: isHovering ? '50px' : '20px',
            height: isHovering ? '50px' : '20px',
            backgroundColor: isHovering ? 'rgba(255, 209, 102, 0.5)' : '#EF476F', // Jaune transparent au survol, Rose vif par défaut
            transform: `scale(${isClicking ? 0.8 : 1})`, // Effet de presse
        }}
      />
    </>
  );
};

export default CustomCursor;