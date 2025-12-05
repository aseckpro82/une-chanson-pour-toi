import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Music, Heart, ShoppingBag, MessageCircle, Menu, LogIn, LogOut, User, Home, Sparkles, Mail, Phone, Shield, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import FacebookPixel from "@/components/FacebookPixel";
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
  { title: "Accueil", url: createPageUrl("Accueil"), icon: Home },
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

      {/* Navigation fixe */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to={createPageUrl("Accueil")} onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-400 via-purple-400 to-rose-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 float-animation">
                <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                  Une Chanson Pour Toi
                </h1>
                <p className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  Émotions en musique
                </p>
              </div>
              <div className="block lg:hidden">
                <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Une Chanson<br className="hidden xs:block"/>Pour Toi
                </h1>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
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

      {/* Footer doux et rassurant */}
      <footer className="relative bg-gradient-to-br from-rose-50 via-purple-50/30 to-white py-12 sm:py-16 lg:py-20 mt-12 sm:mt-16 lg:mt-20 border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Message émotionnel en haut */}
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50 mb-4 sm:mb-6">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Créé avec amour pour vous</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Votre histoire mérite une chanson unique
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Chaque jour, nous aidons des personnes comme vous à immortaliser leurs plus beaux moments en musique.
              <br className="hidden sm:block" /> <span className="sm:inline">Rejoignez notre communauté de clients satisfaits.</span>
            </p>
          </div>

          {/* Badges de réassurance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Shield,
                title: "Paiement 100% sécurisé",
                desc: "Vos données sont protégées"
              },
              {
                icon: Award,
                title: "Qualité garantie",
                desc: "98% de satisfaction client"
              },
              {
                icon: Clock,
                title: "Livraison rapide",
                desc: "Sous 24 à 72h"
              },
              {
                icon: Heart,
                title: "Support dédié",
                desc: "Réponse sous 24h"
              }
            ].map((badge, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-100 hover:shadow-lg transition-all duration-300">
                <badge.icon className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-1 text-sm">{badge.title}</p>
                <p className="text-xs text-gray-600">{badge.desc}</p>
              </div>
            ))}
          </div>

          {/* Liens et contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Une Chanson Pour Toi</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nous transformons vos émotions en mélodies uniques depuis 2025.
                Plus de 500 chansons créées, des milliers de sourires.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-rose-500" />
                  <a href="mailto:contact@unechansonpourtoi.fr" className="hover:text-rose-600 transition-colors">
                    contact@unechansonpourtoi.fr
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-rose-500" />
                  <span>Disponible 7j/7</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Music className="w-5 h-5 text-rose-500" />
                Navigation
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Accueil", url: "Accueil" },
                  { label: "Commander ma chanson", url: "Commander" },
                  { label: "Écouter des exemples", url: "Exemples" },
                  { label: "Lire les témoignages", url: "Temoignages" },
                  { label: "Questions fréquentes", url: "FAQ" },
                  { label: "Nous contacter", url: "Contact" }
                ].map((link, i) => (
                  <Link 
                    key={i}
                    to={createPageUrl(link.url)} 
                    onClick={() => window.scrollTo(0, 0)}
                    className="block text-gray-600 hover:text-rose-600 transition-colors hover:translate-x-1 transform duration-200"
                  >
                    → {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Informations légales
              </h4>
              <div className="space-y-3 mb-6">
                {[
                                        { label: "Mentions légales", url: "MentionsLegales" },
                                        { label: "Conditions générales de vente", url: "CGV" },
                                        { label: "Politique de confidentialité", url: "PolitiqueConfidentialite" },
                                        { label: "Politique de remboursement", url: "PolitiqueRemboursement" }
                                      ].map((link, i) => (
                  <Link 
                    key={i}
                    to={createPageUrl(link.url)} 
                    onClick={() => window.scrollTo(0, 0)}
                    className="block text-gray-600 hover:text-rose-600 transition-colors hover:translate-x-1 transform duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Message de réassurance */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold">🔒 Vos données sont protégées.</span>
                  <br />
                  Nous respectons votre vie privée et ne partageons jamais vos informations.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-rose-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-gray-600">
                © 2025 Une Chanson Pour Toi. Tous droits réservés.
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Fait avec passion pour immortaliser vos émotions</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      

    </div>
  );
}