import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MessageCircle, X, Sparkles, Star, ShoppingBag, Tag } from 'lucide-react';

const SCENARIOS = [
  {
    query: 'sportcipő, kényelmes, férfi',
    budget: '40 000 - 50 000 Ft',
    gender: 'Férfi',
    relation: 'Saját',
    results: [
      { name: 'Nike Air Max 90', price: '42 990 Ft', match: 94, reason: 'Sportosan elegáns, tökéletes a megadott budgetben.', color: 'Fehér/Kék' },
      { name: 'Adidas Ultraboost 22', price: '48 990 Ft', match: 89, reason: 'Futáshoz és mindennapokra, premium kategória.', color: 'Fekete' },
      { name: 'New Balance 574', price: '34 990 Ft', match: 82, reason: 'Klasszikus retró, kiváló ár-érték arány.', color: 'Szürke' },
    ],
  },
  {
    query: 'ajándék nőnek, elegáns',
    budget: '20 000 - 30 000 Ft',
    gender: 'Nő',
    relation: 'Ajándék',
    results: [
      { name: 'Pandora karkötő', price: '24 990 Ft', match: 96, reason: 'Elegáns, személyre szabható ajándék nőknek.', color: 'Ezüst' },
      { name: 'Parfüm szett', price: '22 500 Ft', match: 88, reason: 'Luxus illat ajándékdobozban, tökéletes meglepetés.', color: 'Arany' },
      { name: 'Selyem sál', price: '18 990 Ft', match: 81, reason: 'Időtlen elegancia, kiváló minőségű anyag.', color: 'Bordó' },
    ],
  },
  {
    query: 'gamer laptop, könnyű',
    budget: '50 000 Ft+',
    gender: 'Unisex',
    relation: 'Saját',
    results: [
      { name: 'ASUS ROG Zephyrus', price: '589 990 Ft', match: 97, reason: 'Ultra könnyű gamer laptop, RTX 4060 GPU.', color: 'Szürke' },
      { name: 'Lenovo Legion Slim', price: '449 990 Ft', match: 91, reason: 'Vékony dizájn, erős teljesítmény, halk működés.', color: 'Fekete' },
      { name: 'MSI Stealth 15', price: '529 990 Ft', match: 85, reason: 'Prémium build, kiváló kijelző, hordozható.', color: 'Fehér' },
    ],
  },
  {
    query: 'téli kabát, meleg, férfi',
    budget: '30 000 - 40 000 Ft',
    gender: 'Férfi',
    relation: 'Saját',
    results: [
      { name: 'North Face Parka', price: '38 990 Ft', match: 93, reason: 'Vízálló, szélálló, -20°C-ig meleg.', color: 'Sötétkék' },
      { name: 'Columbia Puffer', price: '34 500 Ft', match: 87, reason: 'Könnyű, mégis rendkívül meleg pehely töltet.', color: 'Fekete' },
      { name: 'Zara Oversize Coat', price: '29 990 Ft', match: 80, reason: 'Divatos oversize fazon, meleg béléssel.', color: 'Bézs' },
    ],
  },
  {
    query: 'okosóra, fitness, női',
    budget: '20 000 - 30 000 Ft',
    gender: 'Nő',
    relation: 'Saját',
    results: [
      { name: 'Apple Watch SE', price: '29 990 Ft', match: 95, reason: 'Legjobb fitness tracking, elegáns női méret.', color: 'Rózsaszín' },
      { name: 'Samsung Galaxy Fit3', price: '22 990 Ft', match: 90, reason: 'Könnyű, vízálló, 2 hét akkumulátor.', color: 'Lila' },
      { name: 'Xiaomi Band 8 Pro', price: '18 990 Ft', match: 83, reason: 'Kiváló ár-érték, AMOLED kijelző, GPS.', color: 'Fekete' },
    ],
  },
];

// Phases: idle -> opening -> typing -> loading -> results -> closing -> idle
const PHASE_TIMINGS = {
  idle: 1200,
  opening: 600,
  typing: 0, // dynamic based on query length
  loading: 2200,
  results: 4000,
  closing: 800,
};

const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-3.5">
    <div className="flex justify-between mb-2.5">
      <div className="w-10 h-10 rounded-lg shimmer-bg" />
      <div className="w-14 h-5 rounded-full shimmer-bg" />
    </div>
    <div className="h-3.5 w-2/3 shimmer-bg rounded mb-2" />
    <div className="h-3.5 w-1/3 shimmer-bg rounded mb-2.5" />
    <div className="h-14 shimmer-bg rounded-lg" />
  </div>
);

const ResultCard = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.1 }}
    className="bg-white border border-slate-200 rounded-xl p-3.5"
  >
    <div className="flex items-start justify-between mb-2">
      <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] flex items-center justify-center">
        <ShoppingBag className="w-4 h-4 text-slate-400" />
      </div>
      <span className="bg-[#0052CC] text-white text-[10px] font-bold rounded-full px-2 py-0.5">
        {product.match}%
      </span>
    </div>
    <h4 className="font-bold text-[#0A1128] text-xs">{product.name}</h4>
    <p className="text-[#0052CC] font-bold text-xs mt-0.5">{product.price}</p>
    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
      <Tag className="w-2.5 h-2.5" />{product.color}
    </div>
    <div className="mt-2 p-2 bg-[#F8FAFC] rounded-lg border border-slate-100">
      <div className="flex items-center gap-1 mb-0.5">
        <Sparkles className="w-2.5 h-2.5 text-[#0052CC]" />
        <span className="text-[10px] font-semibold text-[#0052CC]">AI indoklás</span>
      </div>
      <p className="text-[10px] text-slate-600 leading-relaxed">{product.reason}</p>
    </div>
  </motion.div>
);

export const WidgetDemo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [typedText, setTypedText] = useState('');
  const phaseTimer = useRef(null);
  const typingTimer = useRef(null);

  const scenario = SCENARIOS[scenarioIdx];

  const advancePhase = useCallback(() => {
    setPhase(prev => {
      const order = ['idle', 'opening', 'typing', 'loading', 'results', 'closing'];
      const nextIdx = order.indexOf(prev) + 1;
      if (nextIdx >= order.length) {
        // Move to next scenario
        setScenarioIdx(si => (si + 1) % SCENARIOS.length);
        return 'idle';
      }
      return order[nextIdx];
    });
  }, []);

  // Phase timer
  useEffect(() => {
    if (!isInView) return;

    if (phase === 'typing') {
      // Type out the query
      const query = SCENARIOS[scenarioIdx].query;
      let i = 0;
      setTypedText('');
      typingTimer.current = setInterval(() => {
        i++;
        setTypedText(query.slice(0, i));
        if (i >= query.length) {
          clearInterval(typingTimer.current);
          phaseTimer.current = setTimeout(advancePhase, 600);
        }
      }, 55);
      return () => {
        clearInterval(typingTimer.current);
        clearTimeout(phaseTimer.current);
      };
    }

    const duration = PHASE_TIMINGS[phase] || 1000;
    phaseTimer.current = setTimeout(advancePhase, duration);
    return () => clearTimeout(phaseTimer.current);
  }, [phase, isInView, scenarioIdx, advancePhase]);

  // Start loop when in view
  useEffect(() => {
    if (isInView && phase === 'idle') {
      phaseTimer.current = setTimeout(() => setPhase('idle'), 500);
    }
  }, [isInView]);

  const panelOpen = ['typing', 'loading', 'results'].includes(phase) || phase === 'opening';
  const showForm = phase === 'typing' || phase === 'opening';
  const showLoading = phase === 'loading';
  const showResults = phase === 'results';

  return (
    <section id="widget-demo" className="py-24 md:py-32" data-testid="widget-demo-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.2em] text-xs font-bold text-[#0052CC]">
            Widget Demó
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1128]">
            A Widget élmény
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Nézd meg, hogyan működik az AI Stylist valós időben — automatikus keresés és ajánlás.
          </p>
        </motion.div>

        {/* Mock Webshop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#F8FAFC] border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-1 text-xs text-slate-500 w-64 text-center">
                  webshop-demo.hu
                </div>
              </div>
            </div>

            {/* Webshop content */}
            <div className="p-8 min-h-[440px] relative bg-white" data-testid="widget-webshop">
              <div className="grid grid-cols-3 gap-4 opacity-40">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-100">
                    <div className="w-full h-24 bg-slate-200 rounded-lg mb-3" />
                    <div className="h-3 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded mt-2" />
                  </div>
                ))}
              </div>

              {/* Widget Panel */}
              <AnimatePresence>
                {panelOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-4 right-4 bottom-4 w-[300px] glass-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    data-testid="widget-panel"
                  >
                    {/* Panel Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#0052CC] flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-bold text-xs text-[#0A1128]">MitVegyek AI</span>
                      </div>
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <AnimatePresence mode="wait">
                        {showForm && (
                          <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="space-y-3"
                          >
                            <p className="text-xs text-slate-500 mb-3">AI Stylist keresés folyamatban...</p>
                            {/* Query field with typing */}
                            <div>
                              <label className="text-[10px] font-semibold text-slate-700 mb-1 block">Érdeklődési kör</label>
                              <div className="border border-slate-200 rounded-md px-3 py-2 text-xs text-[#0A1128] bg-white min-h-[32px]">
                                {typedText}<span className="animate-pulse text-[#0052CC]">|</span>
                              </div>
                            </div>
                            {/* Pre-filled fields */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-semibold text-slate-700 mb-1 block">Budget</label>
                                <div className="border border-slate-200 rounded-md px-3 py-2 text-[10px] text-slate-600 bg-[#F8FAFC]">
                                  {scenario.budget}
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-slate-700 mb-1 block">Nem</label>
                                <div className="border border-slate-200 rounded-md px-3 py-2 text-[10px] text-slate-600 bg-[#F8FAFC]">
                                  {scenario.gender}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-slate-700 mb-1 block">Kapcsolat</label>
                              <div className="border border-slate-200 rounded-md px-3 py-2 text-[10px] text-slate-600 bg-[#F8FAFC]">
                                {scenario.relation}
                              </div>
                            </div>
                            {/* Auto search button */}
                            <div className="bg-[#0052CC] rounded-xl text-white text-xs font-semibold py-2.5 text-center flex items-center justify-center gap-1.5 mt-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              Kérem az AI Stylistot
                            </div>
                          </motion.div>
                        )}

                        {showLoading && (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="space-y-3"
                          >
                            <div className="text-center py-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-9 h-9 rounded-xl bg-[#E0EFFF] flex items-center justify-center mx-auto mb-2"
                              >
                                <Sparkles className="w-4 h-4 text-[#0052CC]" />
                              </motion.div>
                              <p className="text-xs font-semibold text-[#0A1128]">AI elemzi...</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Hibrid keresés + LLM rangsorolás</p>
                            </div>
                            {[0,1,2].map(i => <SkeletonCard key={i} />)}
                          </motion.div>
                        )}

                        {showResults && (
                          <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="space-y-2.5"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-[#0052CC]" />
                                <span className="text-xs font-bold text-[#0A1128]">3 ajánlás</span>
                              </div>
                              <span className="text-[10px] text-slate-400">{scenarioIdx + 1}/5</span>
                            </div>
                            {scenario.results.map((product, i) => (
                              <ResultCard key={product.name} product={product} index={i} />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Widget Bubble */}
              <AnimatePresence>
                {!panelOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#0052CC] text-white flex items-center justify-center shadow-lg widget-bubble"
                    data-testid="widget-bubble"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute inset-0 rounded-full border-2 border-[#0052CC] pulse-ring" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
