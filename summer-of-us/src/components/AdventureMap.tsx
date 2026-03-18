import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

/**
 * THE BUG FIXER
 * Ensures the map fills its container properly after animations or window resizing.
 */
function MapResize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500); 
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

const pineIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const AdventureMap = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<any>(null);
  
  const center: [number, number] = [43.00, -88.20]; // Default: New Berlin / Waukesha

  // 1. DYNAMIC FIREBASE LISTENER
  useEffect(() => {
    const q = query(collection(db, "map_locations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(docs);
    });
    return () => unsubscribe();
  }, []);

  // 2. SAVE HELPER
  const saveLocation = async (result: any) => {
    await addDoc(collection(db, "map_locations"), {
      name: searchQuery,
      desc: "New summer memory! ✨",
      location: {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      }
    });
    setSearchQuery('');
    setPendingLocation(null);
  };

  // 3. SEARCH LOGIC WITH WISCONSIN GUARDRAIL
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      const data = await res.json();
      const result = data[0];

      if (result) {
        // Logic: Prioritize Wisconsin to avoid the "Texas Trap"
        const isWI = result.display_name.toLowerCase().includes("wisconsin") || 
                     result.display_name.toLowerCase().includes(" wi");

        if (isWI) {
          await saveLocation(result);
        } else {
          // Trigger the "Did you mean?" confirmation for out-of-state results
          setPendingLocation(result);
        }
      } else {
        alert("Couldn't find that spot! Try adding 'WI' to your search.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[550px] relative z-0 rounded-[2.5rem] overflow-hidden bg-stone-50 border border-stone-100 shadow-sm">
      
      {/* OVERLAY: SEARCH & CONFIRMATION CARDS */}
      <div className="absolute top-4 md:top-6 inset-x-0 z-[1000] flex flex-col items-center px-4 gap-3">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm group">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Add a new spot..."
            className="w-full pl-5 pr-14 py-4 bg-white/95 backdrop-blur-xl border border-stone-200 rounded-3xl text-sm font-semibold text-stone-700 shadow-xl outline-none focus:ring-2 focus:ring-sage/30 transition-all placeholder:text-stone-300"
          />
          <button 
            type="submit" 
            disabled={isSearching} 
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-sage text-white rounded-2xl shadow-lg active:scale-90 transition-all disabled:opacity-50"
          >
            {isSearching ? <span className="animate-spin text-xs">⌛</span> : <span className="text-xl">+</span>}
          </button>
        </form>

        {/* THE "DID YOU MEAN?" CONFIRMATION CARD */}
        {pendingLocation && (
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl border border-stone-100 w-full max-w-[320px] animate-in fade-in slide-in-from-top-4 duration-300">
            <p className="text-[10px] text-sage font-black uppercase tracking-[0.2em] mb-2 text-center">Wait! Is this the right one?</p>
            <p className="text-sm text-stone-800 font-bold mb-1 text-center leading-tight">
              {pendingLocation.display_name.split(',')[0]}
            </p>
            <p className="text-[11px] text-stone-400 text-center leading-relaxed mb-5 px-2">
              {pendingLocation.display_name.split(',').slice(1, 4).join(',')}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => saveLocation(pendingLocation)}
                className="flex-1 py-3 bg-sage text-white text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-[#687f6e] transition-all"
              >
                Yes, Add
              </button>
              <button 
                onClick={() => setPendingLocation(null)}
                className="flex-1 py-3 bg-stone-100 text-stone-400 text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-stone-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <MapContainer 
        center={center} 
        zoom={10} 
        zoomControl={false} // Hidden to move it away from search bar
        style={{ height: "550px", width: "100%" }}
        className="w-full h-full"
      >
        <MapResize />
        
        {/* ZOOM CONTROLS MOVED TO BOTTOM RIGHT FOR MOBILE CLARITY */}
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='© CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
        />
        
        {locations.map((loc) => {
          if (!loc.location) return null;
          return (
            <Marker key={loc.id} position={[loc.location.latitude, loc.location.longitude]} icon={pineIcon}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[160px]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-base text-stone-800 leading-tight pr-4">{loc.name}</h4>
                    <button 
                      onClick={() => {
                        if(window.confirm(`Delete ${loc.name}?`)) {
                           deleteDoc(doc(db, "map_locations", loc.id))
                        }
                      }} 
                      className="text-stone-300 hover:text-red-400 transition-colors pt-0.5"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-stone-500 text-[10px] leading-relaxed mb-4 italic">{loc.desc}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.location.latitude},${loc.location.longitude}`}
                    target="_blank" rel="noreferrer"
                    className="block w-full py-2.5 bg-sage text-white text-[9px] font-bold uppercase tracking-widest rounded-lg text-center shadow-md shadow-sage/10 active:scale-95 transition-all"
                  >
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Inner Shadow Overlay for depth */}
      <div className="absolute inset-0 pointer-events-none shadow-[inner_0_2px_15px_rgba(0,0,0,0.08)] rounded-[2.5rem] z-[1001]"></div>
    </div>
  );
};