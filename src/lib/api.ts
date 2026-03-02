import { Place, RouteData } from './utils';

export async function fetchNearbyPlaces(lat: number, lon: number, type: string): Promise<Place[]> {
  const radius = 5000; // 5km
  const query = `
    [out:json];
    (
      node["amenity"="${type}"](around:${radius},${lat},${lon});
      way["amenity"="${type}"](around:${radius},${lat},${lon});
      relation["amenity"="${type}"](around:${radius},${lat},${lon});
    );
    out center;
  `;
  
  const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
  const data = await response.json();
  
  return data.elements.map((el: any) => ({
    id: el.id,
    lat: el.lat || el.center.lat,
    lon: el.lon || el.center.lon,
    name: el.tags.name || `Unnamed ${type}`,
    type: type,
    address: el.tags['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}` : undefined
  }));
}

export async function fetchRoute(start: [number, number], end: [number, number]): Promise<RouteData> {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
  );
  const data = await response.json();
  
  if (data.code !== 'Ok') throw new Error('Route not found');
  
  const route = data.routes[0];
  return {
    coordinates: route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]),
    distance: route.distance,
    duration: route.duration
  };
}
