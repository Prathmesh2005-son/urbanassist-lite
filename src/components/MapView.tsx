import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, Search, Navigation2, Clock, Map as MapIcon } from 'lucide-react';
import { fetchNearbyPlaces, fetchRoute } from '../lib/api';
import { Place, RouteData } from '../lib/utils';

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const UserIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const PlaceIcon = (type: string) => L.divIcon({
  className: 'place-marker',
  html: `<div class="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border-2 ${
    type === 'hospital' ? 'border-red-500 text-red-500' : 
    type === 'police' ? 'border-blue-600 text-blue-600' :
    type === 'fire_station' ? 'border-orange-500 text-orange-500' :
    'border-emerald-500 text-emerald-500'
  }">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      ${type === 'hospital' ? '<path d="M12 6v12M6 12h12"/>' : 
        type === 'police' ? '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' :
        '<circle cx="12" cy="12" r="10"/>'}
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapView() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState('hospital');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => {
        console.error(err);
        // Fallback to a default city center if geolocation fails (e.g., London)
        setUserPos([51.505, -0.09]);
      }
    );
  }, []);

  const searchNearby = async () => {
    if (!userPos) return;
    setLoading(true);
    setRoute(null);
    setSelectedPlace(null);
    try {
      const results = await fetchNearbyPlaces(userPos[0], userPos[1], selectedType);
      setPlaces(results);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch nearby places.');
    } finally {
      setLoading(false);
    }
  };

  const showRoute = async (place: Place) => {
    if (!userPos) return;
    setLoading(true);
    setSelectedPlace(place);
    try {
      const routeData = await fetchRoute(userPos, [place.lat, place.lon]);
      setRoute(routeData);
    } catch (error) {
      console.error(error);
      alert('Could not calculate route.');
    } finally {
      setLoading(false);
    }
  };

  if (!userPos) return (
    <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-medium">Locating you...</p>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-80 space-y-4 shrink-0">
        <div className="glass-card p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
            >
              <option value="hospital">Hospitals</option>
              <option value="police">Police Stations</option>
              <option value="fire_station">Fire Stations</option>
              <option value="pharmacy">Pharmacies</option>
            </select>
          </div>
          <button
            onClick={searchNearby}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50"
          >
            <Search size={18} />
            {loading ? 'Searching...' : 'Find Nearby'}
          </button>
        </div>

        {selectedPlace && route && (
          <div className="glass-card p-4 space-y-3 animate-in slide-in-from-left duration-300">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">{selectedPlace.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedPlace.address || 'Address not available'}</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Navigation2 size={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                  <MapIcon size={10} /> Distance
                </div>
                <div className="text-sm font-bold text-slate-700">
                  {(route.distance / 1000).toFixed(1)} km
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                  <Clock size={10} /> Est. Time
                </div>
                <div className="text-sm font-bold text-slate-700">
                  {Math.round(route.duration / 60)} min
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="hidden md:block glass-card p-4 overflow-y-auto max-h-[300px]">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Results ({places.length})</h4>
          <div className="space-y-2">
            {places.map(place => (
              <button
                key={place.id}
                onClick={() => showRoute(place)}
                className={`w-full text-left p-2 rounded-lg transition-all text-sm border ${
                  selectedPlace?.id === place.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="font-semibold text-slate-800 truncate">{place.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{place.address || 'Nearby'}</div>
              </button>
            ))}
            {places.length === 0 && !loading && (
              <p className="text-xs text-slate-400 italic text-center py-4">No results found nearby.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 glass-card overflow-hidden relative min-h-[400px]">
        <MapContainer center={userPos} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={userPos} />
          
          <Marker position={userPos} icon={UserIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {places.map((place) => (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lon]} 
              icon={PlaceIcon(selectedType)}
              eventHandlers={{
                click: () => showRoute(place)
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-slate-900">{place.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{place.address}</p>
                  <button 
                    onClick={() => showRoute(place)}
                    className="w-full py-1 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-wider"
                  >
                    Get Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {route && (
            <Polyline 
              positions={route.coordinates} 
              color="#3b82f6" 
              weight={5} 
              opacity={0.7} 
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
