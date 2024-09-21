'use client';
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, LayersControl, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WifiSpot } from '@/types';
import { fetchCategories, fetchSpots } from '@/lib/spots';
import customIcon from './CustomIcon';
import SpotForm from './SpotForm'; // Form for adding new spots

const hiraizumiCenter: L.LatLngExpression = [38.988587, 141.099241];
// Updated radius to 20 km
const hiraizumiRadius = 50000; // 50 km radius


// AddSpotControl Component
function AddSpotControl({ onAddSpot }: { onAddSpot: (spot: Omit<WifiSpot, 'id'>) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  let longPressTimer: NodeJS.Timeout;

  const map = useMapEvents({
    contextmenu(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    const mapContainer = map.getContainer();

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      longPressTimer = setTimeout(() => {
        setIsLongPress(true);
        const latlng = map.layerPointToLatLng(
          map.mouseEventToLayerPoint(e.touches[0] as any)
        );
        setPosition(latlng); // Set position on long press
      }, 500);
    };

    const handleTouchEnd = () => {
      if (!isLongPress) {
        clearTimeout(longPressTimer); // Cancel long press
      }
      setIsLongPress(false);
    };

    // Add event listeners for touch events
    mapContainer.addEventListener('touchstart', handleTouchStart);
    mapContainer.addEventListener('touchend', handleTouchEnd);

    // Cleanup event listeners on unmount
    return () => {
      mapContainer.removeEventListener('touchstart', handleTouchStart);
      mapContainer.removeEventListener('touchend', handleTouchEnd);
    };
  }, [map, isLongPress]);

  return position ? (
    <Marker position={position}>
      <Popup>
        <SpotForm lat={position.lat} lng={position.lng} onAddSpot={onAddSpot} />
      </Popup>
    </Marker>
  ) : null;
}

function ResetViewButton() {
  const map = useMap();

  const handleClick = () => {
    map.setView(hiraizumiCenter, 14);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute z-[1000] top-20 right-2 bg-white p-2 rounded-md shadow-md"
    >
      中心に戻る
    </button>
  );
}

export default function Map() {
  const [spots, setSpots] = useState<WifiSpot[]>([]);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | ''>('');

  // Function to add new spots
  const handleAddSpot = (newSpot: Omit<WifiSpot, 'id'>) => {
    setSpots(prev => [...prev, { ...newSpot, id: Date.now().toString() }]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spotsResponse = await fetchSpots();
        setSpots(spotsResponse);

        const categoriesResponse = await fetchCategories();
        const colors = categoriesResponse.reduce((acc: Record<string, string>, category: { category_name: string; color_code: string }) => {
          acc[category.category_name] = category.color_code;
          return acc;
        }, {});

        setCategoryColors(colors);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredSpots = selectedCategory
    ? spots.filter(spot => spot.category === selectedCategory)
    : spots;

  return (
    <div>
      {/* Category Selector */}
      <div className="mb-4">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">全てのカテゴリー</option>
          {Object.keys(categoryColors).map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <MapContainer center={hiraizumiCenter} zoom={12} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle
          center={hiraizumiCenter}
          radius={hiraizumiRadius}
          pathOptions={{ color: 'lightblue', fillColor: 'lightblue', fillOpacity: 0.2 }}
        />
        <ResetViewButton />

        <AddSpotControl onAddSpot={handleAddSpot} />

        <LayersControl position="topright">
          {Object.keys(categoryColors).map(category => (
            <LayersControl.Overlay key={category} name={category} checked>
              <LayerGroup>
                {filteredSpots.filter(spot => spot.category === category).map(spot => (
                  <Marker
                    key={spot.id}
                    position={[spot.lat, spot.lng]}
                    icon={customIcon(spot.category, categoryColors)}
                  >
                    <Popup>
                      <h3 className="font-bold">{spot.name}</h3>
                      <p>カテゴリー: {spot.category}</p>
                      <p>電話: {spot.phone}</p>
                      <p>Email: {spot.email}</p>
                      <a href={spot.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        詳細を見る
                      </a>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      </MapContainer>

      <div className="mt-4">
        <h4 className="font-bold mb-2">カテゴリー凡例:</h4>
        <div className="flex flex-wrap">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="mr-4 mb-2">
              <span style={{ color, marginRight: '5px' }}>●</span>
              {category}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <a
          href="/new"
          className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
        >
          掲載希望の方はこちら
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredSpots.map(spot => (
          <div key={spot.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-500 text-white px-4 py-2">
              <h3 className="font-bold">{spot.name}</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">カテゴリー: {spot.category}</p>
              <p className="text-sm text-gray-600">電話: {spot.phone}</p>
              <p className="text-sm text-gray-600">Email: {spot.email}</p>
              <a href={spot.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-500 hover:underline">
                詳細を見る
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
