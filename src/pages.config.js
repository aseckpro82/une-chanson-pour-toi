import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import PaymentSuccess from './pages/PaymentSuccess';
import OrderDetail from './pages/OrderDetail';
import Exemples from './pages/Exemples';
import Commander from './pages/Commander';
import MesCommandes from './pages/MesCommandes';
import Temoignages from './pages/Temoignages';
import FAQ from './pages/FAQ';
import MentionsLegales from './pages/MentionsLegales';
import CGV from './pages/CGV';
import Contact from './pages/Contact';
import Temoignage from './pages/Temoignage';
import index from './pages/index';
import home from './pages/home';
import Accueil from './pages/Accueil';
import OrderReview from './pages/OrderReview';
import SendOrderSummary from './pages/SendOrderSummary';
import UploadPhotos from './pages/UploadPhotos';
import PaymentUpsell from './pages/PaymentUpsell';
import PolitiqueRemboursement from './pages/PolitiqueRemboursement';
import Revelation from './pages/Revelation';
import Admin from './pages/Admin';
import __Layout from './Layout.jsx';


export const PAGES = {
    "PolitiqueConfidentialite": PolitiqueConfidentialite,
    "PaymentSuccess": PaymentSuccess,
    "OrderDetail": OrderDetail,
    "Exemples": Exemples,
    "Commander": Commander,
    "MesCommandes": MesCommandes,
    "Temoignages": Temoignages,
    "FAQ": FAQ,
    "MentionsLegales": MentionsLegales,
    "CGV": CGV,
    "Contact": Contact,
    "Temoignage": Temoignage,
    "index": index,
    "home": home,
    "Accueil": Accueil,
    "OrderReview": OrderReview,
    "SendOrderSummary": SendOrderSummary,
    "UploadPhotos": UploadPhotos,
    "PaymentUpsell": PaymentUpsell,
    "PolitiqueRemboursement": PolitiqueRemboursement,
    "Revelation": Revelation,
    "Admin": Admin,
}

export const pagesConfig = {
    mainPage: "Accueil",
    Pages: PAGES,
    Layout: __Layout,
};