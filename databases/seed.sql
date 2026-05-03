-- Seed Data for Smart Blood Donation System

-- Clear existing data
DELETE FROM donations;
DELETE FROM blood_requests;
DELETE FROM donor_profiles;
DELETE FROM users;

-- 1. Create Users
-- Passwords are 'password123' hashed with BCrypt
INSERT INTO users (id, name, email, password, phone, age, role) VALUES 
(1, 'Rahul Sharma', 'rahul@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uCyQ5a', '9876543210', 25, 'DONOR'),
(2, 'Priya Mani', 'priya@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uCyQ5a', '9876543211', 22, 'DONOR'),
(3, 'Vijay Kumar', 'vijay@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uCyQ5a', '9876543212', 30, 'DONOR'),
(4, 'Anitha Raj', 'anitha@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uCyQ5a', '9876543213', 28, 'RECEIVER');

-- 2. Create Donor Profiles
-- Coordinates: Coimbatore (11.0168, 76.9558), Chennai (13.0827, 80.2707), Madurai (9.9252, 78.1198)

-- Donor 1: Coimbatore, A+, Available, Last donation 6 months ago (Good Match)
INSERT INTO donor_profiles (user_id, blood_group, city, latitude, longitude, availability, last_donation_date) VALUES 
(1, 'A+', 'Coimbatore', 11.0168, 76.9558, TRUE, '2025-10-15');

-- Donor 2: Chennai, A+, Available, Last donation 1 month ago (Lower rank due to distance)
INSERT INTO donor_profiles (user_id, blood_group, city, latitude, longitude, availability, last_donation_date) VALUES 
(2, 'A+', 'Chennai', 13.0827, 80.2707, TRUE, '2026-03-20');

-- Donor 3: Coimbatore, A+, Not Available (Will be filtered or ranked lower)
INSERT INTO donor_profiles (user_id, blood_group, city, latitude, longitude, availability, last_donation_date) VALUES 
(3, 'A+', 'Coimbatore', 11.0300, 76.9700, FALSE, '2025-12-01');
