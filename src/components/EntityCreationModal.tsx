import React, { useState } from 'react';
import { themeClasses, colors } from '../theme';
import { X, UserPlus, BookOpen, Heart, Briefcase, GraduationCap, Users, CalendarDays } from 'lucide-react';
import { countryCodes } from '../utils/countryCodes';

interface EntityCreationModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string, data: any) => void;
  initialData?: any;
}

const CustomInput = ({ name, placeholder, type = "text", onChange, required, value, maxLength }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">{placeholder}</label>
    <input
      required={required}
      type={type}
      name={name}
      onChange={onChange}
      value={value || ''}
      maxLength={maxLength}
      placeholder={`Enter ${placeholder.toLowerCase()}`}
      className={`w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]`}
    />
  </div>
);

const CustomSelect = ({ name, placeholder, onChange, options, required, value }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">{placeholder}</label>
    <div className="relative">
      <select
        required={required}
        name={name}
        onChange={onChange}
        value={value || ''}
        className={`w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-semibold text-slate-900 dark:text-white appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]`}
      >
        <option value="" disabled>Select {placeholder.toLowerCase()}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  </div>
);


const CustomPhoneInput = ({ name, placeholder, onChange, required, value, onCountryCodeChange, countryCodeValue }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">{placeholder}</label>
    <div className="flex gap-2">
      <div className="relative w-1/3">
        <select
          value={countryCodeValue || '+91'}
          onChange={onCountryCodeChange}
          className={`w-full px-3 py-3.5 bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-semibold text-slate-900 dark:text-white appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]`}
        >
          {countryCodes.map(c => <option key={c.label} value={c.code}>{c.label}</option>)}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      <input
        required={required}
        type="tel"
        name={name}
        onChange={onChange}
        value={value || ''}
        maxLength={15}
        placeholder="Enter number"
        className={`w-2/3 px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]`}
      />
    </div>
  </div>
);

export const EntityCreationModal: React.FC<EntityCreationModalProps> = ({ type, isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<any>(initialData || {});

  React.useEffect(() => {
    if (initialData) {
      let pPhone = initialData.phone || '';
      let pCode = '+91';
      // Sort codes by length descending to match longest code first (e.g. +971 before +9)
      const codes = [...countryCodes].map(c => c.code).sort((a, b) => b.length - a.length);
      for (const c of codes) {
        if (pPhone.startsWith(c)) {
          pCode = c;
          pPhone = pPhone.slice(c.length).trim();
          break;
        }
      }

      if (type === 'Student') {
        setFormData({ ...initialData, countryCode: pCode, phone: pPhone, name: initialData.name || initialData.student_name });
      } else if (type === 'Parent') {
        setFormData({ ...initialData, countryCode: pCode, phone: pPhone, name: initialData.name || initialData.parent_name, relationship: initialData.guardianName || initialData.relationship || initialData.relation, childId: initialData.childId || initialData.student_id });
      } else if (type === 'Volunteer') {
        setFormData({ ...initialData, countryCode: pCode, phone: pPhone, name: initialData.name || initialData.full_name });
      } else if (type === 'Donor') {
        setFormData({ ...initialData, countryCode: pCode, phone: pPhone, name: initialData.name || initialData.organization_name, address: initialData.address, contribution: initialData.totalDonated || initialData.contribution });
      } else {
        setFormData({ ...initialData, countryCode: pCode, phone: pPhone });
      }
    } else {
      setFormData({ countryCode: '+91', phone: '' });
    }
  }, [initialData, isOpen, type]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (finalData.phone && finalData.countryCode) {
      finalData.phone = `${finalData.countryCode}${finalData.phone}`;
    }
    onSubmit(type, finalData);
    setFormData({ countryCode: '+91', phone: '' });
    onClose();
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'activity': return <CalendarDays className="text-white" size={24} />;
      case 'Student': return <BookOpen className="text-white" size={24} />;
      case 'Parent': return <Users className="text-white" size={24} />;
      case 'Donor': return <Heart className="text-white" size={24} />;
      case 'Volunteer': return <UserPlus className="text-white" size={24} />;
      case 'Mentor': return <Briefcase className="text-white" size={24} />;
      case 'Alumnus': return <GraduationCap className="text-white" size={24} />;
      case 'Board Member': return <Briefcase className="text-white" size={24} />;
      default: return <UserPlus className="text-white" size={24} />;
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'activity':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CustomInput required name="title" placeholder="Activity Title" value={formData.title} onChange={handleChange} />
            </div>
            <CustomSelect
              required
              name="activity_type"
              placeholder="Activity Type"
              value={formData.activity_type}
              onChange={handleChange}
              options={["General", "Academic", "Event", "Workshop", "Other"]}
            />
            <CustomInput required name="audience" placeholder="Audience (e.g., Everyone)" value={formData.audience} onChange={handleChange} />
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Activity Image</label>
              <input
                type="file"
                accept="image/*"
                name="image_url"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData((prev: any) => ({ ...prev, image_url: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 ${themeClasses.focusRingLight} text-sm font-medium text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:${themeClasses.bgPrimaryLight}/10 file:${themeClasses.textPrimaryDark} dark:file:text-white hover:file:${themeClasses.bgPrimaryLight}/20 cursor-pointer shadow-sm`}
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Description</label>
              <textarea
                required
                name="description"
                value={formData.description || ''}
                onChange={handleChange as any}
                placeholder="Enter activity description"
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 ${themeClasses.focusRingLight} hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm min-h-[100px]`}
              />
            </div>
          </div>
        );
      case 'Student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CustomInput required name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            </div>
            <CustomInput required name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <CustomInput required name="rollNo" placeholder="Roll Number" value={formData.rollNo} onChange={handleChange} />
            <CustomInput required type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
            <CustomSelect
              required
              name="batch"
              placeholder="Allocated Batch"
              value={formData.batch}
              onChange={handleChange}
              options={["Batch 2026", "Batch 2025", "Batch 2024", "Batch 2023"]}
            />
            <CustomInput required name="grade" placeholder="Course & Year" value={formData.grade} onChange={handleChange} />
            <div className="md:col-span-2">
              <CustomInput required name="college" placeholder="College / University" value={formData.college} onChange={handleChange} />
            </div>
          </div>
        );
      case 'Parent':
        return (
          <div className="space-y-4">
            <CustomInput required name="name" placeholder="Parent / Guardian Name" value={formData.name} onChange={handleChange} />
            <CustomSelect
              required
              name="relationship"
              placeholder="Relationship to Student"
              value={formData.relationship}
              onChange={handleChange}
              options={['Father', 'Mother', 'Legal Guardian', 'Other']}
            />
            <CustomPhoneInput required name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} onCountryCodeChange={(e: any) => setFormData({...formData, countryCode: e.target.value})} countryCodeValue={formData.countryCode} />
            <CustomInput required name="childId" placeholder="Child's Student ID" value={formData.childId} onChange={handleChange} />
            <CustomInput required name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} />
          </div>
        );
      case 'Donor':
        return (
          <div className="space-y-4">
            <CustomInput required name="name" placeholder="Donor Organization / Name" value={formData.name} onChange={handleChange} />
            <CustomInput required name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <CustomPhoneInput required name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} onCountryCodeChange={(e: any) => setFormData({...formData, countryCode: e.target.value})} countryCodeValue={formData.countryCode} />
            <CustomInput required name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            <CustomInput required type="number" name="contribution" placeholder="Contribution Amount" value={formData.contribution} onChange={handleChange} />
          </div>
        );
      case 'Volunteer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CustomInput required name="name" placeholder="Volunteer Name" value={formData.name} onChange={handleChange} />
            </div>
            <CustomInput required name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <CustomPhoneInput required name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} onCountryCodeChange={(e: any) => setFormData({...formData, countryCode: e.target.value})} countryCodeValue={formData.countryCode} />
            <CustomInput required name="specialization" placeholder="Specialization (e.g., Mentorship, IT)" value={formData.specialization} onChange={handleChange} />
            <CustomSelect
              required
              name="availability"
              placeholder="Availability"
              value={formData.availability}
              onChange={handleChange}
              options={['Weekends', 'Weekdays', 'Evenings', 'Flexible']}
            />
          </div>
        );
      default:
        return <p className="text-slate-500 text-center py-4">Unknown entity type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-[#111116]/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.15)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">

        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 gradient-btn-tab"></div>

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border border-white/20 shadow-lg shadow-purple-500/20 ${themeClasses.bgGradientMain} text-white`}>
              {getTypeIcon()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{initialData ? 'Edit' : 'Add'} {type}</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {initialData ? `Update the details for this ${type.toLowerCase()}.` : `Fill in the details to register a new ${type.toLowerCase()}.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <form id="entity-form" onSubmit={handleSubmit}>
            {renderFields()}
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30 flex justify-end gap-3 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="entity-form"
            className="px-8 py-3 rounded-xl text-sm font-bold gradient-btn-tab text-white hover:opacity-90 shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <UserPlus size={18} strokeWidth={2.5} />
            {initialData ? 'Update' : 'Create'} {type}
          </button>
        </div>
      </div>
    </div>
  );
};
