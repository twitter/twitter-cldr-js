// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');

describe("Languages", function() {
  describe("#all", function() {
    it("checks if some locales are supported in the current locale", function() {
      expect(TwitterCldr.Languages.all.ja).not.toBe(null);
      expect(TwitterCldr.Languages.all.es).not.toBe(null);
      expect(TwitterCldr.Languages.all.gl).not.toBe(null);
      expect(TwitterCldr.Languages.all.ur).not.toBe(null);
    });
  });
  describe("#from_code", function() {
    it("returns the language name in current locale based on it's code", function() {
      expect(TwitterCldr.Languages.from_code("ru")).toEqual("Russian");
      expect(TwitterCldr.Languages.from_code("ja")).toEqual("Japanese");
    });
    it("returns null for an invalid language code", function() {
      expect(TwitterCldr.Languages.from_code("xx")).toBe(null);
    });
  })
  describe("#is_rtl", function() {
    it("should return true for certain locales", function() {
      expect(TwitterCldr.Languages.is_rtl("ar")).toBe(true);
      expect(TwitterCldr.Languages.is_rtl("he")).toBe(true);
      expect(TwitterCldr.Languages.is_rtl("ur")).toBe(true);
      expect(TwitterCldr.Languages.is_rtl("fa")).toBe(true);
    });
    it("should return false for certain locales", function() {
      expect(TwitterCldr.Languages.is_rtl("en")).toBe(false);
      expect(TwitterCldr.Languages.is_rtl("es")).toBe(false);
      expect(TwitterCldr.Languages.is_rtl("hu")).toBe(false);
      expect(TwitterCldr.Languages.is_rtl("ja")).toBe(false);
    });
    it("should return null for invalid locales", function() {
      expect(TwitterCldr.Languages.is_rtl("xx")).toBe(null);
    });
  });
});
