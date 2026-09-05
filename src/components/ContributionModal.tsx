import React, { useState } from 'react';
import { X, Receipt, Download, Mail, CheckCircle2, Eye } from 'lucide-react';
import { generateContributionReceipt } from '../services/pdfGenerator';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import type { Donor } from '../mockData';
import { themeClasses } from '../theme';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void | Promise<void>;
  donors: Donor[];
}

export const ContributionModal: React.FC<ContributionModalProps> = ({ isOpen, onClose, onSubmit, donors }) => {
  const [formData, setFormData] = useState({
    donorId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    notes: ''
  });
  
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState(false);
  
  const selectedDonor = donors.find(d => d.id === formData.donorId) || null;

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreview = async () => {
    if (!selectedDonor || !formData.amount) return;
    
    const previewContribution = {
      id: `PREVIEW`,
      donorId: formData.donorId,
      donorName: selectedDonor.name,
      amount: parseFloat(formData.amount),
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      receiptSent: false
    };
    
    const doc = await generateContributionReceipt(previewContribution as any, selectedDonor, false);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;
    if (!isAnonymous && (!formData.donorId || !selectedDonor)) return;
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Saving contribution...');
    
    try {
      if (!isAnonymous && selectedDonor) {
        toast.loading('Saving contribution & emailing receipt...', { id: loadingToast });
        // 1. Generate PDF Blob
      const previewContribution = {
        id: `REC${Date.now()}`,
        donorId: formData.donorId,
        donorName: selectedDonor.name,
        amount: parseFloat(formData.amount),
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        receiptSent: true
      };
      const doc = await generateContributionReceipt(previewContribution as any, selectedDonor, false);
      const pdfBlob = doc.output('blob');
      
      // 2. Send email via backend
      if (!isAnonymous && selectedDonor && selectedDonor.email && selectedDonor.email !== 'N/A') {
        const emailSent = await apiService.sendReceiptEmail(selectedDonor.email, selectedDonor.name, pdfBlob);
        
        if (!emailSent) {
          toast.error(`Failed to send email. Contribution was NOT saved.`, { id: loadingToast });
          setIsSubmitting(false);
          return; // Stop execution, do not save to database
        }
        
        toast.success(`Receipt securely emailed to ${selectedDonor.email}!`, { id: loadingToast });
        setEmailSentStatus(true);
      } else if (!isAnonymous) {
        toast.success(`Contribution saved locally (no email provided).`, { id: loadingToast });
        setEmailSentStatus(false);
      }
      }

      // 3. Save Contribution to DB
      await onSubmit({
        donorId: isAnonymous ? null : formData.donorId,
        donorName: isAnonymous ? 'Anonymous' : selectedDonor?.name,
        amount: parseFloat(formData.amount),
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      });
      if (isAnonymous) {
        toast.dismiss(loadingToast);
        toast.success('Anonymous contribution saved successfully!');
      }
      
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ donorId: '', amount: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'Bank Transfer', notes: '' });
        setIsAnonymous(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting contribution:", error);
      toast.error('Error processing contribution.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${themeClasses.bgPrimaryLight}/10 ${themeClasses.textPrimaryDark} dark:text-white`}>
              <Receipt size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Record Contribution</h2>
              <p className="text-xs font-bold text-slate-500">Log donation and send receipt</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {showSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <div className={`w-20 h-20 rounded-full ${themeClasses.bgPrimaryLight}/20 flex items-center justify-center ${themeClasses.textPrimaryDark} mb-2`}>
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Contribution Recorded!</h3>
            <p className="text-slate-500 font-medium">
              {emailSentStatus 
                ? `The donation has been logged and the receipt has been emailed to ${selectedDonor?.email}.`
                : `The donation has been successfully logged.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">


            <div className={`space-y-1.5 transition-opacity ${isAnonymous ? 'opacity-40 pointer-events-none' : ''}`}>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Select Donor</label>
              <select
                required={!isAnonymous}
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
                disabled={isAnonymous}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 ${themeClasses.focusRingLight} hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white appearance-none`}
              >
                <option value="" disabled>Select a donor</option>
                {donors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Amount (INR)</label>
                <input
                  required
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 ${themeClasses.focusRingLight} hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Date</label>
                <input
                  required
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 ${themeClasses.focusRingLight} hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Payment Method</label>
              <select
                required
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 ${themeClasses.focusRingLight} hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white appearance-none`}
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                <option value="UPI">UPI</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special remarks for this donation..."
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all duration-200 ${themeClasses.focusRingLight} hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium text-slate-900 dark:text-white min-h-[80px]`}
              />
            </div>
            
            <div className="flex items-center gap-2 mt-4 mb-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <input 
                type="checkbox" 
                id="anonymous" 
                checked={isAnonymous} 
                onChange={(e) => {
                  setIsAnonymous(e.target.checked);
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, donorId: '' }));
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="anonymous" className="text-sm font-bold text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                Anonymous Donation (No donor info required, no receipt sent)
              </label>
            </div>
            
            {!isAnonymous && selectedDonor && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 flex gap-3">
                <Mail className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                  Upon saving, a highly formatted PDF donation receipt will be securely generated and automatically emailed to <strong>{selectedDonor.email}</strong>.
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              {!isAnonymous && (
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!formData.donorId || !formData.amount}
                  className="px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye size={16} />
                  Preview Receipt
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!isAnonymous && !formData.donorId) || !formData.amount}
                className={`px-6 py-2.5 text-sm font-bold text-white ${themeClasses.bgGradientMain} rounded-xl shadow-lg ${themeClasses.shadowPrimaryDark} hover:opacity-90 transition-all flex items-center justify-center min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isAnonymous ? <Download size={16} /> : <Mail size={16} />}
                    <span>{isAnonymous ? 'Save Contribution' : 'Send Receipt'}</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};