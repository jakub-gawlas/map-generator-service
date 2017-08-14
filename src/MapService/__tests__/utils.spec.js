const utils = require('../utils');

describe('MapService utils', () => {
  describe('getMaxBounds', () => {
    it('should works', () => {
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-121.353637, 41.584978],
                  [-121.284551, 40.584758],
                  [-121.275349, 40.541646],
                ],
                [
                  [-121.353637, 41.584978],
                  [-121.284551, 40.584758],
                  [-130.275349, 40.541646],
                ],
              ],
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-120.353637, 40.512978],
                  [-121.284551, 30.484758],
                  [-122.275349, 40.141646],
                ],
              ],
            },
          },
        ],
      };
      const expected = [[-130.275349, 30.484758], [-120.353637, 41.584978]];
      const result = utils.getMaxBounds(geojson);
      expect(result).toEqual(expected);
    });
    describe('should return null', () => {
      [
        {
          desc: 'empty object',
          data: {},
        },
        {
          desc: 'not compatible type',
          data: {
            type: 'NotCompatibleType',
          },
        },
        {
          desc: 'features not array',
          data: {
            type: 'FeatureCollection',
            features: 'notArray',
          },
        },
        {
          desc: 'features has zero items',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        },
      ].forEach(({ desc, data }) => {
        it(desc, () => {
          const result = utils.getMaxBounds(data);
          expect(result).toBeNull();
        });
      });
    });
  });
});
