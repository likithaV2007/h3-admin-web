import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # 2309: student row
    if "(e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff';" in line and "student" in lines[i-5]:
        lines[i] = line.replace("'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff'", "`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=3a2248&color=fff`")
    
    # 2401: selected student details
    if "(e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff';" in line and "selectedStudent" in lines[i-5]:
        lines[i] = line.replace("'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff'", "`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=3a2248&color=fff`")

    # 3138: parent row
    if "`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`" in line and "par.name" in lines[i-3]:
        lines[i] = line.replace("`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`", "`https://ui-avatars.com/api/?name=${encodeURIComponent(par.name)}&background=3a2248&color=fff`")

    # 3239, 3243: volunteer row
    if "'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff'" in line and "vol.name" in lines[i-1]:
        lines[i] = line.replace("'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff'", "`https://ui-avatars.com/api/?name=${encodeURIComponent(vol.name)}&background=3a2248&color=fff`")
    if "'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff'" in line and "vol.name" in lines[i-5]:
        lines[i] = line.replace("'https://ui-avatars.com/api/?name=Student&background=3a2248&color=fff'", "`https://ui-avatars.com/api/?name=${encodeURIComponent(vol.name)}&background=3a2248&color=fff`")

    # 3348: donor row
    if "`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`" in line and "donor.name" in lines[i-3]:
        lines[i] = line.replace("`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`", "`https://ui-avatars.com/api/?name=${encodeURIComponent(donor.name)}&background=3a2248&color=fff`")

    # 4363: selected volunteer modal
    if "`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`" in line and "selectedVolunteer" in lines[i-3]:
        lines[i] = line.replace("`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`", "`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedVolunteer.name)}&background=3a2248&color=fff`")

    # 4480: selected donor modal
    if "`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`" in line and "selectedDonor" in lines[i-3]:
        lines[i] = line.replace("`https://ui-avatars.com/api/?name=Profile&background=3a2248&color=fff`", "`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDonor.name)}&background=3a2248&color=fff`")

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
print("Done!")
