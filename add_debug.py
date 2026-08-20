with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a tiny debug span next to the title
content = content.replace(
    """<h3 className="font-bold text-[13px] leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 pr-16">{item.title}</h3>""",
    """<h3 className="font-bold text-[13px] leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 pr-16">{item.title} <span className="text-[8px] text-red-500">[{item.receipt_photo_link ? 'HAS_PHOTO' : 'NO_PHOTO'}]</span></h3>"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
