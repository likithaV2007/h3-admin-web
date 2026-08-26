with open('src/App.tsx', 'r') as f:
    content = f.read()

fee_card_old = """                              <div key={req.fee_request_id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="space-y-1">
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

fee_card_new = """                              <div key={req.fee_request_id} className="p-5 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
                                <div className="space-y-3 w-full">
                                  <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-bold text-base text-slate-900 dark:text-white">{req.fee_type} <span className="text-slate-500 font-normal">(₹{req.amount})</span></h5>
                                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border
                                        ${req.status?.toLowerCase() === 'approved' || req.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                          req.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                            'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}
                                      >
                                        {req.status}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 block font-mono">Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                                  </div>
                                  
                                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg italic border border-slate-100 dark:border-slate-800/80">
                                    "{req.reason || 'No reason provided'}"
                                  </p>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] pt-1">
                                    {req.due_date && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Due Date</span><span className="font-bold text-slate-700 dark:text-slate-300">{req.due_date}</span></div>
                                    )}
                                    {req.payment_mode && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Payment Mode</span><span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{req.payment_mode.replace('_', ' ')}</span></div>
                                    )}
                                    {req.course && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Course</span><span className="font-bold text-slate-700 dark:text-slate-300">{req.course}</span></div>
                                    )}
                                    {req.email && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Email</span><span className="font-bold text-slate-700 dark:text-slate-300 truncate block" title={req.email}>{req.email}</span></div>
                                    )}
                                    {req.contact_number && (
                                      <div><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Contact</span><span className="font-bold text-slate-700 dark:text-slate-300">{req.contact_number}</span></div>
                                    )}
                                    {req.review_note && (
                                      <div className="col-span-full"><span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Admin Note</span><span className="font-bold text-slate-700 dark:text-slate-300">{req.review_note}</span></div>
                                    )}
                                  </div>

                                  {(req.submitted_marksheets === 1 || req.submitted_payment_receipts === 1 || req.drive_link) && (
                                    <div className="flex flex-wrap gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                                      {req.drive_link && (
                                        <a href={req.drive_link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 px-3 py-1 rounded-full inline-flex items-center gap-1 transition-colors">
                                          <span>📎</span> View Attachments
                                        </a>
                                      )}
                                      {req.submitted_marksheets === 1 && (
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full inline-flex items-center gap-1">✓ Marksheet</span>
                                      )}
                                      {req.submitted_payment_receipts === 1 && (
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full inline-flex items-center gap-1">✓ Receipt</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Decision actions directly on profile */}
                                {req.status?.toLowerCase() === 'pending' && (activeRole === 'Admin') && (
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full justify-end">
                                    <button
                                      onClick={() => handleFeeAction(req.fee_request_id, 'Approved')}
                                      className="px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 text-xs font-bold transition-colors"
                                    >
                                      Approve Request
                                    </button>
                                    <button
                                      onClick={() => handleFeeAction(req.fee_request_id, 'Rejected')}
                                      className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>"""


leave_card_old = """                              <div key={req.leave_request_id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="space-y-1">
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
                                </div>

                                {/* Decision actions directly on profile */}
                                {req.status?.toLowerCase() === 'pending' && (activeRole === 'Admin') && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleLeaveAction(req.leave_request_id, 'Approved')}
                                      className="px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 text-xs font-bold transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleLeaveAction(req.leave_request_id, 'Rejected')}
                                      className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>"""


leave_card_new = """                              <div key={req.leave_request_id} className="p-5 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
                                <div className="space-y-3 w-full">
                                  <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-bold text-base text-slate-900 dark:text-white">{req.reason || 'Leave Request'}</h5>
                                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border
                                        ${req.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                          req.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                            'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}
                                      >
                                        {req.status}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 block font-mono">Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 text-[11px] pt-1">
                                    <div>
                                      <span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Leave Start Date</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">📅 {req.leave_date}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Return/Resume Date</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">📅 {req.resume_date}</span>
                                    </div>
                                    {req.review_note && (
                                      <div className="col-span-full">
                                        <span className="text-slate-400 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Admin Note</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{req.review_note}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Decision actions directly on profile */}
                                {req.status?.toLowerCase() === 'pending' && (activeRole === 'Admin') && (
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full justify-end">
                                    <button
                                      onClick={() => handleLeaveAction(req.leave_request_id, 'Approved')}
                                      className="px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 text-xs font-bold transition-colors"
                                    >
                                      Approve Leave
                                    </button>
                                    <button
                                      onClick={() => handleLeaveAction(req.leave_request_id, 'Rejected')}
                                      className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>"""


content = content.replace(fee_card_old, fee_card_new)
content = content.replace(leave_card_old, leave_card_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updated fee and leave detail designs")
