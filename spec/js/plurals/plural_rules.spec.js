// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("PluralRules", function() {
  describe("#all", function() {
    it("returns an array of all English plural rules", function() {
      expect(TwitterCldr.PluralRules.all()).toEqual(["one", "other"]);
    });

    it("returns an array of the plural rules for the given type", function() {
      var actual_rules = TwitterCldr.PluralRules.all('ordinals');
      var expected_rules = ["one", "two", "few", "other"];

      expect(actual_rules.length).toEqual(expected_rules.length);

      for (actual_rule_idx in actual_rules) {
        expect(expected_rules).toContain(actual_rules[actual_rule_idx]);
      }
    });
  });

  describe("#rule_for", function() {
    it("returns 'one' for the number 1", function() {
      expect(TwitterCldr.PluralRules.rule_for(1)).toEqual("one");
    });

    it("returns 'other' for any number greater than 1", function() {
      for (var i = 2; i < 10; i ++) {
        expect(TwitterCldr.PluralRules.rule_for(i)).toEqual("other");
      }
    });

    it("returns 'other' for the number 0", function() {
      expect(TwitterCldr.PluralRules.rule_for(0)).toEqual("other");
    });

    it("returns correct ordinal plurals", function() {
      expect(TwitterCldr.PluralRules.rule_for(1, 'ordinals')).toEqual("one");
      expect(TwitterCldr.PluralRules.rule_for(2, 'ordinals')).toEqual("two");
      expect(TwitterCldr.PluralRules.rule_for(3, 'ordinals')).toEqual("few");
      expect(TwitterCldr.PluralRules.rule_for(4, 'ordinals')).toEqual("other");
      expect(TwitterCldr.PluralRules.rule_for(11, 'ordinals')).toEqual("other");
      expect(TwitterCldr.PluralRules.rule_for(12, 'ordinals')).toEqual("other");
      expect(TwitterCldr.PluralRules.rule_for(22, 'ordinals')).toEqual("two");
    });
  });
});
