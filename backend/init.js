const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    console.log('Connected to MySQL server.');

    await conn.query('CREATE DATABASE IF NOT EXISTS globe_trotter');
    console.log('Database globe_trotter ensured.');
    
    await conn.query('USE globe_trotter');

    // WARNING: This script drops all tables to reset the schema for development
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('DROP TABLE IF EXISTS Activities');
    await conn.query('DROP TABLE IF EXISTS Stops');
    await conn.query('DROP TABLE IF EXISTS Trips');
    await conn.query('DROP TABLE IF EXISTS Users');
    await conn.query('DROP TABLE IF EXISTS GlobalActivities');
    await conn.query('DROP TABLE IF EXISTS Cities');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        profile_image VARCHAR(512),
        bio TEXT,
        language_preference VARCHAR(50) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await conn.query(createTableQuery);
    console.log('Table Users ensured.');

    const createTripsTable = `
      CREATE TABLE IF NOT EXISTS Trips (
        trip_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        is_public BOOLEAN DEFAULT FALSE,
        cover_photo VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
      )
    `;
    await conn.query(createTripsTable);
    console.log('Table Trips ensured.');

    const createStopsTable = `
      CREATE TABLE IF NOT EXISTS Stops (
        stop_id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        city VARCHAR(255) NOT NULL,
        dates VARCHAR(255),
        info TEXT,
        budget_estimate DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_id) REFERENCES Trips(trip_id) ON DELETE CASCADE
      )
    `;
    await conn.query(createStopsTable);
    console.log('Table Stops ensured.');

    const createActivitiesTable = `
      CREATE TABLE IF NOT EXISTS Activities (
        activity_id INT AUTO_INCREMENT PRIMARY KEY,
        stop_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        time VARCHAR(50),
        cost DECIMAL(10, 2) DEFAULT 0.00,
        FOREIGN KEY (stop_id) REFERENCES Stops(stop_id) ON DELETE CASCADE
      )
    `;
    await conn.query(createActivitiesTable);
    console.log('Table Activities ensured.');

    // Catalog tables for Search Page
    const createCitiesTable = `
      CREATE TABLE IF NOT EXISTS Cities (
        city_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        image_url VARCHAR(512)
      )
    `;
    await conn.query(createCitiesTable);
    console.log('Table Cities ensured.');

    const createGlobalActivitiesTable = `
      CREATE TABLE IF NOT EXISTS GlobalActivities (
        global_activity_id INT AUTO_INCREMENT PRIMARY KEY,
        city_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
        FOREIGN KEY (city_id) REFERENCES Cities(city_id) ON DELETE CASCADE
      )
    `;
    await conn.query(createGlobalActivitiesTable);
    console.log('Table GlobalActivities ensured.');

    // Seed Data
    console.log('Seeding data...');
    const bcrypt = require('bcryptjs');

    const [existingAdmins] = await conn.query('SELECT * FROM Users WHERE email = ?', ['admin@globetrotter.app']);
    if (existingAdmins.length === 0) {
        const hash = await bcrypt.hash('admin123', 10);
        await conn.query('INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', ['Admin', 'admin@globetrotter.app', hash, 'admin']);
        console.log('Admin user seeded (admin@globetrotter.app / admin123).');
    }

    const [existingUsers] = await conn.query('SELECT * FROM Users WHERE email = ?', ['john@example.com']);
    if (existingUsers.length === 0) {
        const hash = await bcrypt.hash('password123', 10);
        await conn.query(`INSERT INTO Users (name, email, password_hash, role, bio) VALUES 
            ('John Doe', 'john@example.com', ?, 'user', 'Avid traveler and food enthusiast.'),
            ('Jane Smith', 'jane@example.com', ?, 'user', 'Looking for the next big adventure!'),
            ('Raj Patel', 'raj@example.com', ?, 'user', 'Photography and culture explorer.')
        `, [hash, hash, hash]);
        console.log('Dummy users seeded (password: password123).');
    }

    const [existingCities] = await conn.query('SELECT * FROM Cities');
    if (existingCities.length === 0) {
        await conn.query(`INSERT INTO Cities (name, country) VALUES 
            ('Delhi', 'India'), ('Mumbai', 'India'), ('Goa', 'India'), ('Jaipur', 'India'), ('Bangalore', 'India'),
            ('Paris', 'France'), ('Tokyo', 'Japan'), ('New York', 'USA'), ('London', 'UK'), ('Rome', 'Italy'),
            ('Bali', 'Indonesia'), ('Dubai', 'UAE'), ('Sydney', 'Australia'), ('Cape Town', 'South Africa'), ('Rio de Janeiro', 'Brazil')
        `);
        
        const [cities] = await conn.query('SELECT * FROM Cities');
        for (const city of cities) {
            await conn.query(`INSERT INTO GlobalActivities (city_id, name, category, estimated_cost) VALUES 
                (?, ?, 'Sightseeing', 500.00),
                (?, ?, 'Food', 1200.00),
                (?, ?, 'Adventure', 2500.00),
                (?, ?, 'Relaxation', 800.00)
            `, [
                city.city_id, `Guided Tour of ${city.name}`, 
                city.city_id, `Local Tasting in ${city.name}`, 
                city.city_id, `Exciting Activity in ${city.name}`,
                city.city_id, `Spa & Wellness in ${city.name}`
            ]);
        }
        console.log('Global Cities and Activities seeded.');

        // Seed Trips, Stops, and Activities
        const [users] = await conn.query("SELECT user_id FROM Users WHERE role = 'user'");
        
        if (users.length >= 3) {
            const user1 = users[0].user_id;
            const user2 = users[1].user_id;
            const user3 = users[2].user_id;

            // Trip 1: John's Euro Trip (Public)
            const [trip1] = await conn.query(`INSERT INTO Trips (user_id, name, description, start_date, end_date, is_public, cover_photo) VALUES 
                (?, 'Euro Summer 2026', 'Backpacking across Europe with friends.', '2026-06-10', '2026-06-25', TRUE, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a')`, 
                [user1]);
            
            const trip1Id = trip1.insertId;
            const [stop1] = await conn.query(`INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, 'Paris', 'June 10-15', 50000)`, [trip1Id]);
            const [stop2] = await conn.query(`INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, 'Rome', 'June 15-20', 45000)`, [trip1Id]);
            
            await conn.query(`INSERT INTO Activities (stop_id, name, category, time, cost) VALUES 
                (?, 'Eiffel Tower Visit', 'Sightseeing', '10:00 AM', 2500),
                (?, 'Louvre Museum', 'Sightseeing', '02:00 PM', 1500),
                (?, 'Colosseum Tour', 'Sightseeing', '09:00 AM', 3000),
                (?, 'Pasta Making Class', 'Food', '05:00 PM', 4000)
            `, [stop1.insertId, stop1.insertId, stop2.insertId, stop2.insertId]);

            // Trip 2: Jane's Asian Adventure (Private)
            const [trip2] = await conn.query(`INSERT INTO Trips (user_id, name, description, start_date, end_date, is_public, cover_photo) VALUES 
                (?, 'Asian Adventure', 'Solo trip exploring the east.', '2026-09-01', '2026-09-15', FALSE, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf')`, 
                [user2]);
            
            const trip2Id = trip2.insertId;
            const [stop3] = await conn.query(`INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, 'Tokyo', 'Sep 1-8', 80000)`, [trip2Id]);
            const [stop4] = await conn.query(`INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, 'Bali', 'Sep 8-15', 30000)`, [trip2Id]);
            
            await conn.query(`INSERT INTO Activities (stop_id, name, category, time, cost) VALUES 
                (?, 'Mt. Fuji Hike', 'Adventure', '06:00 AM', 5000),
                (?, 'Sushi Tasting', 'Food', '07:00 PM', 8000),
                (?, 'Ubud Monkey Forest', 'Sightseeing', '11:00 AM', 500),
                (?, 'Scuba Diving', 'Adventure', '09:00 AM', 6000)
            `, [stop3.insertId, stop3.insertId, stop4.insertId, stop4.insertId]);

            // Trip 3: Raj's India Tour (Public)
            const [trip3] = await conn.query(`INSERT INTO Trips (user_id, name, description, start_date, end_date, is_public, cover_photo) VALUES 
                (?, 'Incredible India', 'Exploring the heritage and beaches.', '2026-11-05', '2026-11-20', TRUE, 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da')`, 
                [user3]);
            
            const trip3Id = trip3.insertId;
            const [stop5] = await conn.query(`INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, 'Delhi', 'Nov 5-10', 20000)`, [trip3Id]);
            const [stop6] = await conn.query(`INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, 'Jaipur', 'Nov 10-15', 25000)`, [trip3Id]);
            const [stop7] = await conn.query(`INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, 'Goa', 'Nov 15-20', 35000)`, [trip3Id]);
            
            await conn.query(`INSERT INTO Activities (stop_id, name, category, time, cost) VALUES 
                (?, 'Red Fort Visit', 'Sightseeing', '10:00 AM', 500),
                (?, 'Chandni Chowk Food Tour', 'Food', '06:00 PM', 1500),
                (?, 'Amer Fort Elephant Ride', 'Adventure', '08:00 AM', 2000),
                (?, 'Baga Beach Party', 'Relaxation', '09:00 PM', 3000)
            `, [stop5.insertId, stop5.insertId, stop6.insertId, stop7.insertId]);

            // Trip 4: John's Weekend Getaway (Private)
            const [trip4] = await conn.query(`INSERT INTO Trips (user_id, name, description, start_date, end_date, is_public, cover_photo) VALUES 
                (?, 'Weekend in New York', 'Quick business and leisure trip.', '2026-07-04', '2026-07-06', FALSE, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9')`, 
                [user1]);
            
            const trip4Id = trip4.insertId;
            const [stop8] = await conn.query(`INSERT INTO Stops (trip_id, city, dates, budget_estimate) VALUES (?, 'New York', 'July 4-6', 40000)`, [trip4Id]);
            await conn.query(`INSERT INTO Activities (stop_id, name, category, time, cost) VALUES 
                (?, 'Broadway Show', 'Sightseeing', '08:00 PM', 12000),
                (?, 'Central Park Walk', 'Relaxation', '10:00 AM', 0)
            `, [stop8.insertId, stop8.insertId]);

            console.log('Sample trips, stops, and activities seeded.');
        }
    }
    
    await conn.end();
  } catch (err) {
    console.error('Failed to init DB:', err);
  }
}

initDB();
