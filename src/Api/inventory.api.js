import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getItems = async () => {
  try {
    // ✅ تغيير endpoint من /items إلى /materials/
    const response = await API.get('/materials/');
    return response.data.results || response.data; // الـ Backend يرجع results
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    // ✅ جلب المواد ثم استخراج الكاتيغوريات الفريدة
    const response = await API.get('/materials/');
    const materials = response.data.results || response.data;
    const categories = [...new Set(materials.map((item) => item.category))];
    return categories.map((cat, index) => ({
      id: index + 1,
      name: cat,
      count: materials.filter((m) => m.category === cat).length,
      icon: getIconForCategory(cat),
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// دالة مساعدة لجلب الأيقونة حسب الكاتيغوري
const getIconForCategory = (category) => {
  const icons = {
    Microcontrollers: '🎛️',
    Sensors: '📡',
    Actuators: '⚙️',
    'Power Supply': '🔌',
    Communication: '📶',
    Displays: '🖥️',
    Prototyping: '🔧',
    Connectors: '🔗',
  };
  return icons[category] || '📦';
};
