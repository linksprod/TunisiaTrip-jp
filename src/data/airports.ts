export interface Airport {
  id: string;
  name: string;
  code: string;
  location: string;
  image: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const airports: Airport[] = [
  {
    id: "tunis-carthage",
    name: "Tunis-Carthage Airport",
    code: "TUN",
    location: "Tunis, Tunisia",
    image: "/src/assets/tunis-airport.png",
    description: "Main international gateway to Tunisia, serving the capital and northern regions",
    coordinates: { lat: 36.851, lng: 10.227 }
  },
  {
    id: "djerba-zarzis",
    name: "Djerba-Zarzis Airport", 
    code: "DJE",
    location: "Djerba, Tunisia",
    image: "/src/assets/djerba-airport.png",
    description: "Gateway to southern Tunisia and the beautiful island of Djerba",
    coordinates: { lat: 33.875, lng: 10.775 }
  }
];