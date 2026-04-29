import React, { useState, useEffect } from 'react';
import NewRequestModal from '../Components/NewRequestModal';
import logo from './logo.jpg';
import ValidationSlipPage from './ValidationSlipPage';
import { getMyRequests } from '../Api/requests.api.js';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Package,
  LogOut,
  Plus,
  Package2,
  AlertTriangle,
  CheckCircle,
  Truck,
  Sun,
  X,
  Calendar,
  Moon,
} from 'lucide-react';

const MyRequestsPage = ({ toggleTheme, dark }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const openSlip = (req) => {
    setSelectedRequest(req);
    setIsSlipOpen(true);
  };
  const addRequest = (newRequest) => {
    setRequests([newRequest, ...requests]);
  };
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const MAX_REQUESTS = 5;

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);

      const data = await getMyRequests();
      console.log('📦 Data received in page:', data);
      setRequests(data);

      setLoading(false);
    };
    loadRequests();
  }, []);

  // دالة تحديث القائمة بعد إضافة طلب جديد (تستعمل في الـ Modal)
  const refreshRequests = async () => {
    const data = await getMyRequests();
    setRequests(data);
  };

  const getStatusStyle = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pending':
        return 'border border-yellow-300/20 bg-yellow-200/10 text-[#FDC700]';
      case 'approved':
        return 'border border-green-500/20 bg-green-400/10 text-[#05DF72]';
      case 'completed':
        return 'border border-blue-500/20 bg-blue-400/10 text-[#51A2FF]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  const handleOpenSlip = (req) => {
    setSelectedRequest({
      ...req,
      validationCode: req.validation_slip?.validation_code || 'NO-CODE',
      title: req.project_name,
      studentName: req.student_name,
      studentEmail: req.student_email,
      items: req.items.map((item) => ({
        name: item.material_name,
        qty: item.quantity,
        category: item.material_category,
      })),
    });
    setIsSlipOpen(true);
  };

  return (
    <div
      className={`flex min-h-screen flex-col md:flex-row transition-colors duration-500 ease-in-out
${dark ? 'bg-[#020817] text-[#E8EAF0]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}
    >
      <aside
        className={`hidden md:flex md:w-64 flex-col h-screen
${dark ? 'bg-[#020817] border-r border-[#2B4C9F]' : 'bg-[#FFF] border-r border-[#E2E8F0]'}`}
      >
        <div
          className={`flex items-center w-full sm:w-[255px] h-auto sm:h-[97px] px-4 sm:px-6 ${dark ? 'border-b border-[#2B4C9F]' : 'border-b border-[#E2E8F0]'} flex-shrink-0`}
        >
          <div className="flex-shrink-0 w-[48px] h-[48px]">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full rounded-full bg-lightgray bg-center bg-cover bg-no-repeat"
            />
          </div>

          <div className="flex flex-col ml-4">
            <h1
              className={`font-inter text-[16px] sm:text-[18px] font-semibold leading-[20px] sm:leading-[22.5px] ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            >
              ESI-GM
            </h1>
            <p
              className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}font-inter text-[10px] sm:text-[12px] font-normal leading-[12px] sm:leading-[14px] mt-1`}
            >
              ESI 8 Mai 1945
            </p>
          </div>
        </div>

        <nav className="flex flex-col p-4 gap-2 flex-1">
          <div onClick={() => navigate('/dashboard/student')}>
            <NavItem
              className={`${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
            />
          </div>
          <div onClick={() => navigate('/projects')}>
            <NavItem
              icon={<FolderKanban size={20} />}
              label="My Projects"
              className={`${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            />
          </div>
          <div onClick={() => navigate('/my-requests')}>
            <NavItem
              className="bg-[#2B4C9F] text-[#FFF]"
              icon={<ClipboardList size={20} />}
              label="My Requests"
              active
            />
          </div>
          <div onClick={() => navigate('/materials/browse')}>
            <NavItem
              className={`${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              icon={<Package size={20} />}
              label="Browse Materials"
            />
          </div>
        </nav>

        <div
          className={`flex flex-col items-start w-full sm:w-[255px] h-auto sm:h-[120px] pt-[16.667px] px-4 gap-3 flex-shrink-0 ${dark ? 'border-t border-[#2B4C9F]' : 'border-t border-[#E2E8F0]'} rounded-none`}
        >
          <div className="flex flex-col items-start h-[36px] px-4 flex-shrink-0 self-stretch">
            <p className="text-sm font-semibold">Sarah Student</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          <div className="flex justify-center items-start gap-8 sm:gap-16 self-stretch">
            <button
              onClick={toggleTheme}
              type="button"
              className={`flex w-10 h-10 min-w-[40px] min-h-[40px] justify-center items-center rounded-xl border mr-3 p-0 transition-all duration-100
    ${dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-white border-[#E2E8F0] hover:bg-gray-100'}`}
            >
              {dark ? (
                <Moon size={20} stroke="#2B4C9F" fill="transparent" />
              ) : (
                <Sun size={20} stroke="#2B4C9F" fill="transparent" />
              )}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token'); // إذا كان عندك token
                localStorage.removeItem('user'); // مسح بيانات المستخدم
                navigate('/login'); // يروح لصفحة login
              }}
              className={`flex items-center bg-transparent gap-2 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} hover:text-red-600 transition-colors py-2`}
            >
              <LogOut className="w-[20px] h-[20px] flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/student')}
          className={`flex flex-col items-start w-full sm:w-[255px] h-auto sm:h-[52px] pt-[16.667px] px-4 sm:px-[117.667px] ${dark ? 'border-t border-[#2B4C9F]' : 'border-t border-[#E2E8F0]'} bg-transparent rounded-none`}
        >
          <X className="w-[20px] h-[20px] flex-shrink-0" />
        </button>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              {/* Left text */}
              <div className="flex flex-col items-start">
                <h1
                  className={`text-xl sm:text-2xl font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} font-bold`}
                >
                  My Requests
                </h1>
                <p className={`text-sm mt-1 ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Submit requests and receive automatic validation based on stock availability
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => setShowModal(true)}
                disabled={requests.length >= MAX_REQUESTS}
                className={`flex items-center font-base p-2 gap-2 px-4 py-2 rounded-lg transition-all duration-200
hover:scale-[1.03] active:scale-[0.95]
focus:outline-none focus:ring-2 focus:ring-[#2B4C9F] ${
                  requests.length >= MAX_REQUESTS
                    ? 'bg-gray-300 cursor-not-allowed'
                    : dark
                      ? 'bg-[#2B4C9F] hover:bg-[#3B5FCF] text-white'
                      : 'bg-[#2B4C9F] hover:bg-[#1E3A8A] text-white'
                }`}
              >
                <Plus size={18} />
                New Request
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`rounded-xl border shadow-sm overflow-hidden ${
                  dark ? 'bg-[#0A1128] border-[#2B4C9F]' : 'bg-[#FFF] border-[#E2E8F0]'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="break-words">
                      <h3
                        className={`flex items-start text-lg font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                      >
                        {req.project_name || req.title}
                      </h3>
                      <p
                        className={`flex items-center mt-2 text-sm ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} gap-1 whitespace-nowrap`}
                      >
                        Requested by: {req.student_name || req.requestedBy} •
                        <Calendar className="w-3 h-3" />{' '}
                        <span className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                          {' '}
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(req.status)}`}
                    >
                      {req.status_display || req.status}
                    </span>
                  </div>

                  <div
                    className={`rounded-lg p-3 sm:p-4 border ${
                      dark
                        ? 'bg-[rgba(30,41,59,0.05)] border-[#2B4C9F]'
                        : 'bg-[rgba(241,245,249,0.05)] border-[#E2E8F0]'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-3 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}  font-semibold text-sm`}
                    >
                      <Package size={16} /> Requested Items ({req.items.length})
                    </div>
                    <div className="space-y-2">
                      {req.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between text-xs sm:text-sm ${dark ? 'text-[#E8EAF0] bg-[#020817] bg-opacity-50' : 'text-[#0F172A] bg-[#F8FAFC] bg-opacity-50'} rounded-l p-1 pb-2 last:border-0`}
                        >
                          <span>{item.material_name || item.name}</span>
                          <span
                            className={`font-mono ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}
                          >
                            Qty:{item.quantity || item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* messages*/}
                  {req.status === 'pending' && (
                    <div className="mt-4 p-4 bg-orange-50 border border-yellow-400/20 bg-yellow-300/10 rounded-lg flex gap-3">
                      <AlertTriangle className="text-[#FDC700] shrink-0" size={20} />
                      <div>
                        <p className="flex items-start text-sm font-bold text-[#FDC700]">
                          Manual Review Required
                        </p>
                        <p className="text-xs text-[#FDC700]">
                          This request requires manual verification by the storekeeper. You will be
                          notified once the review is complete.
                        </p>
                      </div>
                    </div>
                  )}

                  {req.status === 'approved' && (
                    <div className="mt-4 space-y-3">
                      <div
                        className={`${
                          dark ? 'border-t border-[#2B4C9F]' : 'border-t border-[#E2E8F0]'
                        } pt-4 pb-2`}
                      >
                        <button
                          onClick={() => handleOpenSlip(req)}
                          className={`flex items-center gap-2 text-green-600 px-4 py-2 p-2 rounded-lg bg-[rgba(0,201,80,0.10)] border border-[rgba(0,201,80,0.2)] text-sm font-medium hover:bg-green-100 transition-colors duration-200
hover:scale-[1.02] active:scale-[0.95]
focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            dark
                              ? 'bg-green-900/20 border border-green-500/30 text-green-400 hover:bg-green-900/40'
                              : 'bg-green-100 border border-green-200 text-green-600 hover:bg-green-200'
                          } `}
                        >
                          <CheckCircle size={16} /> View Validation Slip
                        </button>
                      </div>
                      <div
                        className={`${
                          dark ? 'border-t border-[#2B4C9F]' : 'border-t border-[#E2E8F0]'
                        } p-4`}
                      >
                        <div className="p-4 border border-blue-500/20 bg-blue-400/10 rounded-lg">
                          <div className="flex items-center gap-2 text-[#51A2FF] text-sm font-semibold mb-1">
                            <Truck size={16} /> Delivery Status
                          </div>
                          <p className="text-xs text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="text-[#FDC700]" size={12} />
                            <p className="text-[#51A2FF]">{req.deliveryStatus}</p>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p
                    className={`flex items-start pt-3 whitespace-nowrap ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-[11px] sm:text-[12px] font-normal leading-4 font-inter`}
                  >
                    Created : {new Date(req.created_at).toLocaleDateString()} • Updated :{' '}
                    {new Date(req.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <NewRequestModal
          dark={dark}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddRequest={addRequest}
        />
      </main>
      <ValidationSlipPage
        dark={dark}
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        requestData={selectedRequest}
      />
    </div>
  );
};

const NavItem = ({ icon, label, active = false, className = '' }) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${className}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default MyRequestsPage;
