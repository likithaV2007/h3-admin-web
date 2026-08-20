with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    """<p className="text-[10px] text-slate-500 dark:text-slate-400">By {item.uploaded_by}</p>""",
    """<p className="text-[10px] text-slate-500 dark:text-slate-400" style={{wordBreak: "break-all", whiteSpace: "normal"}}>By {item.uploaded_by} | P: {String(item.receipt_photo_link).substring(0, 30)}... | D: {String(item.receipt_drive_link).substring(0, 10)}</p>"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
