import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Terminal, Copy, Check, Zap, Clock, Shield, Code } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

const codeSnippet = `<!-- 1 perces integráció -->
<script src="https://cdn.mitvegyek.ai/widget.js"></script>
<script>
  MitVegyek.init({
    apiKey: 'mv_live_xxxxxxxxxx',
    partnerId: 'your-shop-id',
    theme: {
      primary: '#0052CC',
      position: 'bottom-right'
    }
  });
</script>`;

const apiExample = `// Express 5 + TypeScript
import { MitVegyekAPI } from '@mitvegyek/sdk';

const api = new MitVegyekAPI({
  apiKey: process.env.MITVEGYEK_API_KEY
});

// Ajánlások lekérése
const results = await api.recommend({
  query: "sportcipő, kényelmes, 40k alatt",
  filters: { gender: "male", budget: [30000, 50000] },
  limit: 5
});

// results.items → Rangsorolt termékek AI indoklással`;

const features = [
  { icon: Zap, label: '50ms válaszidő', desc: 'Edge-optimalizált API' },
  { icon: Shield, label: 'CORS biztonság', desc: 'Origin-szintű védelem' },
  { icon: Clock, label: 'Rate-limit', desc: '1000 req/perc/partner' },
  { icon: Code, label: 'TypeScript SDK', desc: 'Típusbiztos fejlesztés' },
];

export const DeveloperAPI = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="developer" className="py-24 md:py-32 bg-[#F8FAFC]" data-testid="developer-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.2em] text-xs font-bold text-[#0052CC]">
            Fejlesztőkre szabva
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1128]">
            Integrálja percek alatt
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Express 5 + TypeScript stack. Egyetlen JS kódrészlet, és a widget máris él a webshopodban.
          </p>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                data-testid={`dev-feature-${i}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#E0EFFF] flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#0052CC]" />
                </div>
                <p className="text-sm font-bold text-[#0A1128]">{f.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Code blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Widget snippet */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            data-testid="code-widget-snippet"
          >
            <div className="code-block rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-900/30">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">widget-embed.html</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-900/50 text-blue-300 border-none text-[10px] rounded-full">HTML</Badge>
                  <button
                    onClick={() => handleCopy(codeSnippet, 'widget')}
                    className="text-blue-400 hover:text-white transition-colors duration-200 p-1"
                    data-testid="copy-widget-code"
                  >
                    {copied === 'widget' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <pre className="p-5 text-sm leading-relaxed overflow-x-auto">
                <code className="text-blue-200">{codeSnippet}</code>
              </pre>
            </div>
          </motion.div>

          {/* API example */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            data-testid="code-api-example"
          >
            <div className="code-block rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-900/30">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">recommend.ts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-900/50 text-blue-300 border-none text-[10px] rounded-full">TypeScript</Badge>
                  <button
                    onClick={() => handleCopy(apiExample, 'api')}
                    className="text-blue-400 hover:text-white transition-colors duration-200 p-1"
                    data-testid="copy-api-code"
                  >
                    {copied === 'api' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <pre className="p-5 text-sm leading-relaxed overflow-x-auto">
                <code className="text-blue-200">{apiExample}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
