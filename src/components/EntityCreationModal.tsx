import React, { useState } from 'react';
import { X, UserPlus, BookOpen, Heart, Briefcase, GraduationCap, Users, CalendarDays } from 'lucide-react';

interface EntityCreationModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string, data: any) => void;
  initialData?: any;
}

const CustomInput = ({ name, placeholder, type = "text", onChange, required, value }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">{placeholder}</label>
    <input
      required={required}
      type={type}
      name={name}
      onChange={onChange}
      value={value || ''}
      placeholder={`Enter ${placeholder.toLowerCase()}`}
      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
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
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white appearance-none shadow-sm"
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

export const EntityCreationModal: React.FC<EntityCreationModalProps> = ({ type, isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<any>(initialData || {});

  React.useEffect(() => {
    if (initialData) {
      if (type === 'Student') {
        setFormData({ ...initialData, name: initialData.name || initialData.student_name });
      } else if (type === 'Parent') {
        setFormData({ ...initialData, name: initialData.name || initialData.parent_name, relationship: initialData.guardianName || initialData.relationship || initialData.relation, childId: initialData.childId || initialData.student_id });
      } else if (type === 'Volunteer') {
        setFormData({ ...initialData, name: initialData.name || initialData.full_name });
      } else if (type === 'Donor') {
        setFormData({ ...initialData, name: initialData.name || initialData.organization_name, level: initialData.donorType || initialData.donor_type });
      } else {
        setFormData(initialData);
      }
    } else {
      setFormData({});
    }
  }, [initialData, isOpen, type]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(type, formData);
    setFormData({});
    onClose();
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'activity': return <CalendarDays className="text-emerald-500" size={24} />;
      case 'Student': return <BookOpen className="text-purple-500" size={24} />;
      case 'Parent': return <Users className="text-purple-500" size={24} />;
      case 'Donor': return <Heart className="text-rose-500" size={24} />;
      case 'Volunteer': return <UserPlus className="text-emerald-500" size={24} />;
      case 'Mentor': return <Briefcase className="text-amber-500" size={24} />;
      case 'Alumnus': return <GraduationCap className="text-purple-500" size={24} />;
      case 'Board Member': return <Briefcase className="text-purple-500" size={24} />;
      default: return <UserPlus className="text-purple-500" size={24} />;
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'activity':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CustomInput required name="title" placeholder="Activity Title" onChange={handleChange} />
            </div>
            <CustomSelect
              required
              name="activity_type"
              placeholder="Activity Type"
              onChange={handleChange}
              options={["General", "Academic", "Event", "Workshop", "Other"]}
            />
            <CustomInput required name="audience" placeholder="Audience (e.g., Everyone)" onChange={handleChange} />
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
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm font-medium text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 cursor-pointer shadow-sm"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Description</label>
              <textarea
                required
                name="description"
                onChange={handleChange as any}
                placeholder="Enter activity description"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm min-h-[100px]"
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
            <CustomInput required name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            <CustomInput required name="childId" placeholder="Child's Student ID" value={formData.childId} onChange={handleChange} />
            <CustomInput required name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} />
          </div>
        );
      case 'Donor':
        return (
          <div className="space-y-4">
            <CustomInput required name="name" placeholder="Donor Organization / Name" value={formData.name} onChange={handleChange} />
            <CustomInput required name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <CustomSelect required name="level" placeholder="Donation Level" value={formData.level} onChange={handleChange} options={['Platinum', 'Gold', 'Silver', 'Bronze', 'Individual Benefactor']} />
          </div>
        );
      case 'Volunteer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CustomInput required name="name" placeholder="Volunteer Name" value={formData.name} onChange={handleChange} />
            </div>
            <CustomInput required name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <CustomInput required name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">

        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 gradient-btn-tab"></div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
              {getTypeIcon()}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-4">{initialData ? 'Edit' : 'Add'} {type}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {initialData ? `Update the details for this ${type.toLowerCase()}.` : `Fill in the details to register a new ${type.toLowerCase()}.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <form id="entity-form" onSubmit={handleSubmit}>
            {renderFields()}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="entity-form"
            className="px-6 py-2.5 rounded-xl text-sm font-bold gradient-btn-tab hover:opacity-90 shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <UserPlus size={16} strokeWidth={2.5} />
            Create {type}
          </button>
        </div>
      </div>
    </div>
  );
};
