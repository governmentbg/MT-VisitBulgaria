const fs = require('fs');
const path = require('path');

const NUM_MOCK_ITEMS = 10000;
const SUPPORTED_LOCALES = ['en', 'bg', 'de', 'ru', 'el'];

console.log(`🚀 Generating ${NUM_MOCK_ITEMS} mock items for Bulgaria tourism app...\n`);
console.log(`📍 Supported locales: ${SUPPORTED_LOCALES.join(', ')}\n`);

const startTime = Date.now();

// Sample audio files for testing (bundled with app)
const SAMPLE_AUDIO_FILES = [
  {
    name: 'H_Audio',
    duration: 180,
    transcription: [
      {startTime: 0, endTime: 30, text: 'Welcome to this historic site. This audio guide will take you through the fascinating history and significance of this landmark.'},
      {startTime: 30, endTime: 60, text: 'Built in the early centuries, this structure has witnessed countless historical events and has been a symbol of Bulgarian heritage.'},
      {startTime: 60, endTime: 90, text: 'Notice the intricate architectural details that reflect the cultural influences of the time period.'},
      {startTime: 90, endTime: 120, text: 'The site has been carefully preserved and restored to maintain its original splendor.'},
      {startTime: 120, endTime: 150, text: 'As you explore, take time to appreciate the craftsmanship that went into every detail.'},
      {startTime: 150, endTime: 180, text: 'Thank you for visiting. We hope you enjoyed this audio guide of this magnificent Bulgarian landmark.'},
    ],
  },
  {
    name: 'DE_Audio',
    duration: 240,
    transcription: [
      {startTime: 0, endTime: 40, text: 'Welcome to one of Bulgaria\'s most treasured destinations. This guide will help you discover its secrets.'},
      {startTime: 40, endTime: 80, text: 'The area is known for its unique geological formations and rich biodiversity.'},
      {startTime: 80, endTime: 120, text: 'Local legends speak of ancient civilizations that once inhabited these lands.'},
      {startTime: 120, endTime: 160, text: 'Today, the site attracts visitors from around the world who come to experience its natural beauty.'},
      {startTime: 160, endTime: 200, text: 'Conservation efforts have helped preserve this area for future generations.'},
      {startTime: 200, endTime: 240, text: 'We hope this audio guide has enhanced your visit. Safe travels!'},
    ],
  },
];

// Localized attraction names per locale
const ATTRACTION_NAMES = {
  en: [
    'Alexander Nevsky Cathedral', 'Rila Monastery', 'Ancient Theatre of Plovdiv',
    'Tsarevets Fortress', 'Belogradchik Rocks', 'Seven Rila Lakes',
    'Vitosha Mountain', 'Stone Forest', 'Devetashka Cave', 'Buzludzha Monument',
  ],
  bg: [
    'Александър Невски Катедрала', 'Рилски Манастир', 'Древен театър Пловдив',
    'Крепост Царевец', 'Белоградчишки скали', 'Седемте Рилски езера',
    'Планина Витоша', 'Каменна гора', 'Пещера Деветашка', 'Паметник Бузлуджа',
  ],
  de: [
    'Alexander-Newski-Kathedrale', 'Rila-Kloster', 'Antikes Theater Philippopolis',
    'Festung Zarewez', 'Felsenformationen Belogradchik', 'Sieben Rila-Seen',
    'Berg Vitosha', 'Steinwald', 'Höhle Devetashka', 'Buzludzha-Denkmal',
  ],
  ru: [
    'Кафедральный собор Александра Невского', 'Рильский монастырь', 'Древний театр Филипполя',
    'Крепость Царевец', 'Скалы Белоградчика', 'Семь Рильских озер',
    'Гора Витоша', 'Каменный лес', 'Пещера Девета', 'Памятник Бузлуджа',
  ],
  el: [
    'Καθεδρικός Ναός Αλέξανδρος Νέφσκι', 'Μονή Ρήλα', 'Αρχαίο Θέατρο Φιλιππούπολης',
    'Κρεπίδωμα Τσαρέβετς', 'Βράχια Μπελογράντσικ', 'Επτά Λίμνες Ρήλας',
    'Όρος Βιτόσα', 'Δάσος Πετρών', 'Σπήλαιο Ντεβετάσκα', 'Μνημείο Μπουζλούτζα',
  ],
};

// Localized event names per locale
const EVENT_NAMES = {
  en: [
    'Sofia Music Weeks', 'Plovdiv Jazz Festival', 'Rose Festival',
    'Kukeri Festival', 'International Film Festival', 'Summer Theatre Festival',
  ],
  bg: [
    'Софийски музикални седмици', 'Фестивал джаз Пловдив', 'Фестивал на розата',
    'Кукерски карнавал', 'Международен филмов фестивал', 'Летен театрален фестивал',
  ],
  de: [
    'Sofia Musikwochen', 'Plovdiv Jazzfestival', 'Rosenfestival',
    'Kukeri-Fest', 'Internationales Filmfestival', 'Sommertheater-Festival',
  ],
  ru: [
    'Софийские музыкальные недели', 'Плевенский джаз-фестиваль', 'Фестиваль роз',
    'Фестиваль Кукери', 'Международный кинофестиваль', 'Летний театральный фестиваль',
  ],
  el: [
    'Εβδομάδες Μουσικής Σόφιας', 'Φεστιβάλ Τζαζ Πλόβντιβ', 'Φεστιβάλ Τριαντάφυλλου',
    'Φεστιβάλ Κουκέρι', 'Διεθνές Φεστιβάλ Κινηματογράφου', 'Θερινό Θεατρικό Φεστιβάλ',
  ],
};

// Localized descriptions per locale
const DESCRIPTIONS = {
  en: [
    'A stunning example of Bulgarian architecture and cultural heritage.',
    'Experience the rich history and breathtaking views of this iconic landmark.',
    'Discover the ancient traditions and stories preserved in this magnificent site.',
    'Immerse yourself in the natural beauty and cultural significance of this destination.',
  ],
  bg: [
    'Отличен пример на българската архитектура и културно наследство.',
    'Преживейте богатата история и дъхливи гледки на този икониден паметник.',
    'Откройте древните традиции и истории, запазени в този величествен обект.',
    'Потопете се в природната красота и културната значимост на тази дестинация.',
  ],
  de: [
    'Ein hervorragendes Beispiel bulgarischer Architektur und Kulturgut.',
    'Erleben Sie die reiche Geschichte und atemberaubenden Ausblicke dieses Wahrzeichens.',
    'Entdecken Sie die alten Traditionen und Geschichten in diesem prächtigen Ort.',
    'Tauchen Sie in die Naturschönheit und kulturelle Bedeutung dieses Ziels ein.',
  ],
  ru: [
    'Потрясающий пример болгарской архитектуры и культурного наследия.',
    'Испытайте богатую историю и захватывающие виды этого знакового памятника.',
    'Откройте для себя древние традиции и истории, сохраненные на этом великолепном объекте.',
    'Погрузитесь в природную красоту и культурную значимость этого направления.',
  ],
  el: [
    'Ένα εξαιρετικό παράδειγμα βουλγαρικής αρχιτεκτονικής και πολιτιστικής κληρονομιάς.',
    'Βιώστε τη πλούσια ιστορία και τις καταπληκτικές θέες αυτού του χαρακτηριστικού σημείου.',
    'Ανακαλύψτε τις αρχαίες παραδόσεις και ιστορίες που διατηρούνται σε αυτό το μεγαλοπρεπές μέρος.',
    'Βουτηθείτε στη φυσική ομορφιά και πολιτιστική σημασία αυτού του προορισμού.',
  ],
};

// Mock Categories (English names - could be localized too)
const MOCK_CATEGORIES = [
  {id: 'cat-1', name: 'Cultural Heritage', type: 'cultural', icon: 'bank', color: '#9C27B0'},
  {id: 'cat-2', name: 'Nature & Parks', type: 'nature', icon: 'pine-tree', color: '#4CAF50'},
  {id: 'cat-3', name: 'Historical Sites', type: 'historical', icon: 'castle', color: '#795548'},
  {id: 'cat-4', name: 'Religious Sites', type: 'religious', icon: 'church', color: '#FFB300'},
  {id: 'cat-5', name: 'Entertainment', type: 'entertainment', icon: 'theater', color: '#E91E63'},
  {id: 'cat-6', name: 'Food & Dining', type: 'food', icon: 'silverware-fork-knife', color: '#FF5722'},
  {id: 'cat-7', name: 'Shopping', type: 'shopping', icon: 'shopping', color: '#00BCD4'},
  {id: 'cat-8', name: 'Museums & Galleries', type: 'museum', icon: 'bank-outline', color: '#3F51B5'},
];

// Bulgaria Regions
const BULGARIA_REGIONS = [
  {name: 'Sofia', lat: 42.6977, lng: 23.3219, radius: 0.15},
  {name: 'Plovdiv', lat: 42.1354, lng: 24.7453, radius: 0.12},
  {name: 'Varna', lat: 43.2141, lng: 27.9147, radius: 0.1},
  {name: 'Burgas', lat: 42.5048, lng: 27.4626, radius: 0.1},
  {name: 'Ruse', lat: 43.8564, lng: 25.9656, radius: 0.08},
  {name: 'Bansko', lat: 41.8388, lng: 23.4883, radius: 0.05},
  {name: 'Nessebar', lat: 42.6589, lng: 27.7361, radius: 0.03},
  {name: 'Sozopol', lat: 42.4173, lng: 27.6953, radius: 0.03},
  {name: 'Veliko Tarnovo', lat: 43.0757, lng: 25.6172, radius: 0.08},
  {name: 'Rila Monastery', lat: 42.1334, lng: 23.3406, radius: 0.05},
];

// Calculate base counts
const ATTRACTIONS_PER_LOCALE = Math.floor(NUM_MOCK_ITEMS * 0.7);
const EVENTS_PER_LOCALE = Math.floor(NUM_MOCK_ITEMS * 0.3);

function generateBulgarianCoordinate() {
  if (Math.random() < 0.8 && BULGARIA_REGIONS.length > 0) {
    const region = BULGARIA_REGIONS[Math.floor(Math.random() * BULGARIA_REGIONS.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * region.radius;
    return {
      latitude: region.lat + Math.cos(angle) * distance,
      longitude: region.lng + Math.sin(angle) * distance,
    };
  }
  return {
    latitude: 41.2 + Math.random() * 3.0,
    longitude: 22.3 + Math.random() * 6.3,
  };
}

// Predefined stable image URLs with tourism-themed seeds
const PREDEFINED_IMAGES = [
  'https://picsum.photos/id/1011/800/600.webp',
  'https://picsum.photos/id/1012/900/700.webp',
  'https://picsum.photos/id/1013/1000/750.webp',
  'https://picsum.photos/id/914/850/650.webp',
  'https://picsum.photos/id/1015/950/700.webp',
  'https://picsum.photos/id/1016/800/600.webp',
  'https://picsum.photos/id/87/900/650.webp',
  'https://picsum.photos/id/1018/1000/800.webp',
  'https://picsum.photos/id/1019/850/700.webp',
  'https://picsum.photos/id/1020/950/750.webp',
];

function generateImageUrls(count) {
  const images = [];
  for (let i = 0; i < count; i++) {
    // Pick from predefined images randomly
    const imageUrl = PREDEFINED_IMAGES[Math.floor(Math.random() * PREDEFINED_IMAGES.length)];
    images.push(imageUrl);
  }
  return images;
}

// Helper: Generate localized content for all locales
function generateLocalizedContent(nameSource, descriptionIndex) {
  const locales = {};
  
  SUPPORTED_LOCALES.forEach(locale => {
    const names = nameSource[locale] || nameSource.en;
    const name = names[Math.floor(Math.random() * names.length)];
    const descriptions = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
    const description = descriptions[descriptionIndex % descriptions.length];
    
    locales[locale] = {
      name,
      description,
    };
  });
  
  return locales;
}


function generateAudioGuideSections(id) {
  const hasAudioGuides = Math.random() < 0.7;
  
  if (!hasAudioGuides) {
    return undefined;
  }

  // Some attractions have multiple sections
  const hasMultipleSections = Math.random() < 0.3;
  
  if (!hasMultipleSections) {
    // Single section with 1-2 guides
    const guideCount = Math.random() < 0.7 ? 1 : 2;
    const guides = [];
    
    for (let i = 0; i < guideCount; i++) {
      const sample = SAMPLE_AUDIO_FILES[i % SAMPLE_AUDIO_FILES.length];
      guides.push({
        id: `audio-${id}-overview-${i}`,
        title: i === 0 ? 'Main Tour' : 'Extended Tour',
        description: i === 0 ? 'General overview and highlights' : 'In-depth exploration with more details',
        url: `asset:///${sample.name}.mp3`,
        duration: sample.duration,
        transcription: sample.transcription,
        language: 'en',
        fileSize: sample.duration * 128000 / 8,
        hasDRM: false,
        isLocalAsset: true,
        order: i,
      });
    }
    
    return [{
      id: `section-${id}-overview`,
      title: 'Overview',
      description: 'Introduction to this landmark',
      guides: guides,
      order: 0,
    }];
  }
  
  // Multiple sections with various guides
  const sections = [];
  
  // Overview section
  const overviewSample = SAMPLE_AUDIO_FILES[0];
  sections.push({
    id: `section-${id}-overview`,
    title: 'Overview',
    description: 'General introduction and highlights',
    guides: [{
      id: `audio-${id}-overview-0`,
      title: 'Quick Tour',
      description: 'A brief 3-minute introduction',
      url: `asset:///${overviewSample.name}.mp3`,
      duration: overviewSample.duration,
      transcription: overviewSample.transcription,
      language: 'en',
      fileSize: overviewSample.duration * 128000 / 8,
      hasDRM: false,
      isLocalAsset: true,
      order: 0,
    }],
    order: 0,
  });
  
  // Detailed section with multiple guides
  const detailSample = SAMPLE_AUDIO_FILES[1];
  sections.push({
    id: `section-${id}-detailed`,
    title: 'Detailed Tours',
    description: 'In-depth exploration of specific features',
    guides: [
      {
        id: `audio-${id}-detailed-0`,
        title: 'Architecture & Design',
        description: 'Architectural features and construction history',
        url: `asset:///${detailSample.name}.mp3`,
        duration: detailSample.duration,
        transcription: detailSample.transcription,
        language: 'en',
        fileSize: detailSample.duration * 128000 / 8,
        hasDRM: false,
        isLocalAsset: true,
        order: 0,
      },
      {
        id: `audio-${id}-detailed-1`,
        title: 'Historical Significance',
        description: 'The role this site played in Bulgarian history',
        url: `asset:///${overviewSample.name}.mp3`,
        duration: overviewSample.duration,
        transcription: overviewSample.transcription,
        language: 'en',
        fileSize: overviewSample.duration * 128000 / 8,
        hasDRM: false,
        isLocalAsset: true,
        order: 1,
      },
    ],
    order: 1,
  });
  
  return sections;
}

function generateAttraction(id) {
  const category = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
  const createdDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  const updatedDate = new Date(createdDate.getTime() + Math.random() * 180 * 24 * 60 * 60 * 1000);
  
  const descIdx = Math.floor(Math.random() * DESCRIPTIONS.en.length);
  const locales = generateLocalizedContent(ATTRACTION_NAMES, descIdx);

  return {
    // Payload CMS fields
    id: `attraction-${id}`,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
    
    // App model fields - use English by default
    name: locales.en.name + ' ' + id,
    description: locales.en.description,
    location: generateBulgarianCoordinate(),
    category,
    audioGuides: generateAudioGuideSections(id),
    images: generateImageUrls(3 + Math.floor(Math.random() * 3)),
    rating: 3 + Math.random() * 2,
    visitDuration: 30 + Math.floor(Math.random() * 150),
    address: `Street ${id}, Bulgaria`,
    openingHours: '09:00 - 18:00',
    ticketPrice: Math.random() < 0.5 ? Math.floor(Math.random() * 50) : undefined,
    website: `https://example.com/attraction-${id}`,
    phone: `+359 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
    
    // Localized content - maps locale code to localized fields
    locales: {
      en: {...locales.en, id: `attraction-${id}`},
      bg: {...locales.bg, id: `attraction-${id}`},
      de: {...locales.de, id: `attraction-${id}`},
      ru: {...locales.ru, id: `attraction-${id}`},
      el: {...locales.el, id: `attraction-${id}`},
    },
  };
}

function generateEvent(id) {
  const category = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
  const createdDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  const updatedDate = new Date(createdDate.getTime() + Math.random() * 180 * 24 * 60 * 60 * 1000);
  
  const descIdx = Math.floor(Math.random() * DESCRIPTIONS.en.length);
  const locales = generateLocalizedContent(EVENT_NAMES, descIdx);
  
  const now = new Date();
  const statusRoll = Math.random();
  let startDate, endDate, status;

  if (statusRoll < 0.3) {
    endDate = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    startDate = new Date(endDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    status = 'past';
  } else if (statusRoll < 0.5) {
    startDate = new Date(now.getTime() - Math.random() * 15 * 24 * 60 * 60 * 1000);
    endDate = new Date(now.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000);
    status = 'active';
  } else {
    startDate = new Date(now.getTime() + Math.random() * 180 * 24 * 60 * 60 * 1000);
    endDate = new Date(startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    status = 'upcoming';
  }

  return {
    // Payload CMS fields
    id: `event-${id}`,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
    
    // App model fields - use English by default
    name: locales.en.name + ' ' + id,
    description: locales.en.description,
    location: generateBulgarianCoordinate(),
    category,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status,
    images: generateImageUrls(2 + Math.floor(Math.random() * 3)),
    ticketPrice: Math.random() < 0.7 ? Math.floor(Math.random() * 100) : undefined,
    organizer: `Organization ${id}`,
    address: `Event Venue ${id}, Bulgaria`,
    website: `https://example.com/event-${id}`,
    phone: `+359 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
    
    // Localized content - maps locale code to localized fields
    locales: {
      en: {...locales.en, id: `event-${id}`},
      bg: {...locales.bg, id: `event-${id}`},
      de: {...locales.de, id: `event-${id}`},
      ru: {...locales.ru, id: `event-${id}`},
      el: {...locales.el, id: `event-${id}`},
    },
  };
}

console.log('📊 Generating attractions and events with embedded localization...\n');

// Generate a base ID counter
let attractionIdCounter = 1; // eslint-disable-line no-unused-vars
let eventIdCounter = 1; // eslint-disable-line no-unused-vars

// Generate attractions (single object per attraction with all locales embedded)
console.log(`📍 Generating ${ATTRACTIONS_PER_LOCALE} attractions...`);
const attractions = [];
for (let i = 1; i <= ATTRACTIONS_PER_LOCALE; i++) {
  attractions.push(generateAttraction(i));
  if (i % 200 === 0) console.log(`   Generated ${i} attractions...`);
}

// Generate events (single object per event with all locales embedded)
console.log(`📍 Generating ${EVENTS_PER_LOCALE} events...`);
const events = [];
for (let i = 1; i <= EVENTS_PER_LOCALE; i++) {
  events.push(generateEvent(i));
  if (i % 100 === 0) console.log(`   Generated ${i} events...`);
}

const output = {
  attractions,
  events,
  categories: MOCK_CATEGORIES,
  locales: SUPPORTED_LOCALES,
  generatedAt: new Date().toISOString(),
  stats: {
    totalLocales: SUPPORTED_LOCALES.length,
    totalAttractions: attractions.length,
    totalEvents: events.length,
    attractionsWithAudio: attractions.filter(a => a.audioGuides && a.audioGuides.length > 0).length,
    activeEvents: events.filter(e => e.status === 'active').length,
    upcomingEvents: events.filter(e => e.status === 'upcoming').length,
    pastEvents: events.filter(e => e.status === 'past').length,
  },
};

const outputPath = path.join(__dirname, '../src/services/api/mocks/generated-data.json');

console.log('\n💾 Saving to file...');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);

console.log('\n✅ Mock data generation complete!\n');
console.log('📈 Statistics:');
console.log(`   • Total Attractions: ${output.stats.totalAttractions}`);
console.log(`   • With Audio Guides: ${output.stats.attractionsWithAudio}`);
console.log(`   • Total Events: ${output.stats.totalEvents}`);
console.log(`   • Active Events: ${output.stats.activeEvents}`);
console.log(`   • Upcoming Events: ${output.stats.upcomingEvents}`);
console.log(`   • Past Events: ${output.stats.pastEvents}`);
console.log(`\n📁 Saved to: ${outputPath}`);
console.log(`⏱️  Generation time: ${duration}s\n`);
console.log('🎉 You can now run your app with mock data!');
