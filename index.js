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
    // map into numeric pairs of arrival-departure
    return arrivals.map((value, i) => [+value, +departures[i]]);
}

/**
 * check for longest, consecutive times of room
 * @param {number[][]} bookedData - loaded data from bookings.txt
 */
function checkAvailable(rooms, bookedData) {

    if (!rooms) throw new Error('There\'s even no room!');

    // generate booking tracks for available rooms
    var roomTracks = [...Array(rooms)].map(() => ({ min: 0, max: 0 }));
    var bLen = bookedData.length, bIdx = 0, rIdx = 0;

    while (bIdx < bLen) {

        let [bArv, bDpt] = bookedData[bIdx], { min, max } = roomTracks[rIdx];

        checking(`booking from day ${bArv} to day ${bDpt}...`);

        if (!isNaN(bArv) && !isNaN(bDpt) && bArv <= bDpt) {

            if (bArv <= max && bDpt >= min) { // invalid date range
                // try to stop once run out of rooms for booking in process
                if (++rIdx == rooms) return false; else continue;
            }
            // else, extend the booking timerange for a room when it's ok
            checking(`...OK to room ${rIdx + 1}`);
            if (bArv < min || min == 0) roomTracks[rIdx].min = bArv;
            if (bDpt > max || max == 0) roomTracks[rIdx].max = bDpt;

        }

        bIdx += 1, rIdx = 0; // reset room index & proceed to next booking

    }

    return true;

}