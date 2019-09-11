const { EOL, readInputs } =  require('./reader');
const DATA_FILE = `${__dirname}/bookings.txt`;

var bookings = readInputs(DATA_FILE);
var rooms = Number(process.argv[2]) || 0;

console.log(`currently having ${rooms} rooms`);

var result = checkAvailable(rooms, bookings);

console.log(`there are ${result ? '' : 'NOT ' }enough rooms!`);

/**
 * check for longest, consecutive times of room
 * @param {number[][]} bookedData - loaded data from bookings.txt
 */
function checkAvailable(rooms, bookedData) {

    if (!rooms) throw new Error('There\'s even no room!');
    
    // generate booking tracks for available rooms
    var trackings = [...Array(rooms)].map(() => ({ min: 0, max: 0 }));

    checkBooking:
    for (let i = 0, bLen = bookedData.length; i < bLen; i++) { 
        
        let [bMin, bMax] = bookedData[i].map(Number);
        
        process.stdout.write(`check booking from day ${bMin} to day ${bMax}...`);

        // ! no idea if this check is appropriate
        if (isNaN(bMin) || isNaN(bMax) || bMin > bMax) { 
            console.warn('Invalid booking, no check!');
            continue checkBooking;
        }

        checkRooms:
        for (let rIdx = 0; rIdx < rooms; rIdx++) { 

            let { min, max } = trackings[rIdx];

            // check if booked daterange is invalid
            if (bMin <= max && bMax >= min) {
                // stop checkign once run out of rooms
                if (rIdx == rooms - 1) return false;
                else continue checkRooms;
            }

            // extend the booking timerange for a room when it's ok 
            if (bMin < min || min == 0) trackings[rIdx].min = bMin;
            if (bMax > max || max == 0) trackings[rIdx].max = bMax;

            process.stdout.write(`room ${rIdx + 1}${EOL}`);

            continue checkBooking; // go back to outer loop

        }

    }

    return true;

}