import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Contribution, Donor } from '../mockData';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

export const generateContributionReceipt = async (contribution: Contribution, donor: Donor, download = false) => {
  const doc = new jsPDF();
  
  try {
    const logoImg = await loadImage('/hope3_logo-removebg-preview.png');
    
    // Draw the "H O PE" logo manually since the image is just the swirl (O)
    // H in red, swirl image, PE in dark blue
    doc.setFontSize(42);
    doc.setFont('helvetica', 'bold');
    
    // H
    doc.setTextColor(211, 47, 47); // Red
    doc.text('H', 130, 26);
    
    // O (swirl image) - The image is 1:1, draw as 16x16
    doc.addImage(logoImg, 'PNG', 142, 12, 16, 16); 
    
    // PE
    doc.setTextColor(31, 78, 121); // Dark blue
    doc.text('PE', 159, 26);
    
  } catch (e) {
    console.error('Failed to load logo', e);
  }

  // Header - Top Left
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Black text for header
  doc.setFont('helvetica', 'normal');
  doc.text('Hope3 Foundation', 15, 20);
  doc.text('18129 NE 111th st', 15, 25);
  doc.text('Redmond, WA 98052 US', 15, 30);
  doc.text('+1 4258181900', 15, 35);
  doc.text('treasurer@hope3.org', 15, 40);
  doc.text('http://www.hope3.org', 15, 45);
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(93, 156, 236); // Light blue
  doc.setFont('helvetica', 'normal');
  doc.text('DONATION RECEIPT', 15, 60);
  
  // Bill To & Receipt Details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('BILL TO', 15, 75);
  
  doc.text(donor.name, 15, 82);
  doc.text(donor.email, 15, 87);
  if (donor.phone) {
    doc.text(donor.phone, 15, 92);
  }
  
  // Donation Info on right
  doc.setFont('helvetica', 'bold');
  doc.text(`DONATION # ${contribution.id}`, 140, 75);
  doc.text(`DATE ${contribution.date}`, 140, 80);
  
  // Contribution Details Table
  doc.setFont('helvetica', 'normal');
  const amountStr = contribution.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  autoTable(doc, {
    startY: 105,
    margin: { left: 15, right: 15 },
    headStyles: { 
      fillColor: [225, 238, 246], // Light blue header background
      textColor: [93, 156, 236], // Light blue text matching title
      fontStyle: 'bold',
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30, halign: 'right' }
    },
    head: [['DATE', 'DONATION', 'AMOUNT']],
    body: [
      [
        contribution.date,
        'This receipt acknowledges your generous donation to HOPE3 org. We would like to thank you with sincere gratitude. This letter will serve as your receipt for tax purposes and certify that you did not receive any goods or services in exchange for your donation.',
        amountStr
      ]
    ],
    theme: 'plain',
    styles: {
      fontSize: 9,
      textColor: [0, 0, 0],
      cellPadding: { top: 6, bottom: 6, left: 4, right: 4 }
    }
  });
  
  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  // Faint line above total spanning right half
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(100, finalY + 8, 195, finalY + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TOTAL', 140, finalY + 16);
  doc.text(amountStr, 195, finalY + 16, { align: 'right' });
  
  // Footer
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('HOPE3 Foundation (EIN: 83-4354101) is a 501(c)(3) tax exempt non-profit organization.', 105, 280, { align: 'center' });
  
  if (download) {
    doc.save(`Receipt_${contribution.id}.pdf`);
  }
  
  return doc;
};
