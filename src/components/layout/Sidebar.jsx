import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  Calculator,
  ShieldAlert,
  Settings,
  X,
  PieChart,
  Building2
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/interrogator', label: 'AI Interrogator', icon: Brain },
  { path: '/dcf-model', label: 'DCF Model', icon: PieChart },
  { path: '/calculators', label: 'Calculators', icon: Calculator },
  { path: '/industry', label: 'Industry Analysis', icon: Building2 },
  { path: '/portfolio-risk', label: 'Portfolio Risk', icon: ShieldAlert },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 
        flex flex-col z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
            {/* Custom Logo Icon */}
            <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                <path d="M6 30 L12 22 L18 25 L26 14 L34 8"
                  stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="22" r="2.5" fill="#f97316" />
                <circle cx="26" cy="14" r="2.5" fill="#f97316" />
                <circle cx="34" cy="8" r="3" fill="#f97316" />
                <path d="M30 5 L34 8 L30 11" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Indus<span className="text-indus-500">VC</span></h1>
              <p className="text-xs text-slate-400">Financial Intelligence</p>
            </div>
          </Link>
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link to={item.path} onClick={onClose}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-md
                        transition-colors duration-200
                        ${isActive
                          ? 'bg-indus-500/10 text-indus-500 border-l-2 border-indus-500'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 text-center">
            © 2025 IndusVC
          </div>
        </div>
      </div>
    </>
  );
}
