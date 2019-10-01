const checkRooms = require('./index');

describe('5 bookings with 2 ended in date 4, and 2 start from date 4', () => {

    let bookings = [
        [1, 2, 3, 4, 4],
        [2, 4, 4, 6, 5]
    ];

    test('not fine with 1 rooms', () => {
        expect(checkRooms(1, bookings)).toBeFalsy();
    });

    test('not fine with 2 rooms, also', () => {
        expect(checkRooms(2, bookings)).toBeFalsy();
    });

    test('not fine with 3 rooms either', () => {
        expect(checkRooms(3, bookings)).toBeFalsy();
    });

    test('only ok with 4 rooms or more', () => {
        expect(checkRooms(4, bookings)).toBeTruthy();
    });

});

describe('Mismatched bookings pairs will throw an error regardless # of rooms', () => {

    let bookings = [
        [1, 2, 3, 4],
        [2, 4, 4, 6, 5]
    ];

    test('throw with 1 rooms', () => {
        expect(() => checkRooms(1, bookings)).toThrow();
    });

    test('throw even with 2 rooms', () => {
        expect(() => checkRooms(2, bookings)).toThrow();
    });

});