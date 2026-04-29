import React from 'react';
import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Printer,
  CheckCircle,
  QrCode,
  Building2Icon,
  Calendar,
  User,
  Package,
  AlertTriangle,
  QrCodeIcon,
} from 'lucide-react';

const ValidationSlipPage = ({ isOpen, onClose, requestData, dark }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !requestData) return null;

  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate = now.toLocaleDateString('fr-FR', options);

  const handlePrint = () => {
    window.print();
  };

  const validationDate = requestData.validatedAt ? new Date(requestData.validatedAt) : new Date();

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[60] flex items-start py-10 justify-center bg-white/50 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto ${
        dark ? 'bg-[#1E293B]/70 backdrop-blur-sm' : 'bg-[#F1F5F9]/70 backdrop-blur-sm'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative ${dark ? 'bg-[#121825]' : 'bg-[#F8FAFC]'} w-full max-w-full sm:max-w-2xl lg:max-w-3xl rounded-2xl shadow-2xl my-2 sm:my-6 animate-in fade-in zoom-in duration-300 print:shadow-none print:my-0`}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center p-4 sm:p-6 print:hidden">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-[#05DF72]" size={24} />
              <h1
                className={`text-xl font-inter font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              >
                Bon de Validation
              </h1>
            </div>
            <h3
              className={`font-inter font-normal text-[13px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} mt-2`}
            >
              {' '}
              Demande de Matériel - Approuvée Automatiquement{' '}
            </h3>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg font-semibold transition-all hover:bg-indigo-700"
            >
              Imprimer
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 ${dark ? 'bg-[#1E293B] text-[#E8EAF0]' : 'bg-[#F1F5F9] text-[#0F172A]'} rounded-lg font-semibold`}
            >
              Fermer
            </button>
          </div>
        </div>

        <div className="mr-4 ml-4 mt-3 p-3 space-y-6 text-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/10">
            <div className="h-12 rounded-lg flex items-center justify-center text-[#6366F1] font-inter text-xl italic">
              <Building2Icon />
            </div>
            <div>
              <h2
                className={`font-inter text-base font-semibold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              >
                École Supérieure d'Informatique
              </h2>
              <p className={`text-xs  ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Système de Gestion d'Équipements - ESI-GM
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`p-4 border ${dark ? 'bg-[rgba(30,41,59,0.5)] border-[#1E293B]' : 'bg-[rgba(241,245,249,0.5)] border-[#E2E8F0]'} rounded-xl`}
            >
              <p
                className={`flex items-start text-xs ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-semibold uppercase mb-1`}
              >
                Code de Validation
              </p>
              <p className="flex items-start text-lg font-mono font-bold text-indigo-600 uppercase">
                {requestData.validationCode || 'ESI-MMKR5GVG-VX6K'}
              </p>
            </div>
            <div
              className={`p-4 border  ${dark ? 'bg-[rgba(30,41,59,0.5)] border-[#1E293B]' : 'bg-[rgba(241,245,249,0.5)] border-[#E2E8F0]'} rounded-xl`}
            >
              <p
                className={`flex items-start text-xs ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-semibold uppercase mb-1`}
              >
                Date de Validation
              </p>

              <p
                className={`flex items-start text-sm font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              >
                <Calendar className="w-[20px] h-[20px] p-[3px]" />{' '}
                {validationDate.toLocaleDateString('fr-FR', options)}
              </p>
            </div>
          </div>

          <div className="p-6 border border-blue-500/20 bg-blue-500/10 rounded-xl">
            <div className="flex items-center gap-2 mb-4 font-inter text-base font-semibold border-blue-100 pb-2">
              <User className="text-[#51A2FF] w-[20px] h-[20px]" />
              <p className={`${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
                Informations de l'Étudiant
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
              <div>
                <p
                  className={`flex items-start ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-xs`}
                >
                  Nom
                </p>
                <p
                  className={`flex items-start text-[16px] font-medium leading-6 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                >
                  {requestData.studentName || 'Sarah Student'}
                </p>
              </div>
              <div>
                <p
                  className={`flex items-start ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-xs`}
                >
                  Email ESI
                </p>
                <p
                  className={`flex items-start text-[16px] font-medium leading-6 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                >
                  {requestData.studentEmail || 's.student@esi-sba.dz'}
                </p>
              </div>
              <div className="col-span-2">
                <p
                  className={`flex items-start ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-xs`}
                >
                  Projet
                </p>
                <p
                  className={`flex items-start text-[16px] font-medium leading-6 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                >
                  {requestData.title}
                </p>
              </div>
            </div>
          </div>

          <div className="border-[0.667px] border-[#00C950]/20 bg-[#00C950]/10 flex min-h-[180px] flex-col items-start gap-4 self-stretch pb-[0.667px] pt-[24.667px] px-[24.667px] shrink-0 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-green-800 font-inter font-medium">
              <Package className="w-[20px] h-[20px] text-[#05DF72]" />
              <p className={`${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
                Matériel Validé ({requestData.items?.length || 0} article){' '}
              </p>
            </div>
            <div className="w-full rounded-xl overflow-x-auto">
              <table
                className={`w-full font-inter ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-sm leading-5 text-left`}
              >
                <thead className="bg-transparent">
                  <tr>
                    <th className="px-4 py-3 text-[13px] font-medium">#</th>
                    <th className="px-4 py-3 text-[13px] font-medium">Nom du Matériel</th>
                    <th className="px-4 py-3 text-[13px] font-medium">Catégorie</th>
                    <th className="px-4 py-3 text-center text-[13px] font-medium">Quantité</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requestData.items?.map((item, idx) => (
                    <tr key={idx} className="border-none">
                      <td
                        className={`px-4 py-3 font-medium ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}
                      >
                        {idx + 1}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                      >
                        {item.name || item.materialId?.name}
                      </td>
                      <td className={`px-4 py-3 ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                        {item.category || 'Matériel'}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium text-center ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}
                      >
                        {item.qty || item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className={`flex flex-col items-center py-6 rounded-2xl border ${dark ? 'bg-[rgba(30, 41, 59, 0.50)] border-[#1E293B]' : 'bg-[rgba(241, 245, 249, 0.50)] border-[#E2E8F0]'} shrink-0 self-stretch border-[0.667px]`}
          >
            <div className="flex flex-row items-center justify-start gap-2 mb-3 w-full px-6">
              <QrCodeIcon
                className={`flex items-start w-[20px] h-[20px] ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              />
              <h3
                className={`flex items-start ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}  font-inter text-[18px] font-bold leading-[27px]`}
              >
                QR Code de Validation
              </h3>
            </div>

            <div className="flex h-[180px] sm:h-[200px] w-full max-w-[650px] mb-[20px] justify-center items-center bg-white rounded-2xl shadow-sm">
              {/* الإطار الأسود الخارجي للـ QR */}
              <div className="bg-white p-4 rounded-xl border-[12px] border-solid border-[#101828] shadow-sm border mb-2">
                {/* هنا نحطو الـ QR Code الحقيقي */}
                <QRCodeSVG
                  value={requestData.validationCode || 'NO-CODE'}
                  size={120}
                  level="H" // جودة عالية باش حتى ويكون مطبوع يبان
                  includeMargin={false}
                />
              </div>
            </div>

            <p
              className={`flex items-start text-[10px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}
            >
              Scannez ce code pour vérifier l'authenticité du bon
            </p>
          </div>

          <div className="rounded-[12px] border-[0.667px] border-solid border-[rgba(240,177,0,0.20)] bg-[rgba(240,177,0,0.10)] rounded-2xl p-5 space-y-2 border-b">
            <div
              className={`flex items-center gap-2 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} font-bold text-xs uppercase`}
            >
              <AlertTriangle size={14} /> Notes Importantes:
            </div>
            <ul
              className={`list-none flex flex-col items-start text-[11px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} space-y-1 opacity-80 list-disc ml-4`}
            >
              <li>Ce bon a été validé automatiquement par le système ESI-GM</li>
              <li>La disponibilité du stock a été vérifiée au moment de la demande</li>
              <li>Présentez ce bon au magasinier pour récupérer le matériel</li>
              <li>Le matériel doit être retourné dans les délais convenus</li>
              <li>Tout dommage ou perte sera signalé dans le système</li>
            </ul>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 pt-6 text-[11px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-base border-b border-t ${dark ? 'border-[#1E293B]' : 'border-[#E2E8F0]'} pb-3`}
          >
            <div className="space-y-5">
              <p className="flex items-start">Signature de l'Étudiant</p>
              <div className={`border-b ${dark ? 'border-[#1E293B]' : 'border-[#E2E8F0]'}`}></div>
              <p className="flex items-start">
                Date:{' '}
                <span className={`ml-2 ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  ________________
                </span>
              </p>
            </div>
            <div className="space-y-5">
              <p className="flex items-start">Signature du Magasinier</p>
              <div className={`border-b ${dark ? 'border-[#1E293B]' : 'border-[#E2E8F0]'}`}></div>
              <p className="flex items-start">
                Date:{' '}
                <span className={`ml-2 ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  ________________
                </span>
              </p>
            </div>
          </div>

          <p
            className={`text-[9px] text-center ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} pt-4`}
          >
            Généré automatiquement par ESI-GM (Système de Gestion d'Équipements)
            <br />
            École Supérieure d'Informatique - 8 Mai 1945, Sidi Bel Abbès
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationSlipPage;
