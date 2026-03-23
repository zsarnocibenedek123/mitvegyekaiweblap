import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Database, Search, SlidersHorizontal, Brain } from 'lucide-react';

const steps = [
  {
    icon: Database,
    step: '01',
    title: 'Katalógus szinkronizálás',
    desc: 'JSON + Embeddingek generálása automatikusan. A termékadatok valós időben szinkronizálódnak.',
    color: '#0052CC',
    bgColor: '#E0EFFF',
  },
  {
    icon: Search,
    step: '02',
    title: 'Hibrid keresés',
    desc: 'Szemantikus + Lexikai keresés egyszerre. A rendszer érti a szándékot, nem csak a kulcsszavakat.',
    color: '#0052CC',
    bgColor: '#E0EFFF',
  },
  {
    icon: SlidersHorizontal,
    step: '03',
    title: 'Hard szűrők',
    desc: 'Szín, Költségkeret, Nem, Kapcsolat — precíz szűrés, hogy csak a releváns termékek maradjanak.',
    color: '#0052CC',
    bgColor: '#E0EFFF',
  },
  {
    icon: Brain,
    step: '04',
    title: 'LLM újrarangsorolás',
    desc: 'AI-generált indoklás minden termékhez.',
    color: '#0052CC',
    bgColor: '#E0EFFF',
  },
];

const StepCard = ({ step, index, isInView }) => {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay: index * 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      data-testid={`pipeline-step-${index + 1}`}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: step.bgColor }}
          >
            <Icon className="w-6 h-6" style={{ color: step.color }} />
          </div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#0052CC]">
            {step.step}. lépés
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#0A1128] mb-2 tracking-tight">{step.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
      </div>

      {/* Connector line (desktop) */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-1/2 -right-4 w-8 z-10">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.3 + 0.5 }}
            className="h-0.5 bg-gradient-to-r from-[#0052CC] to-[#93C5FD] origin-left"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.3 + 0.8 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#0052CC]"
          />
        </div>
      )}
    </motion.div>
  );
};

export const Pipeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-200px' });

  return (
    <section id="pipeline" className="py-24 md:py-32 bg-[#F8FAFC]" data-testid="pipeline-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.2em] text-xs font-bold text-[#0052CC]">
            Hogyan működik
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1128]">
            Az Ajánlási Pipeline
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Négy lépésben a katalógusból személyre szabott, indokolt ajánlásig.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <StepCard key={step.step} step={step} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};
