with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update handlers to call the API
fee_action_old = """  const handleFeeAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    // Note: Temporary local state update for demo
    setStudentFeeRequests(prev => prev.map(fr => fr.fee_request_id === id ? { ...fr, status: newStatus } : fr));
  };"""

fee_action_new = """  const handleFeeAction = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    const apiStatus = newStatus === 'Approved' ? 'approved' : 'rejected';
    const result = await apiService.updateFeeRequestStatus(id, apiStatus);
    if (result) {
      setStudentFeeRequests(prev => prev.map(fr => fr.fee_request_id === id ? { ...fr, status: newStatus } : fr));
    }
  };"""

leave_action_old = """  const handleLeaveAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    // Update global leave list
    setLeaveRequests(prev => prev.map(lr => lr.id === id ? { ...lr, status: newStatus } : lr));

    // Find associated student and update their inner leave list
    const targetLeave = leaveRequests.find(lr => lr.id === id);
    if (targetLeave) {
      setStudents(prevStudents => prevStudents.map(student => {
        if (student.id === targetLeave.studentId) {
          const updatedRequests = student.leaveRequests.map(lr =>
            lr.id === id ? { ...lr, status: newStatus } : lr
          );
          return { ...student, leaveRequests: updatedRequests };
        }
        return student;
      }));
    }
  };"""

leave_action_new = """  const handleLeaveAction = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    const apiStatus = newStatus === 'Approved' ? 'approved' : 'rejected';
    const result = await apiService.updateLeaveRequestStatus(id, apiStatus);
    
    if (result) {
      setStudentLeaveRequests(prev => prev.map(lr => lr.leave_request_id === id ? { ...lr, status: newStatus } : lr));
      
      // Update global leave list mock if it exists
      setLeaveRequests(prev => prev.map(lr => lr.id === id ? { ...lr, status: newStatus } : lr));
    }
  };"""

content = content.replace(fee_action_old, fee_action_new)
content = content.replace(leave_action_old, leave_action_new)

# 2. Update colors for the View Attachments, Marksheet, and Receipt badges
badges_old = """                                    <div className="flex flex-wrap gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                                      {req.drive_link && (
                                        <a href={req.drive_link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 px-3 py-1 rounded-full inline-flex items-center gap-1 transition-colors">
                                          <span>📎</span> View Attachments
                                        </a>
                                      )}
                                      {req.submitted_marksheets === 1 && (
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full inline-flex items-center gap-1">✓ Marksheet</span>
                                      )}
                                      {req.submitted_payment_receipts === 1 && (
                                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-3 py-1 rounded-full inline-flex items-center gap-1">✓ Receipt</span>
                                      )}
                                    </div>"""

badges_new = """                                    <div className="flex flex-wrap gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                                      {req.drive_link && (
                                        <a href={req.drive_link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1 rounded-full inline-flex items-center gap-1 transition-colors">
                                          <span>📎</span> View Attachments
                                        </a>
                                      )}
                                      {req.submitted_marksheets === 1 && (
                                        <span className="text-[10px] font-bold text-slate-700 bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/10 dark:text-[#cbb4d4] border border-[#cbb4d4]/40 px-3 py-1 rounded-full inline-flex items-center gap-1">✓ Marksheet</span>
                                      )}
                                      {req.submitted_payment_receipts === 1 && (
                                        <span className="text-[10px] font-bold text-slate-700 bg-[#cbb4d4]/20 dark:bg-[#cbb4d4]/10 dark:text-[#cbb4d4] border border-[#cbb4d4]/40 px-3 py-1 rounded-full inline-flex items-center gap-1">✓ Receipt</span>
                                      )}
                                    </div>"""

content = content.replace(badges_old, badges_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updated handlers and badge colors.")
