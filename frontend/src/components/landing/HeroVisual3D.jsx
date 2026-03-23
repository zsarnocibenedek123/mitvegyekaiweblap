import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const HeroVisual3D = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const [hudVisible, setHudVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHudVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 2;
    const W = 520;
    const H = 520;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;
    const R = 160; // sphere radius

    // Product vector points inside the sphere (3D coords)
    const products = [];
    for (let i = 0; i < 40; i++) {
      // Random points inside sphere
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 2;
      } while (x * x + y * y + z * z > 1);
      products.push({
        x: x * R * 0.85,
        y: y * R * 0.85,
        z: z * R * 0.85,
        size: 2 + Math.random() * 2.5,
        brightness: 0.2 + Math.random() * 0.3,
      });
    }

    // Needle state
    const needle = {
      targetIdx: 0,
      currentAngleXY: 0,
      currentAngleXZ: 0,
      targetAngleXY: 0,
      targetAngleXZ: 0,
      phase: 'searching', // searching | locking | locked
      lockTimer: 0,
      searchSpeed: 0,
      highlightIntensity: 0,
    };

    // Pick first target
    needle.targetIdx = Math.floor(Math.random() * products.length);
    needle.phase = 'searching';
    needle.searchSpeed = 3;

    function project(x3, y3, z3, rotY, rotX) {
      // Rotate around Y axis
      let x = x3 * Math.cos(rotY) - z3 * Math.sin(rotY);
      let z = x3 * Math.sin(rotY) + z3 * Math.cos(rotY);
      let y = y3;
      // Rotate around X axis
      const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
      const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
      // Simple perspective
      const scale = 600 / (600 + z2);
      return {
        x: cx + x * scale,
        y: cy + y2 * scale,
        z: z2,
        scale,
      };
    }

    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, W, H);

      const rotY = time * 0.15;
      const rotX = 0.2;

      // ── SPHERE SHELL ──
      // Outer glow
      const outerGlow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.3);
      outerGlow.addColorStop(0, 'rgba(0, 82, 204, 0.04)');
      outerGlow.addColorStop(1, 'rgba(0, 82, 204, 0)');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, W, H);

      // Frosted glass sphere
      const sphereGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
      sphereGrad.addColorStop(0, 'rgba(240, 245, 255, 0.6)');
      sphereGrad.addColorStop(0.5, 'rgba(230, 238, 250, 0.35)');
      sphereGrad.addColorStop(0.85, 'rgba(210, 225, 248, 0.2)');
      sphereGrad.addColorStop(1, 'rgba(200, 218, 245, 0.08)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Sphere border
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Latitude/longitude wireframe lines
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.04)';
      ctx.lineWidth = 0.5;
      for (let lat = -2; lat <= 2; lat++) {
        const angle = (lat / 3) * Math.PI;
        const r = Math.cos(angle) * R;
        const yOff = Math.sin(angle) * R;
        ctx.beginPath();
        ctx.ellipse(cx, cy + yOff * Math.cos(rotX), Math.max(1, r), Math.max(1, Math.abs(r * 0.3)), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ── PRODUCT POINTS (inside sphere) ──
      const projectedProducts = products.map((p, i) => {
        const pr = project(p.x, p.y, p.z, rotY, rotX);
        return { ...pr, idx: i, size: p.size * pr.scale, brightness: p.brightness };
      });

      // Sort by z for depth ordering
      projectedProducts.sort((a, b) => a.z - b.z);

      // ── NEEDLE LOGIC ──
      const target = products[needle.targetIdx];
      const targetProj = project(target.x, target.y, target.z, rotY, rotX);

      if (needle.phase === 'searching') {
        // Needle spins and searches
        needle.currentAngleXY += needle.searchSpeed * 0.016;
        needle.searchSpeed *= 0.992; // slow down

        // Calculate target angle
        const dx = targetProj.x - cx;
        const dy = targetProj.y - cy;
        needle.targetAngleXY = Math.atan2(dy, dx);

        // When search speed is low enough, start locking
        if (needle.searchSpeed < 0.8) {
          needle.phase = 'locking';
        }
      } else if (needle.phase === 'locking') {
        // Smoothly lerp to target
        const dx = targetProj.x - cx;
        const dy = targetProj.y - cy;
        needle.targetAngleXY = Math.atan2(dy, dx);

        let diff = needle.targetAngleXY - needle.currentAngleXY;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        needle.currentAngleXY += diff * 0.06;

        needle.highlightIntensity = Math.min(1, needle.highlightIntensity + 0.015);

        if (Math.abs(diff) < 0.05) {
          needle.phase = 'locked';
          needle.lockTimer = 0;
        }
      } else if (needle.phase === 'locked') {
        // Stay locked, track target
        const dx = targetProj.x - cx;
        const dy = targetProj.y - cy;
        needle.targetAngleXY = Math.atan2(dy, dx);
        needle.currentAngleXY = needle.targetAngleXY;

        needle.lockTimer += 0.016;
        needle.highlightIntensity = 0.7 + Math.sin(time * 3) * 0.3;

        // After some time, pick new target
        if (needle.lockTimer > 3.5) {
          needle.targetIdx = (needle.targetIdx + 1 + Math.floor(Math.random() * (products.length - 1))) % products.length;
          needle.phase = 'searching';
          needle.searchSpeed = 2.5 + Math.random() * 2;
          needle.highlightIntensity = 0;
          needle.lockTimer = 0;
        }
      }

      // ── DRAW PRODUCT DOTS ──
      projectedProducts.forEach((p) => {
        const isTarget = p.idx === needle.targetIdx;
        const depthFade = 0.3 + ((p.z + R) / (2 * R)) * 0.7;

        if (isTarget && needle.highlightIntensity > 0) {
          // Highlighted target
          const hi = needle.highlightIntensity;

          // Outer glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 5 * hi, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 82, 204, ${0.06 * hi})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3 * hi, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 82, 204, ${0.12 * hi})`;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 82, 204, ${0.9 * hi})`;
          ctx.fill();

          // Ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5 * hi, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 82, 204, ${0.35 * hi})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // Normal dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 130, 180, ${p.brightness * depthFade})`;
          ctx.fill();
        }
      });

      // ── DRAW NEEDLE ──
      const needleLen = R * 0.82;
      const angle = needle.currentAngleXY;
      const nx1 = cx + Math.cos(angle) * needleLen;
      const ny1 = cy + Math.sin(angle) * needleLen;
      const nx2 = cx - Math.cos(angle) * needleLen * 0.2;
      const ny2 = cy - Math.sin(angle) * needleLen * 0.2;

      // Needle glow
      ctx.save();
      ctx.shadowColor = '#0052CC';
      ctx.shadowBlur = 10;

      // Needle body (front - blue)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx1, ny1);
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.7)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Needle body (back - faded)
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx2, ny2);
      ctx.strokeStyle = 'rgba(0, 82, 204, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Needle tip glow
      ctx.beginPath();
      ctx.arc(nx1, ny1, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 82, 204, 0.6)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nx1, ny1, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 82, 204, 0.1)';
      ctx.fill();

      // Center pivot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 82, 204, 0.15)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 82, 204, 0.5)';
      ctx.fill();

      // ── Light beam from needle to target when locked ──
      if (needle.phase === 'locked' || (needle.phase === 'locking' && needle.highlightIntensity > 0.3)) {
        const beamAlpha = needle.highlightIntensity * 0.15;
        ctx.beginPath();
        ctx.moveTo(nx1, ny1);
        ctx.lineTo(targetProj.x, targetProj.y);
        ctx.strokeStyle = `rgba(0, 82, 204, ${beamAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ── Top specular highlight on sphere ──
      const specGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.35, 0, cx - R * 0.25, cy - R * 0.35, R * 0.5);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = specGrad;
      ctx.fill();

      frameRef.current = requestAnimationFrame(draw);
    };

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
        initial={{ opacity: 0, y: -8 }}
        animate={hudVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute top-[3%] left-[50%] -translate-x-1/2"
        style={{ zIndex: 3 }}
        data-testid="hud-query-vector"
      >
        <div className="hud-label hud-label-analyzing">
          <span className="hud-dot hud-dot-blue" />
          QUERY VEKTOR KERESÉS
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="absolute top-[28%] left-[1%]"
        style={{ zIndex: 3 }}
        data-testid="hud-embedding"
      >
        <div className="hud-label" style={{
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(0,82,204,0.12)',
          color: '#64748B',
          fontSize: '9px',
        }}>
          EMBEDDING TÉR: 768D
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="absolute top-[20%] right-[2%]"
        style={{ zIndex: 3 }}
        data-testid="hud-products"
      >
        <div className="hud-label" style={{
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(148,163,184,0.2)',
          color: '#64748B',
          fontSize: '9px',
        }}>
          40 TERMÉKVEKTOR
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={hudVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.8 }}
        className="absolute bottom-[22%] right-[5%]"
        style={{ zIndex: 3 }}
        data-testid="hud-cosine"
      >
        <div className="hud-label hud-label-recognized">
          <span className="hud-dot hud-dot-green" />
          COSINE SIMILARITY
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={hudVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 2.2 }}
        className="absolute bottom-[6%] left-[50%] -translate-x-1/2"
        style={{ zIndex: 3 }}
        data-testid="hud-match"
      >
        <div className="hud-label hud-label-match">
          <span className="hud-dot hud-dot-green" />
          LEGKÖZELEBBI VEKTOR MEGTALÁLVA
        </div>
      </motion.div>
    </div>
  );
};
