import axios from 'axios';

// ✅ غيرنا الرابط من 8000 إلى 8002
const API_URL = 'http://localhost:8002/api';

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/stats/`);
    return response.data; // هذا يحتوي على { stats: [...] }
  } catch (error) {
    console.error('Error fetching stats:', error);
    // بيانات وهمية احتياطية
    return {
      stats: [
        {
          id: 1,
          label: 'Total Users',
          value: 150,
          style: 'bg-blue-50',
          color: 'text-blue-600',
          bg: 'bg-blue-50/50',
          status: 'success',
          tagText: '+12%',
        },
        {
          id: 2,
          label: 'Total Labs',
          value: 8,
          style: 'bg-purple-50',
          color: 'text-purple-600',
          bg: 'bg-purple-50/50',
          status: 'success',
          tagText: '+2',
        },
        {
          id: 3,
          label: 'Total Materials',
          value: 1882,
          style: 'bg-green-50',
          color: 'text-green-600',
          bg: 'bg-green-50/50',
          status: 'success',
          tagText: '+12%',
        },
        {
          id: 4,
          label: 'Pending Requests',
          value: 1,
          style: 'bg-orange-50',
          color: 'text-orange-600',
          bg: 'bg-orange-50/50',
          status: 'warning',
          tagText: 'Need approval',
        },
      ],
    };
  }
};

export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    const users = response.data;

    // تحويل المستخدمين إلى roles
    return [
      {
        id: 1,
        label: 'Admins',
        count: users.filter((u) => u.role === 'Lab Admin').length,
        color: 'text-red-500 bg-red-50',
        details: 'Manage Lab Admins →',
      },
      {
        id: 2,
        label: 'Storekeepers',
        count: users.filter((u) => u.role === 'Storekeeper').length,
        color: 'text-blue-500 bg-blue-50',
        details: 'Manage Warehouse Managers →',
      },
      {
        id: 3,
        label: 'Students',
        count: users.filter((u) => u.role === 'Student').length,
        color: 'text-green-500 bg-green-50',
        details: 'View Students →',
      },
    ];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};
