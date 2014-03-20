// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("PhoneCodes", function() {
  describe("#all", function() {
    it("checks if some territories are supported", function() {
      expect(TwitterCldr.PhoneCodes.territories()).toContain("jp");
    });
    it("checks if invalid territory codes are not supported", function() {
      expect(TwitterCldr.PhoneCodes.territories()).not.toContain("xx");
    });
  });

  describe("#rule_for", function() {
    it("returns '20' for the territory 'eg'", function() {
      expect(TwitterCldr.PhoneCodes.code_for_territory("eg")).toEqual("20");
    });
    it("returns null for invalid territories like 'xx' (say)", function() {
      expect(TwitterCldr.PhoneCodes.code_for_territory("xx")).toBe(null);
    });
  });
});
