import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace new student hardcoded avatars
content = re.sub(
    r"'https://images\.unsplash\.com/photo-1539571696357-5a69c17a67c6\?auto=format&fit=crop&q=80&w=120'",
    r"'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff'",
    content
)

# Replace student list onError
content = re.sub(
    r"\(e\.target as HTMLImageElement\)\.src = 'https://images\.unsplash\.com/photo-1539571696357-5a69c17a67c6\?auto=format&fit=crop&q=80&w=120';",
    r"(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Student')}&background=3a2248&color=fff`;",
    content
)
# Wait, some have selectedStudent
content = content.replace(
    "(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Student')}&background=3a2248&color=fff`;",
    "(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent((typeof student !== 'undefined' ? student.name : typeof selectedStudent !== 'undefined' ? selectedStudent.name : 'Student') || 'Student')}&background=3a2248&color=fff`;"
) # We can just use generic "User" if we aren't sure about the context.

# Actually, let's just replace ALL unsplash avatars with a generic UI Avatar to be safe and simple:
content = re.sub(
    r"'(https://images\.unsplash\.com/[^']+)'",
    r"`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`",
    content
)

# Fix any double backticks if they occurred
content = content.replace("``https://ui-avatars", "`https://ui-avatars")
content = content.replace("fff```", "fff`")

# Also, there's `src={vol.profile_photo_link || 'https://images...'} `
# The regex above will replace the string with a template literal.
# Let's see if that works. `src={vol.profile_photo_link || \`https://...fff\`}` 

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
