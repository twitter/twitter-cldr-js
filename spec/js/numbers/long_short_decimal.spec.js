const TwitterCldr = require("../../../lib/assets/javascripts/twitter_cldr/core.js");

const testData = {
  Long: {
    "en": [
      // edge cases
      { raw: 999_499, precisions: ["999 thousand", "999.5 thousand"] },
      { raw: 999_500, precisions: ["1 million", "999.5 thousand"] },
      { raw: 1_000_000, precisions: ["1 million", "1.0 million"] },

      // fractional
      { raw: 999.49, precisions: ["999", "999.5"], default: "999.49" },
      { raw: 999.5, precisions: ["1 thousand", "999.5"], default: "999.5" },

      // negative
      { raw: -1_000_000, precisions: ["-1,000,000"] },
      { raw: -999_500, precisions: ["-999,500"] },
    ],
    "zh-cn": [
      // edge cases
      { raw: 9499, precisions: ["9千", "9.5千"] },
      { raw: 9500, precisions: ["1万", "9.5千"] },
      { raw: 10_000, precisions: ["1万", "1.0万"] },
    ],
    "es": [
      // pluralization
      { raw: 1e3, precisions: ["1 mil", "1,0 mil"] },
      { raw: 2e3, precisions: ["2 mil", "2,0 mil"] },
      { raw: 1e6, precisions: ["1 millón", "1,0 millón"] },
      { raw: 2e6, precisions: ["2 millones", "2,0 millones"] },
      { raw: 1e9, precisions: ["1 mil millones", "1,0 mil millones"] },

      // fractional
      { raw: 999.49, precisions: ["999", "999,5"], default: "999,49" },
      { raw: 999.5, precisions: ["1 mil", "999,5"], default: "999,5" },

      // negative
      { raw: -1_000_000, precisions: ["-1.000.000"] },
      { raw: -999_500, precisions: ["-999.500"] },
    ],
  },
  Short: {
    "en": [
      // edge cases
      { raw: 999_499, precisions: ["999K", "999.5K"] },
      { raw: 999_500, precisions: ["1M", "999.5K"] },
      { raw: 1_000_000, precisions: ["1M", "1.0M"] },
    ],
  },
};

for (const [kind, locales] of Object.entries(testData)) {
  for (const [localeFileName, tests] of Object.entries(locales)) {
    describe(`${kind}DecimalFormatter (${localeFileName})`, () => {
      let formatter;

      beforeEach(() => {
        TwitterCldr.set_data(require(`../../../lib/assets/javascripts/twitter_cldr/${localeFileName}`));
        formatter = new TwitterCldr[`${kind}DecimalFormatter`]();
      });

      describe("#format", () => {
        for (const { raw, precisions, default: _default } of tests) {
          it(`formats ${raw} with no options supplied`, () => {
            expect(formatter.format(raw)).toEqual(_default ?? precisions[0]);
          });

          for (const [precision, expected] of precisions.entries()) {
            it(`formats ${raw} to precision ${precision}`, () => {
              expect(formatter.format(raw, { precision })).toEqual(expected);
            });
          }
        }
      });
    });
  }
}
