
import L from 'leaflet';

// Simple fullscreen control for Leaflet
export class FullscreenControl extends L.Control {
  private map?: L.Map;
  private isFullscreen = false;

  constructor(options?: L.ControlOptions) {
    super(options);
  }

  onAdd(map: L.Map): HTMLElement {
    this.map = map;
    
    const container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar');
    const button = L.DomUtil.create('a', '', container);
    
    button.innerHTML = '⛶';
    button.href = '#';
    button.title = 'Fullscreen';
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', 'Toggle fullscreen');
    
    L.DomEvent.on(button, 'click', this.toggleFullscreen, this);
    L.DomEvent.disableClickPropagation(container);
    
    return container;
  }

  private toggleFullscreen = (e: Event) => {
    e.preventDefault();
    
    if (!this.map) return;
    
    const mapContainer = this.map.getContainer();
    
    if (!this.isFullscreen) {
      // Enter fullscreen
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      } else if ((mapContainer as any).webkitRequestFullscreen) {
        (mapContainer as any).webkitRequestFullscreen();
      } else if ((mapContainer as any).msRequestFullscreen) {
        (mapContainer as any).msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      this.isFullscreen = false;
    }
    
    // Invalidate map size after fullscreen change
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  };
}

// Add to L.Control namespace
declare module 'leaflet' {
  namespace Control {
    class Fullscreen extends L.Control {
      constructor(options?: L.ControlOptions);
    }
  }
  
  interface ControlStatic {
    Fullscreen: typeof Control.Fullscreen;
  }
}

L.Control.Fullscreen = FullscreenControl;
