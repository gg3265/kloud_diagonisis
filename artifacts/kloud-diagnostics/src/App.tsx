import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout';
import { CartProvider } from '@/lib/cart-context';
import { BookingModalProvider } from '@/lib/booking-modal-context';
import { BookingModal } from '@/components/booking-modal';
import { ScrollToTop } from '@/components/scroll-to-top';

import HomePage from './pages/home';
import PackagesPage from './pages/packages';
import BookPage from './pages/book';
import UploadPrescriptionPage from './pages/upload-prescription';
import ReportsPage from './pages/reports';
import LocationsPage from './pages/locations';
import HomeCollectionPage from './pages/home-collection';
import ServicesPage from './pages/services';
import FAQPage from './pages/faq';
import ContactPage from './pages/contact';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/packages" component={PackagesPage} />
        <Route path="/home-collection" component={HomeCollectionPage} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/book" component={BookPage} />
        <Route path="/upload-prescription" component={UploadPrescriptionPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/about" component={() => <div className="p-24 text-center">About page coming soon!</div>} />
        <Route path="/privacy" component={() => <div className="p-24 text-center">Privacy Policy coming soon!</div>} />
        <Route path="/terms" component={() => <div className="p-24 text-center">Terms of Service coming soon!</div>} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <BookingModalProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <BookingModal />
          </BookingModalProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
