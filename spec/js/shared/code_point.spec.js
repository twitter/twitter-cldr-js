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
  describe("#code_points_for_index_name", function() {
    it("returns code points for the given general unicode property name", function() {
      cps = TwitterCldr.CodePoint.code_points_for_index_name("category", "Cc");
      expect(cps instanceof Array).toBe(true);
      expect(cps[0]).toEqualRange(new TwitterCldr.Range(0, 31));

      cps = TwitterCldr.CodePoint.code_points_for_index_name("bidi_class", "BN");
      expect(cps instanceof Array).toBe(true);
      expect(cps[0]).toEqualRange(new TwitterCldr.Range(0, 8));

      cps = TwitterCldr.CodePoint.code_points_for_index_name("bidi_mirrored", "N");
      expect(cps instanceof Array).toBe(true);
      expect(cps[0]).toEqualRange(new TwitterCldr.Range(0, 39));
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
  // describe("#for_canonical_decomposition", function() {
  //   it("should return a code point with correct value", function() {
  //     expect(TwitterCldr.CodePoint.for_canonical_decomposition([65, 768]).code_point).toEqual(192);
  //   });
  //   it("should return null if no decomposition mapping exists", function() {
  //     expect(TwitterCldr.CodePoint.for_canonical_decomposition([987])).toBe(null);
  //   });
  //   it("should cache the decomposition map", function() {
  //     expect(TwitterCldr.CodePoint.for_canonical_decomposition([0xA0])).toBe(null);
  //     expect(TwitterCldr.CodePoint.for_canonical_decomposition([0xA0])).toBe(null);
  //   });
  // });
  // describe("#hangul_type", function() {
  //   it("returns null if not a part of a hangul block", function() {
  //     expect(TwitterCldr.CodePoint.hangul_type(4380)).toBe(null);
  //   });
  //   it("returns the correct part (i.e. lpart, vpart, or tpart, etc) before composition of decomposition", function() {
  //      expect(TwitterCldr.CodePoint.hangul_type(4360)).toBe("lparts");
  //      expect(TwitterCldr.CodePoint.hangul_type(4460)).toBe("vparts");
  //      expect(TwitterCldr.CodePoint.hangul_type(4530)).toBe("tparts");
  //   });
  //   it("returns null if no part can be found", function() {
  //     expect(TwitterCldr.CodePoint.hangul_type(4400)).toBe(null);
  //   });
  // });
  // describe("#is_excluded_from_composition", function() {
  //   it("excludes anything in the list of ranges", function() {
  //     expect(TwitterCldr.CodePoint.is_excluded_from_composition(832)).toBe(true);
  //     expect(TwitterCldr.CodePoint.is_excluded_from_composition(884)).toBe(true);
  //     expect(TwitterCldr.CodePoint.is_excluded_from_composition(194561)).toBe(true);
  //     expect(TwitterCldr.CodePoint.is_excluded_from_composition(831)).toBe(false);
  //     expect(TwitterCldr.CodePoint.is_excluded_from_composition(888)).toBe(false);
  //     expect(TwitterCldr.CodePoint.is_excluded_from_composition(119235)).toBe(false);
  //   });
  // });
  // describe("#get_block", function() {
  //   beforeEach(function() {
  //     clear_cache();
  //   });
  //   it("finds the block that corresponds to the code point", function() {
  //     expect(TwitterCldr.CodePoint.get_block_range(TwitterCldr.CodePoint.get_block_name(120))).toEqualRange(new TwitterCldr.Range(0,127));
  //     expect(TwitterCldr.CodePoint.get_block_range(TwitterCldr.CodePoint.get_block_name(917600))).toEqualRange(new TwitterCldr.Range(917504,917631));
  //     expect(TwitterCldr.CodePoint.get_block_range(TwitterCldr.CodePoint.get_block_name(1114200))).toBe(null);
  //   });
  // });
  // describe("get_range_start", function() {
  //   it("returns the data for a non-explicit range", function() {
  //     block_data = { 0x1337 : [0x1337, "<CJK Ideograph Extension A, First>"] };
  //     expect(TwitterCldr.CodePoint.get_range_start(0xABC, block_data)).toEqual([0xABC, "<CJK Ideograph Extension A>"]);
  //   });
  //   it("returns nil if the block data doesn't contain a non-explicit range", function() {
  //     block_data = { 0x1337 : [0x1337, "<CJK Ideograph Extension A>"] };
  //     expect(TwitterCldr.CodePoint.get_range_start(0xABC, block_data)).toBe(null);
  //   });
  // });
});
