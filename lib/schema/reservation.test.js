const Reservation = require('./reservation');

describe('combineDateTime', () => {
  it('should return an ISO 8601 date and time with valid input', () => {
    const date = '2021/06/30';
    const time = '10:06 AM';

    const expected = '2021-06-30T10:06:00.000Z';
    const actual = Reservation.combineDateTime(date, time);
    
    expect(actual).toEqual(expected);
  });

  it('should return null on a bad date and time', () => {
    const date = '!@!$';
    const time = 'fail';

    expect(Reservation.combineDateTime(date, time)).toBeNull();
  });
});

describe('validate', () => {
  it('should validate with no optional fields', (done) => {
    const reservation = new Reservation({
      date: '2021/06/30',
      time: '06:02 AM',
      party: 4,
      name: 'Family',
      email: 'username@email.com'
    });
    reservation.validate((error, value) => {
      try {
        expect(value).toEqual(reservation);
        return done(error);
      } catch (err) {
        done(err);
      }
    });
  });

  it('should invalidate with an invalid email', (done) => {
    const reservation = new Reservation({
      date: '2021/06/30',
      time: '06:02 AM',
      party: 4,
      name: 'Family',
      email: 'username'
    });

    reservation.validate((error) => {
      try {
        expect(error).toBeInstanceOf(Error);
        return done();
      } catch (err) {
        done(err);
      }
    });
  });
});