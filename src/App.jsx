import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ErrorBoundary from '@/components/ErrorBoundary';
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import AppLayout from './components/AppLayout';

// Eagerly load the landing page for fastest first paint
import Landing from './pages/Landing';

// Lazy-load all authenticated pages — they're never needed before login
const Dashboard       = lazy(() => import('./pages/Dashboard'));
const Products        = lazy(() => import('./pages/Products'));
const NewProduct      = lazy(() => import('./pages/NewProduct'));
const ProductDetail   = lazy(() => import('./pages/ProductDetail'));
const CustomerAssistant = lazy(() => import('./pages/CustomerAssistant'));
const Branding        = lazy(() => import('./pages/Branding'));
const AIAdvisor       = lazy(() => import('./pages/AIAdvisor'));
const MarketInsights  = lazy(() => import('./pages/MarketInsights'));
const Settings        = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

const RedirectToLogin = () => {
  const { navigateToLogin } = useAuth();
  React.useEffect(() => {
    navigateToLogin();
  }, [navigateToLogin]);
  return <PageLoader />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return <PageLoader />;
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Show landing page publicly; redirect to login for all other routes
      return (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<RedirectToLogin />} />
        </Routes>
      );
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<NewProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/customer-assistant" element={<CustomerAssistant />} />
          <Route path="/branding" element={<Branding />} />
          <Route path="/ai-advisor" element={<AIAdvisor />} />
          <Route path="/market-insights" element={<MarketInsights />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App