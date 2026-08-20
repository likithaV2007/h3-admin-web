with open('src/App.tsx', 'r') as f:
    content = f.read()

old_modal = """              {(selectedExpense.receipt_photo_link || selectedExpense.receipt_drive_link) && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 pb-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Receipt Attachment</span>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2">
                    {selectedExpense.receipt_photo_link ? (
                      <img
                        src={selectedExpense.receipt_photo_link}
                        alt="Expense Receipt"
                        className="w-full max-h-48 object-contain hover:scale-[1.03] transition-transform cursor-zoom-in rounded-xl"
                        onClick={() => {
                          const w = window.open();
                          if (w) w.document.write(`<img src="${selectedExpense.receipt_photo_link}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                        }}
                      />
                    ) : (
                      <a href={selectedExpense.receipt_drive_link!} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Open Drive Document</span>
                      </a>
                    )}
                  </div>
                </div>
              )}"""

new_modal = """              {(getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link) || selectedExpense.receipt_drive_link) && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 pb-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Receipt Attachment</span>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2">
                    {getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link) ? (
                      <img
                        src={getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link)!}
                        alt="Expense Receipt"
                        className="w-full max-h-48 object-contain hover:scale-[1.03] transition-transform cursor-zoom-in rounded-xl"
                        onClick={() => {
                          const w = window.open();
                          if (w) w.document.write(`<img src="${getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link)}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                        }}
                      />
                    ) : (
                      <a href={selectedExpense.receipt_drive_link!} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Open Drive Document</span>
                      </a>
                    )}
                  </div>
                </div>
              )}"""

content = content.replace(old_modal, new_modal)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
