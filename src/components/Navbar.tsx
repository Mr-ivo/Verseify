import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-emerald-900 to-teal-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-emerald-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-white tracking-tight">Verseify</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" current={location.pathname === "/"}>
              Home
            </NavLink>
            <NavLink to="/reader" current={location.pathname === "/reader"}>
              Reader
            </NavLink>
            <NavLink to="/search" current={location.pathname === "/search"}>
              Search
            </NavLink>
          </nav>

          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-emerald-800">
              <MobileNavLink to="/" current={location.pathname === "/"} onClick={closeMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/reader" current={location.pathname === "/reader"} onClick={closeMenu}>
                Reader
              </MobileNavLink>
              <MobileNavLink to="/search" current={location.pathname === "/search"} onClick={closeMenu}>
                Search
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, current, children }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={`relative px-3 py-2 text-md font-medium transition-colors ${
        current 
          ? 'text-white' 
          : 'text-emerald-100 hover:text-white'
      }`}
    >
      {children}
      {current && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-300"
          layoutId="navunderline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  current: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink = ({ to, current, onClick, children }: MobileNavLinkProps) => {
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        current
          ? 'bg-emerald-900 text-white'
          : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
