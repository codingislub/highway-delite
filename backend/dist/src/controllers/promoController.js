import { z } from 'zod';
const PromoSchema = z.object({
    code: z.string().trim().toUpperCase(),
    amount: z.number().positive().optional(),
});
export function validatePromo(codeRaw) {
    const code = codeRaw.toUpperCase();
    if (code === 'SAVE10')
        return { valid: true, type: 'PERCENT', value: 10 };
    if (code === 'FLAT100')
        return { valid: true, type: 'FLAT', value: 100 };
    return { valid: false, message: 'Invalid promo code' };
}
export async function validatePromoHandler(req, res) {
    try {
        const body = PromoSchema.safeParse(req.body);
        if (!body.success)
            return res.status(400).json({ error: 'Invalid payload' });
        const result = validatePromo(body.data.code);
        res.json({ data: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to validate promo' });
    }
}
