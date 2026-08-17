import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Music, Heart, ShoppingBag, MessageCircle, Menu, LogIn, LogOut, User, Home, Sparkles, Mail, Phone, Shield, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import FacebookPixel from "@/components/FacebookPixel";
import { Toaster } from "@/components/ui/sonner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


const navigationItems = [
  { title: "Accueil", url: createPageUrl("index"), icon: Home },
  { title: "Exemples Audio", url: createPageUrl("Exemples"), icon: Music },
  { title: "Commander", url: createPageUrl("Commander"), icon: ShoppingBag },
  { title: "Suivre ma commande", url: createPageUrl("MesCommandes"), icon: Music },
  { title: "Témoignages", url: createPageUrl("Temoignages"), icon: MessageCircle },
  { title: "FAQ", url: createPageUrl("FAQ"), icon: MessageCircle },
  { title: "Contact", url: createPageUrl("Contact"), icon: MessageCircle },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleLogin = () => {
    const nextUrl = window.location.origin + createPageUrl("MesCommandes");
    base44.auth.redirectToLogin(nextUrl);
  };

  // Détection pour cacher le sticky CTA sur la page Commander
  const isCommanderPage = location.pathname.includes("Commander");

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-purple-50/30 overflow-x-hidden">
      <FacebookPixel />
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap');

          body {
            font-family: 'Poppins', sans-serif;
            letter-spacing: -0.01em;
          }

          h1, h2, h3, h4, h5, h6 {
            font-family: 'Playfair Display', serif;
            letter-spacing: -0.02em;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .float-animation {
            animation: float 6s ease-in-out infinite;
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animated-gradient {
            background: linear-gradient(
              -45deg,
              rgba(251, 113, 133, 0.03),
              rgba(168, 85, 247, 0.03),
              rgba(251, 191, 36, 0.03),
              rgba(251, 113, 133, 0.03)
            );
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }

          .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          html {
            scroll-behavior: smooth;
          }
        `}
      </style>

      {/* Navigation fixe V2 */}
      <nav className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 max-w-7xl mx-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg shadow-purple-500/5 ring-1 ring-black/5 transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to={createPageUrl("index")} onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-all duration-500 group-hover:scale-105">
                <Music className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  Une Chanson Pour Toi
                </h1>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-rose-600 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                  Créateur d'émotions
                </p>
              </div>
              <div className="block lg:hidden">
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  Une Chanson Pour Toi
                </h1>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => window.scrollTo(0, 0)}
                  className={`px-2 lg:px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs lg:text-sm font-medium ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-rose-100/80 to-purple-100/80 text-rose-700 shadow-sm"
                      : "text-gray-600 hover:bg-white/60 hover:text-rose-600"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.title}</span>
                  <span className="lg:hidden">{item.title.split(' ')[0]}</span>
                </Link>
              ))}

              {!isLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full ml-2 hover:bg-white/60">
                          <User className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 glass">
                        <div className="px-2 py-1.5">
                          <p className="text-sm font-semibold">{user.full_name || user.email}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("MesCommandes")} onClick={() => window.scrollTo(0, 0)}>
                            <Music className="w-4 h-4 mr-2" />
                            Mes commandes
                          </Link>
                        </DropdownMenuItem>
                        {user.role === 'admin' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to={createPageUrl("Admin")} onClick={() => window.scrollTo(0, 0)}>
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Administration
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Déconnexion
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button onClick={handleLogin} variant="outline" className="ml-2 rounded-xl border-rose-200 hover:bg-rose-50">
                      <LogIn className="w-4 h-4 mr-2" />
                      Connexion
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/60">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass overflow-y-auto max-h-screen">
                                <div className="flex flex-col gap-4 mt-6 pb-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                        location.pathname === item.url
                          ? "bg-white text-rose-700 shadow-lg"
                          : "text-gray-600 hover:bg-white/50"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                        <span className="font-medium text-base">{item.title}</span>
                    </Link>
                  ))}
                  
                  {!isLoading && (
                    <>
                      {user ? (
                        <>
                          <div className="px-4 py-3 bg-white/50 rounded-xl">
                            <p className="text-sm font-semibold text-gray-900">{user.full_name || user.email}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          {user.role === 'admin' && (
                            <>
                              <Link
                                to={createPageUrl("Admin")}
                                onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-200"
                              >
                                <ShoppingBag className="w-5 h-5" />
                                <span className="font-medium text-lg">Administration</span>
                              </Link>
                            </>
                          )}
                          <Button onClick={() => { handleLogout(); setMobileOpen(false); }} variant="outline" className="w-full">
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => { handleLogin(); setMobileOpen(false); }} variant="outline" className="w-full">
                          <LogIn className="w-4 h-4 mr-2" />
                          Connexion
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen pt-20 animated-gradient overflow-y-auto">
        {children}
      </main>

      {/* Sticky CTA Mobile (Uniquement si pas sur Commander) */}
      {!isCommanderPage && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
          <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)}>
            <div className="bg-gray-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 animate-in slide-in-from-bottom-20 duration-500">
              <div className="flex flex-col">
                <span className="font-bold text-sm">Une chanson unique</span>
                <span className="text-xs text-rose-300 font-medium">Livraison 72h • Express 48h</span>
              </div>
              <div className="bg-rose-600 px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-rose-900/20">
                Créer ma chanson
              </div>
            </div>
          </Link>
        </div>
      )}

      <Toaster />
      {/* Footer V2 */}
      <footer className="relative bg-white py-16 sm:py-20 border-t border-gray-100 mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badges de réassurance V2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-16 border-b border-gray-100 pb-16">
            {[
              {
                icon: Shield,
                title: "Paiement Sécurisé",
                desc: "Chiffrement SSL 256-bit"
              },
              {
                icon: Award,
                title: "Qualité Premium",
                desc: "Studio professionnel"
              },
              {
                icon: Clock,
                title: "Livraison Express",
                desc: "Option 48h disponible"
              },
              {
                icon: Heart,
                title: "Service Client",
                desc: "Disponible 7j/7"
              }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-3xl hover:bg-gray-50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 text-rose-600">
                  <badge.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{badge.title}</h4>
                <p className="text-sm text-gray-500">{badge.desc}</p>
              </div>
            ))}
          </div>

          {/* Liens et contact */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Une Chanson Pour Toi</span>
              </div>
              <p className="text-gray-500 leading-relaxed mb-8 max-w-sm">
                Nous créons des chansons uniques qui capturent vos émotions et racontent votre histoire. Une expérience inoubliable pour ceux que vous aimez.
              </p>
              <div className="space-y-4">
                <a href="mailto:contact@unechansonpourtoi.fr" className="flex items-center gap-3 text-gray-600 hover:text-rose-600 transition-colors group p-3 rounded-2xl bg-gray-50 hover:bg-rose-50 w-fit">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                  <span className="font-medium">contact@unechansonpourtoi.fr</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-bold text-gray-900 mb-6">Navigation</h4>
              <ul className="space-y-4">
                {[
                  { label: "Accueil", url: "Accueil" },
                  { label: "À propos", url: "APropos" },
                  { label: "Commander", url: "Commander" },
                  { label: "Exemples Audio", url: "Exemples" },
                  { label: "Témoignages", url: "Temoignages" },
                  { label: "FAQ", url: "FAQ" },
                  { label: "Contact", url: "Contact" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={createPageUrl(link.url)} 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-gray-500 hover:text-rose-600 transition-colors font-medium flex items-center gap-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-bold text-gray-900 mb-6">Légal</h4>
              <ul className="space-y-4">
                {[
                  { label: "Mentions légales", url: "MentionsLegales" },
                  { label: "CGV", url: "CGV" },
                  { label: "Confidentialité", url: "PolitiqueConfidentialite" },
                  { label: "Remboursements", url: "PolitiqueRemboursement" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={createPageUrl(link.url)} 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-gray-500 hover:text-rose-600 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-violet-50 border border-rose-100/50">
                <div className="flex items-center gap-2 text-rose-700 font-semibold mb-1">
                  <Shield className="w-4 h-4" />
                  Données Sécurisées
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Nous respectons votre vie privée. Vos informations personnelles ne sont jamais partagées.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 mt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2026 Une Chanson Pour Toi. Tous droits réservés.</p>
            <div className="flex items-center gap-2">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-rose-500 animate-pulse fill-rose-500" />
              <span>en France</span>
            </div>
          </div>
        </div>
      </footer>


      

    </div>
  );
}