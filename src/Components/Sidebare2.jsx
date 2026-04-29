import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  QrCode,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Wrench,
  X,
  ArrowUpRight,
} from 'lucide-react';
import logo from '../Pages/logo.jpg';

const NavButton = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-[12px] rounded-[12px] transition-all duration-300 ${
      active
        ? 'bg-[#2B4C9F] text-white shadow-lg font-bold'
        : 'text-[var(--title-custom)] hover:bg-[var(--hover-bg)] hover:text-[var(--title-custom)] font-[var(--font-family)]' // هادي ترجعو خفيف ها
    }`}
  >
    <Icon size={18} strokeWidth={active ? 2 : 1.8} />
    <span className="text-[14px]">{label}</span>
  </button>
);

export default function Sidebare2({ activeLabel }) {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { label: 'Inventory', icon: Box, path: '/inventory' },
    { label: 'QR Scanner', icon: QrCode, path: '/qr-scanner' },
    { label: 'Users', icon: Users, path: '/users' },
    { label: 'Requests', icon: ClipboardList, path: '/requests' },
    { label: 'Material Outputs', icon: ArrowUpRight, path: '/material-outputs' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside
      className="md:w-64 hidden md:flex md:w-64 flex-col border-r border-[var(--card-border)] bg-[var(--background)] transition-all "
      style={{
        fontFamily: 'Inter',
      }}
    >
      {/* Header / Logo */}
      <div className="h-[100px] px-6 flex items-center border-b border-[var(--card-border)]">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-[48px] h-[48px]">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full rounded-full bg-lightgray bg-center bg-cover bg-no-repeat"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-title-custom text-base font-bold">ESI-GM</span>
            <span className="text-[10px] text-small-custom">Lab Equipment</span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-2 space-y-[3.3px]  ">
        {navItems.map((item) => (
          <NavButton
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={activeLabel === item.label}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-6 border-t border-[var(--card-border)] ">
        <div className="mb-6 ml-2">
          <div className="text-xs font-bold text-title-custom">Robotics Lab Admin</div>
          <div className="text-[10px] text-small-custom ">Admin</div>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 px-2 text-[#0F172A] dark:text-white hover:text-red-500 transition-colors group "
        >
          <div className="rounded-xl group-hover:bg-red-50 transition-colors">
            <LogOut size={18} />
          </div>
          <span className="text-sm font-medium ">Logout</span>
        </button>
      </div>
      <div className="border-t border-[var(--card-border)]"></div>
      {/* Close/Footer Button */}
      <div className="h-16 flex items-center justify-center border-t border-gray-50 dark:border-[#1E293B]">
        <button
          onClick={() => navigate('/dashboard/admin')}
          className="text-[#64748B] hover:text-[#0F172A] dark:hover:text-white transition-all transform hover:scale-110"
        >
          <X size={26} strokeWidth={2.5} />
        </button>
      </div>
    </aside>
  );
}
