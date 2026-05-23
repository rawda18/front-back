import { useState, useEffect } from 'react';
import { AlertCircle, Calendar, Wrench } from 'lucide-react';
import ThemeToggel from '../components/ThemToggel.jsx';
import Sidebare3 from '../components/Sidebare3.jsx';
import Sidebare2 from '../components/Sidebare2';
import { fetchMaintenance, fetchMaintenanceStats } from '../Api/maintenance.api.js';

export default function Maintenance() {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [stats, setStats] = useState([
    {
      label: 'Needs Attention',
      value: 0,
      desc: 'Materials requiring maintenance or damaged',
      icon: <AlertCircle size={24} className="text-red-500" />,
      bgb: '#f8555d33',
    },
    {
      label: 'Upcoming (30 days)',
      value: 0,
      desc: 'Scheduled maintenance in the next 30 days',
      icon: <Calendar size={24} className="text-yellow-500" />,
      bgb: '#f0b00027',
    },
  ]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMaintenance();
      const statsData = await fetchMaintenanceStats();
      setMaintenanceList(data);
      setStats([
        { ...stats[0], value: statsData.needsAttention || 0 },
        { ...stats[1], value: statsData.upcoming30 || 0 },
      ]);
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'maintenance-updated') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('user_role') || localStorage.getItem('role') || 'admin';
    setUserRole(role);
  }, []);
  return (
    <div className="flex dynamic-bg transition-colors duration-300" style={{ fontFamily: 'Inter' }}>
      {userRole?.toLowerCase() === 'storekeeper' ? (
        <Sidebare3 activeLabel="Maintenance" />
      ) : (
        <Sidebare2 activeLabel="Maintenance" />
      )}
      <main className="flex-1 relative overflow-y-auto p-8">
        <div className="absolute top-6 right-8 z-60">
          <ThemeToggel />
        </div>

        <div className="w-full mt-[45px] border-t border-solid border-[var(--btali)]"></div>

        <div className="w-full mb-5">
          <div className="flex items-center justify-between w-full">
            <div className="whitespace-nowrap">
              <h2 className="text-title-custom text-[30px] mt-3">Maintenance Management</h2>
              <p className="text-small-custom text-sm mt-[-9px]">
                Monitor equipment condition and track maintenance schedules
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 border-1 border-[#1E40AF4D] "
                style={{ background: s.bgb }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg">{s.icon}</div>
                  <div className="flex flex-col">
                    <p className="text-xs text-small-custom mb-1">{s.label}</p>
                    <p className="text-3xl font-bold text-title-custom">{s.value}</p>
                  </div>
                </div>
                <div className="text-xs text-small-custom mt-2">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Maintenance History */}

          <div className="rounded-xl border-1 border-[var(--btali)] bg-[var(--caIn)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--btali)]">
              <div className="flex items-center gap-2">
                <Wrench size={18} className="text-title-custom" />
                <h3 className="text-base font-semibold text-title-custom">Maintenance History</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {[
                      'Material',
                      'Category',
                      'Last Maintenance',
                      'Next Maintenance',
                      'Type',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-small-custom uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : maintenanceList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        No maintenance records found.
                      </td>
                    </tr>
                  ) : (
                    maintenanceList.map((row) => (
                      <tr key={row.id} className="border-t border-[#1E40AF4D] hover:bg-black/5">
                        <td className="px-4 py-3 text-title-custom text-sm font-medium">
                          {row.material}
                        </td>
                        <td className="px-4 py-3 text-small-custom text-sm">{row.category}</td>
                        <td className="px-4 py-3 text-small-custom text-sm">
                          {row.last_maintenance || '—'}
                        </td>
                        <td className="px-4 py-3 text-small-custom text-sm">
                          {row.next_maintenance}
                        </td>
                        <td className="px-4 py-3 text-small-custom text-sm">{row.type}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              row.status === 'Critical'
                                ? 'bg-red-100 text-red-600'
                                : row.status === 'High'
                                  ? 'bg-orange-100 text-orange-600'
                                  : row.status === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
