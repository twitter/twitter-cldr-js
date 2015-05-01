// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');

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
      expect(TwitterCldr.PostalCodes.regex_for_territory("in")).toEqual(new RegExp("\\d{6}"));
    });
    it("returns null for invalid territories like 'xx' (say)", function() {
      expect(TwitterCldr.PostalCodes.regex_for_territory("xx")).toBe(null);
    });
  });

  describe("#validity", function() {
    it("returns 'true' for the territory 'us' and code '94103'", function() {
      expect(TwitterCldr.PostalCodes.is_valid("us", "94103")).toBe(true);
    });
    it("returns 'true' for the territory 'gb' and code 'BS98 1TL'", function() {
      expect(TwitterCldr.PostalCodes.is_valid("gb", "BS98 1TL")).toBe(true);
    });
    it("returns 'true' for the territory 'se' and code '280 12'", function() {
      expect(TwitterCldr.PostalCodes.is_valid("se", "280 12")).toBe(true);
    });
    it("returns 'false' for the territory 'us' and code '9410'", function() {
      expect(TwitterCldr.PostalCodes.is_valid("us", "9410")).toBe(false);
    });
    it("returns 'false' for the territory 'us' and code 'BS98 1TL'", function() {
      expect(TwitterCldr.PostalCodes.is_valid("us", "BS98 1TL")).toBe(false);
    });
    it("returns 'false' for the territory 'gb' and code '280 12'", function() {
      expect(TwitterCldr.PostalCodes.is_valid("gb", "280 12")).toBe(false);
    });
  });

});
