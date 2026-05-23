// src/Api/qrScanner.api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== SCANNER API (BACKEND REAL) ====================

/**
 * جلب جميع المواد
 */
export const getAllMaterials = async () => {
  try {
    const response = await api.get('/api/scanner/materials/');
    return {
      success: true,
      materials: response.data
    };
  } catch (error) {
    console.error('Error fetching materials:', error);
    return {
      success: false,
      materials: [],
      error: error.message
    };
  }
};

/**
 * جلب آخر المعاملات
 */
export const getRecentTransactions = async (limit = 10) => {
  try {
    const response = await api.get('/api/scanner/transactions/');
    return {
      success: true,
      transactions: response.data.slice(0, limit)
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      success: false,
      transactions: [],
      error: error.message
    };
  }
};

/**
 * معالجة المسح (إدخال أو إخراج)
 * @param {string} qrCode - الكود الممسوح
 * @param {string} type - 'input' أو 'output'
 * @param {number} quantity - الكمية (افتراضي 1)
 */
export const processScan = async (qrCode, type, quantity = 1) => {
  try {
    const response = await api.post('/api/scanner/transactions/scan/', {
      qr_code: qrCode,
      type: type,
      quantity: quantity
    });
    
    return {
      success: true,
      material: response.data.material,
      transaction: response.data.transaction,
      message: `${type === 'input' ? 'Added' : 'Removed'} ${quantity} item(s) successfully`
    };
  } catch (error) {
    console.error('Error processing scan:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to process scan'
    };
  }
};

/**
 * جلب معلومات المادة من الكود (للتحقق قبل المعاملة)
 */
export const getMaterialByCode = async (qrCode) => {
  try {
    // جلب جميع المواد والبحث فيها
    const response = await api.get('/api/scanner/materials/');
    const material = response.data.find(m => m.qr_code === qrCode || m.title === qrCode);
    
    if (material) {
      return {
        success: true,
        material: material
      };
    } else {
      return {
        success: false,
        error: `Material with code "${qrCode}" not found`
      };
    }
  } catch (error) {
    console.error('Error finding material:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export par défaut
const qrScannerAPI = {
  getAllMaterials,
  getRecentTransactions,
  processScan,
  getMaterialByCode,
};

export default qrScannerAPI;