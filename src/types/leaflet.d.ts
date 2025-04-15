
// Add TypeScript definitions for the global Leaflet object
interface Window {
  L: {
    map: (element: string | HTMLElement, options?: any) => any;
    tileLayer: (url: string, options?: any) => any;
    marker: (latLng: [number, number], options?: any) => any;
    icon: (options: any) => any;
    layerGroup: (layers?: any[]) => any;
    control: {
      layers: (baseLayers?: any, overlays?: any, options?: any) => any;
    };
  };
}
