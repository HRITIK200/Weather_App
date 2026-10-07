-- 🌤️ Weather App Database Schema (PostgreSQL)

-- 1. Search History Table
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    country VARCHAR(10) NOT NULL,
    temperature NUMERIC(5, 2) NOT NULL,
    weather_desc VARCHAR(100) NOT NULL,
    icon VARCHAR(20),
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON search_history (searched_at DESC);

-- 2. Favorite / Pinned Cities Table
CREATE TABLE IF NOT EXISTS favorite_cities (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100),
    country VARCHAR(10) NOT NULL,
    region VARCHAR(30) DEFAULT 'custom',
    lat NUMERIC(9, 6),
    lon NUMERIC(9, 6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial Indian Metros and Global Hubs
INSERT INTO favorite_cities (city_name, state, country, region, lat, lon)
VALUES 
    -- Indian Metros & State Capitals
    ('Delhi', 'Delhi NCT', 'IN', 'india', 28.6139, 77.2090),
    ('Mumbai', 'Maharashtra', 'IN', 'india', 19.0760, 72.8777),
    ('Bengaluru', 'Karnataka', 'IN', 'india', 12.9716, 77.5946),
    ('Hyderabad', 'Telangana', 'IN', 'india', 17.3850, 78.4867),
    ('Chennai', 'Tamil Nadu', 'IN', 'india', 13.0827, 80.2707),
    ('Kolkata', 'West Bengal', 'IN', 'india', 22.5726, 88.3639),
    ('Jaipur', 'Rajasthan', 'IN', 'india', 26.9124, 75.7873),
    ('Ahmedabad', 'Gujarat', 'IN', 'india', 23.0225, 72.5714),
    ('Pune', 'Maharashtra', 'IN', 'india', 18.5204, 73.8567),
    ('Lucknow', 'Uttar Pradesh', 'IN', 'india', 26.8467, 80.9462),
    ('Chandigarh', 'Punjab / Haryana', 'IN', 'india', 30.7333, 76.7794),
    ('Kochi', 'Kerala', 'IN', 'india', 9.9312, 76.2673),
    ('Panaji', 'Goa', 'IN', 'india', 15.4909, 73.8278),
    ('Bhopal', 'Madhya Pradesh', 'IN', 'india', 23.2599, 77.4126),
    ('Patna', 'Bihar', 'IN', 'india', 25.5941, 85.1376),
    ('Bhubaneswar', 'Odisha', 'IN', 'india', 20.2961, 85.8245),
    ('Guwahati', 'Assam', 'IN', 'india', 26.1445, 91.7362),
    ('Shimla', 'Himachal Pradesh', 'IN', 'india', 31.1048, 77.1734),
    ('Srinagar', 'Jammu & Kashmir', 'IN', 'india', 34.0837, 74.7973),
    ('Dehradun', 'Uttarakhand', 'IN', 'india', 30.3165, 78.0322),
    -- Global Hubs
    ('London', 'England', 'GB', 'global', 51.5074, -0.1278),
    ('New York', 'New York', 'US', 'global', 40.7128, -74.0060),
    ('Tokyo', 'Tokyo', 'JP', 'global', 35.6762, 139.6503),
    ('Dubai', 'Dubai', 'AE', 'global', 25.2048, 55.2708),
    ('Singapore', 'Singapore', 'SG', 'global', 1.3521, 103.8198)
ON CONFLICT (city_name) DO NOTHING;
