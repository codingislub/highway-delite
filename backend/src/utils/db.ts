import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(uri: string): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: uri,
      ssl: uri.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function initDB(uri: string) {
  const pool = getPool(uri);
  
  // Create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS experiences (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price_per_person DECIMAL(10,2) NOT NULL,
      image_url TEXT NOT NULL,
      rating DECIMAL(2,1) DEFAULT 4.7,
      reviews_count INTEGER DEFAULT 120,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS slots (
      id SERIAL PRIMARY KEY,
      experience_id INTEGER NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
      slot_id VARCHAR(50) NOT NULL,
      date VARCHAR(10) NOT NULL,
      timeslot VARCHAR(50) NOT NULL,
      capacity INTEGER NOT NULL CHECK (capacity >= 0),
      UNIQUE(experience_id, slot_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      experience_id INTEGER NOT NULL REFERENCES experiences(id),
      experience_title VARCHAR(255) NOT NULL,
      slot_id VARCHAR(50) NOT NULL,
      date VARCHAR(10) NOT NULL,
      timeslot VARCHAR(50) NOT NULL,
      people_count INTEGER NOT NULL CHECK (people_count >= 1),
      amount DECIMAL(10,2) NOT NULL,
      discount DECIMAL(10,2) DEFAULT 0,
      final_amount DECIMAL(10,2) NOT NULL,
      promo_code_applied VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_slots_experience ON slots(experience_id)
  `);

  console.log('✓ Database tables initialized');
  return pool;
}
