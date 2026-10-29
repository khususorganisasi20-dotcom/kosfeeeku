import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Coffee, ShoppingBag, User, Menu, X, Shield, Globe } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, role, switchDemoRole } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navLinks = [
    { label: t.navRooms, path: '/rooms' },
    { label: t.navCafe, path: '/cafe' },
    { label: t.navCoworking, path: '/coworking' },
    { label: t.navFacilities, path: '/facilities' },
    { label: t.navAbout, path: '/about' },
  ];

  return (
    <>
      {/* Role quick switch bar for seamless testing & demonstration */}
      <div className="bg-[#E6DDF7] text-[#393744] text-xs py-1.5 px-4 border-b border-[#D5C6E0] flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-[#524B66]">Mode Uji / Demo:</span>
            <div className="inline-flex items-center bg-white/80 rounded-md p-0.5 border border-[#D5C6E0]">
              <button
                onClick={() => switchDemoRole('tenant')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${role === 'tenant' ? 'bg-[#393744] text-white' : 'text-[#393744] hover:bg-slate-100'}`}
              >
                Penghuni (Budi)
              </button>
              <button
                onClick={() => switchDemoRole('owner')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${role === 'owner' ? 'bg-[#393744] text-white' : 'text-[#393744] hover:bg-slate-100'}`}
              >
                Owner (Bu Ratna)
              </button>
              <button
                onClick={() => switchDemoRole('staff')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${role === 'staff' ? 'bg-[#393744] text-white' : 'text-[#393744] hover:bg-slate-100'}`}
              >
                Staff Café (Dika)
              </button>
              <button
                onClick={() => switchDemoRole('guest')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${role === 'guest' ? 'bg-[#393744] text-white' : 'text-[#393744] hover:bg-slate-100'}`}
              >
                Tamu / Guest
              </button>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#524B66]">
            <span>Supabase Connected</span>
            <span aria-hidden="true">·</span>
            <span>Rp1.000.000 Min Rent</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar strictly obeying the 3-zone contract */}
      <header className="sticky top-0 z-40 bg-[#FFFCF8]/95 backdrop-blur-md border-b border-[#E6DDF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group text-left whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F8D7E8] flex items-center justify-center text-[#393744] shadow-xs group-hover:bg-[#FFF0B8] transition-colors">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#393744]">
              KosfeeKu
            </span>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#393744]/80">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`hover:text-[#393744] transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  currentPath === link.path ? 'text-[#393744] font-semibold' : ''
                }`}
              >
                {link.label}
                {currentPath === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F8D7E8]" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher Button */}
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E6DDF7] hover:bg-[#F8D7E8]/50 text-[#393744] transition-colors whitespace-nowrap"
              title="Ganti Bahasa / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#524B66]" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Café Cart Button */}
            <button
              onClick={() => navigate('/cafe/cart')}
              className="relative p-2 text-[#393744] hover:bg-[#FFF0B8]/60 rounded-lg transition-colors"
              title="Keranjang Pesanan"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#393744] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Dashboard or Login CTA */}
            {user ? (
              <button
                onClick={() => navigate(user.role === 'owner' || user.role === 'staff' ? '/dashboard/owner' : '/dashboard/tenant')}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#393744] bg-[#F8D7E8] hover:bg-[#E6DDF7] rounded-lg transition-colors whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{user.fullName.split(' ')[0]}</span>
                <span className="text-[11px] font-normal opacity-80">({user.role})</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#393744] hover:bg-[#524B66] rounded-lg transition-colors whitespace-nowrap"
              >
                {t.navLogin}
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#393744] rounded-lg hover:bg-[#E6DDF7]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E6DDF7] bg-[#FFFCF8] px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentPath === link.path ? 'bg-[#F8D7E8] text-[#393744]' : 'text-[#393744]/80 hover:bg-[#E6DDF7]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-[#E6DDF7] flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate('/contact');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-1.5 text-xs text-[#524B66]"
              >
                {t.navContact}
              </button>
              <button
                onClick={() => {
                  navigate('/faq');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-1.5 text-xs text-[#524B66]"
              >
                {t.navFaq}
              </button>
              <button
                onClick={() => {
                  navigate('/policies');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-1.5 text-xs text-[#524B66]"
              >
                {t.navPolicies}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
