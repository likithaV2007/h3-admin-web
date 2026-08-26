with open('src/App.tsx', 'r') as f:
    content = f.read()

old_code = """                                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                  <AchievementImage 
                                    url={ach.photo_drive_link || ach.badge_image_url} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" """

new_code = """                                <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                                  <AchievementImage 
                                    url={ach.photo_drive_link || ach.badge_image_url} 
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" """

content = content.replace(old_code, new_code)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Fixed image crop issue!")
