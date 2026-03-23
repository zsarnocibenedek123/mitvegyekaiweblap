import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* ── High-detail sneaker SVG path ── */
const SHOE_PATH = "M 30 95 Q 20 90 18 80 Q 16 68 25 58 Q 32 50 48 46 L 80 40 Q 100 36 130 34 L 180 32 Q 210 31 240 34 Q 270 38 290 46 L 310 56 Q 324 65 328 78 Q 330 88 324 95 Q 318 102 305 105 L 290 108 Q 270 112 240 114 L 200 116 Q 160 117 120 115 L 80 112 Q 50 108 38 100 Z";

const SOLE_PATH = "M 22 92 Q 18 96 20 102 Q 22 108 30 110 L 60 114 Q 100 118 160 120 Q 220 120 270 116 L 300 112 Q 318 108 325 102 Q 330 96 326 92";

const MIDSOLE_PATH = "M 24 92 Q 20 96 22 100 Q 24 104 32 106 L 60 110 Q 100 114 160 115 Q 220 115 270 112 L 298 108 Q 316 104 322 100 Q 326 96 324 92";

export const HeroVisual3D = () => {
  const canvasRef = useRef(null);
  const scanY = useRef(0);
  const dir = useRef(1);
  const frameRef = useRef(null);
  const [hudVisible, setHudVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHudVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 2;
    const W = 580;
    const H = 460;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    // Node positions
    const nodes = [
      { x: 65, y: 50 }, { x: 480, y: 65 }, { x: 85, y: 360 },
      { x: 460, y: 340 }, { x: 260, y: 30 }, { x: 40, y: 210 },
      { x: 530, y: 210 }, { x: 160, y: 400 }, { x: 400, y: 400 },
      { x: 370, y: 40 }, { x: 130, y: 60 }, { x: 500, y: 140 },
    ];

    const conns = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 220) conns.push([i, j]);
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.03)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += 35) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y <= H; y += 35) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Connections
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.06)';
      ctx.lineWidth = 0.6;
      conns.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 82, 204, 0.25)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 82, 204, 0.04)';
        ctx.fill();
      });

      // ── SNEAKER ──
      ctx.save();
      ctx.translate(130, 120);
      ctx.scale(1.55, 1.55);

      // Drop shadow
      ctx.save();
      ctx.translate(3, 8);
      ctx.fillStyle = 'rgba(0, 20, 60, 0.06)';
      ctx.fill(new Path2D(SHOE_PATH));
      ctx.restore();

      // Sole shadow
      ctx.save();
      ctx.translate(2, 6);
      ctx.fillStyle = 'rgba(0, 20, 60, 0.04)';
      ctx.fill(new Path2D(SOLE_PATH));
      ctx.restore();

      // Midsole
      ctx.fillStyle = '#D8DDE8';
      ctx.fill(new Path2D(MIDSOLE_PATH));
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke(new Path2D(MIDSOLE_PATH));

      // Main shoe body
      const shoeGrad = ctx.createLinearGradient(30, 30, 330, 120);
      shoeGrad.addColorStop(0, '#ECEEF4');
      shoeGrad.addColorStop(0.5, '#E4E7F0');
      shoeGrad.addColorStop(1, '#DDE0EB');
      ctx.fillStyle = shoeGrad;
      ctx.fill(new Path2D(SHOE_PATH));

      // Outline
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke(new Path2D(SHOE_PATH));

      // Digital mesh overlay on shoe
      ctx.save();
      ctx.clip(new Path2D(SHOE_PATH));
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.05)';
      ctx.lineWidth = 0.5;
      for (let x = 15; x < 340; x += 18) {
        ctx.beginPath(); ctx.moveTo(x, 25); ctx.lineTo(x, 125); ctx.stroke();
      }
      for (let y = 25; y < 125; y += 14) {
        ctx.beginPath(); ctx.moveTo(15, y); ctx.lineTo(340, y); ctx.stroke();
      }
      ctx.restore();

      // Shoe detail lines
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.06)';
      ctx.lineWidth = 0.8;
      // Swoosh-like accent
      ctx.beginPath();
      ctx.moveTo(80, 85);
      ctx.quadraticCurveTo(160, 50, 260, 65);
      ctx.stroke();

      // Toe accent
      ctx.beginPath();
      ctx.moveTo(50, 70);
      ctx.quadraticCurveTo(65, 55, 90, 50);
      ctx.stroke();

      // ── Scanner Line ──
      scanY.current += dir.current * 0.7;
      if (scanY.current > 80) dir.current = -1;
      if (scanY.current < -15) dir.current = 1;
      const sy = 60 + scanY.current;

      // Scanner glow
      const gGrad = ctx.createLinearGradient(0, sy - 18, 0, sy + 18);
      gGrad.addColorStop(0, 'rgba(0, 82, 204, 0)');
      gGrad.addColorStop(0.35, 'rgba(0, 82, 204, 0.07)');
      gGrad.addColorStop(0.5, 'rgba(0, 82, 204, 0.15)');
      gGrad.addColorStop(0.65, 'rgba(0, 82, 204, 0.07)');
      gGrad.addColorStop(1, 'rgba(0, 82, 204, 0)');
      ctx.fillStyle = gGrad;
      ctx.fillRect(10, sy - 18, 330, 36);

      // Main laser
      ctx.save();
      ctx.shadowColor = '#0052CC';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#0052CC';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(12, sy);
      ctx.lineTo(330, sy);
      ctx.stroke();
      ctx.restore();

      // Laser endpoints
      [12, 330].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(ex, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#0052CC';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, sy, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 82, 204, 0.15)';
        ctx.fill();
      });

      ctx.restore();

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center" data-testid="hero-3d-visual">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full"
      />

      {/* HUD Labels */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute top-[10%] left-[8%]"
        data-testid="hud-object-recognized"
      >
        <div className="hud-label hud-label-recognized">
          <span className="hud-dot hud-dot-green" />
          OBJECT RECOGNIZED
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="absolute top-[28%] right-[2%]"
        data-testid="hud-analyzing"
      >
        <div className="hud-label hud-label-analyzing">
          <span className="hud-dot hud-dot-blue" />
          ANALYZING MESH...
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={hudVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="absolute bottom-[18%] left-[30%]"
        data-testid="hud-match-found"
      >
        <div className="hud-label hud-label-match">
          <span className="hud-dot hud-dot-green" />
          MATCH FOUND: 99.8%
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={hudVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.8 }}
        className="absolute top-[6%] right-[15%]"
      >
        <div className="hud-label" style={{
          background: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(0,82,204,0.12)',
          color: '#94A3B8',
          fontSize: '9px',
        }}>
          EMBEDDING VECTORS: 768D
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={hudVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 2.2 }}
        className="absolute bottom-[32%] right-[6%]"
      >
        <div className="hud-label" style={{
          background: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(0,82,204,0.12)',
          color: '#94A3B8',
          fontSize: '9px',
        }}>
          SIMILARITY: COSINE
        </div>
      </motion.div>
    </div>
  );
};
