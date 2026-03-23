import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeroVisual3D } from './HeroVisual3D';

export const Hero = ({ onDemoClick }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen flex items-center pt-20 pb-24 overflow-hidden landing-gradient-mesh"
    >
      {/* Background decorations */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-[10%] w-72 h-72 rounded-full bg-[#0052CC]/[0.04] blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-[#0052CC]/[0.03] blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div style={{ opacity }} className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                data-testid="hero-badge"
                className="mb-6 bg-[#E0EFFF] text-[#0052CC] hover:bg-[#E0EFFF] border-none uppercase tracking-[0.2em] text-xs font-bold px-4 py-1.5 rounded-full"
              >
                Új generációs ajánlómotor
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A1128] leading-[1.1]"
              data-testid="hero-headline"
            >
              Váltsd eladássá a keresést egy{' '}
              <span className="text-[#0052CC]">AI-al</span>, amely valóban érti a vásárlót.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base md:text-lg leading-relaxed text-slate-600 max-w-lg"
              data-testid="hero-subheadline"
            >
              API-első ajánlómotor, amely hibrid kereséssel és LLM rangsorolással pontosan azt adja a vevőidnek, amit keresnek.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button
                data-testid="hero-cta-demo"
                size="lg"
                className="rounded-full bg-[#0052CC] hover:bg-[#0043A6] text-white px-8 h-12 text-base font-semibold group transition-colors duration-200"
                onClick={onDemoClick}
              >
                Widget Demó indítása
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex items-center gap-6 text-sm text-slate-500"
            >
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#0052CC]" /> GDPR kompatibilis</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#0052CC]" /> 50ms válaszidő</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-[#0052CC]" /> +34% konverzió</span>
            </motion.div>
          </motion.div>

          {/* Right: AI Neural Network Visual */}
          <div className="relative hidden lg:block h-[520px] overflow-hidden">
            <HeroVisual3D />
          </div>
        </div>
      </div>
    </section>
  );
};
