const debug = require('debug');

var checking = debug('checking');

// export main functions
module.exports = function checkRooms(rooms, bookings) {
    return checkAvailable(rooms, pairBookingDates(bookings));
}

// module.exports.checkAvailable = checkAvailable;
// module.exports.pairBookingDates = pairBookingDates;

/**
 * preprocess data from required inputs
 * @param {string[][]} 2-d array of arrivals & depatures
 */
function pairBookingDates([arrivals, departures] = [[], []]) {

    if (!Array.isArray(arrivals) || !Array.isArray(departures)) {
        throw new Error('Booking data are not in right format!');
    }

    if (arrivals.length != departures.length) {
        throw new Error('Booking arrivals & departures are not matched!');
    }

    return arrivals.map((value, i) => [value, departures[i]]);

}

/**
 * check for longest, consecutive times of room
 * @param {number[][]} bookedData - loaded data from bookings.txt
 */
function checkAvailable(rooms, bookedData) {

    if (!rooms) throw new Error('There\'s even no room!');

    // generate booking tracks for available rooms
    var trackings = [...Array(rooms)].map(() => ({ min: 0, max: 0 }));
    var bLen = bookedData.length, bIdx = 0, rIdx = 0;

    do {

        let [bMin, bMax] = bookedData[bIdx].map(Number);
        let { min, max } = trackings[rIdx];

        checking(`check booking from day ${bMin} to day ${bMax}...`);

        if (isNaN(bMin) || isNaN(bMax) || bMin > bMax) {
            checking('Invalid booking, no check!');
            bIdx += 1; continue;
        }

        if (bMin <= max && bMax >= min) { // if booked date range is invalid
            // stop checking once run out of rooms
            if (++rIdx == rooms) return false; else continue;
        }
        // else, extend the booking timerange for a room when it's ok
        checking(`...to room ${rIdx + 1}\n`);
        if (bMin < min || min == 0) trackings[rIdx].min = bMin;
        if (bMax > max || max == 0) trackings[rIdx].max = bMax;

        rIdx = 0, bIdx += 1; // proceed to next booking data

    } while (bIdx < bLen && rIdx < rooms);

    return true;

}