// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("CurrencyFormatter", function() {
  describe("#format", function() {
    beforeEach(function() {
      formatter = new TwitterCldr.CurrencyFormatter();
    });

    it("should use a dollar sign when no other currency symbol is given (and default to a precision of 2)", function() {
      expect(formatter.format(12)).toEqual("$12.00");
    });

    it("handles negative numbers", function() {
      // yes, negative numbers (at least for accounting) are represented using parentheses without a minus sign
      expect(formatter.format(-12)).toEqual("-$12.00");
    });

    it("should use the specified currency symbol when specified", function() {
      // S/. is the symbol for the Peruvian Nuevo Sol, just in case you were curious
      expect(formatter.format(12, {currency: "S/."})).toEqual("S/.12.00");
    });

    it("should use the currency symbol for the corresponding currency code", function() {
      expect(formatter.format(12, {currency: "EUR"})).toEqual("€12.00");
    });

    it("should use the default currency precision if it's not specified explicitly", function() {
      expect(formatter.format(12.345, {currency: "JPY"})).toEqual("¥12");
    });

    it("should use given precision if it's specified explicitly", function() {
      expect(formatter.format(12.345, {currency: "JPY", precision: 1})).toEqual("¥12.3");
    });

    it("should allow a precision of zero", function() {
      expect(formatter.format(12.3, {currency: "EUR", precision: 0})).toEqual("€12");
    });

    it("should use the cldr_symbol for the corresponding currency code if use_cldr_code is specified", function() {
      TwitterCldr.Currencies.currencies = {
        "JPY": {symbol: "¥", cldr_symbol: "YEN", currency: "JPY", "name": "Japanese yen"}
      };
      expect(formatter.format(12, {currency: "JPY", use_cldr_symbol: true})).toEqual("YEN12");
    });

    it("overrides the default precision", function() {
      expect(formatter.format(12, {precision: 3})).toEqual("$12.000");
    });
  });
});