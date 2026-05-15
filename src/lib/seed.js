import { collection, doc, setDoc, getDocs, writeBatch, query } from 'firebase/firestore';

/**
 * CampusHub — Firestore Seed Data
 */

export const seedClubs = [
  {
    id: 'codecraft-society',
    name: 'CodeCraft Society',
    slug: 'codecraft-society',
    tagline: 'Where logic meets creativity',
    description: 'CodeCraft is the go-to coding club for students passionate about software development, competitive programming, and open-source. We host hackathons, coding workshops, and tech talks every semester.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=codecraft&backgroundColor=0ea5e9',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop',
    tags: ['Coding', 'Hackathon', 'Open Source'],
    facultyCoordinator: 'Dr. Meena Sharma',
    contactEmail: 'codecraft@nie.ac.in',
    memberCount: 143,
    foundedYear: 2018,
    socialLinks: { instagram: 'https://instagram.com', github: 'https://github.com', website: 'https://nie.ac.in/codecraft' },
    recentActivities: [
      { id: '1', title: 'HackFest 2025', date: '2025-04-15', type: 'Hackathon' },
      { id: '2', title: 'Open Source Workshop', date: '2025-03-22', type: 'Workshop' },
    ],
  },
  {
    id: 'lens-light-photography',
    name: 'Lens & Light Photography',
    slug: 'lens-light-photography',
    tagline: 'Capturing stories one frame at a time',
    description: 'Lens & Light is for students who see the world differently. We explore portrait, street, nature, and event photography through collaborative shoots, critique sessions, and exhibitions.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=lenslight&backgroundColor=f59e0b',
    banner: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=900&auto=format&fit=crop',
    tags: ['Photography', 'Art', 'Visual Media'],
    facultyCoordinator: 'Prof. Arun Kapoor',
    contactEmail: 'lenslight@nie.ac.in',
    memberCount: 87,
    foundedYear: 2019,
    socialLinks: { instagram: 'https://instagram.com', website: 'https://nie.ac.in/lenslight' },
    recentActivities: [
      { id: '1', title: 'Campus Photo Walk', date: '2025-04-20', type: 'Event' },
    ],
  },
  {
    id: 'roboverse',
    name: 'Roboverse',
    slug: 'roboverse',
    tagline: 'Engineering the future, one bot at a time',
    description: 'Roboverse is a multidisciplinary club for budding roboticists and embedded systems enthusiasts.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=roboverse&backgroundColor=8b5cf6',
    banner: 'https://images.unsplash.com/photo-1561144257-e32e8506b5b3?w=900&auto=format&fit=crop',
    tags: ['Robotics', 'Coding', 'Engineering'],
    facultyCoordinator: 'Dr. Rajan Patel',
    contactEmail: 'roboverse@nie.ac.in',
    memberCount: 62,
    foundedYear: 2020,
    socialLinks: { instagram: 'https://instagram.com', github: 'https://github.com' },
    recentActivities: [],
  },
  {
    id: 'rhythm-nation',
    name: 'Rhythm Nation',
    slug: 'rhythm-nation',
    tagline: 'Feel the beat, own the floor',
    description: 'Rhythm Nation is the premier dance club on campus.',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=rhythmnation&backgroundColor=f43f5e',
    banner: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=900&auto=format&fit=crop',
    tags: ['Dance', 'Performing Arts'],
    facultyCoordinator: 'Ms. Priya Nair',
    contactEmail: 'rhythmnation@nie.ac.in',
    memberCount: 110,
    foundedYear: 2017,
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

export const seedEvents = [
  {
    id: 'hackfest-2025',
    title: 'HackFest 2025',
    slug: 'hackfest-2025',
    clubId: 'codecraft-society',
    clubName: 'CodeCraft Society',
    date: '2025-04-15T09:00:00',
    location: 'Main Auditorium',
    description: 'A 24-hour hackathon to solve real-world campus problems.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
    category: 'Technology',
    isFeatured: true,
  },
  {
    id: 'photo-walk',
    title: 'Campus Photo Walk',
    slug: 'photo-walk',
    clubId: 'lens-light-photography',
    clubName: 'Lens & Light Photography',
    date: '2025-04-20T16:00:00',
    location: 'Campus Garden',
    description: 'Explore the beauty of our campus through your lens.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
    category: 'Art',
    isFeatured: true,
  },
];

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
