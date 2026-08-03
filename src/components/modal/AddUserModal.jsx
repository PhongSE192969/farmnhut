import { Activity, Home, Shield, ShieldCheck, UserPlus, UserPlus2, UserRoundCog, Wand2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { SelectOption } from '../ui';
import { useLanguageStore } from "@/stores"
import { translations } from "@/locales"
import { GetFranchiseActive } from '@/services';
import toast from 'react-hot-toast';

const AddUserModal = ({
  formData,
  setFormData,
  setIsModalOpen,
  roles = [],
  selectRole,
  setSelectRole,
  selectFranchise,
  setSelectFranchise,
  selectGender,
  setSelectGender,
  onSubmit = () => { }
}) => {
  const { language } = useLanguageStore();
  const t = (translations[language] || translations.vi).modals?.addUser || {};
  const [franchises, setFranchises] = useState([]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRandomUsername = () => {
    let base = '';
    if (formData.fullName) {
      base = formData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    } else if (formData.email) {
      // Lấy phần trước @ của email
      base = formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    } else {
      base = 'user';
    }
    const randomNum = Math.floor(Math.random() * 10000);
    handleChange('username', `${base}${randomNum}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit User Data: ", formData);
    console.log(selectFranchise)
    console.log(selectGender)
    console.log(selectRole)
    setIsModalOpen(false);

    formData.gender = formData.gender === 'MALE' ? true : false;
    onSubmit();
  };

  const fetchFranchises = async () => {
    try {
      const response = await GetFranchiseActive();
      if (response.statusCode === 200) {
        console.log("response.data: ", response.data)
        setFranchises(response.data);
      }
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách đại lý");
    }
  }

  useEffect(() => {
    fetchFranchises();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#d9a13b]/10 text-[#d9a13b] flex items-center justify-center">
              <UserPlus2 size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">{t.title || "Create New User"}</h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{t.subtitle || "Access Control"}</p>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">
                {t.form?.name || "Full Name"} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder={t.form?.namePlaceholder || "John Doe"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">
                {t.form?.phone || "Phone Number"} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={t.form?.phonePlaceholder || "+84 ..."}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">
                {t.form?.email || "Email Address"} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={t.form?.emailPlaceholder || "email@agrifert.vn"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">
                {t.form?.username || "Username"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder={t.form?.usernamePlaceholder || "johndoe123"}
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleRandomUsername}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#d9a13b] hover:bg-yellow-50 rounded-lg transition-colors"
                  title={t.form?.generateUsername || "Generate Random Username"}
                >
                  <Wand2 size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">{t.form?.gender || "Gender"}</label>
              <SelectOption
                value={selectGender}
                onChange={(val) => setSelectGender(val)}
                icon={Activity}
                options={['Male', 'Female'].map(g => ({ value: g.toUpperCase(), label: t.form?.[g.toLowerCase()] || g }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">{t.form?.role || "System Role"}</label>
              <SelectOption
                value={selectRole}
                onChange={(val) => setSelectRole(val)}
                icon={Shield}
                options={roles}
              />

            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">{t.form?.franchise || "Gán đại lý"}</label>
              <SelectOption
                value={selectFranchise}
                onChange={(val) => setSelectFranchise(val)}
                icon={Home}
                options={franchises}
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {t.actions?.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-[2] px-4 py-2.5 bg-[#d9a13b] hover:bg-[#c48f32] text-white rounded-xl text-sm font-bold shadow-lg shadow-yellow-900/10 transition-all active:scale-95">
              {t.actions?.create || "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal
