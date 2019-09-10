var readFileSync = require('fs').readFileSync;

const EOL = require('os').EOL;

module.exports = { EOL, readInputs };

/**
 * read the file & parse into square matrix of numbers
 * @param {string} filePath - path to location of file matrix.txt
 */
function readInputs(filePath) {

    var file = readFileSync(filePath, { encoding: 'utf8' });
    var data = file.split(EOL);
    var splitStr = (str) => str.trim().split(/\s+/g);

    if (Array.isArray(data) && data.length != 2) {
        throw new Error('Data is not sufficient!');
    }

    var arrivals = splitStr(data[0]);
    var departures = splitStr(data[1]);

    if (arrivals.length != departures.length) { 
        throw new Error('Booking arrivals & departures are not matched!');
    }
    // TODO: should check for NaN values?
    return arrivals.map((value, i) => [value, departures[i]]);

}
