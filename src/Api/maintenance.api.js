// src/Api/maintenance.api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

// إضافة token تلقائياً لكل الطلبات (نفس النظام القديم)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== MAINTENANCE APIs ====================

/**
 * جلب قائمة سجلات الصيانة
 */
export const fetchMaintenance = async () => {
  try {
    // changed: من /api/maintenance/list/ إلى /maintenance/list/
    const response = await api.get('/maintenance/list/');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return [];
  }
};

/**
 * جلب إحصائيات الصيانة
 */
export const fetchMaintenanceStats = async () => {
  try {
    // changed: من /api/maintenance/stats/ إلى /maintenance/stats/
    const response = await api.get('/maintenance/maintenance-stats/');
    return {
      needsAttention: response.data.needsAttention || 0,
      upcoming30: response.data.upcoming30 || 0,
    };
  } catch (error) {
    console.error('Error fetching maintenance stats:', error);
    return { needsAttention: 0, upcoming30: 0 };
  }
};

/**
 * إضافة سجل صيانة جديد
 */
export const addMaintenanceItem = async (materialId, issue, priority) => {
  try {
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1))
      .toISOString().split('T')[0];

    let maintenanceType = 'corrective';
    if (priority === 'critical') {
      maintenanceType = 'emergency';
    } else if (priority === 'low') {
      maintenanceType = 'preventive';
    }

    const payload = {
      material: materialId,
      description: issue,
      maintenance_type: maintenanceType,
      next_maintenance_date: nextMonth,
    };

    // changed: من /api/maintenance/add/ إلى /maintenance/add/
    const response = await api.post('/maintenance/add/', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding maintenance item:', error);
    throw error;
  }
};

/**
 * حذف سجل صيانة
 */
export const deleteMaintenanceItem = async (id) => {
  try {
    // changed: من /api/maintenance/delete/${id}/ إلى /maintenance/delete/${id}/
    await api.delete(`/maintenance/delete/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting maintenance item:', error);
    return false;
  }
};

/**
 * إكمال الصيانة (اختياري)
 */
export const completeMaintenance = async (id) => {
  try {
    const response = await api.post(`/maintenance/records/${id}/complete/`);
    return response.data;
  } catch (error) {
    console.error('Error completing maintenance:', error);
    throw error;
  }
};

/**
 * جلب المواد التي تحتاج صيانة
 */
export const fetchMaterialsNeedingMaintenance = async () => {
  try {
    const response = await api.get('/maintenance/materials-needing/');
    return response.data;
  } catch (error) {
    console.error('Error fetching materials needing maintenance:', error);
    return { damaged_materials: [], upcoming_maintenance: [] };
  }
};

/**
 * جلب التنبيهات
 */
export const fetchMaintenanceAlerts = async () => {
  try {
    const response = await api.get('/maintenance/alerts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance alerts:', error);
    return [];
  }
};

/**
 * حل تنبيه
 */
export const resolveAlert = async (alertId) => {
  try {
    const response = await api.post(`/maintenance/alerts/${alertId}/resolve/`);
    return response.data;
  } catch (error) {
    console.error('Error resolving alert:', error);
    throw error;
  }
};

// Export default object
const maintenanceAPI = {
  fetchMaintenance,
  fetchMaintenanceStats,
  addMaintenanceItem,
  deleteMaintenanceItem,
  completeMaintenance,
  fetchMaterialsNeedingMaintenance,
  fetchMaintenanceAlerts,
  resolveAlert,
};

export default maintenanceAPI;