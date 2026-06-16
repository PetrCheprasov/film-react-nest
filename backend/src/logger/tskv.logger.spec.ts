import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  const tskvLogger = new TskvLogger();
  let log: jest.SpyInstance;

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockRestore();
  });

  it('should log correct format', () => {
    tskvLogger.warn('hello', { a: 'b', c: 1 });

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      'level=warn\tmessage=hello\toptional=[{"a":"b","c":1}]',
    );
  });
});
