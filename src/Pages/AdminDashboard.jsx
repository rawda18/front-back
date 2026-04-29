import React, { useState, useEffect } from 'react';
import SlideBare from '../Components/SlideBare';
import ThemeToggle from '../Components/ThemeToggle';
import { Icon } from '../Components/Icon';
import axios from 'axios';

const ADMIN_DASH_API = 'http://localhost:8002/api';

const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${ADMIN_DASH_API}/dashboard/stats/`);
    const data = response.data;
    const statsMap = {};
    data.stats.forEach((stat) => {
      if (stat.title === 'Total Materials') statsMap.total_materials = stat.value;
      if (stat.title === 'Available Items') statsMap.available_items = stat.value;
      if (stat.title === 'Pending Requests') statsMap.pending_requests = stat.value;
      if (stat.title === 'Maintenance Alerts') statsMap.maintenance_alerts = stat.value;
    });
    return statsMap;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      total_materials: 1882,
      available_items: 47,
      pending_requests: 1,
      maintenance_alerts: 0,
    };
  }
};

const fetchRecentRequests = async () => {
  try {
    const response = await axios.get(`${ADMIN_DASH_API}/dashboard/stats/`);
    const data = response.data;
    return data.recent_requests.map((req) => ({
      title: req.project_name,
      user: req.requester_name,
      meta: `${req.item_count} item(s) • ${new Date(req.created_at).toLocaleDateString()}`,
      status: req.status,
    }));
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    return [];
  }
};

const fetchMaterialsStats = async () => {
  try {
    const response = await axios.get(`${ADMIN_DASH_API}/dashboard/stats/`);
    const data = response.data;
    const byStatus = data.charts.by_status;
    const stats = { available: 0, in_use: 0, under_maintenance: 0, damaged: 0, lost: 0 };
    byStatus.forEach((item) => {
      if (item.status === 'Available') stats.available = item.count;
      if (item.status === 'In Use') stats.in_use = item.count;
      if (item.status === 'Under Maintenance') stats.under_maintenance = item.count;
      if (item.status === 'Damaged') stats.damaged = item.count;
      if (item.status === 'Lost') stats.lost = item.count;
    });
    return stats;
  } catch (error) {
    console.error('Error fetching materials stats:', error);
    return { available: 0, in_use: 0, under_maintenance: 0, damaged: 0, lost: 0 };
  }
};

const fetchUserOverview = async () => {
  try {
    const response = await axios.get(`${ADMIN_DASH_API}/dashboard/stats/`);
    return response.data.user_overview;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { lab_admins: 0, storekeepers: 0, students: 0 };
  }
};

const fetchMaintenanceAlerts = async () => {
  try {
    const response = await axios.get(`${ADMIN_DASH_API}/dashboard/stats/`);
    return response.data.maintenance_alerts_list || [];
  } catch (error) {
    console.error('Error fetching maintenance alerts:', error);
    return [];
  }
};

const categoryBars = [6, 3, 10, 6, 3, 4, 3, 6, 5];

function StatCard({ item }) {
  const IconComponent = Icon[item.iconKey] || Icon.package;
  return (
    <div className="card stat-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <div>
          <p className="small muted">{item.title}</p>
          <h3>{item.value}</h3>
          <p className="success-text" style={{ visibility: item.note ? 'visible' : 'hidden' }}>
            {item.note || '.'}
          </p>
        </div>
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            display: 'grid',
            placeItems: 'center',
            color: item.iconColor,
            background: 'var(--card-2)',
          }}
        >
          <IconComponent size={18} />
        </div>
      </div>
    </div>
  );
}

function CategoryChart() {
  const max = Math.max(...categoryBars);
  return (
    <div className="card chart-card">
      <h4>Materials by Category</h4>
      <div className="bar-chart">
        {categoryBars.map((value, index) => (
          <div key={index} className="bar-group">
            <div className="bar" style={{ height: `${(value / max) * 100}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusChart({ materials }) {
  const total =
    materials.available +
    materials.in_use +
    materials.under_maintenance +
    materials.damaged +
    materials.lost;
  const availablePercent = total > 0 ? ((materials.available / total) * 100).toFixed(1) : 0;
  return (
    <div className="card chart-card">
      <h4>Materials by Status</h4>
      <div className="pie-wrap">
        <span className="success-text">Available {availablePercent}%</span>
        <div className="pie-circle" />
      </div>
    </div>
  );
}

function RecentRequests({ requests }) {
  return (
    <div className="card list-card">
      <h4>Recent Requests</h4>
      <div className="request-list">
        {requests.map((item, index) => (
          <div className="request-item" key={index}>
            <div>
              <h5>{item.title}</h5>
              <p className="muted small">{item.user}</p>
              <p className="muted small">{item.meta}</p>
            </div>
            <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaintenanceAlerts({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div className="card list-card">
        <h4>Maintenance Alerts</h4>
        <div className="empty-box">No alerts</div>
      </div>
    );
  }
  return (
    <div className="card list-card">
      <h4>Maintenance Alerts</h4>
      <div className="request-list">
        {alerts.map((alert) => (
          <div className="request-item" key={alert.id}>
            <div>
              <h5>{alert.material_title}</h5>
              <p className="muted small">{alert.issue}</p>
            </div>
            <span className="badge warning">{alert.is_active ? 'Active' : 'Resolved'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserOverview({ users }) {
  return (
    <div className="card overview-card">
      <h4>User Overview</h4>
      <div className="overview-grid">
        <div>
          <h3 className="blue">{users.lab_admins}</h3>
          <p className="small muted">Lab Admins</p>
        </div>
        <div>
          <h3 className="purple">{users.storekeepers}</h3>
          <p className="small muted">Storekeepers</p>
        </div>
        <div>
          <h3 className="green">{users.students}</h3>
          <p className="small muted">Students</p>
        </div>
      </div>
    </div>
  );
}

// ✅ دوال Hooks كلها داخل الدالة الرئيسية
export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    total_materials: 1882,
    available_items: 47,
    pending_requests: 1,
    maintenance_alerts: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [userData, setUserData] = useState({ lab_admins: 4, storekeepers: 1, students: 1 });
  const [materialsStats, setMaterialsStats] = useState({
    available: 0,
    in_use: 0,
    under_maintenance: 0,
    damaged: 0,
    lost: 0,
  });
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [stats, requests, users, materials, alerts] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentRequests(),
        fetchUserOverview(),
        fetchMaterialsStats(),
        fetchMaintenanceAlerts(),
      ]);
      setStatsData(stats);
      setRecentRequests(requests);
      setUserData(users);
      setMaterialsStats(materials);
      setMaintenanceAlerts(alerts);
      setLoading(false);
    };
    loadData();
  }, []);

  const stats = [
    {
      title: 'Total Materials',
      value: statsData.total_materials,
      note: '+12% this month',
      iconKey: 'inventory',
      iconColor: '#6ea8ff',
    },
    {
      title: 'Available Items',
      value: statsData.available_items,
      note: 'Ready to use',
      iconKey: 'package',
      iconColor: '#20c997',
    },
    {
      title: 'Pending Requests',
      value: statsData.pending_requests,
      note: 'Need approval',
      iconKey: 'requests',
      iconColor: '#e8ab2f',
    },
    {
      title: 'Maintenance Alerts',
      value: statsData.maintenance_alerts,
      note: 'No active alerts',
      iconKey: 'maintenance',
      iconColor: '#ff6b81',
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-layout">
        <SlideBare activeLabel="Dashboard" />
        <main className="main-content">
          <div className="topbar">
            <div>
              <h1>Admin Dashboard</h1>
              <p className="muted">Loading...</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="text-center py-20">Loading dashboard data...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <SlideBare activeLabel="Dashboard" />
      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="muted">Overview of laboratory operations and analytics</p>
          </div>
          <ThemeToggle />
        </div>
        <section className="stats-grid">
          {stats.map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </section>
        <section className="grid-2">
          <CategoryChart />
          <StatusChart materials={materialsStats} />
        </section>
        <section className="grid-2">
          <RecentRequests requests={recentRequests} />
          <MaintenanceAlerts alerts={maintenanceAlerts} />
        </section>
        <section>
          <UserOverview users={userData} />
        </section>
      </main>
    </div>
  );
}
