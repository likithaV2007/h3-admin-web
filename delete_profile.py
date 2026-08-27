import sys

file_path = '/Users/hope3services/likitha/workspace/react/H3-Admin-Web/src/App.tsx'
with open(file_path, 'r') as f:
    lines = f.readlines()

# line 4600 is index 4599
# line 4716 is index 4715
# python slice upper bound is exclusive, so 4599 to 4716
del lines[4599:4716]

with open(file_path, 'w') as f:
    f.writelines(lines)

