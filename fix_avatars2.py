import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 2306 (Student list)
content = content.replace(
    "(e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff';",
    "(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=3a2248&color=fff`;"
)

# 2398 (Selected Student)
content = content.replace(
    "(e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff';",
    "(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=3a2248&color=fff`;"
)

# 3236 (Volunteer list) - there are two, one in src and one in onError
content = content.replace(
    "src={vol.profile_photo_link || 'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff'}",
    "src={vol.profile_photo_link || `https://ui-avatars.com/api/?name=${encodeURIComponent(vol.name)}&background=3a2248&color=fff`}"
)
content = content.replace(
    "(e.target as HTMLElement).setAttribute('src', 'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff');",
    "(e.target as HTMLElement).setAttribute('src', `https://ui-avatars.com/api/?name=${encodeURIComponent(vol.name)}&background=3a2248&color=fff`);"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done!")
