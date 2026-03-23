import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Sparkles, Github, Twitter, Linkedin, Mail, Send, User, MessageSquare, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [formState, setFormState] = useState({ name: '', email: '', website: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
    } catch (err) {
      // silently handle
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <footer data-testid="footer-section">
      {/* CTA Section with Form */}
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
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 max-w-md mx-auto"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-green-200 rounded-2xl p-8 text-center shadow-sm"
                data-testid="contact-success"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-[#0A1128]">Köszönjük!</h3>
                <p className="text-sm text-slate-600 mt-2">Hamarosan felvesszük Önnel a kapcsolatot.</p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
                data-testid="contact-form"
              >
                <div>
                  <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Név</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      required
                      placeholder="Kovács János"
                      value={formState.name}
                      onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                      className="pl-10 text-sm border-slate-200 focus:border-[#0052CC] focus:ring-[#0052CC]/20"
                      data-testid="contact-name-input"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      required
                      type="email"
                      placeholder="janos@webshop.hu"
                      value={formState.email}
                      onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
                      className="pl-10 text-sm border-slate-200 focus:border-[#0052CC] focus:ring-[#0052CC]/20"
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Weboldalad linkje</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="https://webshop.hu"
                      value={formState.website}
                      onChange={(e) => setFormState(s => ({ ...s, website: e.target.value }))}
                      className="pl-10 text-sm border-slate-200 focus:border-[#0052CC] focus:ring-[#0052CC]/20"
                      data-testid="contact-website-input"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Üzenet</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      placeholder="Írd le, miben segíthetünk..."
                      value={formState.message}
                      onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/20 focus:outline-none resize-none"
                      data-testid="contact-message-input"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#0052CC] hover:bg-[#0043A6] text-white h-11 text-sm font-semibold transition-colors duration-200"
                  data-testid="contact-submit-button"
                >
                  {submitting ? 'Küldés...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Küldés
                    </>
                  )}
                </Button>
              </form>
            )}
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
