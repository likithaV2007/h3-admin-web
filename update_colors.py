import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace in classNames:
content = content.replace("text-[#3a2248]", "text-[#cbb4d4]")
content = content.replace("bg-[#3a2248]", "bg-[#cbb4d4]")
content = content.replace("border-[#3a2248]", "border-[#cbb4d4]")
content = content.replace("color: '#3a2248'", "color: '#cbb4d4'") # for mockData or inline styles

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
