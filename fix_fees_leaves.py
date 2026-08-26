with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add handleFeeAction if not exists
if 'const handleFeeAction' not in content:
    content = content.replace(
"""  const handleLeaveAction = (id: string, newStatus: 'Approved' | 'Rejected') => {""",
"""  const handleFeeAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    // Note: Temporary local state update for demo
    setStudentFeeRequests(prev => prev.map(fr => fr.fee_request_id === id ? { ...fr, status: newStatus } : fr));
  };

  const handleLeaveAction = (id: string, newStatus: 'Approved' | 'Rejected') => {""")


# 2. Fix Fees requests UI
content = content.replace(
"""                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold truncate max-w-[120px] block" title={req.fee_request_id}>{req.fee_request_id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase
                                      ${req.status?.toLowerCase() === 'approved' || req.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                                        req.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                                          'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'}`}
                                    >
                                      {req.status}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-800 dark:text-white">{req.fee_type} (₹{req.amount})</p>
                                  <p className="text-xs text-slate-500">{req.reason}</p>
                                  <span className="text-[10px] text-slate-400 block">Due Date: {req.due_date} | Created: {new Date(req.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>""",
"""                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{req.fee_type} (₹{req.amount})</h5>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border
                                      ${req.status?.toLowerCase() === 'approved' || req.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                        req.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                          'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}
                                    >
                                      {req.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 line-clamp-2">{req.reason || 'No details provided'}</p>
                                  <span className="text-[10px] text-slate-400 block font-mono">Due: {req.due_date} | Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                                </div>
                                
                                {/* Decision actions directly on profile */}
                                {req.status?.toLowerCase() === 'pending' && (activeRole === 'Admin') && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleFeeAction(req.fee_request_id, 'Approved')}
                                      className="px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 text-xs font-bold transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleFeeAction(req.fee_request_id, 'Rejected')}
                                      className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>"""
)


# 3. Fix Leave requests UI
content = content.replace(
"""                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold truncate max-w-[120px] block" title={req.leave_request_id}>{req.leave_request_id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase
                                      ${req.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                                        req.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                                          'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'}`}
                                    >
                                      {req.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">{req.reason}</p>
                                  <span className="text-[10px] text-slate-400 block">Dates: {req.leave_date} to {req.resume_date} | Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                                </div>""",
"""                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{req.reason || 'Leave Request'}</h5>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border
                                      ${req.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                        req.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                          'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}
                                    >
                                      {req.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400">
                                    <span className="font-semibold text-slate-800 dark:text-slate-300">Start:</span> {req.leave_date} &nbsp;&mdash;&nbsp; 
                                    <span className="font-semibold text-slate-800 dark:text-slate-300">End:</span> {req.resume_date}
                                  </p>
                                  <span className="text-[10px] text-slate-400 block font-mono">Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                                </div>"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done exact replaces for fees and leaves!")
