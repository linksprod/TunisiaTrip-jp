
export interface Museum {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  category: string[];
}

export interface MuseumCategory {
  id: string;
  name: string;
}
