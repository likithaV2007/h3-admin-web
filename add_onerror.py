with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add onError to the img tags for expenses to hide them if they fail (e.g. 403 Forbidden due to private drive)
content = content.replace(
    """<img src={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} alt="Receipt" className="w-full h-full object-cover" />""",
    """<img src={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} alt="Receipt" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-[8px] font-bold text-slate-400 p-1 text-center leading-tight">Private Image</span>'; }} />"""
)

content = content.replace(
    """<img src={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} alt="Receipt thumbnail" className="w-full h-auto max-h-48 object-cover rounded-lg bg-white dark:bg-slate-950" />""",
    """<img src={getDriveImageUrl(item.receipt_photo_link, item.receipt_drive_link)!} alt="Receipt thumbnail" className="w-full h-auto max-h-48 object-cover rounded-lg bg-white dark:bg-slate-950" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="py-4 text-center border-2 border-dashed border-red-200 rounded-lg text-xs font-bold text-red-500">Image is Private or Blocked. Click to open in Drive.</div>'; }} />"""
)

content = content.replace(
    """<img
                        src={getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link)!}
                        alt="Expense Receipt"
                        className="w-full max-h-48 object-contain hover:scale-[1.03] transition-transform cursor-zoom-in rounded-xl"
                        onClick={() => {
                          const w = window.open();
                          if (w) w.document.write(`<img src="${getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link)}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                        }}
                      />""",
    """<img
                        src={getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link)!}
                        alt="Expense Receipt"
                        className="w-full max-h-48 object-contain hover:scale-[1.03] transition-transform cursor-zoom-in rounded-xl"
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<a href="' + (selectedExpense.receipt_drive_link || selectedExpense.receipt_photo_link) + '" target="_blank" class="block w-full py-4 text-center border-2 border-dashed border-red-200 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50">Private Google Drive Image. Click to view externally.</a>'; }}
                        onClick={() => {
                          const w = window.open();
                          if (w) w.document.write(`<img src="${getDriveImageUrl(selectedExpense.receipt_photo_link, selectedExpense.receipt_drive_link)}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                        }}
                      />"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
