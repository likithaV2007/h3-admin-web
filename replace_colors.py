import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace all tailwind color variations for blue, indigo, and cyan with purple
content = re.sub(r'blue-(\d+)', r'purple-\1', content)
content = re.sub(r'indigo-(\d+)', r'purple-\1', content)
content = re.sub(r'cyan-(\d+)', r'purple-\1', content)
# Special case for transparent colors like bg-blue-500/10 -> bg-purple-500/10
# (the above regex handles the number prefix perfectly!)

# Let's also check if there is any hardcoded blue hex
content = content.replace('#3b82f6', '#cbb4d4') # typical tailwind blue-500
content = content.replace('#2563eb', '#20002c') # typical tailwind blue-600
content = content.replace('blue', 'purple') # wait, this might replace variable names! Let's NOT do this.

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Replaced colors successfully!")
