const debug = require('debug');

var checking = debug('checking');

// export main functions
module.exports = function checkRooms(rooms, [arrivals, departures] = [[], []]) {

    if (!rooms) throw new Error('There\'s even no room!');

    if (!Array.isArray(arrivals) || !Array.isArray(departures)) {
        throw new Error('Booking data are not in right format!');
    }

    if (arrivals.length != departures.length) {
        throw new Error('Booking arrivals & departures are not matched!');
    }

    return checkAvailable(rooms, arrivals, departures);

}

/**
 * check if current # of rooms can be booked with all requested date ranges
 * @param {number} rooms # of available rooms
 * @param {number[]} arrivals list of arrival dates
 * @param {number[]} departures list of departure dates
 */
function checkAvailable(rooms, arrivals, departures) {
    // generate booking tracks for available rooms
    var roomTracks = [...Array(rooms)].map(() => ({ min: 0, max: 0 }));
    var bLen = arrivals.length, bIdx = 0, rIdx = 0;
    var bArv = arrivals[bIdx], bDpt = departures[bIdx];

    while (bIdx < bLen) {

        let { min, max } = roomTracks[rIdx];

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
        bArv = arrivals[bIdx], bDpt = departures[bIdx];

    }

    return true;

}