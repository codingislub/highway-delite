import { getPool } from '../utils/db.js';

export type Slot = { 
  id: number;
  slot_id: string; 
  date: string; 
  timeslot: string; 
  capacity: number;
};

export type Experience = {
  id: number;
  title: string;
  location: string;
  description: string;
  price_per_person: number;
  image_url: string;
  rating: number;
  reviews_count: number;
  slots?: Slot[];
};

export async function findAllExperiences() {
  const pool = getPool(process.env.DATABASE_URL!);
  const result = await pool.query(`
    SELECT 
      e.*,
      COALESCE(SUM(s.capacity), 0) as total_capacity
    FROM experiences e
    LEFT JOIN slots s ON e.id = s.experience_id
    GROUP BY e.id
    ORDER BY e.id
    LIMIT 100
  `);
  return result.rows;
}

export async function findExperienceById(id: number) {
  const pool = getPool(process.env.DATABASE_URL!);
  const expResult = await pool.query('SELECT * FROM experiences WHERE id = $1', [id]);
  if (expResult.rows.length === 0) return null;
  
  const slotsResult = await pool.query(
    'SELECT id, slot_id, date, timeslot, capacity FROM slots WHERE experience_id = $1 ORDER BY date, timeslot',
    [id]
  );
  
  return {
    ...expResult.rows[0],
    slots: slotsResult.rows,
  };
}
