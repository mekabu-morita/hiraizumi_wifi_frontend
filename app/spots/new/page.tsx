import dynamic from 'next/dynamic'

// Mapコンポーネントをサーバーサイドレンダリングせずに動作させる
const DynamicMap = dynamic(() => import('../../components/Map'), { ssr: false });

export default function New() {
  return (
    <div>
      <DynamicMap />
    </div>
  )
}
