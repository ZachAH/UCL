import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  
  const center: [number, number] = [43.00, -88.20];

  useEffect(() => {
    const q = query(collection(db, "map_locations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(docs);
    });
    return () => unsubscribe();
  }, []);

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
        // Check if the address contains Wisconsin or WI
        const isWI = result.display_name.toLowerCase().includes("wisconsin") || 
                     result.display_name.toLowerCase().includes(" wi");

        if (isWI) {
          await saveLocation(result);
        } else {
          // Trigger the "Did you mean?" UI for out-of-state results
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
    <div className="w-full h-full min-h-[550px] relative z-0 rounded-[2.5rem] overflow-hidden bg-stone-50">
      
      {/* SEARCH AND CONFIRMATION OVERLAY */}
      <div className="absolute top-6 inset-x-0 z-[1000] flex flex-col items-center px-4 gap-3">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find an adventure..."
            className="w-full pl-5 pr-12 py-3.5 bg-white/90 backdrop-blur-xl border border-stone-200 rounded-2xl text-sm font-semibold text-stone-700 shadow-2xl outline-none focus:ring-2 focus:ring-sage/30 transition-all"
          />
          <button type="submit" disabled={isSearching} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-sage text-white rounded-xl shadow-lg active:scale-90 disabled:opacity-50">
            {isSearching ? "⌛" : "+"}
          </button>
        </form>

        {/* THE "DID YOU MEAN?" CARD */}
        {pendingLocation && (
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border border-stone-100 w-full max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <p className="text-[10px] text-sage font-black uppercase tracking-[0.2em] mb-2">Wait! Is this the right one?</p>
            <p className="text-sm text-stone-800 font-bold mb-1">
              {pendingLocation.display_name.split(',')[0]}
            </p>
            <p className="text-[11px] text-stone-400 leading-relaxed mb-4">
              {pendingLocation.display_name.split(',').slice(1, 4).join(',')}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => saveLocation(pendingLocation)}
                className="flex-1 py-3 bg-sage text-white text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-[#687f6e] transition-all"
              >
                Yes, Add Spot
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

      <MapContainer center={center} zoom={10} style={{ height: "550px", width: "100%" }}>
        <MapResize />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png" />
        
        {locations.map((loc) => {
          if (!loc.location) return null;
          return (
            <Marker key={loc.id} position={[loc.location.latitude, loc.location.longitude]} icon={pineIcon}>
              <Popup className="custom-popup">
                <div className="p-2 min-w-[180px]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-lg text-stone-800 leading-tight">{loc.name}</h4>
                    <button onClick={() => deleteDoc(doc(db, "map_locations", loc.id))} className="text-stone-300 hover:text-red-400 transition-colors pt-1">
                      🗑️
                    </button>
                  </div>
                  <p className="text-stone-500 text-[11px] leading-relaxed mb-4 italic">{loc.desc}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.location.latitude},${loc.location.longitude}`}
                    target="_blank" rel="noreferrer"
                    className="block w-full py-2.5 bg-sage text-white text-[10px] font-bold uppercase tracking-widest rounded-xl text-center shadow-md shadow-sage/10"
                  >
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute inset-0 pointer-events-none shadow-[inner_0_2px_15px_rgba(0,0,0,0.08)] rounded-[2.5rem] z-[1001]"></div>
    </div>
  );
};