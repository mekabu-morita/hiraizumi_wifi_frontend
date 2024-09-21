import dynamic from 'next/dynamic'
import { WifiSpot } from '@/types'

// Mapコンポーネントをサーバーサイドレンダリングせずに動作させる（型も指定）
const DynamicMap = dynamic<{ spots: WifiSpot[] }>(() => import('./Map'), { ssr: false });

export default function MapWrapper({ spots }: { spots: WifiSpot[] }) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Wi-Fi スポットマップ</h1>
      <DynamicMap spots={spots} />
    </div>
  );
}
