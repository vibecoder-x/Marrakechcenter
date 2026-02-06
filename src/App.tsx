import { useState, useEffect } from 'react';
import { 
  Search, 
  Compass, 
  MapPin, 
  FileText, 
  Menu, 
  X, 
  ChevronRight, 
  School, 
  Users, 
  Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MourchidChat from './components/MourchidChat';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-blue selection:bg-marrakech-ochre selection:text-white">
      
      {/* Disclaimer Banner */}
      <div className="bg-slate-900 text-white py-2 px-4 text-center text-xs font-medium tracking-wide z-[60] relative">
        <span className="opacity-75">PROTOTYPE: </span> 
        Ceci est une maquette de démonstration. Le site officiel est en cours de développement.
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-marrakech-ochre rounded-lg flex items-center justify-center text-white">
              <School size={20} />
            </div>
            <span>marrakech<span className="text-marrakech-ochre">.center</span></span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            {['Accueil', 'Orientation', 'Carte Scolaire', 'E-Services', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-marrakech-ochre transition-colors">
                {item}
              </a>
            ))}
            <button className="px-5 py-2 border-2 border-slate-blue rounded-full font-semibold hover:bg-slate-blue hover:text-white transition-all">
              Espace Élève
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b"
            >
              <div className="flex flex-col p-6 gap-4 font-medium">
                {['Accueil', 'Orientation', 'Carte Scolaire', 'E-Services', 'Contact'].map((item) => (
                  <a key={item} href="#" className="py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                    {item}
                  </a>
                ))}
                <button className="w-full py-3 mt-2 bg-slate-blue text-white rounded-lg">
                  Connexion Espace Élève
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-marrakech-ochre uppercase bg-marrakech-ochre/10 rounded-full">
                Portail Officiel
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
                Le <span className="text-marrakech-ochre">Carrefour d'Excellence</span> pour l'Éducation à Marrakech
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Orientation intelligente, démarches administratives simplifiées et découverte des talents de notre région. Tout votre parcours éducatif en un seul clic.
              </p>
              
              {/* Search Bar */}
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 max-w-lg mx-auto lg:mx-0 flex items-center border border-slate-100">
                <Search className="text-slate-400 ml-4" />
                <input 
                  type="text" 
                  placeholder="Que cherchez-vous ? (ex: Lycée, Bourse...)" 
                  className="w-full px-4 py-3 outline-none text-slate-700 bg-transparent"
                />
                <button className="bg-marrakech-ochre text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors">
                  Chercher
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" 
                  alt="Students in Marrakech" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-lg">Lycée Ibn Abbad</p>
                  <p className="text-sm opacity-90">Promotion 2026</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 top-10 -right-10 w-40 h-40 bg-marrakech-ochre/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-slate-blue/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Core Services */}
      <section className="py-20 bg-white" id="services">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nos Services Principaux</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Une suite d'outils numériques conçus pour faciliter la vie scolaire des élèves, parents et administrateurs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Compass size={32} />, 
                title: "Orientation IA", 
                desc: "Analysez vos résultats et centres d'intérêt pour trouver la filière idéale grâce à notre assistant intelligent.",
                color: "bg-blue-50 text-blue-600"
              },
              { 
                icon: <MapPin size={32} />, 
                title: "Carte Scolaire", 
                desc: "Une carte interactive pour localiser tous les établissements de la région Marrakech-Safi.",
                color: "bg-orange-50 text-orange-600"
              },
              { 
                icon: <FileText size={32} />, 
                title: "E-Administration", 
                desc: "Demandez vos certificats, relevés de notes et bourses directement en ligne sans déplacement.",
                color: "bg-green-50 text-green-600"
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all bg-white group"
              >
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.desc}
                </p>
                <a href="#" className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-marrakech-ochre">
                  En savoir plus <ChevronRight size={16} className="ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0">
          <img 
            src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=80" 
            alt="Marrakech Architecture" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <img 
                src="/medersa-ben-youssef.webp" 
                alt="Medersa Ben Youssef Marrakech" 
                className="rounded-2xl shadow-2xl border-4 border-white/10"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Éducation & Patrimoine</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Apprendre à Marrakech, c'est aussi s'imprégner d'une histoire millénaire. Notre programme "École du Patrimoine" organise des visites scolaires dans les monuments historiques pour connecter les élèves à leur identité culturelle.
              </p>
              <button className="bg-marrakech-ochre hover:bg-white hover:text-marrakech-ochre text-white px-8 py-3 rounded-full font-bold transition-all">
                Découvrir le Programme
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-marrakech-ochre text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "+200", label: "Établissements" },
              { num: "+50k", label: "Élèves Connectés" },
              { num: "100%", label: "Digitalisé" },
              { num: "24/7", label: "Support" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.num}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <a href="#" className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                <School size={24} />
                <span>marrakech.center</span>
              </a>
              <p className="max-w-xs text-slate-400">
                La plateforme de référence pour l'éducation et l'orientation dans la région de Marrakech-Safi.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Liens Rapides</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Espace Parents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Espace Professeurs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Partenaires</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 opacity-50 grayscale italic"><Globe size={16} /> Ministère de l'Éducation (Bientôt)</li>
                <li className="flex items-center gap-2 opacity-50 grayscale italic"><Users size={16} /> AREF Marrakech-Safi (Bientôt)</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2026 Marrakech.Center - Une Initiative Citoyenne.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Mentions Légales</a>
              <a href="#" className="hover:text-white">Confidentialité</a>
            </div>
          </div>
        </div>
      <Footer />

      <MourchidChat />
    </div>
  );
}

export default App;
