import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  QrCode,
  Users,
  LogOut,
  Wrench,
  X,
  Menu,
  ArrowUpRight,
} from 'lucide-react';
import logo from '../Pages/logo.jpg';

//
const NavButton = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-[#6366F1] text-white shadow-md'
        : 'text-[var(--title-custom)] hover:bg-[var(--hover-bg)] hover:text-[var(--title-custom)] font-[var(--font-family)]'
    }`}
  >
    <Icon size={18} className={active ? 'text-white' : 'text-[var(--small-custom)]'} />
    <span>{label}</span>
  </button>
);

export default function Sidebare3({ activeLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/storekeeper' },
    { label: 'Inventory', icon: Package, path: '/inventory' },
    { label: 'QR Scanner', icon: QrCode, path: '/qr-scanner' },
    { label: 'Material Outputs', icon: ArrowUpRight, path: '/material-outputs' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
  ];

  return (
    <>
      {/* زر المنيو - أزرق كيما الصورة */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#2B4C9F] text-white rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 flex flex-col h-screen transition-transform duration-300 ease-in-out

          bg-[var(--caIn)] border-r border-[var(--btali)]

          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:sticky md:top-0 md:flex
        `}
      >
        {/* Logo Section */}

        <div className="flex items-center justify-between h-[97px] px-6 border-b border-[var(--btali)]">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#2B4C9F]/20"
            />
            <div className="flex flex-col">
              <span className="text-[var(--title-custom)] text-lg font-bold leading-tight">
                ESI-GM
              </span>
              <span className="text-[10px] text-[var(--small-custom)] font-medium">
                Lab Equipment
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-[var(--small-custom)]">
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
          {navItems.map((item) => (
            <NavButton
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={activeLabel === item.label}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
            />
          ))}
        </nav>

        {/* User & Logout - هبطناهم بـ mt-auto */}

        <div className="mt-auto border-t border-[var(--btali)] p-5 bg-[var(--background)]/50">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[var(--title-custom)]">Storekeeper</span>
              <span className="text-[10px] text-[var(--small-custom)] uppercase tracking-wider font-bold">
                Staff
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="flex items-center gap-2.5 px-2 text-sm font-medium text-[var(--small-custom)] hover:text-red-500 transition-all group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>

        {/* Close button السفلي */}
        <button
          onClick={() => navigate('/dashboard/storekeeper')}
          className="flex justify-center items-center w-full h-[55px] border-t border-[var(--btali)] hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
        >
          <X size={20} className="text-[var(--small-custom)]" />
        </button>
      </aside>
    </>
  );
}
