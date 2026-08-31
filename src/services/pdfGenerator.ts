import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Contribution, Donor } from '../mockData';

export const generateContributionReceipt = (contribution: Contribution, donor: Donor, download = false) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(32, 0, 44); // #20002c
  doc.text('Hope3 Foundation', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text('Donation Receipt', 105, 30, { align: 'center' });
  
  // Receipt Details
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Receipt ID: ${contribution.id}`, 20, 50);
  doc.text(`Date: ${contribution.date}`, 20, 60);
  
  // Donor Details
  doc.setFontSize(14);
  doc.text('Donor Information', 20, 80);
  doc.setFontSize(12);
  doc.text(`Name: ${donor.name}`, 20, 90);
  doc.text(`Email: ${donor.email}`, 20, 100);
  if (donor.phone) doc.text(`Phone: ${donor.phone}`, 20, 110);
  
  // Contribution Details
  autoTable(doc, {
    startY: 130,
    headStyles: { fillColor: [203, 180, 212] }, // #cbb4d4
    head: [['Description', 'Payment Method', 'Amount']],
    body: [
      ['Charitable Donation', contribution.paymentMethod, `INR ${contribution.amount.toLocaleString('en-IN')}`]
    ],
  });
  
  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 160;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Thank you for your generous contribution!', 105, finalY + 20, { align: 'center' });
  doc.text('Hope3 Foundation | info@hope3.org | www.hope3.org', 105, finalY + 30, { align: 'center' });
  
  if (download) {
    doc.save(`Receipt_${contribution.id}.pdf`);
  }
  
  return doc;
};
