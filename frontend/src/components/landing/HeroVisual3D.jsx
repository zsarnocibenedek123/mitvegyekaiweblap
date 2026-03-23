import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const HeroVisual3D = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const timeRef = useRef(0);
  const [hudVisible, setHudVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHudVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 2;
    const W = 540;
    const H = 480;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ctx.scale(dpr, dpr);

    // Card definitions (4 glass panels, funnel: big->small)
    const cards = [
      { x: 70, y: 40, w: 340, h: 380, opacity: 0.35, label: 'Teljes katalógus', dots: 120, dotOrder: 0 },
      { x: 115, y: 70, w: 290, h: 330, opacity: 0.45, label: 'Szemantikus szűrés', dots: 55, dotOrder: 1 },
      { x: 155, y: 100, w: 240, h: 280, opacity: 0.55, label: 'Relevancia rangsor', dots: 18, dotOrder: 2 },
      { x: 190, y: 130, w: 195, h: 230, opacity: 0.85, label: 'Tökéletes találat', dots: 1, dotOrder: 3 },
    ];

    // Pre-generate dot positions for each card (seeded)
    const cardDots = cards.map((card, ci) => {
      const dots = [];
      const seed = ci * 1000;
      for (let i = 0; i < card.dots; i++) {
        const px = pseudoRandom(seed + i * 3) * (card.w - 24) + 12;
        const py = pseudoRandom(seed + i * 3 + 1) * (card.h - 40) + 28;
        const size = 1.5 + pseudoRandom(seed + i * 3 + 2) * 2;
        dots.push({ px, py, size, phase: pseudoRandom(seed + i * 7) * Math.PI * 2 });
      }
      return dots;
    });

    function pseudoRandom(seed) {
      let x = Math.sin(seed * 9301 + 49297) * 49297;
      return x - Math.floor(x);
    }

    // Particles flowing between cards
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        fromCard: Math.floor(i / 7),
        t: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
        x: 0, y: 0,
        size: 1 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, W, H);

      // Draw each card
      cards.forEach((card, ci) => {
        const floatY = Math.sin(t * 0.8 + ci * 0.7) * 4;
        const cx = card.x;
        const cy = card.y + floatY;

        // Card shadow
        ctx.fillStyle = `rgba(0, 40, 120, ${0.03 + ci * 0.01})`;
        ctx.beginPath();
        roundRect(ctx, cx + 4, cy + 6, card.w, card.h, 16);
        ctx.fill();

        // Glass card background
        ctx.fillStyle = `rgba(255, 255, 255, ${card.opacity})`;
        ctx.beginPath();
        roundRect(ctx, cx, cy, card.w, card.h, 16);
        ctx.fill();

        // Glass border
        ctx.strokeStyle = ci === 3
          ? 'rgba(0, 82, 204, 0.35)'
          : `rgba(0, 82, 204, ${0.06 + ci * 0.04})`;
        ctx.lineWidth = ci === 3 ? 1.5 : 0.8;
        ctx.beginPath();
        roundRect(ctx, cx, cy, card.w, card.h, 16);
        ctx.stroke();

        // Card label at top
        ctx.fillStyle = ci === 3 ? 'rgba(0, 82, 204, 0.8)' : 'rgba(100, 116, 139, 0.5)';
        ctx.font = `${ci === 3 ? '600' : '500'} 10px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(card.label.toUpperCase(), cx + 14, cy + 18);

        // Draw dots
        const dots = cardDots[ci];
        dots.forEach((dot, di) => {
          const dx = cx + dot.px;
          const dy = cy + dot.py;

          if (ci === 3) {
            // Final card: single glowing blue product
            const pulse = Math.sin(t * 2) * 0.15 + 0.85;

            // Outer glow
            ctx.beginPath();
            ctx.arc(cx + card.w / 2, cy + card.h / 2 + 10, 28, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 82, 204, ${0.08 * pulse})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx + card.w / 2, cy + card.h / 2 + 10, 18, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 82, 204, ${0.15 * pulse})`;
            ctx.fill();

            // Product silhouette (rounded rect)
            const px = cx + card.w / 2 - 20;
            const py2 = cy + card.h / 2 - 12;
            ctx.fillStyle = `rgba(0, 82, 204, ${0.18 * pulse})`;
            ctx.beginPath();
            roundRect(ctx, px, py2, 40, 48, 8);
            ctx.fill();
            ctx.strokeStyle = `rgba(0, 82, 204, ${0.5 * pulse})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            roundRect(ctx, px, py2, 40, 48, 8);
            ctx.stroke();

            // Checkmark
            ctx.save();
            ctx.strokeStyle = `rgba(0, 82, 204, ${0.9 * pulse})`;
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cx + card.w / 2 - 7, cy + card.h / 2 + 12);
            ctx.lineTo(cx + card.w / 2 - 1, cy + card.h / 2 + 18);
            ctx.lineTo(cx + card.w / 2 + 9, cy + card.h / 2 + 4);
            ctx.stroke();
            ctx.restore();
          } else {
            // Other cards: scattered dots
            const wobble = Math.sin(t * 1.2 + dot.phase) * (ci === 0 ? 3 : ci === 1 ? 1.5 : 0.5);
            const dotAlpha = ci === 0 ? 0.15 : ci === 1 ? 0.25 : 0.4;
            const dotColor = ci === 2 ? `rgba(0, 82, 204, ${dotAlpha})` : `rgba(148, 163, 184, ${dotAlpha})`;

            ctx.beginPath();
            ctx.arc(dx + wobble, dy + wobble * 0.5, dot.size, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
          }
        });

        // Step number badge
        if (ci < 3) {
          const badgeX = cx + card.w - 28;
          const badgeY = cy + 10;
          ctx.fillStyle = 'rgba(0, 82, 204, 0.06)';
          ctx.beginPath();
          ctx.arc(badgeX, badgeY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(0, 82, 204, 0.35)';
          ctx.font = "bold 9px 'JetBrains Mono', monospace";
          ctx.textAlign = 'center';
          ctx.fillText(`${ci + 1}`, badgeX, badgeY + 3);
        }
      });

      // Animate particles flowing between cards (funnel effect)
      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) { p.t = 0; p.fromCard = (p.fromCard + 1) % 3; }

        const fromCard = cards[p.fromCard];
        const toCard = cards[p.fromCard + 1];
        if (!toCard) return;

        const floatFrom = Math.sin(t * 0.8 + p.fromCard * 0.7) * 4;
        const floatTo = Math.sin(t * 0.8 + (p.fromCard + 1) * 0.7) * 4;

        const x1 = fromCard.x + fromCard.w / 2;
        const y1 = fromCard.y + floatFrom + fromCard.h * 0.7;
        const x2 = toCard.x + toCard.w / 2;
        const y2 = toCard.y + floatTo + toCard.h * 0.3;

        p.x = x1 + (x2 - x1) * p.t;
        p.y = y1 + (y2 - y1) * p.t + Math.sin(p.t * Math.PI) * -15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 82, 204, ${p.opacity * (1 - p.t * 0.5)})`;
        ctx.fill();

        // Trail
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 82, 204, ${p.opacity * 0.08})`;
        ctx.fill();
      });

      // Funnel arrows between cards
      for (let i = 0; i < 3; i++) {
        const from = cards[i];
        const to = cards[i + 1];
        const floatF = Math.sin(t * 0.8 + i * 0.7) * 4;
        const floatT = Math.sin(t * 0.8 + (i + 1) * 0.7) * 4;
        const ax = (from.x + from.w / 2 + to.x + to.w / 2) / 2;
        const ay = from.y + floatF + from.h + ((to.y + floatT - (from.y + floatF + from.h)) / 2);

        // Small downward arrow
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 82, 204, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ax, ay - 4);
        ctx.lineTo(ax, ay + 4);
        ctx.moveTo(ax - 3, ay + 1);
        ctx.lineTo(ax, ay + 4);
        ctx.lineTo(ax + 3, ay + 1);
        ctx.stroke();
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    function roundRect(ctx2, x, y, w, h, r) {
      ctx2.moveTo(x + r, y);
      ctx2.lineTo(x + w - r, y);
      ctx2.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx2.lineTo(x + w, y + h - r);
      ctx2.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx2.lineTo(x + r, y + h);
      ctx2.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx2.lineTo(x, y + r);
      ctx2.quadraticCurveTo(x, y, x + r, y);
      ctx2.closePath();
    }

    draw();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full" data-testid="hero-3d-visual">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* HUD Labels */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="absolute top-[6%] left-[4%]"
        style={{ zIndex: 3 }}
        data-testid="hud-catalog-label"
      >
        <div className="hud-label" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(148,163,184,0.2)', color: '#64748B', fontSize: '9px' }}>
          12,847 TERMÉK
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: 1.2 }}
        className="absolute top-[18%] right-[2%]"
        style={{ zIndex: 3 }}
        data-testid="hud-semantic-label"
      >
        <div className="hud-label hud-label-analyzing">
          <span className="hud-dot hud-dot-blue" />
          SZEMANTIKUS SZŰRÉS
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: 1.6 }}
        className="absolute top-[42%] right-[0%]"
        style={{ zIndex: 3 }}
        data-testid="hud-ranking-label"
      >
        <div className="hud-label hud-label-recognized">
          <span className="hud-dot hud-dot-green" />
          RELEVANCIA RANGSOROLVA
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={hudVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 2.0 }}
        className="absolute bottom-[14%] left-[28%]"
        style={{ zIndex: 3 }}
        data-testid="hud-match-label"
      >
        <div className="hud-label hud-label-match">
          <span className="hud-dot hud-dot-green" />
          TÖKÉLETES TALÁLAT: 99.8%
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={hudVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 2.4 }}
        className="absolute top-[4%] right-[15%]"
        style={{ zIndex: 3 }}
      >
        <div className="hud-label" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,82,204,0.1)', color: '#94A3B8', fontSize: '9px' }}>
          EMBEDDING: 768D
        </div>
      </motion.div>
    </div>
  );
};
