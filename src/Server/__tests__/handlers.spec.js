const handlers = require('../handlers');

describe('Server handlers', () => {
  describe('method getImageMap', () => {
    const SAMPLE_IMAGE_BUFFER = [137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13];
    const mockMapService = {
      getImageMap: jest.fn(async () => SAMPLE_IMAGE_BUFFER),
    };
    let handler;
    it('should return handler', () => {
      handler = handlers.getImageMap(mockMapService);
      expect(handler).toBeInstanceOf(Function);
    });
    describe('handler', () => {
      it('should send image', async () => {
        const mockReq = {
          query: {
            data: '{"json": true}'
          },
        };
        const mockRes = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };
        const expectedHeader = {
          'Content-Type': 'image/png',
          'Content-Length': SAMPLE_IMAGE_BUFFER.length,
        };
        await handler(mockReq, mockRes);
        expect(mockMapService.getImageMap).toHaveBeenCalledTimes(1);
        expect(mockRes.writeHead).toHaveBeenCalledWith(200, expectedHeader);
        expect(mockRes.end).toHaveBeenCalledWith(SAMPLE_IMAGE_BUFFER);
      });
    });
  });
});
