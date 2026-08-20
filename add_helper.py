with open('src/App.tsx', 'r') as f:
    content = f.read()

helper = """
// Helper to extract a displayable image URL from drive links if a photo link is missing
const getDriveImageUrl = (photoLink?: string | null, driveLink?: string | null) => {
  if (photoLink) return photoLink;
  if (driveLink) {
    const match = driveLink.match(/\\/d\\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?id=${match[1]}&export=download`;
    }
  }
  return null;
};
"""

content = content.replace("function App() {", helper + "\nfunction App() {")

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
