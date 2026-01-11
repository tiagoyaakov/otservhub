export interface ServerSystem {
  name: string;
  enabled: boolean;
}

export interface Server {
  id: string;
  name: string;
  logo: string;
  playersOnline: number;
  launchDate: string;
  version: string;
  rate: string;
  style: string;
  mapType: string;
  pvpType: "PvP" | "Non-PvP" | "War";
  hasMobile: boolean;
  isVerified: boolean;
  hypeScore: number;
  category: "oldschool" | "baiak" | "war";
  systems: ServerSystem[];
}

export function parseServerDate(dateString: string): Date {
  return new Date(dateString);
}

export const mockServers: Server[] = [
  {
    id: "1",
    name: "Royal Tibia",
    logo: "/globe.svg",
    playersOnline: 680,
    launchDate: "2026-01-12T18:00:00Z",
    version: "7.72",
    rate: "3x",
    style: "Global",
    mapType: "Global",
    pvpType: "PvP",
    hasMobile: true,
    isVerified: true,
    hypeScore: 245,
    category: "oldschool",
    systems: [
      { name: "Quest System", enabled: true },
      { name: "Task System", enabled: true },
      { name: "Cast System", enabled: true },
    ],
  },
  {
    id: "2",
    name: "Dragon's Legacy",
    logo: "/globe.svg",
    playersOnline: 850,
    launchDate: "2026-01-13T20:00:00Z",
    version: "12.00",
    rate: "150x",
    style: "Global",
    mapType: "Global",
    pvpType: "PvP",
    hasMobile: true,
    isVerified: true,
    hypeScore: 312,
    category: "oldschool",
    systems: [
      { name: "Imbuement", enabled: true },
      { name: "Prey System", enabled: true },
      { name: "Cast System", enabled: true },
    ],
  },
  {
    id: "3",
    name: "Baiak Wars",
    logo: "/globe.svg",
    playersOnline: 520,
    launchDate: "2026-01-16T19:00:00Z",
    version: "8.60",
    rate: "500x",
    style: "Baiak",
    mapType: "Baiak",
    pvpType: "PvP",
    hasMobile: true,
    isVerified: false,
    hypeScore: 189,
    category: "baiak",
    systems: [
      { name: "Auto Loot", enabled: true },
      { name: "VIP System", enabled: true },
    ],
  },
  {
    id: "4",
    name: "Phoenix OT",
    logo: "/globe.svg",
    playersOnline: 390,
    launchDate: "2026-01-14T17:00:00Z",
    version: "8.60",
    rate: "999x",
    style: "Baiak",
    mapType: "Baiak",
    pvpType: "PvP",
    hasMobile: true,
    isVerified: true,
    hypeScore: 156,
    category: "baiak",
    systems: [
      { name: "Auto Loot", enabled: true },
      { name: "Cast System", enabled: true },
    ],
  },
  {
    id: "5",
    name: "Storm OT",
    logo: "/globe.svg",
    playersOnline: 410,
    launchDate: "2026-01-15T21:00:00Z",
    version: "8.60",
    rate: "300x",
    style: "Custom",
    mapType: "Custom",
    pvpType: "PvP",
    hasMobile: true,
    isVerified: true,
    hypeScore: 134,
    category: "oldschool",
    systems: [
      { name: "Quest System", enabled: true },
      { name: "Events", enabled: true },
    ],
  },
  {
    id: "6",
    name: "Mystic Realms",
    logo: "/globe.svg",
    playersOnline: 445,
    launchDate: "2026-01-18T18:00:00Z",
    version: "12.85",
    rate: "Stages",
    style: "Custom",
    mapType: "Custom",
    pvpType: "Non-PvP",
    hasMobile: false,
    isVerified: true,
    hypeScore: 278,
    category: "oldschool",
    systems: [
      { name: "Imbuement", enabled: true },
      { name: "Prey System", enabled: true },
      { name: "Task System", enabled: true },
    ],
  },
  {
    id: "7",
    name: "Baiak Master",
    logo: "/globe.svg",
    playersOnline: 380,
    launchDate: "2026-01-19T20:00:00Z",
    version: "8.60",
    rate: "1000x",
    style: "Baiak",
    mapType: "Baiak",
    pvpType: "PvP",
    hasMobile: true,
    isVerified: true,
    hypeScore: 167,
    category: "baiak",
    systems: [
      { name: "Auto Loot", enabled: true },
      { name: "VIP System", enabled: true },
      { name: "Events", enabled: true },
    ],
  },
  {
    id: "8",
    name: "Tibia Classic BR",
    logo: "/globe.svg",
    playersOnline: 520,
    launchDate: "2026-01-21T19:00:00Z",
    version: "7.40",
    rate: "5x",
    style: "Global",
    mapType: "Global",
    pvpType: "PvP",
    hasMobile: false,
    isVerified: true,
    hypeScore: 298,
    category: "oldschool",
    systems: [
      { name: "Quest System", enabled: true },
      { name: "Cast System", enabled: true },
    ],
  },
  {
    id: "9",
    name: "Battle Realms",
    logo: "/globe.svg",
    playersOnline: 420,
    launchDate: "2026-01-31T18:00:00Z",
    version: "12.00",
    rate: "200x",
    style: "Custom",
    mapType: "Custom",
    pvpType: "War",
    hasMobile: true,
    isVerified: false,
    hypeScore: 145,
    category: "war",
    systems: [
      { name: "War System", enabled: true },
      { name: "Guild System", enabled: true },
    ],
  },
  {
    id: "10",
    name: "Eternal Tibia",
    logo: "/globe.svg",
    playersOnline: 280,
    launchDate: "2026-02-03T20:00:00Z",
    version: "12.00",
    rate: "2x",
    style: "Global",
    mapType: "Global",
    pvpType: "Non-PvP",
    hasMobile: true,
    isVerified: true,
    hypeScore: 89,
    category: "oldschool",
    systems: [
      { name: "Imbuement", enabled: true },
      { name: "Prey System", enabled: true },
    ],
  },
  {
    id: "11",
    name: "War Lords",
    logo: "/globe.svg",
    playersOnline: 650,
    launchDate: "2026-01-25T19:00:00Z",
    version: "8.60",
    rate: "500x",
    style: "Custom",
    mapType: "Custom",
    pvpType: "War",
    hasMobile: true,
    isVerified: true,
    hypeScore: 312,
    category: "war",
    systems: [
      { name: "War System", enabled: true },
      { name: "Guild System", enabled: true },
      { name: "Events", enabled: true },
    ],
  },
];

export const sponsoredServers = [
  {
    id: "sp1",
    name: "War of Guilds",
    tagline: "Batalhas épicas PvP",
    gradient: "from-purple-900 via-purple-800 to-indigo-900",
    isSponsored: true,
  },
  {
    id: "sp2", 
    name: "Tibia Legends",
    tagline: "A lenda retorna",
    gradient: "from-blue-900 via-cyan-800 to-teal-900",
    isSponsored: true,
  },
  {
    id: "sp3",
    name: "Dragon Realms",
    tagline: "Conquiste o mundo",
    gradient: "from-red-900 via-orange-800 to-yellow-900",
    isSponsored: true,
  },
];
