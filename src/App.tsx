import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
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
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import StandarOperasionalProsedur from "./pages/StandarOperasionalProsedur";
import StrukturOrganisasi from "./pages/StrukturOrganisasi";
import LayananKonservasi from "./pages/LayananKonservasi";
import Peraturan from "./pages/Peraturan";
import MemoryOfWorld from "./pages/MemoryOfWorld";

import { useLoading } from "@/components/LoadingContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import PublicationManagement from "@/components/admin/PublicationManagement";

import FloatingButtons from "@/components/FloatingButtons";
import PemanfaatanAset from "./pages/PemanfaatanAset";
import PemanfaatanAsetDetail from "./pages/PemanfaatanAsetDetail";
import MemoryOfWorldDetail from "./pages/MemoryOfWorldDetail";
import Merchandise from "./pages/Merchandise";
import MerchandiseDetail from "./pages/MerchandiseDetail";
import ProcedureDetail from "./components/about/ProcedureDetail";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { LanguageProvider } from "./contexts/LanguageContext";
import AutoTranslationTest from "./pages/AutoTranslationTest";
import { enableGlobalTranslationInterceptor } from "./utils/apiInterceptor";
import OnDemandTranslationTest from "./pages/OnDemandTranslationTest";
import UnifiedTranslationVerification from "./pages/UnifiedTranslationVerification";
import SessionTimeoutTest from "./pages/SessionTimeoutTest";
import DashboardPage from "./pages/Dashboard";
import DemoMotion from "./pages/DemoMotion";
import V2Loader from "./components/v2/V2Loader";
import { logger } from "./utils/logger";

// Route group /v2 (preview sinematik) — seluruhnya lazy agar tidak menambah
// bobot bundle v1; chunk baru hanya diunduh saat user membuka /v2.
const V2Layout = lazy(() => import("./components/v2/V2Layout"));
const V2Landing = lazy(() => import("./pages/v2/V2Landing"));
const V2Heritage = lazy(() => import("./pages/v2/V2Heritage"));
const V2HeritageDetail = lazy(() => import("./pages/v2/V2HeritageDetail"));
const V2Museums = lazy(() => import("./pages/v2/V2Museums"));
const V2MuseumDetail = lazy(() => import("./pages/v2/V2MuseumDetail"));
const queryClient = new QueryClient();

// Enable global translation interceptor for API feedback
enableGlobalTranslationInterceptor();

const App = () => {
  const { loading } = useLoading();
  useScrollReveal(); // Initialize the global scroll-reveal observer

  useEffect(() => {
    // Initialize translation performance monitoring in development
    if (import.meta.env.DEV) {
      import('./lib/monitor-translation-performance.js')
        .then(() => {
          logger.info('Translation Performance Monitor initialized');
        })
        .catch(err => {
          logger.warn('Could not load translation monitor:', err);
        });
    }
  }, []);

  return (
    <LanguageProvider>
      {loading && <LoadingSpinner />}
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
                  <Route path="/laboratorium-konservasi" element={<LayananKonservasi />} />
                  <Route path="/media-publikasi" element={<MediaPublikasi />} />
                  <Route path="/hubungi-kami" element={<HubungiKami />} />
                  <Route path="/karir" element={<Career />} />
                  <Route path="/ppid" element={<PPID />} />
                  <Route path="/pemanfaatan-aset" element={<PemanfaatanAset />} />
                  <Route path="/pemanfaatan-aset/:id" element={<PemanfaatanAsetDetail />} />
                  <Route path="/prosedur-operasional-standar" element={<StandarOperasionalProsedur />} />
                  <Route path="/prosedur/:id" element={<ProcedureDetail />} />
                  <Route path="/peraturan" element={<Peraturan />} />
                  <Route path="/museums" element={<Museum />} />
                  <Route path="/museums/:type" element={<Museum />} />
                  <Route path="/museum/:id" element={<MuseumDetail />} />
                  <Route path="/heritage" element={<Heritage />} />
                  <Route path="/heritage/:id" element={<HeritageDetail />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/collection/:id" element={<CollectionDetail />} />
                  <Route path="/mow" element={<MemoryOfWorld />} />
                  <Route path="/mow/:id" element={<MemoryOfWorldDetail />} />
                  <Route path="/merchandise" element={<Merchandise />} />
                  <Route path="/merchandise/:id" element={<MerchandiseDetail />} />
                  <Route path="/sites" element={<NotFound />} />
                  <Route path="/sites/:id" element={<NotFound />} />
                  <Route path="/event/:id" element={<EventDetail />} />
                  <Route path="/news/:id" element={<NewsDetail />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/publications" element={<PublicationManagement userRole="admin" />} />
                  <Route path="/test-on-demand" element={<OnDemandTranslationTest />} />
                  <Route path="/test-auto-translation" element={<AutoTranslationTest />} />
                  <Route path="/verify-translation" element={<UnifiedTranslationVerification />} />
                  <Route path="/test-session-timeout" element={<SessionTimeoutTest />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/demo-motion" element={<DemoMotion />} />
                  <Route
                    path="/v2"
                    element={
                      <Suspense fallback={<V2Loader />}>
                        <V2Layout />
                      </Suspense>
                    }
                  >
                    <Route index element={<V2Landing />} />
                    <Route path="heritage" element={<V2Heritage />} />
                    <Route path="heritage/:id" element={<V2HeritageDetail />} />
                    <Route path="museums" element={<V2Museums />} />
                    <Route path="museum/:id" element={<V2MuseumDetail />} />
                  </Route>
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingButtons />
              </BrowserRouter>
            </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);
};

export default App;
