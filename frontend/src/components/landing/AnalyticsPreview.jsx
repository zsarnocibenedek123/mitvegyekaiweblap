import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, MousePointerClick, Eye, ArrowUpRight } from 'lucide-react';

const mrrData = [
  { month: 'Jan', mrr: 420 },
  { month: 'Feb', mrr: 680 },
  { month: 'Már', mrr: 890 },
  { month: 'Ápr', mrr: 1200 },
  { month: 'Máj', mrr: 1850 },
  { month: 'Jún', mrr: 2340 },
  { month: 'Júl', mrr: 2980 },
  { month: 'Aug', mrr: 3250 },
];

const conversionData = [
  { name: '0-10k', rate: 12 },
  { name: '10-20k', rate: 28 },
  { name: '20-30k', rate: 42 },
  { name: '30-50k', rate: 38 },
  { name: '50k+', rate: 22 },
];

const topSearches = [
  { term: 'sportcipő férfi', count: 1247 },
  { term: 'ajándék nőnek', count: 982 },
  { term: 'téli kabát', count: 876 },
  { term: 'futócipő', count: 721 },
  { term: 'alkalmi ruha', count: 654 },
];

const StatCard = ({ icon: Icon, label, value, change, index, isInView }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-300"
    data-testid={`stat-card-${index}`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 rounded-lg bg-[#E0EFFF] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#0052CC]" />
      </div>
      <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
        <ArrowUpRight className="w-3 h-3" />{change}
      </span>
    </div>
    <p className="text-2xl font-extrabold text-[#0A1128] tracking-tight">{value}</p>
    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-lg rounded-lg px-3 py-2 text-xs">
        <p className="font-bold text-[#0A1128]">{label}</p>
        <p className="text-[#0052CC] font-semibold">{payload[0].value.toLocaleString()}{payload[0].dataKey === 'rate' ? '%' : 'k Ft'}</p>
      </div>
    );
  }
  return null;
};

export const AnalyticsPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { icon: MousePointerClick, label: 'Átkattintási arány (CTR)', value: '8.4%', change: '+2.1%' },
    { icon: TrendingUp, label: 'Konverziós ráta', value: '4.7%', change: '+1.3%' },
    { icon: Eye, label: 'Widget megnyitások / nap', value: '2,847', change: '+18%' },
  ];

  return (
    <section id="analytics" className="py-24 md:py-32" data-testid="analytics-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.2em] text-xs font-bold text-[#0052CC]">
            Analitika
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1128]">
            Valós idejű ROI követés
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Átlátható statisztikák a konverzióktól a keresési mintázatokig.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-card rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden"
          data-testid="analytics-dashboard"
        >
          {/* Dashboard header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-[#0A1128]">Dashboard</span>
              <span className="text-xs text-slate-500">Utolsó 30 nap</span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-[#E0EFFF] text-[#0052CC] font-bold px-3 py-1 rounded-full">Áttekintés</span>
              <span className="text-xs text-slate-500 px-3 py-1">Részletes</span>
            </div>
          </div>

          <div className="p-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, i) => (
                <StatCard key={stat.label} {...stat} index={i} isInView={isInView} />
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* MRR Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5"
                data-testid="mrr-chart"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#0A1128]">Bevétel növekedés (ezer Ft)</h3>
                  <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />+127%
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={mrrData}>
                    <defs>
                      <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0052CC" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0052CC" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="mrr" stroke="#0052CC" strokeWidth={2} fill="url(#mrrGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Sidebar: Top Searches + Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-6"
              >
                {/* Bar chart */}
                <div className="bg-white border border-slate-200 rounded-xl p-5" data-testid="conversion-chart">
                  <h3 className="text-sm font-bold text-[#0A1128] mb-4">Árkategória eloszlás (%)</h3>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={conversionData}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="rate" fill="#0052CC" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Searches */}
                <div className="bg-white border border-slate-200 rounded-xl p-5" data-testid="top-searches">
                  <h3 className="text-sm font-bold text-[#0A1128] mb-3">Top keresések</h3>
                  <div className="space-y-2.5">
                    {topSearches.map((s, i) => (
                      <div key={s.term} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0052CC] w-5">{i + 1}.</span>
                          <span className="text-sm text-slate-700">{s.term}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{s.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
