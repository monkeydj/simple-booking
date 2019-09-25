var checkRooms = require('./index');
var bookings = require(`${__dirname}/bookings.sample`);
var rooms = Number(process.argv[2]) || 0;
var result = checkRooms(rooms, bookings);

console.log(`currently having ${rooms} rooms`);
console.log(`there are ${result ? '' : 'NOT '}enough rooms!`);
