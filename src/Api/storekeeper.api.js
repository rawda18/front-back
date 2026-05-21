import axios from 'axios';

const API_BASE = 'http://localhost:8000'; // عنوان الـ Backend

// ===================== المواد (Materials) =====================

// جلب قائمة المواد من الـ Backend
export const fetchMaterials = async () => {
  try {
    // التعديل: استخدم endpoint المواد الحقيقي
    const response = await axios.get(`${API_BASE}/storekeeper/materials/`);
    // response.data هي قائمة المواد كما تأتي من Django
    // نحولها إلى الشكل الذي يتوقعه الـ frontend
    return response.data.map((material) => ({
      id: material.id,
      name: material.name,
      category: material.category,
      desc: material.description || '',
      qty: material.quantity,
      loc: material.location || '',
      lab: material.laboratory_name || '',
      status: material.status_display || material.status || 'Available',
    }));
  } catch (error) {
    console.error('Error fetching materials:', error);
    return []; // نرجع مصفوفة فارغة عشان ما يوقعش خطأ slice
  }
};

// تحديث حالة مادة معينة
export const updateMaterialStatus = async (id, newStatus) => {
  try {
    // استخدم endpoint تحديث المادة (حسب الـ views.py يحتاج إلى تحديث جزئي)
    const response = await axios.patch(`${API_BASE}/storekeeper/materials/${id}/update/`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating material status:', error);
    return false;
  }
};

// إضافة مادة جديدة
export const addMaterial = async (newMaterial) => {
  try {
    // 1. جلب قائمة المختبرات من الخادم
    const labsResponse = await axios.get(`${API_BASE}/api/laboratories/`);
    const lab = labsResponse.data.find((lab) => lab.name === newMaterial.lab);
    if (!lab) {
      throw new Error(`المختبر "${newMaterial.lab}" غير موجود. تأكدي من إضافته أولاً عبر /admin`);
    }

    // 2. إرسال البيانات مع laboratory كـ id (رقم)
    const payload = {
      name: newMaterial.name,
      category: newMaterial.category,
      description: newMaterial.desc,
      quantity: newMaterial.qty,
      location: newMaterial.loc,
      laboratory: lab.id, // <-- الإصلاح الأساسي
      status: newMaterial.status || 'Available',
      unit: 'piece', // قيمة افتراضية لتجنب خطأ 400
      min_stock: 0,
    };
    const response = await axios.post(`${API_BASE}/storekeeper/materials/create/`, payload);

    // 3. إعادة البيانات بصيغة تتوافق مع StorekeeperDashboard
    return {
      id: response.data.id,
      name: response.data.name,
      category: response.data.category,
      desc: response.data.description,
      qty: response.data.quantity,
      loc: response.data.location,
      lab: response.data.laboratory_name || newMaterial.lab,
      status: response.data.status,
    };
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
};
// ===================== إحصائيات المخزون =====================
export const fetchInventoryStats = async () => {
  try {
    // استخدم endpoint الإحصائيات الموجود في Django
    const response = await axios.get(`${API_BASE}/storekeeper/inventory-summary/`);
    // نحول البيانات حسب ما يتوقعه الـ component
    return {
      totalOutputs: response.data.total_items || 0,
      available: response.data.available_items || 0,
      lowStock: response.data.low_stock_alerts || 0,
      needsMaintenance: response.data.needs_maintenance || 0,
    };
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    // بديل: نحسب إحصائيات من المواد المجلوبة (إذا فشل الـ API)
    const materials = await fetchMaterials();
    const totalOutputs = materials.length;
    const available = materials.filter((m) => m.status === 'Available').length;
    const lowStock = materials.filter((m) => m.qty < 10).length;
    const needsMaintenance = materials.filter((m) => m.status === 'Under Maintenance').length;
    return { totalOutputs, available, lowStock, needsMaintenance };
  }
};
