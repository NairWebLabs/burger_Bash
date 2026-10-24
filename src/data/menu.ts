import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'smash-saffron-double',
    name: 'The Saffron Ember Smash',
    subname: 'Double 80/20 Dry-Aged Chuck & Brisket Blend',
    category: 'smash',
    description: 'Crispy lacy-edge smashed beef patties, two-year cave-aged Wisconsin cheddar, house-cured saffron pickles, and smoked embers secret emulsion on toasted golden brioche.',
    price: 18.50,
    image: '/src/assets/images/burger_smoked_saffron_smash_1792861412281.jpg',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-juicy-beef-burger-patty-cooking-on-a-grill-41617-large.mp4',
    badge: 'Chef Signature',
    calories: '860 kcal',
    prepTime: '9 min',
    rating: 4.9,
    ingredients: [
      'Double Dry-Aged Beef Patties (180g total)',
      'Aged Sharp Cheddar (Melted in steam dome)',
      'Smoked Saffron Remoulade',
      'Sweet & Sour Garlic Dill Chips',
      'Artisanal Glazed Sesame Brioche'
    ],
    chefNote: 'Smashed directly onto 550°F cast iron with custom ribbed press for maximum Maillard crust.',
    customizable: true,
    options: {
      doneness: ['Lacy Crust (Standard)', 'Extra Charred Crunch'],
      bun: ['Signature Golden Brioche', 'Seeded Charcoal Bun', 'Gluten-Free Potato Bun']
    }
  },
  {
    id: 'wagyu-black-truffle',
    name: 'The Black Truffle Wagyu',
    subname: 'A5 Miyazaki Wagyu & Prime Angus Cross',
    category: 'wagyu',
    description: 'Thick seared 220g Wagyu patty, shaved Norcia winter truffles, melted alpine Gruyère, wild chanterelles sautéed in shallot butter, and peppery wild rocket.',
    price: 26.00,
    image: '/src/assets/images/burger_truffle_wagyu_1792861412306.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    badge: 'Michelin Grade',
    calories: '940 kcal',
    prepTime: '12 min',
    rating: 5.0,
    ingredients: [
      '220g Prime Wagyu Blend Patty',
      'Fresh Shaved Black Truffles',
      'Cave-Aged Gruyère AOP',
      'Wild Chanterelles & Morels',
      'Charred Garlic Butter Glaze'
    ],
    chefNote: 'Finished over binchotan white charcoal embers for an unmistakable gentle umami aroma.',
    customizable: true,
    options: {
      doneness: ['Medium Rare (Chef Rec)', 'Medium', 'Well Done'],
      bun: ['Signature Golden Brioche', 'Brioche Au Levain']
    }
  },
  {
    id: 'charcoal-hot-honey',
    name: 'The Obsidian Hot Honey',
    subname: 'Crispy Double-Dredged Buttermilk Chicken',
    category: 'specialty',
    description: 'Crisp hand-dredged chicken thigh bathed in smoky habanero hot blossom honey, pickled purple cabbage slaw, sliced charred jalapeños, and whipped kewpie in an activated charcoal bun.',
    price: 19.00,
    image: '/src/assets/images/burger_crispy_duck_honey_1792861413219.jpg',
    badge: 'Popular Heat',
    calories: '780 kcal',
    prepTime: '10 min',
    rating: 4.8,
    ingredients: [
      'Double Buttermilk Dredged Crispy Thigh',
      'Smoked Habanero Blossom Hot Honey',
      'Cider Pickled Red Cabbage & Cilantro',
      'Japanese Whipped Herb Mayo',
      'Craft Obsidian Charcoal Bun'
    ],
    chefNote: 'Glazed tableside with warm hot honey infusion right out of the cast iron kettle.',
    customizable: true,
    options: {
      doneness: ['Crispy Tender'],
      bun: ['Seeded Charcoal Bun', 'Classic Sesame Brioche']
    }
  },
  {
    id: 'hero-atelier-supreme',
    name: 'The Grand Atelier Supreme',
    subname: 'Triple Smash Tower with Bone Marrow Glaze',
    category: 'smash',
    description: 'Three ultra-thin smashed patties layered with triple melted raclette, crispy shallot hay, torched bone marrow emulsion, and slow-stewed heirloom tomato chutney.',
    price: 24.50,
    image: '/src/assets/images/hero_artistic_smash_burger_1792861412573.jpg',
    badge: 'Ultimate Feast',
    calories: '1120 kcal',
    prepTime: '14 min',
    rating: 4.95,
    ingredients: [
      'Triple Smashed Prime Patties (270g total)',
      'Triple Melted Swiss Raclette',
      'Torched Roasted Bone Marrow Glaze',
      'Crispy Fried Shallot Haystack',
      'Heirloom Tomato Chutney & Baby Watercress'
    ],
    chefNote: 'Our most architectural burger, balancing decadent richness with acidic tomato notes.',
    customizable: true,
    options: {
      doneness: ['Chef Lacy Style', 'Well Seared'],
      bun: ['Artisanal Glazed Sesame Brioche']
    }
  },
  {
    id: 'sides-rosemary-parmesan-fries',
    name: 'Rosemary & Reggiano Hand-Cuts',
    subname: 'Triple-Cooked Idaho Russet Potatoes',
    category: 'sides',
    description: 'Hand-cut russet potatoes fried thrice in duck fat and cold-pressed sunflower oil, tossed with freshly picked sea-salt rosemary and 24-month Parmigiano-Reggiano flakes.',
    price: 8.50,
    image: '/src/assets/images/sides_rosemary_parmesan_fries_1792861414104.jpg',
    badge: 'Craft Side',
    calories: '420 kcal',
    prepTime: '6 min',
    rating: 4.9,
    ingredients: [
      'Hand-Cut Triple-Cooked Russet Potatoes',
      'Flaked Maldon Smoked Sea Salt',
      'Freshly Chiffonaded Mountain Rosemary',
      'Aged Parmigiano-Reggiano Ribbons',
      'Served with House Truffle Mayo Pot'
    ],
    chefNote: 'Boiled in vinegar brine first, then chilled before two-stage frying for glass-like crunch.',
    customizable: false
  },
  {
    id: 'shake-smoked-bourbon-vanilla',
    name: 'Smoked Madagascar Malt Shake',
    subname: 'Small-Batch Hand-Spun Gelato',
    category: 'beverages',
    description: 'Velvety organic cream hand-spun with real crushed Madagascar vanilla bean pods, roasted malt crunch, salted dark caramel drizzle, and a hint of charred oak essence.',
    price: 9.00,
    image: '/src/assets/images/sides_rosemary_parmesan_fries_1792861414104.jpg',
    badge: 'Liquid Dessert',
    calories: '510 kcal',
    prepTime: '4 min',
    rating: 4.85,
    ingredients: [
      'Heavy Farmhouse Whole Milk & Cream',
      'Pure Madagascar Vanilla Caviar',
      'Roasted Malted Barley Powder',
      'Dark Fleur De Sel Caramel Ribbon'
    ],
    chefNote: 'Spun to order in vintage Hamilton Beach malt mixers for ultra-dense velvet density.',
    customizable: false
  }
];

export const MOTION_REEL_CLIPS = [
  {
    id: 'reel-sizzle',
    title: 'The Cast Iron Smash',
    tag: '550°F Heat',
    description: 'Capturing the explosive Maillard reaction under high pressure steel press.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-juicy-beef-burger-patty-cooking-on-a-grill-41617-large.mp4',
    poster: '/src/assets/images/burger_smoked_saffron_smash_1792861412281.jpg'
  },
  {
    id: 'reel-flame',
    title: 'Binchotan Flame Sear',
    tag: 'Smoked Umami',
    description: 'White binchotan embers providing crisp smoky notes without bitterness.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: '/src/assets/images/burger_truffle_wagyu_1792861412306.jpg'
  },
  {
    id: 'reel-brioche',
    title: 'Brioche Steam & Toast',
    tag: 'Golden Crumb',
    description: 'French butter-basted artisan buns toasted on plancha until golden caramel.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-juicy-beef-burger-patty-cooking-on-a-grill-41617-large.mp4',
    poster: '/src/assets/images/hero_artistic_smash_burger_1792861412573.jpg'
  }
];
