// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/en.js');
TwitterCldr.set_data(data);

describe("BreakIterator", function() {
  var iterator = new TwitterCldr.BreakIterator("en", {"use_uli_exceptions" : true});
  describe("#each_sentence", function() {
    it("should return an array", function() {
      expect(iterator.each_sentence("foo bar") instanceof Array).toBe(true);
    });

    it("splits a simple string into sentences", function() {
      var str = "The. Quick. Brown. Fox.";
      expect(iterator.each_sentence(str)).toEqual([
        "The.", " Quick.", " Brown.", " Fox."
      ]);
    });

    it("does not split on commas, for example", function() {
      var str = "The. Quick, brown. Fox.";
      expect(iterator.each_sentence(str)).toEqual([
        "The.", " Quick, brown.", " Fox."
      ]);
    });

    it("does not split periods in the midst of other letters, eg. in a URL", function() {
      var str = "Visit us. Go to http://translate.twitter.com.";
      expect(iterator.each_sentence(str)).toEqual([
        "Visit us.",
        " Go to http://translate.twitter.com."
      ]);
    });

    it("splits on sentences that end with other kinds of punctuation", function() {
      var str = "Help us translate! Speak another language? You really, really rock.";
      expect(iterator.each_sentence(str)).toEqual([
        "Help us translate!",
        " Speak another language?",
        " You really, really rock."
      ]);
    });

    describe("with ULI exceptions", function() {
      it("does not split on certain abbreviations like Mr. and Mrs.", function() {
        var str = "I really like Mrs. Patterson. She's nice.";
        expect(iterator.each_sentence(str)).toEqual([
          "I really like Mrs. Patterson.",
          " She's nice."
        ]);
      });
    });

    describe("without ULI exceptions", function() {
      var iterator = new TwitterCldr.BreakIterator("en", {"use_uli_exceptions" : false});
      it("splits on certain abbreviations like Mr. and Mrs. (use ULI rules to avoid this behavior)", function() {
        var str = "I really like Mrs. Patterson. She's nice.";
        expect(iterator.each_sentence(str)).toEqual([
          "I really like Mrs.",
          " Patterson.",
          " She's nice."
        ]);
      });
    });
  });
});


