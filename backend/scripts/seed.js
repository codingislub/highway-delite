import dotenv from 'dotenv';
import { connectToDB } from '../src/utils/db.js';
import { ExperienceModel } from '../src/models/Experience.js';
dotenv.config();
async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri)
        throw new Error('MONGODB_URI not set');
    await connectToDB(uri);
    const experiences = [
        {
            title: 'Sunrise Hot Air Balloon Ride',
            location: 'Cappadocia, Turkey',
            description: 'Float over the fairy chimneys at sunrise and enjoy panoramic views with a gentle landing breakfast.',
            pricePerPerson: 250,
            imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
            rating: 4.9,
            reviewsCount: 312,
            slots: [
                { _id: 'slot-1', date: '2025-11-05', timeslot: '05:00 - 07:00', capacity: 8 },
                { _id: 'slot-2', date: '2025-11-06', timeslot: '05:00 - 07:00', capacity: 8 },
                { _id: 'slot-3', date: '2025-11-07', timeslot: '05:00 - 07:00', capacity: 4 },
            ],
        },
        {
            title: 'Northern Lights Snowmobile Safari',
            location: 'Tromsø, Norway',
            description: 'Chase the aurora borealis across frozen lakes and pristine forests with expert guides.',
            pricePerPerson: 180,
            imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop',
            rating: 4.8,
            reviewsCount: 221,
            slots: [
                { _id: 'slot-1', date: '2025-12-10', timeslot: '21:00 - 23:00', capacity: 10 },
                { _id: 'slot-2', date: '2025-12-11', timeslot: '21:00 - 23:00', capacity: 10 },
            ],
        },
        {
            title: 'City Cycling and Food Tour',
            location: 'Kyoto, Japan',
            description: 'Discover hidden alleys, local markets, and taste authentic street food while cycling through Kyoto.',
            pricePerPerson: 75,
            imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
            rating: 4.7,
            reviewsCount: 540,
            slots: [
                { _id: 'slot-1', date: '2025-11-15', timeslot: '09:00 - 12:00', capacity: 12 },
                { _id: 'slot-2', date: '2025-11-16', timeslot: '09:00 - 12:00', capacity: 12 },
            ],
        },
    ];
    await ExperienceModel.deleteMany({});
    await ExperienceModel.insertMany(experiences);
    console.log('Seeded experiences:', experiences.length);
    process.exit(0);
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
