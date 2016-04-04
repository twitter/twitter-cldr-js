// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/en.js');
TwitterCldr.set_data(data);

describe("Currencies", function() {
  describe(".currency_codes", function() {
    it("returns a list of currency codes", function() {
      var codes = TwitterCldr.Currencies.currency_codes();
      expect(codes).toContain('USD');
      expect(codes).toContain('JPY');
      expect(codes).toContain('PEN');
    });
  });

  describe(".for_code", function() {
    it("looks up and returns information for USD currency", function() {
      var usd = TwitterCldr.Currencies.for_code('USD');
      expect(usd).toEqual({
        country: 'USD',
        cldr_symbol: '$',
        symbol: '$',
        currency: 'USD',
        name: 'US dollar',
        code_points: [36]
      });
    });

    it("looks up and returns information for INR currency", function() {
      var inr = TwitterCldr.Currencies.for_code('INR');
      expect(inr).toEqual({
        country: 'INR',
        cldr_symbol: '₹',
        symbol: '₨',
        currency: 'INR',
        name: 'Indian rupee',
        code_points: [8360]
      });
    });
  });
});
