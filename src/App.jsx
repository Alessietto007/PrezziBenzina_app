import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, List, Navigation, Heart, User, Plus, Search, 
  Settings2, Droplet, Zap, Flame, Loader2, RefreshCw, X, Check,
  ChevronRight, Star
} from 'lucide-react';

// Database simulato di stazioni reali
const INITIAL_STATIONS = [
  { id: 1, brand: 'Eni', address: 'Via Roma 10, Milano', prices: { Benzina: 1.789, Diesel: 1.650, GPL: 0.720 }, dist: 0.5, rating: 4.5 },
  { id: 2, brand: 'Q8', address: 'Corso Buenos Aires, Milano', prices: { Benzina: 1.755, Diesel: 1.690, GPL: 0.710 }, dist: 1.2, rating: 4.2 },
  { id: 3, brand: 'IP', address: 'Viale Abruzzi 22, Milano', prices: { Benzina: 1.810, Diesel: 1.710, GPL: 0.750 }, dist: 1.8, rating: 3.8 },
  { id: 4, brand: 'Tamoil', address: 'Viale Monza 5, Milano', prices: { Benzina: 1.749, Diesel: 1.630, GPL: 0.699 }, dist: 2.1, rating: 4.7 },
  { id: 5, brand: 'Esso', address: 'Via Padova 100, Milano', prices: { Benzina: 1.799, Diesel: 1.680, GPL: 0.740 }, dist: 3.5, rating: 4.0 },
];

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
    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-lg shadow-sm ${style}`}>
      {brand.substring(0, 2).toUpperCase()}
    </div>
  );
};

export default function App() {
  const [selectedFuel, setSelectedFuel] = useState('Benzina');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('home'); 

  // Logica di ricerca e ordinamento per prezzo
  const filteredStations = useMemo(() => {
    return INITIAL_STATIONS.filter(s => 
      s.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.prices[selectedFuel] - b.prices[selectedFuel]);
  }, [selectedFuel, searchQuery]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const simulateRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  // Sotto-vista Profilo
  const ProfileView = () => (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right duration-300">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-100 rounded-[2.5rem] flex items-center justify-center text-blue-600">
          <User size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black">Mio Profilo</h2>
          <p className="text-gray-400 font-bold text-sm">Livello: Esploratore Urbano</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-6 rounded-[2rem]">
          <p className="text-2xl font-black">12</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Segnalazioni</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-[2rem]">
          <p className="text-2xl font-black">€45</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risparmiati</p>
        </div>
      </div>
      <div className="space-y-4">
        <button className="w-full p-6 bg-white border border-gray-100 rounded-[2rem] flex justify-between items-center font-bold">
          Cronologia Prezzi <ChevronRight size={18} />
        </button>
        <button className="w-full p-6 bg-white border border-gray-100 rounded-[2rem] flex justify-between items-center font-bold">
          Impostazioni <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white flex flex-col font-sans overflow-hidden text-slate-900">
      
      {/* HEADER DINAMICO */}
      <header className="px-6 pt-12 pb-4 bg-white/95 backdrop-blur-xl z-30 border-b border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Benzina GO</p>
            <h1 className="text-4xl font-black tracking-tighter">
              {view === 'profile' ? 'Profilo' : view === 'map' ? 'Mappa' : 'Esplora'}
            </h1>
          </div>
          <button 
            onClick={simulateRefresh} 
            className={`w-12 h-12 rounded-[1.2rem] bg-gray-50 flex items-center justify-center transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} className="text-slate-600" />
          </button>
        </div>

        {view === 'home' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {['Benzina', 'Diesel', 'GPL', 'Metano'].map((fuel) => (
              <button
                key={fuel}
                onClick={() => setSelectedFuel(fuel)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[13px] font-black transition-all border shrink-0
                  ${selectedFuel === fuel 
                    ? 'bg-black border-black text-white shadow-xl' 
                    : 'bg-white border-gray-100 text-gray-400'}`}
              >
                {fuel}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* RICERCA (solo in Home) */}
      {view === 'home' && (
        <div className="px-6 py-4 bg-white z-20">
          <div className="h-14 bg-gray-50 rounded-[1.5rem] flex items-center px-5 border border-transparent focus-within:border-blue-500/30 focus-within:bg-white transition-all">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Cerca stazione o indirizzo..." 
              className="bg-transparent border-none outline-none w-full ml-3 text-sm font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* CONTENUTO SCROLLABILE */}
      <main className="flex-1 overflow-y-auto bg-white pb-40">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-xs font-black tracking-widest text-gray-300 uppercase">Aggiornamento...</p>
          </div>
        ) : view === 'profile' ? (
          <ProfileView />
        ) : view === 'map' ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10">
            <MapPin size={48} className="text-blue-600 mb-4 animate-bounce" />
            <h3 className="text-2xl font-black">Mappa in caricamento</h3>
            <p className="text-gray-400 text-sm">Mostrando i distributori vicino a te...</p>
          </div>
        ) : (
          <div className="px-6 py-4 flex flex-col gap-6">
            {filteredStations.map((s, i) => (
              <div key={s.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 hover:border-blue-100 transition-all animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <BrandLogo brand={s.brand} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-xl leading-none">{s.brand}</h4>
                        <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                          <Star size={10} fill="currentColor" /> {s.rating}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase">{s.address}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleFavorite(s.id)} className={`p-3 rounded-2xl transition-all ${favorites.includes(s.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-300'}`}>
                    <Heart size={20} fill={favorites.includes(s.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase mb-2 tracking-widest">{selectedFuel} / SELF</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black tracking-tighter">
                        {s.prices[selectedFuel].toFixed(3).split('.')[0]}
                        <span className="text-3xl">.{s.prices[selectedFuel].toFixed(3).split('.')[1]}</span>
                      </span>
                      <span className="text-xs font-bold text-gray-300 uppercase">Eur/L</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-xs font-black bg-gray-50 px-3 py-1 rounded-full text-slate-400">{s.dist} KM</span>
                    <button className="bg-blue-600 text-white p-5 rounded-[2.2rem] shadow-xl shadow-blue-200 active:scale-90">
                      <Navigation size={32} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODALE INVIO PREZZO */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-[3.5rem] p-10 animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black tracking-tighter">Invia Prezzo</h2>
              <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><X size={24}/></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-2">
                {['Benzina', 'Diesel', 'GPL'].map(f => (
                  <button key={f} className="py-4 border-2 border-gray-100 rounded-2xl font-black text-xs hover:border-blue-500 transition-all">{f}</button>
                ))}
              </div>
              <input type="number" step="0.001" placeholder="0.000" className="w-full text-5xl font-black p-8 bg-gray-50 rounded-[2.5rem] outline-none text-center" />
              <button onClick={() => { setShowAddModal(false); simulateRefresh(); }} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl">
                CONFERMA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR FISSA */}
      <nav className="fixed bottom-0 w-full px-10 pb-12 pt-5 bg-white/90 backdrop-blur-2xl border-t border-gray-50 flex justify-between items-center z-50">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-blue-600' : 'text-gray-300'}`}>
          <Search size={26} strokeWidth={3} />
          <span className="text-[8px] font-black uppercase">Cerca</span>
        </button>
        <button onClick={() => setView('map')} className={`flex flex-col items-center gap-1 ${view === 'map' ? 'text-blue-600' : 'text-gray-300'}`}>
          <MapPin size={26} strokeWidth={3} />
          <span className="text-[8px] font-black uppercase">Mappa</span>
        </button>
        <button onClick={() => setShowAddModal(true)} className="w-16 h-16 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-lg -translate-y-8 active:scale-90 transition-all">
          <Plus size={32} strokeWidth={3} />
        </button>
        <button onClick={simulateRefresh} className="text-gray-300 flex flex-col items-center gap-1">
          <RefreshCw size={26} strokeWidth={3} />
          <span className="text-[8px] font-black uppercase">Update</span>
        </button>
        <button onClick={() => setView('profile')} className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-blue-600' : 'text-gray-300'}`}>
          <User size={26} strokeWidth={3} />
          <span className="text-[8px] font-black uppercase">Profilo</span>
        </button>
      </nav>

    </div>
  );
}
