import { getPool } from '../utils/db.js';
export async function createBooking(data) {
    const pool = getPool(process.env.DATABASE_URL);
    const result = await pool.query(`INSERT INTO bookings 
    (name, email, experience_id, experience_title, slot_id, date, timeslot, 
     people_count, amount, discount, final_amount, promo_code_applied)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`, [
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
    ]);
    return result.rows[0];
}
