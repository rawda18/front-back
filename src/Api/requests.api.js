import axios from 'axios';

// ✅ تأكدي من الرابط
const API_BASE_URL = 'http://localhost:8000/api';

export const getMyRequests = async () => {
  try {
    const url = `${API_BASE_URL}/requests/`;
    console.log('🔍 Fetching from:', url);

    const response = await axios.get(url);

    console.log('✅ Response received:', response.data);

    // الـ Response فيه results
    return response.data.results;
  } catch (error) {
    console.error('❌ Error details:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const submitNewRequest = async (requestData) => {
  try {
    // ✅ تعديل شكل البيانات ليتناسب مع الـ Backend
    const formattedData = {
      project: { id: requestData.projectId || 1 }, // project object
      purpose: requestData.purpose,
      start_date: requestData.startDate, // ✅ start_date (موش startDate)
      end_date: requestData.endDate, // ✅ end_date (موش endDate)
      items: requestData.items.map((item) => ({
        material: { id: item.materialId || 1 }, // material object
        quantity: item.qty,
      })),
    };

    const response = await axios.post(`${API_BASE_URL}/requests/`, formattedData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to submit request';
  }
};

export const validateStock = async (items) => {
  console.log('🔍 Validating items (mock):', items);

  // ✅ مؤقتاً للاختبار (يرجع valid=true)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        valid: true,
        message: '✓ All materials are available! Ready to submit',
      });
    }, 500);
  });
};
