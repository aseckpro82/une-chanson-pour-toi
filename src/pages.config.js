/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Accueil from './pages/Accueil';
import Admin from './pages/Admin';
import CGV from './pages/CGV';
import Commander from './pages/Commander';
import Contact from './pages/Contact';
import Exemples from './pages/Exemples';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import MentionsLegales from './pages/MentionsLegales';
import Merci from './pages/Merci';
import MesCommandes from './pages/MesCommandes';
import OrderDetail from './pages/OrderDetail';
import OrderReview from './pages/OrderReview';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import PolitiqueRemboursement from './pages/PolitiqueRemboursement';
import Revelation from './pages/Revelation';
import SendOrderSummary from './pages/SendOrderSummary';
import Temoignage from './pages/Temoignage';
import Temoignages from './pages/Temoignages';
import TestOptions from './pages/TestOptions';
import UploadPhotos from './pages/UploadPhotos';
import home from './pages/home';
import index from './pages/index';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Accueil": Accueil,
    "Admin": Admin,
    "CGV": CGV,
    "Commander": Commander,
    "Contact": Contact,
    "Exemples": Exemples,
    "FAQ": FAQ,
    "Home": Home,
    "MentionsLegales": MentionsLegales,
    "Merci": Merci,
    "MesCommandes": MesCommandes,
    "OrderDetail": OrderDetail,
    "OrderReview": OrderReview,
    "PolitiqueConfidentialite": PolitiqueConfidentialite,
    "PolitiqueRemboursement": PolitiqueRemboursement,
    "Revelation": Revelation,
    "SendOrderSummary": SendOrderSummary,
    "Temoignage": Temoignage,
    "Temoignages": Temoignages,
    "TestOptions": TestOptions,
    "UploadPhotos": UploadPhotos,
    "home": home,
    "index": index,
}

export const pagesConfig = {
    mainPage: "Accueil",
    Pages: PAGES,
    Layout: __Layout,
};