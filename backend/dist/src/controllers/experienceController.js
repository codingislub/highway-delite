import { findAllExperiences, findExperienceById } from '../models/Experience.js';
export async function listExperiences(req, res) {
    try {
        const experiences = await findAllExperiences();
        res.json({ data: experiences });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
}
export async function getExperience(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });
        const experience = await findExperienceById(id);
        if (!experience)
            return res.status(404).json({ error: 'Experience not found' });
        res.json({ data: experience });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch experience' });
    }
}
