import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Map as MapIcon, FileText, Phone, Home as HomeIcon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './components/Home';
import MapView from './components/MapView';
import OCRScanner from './components/OCRScanner';
import EmergencyContacts from './components/EmergencyContacts';
import { cn } from './lib/utils';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon size={18} /> },
    { path: '/map', label: 'Nearby Help', icon: <MapIcon size={18} /> },
    { path: '/ocr', label: 'OCR Scanner', icon: <FileText size={18} /> },
    { path: '/contacts', label: 'Contacts', icon: <Phone size={18} /> },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-blue-600 text-white rounded-xl group-hover:rotate-12 transition-transform">
              <Shield size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">UrbanAssist</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  location.pathname === item.path
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all",
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen gradient-bg flex flex-col">
        <Navigation />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/ocr" element={<OCRScanner />} />
              <Route path="/contacts" element={<EmergencyContacts />} />
            </Routes>
          </AnimatePresence>
        </main>
        <footer className="py-8 border-t border-slate-200 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-slate-400 font-medium">
              © {new Date().getFullYear()} UrbanAssist Lite • Built with Open Data & Privacy
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
