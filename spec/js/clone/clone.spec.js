const locales = "en,ar,ko,ru,hi".split(",");
const date = new Date(2000, 1, 1);

// Updated version of
// https://github.com/twitter/twitter-cldr-npm/blob/master/twitter_cldr.js
// that clones by default
const load = function (locale, options) {
  var defaultOptions = { clone: true };
  options = options || {};

  for (var k in defaultOptions) {
    if (!(k in options)) {
      options[k] = defaultOptions[k];
    }
  }

  var TwitterCldr = require("../../../lib/assets/javascripts/twitter_cldr/core");
  var data = require("../../../lib/assets/javascripts/twitter_cldr/" + locale);

  if (options.clone) {
    return TwitterCldr.clone(data);
  } else {
    TwitterCldr.set_data(data);
    return TwitterCldr;
  }
};

const checkDataIsolation = ({ class: klass, ctorParams, methods, staticMethods, loadOptions }) => {
  methods = methods || {}
  staticMethods = staticMethods || {}
  ctorParams = ctorParams || []

  describe(klass, () => {
    const allMethods = [
      ...(Object.entries(methods)).map(x => [false, ...x]),
      ...(Object.entries(staticMethods)).map(x => [true, ...x]),
    ]

    for (let [static, name, { params, compare }] of allMethods) {
      params = params || []
      compare = compare || ((x) => x)

      describe(`${static ? "." : "#"}${name}`, () => {
        const twitterCldrs = locales.map((locale) => {
          const params = [locale, loadOptions].filter((x) => x != null);
          const TwitterCldr = load(...params);

          return { locale, TwitterCldr };
        });

        const formatters = twitterCldrs.map(({ locale, TwitterCldr }) => {
          const formatter = static ? TwitterCldr[klass] : new TwitterCldr[klass](...ctorParams)

          return { locale, formatter };
        });

        const formatFns = formatters.map(({ locale, formatter }) => ({
          locale,
          format: formatter[name].bind(formatter),
        }));

        const results = formatFns.map(({ locale, format }) => ({
          locale,
          result: compare(format(...params)),
        }));

        it(`sanity check - result for same locale is equal`, () => {
          const { formatter } = formatters[0];
          const format = formatter[name].bind(formatter);

          expect(compare(format(...params))).toBe(compare(format(...params)));
        });

        for (const [idx, { locale, result }] of results.entries()) {
          const prevs = results.slice(0, idx);

          if (!prevs.length) continue;

          for (const prev of prevs) {
            it(`result for "${locale}" differs from result for "${prev.locale}"`, () => {
              expect(result).not.toBe(prev.result);
            });
          }
        }
      });
    }
  });
};

const tests = [
  {
    class: "DateTimeFormatter",
    methods: {
      format: { params: [date, { type: "full" }] },
      weekday_local_stand_alone: { params: [date, "cc", 2] },
    },
  },
  {
    class: "Languages",
    staticMethods: {
      from_code: { params: ["en"] },
      all: { params: [], compare: (x) => x.ja },
    },
  },
  {
    class: "RBNF",
    methods: {
      format: { params: [1, "SpelloutRules", "spellout-numbering"] },
    },
  }
];

describe("data isolation", () => {
  for (const loadOptions of [
    undefined, // no options param supplied
    {}, // empty options - defaults to clone=true
    { clone: true }, // explicitly specify clone=true
  ]) {
    tests.map((x) => ({ ...x, loadOptions })).forEach(checkDataIsolation);
  }
});

describe("clone behavior", () => {
  const TwitterCldr = require("../../../lib/assets/javascripts/twitter_cldr/core");
  const en = require("../../../lib/assets/javascripts/twitter_cldr/en");
  const ja = require("../../../lib/assets/javascripts/twitter_cldr/ja");

  beforeEach(() => {
    TwitterCldr.set_data(undefined);
  })

  afterEach(() => {
    TwitterCldr.set_data(undefined);
  });

  const locale = (clone) => clone.get_data().Settings.locale;

  it("can be cloned from base that has no data", () => {
    const clone = TwitterCldr.clone(en);

    expect(locale(clone)).toBe("en");
    expect(TwitterCldr.is_data_set()).toBe(false);
    expect(clone.is_data_set()).toBe(true);
  });

  it("returns undefined for properties not present on `root`", () => {
    TwitterCldr.set_data(en);
    const clone = TwitterCldr.clone(en);

    expect(TwitterCldr.data).toBe(undefined);
    expect(clone.data).toBe(undefined);
  });

  it("doesn't affect data of the base TwitterCldr", () => {
    TwitterCldr.set_data(ja);
    TwitterCldr.clone(en);

    expect(locale(TwitterCldr)).toBe("ja");
  });


  it("isn't affected by data of the base TwitterCldr", () => {
    const clone = TwitterCldr.clone(en);
    TwitterCldr.set_data(ja);

    expect(locale(clone)).toBe("en");
  });

  it("can be cloned indefinitely", () => {
    const cloneEn1 = TwitterCldr.clone(en);
    const cloneEn2 = cloneEn1.clone(en);
    const cloneJa = cloneEn2.clone(ja);

    expect(locale(cloneEn1)).toBe("en");
    expect(locale(cloneEn2)).toBe(locale(cloneEn1));
    expect(locale(cloneJa)).toBe("ja");
  });

  it("throws if attempting to create a clone with no data", () => {
    expect(() => TwitterCldr.clone()).toThrow();
    expect(() => TwitterCldr.clone(undefined)).toThrow();
    expect(() => TwitterCldr.clone(null)).toThrow();

    expect(() => TwitterCldr.clone({})).not.toThrow();
  });

  describe("cloned version throws if attempting to set data", () => {
    const clone = TwitterCldr.clone(en);

    it("using `set_data`", () => {
      expect(() => clone.set_data({})).toThrow();
    });

    it("using `data = `", () => {
      expect(() => clone.data = {}).toThrow();
    });
  });
});

describe("load(..., false)", () => {
  describe("continues to use global state", () => {
    const results = locales.map((locale) => {
      const TwitterCldr = load(locale, { clone: false });
      return new TwitterCldr.DateTimeFormatter();
    }).map((formatter) => formatter.format(date, { type: "full" }));

    describe("DateTimeFormatter", () => {
      it("#format", () => {
        expect(new Set(results).size).toEqual(1);
      });
    });
  });

  describe("works in environments without `Proxy` support", () => {
    const originalProxy = globalThis.Proxy;

    beforeEach(() => {
      globalThis.Proxy = undefined;
    });

    afterEach(() => {
      globalThis.Proxy = originalProxy;
    });

    describe("DateTimeFormatter", () => {
      it("#weekday_local_stand_alone", () => {
        const TwitterCldr = load("en", { clone: false });
        const formatter = new TwitterCldr.DateTimeFormatter();

        expect(formatter.weekday_local_stand_alone(date, "cc", 2)).toEqual("Tue");
      });
    });
  });
});
