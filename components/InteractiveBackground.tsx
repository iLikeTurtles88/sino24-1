
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const InteractiveBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffbeb); // Fond crème de base

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, // Important pour le fond clair
      antialias: true, 
    });

    const container = mountRef.current;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    
    container.appendChild(renderer.domElement);

    // --- SHADER DOUX (Nuages Pastels) ---
    const bgGeometry = new THREE.PlaneGeometry(40, 40); 
    const bgVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const bgFragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      varying vec2 vUv;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        float aspect = uResolution.x / uResolution.y;
        st.x *= aspect;

        // Ralentir le temps pour un effet apaisant
        float t = uTime * 0.1;
        
        // Interaction souris douce
        vec2 mouseEffect = (uMouse - 0.5) * 0.2;

        // Création de formes "nuageuses"
        float n1 = snoise(st * 0.8 + t + mouseEffect);
        float n2 = snoise(st * 1.5 - t * 0.5);
        
        float clouds = n1 * 0.5 + n2 * 0.3;

        // Palette Pastel
        vec3 cream = vec3(1.0, 0.99, 0.94); // Fond papier
        vec3 softBlue = vec3(0.7, 0.85, 0.95); // Bleu ciel doux
        vec3 softPink = vec3(1.0, 0.8, 0.8); // Rose pèche
        vec3 softYellow = vec3(1.0, 0.9, 0.6); // Soleil

        vec3 color = cream;
        color = mix(color, softBlue, smoothstep(-0.5, 0.5, n1));
        color = mix(color, softYellow, smoothstep(0.2, 0.8, n2));
        color = mix(color, softPink, smoothstep(-0.8, -0.2, clouds) * 0.5);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: bgVertexShader,
      fragmentShader: bgFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
      },
      depthWrite: false, 
    });

    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.z = -5; 
    scene.add(bgMesh);

    // --- FORMES FLOTTANTES (Papiers découpés) ---
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    const shapeGeom = new THREE.CircleGeometry(0.5, 32);
    const shapes: THREE.Mesh[] = [];

    const colors = [0xFF9B9B, 0xFFD166, 0x06D6A0, 0x118AB2]; // Palette vibrante

    for(let i = 0; i < 15; i++) {
      const mat = new THREE.MeshBasicMaterial({ 
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.6
      });
      const mesh = new THREE.Mesh(shapeGeom, mat);
      
      // Position aléatoire large
      mesh.position.x = (Math.random() - 0.5) * 20;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 5;
      
      const scale = 0.5 + Math.random() * 1.5;
      mesh.scale.set(scale, scale, 1);
      
      shapesGroup.add(mesh);
      shapes.push(mesh);
    }

    // --- ANIMATION LOOP ---
    let frameId: number;
    const clock = new THREE.Clock();
    let mouseX = 0.5;
    let mouseY = 0.5;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      bgMaterial.uniforms.uTime.value = elapsedTime;
      bgMaterial.uniforms.uMouse.value.x += (mouseX - bgMaterial.uniforms.uMouse.value.x) * 0.05;
      bgMaterial.uniforms.uMouse.value.y += (mouseY - bgMaterial.uniforms.uMouse.value.y) * 0.05;

      // Animation des formes
      shapes.forEach((mesh, i) => {
        mesh.position.y += Math.sin(elapsedTime * 0.5 + i) * 0.005;
        mesh.position.x += Math.cos(elapsedTime * 0.3 + i) * 0.005;
        mesh.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const currentDpr = renderer.getPixelRatio();
      bgMaterial.uniforms.uResolution.value.set(w * currentDpr, h * currentDpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - (e.clientY / window.innerHeight);
    };

    // Support mobile pour l'interaction
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX / window.innerWidth;
        mouseY = 1.0 - (e.touches[0].clientY / window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default InteractiveBackground;
