import { MenuItem, DrinkType } from './types';

export const DRINK_CONFIGS: Record<DrinkType, {
  name: string;
  japanese: string;
  subheading: string;
  basePrice: number;
  cupColor: string;
  liquidColor: string;
  foamColor: string;
  hasFoam: boolean;
  foamPattern: 'rosetta' | 'heart' | 'crema' | 'clear' | 'matcha';
  defaultTemp: 'hot' | 'iced';
  steam: boolean;
  description: string;
}> = {
  flat_white: {
    name: 'Flat White',
    japanese: 'フラットホワイト',
    subheading: 'Double Ristretto & Microfoam',
    basePrice: 5.75,
    cupColor: '#25221F',
    liquidColor: '#8C5A32',
    foamColor: '#F5ECE1',
    hasFoam: true,
    foamPattern: 'rosetta',
    defaultTemp: 'hot',
    steam: true,
    description: 'Double shot of house single-origin espresso folded with silky, glossy micro-textured steamed milk with delicate rosetta art.'
  },
  cortado: {
    name: 'Gibraltar Cortado',
    japanese: 'コルタド',
    subheading: '1:1 Equal Ratio Espresso & Warm Milk',
    basePrice: 5.25,
    cupColor: '#1A1816',
    liquidColor: '#7A4723',
    foamColor: '#F3E5D4',
    hasFoam: true,
    foamPattern: 'heart',
    defaultTemp: 'hot',
    steam: true,
    description: 'Spanish equal-ratio balance: intense double espresso cut with lightly textured steamed milk in a heavy faceted glass tumbler.'
  },
  pourover: {
    name: 'Single-Origin Pour Over',
    japanese: 'ハンドドリップ',
    subheading: 'Hario V60 Precision Brew',
    basePrice: 6.50,
    cupColor: '#2E2823',
    liquidColor: '#3D2012',
    foamColor: '#3D2012',
    hasFoam: false,
    foamPattern: 'clear',
    defaultTemp: 'hot',
    steam: true,
    description: 'Carefully hand-poured with mineral-calibrated 92°C water using Hario V60 paper dripper to highlight delicate floral and fruit aromatics.'
  },
  cold_brew: {
    name: 'Kyoto Drip Cold Brew',
    japanese: '水出し珈琲',
    subheading: '16-Hour Slow Dutch Tower Extraction',
    basePrice: 6.00,
    cupColor: '#181615',
    liquidColor: '#1F140D',
    foamColor: '#1F140D',
    hasFoam: false,
    foamPattern: 'clear',
    defaultTemp: 'iced',
    steam: false,
    description: 'Gravity-extracted drop by drop over 16 hours through a Japanese glass tower. Velvety, wine-like clarity served over hand-carved clear ice sphere.'
  },
  matcha_latte: {
    name: 'Uji Ceremonial Matcha',
    japanese: '宇治抹茶ラテ',
    subheading: 'First-Harvest Ceremonial Grade Stone-Ground',
    basePrice: 6.75,
    cupColor: '#232921',
    liquidColor: '#3D6B37',
    foamColor: '#4A7F43',
    hasFoam: true,
    foamPattern: 'matcha',
    defaultTemp: 'hot',
    steam: true,
    description: 'Single-estate stone-ground green tea whisked with bamboo chasen, paired with silky steamed oat milk for umami sweetness.'
  }
};

export const VESSEL_FINISHES = [
  { id: 'obsidian', name: 'Obsidian Stoneware', hex: '#22201E', roughness: 0.85, metalness: 0.1 },
  { id: 'sandstone', name: 'Kyoto Sandstone', hex: '#D7CEBE', roughness: 0.9, metalness: 0.05 },
  { id: 'terracotta', name: 'Raw Terracotta', hex: '#B8684C', roughness: 0.92, metalness: 0.05 },
  { id: 'celadon', name: 'Celadon Mist', hex: '#6D8278', roughness: 0.35, metalness: 0.15 }
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // Espresso
  {
    id: 'flat-white',
    name: 'Artisanal Flat White',
    japaneseName: 'フラットホワイト',
    category: 'espresso',
    price: 5.75,
    description: 'Double ristretto blended with velvety microfoam in hand-thrown ceramic.',
    notes: ['Salted caramel', 'Roasted hazelnut', 'Malted milk'],
    drinkPreset: 'flat_white',
    isPopular: true
  },
  {
    id: 'cortado',
    name: 'Gibraltar Cortado',
    japaneseName: 'コルタド',
    category: 'espresso',
    price: 5.25,
    description: 'Equal parts single-origin espresso and silky warm milk in a faceted glass.',
    notes: ['Dark chocolate', 'Blood orange', 'Brown sugar'],
    drinkPreset: 'cortado'
  },
  {
    id: 'espresso-doppio',
    name: 'Omotesando Doppio',
    japaneseName: 'ドッピオ・エスプレッソ',
    category: 'espresso',
    price: 4.50,
    description: 'Pure double extraction of our seasonal Colombia Huila pink bourbon.',
    notes: ['Red currant', 'Bergamot', 'Raw honey'],
    drinkPreset: 'cortado'
  },
  {
    id: 'matcha-latte',
    name: 'Uji Ceremonial Matcha Latte',
    japaneseName: '宇治抹茶ラテ',
    category: 'espresso',
    price: 6.75,
    description: 'First harvest stone-ground tea from Kyoto whisked with choice of steamed milk.',
    notes: ['Rich umami', 'Fresh morning dew', 'Sweet pea'],
    drinkPreset: 'matcha_latte',
    isPopular: true
  },

  // Filter
  {
    id: 'ethiopia-guji',
    name: 'Ethiopia Guji Uraga V60',
    japaneseName: 'エチオピア・グジ',
    category: 'filter',
    price: 6.75,
    description: 'Washed heirloom varieties from 2,100m elevation. Crisp, floral and tea-like.',
    notes: ['Jasmine flower', 'White peach', 'Bergamot tea'],
    origin: 'Uraga, Guji, Ethiopia',
    altitude: '2,100 - 2,250 MASL',
    process: 'Washed / African Raised Beds',
    drinkPreset: 'pourover',
    isPopular: true
  },
  {
    id: 'colombia-pink-bourbon',
    name: 'Colombia Huila Pink Bourbon',
    japaneseName: 'コロンビア・ウィラ',
    category: 'filter',
    price: 7.00,
    description: 'Rare Pink Bourbon mutation with sparkling tropical acidity and silk finish.',
    notes: ['Papaya', 'Pink guava', 'Cacao nibs'],
    origin: 'San Adolfo, Huila, Colombia',
    altitude: '1,850 MASL',
    process: 'Anaerobic Washed (48hr)',
    drinkPreset: 'pourover'
  },
  {
    id: 'guatemala-antigua',
    name: 'Guatemala Finca Medina',
    japaneseName: 'グアテマラ・アンティグア',
    category: 'filter',
    price: 6.25,
    description: 'Shade-grown volcanic soil coffee with warm toffee sweetness and balanced body.',
    notes: ['Candied pecan', 'Red apple', 'Praline'],
    origin: 'Antigua Valley, Guatemala',
    altitude: '1,650 MASL',
    process: 'Washed',
    drinkPreset: 'pourover'
  },

  // Cold
  {
    id: 'kyoto-cold-brew',
    name: 'Kyoto Dutch Slow Drip',
    japaneseName: '水出しダッチ珈琲',
    category: 'cold',
    price: 6.00,
    description: '16-hour gravity extraction drop-by-drop through borosilicate glass tower.',
    notes: ['Dark molasses', 'Port wine finish', 'Dark cherry'],
    drinkPreset: 'cold_brew',
    isPopular: true
  },
  {
    id: 'cascara-fizz',
    name: 'Yuzu Cascara Botanical Tonic',
    japaneseName: '柚子カスカラトニック',
    category: 'cold',
    price: 6.50,
    description: 'Sparkling infusion of sun-dried organic coffee cherry husk with Japanese yuzu.',
    notes: ['Rosehip', 'Hibiscus', 'Tart yuzu citrus'],
    drinkPreset: 'cold_brew'
  },
  {
    id: 'iced-flat-white',
    name: 'Iced Velvet Shakerato',
    japaneseName: 'アイス・シェケラート',
    category: 'cold',
    price: 6.25,
    description: 'Espresso vigorously hand-shaken with organic demerara syrup and oat milk.',
    notes: ['Creamy praline', 'Spiced brown sugar', 'Crisp cold finish'],
    drinkPreset: 'flat_white'
  },

  // Pastries
  {
    id: 'matcha-canele',
    name: 'Kyoto Matcha Bordeaux Canelé',
    japaneseName: '抹茶カヌレ',
    category: 'pastry',
    price: 4.85,
    description: 'Crisp caramelized beeswax crust filled with custard infused with Uji matcha.',
    notes: ['Caramelized sugar', 'Vanilla bean', 'Rich matcha center']
  },
  {
    id: 'black-sesame-croissant',
    name: 'Toasted Black Sesame Croissant',
    japaneseName: '黒胡麻クロワッサン',
    category: 'pastry',
    price: 5.25,
    description: '100% Normandy butter sourdough croissant rolled with roasted black sesame frangipane.',
    notes: ['Flaky laminated dough', 'Nutty sesame', 'Sea salt flake'],
    isPopular: true
  },
  {
    id: 'cardamom-morning-bun',
    name: 'Swedish Cardamom & Orange Knot',
    japaneseName: 'カルダモンロール',
    category: 'pastry',
    price: 4.95,
    description: 'Slow-fermented brioche twisted with freshly crushed green cardamom and orange zest.',
    notes: ['Crushed cardamom', 'Orange blossom', 'Pearl sugar crunch']
  },

  // Whole Bean Bags
  {
    id: 'beans-guji-250g',
    name: 'Guji Uraga 250g Whole Bean',
    japaneseName: 'エチオピア・豆 250g',
    category: 'beans',
    price: 21.00,
    description: 'Light roast single-origin roasted weekly on our 1968 Probat UG15 cast-iron drum.',
    notes: ['White peach', 'Jasmine', 'Cane sugar'],
    origin: 'Ethiopia (2026 Harvest)',
    process: 'Washed'
  },
  {
    id: 'beans-huila-250g',
    name: 'Huila Pink Bourbon 250g',
    japaneseName: 'コロンビア・豆 250g',
    category: 'beans',
    price: 23.00,
    description: 'Limited micro-lot from Don Hernando. Anaerobic fermentation for fruit vibrancy.',
    notes: ['Papaya', 'Guava', 'Milk chocolate'],
    origin: 'Colombia (Micro-lot)',
    process: 'Anaerobic Washed'
  },
  {
    id: 'beans-omotesando-blend',
    name: 'House Kissaten Blend 250g',
    japaneseName: '自家焙煎ブレンド 250g',
    category: 'beans',
    price: 19.50,
    description: 'Our signature slow bar blend: 60% Guatemala, 40% Ethiopia. Velvety and balanced.',
    notes: ['Roasted cacao', 'Almond brittle', 'Cranberry finish'],
    process: 'Washed / Natural Blend'
  }
];

export const ORIGIN_STORIES = [
  {
    title: 'Guji Highland Micro-Lots',
    country: 'Ethiopia',
    elevation: '2,150m',
    producer: 'Uraga Washing Station & Smallholders',
    flavorNotes: 'Jasmine, White Peach, Bergamot, Earl Grey',
    story: 'High in the mist-veiled peaks of the Oromia region, heirloom coffee varieties grow under indigenous shade trees. Hand-picked at peak ripeness and sun-dried on elevated bamboo beds for 21 days.',
    roastStyle: 'Light Nordic Roast / Drum Temperature 198°C'
  },
  {
    title: 'San Adolfo Pink Bourbon',
    country: 'Colombia',
    elevation: '1,850m',
    producer: 'Hernando Family Farm, Huila',
    flavorNotes: 'Pink Guava, Candied Citrus, Honeycomb, Cocoa',
    story: 'Pink Bourbon is a natural hybrid of Red and Yellow Bourbon that requires meticulous attention. A controlled 48-hour anaerobic cherry maceration develops delicate tropical brightness.',
    roastStyle: 'Medium-Light / Air Flow Extended Drying Phase'
  },
  {
    title: 'Finca Medina Volcanic Soil',
    country: 'Guatemala',
    elevation: '1,650m',
    producer: 'Antigua Valley Direct Trade',
    flavorNotes: 'Toffee, Dark Plum, Candied Pecan, Baker’s Cacao',
    story: 'Nestled between three volcanoes—Agua, Fuego, and Acatenango—this century-old estate benefits from mineral-dense pumice soil and cool nocturnal breezes that slow bean development.',
    roastStyle: 'Medium Roast / Gentle Conductive Development'
  }
];
