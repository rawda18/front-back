import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddLaboratory from './AddLaboratory';
import { useTheme } from '../Context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import {
  Moon,
  Sun,
  LayoutDashboard,
  LogOut,
  X,
  Building2,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  MapPin,
  Users,
  Boxes,
  Layers,
  Edit2,
  Box,
  SlidersHorizontal,
  Home,
} from 'lucide-react';
import logo from './logo.jpg';

import { getLaboratories } from '../Api/LabsMana.api.js';
const LaboratoryManagementPage = () => {
  const { isDarkMode: darkMode, toggleTheme } = useTheme();

  // ✅ نضيفو state للمودال
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ دالة لإضافة المختبر الجديد
  const handleAddLaboratory = (newLab) => {
    setLaboratories((prev) => [newLab, ...prev]);
  };
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const data = await getLaboratories(); // تجيب البيانات من الملف الجديد
        setLaboratories(data); // تحطهم في الـ State
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // تحبس الـ Loading
      }
    };
    fetchLabs();
  }, []);
  const stats = useMemo(() => {
    const total = laboratories.length;
    const active = laboratories.filter((lab) => lab.status === 'Active').length;
    const maintenance = laboratories.filter((lab) => lab.status === 'Maintenance').length;
    const inactive = laboratories.filter((lab) => lab.status === 'Inactive').length;
    return { total, active, maintenance, inactive };
  }, [laboratories]);

  const filteredLabs = useMemo(() => {
    if (statusFilter === 'All') return laboratories;
    return laboratories.filter((lab) => lab.status === statusFilter);
  }, [laboratories, statusFilter]);

  const buildingGroups = useMemo(() => {
    const grouped = {};
    laboratories.forEach((lab) => {
      if (!grouped[lab.building]) grouped[lab.building] = [];
      grouped[lab.building].push(lab);
    });
    return grouped;
  }, [laboratories]);

  const statusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 border bg-[linear-gradient(135deg,rgba(0,201,80,0.10)_0%,rgba(0,166,62,0.05)_100%)] border-[rgba(0,201,80,0.20)]">
          <CheckCircle size={14} />
          Active
        </span>
      );
    }
    if (status === 'Maintenance') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#FDC700] border bg-[linear-gradient(135deg,rgba(240,177,0,0.10)_0%,rgba(208,135,0,0.05)_100%)] border-[rgba(240,177,0,0.20)]">
          <AlertCircle size={14} />
          Maintenance
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-600 border bg-[linear-gradient(135deg,rgba(240,177,0,0.10)_0%,rgba(208,135,0,0.05)_100%)] border-[rgba(240,177,0,0.20)]">
        <XCircle size={14} />
        Inactive
      </span>
    );
  };

  const statCardStyle = {
    Total:
      'bg-[linear-gradient(135deg,rgba(43,127,255,0.10)_0%,rgba(21,93,252,0.05)_100%)] border-[rgba(43,127,255,0.20)]',
    Active:
      'bg-[linear-gradient(135deg,rgba(0,201,80,0.10)_0%,rgba(0,166,62,0.05)_100%)] border-[rgba(0,201,80,0.20)]',
    Maintenance:
      'bg-[linear-gradient(135deg,rgba(240,177,0,0.10)_0%,rgba(208,135,0,0.05)_100%)] border-[rgba(240,177,0,0.20)]',
    Inactive:
      'bg-[linear-gradient(135deg,rgba(251,44,54,0.10)_0%,rgba(231,0,11,0.05)_100%)] border-[rgba(251,44,54,0.20)]',
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex">
        <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col">
          <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex-shrink-0 w-[48px] h-[48px]">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full rounded-full bg-lightgray bg-center bg-cover bg-no-repeat"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">ESI-GM</h1>
              <p className="text-[11px] text-slate-400">Lab Equipment</p>
            </div>
          </div>

          <nav className="px-4 py-4 flex-1">
            <button
              onClick={() => navigate('/dashboard/superadmin')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 bg-transparent transition"
            >
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          </nav>

          <div className="px-4 py-5 border-t border-slate-100 dark:border-slate-800">
            <div className="px-2">
              <p className="text-sm font-bold text-slate-800 dark:text-white">Super Admin</p>
              <p className="text-[11px] text-slate-400">superadmin</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token'); // إذا كان عندك token
                localStorage.removeItem('user'); // مسح بيانات المستخدم
                navigate('/login'); // يروح لصفحة login
              }}
              className="mt-5 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 bg-transparent transition"
            >
              <LogOut size={18} />
              <span className="text-sm font-semibold">Logout</span>
            </button>
            <div
              onClick={() => navigate('/dashboard/superadmin')}
              className="mt-8 flex justify-center text-slate-300 dark:text-slate-700"
            >
              <X size={18} />
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="h-20 px-8 flex items-center justify-end border-b border-slate-200/60 dark:border-slate-800">
            <ThemeToggle />
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Laboratory Management</h2>
                <p className="text-slate-500 mt-1">
                  Configure laboratory locations and assign administrators
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-sm transition"
              >
                <Plus size={18} />
                Add Laboratory
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                {
                  label: 'Total Laboratories',
                  count: stats.total,
                  icon: <Building2 size={22} className="text-[#51A2FF] bg-transparent" />,
                  key: 'Total',
                },
                {
                  label: 'Active',
                  count: stats.active,
                  icon: <CheckCircle size={22} className="text-[#05DF72] bg-transparent" />,
                  key: 'Active',
                },
                {
                  label: 'Maintenance',
                  count: stats.maintenance,
                  icon: <AlertCircle size={22} className="text-[#FDC700] bg-transparent" />,
                  key: 'Maintenance',
                },
                {
                  label: 'Inactive',
                  count: stats.inactive,
                  icon: <XCircle size={22} className="text-[#FF6467] bg-transparent" />,
                  key: 'Inactive',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`${statCardStyle[item.key]} rounded-2xl border p-5 shadow-sm`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-transparent dark:bg-slate-900/60 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-3xl font-bold leading-none">{item.count}</div>
                      <div className="text-sm text-slate-500 mt-1">{item.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  statusFilter === 'All'
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Active')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  statusFilter === 'Active'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('Maintenance')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  statusFilter === 'Maintenance'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Maintenance
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                        <Building2 size={20} className="text-indigo-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{lab.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {statusBadge(lab.status)}
                      <button className="p-2 text-slate-400 hover:text-indigo-600 bg-transparent transition">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <MapPin size={16} className="text-indigo-500" />
                      <span>
                        {lab.building} - {lab.floor}
                      </span>
                    </div>

                    {lab.admin && lab.adminEmail && (
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={16} className="text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              Admin: {lab.admin}
                            </p>
                            <p className="text-slate-400 text-xs">{lab.adminEmail}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[rgba(43,127,255,0.10)] flex items-center justify-center">
                          <Users size={15} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg leading-none">{lab.capacity}</p>
                          <p className="text-xs text-slate-400">Capacity</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[rgba(0,201,80,0.10)] flex items-center justify-center">
                          <Box size={15} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg leading-none">{lab.materials}</p>
                          <p className="text-xs text-slate-400">Materials</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Layers ize={20} className="text-indigo-500" />
                <h3 className="text-lg font-bold">Building Overview</h3>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {Object.entries(buildingGroups).map(([building, labs]) => (
                  <div key={building} className="space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                      <Building2 size={16} className="text-blue-500" />
                      {building}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddLaboratory
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddLaboratory}
      />
    </div>
  );
};

export default LaboratoryManagementPage;
