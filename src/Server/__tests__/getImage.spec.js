const getImage = require('../getImage');

describe('Server getImage', () => {
  describe('validator', () => {
    it('should parse query param `data`', () => {
      const mockReq = {
        query: {
          data: '{"json": true}',
        },
      };
      mockRes = {};
      const mockNext = jest.fn();
      const expectedReq = {
        query: {
          data: { json: true },
        },
      };
      getImage.validator(mockReq, mockRes, mockNext);
      expect(mockReq).toEqual(expectedReq);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe('handler', () => {
    const SAMPLE_IMAGE_BUFFER = [137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13];
    const mockMapService = {
      getImageMap: jest.fn(async () => SAMPLE_IMAGE_BUFFER),
    };
    let handler;
    it('should return request handler', () => {
      handler = getImage.handler(mockMapService);
      expect(handler).toBeInstanceOf(Function);
    });
    describe('request handler', () => {
      it('should send image', async () => {
        const mockReq = {
          query: {
            data: { json: true },
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
