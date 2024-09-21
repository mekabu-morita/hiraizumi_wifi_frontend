import { getSpots } from '@/lib/spots'

export default async function NearbySpots() {
  const spots = await getSpots()
  const nearbySpots = spots.slice(0, 3) // 仮の実装

  return (
    <div>
      <h2>近くのWi-Fiスポット</h2>
      {nearbySpots.map(spot => (
        <div key={spot.id}>
          <h3>{spot.name}</h3>
          <p>{spot.email}</p>
          <a href={spot.link}>詳細</a>
        </div>
      ))}
    </div>
  )
}