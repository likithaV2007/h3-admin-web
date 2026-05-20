import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EntityCreationModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string, data: any) => void;
}

export const EntityCreationModal: React.FC<EntityCreationModalProps> = ({ type, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});

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

  const renderFields = () => {
    switch (type) {
      case 'Student':
        return (
          <>
            <input required name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="rollNo" placeholder="Roll Number" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="college" placeholder="College / Institution" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="grade" placeholder="Course & Year (e.g., B.Tech - 1st Year)" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required type="number" name="age" placeholder="Age" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
          </>
        );
      case 'Parent':
        return (
          <>
            <input required name="name" placeholder="Parent Name" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="childName" placeholder="Child's Name" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="occupation" placeholder="Occupation" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
          </>
        );
      case 'Donor':
        return (
          <>
            <input required name="name" placeholder="Donor Organization / Name" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <select required name="level" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700">
              <option value="">Select Level</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
          </>
        );
      case 'Volunteer':
        return (
          <>
            <input required name="name" placeholder="Volunteer Name" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="program" placeholder="Program/Department" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
          </>
        );
      case 'Mentor':
        return (
          <>
            <input required name="name" placeholder="Mentor Name" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="expertise" placeholder="Expertise Area" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
          </>
        );
      case 'Alumnus':
        return (
          <>
            <input required name="name" placeholder="Alumnus Name" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required type="number" name="graduationYear" placeholder="Graduation Year" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="currentCompany" placeholder="Current Company" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="designation" placeholder="Designation" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
          </>
        );
      case 'Board Member':
        return (
          <>
            <input required name="name" placeholder="Board Member Name" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
            <input required name="role" placeholder="Role / Title" onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" />
          </>
        );
      default:
        return <p>Unknown entity type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Create New {type}</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-3">
            {renderFields()}
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              Create {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
