// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/es.js');
eval(require('fs').readFileSync('lib/assets/javascripts/twitter_cldr/test_resources.js', 'utf8'));
var failures = {};
formatter = new TwitterCldr.RBNF();
describe("RBNF", function() {
  formatter.resource = TwitterCldr.RBNF.global_resource;
  locale = 'es';
  rule_group = 'OrdinalRules';
  rule_set = 'digits-ordinal-masculine-adjective';
  test_case = 29;
  formatter.locale = locale;
  it ("formats correctly", function() {
    got = formatter.format(test_case, {'rule_group' : rule_group, 'rule_set': rule_set});
    expected = TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set][test_case];
    // console.log(got + " " + expected + " " + (got === expected));
    expect(got).toEqual(expected);
  });
});

/* Try this in Node

var TwitterCldr = require('./lib/assets/javascripts/twitter_cldr/es.js');
eval(require('fs').readFileSync('lib/assets/javascripts/twitter_cldr/test_resources.js', 'utf8'));

formatter = new TwitterCldr.RBNF();
formatter.resource = TwitterCldr.RBNF.global_resource;
locale = 'es';
rule_group = 'OrdinalRules';
rule_set = 'digits-ordinal-masculine-adjective';
test_case = 29;
formatter.locale = locale;

got = formatter.format(test_case, {'rule_group' : rule_group, 'rule_set': rule_set});
expected = TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set][test_case];

*/





  // for (locale in TwitterCldr.RBNF.test_resource)
  // {
  //   if (locale !== "es" && locale !== "en") // && locale != "pt")
  //     continue;
  //   formatter.locale = locale;
  //   describe("for locale: " + locale, function(){
  //     for (rule_group in TwitterCldr.RBNF.test_resource[locale])
  //     {
  //       describe("for Group: " + rule_group, function(){
  //         for (rule_set in TwitterCldr.RBNF.test_resource[locale][rule_group])
  //         {
  //           describe("for Set: " + rule_set, function(){
  //             it("formats correctly", function() {
  //               for (test_case in TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set])
  //               {
  //                 // formatter = new TwitterCldr.RBNF(locale);
  //                 // formatter.resource = TwitterCldr.RBNF.resource;
  //                 // formatter.locale = locale;
  //                 got = formatter.format((test_case), {'rule_group' : rule_group, 'rule_set': rule_set});
  //                 expected = TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set][test_case];
  //                 console.log(got + " " + expected + " " + (got === expected));
  //                 expect(got).toEqual(expected);
  //               }
  //             });
  //           });
  //         }
  //       });
  //     }
  //   });
  // }
