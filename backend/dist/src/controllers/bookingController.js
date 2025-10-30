import { z } from 'zod';
import { getPool } from '../utils/db.js';
import { findExperienceById } from '../models/Experience.js';
import { createBooking } from '../models/Booking.js';
const BookingSchema = z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    experienceId: z.number().int().positive().or(z.string().transform(Number)),
    slotId: z.string().min(1),
    peopleCount: z.number().int().min(1).max(10),
    promoCode: z.string().trim().toUpperCase().optional().or(z.literal('')),
});
export async function createBookingHandler(req, res) {
    const parsed = BookingSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid payload', details: parsed.error });
    const { name, email, experienceId, slotId, peopleCount, promoCode } = parsed.data;
    const expId = typeof experienceId === 'string' ? parseInt(experienceId) : experienceId;
    const pool = getPool(process.env.DATABASE_URL);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // 1) Fetch experience
        const experience = await findExperienceById(expId);
        if (!experience) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Experience not found' });
        }
        // 2) Find slot in memory
        const slot = experience.slots?.find((s) => s.slot_id === slotId);
        if (!slot) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Slot not found' });
        }
        // 3) Atomic capacity decrement with row lock
        const updateResult = await client.query(`UPDATE slots 
       SET capacity = capacity - $1 
       WHERE experience_id = $2 AND slot_id = $3 AND capacity >= $4
       RETURNING capacity`, [peopleCount, expId, slotId, peopleCount]);
        if (updateResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Selected slot is sold out or insufficient seats' });
        }
        // 4) Price calculation + promo
        const amount = experience.price_per_person * peopleCount;
        let discount = 0;
        let promoCodeApplied;
        if (promoCode) {
            const codeUp = promoCode.toUpperCase();
            if (codeUp === 'SAVE10') {
                discount = Math.round(amount * 0.1);
                promoCodeApplied = 'SAVE10';
            }
            else if (codeUp === 'FLAT100') {
                discount = 100;
                promoCodeApplied = 'FLAT100';
            }
        }
        const finalAmount = Math.max(0, amount - discount);
        // 5) Create booking
        const booking = await createBooking({
            name,
            email,
            experience_id: expId,
            experience_title: experience.title,
            slot_id: slotId,
            date: slot.date,
            timeslot: slot.timeslot,
            people_count: peopleCount,
            amount,
            discount,
            final_amount: finalAmount,
            promo_code_applied: promoCodeApplied,
        });
        await client.query('COMMIT');
        res.status(201).json({
            data: {
                bookingId: booking.id,
                finalAmount,
                experienceTitle: experience.title,
                date: slot.date,
                timeslot: slot.timeslot,
            },
        });
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
    finally {
        client.release();
    }
}
