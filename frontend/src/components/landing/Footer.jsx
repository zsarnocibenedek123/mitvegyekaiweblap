import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, ArrowRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const techBadges = [
  { label: 'Node 20', color: '#339933' },
  { label: 'Express 5', color: '#000000' },
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'OpenAI', color: '#412991' },
  { label: 'Vector Search', color: '#0052CC' },
  { label: 'React', color: '#61DAFB' },
];

const footerLinks = [
  {
    title: 'Funkciók',
    href: '#pipeline',
  },
  {
    title: 'Widget Demó',
    href: '#widget-demo',
  },
  {
    title: 'Analitika',
    href: '#analytics',
  },
];

export const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <footer data-testid="footer-section">
      {/* CTA Section */}
      <section className="py-24 md:py-32" data-testid="footer-cta">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0A1128] leading-tight">
              Készen áll a növekedésre?
            </h2>
            <p className="mt-6 text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Csatlakozzon azokhoz a webshopokhoz, amelyek már AI-val hajtják a konverzióikat.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-slate-300 text-slate-700 hover:border-[#0052CC] hover:text-[#0052CC] px-10 h-13 text-base font-semibold transition-colors duration-200"
                data-testid="footer-contact-button"
              >
                <Mail className="mr-2 w-4 h-4" />
                Lépj kapcsolatba velünk
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Badges */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <Separator className="mb-12" />

        {/* Footer nav links */}
        <div className="flex flex-col items-center gap-3 mb-12">
          {footerLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="text-sm font-medium text-slate-500 hover:text-[#0052CC] transition-colors duration-200"
            >
              {link.title}
            </a>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0052CC] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#0A1128]">
              MitVegyek<span className="text-[#0052CC]">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} MitVegyek AI. Minden jog fenntartva.
          </p>
          <div className="flex items-center gap-3">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0052CC] hover:border-[#0052CC] transition-colors duration-200"
                data-testid={`social-link-${i}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
