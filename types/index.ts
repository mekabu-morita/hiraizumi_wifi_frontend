export interface CategoryResponse {
  category_name: string;
  color_code: string;
}

export interface WifiSpot {
  id: string
  name: string
  lat: number
  lng: number
  category: string
  phone: string
  email: string
  link: string
}
