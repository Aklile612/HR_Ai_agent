import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  PlusIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { authService } from '../services/auth';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/auth');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, badge: null },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon, badge: null },
    { name: 'Applicants', href: '/applicants', icon: UserGroupIcon, badge: null },
    { name: 'Interviews', href: '/interviews', icon: CalendarDaysIcon, badge: null },
    { name: 'Create Job', href: '/create-job', icon: PlusIcon, badge: null },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)} 
            />
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 left-0 flex w-72 flex-col bg-[#0a0a0a] border-r border-white/[0.08] shadow-2xl"
            >
              <SidebarContent 
                navigation={navigation} 
                location={location} 
                onItemClick={() => setSidebarOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-[#0a0a0a] border-r border-white/[0.05] shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
          <SidebarContent 
            navigation={navigation} 
            location={location}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/[0.05] bg-[#050505]/80 backdrop-blur-xl px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          >
            <Bars3Icon className="h-5 w-5" />
          </Button>
          
          <div className="flex-1" />
          
          {/* Top bar actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-rose-500/10 hover:border-rose-500/20 transition-all rounded-full px-4"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Log Out</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// Sidebar content component
const SidebarContent = ({ navigation, location, onItemClick }) => {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="w-8 h-8 bg-white/[0.03] border border-white/[0.08] rounded-lg flex items-center justify-center">
            <BriefcaseIcon className="h-4 w-4 text-white" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight">HR Assistant</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.05] text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-4 w-4 transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                }`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge variant={isActive ? 'secondary' : 'default'} className="h-5 px-2 text-xs bg-white/[0.05] text-zinc-300 border-0">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      
      <div className="p-4 border-t border-white/[0.05] space-y-2">        
        <Link to={"/auth"} className="flex items-center gap-2 w-full">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex justify-start gap-3 w-full text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded-lg"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Log out</span>
            </Button>
          </Link>
      </div>
    </>
  );
};

export default Layout;
