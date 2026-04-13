import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MapPin, Navigation, Heart, User, Plus, Search, 
  Loader2, RefreshCw, X, Check, Star, ChevronRight 
} from 'lucide-react';

// FIX per le icone di Leaflet (senza questo non vedresti i puntini sulla mappa)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Database temporaneo (Sostituiremo con API Ministero nel prossimo step)
const REAL_STATIONS = [
  { id: 1, brand: 'Eni', address: 'Via Roma, Milano', lat: 45.4642, lng: 9.1900, prices: { Benzina: 1.789, Diesel: 1.650 } },
  { id: 2, brand: 'Q8', address: 'Corso Buenos Aires, Milano', lat: 45.4770, lng: 9.2100, prices: { Benzina: 1.755, Diesel: 1.690 } },
];

export default function App() {
  const [view, setView] = useState('home');
  const [userLocation, setUserLocation] = useState([45.4642, 9.1900]); // Default Milano
  const [selectedFuel, setSelectedFuel] = useState('Benzina');
  const [loading, setLoading] = useState(false);

  // Chiedi il GPS reale all'avvio
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col font-sans overflow-hidden text-slate-900">
      
      {/* HEADER */}
      <header className="px-6 pt-12 pb-4 bg-white border-b border-gray-100 z-[1000]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-black tracking-tighter">
            {view === 'map' ? 'Mappa Real-Time' : 'Benzina GO'}
          </h1>
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
            <User size={24} onClick={() => setView('profile')} />
          </div>
        </div>
        
        {view === 'home' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['Benzina', 'Diesel', 'GPL'].map(f => (
              <button 
                key={f} 
                onClick={() => setSelectedFuel(f)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${selectedFuel === f ? 'bg-black text-white' : 'bg-gray-50 text-gray-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* CONTENUTO DINAMICO */}
      <main className="flex-1 relative overflow-hidden">
        {view === 'home' && (
          <div className="p-6 space-y-4 overflow-y-auto h-full pb-32">
            {REAL_STATIONS.map(s => (
              <div key={s.id} className="p-6 border border-gray-100 rounded-[2rem] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black">{s.brand}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase">{s.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black tracking-tighter text-blue-600">€{s.prices[selectedFuel]}</p>
                    <p className="text-[10px] font-bold text-gray-300">SELF SERVICE</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'map' && (
          <div className="h-full w-full z-10">
            <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {REAL_STATIONS.map(s => (
                <Marker key={s.id} position={[s.lat, s.lng]}>
                  <Popup>
                    <div className="font-bold">
                      {s.brand} <br /> 
                      <span className="text-blue-600">{selectedFuel}: €{s.prices[selectedFuel]}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {view === 'profile' && (
          <div className="p-10 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-black">Il tuo Account</h2>
            <p className="text-gray-400">Dati sincronizzati con il database</p>
          </div>
        )}
      </main>

      {/* NAVBAR */}
      <nav className="fixed bottom-0 w-full px-8 pb-10 pt-4 bg-white/80 backdrop-blur-lg border-t border-gray-50 flex justify-between items-center z-[2000]">
        <button onClick={() => setView('home')} className={view === 'home' ? 'text-blue-600' : 'text-gray-300'}>
          <Search size={28} />
        </button>
        <button onClick={() => setView('map')} className={view === 'map' ? 'text-blue-600' : 'text-gray-300'}>
          <MapPin size={28} />
        </button>
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl -translate-y-6">
          <Plus size={32} />
        </div>
        <button className="text-gray-300">
          <Navigation size={28} />
        </button>
        <button onClick={() => setView('profile')} className={view === 'profile' ? 'text-blue-600' : 'text-gray-300'}>
          <User size={28} />
        </button>
      </nav>
    </div>
  );
}
