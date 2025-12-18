import { Case, Item, Rarity } from './types';

// Extended Real skins data pool with 40+ new items
const REAL_SKINS = [
  // --- NEW HIGH TIER ADDITIONS ---
  { name: 'AWP | Medusa', price: 2800.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/awp-medusa.png' },
  { name: 'M4A4 | Poseidon', price: 1200.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/m4a4-poseidon.png' },
  { name: 'AK-47 | Fire Serpent', price: 900.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-fire-serpent.png' },
  { name: 'Glock-18 | Fade', price: 1500.00, rarity: Rarity.RESTRICTED, image: 'https://wiki.swapskins.com/storage/skins/img/glock-18-fade.png' },
  { name: 'MP9 | Wild Lily', price: 1400.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/mp9-wild-lily.png' },
  { name: 'M4A1-S | Welcome to the Jungle', price: 1800.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/m4a1-s-welcome-to-the-jungle.png' },
  { name: 'AWP | The Prince', price: 3100.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/awp-the-prince.png' },
  { name: 'AK-47 | Gold Arabesque', price: 2500.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-gold-arabesque.png' },
  { name: 'M4A1-S | Knight', price: 2100.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/m4a1-s-knight.png' },
  { name: 'AUG | Akihabara Accept', price: 1100.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/aug-akihabara-accept.png' },

  // --- NEW MID/LOW TIER ADDITIONS ---
  { name: 'AK-47 | Neon Rider', price: 45.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-neon-rider.png' },
  { name: 'AK-47 | Bloodsport', price: 60.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-bloodsport.png' },
  { name: 'M4A4 | The Emperor', price: 55.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/m4a4-the-emperor.png' },
  { name: 'M4A1-S | Golden Coil', price: 35.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/m4a1-s-golden-coil.png' },
  { name: 'USP-S | The Traitor', price: 25.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/usp-s-the-traitor.png' },
  { name: 'Glock-18 | Wasteland Rebel', price: 8.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/glock-18-wasteland-rebel.png' },
  { name: 'Desert Eagle | Code Red', price: 30.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/desert-eagle-code-red.png' },
  { name: 'AWP | Wildfire', price: 50.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/awp-wildfire.png' },
  { name: 'AWP | Oni Taiji', price: 200.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/awp-oni-taiji.png' },
  { name: 'M4A1-S | Decimator', price: 12.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/m4a1-s-decimator.png' },
  { name: 'AK-47 | Legion of Anubis', price: 15.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-legion-of-anubis.png' },
  { name: 'Glock-18 | Vogue', price: 6.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/glock-18-vogue.png' },
  { name: 'USP-S | Cortex', price: 5.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/usp-s-cortex.png' },
  { name: 'MAC-10 | Disco Tech', price: 8.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/mac-10-disco-tech.png' },
  { name: 'SSG 08 | Dragonfire', price: 14.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/ssg-08-dragonfire.png' },
  { name: 'P90 | Asiimov', price: 10.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/p90-asiimov.png' },
  { name: 'Galil AR | Chromatic Aberration', price: 4.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/galil-ar-chromatic-aberration.png' },
  { name: 'FAMAS | Commemoration', price: 12.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/famas-commemoration.png' },

  // --- KNIVES & GLOVES ADDITIONS ---
  { name: 'Karambit | Gamma Doppler', price: 1600.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/karambit-gamma-doppler-phase-1.png' },
  { name: 'M9 Bayonet | Lore', price: 1900.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/m9-bayonet-lore.png' },
  { name: 'Butterfly Knife | Slaughter', price: 1400.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/butterfly-knife-slaughter.png' },
  { name: 'Specialist Gloves | Crimson Kimono', price: 1300.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/specialist-gloves-crimson-kimono.png' },
  { name: 'Sport Gloves | Pandora\'s Box', price: 3500.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/sport-gloves-pandoras-box.png' },
  { name: 'Flip Knife | Autotronic', price: 350.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/flip-knife-autotronic.png' },
  { name: 'Ursus Knife | Marble Fade', price: 400.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/ursus-knife-marble-fade.png' },
  { name: 'Stiletto Knife | Tiger Tooth', price: 450.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/stiletto-knife-tiger-tooth.png' },
  { name: 'Huntsman Knife | Doppler', price: 300.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/huntsman-knife-doppler-phase-3.png' },
  { name: 'Falchion Knife | Fade', price: 280.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/falchion-knife-fade.png' },
  { name: 'Bowie Knife | Crimson Web', price: 250.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/bowie-knife-crimson-web.png' },
  { name: 'Navaja Knife | Safari Mesh', price: 65.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/navaja-knife-safari-mesh.png' },
  { name: 'Shadow Daggers | Rust Coat', price: 75.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/shadow-daggers-rust-coat.png' },
  { name: 'Gut Knife | Bright Water', price: 85.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/gut-knife-bright-water.png' },
  { name: 'Driver Gloves | Racing Green', price: 60.00, rarity: Rarity.GOLD, image: 'https://wiki.swapskins.com/storage/skins/img/driver-gloves-racing-green.png' },

  // --- EXISTING (Optimized) ---
  { name: 'AK-47 | Asiimov', price: 55.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-asiimov.png' },
  { name: 'USP-S | Kill Confirmed', price: 95.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/usp-s-kill-confirmed.png' },
  { name: 'M4A1-S | Printstream', price: 140.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/m4a1-s-printstream.png' },
  { name: 'Desert Eagle | Printstream', price: 75.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/desert-eagle-printstream.png' },
  { name: 'AK-47 | Vulcan', price: 220.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-vulcan.png' },
  { name: 'M4A4 | Neo-Noir', price: 18.00, rarity: Rarity.COVERT, image: 'https://wiki.swapskins.com/storage/skins/img/m4a4-neo-noir.png' },
  { name: 'AK-47 | Panthera Onca', price: 280.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-panthera-onca.png' },
  { name: 'M4A1-S | Blue Phosphor', price: 240.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/m4a1-s-blue-phosphor.png' },
  { name: 'AWP | Asiimov', price: 110.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/awp-asiimov.png' },
  { name: 'Glock-18 | Twilight Galaxy', price: 55.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/glock-18-twilight-galaxy.png' },
  { name: 'USP-S | Orion', price: 35.00, rarity: Rarity.CLASSIFIED, image: 'https://wiki.swapskins.com/storage/skins/img/usp-s-orion.png' },
  { name: 'Glock-18 | Water Elemental', price: 5.50, rarity: Rarity.RESTRICTED, image: 'https://wiki.swapskins.com/storage/skins/img/glock-18-water-elemental.png' },
  { name: 'M4A4 | Evil Daimyo', price: 2.50, rarity: Rarity.RESTRICTED, image: 'https://wiki.swapskins.com/storage/skins/img/m4a4-evil-daimyo.png' },
  { name: 'AWP | Atheris', price: 4.50, rarity: Rarity.RESTRICTED, image: 'https://wiki.swapskins.com/storage/skins/img/awp-atheris.png' },
  { name: 'AK-47 | Redline', price: 18.00, rarity: Rarity.RESTRICTED, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-redline.png' },
  { name: 'USP-S | Cyrex', price: 2.20, rarity: Rarity.RESTRICTED, image: 'https://wiki.swapskins.com/storage/skins/img/usp-s-cyrex.png' },
  { name: 'M4A1-S | Nitro', price: 1.80, rarity: Rarity.MIL_SPEC, image: 'https://wiki.swapskins.com/storage/skins/img/m4a1-s-nitro.png' },
  { name: 'USP-S | Guardian', price: 2.90, rarity: Rarity.MIL_SPEC, image: 'https://wiki.swapskins.com/storage/skins/img/usp-s-guardian.png' },
  { name: 'AWP | Mortis', price: 2.50, rarity: Rarity.MIL_SPEC, image: 'https://wiki.swapskins.com/storage/skins/img/awp-mortis.png' },
  { name: 'Glock-18 | Moonrise', price: 1.20, rarity: Rarity.MIL_SPEC, image: 'https://wiki.swapskins.com/storage/skins/img/glock-18-moonrise.png' },
  { name: 'AK-47 | Emerald Pinstripe', price: 3.20, rarity: Rarity.MIL_SPEC, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-emerald-pinstripe.png' },
  { name: 'P250 | Sand Dune', price: 0.03, rarity: Rarity.COMMON, image: 'https://wiki.swapskins.com/storage/skins/img/p250-sand-dune.png' },
  { name: 'MP9 | Storm', price: 0.04, rarity: Rarity.COMMON, image: 'https://wiki.swapskins.com/storage/skins/img/mp9-storm.png' },
  { name: 'Nova | Polar Mesh', price: 0.03, rarity: Rarity.COMMON, image: 'https://wiki.swapskins.com/storage/skins/img/nova-polar-mesh.png' },
  { name: 'AWP | Safari Mesh', price: 0.25, rarity: Rarity.INDUSTRIAL, image: 'https://wiki.swapskins.com/storage/skins/img/awp-safari-mesh.png' },
  { name: 'AK-47 | Safari Mesh', price: 0.35, rarity: Rarity.INDUSTRIAL, image: 'https://wiki.swapskins.com/storage/skins/img/ak-47-safari-mesh.png' },
];

export const getRealItem = (targetRarity?: Rarity, minPrice = 0, forceCheap = false): Item => {
  let pool = REAL_SKINS.filter(s => {
    if (targetRarity && s.rarity !== targetRarity) return false;
    if (forceCheap && s.price > 1.0) return false;
    if (!forceCheap && minPrice > 0 && s.price < minPrice) return false;
    return true;
  });

  if (pool.length === 0) {
      if (targetRarity === Rarity.GOLD) {
          pool = REAL_SKINS.filter(s => s.rarity === Rarity.GOLD); 
      } else if (targetRarity === Rarity.COVERT) {
          pool = REAL_SKINS.filter(s => s.rarity === Rarity.COVERT);
      } else if (targetRarity === Rarity.COMMON) {
          pool = REAL_SKINS.filter(s => s.rarity === Rarity.COMMON);
      } else {
          pool = REAL_SKINS.filter(s => s.price >= minPrice);
      }
  }
  
  if (pool.length === 0) pool = REAL_SKINS.filter(s => s.rarity === Rarity.COMMON); 

  const template = pool[Math.floor(Math.random() * pool.length)];
  
  const variance = (Math.random() * 0.1) - 0.05; 
  let finalPrice = Math.max(0.01, parseFloat((template.price * (1 + variance)).toFixed(2)));
  let finalName = template.name;

  const isSpecial = template.name.includes('Gloves') || template.name.includes('Wraps') || template.name.includes('Knife') || template.name.includes('Karambit') || template.name.includes('Bayonet') || template.name.includes('Daggers');
  if (!isSpecial && Math.random() < 0.10) {
      finalName = `StatTrak™ ${finalName}`;
      finalPrice = parseFloat((finalPrice * 1.5).toFixed(2));
  }

  if (minPrice > 0) finalPrice = Math.max(finalPrice, minPrice);

  return {
    id: '', 
    name: finalName,
    price: finalPrice,
    rarity: template.rarity,
    image: template.image
  };
};

const generateItems = (caseId: string, count: number, priceTier: 'cheap' | 'mid' | 'high' | 'knife' = 'mid'): Item[] => {
  const items: Item[] = [];
  
  for (let i = 0; i < count; i++) {
    let rarity;
    const r = Math.random();
    
    if (priceTier === 'cheap') {
       if (r < 0.85) rarity = Rarity.COMMON;
       else if (r < 0.96) rarity = Rarity.INDUSTRIAL;
       else if (r < 0.99) rarity = Rarity.MIL_SPEC;
       else rarity = Rarity.RESTRICTED;
    } else if (priceTier === 'high') {
       if (r < 0.20) rarity = Rarity.RESTRICTED;
       else if (r < 0.50) rarity = Rarity.CLASSIFIED;
       else if (r < 0.90) rarity = Rarity.COVERT;
       else rarity = Rarity.GOLD;
    } else if (priceTier === 'knife') {
       rarity = Rarity.GOLD; // Only Gold
    } else {
       if (r < 0.65) rarity = Rarity.MIL_SPEC;
       else if (r < 0.90) rarity = Rarity.RESTRICTED;
       else if (r < 0.98) rarity = Rarity.CLASSIFIED;
       else if (r < 0.998) rarity = Rarity.COVERT; 
       else rarity = Rarity.GOLD; 
    }

    const item = getRealItem(rarity, 0, rarity === Rarity.COMMON);
    items.push({ ...item, id: `${caseId}_item_${i}` });
  }
  return items.sort((a, b) => a.price - b.price);
};

// Case Generator
const createCases = (): Case[] => {
    // Reliable images for generated cases (Fixed)
    const CASE_IMAGES = [
        'https://wiki.swapskins.com/storage/cases/img/revolution-case.png',
        'https://wiki.swapskins.com/storage/cases/img/recoil-case.png',
        'https://wiki.swapskins.com/storage/cases/img/dreams-and-nightmares-case.png',
        'https://wiki.swapskins.com/storage/cases/img/fracture-case.png',
        'https://wiki.swapskins.com/storage/cases/img/prisma-2-case.png',
        'https://wiki.swapskins.com/storage/cases/img/cs20-case.png',
        'https://wiki.swapskins.com/storage/cases/img/shattered-web-case.png',
        'https://wiki.swapskins.com/storage/cases/img/danger-zone-case.png',
        'https://wiki.swapskins.com/storage/cases/img/horizon-case.png',
        'https://wiki.swapskins.com/storage/cases/img/clutch-case.png',
        'https://wiki.swapskins.com/storage/cases/img/spectrum-2-case.png',
        'https://wiki.swapskins.com/storage/cases/img/hydra-case.png',
        'https://wiki.swapskins.com/storage/cases/img/spectrum-case.png',
        'https://wiki.swapskins.com/storage/cases/img/glove-case.png',
        'https://wiki.swapskins.com/storage/cases/img/gamma-2-case.png'
    ];

    const baseCases: Case[] = [
        { id: 'cheap1', name: 'Penny Case', price: 0.30, image: 'https://wiki.swapskins.com/storage/cases/img/clutch-case.png', items: generateItems('cheap1', 25, 'cheap') },
        { id: 'cheap2', name: 'Sand Dune Box', price: 0.50, image: 'https://wiki.swapskins.com/storage/cases/img/gamma-case.png', items: generateItems('cheap2', 20, 'cheap') },
        { id: 'cheap3', name: 'Budget Loader', price: 0.99, image: 'https://wiki.swapskins.com/storage/cases/img/chroma-3-case.png', items: generateItems('cheap3', 18, 'cheap') },
        
        { id: 'c1', name: 'Winter Offensive', price: 2.50, image: 'https://wiki.swapskins.com/storage/cases/img/winter-offensive-weapon-case.png', items: generateItems('c1', 15, 'mid') },
        { id: 'c2', name: 'Operation Bravo', price: 15.00, image: 'https://wiki.swapskins.com/storage/cases/img/operation-bravo-case.png', items: generateItems('c2', 15, 'mid') },
        { id: 'c3', name: 'Huntsman', price: 3.99, image: 'https://wiki.swapskins.com/storage/cases/img/huntsman-weapon-case.png', items: generateItems('c3', 15, 'mid') },
        { id: 'c7', name: 'Clutch', price: 8.00, image: 'https://wiki.swapskins.com/storage/cases/img/clutch-case.png', items: generateItems('c7', 15, 'mid') },
        { id: 'c11', name: 'CS20', price: 12.00, image: 'https://wiki.swapskins.com/storage/cases/img/cs20-case.png', items: generateItems('c11', 14, 'mid') },
        { id: 'c14', name: 'Snakebite', price: 24.50, image: 'https://wiki.swapskins.com/storage/cases/img/snakebite-case.png', items: generateItems('c14', 12, 'high') },
        { id: 'c15', name: 'Imba Premium', price: 99.00, image: 'https://wiki.swapskins.com/storage/cases/img/glove-case.png', items: generateItems('c15', 10, 'high').map(i => ({...i, price: parseFloat((i.price * 1.2).toFixed(2))})) },
        
        // Knife Case (Beefed up with all knives)
        { id: 'knife_case', name: 'Knife Guarantee', price: 150.00, image: 'https://wiki.swapskins.com/storage/cases/img/csgo-weapon-case.png', items: generateItems('knife_case', 25, 'knife') }
    ];

    // Procedurally generate 20 more cases
    const adjectives = ['Frosty', 'Burning', 'Toxic', 'Neon', 'Cyber', 'Ancient', 'Hidden', 'Omega', 'Prime', 'Savage'];
    const nouns = ['Box', 'Crate', 'Stash', 'Vault', 'Container', 'Drop', 'Cache'];
    
    for (let i = 0; i < 20; i++) {
        const name = `${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]} ${i+1}`;
        const tier = i % 3 === 0 ? 'cheap' : (i % 3 === 1 ? 'mid' : 'high');
        const basePrice = tier === 'cheap' ? 0.40 : (tier === 'mid' ? 3.50 : 35.00);
        const price = parseFloat((basePrice * (0.8 + Math.random())).toFixed(2));
        
        // Ensure image rotation is safe and diverse
        const imgIndex = i % CASE_IMAGES.length;
        
        baseCases.push({
            id: `gen_${i}`,
            name,
            price,
            image: CASE_IMAGES[imgIndex],
            items: generateItems(`gen_${i}`, 15, tier)
        });
    }

    return baseCases.sort((a,b) => a.price - b.price);
};

export const CASES: Case[] = createCases();

export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: 'border-rarity-common text-rarity-common shadow-rarity-common/20',
  [Rarity.INDUSTRIAL]: 'border-rarity-industrial text-rarity-industrial shadow-rarity-industrial/20',
  [Rarity.MIL_SPEC]: 'border-rarity-milspec text-rarity-milspec shadow-rarity-milspec/20',
  [Rarity.RESTRICTED]: 'border-rarity-restricted text-rarity-restricted shadow-rarity-restricted/20',
  [Rarity.CLASSIFIED]: 'border-rarity-classified text-rarity-classified shadow-rarity-classified/20',
  [Rarity.COVERT]: 'border-rarity-covert text-rarity-covert shadow-rarity-covert/20',
  [Rarity.GOLD]: 'border-rarity-gold text-rarity-gold shadow-rarity-gold/20',
  [Rarity.CASE]: 'border-yellow-500 text-yellow-500 shadow-yellow-500/20',
};

export const RARITY_BG: Record<Rarity, string> = {
  [Rarity.COMMON]: 'bg-rarity-common',
  [Rarity.INDUSTRIAL]: 'bg-rarity-industrial',
  [Rarity.MIL_SPEC]: 'bg-rarity-milspec',
  [Rarity.RESTRICTED]: 'bg-rarity-restricted',
  [Rarity.CLASSIFIED]: 'bg-rarity-classified',
  [Rarity.COVERT]: 'bg-rarity-covert',
  [Rarity.GOLD]: 'bg-rarity-gold',
  [Rarity.CASE]: 'bg-yellow-500',
};

export const UPGRADE_TARGETS = generateItems('upgrade_pool', 60, 'high');
