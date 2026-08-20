const getDriveImageUrl = (photoLink, driveLink) => {
  const linkToUse = photoLink || driveLink;
  if (!linkToUse) return null;
  
  const match = linkToUse.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (linkToUse.includes('drive.google.com') && match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  
  return photoLink || null;
};

console.log(getDriveImageUrl("https://drive.google.com/uc?id=1D-a0gq7EzIFHB2lriq_l71ROvq4fhaqf&export=download", null));
