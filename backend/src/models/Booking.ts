import { getPool } from '../utils/db.js';

export type Booking = {
  id: number;
  name: string;
  email: string;
  experience_id: number;
  experience_title: string;
  slot_id: string;
  date: string;
  timeslot: string;
  people_count: number;
  amount: number;
  discount: number;
  final_amount: number;
  promo_code_applied?: string;
  created_at: Date;
};

export async function createBooking(data: {
  name: string;
  email: string;
  experience_id: number;
  experience_title: string;
  slot_id: string;
  date: string;
  timeslot: string;
  people_count: number;
  amount: number;
  discount: number;
  final_amount: number;
  promo_code_applied?: string;
}) {
  const pool = getPool(process.env.DATABASE_URL!);
  const result = await pool.query(
    `INSERT INTO bookings 
    (name, email, experience_id, experience_title, slot_id, date, timeslot, 
     people_count, amount, discount, final_amount, promo_code_applied)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      data.name,
      data.email,
      data.experience_id,
      data.experience_title,
      data.slot_id,
      data.date,
      data.timeslot,
      data.people_count,
      data.amount,
      data.discount,
      data.final_amount,
      data.promo_code_applied || null,
    ]
  );
  return result.rows[0];
}
