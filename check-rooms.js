const { EOL, readInputs } =  require('./reader');
const DATA_FILE = `${__dirname}/bookings.txt`;

var bookings = readInputs(DATA_FILE);
var rooms = Number(process.argv[2]) || 0;

var result = checkAvailable(rooms, bookings);

console.log(`bookings in ${rooms} rooms: ${EOL} bookings=${bookings}`);
console.log(`there are ${result ? '' : 'NOT' } rooms!`);

/**
 * check for longest, consecutive times of room
 * @param {number[][]} bookedData - loaded data from bookings.txt
 */
function checkAvailable(rooms, bookedData) {

    if (!rooms) throw new Error('There\'s even no room!');

    var [min, max] = bookedData[0]; // always first booking is ok
    var i = 0, bLen = bookedData.length;

    while (++i < bLen) { 
        
        let [bMin, bMax] = bookedData[i];
        // check if booked daterange is invalid
        if (bMin <= max && bMax >= min) return false;
        // extend the booking timerange when it's ok 
        if (bMin < min) min = bMin;
        if (bMax > max) max = bMax;

    }

    return true;

}