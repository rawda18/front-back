// src/Api/maintenance.api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000'; // ✅ بدون /api

export const fetchMaintenance = async () => {
  try {
    const response = await axios.get(`${API_BASE}/maintenance/records/`);
    // البيانات مباشرة (موش results)
    const records = response.data;

    return records.map((record) => ({
      id: record.id,
      material: record.material_name || record.material,
      category: record.category || 'General',
      last_maintenance: record.last_maintenance_date
        ? new Date(record.last_maintenance_date).toLocaleDateString('fr-FR')
        : '—',
      next_maintenance: record.next_maintenance_date
        ? new Date(record.next_maintenance_date).toLocaleDateString('fr-FR')
        : '—',
      type: record.maintenance_type || 'Preventive',
      status: record.priority || record.status || 'Scheduled',
    }));
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return [];
  }
};

export const fetchMaintenanceStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/maintenance/stats/`);
    const data = response.data;

    return {
      needsAttention: data.needs_attention || 0,
      upcoming30: data.upcoming_30_days || 0,
    };
  } catch (error) {
    console.error('Error fetching maintenance stats:', error);
    return { needsAttention: 0, upcoming30: 0 };
  }
};

// إضافة عنصر صيانة جديد (إذا الـ Backend يدعم)
export const addMaintenanceItem = async (newItem) => {
  try {
    const response = await axios.post(`${API_BASE}/maintenance/records/`, newItem);
    return response.data;
  } catch (error) {
    console.error('Error adding maintenance item:', error);
    throw error;
  }
};

// حذف عنصر صيانة
export const deleteMaintenanceItem = async (id) => {
  try {
    await axios.delete(`${API_BASE}/maintenance/records/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting maintenance item:', error);
    return false;
  }
};
