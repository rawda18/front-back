// src/Components/AddLaboratoryModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Building2, Hash, FileText, MapPin, Users, AlertCircle } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';

const AddLaboratory = ({ isOpen, onClose, onAdd }) => {
  const { darkMode: isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    building: '',
    floor: '',
    room: '',
    capacity: '',
    status: 'Active',
    adminId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Laboratory name is required';
    if (!formData.code.trim()) newErrors.code = 'Laboratory code is required';
    if (!formData.building.trim()) newErrors.building = 'Building is required';
    if (!formData.floor.trim()) newErrors.floor = 'Floor is required';
    if (!formData.room.trim()) newErrors.room = 'Room/Location is required';
    if (!formData.capacity || formData.capacity < 1)
      newErrors.capacity = 'Valid capacity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newLab = {
        id: Date.now(),
        ...formData,
        capacity: parseInt(formData.capacity),
        materials: 0,
        createdAt: new Date().toISOString(),
      };

      onAdd?.(newLab);
      onClose();
      setFormData({
        name: '',
        code: '',
        description: '',
        building: '',
        floor: '',
        room: '',
        capacity: '',
        status: 'Active',
        adminId: '',
      });
    } catch (error) {
      console.error('Error adding laboratory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Modal dark mode:', isDarkMode); // تأكدي في console
  }, [isDarkMode]);
  if (!isOpen) return null;

  const inputClasses = `w-full px-4 py-2.5 rounded-xl border transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-[#2B4C9F] focus:border-transparent
    ${
      isDarkMode
        ? 'bg-[#020817] border-[#2B4C9F] text-white placeholder:text-gray-500'
        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
    }`;

  const labelClasses = `block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-[#E8EAF0]' : 'text-gray-700'}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 backdrop-blur-sm transition-opacity ${
          isDarkMode ? 'bg-black/80' : 'bg-black/50'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-2xl rounded-2xl shadow-2xl transition-all transform
            ${isDarkMode ? 'bg-[#0A1128] border border-[#2B4C9F]' : 'bg-white'}`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-[#2B4C9F]' : 'border-gray-100'}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[rgba(99,102,241,0.10)] rounded-xl">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${isDarkMode ? 'text-[#E8EAF0]' : 'text-gray-900'}`}
                >
                  Add New Laboratory
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                  Create a new laboratory location
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-[#1E293B] text-[#94A3B8]' : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Two columns layout for basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Laboratory Name */}
              <div>
                <label className={labelClasses}>
                  Laboratory Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Electronics Lab"
                    className={`${inputClasses}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Laboratory Code */}
              <div>
                <label className={labelClasses}>
                  Laboratory Code <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., LAB-ELEC-01"
                  className={`${inputClasses}`}
                />

                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClasses}>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of the laboratory"
                className={`${inputClasses} resize-none`}
              />
            </div>

            {/* Location Details Section */}
            <div className={`pt-2 border-t ${isDarkMode ? 'border-[#2B4C9F]' : 'border-gray-100'}`}>
              <h3
                className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-[#E8EAF0]' : 'text-gray-900'}`}
              >
                <MapPin size={18} className="text-[#6366F1]" />
                Location Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Building */}
                <div>
                  <label className={labelClasses}>
                    Building <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    placeholder="e.g., Building A"
                    className={inputClasses}
                  />
                  {errors.building && (
                    <p className="text-red-500 text-xs mt-1">{errors.building}</p>
                  )}
                </div>

                {/* Floor */}
                <div>
                  <label className={labelClasses}>
                    Floor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="e.g., 2nd Floor"
                    className={inputClasses}
                  />
                  {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor}</p>}
                </div>

                {/* Room/Location */}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
              <div>
                <label className={labelClasses}>
                  Room/Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder="e.g., Room 215"
                  className={inputClasses}
                />
                {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
              </div>
            </div>

            {/* Capacity and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Capacity */}
              <div>
                <label className={`${labelClasses} flex items-center gap-2`}>
                  <Users
                    className={`${isDarkMode ? 'text-[#2B4C9F]' : 'text-[#6366F1]'}`}
                    size={18}
                  />
                  Capacity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                    className={`${inputClasses}`}
                  />
                </div>
                {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
              </div>

              {/* Status */}
              <div>
                <label className={labelClasses}>Status</label>
                <input
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder=""
                  className={`${inputClasses}`}
                />
              </div>
            </div>

            {/* Assigned Administrator */}
            <div>
              <label className={labelClasses}>Assigned Administrator (Optional)</label>
              <input
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                className={inputClasses}
              />

              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#94A3B8]' : 'text-gray-400'}`}>
                You can assign an administrator now or later
              </p>
            </div>

            {/* Form Actions */}

            <div
              className={`flex justify-end gap-3 pt-4 border-t ${isDarkMode ? 'border-[#2B4C9F]' : 'border-gray-100'}`}
            >
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 border bg-transparent border-[#E2E8F0] px-6 py-4 rounded-xl font-semibold ${isDarkMode ? 'border-transparent text-[#E8EAF0]' : 'border-gray-100 text-[#0F172A]'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 rounded-2xl font-semibold bg-[#6366F1] text-white hover:bg-indigo-700 transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Laboratory'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLaboratory;
