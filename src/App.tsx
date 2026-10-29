import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { RoomsPage } from './pages/public/RoomsPage';
import { RoomDetailPage } from './pages/public/RoomDetailPage';
import { CafePage } from './pages/public/CafePage';
import { CafeCartPage } from './pages/public/CafeCartPage';
import { CoworkingPage } from './pages/public/CoworkingPage';
import { AboutPage } from './pages/public/AboutPage';
import { FacilitiesPage } from './pages/public/FacilitiesPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { PoliciesPage } from './pages/public/PoliciesPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { LoginOwnerPage } from './pages/auth/LoginOwnerPage';
import { LoginTenantPage } from './pages/auth/LoginTenantPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Dashboards
import { TenantDashboard } from './pages/dashboard/tenant/TenantDashboard';
import { OwnerDashboard } from './pages/dashboard/owner/OwnerDashboard';

function AppRouter() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const { role } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  // Route matching
  const renderRoute = () => {
    // Exact routes
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }
    if (currentPath === '/rooms') {
      return <RoomsPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/rooms/')) {
      const id = currentPath.replace('/rooms/', '');
      return <RoomDetailPage roomId={id} navigate={navigate} />;
    }
    if (currentPath === '/cafe') {
      return <CafePage navigate={navigate} />;
    }
    if (currentPath === '/cafe/cart') {
      return <CafeCartPage navigate={navigate} />;
    }
    if (currentPath === '/coworking') {
      return <CoworkingPage navigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }
    if (currentPath === '/facilities') {
      return <FacilitiesPage navigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} />;
    }
    if (currentPath === '/faq') {
      return <FaqPage navigate={navigate} />;
    }
    if (currentPath === '/policies') {
      return <PoliciesPage navigate={navigate} />;
    }
    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }
    if (currentPath === '/login/owner') {
      return <LoginOwnerPage navigate={navigate} />;
    }
    if (currentPath === '/login/tenant') {
      return <LoginTenantPage navigate={navigate} />;
    }
    if (currentPath === '/register') {
      return <RegisterPage navigate={navigate} />;
    }
    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage navigate={navigate} />;
    }
    if (currentPath === '/reset-password') {
      return <ResetPasswordPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/dashboard/owner')) {
      return <OwnerDashboard navigate={navigate} />;
    }
    if (currentPath.startsWith('/dashboard/tenant')) {
      return <TenantDashboard navigate={navigate} />;
    }

    // Custom 404
    return <NotFoundPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF8] text-[#393744]">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">
        {renderRoute()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
