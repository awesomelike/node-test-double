const reservations = require('./reservations');

describe('save', () => {
  let reservations;

  const mockDebug = jest.fn();
  const mockInsert = jest.fn().mockResolvedValue([1]);

  beforeAll(() => {
    jest.mock('debug', () => () => mockDebug);
    jest.mock('./knex', () => () => ({
      insert: mockInsert
    }));

    reservations = require('./reservations');
  });

  afterAll(() => {
    jest.unmock('debug');
    jest.unmock('./knex');
  });

  it('should resolve with the id upon success', async () => {
    const value = { name: 'bar' };
    const expected = [1];

    const actual = await reservations.save(value);

    expect(actual).toStrictEqual(expected);
    expect(mockDebug).toBeCalledTimes(1);
    expect(mockInsert).toBeCalledWith(value);
  });
})


describe('fetch', () => {
  let reservations;

  beforeAll(() => {
    jest.mock('./reservations');
    reservations = require('./reservations');
  });

  afterAll(() => {
    jest.unmock('./reservations');
  });

  it('should be mocked and not create a database record', () => {
    expect(reservations.fetch()).toBeUndefined();
  });

});

describe('create', () => {
  let reservations;

  it('should reject if validation fails', async () => {
    reservations = require('./reservations');

    // Store the original
    const original = reservations.validate;

    const error = new Error('fail');

    // Mock the function
    reservations.validate = jest.fn(() => Promise.reject(error));
    
    await expect(reservations.create())
      .rejects.toBe(error);
    
    expect(reservations.validate).toBeCalledTimes(1);

    reservations.validate = original;
  });

  it('should create a reservation if there are no validation problems', async () => {
    const expectedInsertId = 1;

    const mockInsert = jest.fn().mockResolvedValue([expectedInsertId]);

    jest.mock('./knex', () => () => ({
      insert: mockInsert,
    }));

    reservations = require('./reservations');

    const mockValidation = jest.spyOn(reservations, 'validate');
    // mockValidation.mockResolvedValue(value);
    mockValidation.mockImplementation(value => Promise.resolve(value));

    const reservation = { foo: 'bar' };

    await expect(reservations.create(reservation))
      .resolves.toStrictEqual(expectedInsertId);

    expect(reservations.validate).toHaveBeenCalledTimes(1);
    expect(mockValidation).toBeCalledWith(reservation);
    expect(mockValidation).toBeCalledTimes(1);

    // Restore
    mockValidation.mockRestore();
    jest.unmock('./knex');
  });
});

describe('validate', () => {
  let reservations;

  beforeAll(() => {
    reservations = require('./reservations');
  });

  it('should reject when undefined is provided', async () => {
    const mock = jest.spyOn(reservations, 'validate');
  
    const value = undefined;
    
    await expect(reservations.validate(value))
      .rejects.toThrow('Cannot read property \'validate\' of undefined');
    
    expect(mock).toBeCalledWith(value);
  
    mock.mockRestore();
  });
});