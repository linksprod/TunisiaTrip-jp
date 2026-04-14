import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EnhancedDayItinerary } from '@/components/travel/itinerary/enhancedTypes';

export class TripPDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
  }

  async generatePDF(itinerary: EnhancedDayItinerary[], title: string = "Mon Voyage en Tunisie"): Promise<Blob> {
    // Cover page
    this.addCoverPage(title, itinerary);
    
    // Overview page
    this.addOverviewPage(itinerary);
    
    // Day pages
    for (const day of itinerary) {
      this.addDayPage(day);
    }
    
    // Practical info page
    this.addPracticalInfoPage();
    
    return new Blob([this.pdf.output('blob')], { type: 'application/pdf' });
  }

  private addCoverPage(title: string, itinerary: EnhancedDayItinerary[]) {
    // Background gradient effect
    this.pdf.setFillColor(102, 126, 234);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Add overlay pattern
    this.pdf.setFillColor(118, 75, 162);
    this.pdf.setGState({ opacity: 0.7 });
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight / 2, 'F');
    this.pdf.setGState({ opacity: 1 });
    
    // Title
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(36);
    this.pdf.setTextColor(255, 255, 255);
    
    const titleLines = this.pdf.splitTextToSize(title, this.pageWidth - 2 * this.margin);
    const titleY = this.pageHeight / 2 - 40;
    this.pdf.text(titleLines, this.pageWidth / 2, titleY, { align: 'center' });
    
    // Subtitle
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(18);
    this.pdf.text('Votre itinéraire personnalisé', this.pageWidth / 2, titleY + 20, { align: 'center' });
    
    // Duration and destinations
    const totalDays = itinerary.length;
    const destinations = Array.from(new Set(
      itinerary.flatMap(day => day.schedule?.map(item => item.location) || [])
    )).filter(Boolean).slice(0, 3);
    
    this.pdf.setFontSize(14);
    this.pdf.text(`${totalDays} jours d'aventure`, this.pageWidth / 2, titleY + 40, { align: 'center' });
    
    if (destinations.length > 0) {
      this.pdf.text(`Destinations: ${destinations.join(' • ')}`, this.pageWidth / 2, titleY + 50, { align: 'center' });
    }
    
    // Date
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.pdf.setFontSize(12);
    this.pdf.text(currentDate, this.pageWidth / 2, this.pageHeight - 30, { align: 'center' });
    
    this.pdf.addPage();
  }

  private addOverviewPage(itinerary: EnhancedDayItinerary[]) {
    let y = this.margin + 20;
    
    // Title
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(24);
    this.pdf.setTextColor(102, 126, 234);
    this.pdf.text('Aperçu du voyage', this.margin, y);
    y += 20;
    
    // Summary stats
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0, 0, 0);
    
    const totalDays = itinerary.length;
    const totalActivities = itinerary.reduce((sum, day) => sum + (day.schedule?.length || 0), 0);
    const accommodations = itinerary.filter(day => day.accommodation).length;
    
    const stats = [
      `Durée totale: ${totalDays} jours`,
      `Activités prévues: ${totalActivities}`,
      `Hébergements: ${accommodations} nuits`,
      `Distance totale: ${itinerary.reduce((sum, day) => sum + (day.totalDistance || 0), 0).toFixed(0)} km`
    ];
    
    stats.forEach(stat => {
      this.pdf.text(stat, this.margin, y);
      y += 8;
    });
    
    y += 15;
    
    // Day by day overview
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(102, 126, 234);
    this.pdf.text('Programme jour par jour', this.margin, y);
    y += 15;
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0, 0, 0);
    
    itinerary.forEach(day => {
      if (y > this.pageHeight - 30) {
        this.pdf.addPage();
        y = this.margin;
      }
      
      // Day title
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`Jour ${day.day}: ${day.title}`, this.margin, y);
      y += 6;
      
      // Activities preview
      this.pdf.setFont('helvetica', 'normal');
      const mainActivities = day.schedule?.filter(item => item.type === 'activity').slice(0, 2) || [];
      mainActivities.forEach(activity => {
        this.pdf.text(`• ${activity.activity}`, this.margin + 5, y);
        y += 5;
      });
      
      // Accommodation
      if (day.accommodation) {
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.text(`Hébergement: ${day.accommodation.name}`, this.margin + 5, y);
        y += 5;
      }
      
      y += 5;
    });
    
    this.pdf.addPage();
  }

  private addDayPage(day: EnhancedDayItinerary) {
    let y = this.margin;
    
    // Day header
    this.pdf.setFillColor(102, 126, 234);
    this.pdf.rect(0, 0, this.pageWidth, 40, 'F');
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text(`Jour ${day.day}`, this.margin, 25);
    
    this.pdf.setFontSize(16);
    this.pdf.text(day.title, this.margin, 35);
    
    y = 50;
    
    // Description
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(80, 80, 80);
    
    const descriptionLines = this.pdf.splitTextToSize(day.description, this.pageWidth - 2 * this.margin);
    this.pdf.text(descriptionLines, this.margin, y);
    y += descriptionLines.length * 5 + 10;
    
    // Schedule
    if (day.schedule && day.schedule.length > 0) {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(14);
      this.pdf.setTextColor(102, 126, 234);
      this.pdf.text('Programme de la journée', this.margin, y);
      y += 10;
      
      day.schedule.forEach(item => {
        if (y > this.pageHeight - 40) {
          this.pdf.addPage();
          y = this.margin;
        }
        
        // Time badge background
        this.pdf.setFillColor(102, 126, 234);
        this.pdf.roundedRect(this.margin, y - 3, 20, 8, 2, 2, 'F');
        
        // Time
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(8);
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.text(item.time, this.margin + 10, y + 1, { align: 'center' });
        
        // Activity details
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(11);
        this.pdf.setTextColor(0, 0, 0);
        this.pdf.text(item.activity, this.margin + 25, y);
        
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(9);
        this.pdf.setTextColor(102, 126, 234);
        this.pdf.text(`📍 ${item.location}`, this.margin + 25, y + 5);
        
        if (item.duration) {
          this.pdf.setTextColor(120, 120, 120);
          this.pdf.text(`⏱️ ${item.duration}`, this.margin + 25, y + 9);
        }
        
        y += 15;
      });
    }
    
    y += 10;
    
    // Accommodation
    if (day.accommodation) {
      this.pdf.setFillColor(245, 247, 250);
      this.pdf.roundedRect(this.margin, y, this.pageWidth - 2 * this.margin, 25, 3, 3, 'F');
      
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(102, 126, 234);
      this.pdf.text('🏨 Hébergement', this.margin + 5, y + 7);
      
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(11);
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(day.accommodation.name, this.margin + 5, y + 14);
      
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(80, 80, 80);
      this.pdf.text(`📍 ${day.accommodation.location}`, this.margin + 5, y + 19);
      
      const typeText = day.accommodation.type === 'hotel' ? 'Hôtel' : 'Maison d\'hôtes';
      this.pdf.text(`🏨 ${typeText}`, this.margin + 80, y + 19);
      
      if (day.accommodation.breakfast) {
        this.pdf.text('🍳 Petit-déjeuner inclus', this.margin + 130, y + 19);
      }
      
      y += 30;
    }
    
    // Cultural tips
    if (day.culturalTips && day.culturalTips.length > 0) {
      this.pdf.setFillColor(255, 245, 245);
      const tipsHeight = day.culturalTips.length * 6 + 12;
      this.pdf.roundedRect(this.margin, y, this.pageWidth - 2 * this.margin, tipsHeight, 3, 3, 'F');
      
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(11);
      this.pdf.setTextColor(229, 62, 62);
      this.pdf.text('💡 Conseils culturels', this.margin + 5, y + 7);
      
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(80, 80, 80);
      
      let tipY = y + 13;
      day.culturalTips.forEach(tip => {
        const tipLines = this.pdf.splitTextToSize(`• ${tip}`, this.pageWidth - 2 * this.margin - 10);
        this.pdf.text(tipLines, this.margin + 5, tipY);
        tipY += tipLines.length * 4;
      });
    }
    
    this.pdf.addPage();
  }

  private addPracticalInfoPage() {
    let y = this.margin + 20;
    
    // Title
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(24);
    this.pdf.setTextColor(102, 126, 234);
    this.pdf.text('Informations pratiques', this.margin, y);
    y += 20;
    
    const practicalInfo = [
      {
        title: '📱 Numéros d\'urgence',
        content: [
          'Police: 197',
          'Urgences médicales: 190',
          'Pompiers: 198',
          'Tourisme: 1948'
        ]
      },
      {
        title: '💱 Informations monétaires',
        content: [
          'Monnaie: Dinar tunisien (TND)',
          'Cartes acceptées: Visa, Mastercard',
          'Change: Bureaux officiels et banques',
          'Pourboire: 10-15% au restaurant'
        ]
      },
      {
        title: '🌍 Conseils généraux',
        content: [
          'Respecter les traditions locales',
          'Prévoir des vêtements couvrants pour les sites religieux',
          'Négocier les prix dans les souks',
          'Goûter la cuisine locale avec modération les premiers jours'
        ]
      }
    ];
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0, 0, 0);
    
    practicalInfo.forEach(section => {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(102, 126, 234);
      this.pdf.text(section.title, this.margin, y);
      y += 8;
      
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(0, 0, 0);
      
      section.content.forEach(item => {
        this.pdf.text(`• ${item}`, this.margin + 5, y);
        y += 6;
      });
      
      y += 10;
    });
    
    // Footer
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(150, 150, 150);
    this.pdf.text(
      'Ce document a été généré automatiquement. Bon voyage !',
      this.pageWidth / 2,
      this.pageHeight - 10,
      { align: 'center' }
    );
  }
}