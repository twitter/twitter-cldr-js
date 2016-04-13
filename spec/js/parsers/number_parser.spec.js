// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0


var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("NumberParser", function() {
  var separators, parser;
  beforeEach(function() {
    TwitterCldr.set_data(data);
    separators = [",", "\\."];
    parser = new TwitterCldr.NumberParser();
  });

  describe("#group_separator()", function() {
    it("returns the correct group separator", function() {
      expect(parser.group_separator()).toEqual(",");
    });
  });

  describe("#decimal_separator()", function() {
    it("returns the correct decimal separator", function() {
      expect(parser.decimal_separator()).toEqual("\\\.");
    });
  });

  describe("#identify", function() {
    it("properly identifies a numeric value", function() {
      expect(
        parser.identify("7841", separators[0], separators[1])
      ).toEqual({value: "7841", type: "numeric"});
    });

    it("properly identifies a decimal separator", function() {
      expect(
        parser.identify(".", separators[0], separators[1])
      ).toEqual({value: ".", type: "decimal"});
    });

    it("properly identifies a group separator", function() {
      expect(
        parser.identify(",", separators[0], separators[1])
      ).toEqual({value: ",", type: "group"});
    });

    it("returns nil if the text doesn't match a number or either separators", function() {
      expect(
        parser.identify("abc", separators[0], separators[1])
      ).toEqual({value: "abc", type: null});
    });
  });

  describe("#tokenize", function() {
    it("splits text by numericality and group/decimal separators", function() {
      expect(
        parser.tokenize("1,33.00", separators[0], separators[1])
      ).toEqual([
        {value: "1",  type: "numeric"},
        {value: ",",  type: "group"},
        {value: "33", type: "numeric"},
        {value: ".",  type: "decimal"},
        {value: "00", type: "numeric"}
      ]);
    });

    it("returns an empty array for a non-numeric string", function() {
      expect(parser.tokenize("abc", separators[0], separators[1])).toEqual([]);
    });
  });

  describe("#get_separators", function() {
    it("returns all separators when strict mode is off", function() {
      var found_separators = parser.get_separators(false);
      expect(found_separators.group).toEqual('\\.,\\s');
      expect(found_separators.decimal).toEqual('\\.,\\s');
    });

    it("returns only locale-specific separators when strict mode is on", function() {
      var found_separators = parser.get_separators(true);
      expect(found_separators.group).toEqual(',');
      expect(found_separators.decimal).toEqual('\\.');
    });
  });

  describe("#is_punct_valid", function() {
    function strip_numerics(token_list) {
      var tokens = [];

      for (var idx in token_list) {
        if (token_list[idx].type != "numeric") {
          tokens.push(token_list[idx]);
        }
      }

      return tokens;
    }

    it("correctly validates a number with no decimal", function() {
      var tokens = strip_numerics(parser.tokenize("1.337", separators[0], separators[1]));
      expect(parser.is_punct_valid(tokens)).toEqual(true);
    });

    it("correctly validates a number with a decimal", function() {
      var tokens = strip_numerics(parser.tokenize("1,337.00", separators[0], separators[1]));
      expect(parser.is_punct_valid(tokens)).toEqual(true);
    });

    it("reports on an invalid number when it has more than one decimal", function() {
      var tokens = strip_numerics(parser.tokenize("1.337.00", separators[0], separators[1]));
      expect(parser.is_punct_valid(tokens)).toEqual(false);
    });
  });

  describe("#is_numeric?", function() {
    it("returns true if the text is numeric", function() {
      expect(TwitterCldr.NumberParser.is_numeric("4839", "")).toEqual(true);
      expect(TwitterCldr.NumberParser.is_numeric("1", "")).toEqual(true);
    });

    it("returns false if the text is not purely numeric", function() {
      expect(TwitterCldr.NumberParser.is_numeric("abc", "")).toEqual(false);
      expect(TwitterCldr.NumberParser.is_numeric("123abc", "")).toEqual(false);
    });

    it("returns false if the text is blank", function() {
      expect(TwitterCldr.NumberParser.is_numeric("", "")).toEqual(false);
    });

    it("accepts the given characters as valid numerics", function() {
      expect(TwitterCldr.NumberParser.is_numeric("a123a", "a")).toEqual(true);
      expect(TwitterCldr.NumberParser.is_numeric("1,234.56")).toEqual(true);  // default separator chars used here
    });
  });

  describe("#valid?", function() {
    it("correctly identifies a series of valid cases", function() {
      var nums = ["5", "5.0", "1,337", "1,337.0", "0.05", ".5", "1,337,000.00"];
      for (var idx in nums) {
        expect(parser.is_valid(nums[idx])).toEqual(true);
      }
    });

    it("correctly identifies a series of invalid cases", function() {
      var nums = ["12.0.0", "5.", "5,"];
      for (var idx in nums) {
        expect(parser.is_valid(nums[idx])).toEqual(false);
      }
    });
  });

  describe("#parse", function() {
    it("correctly parses a series of valid numbers", function() {
      var cases = {
        "5": 5,
        "5.0": 5.0,
        "1,337": 1337,
        "1,337.0": 1337.0,
        "0.05": 0.05,
        ".5": 0.5,  // Borked
        "1,337,000.00": 1337000.0
      };

      for (var text in cases) {
        var expected = cases[text];
        expect(parser.parse(text)).toEqual(expected);
      }
    });

    it("correctly raises an error when asked to parse invalid numbers", function() {
      var cases = ["12.0.0", "5.", "5,"];

      for (var idx in cases) {
        expect(function() {
          parser.parse(cases[idx])
        }).toThrow(new Error("Invalid number"));
      }
    });

    describe("non-strict", function() {
      it("succeeds in parsing even if inexact punctuation is used", function() {
        expect(parser.parse("5 100", {strict: false})).toEqual(5100);
      });
    });
  });

  describe("#try_parse", function() {
    it("parses correctly with a valid number", function() {
      expect(parser.try_parse("1,234")).should == 1234;
    });

    it("parses correctly with a valid number and calls the callback", function() {
      var pre_result = null;
      parser.try_parse("1,234", null, function(result) { pre_result = result; });
      pre_result.should == 1234
    });

    it("falls back on the default value if the number is invalid", function() {
      expect(parser.try_parse("5.")).toEqual(null);
      expect(parser.try_parse("5.", 0)).toEqual(0);
    });

    it("falls back on the block if the number is invalid", function() {
      var pre_result = null;
      parser.try_parse("5.", null, function(result) { pre_result = 9 });
      expect(pre_result).toEqual(9);
    });

    it("re-raises any unexpected errors", function() {
      expect(function() { parser.try_parse({}) }).toThrow();
    });

    it("parses zero correctly", function() {
      expect(parser.try_parse('0')).toEqual(0);
    });
  });
});
