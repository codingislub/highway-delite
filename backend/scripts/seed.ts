import dotenv from 'dotenv';
import { getPool, initDB } from '../src/utils/db.js';

dotenv.config();

async function run() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error('DATABASE_URL not set');
  
  await initDB(uri);
  const pool = getPool(uri);

  const experiences = [
    {
      title: 'Sunrise Hot Air Balloon Ride',
      location: 'Cappadocia, Turkey',
      description:
        'Float over the fairy chimneys at sunrise and enjoy panoramic views with a gentle landing breakfast.',
      price_per_person: 250,
      image_url:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      rating: 4.9,
      reviews_count: 312,
      slots: [
        { slot_id: 'slot-1', date: '2025-11-05', timeslot: '05:00 - 07:00', capacity: 8 },
        { slot_id: 'slot-2', date: '2025-11-06', timeslot: '05:00 - 07:00', capacity: 8 },
        { slot_id: 'slot-3', date: '2025-11-07', timeslot: '05:00 - 07:00', capacity: 4 },
      ],
    },
    {
      title: 'Northern Lights Snowmobile Safari',
      location: 'Tromsø, Norway',
      description:
        'Chase the aurora borealis across frozen lakes and pristine forests with expert guides.',
      price_per_person: 180,
      image_url:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop',
      rating: 4.8,
      reviews_count: 221,
      slots: [
        { slot_id: 'slot-1', date: '2025-12-10', timeslot: '21:00 - 23:00', capacity: 10 },
        { slot_id: 'slot-2', date: '2025-12-11', timeslot: '21:00 - 23:00', capacity: 10 },
      ],
    },
    {
      title: 'City Cycling and Food Tour',
      location: 'Kyoto, Japan',
      description:
        'Discover hidden alleys, local markets, and taste authentic street food while cycling through Kyoto.',
      price_per_person: 75,
      image_url:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
      rating: 4.7,
      reviews_count: 540,
      slots: [
        { slot_id: 'slot-1', date: '2025-11-15', timeslot: '09:00 - 12:00', capacity: 12 },
        { slot_id: 'slot-2', date: '2025-11-16', timeslot: '09:00 - 12:00', capacity: 12 },
      ],
    },
  ];

  // Clear existing data
  await pool.query('DELETE FROM bookings');
  await pool.query('DELETE FROM slots');
  await pool.query('DELETE FROM experiences');
  await pool.query('ALTER SEQUENCE experiences_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE slots_id_seq RESTART WITH 1');

  // Insert experiences and slots
  for (const exp of experiences) {
    const result = await pool.query(
      `INSERT INTO experiences (title, location, description, price_per_person, image_url, rating, reviews_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [exp.title, exp.location, exp.description, exp.price_per_person, exp.image_url, exp.rating, exp.reviews_count]
    );
    const experienceId = result.rows[0].id;

    for (const slot of exp.slots) {
      await pool.query(
        `INSERT INTO slots (experience_id, slot_id, date, timeslot, capacity)
         VALUES ($1, $2, $3, $4, $5)`,
        [experienceId, slot.slot_id, slot.date, slot.timeslot, slot.capacity]
      );
    }
  }

  console.log('✓ Seeded', experiences.length, 'experiences');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
