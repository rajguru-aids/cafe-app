export type DrinkType = 'flat_white' | 'cortado' | 'pourover' | 'cold_brew' | 'matcha_latte';

export type VesselFinish = 'obsidian' | 'sandstone' | 'terracotta' | 'celadon';

export type RoastLevel = 'light' | 'medium' | 'dark';

export type MilkOption = 'whole' | 'oat' | 'almond' | 'none';

export type CupSize = '8oz' | '12oz' | '16oz';

export type Temperature = 'hot' | 'extra_hot' | 'iced';

export interface CustomizationState {
  drink: DrinkType;
  vessel: VesselFinish;
  roast: RoastLevel;
  milk: MilkOption;
  size: CupSize;
  temperature: Temperature;
  sweetness: string;
}

export interface MenuItem {
  id: string;
  name: string;
  japaneseName: string;
  category: 'espresso' | 'filter' | 'cold' | 'pastry' | 'beans';
  price: number;
  description: string;
  notes: string[];
  origin?: string;
  altitude?: string;
  process?: string;
  drinkPreset?: DrinkType;
  temperatureDefault?: Temperature;
  isPopular?: boolean;
}

export interface CartItem {
  cartId: string;
  itemId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  customization?: {
    drinkType?: DrinkType;
    vessel?: VesselFinish;
    roast?: RoastLevel;
    milk?: MilkOption;
    size?: CupSize;
    temperature?: Temperature;
    sweetness?: string;
  };
  notes?: string;
}

export interface ReservationData {
  experience: 'tasting_flight' | 'espresso_pairing' | 'table_slowbar';
  date: string;
  timeSlot: string;
  partySize: number;
  zone: 'counter' | 'garden' | 'mezzanine';
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}
