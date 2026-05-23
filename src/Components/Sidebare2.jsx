import React, { useState, useEffect } from 'react';
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
  Sun,
  Moon,
} from 'lucide-react';
import logo from '../Pages/logo.jpg';

const NavItem = ({ icon: Icon, label, active, dark, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
      active
        ? 'bg-[#2B4C9F] text-white shadow-md'
        : dark
          ? 'text-[#E8EAF0] hover:bg-gray-800'
          : 'text-[#0F172A] hover:bg-gray-100'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default function Sidebare2({ activeLabel, dark, toggleTheme }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('Administrator');

  useEffect(() => {
    const name = localStorage.getItem('user_name') || 'Admin';
    const role = localStorage.getItem('user_role') || 'Administrator';
    setUserName(name);
    setUserRole(role);
  }, []);

  return (
    <aside
      className={`hidden md:flex md:w-64 flex-col border-r ${
        dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-[#FFF] border-[#E2E8F0]'
      }`}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center h-[97px] px-6 border-b ${
          dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'
        }`}
      >
        <div className="flex-shrink-0 w-[48px] h-[48px]">
          <img src="/logo.png" alt="logo" className="w-full h-full rounded-full object-cover" />
        </div>
        <div className="ml-4">
          <h1 className={`text-base font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
            ESI-GM
          </h1>
          <p className={`text-[10px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Lab Equipment
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 space-y-2">
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={activeLabel === 'Dashboard'}
          dark={dark}
          onClick={() => navigate('/dashboard/admin')}
        />
        <NavItem
          icon={Box}
          label="Inventory"
          active={activeLabel === 'Inventory'}
          dark={dark}
          onClick={() => navigate('/inventory')}
        />
        <NavItem
          icon={QrCode}
          label="QR Scanner"
          active={activeLabel === 'QR Scanner'}
          dark={dark}
          onClick={() => navigate('/qr-scanner')}
        />
        <NavItem
          icon={Users}
          label="Users"
          active={activeLabel === 'Users'}
          dark={dark}
          onClick={() => navigate('/users')}
        />
        <NavItem
          icon={ClipboardList}
          label="Requests"
          active={activeLabel === 'Requests'}
          dark={dark}
          onClick={() => navigate('/requests')}
        />
        <NavItem
          icon={ArrowUpRight}
          label="Material Outputs"
          active={activeLabel === 'Material Outputs'}
          dark={dark}
          onClick={() => navigate('/material-outputs')}
        />
        <NavItem
          icon={Wrench}
          label="Maintenance"
          active={activeLabel === 'Maintenance'}
          dark={dark}
          onClick={() => navigate('/maintenance')}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          active={activeLabel === 'Settings'}
          dark={dark}
          onClick={() => navigate('/settings')}
        />
      </nav>

      {/* User Info & Logout */}
      <div className={`p-6 border-t ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'}`}>
        <div className="mb-4">
          <p className="text-xs font-bold">{userName}</p>
          <p className={`text-[10px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{userRole}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border ${
              dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-white border-[#E2E8F0]'
            }`}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="flex items-center gap-2 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => navigate('/dashboard/admin')}
        className={`flex flex-col items-start w-full h-[52px] pt-[16.667px] px-4 ${
          dark ? 'border-t border-[#2B4C9F]' : 'border-t border-[#E2E8F0]'
        } bg-transparent rounded-none`}
      >
        <X className="w-[20px] h-[20px] flex-shrink-0" />
      </button>
    </aside>
  );
}
