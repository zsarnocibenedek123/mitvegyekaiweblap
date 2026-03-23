import { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, X, Star, Heart, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockProducts = [
  {
    name: 'Nike Air Max 90',
    price: '42 990 Ft',
    match: 94,
    reason: 'Sportosan elegáns, férfi, 40-50k budget — tökéletes találat.',
    image: '👟',
    color: 'Fehér/Kék',
  },
  {
    name: 'Adidas Ultraboost 22',
    price: '48 990 Ft',
    match: 89,
    reason: 'Futáshoz és mindennapokra is alkalmas, premium kategória.',
    image: '🏃',
    color: 'Fekete',
  },
  {
    name: 'New Balance 574',
    price: '34 990 Ft',
    match: 82,
    reason: 'Klasszikus retró stílus, kiváló ár-érték arány a budgetben.',
    image: '👞',
    color: 'Szürke/Kék',
  },
];

const ProductCard = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, delay: index * 0.12 }}
    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    data-testid={`demo-product-${index}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-12 h-12 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-2xl">
        {product.image}
      </div>
      <Badge className="bg-[#0052CC] text-white border-none text-xs font-bold rounded-full px-2.5">
        {product.match}% match
      </Badge>
    </div>
    <h4 className="font-bold text-[#0A1128] text-sm">{product.name}</h4>
    <p className="text-[#0052CC] font-bold text-sm mt-0.5">{product.price}</p>
    <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
      <Tag className="w-3 h-3" />
      <span>{product.color}</span>
    </div>
    <div className="mt-3 p-2.5 bg-[#F8FAFC] rounded-lg border border-slate-100">
      <div className="flex items-center gap-1.5 mb-1">
        <Sparkles className="w-3 h-3 text-[#0052CC]" />
        <span className="text-xs font-semibold text-[#0052CC]">AI indoklás</span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{product.reason}</p>
    </div>
    <div className="mt-3 flex gap-2">
      <Button size="sm" className="flex-1 bg-[#0052CC] hover:bg-[#0043A6] text-white text-xs rounded-lg h-8 transition-colors duration-200">
        <ShoppingBag className="w-3 h-3 mr-1" /> Kosárba
      </Button>
      <Button size="sm" variant="outline" className="border-slate-200 text-slate-500 rounded-lg h-8 w-8 p-0 hover:text-red-500 hover:border-red-200 transition-colors duration-200">
        <Heart className="w-3.5 h-3.5" />
      </Button>
    </div>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <div className="flex justify-between mb-3">
      <div className="w-12 h-12 rounded-lg shimmer-bg" />
      <div className="w-16 h-5 rounded-full shimmer-bg" />
    </div>
    <div className="h-4 w-2/3 shimmer-bg rounded mb-2" />
    <div className="h-4 w-1/3 shimmer-bg rounded mb-3" />
    <div className="h-16 shimmer-bg rounded-lg" />
  </div>
);

export const WidgetDemo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [panelOpen, setPanelOpen] = useState(false);
  const [phase, setPhase] = useState('form'); // form | loading | results

  const handleSearch = () => {
    setPhase('loading');
    setTimeout(() => setPhase('results'), 2000);
  };

  const handleReset = () => {
    setPhase('form');
  };

  const handleOpenPanel = () => {
    setPanelOpen(true);
    setPhase('form');
  };

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
            Interaktív Demó
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1128]">
            A Widget élmény
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Kattints az AI Stylist buborékra, töltsd ki az igényeidet, és nézd meg, milyen ajánlásokat generál a rendszer.
          </p>
        </motion.div>

        {/* Mock Webshop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
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
            <div className="p-8 min-h-[420px] relative bg-white">
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
                    className="absolute top-4 right-4 bottom-4 w-80 glass-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    data-testid="widget-panel"
                  >
                    {/* Panel Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#0052CC] flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-sm text-[#0A1128]">MitVegyek AI</span>
                      </div>
                      <button
                        onClick={() => setPanelOpen(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                        data-testid="widget-close-button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto p-5">
                      <AnimatePresence mode="wait">
                        {phase === 'form' && (
                          <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                            data-testid="widget-form"
                          >
                            <p className="text-sm text-slate-600 mb-4">Mondd el, mit keresel, és az AI Stylist személyre szabott ajánlásokat ad!</p>
                            <div>
                              <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Érdeklődési kör</Label>
                              <Input
                                placeholder="pl. futócipő, sportos stílus"
                                className="text-sm border-slate-200 focus:border-[#0052CC] focus:ring-[#0052CC]/20"
                                data-testid="widget-interest-input"
                                defaultValue="sportcipő, kényelmes"
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Budget</Label>
                              <Select defaultValue="40-50k">
                                <SelectTrigger className="text-sm border-slate-200" data-testid="widget-budget-select">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="10-20k">10 000 - 20 000 Ft</SelectItem>
                                  <SelectItem value="20-30k">20 000 - 30 000 Ft</SelectItem>
                                  <SelectItem value="30-40k">30 000 - 40 000 Ft</SelectItem>
                                  <SelectItem value="40-50k">40 000 - 50 000 Ft</SelectItem>
                                  <SelectItem value="50k+">50 000 Ft+</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Nem</Label>
                                <Select defaultValue="ferfi">
                                  <SelectTrigger className="text-sm border-slate-200" data-testid="widget-gender-select">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ferfi">Férfi</SelectItem>
                                    <SelectItem value="no">Nő</SelectItem>
                                    <SelectItem value="unisex">Unisex</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Kapcsolat</Label>
                                <Select defaultValue="sajat">
                                  <SelectTrigger className="text-sm border-slate-200" data-testid="widget-relation-select">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="sajat">Saját</SelectItem>
                                    <SelectItem value="ajandek">Ajándék</SelectItem>
                                    <SelectItem value="par">Pár</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button
                              onClick={handleSearch}
                              className="w-full rounded-xl bg-[#0052CC] hover:bg-[#0043A6] text-white h-10 text-sm font-semibold mt-2 transition-colors duration-200"
                              data-testid="widget-search-button"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Kérem az AI Stylistot
                            </Button>
                          </motion.div>
                        )}

                        {phase === 'loading' && (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                            data-testid="widget-loading"
                          >
                            <div className="text-center py-4">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-10 h-10 rounded-xl bg-[#E0EFFF] flex items-center justify-center mx-auto mb-3"
                              >
                                <Sparkles className="w-5 h-5 text-[#0052CC]" />
                              </motion.div>
                              <p className="text-sm font-semibold text-[#0A1128]">AI elemzi az igényeidet...</p>
                              <p className="text-xs text-slate-500 mt-1">Hibrid keresés fut + LLM rangsorolás</p>
                            </div>
                            {[0,1,2].map((i) => <SkeletonCard key={i} />)}
                          </motion.div>
                        )}

                        {phase === 'results' && (
                          <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                            data-testid="widget-results"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-[#0052CC]" />
                                <span className="text-sm font-bold text-[#0A1128]">3 ajánlás</span>
                              </div>
                              <button
                                onClick={handleReset}
                                className="text-xs text-[#0052CC] font-medium hover:underline"
                                data-testid="widget-reset-button"
                              >
                                Új keresés
                              </button>
                            </div>
                            {mockProducts.map((product, i) => (
                              <ProductCard key={product.name} product={product} index={i} />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Widget Bubble */}
              {!panelOpen && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                  onClick={handleOpenPanel}
                  className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#0052CC] text-white flex items-center justify-center shadow-lg hover:bg-[#0043A6] widget-bubble cursor-pointer transition-colors duration-200"
                  data-testid="widget-bubble-button"
                >
                  <MessageCircle className="w-6 h-6" />
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-full border-2 border-[#0052CC] pulse-ring" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
