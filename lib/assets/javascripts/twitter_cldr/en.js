
/*
// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0
<<<<<<< HEAD

// TwitterCLDR (JavaScript) v2.5.0
=======
// TwitterCLDR (JavaScript) v2.4.0
>>>>>>> Separated data/logic for the calendar modules.
// Authors:     Cameron Dutro [@camertron]
                Kirill Lashuk [@KL_7]
                portions by Sven Fuchs [@svenfuchs]
// Homepage:    https://twitter.com
// Description: Provides date, time, number, and list formatting functionality for various Twitter-supported locales in Javascript.
 */


/*-module-*/
/*_lib/twitter_cldr_*/

(function() {
  var key, obj, root;

  this.TwitterCldr = this.TwitterCldr == null ? {} : this.TwitterCldr;

  root = typeof exports !== "undefined" && exports !== null ? exports : (this.TwitterCldr = {}, this.TwitterCldr);

  for (key in TwitterCldr) {
    obj = TwitterCldr[key];
    root[key] = obj;
  }

  TwitterCldr.is_rtl = false;

  TwitterCldr.locale = "en";

  TwitterCldr.PluralRules.rules = {cardinal: (function(num, runtime) { var n = runtime.n(num); var i = runtime.i(num); var v = runtime.v(num); var w = runtime.w(num); var f = runtime.f(num); var t = runtime.t(num); return ((i == 1 && v == 0) ? 'one' : 'other'); }), ordinal: (function(num, runtime) { var n = runtime.n(num); var i = runtime.i(num); var v = runtime.v(num); var w = runtime.w(num); var f = runtime.f(num); var t = runtime.t(num); return ((n % 10 == 3 && n % 100 != 13) ? 'few' : ((n % 10 == 1 && n % 100 != 11) ? 'one' : ((n % 10 == 2 && n % 100 != 12) ? 'two' : 'other'))); })};

  TwitterCldr.PluralRules.names = {
    cardinal: ["one", "other"],
    ordinal: ["few", "one", "other", "two"]
  };

  TwitterCldr.TimespanFormatter.patterns = {"ago":{"second":{"default":{"one":"{0} second ago","other":"{0} seconds ago"}},"minute":{"default":{"one":"{0} minute ago","other":"{0} minutes ago"}},"hour":{"default":{"one":"{0} hour ago","other":"{0} hours ago"}},"day":{"default":{"one":"{0} day ago","other":"{0} days ago"}},"week":{"default":{"one":"{0} week ago","other":"{0} weeks ago"}},"month":{"default":{"one":"{0} month ago","other":"{0} months ago"}},"year":{"default":{"one":"{0} year ago","other":"{0} years ago"}}},"until":{"second":{"default":{"one":"In {0} second","other":"In {0} seconds"}},"minute":{"default":{"one":"In {0} minute","other":"In {0} minutes"}},"hour":{"default":{"one":"In {0} hour","other":"In {0} hours"}},"day":{"default":{"one":"In {0} day","other":"In {0} days"}},"week":{"default":{"one":"In {0} week","other":"In {0} weeks"}},"month":{"default":{"one":"In {0} month","other":"In {0} months"}},"year":{"default":{"one":"In {0} year","other":"In {0} years"}}},"none":{"second":{"default":{"one":"{0} second","other":"{0} seconds"},"short":{"one":"{0} sec","other":"{0} secs"},"abbreviated":{"one":"{0}s","other":"{0}s"}},"minute":{"default":{"one":"{0} minute","other":"{0} minutes"},"short":{"one":"{0} min","other":"{0} mins"},"abbreviated":{"one":"{0}m","other":"{0}m"}},"hour":{"default":{"one":"{0} hour","other":"{0} hours"},"short":{"one":"{0} hr","other":"{0} hrs"},"abbreviated":{"one":"{0}h","other":"{0}h"}},"day":{"default":{"one":"{0} day","other":"{0} days"},"short":{"one":"{0} day","other":"{0} days"},"abbreviated":{"one":"{0}d","other":"{0}d"}},"week":{"default":{"one":"{0} week","other":"{0} weeks"},"short":{"one":"{0} wk","other":"{0} wks"}},"month":{"default":{"one":"{0} month","other":"{0} months"},"short":{"one":"{0} mth","other":"{0} mths"}},"year":{"default":{"one":"{0} year","other":"{0} years"},"short":{"one":"{0} yr","other":"{0} yrs"}}}};

  TwitterCldr.DateTimeFormatter.tokens = {"date_time":{"default":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"full":[{"value":"EEEE","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'at'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"zzzz","type":"pattern"}],"long":[{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'at'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"z","type":"pattern"}],"medium":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"short":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"yy","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"additional":{"E":[{"value":"ccc","type":"pattern"}],"EHm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"E","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"pattern"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"MMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Md":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"QQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQQ":[{"value":"QQQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}]}},"time":{"default":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"full":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"zzzz","type":"pattern"}],"long":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"z","type":"pattern"}],"medium":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"short":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"additional":{"E":[{"value":"ccc","type":"plaintext"}],"EHm":[{"value":"E ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"d E","type":"plaintext"}],"Ehm":[{"value":"E ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y G","type":"plaintext"}],"GyMMM":[{"value":"MMM y G","type":"plaintext"}],"GyMMMEd":[{"value":"E, MMM d, y G","type":"plaintext"}],"GyMMMd":[{"value":"MMM d, y G","type":"plaintext"}],"H":[{"value":"HH","type":"pattern"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"plaintext"}],"MEd":[{"value":"E, M/d","type":"plaintext"}],"MMM":[{"value":"LLL","type":"plaintext"}],"MMMEd":[{"value":"E, MMM d","type":"plaintext"}],"MMMd":[{"value":"MMM d","type":"plaintext"}],"Md":[{"value":"M/d","type":"plaintext"}],"d":[{"value":"d","type":"plaintext"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"plaintext"}],"yM":[{"value":"M/y","type":"plaintext"}],"yMEd":[{"value":"E, M/d/y","type":"plaintext"}],"yMMM":[{"value":"MMM y","type":"plaintext"}],"yMMMEd":[{"value":"E, MMM d, y","type":"plaintext"}],"yMMMd":[{"value":"MMM d, y","type":"plaintext"}],"yMd":[{"value":"M/d/y","type":"plaintext"}],"yQQQ":[{"value":"QQQ y","type":"plaintext"}],"yQQQQ":[{"value":"QQQQ y","type":"plaintext"}]}},"date":{"default":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"full":[{"value":"EEEE","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"long":[{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"medium":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"short":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"yy","type":"pattern"}],"additional":{"E":[{"value":"ccc","type":"pattern"}],"EHm":[{"value":"E","type":"pattern"},{"value":" HH:mm","type":"plaintext"}],"EHms":[{"value":"E","type":"pattern"},{"value":" HH:mm:ss","type":"plaintext"}],"Ed":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"E","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" h:mm a","type":"plaintext"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" h:mm:ss a","type":"plaintext"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"plaintext"}],"Hm":[{"value":"HH:mm","type":"plaintext"}],"Hms":[{"value":"HH:mm:ss","type":"plaintext"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"MMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Md":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h a","type":"plaintext"}],"hm":[{"value":"h:mm a","type":"plaintext"}],"hms":[{"value":"h:mm:ss a","type":"plaintext"}],"ms":[{"value":"mm:ss","type":"plaintext"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"QQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQQ":[{"value":"QQQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}]}}};

<<<<<<< HEAD
    Component.prototype.to_utf8 = function(codepoints) {
      var cp, _i, _len, _results;
      if (!(codepoints instanceof Array)) {
        codepoints = [codepoints];
      }
      _results = [];
      for (_i = 0, _len = codepoints.length; _i < _len; _i++) {
        cp = codepoints[_i];
        _results.push(this.to_hex(cp));
      }
      return _results;
    };

    Component.prototype.to_hex = function(codepoint) {
      var first, second;
      if (codepoint >= 0 && codepoint <= 0xD7FF || codepoint >= 0xE000 && codepoint <= 0xFFFF) {
        return this.to_escaped_hex(codepoint);
      } else if (codepoint >= 0x10000 && codepoint <= 0x10FFFF) {
        codepoint -= 0x10000;
        first = ((0xffc00 & codepoint) >> 10) + 0xD800;
        second = (0x3ff & codepoint) + 0xDC00;
        return this.to_escaped_hex(first) + '+' + this.to_escaped_hex(second);
      }
    };

    Component.prototype.to_escaped_hex = function(codepoint) {
      var s;
      s = codepoint.toString(16);
      s = "0000".slice(0, 4 - s.length) + s;
      return "\\u" + s;
    };

    Component.prototype.range_to_regex = function(range) {
      if (range.first instanceof Array) {
        return this.array_to_regex(range);
      } else {
        if (range.size === 1) {
          return "[" + this.to_utf8(range.first) + "]";
        } else {
          return "[" + this.to_utf8(range.first) + "-" + this.to_utf8(range.last) + "]";
        }
      }
    };

    Component.prototype.array_to_regex = function(arr) {
      var c;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          c = arr[_i];
          _results.push("(?:" + this.to_utf8(c) + ")");
        }
        return _results;
      }).call(this)).join("");
    };

    Component.prototype.set_to_regex = function(set) {
      var element, strs;
      strs = (function() {
        var _i, _len, _ref, _results;
        _ref = TwitterCldr.Utilities.remove_duplicates(set.to_array(true));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          _results.push(this._set_element_to_regex(element));
        }
        return _results;
      }).call(this);
      return "(?:" + strs.join("|") + ")";
    };

    Component.prototype._set_element_to_regex = function(element) {
      if (element instanceof TwitterCldr.Range) {
        return this.range_to_regex(element);
      } else if (element instanceof Array) {
        return this.array_to_regex(element);
      } else {
        return this.to_utf8(element);
      }
    };

    return Component;

  })();

  TwitterCldr.Literal = (function(_super) {
    __extends(Literal, _super);

    function Literal(text) {
      var char;
      this.text = text;
      this.special_characters = {
        s: [32],
        t: [9],
        r: [13],
        n: [10],
        f: [12],
        d: (function() {
          var _i, _results;
          _results = [];
          for (char = _i = 48; _i <= 57; char = ++_i) {
            _results.push(char);
          }
          return _results;
        })(),
        w: (function() {
          var _i, _j, _k, _len, _ref, _results, _results1, _results2;
          _ref = (function() {
            _results2 = [];
            for (_k = 97; _k <= 122; _k++){ _results2.push(_k); }
            return _results2;
          }).apply(this).concat((function() {
            _results1 = [];
            for (_j = 65; _j <= 90; _j++){ _results1.push(_j); }
            return _results1;
          }).apply(this)).concat([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]).concat([95]);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            char = _ref[_i];
            _results.push(char);
          }
          return _results;
        })()
      };
      Literal.__super__.constructor.apply(this, arguments);
    }

    Literal.prototype.ordinalize = function(char) {
      return TwitterCldr.Utilities.char_code_at(char, 0);
    };

    Literal.prototype.to_regexp_str = function() {
      return this.text;
    };

    Literal.prototype.to_set = function() {
      var special_char;
      if (this.text.match(/^\\/)) {
        special_char = this.text.slice(1);
        if (this.special_characters[special_char.toLowerCase()] != null) {
          return this.set_for_special_char(special_char);
        } else {
          return TwitterCldr.RangeSet.from_array([this.ordinalize(special_char)]);
        }
      } else {
        return TwitterCldr.RangeSet.from_array([this.ordinalize(this.text)]);
      }
    };

    Literal.prototype.set_for_special_char = function(char) {
      var chars;
      chars = TwitterCldr.RangeSet.from_array(this.special_characters[char.toLowerCase()]);
      if (char.toUpperCase() === char) {
        return TwitterCldr.UnicodeRegex.get_valid_regexp_chars().subtract(chars);
      } else {
        return chars;
      }
    };

    return Literal;

  })(TwitterCldr.Component);

  TwitterCldr.UnicodeString = (function(_super) {
    __extends(UnicodeString, _super);

    function UnicodeString(codepoints) {
      this.codepoints = codepoints;
      UnicodeString.__super__.constructor.apply(this, arguments);
    }

    UnicodeString.prototype.to_set = function() {
      if (this.codepoints.length > 1) {
        return new TwitterCldr.RangeSet([new TwitterCldr.Range(this.codepoints, this.codepoints)]);
      } else {
        return new TwitterCldr.RangeSet([new TwitterCldr.Range(this.codepoints[0], this.codepoints[0])]);
      }
    };

    UnicodeString.prototype.to_regexp_str = function() {
      var cps;
      cps = (this.codepoints instanceof Array ? this.codepoints : [this.codepoints]);
      return this.array_to_regex(cps);
    };

    return UnicodeString;

  })(TwitterCldr.Component);

  TwitterCldr.CharacterClass = (function(_super) {
    __extends(CharacterClass, _super);

    function CharacterClass(root) {
      this.root = root;
      this.type = "character_class";
      this.grouping_pairs = TwitterCldr.CharacterClass.grouping_pairs;
      CharacterClass.__super__.constructor.apply(this, arguments);
    }

    CharacterClass.grouping_pairs = {
      "close_bracket": "open_bracket"
    };

    CharacterClass.opening_types = function() {
      var key, value, _ref, _results;
      _ref = this.grouping_pairs;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(value);
      }
      return _results;
    };

    CharacterClass.closing_types = function() {
      var key, value, _ref, _results;
      _ref = this.grouping_pairs;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(key);
      }
      return _results;
    };

    CharacterClass.opening_type_for = function(type) {
      if (this.grouping_pairs[type] != null) {
        return this.grouping_pairs[type];
      } else {
        return null;
      }
    };

    CharacterClass.prototype.to_regexp_str = function() {
      return this.set_to_regex(this.to_set());
    };

    CharacterClass.prototype.to_set = function() {
      return this.evaluate(this.root);
    };

    CharacterClass.prototype.evaluate = function(node) {
      if (node instanceof TwitterCldr.CharacterClass.UnaryOperator || node instanceof TwitterCldr.CharacterClass.BinaryOperator) {
        switch (node.operator) {
          case "negate":
            return TwitterCldr.UnicodeRegex.get_valid_regexp_chars().subtract(this.evaluate(node.child));
          case "union":
          case "pipe":
            return this.evaluate(node.left).union(this.evaluate(node.right));
          case "dash":
            return this.evaluate(node.left).difference(this.evaluate(node.right));
          case "ampersand":
            return this.evaluate(node.left).intersection(this.evaluate(node.right));
        }
      } else {
        if (node != null) {
          return node.to_set();
        } else {
          return new TwitterCldr.RangeSet([]);
        }
      }
    };

    CharacterClass.BinaryOperator = (function() {
      function BinaryOperator(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
      }

      return BinaryOperator;

    })();

    CharacterClass.UnaryOperator = (function() {
      function UnaryOperator(operator, child) {
        this.operator = operator;
        this.child = child;
      }

      return UnaryOperator;

    })();

    return CharacterClass;

  })(TwitterCldr.Component);

  TwitterCldr.CharacterRange = (function(_super) {
    __extends(CharacterRange, _super);

    function CharacterRange(initial, final) {
      this.initial = initial;
      this.final = final;
      this.type = "character_range";
      CharacterRange.__super__.constructor.apply(this, arguments);
    }

    CharacterRange.prototype.to_set = function() {
      return new TwitterCldr.RangeSet([new TwitterCldr.Range(this.initial.to_set().to_full_array()[0], this.final.to_set().to_full_array()[0])]);
    };

    return CharacterRange;

  })(TwitterCldr.Component);

  TwitterCldr.CharacterSet = (function(_super) {
    __extends(CharacterSet, _super);

    function CharacterSet(text) {
      var name_parts;
      name_parts = text.split("=");
      if (name_parts.length === 2) {
        this.property = name_parts[0].toLowerCase();
        this.property_value = name_parts[1];
      } else {
        this.property_value = text;
        this.property = null;
      }
    }

    CharacterSet.prototype.to_regexp_str = function() {
      return this.set_to_regex(this.to_set());
    };

    CharacterSet.prototype.to_set = function() {
      return this.codepoints().subtract(TwitterCldr.UnicodeRegex.get_unsupported_chars()).subtract(TwitterCldr.UnicodeRegex.get_invalid_regexp_chars());
    };

    CharacterSet.prototype.codepoints = function() {
      var method, ranges;
      if (this.property != null) {
        method = "code_points_for_" + this.property;
        ranges = TwitterCldr.CodePoint.code_points_for_property(this.property, this.property_value);
        if (ranges != null) {
          return new TwitterCldr.RangeSet(ranges);
        } else {
          throw "Couldn't find property " + this.property + " containing property value " + this.property_value;
        }
      } else {
        return new TwitterCldr.RangeSet(TwitterCldr.CodePoint.code_points_for_property_value(this.property_value));
      }
    };

    return CharacterSet;

  })(TwitterCldr.Component);

  TwitterCldr.SymbolTable = (function() {
    function SymbolTable(symbols) {
      this.symbols = symbols != null ? symbols : {};
    }

    SymbolTable.prototype.fetch = function(symbol) {
      return this.symbols[symbol];
    };

    SymbolTable.prototype.add = function(symbol, value) {
      return this.symbols[symbol] = value;
    };

    return SymbolTable;

  })();

  TwitterCldr.Parser = (function() {
    function Parser(tokens) {
      this.tokens = tokens;
      this.token_index = 0;
    }

    Parser.prototype.parse = function(tokens, options) {
      if (options == null) {
        options = {};
      }
      this.tokens = tokens;
      this.reset();
      return this.do_parse(options);
    };

    Parser.prototype.reset = function() {
      return this.token_index = 0;
    };

    Parser.prototype.next_token = function(type) {
      if (this.current_token().type !== type) {
        throw "Unexpected token";
      }
      this.token_index += 1;
      while ((this.current_token() != null) && this.is_empty(this.current_token())) {
        this.token_index += 1;
      }
      return this.current_token();
    };

    Parser.prototype.is_empty = function(token) {
      return token.type === "plaintext" && token.value === "";
    };

    Parser.prototype.current_token = function() {
      return this.tokens[this.token_index];
    };

    return Parser;

  })();

  TwitterCldr.SegmentationParser = (function(_super) {
    __extends(SegmentationParser, _super);

    function SegmentationParser() {
      this.begin_token || (this.begin_token = new TwitterCldr.Token({
        type: "special_char",
        value: "^"
      }));
      this.regex_parser || (this.regex_parser = new TwitterCldr.UnicodeRegexParser);
    }

    SegmentationParser.RuleMatchData = (function() {
      function RuleMatchData(text, boundary_offset) {
        this.text = text;
        this.boundary_offset = boundary_offset;
      }

      return RuleMatchData;

    })();

    SegmentationParser.Rule = (function() {
      function Rule() {}

      return Rule;

    })();

    SegmentationParser.BreakRule = (function(_super1) {
      __extends(BreakRule, _super1);

      function BreakRule(left, right) {
        this.left = left;
        this.right = right;
        this.boundary_symbol = "break";
        BreakRule.__super__.constructor.apply(this, arguments);
      }

      BreakRule.prototype.match = function(str) {
        var left_match, match_pos, right_match;
        left_match = this.left.match(str);
        if ((this.left != null) && (left_match != null)) {
          match_pos = str.indexOf(left_match[0]) + left_match[0].length;
          if (this.right != null) {
            right_match = this.right.match(str.slice(match_pos));
            if (right_match != null) {
              return new TwitterCldr.SegmentationParser.RuleMatchData(left_match[0] + right_match[0], match_pos);
            }
          } else {
            return new TwitterCldr.SegmentationParser.RuleMatchData(str, str.length);
          }
        }
        return null;
      };

      return BreakRule;

    })(SegmentationParser.Rule);

    SegmentationParser.NoBreakRule = (function(_super1) {
      __extends(NoBreakRule, _super1);

      function NoBreakRule(regex) {
        this.regex = regex;
        this.boundary_symbol = "no_break";
        NoBreakRule.__super__.constructor.apply(this, arguments);
      }

      NoBreakRule.prototype.match = function(str) {
        var match;
        match = this.regex.match(str);
        if (match != null) {
          return new TwitterCldr.SegmentationParser.RuleMatchData(match[0], str.indexOf(match[0]) + match[0].length);
        } else {
          return null;
        }
      };

      return NoBreakRule;

    })(SegmentationParser.Rule);

    SegmentationParser.prototype.do_parse = function(options) {
      var boundary_symbol, current_regex_tokens, regex_token_lists, result, _ref;
      if (options == null) {
        options = {};
      }
      regex_token_lists = [];
      current_regex_tokens = [];
      boundary_symbol = null;
      while (this.current_token() != null) {
        switch (this.current_token().type) {
          case "break":
          case "no_break":
            boundary_symbol = this.current_token().type;
            regex_token_lists.push(current_regex_tokens);
            current_regex_tokens = [];
            break;
          default:
            current_regex_tokens.push(this.current_token());
        }
        this.next_token(this.current_token().type);
      }
      regex_token_lists.push(current_regex_tokens);
      result = null;
      switch (boundary_symbol) {
        case "break":
          result = new TwitterCldr.SegmentationParser.BreakRule(this.parse_regex(this.add_anchors(regex_token_lists[0]), options), this.parse_regex(this.add_anchors(regex_token_lists[1]), options));
          break;
        case "no_break":
          result = new TwitterCldr.SegmentationParser.NoBreakRule(this.parse_regex(this.add_anchors((_ref = []).concat.apply(_ref, regex_token_lists)), options));
      }
      return result;
    };

    SegmentationParser.prototype.add_anchors = function(token_list) {
      return [this.begin_token].concat(token_list);
    };

    SegmentationParser.prototype.parse_regex = function(tokens, options) {
      if (options == null) {
        options = {};
      }
      if ((tokens != null) && tokens.length !== 0) {
        return new TwitterCldr.UnicodeRegex(this.regex_parser.parse(tokens, options));
      } else {
        return null;
      }
    };

    return SegmentationParser;

  })(TwitterCldr.Parser);

  TwitterCldr.UnicodeRegexParser = (function(_super) {
    __extends(UnicodeRegexParser, _super);

    function UnicodeRegexParser() {
      this.character_class_token_types = ["variable", "character_set", "negated_character_set", "unicode_char", "multichar_string", "string", "escaped_character", "character_range"];
      this.negated_token_types = ["negated_character_set"];
      this.binary_operators = ["pipe", "ampersand", "dash", "union"];
      this.unary_operators = ["negate"];
    }

    UnicodeRegexParser.prototype.parse = function(tokens, options) {
      if (options == null) {
        options = {};
      }
      return UnicodeRegexParser.__super__.parse.call(this, this.preprocess(this.substitute_variables(tokens, options.symbol_table)), options);
    };

    UnicodeRegexParser.prototype.make_token = function(type, value) {
      return new TwitterCldr.Token({
        "type": type,
        "value": value
      });
    };

    UnicodeRegexParser.prototype.preprocess = function(tokens) {
      var add_union, final, i, initial, is_range, result;
      result = [];
      i = 0;
      while (i < tokens.length) {
        add_union = (this.is_valid_character_class_token(result[result.length - 1]) && tokens[i].type !== "close_bracket") || ((result[result.length - 1] != null) && result[result.length - 1].type === "close_bracket" && tokens[i].type === "open_bracket");
        if (add_union) {
          result.push(this.make_token("union"));
        }
        is_range = this.is_valid_character_class_token(tokens[i]) && this.is_valid_character_class_token(tokens[i + 2]) && tokens[i + 1].type === "dash";
        if (is_range) {
          initial = this[tokens[i].type](tokens[i]);
          final = this[tokens[i + 2].type](tokens[i + 2]);
          result.push(this.make_character_range(initial, final));
          i += 3;
        } else {
          if (this.is_negated_token(tokens[i])) {
            result = result.concat([this.make_token("open_bracket"), this.make_token("negate"), tokens[i], this.make_token("close_bracket")]);
          } else {
            result.push(tokens[i]);
          }
          i += 1;
        }
      }
      return result;
    };

    UnicodeRegexParser.prototype.substitute_variables = function(tokens, symbol_table) {
      var i, result, sub, token, _i, _ref;
      if (symbol_table == null) {
        return tokens;
      }
      result = [];
      for (i = _i = 0, _ref = tokens.length; _i < _ref; i = _i += 1) {
        token = tokens[i];
        if (token.type === "variable" && ((sub = symbol_table.fetch(token.value)) != null)) {
          result = result.concat(this.substitute_variables(sub, symbol_table));
        } else {
          result.push(token);
        }
      }
      return result;
    };

    UnicodeRegexParser.prototype.make_character_range = function(initial, final) {
      return new TwitterCldr.CharacterRange(initial, final);
    };

    UnicodeRegexParser.prototype.is_negated_token = function(token) {
      var _ref;
      return (token != null) && (_ref = token.type, __indexOf.call(this.negated_token_types, _ref) >= 0);
    };

    UnicodeRegexParser.prototype.is_valid_character_class_token = function(token) {
      var _ref;
      return (token != null) && (_ref = token.type, __indexOf.call(this.character_class_token_types, _ref) >= 0);
    };

    UnicodeRegexParser.prototype.is_unary_operator = function(token) {
      var _ref;
      return (token != null) && (_ref = token.type, __indexOf.call(this.unary_operators, _ref) >= 0);
    };

    UnicodeRegexParser.prototype.is_binary_operator = function(token) {
      var _ref;
      return (token != null) && (_ref = token.type, __indexOf.call(this.binary_operators, _ref) >= 0);
    };

    UnicodeRegexParser.prototype.do_parse = function(options) {
      var elements;
      elements = [];
      while (this.current_token()) {
        switch (this.current_token().type) {
          case "open_bracket":
            elements.push(this.character_class());
            break;
          case "union":
            this.next_token("union");
            break;
          default:
            elements.push(this[this.current_token().type](this.current_token()));
            this.next_token(this.current_token().type);
        }
      }
      return elements;
    };

    UnicodeRegexParser.prototype.character_set = function(token) {
      return new TwitterCldr.CharacterSet(token.value.replace(/^\\p/g, "").replace(/[\{\}\[\]:]/g, ""));
    };

    UnicodeRegexParser.prototype.negated_character_set = function(token) {
      return new TwitterCldr.CharacterSet(token.value.replace(/^\\[pP]/g, "").replace(/[\{\}\[\]:^]/g, ""));
    };

    UnicodeRegexParser.prototype.unicode_char = function(token) {
      return new TwitterCldr.UnicodeString([parseInt(token.value.replace(/^\\u/g, "").replace(/[\{\}]/g, ""), 16)]);
    };

    UnicodeRegexParser.prototype.string = function(token) {
      return new TwitterCldr.UnicodeString(TwitterCldr.Utilities.unpack_string(token.value));
    };

    UnicodeRegexParser.prototype.multichar_string = function(token) {
      return new TwitterCldr.UnicodeString(TwitterCldr.Utilities.unpack_string(token.value.replace(/[\{\}]/g, "")));
    };

    UnicodeRegexParser.prototype.escaped_character = function(token) {
      return new TwitterCldr.Literal(token.value);
    };

    UnicodeRegexParser.prototype.special_char = function(token) {
      return new TwitterCldr.Literal(token.value);
    };

    UnicodeRegexParser.prototype.negate = function(token) {
      return this.special_char(token);
    };

    UnicodeRegexParser.prototype.pipe = function(token) {
      return this.special_char(token);
    };

    UnicodeRegexParser.prototype.ampersand = function(token) {
      return this.special_char(token);
    };

    UnicodeRegexParser.prototype.character_range = function(token) {
      return token;
    };

    UnicodeRegexParser.prototype.character_class = function() {
      var last_operator, node, open_count, operand_stack, operator, operator_stack, _ref, _ref1, _ref2;
      operator_stack = [];
      operand_stack = [];
      open_count = 0;
      while (true) {
        if (_ref = this.current_token().type, __indexOf.call(TwitterCldr.CharacterClass.closing_types(), _ref) >= 0) {
          last_operator = this.peek(operator_stack);
          open_count -= 1;
          while (last_operator.type !== TwitterCldr.CharacterClass.opening_type_for(this.current_token().type)) {
            operator = operator_stack.pop();
            node = this.is_unary_operator(operator) ? this.unary_operator_node(operator.type, operand_stack.pop()) : this.binary_operator_node(operator.type, operand_stack.pop(), operand_stack.pop());
            operand_stack.push(node);
            last_operator = this.peek(operator_stack);
          }
          operator_stack.pop();
        } else if (_ref1 = this.current_token().type, __indexOf.call(TwitterCldr.CharacterClass.opening_types(), _ref1) >= 0) {
          open_count += 1;
          operator_stack.push(this.current_token());
        } else if (_ref2 = this.current_token().type, __indexOf.call(this.unary_operators.concat(this.binary_operators), _ref2) >= 0) {
          operator_stack.push(this.current_token());
        } else {
          operand_stack.push(this[this.current_token().type](this.current_token()));
        }
        this.next_token(this.current_token().type);
        if (operator_stack.length === 0 && open_count === 0) {
          break;
        }
      }
      return new TwitterCldr.CharacterClass(operand_stack.pop());
    };

    UnicodeRegexParser.prototype.peek = function(array) {
      return array[array.length - 1];
    };

    UnicodeRegexParser.prototype.binary_operator_node = function(operator, right, left) {
      return new TwitterCldr.CharacterClass.BinaryOperator(operator, left, right);
    };

    UnicodeRegexParser.prototype.unary_operator_node = function(operator, child) {
      return new TwitterCldr.CharacterClass.UnaryOperator(operator, child);
    };

    return UnicodeRegexParser;

  })(TwitterCldr.Parser);

  TwitterCldr.Token = (function() {
    function Token(options) {
      var k, v;
      if (options == null) {
        options = {};
      }
      for (k in options) {
        v = options[k];
        this[k] = v;
      }
    }

    Token.prototype.to_hash = function() {
      return {
        "value": this.value,
        "type": this.type
      };
    };

    Token.prototype.to_string = function() {
      return this.value;
    };

    return Token;

  })();

  TwitterCldr.CompositeToken = (function() {
    function CompositeToken(tokens) {
      this.tokens = tokens;
      this.type = "composite";
    }

    CompositeToken.prototype.to_string = function() {
      var token;
      if (this.tokens == null) {
        return null;
      }
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = this.tokens;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          token = _ref[_i];
          _results.push(token.to_string());
        }
        return _results;
      }).call(this)).join("");
    };

    return CompositeToken;

  })();

  TwitterCldr.TokenRecognizer = (function() {
    function TokenRecognizer(token_type, regex, cleaner, content) {
      this.token_type = token_type;
      this.regex = regex;
      this.cleaner = cleaner;
      this.content = content != null ? content : null;
    }

    TokenRecognizer.prototype.recognizes = function(text) {
      return this.regex.test(text);
    };

    TokenRecognizer.prototype.clean = function(val) {
      if (this.cleaner != null) {
        return this.cleaner(val);
      } else {
        return val;
      }
    };

    return TokenRecognizer;

  })();

  TwitterCldr.Tokenizer = (function() {
    function Tokenizer(recognizers, custom_splitter, remove_empty_entries) {
      var recognizer;
      this.recognizers = recognizers;
      this.custom_splitter = custom_splitter != null ? custom_splitter : null;
      this.remove_empty_entries = remove_empty_entries != null ? remove_empty_entries : true;
      this.splitter = this.custom_splitter || new RegExp("(" + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = recognizers.length; _i < _len; _i++) {
          recognizer = recognizers[_i];
          _results.push(recognizer.regex.source);
        }
        return _results;
      })()).join("|") + ")");
    }

    Tokenizer.union = function(tokenizers, block) {
      var flag, recog_ret, recognizer, recognizers, splitter, tokenizer, _i, _j, _k, _len, _len1, _len2, _ref;
      recognizers = [];
      for (_i = 0, _len = tokenizers.length; _i < _len; _i++) {
        tokenizer = tokenizers[_i];
        recog_ret = [];
        _ref = tokenizer.recognizers;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          recognizer = _ref[_j];
          if ((block != null) && block(recognizer) || (block == null)) {
            recog_ret.push(recognizer);
          }
        }
        recognizer.concat(recog_ret);
      }
      flag = true;
      for (_k = 0, _len2 = tokenizers.length; _k < _len2; _k++) {
        tokenizer = tokenizers[_k];
        if ((this.custom_splitter != null) && !(this.custom_splitter(tokenizer))) {
          flag = false;
        }
      }
      splitter = null;
      if (flag) {
        splitter = new Regexp(((function() {
          var _l, _len3, _results;
          _results = [];
          for (_l = 0, _len3 = tokenizers.length; _l < _len3; _l++) {
            tokenizer = tokenizers[_l];
            _results.push(tokenizer.custom_splitter.source);
          }
          return _results;
        })()).join("|"));
      }
      return new TwitterCldr.Tokenizer(recognizers, splitter);
    };

    Tokenizer.prototype.recognizer_at = function(token_type) {
      var recognizer, _i, _len, _ref, _results;
      _ref = this.recognizers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        recognizer = _ref[_i];
        if (recognizer.token_type === token_type) {
          _results.push(recognizer);
        }
      }
      return _results;
    };

    Tokenizer.prototype.insert_before = function(token_type, new_recognizers) {
      var i, idx, recognizer, _i, _j, _len, _ref;
      idx = 0;
      for (i = _i = 0, _ref = this.recognizers.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        recognizer = this.recognizers[i];
        if (recognizer.token_type === token_type) {
          idx = i;
        }
      }
      for (_j = 0, _len = new_recognizers.length; _j < _len; _j++) {
        recognizer = new_recognizers[_j];
        this.recognizers.splice(idx, 0, recognizer);
        idx += 1;
      }
      this.clear_splitter();
      return null;
    };

    Tokenizer.prototype.tokenize = function(text) {
      var cleaned_text, content, piece, pieces, r, recognizer, result, _i, _j, _len, _len1, _ref;
      pieces = text.split(new RegExp(this.get_splitter().source, "g"));
      result = [];
      for (_i = 0, _len = pieces.length; _i < _len; _i++) {
        piece = pieces[_i];
        if ((piece == null) || piece.length === 0) {
          continue;
        }
        recognizer = null;
        _ref = this.recognizers;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          r = _ref[_j];
          if (r.recognizes(piece)) {
            recognizer = r;
            break;
          }
        }
        if (recognizer.token_type === "composite") {
          content = piece.match(recognizer.content)[0];
          result.push(new TwitterCldr.CompositeToken(this.tokenize(content)));
        } else {
          cleaned_text = recognizer.clean(piece);
          if ((this.remove_empty_entries && cleaned_text.length > 0) || !this.remove_empty_entries) {
            result.push(new TwitterCldr.Token({
              "value": cleaned_text,
              "type": recognizer.token_type
            }));
          }
        }
      }
      return result;
    };

    Tokenizer.prototype.clear_splitter = function() {
      return this.splitter = null;
    };

    Tokenizer.prototype.get_splitter = function() {
      var recognizer;
      return this.splitter = this.custom_splitter || new RegExp("(" + ((function() {
        var _i, _len, _ref, _results;
        _ref = this.recognizers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          recognizer = _ref[_i];
          _results.push(recognizer.regex.source);
        }
        return _results;
      }).call(this)).join("|") + ")");
    };

    return Tokenizer;

  })();

  TwitterCldr.SegmentationTokenizer = (function() {
    function SegmentationTokenizer() {
      var recognizers, ur_tokenizer;
      recognizers = [
        new TwitterCldr.TokenRecognizer("break", /\u00f7/, (function(val) {
          return TwitterCldr.Utilities.trim_string(val);
        })), new TwitterCldr.TokenRecognizer("no_break", /\u00d7/, (function(val) {
          return TwitterCldr.Utilities.trim_string(val);
        }))
      ];
      ur_tokenizer = new TwitterCldr.UnicodeRegexTokenizer;
      ur_tokenizer.insert_before("string", recognizers);
      this.tokenizer = ur_tokenizer;
    }

    SegmentationTokenizer.prototype.tokenize = function(pattern) {
      var result, token, tokens, _i, _len;
      result = [];
      tokens = this.tokenizer.tokenize(pattern);
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        if (token.value.replace(/^\s+|\s+$/g, "").length !== 0) {
          result.push(token);
        }
      }
      return result;
    };

    return SegmentationTokenizer;

  })();

  TwitterCldr.UnicodeRegexTokenizer = (function() {
    function UnicodeRegexTokenizer() {
      var recognizers;
      recognizers = [
        new TwitterCldr.TokenRecognizer("variable", new RegExp(/\$\w[\w\d]*/)), new TwitterCldr.TokenRecognizer("character_set", new RegExp(/\[:\w+:\]|\\p\{[\w=]+\}/)), new TwitterCldr.TokenRecognizer("negated_character_set", new RegExp(/\[:\^\w+:\]|\\P\{[\w=]+\}/)), new TwitterCldr.TokenRecognizer("unicode_char", new RegExp(/\\u\{?[a-fA-F0-9]{1,6}\}?/)), new TwitterCldr.TokenRecognizer("multichar_string", new RegExp(/\{\w+\}/)), new TwitterCldr.TokenRecognizer("escaped_character", new RegExp(/\\./)), new TwitterCldr.TokenRecognizer("negate", new RegExp(/\^/)), new TwitterCldr.TokenRecognizer("ampersand", new RegExp(/&/)), new TwitterCldr.TokenRecognizer("pipe", new RegExp(/\|/)), new TwitterCldr.TokenRecognizer("dash", new RegExp(/-/)), new TwitterCldr.TokenRecognizer("special_char", new RegExp(/\{\d,?\d?\}|[$?:{}()*+\.,\/\\]/)), new TwitterCldr.TokenRecognizer("open_bracket", new RegExp(/\[/)), new TwitterCldr.TokenRecognizer("close_bracket", new RegExp(/\]/)), new TwitterCldr.TokenRecognizer("string", new RegExp(/[\s\S]/), (function(val) {
          if (val === " ") {
            return val;
          } else {
            return TwitterCldr.Utilities.trim_string(val);
          }
        }))
      ];
      this.tokenizer = new TwitterCldr.Tokenizer(recognizers);
    }

    UnicodeRegexTokenizer.prototype.insert_before = function(token_type, new_recognizers) {
      return this.tokenizer.insert_before(token_type, new_recognizers);
    };

    UnicodeRegexTokenizer.prototype.tokenize = function(pattern) {
      return this.tokenizer.tokenize(pattern);
    };

    return UnicodeRegexTokenizer;

  })();

  TwitterCldr.RBNFTokenizer = (function() {
    function RBNFTokenizer() {
      var component, r, recognizers, splitter, splitter_source, word_regex, word_regex_components;
      word_regex_components = [TwitterCldr.CodePoint.code_points_for_property("category", "Ll"), TwitterCldr.CodePoint.code_points_for_property("category", "Lm"), TwitterCldr.CodePoint.code_points_for_property("category", "Lo"), TwitterCldr.CodePoint.code_points_for_property("category", "Lt"), TwitterCldr.CodePoint.code_points_for_property("category", "Lu"), TwitterCldr.CodePoint.code_points_for_property("category", "Mc"), TwitterCldr.CodePoint.code_points_for_property("category", "Me"), TwitterCldr.CodePoint.code_points_for_property("category", "Mu"), TwitterCldr.CodePoint.code_points_for_property("category", "Nd"), TwitterCldr.CodePoint.code_points_for_property("category", "Nl"), TwitterCldr.CodePoint.code_points_for_property("category", "No"), TwitterCldr.CodePoint.code_points_for_property("category", "Pc"), TwitterCldr.CodePoint.code_points_for_property("category", "Pd")];
      word_regex = "(" + (((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = word_regex_components.length; _i < _len; _i++) {
          component = word_regex_components[_i];
          _results.push(component);
        }
        return _results;
      })()).join("|")) + ")+";
      recognizers = [new TwitterCldr.TokenRecognizer("negative", new RegExp(/-x/)), new TwitterCldr.TokenRecognizer("improper_fraction", new RegExp(/x\.x/)), new TwitterCldr.TokenRecognizer("proper_fraction", new RegExp(/0\.x/)), new TwitterCldr.TokenRecognizer("master", new RegExp(/x\.0/)), new TwitterCldr.TokenRecognizer("equals", new RegExp(/\=/)), new TwitterCldr.TokenRecognizer("rule", new RegExp("%%?" + word_regex)), new TwitterCldr.TokenRecognizer("right_arrow", new RegExp(/>/)), new TwitterCldr.TokenRecognizer("left_arrow", new RegExp(/</)), new TwitterCldr.TokenRecognizer("open_bracket", new RegExp(/\[/)), new TwitterCldr.TokenRecognizer("close_bracket", new RegExp(/\]/)), new TwitterCldr.TokenRecognizer("decimal", new RegExp(/[0#][0#,\.]+/)), new TwitterCldr.TokenRecognizer("plural", new RegExp(/\$\(.*\)\$/)), new TwitterCldr.TokenRecognizer("semicolon", new RegExp(/;/))];
      splitter_source = "(" + (((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = recognizers.length; _i < _len; _i++) {
          r = recognizers[_i];
          _results.push(r.regex.source);
        }
        return _results;
      })()).join("|")) + ")";
      splitter = new RegExp(splitter_source);
      this.tokenizer = new TwitterCldr.Tokenizer(recognizers.concat(new TwitterCldr.TokenRecognizer("plaintext", new RegExp(/[\s\S]*/))), splitter);
    }

    RBNFTokenizer.prototype.tokenize = function(pattern) {
      var tokenizer;
      tokenizer = new TwitterCldr.PatternTokenizer(null, this.tokenizer);
      return tokenizer.tokenize(pattern);
    };

    return RBNFTokenizer;

  })();

  TwitterCldr.NumberTokenizer = (function() {
    function NumberTokenizer(data_reader) {
      var k, r, recognizers, splitter, splitter_source, v, _ref;
      this.data_reader = data_reader;
      this.special_symbols_map = {
        '.': '{DOT}',
        ',': '{COMMA}',
        '0': '{ZERO}',
        '#': '{POUND}',
        '¤': '{CURRENCY}',
        '%': '{PERCENT}',
        'E': '{SCIENTIFIC}'
      };
      this.inverse_special_symbols_map = {};
      _ref = this.special_symbols_map;
      for (k in _ref) {
        v = _ref[k];
        this.inverse_special_symbols_map[v] = k;
      }
      this.special_symbols_regex = new RegExp("'(?:" + [
        (function() {
          var _ref1, _results;
          _ref1 = this.special_symbols_map;
          _results = [];
          for (k in _ref1) {
            v = _ref1[k];
            _results.push(TwitterCldr.Utilities.regex_escape(k));
          }
          return _results;
        }).call(this)
      ].join('|') + ")'");
      this.inverse_special_symbols_regex = new RegExp([
        (function() {
          var _ref1, _results;
          _ref1 = this.inverse_special_symbols_map;
          _results = [];
          for (k in _ref1) {
            v = _ref1[k];
            _results.push(TwitterCldr.Utilities.regex_escape(k));
          }
          return _results;
        }).call(this)
      ].join('|'));
      recognizers = [new TwitterCldr.TokenRecognizer("pattern", new RegExp(/[0?#,\.]+/)), new TwitterCldr.TokenRecognizer("plaintext", new RegExp(/[\s\S]*/))];
      this.tokenizer = new TwitterCldr.Tokenizer(recognizers, new RegExp(/([^0*#,\.]*)([0#,\.]+)([^0*#,\.]*)$/), false);
      splitter_source = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = recognizers.length; _i < _len; _i++) {
          r = recognizers[_i];
          _results.push(r.regex.source);
        }
        return _results;
      })()).join("|");
      splitter = new RegExp(splitter_source);
    }

    NumberTokenizer.prototype.tokenize = function(pattern) {
      var escaped_pattern, token, tokens, _i, _len;
      escaped_pattern = pattern.replace(this.special_symbols_regex, function(match) {
        return this.special_symbols_map[match].slice(1, this.special_symbols_map[match].length - 1);
      });
      tokens = (new TwitterCldr.PatternTokenizer(this.data_reader, this.tokenizer)).tokenize(escaped_pattern);
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        token.value = token.value.replace(this.inverse_special_symbols_regex, function(match) {
          return this.inverse_special_symbols_map[match];
        });
      }
      if (tokens[0].value === "") {
        return tokens.slice(1);
      } else {
        return tokens;
      }
    };

    return NumberTokenizer;

  })();

  TwitterCldr.PatternTokenizer = (function() {
    function PatternTokenizer(data_reader, tokenizer) {
      this.data_reader = data_reader;
      this.tokenizer = tokenizer;
    }

    PatternTokenizer.prototype.tokenize = function(pattern) {
      return this.tokenizer.tokenize(this.expand(pattern));
    };

    PatternTokenizer.prototype.expand = function(pattern) {
      var key, result, value;
      if (pattern instanceof Object) {
        result = {};
        for (key in pattern) {
          value = pattern[key];
          result[key] = expand(value);
        }
        return result;
      } else {
        return pattern;
      }
    };

    return PatternTokenizer;

  })();

  TwitterCldr.NumberFormatter = (function() {
    function NumberFormatter() {
      this.tokens = [];
      this.default_symbols = {
        'group': ',',
        'decimal': '.',
        'plus_sign': '+',
        'minus_sign': '-'
      };
    }

    NumberFormatter.all_tokens = {"default":{"positive":["","#,##0.###"],"negative":["-","#,##0.###"]},"decimal":{"positive":["","#,##0.###"],"negative":["-","#,##0.###"]},"long_decimal":{"positive":{"1000":{"one":["","0"," thousand"],"other":["","0"," thousand"]},"10000":{"one":["","00"," thousand"],"other":["","00"," thousand"]},"100000":{"one":["","000"," thousand"],"other":["","000"," thousand"]},"1000000":{"one":["","0"," million"],"other":["","0"," million"]},"10000000":{"one":["","00"," million"],"other":["","00"," million"]},"100000000":{"one":["","000"," million"],"other":["","000"," million"]},"1000000000":{"one":["","0"," billion"],"other":["","0"," billion"]},"10000000000":{"one":["","00"," billion"],"other":["","00"," billion"]},"100000000000":{"one":["","000"," billion"],"other":["","000"," billion"]},"1000000000000":{"one":["","0"," trillion"],"other":["","0"," trillion"]},"10000000000000":{"one":["","00"," trillion"],"other":["","00"," trillion"]},"100000000000000":{"one":["","000"," trillion"],"other":["","000"," trillion"]}},"negative":{"1000":{"one":["-","0"," thousand"],"other":["-","0"," thousand"]},"10000":{"one":["-","00"," thousand"],"other":["-","00"," thousand"]},"100000":{"one":["-","000"," thousand"],"other":["-","000"," thousand"]},"1000000":{"one":["-","0"," million"],"other":["-","0"," million"]},"10000000":{"one":["-","00"," million"],"other":["-","00"," million"]},"100000000":{"one":["-","000"," million"],"other":["-","000"," million"]},"1000000000":{"one":["-","0"," billion"],"other":["-","0"," billion"]},"10000000000":{"one":["-","00"," billion"],"other":["-","00"," billion"]},"100000000000":{"one":["-","000"," billion"],"other":["-","000"," billion"]},"1000000000000":{"one":["-","0"," trillion"],"other":["-","0"," trillion"]},"10000000000000":{"one":["-","00"," trillion"],"other":["-","00"," trillion"]},"100000000000000":{"one":["-","000"," trillion"],"other":["-","000"," trillion"]}}},"short_decimal":{"positive":{"1000":{"one":["","0","K"],"other":["","0","K"]},"10000":{"one":["","00","K"],"other":["","00","K"]},"100000":{"one":["","000","K"],"other":["","000","K"]},"1000000":{"one":["","0","M"],"other":["","0","M"]},"10000000":{"one":["","00","M"],"other":["","00","M"]},"100000000":{"one":["","000","M"],"other":["","000","M"]},"1000000000":{"one":["","0","B"],"other":["","0","B"]},"10000000000":{"one":["","00","B"],"other":["","00","B"]},"100000000000":{"one":["","000","B"],"other":["","000","B"]},"1000000000000":{"one":["","0","T"],"other":["","0","T"]},"10000000000000":{"one":["","00","T"],"other":["","00","T"]},"100000000000000":{"one":["","000","T"],"other":["","000","T"]}},"negative":{"1000":{"one":["-","0","K"],"other":["-","0","K"]},"10000":{"one":["-","00","K"],"other":["-","00","K"]},"100000":{"one":["-","000","K"],"other":["-","000","K"]},"1000000":{"one":["-","0","M"],"other":["-","0","M"]},"10000000":{"one":["-","00","M"],"other":["-","00","M"]},"100000000":{"one":["-","000","M"],"other":["-","000","M"]},"1000000000":{"one":["-","0","B"],"other":["-","0","B"]},"10000000000":{"one":["-","00","B"],"other":["-","00","B"]},"100000000000":{"one":["-","000","B"],"other":["-","000","B"]},"1000000000000":{"one":["-","0","T"],"other":["-","0","T"]},"10000000000000":{"one":["-","00","T"],"other":["-","00","T"]},"100000000000000":{"one":["-","000","T"],"other":["-","000","T"]}}},"currency":{"positive":["¤","#,##0.00"],"negative":["-¤","#,##0.00"]},"percent":{"positive":["","#,##0","%"],"negative":["-","#,##0","%"]}};

    NumberFormatter.symbols = {"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"};

    NumberFormatter.prototype.all_tokens = function() {
      return TwitterCldr.NumberFormatter.all_tokens;
    };

    NumberFormatter.prototype.symbols = function() {
      return TwitterCldr.NumberFormatter.symbols;
    };

    NumberFormatter.prototype.format = function(number, options) {
      var fraction, fraction_format, integer_format, intg, key, opts, prefix, result, sign, suffix, tokens, tokens_sample, truncated_number, val, _ref, _ref1;
      if (options == null) {
        options = {};
      }
      opts = this.default_format_options_for(number);
      for (key in options) {
        val = options[key];
        opts[key] = options[key] != null ? options[key] : opts[key];
      }
      tokens = this.get_tokens(number, opts);
      if (tokens != null) {
        if (!(tokens instanceof Array)) {
          tokens_sample = tokens[Object.keys(tokens)[0]];
          truncated_number = this.truncate_number(number, tokens_sample[1].length);
          if (opts.precision === 0) {
            truncated_number = Math.floor(truncated_number);
          }
          tokens = tokens[TwitterCldr.PluralRules.rule_for(truncated_number)];
        }
        _ref = this.partition_tokens(tokens), prefix = _ref[0], suffix = _ref[1], integer_format = _ref[2], fraction_format = _ref[3];
        number = this.truncate_number(number, integer_format.format.length);
        _ref1 = this.parse_number(number, opts), intg = _ref1[0], fraction = _ref1[1];
        result = integer_format.apply(parseFloat(intg), opts);
        if (fraction) {
          result += fraction_format.apply(fraction, opts);
        }
        sign = number < 0 && prefix !== "-" ? this.symbols().minus_sign || this.default_symbols.minus_sign : "";
        return "" + prefix + result + suffix;
      } else {
        return number.toString();
      }
    };

    NumberFormatter.prototype.truncate_number = function(number, decimal_digits) {
      return number;
    };

    NumberFormatter.prototype.partition_tokens = function(tokens) {
      return [tokens[0] || "", tokens[2] || "", new TwitterCldr.NumberFormatter.IntegerHelper(tokens[1], this.symbols()), new TwitterCldr.NumberFormatter.FractionHelper(tokens[1], this.symbols())];
    };

    NumberFormatter.prototype.parse_number = function(number, options) {
      var precision;
      if (options == null) {
        options = {};
      }
      if (options.precision != null) {
        precision = options.precision;
      } else {
        precision = this.precision_from(number);
      }
      number = this.round_to(number, precision);
      return Math.abs(number).toFixed(precision).split(".");
    };

    NumberFormatter.prototype.precision_from = function(num) {
      var parts;
      parts = num.toString().split(".");
      if (parts.length === 2) {
        return parts[1].length;
      } else {
        return 0;
      }
    };

    NumberFormatter.prototype.round_to = function(number, precision) {
      var factor;
      factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    };

    NumberFormatter.prototype.get_tokens = function() {
      throw "get_tokens() not implemented - use a derived class like PercentFormatter.";
    };

    return NumberFormatter;

  })();

  TwitterCldr.PercentFormatter = (function(_super) {
    __extends(PercentFormatter, _super);

    function PercentFormatter(options) {
      if (options == null) {
        options = {};
      }
      this.default_percent_sign = "%";
      PercentFormatter.__super__.constructor.apply(this, arguments);
    }

    PercentFormatter.prototype.format = function(number, options) {
      if (options == null) {
        options = {};
      }
      return PercentFormatter.__super__.format.call(this, number, options).replace('¤', this.symbols().percent_sign || this.default_percent_sign);
    };

    PercentFormatter.prototype.default_format_options_for = function(number) {
      return {
        precision: 0
      };
    };

    PercentFormatter.prototype.get_tokens = function(number, options) {
      if (number < 0) {
        return this.all_tokens().percent.negative;
      } else {
        return this.all_tokens().percent.positive;
      }
    };

    return PercentFormatter;

  })(TwitterCldr.NumberFormatter);

  TwitterCldr.DecimalFormatter = (function(_super) {
    __extends(DecimalFormatter, _super);

    function DecimalFormatter(data_reader) {
      this.data_reader = data_reader;
      DecimalFormatter.__super__.constructor.apply(this, arguments);
    }

    DecimalFormatter.prototype.format = function(number, options) {
      var error, result, transliterator;
      if (options == null) {
        options = {};
      }
      try {
        result = DecimalFormatter.__super__.format.call(this, number, options);
        if ((this.data_reader != null) && (options["type"] != null)) {
          transliterator = TwitterCldr.NumberingSystems.for_name(this.data_reader.number_system_for(options["type"]));
          if (transliterator != null) {
            result = transliterator.transliterate(result);
          }
        }
        return result;
      } catch (_error) {
        error = _error;
        return number;
      }
    };

    DecimalFormatter.prototype.default_format_options_for = function(number) {
      return {
        precision: this.precision_from(number)
      };
    };

    DecimalFormatter.prototype.get_tokens = function(number, options) {
      if (options == null) {
        options = {};
      }
      if (number < 0) {
        return this.all_tokens().decimal.negative;
      } else {
        return this.all_tokens().decimal.positive;
      }
    };

    return DecimalFormatter;

  })(TwitterCldr.NumberFormatter);

  TwitterCldr.CurrencyFormatter = (function(_super) {
    __extends(CurrencyFormatter, _super);

    function CurrencyFormatter(options) {
      if (options == null) {
        options = {};
      }
      this.currencies_data = {"ADP":{"digits":0,"rounding":0},"AFN":{"digits":0,"rounding":0},"ALL":{"digits":0,"rounding":0},"AMD":{"digits":0,"rounding":0},"BHD":{"digits":3,"rounding":0},"BIF":{"digits":0,"rounding":0},"BYR":{"digits":0,"rounding":0},"CAD":{"digits":2,"rounding":0},"CHF":{"digits":2,"rounding":0},"CLF":{"digits":4,"rounding":0},"CLP":{"digits":0,"rounding":0},"COP":{"digits":0,"rounding":0},"CRC":{"digits":0,"rounding":0},"CZK":{"digits":2,"rounding":0},"DEFAULT":{"digits":2,"rounding":0},"DJF":{"digits":0,"rounding":0},"ESP":{"digits":0,"rounding":0},"GNF":{"digits":0,"rounding":0},"GYD":{"digits":0,"rounding":0},"HUF":{"digits":2,"rounding":0},"IDR":{"digits":0,"rounding":0},"IQD":{"digits":0,"rounding":0},"IRR":{"digits":0,"rounding":0},"ISK":{"digits":0,"rounding":0},"ITL":{"digits":0,"rounding":0},"JOD":{"digits":3,"rounding":0},"JPY":{"digits":0,"rounding":0},"KMF":{"digits":0,"rounding":0},"KPW":{"digits":0,"rounding":0},"KRW":{"digits":0,"rounding":0},"KWD":{"digits":3,"rounding":0},"LAK":{"digits":0,"rounding":0},"LBP":{"digits":0,"rounding":0},"LUF":{"digits":0,"rounding":0},"LYD":{"digits":3,"rounding":0},"MGA":{"digits":0,"rounding":0},"MGF":{"digits":0,"rounding":0},"MMK":{"digits":0,"rounding":0},"MNT":{"digits":0,"rounding":0},"MRO":{"digits":0,"rounding":0},"MUR":{"digits":0,"rounding":0},"OMR":{"digits":3,"rounding":0},"PKR":{"digits":0,"rounding":0},"PYG":{"digits":0,"rounding":0},"RSD":{"digits":0,"rounding":0},"RWF":{"digits":0,"rounding":0},"SLL":{"digits":0,"rounding":0},"SOS":{"digits":0,"rounding":0},"STD":{"digits":0,"rounding":0},"SYP":{"digits":0,"rounding":0},"TMM":{"digits":0,"rounding":0},"TND":{"digits":3,"rounding":0},"TRL":{"digits":0,"rounding":0},"TWD":{"digits":2,"rounding":0},"TZS":{"digits":0,"rounding":0},"UGX":{"digits":0,"rounding":0},"UYI":{"digits":0,"rounding":0},"UZS":{"digits":0,"rounding":0},"VND":{"digits":0,"rounding":0},"VUV":{"digits":0,"rounding":0},"XAF":{"digits":0,"rounding":0},"XOF":{"digits":0,"rounding":0},"XPF":{"digits":0,"rounding":0},"YER":{"digits":0,"rounding":0},"ZMK":{"digits":0,"rounding":0},"ZWD":{"digits":0,"rounding":0}};
      this.default_currency_symbol = "$";
      this.default_precision = this.currencies_data.DEFAULT.digits;
      CurrencyFormatter.__super__.constructor.apply(this, arguments);
    }

    CurrencyFormatter.prototype.format = function(number, options) {
      var currency, symbol;
      if (options == null) {
        options = {};
      }
      if (options.currency) {
        if (TwitterCldr.Currencies != null) {
          currency = TwitterCldr.Currencies.for_code(options.currency);
          currency || (currency = {
            symbol: options.currency
          });
        } else {
          currency = {
            symbol: options.currency
          };
        }
        if (options.precision == null) {
          options.precision = this.defaults_for_currency(options.currency).digits;
        }
      } else {
        currency = {
          symbol: this.default_currency_symbol
        };
      }
      symbol = options.use_cldr_symbol ? currency.cldr_symbol : currency.symbol;
      return CurrencyFormatter.__super__.format.call(this, number, options).replace('¤', symbol);
    };

    CurrencyFormatter.prototype.default_format_options_for = function(number) {
      var precision;
      precision = this.precision_from(number);
      if (precision === 0) {
        precision = this.default_precision;
      }
      return {
        precision: precision
      };
    };

    CurrencyFormatter.prototype.get_tokens = function(number, options) {
      if (options == null) {
        options = {};
      }
      if (number < 0) {
        return this.all_tokens().currency.negative;
      } else {
        return this.all_tokens().currency.positive;
      }
    };

    CurrencyFormatter.prototype.defaults_for_currency = function(currency) {
      return this.currencies_data[currency] || this.currencies_data.DEFAULT;
    };

    return CurrencyFormatter;

  })(TwitterCldr.NumberFormatter);

  TwitterCldr.AbbreviatedNumberFormatter = (function(_super) {
    __extends(AbbreviatedNumberFormatter, _super);

    function AbbreviatedNumberFormatter() {
      return AbbreviatedNumberFormatter.__super__.constructor.apply(this, arguments);
    }

    AbbreviatedNumberFormatter.prototype.NUMBER_MAX = Math.pow(10, 15);

    AbbreviatedNumberFormatter.prototype.NUMBER_MIN = 1000;

    AbbreviatedNumberFormatter.prototype.default_format_options_for = function(number) {
      return {
        precision: this.precision_from(number)
      };
    };

    AbbreviatedNumberFormatter.prototype.get_type = function() {
      return "decimal";
    };

    AbbreviatedNumberFormatter.prototype.get_key = function(number) {
      var i, zeroes;
      zeroes = ((function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = Math.floor(number).toString().length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push("0");
        }
        return _results;
      })()).join("");
      return "1" + zeroes;
    };

    AbbreviatedNumberFormatter.prototype.get_tokens = function(number, options) {
      var format, tokens, type;
      if (options == null) {
        options = {};
      }
      type = (number < this.NUMBER_MAX) && (number >= this.NUMBER_MIN) ? this.get_type() : "decimal";
      format = type === this.get_type() ? this.get_key(number) : null;
      tokens = this.all_tokens()[type];
      tokens = number < 0 ? tokens.negative : tokens.positive;
      if (format != null) {
        tokens = tokens[format];
      }
      return tokens;
    };

    AbbreviatedNumberFormatter.prototype.truncate_number = function(number, decimal_digits) {
      var factor;
      if (this.NUMBER_MIN <= number && number < this.NUMBER_MAX) {
        factor = Math.max(0, Math.floor(number).toString().length - decimal_digits);
        return number / Math.pow(10, factor);
      } else {
        return number;
      }
    };

    return AbbreviatedNumberFormatter;

  })(TwitterCldr.NumberFormatter);

  TwitterCldr.ShortDecimalFormatter = (function(_super) {
    __extends(ShortDecimalFormatter, _super);

    function ShortDecimalFormatter() {
      return ShortDecimalFormatter.__super__.constructor.apply(this, arguments);
    }

    ShortDecimalFormatter.prototype.get_type = function() {
      return "short_decimal";
    };

    return ShortDecimalFormatter;

  })(TwitterCldr.AbbreviatedNumberFormatter);

  TwitterCldr.LongDecimalFormatter = (function(_super) {
    __extends(LongDecimalFormatter, _super);

    function LongDecimalFormatter() {
      return LongDecimalFormatter.__super__.constructor.apply(this, arguments);
    }

    LongDecimalFormatter.prototype.get_type = function() {
      return "long_decimal";
    };

    return LongDecimalFormatter;

  })(TwitterCldr.AbbreviatedNumberFormatter);

  TwitterCldr.NumberFormatter.BaseHelper = (function() {
    function BaseHelper() {}

    BaseHelper.prototype.interpolate = function(string, value, orientation) {
      var i, length, start;
      if (orientation == null) {
        orientation = "right";
      }
      value = value.toString();
      length = value.length;
      start = orientation === "left" ? 0 : -length;
      if (string.length < length) {
        string = (((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
            _results.push("#");
          }
          return _results;
        })()).join("") + string).slice(-length);
      }
      if (start < 0) {
        string = string.slice(0, start + string.length) + value;
      } else {
        string = string.slice(0, start) + value + string.slice(length);
      }
      return string.replace(/#/g, "");
    };

    return BaseHelper;

  })();

  TwitterCldr.NumberFormatter.IntegerHelper = (function(_super) {
    __extends(IntegerHelper, _super);

    function IntegerHelper(token, symbols) {
      var format;
      if (symbols == null) {
        symbols = {};
      }
      format = token.split('.')[0];
      this.format = this.prepare_format(format, symbols);
      this.groups = this.parse_groups(format);
      this.separator = symbols.group || ',';
    }

    IntegerHelper.prototype.apply = function(number, options) {
      if (options == null) {
        options = {};
      }
      return this.format_groups(this.interpolate(this.format, parseInt(number)));
    };

    IntegerHelper.prototype.format_groups = function(string) {
      var primary_group, secondary_group, token, tokens, _ref, _ref1;
      if (this.groups.length === 0) {
        return string;
      }
      tokens = [];
      primary_group = this.groups[this.groups.length - 1];
      secondary_group = this.groups[0];
      _ref = this.chop_group(string, secondary_group), string = _ref[0], token = _ref[1];
      tokens.push(token);
      while (string.length) {
        _ref1 = this.chop_group(string, primary_group), string = _ref1[0], token = _ref1[1];
        tokens.push(token);
      }
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          token = tokens[_i];
          if (token !== null) {
            _results.push(token);
          }
        }
        return _results;
      })()).reverse().join(this.separator);
    };

    IntegerHelper.prototype.parse_groups = function(format) {
      var index, rest, width, widths;
      index = format.lastIndexOf(',');
      if (!(index > 0)) {
        return [];
      }
      rest = format.slice(0, index);
      widths = [format.length - index - 1];
      if (rest.lastIndexOf(',') > -1) {
        widths.push(rest.length - rest.lastIndexOf(',') - 1);
      }
      widths = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = widths.length; _i < _len; _i++) {
          width = widths[_i];
          if (width !== null) {
            _results.push(width);
          }
        }
        return _results;
      })();
      widths.reverse();
      return ((function() {
        var _i, _ref, _results;
        _results = [];
        for (index = _i = 0, _ref = widths.length; 0 <= _ref ? _i < _ref : _i > _ref; index = 0 <= _ref ? ++_i : --_i) {
          if (widths.indexOf(widths[index], index + 1) === -1) {
            _results.push(widths[index]);
          }
        }
        return _results;
      })()).reverse();
    };

    IntegerHelper.prototype.chop_group = function(string, size) {
      var start;
      start = Math.max(string.length - size, 0);
      return [string.slice(0, start), string.slice(start)];
    };

    IntegerHelper.prototype.prepare_format = function(format, symbols) {
      return format.replace(/[,+-]/g, function(match) {
        switch (match) {
          case ',':
            return '';
          case '+':
            return symbols.plus_sign;
          case '-':
            return symbols.minus_sign;
        }
      });
    };

    return IntegerHelper;

  })(TwitterCldr.NumberFormatter.BaseHelper);

  TwitterCldr.NumberFormatter.FractionHelper = (function(_super) {
    __extends(FractionHelper, _super);

    function FractionHelper(token, symbols) {
      if (symbols == null) {
        symbols = {};
      }
      this.format = token ? token.split('.').pop() : "";
      this.decimal = symbols.decimal || ".";
      this.precision = this.format.length;
    }

    FractionHelper.prototype.apply = function(fraction, options) {
      var precision;
      if (options == null) {
        options = {};
      }
      precision = options.precision != null ? options.precision : this.precision;
      if (precision > 0) {
        return this.decimal + this.interpolate(this.format_for(options), fraction, "left");
      } else {
        return "";
      }
    };

    FractionHelper.prototype.format_for = function(options) {
      var i, precision;
      precision = options.precision != null ? options.precision : this.precision;
      if (precision) {
        return ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= precision ? _i < precision : _i > precision; i = 0 <= precision ? ++_i : --_i) {
            _results.push("0");
          }
          return _results;
        })()).join("");
      } else {
        return this.format;
      }
    };

    return FractionHelper;

  })(TwitterCldr.NumberFormatter.BaseHelper);

  TwitterCldr.RBNF = (function() {
    function RBNF(locale) {
      this.locale = locale != null ? locale : TwitterCldr.locale;
      this.default_spellout_options = {
        'rule_group': "SpelloutRules",
        'rule_set': "spellout-numbering"
      };
      this.rule_group_cache = {};
      this.rule_set_name_cache = {};
      this.resource = {"en":[{"ruleset":[{"access":"private","rules":[{"rule":"hundred;","value":0},{"rule":"oh-=%spellout-numbering=;","value":1},{"rule":"=%spellout-numbering=;","value":10}],"type":"2d-year"},{"rules":[{"rule":"minus \u003e\u003e;","value":"-x"},{"rule":"=#,###0.#=;","value":"x.x"},{"rule":"=%spellout-numbering=;","value":0},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":1010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":1100},{"rule":"=%spellout-numbering=;","value":2000},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":2010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":2100},{"rule":"=%spellout-numbering=;","value":3000},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":3010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":3100},{"rule":"=%spellout-numbering=;","value":4000},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":4010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":4100},{"rule":"=%spellout-numbering=;","value":5000},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":5010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":5100},{"rule":"=%spellout-numbering=;","value":6000},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":6010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":6100},{"rule":"=%spellout-numbering=;","value":7000},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":7010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":7100},{"rule":"=%spellout-numbering=;","value":8000},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":8010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":8100},{"rule":"=%spellout-numbering=;","value":9000},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":9010},{"radix":100,"rule":"\u003c\u003c \u003e%%2d-year\u003e;","value":9100},{"rule":"=%spellout-numbering=;","value":10000}],"type":"spellout-numbering-year"},{"rules":[{"rule":"=%spellout-cardinal=;","value":0}],"type":"spellout-numbering"},{"rules":[{"rule":"=%spellout-cardinal-verbose=;","value":0}],"type":"spellout-numbering-verbose"},{"rules":[{"rule":"minus \u003e\u003e;","value":"-x"},{"rule":"\u003c\u003c point \u003e\u003e;","value":"x.x"},{"rule":"zero;","value":0},{"rule":"one;","value":1},{"rule":"two;","value":2},{"rule":"three;","value":3},{"rule":"four;","value":4},{"rule":"five;","value":5},{"rule":"six;","value":6},{"rule":"seven;","value":7},{"rule":"eight;","value":8},{"rule":"nine;","value":9},{"rule":"ten;","value":10},{"rule":"eleven;","value":11},{"rule":"twelve;","value":12},{"rule":"thirteen;","value":13},{"rule":"fourteen;","value":14},{"rule":"fifteen;","value":15},{"rule":"sixteen;","value":16},{"rule":"seventeen;","value":17},{"rule":"eighteen;","value":18},{"rule":"nineteen;","value":19},{"rule":"twenty[-\u003e\u003e];","value":20},{"rule":"thirty[-\u003e\u003e];","value":30},{"rule":"forty[-\u003e\u003e];","value":40},{"rule":"fifty[-\u003e\u003e];","value":50},{"rule":"sixty[-\u003e\u003e];","value":60},{"rule":"seventy[-\u003e\u003e];","value":70},{"rule":"eighty[-\u003e\u003e];","value":80},{"rule":"ninety[-\u003e\u003e];","value":90},{"rule":"\u003c\u003c hundred[ \u003e\u003e];","value":100},{"rule":"\u003c\u003c thousand[ \u003e\u003e];","value":1000},{"rule":"\u003c\u003c million[ \u003e\u003e];","value":1000000},{"rule":"\u003c\u003c billion[ \u003e\u003e];","value":1000000000},{"rule":"\u003c\u003c trillion[ \u003e\u003e];","value":1000000000000},{"rule":"\u003c\u003c quadrillion[ \u003e\u003e];","value":1000000000000000},{"rule":"=#,##0=;","value":1000000000000000000}],"type":"spellout-cardinal"},{"access":"private","rules":[{"rule":" and =%spellout-cardinal-verbose=;","value":1},{"rule":" =%spellout-cardinal-verbose=;","value":100}],"type":"and"},{"access":"private","rules":[{"rule":" and =%spellout-cardinal-verbose=;","value":1},{"rule":", =%spellout-cardinal-verbose=;","value":100},{"rule":", \u003c%spellout-cardinal-verbose\u003c thousand[\u003e%%commas\u003e];","value":1000},{"rule":", =%spellout-cardinal-verbose=;","value":1000000}],"type":"commas"},{"rules":[{"rule":"minus \u003e\u003e;","value":"-x"},{"rule":"\u003c\u003c point \u003e\u003e;","value":"x.x"},{"rule":"=%spellout-numbering=;","value":0},{"rule":"\u003c\u003c hundred[\u003e%%and\u003e];","value":100},{"rule":"\u003c\u003c thousand[\u003e%%and\u003e];","value":1000},{"radix":1000,"rule":"\u003c\u003c thousand[\u003e%%commas\u003e];","value":100000},{"rule":"\u003c\u003c million[\u003e%%commas\u003e];","value":1000000},{"rule":"\u003c\u003c billion[\u003e%%commas\u003e];","value":1000000000},{"rule":"\u003c\u003c trillion[\u003e%%commas\u003e];","value":1000000000000},{"rule":"\u003c\u003c quadrillion[\u003e%%commas\u003e];","value":1000000000000000},{"rule":"=#,##0=;","value":1000000000000000000}],"type":"spellout-cardinal-verbose"},{"access":"private","rules":[{"rule":"tieth;","value":0},{"rule":"ty-=%spellout-ordinal=;","value":1}],"type":"tieth"},{"access":"private","rules":[{"rule":"th;","value":0},{"rule":" =%spellout-ordinal=;","value":1}],"type":"th"},{"rules":[{"rule":"minus \u003e\u003e;","value":"-x"},{"rule":"=#,##0.#=;","value":"x.x"},{"rule":"zeroth;","value":0},{"rule":"first;","value":1},{"rule":"second;","value":2},{"rule":"third;","value":3},{"rule":"fourth;","value":4},{"rule":"fifth;","value":5},{"rule":"sixth;","value":6},{"rule":"seventh;","value":7},{"rule":"eighth;","value":8},{"rule":"ninth;","value":9},{"rule":"tenth;","value":10},{"rule":"eleventh;","value":11},{"rule":"twelfth;","value":12},{"rule":"=%spellout-numbering=th;","value":13},{"rule":"twen\u003e%%tieth\u003e;","value":20},{"rule":"thir\u003e%%tieth\u003e;","value":30},{"rule":"for\u003e%%tieth\u003e;","value":40},{"rule":"fif\u003e%%tieth\u003e;","value":50},{"rule":"six\u003e%%tieth\u003e;","value":60},{"rule":"seven\u003e%%tieth\u003e;","value":70},{"rule":"eigh\u003e%%tieth\u003e;","value":80},{"rule":"nine\u003e%%tieth\u003e;","value":90},{"rule":"\u003c%spellout-numbering\u003c hundred\u003e%%th\u003e;","value":100},{"rule":"\u003c%spellout-numbering\u003c thousand\u003e%%th\u003e;","value":1000},{"rule":"\u003c%spellout-numbering\u003c million\u003e%%th\u003e;","value":1000000},{"rule":"\u003c%spellout-numbering\u003c billion\u003e%%th\u003e;","value":1000000000},{"rule":"\u003c%spellout-numbering\u003c trillion\u003e%%th\u003e;","value":1000000000000},{"rule":"\u003c%spellout-numbering\u003c quadrillion\u003e%%th\u003e;","value":1000000000000000},{"rule":"=#,##0=.;","value":1000000000000000000}],"type":"spellout-ordinal"},{"access":"private","rules":[{"rule":"th;","value":0},{"rule":" and =%spellout-ordinal-verbose=;","value":1},{"rule":" =%spellout-ordinal-verbose=;","value":100}],"type":"and-o"},{"access":"private","rules":[{"rule":"th;","value":0},{"rule":" and =%spellout-ordinal-verbose=;","value":1},{"rule":", =%spellout-ordinal-verbose=;","value":100},{"rule":", \u003c%spellout-cardinal-verbose\u003c thousand\u003e%%commas-o\u003e;","value":1000},{"rule":", =%spellout-ordinal-verbose=;","value":1000000}],"type":"commas-o"},{"rules":[{"rule":"minus \u003e\u003e;","value":"-x"},{"rule":"=#,##0.#=;","value":"x.x"},{"rule":"=%spellout-ordinal=;","value":0},{"rule":"\u003c%spellout-numbering-verbose\u003c hundred\u003e%%and-o\u003e;","value":100},{"rule":"\u003c%spellout-numbering-verbose\u003c thousand\u003e%%and-o\u003e;","value":1000},{"radix":1000,"rule":"\u003c%spellout-numbering-verbose\u003c thousand\u003e%%commas-o\u003e;","value":100000},{"rule":"\u003c%spellout-numbering-verbose\u003c million\u003e%%commas-o\u003e;","value":1000000},{"rule":"\u003c%spellout-numbering-verbose\u003c billion\u003e%%commas-o\u003e;","value":1000000000},{"rule":"\u003c%spellout-numbering-verbose\u003c trillion\u003e%%commas-o\u003e;","value":1000000000000},{"rule":"\u003c%spellout-numbering-verbose\u003c quadrillion\u003e%%commas-o\u003e;","value":1000000000000000},{"rule":"=#,##0=.;","value":1000000000000000000}],"type":"spellout-ordinal-verbose"}],"type":"SpelloutRules"},{"ruleset":[{"rules":[{"rule":"−\u003e\u003e;","value":"-x"},{"rule":"=#,##0=$(ordinal,one{st}two{nd}few{rd}other{th})$;","value":0}],"type":"digits-ordinal"}],"type":"OrdinalRules"}]};
    }

    RBNF.prototype.get_resource = function() {
      return this.resource[this.locale];
    };

    RBNF.prototype.get_resource_for_locale = function(locale) {
      if (locale == null) {
        locale = this.locale;
      }
      return this.resource[locale];
    };

    RBNF.prototype.format = function(number, rule_group_name, rule_set_name) {
      var rule_group, rule_set, _ref;
      if ((rule_group_name == null) && (rule_set_name == null)) {
        _ref = [default_cardinal_options['rule_group'], default_cardinal_options['rule_set']], rule_group_name = _ref[0], rule_set_name = _ref[1];
      }
      if ((rule_group = this.rule_group_by_name(rule_group_name)) != null) {
        if ((rule_set = rule_group.rule_set_for(rule_set_name)) != null) {
          if (rule_set.is_public()) {
            return TwitterCldr.RBNFRuleFormatter.format(number, rule_set, rule_group, this.locale);
          } else {
            throw rule_set_name + " is a private rule set and cannot be used directly.";
          }
        } else {
          throw "rule set - " + rule_set_name + " - not implemented";
        }
      } else {
        throw "rule group - " + rule_group_name + " - not implemented";
      }
    };

    RBNF.prototype.group_names = function() {
      var group, _i, _len, _ref, _results;
      _ref = this.get_resource_for_locale();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        _results.push(group['type']);
      }
      return _results;
    };

    RBNF.prototype.rule_set_names_for_group = function(group_name) {
      var cache_key, result, rule_group, rule_set, _i, _len, _ref;
      cache_key = TwitterCldr.Utilities.compute_cache_key([this.locale, group_name]);
      if (this.rule_set_name_cache[cache_key] != null) {
        this.rule_set_name_cache[cache_key];
      }
      result = [];
      if ((rule_group = this.rule_group_by_name(group_name)) != null) {
        _ref = rule_group.rule_sets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rule_set = _ref[_i];
          if (rule_set.is_public) {
            result.push(rule_set.name);
          }
        }
      }
      this.rule_set_name_cache[cache_key] = result;
      return this.rule_set_name_cache[cache_key] || [];
    };

    RBNF.prototype.rule_group_by_name = function(name) {
      var cache_key, group, group_data, _i, _len, _ref;
      cache_key = TwitterCldr.Utilities.compute_cache_key([this.locale, name]);
      if (this.rule_group_cache[cache_key] != null) {
        this.rule_group_cache[cache_key];
      }
      group_data = null;
      _ref = this.get_resource_for_locale();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        if (group['type'] === name) {
          group_data = group;
          break;
        }
      }
      if (group_data != null) {
        return this.rule_group_from_resource(group_data);
      }
    };

    RBNF.prototype.rule_set_from_resource = function(rule_set_data) {
      var rule, rules;
      rules = (function() {
        var _i, _len, _ref, _results;
        _ref = rule_set_data['rules'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rule = _ref[_i];
          _results.push(new TwitterCldr.RBNFRule(rule['value'], rule['rule'], (rule['radix'] != null ? rule['radix'] : null)));
        }
        return _results;
      })();
      return new TwitterCldr.RBNFRuleSet(rules, rule_set_data['type'], rule_set_data['access'] || "public");
    };

    RBNF.prototype.rule_group_from_resource = function(group_data) {
      var rule_set_data, rule_sets;
      rule_sets = (function() {
        var _i, _len, _ref, _results;
        _ref = group_data['ruleset'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rule_set_data = _ref[_i];
          _results.push(this.rule_set_from_resource(rule_set_data));
        }
        return _results;
      }).call(this);
      return new TwitterCldr.RBNFRuleGroup(rule_sets, group_data['type']);
    };

    return RBNF;

  })();

  TwitterCldr.NumberDataReader = (function() {
    function NumberDataReader(locale, options) {
      var k, v;
      this.locale = locale;
      if (options == null) {
        options = {};
      }
      this.default_number_system = "latn";
      this.abbreviated_min_power = 3;
      this.abbreviated_max_power = 14;
      this.number_min = Math.pow(10, this.abbreviated_min_power);
      this.number_max = Math.pow(10, this.abbreviated_max_power + 1);
      this.base_path = [this.locale, this.locale, "numbers", "formats"];
      this.symbol_path = [this.locale, this.locale, "numbers", "symbols"];
      this.symbols = this.traverse(this.symbol_path);
      this.type_paths = {
        "default": ["decimal", "patterns"],
        "decimal": ["decimal", "patterns"],
        "long_decimal": ["decimal", "patterns", "long"],
        "short_decimal": ["decimal", "patterns", "short"],
        "currency": ["currency", "patterns"],
        "percent": ["percent", "patterns"]
      };
      this.types = [
        (function() {
          var _ref, _results;
          _ref = this.type_paths;
          _results = [];
          for (k in _ref) {
            v = _ref[k];
            _results.push(k);
          }
          return _results;
        }).call(this)
      ];
      this.abbreviated_types = ["long_decimal", "short_decimal"];
      this.default_type = "decimal";
      this.default_format = "default";
      this.default_sign = "positive";
      this.type = options["type"] || this.default_type;
      if (!((this.type != null) && (this.type_paths[this.type] != null))) {
        throw "Type " + this.type + " is not supported";
      }
      this.format = options["format"] || this.default_format;
      this.tokenizer = new TwitterCldr.NumberTokenizer(this);
      this.formatter = null;
      switch (this.type) {
        case "decimal":
          this.formatter = new TwitterCldr.DecimalFormatter(options);
          break;
        case "long_decimal":
          this.formatter = new TwitterCldr.LongDecimalFormatter(options);
          break;
        case "short_decimal":
          this.formatter = new TwitterCldr.ShortDecimalFormatter(options);
          break;
        case "currency":
          this.formatter = new TwitterCldr.CurrencyFormatter(options);
          break;
        case "percent":
          this.formatter = new TwitterCldr.PercentFormatter(options);
      }
      this.number_data = {};
      this.resource = {"af":{"af":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 duisend","other":"0 duisend"},"10000":{"one":"00 duisend","other":"00 duisend"},"100000":{"one":"000 duisend","other":"000 duisend"},"1000000":{"one":"0 miljoen","other":"0 miljoen"},"10000000":{"one":"00 miljoen","other":"00 miljoen"},"100000000":{"one":"000 miljoen","other":"000 miljoen"},"1000000000":{"one":"0 miljard","other":"0 miljard"},"10000000000":{"one":"00 miljard","other":"00 miljard"},"100000000000":{"one":"000 miljard","other":"000 miljard"},"1000000000000":{"one":"0 biljoen","other":"0 biljoen"},"10000000000000":{"one":"00 biljoen","other":"00 biljoen"},"100000000000000":{"one":"000 biljoen","other":"000 biljoen"}},"short":{"1000":{"one":0,"other":0},"10000":{"one":0,"other":0},"100000":{"one":0,"other":0},"1000000":{"one":"0 m","other":"0 m"},"10000000":{"one":"00 m","other":"00 m"},"100000000":{"one":"000 m","other":"000 m"},"1000000000":{"one":"0 mjd","other":"0 mjd"},"10000000000":{"one":"00 mjd","other":"00 mjd"},"100000000000":{"one":"000 mjd","other":"000 mjd"},"1000000000000":{"one":"0 bn","other":"0 bn"},"10000000000000":{"one":"00 bn","other":"00 bn"},"100000000000000":{"one":"000 bn","other":"000 bn"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ar":{"ar":{"numbers":{"formats":{"currency":{"number_system":"arab","patterns":{"default":"¤ #,##0.00"},"unit":{"few":"{0} {1}","many":"{0} {1}","one":"{0} {1}","other":"{0} {1}","two":"{0} {1}","zero":"{0} {1}"}},"decimal":{"number_system":"arab","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 آلاف","many":"0 ألف","one":"0 ألف","other":"0 ألف","two":"0 ألف","zero":"0 ألف"},"10000":{"few":"00 ألف","many":"00 ألف","one":"00 ألف","other":"00 ألف","two":"00 ألف","zero":"00 ألف"},"100000":{"few":"000 ألف","many":"000 ألف","one":"000 ألف","other":"000 ألف","two":"000 ألف","zero":"000 ألف"},"1000000":{"few":"0 ملايين","many":"0 مليون","one":"0 مليون","other":"0 مليون","two":"0 مليون","zero":"0 مليون"},"10000000":{"few":"00 ملايين","many":"00 مليون","one":"00 مليون","other":"00 مليون","two":"00 مليون","zero":"00 مليون"},"100000000":{"few":"000 مليون","many":"000 مليون","one":"000 مليون","other":"000 مليون","two":"000 مليون","zero":"000 مليون"},"1000000000":{"few":"0 بلايين","many":"0 بليون","one":"0 بليون","other":"0 بليون","two":"0 بليون","zero":"0 بليون"},"10000000000":{"few":"00 بليون","many":"00 بليون","one":"00 بليون","other":"00 بليون","two":"00 بليون","zero":"00 بليون"},"100000000000":{"few":"000 بليون","many":"000 بليون","one":"000 بليون","other":"000 بليون","two":"000 بليون","zero":"000 بليون"},"1000000000000":{"few":"0 تريليونات","many":"0 تريليون","one":"0 تريليون","other":"0 تريليون","two":"0 تريليون","zero":"0 تريليون"},"10000000000000":{"few":"00 تريليون","many":"00 تريليون","one":"00 تريليون","other":"00 تريليون","two":"00 تريليون","zero":"00 تريليون"},"100000000000000":{"few":"000 تريليون","many":"000 تريليون","one":"000 تريليون","other":"000 تريليون","two":"000 تريليون","zero":"000 تريليون"}},"short":{"1000":{"few":"0 آلاف","many":"0 ألف","one":"0 ألف","other":"0 ألف","two":"0 ألف","zero":"0 ألف"},"10000":{"few":"00 ألف","many":"00 ألف","one":"00 ألف","other":"00 ألف","two":"00 ألف","zero":"00 ألف"},"100000":{"few":"000 ألف","many":"000 ألف","one":"000 ألف","other":"000 ألف","two":"000 ألف","zero":"000 ألف"},"1000000":{"few":"0 مليو","many":"0 مليو","one":"0 مليو","other":"0 مليو","two":"0 مليو","zero":"0 مليو"},"10000000":{"few":"00 مليو","many":"00 مليو","one":"00 مليو","other":"00 مليو","two":"00 مليو","zero":"00 مليو"},"100000000":{"few":"000 مليو","many":"000 مليو","one":"000 مليو","other":"000 مليو","two":"000 مليو","zero":"000 مليو"},"1000000000":{"few":"0 بليو","many":"0 بليو","one":"0 بليو","other":"0 بليو","two":"0 بليو","zero":"0 بليو"},"10000000000":{"few":"00 بليو","many":"00 بليو","one":"00 بليو","other":"00 بليو","two":"00 بليو","zero":"00 بليو"},"100000000000":{"few":"000 بليو","many":"000 بليو","one":"000 بليو","other":"000 بليو","two":"000 بليو","zero":"000 بليو"},"1000000000000":{"few":"0 ترليو","many":"0 ترليو","one":"0 ترليو","other":"0 ترليو","two":"0 ترليو","zero":"0 ترليو"},"10000000000000":{"few":"00 ترليو","many":"00 ترليو","one":"00 ترليو","other":"00 ترليو","two":"00 ترليو","zero":"00 ترليو"},"100000000000000":{"few":"000 ترليو","many":"000 ترليو","one":"000 ترليو","other":"000 ترليو","two":"000 ترليو","zero":"000 ترليو"}}}},"percent":{"number_system":"arab","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"arab","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"‎-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"‎+","superscripting_exponent":"×","time_separator":":"}}}},"be":{"be":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":"numbers.formats.decimal.patterns.short","short":{"1000":{"other":"0K"},"10000":{"other":"00K"},"100000":{"other":"000K"},"1000000":{"other":"0M"},"10000000":{"other":"00M"},"100000000":{"other":"000M"},"1000000000":{"other":"0G"},"10000000000":{"other":"00G"},"100000000000":{"other":"000G"},"1000000000000":{"other":"0T"},"10000000000000":{"other":"00T"},"100000000000000":{"other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"bg":{"bg":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 хиляда","other":"0 хиляди"},"10000":{"one":"00 хиляди","other":"00 хиляди"},"100000":{"one":"000 хиляди","other":"000 хиляди"},"1000000":{"one":"0 милион","other":"0 милиона"},"10000000":{"one":"00 милиона","other":"00 милиона"},"100000000":{"one":"000 милиона","other":"000 милиона"},"1000000000":{"one":"0 милиард","other":"0 милиарда"},"10000000000":{"one":"00 милиарда","other":"00 милиарда"},"100000000000":{"one":"000 милиарда","other":"000 милиарда"},"1000000000000":{"one":"0 трилион","other":"0 трилиона"},"10000000000000":{"one":"00 трилиона","other":"00 трилиона"},"100000000000000":{"one":"000 трилиона","other":"000 трилиона"}},"short":{"1000":{"one":"0 хил'.'","other":"0 хил'.'"},"10000":{"one":"00 хил'.'","other":"00 хил'.'"},"100000":{"one":"000 хил'.'","other":"000 хил'.'"},"1000000":{"one":"0 млн'.'","other":"0 млн'.'"},"10000000":{"one":"00 млн'.'","other":"00 млн'.'"},"100000000":{"one":"000 млн'.'","other":"000 млн'.'"},"1000000000":{"one":"0 млрд'.'","other":"0 млрд'.'"},"10000000000":{"one":"00 млрд'.'","other":"00 млрд'.'"},"100000000000":{"one":"000 млрд'.'","other":"000 млрд'.'"},"1000000000000":{"one":"0 трлн'.'","other":"0 трлн'.'"},"10000000000000":{"one":"00 трлн'.'","other":"00 трлн'.'"},"100000000000000":{"one":"000 трлн'.'","other":"000 трлн'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":".","time_separator":":"}}}},"bn":{"bn":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##,##0.00¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##,##0.###","long":{"1000":{"one":"0 হাজার","other":"0 হাজার"},"10000":{"one":"00 হাজার","other":"00 হাজার"},"100000":{"one":"0 লাখ","other":"0 লাখ"},"1000000":{"one":"0 মিলিয়ন","other":"0 মিলিয়ন"},"10000000":{"one":"00 মিলিয়ন","other":"00 মিলিয়ন"},"100000000":{"one":"000 মিলিয়ন","other":"000 মিলিয়ন"},"1000000000":{"one":"0 বিলিয়ন","other":"0 বিলিয়ন"},"10000000000":{"one":"00 বিলিয়ন","other":"00 বিলিয়ন"},"100000000000":{"one":"000 বিলিয়ন","other":"000 বিলিয়ন"},"1000000000000":{"one":"0 ট্রিলিয়ন","other":"0 ট্রিলিয়ন"},"10000000000000":{"one":"00 ট্রিলিয়ন","other":"00 ট্রিলিয়ন"},"100000000000000":{"one":"000 ট্রিলিয়ন","other":"000 ট্রিলিয়ন"}},"short":{"1000":{"one":"0 হাজার","other":"0 হাজার"},"10000":{"one":"00 হাজার","other":"00 হাজার"},"100000":{"one":"0 লাখ","other":"0 লাখ"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ca":{"ca":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 miler","other":"0 milers"},"10000":{"one":"00 milers","other":"00 milers"},"100000":{"one":"000 milers","other":"000 milers"},"1000000":{"one":"0 milió","other":"0 milions"},"10000000":{"one":"00 milions","other":"00 milions"},"100000000":{"one":"000 milions","other":"000 milions"},"1000000000":{"one":"0 miler de milions","other":"0 milers de milions"},"10000000000":{"one":"00 milers de milions","other":"00 milers de milions"},"100000000000":{"one":"000 milers de milions","other":"000 milers de milions"},"1000000000000":{"one":"0 bilió","other":"0 bilions"},"10000000000000":{"one":"00 bilions","other":"00 bilions"},"100000000000000":{"one":"000 bilions","other":"000 bilions"}},"short":{"1000":{"one":"0m","other":"0m"},"10000":{"one":"00m","other":"00m"},"100000":{"one":"000m","other":"000m"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00 M","other":"00 M"},"100000000":{"one":"000 M","other":"000 M"},"1000000000":{"one":"0000 M","other":"0000 M"},"10000000000":{"one":"00mM","other":"00mM"},"100000000000":{"one":"000mM","other":"000mM"},"1000000000000":{"one":"0B","other":"0B"},"10000000000000":{"one":"00 B","other":"00 B"},"100000000000000":{"one":"000 B","other":"000 B"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"cs":{"cs":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"few":"{0} {1}","many":"{0} {1}","one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 tisíce","many":"0 tisíce","one":"0 tisíc","other":"0 tisíc"},"10000":{"few":"00 tisíc","many":"00 tisíce","one":"00 tisíc","other":"00 tisíc"},"100000":{"few":"000 tisíc","many":"000 tisíce","one":"000 tisíc","other":"000 tisíc"},"1000000":{"few":"0 miliony","many":"0 milionu","one":"0 milion","other":"0 milionů"},"10000000":{"few":"00 milionů","many":"00 milionu","one":"00 milionů","other":"00 milionů"},"100000000":{"few":"000 milionů","many":"000 milionu","one":"000 milionů","other":"000 milionů"},"1000000000":{"few":"0 miliardy","many":"0 miliardy","one":"0 miliarda","other":"0 miliard"},"10000000000":{"few":"00 miliard","many":"00 miliardy","one":"00 miliard","other":"00 miliard"},"100000000000":{"few":"000 miliard","many":"000 miliardy","one":"000 miliard","other":"000 miliard"},"1000000000000":{"few":"0 biliony","many":"0 bilionu","one":"0 bilion","other":"0 bilionů"},"10000000000000":{"few":"00 bilionů","many":"00 bilionu","one":"00 bilionů","other":"00 bilionů"},"100000000000000":{"few":"000 bilionů","many":"000 bilionu","one":"000 bilionů","other":"000 bilionů"}},"short":{"1000":{"few":"0 tis'.'","many":"0 tis'.'","one":"0 tis'.'","other":"0 tis'.'"},"10000":{"few":"00 tis'.'","many":"00 tis'.'","one":"00 tis'.'","other":"00 tis'.'"},"100000":{"few":"000 tis'.'","many":"000 tis'.'","one":"000 tis'.'","other":"000 tis'.'"},"1000000":{"few":"0 mil'.'","many":"0 mil'.'","one":"0 mil'.'","other":"0 mil'.'"},"10000000":{"few":"00 mil'.'","many":"00 mil'.'","one":"00 mil'.'","other":"00 mil'.'"},"100000000":{"few":"000 mil'.'","many":"000 mil'.'","one":"000 mil'.'","other":"000 mil'.'"},"1000000000":{"few":"0 mld'.'","many":"0 mld'.'","one":"0 mld'.'","other":"0 mld'.'"},"10000000000":{"few":"00 mld'.'","many":"00 mld'.'","one":"00 mld'.'","other":"00 mld'.'"},"100000000000":{"few":"000 mld'.'","many":"000 mld'.'","one":"000 mld'.'","other":"000 mld'.'"},"1000000000000":{"few":"0 bil'.'","many":"0 bil'.'","one":"0 bil'.'","other":"0 bil'.'"},"10000000000000":{"few":"00 bil'.'","many":"00 bil'.'","one":"00 bil'.'","other":"00 bil'.'"},"100000000000000":{"few":"000 bil'.'","many":"000 bil'.'","one":"000 bil'.'","other":"000 bil'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"cy":{"cy":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"few":"{0} {1}","many":"{0} {1}","one":"{0} {1}","other":"{0} {1}","two":"{0} {1}","zero":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 mil","many":"0 mil","one":"0 fil","other":"0 mil","two":"0 fil","zero":"0 mil"},"10000":{"few":"00 mil","many":"00 mil","one":"00 mil","other":"00 mil","two":"00 mil","zero":"00 mil"},"100000":{"few":"000 mil","many":"000 mil","one":"000 mil","other":"000 mil","two":"000 mil","zero":"000 mil"},"1000000":{"few":"0 miliwn","many":"0 miliwn","one":"0 filiwn","other":"0 miliwn","two":"0 filiwn","zero":"0 miliwn"},"10000000":{"few":"00 miliwn","many":"00 miliwn","one":"00 miliwn","other":"00 miliwn","two":"00 miliwn","zero":"00 miliwn"},"100000000":{"few":"000 miliwn","many":"000 miliwn","one":"000 miliwn","other":"000 miliwn","two":"000 miliwn","zero":"000 miliwn"},"1000000000":{"few":"0 biliwn","many":"0 biliwn","one":"0 biliwn","other":"0 biliwn","two":"0 biliwn","zero":"0 biliwn"},"10000000000":{"few":"00 biliwn","many":"00 biliwn","one":"00 biliwn","other":"00 biliwn","two":"00 biliwn","zero":"00 biliwn"},"100000000000":{"few":"000 biliwn","many":"000 biliwn","one":"000 biliwn","other":"000 biliwn","two":"000 biliwn","zero":"000 biliwn"},"1000000000000":{"few":"0 thriliwn","many":"0 thriliwn","one":"0 triliwn","other":"0 triliwn","two":"0 driliwn","zero":"0 triliwn"},"10000000000000":{"few":"00 triliwn","many":"00 triliwn","one":"00 triliwn","other":"00 triliwn","two":"00 triliwn","zero":"00 triliwn"},"100000000000000":{"few":"000 triliwn","many":"000 triliwn","one":"000 triliwn","other":"000 triliwn","two":"000 triliwn","zero":"000 triliwn"}},"short":{"1000":{"few":"0K","many":"0K","one":"0K","other":"0K","two":"0K","zero":"0K"},"10000":{"few":"00K","many":"00K","one":"00K","other":"00K","two":"00K","zero":"00K"},"100000":{"few":"000K","many":"000K","one":"000K","other":"000K","two":"000K","zero":"000K"},"1000000":{"few":"0M","many":"0M","one":"0M","other":"0M","two":"0M","zero":"0M"},"10000000":{"few":"00M","many":"00M","one":"00M","other":"00M","two":"00M","zero":"00M"},"100000000":{"few":"000M","many":"000M","one":"000M","other":"000M","two":"000M","zero":"000M"},"1000000000":{"few":"0B","many":"0B","one":"0B","other":"0B","two":"0B","zero":"0B"},"10000000000":{"few":"00B","many":"00B","one":"00B","other":"00B","two":"00B","zero":"00B"},"100000000000":{"few":"000B","many":"000B","one":"000B","other":"000B","two":"000B","zero":"000B"},"1000000000000":{"few":"0T","many":"0T","one":"0T","other":"0T","two":"0T","zero":"0T"},"10000000000000":{"few":"00T","many":"00T","one":"00T","other":"00T","two":"00T","zero":"00T"},"100000000000000":{"few":"000T","many":"000T","one":"000T","other":"000T","two":"000T","zero":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"x","time_separator":":"}}}},"da":{"da":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 tusind","other":"0 tusind"},"10000":{"one":"00 tusind","other":"00 tusind"},"100000":{"one":"000 tusind","other":"000 tusind"},"1000000":{"one":"0 million","other":"0 millioner"},"10000000":{"one":"00 millioner","other":"00 millioner"},"100000000":{"one":"000 millioner","other":"000 millioner"},"1000000000":{"one":"0 milliard","other":"0 milliarder"},"10000000000":{"one":"00 milliarder","other":"00 milliarder"},"100000000000":{"one":"000 milliarder","other":"000 milliarder"},"1000000000000":{"one":"0 billion","other":"0 billioner"},"10000000000000":{"one":"00 billioner","other":"00 billioner"},"100000000000000":{"one":"000 billioner","other":"000 billioner"}},"short":{"1000":{"one":"0 td","other":"0 td"},"10000":{"one":"00 td","other":"00 td"},"100000":{"one":"000 td","other":"000 td"},"1000000":{"one":"0 mio","other":"0 mio"},"10000000":{"one":"00 mio","other":"00 mio"},"100000000":{"one":"000 mio","other":"000 mio"},"1000000000":{"one":"0 mia","other":"0 mia"},"10000000000":{"one":"00 mia","other":"00 mia"},"100000000000":{"one":"000 mia","other":"000 mia"},"1000000000000":{"one":"0 bill","other":"0 bill"},"10000000000000":{"one":"00 bill","other":"00 bill"},"100000000000000":{"one":"000 bill","other":"000 bill"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":"."}}}},"de":{"de":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 Tausend","other":"0 Tausend"},"10000":{"one":"00 Tausend","other":"00 Tausend"},"100000":{"one":"000 Tausend","other":"000 Tausend"},"1000000":{"one":"0 Million","other":"0 Millionen"},"10000000":{"one":"00 Millionen","other":"00 Millionen"},"100000000":{"one":"000 Millionen","other":"000 Millionen"},"1000000000":{"one":"0 Milliarde","other":"0 Milliarden"},"10000000000":{"one":"00 Milliarden","other":"00 Milliarden"},"100000000000":{"one":"000 Milliarden","other":"000 Milliarden"},"1000000000000":{"one":"0 Billion","other":"0 Billionen"},"10000000000000":{"one":"00 Billionen","other":"00 Billionen"},"100000000000000":{"one":"000 Billionen","other":"000 Billionen"}},"short":{"1000":{"one":"0 Tsd'.'","other":"0 Tsd'.'"},"10000":{"one":"00 Tsd'.'","other":"00 Tsd'.'"},"100000":{"one":"000 Tsd'.'","other":"000 Tsd'.'"},"1000000":{"one":"0 Mio","other":"0 Mio"},"10000000":{"one":"00 Mio","other":"00 Mio"},"100000000":{"one":"000 Mio","other":"000 Mio"},"1000000000":{"one":"0 Mrd","other":"0 Mrd"},"10000000000":{"one":"00 Mrd","other":"00 Mrd"},"100000000000":{"one":"000 Mrd","other":"000 Mrd"},"1000000000000":{"one":"0 Bio'.'","other":"0 Bio'.'"},"10000000000000":{"one":"00 Bio'.'","other":"00 Bio'.'"},"100000000000000":{"one":"000 Bio'.'","other":"000 Bio'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"·","time_separator":":"}}}},"de-CH":{"de-CH":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤ #,##0.00;¤-#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 Tausend","other":"0 Tausend"},"10000":{"one":"00 Tausend","other":"00 Tausend"},"100000":{"one":"000 Tausend","other":"000 Tausend"},"1000000":{"one":"0 Million","other":"0 Millionen"},"10000000":{"one":"00 Millionen","other":"00 Millionen"},"100000000":{"one":"000 Millionen","other":"000 Millionen"},"1000000000":{"one":"0 Milliarde","other":"0 Milliarden"},"10000000000":{"one":"00 Milliarden","other":"00 Milliarden"},"100000000000":{"one":"000 Milliarden","other":"000 Milliarden"},"1000000000000":{"one":"0 Billion","other":"0 Billionen"},"10000000000000":{"one":"00 Billionen","other":"00 Billionen"},"100000000000000":{"one":"000 Billionen","other":"000 Billionen"}},"short":{"1000":{"one":"0 Tsd'.'","other":"0 Tsd'.'"},"10000":{"one":"00 Tsd'.'","other":"00 Tsd'.'"},"100000":{"one":"000 Tsd'.'","other":"000 Tsd'.'"},"1000000":{"one":"0 Mio","other":"0 Mio"},"10000000":{"one":"00 Mio","other":"00 Mio"},"100000000":{"one":"000 Mio","other":"000 Mio"},"1000000000":{"one":"0 Mrd","other":"0 Mrd"},"10000000000":{"one":"00 Mrd","other":"00 Mrd"},"100000000000":{"one":"000 Mrd","other":"000 Mrd"},"1000000000000":{"one":"0 Bio'.'","other":"0 Bio'.'"},"10000000000000":{"one":"00 Bio'.'","other":"00 Bio'.'"},"100000000000000":{"one":"000 Bio'.'","other":"000 Bio'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":"'","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"·","time_separator":":"}}}},"el":{"el":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 χιλιάδα","other":"0 χιλιάδες"},"10000":{"one":"00 χιλιάδες","other":"00 χιλιάδες"},"100000":{"one":"000 χιλιάδες","other":"000 χιλιάδες"},"1000000":{"one":"0 εκατομμύριο","other":"0 εκατομμύρια"},"10000000":{"one":"00 εκατομμύρια","other":"00 εκατομμύρια"},"100000000":{"one":"000 εκατομμύρια","other":"000 εκατομμύρια"},"1000000000":{"one":"0 δισεκατομμύριο","other":"0 δισεκατομμύρια"},"10000000000":{"one":"00 δισεκατομμύρια","other":"00 δισεκατομμύρια"},"100000000000":{"one":"000 δισεκατομμύρια","other":"000 δισεκατομμύρια"},"1000000000000":{"one":"0 τρισεκατομμύριο","other":"0 τρισεκατομμύρια"},"10000000000000":{"one":"00 τρισεκατομμύρια","other":"00 τρισεκατομμύρια"},"100000000000000":{"one":"000 τρισεκατομμύρια","other":"000 τρισεκατομμύρια"}},"short":{"1000":{"one":"0 χιλ'.'","other":"0 χιλ'.'"},"10000":{"one":"00 χιλ'.'","other":"00 χιλ'.'"},"100000":{"one":"000 χιλ'.'","other":"000 χιλ'.'"},"1000000":{"one":"0 εκ'.'","other":"0 εκ'.'"},"10000000":{"one":"00 εκ'.'","other":"00 εκ'.'"},"100000000":{"one":"000 εκ'.'","other":"000 εκ'.'"},"1000000000":{"one":"0 δισ'.'","other":"0 δισ'.'"},"10000000000":{"one":"00 δισ'.'","other":"00 δισ'.'"},"100000000000":{"one":"000 δισ'.'","other":"000 δισ'.'"},"1000000000000":{"one":"0 τρισ'.'","other":"0 τρισ'.'"},"10000000000000":{"one":"00 τρισ'.'","other":"00 τρισ'.'"},"100000000000000":{"one":"000 τρισ'.'","other":"000 τρισ'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"e","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"en":{"en":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 thousand","other":"0 thousand"},"10000":{"one":"00 thousand","other":"00 thousand"},"100000":{"one":"000 thousand","other":"000 thousand"},"1000000":{"one":"0 million","other":"0 million"},"10000000":{"one":"00 million","other":"00 million"},"100000000":{"one":"000 million","other":"000 million"},"1000000000":{"one":"0 billion","other":"0 billion"},"10000000000":{"one":"00 billion","other":"00 billion"},"100000000000":{"one":"000 billion","other":"000 billion"},"1000000000000":{"one":"0 trillion","other":"0 trillion"},"10000000000000":{"one":"00 trillion","other":"00 trillion"},"100000000000000":{"one":"000 trillion","other":"000 trillion"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"en-150":{"en-150":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 thousand","other":"0 thousand"},"10000":{"one":"00 thousand","other":"00 thousand"},"100000":{"one":"000 thousand","other":"000 thousand"},"1000000":{"one":"0 million","other":"0 million"},"10000000":{"one":"00 million","other":"00 million"},"100000000":{"one":"000 million","other":"000 million"},"1000000000":{"one":"0 billion","other":"0 billion"},"10000000000":{"one":"00 billion","other":"00 billion"},"100000000000":{"one":"000 billion","other":"000 billion"},"1000000000000":{"one":"0 trillion","other":"0 trillion"},"10000000000000":{"one":"00 trillion","other":"00 trillion"},"100000000000000":{"one":"000 trillion","other":"000 trillion"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"en-AU":{"en-AU":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 thousand","other":"0 thousand"},"10000":{"one":"00 thousand","other":"00 thousand"},"100000":{"one":"000 thousand","other":"000 thousand"},"1000000":{"one":"0 million","other":"0 million"},"10000000":{"one":"00 million","other":"00 million"},"100000000":{"one":"000 million","other":"000 million"},"1000000000":{"one":"0 billion","other":"0 billion"},"10000000000":{"one":"00 billion","other":"00 billion"},"100000000000":{"one":"000 billion","other":"000 billion"},"1000000000000":{"one":"0 trillion","other":"0 trillion"},"10000000000000":{"one":"00 trillion","other":"00 trillion"},"100000000000000":{"one":"000 trillion","other":"000 trillion"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"en-CA":{"en-CA":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 thousand","other":"0 thousand"},"10000":{"one":"00 thousand","other":"00 thousand"},"100000":{"one":"000 thousand","other":"000 thousand"},"1000000":{"one":"0 million","other":"0 million"},"10000000":{"one":"00 million","other":"00 million"},"100000000":{"one":"000 million","other":"000 million"},"1000000000":{"one":"0 billion","other":"0 billion"},"10000000000":{"one":"00 billion","other":"00 billion"},"100000000000":{"one":"000 billion","other":"000 billion"},"1000000000000":{"one":"0 trillion","other":"0 trillion"},"10000000000000":{"one":"00 trillion","other":"00 trillion"},"100000000000000":{"one":"000 trillion","other":"000 trillion"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"en-GB":{"en-GB":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 thousand","other":"0 thousand"},"10000":{"one":"00 thousand","other":"00 thousand"},"100000":{"one":"000 thousand","other":"000 thousand"},"1000000":{"one":"0 million","other":"0 million"},"10000000":{"one":"00 million","other":"00 million"},"100000000":{"one":"000 million","other":"000 million"},"1000000000":{"one":"0 billion","other":"0 billion"},"10000000000":{"one":"00 billion","other":"00 billion"},"100000000000":{"one":"000 billion","other":"000 billion"},"1000000000000":{"one":"0 trillion","other":"0 trillion"},"10000000000000":{"one":"00 trillion","other":"00 trillion"},"100000000000000":{"one":"000 trillion","other":"000 trillion"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"en-IE":{"en-IE":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 thousand","other":"0 thousand"},"10000":{"one":"00 thousand","other":"00 thousand"},"100000":{"one":"000 thousand","other":"000 thousand"},"1000000":{"one":"0 million","other":"0 million"},"10000000":{"one":"00 million","other":"00 million"},"100000000":{"one":"000 million","other":"000 million"},"1000000000":{"one":"0 billion","other":"0 billion"},"10000000000":{"one":"00 billion","other":"00 billion"},"100000000000":{"one":"000 billion","other":"000 billion"},"1000000000000":{"one":"0 trillion","other":"0 trillion"},"10000000000000":{"one":"00 trillion","other":"00 trillion"},"100000000000000":{"one":"000 trillion","other":"000 trillion"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"en-SG":{"en-SG":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 thousand","other":"0 thousand"},"10000":{"one":"00 thousand","other":"00 thousand"},"100000":{"one":"000 thousand","other":"000 thousand"},"1000000":{"one":"0 million","other":"0 million"},"10000000":{"one":"00 million","other":"00 million"},"100000000":{"one":"000 million","other":"000 million"},"1000000000":{"one":"0 billion","other":"0 billion"},"10000000000":{"one":"00 billion","other":"00 billion"},"100000000000":{"one":"000 billion","other":"000 billion"},"1000000000000":{"one":"0 trillion","other":"0 trillion"},"10000000000000":{"one":"00 trillion","other":"00 trillion"},"100000000000000":{"one":"000 trillion","other":"000 trillion"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"en-ZA":{"en-ZA":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 thousand","other":"0 thousand"},"10000":{"one":"00 thousand","other":"00 thousand"},"100000":{"one":"000 thousand","other":"000 thousand"},"1000000":{"one":"0 million","other":"0 million"},"10000000":{"one":"00 million","other":"00 million"},"100000000":{"one":"000 million","other":"000 million"},"1000000000":{"one":"0 billion","other":"0 billion"},"10000000000":{"one":"00 billion","other":"00 billion"},"100000000000":{"one":"000 billion","other":"000 billion"},"1000000000000":{"one":"0 trillion","other":"0 trillion"},"10000000000000":{"one":"00 trillion","other":"00 trillion"},"100000000000000":{"one":"000 trillion","other":"000 trillion"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"es":{"es":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 mil","other":"0 mil"},"10000":{"one":"00 mil","other":"00 mil"},"100000":{"one":"000 mil","other":"000 mil"},"1000000":{"one":"0 millón","other":"0 millones"},"10000000":{"one":"00 millones","other":"00 millones"},"100000000":{"one":"000 millones","other":"000 millones"},"1000000000":{"one":"0 mil millones","other":"0 mil millones"},"10000000000":{"one":"00 mil millones","other":"00 mil millones"},"100000000000":{"one":"000 mil millones","other":"000 mil millones"},"1000000000000":{"one":"0 billón","other":"0 billones"},"10000000000000":{"one":"00 billones","other":"00 billones"},"100000000000000":{"one":"000 billones","other":"000 billones"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0000M","other":"0000M"},"10000000000":{"one":"00MRD","other":"00MRD"},"100000000000":{"one":"000MRD","other":"000MRD"},"1000000000000":{"one":"0B","other":"0B"},"10000000000000":{"one":"00B","other":"00B"},"100000000000000":{"one":"000B","other":"000B"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"es-419":{"es-419":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 mil","other":"0 mil"},"10000":{"one":"00 mil","other":"00 mil"},"100000":{"one":"000 mil","other":"000 mil"},"1000000":{"one":"0 millón","other":"0 millones"},"10000000":{"one":"00 millones","other":"00 millones"},"100000000":{"one":"000 millones","other":"000 millones"},"1000000000":{"one":"0 mil millones","other":"0 mil millones"},"10000000000":{"one":"00 mil millones","other":"00 mil millones"},"100000000000":{"one":"000 mil millones","other":"000 mil millones"},"1000000000000":{"one":"0 billón","other":"0 billones"},"10000000000000":{"one":"00 billones","other":"00 billones"},"100000000000000":{"one":"000 billones","other":"000 billones"}},"short":{"1000":{"one":0,"other":0},"10000":{"one":"00k","other":"00k"},"100000":{"one":"000k","other":"000k"},"1000000":{"one":"0 M","other":"0 M"},"10000000":{"one":"00 M","other":"00 M"},"100000000":{"one":"000 M","other":"000 M"},"1000000000":{"one":"0k M","other":"0k M"},"10000000000":{"one":"00k M","other":"00k M"},"100000000000":{"one":"000k M","other":"000k M"},"1000000000000":{"one":"0 B","other":"0 B"},"10000000000000":{"one":"00 B","other":"00 B"},"100000000000000":{"one":"000 B","other":"000 B"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"es-CO":{"es-CO":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 mil","other":"0 mil"},"10000":{"one":"00 mil","other":"00 mil"},"100000":{"one":"000 mil","other":"000 mil"},"1000000":{"one":"0 millón","other":"0 millones"},"10000000":{"one":"00 millones","other":"00 millones"},"100000000":{"one":"000 millones","other":"000 millones"},"1000000000":{"one":"0 mil millones","other":"0 mil millones"},"10000000000":{"one":"00 mil millones","other":"00 mil millones"},"100000000000":{"one":"000 mil millones","other":"000 mil millones"},"1000000000000":{"one":"0 billón","other":"0 billones"},"10000000000000":{"one":"00 billones","other":"00 billones"},"100000000000000":{"one":"000 billones","other":"000 billones"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0000M","other":"0000M"},"10000000000":{"one":"00MRD","other":"00MRD"},"100000000000":{"one":"000MRD","other":"000MRD"},"1000000000000":{"one":"0B","other":"0B"},"10000000000000":{"one":"00B","other":"00B"},"100000000000000":{"one":"000B","other":"000B"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"es-MX":{"es-MX":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 mil","other":"0 mil"},"10000":{"one":"00 mil","other":"00 mil"},"100000":{"one":"000 mil","other":"000 mil"},"1000000":{"one":"0 millón","other":"0 millones"},"10000000":{"one":"00 millones","other":"00 millones"},"100000000":{"one":"000 millones","other":"000 millones"},"1000000000":{"one":"0 mil millones","other":"0 mil millones"},"10000000000":{"one":"00 mil millones","other":"00 mil millones"},"100000000000":{"one":"000 mil millones","other":"000 mil millones"},"1000000000000":{"one":"0 billón","other":"0 billones"},"10000000000000":{"one":"00 billones","other":"00 billones"},"100000000000000":{"one":"000 billones","other":"000 billones"}},"short":{"1000":{"one":"0k","other":"0k"},"10000":{"one":"00k","other":"00k"},"100000":{"one":"000k","other":"000k"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0000M","other":"0000M"},"10000000000":{"one":"00MRD","other":"00MRD"},"100000000000":{"one":"000MRD","other":"000MRD"},"1000000000000":{"one":"0B","other":"0B"},"10000000000000":{"one":"00B","other":"00B"},"100000000000000":{"one":"000B","other":"000B"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"es-US":{"es-US":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 mil","other":"0 mil"},"10000":{"one":"00 mil","other":"00 mil"},"100000":{"one":"000 mil","other":"000 mil"},"1000000":{"one":"0 millón","other":"0 millones"},"10000000":{"one":"00 millones","other":"00 millones"},"100000000":{"one":"000 millones","other":"000 millones"},"1000000000":{"one":"0 mil millones","other":"0 mil millones"},"10000000000":{"one":"00 mil millones","other":"00 mil millones"},"100000000000":{"one":"000 mil millones","other":"000 mil millones"},"1000000000000":{"one":"0 billón","other":"0 billones"},"10000000000000":{"one":"00 billones","other":"00 billones"},"100000000000000":{"one":"000 billones","other":"000 billones"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0000M","other":"0000M"},"10000000000":{"one":"00MRD","other":"00MRD"},"100000000000":{"one":"000MRD","other":"000MRD"},"1000000000000":{"one":"0B","other":"0B"},"10000000000000":{"one":"00B","other":"00B"},"100000000000000":{"one":"000B","other":"000B"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"eu":{"eu":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0000","other":"0000"},"10000":{"one":"00000","other":"00000"},"100000":{"one":"000000","other":"000000"},"1000000":{"one":"0 milioi","other":"0 milioi"},"10000000":{"one":"00 milioi","other":"00 milioi"},"100000000":{"one":"000 milioi","other":"000 milioi"},"1000000000":{"one":"0000 milioi","other":"0000 milioi"},"10000000000":{"one":"00000 milioi","other":"00000 milioi"},"100000000000":{"one":"000000 milioi","other":"000000 milioi"},"1000000000000":{"one":"0 bilioi","other":"0 bilioi"},"10000000000000":{"one":"00 bilioi","other":"00 bilioi"},"100000000000000":{"one":"000 bilioi","other":"000 bilioi"}},"short":{"1000":{"one":"0000","other":"0000"},"10000":{"one":"00000","other":"00000"},"100000":{"one":"000000","other":"000000"},"1000000":{"one":"0 M","other":"0 M"},"10000000":{"one":"00 M","other":"00 M"},"100000000":{"one":"000 M","other":"000 M"},"1000000000":{"one":"0000 M","other":"0000 M"},"10000000000":{"one":"00000 M","other":"00000 M"},"100000000000":{"one":"000000 M","other":"000000 M"},"1000000000000":{"one":"0 B","other":"0 B"},"10000000000000":{"one":"00 B","other":"00 B"},"100000000000000":{"one":"000 B","other":"000 B"}}}},"percent":{"number_system":"latn","patterns":{"default":"% #,##0"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"fa":{"fa":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"‎¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"arabext","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 هزار","other":"0 هزار"},"10000":{"one":"00 هزار","other":"00 هزار"},"100000":{"one":"000 هزار","other":"000 هزار"},"1000000":{"one":"0 میلیون","other":"0 میلیون"},"10000000":{"one":"00 میلیون","other":"00 میلیون"},"100000000":{"one":"000 میلیون","other":"000 میلیون"},"1000000000":{"one":"0 میلیارد","other":"0 میلیارد"},"10000000000":{"one":"00 میلیارد","other":"00 میلیارد"},"100000000000":{"one":"000 میلیارد","other":"000 میلیارد"},"1000000000000":{"one":"0 هزار میلیارد","other":"0 هزار میلیارد"},"10000000000000":{"one":"00 هزار میلیارد","other":"00 هزار میلیارد"},"100000000000000":{"one":"000 هزار میلیارد","other":"000 هزار میلیارد"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0G","other":"0G"},"10000000000":{"one":"00G","other":"00G"},"100000000000":{"one":"000G","other":"000G"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"arabext","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"arabext","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"‎−","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"‎+","superscripting_exponent":"×","time_separator":":"}}}},"fi":{"fi":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 tuhat","other":"0 tuhatta"},"10000":{"one":"00 tuhatta","other":"00 tuhatta"},"100000":{"one":"000 tuhatta","other":"000 tuhatta"},"1000000":{"one":"0 miljoona","other":"0 miljoonaa"},"10000000":{"one":"00 miljoonaa","other":"00 miljoonaa"},"100000000":{"one":"000 miljoonaa","other":"000 miljoonaa"},"1000000000":{"one":"0 miljardi","other":"0 miljardia"},"10000000000":{"one":"00 miljardia","other":"00 miljardia"},"100000000000":{"one":"000 miljardia","other":"000 miljardia"},"1000000000000":{"one":"0 biljoona","other":"0 biljoonaa"},"10000000000000":{"one":"00 biljoonaa","other":"00 biljoonaa"},"100000000000000":{"one":"000 biljoonaa","other":"000 biljoonaa"}},"short":{"1000":{"one":"0 t'.'","other":"0 t'.'"},"10000":{"one":"00 t'.'","other":"00 t'.'"},"100000":{"one":"000 t'.'","other":"000 t'.'"},"1000000":{"one":"0 milj'.'","other":"0 milj'.'"},"10000000":{"one":"00 milj'.'","other":"00 milj'.'"},"100000000":{"one":"000 milj'.'","other":"000 milj'.'"},"1000000000":{"one":"0 mrd'.'","other":"0 mrd'.'"},"10000000000":{"one":"00 mrd'.'","other":"00 mrd'.'"},"100000000000":{"one":"000 mrd'.'","other":"000 mrd'.'"},"1000000000000":{"one":"0 bilj'.'","other":"0 bilj'.'"},"10000000000000":{"one":"00 bilj'.'","other":"00 bilj'.'"},"100000000000000":{"one":"000 bilj'.'","other":"000 bilj'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"−","nan":"epäluku","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":"."}}}},"fil":{"fil":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 libo","other":"0 libo"},"10000":{"one":"00 libo","other":"00 libo"},"100000":{"one":"000 libo","other":"000 libo"},"1000000":{"one":"0 milyon","other":"0 milyon"},"10000000":{"one":"00 milyon","other":"00 milyon"},"100000000":{"one":"000 milyon","other":"000 milyon"},"1000000000":{"one":"0 bilyon","other":"0 bilyon"},"10000000000":{"one":"00 bilyon","other":"00 bilyon"},"100000000000":{"one":"000 bilyon","other":"000 bilyon"},"1000000000000":{"one":"0 trilyon","other":"0 trilyon"},"10000000000000":{"one":"00 trilyon","other":"00 trilyon"},"100000000000000":{"one":"000 trilyon","other":"000 trilyon"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0B","other":"0B"},"10000000000":{"one":"00B","other":"00B"},"100000000000":{"one":"000B","other":"000B"},"1000000000000":{"one":"0T","other":"0T"},"10000000000000":{"one":"00T","other":"00T"},"100000000000000":{"one":"000T","other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"fr":{"fr":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 millier","other":"0 mille"},"10000":{"one":"00 millier","other":"00 mille"},"100000":{"one":"000 millier","other":"000 mille"},"1000000":{"one":"0 million","other":"0 millions"},"10000000":{"one":"00 million","other":"00 millions"},"100000000":{"one":"000 million","other":"000 millions"},"1000000000":{"one":"0 milliard","other":"0 milliards"},"10000000000":{"one":"00 milliard","other":"00 milliards"},"100000000000":{"one":"000 milliards","other":"000 milliards"},"1000000000000":{"one":"0 billion","other":"0 billions"},"10000000000000":{"one":"00 billions","other":"00 billions"},"100000000000000":{"one":"000 billions","other":"000 billions"}},"short":{"1000":{"one":"0 k","other":"0 k"},"10000":{"one":"00 k","other":"00 k"},"100000":{"one":"000 k","other":"000 k"},"1000000":{"one":"0 M","other":"0 M"},"10000000":{"one":"00 M","other":"00 M"},"100000000":{"one":"000 M","other":"000 M"},"1000000000":{"one":"0 Md","other":"0 Md"},"10000000000":{"one":"00 Md","other":"00 Md"},"100000000000":{"one":"000 Md","other":"000 Md"},"1000000000000":{"one":"0 Bn","other":"0 Bn"},"10000000000000":{"one":"00 Bn","other":"00 Bn"},"100000000000000":{"one":"000 Bn","other":"000 Bn"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"fr-BE":{"fr-BE":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 millier","other":"0 mille"},"10000":{"one":"00 millier","other":"00 mille"},"100000":{"one":"000 millier","other":"000 mille"},"1000000":{"one":"0 million","other":"0 millions"},"10000000":{"one":"00 million","other":"00 millions"},"100000000":{"one":"000 million","other":"000 millions"},"1000000000":{"one":"0 milliard","other":"0 milliards"},"10000000000":{"one":"00 milliard","other":"00 milliards"},"100000000000":{"one":"000 milliards","other":"000 milliards"},"1000000000000":{"one":"0 billion","other":"0 billions"},"10000000000000":{"one":"00 billions","other":"00 billions"},"100000000000000":{"one":"000 billions","other":"000 billions"}},"short":{"1000":{"one":"0 k","other":"0 k"},"10000":{"one":"00 k","other":"00 k"},"100000":{"one":"000 k","other":"000 k"},"1000000":{"one":"0 M","other":"0 M"},"10000000":{"one":"00 M","other":"00 M"},"100000000":{"one":"000 M","other":"000 M"},"1000000000":{"one":"0 Md","other":"0 Md"},"10000000000":{"one":"00 Md","other":"00 Md"},"100000000000":{"one":"000 Md","other":"000 Md"},"1000000000000":{"one":"0 Bn","other":"0 Bn"},"10000000000000":{"one":"00 Bn","other":"00 Bn"},"100000000000000":{"one":"000 Bn","other":"000 Bn"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"fr-CA":{"fr-CA":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 millier","other":"0 mille"},"10000":{"one":"00 millier","other":"00 mille"},"100000":{"one":"000 millier","other":"000 mille"},"1000000":{"one":"0 million","other":"0 millions"},"10000000":{"one":"00 million","other":"00 millions"},"100000000":{"one":"000 million","other":"000 millions"},"1000000000":{"one":"0 milliard","other":"0 milliards"},"10000000000":{"one":"00 milliard","other":"00 milliards"},"100000000000":{"one":"000 milliards","other":"000 milliards"},"1000000000000":{"one":"0 billion","other":"0 billions"},"10000000000000":{"one":"00 billions","other":"00 billions"},"100000000000000":{"one":"000 billions","other":"000 billions"}},"short":{"1000":{"one":"0 k","other":"0 k"},"10000":{"one":"00 k","other":"00 k"},"100000":{"one":"000 k","other":"000 k"},"1000000":{"one":"0 M","other":"0 M"},"10000000":{"one":"00 M","other":"00 M"},"100000000":{"one":"000 M","other":"000 M"},"1000000000":{"one":"0 G","other":"0 G"},"10000000000":{"one":"00 G","other":"00 G"},"100000000000":{"one":"000 G","other":"000 G"},"1000000000000":{"one":"0 T","other":"0 T"},"10000000000000":{"one":"00 T","other":"00 T"},"100000000000000":{"one":"000 T","other":"000 T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"fr-CH":{"fr-CH":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤ #,##0.00;¤-#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 millier","other":"0 mille"},"10000":{"one":"00 millier","other":"00 mille"},"100000":{"one":"000 millier","other":"000 mille"},"1000000":{"one":"0 million","other":"0 millions"},"10000000":{"one":"00 million","other":"00 millions"},"100000000":{"one":"000 million","other":"000 millions"},"1000000000":{"one":"0 milliard","other":"0 milliards"},"10000000000":{"one":"00 milliard","other":"00 milliards"},"100000000000":{"one":"000 milliards","other":"000 milliards"},"1000000000000":{"one":"0 billion","other":"0 billions"},"10000000000000":{"one":"00 billions","other":"00 billions"},"100000000000000":{"one":"000 billions","other":"000 billions"}},"short":{"1000":{"one":"0 k","other":"0 k"},"10000":{"one":"00 k","other":"00 k"},"100000":{"one":"000 k","other":"000 k"},"1000000":{"one":"0 M","other":"0 M"},"10000000":{"one":"00 M","other":"00 M"},"100000000":{"one":"000 M","other":"000 M"},"1000000000":{"one":"0 Md","other":"0 Md"},"10000000000":{"one":"00 Md","other":"00 Md"},"100000000000":{"one":"000 Md","other":"000 Md"},"1000000000000":{"one":"0 Bn","other":"0 Bn"},"10000000000000":{"one":"00 Bn","other":"00 Bn"},"100000000000000":{"one":"000 Bn","other":"000 Bn"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ga":{"ga":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"few":"{0} {1}","many":"{0} {1}","one":"{0} {1}","other":"{0} {1}","two":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 mhíle","many":"0 míle","one":"0 mhíle","other":"0 míle","two":"0 mhíle"},"10000":{"few":"00 míle","many":"00 míle","one":"00 míle","other":"00 míle","two":"00 míle"},"100000":{"few":"000 míle","many":"000 míle","one":"000 míle","other":"000 míle","two":"000 míle"},"1000000":{"few":"0 mhilliún","many":"0 milliún","one":"0 mhilliún","other":"0 milliún","two":"0 mhilliún"},"10000000":{"few":"00 milliún","many":"00 milliún","one":"00 milliún","other":"00 milliún","two":"00 milliún"},"100000000":{"few":"000 milliún","many":"000 milliún","one":"000 milliún","other":"000 milliún","two":"000 milliún"},"1000000000":{"few":"0 bhilliún","many":"0 mbilliún","one":"0 bhilliún","other":"0 billiún","two":"0 bhilliún"},"10000000000":{"few":"00 billiún","many":"00 mbilliún","one":"00 billiún","other":"00 billiún","two":"00 billiún"},"100000000000":{"few":"000 billiún","many":"000 billiún","one":"000 billiún","other":"000 billiún","two":"000 billiún"},"1000000000000":{"few":"0 thrilliún","many":"0 dtrilliún","one":"0 trilliún","other":"0 trilliún","two":"0 thrilliún"},"10000000000000":{"few":"00 trilliún","many":"00 dtrilliún","one":"00 trilliún","other":"00 trilliún","two":"00 trilliún"},"100000000000000":{"few":"000 trilliún","many":"000 trilliún","one":"000 trilliún","other":"000 trilliún","two":"000 trilliún"}},"short":{"1000":{"few":"0k","many":"0k","one":"0k","other":"0k","two":"0k"},"10000":{"few":"00k","many":"00k","one":"00k","other":"00k","two":"00k"},"100000":{"few":"000k","many":"000k","one":"000k","other":"000k","two":"000k"},"1000000":{"few":"0M","many":"0M","one":"0M","other":"0M","two":"0M"},"10000000":{"few":"00M","many":"00M","one":"00M","other":"00M","two":"00M"},"100000000":{"few":"000M","many":"000M","one":"000M","other":"000M","two":"000M"},"1000000000":{"few":"0B","many":"0B","one":"0B","other":"0B","two":"0B"},"10000000000":{"few":"00B","many":"00B","one":"00B","other":"00B","two":"00B"},"100000000000":{"few":"000B","many":"000B","one":"000B","other":"000B","two":"000B"},"1000000000000":{"few":"0T","many":"0T","one":"0T","other":"0T","two":"0T"},"10000000000000":{"few":"00T","many":"00T","one":"00T","other":"00T","two":"00T"},"100000000000000":{"few":"000T","many":"000T","one":"000T","other":"000T","two":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"gl":{"gl":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 mil","other":"0 mil"},"10000":{"one":"00 mil","other":"00 mil"},"100000":{"one":"000 mil","other":"000 mil"},"1000000":{"one":"0 millón","other":"0 millóns"},"10000000":{"one":"00 millóns","other":"00 millóns"},"100000000":{"one":"000 millóns","other":"000 millóns"},"1000000000":{"one":"0 mil millóns","other":"0 mil millóns"},"10000000000":{"one":"00 mil millóns","other":"00 mil millóns"},"100000000000":{"one":"000 mil millóns","other":"000 mil millóns"},"1000000000000":{"one":"0 billóns","other":"0 billóns"},"10000000000000":{"one":"00 billóns","other":"00 billóns"},"100000000000000":{"one":"000 billóns","other":"000 billóns"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0M","other":"0M"},"10000000":{"one":"00M","other":"00M"},"100000000":{"one":"000M","other":"000M"},"1000000000":{"one":"0k M","other":"0k M"},"10000000000":{"one":"00k M","other":"00k M"},"100000000000":{"one":"000k M","other":"000k M"},"1000000000000":{"one":"0 B","other":"0 B"},"10000000000000":{"one":"00 B","other":"00 B"},"100000000000000":{"one":"000 B","other":"000 B"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"he":{"he":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"many":"{0} {1}","one":"{0} {1}","other":"{0} {1}","two":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"many":"‏0 אלף","one":"‏0 אלף","other":"‏0 אלף","two":"‏0 אלף"},"10000":{"many":"‏00 אלף","one":"‏00 אלף","other":"‏00 אלף","two":"‏00 אלף"},"100000":{"many":"‏000 אלף","one":"‏000 אלף","other":"‏000 אלף","two":"‏000 אלף"},"1000000":{"many":"‏0 מיליון","one":"‏0 מיליון","other":"‏0 מיליון","two":"‏0 מיליון"},"10000000":{"many":"‏00 מיליון","one":"‏00 מיליון","other":"‏00 מיליון","two":"‏00 מיליון"},"100000000":{"many":"‏000 מיליון","one":"‏000 מיליון","other":"‏000 מיליון","two":"‏000 מיליון"},"1000000000":{"many":"‏0 מיליארד","one":"‏0 מיליארד","other":"‏0 מיליארד","two":"‏0 מיליארד"},"10000000000":{"many":"‏00 מיליארד","one":"‏00 מיליארד","other":"‏00 מיליארד","two":"‏00 מיליארד"},"100000000000":{"many":"‏000 מיליארד","one":"‏000 מיליארד","other":"‏000 מיליארד","two":"‏000 מיליארד"},"1000000000000":{"many":"‏0 טריליון","one":"‏0 טריליון","other":"‏0 טריליון","two":"‏0 טריליון"},"10000000000000":{"many":"‏00 טריליון","one":"‏00 טריליון","other":"‏00 טריליון","two":"‏00 טריליון"},"100000000000000":{"many":"‏000 טריליון","one":"‏000 טריליון","other":"‏000 טריליון","two":"‏000 טריליון"}},"short":{"1000":{"many":"‏0 אלף","one":"‏0 אלף","other":"‏0 אלף","two":"‏0 אלף"},"10000":{"many":"‏00 אלף","one":"‏00 אלף","other":"‏00 אלף","two":"‏00 אלף"},"100000":{"many":"‏000 אלף","one":"‏000 אלף","other":"‏000 אלף","two":"‏000 אלף"},"1000000":{"many":"‏0 מיל׳","one":"‏0 מיל׳","other":"‏0 מיל׳","two":"‏0 מיל׳"},"10000000":{"many":"‏00 מיל׳","one":"‏00 מיל׳","other":"‏00 מיל׳","two":"‏00 מיל׳"},"100000000":{"many":"‏000 מיל׳","one":"‏000 מיל׳","other":"‏000 מיל׳","two":"‏000 מיל׳"},"1000000000":{"many":"‏0 מלרד","one":"‏0 מלרד","other":"‏0 מלרד","two":"‏0 מלרד"},"10000000000":{"many":"‏00 מלרד","one":"‏00 מלרד","other":"‏00 מלרד","two":"‏00 מלרד"},"100000000000":{"many":"‏000 מלרד","one":"‏000 מלרד","other":"‏000 מלרד","two":"‏000 מלרד"},"1000000000000":{"many":"‏0 ביל׳","one":"‏0 ביל׳","other":"‏0 ביל׳","two":"‏0 ביל׳"},"10000000000000":{"many":"‏00 ביל׳","one":"‏00 ביל׳","other":"‏00 ביל׳","two":"‏00 ביל׳"},"100000000000000":{"many":"‏000 ביל׳","one":"‏000 ביל׳","other":"‏000 ביל׳","two":"‏000 ביל׳"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"‎-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"‎+","superscripting_exponent":"×","time_separator":":"}}}},"hi":{"hi":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##,##0.###","long":{"1000":{"one":"0 हज़ार","other":"0 हज़ार"},"10000":{"one":"00 हज़ार","other":"00 हज़ार"},"100000":{"one":"0 लाख","other":"0 लाख"},"1000000":{"one":"00 लाख","other":"00 लाख"},"10000000":{"one":"0 करोड़","other":"0 करोड़"},"100000000":{"one":"00 करोड़","other":"00 करोड़"},"1000000000":{"one":"0 अरब","other":"0 अरब"},"10000000000":{"one":"00 अरब","other":"00 अरब"},"100000000000":{"one":"0 खरब","other":"0 खरब"},"1000000000000":{"one":"00 खरब","other":"00 खरब"},"10000000000000":{"one":"000 खरब","other":"000 खरब"},"100000000000000":{"one":"0000 खरब","other":"0000 खरब"}},"short":{"1000":{"one":"0 हज़ार","other":"0 हज़ार"},"10000":{"one":"00 हज़ार","other":"00 हज़ार"},"100000":{"one":"0 लाख","other":"0 लाख"},"1000000":{"one":"00 लाख","other":"00 लाख"},"10000000":{"one":"0 क'.'","other":"0 क'.'"},"100000000":{"one":"00 क'.'","other":"00 क'.'"},"1000000000":{"one":"0 अ'.'","other":"0 अ'.'"},"10000000000":{"one":"00 अ'.'","other":"00 अ'.'"},"100000000000":{"one":"0 ख'.'","other":"0 ख'.'"},"1000000000000":{"one":"00 ख'.'","other":"00 ख'.'"},"10000000000000":{"one":"0 नील","other":"0 नील"},"100000000000000":{"one":"00 नील","other":"00 नील"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"[#E0]"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"hr":{"hr":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"few":"{0} {1}","one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 tisuće","one":"0 tisuća","other":"0 tisuća"},"10000":{"few":"00 tisuće","one":"00 tisuća","other":"00 tisuća"},"100000":{"few":"000 tisuće","one":"000 tisuća","other":"000 tisuća"},"1000000":{"few":"0 milijuna","one":"0 milijun","other":"0 milijuna"},"10000000":{"few":"00 milijuna","one":"00 milijun","other":"00 milijuna"},"100000000":{"few":"000 milijuna","one":"000 milijun","other":"000 milijuna"},"1000000000":{"few":"0 milijarde","one":"0 milijarda","other":"0 milijardi"},"10000000000":{"few":"00 milijarde","one":"00 milijarda","other":"00 milijardi"},"100000000000":{"few":"000 milijarde","one":"000 milijarda","other":"000 milijardi"},"1000000000000":{"few":"0 bilijuna","one":"0 bilijun","other":"0 bilijuna"},"10000000000000":{"few":"00 bilijuna","one":"00 bilijun","other":"00 bilijuna"},"100000000000000":{"few":"000 bilijuna","one":"000 bilijun","other":"000 bilijuna"}},"short":{"1000":{"few":"0 tis'.'","one":"0 tis'.'","other":"0 tis'.'"},"10000":{"few":"00 tis'.'","one":"00 tis'.'","other":"00 tis'.'"},"100000":{"few":"000 tis'.'","one":"000 tis'.'","other":"000 tis'.'"},"1000000":{"few":"0 mil'.'","one":"0 mil'.'","other":"0 mil'.'"},"10000000":{"few":"00 mil'.'","one":"00 mil'.'","other":"00 mil'.'"},"100000000":{"few":"000 mil'.'","one":"000 mil'.'","other":"000 mil'.'"},"1000000000":{"few":"0 mlr'.'","one":"0 mlr'.'","other":"0 mlr'.'"},"10000000000":{"few":"00 mlr'.'","one":"00 mlr'.'","other":"00 mlr'.'"},"100000000000":{"few":"000 mlr'.'","one":"000 mlr'.'","other":"000 mlr'.'"},"1000000000000":{"few":"0 bil'.'","one":"0 bil'.'","other":"0 bil'.'"},"10000000000000":{"few":"00 bil'.'","one":"00 bil'.'","other":"00 bil'.'"},"100000000000000":{"few":"000 bil'.'","one":"000 bil'.'","other":"000 bil'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"hu":{"hu":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 ezer","other":"0 ezer"},"10000":{"one":"00 ezer","other":"00 ezer"},"100000":{"one":"000 ezer","other":"000 ezer"},"1000000":{"one":"0 millió","other":"0 millió"},"10000000":{"one":"00 millió","other":"00 millió"},"100000000":{"one":"000 millió","other":"000 millió"},"1000000000":{"one":"0 milliárd","other":"0 milliárd"},"10000000000":{"one":"00 milliárd","other":"00 milliárd"},"100000000000":{"one":"000 milliárd","other":"000 milliárd"},"1000000000000":{"one":"0 billió","other":"0 billió"},"10000000000000":{"one":"00 billió","other":"00 billió"},"100000000000000":{"one":"000 billió","other":"000 billió"}},"short":{"1000":{"one":"0 E","other":"0 E"},"10000":{"one":"00 E","other":"00 E"},"100000":{"one":"000 E","other":"000 E"},"1000000":{"one":"0 M","other":"0 M"},"10000000":{"one":"00 M","other":"00 M"},"100000000":{"one":"000 M","other":"000 M"},"1000000000":{"one":"0 Mrd","other":"0 Mrd"},"10000000000":{"one":"00 Mrd","other":"00 Mrd"},"100000000000":{"one":"000 Mrd","other":"000 Mrd"},"1000000000000":{"one":"0 B","other":"0 B"},"10000000000000":{"one":"00 B","other":"00 B"},"100000000000000":{"one":"000 B","other":"000 B"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"id":{"id":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"other":"0 ribu"},"10000":{"other":"00 ribu"},"100000":{"other":"000 ribu"},"1000000":{"other":"0 juta"},"10000000":{"other":"00 juta"},"100000000":{"other":"000 juta"},"1000000000":{"other":"0 miliar"},"10000000000":{"other":"00 miliar"},"100000000000":{"other":"000 miliar"},"1000000000000":{"other":"0 triliun"},"10000000000000":{"other":"00 triliun"},"100000000000000":{"other":"000 triliun"}},"short":{"1000":{"other":0},"10000":{"other":"00 rb"},"100000":{"other":"000 rb"},"1000000":{"other":"0 jt"},"10000000":{"other":"00 jt"},"100000000":{"other":"000 jt"},"1000000000":{"other":"0 M"},"10000000000":{"other":"00 M"},"100000000000":{"other":"000 M"},"1000000000000":{"other":"0 T"},"10000000000000":{"other":"00 T"},"100000000000000":{"other":"000 T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":"."}}}},"is":{"is":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 þúsund","other":"0 þúsund"},"10000":{"one":"00 þúsund","other":"00 þúsund"},"100000":{"one":"000 þúsund","other":"000 þúsund"},"1000000":{"one":"0 milljón","other":"0 milljónir"},"10000000":{"one":"00 milljón","other":"00 milljónir"},"100000000":{"one":"000 milljón","other":"000 milljónir"},"1000000000":{"one":"0 milljarður","other":"0 milljarðar"},"10000000000":{"one":"00 milljarður","other":"00 milljarðar"},"100000000000":{"one":"000 milljarður","other":"000 milljarðar"},"1000000000000":{"one":"0 billjón","other":"0 billjónir"},"10000000000000":{"one":"00 billjón","other":"00 billjónir"},"100000000000000":{"one":"000 billjón","other":"000 billjónir"}},"short":{"1000":{"one":"0 þ'.'","other":"0 þ'.'"},"10000":{"one":"00 þ'.'","other":"00 þ'.'"},"100000":{"one":"000 þ'.'","other":"000 þ'.'"},"1000000":{"one":"0 m'.'","other":"0 m'.'"},"10000000":{"one":"00 m'.'","other":"00 m'.'"},"100000000":{"one":"000 m'.'","other":"000 m'.'"},"1000000000":{"one":"0 ma'.'","other":"0 ma'.'"},"10000000000":{"one":"00 ma'.'","other":"00 ma'.'"},"100000000000":{"one":"000 ma'.'","other":"000 ma'.'"},"1000000000000":{"one":"0 bn","other":"0 bn"},"10000000000000":{"one":"00 bn","other":"00 bn"},"100000000000000":{"one":"000 bn","other":"000 bn"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"it":{"it":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 migliaio","other":"0 migliaia"},"10000":{"one":"00 migliaia","other":"00 migliaia"},"100000":{"one":"000 migliaia","other":"000 migliaia"},"1000000":{"one":"0 milione","other":"0 milioni"},"10000000":{"one":"00 milioni","other":"00 milioni"},"100000000":{"one":"000 milioni","other":"000 milioni"},"1000000000":{"one":"0 miliardo","other":"0 miliardi"},"10000000000":{"one":"00 miliardi","other":"00 miliardi"},"100000000000":{"one":"000 miliardi","other":"000 miliardi"},"1000000000000":{"one":"0 migliaio di miliardi","other":"0 migliaia di miliardi"},"10000000000000":{"one":"00 migliaia di miliardi","other":"00 migliaia di miliardi"},"100000000000000":{"one":"000 migliaia di miliardi","other":"000 migliaia di miliardi"}},"short":{"1000":{"one":0,"other":0},"10000":{"one":0,"other":0},"100000":{"one":0,"other":0},"1000000":{"one":"0 Mln","other":"0 Mln"},"10000000":{"one":"00 Mln","other":"00 Mln"},"100000000":{"one":"000 Mln","other":"000 Mln"},"1000000000":{"one":"0 Mld","other":"0 Mld"},"10000000000":{"one":"00 Mld","other":"00 Mld"},"100000000000":{"one":"000 Mld","other":"000 Mld"},"1000000000000":{"one":"0 Bln","other":"0 Bln"},"10000000000000":{"one":"00 Bln","other":"00 Bln"},"100000000000000":{"one":"000 Bln","other":"000 Bln"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"it-CH":{"it-CH":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤ #,##0.00;¤-#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 migliaio","other":"0 migliaia"},"10000":{"one":"00 migliaia","other":"00 migliaia"},"100000":{"one":"000 migliaia","other":"000 migliaia"},"1000000":{"one":"0 milione","other":"0 milioni"},"10000000":{"one":"00 milioni","other":"00 milioni"},"100000000":{"one":"000 milioni","other":"000 milioni"},"1000000000":{"one":"0 miliardo","other":"0 miliardi"},"10000000000":{"one":"00 miliardi","other":"00 miliardi"},"100000000000":{"one":"000 miliardi","other":"000 miliardi"},"1000000000000":{"one":"0 migliaio di miliardi","other":"0 migliaia di miliardi"},"10000000000000":{"one":"00 migliaia di miliardi","other":"00 migliaia di miliardi"},"100000000000000":{"one":"000 migliaia di miliardi","other":"000 migliaia di miliardi"}},"short":{"1000":{"one":0,"other":0},"10000":{"one":0,"other":0},"100000":{"one":0,"other":0},"1000000":{"one":"0 Mln","other":"0 Mln"},"10000000":{"one":"00 Mln","other":"00 Mln"},"100000000":{"one":"000 Mln","other":"000 Mln"},"1000000000":{"one":"0 Mld","other":"0 Mld"},"10000000000":{"one":"00 Mld","other":"00 Mld"},"100000000000":{"one":"000 Mld","other":"000 Mld"},"1000000000000":{"one":"0 Bln","other":"0 Bln"},"10000000000000":{"one":"00 Bln","other":"00 Bln"},"100000000000000":{"one":"000 Bln","other":"000 Bln"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":"'","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ja":{"ja":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"other":"0千"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0億"},"1000000000":{"other":"00億"},"10000000000":{"other":"000億"},"100000000000":{"other":"0000億"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}},"short":{"1000":{"other":"0千"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0億"},"1000000000":{"other":"00億"},"10000000000":{"other":"000億"},"100000000000":{"other":"0000億"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ko":{"ko":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"other":"0000"},"10000":{"other":"0만"},"100000":{"other":"00만"},"1000000":{"other":"000만"},"10000000":{"other":"0000만"},"100000000":{"other":"0억"},"1000000000":{"other":"00억"},"10000000000":{"other":"000억"},"100000000000":{"other":"0000억"},"1000000000000":{"other":"0조"},"10000000000000":{"other":"00조"},"100000000000000":{"other":"000조"}},"short":{"1000":{"other":"0000"},"10000":{"other":"0만"},"100000":{"other":"00만"},"1000000":{"other":"000만"},"10000000":{"other":"0000만"},"100000000":{"other":"0억"},"1000000000":{"other":"00억"},"10000000000":{"other":"000억"},"100000000000":{"other":"0000억"},"1000000000000":{"other":"0조"},"10000000000000":{"other":"00조"},"100000000000000":{"other":"000조"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"lv":{"lv":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}","zero":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 tūkstotis","other":"0 tūkstoši","zero":"0 tūkstoši"},"10000":{"one":"00 tūkstotis","other":"00 tūkstoši","zero":"00 tūkstoši"},"100000":{"one":"000 tūkstotis","other":"000 tūkstoši","zero":"000 tūkstoši"},"1000000":{"one":"0 miljons","other":"0 miljoni","zero":"0 miljoni"},"10000000":{"one":"00 miljons","other":"00 miljoni","zero":"00 miljoni"},"100000000":{"one":"000 miljons","other":"000 miljoni","zero":"000 miljoni"},"1000000000":{"one":"0 miljards","other":"0 miljardi","zero":"0 miljardi"},"10000000000":{"one":"00 miljards","other":"00 miljardi","zero":"00 miljardi"},"100000000000":{"one":"000 miljards","other":"000 miljardi","zero":"000 miljardi"},"1000000000000":{"one":"0 triljons","other":"0 triljoni","zero":"0 triljoni"},"10000000000000":{"one":"00 triljons","other":"00 triljoni","zero":"00 triljoni"},"100000000000000":{"one":"000 triljons","other":"000 triljoni","zero":"000 triljoni"}},"short":{"1000":{"one":"0 tūkst'.'","other":"0 tūkst'.'","zero":"0 tūkst'.'"},"10000":{"one":"00 tūkst'.'","other":"00 tūkst'.'","zero":"00 tūkst'.'"},"100000":{"one":"000 tūkst'.'","other":"000 tūkst'.'","zero":"000 tūkst'.'"},"1000000":{"one":"0 milj'.'","other":"0 milj'.'","zero":"0 milj'.'"},"10000000":{"one":"00 milj'.'","other":"00 milj'.'","zero":"00 milj'.'"},"100000000":{"one":"000 milj'.'","other":"000 milj'.'","zero":"000 milj'.'"},"1000000000":{"one":"0 mljrd'.'","other":"0 mljrd'.'","zero":"0 mljrd'.'"},"10000000000":{"one":"00 mljrd'.'","other":"00 mljrd'.'","zero":"00 mljrd'.'"},"100000000000":{"one":"000 mljrd'.'","other":"000 mljrd'.'","zero":"000 mljrd'.'"},"1000000000000":{"one":"0 trilj'.'","other":"0 trilj'.'","zero":"0 trilj'.'"},"10000000000000":{"one":"00 trilj'.'","other":"00 trilj'.'","zero":"00 trilj'.'"},"100000000000000":{"one":"000 trilj'.'","other":"000 trilj'.'","zero":"000 trilj'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"nav skaitlis","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ms":{"ms":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"other":"0 ribu"},"10000":{"other":"00 ribu"},"100000":{"other":"000 ribu"},"1000000":{"other":"0 juta"},"10000000":{"other":"00 juta"},"100000000":{"other":"000 juta"},"1000000000":{"other":"0 bilion"},"10000000000":{"other":"00 bilion"},"100000000000":{"other":"000 bilion"},"1000000000000":{"other":"0 trilion"},"10000000000000":{"other":"00 trilion"},"100000000000000":{"other":"000 trilion"}},"short":{"1000":{"other":"0K"},"10000":{"other":"00K"},"100000":{"other":"000K"},"1000000":{"other":"0J"},"10000000":{"other":"00J"},"100000000":{"other":"000J"},"1000000000":{"other":"0B"},"10000000000":{"other":"00B"},"100000000000":{"other":"000B"},"1000000000000":{"other":"0T"},"10000000000000":{"other":"00T"},"100000000000000":{"other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"nb":{"nb":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤ #,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 tusen","other":"0 tusen"},"10000":{"one":"00 tusen","other":"00 tusen"},"100000":{"one":"000 tusen","other":"000 tusen"},"1000000":{"one":"0 million","other":"0 millioner"},"10000000":{"one":"00 million","other":"00 millioner"},"100000000":{"one":"000 million","other":"000 millioner"},"1000000000":{"one":"0 milliard","other":"0 milliarder"},"10000000000":{"one":"00 milliard","other":"00 milliarder"},"100000000000":{"one":"000 milliard","other":"000 milliarder"},"1000000000000":{"one":"0 billion","other":"0 billioner"},"10000000000000":{"one":"00 billioner","other":"00 billioner"},"100000000000000":{"one":"000 billioner","other":"000 billioner"}},"short":{"1000":{"one":"0 K","other":"0 K"},"10000":{"one":"00 K","other":"00 K"},"100000":{"one":"000 K","other":"000 K"},"1000000":{"one":"0 mill","other":"0 mill"},"10000000":{"one":"00 mill","other":"00 mill"},"100000000":{"one":"000 mill","other":"000 mill"},"1000000000":{"one":"0 mrd","other":"0 mrd"},"10000000000":{"one":"00 mrd","other":"00 mrd"},"100000000000":{"one":"000 mrd","other":"000 mrd"},"1000000000000":{"one":"0 bill","other":"0 bill"},"10000000000000":{"one":"00 bill","other":"00 bill"},"100000000000000":{"one":"000 bill","other":"000 bill"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"−","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":"."}}}},"nl":{"nl":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤ #,##0.00;¤ #,##0.00-"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 duizend","other":"0 duizend"},"10000":{"one":"00 duizend","other":"00 duizend"},"100000":{"one":"000 duizend","other":"000 duizend"},"1000000":{"one":"0 miljoen","other":"0 miljoen"},"10000000":{"one":"00 miljoen","other":"00 miljoen"},"100000000":{"one":"000 miljoen","other":"000 miljoen"},"1000000000":{"one":"0 miljard","other":"0 miljard"},"10000000000":{"one":"00 miljard","other":"00 miljard"},"100000000000":{"one":"000 miljard","other":"000 miljard"},"1000000000000":{"one":"0 biljoen","other":"0 biljoen"},"10000000000000":{"one":"00 biljoen","other":"00 biljoen"},"100000000000000":{"one":"000 biljoen","other":"000 biljoen"}},"short":{"1000":{"one":"0K","other":"0K"},"10000":{"one":"00K","other":"00K"},"100000":{"one":"000K","other":"000K"},"1000000":{"one":"0 mln'.'","other":"0 mln'.'"},"10000000":{"one":"00 mln'.'","other":"00 mln'.'"},"100000000":{"one":"000 mln'.'","other":"000 mln'.'"},"1000000000":{"one":"0 mld'.'","other":"0 mld'.'"},"10000000000":{"one":"00 mld'.'","other":"00 mld'.'"},"100000000000":{"one":"000 mld'.'","other":"000 mld'.'"},"1000000000000":{"one":"0 bln'.'","other":"0 bln'.'"},"10000000000000":{"one":"00 bln'.'","other":"00 bln'.'"},"100000000000000":{"one":"000 bln'.'","other":"000 bln'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"pl":{"pl":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"few":"{0} {1}","many":"{0} {1}","one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 tysiące","many":"0 tysięcy","one":"0 tysiąc","other":"0 tysiąca"},"10000":{"few":"00 tysiące","many":"00 tysięcy","one":"00 tysiąc","other":"00 tysiąca"},"100000":{"few":"000 tysiące","many":"000 tysięcy","one":"000 tysiąc","other":"000 tysiąca"},"1000000":{"few":"0 miliony","many":"0 milionów","one":"0 milion","other":"0 miliona"},"10000000":{"few":"00 miliony","many":"00 milionów","one":"00 milion","other":"00 miliona"},"100000000":{"few":"000 miliony","many":"000 milionów","one":"000 milion","other":"000 miliona"},"1000000000":{"few":"0 miliardy","many":"0 miliardów","one":"0 miliard","other":"0 miliarda"},"10000000000":{"few":"00 miliardy","many":"00 miliardów","one":"00 miliard","other":"00 miliarda"},"100000000000":{"few":"000 miliardy","many":"000 miliardów","one":"000 miliard","other":"000 miliarda"},"1000000000000":{"few":"0 biliony","many":"0 bilionów","one":"0 bilion","other":"0 biliona"},"10000000000000":{"few":"00 biliony","many":"00 bilionów","one":"00 bilion","other":"00 biliona"},"100000000000000":{"few":"000 biliony","many":"000 bilionów","one":"000 bilion","other":"000 biliona"}},"short":{"1000":{"few":"0 tys'.'","many":"0 tys'.'","one":"0 tys'.'","other":"0 tys'.'"},"10000":{"few":"00 tys'.'","many":"00 tys'.'","one":"00 tys'.'","other":"00 tys'.'"},"100000":{"few":"000 tys'.'","many":"000 tys'.'","one":"000 tys'.'","other":"000 tys'.'"},"1000000":{"few":"0 mln","many":"0 mln","one":"0 mln","other":"0 mln"},"10000000":{"few":"00 mln","many":"00 mln","one":"00 mln","other":"00 mln"},"100000000":{"few":"000 mln","many":"000 mln","one":"000 mln","other":"000 mln"},"1000000000":{"few":"0 mld","many":"0 mld","one":"0 mld","other":"0 mld"},"10000000000":{"few":"00 mld","many":"00 mld","one":"00 mld","other":"00 mld"},"100000000000":{"few":"000 mld","many":"000 mld","one":"000 mld","other":"000 mld"},"1000000000000":{"few":"0 bln","many":"0 bln","one":"0 bln","other":"0 bln"},"10000000000000":{"few":"00 bln","many":"00 bln","one":"00 bln","other":"00 bln"},"100000000000000":{"few":"000 bln","many":"000 bln","one":"000 bln","other":"000 bln"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"pt":{"pt":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 mil","other":"0 mil"},"10000":{"one":"00 mil","other":"00 mil"},"100000":{"one":"000 mil","other":"000 mil"},"1000000":{"one":"0 milhão","other":"0 milhões"},"10000000":{"one":"00 milhão","other":"00 milhões"},"100000000":{"one":"000 milhão","other":"000 milhões"},"1000000000":{"one":"0 bilhão","other":"0 bilhões"},"10000000000":{"one":"00 bilhão","other":"00 bilhões"},"100000000000":{"one":"000 bilhão","other":"000 bilhões"},"1000000000000":{"one":"0 trilhão","other":"0 trilhões"},"10000000000000":{"one":"00 trilhão","other":"00 trilhões"},"100000000000000":{"one":"000 trilhão","other":"000 trilhões"}},"short":{"1000":{"one":"0 mil","other":"0 mil"},"10000":{"one":"00 mil","other":"00 mil"},"100000":{"one":"000 mil","other":"000 mil"},"1000000":{"one":"0 mi","other":"0 mi"},"10000000":{"one":"00 mi","other":"00 mi"},"100000000":{"one":"000 mi","other":"000 mi"},"1000000000":{"one":"0 bi","other":"0 bi"},"10000000000":{"one":"00 bi","other":"00 bi"},"100000000000":{"one":"000 bi","other":"000 bi"},"1000000000000":{"one":"0 tri","other":"0 tri"},"10000000000000":{"one":"00 tri","other":"00 tri"},"100000000000000":{"one":"000 tri","other":"000 tri"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ro":{"ro":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"few":"{0} {1}","one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 mii","one":"0 mie","other":"0 de mii"},"10000":{"few":"00 mii","one":"00 mie","other":"00 de mii"},"100000":{"few":"000 mii","one":"000 mie","other":"000 de mii"},"1000000":{"few":"0 milioane","one":"0 milion","other":"0 de milioane"},"10000000":{"few":"00 milioane","one":"00 milion","other":"00 de milioane"},"100000000":{"few":"000 milioane","one":"000 milion","other":"000 de milioane"},"1000000000":{"few":"0 miliarde","one":"0 miliard","other":"0 de miliarde"},"10000000000":{"few":"00 miliarde","one":"00 miliard","other":"00 de miliarde"},"100000000000":{"few":"000 miliarde","one":"000 miliard","other":"000 de miliarde"},"1000000000000":{"few":"0 trilioane","one":"0 trilion","other":"0 de trilioane"},"10000000000000":{"few":"00 trilioane","one":"00 trilion","other":"00 de trilioane"},"100000000000000":{"few":"000 trilioane","one":"000 trilion","other":"000 de trilioane"}},"short":{"1000":{"few":"0 K","one":"0 K","other":"0 K"},"10000":{"few":"00 K","one":"00 K","other":"00 K"},"100000":{"few":"000 K","one":"000 K","other":"000 K"},"1000000":{"few":"0 mil'.'","one":"0 mil'.'","other":"0 mil'.'"},"10000000":{"few":"00 mil'.'","one":"00 mil'.'","other":"00 mil'.'"},"100000000":{"few":"000 mil'.'","one":"000 mil'.'","other":"000 mil'.'"},"1000000000":{"few":"0 mld'.'","one":"0 mld'.'","other":"0 mld'.'"},"10000000000":{"few":"00 mld'.'","one":"00 mld'.'","other":"00 mld'.'"},"100000000000":{"few":"000 mld'.'","one":"000 mld'.'","other":"000 mld'.'"},"1000000000000":{"few":"0 tril'.'","one":"0 tril'.'","other":"0 tril'.'"},"10000000000000":{"few":"00 tril'.'","one":"00 tril'.'","other":"00 tril'.'"},"100000000000000":{"few":"000 tril'.'","one":"000 tril'.'","other":"000 tril'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ru":{"ru":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"few":"{0} {1}","many":"{0} {1}","one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 тысячи","many":"0 тысяч","one":"0 тысяча","other":"0 тысячи"},"10000":{"few":"00 тысячи","many":"00 тысяч","one":"00 тысяча","other":"00 тысячи"},"100000":{"few":"000 тысячи","many":"000 тысяч","one":"000 тысяча","other":"000 тысячи"},"1000000":{"few":"0 миллиона","many":"0 миллионов","one":"0 миллион","other":"0 миллиона"},"10000000":{"few":"00 миллиона","many":"00 миллионов","one":"00 миллион","other":"00 миллиона"},"100000000":{"few":"000 миллиона","many":"000 миллионов","one":"000 миллион","other":"000 миллиона"},"1000000000":{"few":"0 миллиарда","many":"0 миллиардов","one":"0 миллиард","other":"0 миллиарда"},"10000000000":{"few":"00 миллиарда","many":"00 миллиардов","one":"00 миллиард","other":"00 миллиарда"},"100000000000":{"few":"000 миллиарда","many":"000 миллиардов","one":"000 миллиард","other":"000 миллиарда"},"1000000000000":{"few":"0 триллиона","many":"0 триллионов","one":"0 триллион","other":"0 триллиона"},"10000000000000":{"few":"00 триллиона","many":"00 триллионов","one":"00 триллион","other":"00 триллиона"},"100000000000000":{"few":"000 триллиона","many":"000 триллионов","one":"000 триллион","other":"000 триллиона"}},"short":{"1000":{"few":"0 тыс'.'","many":"0 тыс'.'","one":"0 тыс'.'","other":"0 тыс'.'"},"10000":{"few":"00 тыс'.'","many":"00 тыс'.'","one":"00 тыс'.'","other":"00 тыс'.'"},"100000":{"few":"000 тыс'.'","many":"000 тыс'.'","one":"000 тыс'.'","other":"000 тыс'.'"},"1000000":{"few":"0 млн","many":"0 млн","one":"0 млн","other":"0 млн"},"10000000":{"few":"00 млн","many":"00 млн","one":"00 млн","other":"00 млн"},"100000000":{"few":"000 млн","many":"000 млн","one":"000 млн","other":"000 млн"},"1000000000":{"few":"0 млрд","many":"0 млрд","one":"0 млрд","other":"0 млрд"},"10000000000":{"few":"00 млрд","many":"00 млрд","one":"00 млрд","other":"00 млрд"},"100000000000":{"few":"000 млрд","many":"000 млрд","one":"000 млрд","other":"000 млрд"},"1000000000000":{"few":"0 трлн","many":"0 трлн","one":"0 трлн","other":"0 трлн"},"10000000000000":{"few":"00 трлн","many":"00 трлн","one":"00 трлн","other":"00 трлн"},"100000000000000":{"few":"000 трлн","many":"000 трлн","one":"000 трлн","other":"000 трлн"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"не число","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"sk":{"sk":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"few":"{0} {1}","many":"{0} {1}","one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 tisíc","many":"0 tisíc","one":"0 tisíc","other":"0 tisíc"},"10000":{"few":"00 tisíc","many":"00 tisíc","one":"00 tisíc","other":"00 tisíc"},"100000":{"few":"000 tisíc","many":"000 tisíc","one":"000 tisíc","other":"000 tisíc"},"1000000":{"few":"0 milióny","many":"0 miliónov","one":"0 milión","other":"0 miliónov"},"10000000":{"few":"00 milióny","many":"00 miliónov","one":"00 milión","other":"00 miliónov"},"100000000":{"few":"000 milióny","many":"000 miliónov","one":"000 milión","other":"000 miliónov"},"1000000000":{"few":"0 miliardy","many":"0 miliard","one":"0 miliarda","other":"0 miliard"},"10000000000":{"few":"00 miliárdy","many":"00 miliárd","one":"00 miliarda","other":"00 miliárd"},"100000000000":{"few":"000 miliárdy","many":"000 miliárd","one":"000 miliarda","other":"000 miliárd"},"1000000000000":{"few":"0 bilióny","many":"0 biliónov","one":"0 bilión","other":"0 biliónov"},"10000000000000":{"few":"00 bilióny","many":"00 biliónov","one":"00 bilión","other":"00 biliónov"},"100000000000000":{"few":"000 bilióny","many":"000 biliónov","one":"000 bilión","other":"000 biliónov"}},"short":{"1000":{"few":"0 tis'.'","many":"0 tis'.'","one":"0 tis'.'","other":"0 tis'.'"},"10000":{"few":"00 tis'.'","many":"00 tis'.'","one":"00 tis'.'","other":"00 tis'.'"},"100000":{"few":"000 tis'.'","many":"000 tis'.'","one":"000 tis'.'","other":"000 tis'.'"},"1000000":{"few":"0 mil'.'","many":"0 mil'.'","one":"0 mil'.'","other":"0 mil'.'"},"10000000":{"few":"00 mil'.'","many":"00 mil'.'","one":"00 mil'.'","other":"00 mil'.'"},"100000000":{"few":"000 mil'.'","many":"000 mil'.'","one":"000 mil'.'","other":"000 mil'.'"},"1000000000":{"few":"0 mld'.'","many":"0 mld'.'","one":"0 mld'.'","other":"0 mld'.'"},"10000000000":{"few":"00 mld'.'","many":"00 mld'.'","one":"00 mld'.'","other":"00 mld'.'"},"100000000000":{"few":"000 mld'.'","many":"000 mld'.'","one":"000 mld'.'","other":"000 mld'.'"},"1000000000000":{"few":"0 bil'.'","many":"0 bil'.'","one":"0 bil'.'","other":"0 bil'.'"},"10000000000000":{"few":"00 bil'.'","many":"00 bil'.'","one":"00 bil'.'","other":"00 bil'.'"},"100000000000000":{"few":"000 bil'.'","many":"000 bil'.'","one":"000 bil'.'","other":"000 bil'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"sq":{"sq":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 mijë","other":"0 mijë"},"10000":{"one":"00 mijë","other":"00 mijë"},"100000":{"one":"000 mijë","other":"000 mijë"},"1000000":{"one":"0 milion","other":"0 milion"},"10000000":{"one":"00 milion","other":"00 milion"},"100000000":{"one":"000 milion","other":"000 milion"},"1000000000":{"one":"0 miliard","other":"0 miliard"},"10000000000":{"one":"00 miliard","other":"00 miliard"},"100000000000":{"one":"000 miliard","other":"000 miliard"},"1000000000000":{"one":"0 bilion","other":"0 bilion"},"10000000000000":{"one":"00 bilion","other":"00 bilion"},"100000000000000":{"one":"000 bilion","other":"000 bilion"}},"short":{"1000":{"one":"0 mijë","other":"0 mijë"},"10000":{"one":"00 mijë","other":"00 mijë"},"100000":{"one":"000 mijë","other":"000 mijë"},"1000000":{"one":"0 Mln","other":"0 Mln"},"10000000":{"one":"00 Mln","other":"00 Mln"},"100000000":{"one":"000 Mln","other":"000 Mln"},"1000000000":{"one":"0 Mld","other":"0 Mld"},"10000000000":{"one":"00 Mld","other":"00 Mld"},"100000000000":{"one":"000 Mld","other":"000 Mld"},"1000000000000":{"one":"0 Bln","other":"0 Bln"},"10000000000000":{"one":"00 Bln","other":"00 Bln"},"100000000000000":{"one":"000 Bln","other":"000 Bln"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"sr":{"sr":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"few":"{0} {1}","one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 хиљаде","one":"0 хиљада","other":"0 хиљада"},"10000":{"few":"00 хиљаде","one":"00 хиљада","other":"00 хиљада"},"100000":{"few":"000 хиљаде","one":"000 хиљада","other":"000 хиљада"},"1000000":{"few":"0 милиона","one":"0 милион","other":"0 милиона"},"10000000":{"few":"00 милиона","one":"00 милион","other":"00 милиона"},"100000000":{"few":"000 милиона","one":"000 милион","other":"000 милиона"},"1000000000":{"few":"0 милијарде","one":"0 милијарда","other":"0 милијарди"},"10000000000":{"few":"00 милијарде","one":"00 милијарда","other":"00 милијарди"},"100000000000":{"few":"000 милијарде","one":"000 милијарда","other":"000 милијарди"},"1000000000000":{"few":"0 трилиона","one":"0 трилион","other":"0 трилиона"},"10000000000000":{"few":"00 трилиона","one":"00 трилион","other":"00 трилиона"},"100000000000000":{"few":"000 трилиона","one":"000 трилион","other":"000 трилиона"}},"short":{"1000":{"few":"0 хиљ'.'","one":"0 хиљ'.'","other":"0 хиљ'.'"},"10000":{"few":"00 хиљ'.'","one":"00 хиљ'.'","other":"00 хиљ'.'"},"100000":{"few":"000 хиљ'.'","one":"000 хиљ'.'","other":"000 хиљ'.'"},"1000000":{"few":"0 мил'.'","one":"0 мил'.'","other":"0 мил'.'"},"10000000":{"few":"00 мил'.'","one":"00 мил'.'","other":"00 мил'.'"},"100000000":{"few":"000 мил'.'","one":"000 мил'.'","other":"000 мил'.'"},"1000000000":{"few":"0 млрд'.'","one":"0 млрд'.'","other":"0 млрд'.'"},"10000000000":{"few":"00 млрд'.'","one":"00 млрд'.'","other":"00 млрд'.'"},"100000000000":{"few":"000 млрд'.'","one":"000 млрд'.'","other":"000 млрд'.'"},"1000000000000":{"few":"0 бил'.'","one":"0 бил'.'","other":"0 бил'.'"},"10000000000000":{"few":"00 бил'.'","one":"00 бил'.'","other":"00 бил'.'"},"100000000000000":{"few":"000 бил'.'","one":"000 бил'.'","other":"000 бил'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"sv":{"sv":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 tusen","other":"0 tusen"},"10000":{"one":"00 tusen","other":"00 tusen"},"100000":{"one":"000 tusen","other":"000 tusen"},"1000000":{"one":"0 miljon","other":"0 miljoner"},"10000000":{"one":"00 miljon","other":"00 miljoner"},"100000000":{"one":"000 miljoner","other":"000 miljoner"},"1000000000":{"one":"0 miljard","other":"0 miljarder"},"10000000000":{"one":"00 miljarder","other":"00 miljarder"},"100000000000":{"one":"000 miljarder","other":"000 miljarder"},"1000000000000":{"one":"0 biljon","other":"0 biljoner"},"10000000000000":{"one":"00 biljoner","other":"00 biljoner"},"100000000000000":{"one":"000 biljoner","other":"000 biljoner"}},"short":{"1000":{"one":"0 tn","other":"0 tn"},"10000":{"one":"00 tn","other":"00 tn"},"100000":{"one":"000 tn","other":"000 tn"},"1000000":{"one":"0 mn","other":"0 mn"},"10000000":{"one":"00 mn","other":"00 mn"},"100000000":{"one":"000 mn","other":"000 mn"},"1000000000":{"one":"0 md","other":"0 md"},"10000000000":{"one":"00 md","other":"00 md"},"100000000000":{"one":"000 md","other":"000 md"},"1000000000000":{"one":"0 bn","other":"0 bn"},"10000000000000":{"one":"00 bn","other":"00 bn"},"100000000000000":{"one":"000 bn","other":"000 bn"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0 %"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"×10^","group":" ","infinity":"∞","list":";","minus_sign":"−","nan":"¤¤¤","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"·","time_separator":":"}}}},"ta":{"ta":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤ #,##,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##,##0.###","long":{"1000":{"one":"0 ஆயிரம்","other":"0 ஆயிரம்"},"10000":{"one":"00 ஆயிரம்","other":"00 ஆயிரம்"},"100000":{"one":"000 ஆயிரம்","other":"000 ஆயிரம்"},"1000000":{"one":"0 மில்லியன்","other":"0 மில்லியன்"},"10000000":{"one":"00 மில்லியன்","other":"00 மில்லியன்"},"100000000":{"one":"000 மில்லியன்","other":"000 மில்லியன்"},"1000000000":{"one":"0 பில்லியன்","other":"0 பில்லியன்"},"10000000000":{"one":"00 பில்லியன்","other":"00 பில்லியன்"},"100000000000":{"one":"000 பில்லியன்","other":"000 பில்லியன்"},"1000000000000":{"one":"0 டிரில்லியன்","other":"0 டிரில்லியன்"},"10000000000000":{"one":"00 டிரில்லியன்","other":"00 டிரில்லியன்"},"100000000000000":{"one":"000 டிரில்லியன்","other":"000 டிரில்லியன்"}},"short":{"1000":{"one":"0ஆ","other":"0ஆ"},"10000":{"one":"00ஆ","other":"00ஆ"},"100000":{"one":"000ஆ","other":"000ஆ"},"1000000":{"one":"0மி","other":"0மி"},"10000000":{"one":"00மி","other":"00மி"},"100000000":{"one":"000மி","other":"000மி"},"1000000000":{"one":"0பி","other":"0பி"},"10000000000":{"one":"00பி","other":"00பி"},"100000000000":{"one":"000பி","other":"000பி"},"1000000000000":{"one":"0டி","other":"0டி"},"10000000000000":{"one":"00டி","other":"00டி"},"100000000000000":{"one":"000டி","other":"000டி"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"th":{"th":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"other":"0 พัน"},"10000":{"other":"0 หมื่น"},"100000":{"other":"0 แสน"},"1000000":{"other":"0 ล้าน"},"10000000":{"other":"00 ล้าน"},"100000000":{"other":"000 ล้าน"},"1000000000":{"other":"0 พันล้าน"},"10000000000":{"other":"0 หมื่นล้าน"},"100000000000":{"other":"0 แสนล้าน"},"1000000000000":{"other":"0 ล้านล้าน"},"10000000000000":{"other":"00 ล้านล้าน"},"100000000000000":{"other":"000 ล้านล้าน"}},"short":{"1000":{"other":"0 พ'.'"},"10000":{"other":"0 ม'.'"},"100000":{"other":"0 ส'.'"},"1000000":{"other":"0 ล'.'"},"10000000":{"other":"00 ล'.'"},"100000000":{"other":"000 ล'.'"},"1000000000":{"other":"0 พ'.'ล'.'"},"10000000000":{"other":"0 ม'.'ล'.'"},"100000000000":{"other":"0 ส'.'ล'.'"},"1000000000000":{"other":"0 ล'.'ล'.'"},"10000000000000":{"other":"00 ล'.'ล'.'"},"100000000000000":{"other":"000 ล'.'ล'.'"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"tr":{"tr":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 bin","other":"0 bin"},"10000":{"one":"00 bin","other":"00 bin"},"100000":{"one":"000 bin","other":"000 bin"},"1000000":{"one":"0 milyon","other":"0 milyon"},"10000000":{"one":"00 milyon","other":"00 milyon"},"100000000":{"one":"000 milyon","other":"000 milyon"},"1000000000":{"one":"0 milyar","other":"0 milyar"},"10000000000":{"one":"00 milyar","other":"00 milyar"},"100000000000":{"one":"000 milyar","other":"000 milyar"},"1000000000000":{"one":"0 trilyon","other":"0 trilyon"},"10000000000000":{"one":"00 trilyon","other":"00 trilyon"},"100000000000000":{"one":"000 trilyon","other":"000 trilyon"}},"short":{"1000":{"one":0,"other":0},"10000":{"one":"00 B","other":"00 B"},"100000":{"one":"000 B","other":"000 B"},"1000000":{"one":"0 Mn","other":"0 Mn"},"10000000":{"one":"00 Mn","other":"00 Mn"},"100000000":{"one":"000 Mn","other":"000 Mn"},"1000000000":{"one":"0 Mr","other":"0 Mr"},"10000000000":{"one":"00 Mr","other":"00 Mr"},"100000000000":{"one":"000 Mr","other":"000 Mr"},"1000000000000":{"one":"0 Tn","other":"0 Tn"},"10000000000000":{"one":"00 Tn","other":"00 Tn"},"100000000000000":{"one":"000 Tn","other":"000 Tn"}}}},"percent":{"number_system":"latn","patterns":{"default":"%#,##0"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"uk":{"uk":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"few":"{0} {1}","many":"{0} {1}","one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"few":"0 тисячі","many":"0 тисяч","one":"0 тисяча","other":"0 тисячі"},"10000":{"few":"00 тисячі","many":"00 тисяч","one":"00 тисяча","other":"00 тисячі"},"100000":{"few":"000 тисячі","many":"000 тисяч","one":"000 тисяча","other":"000 тисячі"},"1000000":{"few":"0 мільйони","many":"0 мільйонів","one":"0 мільйон","other":"0 мільйона"},"10000000":{"few":"00 мільйони","many":"00 мільйонів","one":"00 мільйон","other":"00 мільйона"},"100000000":{"few":"000 мільйони","many":"000 мільйонів","one":"000 мільйон","other":"000 мільйона"},"1000000000":{"few":"0 мільярди","many":"0 мільярдів","one":"0 мільярд","other":"0 мільярда"},"10000000000":{"few":"00 мільярди","many":"00 мільярдів","one":"00 мільярд","other":"00 мільярда"},"100000000000":{"few":"000 мільярди","many":"000 мільярдів","one":"000 мільярд","other":"000 мільярда"},"1000000000000":{"few":"0 трильйони","many":"0 трильйонів","one":"0 трильйон","other":"0 трильйона"},"10000000000000":{"few":"00 трильйони","many":"00 трильйонів","one":"00 трильйон","other":"00 трильйона"},"100000000000000":{"few":"000 трильйони","many":"000 трильйонів","one":"000 трильйон","other":"000 трильйона"}},"short":{"1000":{"few":"0 тис","many":"0 тис","one":"0 тис","other":"0 тис"},"10000":{"few":"00 тис","many":"00 тис","one":"00 тис","other":"00 тис"},"100000":{"few":"000 тис","many":"000 тис","one":"000 тис","other":"000 тис"},"1000000":{"few":"0 млн","many":"0 млн","one":"0 млн","other":"0 млн"},"10000000":{"few":"00 млн","many":"00 млн","one":"00 млн","other":"00 млн"},"100000000":{"few":"000 млн","many":"000 млн","one":"000 млн","other":"000 млн"},"1000000000":{"few":"0 млрд","many":"0 млрд","one":"0 млрд","other":"0 млрд"},"10000000000":{"few":"00 млрд","many":"00 млрд","one":"00 млрд","other":"00 млрд"},"100000000000":{"few":"000 млрд","many":"000 млрд","one":"000 млрд","other":"000 млрд"},"1000000000000":{"few":"0 трлн","many":"0 трлн","one":"0 трлн","other":"0 трлн"},"10000000000000":{"few":"00 трлн","many":"00 трлн","one":"00 трлн","other":"00 трлн"},"100000000000000":{"few":"000 трлн","many":"000 трлн","one":"000 трлн","other":"000 трлн"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"Е","group":" ","infinity":"∞","list":";","minus_sign":"-","nan":"Не число","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"ur":{"ur":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤ #,##,##0.00"},"unit":{"one":"{0} {1}","other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"one":"0 ہزار","other":"0 ہزار"},"10000":{"one":"00 ہزار","other":"00 ہزار"},"100000":{"one":"0 لاکھ","other":"0 لاکھ"},"1000000":{"one":"00 لاکھ","other":"00 لاکھ"},"10000000":{"one":"0 کروڑ","other":"0 کروڑ"},"100000000":{"one":"00 کروڑ","other":"00 کروڑ"},"1000000000":{"one":"0 ارب","other":"0 ارب"},"10000000000":{"one":"00 ارب","other":"00 ارب"},"100000000000":{"one":"0 کھرب","other":"0 کھرب"},"1000000000000":{"one":"00 کھرب","other":"00 کھرب"},"10000000000000":{"one":"00 ٹریلین","other":"00 ٹریلین"},"100000000000000":{"one":"000 ٹریلین","other":"000 ٹریلین"}},"short":{"1000":{"one":"0 ہزار","other":"0 ہزار"},"10000":{"one":"00 ہزار","other":"00 ہزار"},"100000":{"one":"0 لاکھ","other":"0 لاکھ"},"1000000":{"one":"00 لاکھ","other":"00 لاکھ"},"10000000":{"one":"0 کروڑ","other":"0 کروڑ"},"100000000":{"one":"00 کروڑ","other":"00 کروڑ"},"1000000000":{"one":"0 ارب","other":"0 ارب"},"10000000000":{"one":"00 ارب","other":"00 ارب"},"100000000000":{"one":"0 کھرب","other":"0 کھرب"},"1000000000000":{"one":"00 کھرب","other":"00 کھرب"},"10000000000000":{"one":"00 ٹریلین","other":"00 ٹریلین"},"100000000000000":{"one":"000 ٹریلین","other":"000 ٹریلین"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"‎-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"‎+","superscripting_exponent":"×","time_separator":":"}}}},"vi":{"vi":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"#,##0.00 ¤"},"unit":{"other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"other":"0 nghìn"},"10000":{"other":"00 nghìn"},"100000":{"other":"000 nghìn"},"1000000":{"other":"0 triệu"},"10000000":{"other":"00 triệu"},"100000000":{"other":"000 triệu"},"1000000000":{"other":"0 tỷ"},"10000000000":{"other":"00 tỷ"},"100000000000":{"other":"000 tỷ"},"1000000000000":{"other":"0 nghìn tỷ"},"10000000000000":{"other":"00 nghìn tỷ"},"100000000000000":{"other":"000 nghìn tỷ"}},"short":{"1000":{"other":"0 N"},"10000":{"other":"00 N"},"100000":{"other":"000 N"},"1000000":{"other":"0 Tr"},"10000000":{"other":"00 Tr"},"100000000":{"other":"000 Tr"},"1000000000":{"other":"0 T"},"10000000000":{"other":"00 T"},"100000000000":{"other":"000 T"},"1000000000000":{"other":"0 NT"},"10000000000000":{"other":"00 NT"},"100000000000000":{"other":"000 NT"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"zh":{"zh":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤ #,##0.00"},"unit":{"other":"{0}{1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"other":"0千"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0亿"},"1000000000":{"other":"00亿"},"10000000000":{"other":"000亿"},"100000000000":{"other":"0000亿"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}},"short":{"1000":{"other":"0千"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0亿"},"1000000000":{"other":"00亿"},"10000000000":{"other":"000亿"},"100000000000":{"other":"0000亿"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}},"zh-Hant":{"zh-Hant":{"numbers":{"formats":{"currency":{"number_system":"latn","patterns":{"default":"¤#,##0.00"},"unit":{"other":"{0} {1}"}},"decimal":{"number_system":"latn","patterns":{"default":"#,##0.###","long":{"1000":{"other":"0 千"},"10000":{"other":"0萬"},"100000":{"other":"00萬"},"1000000":{"other":"000萬"},"10000000":{"other":"0000萬"},"100000000":{"other":"0億"},"1000000000":{"other":"00億"},"10000000000":{"other":"000億"},"100000000000":{"other":"0000億"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}},"short":{"1000":{"other":"0K"},"10000":{"other":"00K"},"100000":{"other":"000K"},"1000000":{"other":"0M"},"10000000":{"other":"00M"},"100000000":{"other":"000M"},"1000000000":{"other":"0B"},"10000000000":{"other":"00B"},"100000000000":{"other":"000B"},"1000000000000":{"other":"0T"},"10000000000000":{"other":"00T"},"100000000000000":{"other":"000T"}}}},"percent":{"number_system":"latn","patterns":{"default":"#,##0%"}},"scientific":{"number_system":"latn","patterns":{"default":"#E0"}}},"symbols":{"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"非數值","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"}}}}};
    }

    NumberDataReader.prototype.traverse = function(path, obj) {
      if (obj == null) {
        obj = this.resource;
      }
      return TwitterCldr.Utilities.traverse_object(obj, path);
    };

    NumberDataReader.prototype.pattern_at_path = function(path) {
      return this.traverse(path);
    };

    NumberDataReader.prototype.get_resource = function(locale) {
      if (locale == null) {
        locale = this.locale;
      }
      return this.resource[locale];
    };

    NumberDataReader.prototype.pattern = function(number) {
      var path, pattern, sign;
      sign = number < 0 ? "negative" : "positive";
      path = this.base_path + (this.is_valid_type_for(number, type) ? this.type_paths[type] : type_paths["default"]);
      pattern = this.traverse[path];
      if (pattern[this.format] != null) {
        pattern = pattern[this.format];
      }
      if (number != null) {
        pattern = pattern_for_number(pattern, number);
      }
      if (pattern instanceof String) {
        return pattern_for_sign(pattern, sign);
      } else {
        return pattern;
      }
    };

    NumberDataReader.prototype.number_system_for = function(type) {
      return (this.traverse(this.base_path.concat(type)) || {})["number_system"] || this.default_number_system;
    };

    NumberDataReader.prototype.is_abbreviated = function(type) {
      return this.abbreviated_types[type] != null;
    };

    NumberDataReader.prototype.is_valid_type_for = function(number, type) {
      if (this.is_abbreviated(type)) {
        return this.is_within_abbreviation_range(number);
      } else {
        return this.type_paths[type] != null;
      }
    };

    NumberDataReader.prototype.get_key_for = function(number) {
      return Math.pow(10, (number + "").length - 1);
    };

    NumberDataReader.prototype.pattern_for_number = function(pattern, number) {
      if (pattern instanceof Object) {
        return pattern[this.get_key_for(number)] || [pattern];
      } else {
        return pattern;
      }
    };

    NumberDataReader.prototype.pattern_for_sign = function(pattern, sign) {
      var negative, positive;
      if (pattern.indexOf(";") !== 0) {
        positive = pattern.split(';')[0];
        negative = pattern.split(';')[1];
        if (sign === "positive") {
          return positive;
        } else {
          return negative;
        }
      } else {
        if (sign === "negative") {
          return (this.symbols["minus"] || '-') + pattern;
        } else {
          return pattern;
        }
      }
    };

    NumberDataReader.prototype.is_within_abbreviation_range = function(number) {
      return this.number_min <= number && number < this.number_max;
    };

    return NumberDataReader;

  })();

  TwitterCldr.RBNFRuleFormatter = (function() {
    function RBNFRuleFormatter() {}

    RBNFRuleFormatter.keep_soft_hyphens = true;

    RBNFRuleFormatter.format = function(number, rule_set, rule_group, locale) {
      var formatter, result, rule;
      rule = rule_set.rule_for(number);
      formatter = this.formatter_for(rule, rule_set, rule_group, locale);
      result = formatter.format(number, rule);
      if (this.keep_soft_hyphens) {
        return result;
      } else {
        return remove_soft_hyphens(result);
      }
    };

    RBNFRuleFormatter.formatter_for = function(rule, rule_set, rule_group, locale) {
      if (rule.is_master()) {
        return new TwitterCldr.RBNFMasterRuleFormatter(rule_set, rule_group, locale);
      }
      if (rule.is_improper_fraction()) {
        return new TwitterCldr.RBNFImproperFractionRuleFormatter(rule_set, rule_group, locale);
      }
      if (rule.is_proper_fraction()) {
        return new TwitterCldr.RBNFProperFractionRuleFormatter(rule_set, rule_group, locale);
      }
      if (rule.is_negative()) {
        return new TwitterCldr.RBNFNegativeRuleFormatter(rule_set, rule_group, locale);
      }
      return new TwitterCldr.RBNFNormalRuleFormatter(rule_set, rule_group, locale);
    };

    RBNFRuleFormatter.remove_soft_hyphens = function(result) {
      return result.replace(TwitterCldr.Utilities.pack_array([173]), "");
    };

    return RBNFRuleFormatter;

  })();

  TwitterCldr.RBNFNormalRuleFormatter = (function() {
    function RBNFNormalRuleFormatter(rule_set, rule_group, locale) {
      this.rule_set = rule_set;
      this.rule_group = rule_group;
      this.locale = locale;
      this.is_fractional = false;
    }

    RBNFNormalRuleFormatter.prototype.format = function(number, rule) {
      var result, results, token, _i, _len, _ref;
      results = [];
      _ref = rule.get_tokens();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        result = this[token.type](number, rule, token);
        results.push((this.omit != null) && this.omit ? "" : result);
      }
      return results.join("");
    };

    RBNFNormalRuleFormatter.prototype.right_arrow = function(number, rule, token) {
      var remainder;
      remainder = Math.abs(number) % rule.divisor;
      return this.generate_replacement(remainder, rule, token);
    };

    RBNFNormalRuleFormatter.prototype.left_arrow = function(number, rule, token) {
      var quotient;
      quotient = Math.floor(Math.abs(number) / rule.divisor);
      return this.generate_replacement(quotient, rule, token);
    };

    RBNFNormalRuleFormatter.prototype.equals = function(number, rule, token) {
      return this.generate_replacement(number, rule, token);
    };

    RBNFNormalRuleFormatter.prototype.generate_replacement = function(number, rule, token) {
      var decimal_format, decimal_tokens, rule_set_name;
      if ((rule_set_name = token.rule_set_reference()) != null) {
        return TwitterCldr.RBNFRuleFormatter.format(number, this.rule_group.rule_set_for(rule_set_name), this.rule_group, this.locale);
      } else if ((decimal_format = token.decimal_format()) != null) {
        this.data_reader || (this.data_reader = new TwitterCldr.NumberDataReader(this.locale));
        this.decimal_tokenizer || (this.decimal_tokenizer = new TwitterCldr.NumberTokenizer(this.data_reader));
        decimal_tokens = this.decimal_tokenizer.tokenize(decimal_format);
        this.decimal_formatter || (this.decimal_formatter = new TwitterCldr.DecimalFormatter(this.data_reader));
        return this.decimal_formatter.format(number, {
          "type": "decimal"
        });
      } else {
        return TwitterCldr.RBNFRuleFormatter.format(number, this.rule_set, this.rule_group, this.locale);
      }
    };

    RBNFNormalRuleFormatter.prototype.open_bracket = function(number, rule, token) {
      this.omit = rule.is_even_multiple_of(number);
      return "";
    };

    RBNFNormalRuleFormatter.prototype.close_bracket = function(number, rule, token) {
      this.omit = false;
      return "";
    };

    RBNFNormalRuleFormatter.prototype.plaintext = function(number, rule, token) {
      return token.value;
    };

    RBNFNormalRuleFormatter.prototype.semicolon = function(number, rule, token) {
      return "";
    };

    RBNFNormalRuleFormatter.prototype.plural = function(number, rule, token) {
      return token.render(Math.floor(number / rule.divisor));
    };

    RBNFNormalRuleFormatter.prototype.throw_invalid_token_error = function(token) {
      throw "'" + token.value + "' not allowed in negative number rules.";
    };

    RBNFNormalRuleFormatter.prototype.fractional_part = function(number) {
      return parseFloat((number + "").split(".")[1] || 0);
    };

    RBNFNormalRuleFormatter.prototype.integral_part = function(number) {
      return parseInt((number + "").split(".")[0]);
    };

    return RBNFNormalRuleFormatter;

  })();

  TwitterCldr.RBNFNegativeRuleFormatter = (function(_super) {
    __extends(RBNFNegativeRuleFormatter, _super);

    function RBNFNegativeRuleFormatter() {
      return RBNFNegativeRuleFormatter.__super__.constructor.apply(this, arguments);
    }

    RBNFNegativeRuleFormatter.prototype.right_arrow = function(number, rule, token) {
      return this.generate_replacement(Math.abs(number), rule, token);
    };

    RBNFNegativeRuleFormatter.prototype.left_arrow = function(number, rule, token) {
      return this.throw_invalid_token_error(token);
    };

    RBNFNegativeRuleFormatter.prototype.open_bracket = function(number, rule, token) {
      return this.throw_invalid_token_error(token);
    };

    RBNFNegativeRuleFormatter.prototype.close_bracket = function(number, rule, token) {
      return this.throw_invalid_token_error(token);
    };

    return RBNFNegativeRuleFormatter;

  })(TwitterCldr.RBNFNormalRuleFormatter);

  TwitterCldr.RBNFMasterRuleFormatter = (function(_super) {
    __extends(RBNFMasterRuleFormatter, _super);

    function RBNFMasterRuleFormatter() {
      return RBNFMasterRuleFormatter.__super__.constructor.apply(this, arguments);
    }

    RBNFMasterRuleFormatter.prototype.right_arrow = function(number, rule, token) {
      var digit, fractional_part;
      this.is_fractional = true;
      fractional_part = this.fractional_part(number);
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = fractional_part.split("");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          digit = _ref[_i];
          _results.push(TwitterCldr.RBNFRuleFormatter.format(parseInt(digit), this.rule_set, this.rule_group, this.locale));
        }
        return _results;
      }).call(this)).join(" ");
    };

    RBNFMasterRuleFormatter.prototype.left_arrow = function(number, rule, token) {
      if (this.is_fractional) {
        return TwitterCldr.RBNFRuleFormatter.format(parseInt(digit), this.rule_set, this.rule_group, this.locale);
      } else {
        return this.generate_replacement(this.integral_part(number), rule, token);
      }
    };

    RBNFMasterRuleFormatter.prototype.open_bracket = function(number, rule, token) {
      return this.omit = (this.is_fractional ? (number * this.get_fractional_rule(number).base_value) === 1 : (number + "").indexOf('.') === -1);
    };

    RBNFMasterRuleFormatter.prototype.close_bracket = function(number, rule, token) {
      this.omit = false;
      return "";
    };

    RBNFMasterRuleFormatter.prototype.get_fractional_rule = function(number) {
      return this.fractional_rule || (this.fractional_rule = this.rule_set.rule_for(number, true));
    };

    return RBNFMasterRuleFormatter;

  })(TwitterCldr.RBNFNormalRuleFormatter);

  TwitterCldr.RBNFProperFractionRuleFormatter = (function(_super) {
    __extends(RBNFProperFractionRuleFormatter, _super);

    function RBNFProperFractionRuleFormatter() {
      return RBNFProperFractionRuleFormatter.__super__.constructor.apply(this, arguments);
    }

    RBNFProperFractionRuleFormatter.prototype.open_bracket = function(number, rule, token) {
      return this.throw_invalid_token_error(token);
    };

    RBNFProperFractionRuleFormatter.prototype.close_bracket = function(number, rule, token) {
      return this.throw_invalid_token_error(token);
    };

    return RBNFProperFractionRuleFormatter;

  })(TwitterCldr.RBNFMasterRuleFormatter);

  TwitterCldr.RBNFImproperFractionRuleFormatter = (function(_super) {
    __extends(RBNFImproperFractionRuleFormatter, _super);

    function RBNFImproperFractionRuleFormatter() {
      return RBNFImproperFractionRuleFormatter.__super__.constructor.apply(this, arguments);
    }

    RBNFImproperFractionRuleFormatter.prototype.open_bracket = function(number, rule, token) {
      this.omit = number > 0 && number < 1;
      return "";
    };

    return RBNFImproperFractionRuleFormatter;

  })(TwitterCldr.RBNFMasterRuleFormatter);

  TwitterCldr.RBNFRule = (function() {
    RBNFRule.master = "x.0";

    RBNFRule.improper_fraction = "x.x";

    RBNFRule.proper_fraction = "0.x";

    RBNFRule.negative = "-x";

    function RBNFRule(base_value, rule_text, radix) {
      var div, exp, val;
      this.base_value = base_value != null ? base_value : 10;
      this.rule_text = rule_text;
      this.radix = radix != null ? radix : 10;
      val = parseInt(this.base_value);
      exp = val > 0 ? Math.ceil(Math.log(val) / Math.log(radix || 10)) : 1;
      div = exp >= 0 ? Math.pow(radix || 10, exp) : 1;
      this.divisor = div > val ? Math.pow(radix || 10, exp - 1) : div;
      this.substitution_types = ["equals", "left_arrow", "right_arrow"];
      this.master = TwitterCldr.RBNFRule.master;
      this.improper_fraction = TwitterCldr.RBNFRule.improper_fraction;
      this.proper_fraction = TwitterCldr.RBNFRule.proper_fraction;
      this.negative = TwitterCldr.RBNFRule.negative;
      this.parser = new TwitterCldr.RBNFRuleParser;
      this.tokenizer = new TwitterCldr.RBNFTokenizer;
    }

    RBNFRule.prototype.get_substitution_count = function() {
      var token, _i, _len, _ref;
      if (this.substitution_count != null) {
        return this.substitution_count;
      }
      this.substitution_count = 0;
      _ref = this.get_tokens();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        if (token instanceof TwitterCldr.RBNFSubstitution) {
          this.substitution_count += 1;
        }
      }
      return this.substitution_count;
    };

    RBNFRule.prototype.is_even_multiple_of = function(num) {
      return num % this.divisor === 0;
    };

    RBNFRule.prototype.is_normal = function() {
      return !(this.is_master() || this.is_improper_fraction() || this.is_proper_fraction() || this.is_negative());
    };

    RBNFRule.prototype.is_master = function() {
      return this.base_value === this.master;
    };

    RBNFRule.prototype.is_improper_fraction = function() {
      return this.base_value === this.improper_fraction;
    };

    RBNFRule.prototype.is_proper_fraction = function() {
      return this.base_value === this.proper_fraction;
    };

    RBNFRule.prototype.is_negative = function() {
      return this.base_value === this.negative;
    };

    RBNFRule.prototype.get_tokens = function() {
      return this.tokens || (this.tokens = this.inline_substitutions(this.tokenizer.tokenize(this.rule_text)));
    };

    RBNFRule.prototype.inline_substitutions = function(tokens) {
      return this.parser.parse(tokens);
    };

    return RBNFRule;

  })();

  TwitterCldr.RBNFRuleGroup = (function() {
    function RBNFRuleGroup(rule_sets, rule_name) {
      this.rule_sets = rule_sets;
      this.rule_name = rule_name;
    }

    RBNFRuleGroup.prototype.rule_set_for = function(rule_set_name) {
      var rule_set, _i, _len, _ref;
      _ref = this.rule_sets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule_set = _ref[_i];
        if (rule_set.name === rule_set_name) {
          return rule_set;
        }
      }
      return null;
    };

    return RBNFRuleGroup;

  })();

  TwitterCldr.RBNFRuleSet = (function() {
    function RBNFRuleSet(rules, name, access) {
      this.rules = rules;
      this.name = name;
      this.access = access;
    }

    RBNFRuleSet.prototype.rule_for_value = function(value) {
      var index;
      if ((index = this.rule_index_for(value)) != null) {
        return this.rules[index];
      }
    };

    RBNFRuleSet.prototype.previous_rule_for = function(rule) {
      var index;
      if ((index = this.rule_index_for(rule.base_value)) != null) {
        if (index > 0) {
          return this.rules[index - 1];
        }
      }
    };

    RBNFRuleSet.prototype.master_rule = function() {
      return this.rule_for_value(TwitterCldr.RBNFRule.master);
    };

    RBNFRuleSet.prototype.proper_fraction_rule = function() {
      return this.rule_for_value(TwitterCldr.RBNFRule.proper_fraction);
    };

    RBNFRuleSet.prototype.improper_fraction_rule = function() {
      return this.rule_for_value(TwitterCldr.RBNFRule.improper_fraction);
    };

    RBNFRuleSet.prototype.negative_rule = function() {
      return this.rule_for_value(TwitterCldr.RBNFRule.negative);
    };

    RBNFRuleSet.prototype.is_private = function() {
      return this.access === "private";
    };

    RBNFRuleSet.prototype.is_public = function() {
      return this.access === "public";
    };

    RBNFRuleSet.prototype.numeric_rules = function() {
      var rule, _i, _ref, _ref1, _results;
      _results = [];
      for (rule = _i = _ref = this.get_search_start_index(), _ref1 = rules.size; _i < _ref1; rule = _i += 1) {
        _results.push(rule);
      }
      return _results;
    };

    RBNFRuleSet.prototype.rule_for = function(number, fractional) {
      if (fractional == null) {
        fractional = false;
      }
      if (fractional) {
        return this.fractional_rule_for(number);
      } else {
        return this.normal_rule_for(number);
      }
    };

    RBNFRuleSet.prototype.fractional_rule_for = function(number) {
      var difference, i, index, least_common_multiple, numerator, temp_difference, winner, _i, _j, _ref, _ref1, _ref2;
      index = this.get_search_start_index();
      while (this.rules[index].base_value === 0) {
        index += 1;
      }
      least_common_multiple = this.rules[index].base_value;
      for (i = _i = _ref = index + 1, _ref1 = this.rules.size; _i < _ref1; i = _i += 1) {
        least_common_multiple = this.lcm(least_common_multiple, this.rules[i].base_value);
      }
      numerator = Math.round(number * least_common_multiple);
      difference = Math.pow(10, 30);
      winner = 0;
      for (i = _j = index, _ref2 = this.rules.size; index <= _ref2 ? _j < _ref2 : _j > _ref2; i = index <= _ref2 ? ++_j : --_j) {
        temp_difference = (numerator * this.rules[i].base_value) % least_common_multiple;
        if ((least_common_multiple - temp_difference) < temp_difference) {
          temp_difference = least_common_multiple - temp_difference;
        }
        if (temp_difference < difference) {
          difference = temp_difference;
          winner = i;
          if (difference === 0) {
            break;
          }
        }
      }
      if ((winner + 1) < this.rules.length && this.rules[winner + 1].base_value === this.rules[winner].base_value) {
        if (Math.round(number * this.rules[winner].base_value) < 1 || Math.round(number * this.rules[winner].base_value) >= 2) {
          winner += 1;
        }
      }
      return this.rules[winner];
    };

    RBNFRuleSet.prototype.lcm = function(x, y) {
      var gcd, p2, t, x1, y1;
      x1 = x;
      y1 = y;
      p2 = 0;
      while ((x1 & 1) === 0 && (y1 & 1) === 0) {
        p2 += 1;
        x1 >>= 1;
        y1 >>= 1;
      }
      t = ((x1 & 1) === 1 ? -y1 : x1);
      while (t !== 0) {
        while ((t & 1) === 0) {
          t >>= 1;
        }
        if (t > 0) {
          x1 = t;
        } else {
          y1 = -t;
        }
        t = x1 - y1;
      }
      gcd = x1 << p2;
      return x / gcd * y;
    };

    RBNFRuleSet.prototype.normal_rule_for = function(number) {
      var rule, use_prev_rule;
      if ((rule = this.master_rule()) != null) {
        return rule;
      } else if (number < 0 && ((rule = this.negative_rule()) != null)) {
        return rule;
      } else if (this.contains_fraction(number) && number > 1 && ((rule = this.improper_fraction_rule()) != null)) {
        return rule;
      } else if (this.contains_fraction(number) && number > 0 && number < 1 && ((rule = this.proper_fraction_rule()) != null)) {
        return rule;
      } else {
        if ((rule = this.rule_for_value(Math.abs(number))) != null) {
          use_prev_rule = rule.get_substitution_count() === 2 && !rule.is_even_multiple_of(rule.base_value) && rule.is_even_multiple_of(number);
          if (use_prev_rule) {
            return this.previous_rule_for(rule);
          } else {
            return rule;
          }
        } else {
          return this.rules[this.get_search_start_index()] || this.rules[0];
        }
      }
    };

    RBNFRuleSet.prototype.contains_fraction = function(number) {
      return number !== Math.floor(number);
    };

    RBNFRuleSet.prototype.rule_index_for = function(base_value) {
      var high, low, mid, rule_index;
      if ((rule_index = this.special_rule_index_for(base_value)) != null) {
        return rule_index;
      }
      if (this.is_numeric(base_value)) {
        low = this.get_search_start_index();
        high = this.rules.length - 1;
        while (low <= high) {
          mid = Math.floor((low + high) / 2);
          if (this.rules[mid].base_value > base_value) {
            high = mid - 1;
          } else if (this.rules[mid].base_value < base_value) {
            low = mid + 1;
          } else {
            break;
          }
        }
        if (this.rules[mid].base_value <= base_value) {
          return mid;
        } else {
          if (mid > 0) {
            return mid - 1;
          } else {
            return mid;
          }
        }
      }
    };

    RBNFRuleSet.prototype.special_rule_index_for = function(base_value) {
      var i, _i, _ref;
      for (i = _i = 0, _ref = this.get_search_start_index(); _i < _ref; i = _i += 1) {
        if (this.rules[i].base_value === base_value) {
          return i;
        }
      }
      return null;
    };

    RBNFRuleSet.prototype.get_search_start_index = function() {
      var i, _i, _ref;
      if (this.search_start_index != null) {
        return this.search_start_index;
      }
      this.search_start_index = 0;
      for (i = _i = 0, _ref = this.rules.length; _i < _ref; i = _i += 1) {
        if (this.is_numeric(this.rules[i].base_value)) {
          this.search_start_index = i;
          break;
        }
      }
      return this.search_start_index;
    };

    RBNFRuleSet.prototype.is_numeric = function(val) {
      return ((val + "").match(/^[\d]+(\.\d)?[\d]*$/)) != null;
    };

    return RBNFRuleSet;

  })();

  TwitterCldr.RBNFSubstitution = (function() {
    function RBNFSubstitution(type, contents, length) {
      this.type = type;
      this.contents = contents;
      this.length = length;
    }

    RBNFSubstitution.prototype.rule_set_reference = function() {
      var item;
      if ((this.contents != null) && ((item = this.contents[0]) != null)) {
        if (item.type === 'rule') {
          return item.value.replace(/%/g, "");
        }
      }
    };

    RBNFSubstitution.prototype.decimal_format = function() {
      var item;
      if ((this.contents != null) && ((item = this.contents[0]) != null)) {
        if (item.type === 'decimal') {
          return item.value;
        }
      }
    };

    return RBNFSubstitution;

  })();

  TwitterCldr.RBNFRuleParser = (function(_super) {
    __extends(RBNFRuleParser, _super);

    function RBNFRuleParser() {
      return RBNFRuleParser.__super__.constructor.apply(this, arguments);
    }

    RBNFRuleParser.prototype.do_parse = function(options) {
      if (options == null) {
        options = {};
      }
      return this["switch"]([]);
    };

    RBNFRuleParser.prototype["switch"] = function(list) {
      return this[this.current_token().type](list);
    };

    RBNFRuleParser.prototype.equals = function(list) {
      var contents;
      contents = this.descriptor(this.current_token());
      list.push(new TwitterCldr.RBNFSubstitution("equals", contents, 2));
      this.next_token("equals");
      return this["switch"](list);
    };

    RBNFRuleParser.prototype.left_arrow = function(list) {
      var contents;
      contents = this.descriptor(this.current_token());
      list.push(new TwitterCldr.RBNFSubstitution("left_arrow", contents, 2));
      this.next_token("left_arrow");
      return this["switch"](list);
    };

    RBNFRuleParser.prototype.right_arrow = function(list) {
      var contents, sub;
      contents = this.descriptor(this.current_token());
      sub = new TwitterCldr.RBNFSubstitution("right_arrow", contents, 2);
      this.next_token("right_arrow");
      if (this.current_token().type === "right_arrow") {
        sub.length += 1;
        this.next_token("right_arrow");
      }
      list.push(sub);
      return this["switch"](list);
    };

    RBNFRuleParser.prototype.plural = function(list) {
      var sub;
      sub = new TwitterCldr.RBNFPlural.from_string(this.current_token().value);
      list.push(sub);
      this.next_token("plural");
      return this["switch"](list);
    };

    RBNFRuleParser.prototype.plaintext = function(list) {
      return this.add_and_advance(list);
    };

    RBNFRuleParser.prototype.open_bracket = function(list) {
      return this.add_and_advance(list);
    };

    RBNFRuleParser.prototype.close_bracket = function(list) {
      return this.add_and_advance(list);
    };

    RBNFRuleParser.prototype.semicolon = function(list) {
      return list;
    };

    RBNFRuleParser.prototype.add_and_advance = function(list) {
      list.push(this.current_token());
      this.next_token(this.current_token().type);
      return this["switch"](list);
    };

    RBNFRuleParser.prototype.descriptor = function(token) {
      var contents;
      this.next_token(token.type);
      contents = [];
      while (this.current_token().type !== token.type) {
        contents.push(this.current_token());
        this.next_token(this.current_token().type);
      }
      return contents;
    };

    return RBNFRuleParser;

  })(TwitterCldr.Parser);

  TwitterCldr.RBNFPlural = (function() {
    RBNFPlural.from_string = function(string, locale) {
      var cases, cases_map, match, plural_type, split_regex, _ref;
      if (locale == null) {
        locale = TwitterCldr.locale;
      }
      _ref = string.match(/\$\((.*)\)\$/)[1].split(','), plural_type = _ref[0], cases_map = _ref[1];
      cases = {};
      split_regex = /([\w]+)\{([^}]+)\}/g;
      while (match = split_regex.exec(cases_map)) {
        cases[match[1]] = match[2];
      }
      return new TwitterCldr.RBNFPlural(locale, plural_type, cases);
    };

    function RBNFPlural(locale, plural_type, cases) {
      this.locale = locale;
      this.plural_type = plural_type;
      this.cases = cases;
      this.type = "plural";
    }

    RBNFPlural.prototype.type = function() {
      return this.type;
    };

    RBNFPlural.prototype.render = function(number) {
      var rule_name;
      rule_name = TwitterCldr.PluralRules.rule_for(number, this.plural_type);
      return this.cases[rule_name] || this.cases["other"];
    };

    return RBNFPlural;

  })();

  TwitterCldr.Range = (function() {
    function Range(first, last) {
      this.first = first;
      this.last = last;
      if (this.is_numeric()) {
        this.size = this.last - this.first + 1;
      }
    }

    Range.prototype.to_array = function() {
      var _i, _ref, _ref1, _results;
      return (function() {
        _results = [];
        for (var _i = _ref = this.first, _ref1 = this.last; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
    };

    Range.prototype.includes = function(number) {
      return number >= this.first && number <= this.last;
    };

    Range.prototype.is_numeric = function() {
      return !(this.first instanceof Array) && !(this.last instanceof Array);
    };

    return Range;

  })();

  TwitterCldr.RangeSet = (function() {
    function RangeSet(ranges) {
      var range, _i, _len;
      this.ranges = [];
      for (_i = 0, _len = ranges.length; _i < _len; _i++) {
        range = ranges[_i];
        if (range instanceof TwitterCldr.Range) {
          this.ranges.push(new TwitterCldr.Range(range.first, range.last));
        } else {
          this.ranges.push(new TwitterCldr.Range(range, range));
        }
      }
      this.flatten();
    }

    RangeSet.from_array = function(array, compress) {
      if (compress == null) {
        compress = false;
      }
      return new TwitterCldr.RangeSet(this.rangify(array, compress));
    };

    RangeSet.rangify = function(list, compress) {
      var diff, item, last_item, sorted_list, sub_list, sub_lists, _i, _j, _len, _len1, _results;
      if (compress == null) {
        compress = false;
      }
      last_item = null;
      sorted_list = list.sort(function(a, b) {
        return a - b;
      });
      sub_lists = [];
      for (_i = 0, _len = sorted_list.length; _i < _len; _i++) {
        item = sorted_list[_i];
        if (last_item != null) {
          diff = item - last_item;
          if (diff > 0) {
            if (diff === 1) {
              sub_lists[sub_lists.length - 1].push(item);
            } else {
              sub_lists.push([item]);
            }
            last_item = item;
          }
        } else {
          sub_lists.push([item]);
          last_item = item;
        }
      }
      _results = [];
      for (_j = 0, _len1 = sub_lists.length; _j < _len1; _j++) {
        sub_list = sub_lists[_j];
        _results.push(compress && sub_list.length === 1 ? sub_list[0] : new TwitterCldr.Range(sub_list[0], sub_list[sub_list.length - 1]));
      }
      return _results;
    };

    RangeSet.prototype.to_array = function(compress) {
      var range, _i, _len, _ref, _results;
      if (compress == null) {
        compress = false;
      }
      if (compress) {
        _ref = this.ranges;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          range = _ref[_i];
          _results.push(range.first === range.last ? range.first : TwitterCldr.Utilities.clone(range));
        }
        return _results;
      } else {
        return TwitterCldr.Utilities.clone(this.ranges);
      }
    };

    RangeSet.prototype.to_full_array = function() {
      var range, result, _i, _len, _ref;
      result = [];
      _ref = this.ranges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        range = _ref[_i];
        result = result.concat(range.to_array());
      }
      return result;
    };

    RangeSet.prototype.includes = function(obj) {
      var range, _i, _j, _len, _len1, _ref, _ref1;
      if (obj instanceof TwitterCldr.Range) {
        _ref = this.ranges;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          range = _ref[_i];
          if (range.first <= obj.first && range.last >= obj.last) {
            return true;
          }
        }
      } else {
        _ref1 = this.ranges;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          range = _ref1[_j];
          if (range.includes(obj)) {
            return true;
          }
        }
      }
      return false;
    };

    RangeSet.prototype.is_empty = function() {
      return this.ranges.length === 0;
    };

    RangeSet.prototype.union = function(range_set) {
      return new TwitterCldr.RangeSet(this.ranges.concat(range_set.ranges));
    };

    RangeSet.prototype.intersection = function(range_set) {
      var intrsc, new_ranges, our_range, their_range, _i, _j, _len, _len1, _ref, _ref1;
      new_ranges = [];
      _ref = range_set.ranges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        their_range = _ref[_i];
        _ref1 = this.ranges;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          our_range = _ref1[_j];
          if (this.does_overlap(their_range, our_range)) {
            if (intrsc = this.find_intersection(their_range, our_range)) {
              new_ranges.push(intrsc);
            }
          }
        }
      }
      return new TwitterCldr.RangeSet(new_ranges);
    };

    RangeSet.prototype.subtract = function(range_set) {
      var current_ranges, new_ranges, our_range, remaining, their_range, _i, _len;
      if (range_set.is_empty()) {
        return new TwitterCldr.RangeSet(this.ranges);
      }
      remaining = TwitterCldr.Utilities.clone(range_set.ranges);
      current_ranges = TwitterCldr.Utilities.clone(this.ranges);
      while (their_range = remaining.shift()) {
        new_ranges = [];
        for (_i = 0, _len = current_ranges.length; _i < _len; _i++) {
          our_range = current_ranges[_i];
          if (this.does_overlap(their_range, our_range)) {
            new_ranges = new_ranges.concat(this.find_subtraction(their_range, our_range));
          } else {
            new_ranges.push(our_range);
          }
        }
        current_ranges = new_ranges;
      }
      return new TwitterCldr.RangeSet(new_ranges);
    };

    RangeSet.prototype.difference = function(range_set) {
      return this.union(range_set).subtract(this.intersection(range_set));
    };

    RangeSet.prototype.flatten = function() {
      var new_ranges, previous_range, range, sorted_ranges, _i, _len;
      if (this.ranges.length <= 1) {
        return;
      }
      sorted_ranges = this.ranges.sort((function(a, b) {
        if ((!a.is_numeric()) && (!b.is_numeric())) {
          return 1;
        }
        if (a.first > b.first) {
          return 1;
        } else if (a.first < b.first) {
          return -1;
        } else {
          return 0;
        }
      }));
      new_ranges = [sorted_ranges[0]];
      for (_i = 0, _len = sorted_ranges.length; _i < _len; _i++) {
        range = sorted_ranges[_i];
        previous_range = new_ranges.pop();
        if ((this.are_adjacent(previous_range, range)) || (this.does_overlap(previous_range, range))) {
          new_ranges.push(new TwitterCldr.Range(TwitterCldr.Utilities.min([range.first, previous_range.first]), TwitterCldr.Utilities.max([range.last, previous_range.last])));
        } else {
          new_ranges.push(previous_range);
          new_ranges.push(range);
        }
      }
      return this.ranges = new_ranges;
    };

    RangeSet.prototype.are_adjacent = function(range1, range2) {
      return range1.is_numeric() && range2.is_numeric() && ((range1.last === range2.first - 1) || (range2.first === range1.last + 1));
    };

    RangeSet.prototype.does_overlap = function(range1, range2) {
      return range1.is_numeric() && range2.is_numeric() && ((range1.last >= range2.first && range1.last <= range2.last) || (range1.first >= range2.first && range1.first <= range2.last) || (range1.first <= range2.first && range1.last >= range2.last));
    };

    RangeSet.prototype.find_intersection = function(range1, range2) {
      if (range2.first <= range1.first && range1.last <= range2.last) {
        return TwitterCldr.Utilities.clone(range1);
      } else if (range1.last >= range2.first && range1.last <= range2.last) {
        return new TwitterCldr.Range(range2.first, range1.last);
      } else if (range1.first >= range2.first && range1.first <= range2.last) {
        return new TwitterCldr.Range(range1.first, range2.last);
      } else if (range1.first <= range2.first && range1.last >= range2.last) {
        return new TwitterCldr.Range(TwitterCldr.Utilities.max([range1.first, range2.first]), TwitterCldr.Utilities.min([range1.last, range2.last]));
      }
    };

    RangeSet.prototype.find_subtraction = function(range1, range2) {
      var filtered_results, range, results, _i, _len;
      results = null;
      if (range1.first <= range2.first && range2.last <= range1.last) {
        results = [];
      } else if (range2.first <= range1.first && range2.last >= range1.last) {
        results = [new TwitterCldr.Range(range2.first, range1.first - 1), new TwitterCldr.Range(range1.last + 1, range2.last)];
      } else if (range2.last >= range1.first && range1.last >= range2.last) {
        results = [new TwitterCldr.Range(range2.first, range1.first - 1)];
      } else if (range1.last >= range2.first && range1.first <= range2.first) {
        results = [new TwitterCldr.Range(range1.last + 1, range2.last)];
      }
      filtered_results = [];
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        range = results[_i];
        if (range.first <= range.last) {
          filtered_results.push(range);
        }
      }
      return filtered_results;
    };

    return RangeSet;

  })();

  TwitterCldr.CodePoints = (function() {
    function CodePoints() {}

    CodePoints.to_char = function(code_point) {
      return TwitterCldr.Utilities.pack_array([code_point]);
    };

    CodePoints.from_char = function(char) {
      return TwitterCldr.Utilities.unpack_string(char[0])[0];
    };

    CodePoints.from_chars = function(chars) {
      var char, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = chars.length; _i < _len; _i++) {
        char = chars[_i];
        _results.push(this.from_char(char));
      }
      return _results;
    };

    CodePoints.to_chars = function(code_points) {
      var code_point, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = code_points.length; _i < _len; _i++) {
        code_point = code_points[_i];
        _results.push(this.to_char(code_point));
      }
      return _results;
    };

    CodePoints.from_string = function(str) {
      return TwitterCldr.Utilities.unpack_string(str);
    };

    CodePoints.to_string = function(code_points) {
      return this.to_chars(code_points).join("");
    };

    return CodePoints;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : (this.TwitterCldr = {}, this.TwitterCldr);

  for (key in TwitterCldr) {
    obj = TwitterCldr[key];
    root[key] = obj;
  }
=======
  TwitterCldr.Calendar.calendar = {"additional_formats":{"E":"ccc","EHm":"E HH:mm","EHms":"E HH:mm:ss","Ed":"d E","Ehm":"E h:mm a","Ehms":"E h:mm:ss a","Gy":"y G","GyMMM":"MMM y G","GyMMMEd":"E, MMM d, y G","GyMMMd":"MMM d, y G","H":"HH","Hm":"HH:mm","Hms":"HH:mm:ss","M":"L","MEd":"E, M/d","MMM":"LLL","MMMEd":"E, MMM d","MMMd":"MMM d","Md":"M/d","d":"d","h":"h a","hm":"h:mm a","hms":"h:mm:ss a","ms":"mm:ss","y":"y","yM":"M/y","yMEd":"E, M/d/y","yMMM":"MMM y","yMMMEd":"E, MMM d, y","yMMMd":"MMM d, y","yMd":"M/d/y","yQQQ":"QQQ y","yQQQQ":"QQQQ y"},"days":{"format":{"abbreviated":{"fri":"Fri","mon":"Mon","sat":"Sat","sun":"Sun","thu":"Thu","tue":"Tue","wed":"Wed"},"narrow":"calendars.gregorian.days.stand-alone.narrow","short":{"fri":"Fr","mon":"Mo","sat":"Sa","sun":"Su","thu":"Th","tue":"Tu","wed":"We"},"wide":{"fri":"Friday","mon":"Monday","sat":"Saturday","sun":"Sunday","thu":"Thursday","tue":"Tuesday","wed":"Wednesday"}},"stand-alone":{"abbreviated":"calendars.gregorian.days.format.abbreviated","narrow":{"fri":"F","mon":"M","sat":"S","sun":"S","thu":"T","tue":"T","wed":"W"},"short":"calendars.gregorian.days.format.short","wide":"calendars.gregorian.days.format.wide"}},"eras":{"abbr":{"0":"BCE","1":"CE"},"name":{"0":"Before Common Era","1":"Common Era"},"narrow":{"0":"B","1":"A"}},"fields":{"day":"Day","day-short":"day","dayperiod":"AM/PM","era":"Era","hour":"Hour","hour-short":"hr.","minute":"Minute","minute-short":"min.","month":"Month","month-short":"mo.","quarter":"Quarter","quarter-short":"qtr.","second":"Second","second-short":"sec.","week":"Week","week-short":"wk.","weekday":"Day of the Week","year":"Year","year-short":"yr.","zone":"Time Zone"},"formats":{"date":{"full":{"pattern":"EEEE, MMMM d, y"},"long":{"pattern":"MMMM d, y"},"medium":{"pattern":"MMM d, y"},"short":{"pattern":"M/d/yy"}},"datetime":{"full":{"pattern":"{{date}} 'at' {{time}}"},"long":{"pattern":"{{date}} 'at' {{time}}"},"medium":{"pattern":"{{date}}, {{time}}"},"short":{"pattern":"{{date}}, {{time}}"}},"time":{"full":{"pattern":"h:mm:ss a zzzz"},"long":{"pattern":"h:mm:ss a z"},"medium":{"pattern":"h:mm:ss a"},"short":{"pattern":"h:mm a"}}},"months":{"format":{"abbreviated":{"1":"Jan","10":"Oct","11":"Nov","12":"Dec","2":"Feb","3":"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sep"},"narrow":"calendars.gregorian.months.stand-alone.narrow","wide":{"1":"January","10":"October","11":"November","12":"December","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September"}},"stand-alone":{"abbreviated":"calendars.gregorian.months.format.abbreviated","narrow":{"1":"J","10":"O","11":"N","12":"D","2":"F","3":"M","4":"A","5":"M","6":"J","7":"J","8":"A","9":"S"},"wide":"calendars.gregorian.months.format.wide"}},"periods":{"format":{"abbreviated":"calendars.gregorian.dayPeriods.format.wide","narrow":{"am":"a","noon":"n","pm":"p"},"wide":{"am":"AM","noon":"noon","pm":"PM","variant":{"am":"am","pm":"pm"}}},"stand-alone":{}},"quarters":{"format":{"abbreviated":{"1":"Q1","2":"Q2","3":"Q3","4":"Q4"},"narrow":"calendars.gregorian.quarters.stand-alone.narrow","wide":{"1":"1st quarter","2":"2nd quarter","3":"3rd quarter","4":"4th quarter"}},"stand-alone":{"abbreviated":"calendars.gregorian.quarters.format.abbreviated","narrow":{"1":1,"2":2,"3":3,"4":4},"wide":"calendars.gregorian.quarters.format.wide"}}};
>>>>>>> Separated data/logic for the calendar modules.

}).call(this);
