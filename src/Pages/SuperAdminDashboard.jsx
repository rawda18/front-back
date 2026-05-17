import React, { useState, useEffect } from 'react';
import { getDashboardStats, getRoles } from '../Api/superAdmin.api.js';
import { getLaboratories } from '../Api/LabsMana.api.js';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement.jsx';
import logo from './logo.jpg';
import {
  LayoutDashboard,
  Users,
  Beaker,
  Box,
  GitPullRequest,
  ShieldCheck,
  Key,
  GraduationCap,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  X,
  Activity,
  Building2,
  TrendingUp,
  Shield,
  Wrench,
  CircleCheck,
  CircleAlert,
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [dark, setDark] = useState(false);
  const toggleTheme = () => setDark(!dark);
  const [stats, setStats] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesData, setRolesData] = useState([]);
  const navigate = useNavigate();

  const getStatConfig = (label) => {
    const l = label.toLowerCase();
    if (l.includes('user')) {
      return { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50' };
    }
    if (l.includes('lab')) {
      return { icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50/50' };
    }
    if (l.includes('material') || l.includes('item')) {
      return { icon: Box, color: 'text-green-600', bg: 'bg-green-50/50' };
    }
    if (l.includes('request')) {
      return { icon: GitPullRequest, color: 'text-orange-600', bg: 'bg-orange-50/50' };
    }
    // ديفو إذا ما عرفش الـ label
    return { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-50/50' };
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const statsData = await getDashboardStats();
        const labsData = await getLaboratories();
        const rolesData = await getRoles();

        setStats(statsData.stats || []);
        setLabs(labsData);
        setRolesData(rolesData);
      } catch (err) {
        console.error('Error loading data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#020817]">
        {/* تقدري تديري Spinner تدور هنا */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  const iconMap = {
    Admins: Users,
    Students: GraduationCap,
  };
  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${dark ? 'bg-[#020817] text-white' : 'bg-[rgba(255, 255, 255, 0.95)] text-slate-900'}`}
    >
      {/* --- Sidebar (Scrolls with page) --- */}
      <aside
        className={`hidden md:flex md:w-64 h-screen flex-col border-r ${dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-[#FFF] border-[#E2E8F0]'}`}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center w-full h-[97px] px-6 border-b ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'} flex-shrink-0`}
        >
          <div className="flex-shrink-0 w-[48px] h-[48px] bg-[#2B4C9F] rounded-full flex items-center justify-center text-white font-bold italic">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full rounded-full bg-lightgray bg-center bg-cover bg-no-repeat"
            />
          </div>
          <div className="flex flex-col ml-4">
            <h1
              className={`text-[20px] font-bold leading-tight ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            >
              ESI-GM
            </h1>
            <p className={`text-[10px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              ESI 8 Mai 1945
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col p-4 gap-2 flex-1 min-h-[300px]">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full bg-[#2B4C9F] text-[#FFF] shadow-lg shadow-blue-900/20">
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
        </nav>

        {/* Profile  (In Sidebar) */}
        <div
          className={`flex flex-col p-4 gap-3 border-t ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'}`}
        >
          <div className="px-4">
            <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Sarah Student
            </p>
            <p className={`text-xs ${dark ? 'text-[#94A3B8]' : 'text-gray-500'} tracking-tight`}>
              Student
            </p>
          </div>

          <div className="flex justify-between items-center px-2">
            <button
              onClick={() => {
                localStorage.removeItem('token'); // إذا كان عندك token
                localStorage.removeItem('user'); // مسح بيانات المستخدم
                navigate('/login'); // يروح لصفحة login
              }}
              className={`flex items-center bg-transparent gap-2 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} hover:text-red-500 transition-colors`}
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        <div
          onClick={() => navigate('/dashboard/superadmin')}
          className={`p-4 border-t flex justify-center items-center ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'}`}
        >
          <X size={20} className={`${dark ? 'text-[#94A3B8]' : 'text-gray-400'} cursor-pointer`} />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className={`flex-1 p-4 sm:p-6 md:p-8 ${dark ? 'bg-[#020817]' : 'bg-[#F8FAFC]'}`}>
        {/* --- Top Header (The one you mentioned) --- */}
        <header
          className={`flex justify-end border-b ${dark ? 'border-[#2B4C9F]' : 'boder-gray-150'} items-center mb-5 pb-3 gap-4`}
        >
          {/**/}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-white border-[#E2E8F0] hover:bg-gray-100'}`}
          >
            {dark ? <Moon size={18} stroke="#2B4C9F" /> : <Sun size={18} stroke="#2B4C9F" />}
          </button>
        </header>

        <div className="mb-7">
          <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
          <p className={`${dark ? 'text-[#94A3B8]' : 'text-gray-500'} text-sm`}>
            System-wide overview and management
          </p>
        </div>

        {/* 1. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {stats.map((s) => {
            // نعيطو للدالة اللي تعطينا الأيقونة واللون على حساب الـ label اللي جابو الـ API
            const config = getStatConfig(s.label);
            const Icon = config.icon;
            return (
              <div key={s.id} className={`rounded-2xl border-[0.667px] p-4 ml-2 ${s.style}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-1 rounded-2xl ${s.color} ${s.bg}`}>
                    <Icon size={22} />
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 uppercase tracking-tighter ${s.status} ${s.color}`}
                  >
                    {s.tagIcon ? <s.tagIcon /> : s.tagValue} {s.tagText}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-4xl font-bold pb-2 pl-1">{s.value}</p>
                  <h2
                    className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} pl-1 text-[11px] font-medium text-[10px] leading-[20px] uppercase tracking-wider`}
                  >
                    {s.label}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Roles Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {rolesData.map((role) => (
            <RoleCard
              key={role.id}
              icon={iconMap[role.label]}
              count={role.count}
              label={role.label}
              color={role.color}
              dark={dark}
              details={role.details}
            />
          ))}
        </div>

        {/* 3. Labs Overview */}
        <section
          className={`mb-10 transition-all hover:translate-y-[-2px] rounded-2xl border-[0.667px] ${dark ? 'bg-[#0A1128] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'} p-6`}
        >
          <h3
            className={`text-sm font-bold flex items-center gap-2 mb-6 uppercase tracking-wider ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
          >
            <span className="text-indigo-600">
              <Building2 size={18} />
            </span>{' '}
            Laboratories Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className={`p-6 border rounded-[12px] border-[0.667px] relative ${dark ? 'bg-[#0A1128] border-[#1E293B]' : 'border-[#E2E8F0] bg-[rgba(241,245,249,0.05)]'}`}
              >
                <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full">
                  {lab.status === 'active' ? (
                    <CircleCheck className="text-[#05DF72]" />
                  ) : (
                    <CircleAlert className="text-[#FDC700]" />
                  )}
                </div>
                <h4
                  className={`text-lg font-bold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                >
                  {lab.name}
                </h4>
                <p
                  className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-[11px] font-medium mb-2`}
                >
                  {lab.building} - {lab.floor}
                </p>
                <div className="flex justify-between items-end">
                  <div className="flex">
                    <p
                      className={`text-[11px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-medium`}
                    >
                      Capacity :{' '}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                    >
                      {lab.capacity}
                    </p>
                  </div>
                  <p
                    className={`text-[11px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-medium`}
                  >
                    Admin:{' '}
                    <span className={`font-semibold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
                      {lab.admin}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/admin/laboratories')}
            className="text-sm bg-transparent text-[#6366F1] font-medium w-full flex pl-1 items-start group pt-4"
          >
            Manage All Laboratories →
          </button>
        </section>

        {/* 4. The Two Management Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-transparent">
          <div onClick={() => navigate('/admin/users')} className="cursor-pointer">
            <ManagementBtn
              icon={Users}
              label="User Management"
              sub="Add admins, manage permissions and roles"
              color="bg-[rgba(43,127,255,0.09)] text-blue-600"
              dark={dark}
              className="bg-[rgba(43,127,255,0.05)]"
            />
          </div>
          <div onClick={() => navigate('/admin/laboratories')} className="cursor-pointer">
            <ManagementBtn
              icon={Beaker}
              label="Laboratory Management"
              sub="Configure locations, assign admins"
              color="bg-[rgba(173,70,255,0.09)] text-purple-600"
              dark={dark}
              className="bg-[rgba(173,70,255,0.04)]"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const RoleCard = ({ icon: Icon, count, label, color, dark, details, className = '' }) => (
  <div
    className={`p-5 pb-5 pl-4 rounded-2xl border-[0.667px] transition-all hover:translate-y-[-2px] hover:shadow-md flex flex-col gap-3 ${dark ? 'bg-[#0A1128] border-[#1E293B]' : 'border-[#E2E8F0] bg-[#F8FAFC]'} ${className}`}
  >
    <div className="flex items-start gap-4">
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon size={26} />
      </div>
      <div className="flex flex-col">
        <p className="text-2xl font-bold leading-none">{count}</p>
        <p className={`text-xs ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-medium mt-1`}>
          {label}
        </p>
      </div>{' '}
    </div>
    <button className="text-xs text-[#6366F1] bg-transparent font-medium w-full flex pl-1 pt-2 items-start group">
      {details}
    </button>
  </div>
);
const ManagementBtn = ({ icon: Icon, label, sub, color, dark, className = '' }) => (
  <div
    className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all hover:translate-y-[-2px] ${dark ? 'bg-[#0A1128] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'} ${className}`}
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <h2 className="text-sm font-semibold">{label}</h2>
      <p className={`text-xs ${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>{sub}</p>
    </div>
  </div>
);

export default SuperAdminDashboard;
