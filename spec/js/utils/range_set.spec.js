// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');
beforeEach(function() {
  var areRangesEqual = function (range1, range2) {
    if (range1 instanceof TwitterCldr.Range && range2 instanceof TwitterCldr.Range) 
      return (range1.first == range2.first && range1.last ==  range2.last);
    else if (!(range1 instanceof TwitterCldr.Range) && !(range2 instanceof TwitterCldr.Range))
      return range1 == range2;
    else 
      return false;
  };
  var toEqualRange = function (expected) {
    return areRangesEqual (this.actual, expected);
  };
  var areRangeArraysEqual = function (arr1, arr2) {
    if (arr1.length !== arr2.length)
      return false;
    for (var i = 0; i < arr1.length; i++) {
      if (!areRangesEqual(arr1[i], arr2[i]))
        return false;
    };
    return true;
  };
  var toEqualRangeArray = function (expected) {
    if (!(this.actual instanceof Array) || !(expected instanceof Array))
      return false;
    return areRangeArraysEqual(this.actual, expected);
  };
  var toEqualRangeSet = function(expected) {
    if (!(this.actual instanceof TwitterCldr.RangeSet) || !(expected instanceof TwitterCldr.RangeSet))
      return false;
    return areRangeArraysEqual (this.actual.ranges, expected.ranges);
    
  };
  this.addMatchers({
    toEqualRange : toEqualRange,
    toEqualRangeSet : toEqualRangeSet,
    toEqualRangeArray : toEqualRangeArray
  });
});

describe("RangeSet", function() {
  describe("#rangify", function() {
    it("should identify runs in an array of integers and return an array of ranges", function() {
      expect(TwitterCldr.RangeSet.rangify([1, 2, 3, 6, 7, 8, 11, 14, 17, 18, 19])).toEqualRangeArray(
        [ new TwitterCldr.Range(1, 3), 
          new TwitterCldr.Range(6, 8), 
          new TwitterCldr.Range(11, 11),
          new TwitterCldr.Range(14, 14), 
          new TwitterCldr.Range(17, 19)
        ]);
    });
    it("should not rangify zero-length values when told to compress", function() {
      expect(TwitterCldr.RangeSet.rangify([1, 2, 3, 5, 8, 11, 12], true)).toEqualRangeArray(
        [ new TwitterCldr.Range(1, 3),
          5,
          8,
          new TwitterCldr.Range(11, 12),
        ]);
    });
  });

  describe("#to_array", function() {
    it("should return a copy of the ranges in the set", function() {      
      set = new TwitterCldr.RangeSet([new TwitterCldr.Range (1, 10)]);
      expect(set.to_array()).not.toBe(set.ranges);
    });
    it("should return compressed ranges when asked", function() {
      set = new TwitterCldr.RangeSet([new TwitterCldr.Range(1,10), new TwitterCldr.Range(12, 12)])
      // console.log(set.to_array(true));
      // expect(set.to_array()[0]).toEqualRange(new TwitterCldr.Range(1,10));
      expect(set.to_array(true)).toEqualRangeArray([new TwitterCldr.Range(1, 10), 12]);
    });
  });

  describe("#to_full_array", function() {
    it("expands all ranges", function() {
      set = new TwitterCldr.RangeSet([new TwitterCldr.Range (1, 5)])
      expect(set.to_full_array()).toEqual[1,2,3,4,5];
    });
  });

  describe("#new", function() {
    it("should flatten leading overlapping ranges", function() {
      expect((new TwitterCldr.RangeSet([new TwitterCldr.Range(3, 10), new TwitterCldr.Range(1, 8)])).to_array()).toEqualRangeArray([new TwitterCldr.Range (1, 10)]);
    });
    it("should flatten trailing overlapping ranges", function() {
      expect((new TwitterCldr.RangeSet ([new TwitterCldr.Range(1, 10), new TwitterCldr.Range(8, 12)])).to_array()).toEqualRangeArray([new TwitterCldr.Range (1, 12)]);
    });
    it("should flatten completely overlapping ranges", function() {
      expect((new TwitterCldr.RangeSet([new TwitterCldr.Range(2, 4), new TwitterCldr.Range(1, 10)])).to_array()).toEqualRangeArray([new TwitterCldr.Range (1, 10)]);
    });
    it("should join ranges that are within 1 of each other", function() {
      expect((new TwitterCldr.RangeSet([new TwitterCldr.Range(11, 15), new TwitterCldr.Range(1, 10)])).to_array()).toEqualRangeArray([new TwitterCldr.Range (1, 15)]);
    });
  });
  describe("#union", function() {
    it("should aggregate the ranges and flatten when necessary", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (3,10)])).union (
          new TwitterCldr.RangeSet ([new TwitterCldr.Range(9,11), new TwitterCldr.Range(1,2), new TwitterCldr.Range(2,3), new TwitterCldr.Range(14,18)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1,11), new TwitterCldr.Range(14,18)]));
    });
    it("should aggregate the ranges correctly even if they're given in reverse order", function() {
      set1 = (new TwitterCldr.RangeSet([new TwitterCldr.Range(3,10)])).union (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(1,4)])
        );
      expect(set1).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1,10)]));
      set2 = (new TwitterCldr.RangeSet([new TwitterCldr.Range(1,4)])).union (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(3,10)])
        );
      expect(set2).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1,10)]));
    });
  });
  describe("#intersection", function() {
    it("computes the intersection for leading overlapping ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (3,10)])).intersection (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(1,7)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(3,7)]));
    });
    it("computes the intersection for trailing overlapping ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,10)])).intersection (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(5,15)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(5,10)]));
    });
    it("computes the intersection for two completely overlapping ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,10)])).intersection (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(3,6)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(3,6)]));
    });
    it("returns an empty intersection if no elements exist in both ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,10)])).intersection (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(15,20)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([]));
    });
    it("returns partial intersections when the range set contains multiple matching ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,5), new TwitterCldr.Range(7, 10)])).intersection (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(3,8)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(3, 5), new TwitterCldr.Range(7, 8)]));
    });
    it("should aggregate the ranges correctly even if they're given in reverse order", function() {
      set1 = (new TwitterCldr.RangeSet([new TwitterCldr.Range(2,3)])).intersection (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(1,4)])
        );
      expect(set1).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(2,3)]));
      set2 = (new TwitterCldr.RangeSet([new TwitterCldr.Range(1,4)])).intersection (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(2,3)])
        );
      expect(set2).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(2,3)]));
    });
  });
  describe("#subtract", function() {
    it("subtracts the intersection for leading overlapping ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (3,10)])).subtract (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(1,5)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(6, 10)]));
    });
    it("subtracts the intersection for trailing overlapping ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,7)])).subtract (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(3,9)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1, 2)]));
    });
    it("subtracts the intersection for completely overlapping ranges (generates two ranges)", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,10)])).subtract (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(4,6)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1, 3), new TwitterCldr.Range (7, 10)]));
    });
    it("subtracts the intersection when the range set contians multiple matching ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,5), new TwitterCldr.Range(7, 10)])).subtract (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(3,8)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1, 2), new TwitterCldr.Range (9, 10)]));
    });
    it("does not change object when subtracting an empty set", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,5)])).subtract (
          new TwitterCldr.RangeSet([])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1, 5)]));
    });
  });
  describe("#difference", function() {
    it("returns the symmetric difference (union - intersection) between completely overlapping ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,10)])).difference (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(3,8)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1, 2), new TwitterCldr.Range (9, 10)]));
    });
    it("returns the symmetric difference between leading overlapping ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (3,10)])).difference (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(1,5)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1, 2), new TwitterCldr.Range (6, 10)]));
    });
    it("returns the symmetric difference between trailing overlapping ranges", function() {
      set = (new TwitterCldr.RangeSet([new TwitterCldr.Range (1,5)])).difference (
          new TwitterCldr.RangeSet([new TwitterCldr.Range(3,8)])
        );
      expect(set).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(1, 2), new TwitterCldr.Range (6, 8)]));
    }); 
  });
  describe("#includes", function() {
    var set; 
    beforeEach(function() {
      set = new TwitterCldr.RangeSet([new TwitterCldr.Range(1,5), new TwitterCldr.Range(9,16)]);
    });
    it("returns true if the set completely includes the range, false otherwise", function() {
      expect(set.includes(new TwitterCldr.Range(10,15))).toBe(true);
      expect(set.includes(new TwitterCldr.Range(3,8))).not.toBe(true);
      expect(set.includes(new TwitterCldr.Range(8,14))).not.toBe(true);
    });
    it("returns true if the set contains the value, false otherwise", function() {
      expect(set.includes(3)).toBe(true);
      expect(set.includes(10)).toBe(true);
      expect(set.includes(6)).not.toBe(true);
      expect(set.includes(8)).not.toBe(true);
    });
  });
});
