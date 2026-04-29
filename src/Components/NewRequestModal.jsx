import React, { useState } from 'react';
import { X, Plus, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { submitNewRequest, validateStock } from '../Api/requests.api.js';
import { useEffect } from 'react';

const NewRequestModal = ({ isOpen, onClose, onAddRequest, dark }) => {
  //(Form State)
  const [formData, setFormData] = useState({
    project: '',
    purpose: '',
    startDate: '',
    endDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  // (Dynamic Materials State)
  const [materials, setMaterials] = useState([{ id: Date.now(), name: '', qty: 1 }]);

  // 3.(Validation Errors)
  const [errors, setErrors] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        project: '',
        purpose: '',
        startDate: '',
        endDate: '',
      });
      setMaterials([{ id: Date.now(), name: '', qty: 1 }]);
      setIsValidated(false);
      document.body.style.overflow = 'hidden'; //  scroll
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);
  if (!isOpen) return null;

  // ------
  const addMaterialField = () => {
    setMaterials([...materials, { id: Date.now(), name: '', qty: 1 }]);
  };

  const removeMaterialField = (id) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // 1.
    if (!formData.project.trim()) newErrors.project = 'Project name is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    // 2.(Materials)
    let materialHasErrors = false;
    const materialErrors = materials.map((m) => {
      let mErr = {};
      if (!m.name.trim()) {
        mErr.name = 'Name required';
        materialHasErrors = true;
      }
      if (m.qty <= 0) {
        mErr.qty = 'Qty > 0';
        materialHasErrors = true;
      }
      return mErr;
    });

    // 3. (Duplicates)
    const names = materials.map((m) => m.name.trim().toLowerCase()).filter((name) => name !== '');
    const hasDuplicates = new Set(names).size !== names.length;

    if (hasDuplicates) {
      newErrors.duplicate = 'Duplicate materials not allowed';
    }

    //State
    setErrors({ ...newErrors, materials: materialErrors });

    return Object.keys(newErrors).length === 0 && !materialHasErrors;
  };

  //  (validateForm)
  const updateMaterial = (id, field, value) => {
    const newMaterials = materials.map((m) => {
      if (m.id === id) {
        const finalValue = field === 'qty' ? parseInt(value) || 0 : value;
        return { ...m, [field]: finalValue };
      }
      return m;
    });
    setMaterials(newMaterials);
  };

  // to Backend
  const handleSubmit = async (e) => {
    // رجعيها async
    e.preventDefault();

    if (validateForm()) {
      setSubmitting(true);
      setServerError(''); // فرغي المشاكل القديمة

      try {
        const finalSubmission = {
          projectId: 1, // أو خليها dynamic من liste des projets
          purpose: formData.purpose,
          startDate: formData.startDate,
          endDate: formData.endDate,
          items: materials.map((m) => ({
            materialId: 1, // مؤقتاً، تحتاج تجيب id المادة من API
            name: m.name,
            qty: m.qty,
          })),
        };

        // نعيطو للدالة لي درناها في ملف الـ api
        const response = await submitNewRequest(finalSubmission);

        // إذا نجحت العملية:
        if (onAddRequest) onAddRequest(response); // نحدثو القائمة في الصفحة الرئيسية

        alert('Request sent with success!');
        onClose(); // نغلقو المودال
      } catch (err) {
        // إذا صرا مشكل (مثلا السيرفر طافي)
        setServerError(err.message || 'Something went wrong while sending');
      } finally {
        setSubmitting(false);
      }
    }
  };
  const handleValidate = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    // ✅ أضيفي رسالة "جاري التحقق..."
    setValidationMessage('Checking stock availability...');
    setIsValidated(false);

    try {
      // ✅ استعملي الدالة المستوردة validateStock (موش axios مباشرة)
      const response = await validateStock(
        materials.map((m) => ({
          name: m.name,
          qty: m.qty,
        })),
      );

      console.log('Validation response:', response);

      if (response.valid) {
        setIsValidated(true);
        setValidationMessage('✓ All materials are available! Ready to submit');
      } else {
        setIsValidated(false);
        setValidationMessage(response.message || '❌ Stock validation failed');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setIsValidated(false);
      setValidationMessage('Server error while validating request');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-white/50 backdrop-blur-sm p-4 overflow-y-auto rounded-2xl ${
        dark ? 'bg-[#1E293B]/70 backdrop-blur-sm' : 'bg-[#F1F5F9]/70 backdrop-blur-sm'
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative rounded-2xl border ${dark ? 'bg-[#0A1128] border-[#2B4C9F]' : 'bg-[#FFF] border-[#E2E8F0]'} rounded-2xl w-full max-w-md sm:max-w-xl md:max-w-2xl shadow-2xl my-5 mx-auto`}
      >
        <div
          className={`${dark ? 'bg-[#0A1128]' : 'bg-white'} rounded-2xl z-10 flex justify-between items-center p-6`}
        >
          <h2 className={`text-xl font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
            New Material Request
          </h2>
          <button
            onClick={onClose}
            className={`${dark ? 'text-[#94A3B8] bg-[#0A1128]' : 'text-[#64748B] bg-[#FFF]'} hover:text-gray-600`}
          >
            <X size={24} />
          </button>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/**/}
          <div>
            <label
              className={`flex items-start block text-sm font-semibold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            >
              Project *
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 ${dark ? 'bg-[#020817]' : 'bg-[#F8FAFC]'} rounded-xl outline-none border border-transparent focus:border-gray-200 ${
                errors.project ? 'border-red-500' : ''
              }`}
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            />
            {errors.project && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.project}
              </p>
            )}
          </div>

          {/**/}
          <div>
            <label
              className={`flex items-start block text-sm font-semibold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            >
              Purpose *
            </label>
            <textarea
              placeholder="Explain why you need these materials..."
              rows="3"
              className={`w-full resize-none px-4 py-3 px-4 py-3 ${dark ? 'bg-[#020817]' : 'bg-[#F8FAFC]'} border rounded-xl border-transparent outline-none focus:border-gray-200 ${errors.purpose ? 'border-red-500' : ''}`}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            ></textarea>
            {errors.purpose && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.purpose}
              </p>
            )}
          </div>

          {/* dates*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="flex flex-col items-start">
              <label
                className={`block text-sm font-semibold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              >
                Start Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 ${dark ? 'bg-[#020817] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#64748B]'} border border-transparent rounded-xl`}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col items-start">
              <label
                className={`block text-sm font-semibold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              >
                End Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 ${dark ? 'bg-[#020817] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#64748B]'} border border-transparent rounded-xl`}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* materials*/}
          <div className="space-y-3">
            <label
              className={`flex items-start block text-sm font-semibold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            >
              Materials *
            </label>
            {materials.map((mat, index) => (
              <div
                key={mat.id}
                className={`flex flex-col sm:flex-row border ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'} rounded-xl p-3 gap-2 animate-in slide-in-from-top-1 duration-200`}
              >
                <div className="flex-1 flex flex-col">
                  <input
                    type="text"
                    placeholder="Material name"
                    value={mat.name}
                    onChange={(e) => updateMaterial(mat.id, 'name', e.target.value)}
                    className={`flex-1 w-full sm:w-auto px-4 py-3 ${dark ? 'bg-[#020817]' : 'bg-[#F8FAFC]'} rounded-xl outline-none border border-transparent transition-all`}
                  />
                  {errors.materials && errors.materials[index]?.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.materials[index].name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-20 sm:w-auto">
                  <input
                    type="text"
                    value={mat.qty}
                    onChange={(e) => {
                      let value = parseInt(e.target.value) || 0;
                      updateMaterial(mat.id, 'qty', value);
                    }}
                    defaultValue={1}
                    className={`w-20 w-full sm:w-auto px-2 py-3 ${dark ? 'bg-[#020817] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#64748B]'} rounded-xl text-center border border-transparent outline-none`}
                  />
                  {mat.qty <= 0 && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> Quantity must be greater than 0
                    </p>
                  )}
                </div>
                {mat.error && <p className="text-xs text-red-500 mt-1">{mat.error}</p>}
                {/*button of delete*/}
                {materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMaterialField(mat.id)}
                    className="p-2 text-gray-400 border border-transparent hover:border-gray-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addMaterialField}
              className="mt-2 flex items-center bg-transparent focus:outline-none gap-2 text-[#2B4C9F] text-sm font-inter"
            >
              <Plus size={16} /> Add Another Material
            </button>
          </div>

          <button
            type="button"
            onClick={handleValidate}
            className={`flex justify-center items-center gap-1 w-full px-6 py-3 font-inter rounded-[12px] border transition-colors duration-200
    ${
      dark
        ? 'bg-[#1E293B] border-[0.667px] border-[#2B4C9F] text-[#E8EAF0] hover:bg-[#1B2634]'
        : 'bg-[#F1F5F9] border-[0.667px] border-[#E2E8F0] text-[#0F172A] hover:bg-[#e6eaf0]'
    }`}
          >
            <CheckCircle2 size={20} />
            Validate Request
          </button>

          <div
            className={`flex flex-col sm:flex-row gap-4 pt-6 border-t ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'} mt-6`}
          >
            <button
              type="submit"
              disabled={!isValidated || submitting}
              className={`flex-1 py-3 bg-[#2B4C9F]/50 text-white rounded-xl font-inter hover:bg-[#2B4C9F]/80 transition-all duration-200 ${
                isValidated
                  ? 'bg-[#2B4C9F] text-white hover:bg-[#2B4C9F]/90'
                  : 'bg-[#2B4C9F] text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Sending...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 border rounded-xl ${dark ? 'bg-[#0A1128] border-[#2B4C9F] text-[#E8EAF0]' : 'bg-[#FFF] border-[#E2E8F0] text-[#0F172A]'} font-inter`}
            >
              Cancel
            </button>
          </div>

          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {serverError}
            </div>
          )}
        </form>
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
      </div>
    </div>
  );
};

export default NewRequestModal;
