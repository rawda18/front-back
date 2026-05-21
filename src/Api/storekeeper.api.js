// src/Api/storekeeper.api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// إضافة التوكن (ضروري إذا الباك محمي)
const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===================== المواد =====================
export const fetchMaterials = async () => {
  try {
    const response = await api.get('/storekeeper/materials/');
    return response.data.map(material => ({
      id: material.id,
      name: material.name,
      category: material.category,
      desc: material.description || '',
      qty: material.quantity,
      loc: material.location || '',
      lab: material.laboratory?.name || '',
      status: material.status_display || material.status || 'Available',
    }));
  } catch (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
};

// تحديث حالة مادة (تمت إزالة /update/ من الـ endpoint)
export const updateMaterialStatus = async (id, newStatus) => {
  try {
    const response = await api.patch(`/storekeeper/materials/${id}/`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating material status:', error);
    return false;
  }
};

// إضافة مادة جديدة (تم إصلاح جلب المختبرات)
export const addMaterial = async (newMaterial) => {
  try {
    // جلب المختبرات من المسار الصحيح (بدون /api/ إضافية)
    let labId = null;
    try {
      const labsResponse = await api.get('/api/laboratories/');
      const lab = labsResponse.data.find(lab => lab.name === newMaterial.lab);
      if (lab) labId = lab.id;
      else throw new Error(`المختبر "${newMaterial.lab}" غير موجود`);
    } catch (err) {
      console.warn('فشل جلب المختبرات، نستخدم مختبر افتراضي (id=1)');
      labId = 1; // مؤقت
    }

    const payload = {
      name: newMaterial.name,
      category: newMaterial.category,
      description: newMaterial.desc,
      quantity: newMaterial.qty,
      location: newMaterial.loc,
      laboratory_id:  labId, //labId, // backend يتوقع id للمختبر
     // status: newMaterial.status || 'Available',
      unit: 'piece',
      min_stock: 0,
    };
    console.log('PAYLOAD:', payload);
    const response = await api.post('/storekeeper/materials/create/', payload);
    return {
      id: response.data.id,
      name: response.data.name,
      category: response.data.category,
      desc: response.data.description,
      qty: response.data.quantity,
      loc: response.data.location,
      lab: response.data.laboratory?.name || newMaterial.lab,
      status: response.data.status,
    };
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
};

// إحصائيات المخزون
export const fetchInventoryStats = async () => {
  try {
    const response = await api.get('/storekeeper/stats/');
    return {
      totalOutputs: response.data.total_materials || 0,
      available: response.data.available_items || 0,
      lowStock: response.data.low_stock_alerts || 0,
      needsMaintenance: response.data.needs_maintenance || 0,
    };
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    // Fallback
    const materials = await fetchMaterials();
    return {
      totalOutputs: materials.length,
      available: materials.filter(m => m.status === 'Available').length,
      lowStock: materials.filter(m => m.qty < 10).length,
      needsMaintenance: materials.filter(m => m.status === 'Under Maintenance').length,
    };
  }
};