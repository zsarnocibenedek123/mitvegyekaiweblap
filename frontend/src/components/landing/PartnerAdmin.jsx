import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Key, Palette, BarChart3, Upload, Settings, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const adminCards = [
  {
    title: 'Ügyfelek',
    value: '47',
    change: '+5 e hónapban',
    icon: Users,
    span: 'md:col-span-4',
    content: (
      <div className="mt-4 space-y-3">
        {['FashionStore.hu', 'SportOutlet.hu', 'EliteDivat.hu'].map((name, i) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E0EFFF] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#0052CC]">{name[0]}</span>
              </div>
              <span className="text-sm text-slate-700 font-medium">{name}</span>
            </div>
            <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] font-bold rounded-full">Aktív</Badge>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'API Kvóta',
    value: '68%',
    change: '680k / 1M kérés',
    icon: Key,
    span: 'md:col-span-4',
    content: (
      <div className="mt-4 space-y-3">
        <Progress value={68} className="h-2 bg-slate-100" />
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#F8FAFC] rounded-lg p-2.5 text-center">
            <p className="text-xs text-slate-500">Ma</p>
            <p className="text-sm font-bold text-[#0A1128]">23.4k</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg p-2.5 text-center">
            <p className="text-xs text-slate-500">Átlag/nap</p>
            <p className="text-sm font-bold text-[#0A1128]">22.6k</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Bevétel',
    value: '2.84M Ft',
    change: '+23% vs. előző hó',
    icon: BarChart3,
    span: 'md:col-span-4',
    content: (
      <div className="mt-4">
        <div className="flex items-end gap-1 h-16">
          {[35, 42, 28, 55, 68, 52, 78, 85, 72, 92, 88, 96].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-[#0052CC] transition-all duration-300 hover:bg-[#0043A6]"
              style={{ height: `${h}%`, opacity: 0.4 + (h / 200) }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-slate-400">
          <span>Jan</span><span>Dec</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Katalógus feltöltés',
    value: null,
    icon: Upload,
    span: 'md:col-span-6',
    content: (
      <div className="mt-3">
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-[#0052CC] transition-colors duration-300 cursor-pointer">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#0A1128]">Húzza ide a CSV/JSON fájlt</p>
          <p className="text-xs text-slate-500 mt-1">vagy kattintson a feltöltéshez</p>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Utolsó szinkron: 2 perce — 12,847 termék
        </div>
      </div>
    ),
  },
  {
    title: 'Téma beállítások',
    value: null,
    icon: Palette,
    span: 'md:col-span-6',
    content: (
      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Elsődleges szín</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0052CC] border-2 border-white shadow-sm" />
            <span className="text-xs font-mono text-slate-500">#0052CC</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Widget pozíció</span>
          <span className="text-xs bg-[#E0EFFF] text-[#0052CC] font-bold px-2.5 py-0.5 rounded-full">Jobb alsó</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Megjelenés</span>
          <span className="text-xs bg-[#E0EFFF] text-[#0052CC] font-bold px-2.5 py-0.5 rounded-full">Buborék</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Nyelv</span>
          <span className="text-xs bg-[#E0EFFF] text-[#0052CC] font-bold px-2.5 py-0.5 rounded-full">Magyar</span>
        </div>
      </div>
    ),
  },
];

export const PartnerAdmin = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="admin" className="py-24 md:py-32 bg-[#F8FAFC]" data-testid="admin-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.2em] text-xs font-bold text-[#0052CC]">
            Partner Admin
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1128]">
            Menedzselje ügyfeleit egy helyen
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Katalógus feltöltés, téma testreszabás, API kulcsok kezelése — minden egy felületen.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {adminCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`${card.span} bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow duration-300`}
                data-testid={`admin-card-${i}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-[#E0EFFF] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#0052CC]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0A1128]">{card.title}</h3>
                      {card.change && <p className="text-[10px] text-slate-500">{card.change}</p>}
                    </div>
                  </div>
                  {card.value && (
                    <span className="text-xl font-extrabold text-[#0A1128] tracking-tight">{card.value}</span>
                  )}
                </div>
                {card.content}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
