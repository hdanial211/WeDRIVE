const fs = require('fs');
console.log("Looking at dummy data...");
const dataStr = fs.readFileSync('shared/dummy/data.json', 'utf8');
const data = JSON.parse(dataStr);
console.log(data.bookings[0]);
