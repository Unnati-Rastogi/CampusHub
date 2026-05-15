import { collection, doc, setDoc, getDocs, writeBatch, query } from 'firebase/firestore';

/**
 * CampusHub — Firestore Seed Data
 */

export const seedClubs = [
  {
    id: 'byte-club-nie',
    name: 'The BYTE Club NIE',
    slug: 'byte-club-nie',
    category: 'Technology',
    tagline: 'Building Technical Expertise for Tomorrow’s Tech Enthusiasts',
    description: 'The BYTE Club NIE is a student-driven technical community focused on building practical skills, fostering innovation, and encouraging collaborative learning among technology enthusiasts. The club organizes workshops, technical sessions, and hands-on activities aimed at empowering students with industry-relevant knowledge and problem-solving abilities.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=byte&backgroundColor=0ea5e9',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop',
    tags: ["Technology", "Programming", "Workshops", "Innovation", "Technical Skills"],
    facultyCoordinator: 'Prof. Tech Guru',
    contactEmail: 'byteclub@nie.ac.in',
    memberCount: 120,
    foundedYear: 2021,
    socialLinks: { instagram: 'https://instagram.com', github: 'https://github.com' },
    recentActivities: [],
  },
  {
    id: 'ieee-nie',
    name: 'NIE IEEE Student Branch',
    slug: 'ieee-nie',
    category: 'Technical Society',
    tagline: 'Advancing Technology Through Innovation and Collaboration',
    description: 'NIE IEEE Student Branch is one of the most active technical student communities at NIE, dedicated to promoting innovation, technical excellence, and professional growth. The branch conducts workshops, competitions, seminars, and flagship technical events while encouraging students to explore emerging technologies and collaborative learning.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=ieee&backgroundColor=0284c7',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop',
    tags: ["IEEE", "Electronics", "Innovation", "Technical Events", "Workshops"],
    facultyCoordinator: 'Dr. Innovation',
    contactEmail: 'ieee@nie.ac.in',
    memberCount: 200,
    foundedYear: 2015,
    socialLinks: { instagram: 'https://instagram.com', website: 'https://ieee.org' },
    recentActivities: [],
  },
  {
    id: 'anvaya-iucee',
    name: 'Anvaya NIE IUCEE Student Chapter',
    slug: 'anvaya-iucee',
    category: 'Interdisciplinary',
    tagline: 'Connecting Ideas, Innovation, and Collaborative Learning',
    description: 'Anvaya NIE IUCEE Student Chapter is an interdisciplinary student community focused on peer-to-peer learning, real-time project collaboration, and innovation-driven development. The chapter brings together students from diverse domains to work on impactful ideas, technical exploration, and collaborative learning experiences.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=anvaya&backgroundColor=10b981',
    banner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop',
    tags: ["Interdisciplinary", "Projects", "Innovation", "Collaboration", "Peer Learning"],
    facultyCoordinator: 'Prof. Collaboration',
    contactEmail: 'anvaya@nie.ac.in',
    memberCount: 85,
    foundedYear: 2022,
    socialLinks: { instagram: 'https://instagram.com' },
    recentActivities: [],
  },
  {
    id: 'credit-circle',
    name: 'Credit Circle',
    slug: 'credit-circle',
    tagline: 'Empowering financial literacy',
    description: 'Credit Circle is the dedicated finance club of NIE, focused on promoting financial literacy and awareness among students. The club organizes discussions, sessions, and activities centered around market trends, economics, investing, and the evolving financial landscape.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=creditcircle&backgroundColor=10b981',
    banner: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&auto=format&fit=crop',
    tags: ['Finance', 'Economics', 'Investing', 'Market Trends'],
    facultyCoordinator: 'Shashank Sir',
    contactEmail: 'creditcircle@nie.ac.in',
    memberCount: 95,
    foundedYear: 2024,
    socialLinks: { instagram: 'https://instagram.com' },
    president: { name: 'Rahul', year: '3rd Year', department: 'AIML' },
    recentActivities: [],
  },
  {
    id: 'rotaract-club',
    name: 'Rotaract Club',
    slug: 'rotaract-club',
    tagline: 'Service above self',
    description: 'The Rotaract Club of NIE, in association with Rotary Metro Mysore, is committed to community engagement, leadership, and social impact. The club conducts social service initiatives, networking events, and collaborative activities that help students connect with professionals and contribute meaningfully to society.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=rotaract&backgroundColor=ec4899',
    banner: 'https://images.unsplash.com/photo-1593113580332-ceb48858dbaf?w=900&auto=format&fit=crop',
    tags: ['Social Service', 'Leadership', 'Networking', 'Community Engagement'],
    facultyCoordinator: 'Sanjay Sir',
    contactEmail: 'rotaract@nie.ac.in',
    memberCount: 150,
    foundedYear: 2025,
    socialLinks: { instagram: 'https://instagram.com' },
    president: { name: 'Vishaak Thimmiah', year: '2nd Year', department: 'Mechanical' },
    recentActivities: [],
  },
  {
    id: '4th-wall',
    name: '4th Wall',
    slug: '4th-wall',
    tagline: 'Breaking barriers through visual storytelling',
    description: '4th Wall is the cinematography and photography club of NIE, bringing together students passionate about visual storytelling and creative media. The club explores areas such as acting, filmmaking, editing, script writing, and photography through collaborative projects and creative productions.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=4thwall&backgroundColor=eab308',
    banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop',
    tags: ['Photography', 'Cinematography', 'Filmmaking', 'Editing', 'Acting', 'Creative Media'],
    facultyCoordinator: 'Lakshmikant Sir',
    contactEmail: '4thwall@nie.ac.in',
    memberCount: 75,
    foundedYear: 2026,
    socialLinks: { instagram: 'https://instagram.com' },
    president: { name: 'Renuka', year: '2nd Year', department: 'AIML' },
    recentActivities: [],
  },
  {
    id: 'issa-nie',
    name: 'ISSA NIE',
    slug: 'issa-nie',
    tagline: 'Empowering Cyber Minds, Forging Secure Futures: ISSA NIE Student Chapter',
    description: 'ISSA NIE is a student chapter focused on cybersecurity, networking, and digital forensics. We aim to empower students with the knowledge and skills needed to forge secure futures.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=issa&backgroundColor=0d9488',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop',
    tags: ['Coding', 'Hackathon'],
    facultyCoordinator: 'Dr. Cyber Sec',
    president: { name: 'DEENA KIRAN M K', department: 'ISE', year: '3rd Year' },
    contactEmail: 'issa@nie.ac.in',
    memberCount: 232,
    foundedYear: 2023,
    socialLinks: { instagram: 'https://instagram.com/issa_nie' },
    recentActivities: [],
  },
];

export const seedEvents = [];

export const seedHalls = [
  { id: 'azeez-sait-hall', name: 'Azeez Sait Hall', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop', capacity: 120, location: 'GJB, South Campus', facilities: ['AC', 'Projector'] },
  { id: 'sir-mv-hall', name: 'Sir MV Hall', image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800&auto=format&fit=crop', capacity: 120, location: 'GJB, South Campus', facilities: ['AC', 'Projector', 'Whiteboard'] },
  { id: 'radha-krishna-hall', name: 'Radha Krishna Hall', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop', capacity: 250, location: 'Admin Building, South Campus', facilities: ['AC', 'Sound System', 'Projector'] },
  { id: 'north-auditorium', name: 'North Auditorium', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop', capacity: 180, location: 'Lab Building, North Campus', facilities: ['AC', 'Projector', 'Sound System'] },
];

/**
 * Helper to delete all documents in a collection (Batch)
 */
async function clearCollection(db, collectionName) {
  try {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  } catch (err) {
    console.error(`Error clearing ${collectionName}:`, err);
  }
}

/**
 * Browser-based seed function.
 */
export async function runSeed(db, options = { clearFirst: false }) {
  if (options.clearFirst) {
    await clearCollection(db, 'clubs');
    await clearCollection(db, 'halls');
    await clearCollection(db, 'events');
  }

  let clubsCount = 0;
  for (const club of seedClubs) {
    await setDoc(doc(db, 'clubs', club.id || club.slug), {
      ...club,
      updatedAt: new Date().toISOString()
    });
    clubsCount++;
  }

  let hallsCount = 0;
  for (const hall of seedHalls) {
    await setDoc(doc(db, 'halls', hall.id), {
      ...hall,
      isAvailable: true,
      updatedAt: new Date().toISOString()
    });
    hallsCount++;
  }

  let eventsCount = 0;
  for (const event of seedEvents) {
    await setDoc(doc(db, 'events', event.id || event.slug), {
      ...event,
      updatedAt: new Date().toISOString()
    });
    eventsCount++;
  }

  return { clubs: clubsCount, halls: hallsCount, events: eventsCount };
}
