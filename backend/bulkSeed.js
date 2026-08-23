const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const NUM_USERS = 20;
const NUM_TRIPS = 50;

const citiesList = [
    { name: 'Delhi', country: 'India' }, { name: 'Mumbai', country: 'India' },
    { name: 'Goa', country: 'India' }, { name: 'Jaipur', country: 'India' },
    { name: 'Bangalore', country: 'India' }, { name: 'Kolkata', country: 'India' },
    { name: 'Chennai', country: 'India' }, { name: 'Hyderabad', country: 'India' },
    { name: 'Paris', country: 'France' }, { name: 'Lyon', country: 'France' },
    { name: 'Tokyo', country: 'Japan' }, { name: 'Kyoto', country: 'Japan' },
    { name: 'New York', country: 'USA' }, { name: 'Los Angeles', country: 'USA' },
    { name: 'London', country: 'UK' }, { name: 'Manchester', country: 'UK' },
    { name: 'Rome', country: 'Italy' }, { name: 'Venice', country: 'Italy' },
    { name: 'Bali', country: 'Indonesia' }, { name: 'Jakarta', country: 'Indonesia' },
    { name: 'Dubai', country: 'UAE' }, { name: 'Abu Dhabi', country: 'UAE' },
    { name: 'Sydney', country: 'Australia' }, { name: 'Melbourne', country: 'Australia' },
    { name: 'Cape Town', country: 'South Africa' }, { name: 'Johannesburg', country: 'South Africa' },
    { name: 'Rio de Janeiro', country: 'Brazil' }, { name: 'São Paulo', country: 'Brazil' },
    { name: 'Cairo', country: 'Egypt' }, { name: 'Istanbul', country: 'Turkey' }
];

const firstNames = ['John', 'Jane', 'Raj', 'Priya', 'Michael', 'Sarah', 'David', 'Emma', 'Ali', 'Fatima', 'Chen', 'Wei', 'Carlos', 'Maria', 'Alex', 'Elena'];
const lastNames = ['Doe', 'Smith', 'Patel', 'Sharma', 'Johnson', 'Williams', 'Brown', 'Jones', 'Khan', 'Ahmed', 'Wang', 'Li', 'Garcia', 'Martinez', 'Ivanov', 'Petrov'];
const coverPhotos = [
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'
];
const tripAdjectives = ['Amazing', 'Epic', 'Unforgettable', 'Relaxing', 'Adventurous', 'Budget', 'Luxury', 'Solo', 'Family'];
const tripNouns = ['Getaway', 'Tour', 'Vacation', 'Holiday', 'Backpacking', 'Escape', 'Roadtrip', 'Journey'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function bulkSeed() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'globe_trotter'
        });
        console.log('Connected to MySQL server. Starting bulk seed...');

        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        await conn.query('TRUNCATE TABLE Activities');
        await conn.query('TRUNCATE TABLE Stops');
        await conn.query('TRUNCATE TABLE Trips');
        await conn.query('TRUNCATE TABLE Users');
        await conn.query('TRUNCATE TABLE GlobalActivities');
        await conn.query('TRUNCATE TABLE Cities');
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Tables truncated.');

        // Seed Admin
        const adminHash = await bcrypt.hash('admin123', 10);
        await conn.query('INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', ['Admin', 'admin@globetrotter.app', adminHash, 'admin']);
        console.log('Admin user seeded.');

        // Seed Users
        const userHash = await bcrypt.hash('password123', 10);
        const userIds = [];
        for (let i = 0; i < NUM_USERS; i++) {
            const name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
            const email = `user${i}@example.com`;
            const [res] = await conn.query('INSERT INTO Users (name, email, password_hash, role, bio) VALUES (?, ?, ?, ?, ?)', 
                [name, email, userHash, 'user', `Hi, I am ${name} and I love to travel!`]);
            userIds.push(res.insertId);
        }
        console.log(`${NUM_USERS} users seeded.`);

        // Seed Cities and Global Activities
        const cityIds = [];
        for (const city of citiesList) {
            const [res] = await conn.query('INSERT INTO Cities (name, country) VALUES (?, ?)', [city.name, city.country]);
            const cityId = res.insertId;
            cityIds.push({ id: cityId, name: city.name });

            await conn.query(`INSERT INTO GlobalActivities (city_id, name, category, estimated_cost) VALUES 
                (?, ?, 'Sightseeing', ?),
                (?, ?, 'Food', ?),
                (?, ?, 'Adventure', ?),
                (?, ?, 'Relaxation', ?)
            `, [
                cityId, `Guided Tour of ${city.name}`, getRandomInt(300, 1500),
                cityId, `Local Tasting in ${city.name}`, getRandomInt(500, 2500),
                cityId, `Exciting Activity in ${city.name}`, getRandomInt(1000, 5000),
                cityId, `Spa & Wellness in ${city.name}`, getRandomInt(800, 3000)
            ]);
        }
        console.log(`${citiesList.length} cities and global activities seeded.`);

        // Seed Trips
        for (let i = 0; i < NUM_TRIPS; i++) {
            const userId = getRandomItem(userIds);
            const isPublic = Math.random() > 0.3; // 70% chance to be public
            const coverPhoto = getRandomItem(coverPhotos);
            
            const city1 = getRandomItem(cityIds);
            const city2 = getRandomItem(cityIds);

            const tripName = `${getRandomItem(tripAdjectives)} ${getRandomItem(tripNouns)} to ${city1.name}`;
            
            // Random start date between Jan 1 2026 and Dec 31 2026
            const startDate = new Date(2026, getRandomInt(0, 11), getRandomInt(1, 28));
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + getRandomInt(3, 14));

            const [tripRes] = await conn.query(
                'INSERT INTO Trips (user_id, name, description, start_date, end_date, is_public, cover_photo) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, tripName, `An amazing trip planned to explore new places and cultures.`, startDate, endDate, isPublic, coverPhoto]
            );
            const tripId = tripRes.insertId;

            // Seed Stops
            const numStops = getRandomInt(1, 4);
            let currentStopDate = new Date(startDate);

            for (let j = 0; j < numStops; j++) {
                const stopCity = getRandomItem(cityIds);
                const stopEndDate = new Date(currentStopDate);
                stopEndDate.setDate(currentStopDate.getDate() + getRandomInt(1, 4));

                const datesStr = `${currentStopDate.toLocaleString('default', { month: 'short' })} ${currentStopDate.getDate()} - ${stopEndDate.toLocaleString('default', { month: 'short' })} ${stopEndDate.getDate()}`;

                const [stopRes] = await conn.query(
                    'INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, ?, ?, ?)',
                    [tripId, stopCity.name, datesStr, getRandomInt(10000, 50000)]
                );
                const stopId = stopRes.insertId;

                // Seed Activities for Stop
                const numActivities = getRandomInt(1, 5);
                for (let k = 0; k < numActivities; k++) {
                    const categories = ['Sightseeing', 'Food', 'Adventure', 'Relaxation', 'Transit'];
                    const category = getRandomItem(categories);
                    const cost = getRandomInt(0, 5000);
                    const time = `${getRandomInt(8, 20)}:00`;
                    
                    await conn.query(
                        'INSERT INTO Activities (stop_id, name, category, time, cost) VALUES (?, ?, ?, ?, ?)',
                        [stopId, `${category} in ${stopCity.name}`, category, time, cost]
                    );
                }

                currentStopDate = stopEndDate;
            }
        }
        console.log(`${NUM_TRIPS} trips seeded along with stops and activities.`);

        await conn.end();
        console.log('Bulk seeding completed successfully.');
    } catch (err) {
        console.error('Failed to run bulk seed:', err);
    }
}

bulkSeed();
