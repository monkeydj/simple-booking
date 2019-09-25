const debug = require('debug');

var checking = debug('checking');

// export main functions
module.exports = function checkRooms(rooms, bookings) {
    return checkAvailable(rooms, pairBookingDates(bookings));
}

module.exports.checkAvailable = checkAvailable;
module.exports.pairBookingDates = pairBookingDates;

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

    checkBooking:
    for (let i = 0, bLen = bookedData.length; i < bLen; i++) {

        let [bMin, bMax] = bookedData[i].map(Number);

        checking(`check booking from day ${bMin} to day ${bMax}...`);

        // ! no idea if this check is appropriate
        if (isNaN(bMin) || isNaN(bMax) || bMin > bMax) {
            checking('Invalid booking, no check!');
            continue checkBooking;
        }

        checkRooms:
        for (let rIdx = 0; rIdx < rooms; rIdx++) {

            let { min, max } = trackings[rIdx];

            // check if booked daterange is invalid
            if (bMin <= max && bMax >= min) {
                // stop checking once run out of rooms
                if (rIdx == rooms - 1) return false;
                else continue checkRooms;
            }

            // extend the booking timerange for a room when it's ok
            if (bMin < min || min == 0) trackings[rIdx].min = bMin;
            if (bMax > max || max == 0) trackings[rIdx].max = bMax;

            checking(`...to room ${rIdx + 1}\n`);

            continue checkBooking; // go back to outer loop

        }

    }

    return true;

}