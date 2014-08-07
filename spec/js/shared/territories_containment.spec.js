// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("TerritoriesContainment", function() {
  describe("contains", function() {
//    it('returns true if the first territory (immediately) contains the second one', function() {
//      expect(TwitterCldr.TerritoriesContainment.contains('151', 'RU')).toBe(true);
//    });

    it('returns true if the first territory (non-immediately) contains the second one', function() {
      expect(TwitterCldr.TerritoriesContainment.contains('419', 'BZ')).toBe(true);
    });

    it('returns true if a territory is part of multiple parent territories', function() {
      expect(TwitterCldr.TerritoriesContainment.contains('019', '013')).toBe(true);
      expect(TwitterCldr.TerritoriesContainment.contains('419', '013')).toBe(true);
    });

    it('returns true if the first territory is a top-level territory', function() {
      expect(TwitterCldr.TerritoriesContainment.contains('001', '145')).toBe(true);
    });

    it('returns false if the first territory does not contain the second one', function() {
      expect(TwitterCldr.TerritoriesContainment.contains('419', 'RU')).toBe(false);
    });

    it('returns false if the second territory is a top-level territory', function() {
      expect(TwitterCldr.TerritoriesContainment.contains('419', '001')).toBe(false);
    });

    it('returns false if both territories are identical', function() {
      expect(TwitterCldr.TerritoriesContainment.contains('RU', 'RU')).toBe(false);
    });

    it('raises an exception is the first territory is invalid', function() {
      expect(function () {
        TwitterCldr.TerritoriesContainment.contains('UN', 'RU')
      }).toThrow(new Error('unknown territory code'));
    });

    it('raises an exception is the second territory is invalid', function() {
      expect(function () {
        TwitterCldr.TerritoriesContainment.contains('RU', 'UN')
      }).toThrow(new Error('unknown territory code'));
    });
  });

  describe("parents", function() {
    it('returns the parent territory', function() {
      expect(TwitterCldr.TerritoriesContainment.parents('RU')).toEqual(['151']);
    });

    it('returns multiple parents', function() {
      expect(TwitterCldr.TerritoriesContainment.parents('013').sort()).toEqual(['003', '019', '419']);
    });

    it('returns nil when given a top-level territory', function() {
      expect(TwitterCldr.TerritoriesContainment.parents('001')).toEqual([]);
    });

    it('raises an exception when given an invalid territory code', function() {
      expect(function() {
        TwitterCldr.TerritoriesContainment.parents('UN');
      }).toThrow(new Error('unknown territory code'));
    });
  });

  describe("children", function() {
    it('returns the immediate children of the territory', function() {
      expect(TwitterCldr.TerritoriesContainment.children('151')).toEqual(['BG', 'BY', 'CZ', 'HU', 'MD', 'PL', 'RO', 'RU', 'SK', 'SU', 'UA']);
    });

    it('returns codes with leading zeros', function() {
      expect(TwitterCldr.TerritoriesContainment.children('009')).toEqual(['053', '054', '057', '061', 'QO']);
    });

    it('returns an empty array when given a bottom-level territory', function() {
      expect(TwitterCldr.TerritoriesContainment.children('RU')).toEqual([]);
    });

    it('raises an exception when given an invalid territory code', function() {
      expect(function() {
        TwitterCldr.TerritoriesContainment.children('UN')
      }).toThrow(new Error('unknown territory code'));
    });
  });
});
