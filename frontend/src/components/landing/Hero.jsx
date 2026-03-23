import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FloatingCard = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

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
              <span className="text-[#0052CC]">AI-val</span>, amely valóban érti a vásárlót.
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
              <a href="#developer">
                <Button
                  data-testid="hero-cta-api"
                  variant="outline"
                  size="lg"
                  className="rounded-full border-slate-300 text-slate-700 hover:border-[#0052CC] hover:text-[#0052CC] px-8 h-12 text-base font-semibold transition-colors duration-200"
                >
                  API Dokumentáció
                </Button>
              </a>
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

          {/* Right: Floating Cards */}
          <div className="relative hidden lg:block h-[480px]">
            <FloatingCard
              delay={0.4}
              className="absolute top-0 right-8 glass-card rounded-2xl p-5 shadow-lg floating-animation"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E0EFFF] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#0052CC]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Termék felismerve</p>
                  <p className="text-sm font-bold text-[#0A1128]">Nike Air Max 90</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard
              delay={0.6}
              className="absolute top-28 left-4 glass-card rounded-2xl p-5 shadow-lg floating-animation-delayed"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">AI Matching...</p>
                  <div className="mt-1 h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '87%' }}
                      transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
                      className="h-full bg-[#0052CC] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard
              delay={0.8}
              className="absolute top-56 right-0 glass-card rounded-2xl p-5 shadow-lg floating-animation-slow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0052CC] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">+34%</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Konverzió növekedés</p>
                  <p className="text-sm font-bold text-green-600">Utolsó 30 nap</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard
              delay={1.0}
              className="absolute bottom-16 left-12 glass-card rounded-2xl p-5 shadow-lg floating-animation"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm font-semibold text-[#0A1128]">12 webshop aktív</p>
              </div>
              <div className="mt-2 flex -space-x-2">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-500">{['A','B','C','D'][i]}</span>
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-white bg-[#0052CC] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">+8</span>
                </div>
              </div>
            </FloatingCard>

            {/* Dotted grid background */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="#0052CC" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotGrid)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
