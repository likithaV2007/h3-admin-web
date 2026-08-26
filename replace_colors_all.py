import re
import glob

files_to_check = glob.glob('src/**/*.tsx', recursive=True)

for file_path in files_to_check:
    with open(file_path, 'r') as f:
        content = f.read()

    # Replace all tailwind color variations for blue, indigo, and cyan with purple
    new_content = re.sub(r'blue-(\d+)', r'purple-\1', content)
    new_content = re.sub(r'indigo-(\d+)', r'purple-\1', new_content)
    new_content = re.sub(r'cyan-(\d+)', r'purple-\1', new_content)
    new_content = new_content.replace('#3b82f6', '#cbb4d4')
    new_content = new_content.replace('#2563eb', '#20002c')

    if new_content != content:
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Replaced colors in {file_path}")

print("Done replacing everywhere!")
