// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("Languages", function() {
  describe("#all", function() {
    it("checks if some locales are supported in other locales", function() {
      expect(TwitterCldr.Languages.all_for("ar").ja).not.toBe(null);
      expect(TwitterCldr.Languages.all_for("ja").es).not.toBe(null);
      expect(TwitterCldr.Languages.all_for("es").gl).not.toBe(null);
      expect(TwitterCldr.Languages.all_for("gl").ur).not.toBe(null);
    });
    it("should return null for an invalid locale", function() {
      expect(TwitterCldr.Languages.all_for("xx")).toBe(null);
    });
  });

  describe("#specific_languages_for_locales", function() {
    it("should return the language in the correct locale for the given locale code (i.e. es in English should be Spanish)", function() {
      expect(TwitterCldr.Languages.from_code_for_locale("es", "en")).toEqual("Spanish");
      expect(TwitterCldr.Languages.from_code_for_locale("ru", "es")).toEqual("ruso");
      expect(TwitterCldr.Languages.from_code_for_locale("zh-Hant", "es")).toEqual("chino tradicional");
      expect(TwitterCldr.Languages.from_code_for_locale("uk", "en")).toEqual("Ukrainian");
    });
    it("returns null for invalid locales", function() {
      expect(TwitterCldr.Languages.from_code_for_locale("uk", "xx")).toBe(null);
      expect(TwitterCldr.Languages.from_code_for_locale("xx", "uk")).toBe(null);
    });
  });

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
