const mysql = require('mysql2/promise');

const cityCoordinates = {
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
  'Erode': { lat: 11.3410, lng: 77.7172 },
  'Vellore': { lat: 12.9165, lng: 79.1325 },
  'Thoothukudi': { lat: 8.8049, lng: 78.1348 },
  'Nagercoil': { lat: 8.1833, lng: 77.4119 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 }
};

async function fixDB() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '170826',
    database: 'bloodlinking'
  });

  for (const [city, coords] of Object.entries(cityCoordinates)) {
    const [result] = await connection.execute(
      'UPDATE donor_profiles SET latitude = ?, longitude = ? WHERE city = ?',
      [coords.lat, coords.lng, city]
    );
    if (result.affectedRows > 0) {
      console.log(`Updated ${result.affectedRows} donors in ${city}`);
    }
  }

  // Handle 'Trichy' and 'Bangalore' legacy names if any
  const legacyUpdates = [
    { old: 'Trichy', coords: cityCoordinates['Tiruchirappalli'] },
    { old: 'Bangalore', coords: cityCoordinates['Bengaluru'] }
  ];
  for (const item of legacyUpdates) {
    const [result] = await connection.execute(
      'UPDATE donor_profiles SET latitude = ?, longitude = ? WHERE city = ?',
      [item.coords.lat, item.coords.lng, item.old]
    );
    if (result.affectedRows > 0) {
      console.log(`Updated ${result.affectedRows} donors in ${item.old}`);
    }
  }
  
  await connection.end();
}

fixDB().catch(console.error);
