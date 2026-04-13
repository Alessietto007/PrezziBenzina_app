import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  List, 
  Navigation, 
  Heart, 
  User, 
  Plus, 
  Search, 
  Settings2, 
  Droplet,
  Zap,
  Flame,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';

// --- CONFIGURAZIONE TIPI CARBURANTE ---
const FUEL_TYPES = [
  { id: 'Benzina', icon: Droplet, color: 'text-green-500' },
  { id: 'Diesel', icon: Droplet, color: 'text-orange-500' },
  { id: 'GPL', icon: Flame, color: 'text-blue-400' },
  { id: 'Metano', icon: Flame, color: 'text-purple-400' },
  { id: 'Elettrico', icon: Zap, color: 'text-yellow-400' },
];

// --- COMPONENTE LOGO BRAND ---
const BrandLogo = ({ brand }) => {
  const brands = {
    'Eni': 'bg-yellow-400 text-black',
    'Q8': 'bg-blue-700 text-white',
    'IP': 'bg-blue-500 text-yellow-300',
    'Esso': 'bg-red-600 text-white',
    'Tamoil': 'bg-white text-blue-600 border border-blue-600',
  };
  const style = brands[brand] || 'bg-gray-800 text-white';
  return (
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${style}`}>
      {brand.substring(0, 2).toUpperCase()}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedFuel, setSelectedFuel] = useState('Benzina');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  // Simulazione caricamento dati reali
  const fetchGasData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = [
        { id: 1, brand: 'Eni', address: 'Via Roma 10, Milano', price: 1.789 },
        { id: 2, brand: 'Q8', address: 'Corso Buenos Aires, Milano', price: 1.755 },
        { id: 3, brand: 'IP', address: 'Viale Abruzzi 22, Milano', price: 1.810 },
        { id: 4, brand: 'Tamoil', address: 'Viale Monza 5, Milano', price: 1.749 },
      ];
      setStations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => fetchGasData(),
        () => {
          setLocationError("Attiva il GPS per i prezzi vicini");
          fetchGasData();
        }
      );
    }
  }, [fetchGasData]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-0 sm:p-4 font-sans selection:bg-black selection:text-white">
      <div className="w-full max-w-[430px] h-screen sm:h-[850px] bg-white sm:rounded-[3.5rem] shadow-2xl overflow-hidden relative border-black flex flex-col border-[0px] sm:border-[10px]">
        
        {/* Notch Area */}
        <div className="h-10 w-full flex justify-center items-end pb-1 z-50 bg-white sticky top-0">
          <div className="w-32 h-6 bg-black rounded-full hidden sm:block"></div>
        </div>

        {/* Header */}
        <header className="px-6 pt-2 pb-4 bg-white/80 backdrop-blur-xl z-40 sticky top-10 border-b border-gray-100/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Live Feed</p>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                Benzina <span className="text-blue-600 italic">GO</span>
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-black">
              <User size={22} />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {FUEL_TYPES.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFuel(f.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border
                  ${selectedFuel === f.id ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-500'}`}
              >
                <f.icon size={14} className={selectedFuel === f.id ? f.color : ''} />
                {f.id}
              </button>
            ))}
          </div>
        </header>

        {/* Search & Switch */}
        <div className="px-6 py-4 flex items-center gap-3 bg-white">
          <div className="flex-1 h-12 bg-gray-100 rounded-2xl flex items-center px-4">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Cerca città..." className="bg-transparent border-none outline-none w-full ml-3 text-sm font-medium" />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button onClick={() => setActiveTab('list')} className={`p-2.5 rounded-xl ${activeTab === 'list' ? 'bg-white shadow-sm' : 'text-gray-400'}`}><List size={20} /></button>
            <button onClick={() => setActiveTab('map')} className={`p-2.5 rounded-xl ${activeTab === 'map' ? 'bg-white shadow-sm' : 'text-gray-400'}`}><MapPin size={20} /></button>
          </div>
        </div>

        {/* Main Feed */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 px-6 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-xs font-bold tracking-widest uppercase">Caricamento...</p>
            </div>
          ) : activeTab === 'list' ? (
            <div className="py-4 flex flex-col gap-4">
              {stations.map((s, i) => (
                <div key={s.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <BrandLogo brand={s.brand} />
                      <div>
                        <h4 className="font-black text-lg">{s.brand}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{s.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tighter">
                        {s.price.toFixed(3).split('.')[0]}<span className="text-2xl">.{s.price.toFixed(3).split('.')[1]}</span>
                      </span>
                      <span className="text-xs font-bold text-gray-400">EUR/L</span>
                    </div>
                    <button className="bg-blue-600 text-white p-4 rounded-3xl shadow-lg shadow-blue-200">
                      <Navigation size={24} fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 italic">Mappa in arrivo...</div>
          )}
        </main>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 w-full px-6 pb-10 pt-4 bg-white/90 backdrop-blur-2xl border-t border-gray-100 flex justify-between items-center">
          <button className="text-blue-600 flex flex-col items-center gap-1"><Search size={22} /><span className="text-[9px] font-black uppercase">Cerca</span></button>
          <button className="text-gray-300 flex flex-col items-center gap-1"><Heart size={22} /><span className="text-[9px] font-black uppercase">Favoriti</span></button>
          <button className="w-16 h-16 bg-black text-white rounded-3xl flex items-center justify-center shadow-2xl -translate-y-6"><Plus size={32} /></button>
          <button className="text-gray-300 flex flex-col items-center gap-1"><RefreshCw size={22} /><span className="text-[9px] font-black uppercase">Prezzi</span></button>
          <button className="text-gray-300 flex flex-col items-center gap-1"><Settings2 size={22} /><span className="text-[9px] font-black uppercase">Menu</span></button>
        </div>
      </div>
    </div>
  );
}
