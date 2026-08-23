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
        profile_image VARCHAR(512),
        bio TEXT,
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
    const [existingCities] = await conn.query('SELECT * FROM Cities');
    if (existingCities.length === 0) {
        await conn.query(`INSERT INTO Cities (name, country) VALUES 
            ('Paris', 'France'), 
            ('Tokyo', 'Japan'), 
            ('New York', 'USA'),
            ('London', 'UK'),
            ('Rome', 'Italy')
        `);
        
        const [cities] = await conn.query('SELECT * FROM Cities');
        for (const city of cities) {
            await conn.query(`INSERT INTO GlobalActivities (city_id, name, category, estimated_cost) VALUES 
                (?, ?, 'Sightseeing', 25.00),
                (?, ?, 'Food', 50.00),
                (?, ?, 'Adventure', 100.00)
            `, [city.city_id, `Guided Tour of ${city.name}`, city.city_id, `Local Tasting in ${city.name}`, city.city_id, `Extreme Sports in ${city.name}`]);
        }
        console.log('Seed data inserted.');
    }
    
    await conn.end();
  } catch (err) {
    console.error('Failed to init DB:', err);
  }
}

initDB();
