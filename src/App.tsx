import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Beranda from "./pages/Beranda";
import Agenda from "./pages/Agenda";
import CompanyProfile from "./pages/CompanyProfile";
import TentangKami from "./pages/TentangKami";
import MediaPublikasi from "./pages/MediaPublikasi";
import HubungiKami from "./pages/HubungiKami";
import Career from "./pages/Career";
import PPID from "./pages/PPID";
import Museum from "./pages/Museum";
import Collection from "./pages/Collection";
import Heritage from "./pages/Heritage";
import MuseumDetail from "./pages/MuseumDetail";
import CollectionDetail from "./pages/CollectionDetail";
import HeritageDetail from "./pages/HeritageDetail";
import EventDetail from "./pages/EventDetail";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import StandarOperasionalProsedur from "./pages/StandarOperasionalProsedur";
import Pengaturan from "./pages/Pengaturan";
import StrukturOrganisasi from "./pages/StrukturOrganisasi";
import LayananKonservasi from "./pages/LayananKonservasi";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/tentang-kami/profil-perusahaan" element={<CompanyProfile />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/struktur-organisasi" element={<StrukturOrganisasi />} />
          <Route path="/layanan-konservasi" element={<LayananKonservasi />} />
          <Route path="/media-publikasi" element={<MediaPublikasi />} />
          <Route path="/hubungi-kami" element={<HubungiKami />} />
          <Route path="/career" element={<Career />} />
          <Route path="/ppid" element={<PPID />} />
          <Route path="/standar-operasional-prosedur" element={<StandarOperasionalProsedur />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="/museum" element={<Museum />} />
          <Route path="/museum/:id" element={<MuseumDetail />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/heritage/:id" element={<HeritageDetail />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/:id" element={<CollectionDetail />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
