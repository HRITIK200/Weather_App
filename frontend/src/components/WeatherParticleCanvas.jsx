import React, { useEffect, useRef } from 'react';

export const WeatherParticleCanvas = ({ condition = 'clear', isEnabled = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const cond = (condition || '').toLowerCase();
    const isRain = cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunder');
    const isSnow = cond.includes('snow');

    const particleCount = isRain ? 65 : isSnow ? 50 : 25;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: isRain ? Math.random() * 20 + 10 : Math.random() * 3 + 2,
        speedX: isRain ? -1.5 : (Math.random() - 0.5) * 0.8,
        speedY: isRain ? Math.random() * 8 + 12 : isSnow ? Math.random() * 1.5 + 1 : Math.random() * 0.4 + 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        radius: isSnow ? Math.random() * 2.5 + 1 : Math.random() * 1.5 + 0.5,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        if (isRain) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180, 220, 255, ${p.opacity * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();
        } else if (isSnow) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Ambient floating light particles
          ctx.beginPath();
          ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity * 0.4})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around bounds
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [condition, isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};
