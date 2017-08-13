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
            lng: 19.0779332,
            lat: 50.2389625,
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
      it('should send error message if bad query params', async () => {
        const mockReq = {
          query: {
            lng: 1,
            lat: 'NOT_VALID',
          },
        };
        const mockRes = {
          status: jest.fn(),
          json: jest.fn(),
        };
        const expectedBody = {
          error: 'Bad query parameters',
        };
        await handler(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(expectedBody);
      });
    });
  });
});
