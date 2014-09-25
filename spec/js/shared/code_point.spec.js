// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("CodePoint", function() {
  var clear_cache = function () {
    TwitterCldr.CodePoint.composition_exclusion_cache = {};
    TwitterCldr.CodePoint.block_cache = {};
  };

  beforeEach(function () {
    clear_cache();

  });

  afterEach(function() {
    clear_cache();
  });

  describe("#initialize", function() {

    describe("when decomposition is canonical", function() {
      var decomposition = '0028 007A 0029';
      var unicode_data = ['17D1', 'KHMER SIGN VIRIAM', 'Mn', '0', 'NSM', decomposition, "", "", "", 'N', "", "", "", "", ""];
      var code_point = new TwitterCldr.CodePoint(unicode_data);
      it("parses decomposition mapping", function() {
        expect(code_point.decomposition()).toEqual([0x28, 0x7A, 0x29]);
      });

      it("initializes compatibility tag as nil", function() {
        expect(code_point.compatibility_decomposition_tag()).toBe(null);
      });

      it("returns false from is_compatibility_decomposition", function() {
        expect(code_point.is_compatibility_decomposition()).toBe(false);
      });
    });

    describe("when decomposition is compatibility", function() {
      var decomposition = '<font> 0028 007A 0029';
      var unicode_data = ['17D1', 'KHMER SIGN VIRIAM', 'Mn', '0', 'NSM', decomposition, "", "", "", 'N', "", "", "", "", ""];
      var code_point = new TwitterCldr.CodePoint(unicode_data);
      it("parses decomposition mapping", function() {
        expect(code_point.decomposition()).toEqual([0x28, 0x7A, 0x29]);
      });

      it("initializes compatibility decomposition tag", function() {
        expect(code_point.compatibility_decomposition_tag()).toEqual('font');
      });

      it("returns true from is_compatibility_decomposition", function() {
        expect(code_point.is_compatibility_decomposition()).toBe(true);
      });
    });

    describe("when decomposition is empty", function() {
      var decomposition = "";
      var unicode_data = ['17D1', 'KHMER SIGN VIRIAM', 'Mn', '0', 'NSM', decomposition, "", "", "", 'N', "", "", "", "", ""];
      var code_point = new TwitterCldr.CodePoint(unicode_data);
      it("parses decomposition mapping", function() {
        expect(code_point.decomposition()).toBe(null);
      });

      it("initializes compatibility tag as nil", function() {
        expect(code_point.compatibility_decomposition_tag()).toBe(null);
      });

      it("return false from is_compatibility_decomposition", function() {
        expect(code_point.is_compatibility_decomposition()).toBe(false);
      });
    });
  });
  describe("#code_points_for_property", function() {
    it("reutrns code points for the given unicode property and value", function() {
      cps = TwitterCldr.CodePoint.code_points_for_property("line_break", "CM");
      expect(cps instanceof Array).toBe(true);
      expect(cps[0]).toEqualRange(new TwitterCldr.Range(0, 8));

      cps = TwitterCldr.CodePoint.code_points_for_property("sentence_break", "Extend");
      expect(cps instanceof Array).toBe(true);
      expect(cps[0]).toEqualRange(new TwitterCldr.Range(768, 879));

      cps = TwitterCldr.CodePoint.code_points_for_property("word_break", "Hebrew_Letter");
      expect(cps instanceof Array).toBe(true);
      expect(cps[0]).toEqualRange(new TwitterCldr.Range(1488, 1514));
    });
  });
});
