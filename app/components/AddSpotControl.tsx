import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import SpotForm from './SpotForm';
import { WifiSpot } from '@/types'

function AddSpotControl({ onAddSpot }: { onAddSpot: (spot: Omit<WifiSpot, 'id'>) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  // 右クリックで座標を取得
  const map = useMapEvents({
    contextmenu(e) {
      console.log("Right-click detected at: ", e.latlng);  // デバッグ: 座標を確認
      setPosition(e.latlng); // 右クリックされた座標をセット
    },
  });

  return position ? (
    <div>
      <h3>Right-click detected, showing form</h3> {/* デバッグ: フォーム表示確認 */}
      {/* マーカーは表示せず、フォームのみ表示 */}
      <SpotForm lat={position.lat} lng={position.lng} onAddSpot={onAddSpot} />
    </div>
  ) : (
    <p>Right-click on the map to add a spot</p> // デバッグ: 右クリックの誘導メッセージ
  );
}

export default AddSpotControl;
