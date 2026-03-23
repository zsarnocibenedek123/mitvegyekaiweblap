import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SHOE_IMG_URL = '/sneaker_clean.png';

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
    canvas.style.width = '100%';
    canvas.style.height = '100%';
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

    // Scanner area matches the shoe image position
    const scanLeft = 90;
    const scanRight = 490;
    const scanTop = 60;
    const scanBottom = 400;

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

      // Digital mesh overlay on shoe area
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.035)';
      ctx.lineWidth = 0.5;
      for (let x = scanLeft; x < scanRight; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, scanTop); ctx.lineTo(x, scanBottom); ctx.stroke();
      }
      for (let y = scanTop; y < scanBottom; y += 20) {
        ctx.beginPath(); ctx.moveTo(scanLeft, y); ctx.lineTo(scanRight, y); ctx.stroke();
      }

      // ── Scanner Line ──
      scanY.current += dir.current * 0.7;
      if (scanY.current > (scanBottom - scanTop) - 20) dir.current = -1;
      if (scanY.current < 10) dir.current = 1;
      const sy = scanTop + scanY.current;

      // Scanner glow
      const gGrad = ctx.createLinearGradient(0, sy - 22, 0, sy + 22);
      gGrad.addColorStop(0, 'rgba(0, 82, 204, 0)');
      gGrad.addColorStop(0.35, 'rgba(0, 82, 204, 0.06)');
      gGrad.addColorStop(0.5, 'rgba(0, 82, 204, 0.14)');
      gGrad.addColorStop(0.65, 'rgba(0, 82, 204, 0.06)');
      gGrad.addColorStop(1, 'rgba(0, 82, 204, 0)');
      ctx.fillStyle = gGrad;
      ctx.fillRect(scanLeft - 30, sy - 22, (scanRight - scanLeft) + 60, 44);

      // Main laser
      ctx.save();
      ctx.shadowColor = '#0052CC';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#0052CC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanLeft - 30, sy);
      ctx.lineTo(scanRight + 30, sy);
      ctx.stroke();
      ctx.restore();

      // Laser endpoints
      [scanLeft - 30, scanRight + 30].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(ex, sy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0052CC';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, sy, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 82, 204, 0.15)';
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center" data-testid="hero-3d-visual">
      {/* Sneaker image behind canvas */}
      <motion.img
        src={SHOE_IMG_URL}
        alt="Sneaker 3D scan"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 w-[70%] h-[75%] object-contain m-auto pointer-events-none select-none"
        draggable={false}
        style={{ zIndex: 1 }}
      />

      {/* Canvas overlay with scanner, grid, nodes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
      />

      {/* HUD Labels */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute top-[8%] left-[3%]"
        style={{ zIndex: 3 }}
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
        className="absolute top-[22%] right-[1%]"
        style={{ zIndex: 3 }}
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
        className="absolute bottom-[10%] left-[25%]"
        style={{ zIndex: 3 }}
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
        className="absolute top-[4%] right-[10%]"
        style={{ zIndex: 3 }}
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
        className="absolute bottom-[25%] right-[3%]"
        style={{ zIndex: 3 }}
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
