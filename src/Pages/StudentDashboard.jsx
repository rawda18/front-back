import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Package,
  LogOut,
  X,
  ArrowRight,
} from 'lucide-react';
import ThemeToggel from '../components/ThemToggel';
import '../hook/StudentDash.css';
import { fetchDashboardProjects, fetchDashboardRequests } from '../Api/StudentDashboard.api.js';

const STATUS_STYLE = {
  Pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
  Approved: 'bg-green-500/20 text-green-400 border border-green-500/40',
  Completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
};

// ── Nav Item ──────────────────────────────────────────────────
const NavItem = ({ label, icon: IconComponent, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-[12px] rounded-[12px] transition-all duration-300 ${
      active
        ? 'bg-[#2B4C9F] text-white shadow-lg'
        : 'text-[var(--title-custom)] hover:bg-[var(--hover-bg)] hover:text-[var(--title-custom)]'
    }`}
  >
    <span
      className={`${active ? 'text-white' : 'text-[var(--small-custom)]'}`}
      style={{ transform: 'scale(1.4)' }}
    >
      <IconComponent size={14} />
    </span>
    <span className="text-[14px]">{label}</span>
  </button>
);

// ── Mobile Bottom Nav Item ────────────────────────────────────
const MobItem = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 flex-1 py-2 bg-transparent border-none cursor-pointer"
  >
    <div
      className={`w-9 h-9 flex items-center justify-center rounded-[10px] transition-all ${
        active ? 'bg-[#EEF2FF]' : ''
      }`}
    >
      <Icon size={18} className={active ? 'text-[#2B4C9F]' : 'text-[var(--small-custom)]'} />
    </div>
    <span
      className={`text-[10px] font-medium ${active ? 'text-[#2B4C9F]' : 'text-[var(--small-custom)]'}`}
    >
      {label.split(' ')[0]}
    </span>
  </button>
);

// ── Sidebar ───────────────────────────────────────────────────
const Sidebar = ({ activeLabel }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/student' },
    { label: 'My Projects', icon: FolderKanban, path: '/projects' },
    { label: 'My Requests', icon: ClipboardList, path: '/my-requests' },
    { label: 'Browse Materials', icon: Package, path: '/materials/browse' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex w-[260px] h-screen sticky top-0 flex-col border-r border-[var(--card-border)] bg-[var(--background)] transition-all"
        style={{ fontFamily: 'Inter' }}
      >
        <div className="h-[100px] px-6 flex items-center border-b border-[var(--card-border)]">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-[48px] h-[48px]">
              <img src="/logo.png" alt="logo" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--title-custom)] text-[18px] font-semibold">ESI-GM</span>
              <span className="text-[12px] text-[var(--small-custom)] mt-1">ESI 8 Mai 1945</span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col p-3 gap-[7px] flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={activeLabel === item.label}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        <div className="flex flex-col items-start w-full pt-4 px-4 gap-3 border-t border-[var(--card-border)]">
          <div className="flex gap-3 mb-1 ml-1">
            <div className="flex flex-col px-3">
              <div className="text-sm font-bold text-[var(--title-custom)]">Sarah Student</div>
              <div className="text-xs text-[var(--small-custom)]">Student</div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-16 self-stretch mb-3">
            <ThemeToggel />
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
              className="flex items-center bg-transparent gap-2 text-[var(--small-custom)] hover:text-red-500 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="h-16 flex items-center justify-center border-t border-[var(--card-border)]">
          <button
            onClick={() => navigate('/StudentDashboard')}
            className="text-[var(--small-custom)] hover:text-[var(--title-custom)] transition-all hover:scale-110"
          >
            <X size={23} strokeWidth={2.5} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[var(--background)] border-t border-[var(--card-border)] h-16 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        style={{ fontFamily: 'Inter' }}
      >
        {navItems.map((item) => (
          <MobItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={activeLabel === item.label}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>
    </>
  );
};

// ── StudentDashboard ──────────────────────────────────────────
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [projectsData, requestsData] = await Promise.all([
        fetchDashboardProjects(),
        fetchDashboardRequests(),
      ]);
      setProjects(projectsData);
      setRequests(requestsData);
      setLoading(false);
    };
    loadData();
  }, []);

  const stats = [
    {
      label: 'My Projects',
      value: projects.length,
      icon: <FolderKanban size={24} />,
      iconColor: '#6366F1',
      bg: 'rgba(99,102,241,0.15)',
    },
    {
      label: 'Total Requests',
      value: requests.length,
      icon: <ClipboardList size={24} />,
      iconColor: '#A855F7',
      bg: 'rgba(168,85,247,0.15)',
    },
    {
      label: 'Approved',
      value: requests.filter((r) => r.status === 'Approved').length,
      icon: <LayoutDashboard size={24} />,
      iconColor: '#22C55E',
      bg: 'rgba(34,197,94,0.15)',
    },
    {
      label: 'Pending',
      value: requests.filter((r) => r.status === 'Pending').length,
      icon: <LayoutDashboard size={24} />,
      iconColor: '#EAB308',
      bg: 'rgba(234,179,8,0.15)',
    },
  ];
  return (
    <div
      className="flex h-screen dynamic-bg transition-colors duration-300"
      style={{ fontFamily: 'Inter' }}
    >
      <Sidebar activeLabel="Dashboard" />

      <main className="flex-1 overflow-y-auto p-7 pb-20 md:pb-7">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-title-custom">Student Dashboard</h1>
            <p className="text-sm text-small-custom">Manage your projects and material requests</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 glass-card border border-[#1E40AF4D] min-h-[109px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-title-custom">{s.label}</p>
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ background: s.bg, color: s.iconColor }}
                  >
                    {s.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold mt-[-20px]" style={{ color: s.iconColor }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div
              onClick={() => navigate('/projects')}
              className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, transparent 100%)',
                border: '1px solid #2B7FFF33',
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-indigo-500/10 text-[#51A2FF]">
                <FolderKanban size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-title-custom">Manage Projects</h3>
              <p className="text-sm text-small-custom mb-4">
                Create new projects, add team members, and organize your work.
              </p>
              <span className="text-sm text-[#51A2FF] flex items-center gap-2">
                View Projects <ArrowRight size={20} />
              </span>
            </div>

            <div
              onClick={() => navigate('/materials/browse')}
              className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, transparent 100%)',
                border: '1px solid #AD46FF33',
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-purple-500/10 text-purple-500">
                <Package size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-title-custom">Request Materials</h3>
              <p className="text-sm text-small-custom mb-4">
                Browse available materials and submit requests for your projects.
              </p>
              <span className="text-sm text-purple-500">Browse Materials →</span>
            </div>
          </div>

          {/* My Projects */}
          <div className="rounded-2xl p-6 mb-8 bg-[var(--card)] border border-[var(--card-border)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-title-custom font-bold text-lg">
                <FolderKanban size={20} /> My Projects
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-[var(--card-border)] hover:bg-black/5 transition-all cursor-pointer flex flex-col min-h-[100px]"
                >
                  <div className="flex-1">
                    <h4 className="text-[15px] text-title-custom mb-1">{p.title}</h4>
                    <p className="text-[11px] text-small-custom leading-snug opacity-80 line-clamp-2">
                      {p.desc}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] text-small-custom uppercase tracking-tight">
                      {p.members} team member(s)
                    </span>
                    <span className="text-[10px] text-small-custom opacity-50">{p.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="rounded-2xl overflow-hidden py-3 bg-[var(--card)] border border-[var(--card-border)]">
            <div className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-2 text-title-custom font-bold text-lg">
                <ClipboardList size={20} /> Recent Requests
              </div>
              <button
                onClick={() => navigate('/my-requests')}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="flex flex-col gap-4 mx-auto max-w-[95%]">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-6 py-3 rounded-xl border border-[var(--card-border)] hover:bg-black/5 transition-all cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-title-custom truncate">{r.project}</p>
                    <p className="text-xs text-small-custom mt-1">
                      {r.items} item(s) • Updated: {r.updatedAt}
                    </p>
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[r.status]}`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
