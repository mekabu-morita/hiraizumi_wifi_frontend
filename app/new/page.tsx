import dynamic from 'next/dynamic'

// Mapコンポーネントをサーバーサイドレンダリングせずに動作させる
const DynamicStoreForm = dynamic(() => import('../components/StoreForm'), { ssr: false });

export default function Home() {
  return (
    <div>
      <DynamicStoreForm />
    </div>
  );
}
