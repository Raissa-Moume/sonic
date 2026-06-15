import { Metadata } from 'next';
import { BookOpen, MessageCircle, Shield, Users, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'À propos — Sonic Books',
  description: 'Découvrez comment Sonic Books révolutionne l\'accès aux livres scolaires au Cameroun.',
};

export default function AboutPage() {
  const steps = [
    {
      number: '01',
      title: 'Parcourez le catalogue',
      description: 'Explorez notre sélection de livres sur l\'agriculture, le développement personnel, la psychologie et bien plus.',
      icon: BookOpen,
    },
    {
      number: '02',
      title: 'Ajoutez au panier & commandez',
      description: 'Sélectionnez vos livres, renseignez votre numéro WhatsApp et confirmez votre commande.',
      icon: Shield,
    },
    {
      number: '03',
      title: 'Paiement & vérification',
      description: 'Effectuez votre paiement Mobile Money. Nous vérifions votre transaction manuellement.',
      icon: Users,
    },
    {
      number: '04',
      title: 'Livraison sur WhatsApp',
      description: 'Une fois le paiement confirmé, nous vous envoyons directement vos PDFs sur WhatsApp. Instantané !',
      icon: MessageCircle,
    },
  ];

  const values = [
    { title: 'Accessibilité', desc: 'Rendre les livres scolaires accessibles à tous les étudiants camerounais, quel que soit leur budget.', icon: '🌍' },
    { title: 'Rapidité', desc: 'Recevez vos livres en quelques minutes, pas en quelques jours. Le numérique au service de l\'éducation.', icon: '⚡' },
    { title: 'Fiabilité', desc: 'Chaque commande est traitée manuellement pour garantir votre satisfaction.', icon: '🔒' },
    { title: 'Support local', desc: "Nous soutenons l'éducation au Cameroun en offrant des ressources à des prix abordables.", icon: '🇨🇲' },
  ];

  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero */}
      <section className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
          <Globe size={14} className="text-sky-500" />
          <span className="text-xs font-medium text-emerald-700">Notre histoire</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-emerald-950 mb-6">
          À propos de{' '}
          <span className="gradient-text">Sonic Books</span>
        </h1>
        <p className="text-emerald-800 text-xl leading-relaxed max-w-3xl mx-auto">
          Nous sommes une librairie 100% numérique née au Cameroun, avec une mission simple :
          <strong className="text-emerald-950"> rendre l'apprentissage et le savoir accessibles</strong> à chacun grâce à la technologie.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-14">
          <p className="text-pink-500 text-sm font-medium mb-2">Simple & rapide</p>
          <h2 className="text-3xl font-bold text-emerald-950">Comment ça marche ?</h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.4), transparent)' }} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))' }} />
                  <div className="relative w-full h-full rounded-full glass flex flex-col items-center justify-center border border-pink-300">
                    <step.icon size={24} className="text-pink-500 mb-1" />
                    <span className="text-xs text-emerald-600 font-bold">{step.number}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-emerald-950 mb-2">{step.title}</h3>
                <p className="text-emerald-800 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="divider mb-16" />
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-emerald-950">Nos valeurs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300">
              <div className="text-3xl mb-4">{value.icon}</div>
              <h3 className="font-semibold text-emerald-950 text-lg mb-2">{value.title}</h3>
              <p className="text-emerald-800 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass rounded-3xl p-10 text-center glow-purple relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-emerald-950 mb-4">Prêt à commencer ? 🚀</h2>
            <p className="text-emerald-800 mb-8">
              Rejoignez des milliers d&apos;étudiants qui font confiance à Sonic Books.
            </p>
            <Link href="/books" className="btn-primary inline-flex items-center gap-2">
              Découvrir le catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
