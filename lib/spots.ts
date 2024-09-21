import { WifiSpot, CategoryResponse } from '@/types';
import exp from 'constants';

// Use this API endpoint to get the spots dynamically
const apiEndpoint = 'http://localhost/api';

let spots: WifiSpot[] = [];

// Fetch spots from the API and store in the spots variable
export async function fetchSpots(): Promise<WifiSpot[]> {
  try {
    const response = await fetch(`${apiEndpoint}/spots`);
    if (!response.ok) {
      throw new Error('Failed to fetch spots');
    }
    // Convert the response to JSON
    const data: WifiSpot[] = await response.json();
    
    // Populate the spots variable with the data fetched from API
    spots = data;

    return spots;
  } catch (error) {
    console.error('Error fetching spots:', error);
    return [];
  }
}

export async function addSpot(spot: Omit<WifiSpot, 'id'>): Promise<WifiSpot> {
  const newSpot = { ...spot, id: Date.now().toString() };
  spots.push(newSpot);
  return newSpot;
}

export async function fetchCategories(): Promise<CategoryResponse[]> {
  try {
    const response = await fetch(`${apiEndpoint}/categories`);
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}