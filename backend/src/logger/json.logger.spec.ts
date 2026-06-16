import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  const jsonLogger = new JsonLogger();
  let log: jest.SpyInstance;

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockRestore();
  });

  it('should log correct format', () => {
    jsonLogger.warn('hello', { a: 'b', c: 1 });

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'warn',
        message: 'hello',
        optionalParams: [{ a: 'b', c: 1 }],
      }),
    );
  });
});
