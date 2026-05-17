import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  QrCode,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Wrench,
  ArrowRightLeft,
} from 'lucide-react';

export default function SlideBare({ activeLabel = 'Dashboard' }) {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { label: 'Inventory', icon: Package, path: '/inventory' },
    { label: 'QR Scanner', icon: QrCode, path: '/qr-scanner' },
    { label: 'Users', icon: Users, path: '/users' },
    { label: 'Requests', icon: ClipboardList, path: '/requests' },
    { label: 'Transfers', icon: ArrowRightLeft, path: '/transfers' },
    { label: 'Material Outputs', icon: Package, path: '/material-outputs' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">ESI-GM</h1>
        <p className="text-xs text-gray-500">Lab Equipment</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                activeLabel === item.label
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t">
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
