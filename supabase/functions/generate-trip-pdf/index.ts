import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itinerary, title = "Mon Voyage en Tunisie" } = await req.json();
    
    if (!itinerary || !Array.isArray(itinerary)) {
      throw new Error('Itinerary data is required');
    }

    console.log('Generating PDF for itinerary:', { title, days: itinerary.length });

    // Create HTML content for the PDF
    const htmlContent = generateHTMLPresentation(itinerary, title);
    
    // Convert HTML to PDF using Puppeteer
    const pdfBuffer = await generatePDFFromHTML(htmlContent);
    
    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateHTMLPresentation(itinerary: any[], title: string): string {
  const totalDays = itinerary.length;
  const destinations = Array.from(new Set(itinerary.flatMap(day => 
    day.schedule?.map((item: any) => item.location) || []
  ))).filter(Boolean).slice(0, 3);

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
          page-break-after: always;
          position: relative;
          overflow: hidden;
        }
        
        .page:last-child {
          page-break-after: avoid;
        }
        
        /* Cover Page */
        .cover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 60px;
        }
        
        .cover h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .cover .subtitle {
          font-size: 24px;
          font-weight: 300;
          margin-bottom: 40px;
          opacity: 0.9;
        }
        
        .cover .destinations {
          font-size: 18px;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        
        .cover .duration {
          font-size: 20px;
          font-weight: 500;
          background: rgba(255,255,255,0.2);
          padding: 15px 30px;
          border-radius: 25px;
          backdrop-filter: blur(10px);
        }
        
        /* Day Page */
        .day-page {
          padding: 40px;
        }
        
        .day-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #667eea;
        }
        
        .day-number {
          font-size: 14px;
          color: #667eea;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        
        .day-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        
        .day-description {
          font-size: 16px;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .schedule-grid {
          display: grid;
          gap: 20px;
          margin-top: 30px;
        }
        
        .schedule-item {
          display: flex;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 15px;
          border-left: 4px solid #667eea;
          transition: all 0.3s ease;
        }
        
        .schedule-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .time-badge {
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          margin-right: 20px;
          min-width: 80px;
          text-align: center;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-name {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 5px;
        }
        
        .activity-location {
          font-size: 14px;
          color: #667eea;
          margin-bottom: 5px;
        }
        
        .activity-duration {
          font-size: 12px;
          color: #888;
        }
        
        .type-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-left: 15px;
        }
        
        .type-breakfast { background: #fff3cd; color: #856404; }
        .type-activity { background: #d4edda; color: #155724; }
        .type-lunch { background: #fce4ec; color: #c2185b; }
        .type-dinner { background: #e3f2fd; color: #1976d2; }
        .type-departure { background: #f3e5f5; color: #7b1fa2; }
        .type-arrival { background: #e8f5e8; color: #2e7d32; }
        
        .accommodation-section {
          margin-top: 40px;
          padding: 25px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 20px;
        }
        
        .accommodation-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        
        .accommodation-title::before {
          content: "🏨";
          margin-right: 10px;
        }
        
        .accommodation-name {
          font-size: 18px;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 8px;
        }
        
        .accommodation-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #555;
        }
        
        .detail-icon {
          margin-right: 8px;
        }
        
        .cultural-tips {
          margin-top: 30px;
          padding: 20px;
          background: #fff5f5;
          border-radius: 15px;
          border-left: 4px solid #e53e3e;
        }
        
        .cultural-tips h3 {
          font-size: 16px;
          font-weight: 600;
          color: #e53e3e;
          margin-bottom: 10px;
        }
        
        .tip {
          font-size: 14px;
          color: #555;
          margin-bottom: 8px;
          padding-left: 15px;
          position: relative;
        }
        
        .tip::before {
          content: "💡";
          position: absolute;
          left: 0;
        }
        
        @media print {
          body { 
            background: white;
            -webkit-print-color-adjust: exact;
          }
          .page {
            margin: 0;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <!-- Cover Page -->
      <div class="page cover">
        <h1>${title}</h1>
        <div class="subtitle">Votre itinéraire personnalisé</div>
        <div class="destinations">
          <strong>Destinations:</strong> ${destinations.join(' • ')}
        </div>
        <div class="duration">${totalDays} jours d'aventure</div>
      </div>
      
      ${itinerary.map((day, index) => `
        <!-- Day ${day.day} Page -->
        <div class="page day-page">
          <div class="day-header">
            <div class="day-number">Jour ${day.day}</div>
            <div class="day-title">${day.title}</div>
            <div class="day-description">${day.description}</div>
          </div>
          
          <div class="schedule-grid">
            ${day.schedule?.map((item: any) => `
              <div class="schedule-item">
                <div class="time-badge">${item.time}</div>
                <div class="activity-content">
                  <div class="activity-name">${item.activity}</div>
                  <div class="activity-location">📍 ${item.location}</div>
                  ${item.duration ? `<div class="activity-duration">⏱️ ${item.duration}</div>` : ''}
                </div>
                <div class="type-badge type-${item.type}">${getTypeLabel(item.type)}</div>
              </div>
            `).join('') || ''}
          </div>
          
          ${day.accommodation ? `
            <div class="accommodation-section">
              <div class="accommodation-title">Hébergement</div>
              <div class="accommodation-name">${day.accommodation.name}</div>
              <div class="accommodation-details">
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  ${day.accommodation.location}
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🏨</span>
                  ${day.accommodation.type === 'hotel' ? 'Hôtel' : 'Maison d\'hôtes'}
                </div>
                ${day.accommodation.breakfast ? `
                  <div class="detail-item">
                    <span class="detail-icon">🍳</span>
                    Petit-déjeuner inclus
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}
          
          ${day.culturalTips && day.culturalTips.length > 0 ? `
            <div class="cultural-tips">
              <h3>Conseils culturels</h3>
              ${day.culturalTips.map((tip: string) => `<div class="tip">${tip}</div>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'breakfast': 'Petit-déjeuner',
    'activity': 'Activité',
    'lunch': 'Déjeuner',
    'dinner': 'Dîner',
    'departure': 'Départ',
    'arrival': 'Arrivée',
    'free-time': 'Temps libre'
  };
  return labels[type] || type;
}

async function generatePDFFromHTML(html: string): Promise<Uint8Array> {
  // Import Puppeteer for server-side PDF generation
  const puppeteer = await import("https://deno.land/x/puppeteer@16.2.0/mod.ts");
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    return new Uint8Array(pdfBuffer);
  } finally {
    await browser.close();
  }
}