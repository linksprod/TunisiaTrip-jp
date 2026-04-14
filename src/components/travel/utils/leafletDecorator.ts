
// Simplified polyline decorator implementation for react-leaflet 4.x compatibility
import L from 'leaflet';

export interface DecoratorPattern {
  offset: string;
  repeat: string;
  symbol: {
    pixelSize: number;
    polygon: boolean;
    pathOptions: {
      stroke: boolean;
      weight: number;
      color: string;
      fillOpacity: number;
      fillColor: string;
    };
  };
}

export class PolylineDecorator extends L.LayerGroup {
  private polyline: L.Polyline;
  private patterns: DecoratorPattern[];
  private arrows: L.Polygon[] = [];

  constructor(polyline: L.Polyline, options: { patterns: DecoratorPattern[] }) {
    super();
    this.polyline = polyline;
    this.patterns = options.patterns;
    this.createArrows();
  }

  private createArrows() {
    this.clearLayers();
    this.arrows = [];

    const latlngs = this.polyline.getLatLngs() as L.LatLng[];
    if (latlngs.length < 2) return;

    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < latlngs.length - 1; i++) {
      totalDistance += latlngs[i].distanceTo(latlngs[i + 1]);
    }

    this.patterns.forEach(pattern => {
      const repeatDistance = parseFloat(pattern.repeat.replace('px', '')) * 111; // Rough conversion
      const offsetDistance = (parseFloat(pattern.offset.replace('%', '')) / 100) * totalDistance;
      
      let currentDistance = offsetDistance;
      
      while (currentDistance < totalDistance) {
        const point = this.getPointAtDistance(latlngs, currentDistance);
        if (point) {
          const arrow = this.createArrowMarker(point.latlng, point.bearing);
          this.addLayer(arrow);
          this.arrows.push(arrow);
        }
        currentDistance += repeatDistance;
      }
    });
  }

  private getPointAtDistance(latlngs: L.LatLng[], targetDistance: number) {
    let currentDistance = 0;
    
    for (let i = 0; i < latlngs.length - 1; i++) {
      const segmentDistance = latlngs[i].distanceTo(latlngs[i + 1]);
      
      if (currentDistance + segmentDistance >= targetDistance) {
        const ratio = (targetDistance - currentDistance) / segmentDistance;
        const lat = latlngs[i].lat + (latlngs[i + 1].lat - latlngs[i].lat) * ratio;
        const lng = latlngs[i].lng + (latlngs[i + 1].lng - latlngs[i].lng) * ratio;
        
        const bearing = this.getBearing(latlngs[i], latlngs[i + 1]);
        
        return {
          latlng: new L.LatLng(lat, lng),
          bearing: bearing
        };
      }
      
      currentDistance += segmentDistance;
    }
    
    return null;
  }

  private getBearing(latlng1: L.LatLng, latlng2: L.LatLng): number {
    const lat1 = latlng1.lat * Math.PI / 180;
    const lat2 = latlng2.lat * Math.PI / 180;
    const deltaLng = (latlng2.lng - latlng1.lng) * Math.PI / 180;
    
    const x = Math.sin(deltaLng) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    
    return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360;
  }

  private createArrowMarker(latlng: L.LatLng, bearing: number): L.Polygon {
    const size = 0.001; // Arrow size in degrees
    const arrowPoints: L.LatLngExpression[] = [
      [latlng.lat + size, latlng.lng],
      [latlng.lat - size, latlng.lng - size],
      [latlng.lat - size, latlng.lng + size]
    ];
    
    return L.polygon(arrowPoints, {
      color: '#347EFF',
      weight: 2,
      fillColor: '#347EFF',
      fillOpacity: 1,
      stroke: true
    });
  }

  setPatterns(patterns: DecoratorPattern[]) {
    this.patterns = patterns;
    this.createArrows();
  }
}

export const polylineDecorator = (polyline: L.Polyline, options: { patterns: DecoratorPattern[] }) => {
  return new PolylineDecorator(polyline, options);
};
