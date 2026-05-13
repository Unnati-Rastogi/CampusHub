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
    contactEmail: 'codecraft@campushub.edu',
    memberCount: 143,
    foundedYear: 2018,
    socialLinks: { instagram: 'https://instagram.com', github: 'https://github.com', website: 'https://campushub.edu/codecraft' },
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
    contactEmail: 'lenslight@campushub.edu',
    memberCount: 87,
    foundedYear: 2019,
    socialLinks: { instagram: 'https://instagram.com', website: 'https://campushub.edu/lenslight' },
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
    contactEmail: 'roboverse@campushub.edu',
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
    contactEmail: 'rhythmnation@campushub.edu',
    memberCount: 110,
    foundedYear: 2017,
    socialLinks: { instagram: 'https://instagram.com' },
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
  { id: 'main-auditorium', name: 'Main Auditorium', image: 'https://images.unsplash.com/photo-1596005554384-d293674c91d4?w=800&auto=format&fit=crop', capacity: 800, location: 'Administrative Block, Ground Floor', facilities: ['AC', 'Projector', 'Sound System'] },
  { id: 'black-box-theatre', name: 'Black Box Theatre', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop', capacity: 150, location: 'Arts Block, Floor 2', facilities: ['Stage Lighting', 'Sound System'] },
  { id: 'innovation-lab', name: 'Innovation Lab', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop', capacity: 120, location: 'Block C, Floor 3', facilities: ['High-Speed WiFi', 'Projector'] },
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
