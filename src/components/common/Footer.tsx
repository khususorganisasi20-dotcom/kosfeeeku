import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Coffee, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#FFFDFB] border-t border-[#E6DDF7] text-[#393744]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F8D7E8] flex items-center justify-center text-[#393744]">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#393744]">
                KosfeeKu
              </span>
            </div>
            <p className="text-xs font-semibold text-[#524B66]">"{t.tagline}"</p>
            <p className="text-xs text-[#393744]/70 leading-relaxed">
              {t.aboutText}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#393744]">Layanan Kami</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/rooms')} className="hover:text-black transition-colors">
                  {t.navRooms}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cafe')} className="hover:text-black transition-colors">
                  {t.navCafe}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/coworking')} className="hover:text-black transition-colors">
                  {t.navCoworking}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/facilities')} className="hover:text-black transition-colors">
                  {t.navFacilities}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#393744]">Informasi & Bantuan</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-black transition-colors">
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-black transition-colors">
                  {t.navContact}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-black transition-colors">
                  {t.navFaq}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/policies')} className="hover:text-black transition-colors">
                  {t.navPolicies}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login/owner')} className="hover:text-black transition-colors text-purple-700 font-medium">
                  Portal Pengelola
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs text-[#393744]/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#393744]">{t.addressLabel}</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#524B66] shrink-0 mt-0.5" />
              <span>Jl. Boulevard Kampus No. 42, Sleman, D.I. Yogyakarta 55281</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#524B66] shrink-0" />
              <span>+62 812-3456-7890 (WhatsApp)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#524B66] shrink-0" />
              <span>halo@kosfeeku.com</span>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-[#E6DDF7]">
              <Clock className="w-4 h-4 text-[#524B66] shrink-0 mt-0.5" />
              <div>
                <p>Café: 07:00 - 23:00 WIB</p>
                <p>Co-working: 08:00 - 22:00 WIB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E6DDF7] flex flex-col sm:flex-row items-center justify-between text-xs text-[#524B66] gap-4">
          <p>© {new Date().getFullYear()} KosfeeKu. {t.allRightsReserved}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Supabase Auth & RLS Enforced
            </span>
            <span aria-hidden="true">·</span>
            <span>IDR (Rp) Currency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
