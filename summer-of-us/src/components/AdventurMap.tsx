import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';

// --- SENIOR TOUCH: CUSTOM PINE ICON ---
// We're using a custom green marker to match the "Sage" theme.
const pineIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const AdventureMap = () => {
  // Center: New Berlin / Waukesha area
  const center: [number, number] = [43.00, -88.20];

  const locations = [
    { 
      id: 1, 
      pos: [43.018, -88.35] as [number, number], 
      name: "Lapham Peak", 
      desc: "Climb the tower for the best sunset in the county. 🌅",
      link: "https://www.google.com/maps/dir/?api=1&destination=Lapham+Peak"
    },
    { 
      id: 2, 
      pos: [42.980, -88.19] as [number, number], 
      name: "Minooka Park", 
      desc: "Hiking trails and the swimming pond for hot July days. 🏊‍♀️",
      link: "https://www.google.com/maps/dir/?api=1&destination=Minooka+Park"
    },
    { 
      id: 3, 
      pos: [43.420, -89.73] as [number, number], 
      name: "Devil's Lake", 
      desc: "The big one. 500ft bluffs and turquoise water. 🧗‍♂️",
      link: "https://www.google.com/maps/dir/?api=1&destination=Devils+Lake+State+Park"
    },
    { 
      id: 4, 
      pos: [42.946, -88.19] as [number, number], 
      name: "Fox River Park", 
      desc: "Quiet morning walks by the river. 🌿",
      link: "https://www.google.com/maps/dir/?api=1&destination=Fox+River+Park"
    }
  ];

  return (
    <div className="w-full h-full min-h-[500px] relative z-0">
      <MapContainer 
        center={center} 
        zoom={10} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        style={{ background: '#f8f5f0' }} // Matches your paper vibe
      >
        {/* LIGHT TILES: This keeps the map looking "Designed" rather than "Default" */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {locations.map(loc => (
          <Marker key={loc.id} position={loc.pos} icon={pineIcon}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[150px]">
                <h4 className="font-serif text-lg text-stone-800 mb-1">{loc.name}</h4>
                <p className="text-stone-500 text-xs leading-relaxed mb-3">{loc.desc}</p>
                <a 
                  href={loc.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block text-center py-2 bg-sage text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#687f6e] transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Overlay Shadow for depth */}
      <div className="absolute inset-0 pointer-events-none shadow-[inner_0_2px_10px_rgba(0,0,0,0.05)] rounded-[2rem]"></div>
    </div>
  );
};