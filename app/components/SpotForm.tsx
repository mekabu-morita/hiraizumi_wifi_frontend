'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '../components/CustomIcon';
import { WifiSpot } from '@/types'

interface SpotFormProps {
  lat: number;
  lng: number;
  onAddSpot: (spot: Omit<WifiSpot, 'id'>) => void;
}

export default function SpotForm({ lat, lng, onAddSpot }: SpotFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState<Category | ''>(''); // 空文字を許容
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      setErrorMessage('カテゴリーを選択してください。');
      return;
    }

    // 新しいスポットを作成
    const newSpot = { name, lat, lng, email, link, category, phone };
    onAddSpot(newSpot); // 親コンポーネントに新しいスポットを渡す
    router.push('/'); // ページ遷移などの処理
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="店舗名"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
      />
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="店舗リンク"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="電話番号"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        required
      >
        <option value="">カテゴリーを選択</option>
        {/* カテゴリーの選択肢 */}
        <option value="寺院">寺院</option>
        <option value="山">山</option>
        {/* 他のカテゴリー */}
      </select>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button type="submit">登録</button>
    </form>
  );
}
