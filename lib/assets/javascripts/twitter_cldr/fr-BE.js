
/*
// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

// TwitterCLDR (JavaScript) v2.3.3
// Authors:     Cameron Dutro [@camertron]
                Kirill Lashuk [@KL_7]
                portions by Sven Fuchs [@svenfuchs]
// Homepage:    https://twitter.com
// Description: Provides date, time, number, and list formatting functionality for various Twitter-supported locales in Javascript.
 */


/*-module-*/
/*_lib/twitter_cldr_*/

(function() {
  var TwitterCldr, key, obj, root,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  TwitterCldr = {};

  TwitterCldr.is_rtl = false;

  TwitterCldr.locale = "fr-BE";

  TwitterCldr.Utilities = (function() {
    function Utilities() {}

    Utilities.from_char_code = function(code_point) {
      if (code_point > 0xFFFF) {
        code_point -= 0x10000;
        return String.fromCharCode(0xD800 + (code_point >> 10), 0xDC00 + (code_point & 0x3FF));
      } else {
        return String.fromCharCode(code_point);
      }
    };

    Utilities.char_code_at = function(str, idx) {
      var code, end, hi, li, low, surrogatePairs;
      str += '';
      end = str.length;
      surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      while (surrogatePairs.exec(str) !== null) {
        li = surrogatePairs.lastIndex;
        if (li - 2 < idx) {
          idx += 1;
        } else {
          break;
        }
      }
      if ((idx >= end) || (idx < 0)) {
        return NaN;
      }
      code = str.charCodeAt(idx);
      if ((0xD800 <= code) && (code <= 0xDBFF)) {
        hi = code;
        low = str.charCodeAt(idx + 1);
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
      }
      return code;
    };

    Utilities.unpack_string = function(str) {
      var code_point, idx, l, ref, result;
      result = [];
      for (idx = l = 0, ref = str.length; 0 <= ref ? l < ref : l > ref; idx = 0 <= ref ? ++l : --l) {
        code_point = this.char_code_at(str, idx);
        if (!code_point) {
          break;
        }
        result.push(code_point);
      }
      return result;
    };

    Utilities.pack_array = function(char_arr) {
      var cur_char;
      return ((function() {
        var l, len1, results;
        results = [];
        for (l = 0, len1 = char_arr.length; l < len1; l++) {
          cur_char = char_arr[l];
          results.push(this.from_char_code(cur_char));
        }
        return results;
      }).call(this)).join("");
    };

    Utilities.arraycopy = function(orig, orig_index, dest, dest_index, length) {
      var count, elem, l, len1, ref;
      ref = orig.slice(orig_index, orig_index + length);
      for (count = l = 0, len1 = ref.length; l < len1; count = ++l) {
        elem = ref[count];
        dest[dest_index + count] = elem;
      }
    };

    Utilities.max = function(arr) {
      var elem, i, l, len1, m, max, ref, ref1, start_index;
      max = null;
      for (start_index = l = 0, len1 = arr.length; l < len1; start_index = ++l) {
        elem = arr[start_index];
        if (elem != null) {
          max = elem;
          break;
        }
      }
      for (i = m = ref = start_index, ref1 = arr.length; ref <= ref1 ? m <= ref1 : m >= ref1; i = ref <= ref1 ? ++m : --m) {
        if (arr[i] > max) {
          max = arr[i];
        }
      }
      return max;
    };

    Utilities.min = function(arr) {
      var elem, i, l, len1, m, min, ref, ref1, start_index;
      min = null;
      for (start_index = l = 0, len1 = arr.length; l < len1; start_index = ++l) {
        elem = arr[start_index];
        if (elem != null) {
          min = elem;
          break;
        }
      }
      for (i = m = ref = start_index, ref1 = arr.length; ref <= ref1 ? m <= ref1 : m >= ref1; i = ref <= ref1 ? ++m : --m) {
        if (arr[i] < min) {
          min = arr[i];
        }
      }
      return min;
    };

    Utilities.is_even = function(num) {
      return num % 2 === 0;
    };

    Utilities.is_odd = function(num) {
      return num % 2 === 1;
    };

    return Utilities;

  })();

  TwitterCldr.PluralRules = (function() {
    function PluralRules() {}

    PluralRules.rules = {"keys": ["one","other"], "rule": function(n) { return (function() { if (((n >= 0) && (n <= 2)) && !(n == 2)) { return "one" } else { return "other" } })(); }};

    PluralRules.all = function() {
      return this.rules.keys;
    };

    PluralRules.rule_for = function(number) {
      var error;
      try {
        return this.rules.rule(number);
      } catch (_error) {
        error = _error;
        return "other";
      }
    };

    return PluralRules;

  })();

  TwitterCldr.TimespanFormatter = (function() {
    function TimespanFormatter() {
      this.approximate_multiplier = 0.75;
      this.default_type = "default";
      this.patterns = {"ago":{"second":{"default":{"one":"il y a {0} seconde","other":"il y a {0} secondes"}},"minute":{"default":{"one":"il y a {0} minute","other":"il y a {0} minutes"}},"hour":{"default":{"one":"il y a {0} heure","other":"il y a {0} heures"}},"day":{"default":{"one":"il y a {0} jour","other":"il y a {0} jours"}},"week":{"default":{"one":"il y a {0} semaine","other":"il y a {0} semaines"}},"month":{"default":{"one":"il y a {0} mois","other":"il y a {0} mois"}},"year":{"default":{"one":"il y a {0} an","other":"il y a {0} ans"}}},"until":{"second":{"default":{"one":"dans {0} seconde","other":"dans {0} secondes"}},"minute":{"default":{"one":"dans {0} minute","other":"dans {0} minutes"}},"hour":{"default":{"one":"dans {0} heure","other":"dans {0} heures"}},"day":{"default":{"one":"dans {0} jour","other":"dans {0} jours"}},"week":{"default":{"one":"dans {0} semaine","other":"dans {0} semaines"}},"month":{"default":{"one":"dans {0} mois","other":"dans {0} mois"}},"year":{"default":{"one":"dans {0} an","other":"dans {0} ans"}}},"none":{"second":{"default":{"one":"{0} seconde","other":"{0} secondes"},"short":{"one":"{0} s","other":"{0} s"}},"minute":{"default":{"one":"{0} minute","other":"{0} minutes"},"short":{"one":"{0} min","other":"{0} min"}},"hour":{"default":{"one":"{0} heure","other":"{0} heures"},"short":{"one":"{0} h","other":"{0} h"}},"day":{"default":{"one":"{0} jour","other":"{0} jours"},"short":{"one":"{0} j","other":"{0} j"}},"week":{"default":{"one":"{0} semaine","other":"{0} semaines"},"short":{"one":"{0} sem.","other":"{0} sem."}},"month":{"default":{"one":"{0} mois","other":"{0} mois"},"short":{"one":"{0} mois","other":"{0} mois"}},"year":{"default":{"one":"{0} année","other":"{0} années"},"short":{"one":"{0} an","other":"{0} ans"}}}};
      this.time_in_seconds = {
        "second": 1,
        "minute": 60,
        "hour": 3600,
        "day": 86400,
        "week": 604800,
        "month": 2629743.83,
        "year": 31556926
      };
    }

    TimespanFormatter.prototype.format = function(seconds, fmt_options) {
      var key, number, obj, options;
      if (fmt_options == null) {
        fmt_options = {};
      }
      options = {};
      for (key in fmt_options) {
        obj = fmt_options[key];
        options[key] = obj;
      }
      options["direction"] || (options["direction"] = (seconds < 0 ? "ago" : "until"));
      if (options["unit"] === null || options["unit"] === void 0) {
        options["unit"] = this.calculate_unit(Math.abs(seconds), options);
      }
      options["type"] || (options["type"] = this.default_type);
      options["number"] = this.calculate_time(Math.abs(seconds), options["unit"]);
      number = this.calculate_time(Math.abs(seconds), options["unit"]);
      options["rule"] = TwitterCldr.PluralRules.rule_for(number);
      return this.patterns[options["direction"]][options["unit"]][options["type"]][options["rule"]].replace(/\{[0-9]\}/, number.toString());
    };

    TimespanFormatter.prototype.calculate_unit = function(seconds, unit_options) {
      var key, multiplier, obj, options;
      if (unit_options == null) {
        unit_options = {};
      }
      options = {};
      for (key in unit_options) {
        obj = unit_options[key];
        options[key] = obj;
      }
      if (options.approximate == null) {
        options["approximate"] = false;
      }
      multiplier = options.approximate ? this.approximate_multiplier : 1;
      if (seconds < (this.time_in_seconds.minute * multiplier)) {
        return "second";
      } else if (seconds < (this.time_in_seconds.hour * multiplier)) {
        return "minute";
      } else if (seconds < (this.time_in_seconds.day * multiplier)) {
        return "hour";
      } else if (seconds < (this.time_in_seconds.week * multiplier)) {
        return "day";
      } else if (seconds < (this.time_in_seconds.month * multiplier)) {
        return "week";
      } else if (seconds < (this.time_in_seconds.year * multiplier)) {
        return "month";
      } else {
        return "year";
      }
    };

    TimespanFormatter.prototype.calculate_time = function(seconds, unit) {
      return Math.round(seconds / this.time_in_seconds[unit]);
    };

    return TimespanFormatter;

  })();

  TwitterCldr.DateTimeFormatter = (function() {
    function DateTimeFormatter() {
      this.tokens = {"date_time":{"default":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"full":[{"value":"EEEE","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"H","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'h'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'min'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'s'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"zzzz","type":"pattern"}],"long":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"z","type":"pattern"}],"medium":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"short":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"MM","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"yy","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"additional":{"EHm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"pattern"},{"value":" 'h'","type":"plaintext"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"}],"MMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"}],"Md":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMM":[{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"QQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQQ":[{"value":"QQQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}]}},"time":{"default":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"full":[{"value":"H","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'h'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'min'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'s'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"zzzz","type":"pattern"}],"long":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"z","type":"pattern"}],"medium":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"short":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"additional":{"EHm":[{"value":"E ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"E d","type":"plaintext"}],"Ehm":[{"value":"E ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y G","type":"plaintext"}],"GyMMM":[{"value":"MMM y G","type":"plaintext"}],"GyMMMEd":[{"value":"E d MMM y G","type":"plaintext"}],"GyMMMd":[{"value":"d MMM y G","type":"plaintext"}],"H":[{"value":"HH","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'h'","type":"plaintext"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"plaintext"}],"MEd":[{"value":"E d/M","type":"plaintext"}],"MMM":[{"value":"LLL","type":"plaintext"}],"MMMEd":[{"value":"E d MMM","type":"plaintext"}],"MMMd":[{"value":"d MMM","type":"plaintext"}],"Md":[{"value":"d/M","type":"plaintext"}],"d":[{"value":"d","type":"plaintext"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"plaintext"}],"yM":[{"value":"M/y","type":"plaintext"}],"yMEd":[{"value":"E d/M/y","type":"plaintext"}],"yMMM":[{"value":"MMM y","type":"plaintext"}],"yMMMEd":[{"value":"E d MMM y","type":"plaintext"}],"yMMMM":[{"value":"MMMM y","type":"plaintext"}],"yMMMd":[{"value":"d MMM y","type":"plaintext"}],"yMd":[{"value":"d/M/y","type":"plaintext"}],"yQQQ":[{"value":"QQQ y","type":"plaintext"}],"yQQQQ":[{"value":"QQQQ y","type":"plaintext"}]}},"date":{"default":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"full":[{"value":"EEEE","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"long":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"medium":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"short":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"MM","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"yy","type":"pattern"}],"additional":{"EHm":[{"value":"E","type":"pattern"},{"value":" HH:mm","type":"plaintext"}],"EHms":[{"value":"E","type":"pattern"},{"value":" HH:mm:ss","type":"plaintext"}],"Ed":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" h:mm a","type":"plaintext"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" h:mm:ss a","type":"plaintext"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"plaintext"},{"value":" 'h'","type":"plaintext"}],"Hm":[{"value":"HH:mm","type":"plaintext"}],"Hms":[{"value":"HH:mm:ss","type":"plaintext"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"}],"MMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"}],"Md":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h a","type":"plaintext"}],"hm":[{"value":"h:mm a","type":"plaintext"}],"hms":[{"value":"h:mm:ss a","type":"plaintext"}],"ms":[{"value":"mm:ss","type":"plaintext"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMM":[{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"QQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQQ":[{"value":"QQQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}]}}};
      this.weekday_keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      this.methods = {
        'G': 'era',
        'y': 'year',
        'Y': 'year_of_week_of_year',
        'Q': 'quarter',
        'q': 'quarter_stand_alone',
        'M': 'month',
        'L': 'month_stand_alone',
        'w': 'week_of_year',
        'W': 'week_of_month',
        'd': 'day',
        'D': 'day_of_month',
        'F': 'day_of_week_in_month',
        'E': 'weekday',
        'e': 'weekday_local',
        'c': 'weekday_local_stand_alone',
        'a': 'period',
        'h': 'hour',
        'H': 'hour',
        'K': 'hour',
        'k': 'hour',
        'm': 'minute',
        's': 'second',
        'S': 'second_fraction',
        'z': 'timezone',
        'Z': 'timezone',
        'v': 'timezone_generic_non_location',
        'V': 'timezone_metazone'
      };
    }

    DateTimeFormatter.prototype.format = function(obj, options) {
      var format_token, token, tokens;
      format_token = (function(_this) {
        return function(token) {
          var result;
          result = "";
          switch (token.type) {
            case "pattern":
              return _this.result_for_token(token, obj);
            default:
              return token.value.replace(/'([^']+)'/g, '$1');
          }
        };
      })(this);
      tokens = this.get_tokens(obj, options);
      return ((function() {
        var l, len1, results;
        results = [];
        for (l = 0, len1 = tokens.length; l < len1; l++) {
          token = tokens[l];
          results.push(format_token(token));
        }
        return results;
      })()).join("");
    };

    DateTimeFormatter.prototype.get_tokens = function(obj, options) {
      var format, type;
      format = options.format || "date_time";
      type = options.type || "default";
      if (format === "additional") {
        return this.tokens["date_time"][format][this.additional_format_selector().find_closest(options.type)];
      } else {
        return this.tokens[format][type];
      }
    };

    DateTimeFormatter.prototype.result_for_token = function(token, date) {
      return this[this.methods[token.value[0]]](date, token.value, token.value.length);
    };

    DateTimeFormatter.prototype.additional_format_selector = function() {
      return new TwitterCldr.AdditionalDateFormatSelector(this.tokens["date_time"]["additional"]);
    };

    DateTimeFormatter.additional_formats = function() {
      return new TwitterCldr.DateTimeFormatter().additional_format_selector().patterns();
    };

    DateTimeFormatter.prototype.era = function(date, pattern, length) {
      var choices, index, result;
      switch (length) {
        case 0:
          choices = ["", ""];
          break;
        case 1:
        case 2:
        case 3:
          choices = TwitterCldr.Calendar.calendar["eras"]["abbr"];
          break;
        default:
          choices = TwitterCldr.Calendar.calendar["eras"]["name"];
      }
      index = date.getFullYear() < 0 ? 0 : 1;
      result = choices[index];
      if (result != null) {
        return result;
      } else {
        return this.era(date, pattern.slice(0, -1), length - 1);
      }
    };

    DateTimeFormatter.prototype.year = function(date, pattern, length) {
      var year;
      year = date.getFullYear().toString();
      if (length === 2) {
        if (year.length !== 1) {
          year = year.slice(-2);
        }
      }
      if (length > 1) {
        year = ("0000" + year).slice(-length);
      }
      return year;
    };

    DateTimeFormatter.prototype.year_of_week_of_year = function(date, pattern, length) {
      throw 'not implemented';
    };

    DateTimeFormatter.prototype.day_of_week_in_month = function(date, pattern, length) {
      throw 'not implemented';
    };

    DateTimeFormatter.prototype.quarter = function(date, pattern, length) {
      var quarter;
      quarter = ((date.getMonth() / 3) | 0) + 1;
      switch (length) {
        case 1:
          return quarter.toString();
        case 2:
          return ("0000" + quarter.toString()).slice(-length);
        case 3:
          return TwitterCldr.Calendar.quarters({
            format: 'format',
            names_form: 'abbreviated'
          })[quarter];
        case 4:
          return TwitterCldr.Calendar.quarters({
            format: 'format',
            names_form: 'wide'
          })[quarter];
      }
    };

    DateTimeFormatter.prototype.quarter_stand_alone = function(date, pattern, length) {
      var quarter;
      quarter = (date.getMonth() - 1) / 3 + 1;
      switch (length) {
        case 1:
          return quarter.toString();
        case 2:
          return ("0000" + quarter.toString()).slice(-length);
        case 3:
          throw 'not yet implemented (requires cldr\'s "multiple inheritance")';
          break;
        case 4:
          throw 'not yet implemented (requires cldr\'s "multiple inheritance")';
          break;
        case 5:
          return TwitterCldr.Calendar.quarters({
            format: 'stand-alone',
            names_form: 'narrow'
          })[quarter];
      }
    };

    DateTimeFormatter.prototype.month = function(date, pattern, length) {
      var month, month_str;
      month = date.getMonth();
      month_str = (month + 1).toString();
      switch (length) {
        case 1:
          return month_str;
        case 2:
          return ("0000" + month_str).slice(-length);
        case 3:
          return TwitterCldr.Calendar.months({
            format: 'format',
            names_form: 'abbreviated'
          })[month];
        case 4:
          return TwitterCldr.Calendar.months({
            format: 'format',
            names_form: 'wide'
          })[month];
        case 5:
          throw 'not yet implemented (requires cldr\'s "multiple inheritance")';
          break;
        default:
          throw "Unknown date format";
      }
    };

    DateTimeFormatter.prototype.month_stand_alone = function(date, pattern, length) {
      var month, month_str;
      month = date.getMonth();
      month_str = (month + 1).toString();
      switch (length) {
        case 1:
          return month_str;
        case 2:
          return ("0000" + month_str).slice(-length);
        case 3:
          return TwitterCldr.Calendar.months({
            format: 'stand-alone',
            names_form: 'abbreviated'
          })[month];
        case 4:
          return TwitterCldr.Calendar.months({
            format: 'stand-alone',
            names_form: 'wide'
          })[month];
        case 5:
          return TwitterCldr.Calendar.months({
            format: 'stand-alone',
            names_form: 'narrow'
          })[month];
        default:
          throw "Unknown date format";
      }
    };

    DateTimeFormatter.prototype.day = function(date, pattern, length) {
      switch (length) {
        case 1:
          return date.getDate().toString();
        case 2:
          return ("0000" + date.getDate().toString()).slice(-length);
      }
    };

    DateTimeFormatter.prototype.weekday = function(date, pattern, length) {
      var key;
      key = this.weekday_keys[date.getDay()];
      switch (length) {
        case 1:
        case 2:
        case 3:
          return TwitterCldr.Calendar.weekdays({
            format: 'format',
            names_form: 'abbreviated'
          })[key];
        case 4:
          return TwitterCldr.Calendar.weekdays({
            format: 'format',
            names_form: 'wide'
          })[key];
        case 5:
          return TwitterCldr.Calendar.weekdays({
            format: 'stand-alone',
            names_form: 'narrow'
          })[key];
      }
    };

    DateTimeFormatter.prototype.weekday_local = function(date, pattern, length) {
      var day;
      switch (length) {
        case 1:
        case 2:
          day = date.getDay();
          if (day === 0) {
            return "7";
          } else {
            return day.toString();
          }
          break;
        default:
          return this.weekday(date, pattern, length);
      }
    };

    DateTimeFormatter.prototype.weekday_local_stand_alone = function(date, pattern, length) {
      switch (length) {
        case 1:
          return this.weekday_local(date, pattern, length);
        default:
          return this.weekday(date, pattern, length);
      }
    };

    DateTimeFormatter.prototype.period = function(time, pattern, length) {
      if (time.getHours() > 11) {
        return TwitterCldr.Calendar.periods({
          format: 'format',
          names_form: 'wide'
        })["pm"];
      } else {
        return TwitterCldr.Calendar.periods({
          format: 'format',
          names_form: 'wide'
        })["am"];
      }
    };

    DateTimeFormatter.prototype.hour = function(time, pattern, length) {
      var hour;
      hour = time.getHours();
      switch (pattern[0]) {
        case 'h':
          if (hour > 12) {
            hour = hour - 12;
          } else if (hour === 0) {
            hour = 12;
          }
          break;
        case 'K':
          if (hour > 11) {
            hour = hour - 12;
          }
          break;
        case 'k':
          if (hour === 0) {
            hour = 24;
          }
      }
      if (length === 1) {
        return hour.toString();
      } else {
        return ("000000" + hour.toString()).slice(-length);
      }
    };

    DateTimeFormatter.prototype.minute = function(time, pattern, length) {
      if (length === 1) {
        return time.getMinutes().toString();
      } else {
        return ("000000" + time.getMinutes().toString()).slice(-length);
      }
    };

    DateTimeFormatter.prototype.second = function(time, pattern, length) {
      if (length === 1) {
        return time.getSeconds().toString();
      } else {
        return ("000000" + time.getSeconds().toString()).slice(-length);
      }
    };

    DateTimeFormatter.prototype.second_fraction = function(time, pattern, length) {
      if (length > 6) {
        throw 'can not use the S format with more than 6 digits';
      }
      return ("000000" + Math.round(Math.pow(time.getMilliseconds() * 100.0, 6 - length)).toString()).slice(-length);
    };

    DateTimeFormatter.prototype.timezone = function(time, pattern, length) {
      var hours, minutes, offset, offsetString, sign;
      offset = time.getTimezoneOffset();
      hours = ("00" + (Math.floor(Math.abs(offset) / 60)).toString()).slice(-2);
      minutes = ("00" + (Math.abs(offset) % 60).toString()).slice(-2);
      sign = offset > 0 ? "-" : "+";
      offsetString = sign + hours + ":" + minutes;
      switch (length) {
        case 1:
        case 2:
        case 3:
          return offsetString;
        default:
          return "UTC" + offsetString;
      }
    };

    DateTimeFormatter.prototype.timezone_generic_non_location = function(time, pattern, length) {
      throw 'not yet implemented (requires timezone translation data")';
    };

    return DateTimeFormatter;

  })();

  TwitterCldr.AdditionalDateFormatSelector = (function() {
    function AdditionalDateFormatSelector(pattern_hash) {
      this.pattern_hash = pattern_hash;
    }

    AdditionalDateFormatSelector.prototype.find_closest = function(goal_pattern) {
      var key, min_key, min_rank, rank, ranks;
      if ((goal_pattern == null) || goal_pattern.replace(/^\s+|\s+$/g, "").length === 0) {
        return null;
      } else {
        ranks = this.rank(goal_pattern);
        min_rank = 100;
        min_key = null;
        for (key in ranks) {
          rank = ranks[key];
          if (rank < min_rank) {
            min_rank = rank;
            min_key = key;
          }
        }
        return min_key;
      }
    };

    AdditionalDateFormatSelector.prototype.patterns = function() {
      var key, results;
      results = [];
      for (key in this.pattern_hash) {
        results.push(key);
      }
      return results;
    };

    AdditionalDateFormatSelector.prototype.separate = function(pattern_key) {
      var cur_char, l, last_char, len1, result;
      last_char = "";
      result = [];
      for (l = 0, len1 = pattern_key.length; l < len1; l++) {
        cur_char = pattern_key[l];
        if (cur_char === last_char) {
          result[result.length - 1] += cur_char;
        } else {
          result.push(cur_char);
        }
        last_char = cur_char;
      }
      return result;
    };

    AdditionalDateFormatSelector.prototype.all_separated_patterns = function() {
      var key, results;
      results = [];
      for (key in this.pattern_hash) {
        results.push(this.separate(key));
      }
      return results;
    };

    AdditionalDateFormatSelector.prototype.score = function(entities, goal_entities) {
      var score;
      score = this.exist_score(entities, goal_entities) * 2;
      score += this.position_score(entities, goal_entities);
      return score + this.count_score(entities, goal_entities);
    };

    AdditionalDateFormatSelector.prototype.position_score = function(entities, goal_entities) {
      var found, goal_entity, index, sum;
      sum = 0;
      for (index in goal_entities) {
        goal_entity = goal_entities[index];
        found = entities.indexOf(goal_entity);
        if (found > -1) {
          sum += Math.abs(found - index);
        }
      }
      return sum;
    };

    AdditionalDateFormatSelector.prototype.exist_score = function(entities, goal_entities) {
      var count, entity, goal_entity, l, len1;
      count = 0;
      for (l = 0, len1 = goal_entities.length; l < len1; l++) {
        goal_entity = goal_entities[l];
        if (!(((function() {
          var len2, m, results;
          results = [];
          for (m = 0, len2 = entities.length; m < len2; m++) {
            entity = entities[m];
            if (entity[0] === goal_entity[0]) {
              results.push(entity);
            }
          }
          return results;
        })()).length > 0)) {
          count += 1;
        }
      }
      return count;
    };

    AdditionalDateFormatSelector.prototype.count_score = function(entities, goal_entities) {
      var entity, found_entity, goal_entity, l, len1, sum;
      sum = 0;
      for (l = 0, len1 = goal_entities.length; l < len1; l++) {
        goal_entity = goal_entities[l];
        found_entity = ((function() {
          var len2, m, results;
          results = [];
          for (m = 0, len2 = entities.length; m < len2; m++) {
            entity = entities[m];
            if (entity[0] === goal_entity[0]) {
              results.push(entity);
            }
          }
          return results;
        })())[0];
        if (found_entity != null) {
          sum += Math.abs(found_entity.length - goal_entity.length);
        }
      }
      return sum;
    };

    AdditionalDateFormatSelector.prototype.rank = function(goal_pattern) {
      var l, len1, ref, result, separated_goal_pattern, separated_pattern;
      separated_goal_pattern = this.separate(goal_pattern);
      result = {};
      ref = this.all_separated_patterns();
      for (l = 0, len1 = ref.length; l < len1; l++) {
        separated_pattern = ref[l];
        result[separated_pattern.join("")] = this.score(separated_pattern, separated_goal_pattern);
      }
      return result;
    };

    return AdditionalDateFormatSelector;

  })();

  TwitterCldr.NumberFormatter = (function() {
    function NumberFormatter() {
      this.all_tokens = {"default":{"positive":["","#,##0.###"],"negative":["-","#,##0.###"]},"decimal":{"positive":["","#,##0.###"],"negative":["-","#,##0.###"]},"long_decimal":{"positive":{"1000":["","0"," mille"],"10000":["","00"," mille"],"100000":["","000"," mille"],"1000000":["","0"," millions"],"10000000":["","00"," millions"],"100000000":["","000"," millions"],"1000000000":["","0"," milliards"],"10000000000":["","00"," milliards"],"100000000000":["","000"," milliards"],"1000000000000":["","0"," billions"],"10000000000000":["","00"," billions"],"100000000000000":["","000"," billions"]},"negative":{"1000":["-","0"," mille"],"10000":["-","00"," mille"],"100000":["-","000"," mille"],"1000000":["-","0"," millions"],"10000000":["-","00"," millions"],"100000000":["-","000"," millions"],"1000000000":["-","0"," milliards"],"10000000000":["-","00"," milliards"],"100000000000":["-","000"," milliards"],"1000000000000":["-","0"," billions"],"10000000000000":["-","00"," billions"],"100000000000000":["-","000"," billions"]}},"short_decimal":{"positive":{"1000":["","0"," k"],"10000":["","00"," k"],"100000":["","000"," k"],"1000000":["","0"," M"],"10000000":["","00"," M"],"100000000":["","000"," M"],"1000000000":["","0"," Md"],"10000000000":["","00"," Md"],"100000000000":["","000"," Md"],"1000000000000":["","0"," Bn"],"10000000000000":["","00"," Bn"],"100000000000000":["","000"," Bn"]},"negative":{"1000":["-","0"," k"],"10000":["-","00"," k"],"100000":["-","000"," k"],"1000000":["-","0"," M"],"10000000":["-","00"," M"],"100000000":["-","000"," M"],"1000000000":["-","0"," Md"],"10000000000":["-","00"," Md"],"100000000000":["-","000"," Md"],"1000000000000":["-","0"," Bn"],"10000000000000":["-","00"," Bn"],"100000000000000":["-","000"," Bn"]}},"currency":{"positive":["","#,##0.00"," ¤"],"negative":["(","#,##0.00"," ¤)"]},"percent":{"positive":["","#,##0"," %"],"negative":["-","#,##0"," %"]}};
      this.tokens = [];
      this.symbols = {"alias":"","decimal":",","exponential":"E","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×"};
      this.default_symbols = {
        'group': ',',
        'decimal': '.',
        'plus_sign': '+',
        'minus_sign': '-'
      };
    }

    NumberFormatter.prototype.format = function(number, options) {
      var fraction, fraction_format, integer_format, intg, key, opts, prefix, ref, ref1, result, sign, suffix, tokens, val;
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
        ref = this.partition_tokens(tokens), prefix = ref[0], suffix = ref[1], integer_format = ref[2], fraction_format = ref[3];
        number = this.truncate_number(number, integer_format);
        ref1 = this.parse_number(number, opts), intg = ref1[0], fraction = ref1[1];
        result = integer_format.apply(parseFloat(intg), opts);
        if (fraction) {
          result += fraction_format.apply(fraction, opts);
        }
        sign = number < 0 && prefix !== "-" ? this.symbols.minus_sign || this.default_symbols.minus_sign : "";
        return "" + prefix + result + suffix;
      } else {
        return number.toString();
      }
    };

    NumberFormatter.prototype.truncate_number = function(number, integer_format) {
      return number;
    };

    NumberFormatter.prototype.partition_tokens = function(tokens) {
      return [tokens[0] || "", tokens[2] || "", new TwitterCldr.NumberFormatter.IntegerHelper(tokens[1], this.symbols), new TwitterCldr.NumberFormatter.FractionHelper(tokens[1], this.symbols)];
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

  TwitterCldr.PercentFormatter = (function(superClass) {
    extend(PercentFormatter, superClass);

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
      return PercentFormatter.__super__.format.call(this, number, options).replace('¤', this.symbols.percent_sign || this.default_percent_sign);
    };

    PercentFormatter.prototype.default_format_options_for = function(number) {
      return {
        precision: 0
      };
    };

    PercentFormatter.prototype.get_tokens = function(number, options) {
      if (number < 0) {
        return this.all_tokens.percent.negative;
      } else {
        return this.all_tokens.percent.positive;
      }
    };

    return PercentFormatter;

  })(TwitterCldr.NumberFormatter);

  TwitterCldr.DecimalFormatter = (function(superClass) {
    extend(DecimalFormatter, superClass);

    function DecimalFormatter() {
      return DecimalFormatter.__super__.constructor.apply(this, arguments);
    }

    DecimalFormatter.prototype.format = function(number, options) {
      var error;
      if (options == null) {
        options = {};
      }
      try {
        return DecimalFormatter.__super__.format.call(this, number, options);
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
        return this.all_tokens.decimal.negative;
      } else {
        return this.all_tokens.decimal.positive;
      }
    };

    return DecimalFormatter;

  })(TwitterCldr.NumberFormatter);

  TwitterCldr.CurrencyFormatter = (function(superClass) {
    extend(CurrencyFormatter, superClass);

    function CurrencyFormatter(options) {
      if (options == null) {
        options = {};
      }
      this.currencies_data = {"ADP":{"digits":0,"rounding":0},"AFN":{"digits":0,"rounding":0},"ALL":{"digits":0,"rounding":0},"AMD":{"digits":0,"rounding":0},"BHD":{"digits":3,"rounding":0},"BIF":{"digits":0,"rounding":0},"BYR":{"digits":0,"rounding":0},"CAD":{"digits":2,"rounding":0},"CHF":{"digits":2,"rounding":0},"CLF":{"digits":0,"rounding":0},"CLP":{"digits":0,"rounding":0},"COP":{"digits":0,"rounding":0},"CRC":{"digits":0,"rounding":0},"DEFAULT":{"digits":2,"rounding":0},"DJF":{"digits":0,"rounding":0},"ESP":{"digits":0,"rounding":0},"GNF":{"digits":0,"rounding":0},"GYD":{"digits":0,"rounding":0},"HUF":{"digits":0,"rounding":0},"IDR":{"digits":0,"rounding":0},"IQD":{"digits":0,"rounding":0},"IRR":{"digits":0,"rounding":0},"ISK":{"digits":0,"rounding":0},"ITL":{"digits":0,"rounding":0},"JOD":{"digits":3,"rounding":0},"JPY":{"digits":0,"rounding":0},"KMF":{"digits":0,"rounding":0},"KPW":{"digits":0,"rounding":0},"KRW":{"digits":0,"rounding":0},"KWD":{"digits":3,"rounding":0},"LAK":{"digits":0,"rounding":0},"LBP":{"digits":0,"rounding":0},"LUF":{"digits":0,"rounding":0},"LYD":{"digits":3,"rounding":0},"MGA":{"digits":0,"rounding":0},"MGF":{"digits":0,"rounding":0},"MMK":{"digits":0,"rounding":0},"MNT":{"digits":0,"rounding":0},"MRO":{"digits":0,"rounding":0},"MUR":{"digits":0,"rounding":0},"OMR":{"digits":3,"rounding":0},"PKR":{"digits":0,"rounding":0},"PYG":{"digits":0,"rounding":0},"RSD":{"digits":0,"rounding":0},"RWF":{"digits":0,"rounding":0},"SLL":{"digits":0,"rounding":0},"SOS":{"digits":0,"rounding":0},"STD":{"digits":0,"rounding":0},"SYP":{"digits":0,"rounding":0},"TMM":{"digits":0,"rounding":0},"TND":{"digits":3,"rounding":0},"TRL":{"digits":0,"rounding":0},"TWD":{"digits":2,"rounding":0},"TZS":{"digits":0,"rounding":0},"UGX":{"digits":0,"rounding":0},"UZS":{"digits":0,"rounding":0},"VND":{"digits":0,"rounding":0},"VUV":{"digits":0,"rounding":0},"XAF":{"digits":0,"rounding":0},"XOF":{"digits":0,"rounding":0},"XPF":{"digits":0,"rounding":0},"YER":{"digits":0,"rounding":0},"ZMK":{"digits":0,"rounding":0},"ZWD":{"digits":0,"rounding":0}};
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
        return this.all_tokens.currency.negative;
      } else {
        return this.all_tokens.currency.positive;
      }
    };

    CurrencyFormatter.prototype.defaults_for_currency = function(currency) {
      return this.currencies_data[currency] || this.currencies_data.DEFAULT;
    };

    return CurrencyFormatter;

  })(TwitterCldr.NumberFormatter);

  TwitterCldr.AbbreviatedNumberFormatter = (function(superClass) {
    extend(AbbreviatedNumberFormatter, superClass);

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
        var l, ref, results;
        results = [];
        for (i = l = 0, ref = Math.floor(number).toString().length - 1; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
          results.push("0");
        }
        return results;
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
      tokens = this.all_tokens[type];
      tokens = number < 0 ? tokens.negative : tokens.positive;
      if (format != null) {
        tokens = tokens[format];
      }
      return tokens;
    };

    AbbreviatedNumberFormatter.prototype.truncate_number = function(number, integer_format) {
      var factor;
      if (this.NUMBER_MIN <= number && number < this.NUMBER_MAX) {
        factor = Math.max(0, Math.floor(number).toString().length - integer_format.format.length);
        return number / Math.pow(10, factor);
      } else {
        return number;
      }
    };

    return AbbreviatedNumberFormatter;

  })(TwitterCldr.NumberFormatter);

  TwitterCldr.ShortDecimalFormatter = (function(superClass) {
    extend(ShortDecimalFormatter, superClass);

    function ShortDecimalFormatter() {
      return ShortDecimalFormatter.__super__.constructor.apply(this, arguments);
    }

    ShortDecimalFormatter.prototype.get_type = function() {
      return "short_decimal";
    };

    return ShortDecimalFormatter;

  })(TwitterCldr.AbbreviatedNumberFormatter);

  TwitterCldr.LongDecimalFormatter = (function(superClass) {
    extend(LongDecimalFormatter, superClass);

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
          var l, ref, results;
          results = [];
          for (i = l = 0, ref = length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
            results.push("#");
          }
          return results;
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

  TwitterCldr.NumberFormatter.IntegerHelper = (function(superClass) {
    extend(IntegerHelper, superClass);

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
      var primary_group, ref, ref1, secondary_group, token, tokens;
      if (this.groups.length === 0) {
        return string;
      }
      tokens = [];
      primary_group = this.groups[this.groups.length - 1];
      secondary_group = this.groups[0];
      ref = this.chop_group(string, secondary_group), string = ref[0], token = ref[1];
      tokens.push(token);
      while (string.length) {
        ref1 = this.chop_group(string, primary_group), string = ref1[0], token = ref1[1];
        tokens.push(token);
      }
      return ((function() {
        var l, len1, results;
        results = [];
        for (l = 0, len1 = tokens.length; l < len1; l++) {
          token = tokens[l];
          if (token !== null) {
            results.push(token);
          }
        }
        return results;
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
        var l, len1, results;
        results = [];
        for (l = 0, len1 = widths.length; l < len1; l++) {
          width = widths[l];
          if (width !== null) {
            results.push(width);
          }
        }
        return results;
      })();
      widths.reverse();
      return ((function() {
        var l, ref, results;
        results = [];
        for (index = l = 0, ref = widths.length; 0 <= ref ? l < ref : l > ref; index = 0 <= ref ? ++l : --l) {
          if (widths.indexOf(widths[index], index + 1) === -1) {
            results.push(widths[index]);
          }
        }
        return results;
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

  TwitterCldr.NumberFormatter.FractionHelper = (function(superClass) {
    extend(FractionHelper, superClass);

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
          var l, ref, results;
          results = [];
          for (i = l = 0, ref = precision; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
            results.push("0");
          }
          return results;
        })()).join("");
      } else {
        return this.format;
      }
    };

    return FractionHelper;

  })(TwitterCldr.NumberFormatter.BaseHelper);

  TwitterCldr.Currencies = (function() {
    function Currencies() {}

    Currencies.currencies = {"ADP":{"currency":"ADP","name":"Andorran peseta","cldr_symbol":"ADP","symbol":"ADP","code_points":[65,68,80]},"AED":{"currency":"AED","name":"UAE dirham","cldr_symbol":"AED","symbol":"AED","code_points":[65,69,68]},"AFA":{"currency":"AFA","name":"Afghan afghani (1927–2002)","cldr_symbol":"AFA","symbol":"AFA","code_points":[65,70,65]},"AFN":{"currency":"AFN","name":"Afghan Afghani","cldr_symbol":"AFN","symbol":"؋","code_points":[1547]},"ALK":{"currency":"ALK","name":"Albanian lek (1946–1965)","cldr_symbol":"ALK","symbol":"ALK","code_points":[65,76,75]},"ALL":{"currency":"ALL","name":"Albanian lek","cldr_symbol":"ALL","symbol":"LEK","code_points":[76,69,75]},"AMD":{"currency":"AMD","name":"Armenian dram","cldr_symbol":"AMD","symbol":"AMD","code_points":[65,77,68]},"ANG":{"currency":"ANG","name":"Netherlands Antillean guilder","cldr_symbol":"ANG","symbol":"ƒ","code_points":[402]},"AOA":{"currency":"AOA","name":"Angolan kwanza","cldr_symbol":"AOA","symbol":"AOA","code_points":[65,79,65]},"AOK":{"currency":"AOK","name":"Angolan kwanza (1977–1991)","cldr_symbol":"AOK","symbol":"AOK","code_points":[65,79,75]},"AON":{"currency":"AON","name":"Angolan new kwanza (1990–2000)","cldr_symbol":"AON","symbol":"AON","code_points":[65,79,78]},"AOR":{"currency":"AOR","name":"Angolan readjusted kwanza (1995–1999)","cldr_symbol":"AOR","symbol":"AOR","code_points":[65,79,82]},"ARA":{"currency":"ARA","name":"Argentine austral","cldr_symbol":"ARA","symbol":"ARA","code_points":[65,82,65]},"ARL":{"currency":"ARL","name":"Argentine peso ley (1970–1983)","cldr_symbol":"ARL","symbol":"ARL","code_points":[65,82,76]},"ARM":{"currency":"ARM","name":"Argentine peso (1881–1970)","cldr_symbol":"ARM","symbol":"ARM","code_points":[65,82,77]},"ARP":{"currency":"ARP","name":"Argentine peso (1983–1985)","cldr_symbol":"ARP","symbol":"ARP","code_points":[65,82,80]},"ARS":{"currency":"ARS","name":"Argentine peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"ATS":{"currency":"ATS","name":"Austrian schilling","cldr_symbol":"ATS","symbol":"ATS","code_points":[65,84,83]},"AUD":{"currency":"AUD","name":"Australian dollar","cldr_symbol":"A$","symbol":"$","code_points":[36]},"AWG":{"currency":"AWG","name":"Aruban florin","cldr_symbol":"AWG","symbol":"ƒ","code_points":[402],"alt_name":"Florins"},"AZM":{"currency":"AZM","name":"Azerbaijani manat (1993–2006)","cldr_symbol":"AZM","symbol":"AZM","code_points":[65,90,77]},"AZN":{"currency":"AZN","name":"Azerbaijani manat","cldr_symbol":"AZN","symbol":"ман","code_points":[1084,1072,1085]},"BAD":{"currency":"BAD","name":"Bosnia-Herzegovina dinar (1992–1994)","cldr_symbol":"BAD","symbol":"BAD","code_points":[66,65,68]},"BAM":{"currency":"BAM","name":"Bosnia-Herzegovina convertible mark","cldr_symbol":"BAM","symbol":"KM","code_points":[75,77]},"BAN":{"currency":"BAN","name":"Bosnia-Herzegovina new dinar (1994–1997)","cldr_symbol":"BAN","symbol":"BAN","code_points":[66,65,78]},"BBD":{"currency":"BBD","name":"Barbadian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BDT":{"currency":"BDT","name":"Bangladeshi taka","cldr_symbol":"৳","symbol":"৳","code_points":[2547]},"BEC":{"currency":"BEC","name":"Belgian franc (convertible)","cldr_symbol":"BEC","symbol":"BEC","code_points":[66,69,67]},"BEF":{"currency":"BEF","name":"Belgian franc","cldr_symbol":"BEF","symbol":"BEF","code_points":[66,69,70]},"BEL":{"currency":"BEL","name":"Belgian franc (financial)","cldr_symbol":"BEL","symbol":"BEL","code_points":[66,69,76]},"BGL":{"currency":"BGL","name":"Bulgarian hard lev","cldr_symbol":"BGL","symbol":"BGL","code_points":[66,71,76]},"BGM":{"currency":"BGM","name":"Bulgarian socialist lev","cldr_symbol":"BGM","symbol":"BGM","code_points":[66,71,77]},"BGN":{"currency":"BGN","name":"Bulgarian lev","cldr_symbol":"BGN","symbol":"лв","code_points":[1083,1074]},"BGO":{"currency":"BGO","name":"Bulgarian lev (1879–1952)","cldr_symbol":"BGO","symbol":"BGO","code_points":[66,71,79]},"BHD":{"currency":"BHD","name":"Bahraini dinar","cldr_symbol":"BHD","symbol":"BHD","code_points":[66,72,68]},"BIF":{"currency":"BIF","name":"Burundian franc","cldr_symbol":"BIF","symbol":"BIF","code_points":[66,73,70]},"BMD":{"currency":"BMD","name":"Bermudan dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BND":{"currency":"BND","name":"Brunei dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BOB":{"currency":"BOB","name":"Bolivian boliviano","cldr_symbol":"BOB","symbol":"$b","code_points":[36,98]},"BOL":{"currency":"BOL","name":"Bolivian boliviano (1863–1963)","cldr_symbol":"BOL","symbol":"BOL","code_points":[66,79,76]},"BOP":{"currency":"BOP","name":"Bolivian peso","cldr_symbol":"BOP","symbol":"BOP","code_points":[66,79,80]},"BOV":{"currency":"BOV","name":"Bolivian mvdol","cldr_symbol":"BOV","symbol":"BOV","code_points":[66,79,86]},"BRB":{"currency":"BRB","name":"Brazilian new cruzeiro (1967–1986)","cldr_symbol":"BRB","symbol":"BRB","code_points":[66,82,66]},"BRC":{"currency":"BRC","name":"Brazilian cruzado (1986–1989)","cldr_symbol":"BRC","symbol":"BRC","code_points":[66,82,67]},"BRE":{"currency":"BRE","name":"Brazilian cruzeiro (1990–1993)","cldr_symbol":"BRE","symbol":"BRE","code_points":[66,82,69]},"BRL":{"currency":"BRL","name":"Brazilian real","cldr_symbol":"R$","symbol":"R$","code_points":[82,36]},"BRN":{"currency":"BRN","name":"Brazilian new cruzado (1989–1990)","cldr_symbol":"BRN","symbol":"BRN","code_points":[66,82,78]},"BRR":{"currency":"BRR","name":"Brazilian cruzeiro (1993–1994)","cldr_symbol":"BRR","symbol":"BRR","code_points":[66,82,82]},"BRZ":{"currency":"BRZ","name":"Brazilian cruzeiro (1942–1967)","cldr_symbol":"BRZ","symbol":"BRZ","code_points":[66,82,90]},"BSD":{"currency":"BSD","name":"Bahamian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BTN":{"currency":"BTN","name":"Bhutanese ngultrum","cldr_symbol":"BTN","symbol":"BTN","code_points":[66,84,78]},"BUK":{"currency":"BUK","name":"Burmese kyat","cldr_symbol":"BUK","symbol":"BUK","code_points":[66,85,75]},"BWP":{"currency":"BWP","name":"Botswanan pula","cldr_symbol":"BWP","symbol":"P","code_points":[80]},"BYB":{"currency":"BYB","name":"Belarusian new ruble (1994–1999)","cldr_symbol":"BYB","symbol":"BYB","code_points":[66,89,66]},"BYR":{"currency":"BYR","name":"Belarusian ruble","cldr_symbol":"р.","symbol":"p.","code_points":[112,46]},"BZD":{"currency":"BZD","name":"Belize dollar","cldr_symbol":"$","symbol":"BZ$","code_points":[66,90,36]},"CAD":{"currency":"CAD","name":"Canadian dollar","cldr_symbol":"CA$","symbol":"$","code_points":[36]},"CDF":{"currency":"CDF","name":"Congolese franc","cldr_symbol":"CDF","symbol":"CDF","code_points":[67,68,70]},"CHE":{"currency":"CHE","name":"WIR euro","cldr_symbol":"CHE","symbol":"CHE","code_points":[67,72,69]},"CHF":{"currency":"CHF","name":"Swiss franc","cldr_symbol":"CHF","symbol":"CHF","code_points":[67,72,70]},"CHW":{"currency":"CHW","name":"WIR franc","cldr_symbol":"CHW","symbol":"CHW","code_points":[67,72,87]},"CLE":{"currency":"CLE","name":"Chilean escudo","cldr_symbol":"CLE","symbol":"CLE","code_points":[67,76,69]},"CLF":{"currency":"CLF","name":"Chilean unit of account (UF)","cldr_symbol":"CLF","symbol":"CLF","code_points":[67,76,70]},"CLP":{"currency":"CLP","name":"Chilean peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"CNX":{"currency":"CNX","name":"Chinese People’s Bank dollar","cldr_symbol":"CNX","symbol":"CNX","code_points":[67,78,88]},"CNY":{"currency":"CNY","name":"Chinese yuan","cldr_symbol":"CN¥","symbol":"¥","code_points":[165]},"COP":{"currency":"COP","name":"Colombian peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"COU":{"currency":"COU","name":"Colombian real value unit","cldr_symbol":"COU","symbol":"COU","code_points":[67,79,85]},"CRC":{"currency":"CRC","name":"Costa Rican colón","cldr_symbol":"₡","symbol":"₡","code_points":[8353]},"CSD":{"currency":"CSD","name":"Serbian dinar (2002–2006)","cldr_symbol":"CSD","symbol":"CSD","code_points":[67,83,68]},"CSK":{"currency":"CSK","name":"Czechoslovak hard koruna","cldr_symbol":"CSK","symbol":"CSK","code_points":[67,83,75]},"CUC":{"currency":"CUC","name":"Cuban convertible peso","cldr_symbol":"CUC","symbol":"CUC","code_points":[67,85,67]},"CUP":{"currency":"CUP","name":"Cuban peso","cldr_symbol":"$","symbol":"₱","code_points":[8369]},"CVE":{"currency":"CVE","name":"Cape Verdean escudo","cldr_symbol":"CVE","symbol":"CVE","code_points":[67,86,69]},"CYP":{"currency":"CYP","name":"Cypriot pound","cldr_symbol":"CYP","symbol":"CYP","code_points":[67,89,80]},"CZK":{"currency":"CZK","name":"Czech Republic koruna","cldr_symbol":"CZK","symbol":"Kč","code_points":[75,269]},"DDM":{"currency":"DDM","name":"East German mark","cldr_symbol":"DDM","symbol":"DDM","code_points":[68,68,77]},"DEM":{"currency":"DEM","name":"German mark","cldr_symbol":"DEM","symbol":"DEM","code_points":[68,69,77]},"DJF":{"currency":"DJF","name":"Djiboutian franc","cldr_symbol":"DJF","symbol":"DJF","code_points":[68,74,70]},"DKK":{"currency":"DKK","name":"Danish krone","cldr_symbol":"DKK","symbol":"kr","code_points":[107,114]},"DOP":{"currency":"DOP","name":"Dominican peso","cldr_symbol":"$","symbol":"RD$","code_points":[82,68,36]},"DZD":{"currency":"DZD","name":"Algerian dinar","cldr_symbol":"DZD","symbol":"DZD","code_points":[68,90,68]},"ECS":{"currency":"ECS","name":"Ecuadorian sucre","cldr_symbol":"ECS","symbol":"ECS","code_points":[69,67,83]},"ECV":{"currency":"ECV","name":"Ecuadorian unit of constant value","cldr_symbol":"ECV","symbol":"ECV","code_points":[69,67,86]},"EEK":{"currency":"EEK","name":"Estonian kroon","cldr_symbol":"EEK","symbol":"kr","code_points":[107,114]},"EGP":{"currency":"EGP","name":"Egyptian pound","cldr_symbol":"EGP","symbol":"£","code_points":[163]},"ERN":{"currency":"ERN","name":"Eritrean nakfa","cldr_symbol":"ERN","symbol":"ERN","code_points":[69,82,78]},"ESA":{"currency":"ESA","name":"Spanish peseta (A account)","cldr_symbol":"ESA","symbol":"ESA","code_points":[69,83,65]},"ESB":{"currency":"ESB","name":"Spanish peseta (convertible account)","cldr_symbol":"ESB","symbol":"ESB","code_points":[69,83,66]},"ESP":{"currency":"ESP","name":"Spanish peseta","cldr_symbol":"₧","symbol":"₧","code_points":[8359]},"ETB":{"currency":"ETB","name":"Ethiopian birr","cldr_symbol":"ETB","symbol":"ETB","code_points":[69,84,66]},"EUR":{"currency":"EUR","name":"euro","cldr_symbol":"€","symbol":"€","code_points":[8364]},"FIM":{"currency":"FIM","name":"Finnish markka","cldr_symbol":"FIM","symbol":"FIM","code_points":[70,73,77]},"FJD":{"currency":"FJD","name":"Fijian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"FKP":{"currency":"FKP","name":"Falkland Islands pound","cldr_symbol":"FKP","symbol":"£","code_points":[163]},"FRF":{"currency":"FRF","name":"French franc","cldr_symbol":"FRF","symbol":"FRF","code_points":[70,82,70]},"GBP":{"currency":"GBP","name":"British pound sterling","cldr_symbol":"£","symbol":"£","code_points":[163]},"GEK":{"currency":"GEK","name":"Georgian kupon larit","cldr_symbol":"GEK","symbol":"GEK","code_points":[71,69,75]},"GEL":{"currency":"GEL","name":"Georgian lari","cldr_symbol":"GEL","symbol":"GEL","code_points":[71,69,76]},"GHC":{"currency":"GHC","name":"Ghanaian cedi (1979–2007)","cldr_symbol":"GHC","symbol":"GHC","code_points":[71,72,67]},"GHS":{"currency":"GHS","name":"Ghanaian cedi","cldr_symbol":"₵","symbol":"¢","code_points":[162]},"GIP":{"currency":"GIP","name":"Gibraltar pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"GMD":{"currency":"GMD","name":"Gambian dalasi","cldr_symbol":"GMD","symbol":"GMD","code_points":[71,77,68]},"GNF":{"currency":"GNF","name":"Guinean franc","cldr_symbol":"GNF","symbol":"GNF","code_points":[71,78,70]},"GNS":{"currency":"GNS","name":"Guinean syli","cldr_symbol":"GNS","symbol":"GNS","code_points":[71,78,83]},"GQE":{"currency":"GQE","name":"Equatorial Guinean ekwele","cldr_symbol":"GQE","symbol":"GQE","code_points":[71,81,69]},"GRD":{"currency":"GRD","name":"Greek drachma","cldr_symbol":"GRD","symbol":"GRD","code_points":[71,82,68]},"GTQ":{"currency":"GTQ","name":"Guatemalan quetzal","cldr_symbol":"GTQ","symbol":"Q","code_points":[81]},"GWE":{"currency":"GWE","name":"Portuguese Guinea escudo","cldr_symbol":"GWE","symbol":"GWE","code_points":[71,87,69]},"GWP":{"currency":"GWP","name":"Guinea-Bissau peso","cldr_symbol":"GWP","symbol":"GWP","code_points":[71,87,80]},"GYD":{"currency":"GYD","name":"Guyanaese dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"HKD":{"currency":"HKD","name":"Hong Kong dollar","cldr_symbol":"HK$","symbol":"$","code_points":[36]},"HNL":{"currency":"HNL","name":"Honduran lempira","cldr_symbol":"HNL","symbol":"L","code_points":[76]},"HRD":{"currency":"HRD","name":"Croatian dinar","cldr_symbol":"HRD","symbol":"HRD","code_points":[72,82,68]},"HRK":{"currency":"HRK","name":"Croatian kuna","cldr_symbol":"HRK","symbol":"kn","code_points":[107,110]},"HTG":{"currency":"HTG","name":"Haitian gourde","cldr_symbol":"HTG","symbol":"HTG","code_points":[72,84,71]},"HUF":{"currency":"HUF","name":"Hungarian forint","cldr_symbol":"HUF","symbol":"Ft","code_points":[70,116]},"IDR":{"currency":"IDR","name":"Indonesian rupiah","cldr_symbol":"IDR","symbol":"Rp","code_points":[82,112]},"IEP":{"currency":"IEP","name":"Irish pound","cldr_symbol":"IEP","symbol":"IEP","code_points":[73,69,80]},"ILP":{"currency":"ILP","name":"Israeli pound","cldr_symbol":"ILP","symbol":"ILP","code_points":[73,76,80]},"ILR":{"currency":"ILR","name":"Israeli sheqel (1980–1985)","cldr_symbol":"ILR","symbol":"ILR","code_points":[73,76,82]},"ILS":{"currency":"ILS","name":"Israeli new sheqel","cldr_symbol":"₪","symbol":"₪","code_points":[8362]},"INR":{"currency":"INR","name":"Indian rupee","cldr_symbol":"₹","symbol":"₨","code_points":[8360]},"IQD":{"currency":"IQD","name":"Iraqi dinar","cldr_symbol":"IQD","symbol":"IQD","code_points":[73,81,68]},"IRR":{"currency":"IRR","name":"Iranian rial","cldr_symbol":"IRR","symbol":"﷼","code_points":[65020]},"ISJ":{"currency":"ISJ","name":"Icelandic króna (1918–1981)","cldr_symbol":"ISJ","symbol":"ISJ","code_points":[73,83,74]},"ISK":{"currency":"ISK","name":"Icelandic króna","cldr_symbol":"ISK","symbol":"kr","code_points":[107,114]},"ITL":{"currency":"ITL","name":"Italian lira","cldr_symbol":"ITL","symbol":"ITL","code_points":[73,84,76]},"JMD":{"currency":"JMD","name":"Jamaican dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"JOD":{"currency":"JOD","name":"Jordanian dinar","cldr_symbol":"JOD","symbol":"JOD","code_points":[74,79,68]},"JPY":{"currency":"JPY","name":"Japanese yen","cldr_symbol":"¥","symbol":"¥","code_points":[165]},"KES":{"currency":"KES","name":"Kenyan shilling","cldr_symbol":"KES","symbol":"KES","code_points":[75,69,83]},"KGS":{"currency":"KGS","name":"Kyrgystani som","cldr_symbol":"KGS","symbol":"лв","code_points":[1083,1074]},"KHR":{"currency":"KHR","name":"Cambodian riel","cldr_symbol":"៛","symbol":"៛","code_points":[6107]},"KMF":{"currency":"KMF","name":"Comorian franc","cldr_symbol":"KMF","symbol":"KMF","code_points":[75,77,70]},"KPW":{"currency":"KPW","name":"North Korean won","cldr_symbol":"KPW","symbol":"₩","code_points":[8361]},"KRH":{"currency":"KRH","name":"South Korean hwan (1953–1962)","cldr_symbol":"KRH","symbol":"KRH","code_points":[75,82,72]},"KRO":{"currency":"KRO","name":"South Korean won (1945–1953)","cldr_symbol":"KRO","symbol":"KRO","code_points":[75,82,79]},"KRW":{"currency":"KRW","name":"South Korean won","cldr_symbol":"₩","symbol":"₩","code_points":[8361]},"KWD":{"currency":"KWD","name":"Kuwaiti dinar","cldr_symbol":"KWD","symbol":"KWD","code_points":[75,87,68]},"KYD":{"currency":"KYD","name":"Cayman Islands dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"KZT":{"currency":"KZT","name":"Kazakhstani tenge","cldr_symbol":"₸","symbol":"лв","code_points":[1083,1074]},"LAK":{"currency":"LAK","name":"Laotian kip","cldr_symbol":"₭","symbol":"₭","code_points":[8365]},"LBP":{"currency":"LBP","name":"Lebanese pound","cldr_symbol":"LBP","symbol":"£","code_points":[163]},"LKR":{"currency":"LKR","name":"Sri Lankan rupee","cldr_symbol":"LKR","symbol":"₨","code_points":[8360]},"LRD":{"currency":"LRD","name":"Liberian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"LSL":{"currency":"LSL","name":"Lesotho loti","cldr_symbol":"LSL","symbol":"LSL","code_points":[76,83,76]},"LTL":{"currency":"LTL","name":"Lithuanian litas","cldr_symbol":"LTL","symbol":"Lt","code_points":[76,116]},"LTT":{"currency":"LTT","name":"Lithuanian talonas","cldr_symbol":"LTT","symbol":"LTT","code_points":[76,84,84]},"LUC":{"currency":"LUC","name":"Luxembourgian convertible franc","cldr_symbol":"LUC","symbol":"LUC","code_points":[76,85,67]},"LUF":{"currency":"LUF","name":"Luxembourgian franc","cldr_symbol":"LUF","symbol":"LUF","code_points":[76,85,70]},"LUL":{"currency":"LUL","name":"Luxembourg financial franc","cldr_symbol":"LUL","symbol":"LUL","code_points":[76,85,76]},"LVL":{"currency":"LVL","name":"Latvian lats","cldr_symbol":"LVL","symbol":"Ls","code_points":[76,115]},"LVR":{"currency":"LVR","name":"Latvian ruble","cldr_symbol":"LVR","symbol":"LVR","code_points":[76,86,82]},"LYD":{"currency":"LYD","name":"Libyan dinar","cldr_symbol":"LYD","symbol":"LYD","code_points":[76,89,68]},"MAD":{"currency":"MAD","name":"Moroccan dirham","cldr_symbol":"MAD","symbol":"MAD","code_points":[77,65,68]},"MAF":{"currency":"MAF","name":"Moroccan franc","cldr_symbol":"MAF","symbol":"MAF","code_points":[77,65,70]},"MCF":{"currency":"MCF","name":"Monegasque franc","cldr_symbol":"MCF","symbol":"MCF","code_points":[77,67,70]},"MDC":{"currency":"MDC","name":"Moldovan cupon","cldr_symbol":"MDC","symbol":"MDC","code_points":[77,68,67]},"MDL":{"currency":"MDL","name":"Moldovan leu","cldr_symbol":"MDL","symbol":"MDL","code_points":[77,68,76]},"MGA":{"currency":"MGA","name":"Malagasy Ariary","cldr_symbol":"MGA","symbol":"MGA","code_points":[77,71,65]},"MGF":{"currency":"MGF","name":"Malagasy franc","cldr_symbol":"MGF","symbol":"MGF","code_points":[77,71,70]},"MKD":{"currency":"MKD","name":"Macedonian denar","cldr_symbol":"MKD","symbol":"MKD","code_points":[77,75,68]},"MKN":{"currency":"MKN","name":"Macedonian denar (1992–1993)","cldr_symbol":"MKN","symbol":"MKN","code_points":[77,75,78]},"MLF":{"currency":"MLF","name":"Malian franc","cldr_symbol":"MLF","symbol":"MLF","code_points":[77,76,70]},"MMK":{"currency":"MMK","name":"Myanmar kyat","cldr_symbol":"MMK","symbol":"MMK","code_points":[77,77,75]},"MNT":{"currency":"MNT","name":"Mongolian tugrik","cldr_symbol":"₮","symbol":"₮","code_points":[8366]},"MOP":{"currency":"MOP","name":"Macanese pataca","cldr_symbol":"MOP","symbol":"MOP","code_points":[77,79,80]},"MRO":{"currency":"MRO","name":"Mauritanian ouguiya","cldr_symbol":"MRO","symbol":"MRO","code_points":[77,82,79]},"MTL":{"currency":"MTL","name":"Maltese lira","cldr_symbol":"MTL","symbol":"MTL","code_points":[77,84,76]},"MTP":{"currency":"MTP","name":"Maltese pound","cldr_symbol":"MTP","symbol":"MTP","code_points":[77,84,80]},"MUR":{"currency":"MUR","name":"Mauritian rupee","cldr_symbol":"MUR","symbol":"₨","code_points":[8360]},"MVP":{"currency":"MVP","name":"Maldivian rupee","cldr_symbol":"MVP","symbol":"MVP","code_points":[77,86,80]},"MVR":{"currency":"MVR","name":"Maldivian rufiyaa","cldr_symbol":"MVR","symbol":"MVR","code_points":[77,86,82]},"MWK":{"currency":"MWK","name":"Malawian Kwacha","cldr_symbol":"MWK","symbol":"MWK","code_points":[77,87,75]},"MXN":{"currency":"MXN","name":"Mexican peso","cldr_symbol":"MX$","symbol":"$","code_points":[36]},"MXP":{"currency":"MXP","name":"Mexican silver peso (1861–1992)","cldr_symbol":"MXP","symbol":"MXP","code_points":[77,88,80]},"MXV":{"currency":"MXV","name":"Mexican investment unit","cldr_symbol":"MXV","symbol":"MXV","code_points":[77,88,86]},"MYR":{"currency":"MYR","name":"Malaysian ringgit","cldr_symbol":"MYR","symbol":"RM","code_points":[82,77]},"MZE":{"currency":"MZE","name":"Mozambican escudo","cldr_symbol":"MZE","symbol":"MZE","code_points":[77,90,69]},"MZM":{"currency":"MZM","name":"Mozambican metical (1980–2006)","cldr_symbol":"MZM","symbol":"MZM","code_points":[77,90,77]},"MZN":{"currency":"MZN","name":"Mozambican metical","cldr_symbol":"MZN","symbol":"MT","code_points":[77,84]},"NAD":{"currency":"NAD","name":"Namibian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"NGN":{"currency":"NGN","name":"Nigerian naira","cldr_symbol":"₦","symbol":"₦","code_points":[8358]},"NIC":{"currency":"NIC","name":"Nicaraguan córdoba (1988–1991)","cldr_symbol":"NIC","symbol":"NIC","code_points":[78,73,67]},"NIO":{"currency":"NIO","name":"Nicaraguan córdoba","cldr_symbol":"NIO","symbol":"C$","code_points":[67,36]},"NLG":{"currency":"NLG","name":"Dutch guilder","cldr_symbol":"NLG","symbol":"NLG","code_points":[78,76,71]},"NOK":{"currency":"NOK","name":"Norwegian krone","cldr_symbol":"NOK","symbol":"kr","code_points":[107,114]},"NPR":{"currency":"NPR","name":"Nepalese rupee","cldr_symbol":"NPR","symbol":"₨","code_points":[8360]},"NZD":{"currency":"NZD","name":"New Zealand dollar","cldr_symbol":"NZ$","symbol":"$","code_points":[36]},"OMR":{"currency":"OMR","name":"Omani rial","cldr_symbol":"OMR","symbol":"﷼","code_points":[65020]},"PAB":{"currency":"PAB","name":"Panamanian balboa","cldr_symbol":"PAB","symbol":"B/.","code_points":[66,47,46]},"PEI":{"currency":"PEI","name":"Peruvian inti","cldr_symbol":"PEI","symbol":"PEI","code_points":[80,69,73]},"PEN":{"currency":"PEN","name":"Peruvian nuevo sol","cldr_symbol":"PEN","symbol":"S/.","code_points":[83,47,46]},"PES":{"currency":"PES","name":"Peruvian sol (1863–1965)","cldr_symbol":"PES","symbol":"PES","code_points":[80,69,83]},"PGK":{"currency":"PGK","name":"Papua New Guinean kina","cldr_symbol":"PGK","symbol":"PGK","code_points":[80,71,75]},"PHP":{"currency":"PHP","name":"Philippine peso","cldr_symbol":"₱","symbol":"Php","code_points":[80,104,112]},"PKR":{"currency":"PKR","name":"Pakistani rupee","cldr_symbol":"PKR","symbol":"₨","code_points":[8360]},"PLN":{"currency":"PLN","name":"Polish zloty","cldr_symbol":"PLN","symbol":"zł","code_points":[122,322]},"PLZ":{"currency":"PLZ","name":"Polish zloty (PLZ)","cldr_symbol":"PLZ","symbol":"PLZ","code_points":[80,76,90]},"PTE":{"currency":"PTE","name":"Portuguese escudo","cldr_symbol":"PTE","symbol":"PTE","code_points":[80,84,69]},"PYG":{"currency":"PYG","name":"Paraguayan guarani","cldr_symbol":"₲","symbol":"Gs","code_points":[71,115]},"QAR":{"currency":"QAR","name":"Qatari rial","cldr_symbol":"QAR","symbol":"﷼","code_points":[65020]},"RHD":{"currency":"RHD","name":"Rhodesian dollar","cldr_symbol":"RHD","symbol":"RHD","code_points":[82,72,68]},"ROL":{"currency":"ROL","name":"Romanian leu (1952–2006)","cldr_symbol":"ROL","symbol":"ROL","code_points":[82,79,76]},"RON":{"currency":"RON","name":"Romanian leu","cldr_symbol":"RON","symbol":"lei","code_points":[108,101,105]},"RSD":{"currency":"RSD","name":"Serbian dinar","cldr_symbol":"RSD","symbol":"Дин.","code_points":[1044,1080,1085,46]},"RUB":{"currency":"RUB","name":"Russian ruble","cldr_symbol":"RUB","symbol":"руб","code_points":[1088,1091,1073]},"RUR":{"currency":"RUR","name":"Russian ruble (1991–1998)","cldr_symbol":"р.","symbol":"р.","code_points":[1088,46]},"RWF":{"currency":"RWF","name":"Rwandan franc","cldr_symbol":"RWF","symbol":"RWF","code_points":[82,87,70]},"SAR":{"currency":"SAR","name":"Saudi riyal","cldr_symbol":"SAR","symbol":"﷼","code_points":[65020]},"SBD":{"currency":"SBD","name":"Solomon Islands dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SCR":{"currency":"SCR","name":"Seychellois rupee","cldr_symbol":"SCR","symbol":"₨","code_points":[8360]},"SDD":{"currency":"SDD","name":"Sudanese dinar (1992–2007)","cldr_symbol":"SDD","symbol":"SDD","code_points":[83,68,68]},"SDG":{"currency":"SDG","name":"Sudanese pound","cldr_symbol":"SDG","symbol":"SDG","code_points":[83,68,71]},"SDP":{"currency":"SDP","name":"Sudanese pound (1957–1998)","cldr_symbol":"SDP","symbol":"SDP","code_points":[83,68,80]},"SEK":{"currency":"SEK","name":"Swedish krona","cldr_symbol":"SEK","symbol":"kr","code_points":[107,114]},"SGD":{"currency":"SGD","name":"Singapore dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SHP":{"currency":"SHP","name":"Saint Helena pound","cldr_symbol":"SHP","symbol":"£","code_points":[163]},"SIT":{"currency":"SIT","name":"Slovenian tolar","cldr_symbol":"SIT","symbol":"SIT","code_points":[83,73,84]},"SKK":{"currency":"SKK","name":"Slovak koruna","cldr_symbol":"SKK","symbol":"SKK","code_points":[83,75,75]},"SLL":{"currency":"SLL","name":"Sierra Leonean leone","cldr_symbol":"SLL","symbol":"SLL","code_points":[83,76,76]},"SOS":{"currency":"SOS","name":"Somali shilling","cldr_symbol":"SOS","symbol":"S","code_points":[83]},"SRD":{"currency":"SRD","name":"Surinamese dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SRG":{"currency":"SRG","name":"Surinamese guilder","cldr_symbol":"SRG","symbol":"SRG","code_points":[83,82,71]},"SSP":{"currency":"SSP","name":"South Sudanese pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"STD":{"currency":"STD","name":"São Tomé and Príncipe dobra","cldr_symbol":"STD","symbol":"STD","code_points":[83,84,68]},"SUR":{"currency":"SUR","name":"Soviet rouble","cldr_symbol":"SUR","symbol":"SUR","code_points":[83,85,82]},"SVC":{"currency":"SVC","name":"Salvadoran colón","cldr_symbol":"SVC","symbol":"SVC","code_points":[83,86,67]},"SYP":{"currency":"SYP","name":"Syrian pound","cldr_symbol":"SYP","symbol":"£","code_points":[163]},"SZL":{"currency":"SZL","name":"Swazi lilangeni","cldr_symbol":"SZL","symbol":"SZL","code_points":[83,90,76]},"THB":{"currency":"THB","name":"Thai baht","cldr_symbol":"฿","symbol":"฿","code_points":[3647]},"TJR":{"currency":"TJR","name":"Tajikistani ruble","cldr_symbol":"TJR","symbol":"TJR","code_points":[84,74,82]},"TJS":{"currency":"TJS","name":"Tajikistani somoni","cldr_symbol":"TJS","symbol":"TJS","code_points":[84,74,83]},"TMM":{"currency":"TMM","name":"Turkmenistani manat (1993–2009)","cldr_symbol":"TMM","symbol":"TMM","code_points":[84,77,77]},"TMT":{"currency":"TMT","name":"Turkmenistani manat","cldr_symbol":"TMT","symbol":"TMT","code_points":[84,77,84]},"TND":{"currency":"TND","name":"Tunisian dinar","cldr_symbol":"TND","symbol":"TND","code_points":[84,78,68]},"TOP":{"currency":"TOP","name":"Tongan paʻanga","cldr_symbol":"TOP","symbol":"TOP","code_points":[84,79,80]},"TPE":{"currency":"TPE","name":"Timorese escudo","cldr_symbol":"TPE","symbol":"TPE","code_points":[84,80,69]},"TRL":{"currency":"TRL","name":"Turkish lira (1922–2005)","cldr_symbol":"TRL","symbol":"TRL","code_points":[84,82,76]},"TRY":{"currency":"TRY","name":"Turkish lira","cldr_symbol":"₺","symbol":"TL","code_points":[84,76]},"TTD":{"currency":"TTD","name":"Trinidad and Tobago dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"TWD":{"currency":"TWD","name":"New Taiwan dollar","cldr_symbol":"NT$","symbol":"NT$","code_points":[78,84,36]},"TZS":{"currency":"TZS","name":"Tanzanian shilling","cldr_symbol":"TZS","symbol":"TZS","code_points":[84,90,83]},"UAH":{"currency":"UAH","name":"Ukrainian hryvnia","cldr_symbol":"₴","symbol":"₴","code_points":[8372]},"UAK":{"currency":"UAK","name":"Ukrainian karbovanets","cldr_symbol":"UAK","symbol":"UAK","code_points":[85,65,75]},"UGS":{"currency":"UGS","name":"Ugandan shilling (1966–1987)","cldr_symbol":"UGS","symbol":"UGS","code_points":[85,71,83]},"UGX":{"currency":"UGX","name":"Ugandan shilling","cldr_symbol":"UGX","symbol":"UGX","code_points":[85,71,88]},"USD":{"currency":"USD","name":"US dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"USN":{"currency":"USN","name":"US dollar (next day)","cldr_symbol":"USN","symbol":"USN","code_points":[85,83,78]},"USS":{"currency":"USS","name":"US dollar (same day)","cldr_symbol":"USS","symbol":"USS","code_points":[85,83,83]},"UYI":{"currency":"UYI","name":"Uruguayan peso (indexed units)","cldr_symbol":"UYI","symbol":"UYI","code_points":[85,89,73]},"UYP":{"currency":"UYP","name":"Uruguayan peso (1975–1993)","cldr_symbol":"UYP","symbol":"UYP","code_points":[85,89,80]},"UYU":{"currency":"UYU","name":"Uruguayan peso","cldr_symbol":"$","symbol":"$U","code_points":[36,85]},"UZS":{"currency":"UZS","name":"Uzbekistan som","cldr_symbol":"UZS","symbol":"лв","code_points":[1083,1074]},"VEB":{"currency":"VEB","name":"Venezuelan bolívar (1871–2008)","cldr_symbol":"VEB","symbol":"VEB","code_points":[86,69,66]},"VEF":{"currency":"VEF","name":"Venezuelan bolívar","cldr_symbol":"VEF","symbol":"Bs","code_points":[66,115]},"VND":{"currency":"VND","name":"Vietnamese dong","cldr_symbol":"₫","symbol":"₫","code_points":[8363]},"VNN":{"currency":"VNN","name":"Vietnamese dong (1978–1985)","cldr_symbol":"VNN","symbol":"VNN","code_points":[86,78,78]},"VUV":{"currency":"VUV","name":"Vanuatu vatu","cldr_symbol":"VUV","symbol":"VUV","code_points":[86,85,86]},"WST":{"currency":"WST","name":"Samoan tala","cldr_symbol":"WST","symbol":"WST","code_points":[87,83,84]},"XAF":{"currency":"XAF","name":"CFA franc BEAC","cldr_symbol":"FCFA","symbol":"FCFA","code_points":[70,67,70,65]},"XAG":{"currency":"XAG","name":"troy ounce of silver","cldr_symbol":"XAG","symbol":"XAG","code_points":[88,65,71]},"XAU":{"currency":"XAU","name":"troy ounce of gold","cldr_symbol":"XAU","symbol":"XAU","code_points":[88,65,85]},"XBA":{"currency":"XBA","name":"European composite unit","cldr_symbol":"XBA","symbol":"XBA","code_points":[88,66,65]},"XBB":{"currency":"XBB","name":"European monetary unit","cldr_symbol":"XBB","symbol":"XBB","code_points":[88,66,66]},"XBC":{"currency":"XBC","name":"European unit of account (XBC)","cldr_symbol":"XBC","symbol":"XBC","code_points":[88,66,67]},"XBD":{"currency":"XBD","name":"European unit of account (XBD)","cldr_symbol":"XBD","symbol":"XBD","code_points":[88,66,68]},"XCD":{"currency":"XCD","name":"East Caribbean dollar","cldr_symbol":"EC$","symbol":"$","code_points":[36]},"XDR":{"currency":"XDR","name":"special drawing rights","cldr_symbol":"XDR","symbol":"XDR","code_points":[88,68,82]},"XEU":{"currency":"XEU","name":"European currency unit","cldr_symbol":"XEU","symbol":"XEU","code_points":[88,69,85]},"XFO":{"currency":"XFO","name":"French gold franc","cldr_symbol":"XFO","symbol":"XFO","code_points":[88,70,79]},"XFU":{"currency":"XFU","name":"French UIC-franc","cldr_symbol":"XFU","symbol":"XFU","code_points":[88,70,85]},"XOF":{"currency":"XOF","name":"CFA franc BCEAO","cldr_symbol":"CFA","symbol":"CFA","code_points":[67,70,65]},"XPD":{"currency":"XPD","name":"troy ounce of palladium","cldr_symbol":"XPD","symbol":"XPD","code_points":[88,80,68]},"XPF":{"currency":"XPF","name":"CFP franc","cldr_symbol":"CFPF","symbol":"CFPF","code_points":[67,70,80,70]},"XPT":{"currency":"XPT","name":"troy ounce of platinum","cldr_symbol":"XPT","symbol":"XPT","code_points":[88,80,84]},"XRE":{"currency":"XRE","name":"RINET Funds unit","cldr_symbol":"XRE","symbol":"XRE","code_points":[88,82,69]},"XSU":{"currency":"XSU","name":"Sucre","cldr_symbol":"XSU","symbol":"XSU","code_points":[88,83,85]},"XTS":{"currency":"XTS","name":"Testing Currency unit","cldr_symbol":"XTS","symbol":"XTS","code_points":[88,84,83]},"XUA":{"currency":"XUA","name":"ADB unit of account","cldr_symbol":"XUA","symbol":"XUA","code_points":[88,85,65]},"XXX":{"currency":"XXX","name":"(unknown unit of currency)","cldr_symbol":"XXX","symbol":"XXX","code_points":[88,88,88]},"YDD":{"currency":"YDD","name":"Yemeni dinar","cldr_symbol":"YDD","symbol":"YDD","code_points":[89,68,68]},"YER":{"currency":"YER","name":"Yemeni rial","cldr_symbol":"YER","symbol":"﷼","code_points":[65020]},"YUD":{"currency":"YUD","name":"Yugoslavian hard dinar (1966–1990)","cldr_symbol":"YUD","symbol":"YUD","code_points":[89,85,68]},"YUM":{"currency":"YUM","name":"Yugoslavian new dinar (1994–2002)","cldr_symbol":"YUM","symbol":"YUM","code_points":[89,85,77]},"YUN":{"currency":"YUN","name":"Yugoslavian convertible dinar (1990–1992)","cldr_symbol":"YUN","symbol":"YUN","code_points":[89,85,78]},"YUR":{"currency":"YUR","name":"Yugoslavian reformed dinar (1992–1993)","cldr_symbol":"YUR","symbol":"YUR","code_points":[89,85,82]},"ZAL":{"currency":"ZAL","name":"South African rand (financial)","cldr_symbol":"ZAL","symbol":"ZAL","code_points":[90,65,76]},"ZAR":{"currency":"ZAR","name":"South African rand","cldr_symbol":"ZAR","symbol":"R","code_points":[82]},"ZMK":{"currency":"ZMK","name":"Zambian kwacha (1968–2012)","cldr_symbol":"ZMK","symbol":"ZMK","code_points":[90,77,75]},"ZMW":{"currency":"ZMW","name":"Zambian kwacha","cldr_symbol":"ZMW","symbol":"ZMW","code_points":[90,77,87]},"ZRN":{"currency":"ZRN","name":"Zairean new zaire (1993–1998)","cldr_symbol":"ZRN","symbol":"ZRN","code_points":[90,82,78]},"ZRZ":{"currency":"ZRZ","name":"Zairean zaire (1971–1993)","cldr_symbol":"ZRZ","symbol":"ZRZ","code_points":[90,82,90]},"ZWD":{"currency":"ZWD","name":"Zimbabwean dollar (1980–2008)","cldr_symbol":"ZWD","symbol":"Z$","code_points":[90,36]},"ZWL":{"currency":"ZWL","name":"Zimbabwean dollar (2009)","cldr_symbol":"ZWL","symbol":"ZWL","code_points":[90,87,76]},"ZWR":{"currency":"ZWR","name":"Zimbabwean dollar (2008)","cldr_symbol":"ZWR","symbol":"ZWR","code_points":[90,87,82]}};

    Currencies.currency_codes = function() {
      var _, data;
      return this.codes || (this.codes = (function() {
        var ref, results;
        ref = this.currencies;
        results = [];
        for (_ in ref) {
          data = ref[_];
          results.push(data.code);
        }
        return results;
      }).call(this));
    };

    Currencies.for_code = function(currency_code) {
      var country_name, data, ref, result;
      result = null;
      ref = this.currencies;
      for (country_name in ref) {
        data = ref[country_name];
        if (data.currency === currency_code) {
          result = {
            country: country_name,
            cldr_symbol: data.cldr_symbol,
            symbol: data.symbol,
            currency: data.currency
          };
          break;
        }
      }
      return result;
    };

    return Currencies;

  })();

  TwitterCldr.ListFormatter = (function() {
    function ListFormatter(options) {
      if (options == null) {
        options = {};
      }
      this.formats = {"2":"{0} et {1}","end":"{0} et {1}","middle":"{0}, {1}","start":"{0}, {1}"};
    }

    ListFormatter.prototype.format = function(list) {
      if (this.formats[list.length.toString()] != null) {
        return this.compose(this.formats[list.length.toString()], list);
      } else {
        return this.compose_list(list);
      }
    };

    ListFormatter.prototype.compose_list = function(list) {
      var format_key, i, l, ref, result;
      result = this.compose(this.formats.end || this.formats.middle || "", [list[list.length - 2], list[list.length - 1]]);
      if (list.length > 2) {
        for (i = l = 3, ref = list.length; 3 <= ref ? l <= ref : l >= ref; i = 3 <= ref ? ++l : --l) {
          format_key = i === list.length ? "start" : "middle";
          if (this.formats[format_key] == null) {
            format_key = "middle";
          }
          result = this.compose(this.formats[format_key] || "", [list[list.length - i], result]);
        }
      }
      return result;
    };

    ListFormatter.prototype.compose = function(format, elements) {
      var element, result;
      elements = (function() {
        var l, len1, results;
        results = [];
        for (l = 0, len1 = elements.length; l < len1; l++) {
          element = elements[l];
          if (element != null) {
            results.push(element);
          }
        }
        return results;
      })();
      if (elements.length > 1) {
        result = format.replace(/\{(\d+)\}/g, '$1');
        if (TwitterCldr.is_rtl) {
          result = TwitterCldr.Bidi.from_string(result, {
            "direction": "RTL"
          }).reorder_visually().toString();
        }
        return result.replace(/(\d+)/g, function(match) {
          return elements[parseInt(match)];
        });
      } else {
        return elements[0] || "";
      }
    };

    return ListFormatter;

  })();

  TwitterCldr.Bidi = (function() {
    var MAX_DEPTH;

    MAX_DEPTH = 62;

    Bidi.bidi_classes = {"BN":{"8":[0],"13":[14],"5":[127,8298],"25":[134],"0":[173,65279,917505],"2":[8203],"4":[8288],"7":[119155],"95":[917536]},"S":{"0":[9,11,31]},"B":{"0":[10,13,133,8233],"2":[28]},"WS":{"0":[12,32,5760,6158,8232,8287,12288],"10":[8192]},"ON":{"1":[33,171,174,697,884,900,1542,1550,5787,6468,8189,8448,8456,8506,12342,12443,12829,13278,42622,64830,65120,65281,126704,127338],"4":[38,187,8512,65286,65529,127942],"5":[59,91,3059,8478,11493,65307,65339,127792],"3":[123,166,2038,3898,8451,8522,12289,13004,13175,43048,43124,128249,128320],"0":[161,180,215,247,894,903,1014,1418,1758,1769,3066,5120,6464,8125,8468,8485,8487,8489,8585,12336,12448,12539,13311,42611,42888,65021,65105,65108,65128,65131,65793,67871,119365,120539,120597,120655,120713,120771,128064],"2":[182,8127,8141,8157,8173,8316,8332,8470,12349,12924,42509,65124,65506],"13":[706,722,127153],"8":[741,65110],"16":[751,127968],"6":[3192,11513,65512,68409],"9":[5008,6128,11088,65040],"10":[6144,9280,65371,128581],"33":[6622,42752],"23":[8208,128336],"14":[8245,12977,127136,127169,127185],"25":[8261,9083,11904],"15":[8528,12880],"129":[8592],"289":[8724],"93":[9110],"38":[9216],"39":[9312],"449":[9450],"82":[9901],"254":[9985],"588":[10496],"59":[11776],"88":[11931],"213":[12032],"11":[12272,65936],"24":[12296],"35":[12736],"63":[19904],"54":[42128],"31":[65072],"74":[65856],"19":[69714,127872],"65":[119296],"86":[119552],"43":[126976],"99":[127024],"32":[127744],"69":[127799,128507,128640],"36":[127904],"62":[128000],"181":[128066],"61":[128256],"115":[128768]},"ET":{"2":[35,65283],"3":[162],"1":[176,1545,2546,43064,65129,65504,65509],"0":[1423,1642,2555,2801,3065,3647,6107,8494,8723,65119],"4":[8240],"25":[8352]},"ES":{"0":[43,45,8722,64297,65291,65293],"1":[8314,8330,65122]},"CS":{"0":[44,58,160,1548,8239,8260,65104,65106,65109,65292,65306],"1":[46,65294]},"EN":{"9":[48,1776,8320,65296],"1":[178],"0":[185,8304],"5":[8308],"19":[9352],"49":[120782],"10":[127232]},"L":{"25":[65,97,5761,6576,65313,65345,65549],"0":[170,181,186,750,902,908,1417,2363,2482,2510,2519,2563,2654,2691,2761,2768,2880,2903,2947,2972,3024,3031,3133,3199,3294,3406,3415,3517,3716,3722,3725,3749,3751,3773,3782,3894,3896,3967,3973,4145,4152,4295,4301,4696,4800,6070,6108,6314,6743,6753,6965,6971,7082,7143,7150,7379,7393,8025,8027,8029,8126,8206,8305,8319,8450,8455,8469,8484,8486,8488,9109,9900,11559,11565,43047,43597,43697,43712,43714,65792,65794,69632,69932,71340,71350,119970,119995,120134],"22":[192,3090,3218,6656,11648],"30":[216,8031,13280,66304,127248],"448":[248],"6":[699,1369,2425,2474,2548,2602,2730,2858,3449,3520,3648,3737,4688,4792,6100,8118,8134,8182,11680,11688,11696,11704,11712,11720,11728,11736,43808,43816,64256,69703,69819,119997,120086,120138],"1":[720,886,2434,2447,2503,2507,2524,2575,2610,2613,2616,2738,2763,2784,2818,2831,2866,2877,2887,2891,2908,2969,2974,2979,3006,3009,3160,3168,3202,3274,3285,3296,3313,3330,3424,3458,3634,3713,3719,3754,3762,4155,4227,5941,6087,6448,6755,7078,7154,7220,7413,8526,11506,11631,12334,43346,43444,43450,43486,43567,43571,43701,44006,65596,69815,71342,110592,119171,119966,119973,127568],"4":[736,2741,2869,3125,3253,3776,3976,6512,6973,8473,8517,12337,12344,43705,64275,120128],"3":[880,890,2365,2377,2486,2493,2649,2749,2962,3137,3389,3732,3757,3804,4186,4682,4698,4746,4786,4802,4882,5902,6435,7401,8144,8490,8508,11499,12540,42896,43015,44009,66336,74864,119977,120071,120123],"2":[904,2382,2527,2622,2674,2703,2911,2958,2984,3014,3018,3073,3086,3214,3270,3342,3398,3402,3535,3570,3745,5998,6441,6681,7146,8130,8178,12293,12445,43011,43584,65498],"19":[910,2404],"82":[931],"139":[1015],"157":[1162,66560],"37":[1329,7968,11520,43264],"38":[1377,119040],"54":[2307],"9":[2392,2662,3114,3174,3242,3302,3792,3902,6112,6160,6784,6800,8458,43000,43250,43600,44016,66720,69734,69872,70079,70096,71360],"7":[2437,2821,3077,3205,3261,3333,3544,4030,6078,7360,8016,43056,43588,43758,120077,120772],"21":[2451,2579,2707,2835],"11":[2534,2990,12992,43214,65536,119982],"5":[2565,2949,4039,4231,6451,6765,7406,7960,8008,8150,42738,42889,43777,43785,43793,65474,65482,65490],"8":[2693,3507,6979,7028,12321,65847,119146,127552],"10":[2790,6608,8495,42912,43471],"17":[2918,3461,5920,5952,119648],"12":[3046,3663,4046,4213,5888,5984,8160,8336,94099],"40":[3346,4704,6272,8544,12549,43520],"15":[3430,4193,4992],"23":[3482,3840,42624],"47":[3585,6916,7164,12832,43395,43648,119214],"26":[3866,6992,66352],"35":[3913,69891],"44":[4096,12784,65799,66000],"24":[4159,43020,43310,69840],"14":[4238,4808,7227,65599],"39":[4254,6470],"376":[4304],"32":[4752],"56":[4824,120540,120598,120656,120714],"66":[4888],"28":[4960,6400,66176,127462],"84":[5024,119808],"638":[5121],"80":[5792],"51":[6016,43072,70018],"87":[6176],"69":[6320],"43":[6528],"55":[6686,11568],"13":[6816,65616,66504,69942],"31":[7042,43612],"57":[7084,127280],"50":[7245,120488],"191":[7424],"277":[7680],"52":[8064],"68":[9014,93952],"77":[9372],"255":[10240],"46":[11264,11312,13008,42560,94032],"132":[11360],"85":[12353],"89":[12449],"93":[12593],"42":[12688,71296,127344,127504],"27":[12896,42512,120094],"49":[12927],"118":[13056],"98":[13179,74752],"6591":[13312],"22156":[19968],"316":[42192],"79":[42656],"101":[42786],"67":[43136],"29":[43359,66432,119180],"16":[43453,43739],"36":[43968,66463],"11206":[44032],"48":[55243,66208,69762],"8813":[55296],"105":[64112],"88":[65382],"18":[65576],"122":[65664],"53":[69634],"878":[73728],"1070":[77824],"568":[92160],"245":[118784],"61":[119081],"70":[119894],"64":[120005],"339":[120146],"42719":[131072],"4383":[173824],"541":[194560],"131071":[983040]},"NSM":{"111":[768],"6":[1155,1750,2385,3636,6071,6744,7394,65056,119173],"44":[1425],"0":[1471,1479,1648,1809,2362,2364,2381,2433,2492,2509,2620,2641,2677,2748,2765,2817,2876,2879,2893,2902,2946,3008,3021,3260,3405,3530,3542,3633,3761,3893,3895,3897,4038,4226,4237,4253,6086,6109,6313,6450,6742,6752,6754,6783,6964,6972,6978,7083,7142,7149,7405,7412,11647,42655,43010,43014,43019,43204,43443,43452,43587,43596,43696,43713,43766,44005,44008,44013,64286,66045,68159,69633,71339,71341,71351],"1":[1473,1476,1767,2402,2530,2561,2625,2631,2672,2689,2759,2786,2914,3157,3170,3276,3298,3426,3771,3864,3974,4153,4157,4184,4229,5970,6002,6068,6439,6679,7040,7080,7144,7222,12441,42736,43045,43569,43573,43703,43710,43756,68101,69760,69817,70016],"10":[1552,1958,3981,6089,43335],"20":[1611],"5":[1759,3764,3784,4146,43561,71344],"3":[1770,2070,2497,2881,3146,3393,4141,4209,6912,7074,7676,12330,42607,43446,68108,69811,94095,119210],"26":[1840,2276],"8":[2027,2075,7019,70070],"2":[2085,2137,2304,2635,3134,3142,3538,4190,4957,5906,5938,6155,6432,6457,7151,7376,11503,43392,43698,68097,68152,69888,119143,119362],"4":[2089,2753,3968,6966,69927],"7":[2369,3655,6757,7212,43302,69933,119163],"13":[3953],"35":[3993],"9":[6771,42612],"12":[7380],"38":[7616],"32":[8400],"31":[11744],"17":[43232],"15":[65024],"14":[69688],"239":[917760]},"R":{"0":[1470,1472,1475,1478,2042,2074,2084,2088,2142,8207,64285,64318,67592,67644,67903,68096],"26":[1488,68121,68440],"4":[1520,64312],"42":[1984],"1":[2036,64320,64323,67639,68030],"21":[2048,68416],"14":[2096],"24":[2112],"9":[64287,64326],"12":[64298],"5":[67584],"43":[67594],"22":[67647],"8":[67671,68176],"27":[67840],"25":[67872],"55":[67968],"3":[68112],"2":[68117],"7":[68160,68472],"31":[68192],"53":[68352],"72":[68608]},"AN":{"4":[1536],"9":[1632],"1":[1643],"0":[1757],"30":[69216]},"AL":{"0":[1544,1547,1549,1563,1969,2208,126500,126503,126521,126523,126530,126535,126537,126539,126548,126551,126553,126555,126557,126559,126564,126590],"44":[1566],"2":[1645,126541,126625],"100":[1649],"1":[1765,1774,1807,126497,126545,126561],"19":[1786],"29":[1810],"88":[1869],"10":[2210],"113":[64336],"362":[64467],"63":[64848],"53":[64914],"12":[65008],"4":[65136,126629],"134":[65142],"3":[126464,126516,126567,126580,126585],"26":[126469],"9":[126505,126592],"6":[126572],"16":[126603,126635]},"LRE":{"0":[8234]},"RLE":{"0":[8235]},"PDF":{"0":[8236]},"LRO":{"0":[8237]},"RLO":{"0":[8238]}};

    function Bidi(options) {
      if (options == null) {
        options = {};
      }
      this.string_arr = options.string_arr || options.types;
      this.types = options.types || [];
      this.levels = [];
      this.runs = [];
      this.direction = options.direction;
      this.default_direction = options.default_direction || "LTR";
      this.length = this.types.length;
      this.run_bidi();
    }

    Bidi.bidi_class_for = function(code_point) {
      var bidi_class, end, l, len1, range, range_list, range_offset, ranges, ref, start;
      ref = this.bidi_classes;
      for (bidi_class in ref) {
        ranges = ref[bidi_class];
        for (range_offset in ranges) {
          range_list = ranges[range_offset];
          for (l = 0, len1 = range_list.length; l < len1; l++) {
            range = range_list[l];
            start = range;
            end = start + parseInt(range_offset);
            if ((code_point >= start) && (code_point <= end)) {
              return bidi_class;
            }
          }
        }
      }
      return null;
    };

    Bidi.from_string = function(str, options) {
      var string_arr;
      if (options == null) {
        options = {};
      }
      string_arr = TwitterCldr.Utilities.unpack_string(str);
      options.types || (options.types = this.compute_types(string_arr));
      options.string_arr || (options.string_arr = string_arr);
      return new TwitterCldr.Bidi(options);
    };

    Bidi.from_type_array = function(types, options) {
      if (options == null) {
        options = {};
      }
      options.types || (options.types = types);
      return new TwitterCldr.Bidi(options);
    };

    Bidi.compute_types = function(arr) {
      var code_point, l, len1, results;
      results = [];
      for (l = 0, len1 = arr.length; l < len1; l++) {
        code_point = arr[l];
        results.push(TwitterCldr.Bidi.bidi_class_for(code_point));
      }
      return results;
    };

    Bidi.prototype.toString = function() {
      return TwitterCldr.Utilities.pack_array(this.string_arr);
    };

    Bidi.prototype.reorder_visually = function() {
      var depth, finish, i, l, len1, level, lowest_odd, m, max, n, ref, ref1, ref2, start, tmpb, tmpo;
      if (!this.string_arr) {
        throw "No string given!";
      }
      max = 0;
      lowest_odd = MAX_DEPTH + 1;
      ref = this.levels;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        level = ref[l];
        max = TwitterCldr.Utilities.max([level, max]);
        if (!TwitterCldr.Utilities.is_even(level)) {
          lowest_odd = TwitterCldr.Utilities.min([lowest_odd, level]);
        }
      }
      for (depth = m = ref1 = max; ref1 <= 0 ? m < 0 : m > 0; depth = ref1 <= 0 ? ++m : --m) {
        start = 0;
        while (start < this.levels.length) {
          while (start < this.levels.length && this.levels[start] < depth) {
            start += 1;
          }
          if (start === this.levels.length) {
            break;
          }
          finish = start + 1;
          while (finish < this.levels.length && this.levels[finish] >= depth) {
            finish += 1;
          }
          for (i = n = 0, ref2 = (finish - start) / 2; 0 <= ref2 ? n < ref2 : n > ref2; i = 0 <= ref2 ? ++n : --n) {
            tmpb = this.levels[finish - i - 1];
            this.levels[finish - i - 1] = this.levels[start + i];
            this.levels[start + i] = tmpb;
            tmpo = this.string_arr[finish - i - 1];
            this.string_arr[finish - i - 1] = this.string_arr[start + i];
            this.string_arr[start + i] = tmpo;
          }
          start = finish + 1;
        }
      }
      return this;
    };

    Bidi.prototype.compute_paragraph_embedding_level = function() {
      var l, len1, ref, type;
      if (["LTR", "RTL"].indexOf(this.direction) > -1) {
        if (this.direction === "LTR") {
          return 0;
        } else {
          return 1;
        }
      } else {
        ref = this.types;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          type = ref[l];
          if (type === "L") {
            return 0;
          }
          if (type === "R") {
            return 1;
          }
        }
        if (this.default_direction === "LTR") {
          return 0;
        } else {
          return 1;
        }
      }
    };

    Bidi.prototype.compute_explicit_levels = function() {
      var current_embedding, directional_override, embedding_stack, i, input, is_ltr, is_special, l, len, m, new_embedding, next_fmt, output, ref, ref1, ref2, size, sp;
      current_embedding = this.base_embedding;
      directional_override = -1;
      embedding_stack = [];
      this.formatter_indices || (this.formatter_indices = []);
      sp = 0;
      for (i = l = 0, ref = this.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        is_ltr = false;
        is_special = true;
        is_ltr = this.types[i] === "LRE" || this.types[i] === "LRO";
        switch (this.types[i]) {
          case "RLE":
          case "RLO":
          case "LRE":
          case "LRO":
            new_embedding = is_ltr ? (current_embedding & ~1) + 2 : (current_embedding + 1) | 1;
            if (new_embedding < MAX_DEPTH) {
              if (directional_override !== -1) {
                current_embedding |= -0x80;
              }
              embedding_stack[sp] = current_embedding;
              current_embedding = new_embedding;
              sp += 1;
              directional_override = this.types[i] === "LRO" ? "L" : this.types[i] === "RLO" ? "R" : -1;
            }
            break;
          case "PDF":
            if (sp > 0) {
              sp -= 1;
              new_embedding = embedding_stack[sp];
              current_embedding = new_embedding & 0x7f;
              directional_override = new_embedding < 0 ? (ref1 = (new_embedding & 1) === 0) != null ? ref1 : {
                "L": "R"
              } : -1;
            }
            break;
          default:
            is_special = false;
        }
        this.levels[i] = current_embedding;
        if (is_special) {
          this.formatter_indices.push(i);
        } else if (directional_override !== -1) {
          this.types[i] = directional_override;
        }
      }
      output = 0;
      input = 0;
      size = this.formatter_indices.length;
      for (i = m = 0, ref2 = size; 0 <= ref2 ? m <= ref2 : m >= ref2; i = 0 <= ref2 ? ++m : --m) {
        next_fmt = i === size ? this.length : this.formatter_indices[i];
        len = next_fmt - input;
        TwitterCldr.Utilities.arraycopy(this.levels, input, this.levels, output, len);
        TwitterCldr.Utilities.arraycopy(this.types, input, this.types, output, len);
        output += len;
        input = next_fmt + 1;
      }
      return this.length -= this.formatter_indices.length;
    };

    Bidi.prototype.compute_runs = function() {
      var current_embedding, i, l, last_run_start, m, ref, ref1, run_count, where;
      run_count = 0;
      current_embedding = this.base_embedding;
      for (i = l = 0, ref = this.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        if (this.levels[i] !== current_embedding) {
          current_embedding = this.levels[i];
          run_count += 1;
        }
      }
      where = 0;
      last_run_start = 0;
      current_embedding = this.base_embedding;
      for (i = m = 0, ref1 = this.length; 0 <= ref1 ? m < ref1 : m > ref1; i = 0 <= ref1 ? ++m : --m) {
        if (this.levels[i] !== current_embedding) {
          this.runs[where] = last_run_start;
          where += 1;
          last_run_start = i;
          current_embedding = this.levels[i];
        }
      }
      return this.runs[where] = last_run_start;
    };

    Bidi.prototype.resolve_weak_types = function() {
      var eor, finish, i, j, k, l, level, m, n, next_level, next_type, prev_strong_type, prev_type, previous_level, ref, ref1, ref2, ref3, ref4, run_count, run_idx, sor, start;
      run_count = this.runs.length;
      previous_level = this.base_embedding;
      for (run_idx = l = 0, ref = run_count; 0 <= ref ? l < ref : l > ref; run_idx = 0 <= ref ? ++l : --l) {
        start = this.get_run_start(run_idx);
        finish = this.get_run_limit(run_idx);
        level = this.get_run_level(run_idx) || 0;
        sor = TwitterCldr.Utilities.is_even(TwitterCldr.Utilities.max([previous_level, level])) ? "L" : "R";
        next_level = run_idx === (run_count - 1) ? this.base_embedding : this.get_run_level(run_idx + 1) || 0;
        eor = TwitterCldr.Utilities.is_even(TwitterCldr.Utilities.max([level, next_level])) ? "L" : "R";
        prev_type = sor;
        prev_strong_type = sor;
        for (i = m = ref1 = start, ref2 = finish; ref1 <= ref2 ? m < ref2 : m > ref2; i = ref1 <= ref2 ? ++m : --m) {
          next_type = i === (finish - 1) ? eor : this.types[i + 1];
          if (this.types[i] === "NSM") {
            this.types[i] = prev_type;
          } else {
            prev_type = this.types[i];
          }
          if (this.types[i] === "EN") {
            if (prev_strong_type === "AL") {
              this.types[i] = "AN";
            }
          } else if (this.types[i] === "L" || this.types[i] === "R" || this.types[i] === "AL") {
            prev_strong_type = this.types[i];
          }
          if (this.types[i] === "AL") {
            this.types[i] = "R";
          }
          if (prev_type === "EN" && next_type === "EN") {
            if (this.types[i] === "ES" || this.types[i] === "CS") {
              this.types[i] = nextType;
            }
          } else if (prev_type === "AN" && next_type === "AN" && this.types[i] === "CS") {
            this.types[i] = next_type;
          }
          if (this.types[i] === "ET" || this.types[i] === "BN") {
            if (prev_type === "EN") {
              this.types[i] = prev_type;
            } else {
              j = i + 1;
              while (j < finish && this.types[j] === "ET" || this.types[j] === "BN") {
                j += 1;
              }
              if (j < finish && this.types[j] === "EN") {
                for (k = n = ref3 = i, ref4 = j; ref3 <= ref4 ? n < ref4 : n > ref4; k = ref3 <= ref4 ? ++n : --n) {
                  this.types[k] = "EN";
                }
              }
            }
          }
          if (this.types[i] === "ET" || this.types[i] === "CS" || this.types[i] === "BN") {
            this.types[i] = "ON";
          }
          if (prev_strong_type === "L" && this.types[i] === "EN") {
            this.types[i] = prev_strong_type;
          }
        }
        previous_level = level;
      }
    };

    Bidi.prototype.get_run_count = function() {
      return this.runs.length;
    };

    Bidi.prototype.get_run_level = function(which) {
      return this.levels[this.runs[which]];
    };

    Bidi.prototype.get_run_limit = function(which) {
      if (which === (this.runs.length - 1)) {
        return this.length;
      } else {
        return this.runs[which + 1];
      }
    };

    Bidi.prototype.get_run_start = function(which) {
      return this.runs[which];
    };

    Bidi.prototype.resolve_implicit_levels = function() {
      var i, l, ref;
      for (i = l = 0, ref = this.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        if ((this.levels[i] & 1) === 0) {
          if (this.types[i] === "R") {
            this.levels[i] += 1;
          } else if (this.types[i] === "AN" || this.types[i] === "EN") {
            this.levels[i] += 2;
          }
        } else {
          if (this.types[i] === "L" || this.types[i] === "AN" || this.types[i] === "EN") {
            this.levels[i] += 1;
          }
        }
      }
    };

    Bidi.prototype.resolve_neutral_types = function() {
      var embedding_direction, eor, finish, i, j, l, level, m, n, neutral_start, new_strong, next_level, override, prev_strong, previous_level, ref, ref1, ref2, ref3, ref4, run, run_count, sor, start, this_type;
      run_count = this.get_run_count();
      previous_level = this.base_embedding;
      for (run = l = 0, ref = run_count; 0 <= ref ? l < ref : l > ref; run = 0 <= ref ? ++l : --l) {
        start = this.get_run_start(run);
        finish = this.get_run_limit(run);
        level = this.get_run_level(run);
        if (level == null) {
          continue;
        }
        embedding_direction = TwitterCldr.Utilities.is_even(level) ? "L" : "R";
        sor = TwitterCldr.Utilities.is_even(TwitterCldr.Utilities.max([previous_level, level])) ? "L" : "R";
        next_level = run === (run_count - 1) ? this.base_embedding : this.get_run_level(run + 1);
        eor = TwitterCldr.Utilities.is_even(TwitterCldr.Utilities.max([level, next_level])) ? "L" : "R";
        prev_strong = sor;
        neutral_start = -1;
        for (i = m = ref1 = start, ref2 = finish; ref1 <= ref2 ? m <= ref2 : m >= ref2; i = ref1 <= ref2 ? ++m : --m) {
          new_strong = -1;
          this_type = i === finish ? eor : this.types[i];
          switch (this_type) {
            case "L":
              new_strong = "L";
              break;
            case "R":
            case "AN":
            case "EN":
              new_strong = "R";
              break;
            case "BN":
            case "ON":
            case "S":
            case "B":
            case "WS":
              if (neutral_start === -1) {
                neutral_start = i;
              }
          }
          if (new_strong !== -1) {
            if (neutral_start !== -1) {
              override = prev_strong === new_strong ? prev_strong : embedding_direction;
              for (j = n = ref3 = neutral_start, ref4 = i; ref3 <= ref4 ? n < ref4 : n > ref4; j = ref3 <= ref4 ? ++n : --n) {
                this.types[j] = override;
              }
            }
            prev_strong = new_strong;
            neutral_start = -1;
          }
        }
        previous_level = level;
      }
    };

    Bidi.prototype.reinsert_formatting_codes = function() {
      var index, input, l, left_level, len, next_fmt, output, ref, right_level;
      if ((this.formatter_indices != null) && this.formatter_indices.length > 0) {
        input = this.length;
        output = this.levels.length;
        for (index = l = ref = this.formatter_indices.length - 1; ref <= 0 ? l <= 0 : l >= 0; index = ref <= 0 ? ++l : --l) {
          next_fmt = this.formatter_indices[index];
          len = output - next_fmt - 1;
          output = next_fmt;
          input -= len;
          if (next_fmt + 1 < this.levels.length) {
            TwitterCldr.Utilities.arraycopy(this.levels, input, this.levels, next_fmt + 1, len);
          }
          right_level = output === this.levels.length - 1 ? this.base_embedding : this.levels[output + 1] != null ? this.levels[output + 1] : 0;
          left_level = input === 0 ? this.base_embedding : this.levels[input] != null ? this.levels[input] : 0;
          this.levels[output] = TwitterCldr.Utilities.max([left_level, right_level]);
        }
      }
      return this.length = this.levels.length;
    };

    Bidi.prototype.run_bidi = function() {
      this.base_embedding = this.compute_paragraph_embedding_level();
      this.compute_explicit_levels();
      this.compute_runs();
      this.resolve_weak_types();
      this.resolve_neutral_types();
      this.resolve_implicit_levels();
      this.reinsert_formatting_codes();
      this.compute_runs();
    };

    return Bidi;

  })();

  TwitterCldr.Calendar = (function() {
    var REDIRECT_PREFIX;

    function Calendar() {}

    REDIRECT_PREFIX = "calendars.gregorian.";

    Calendar.calendar = {"additional_formats":{"EHm":"E HH:mm","EHms":"E HH:mm:ss","Ed":"E d","Ehm":"E h:mm a","Ehms":"E h:mm:ss a","Gy":"y G","GyMMM":"MMM y G","GyMMMEd":"E d MMM y G","GyMMMd":"d MMM y G","H":"HH 'h'","Hm":"HH:mm","Hms":"HH:mm:ss","M":"L","MEd":"E d/M","MMM":"LLL","MMMEd":"E d MMM","MMMd":"d MMM","Md":"d/M","d":"d","h":"h a","hm":"h:mm a","hms":"h:mm:ss a","ms":"mm:ss","y":"y","yM":"M/y","yMEd":"E d/M/y","yMMM":"MMM y","yMMMEd":"E d MMM y","yMMMM":"MMMM y","yMMMd":"d MMM y","yMd":"d/M/y","yQQQ":"QQQ y","yQQQQ":"QQQQ y"},"days":{"format":{"abbreviated":{"fri":"ven.","mon":"lun.","sat":"sam.","sun":"dim.","thu":"jeu.","tue":"mar.","wed":"mer."},"narrow":{"fri":"V","mon":"L","sat":"S","sun":"D","thu":"J","tue":"M","wed":"M"},"short":{"fri":"ve","mon":"lu","sat":"sa","sun":"di","thu":"je","tue":"ma","wed":"me"},"wide":{"fri":"vendredi","mon":"lundi","sat":"samedi","sun":"dimanche","thu":"jeudi","tue":"mardi","wed":"mercredi"}},"stand-alone":{"abbreviated":{"fri":"ven.","mon":"lun.","sat":"sam.","sun":"dim.","thu":"jeu.","tue":"mar.","wed":"mer."},"narrow":{"fri":"V","mon":"L","sat":"S","sun":"D","thu":"J","tue":"M","wed":"M"},"short":{"fri":"ven.","mon":"lun.","sat":"sam.","sun":"dim.","thu":"jeu.","tue":"mar.","wed":"mer."},"wide":{"fri":"vendredi","mon":"lundi","sat":"samedi","sun":"dimanche","thu":"jeudi","tue":"mardi","wed":"mercredi"}}},"eras":{"abbr":{"0":"AEC","1":"EC"},"name":{"0":"avant Jésus-Christ","1":"après Jésus-Christ"},"narrow":{"0":"av. J.-C.","1":"ap. J.-C."}},"fields":{"day":"jour","dayperiod":"cadran","era":"ère","hour":"heure","minute":"minute","month":"mois","second":"seconde","week":"semaine","weekday":"jour de la semaine","year":"année","zone":"fuseau horaire"},"formats":{"date":{"full":{"pattern":"EEEE d MMMM y"},"long":{"pattern":"d MMMM y"},"medium":{"pattern":"d MMM y"},"short":{"pattern":"d/MM/yy"}},"datetime":{"full":{"pattern":"{{date}} {{time}}"},"long":{"pattern":"{{date}} {{time}}"},"medium":{"pattern":"{{date}} {{time}}"},"short":{"pattern":"{{date}} {{time}}"}},"time":{"full":{"pattern":"H 'h' mm 'min' ss 's' zzzz"},"long":{"pattern":"HH:mm:ss z"},"medium":{"pattern":"HH:mm:ss"},"short":{"pattern":"HH:mm"}}},"months":{"format":{"abbreviated":{"1":"janv.","10":"oct.","11":"nov.","12":"déc.","2":"févr.","3":"mars","4":"avr.","5":"mai","6":"juin","7":"juil.","8":"août","9":"sept."},"narrow":{"1":"J","10":"O","11":"N","12":"D","2":"F","3":"M","4":"A","5":"M","6":"J","7":"J","8":"A","9":"S"},"wide":{"1":"janvier","10":"octobre","11":"novembre","12":"décembre","2":"février","3":"mars","4":"avril","5":"mai","6":"juin","7":"juillet","8":"août","9":"septembre"}},"stand-alone":{"abbreviated":{"1":"janv.","10":"oct.","11":"nov.","12":"déc.","2":"févr.","3":"mars","4":"avr.","5":"mai","6":"juin","7":"juil.","8":"août","9":"sept."},"narrow":{"1":"J","10":"O","11":"N","12":"D","2":"F","3":"M","4":"A","5":"M","6":"J","7":"J","8":"A","9":"S"},"wide":{"1":"janvier","10":"octobre","11":"novembre","12":"décembre","2":"février","3":"mars","4":"avril","5":"mai","6":"juin","7":"juillet","8":"août","9":"septembre"}}},"periods":{"format":{"abbreviated":{"afternoon":"ap.m.","am":"AM","pm":"PM"},"narrow":{"afternoon":"ap.-m.","am":"a","morning":"matin","night":"soir","noon":"midi","pm":"p"},"wide":{"afternoon":"après-midi","am":"AM","morning":"matin","night":"soir","noon":"midi","pm":"PM","variant":{"am":"a.m.","pm":"p.m."}}},"stand-alone":{"abbreviated":{"afternoon":"ap.m.","am":"av.m.","pm":"ap.m."},"wide":{"afternoon":"après-midi","am":"avant-midi","morning":"matin","night":"soir","noon":"midi","pm":"après-midi"}}},"quarters":{"format":{"abbreviated":{"1":"T1","2":"T2","3":"T3","4":"T4"},"narrow":{"1":1,"2":2,"3":3,"4":4},"wide":{"1":"1er trimestre","2":"2e trimestre","3":"3e trimestre","4":"4e trimestre"}},"stand-alone":{"abbreviated":{"1":"T1","2":"T2","3":"T3","4":"T4"},"narrow":{"1":1,"2":2,"3":3,"4":4},"wide":{"1":"1er trimestre","2":"2e trimestre","3":"3e trimestre","4":"4e trimestre"}}}};

    Calendar.months = function(options) {
      var key, result, root, val;
      if (options == null) {
        options = {};
      }
      root = this.get_root("months", options);
      result = [];
      for (key in root) {
        val = root[key];
        result[parseInt(key) - 1] = val;
      }
      return result;
    };

    Calendar.weekdays = function(options) {
      if (options == null) {
        options = {};
      }
      return this.get_root("days", options);
    };

    Calendar.quarters = function(options) {
      if (options == null) {
        options = {};
      }
      return this.get_root("quarters", options);
    };

    Calendar.periods = function(options) {
      if (options == null) {
        options = {};
      }
      return this.get_root("periods", options);
    };

    Calendar.get_root = function(key, options) {
      var data, format, names_form, ref, ref1, ref2, ref3, root;
      if (options == null) {
        options = {};
      }
      root = this.calendar[key];
      names_form = options["names_form"] || "wide";
      format = options.format || ((root != null ? (ref = root["stand-alone"]) != null ? ref[names_form] : void 0 : void 0) != null ? "stand-alone" : "format");
      data = root[format][names_form];
      if (typeof data === "string" && data.indexOf(REDIRECT_PREFIX) === 0) {
        ref1 = data.slice(REDIRECT_PREFIX.length).split("."), key = ref1[0], format = ref1[1], names_form = ref1[2];
        return ((ref2 = this.calendar[key]) != null ? (ref3 = ref2[format]) != null ? ref3[names_form] : void 0 : void 0) || (function() {
          throw "invalid redirect " + data;
        })();
      } else {
        return data;
      }
    };

    return Calendar;

  })();

  TwitterCldr.PhoneCodes = (function() {
    function PhoneCodes() {}

    PhoneCodes.phone_codes = {"ac":"247","ad":"376","ae":"971","af":"93","ag":"1","ai":"1","al":"355","am":"374","ao":"244","aq":"672","ar":"54","as":"1","at":"43","au":"61","aw":"297","ax":"358","az":"994","ba":"387","bb":"1","bd":"880","be":"32","bf":"226","bg":"359","bh":"973","bi":"257","bj":"229","bl":"590","bm":"1","bn":"673","bo":"591","bq":"599","br":"55","bs":"1","bt":"975","bw":"267","by":"375","bz":"501","ca":"1","cc":"61","cd":"243","cf":"236","cg":"242","ch":"41","ci":"225","ck":"682","cl":"56","cm":"237","cn":"86","co":"57","cr":"506","cu":"53","cv":"238","cw":"599","cx":"61","cy":"357","cz":"420","de":"49","dj":"253","dk":"45","dm":"1","do":"1","dz":"213","ec":"593","ee":"372","eg":"20","eh":"212","er":"291","es":"34","et":"251","fi":"358","fj":"679","fk":"500","fm":"691","fo":"298","fr":"33","ga":"241","gb":"44","gd":"1","ge":"995","gf":"594","gg":"44","gh":"233","gi":"350","gl":"299","gm":"220","gn":"224","gp":"590","gq":"240","gr":"30","gs":"500","gt":"502","gu":"1","gw":"245","gy":"592","hk":"852","hn":"504","hr":"385","ht":"509","hu":"36","id":"62","ie":"353","il":"972","im":"44","in":"91","io":"246","iq":"964","ir":"98","is":"354","it":"39","je":"44","jm":"1","jo":"962","jp":"81","ke":"254","kg":"996","kh":"855","ki":"686","km":"269","kn":"1","kp":"850","kr":"82","kw":"965","ky":"1","kz":"7","la":"856","lb":"961","lc":"1","li":"423","lk":"94","lr":"231","ls":"266","lt":"370","lu":"352","lv":"371","ly":"218","ma":"212","mc":"377","md":"373","me":"382","mf":"590","mg":"261","mh":"692","mk":"389","ml":"223","mm":"95","mn":"976","mo":"853","mp":"1","mq":"596","mr":"222","ms":"1","mt":"356","mu":"230","mv":"960","mw":"265","mx":"52","my":"60","mz":"258","na":"264","nc":"687","ne":"227","nf":"672","ng":"234","ni":"505","nl":"31","no":"47","np":"977","nr":"674","nu":"683","nz":"64","om":"968","pa":"507","pe":"51","pf":"689","pg":"675","ph":"63","pk":"92","pl":"48","pm":"508","pn":"870","pr":"1","ps":"972","pt":"351","pw":"680","py":"595","qa":"974","re":"262","ro":"40","rs":"381","ru":"7","rw":"250","sa":"966","sb":"677","sc":"248","sd":"249","se":"46","sg":"65","sh":"290","si":"386","sj":"47","sk":"421","sl":"232","sm":"378","sn":"221","so":"252","sr":"597","ss":"211","st":"239","sv":"503","sx":"1","sy":"963","sz":"268","tc":"1","td":"235","tf":"262","tg":"228","th":"66","tj":"992","tk":"690","tl":"670","tm":"993","tn":"216","to":"676","tr":"90","tt":"1","tv":"688","tw":"886","tz":"255","ua":"380","ug":"256","um":"1","us":"1","uy":"598","uz":"998","va":"39","vc":"1","ve":"58","vg":"1","vi":"1","vn":"84","vu":"678","wf":"681","ws":"685","xk":"377","ye":"967","yt":"262","za":"27","zm":"260","zw":"263"};

    PhoneCodes.territories = function() {
      var _, data;
      return this.codes || (this.codes = (function() {
        var ref, results;
        ref = this.phone_codes;
        results = [];
        for (data in ref) {
          _ = ref[data];
          results.push(data);
        }
        return results;
      }).call(this));
    };

    PhoneCodes.code_for_territory = function(territory) {
      var result;
      result = this.phone_codes[territory];
      if (result != null) {
        return result;
      } else {
        return null;
      }
    };

    return PhoneCodes;

  })();

  TwitterCldr.PostalCodes = (function() {
    var find_regex, postal_codes;

    function PostalCodes() {}

    postal_codes = {"ad":"AD\\d{3}","am":"(37)?\\d{4}","ar":"([A-HJ-NP-Z])?\\d{4}([A-Z]{3})?","as":"96799","at":"\\d{4}","au":"\\d{4}","ax":"22\\d{3}","az":"\\d{4}","ba":"\\d{5}","bb":"(BB\\d{5})?","bd":"\\d{4}","be":"\\d{4}","bg":"\\d{4}","bh":"((1[0-2]|[2-9])\\d{2})?","bm":"[A-Z]{2}[ ]?[A-Z0-9]{2}","bn":"[A-Z]{2}[ ]?\\d{4}","br":"\\d{5}[\\-]?\\d{3}","by":"\\d{6}","ca":"[ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z][ ]?\\d[ABCEGHJ-NPRSTV-Z]\\d","cc":"6799","ch":"\\d{4}","ck":"\\d{4}","cl":"\\d{7}","cn":"\\d{6}","cr":"\\d{4,5}|\\d{3}-\\d{4}","cs":"\\d{5}","cv":"\\d{4}","cx":"6798","cy":"\\d{4}","cz":"\\d{3}[ ]?\\d{2}","de":"\\d{5}","dk":"\\d{4}","do":"\\d{5}","dz":"\\d{5}","ec":"([A-Z]\\d{4}[A-Z]|(?:[A-Z]{2})?\\d{6})?","ee":"\\d{5}","eg":"\\d{5}","es":"\\d{5}","et":"\\d{4}","fi":"\\d{5}","fk":"FIQQ 1ZZ","fm":"(9694[1-4])([ \\-]\\d{4})?","fo":"\\d{3}","fr":"\\d{2}[ ]?\\d{3}","gb":"GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\\d{1,4}","ge":"\\d{4}","gf":"9[78]3\\d{2}","gg":"GY\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}","gl":"39\\d{2}","gn":"\\d{3}","gp":"9[78][01]\\d{2}","gr":"\\d{3}[ ]?\\d{2}","gs":"SIQQ 1ZZ","gt":"\\d{5}","gu":"969[123]\\d([ \\-]\\d{4})?","gw":"\\d{4}","hm":"\\d{4}","hn":"(?:\\d{5})?","hr":"\\d{5}","ht":"\\d{4}","hu":"\\d{4}","id":"\\d{5}","il":"\\d{5}","im":"IM\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}","in":"\\d{6}","io":"BBND 1ZZ","iq":"\\d{5}","is":"\\d{3}","it":"\\d{5}","je":"JE\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}","jo":"\\d{5}","jp":"\\d{3}-\\d{4}","ke":"\\d{5}","kg":"\\d{6}","kh":"\\d{5}","kr":"\\d{3}[\\-]\\d{3}","kw":"\\d{5}","kz":"\\d{6}","la":"\\d{5}","lb":"(\\d{4}([ ]?\\d{4})?)?","li":"(948[5-9])|(949[0-7])","lk":"\\d{5}","lr":"\\d{4}","ls":"\\d{3}","lt":"\\d{5}","lu":"\\d{4}","lv":"\\d{4}","ma":"\\d{5}","mc":"980\\d{2}","md":"\\d{4}","me":"8\\d{4}","mg":"\\d{3}","mh":"969[67]\\d([ \\-]\\d{4})?","mk":"\\d{4}","mn":"\\d{6}","mp":"9695[012]([ \\-]\\d{4})?","mq":"9[78]2\\d{2}","mt":"[A-Z]{3}[ ]?\\d{2,4}","mu":"(\\d{3}[A-Z]{2}\\d{3})?","mv":"\\d{5}","mx":"\\d{5}","my":"\\d{5}","nc":"988\\d{2}","ne":"\\d{4}","nf":"2899","ng":"(\\d{6})?","ni":"((\\d{4}-)?\\d{3}-\\d{3}(-\\d{1})?)?","nl":"\\d{4}[ ]?[A-Z]{2}","no":"\\d{4}","np":"\\d{5}","nz":"\\d{4}","om":"(PC )?\\d{3}","pf":"987\\d{2}","pg":"\\d{3}","ph":"\\d{4}","pk":"\\d{5}","pl":"\\d{2}-\\d{3}","pm":"9[78]5\\d{2}","pn":"PCRN 1ZZ","pr":"00[679]\\d{2}([ \\-]\\d{4})?","pt":"\\d{4}([\\-]\\d{3})?","pw":"96940","py":"\\d{4}","re":"9[78]4\\d{2}","ro":"\\d{6}","rs":"\\d{6}","ru":"\\d{6}","sa":"\\d{5}","se":"\\d{3}[ ]?\\d{2}","sg":"\\d{6}","sh":"(ASCN|STHL) 1ZZ","si":"\\d{4}","sj":"\\d{4}","sk":"\\d{3}[ ]?\\d{2}","sm":"4789\\d","sn":"\\d{5}","so":"\\d{5}","sz":"[HLMS]\\d{3}","tc":"TKCA 1ZZ","th":"\\d{5}","tj":"\\d{6}","tm":"\\d{6}","tn":"\\d{4}","tr":"\\d{5}","tw":"\\d{3}(\\d{2})?","ua":"\\d{5}","us":"\\d{5}([ \\-]\\d{4})?","uy":"\\d{5}","uz":"\\d{6}","va":"00120","ve":"\\d{4}","vi":"008(([0-4]\\d)|(5[01]))([ \\-]\\d{4})?","wf":"986\\d{2}","xk":"\\d{5}","yt":"976\\d{2}","yu":"\\d{5}","za":"\\d{4}","zm":"\\d{5}"};

    find_regex = function(territory) {
      var regex_str;
      regex_str = postal_codes[territory];
      if (regex_str != null) {
        return regex_str;
      } else {
        return null;
      }
    };

    PostalCodes.territories = function() {
      var _, data;
      return this.codes || (this.codes = (function() {
        var results;
        results = [];
        for (data in postal_codes) {
          _ = postal_codes[data];
          results.push(data);
        }
        return results;
      })());
    };

    PostalCodes.regex_for_territory = function(territory) {
      var regex;
      regex = find_regex(territory);
      if (regex != null) {
        return new RegExp(regex);
      } else {
        return null;
      }
    };

    PostalCodes.is_valid = function(territory, postal_code) {
      var regex;
      regex = this.regex_for_territory(territory);
      return regex.test(postal_code);
    };

    return PostalCodes;

  })();

  TwitterCldr.Languages = (function() {
    var rtl_data;

    function Languages() {}

    Languages.all = {"aa":"afar","ab":"abkhaze","ace":"aceh","ach":"acoli","ada":"adangme","ady":"adyghéen","ae":"avestique","af":"afrikaans","afa":"langue afro-asiatique","afh":"afrihili","agq":"aghem","ain":"aïnou","ak":"akan","akk":"akkadien","ale":"aléoute","alg":"langue algonquienne","alt":"altaï du Sud","am":"amharique","an":"aragonais","ang":"ancien anglais","anp":"angika","apa":"langue apache","ar":"arabe","ar-001":"arabe standard moderne","arc":"araméen","arn":"araukan","arp":"arapaho","art":"langue artificielle","arw":"arawak","as":"assamais","asa":"assou","ast":"asturien","ath":"langue athapascane","aus":"langue australienne","av":"avar","awa":"awadhi","ay":"aymara","az":"azéri","ba":"bachkir","bad":"banda","bai":"langue bamilékée","bal":"baloutchi","ban":"balinais","bas":"bassa","bat":"langue balte","bax":"bamoun","bbj":"ghomala","be":"biélorusse","bej":"bedja","bem":"bemba","ber":"berbère","bez":"béna","bfd":"bafut","bg":"bulgare","bh":"bihari","bho":"bhojpuri","bi":"bichelamar","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengali","bnt":"bantou","bo":"tibétain","br":"breton","bra":"braj","brx":"bodo","bs":"bosniaque","bss":"akoose","btk":"batak","bua":"bouriate","bug":"bugi","bum":"boulou","byn":"blin","byv":"medumba","ca":"catalan","cad":"caddo","cai":"langue amérindienne centrale","car":"caribe","cau":"langue caucasienne","cay":"cayuga","cch":"atsam","ce":"tchétchène","ceb":"cebuano","cel":"langue celtique","cgg":"kiga","ch":"chamorro","chb":"chibcha","chg":"tchaghataï","chk":"chuuk","chm":"mari","chn":"jargon chinook","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"cheyenne","ckb":"sorani","cmc":"langue chame","co":"corse","cop":"copte","cpe":"créole ou pidgin anglais","cpf":"créole ou pidgin français","cpp":"créole ou pidgin portugais","cr":"cree","crh":"turc de Crimée","crp":"créole ou pidgin","cs":"tchèque","csb":"kachoube","cu":"slavon d’église","cus":"langue couchitique","cv":"tchouvache","cy":"gallois","da":"danois","dak":"dakota","dar":"dargwa","dav":"taita","day":"dayak","de":"allemand","de-AT":"allemand autrichien","de-CH":"allemand suisse","del":"delaware","den":"slavey","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"langue dravidienne","dsb":"bas-sorabe","dua":"douala","dum":"moyen néerlandais","dv":"maldivien","dyo":"diola-fogny","dyu":"dioula","dz":"dzongkha","dzg":"dazaga","ebu":"embou","ee":"éwé","efi":"efik","egy":"égyptien ancien","eka":"ekajuk","el":"grec","elx":"élamite","en":"anglais","en-AU":"anglais australien","en-CA":"anglais canadien","en-GB":"anglais (R.-U.)","en-US":"anglais (É.-U.)","enm":"moyen anglais","eo":"espéranto","es":"espagnol","es-419":"espagnol latino-américain","es-ES":"espagnol d’Europe","es-MX":"espagnol mexicain","et":"estonien","eu":"basque","ewo":"éwondo","fa":"persan","fan":"fang","fat":"fanti","ff":"peul","fi":"finnois","fil":"filipino","fiu":"langue finno-ougrienne","fj":"fidjien","fo":"féroïen","fon":"fon","fr":"français","fr-CA":"français canadien","fr-CH":"français suisse","frm":"moyen français","fro":"ancien français","frr":"frison du Nord","frs":"frison oriental","fur":"frioulan","fy":"frison occidental","ga":"irlandais","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"gaélique écossais","gem":"langue germanique","gez":"guèze","gil":"gilbertais","gl":"galicien","gmh":"moyen haut-allemand","gn":"guarani","goh":"ancien haut allemand","gon":"gondi","gor":"gorontalo","got":"gotique","grb":"grebo","grc":"grec ancien","gsw":"alémanique","gu":"gujarati","guz":"gusii","gv":"manx","gwi":"gwichʼin","ha":"haoussa","hai":"haida","haw":"hawaïen","he":"hébreu","hi":"hindi","hil":"hiligaynon","him":"himachali","hit":"hittite","hmn":"hmong","ho":"hiri motu","hr":"croate","hsb":"haut-sorabe","ht":"haïtien","hu":"hongrois","hup":"hupa","hy":"arménien","hz":"héréro","ia":"interlingua","iba":"iban","ibb":"ibibio","id":"indonésien","ie":"interlingue","ig":"igbo","ii":"yi de Sichuan","ijo":"ijo","ik":"inupiaq","ilo":"ilokano","inc":"langue indo-aryenne","ine":"langue indo-européenne","inh":"ingouche","io":"ido","ira":"langue iranienne","iro":"langue iroquoienne","is":"islandais","it":"italien","iu":"inuktitut","ja":"japonais","jbo":"lojban","jgo":"ngomba","jmc":"machame","jpr":"judéo-persan","jrb":"judéo-arabe","jv":"javanais","ka":"géorgien","kaa":"karakalpak","kab":"kabyle","kac":"kachin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardin","kbl":"kanembou","kcg":"tyap","kde":"makonde","kea":"capverdien","kfo":"koro","kg":"kongo","kha":"khasi","khi":"langue khoïsan","kho":"khotanais","khq":"koyra chiini","ki":"kikuyu","kj":"kuanyama","kk":"kazakh","kkj":"kako","kl":"groenlandais","kln":"kalenjin","km":"khmer","kmb":"kiMboundou","kn":"kannada","ko":"coréen","kok":"konkani","kos":"kusaien","kpe":"kpellé","kr":"kanouri","krc":"karatchaï balkar","krl":"carélien","kro":"krou","kru":"kurukh","ks":"kashmiri","ksb":"chambala","ksf":"bafia","ksh":"francique ripuaire","ku":"kurde","kum":"koumyk","kut":"kutenai","kv":"komi","kw":"cornique","ky":"kirghize","la":"latin","lad":"ladino","lag":"langi","lah":"lahnda","lam":"lamba","lb":"luxembourgeois","lez":"lezghien","lg":"ganda","li":"limbourgeois","lkt":"Lakota","ln":"lingala","lo":"lao","lol":"mongo","loz":"lozi","lt":"lituanien","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"oluluyia","lv":"letton","mad":"madurais","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makassar","man":"mandingue","map":"malayo-polynésien","mas":"masai","mde":"maba","mdf":"moksa","mdr":"mandar","men":"mendé","mer":"merou","mfe":"créole mauricien","mg":"malgache","mga":"moyen irlandais","mgh":"makhuwa-meetto","mgo":"méta'","mh":"marshall","mi":"maori","mic":"micmac","min":"minangkabau","mis":"langue diverse","mk":"macédonien","mkh":"langue mon-khmère","ml":"malayalam","mn":"mongol","mnc":"mandchou","mni":"manipuri","mno":"langue manobo","mo":"moldave","moh":"mohawk","mos":"moré","mr":"marathe","ms":"malais","mt":"maltais","mua":"mundang","mul":"multilingue","mun":"langue mounda","mus":"creek","mwl":"mirandais","mwr":"marwarî","my":"birman","mye":"myènè","myn":"langue maya","myv":"erzya","na":"nauruan","nah":"nahuatl","nai":"langue amérindienne du Nord","nap":"napolitain","naq":"nama","nb":"norvégien bokmål","nd":"ndébélé du Nord","nds":"bas-allemand","ne":"népalais","new":"newari","ng":"ndonga","nia":"nias","nic":"langue nigéro-congolaise","niu":"niué","nl":"néerlandais","nl-BE":"flamand","nmg":"kwasio","nn":"norvégien nynorsk","nnh":"ngiemboon","no":"norvégien","nog":"nogaï","non":"vieux norrois","nqo":"n’ko","nr":"ndébélé du Sud","nso":"sotho du Nord","nub":"langue nubienne","nus":"nuer","nv":"navaho","nwc":"newarî classique","ny":"nyanja","nym":"nyamwezi","nyn":"nyankolé","nyo":"nyoro","nzi":"nzema","oc":"occitan","oj":"ojibwa","om":"oromo","or":"oriya","os":"ossète","osa":"osage","ota":"turc ottoman","oto":"langue otomangue","pa":"pendjabi","paa":"langue papoue","pag":"pangasinan","pal":"pahlavi","pam":"pampangan","pap":"papiamento","pau":"palau","peo":"persan ancien","phi":"langue philippine","phn":"phénicien","pi":"pali","pl":"polonais","pon":"pohnpei","pra":"langues prâkrit","pro":"provençal ancien","ps":"pashto","pt":"portugais","pt-BR":"portugais brésilien","pt-PT":"portugais d’Europe","qu":"quechua","raj":"rajasthani","rap":"rapanui","rar":"rarotongien","rm":"romanche","rn":"roundi","ro":"roumain","roa":"langue romane","rof":"rombo","rom":"tzigane","root":"racine","ru":"russe","rup":"valaque","rw":"rwanda","rwk":"rwa","sa":"sanskrit","sad":"sandawe","sah":"iakoute","sai":"langue amérindienne du Sud","sal":"langue salishenne","sam":"araméen samaritain","saq":"samburu","sas":"sasak","sat":"santal","sba":"ngambay","sbp":"sangu","sc":"sarde","scn":"sicilien","sco":"écossais","sd":"sindhi","se":"sami du Nord","see":"seneca","seh":"sena","sel":"selkoupe","sem":"langue sémitique","ses":"koyraboro senni","sg":"sangho","sga":"ancien irlandais","sgn":"langue des signes","sh":"serbo-croate","shi":"chleuh","shn":"shan","shu":"arabe tchadien","si":"cinghalais","sid":"sidamo","sio":"langue sioux","sit":"langue sino-tibétaine","sk":"slovaque","sl":"slovène","sla":"langue slave","sm":"samoan","sma":"sami du Sud","smi":"langue samie","smj":"sami de Lule","smn":"sami d’Inari","sms":"sami skolt","sn":"shona","snk":"soninké","so":"somali","sog":"sogdien","son":"songhai","sq":"albanais","sr":"serbe","srn":"sranan tongo","srr":"sérère","ss":"swati","ssa":"langue nilo-saharienne","ssy":"saho","st":"sesotho","su":"soundanais","suk":"sukuma","sus":"soussou","sux":"sumérien","sv":"suédois","sw":"swahili","swb":"comorien","swc":"swahili du Congo","syc":"syriaque classique","syr":"syriaque","ta":"tamoul","tai":"langue taï","te":"télougou","tem":"temne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tadjik","th":"thaï","ti":"tigrigna","tig":"tigré","tiv":"tiv","tk":"turkmène","tkl":"tokelau","tl":"tagalog","tlh":"klingon","tli":"tlingit","tmh":"tamacheq","tn":"tswana","to":"tonguien","tog":"tonga nyasa","tpi":"tok pisin","tr":"turc","trv":"taroko","ts":"tsonga","tsi":"tsimshian","tt":"tatar","tum":"tumbuka","tup":"langue tupi","tut":"langue altaïque","tvl":"tuvalu","tw":"twi","twq":"tasawaq","ty":"tahitien","tyv":"touva","tzm":"tamazight","udm":"oudmourte","ug":"ouïgour","uga":"ougaritique","uk":"ukrainien","umb":"umbundu","und":"langue indéterminée","ur":"ourdou","uz":"ouzbek","vai":"vaï","ve":"venda","vi":"vietnamien","vo":"volapuk","vot":"vote","vun":"vunjo","wa":"wallon","wae":"walser","wak":"langues wakashennes","wal":"walamo","war":"waray","was":"washo","wen":"langue sorabe","wo":"wolof","xal":"kalmouk","xh":"xhosa","xog":"soga","yao":"yao","yap":"yapois","yav":"yangben","ybb":"yemba","yi":"yiddish","yo":"yoruba","ypk":"langues yupik","yue":"cantonais","za":"zhuang","zap":"zapotèque","zbl":"symboles Bliss","zen":"zenaga","zgh":"amazighe standard marocain","zh":"chinois","zh-Hans":"chinois simplifié","zh-Hant":"chinois traditionnel","znd":"zandé","zu":"zoulou","zun":"zuni","zxx":"sans contenu linguistique","zza":"zazaki"};

    rtl_data = {"af":false,"ar":true,"be":false,"bg":false,"bn":false,"ca":false,"cs":false,"cy":false,"da":false,"de":false,"de-CH":false,"el":false,"en":false,"en-150":false,"en-AU":false,"en-CA":false,"en-GB":false,"en-IE":false,"en-SG":false,"en-ZA":false,"es":false,"es-419":false,"es-CO":false,"es-MX":false,"es-US":false,"eu":false,"fa":true,"fi":false,"fil":false,"fr":false,"fr-BE":false,"fr-CA":false,"fr-CH":false,"ga":false,"gl":false,"he":true,"hi":false,"hr":false,"hu":false,"id":false,"is":false,"it":false,"it-CH":false,"ja":false,"ko":false,"lv":false,"ms":false,"nb":false,"nl":false,"pl":false,"pt":false,"ro":false,"ru":false,"sk":false,"sq":false,"sr":false,"sv":false,"ta":false,"th":false,"tr":false,"uk":false,"ur":true,"vi":false,"zh":false,"zh-Hant":false};

    Languages.from_code = function(code) {
      return this.all[code] || null;
    };

    Languages.is_rtl = function(locale) {
      var result;
      result = rtl_data[locale];
      if (result != null) {
        return result;
      } else {
        return null;
      }
    };

    return Languages;

  })();

  TwitterCldr.NumberParser = (function() {
    function NumberParser() {
      this.group_separator = "\\\.";
      this.decimal_separator = ",";
      this.separator_chars = ['\\.', ',', '\\s'].join("");
    }

    NumberParser.prototype.parse = function(number_text, options) {
      var l, last, len1, num, num_list, punct_list, result, separators, token, tokens;
      if (options == null) {
        options = {};
      }
      if (options.strict === void 0) {
        options.strict = true;
      }
      separators = this.get_separators(options.strict);
      tokens = this.tokenize(number_text, separators.group, separators.decimal);
      num_list = [];
      punct_list = [];
      for (l = 0, len1 = tokens.length; l < len1; l++) {
        token = tokens[l];
        if (token.type === "numeric") {
          num_list.push(token);
        } else {
          punct_list.push(token);
        }
      }
      if (!this.is_punct_valid(punct_list)) {
        throw "Invalid number";
      }
      if (!(tokens.slice(-1)[0] && tokens.slice(-1)[0]["type"] === "numeric")) {
        throw "Invalid number";
      }
      if (punct_list.length > 0 && punct_list.slice(-1)[0]["type"] === "decimal") {
        result = parseInt(((function() {
          var len2, m, ref, results;
          ref = num_list.slice(0, -1);
          results = [];
          for (m = 0, len2 = ref.length; m < len2; m++) {
            num = ref[m];
            results.push(num.value);
          }
          return results;
        })()).join("")) || 0;
        last = num_list.slice(-1)[0];
        return result + parseInt(last.value) / Math.pow(10.0, last.value.length);
      } else {
        return parseInt(((function() {
          var len2, m, results;
          results = [];
          for (m = 0, len2 = num_list.length; m < len2; m++) {
            num = num_list[m];
            results.push(num.value);
          }
          return results;
        })()).join(""));
      }
    };

    NumberParser.prototype.try_parse = function(number_text, default_value, callback, options) {
      var err, result;
      if (default_value == null) {
        default_value = null;
      }
      if (callback == null) {
        callback = null;
      }
      if (options == null) {
        options = {};
      }
      result = (function() {
        try {
          return this.parse(number_text, options);
        } catch (_error) {
          err = _error;
          if (err.toString() === "Invalid number") {
            return null;
          } else {
            throw err;
          }
        }
      }).call(this);
      if (callback) {
        return callback(result);
      } else {
        if (result === null) {
          return default_value;
        } else {
          return result;
        }
      }
    };

    NumberParser.prototype.is_valid = function(number_text, options) {
      var err;
      if (options == null) {
        options = {};
      }
      try {
        this.parse(number_text, options);
        return true;
      } catch (_error) {
        err = _error;
        if (err.toString() === "Invalid number") {
          return false;
        } else {
          throw err;
        }
      }
    };

    NumberParser.is_numeric = function(text, separators) {
      var regexp;
      if (separators == null) {
        separators = new NumberParser().separator_chars;
      }
      regexp = new RegExp("^[0-9" + separators + "]+$");
      return regexp.test(text);
    };

    NumberParser.prototype.is_punct_valid = function(punct_list) {
      var index, l, len1, punct, valid;
      valid = true;
      for (index = l = 0, len1 = punct_list.length; l < len1; index = ++l) {
        punct = punct_list[index];
        valid = valid && (punct.type === "group" || (index === (punct_list.length - 1) && punct.type === "decimal"));
      }
      return valid;
    };

    NumberParser.prototype.get_separators = function(strict) {
      var decimal, group;
      if (strict == null) {
        strict = false;
      }
      group = strict ? this.group_separator : this.separator_chars;
      decimal = strict ? this.decimal_separator : this.separator_chars;
      return {
        group: group,
        decimal: decimal
      };
    };

    NumberParser.prototype.tokenize = function(number_text, group, decimal) {
      var l, len1, match, match_data, regexp, results, token, tokens;
      regexp = new RegExp("([\\d]*)([" + group + "]{0,1})([\\d]*)([" + decimal + "]{0,1})([\\d]*)");
      match_data = number_text.split(regexp);
      match_data = (function() {
        var l, len1, results;
        results = [];
        for (l = 0, len1 = match_data.length; l < len1; l++) {
          match = match_data[l];
          if (match !== "") {
            results.push(match);
          }
        }
        return results;
      })();
      tokens = (function() {
        var l, len1, results;
        results = [];
        for (l = 0, len1 = match_data.length; l < len1; l++) {
          match = match_data[l];
          results.push(this.identify(match, group, decimal));
        }
        return results;
      }).call(this);
      results = [];
      for (l = 0, len1 = tokens.length; l < len1; l++) {
        token = tokens[l];
        if (token.type !== null) {
          results.push(token);
        }
      }
      return results;
    };

    NumberParser.prototype.identify = function(text, group, decimal) {
      var decimal_regexp, group_regexp, result;
      result = {
        value: text
      };
      result.type = NumberParser.is_numeric(result.value, "") ? "numeric" : (group_regexp = new RegExp("[" + group + "]"), decimal_regexp = new RegExp("[" + decimal + "]"), group_regexp.test(result.value) ? "group" : decimal_regexp.test(result.value) ? "decimal" : null);
      return result;
    };

    return NumberParser;

  })();

  TwitterCldr.TerritoriesContainment = (function() {
    function TerritoriesContainment() {}

    TerritoriesContainment.territories_data = {"001":["002","009","019","142","150"],"002":["011","014","015","017","018"],"003":["013","021","029"],"005":["AR","BO","BR","CL","CO","EC","FK","GF","GY","PE","PY","SR","UY","VE"],"009":["053","054","057","061","QO"],"011":["BF","BJ","CI","CV","GH","GM","GN","GW","LR","ML","MR","NE","NG","SH","SL","SN","TG"],"013":["BZ","CR","GT","HN","MX","NI","PA","SV"],"014":["BI","DJ","ER","ET","KE","KM","MG","MU","MW","MZ","RE","RW","SC","SO","TZ","UG","YT","ZM","ZW"],"015":["DZ","EA","EG","EH","IC","LY","MA","SD","SS","TN"],"017":["AO","CD","CF","CG","CM","GA","GQ","ST","TD","ZR"],"018":["BW","LS","NA","SZ","ZA"],"019":["003","005","013","021","029","419"],"021":["BM","CA","GL","PM","US"],"029":["AG","AI","AN","AW","BB","BL","BQ","BS","CU","CW","DM","DO","GD","GP","HT","JM","KN","KY","LC","MF","MQ","MS","PR","SX","TC","TT","VC","VG","VI"],"030":["CN","HK","JP","KP","KR","MN","MO","TW"],"034":["AF","BD","BT","IN","IR","LK","MV","NP","PK"],"035":["BN","BU","ID","KH","LA","MM","MY","PH","SG","TH","TL","TP","VN"],"039":["AD","AL","BA","CS","ES","GI","GR","HR","IT","ME","MK","MT","PT","RS","SI","SM","VA","XK","YU"],"053":["AU","NF","NZ"],"054":["FJ","NC","PG","SB","VU"],"057":["FM","GU","KI","MH","MP","NR","PW"],"061":["AS","CK","NU","PF","PN","TK","TO","TV","WF","WS"],"142":["030","034","035","143","145"],"143":["KG","KZ","TJ","TM","UZ"],"145":["AE","AM","AZ","BH","CY","GE","IL","IQ","JO","KW","LB","NT","OM","PS","QA","SA","SY","TR","YD","YE"],"150":["039","151","154","155","EU","QU"],"151":["BG","BY","CZ","HU","MD","PL","RO","RU","SK","SU","UA"],"154":["AX","DK","EE","FI","FO","GB","GG","IE","IM","IS","JE","LT","LV","false","SE","SJ"],"155":["AT","BE","CH","DD","DE","FR","FX","LI","LU","MC","NL"],"419":["005","013","029"],"EU":["AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI","FR","GB","GR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK"],"QO":["AC","AQ","BV","CC","CP","CX","DG","GS","HM","IO","TA","TF","UM"]};

    TerritoriesContainment.contains = function(parent_code, child_code) {
      var contains, immediate_child, immediate_children, l, len1;
      this.validate_territory(parent_code);
      this.validate_territory(child_code);
      immediate_children = this.children(parent_code);
      contains = false;
      if (indexOf.call(immediate_children, child_code) >= 0) {
        contains = true;
      } else {
        for (l = 0, len1 = immediate_children.length; l < len1; l++) {
          immediate_child = immediate_children[l];
          if (this.contains(immediate_child, child_code)) {
            contains = true;
            break;
          }
        }
      }
      return contains;
    };

    TerritoriesContainment.parents = function(territory_code) {
      this.validate_territory(territory_code);
      return this.parents_data[territory_code];
    };

    TerritoriesContainment.children = function(territory_code) {
      this.validate_territory(territory_code);
      return this.territories_data[territory_code] || [];
    };

    TerritoriesContainment.prepare_parents_data = function() {
      var child, children, data, l, len1, ref, territory;
      data = {};
      ref = this.territories_data;
      for (territory in ref) {
        children = ref[territory];
        if (!(territory in data)) {
          data[territory] = [];
        }
        for (l = 0, len1 = children.length; l < len1; l++) {
          child = children[l];
          if (!(child in data)) {
            data[child] = [];
          }
          data[child].push(territory);
        }
      }
      return data;
    };

    TerritoriesContainment.parents_data = TerritoriesContainment.prepare_parents_data();

    TerritoriesContainment.validate_territory = function(territory_code) {
      if (!(territory_code in this.parents_data)) {
        throw "unknown territory code";
      }
    };

    return TerritoriesContainment;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : (this.TwitterCldr = {}, this.TwitterCldr);

  for (key in TwitterCldr) {
    obj = TwitterCldr[key];
    root[key] = obj;
  }

}).call(this);
