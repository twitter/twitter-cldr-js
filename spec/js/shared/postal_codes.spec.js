// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("PostalCodes", function() {
  describe("#all", function() {
    it("checks if some territories are supported", function() {
      expect(TwitterCldr.PostalCodes.territories()).toContain("jp");
    });
    it("checks if invalid territory codes are not supported", function() {
      expect(TwitterCldr.PostalCodes.territories()).not.toContain("xx");
    });
  });

  describe("#territory", function() {
    it("returns '\\d{6}' for the territory 'in'", function() {
      expect(TwitterCldr.PostalCodes.regex_for_territory("in")).toEqual("\\d{6}");
    });
    it("returns null for invalid territories like 'xx' (say)", function() {
      expect(TwitterCldr.PostalCodes.regex_for_territory("xx")).toBe(null);
    });
  });

  describe("#validity", function() {
    it("returns 'true' for the territory 'us' and code '94103'", function() {
      expect(TwitterCldr.PostalCodes.is_valid("us", "94103")).toBe(true);
    });
    it("returns 'true' for the territory 'us' and code '9410'", function() {
      expect(TwitterCldr.PostalCodes.is_valid("us", "9410")).toBe(false);
    });
  });

});
