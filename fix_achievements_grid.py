with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix grid layout
grid_old = """                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">"""
grid_new = """                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">"""

content = content.replace(grid_old, grid_new)

# Revert image to h-48 object-cover just like Activities
image_old = """                                <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                                  <AchievementImage 
                                    url={ach.photo_drive_link || ach.badge_image_url} 
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" """

image_new = """                                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                                  <AchievementImage 
                                    url={ach.photo_drive_link || ach.badge_image_url} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" """

content = content.replace(image_old, image_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updated Achievements layout to match Activities.")
