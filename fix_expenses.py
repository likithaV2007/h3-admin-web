with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update the list view thumbnail (around line 3631)
old_list_thumb = """                                  {item.receipt_photo_link ? (
                                    <div className="w-11 h-11 rounded-2xl shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-slate-50 dark:bg-slate-800">
                                      <img src={item.receipt_photo_link} alt="Receipt" className="w-full h-full object-cover" />
                                    </div>
                                  ) : ("""

new_list_thumb = """                                  {getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link) ? (
                                    <div className="w-11 h-11 rounded-2xl shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-slate-50 dark:bg-slate-800">
                                      <img src={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} alt="Receipt" className="w-full h-full object-cover" />
                                    </div>
                                  ) : ("""
content = content.replace(old_list_thumb, new_list_thumb)

# 2. Update the expanded list view (around line 3745)
old_expanded_view = """                                {/* Uploaded Receipt Display */}
                                {(item.receipt_photo_link || item.receipt_drive_link) && (
                                  <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attached Receipt</span>
                                      {item.receipt_drive_link && !item.receipt_photo_link && (
                                        <span className="text-[9px] font-bold text-blue-500">Google Drive Link</span>
                                      )}
                                    </div>
                                    {item.receipt_photo_link ? (
                                      <a href={item.receipt_photo_link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        <img src={item.receipt_photo_link} alt="Receipt thumbnail" className="w-full h-auto max-h-48 object-cover rounded-lg bg-white dark:bg-slate-950" />
                                      </a>
                                    ) : (
                                      <a href={item.receipt_drive_link!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block w-full py-3 text-center border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Open Drive Document</span>
                                      </a>
                                    )}
                                  </div>
                                )}"""

new_expanded_view = """                                {/* Uploaded Receipt Display */}
                                {(getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)) && (
                                  <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attached Receipt</span>
                                    </div>
                                    <a href={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                      <img src={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} alt="Receipt thumbnail" className="w-full h-auto max-h-48 object-cover rounded-lg bg-white dark:bg-slate-950" />
                                    </a>
                                  </div>
                                )}
                                {(!getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link) && item.receipt_drive_link) && (
                                  <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attached Receipt</span>
                                    </div>
                                    <a href={item.receipt_drive_link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block w-full py-3 text-center border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Open Document</span>
                                    </a>
                                  </div>
                                )}"""
content = content.replace(old_expanded_view, new_expanded_view)

# 3. Update the expense details modal (around line 4805)
# Let's check exactly how it's formatted.
