// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');

describe("CodePoints", function() {
  describe("#to_char", function() {
    it("converts unicode code points to the actual character", function() {
      expect(TwitterCldr.CodePoints.to_char(0x221E)).toEqual('∞');
    });
  });
  describe("#from_char", function() {
    it("converts a character to a unicode code point", function() {
      expect(TwitterCldr.CodePoints.from_char('∞')).toEqual(0x221E);
    });
  });
  describe("#to_chars", function() {
    it("should handle an empty array", function() {
      expect(TwitterCldr.CodePoints.to_chars([])).toEqual([]);
    });
    it("converts an array of unicode code points to an array of chars", function() {
      expect(TwitterCldr.CodePoints.to_chars([0x65, 0x73, 0x70])).toEqual(['e', 's', 'p']);
    });
  });
  describe("#from_chars", function() {
    it("should handle an empty array", function() {
      expect(TwitterCldr.CodePoints.from_chars([])).toEqual([]);
    });
    it("converts an array of chars to an array of unicode code points", function() {
      expect(TwitterCldr.CodePoints.from_chars(['e', 's', 'p'])).toEqual([0x65, 0x73, 0x70]);
    });
  });
  describe("#to_string", function() {
    it("should handle an empty array", function() {
      expect(TwitterCldr.CodePoints.to_string([])).toEqual('');
    });
    it("converts an array of unicode code points to a string", function() {
      expect(TwitterCldr.CodePoints.to_string([0x65, 0x73, 0x70, 0x61, 0xF1, 0x6F, 0x6C])).toEqual('español');
    });
  });
  describe("#from_string", function() {
    it("should handle an empty string", function() {
      expect(TwitterCldr.CodePoints.from_string('')).toEqual([]);
    });
    it("converts a string into an array of unicode code points", function() {
      expect(TwitterCldr.CodePoints.from_string('español')).toEqual([0x65, 0x73, 0x70, 0x61, 0xF1, 0x6F, 0x6C]);
    });
  });
});