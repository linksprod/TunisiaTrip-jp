
import L from 'leaflet';
import { City } from '../types/city';
import { polylineDecorator } from './leafletDecorator';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const createCustomMarker = (city: City, isSelected: boolean = false): L.DivIcon => {
  const size = isSelected ? 32 : 24;
  const imageSize = isSelected ? 24 : 16;
  const imageUrl = city.image || '';
  
  // Different colors and icons based on type
  let backgroundColor = '#347EFF'; // Default blue for activities
  let icon = '🎯'; // Default icon for activities
  
  if (city.type === 'hotel') {
    backgroundColor = '#22C55E'; // Green for hotels
    icon = '🏨';
  } else if (city.type === 'guesthouse') {
    backgroundColor = '#F59E0B'; // Orange for guest houses
    icon = '🏠';
  }
  
  const iconHtml = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${backgroundColor};
      border: ${isSelected ? 3 : 2}px solid #FFFFFF;
      border-radius: 50%;
      opacity: 0.9;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      ${isSelected ? 'animation: bounce 1.5s ease-in-out;' : ''}
    ">
      ${imageUrl ? `
        <img src="${imageUrl}" style="
          width: ${imageSize}px;
          height: ${imageSize}px;
          border-radius: 50%;
          object-fit: cover;
        " alt="${city.name}" />
        <div style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background-color: ${backgroundColor};
          border: 1px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
        ">${icon}</div>
      ` : `
        <div style="
          width: ${imageSize}px;
          height: ${imageSize}px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${imageSize > 16 ? '16px' : '14px'};
        ">${icon}</div>
      `}
    </div>
    <style>
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
    </style>
  `;

  return new L.DivIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export const createPopup = (city: City, isSelected: boolean = false): string => {
  const imageUrl = city.image || '';
  
  // Different styling based on type
  let typeColor = '#347EFF';
  let typeLabel = 'Activity';
  let typeIcon = '🎯';
  
  if (city.type === 'hotel') {
    typeColor = '#22C55E';
    typeLabel = 'Hotel';
    typeIcon = '🏨';
  } else if (city.type === 'guesthouse') {
    typeColor = '#F59E0B';
    typeLabel = 'Guest House';
    typeIcon = '🏠';
  }
  
  const selectedBadge = isSelected ? `
    <div style="
      position: absolute;
      top: 6px;
      left: 6px;
      background-color: #dc2626;
      color: white;
      padding: 2px 6px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: bold;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    ">✓ SELECTED</div>
  ` : '';

  return `
    <div style="font-family: Inter, sans-serif; min-width: 180px; max-width: 220px;">
      ${imageUrl ? `
        <div style="margin-bottom: 8px; position: relative;">
          <img src="${imageUrl}" style="
            width: 100%;
            height: 100px;
            object-fit: cover;
            border-radius: 6px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            ${isSelected ? 'border: 2px solid #dc2626;' : ''}
          " alt="${city.name}" />
          ${selectedBadge}
          <div style="
            position: absolute;
            top: 6px;
            right: 6px;
            background-color: ${typeColor};
            color: white;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          ">${typeIcon} ${typeLabel}</div>
        </div>
      ` : `
        <div style="
          background-color: ${typeColor};
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: bold;
          margin-bottom: 8px;
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 3px;
        ">${typeIcon} ${typeLabel}</div>
        ${selectedBadge}
      `}
      
      <div style="padding: 0 2px;">
        <div style="
          font-weight: bold; 
          font-size: 14px; 
          margin-bottom: 4px;
          color: #1f2937;
          line-height: 1.2;
        ">${city.name}</div>
        
        <div style="
          font-size: 11px; 
          color: #6b7280; 
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 3px;
        ">📍 ${city.region}</div>
        
        ${city.price ? `
          <div style="
            font-size: 12px; 
            color: ${typeColor}; 
            font-weight: bold; 
            margin-bottom: 6px;
            background-color: ${typeColor}10;
            padding: 3px 6px;
            border-radius: 4px;
            display: inline-block;
          ">💰 ${city.price}/night</div>
        ` : ''}
        
        ${city.rating ? `
          <div style="
            font-size: 11px; 
            color: #f59e0b; 
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 3px;
          ">
            ${'⭐'.repeat(Math.floor(city.rating))} <span style="color: #6b7280;">(${city.rating}/5)</span>
          </div>
        ` : ''}
        
        ${city.description ? `
          <div style="
            font-size: 11px; 
            color: #4b5563; 
            line-height: 1.3;
            background-color: #f9fafb;
            padding: 6px;
            border-radius: 4px;
            border-left: 2px solid ${typeColor};
          ">${city.description.substring(0, 100)}${city.description.length > 100 ? '...' : ''}</div>
        ` : ''}
      </div>
    </div>
  `;
};

export const updateMarkerStyle = (marker: L.Marker, city: City, isSelected: boolean) => {
  const customIcon = createCustomMarker(city, isSelected);
  marker.setIcon(customIcon);
  
  if (isSelected) {
    marker.setZIndexOffset(1000);
  } else {
    marker.setZIndexOffset(0);
  }
};

export const navigateToCity = (map: L.Map, city: City, zoom: number = 10) => {
  console.log(`Navigating to ${city.name} with zoom level ${zoom}`);
  
  const currentZoom = map.getZoom();
  
  if (currentZoom > 7) {
    map.setZoom(7);
    
    setTimeout(() => {
      map.panTo([city.position.lat, city.position.lng]);
      
      setTimeout(() => {
        map.setZoom(zoom);
      }, 500);
    }, 300);
  } else {
    map.panTo([city.position.lat, city.position.lng]);
    
    setTimeout(() => {
      map.setZoom(zoom);
    }, 500);
  }
};

export const findMarkerByCity = (markers: L.Marker[], cityId: string): L.Marker | null => {
  for (const marker of markers) {
    const markerData = (marker as any).cityData;
    if (markerData && markerData.id === cityId) {
      return marker;
    }
  }
  return null;
};

export const animateMarker = (marker: L.Marker | null, city?: City) => {
  if (!marker || !city) return;
  
  const customIcon = createCustomMarker(city, true);
  marker.setIcon(customIcon);
  
  setTimeout(() => {
    const normalIcon = createCustomMarker(city, false);
    marker.setIcon(normalIcon);
  }, 1500);
};

export const createAnimatedPolyline = (coordinates: L.LatLngExpression[], map: L.Map): L.Polyline => {
  const polyline = L.polyline(coordinates, {
    color: '#347EFF',
    weight: 4,
    opacity: 1,
  });
  
  // Add polyline to map
  polyline.addTo(map);
  
  // Create arrows using our custom decorator (simplified for compatibility)
  if (coordinates.length > 1) {
    const arrowDecorator = polylineDecorator(polyline, {
      patterns: [
        {
          offset: '0%',
          repeat: '150px',
          symbol: {
            pixelSize: 12,
            polygon: false,
            pathOptions: {
              stroke: true,
              weight: 2,
              color: '#347EFF',
              fillOpacity: 1,
              fillColor: '#347EFF'
            }
          }
        }
      ]
    });
    
    arrowDecorator.addTo(map);
    
    // Store reference to decorator for cleanup
    (polyline as any).decorator = arrowDecorator;
  }
  
  return polyline;
};

export const createMapLegend = (
  atlantisRouteText: string = "Atlantis Route",
  tourRouteText: string = "Tour Route",
  featuredCityText: string = "Featured City"
): L.Control => {
  const legend = new L.Control({ position: 'bottomleft' });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <div style="
        background-color: white; 
        border-radius: 4px; 
        padding: 10px; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.3); 
        font-family: Inter, sans-serif;
        font-size: 12px;
      ">
        <div style="font-weight: bold; margin-bottom: 8px;">${atlantisRouteText}</div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="width: 20px; height: 3px; background-color: #347EFF; margin-right: 8px;"></div>
          <span>${tourRouteText}</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #347EFF; margin-right: 8px;"></div>
          <span>${featuredCityText}</span>
        </div>
      </div>
    `;
    return div;
  };
  
  return legend;
};
