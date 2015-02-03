
/*
// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

// TwitterCLDR (JavaScript) v2.4.0
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
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  TwitterCldr = {};

  TwitterCldr.is_rtl = false;

  TwitterCldr.locale = "el";

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
      var code_point, idx, result, _i, _ref;
      result = [];
      for (idx = _i = 0, _ref = str.length; 0 <= _ref ? _i < _ref : _i > _ref; idx = 0 <= _ref ? ++_i : --_i) {
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
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = char_arr.length; _i < _len; _i++) {
          cur_char = char_arr[_i];
          _results.push(this.from_char_code(cur_char));
        }
        return _results;
      }).call(this)).join("");
    };

    Utilities.arraycopy = function(orig, orig_index, dest, dest_index, length) {
      var count, elem, _i, _len, _ref;
      _ref = orig.slice(orig_index, orig_index + length);
      for (count = _i = 0, _len = _ref.length; _i < _len; count = ++_i) {
        elem = _ref[count];
        dest[dest_index + count] = elem;
      }
    };

    Utilities.max = function(arr) {
      var elem, i, max, start_index, _i, _j, _len, _ref;
      max = null;
      for (start_index = _i = 0, _len = arr.length; _i < _len; start_index = ++_i) {
        elem = arr[start_index];
        if (elem != null) {
          max = elem;
          break;
        }
      }
      for (i = _j = start_index, _ref = arr.length; start_index <= _ref ? _j <= _ref : _j >= _ref; i = start_index <= _ref ? ++_j : --_j) {
        if (arr[i] > max) {
          max = arr[i];
        }
      }
      return max;
    };

    Utilities.min = function(arr) {
      var elem, i, min, start_index, _i, _j, _len, _ref;
      min = null;
      for (start_index = _i = 0, _len = arr.length; _i < _len; start_index = ++_i) {
        elem = arr[start_index];
        if (elem != null) {
          min = elem;
          break;
        }
      }
      for (i = _j = start_index, _ref = arr.length; start_index <= _ref ? _j <= _ref : _j >= _ref; i = start_index <= _ref ? ++_j : --_j) {
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

    Utilities.remove_duplicates = function(arr) {
      return arr.reduce((function(u, elem) {
        if (u.indexOf(elem) < 0) {
          u.push(elem);
        }
        return u;
      }), []);
    };

    Utilities.regex_escape = function(s) {
      return s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    Utilities.trim_string = function(s) {
      return s.replace(/^\s+|\s+$/g, '');
    };

    Utilities.clone = function(obj) {
      var flags, key, newInstance;
      if ((obj == null) || typeof obj !== 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof RegExp) {
        flags = '';
        if (obj.global != null) {
          flags += 'g';
        }
        if (obj.ignoreCase != null) {
          flags += 'i';
        }
        if (obj.multiline != null) {
          flags += 'm';
        }
        if (obj.sticky != null) {
          flags += 'y';
        }
        return new RegExp(obj.source, flags);
      }
      newInstance = new obj.constructor();
      for (key in obj) {
        newInstance[key] = this.clone(obj[key]);
      }
      return newInstance;
    };

    Utilities.compute_cache_key = function(pieces) {
      if ((pieces != null) && pieces.length > 0) {
        return pieces.join("|");
      }
      return null;
    };

    return Utilities;

  })();

  TwitterCldr.PluralRules = (function() {
    function PluralRules() {}

    PluralRules.rules = {cardinal: (function(num, runtime) { var n = runtime.n(num); var i = runtime.i(num); var v = runtime.v(num); var w = runtime.w(num); var f = runtime.f(num); var t = runtime.t(num); return (n == 1 ? 'one' : 'other'); }), ordinal: (function(num, runtime) { var n = runtime.n(num); var i = runtime.i(num); var v = runtime.v(num); var w = runtime.w(num); var f = runtime.f(num); var t = runtime.t(num); return 'other'; })};

    PluralRules.runtime = (function() {
  this.buildArgsFor = function(num_str) {
    return [
      this.n(num_str), this.i(num_str), this.f(num_str),
      this.t(num_str), this.v(num_str), this.w(num_str)
    ];
  }

  this.n = function(str) {
    if (str.indexOf('.') > -1) {
      return this.toNum(this._n(str).replace(/([0]+\.$)/, ''));
    } else {
      return this.toNum(this._n(str));
    }
  }

  this.i = function(str) {
    return this.toNum(this._i(str));
  }

  this.f = function(str) {
    return this.toNum(this._f(str));
  }

  this.t = function(str) {
    return this.toNum(this._t(str));
  }

  this.v = function(str) {
    return this.toNum(this._v(str));
  }

  this.w = function(str) {
    return this.toNum(this._w(str));
  }

  // private

  this.toNum = function(str) {
    if (str.length == 0) {
      return 0;
    } else {
      return str.indexOf('.') > -1 ? parseFloat(str) : parseInt(str);
    }
  }

  // absolute value of the source number (integer and decimals).
  this._n = function(str) {
    return /(-)?(.*)/.exec(str)[2];
  }

  /// integer digits of n.
  this._i = function(str) {
    return /([\d]+)(\..*)?/.exec(this._n(str))[1];
  }

  // visible fractional digits in n, with trailing zeros.
  this._f = function(str) {
    return /([\d]+\.?)(.*)/.exec(this._n(str))[2];
  }

  // visible fractional digits in n, without trailing zeros.
  this._t = function(str) {
    return this._f(str).replace(/([0]+$)/, '');
  }

  // number of visible fraction digits in n, with trailing zeros.
  this._v = function(str) {
    return this._f(str).length.toString();
  }

  // number of visible fraction digits in n, without trailing zeros.
  this._w = function(str) {
    return this._t(str).length.toString();
  }

  return this;
})();
;

    PluralRules.names = {
      cardinal: ["one", "other"],
      ordinal: ["other"]
    };

    PluralRules.all = function(type) {
      if (type == null) {
        type = 'cardinal';
      }
      return this.names[type];
    };

    PluralRules.rule_for = function(number, type) {
      var error;
      if (type == null) {
        type = 'cardinal';
      }
      try {
        return this.rules[type](number.toString(), this.runtime);
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
      this.patterns = {"ago":{"second":{"default":{"one":"Πριν από {0} δευτερόλεπτο","other":"Πριν από {0} δευτερόλεπτα"}},"minute":{"default":{"one":"Πριν από {0} λεπτό","other":"Πριν από {0} λεπτά"}},"hour":{"default":{"one":"Πριν από {0} ώρα","other":"Πριν από {0} ώρες"}},"day":{"default":{"one":"Πριν από {0} ημέρα","other":"Πριν από {0} ημέρες"}},"week":{"default":{"one":"Πριν από {0} εβδομάδα","other":"Πριν από {0} εβδομάδες"}},"month":{"default":{"one":"Πριν από {0} μήνα","other":"Πριν από {0} μήνες"}},"year":{"default":{"one":"Πριν από {0} έτος","other":"Πριν από {0} έτη"}}},"until":{"second":{"default":{"one":"Σε {0} δευτερόλεπτο","other":"Σε {0} δευτερόλεπτα"}},"minute":{"default":{"one":"Σε {0} λεπτό","other":"Σε {0} λεπτά"}},"hour":{"default":{"one":"Σε {0} ώρα","other":"Σε {0} ώρες"}},"day":{"default":{"one":"Σε {0} ημέρα","other":"Σε {0} ημέρες"}},"week":{"default":{"one":"Σε {0} εβδομάδα","other":"Σε {0} εβδομάδες"}},"month":{"default":{"one":"Σε {0} μήνα","other":"Σε {0} μήνες"}},"year":{"default":{"one":"Σε {0} έτος","other":"Σε {0} έτη"}}},"none":{"second":{"default":{"one":"{0} δευτερόλεπτο","other":"{0} δευτερόλεπτα"},"short":{"one":"{0} δευτερόλεπτο","other":"{0} δευτερόλεπτα"},"abbreviated":{"one":"{0}δ","other":"{0}δ"}},"minute":{"default":{"one":"{0} λεπτό","other":"{0} λεπτά"},"short":{"one":"{0} λεπτό","other":"{0} λεπτά"},"abbreviated":{"one":"{0}λ","other":"{0}λ"}},"hour":{"default":{"one":"{0} ώρα","other":"{0} ώρες"},"short":{"one":"{0} ώρα","other":"{0} ώρες"},"abbreviated":{"one":"{0}ώ","other":"{0}ώ"}},"day":{"default":{"one":"{0} ημέρα","other":"{0} ημέρες"},"short":{"one":"{0} ημέρα","other":"{0} ημέρες"},"abbreviated":{"one":"{0}η","other":"{0}η"}},"week":{"default":{"one":"{0} εβδομάδα","other":"{0} εβδομάδες"},"short":{"one":"{0} εβδομάδα","other":"{0} εβδομάδες"}},"month":{"default":{"one":"{0} μήνας","other":"{0} μήνες"},"short":{"one":"{0} μήνας","other":"{0} μήνες"}},"year":{"default":{"one":"{0} έτος","other":"{0} έτη"},"short":{"one":"{0} έτος","other":"{0} έτη"}}}};
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
      this.tokens = {"date_time":{"default":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"full":[{"value":"EEEE","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"-","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"zzzz","type":"pattern"}],"long":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"-","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"z","type":"pattern"}],"medium":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"short":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"yy","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"additional":{"E":[{"value":"ccc","type":"pattern"}],"EHm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"LLL","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"pattern"}],"HHmm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"HHmmss":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"}],"MMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"}],"MMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"}],"MMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"}],"Md":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMM":[{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"QQQ","type":"pattern"}],"yQQQQ":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"QQQQ","type":"pattern"}]}},"time":{"default":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"full":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"zzzz","type":"pattern"}],"long":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"z","type":"pattern"}],"medium":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"short":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"additional":{"E":[{"value":"ccc","type":"plaintext"}],"EHm":[{"value":"E ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"E d","type":"plaintext"}],"Ehm":[{"value":"E ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y G","type":"plaintext"}],"GyMMM":[{"value":"LLL y G","type":"plaintext"}],"GyMMMEd":[{"value":"E, d MMM y G","type":"plaintext"}],"GyMMMd":[{"value":"d MMM y G","type":"plaintext"}],"H":[{"value":"HH","type":"pattern"}],"HHmm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"HHmmss":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"plaintext"}],"MEd":[{"value":"E, d/M","type":"plaintext"}],"MMM":[{"value":"LLL","type":"plaintext"}],"MMMEd":[{"value":"E, d MMM","type":"plaintext"}],"MMMMEd":[{"value":"E, d MMMM","type":"plaintext"}],"MMMMd":[{"value":"d MMMM","type":"plaintext"}],"MMMd":[{"value":"d MMM","type":"plaintext"}],"Md":[{"value":"d/M","type":"plaintext"}],"d":[{"value":"d","type":"plaintext"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"plaintext"}],"yM":[{"value":"M/y","type":"plaintext"}],"yMEd":[{"value":"E, d/M/y","type":"plaintext"}],"yMMM":[{"value":"MMM y","type":"plaintext"}],"yMMMEd":[{"value":"E, d MMM y","type":"plaintext"}],"yMMMM":[{"value":"MMMM y","type":"plaintext"}],"yMMMd":[{"value":"d MMM y","type":"plaintext"}],"yMd":[{"value":"d/M/y","type":"plaintext"}],"yQQQ":[{"value":"y QQQ","type":"plaintext"}],"yQQQQ":[{"value":"y QQQQ","type":"plaintext"}]}},"date":{"default":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"full":[{"value":"EEEE","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"long":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"medium":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"short":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"yy","type":"pattern"}],"additional":{"E":[{"value":"ccc","type":"pattern"}],"EHm":[{"value":"E","type":"pattern"},{"value":" HH:mm","type":"plaintext"}],"EHms":[{"value":"E","type":"pattern"},{"value":" HH:mm:ss","type":"plaintext"}],"Ed":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" h:mm a","type":"plaintext"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" h:mm:ss a","type":"plaintext"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"LLL","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"plaintext"}],"HHmm":[{"value":"HH:mm","type":"plaintext"}],"HHmmss":[{"value":"HH:mm:ss","type":"plaintext"}],"Hm":[{"value":"HH:mm","type":"plaintext"}],"Hms":[{"value":"HH:mm:ss","type":"plaintext"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"}],"MMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"}],"MMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMMM","type":"pattern"}],"MMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"}],"Md":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h a","type":"plaintext"}],"hm":[{"value":"h:mm a","type":"plaintext"}],"hms":[{"value":"h:mm:ss a","type":"plaintext"}],"ms":[{"value":"mm:ss","type":"plaintext"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMM":[{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"QQQ","type":"pattern"}],"yQQQQ":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"QQQQ","type":"pattern"}]}}};
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
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          token = tokens[_i];
          _results.push(format_token(token));
        }
        return _results;
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
      var key, _results;
      _results = [];
      for (key in this.pattern_hash) {
        _results.push(key);
      }
      return _results;
    };

    AdditionalDateFormatSelector.prototype.separate = function(pattern_key) {
      var cur_char, last_char, result, _i, _len;
      last_char = "";
      result = [];
      for (_i = 0, _len = pattern_key.length; _i < _len; _i++) {
        cur_char = pattern_key[_i];
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
      var key, _results;
      _results = [];
      for (key in this.pattern_hash) {
        _results.push(this.separate(key));
      }
      return _results;
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
      var count, entity, goal_entity, _i, _len;
      count = 0;
      for (_i = 0, _len = goal_entities.length; _i < _len; _i++) {
        goal_entity = goal_entities[_i];
        if (!(((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = entities.length; _j < _len1; _j++) {
            entity = entities[_j];
            if (entity[0] === goal_entity[0]) {
              _results.push(entity);
            }
          }
          return _results;
        })()).length > 0)) {
          count += 1;
        }
      }
      return count;
    };

    AdditionalDateFormatSelector.prototype.count_score = function(entities, goal_entities) {
      var entity, found_entity, goal_entity, sum, _i, _len;
      sum = 0;
      for (_i = 0, _len = goal_entities.length; _i < _len; _i++) {
        goal_entity = goal_entities[_i];
        found_entity = ((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = entities.length; _j < _len1; _j++) {
            entity = entities[_j];
            if (entity[0] === goal_entity[0]) {
              _results.push(entity);
            }
          }
          return _results;
        })())[0];
        if (found_entity != null) {
          sum += Math.abs(found_entity.length - goal_entity.length);
        }
      }
      return sum;
    };

    AdditionalDateFormatSelector.prototype.rank = function(goal_pattern) {
      var result, separated_goal_pattern, separated_pattern, _i, _len, _ref;
      separated_goal_pattern = this.separate(goal_pattern);
      result = {};
      _ref = this.all_separated_patterns();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        separated_pattern = _ref[_i];
        result[separated_pattern.join("")] = this.score(separated_pattern, separated_goal_pattern);
      }
      return result;
    };

    return AdditionalDateFormatSelector;

  })();

  TwitterCldr.NumberFormatter = (function() {
    function NumberFormatter() {
      this.all_tokens = {"default":{"positive":["","#,##0.###"],"negative":["-","#,##0.###"]},"decimal":{"positive":["","#,##0.###"],"negative":["-","#,##0.###"]},"long_decimal":{"positive":{"1000":{"one":["","0"," χιλιάδα"],"other":["","0"," χιλιάδες"]},"10000":{"one":["","00"," χιλιάδες"],"other":["","00"," χιλιάδες"]},"100000":{"one":["","000"," χιλιάδες"],"other":["","000"," χιλιάδες"]},"1000000":{"one":["","0"," εκατομμύριο"],"other":["","0"," εκατομμύρια"]},"10000000":{"one":["","00"," εκατομμύρια"],"other":["","00"," εκατομμύρια"]},"100000000":{"one":["","000"," εκατομμύρια"],"other":["","000"," εκατομμύρια"]},"1000000000":{"one":["","0"," δισεκατομμύριο"],"other":["","0"," δισεκατομμύρια"]},"10000000000":{"one":["","00"," δισεκατομμύρια"],"other":["","00"," δισεκατομμύρια"]},"100000000000":{"one":["","000"," δισεκατομμύρια"],"other":["","000"," δισεκατομμύρια"]},"1000000000000":{"one":["","0"," τρισεκατομμύριο"],"other":["","0"," τρισεκατομμύρια"]},"10000000000000":{"one":["","00"," τρισεκατομμύρια"],"other":["","00"," τρισεκατομμύρια"]},"100000000000000":{"one":["","000"," τρισεκατομμύρια"],"other":["","000"," τρισεκατομμύρια"]}},"negative":{"1000":{"one":["-","0"," χιλιάδα"],"other":["-","0"," χιλιάδες"]},"10000":{"one":["-","00"," χιλιάδες"],"other":["-","00"," χιλιάδες"]},"100000":{"one":["-","000"," χιλιάδες"],"other":["-","000"," χιλιάδες"]},"1000000":{"one":["-","0"," εκατομμύριο"],"other":["-","0"," εκατομμύρια"]},"10000000":{"one":["-","00"," εκατομμύρια"],"other":["-","00"," εκατομμύρια"]},"100000000":{"one":["-","000"," εκατομμύρια"],"other":["-","000"," εκατομμύρια"]},"1000000000":{"one":["-","0"," δισεκατομμύριο"],"other":["-","0"," δισεκατομμύρια"]},"10000000000":{"one":["-","00"," δισεκατομμύρια"],"other":["-","00"," δισεκατομμύρια"]},"100000000000":{"one":["-","000"," δισεκατομμύρια"],"other":["-","000"," δισεκατομμύρια"]},"1000000000000":{"one":["-","0"," τρισεκατομμύριο"],"other":["-","0"," τρισεκατομμύρια"]},"10000000000000":{"one":["-","00"," τρισεκατομμύρια"],"other":["-","00"," τρισεκατομμύρια"]},"100000000000000":{"one":["-","000"," τρισεκατομμύρια"],"other":["-","000"," τρισεκατομμύρια"]}}},"short_decimal":{"positive":{"1000":{"one":["","0"," χιλ."],"other":["","0"," χιλ."]},"10000":{"one":["","00"," χιλ."],"other":["","00"," χιλ."]},"100000":{"one":["","000"," χιλ."],"other":["","000"," χιλ."]},"1000000":{"one":["","0"," εκ."],"other":["","0"," εκ."]},"10000000":{"one":["","00"," εκ."],"other":["","00"," εκ."]},"100000000":{"one":["","000"," εκ."],"other":["","000"," εκ."]},"1000000000":{"one":["","0"," δισ."],"other":["","0"," δισ."]},"10000000000":{"one":["","00"," δισ."],"other":["","00"," δισ."]},"100000000000":{"one":["","000"," δισ."],"other":["","000"," δισ."]},"1000000000000":{"one":["","0"," τρισ."],"other":["","0"," τρισ."]},"10000000000000":{"one":["","00"," τρισ."],"other":["","00"," τρισ."]},"100000000000000":{"one":["","000"," τρισ."],"other":["","000"," τρισ."]}},"negative":{"1000":{"one":["-","0"," χιλ."],"other":["-","0"," χιλ."]},"10000":{"one":["-","00"," χιλ."],"other":["-","00"," χιλ."]},"100000":{"one":["-","000"," χιλ."],"other":["-","000"," χιλ."]},"1000000":{"one":["-","0"," εκ."],"other":["-","0"," εκ."]},"10000000":{"one":["-","00"," εκ."],"other":["-","00"," εκ."]},"100000000":{"one":["-","000"," εκ."],"other":["-","000"," εκ."]},"1000000000":{"one":["-","0"," δισ."],"other":["-","0"," δισ."]},"10000000000":{"one":["-","00"," δισ."],"other":["-","00"," δισ."]},"100000000000":{"one":["-","000"," δισ."],"other":["-","000"," δισ."]},"1000000000000":{"one":["-","0"," τρισ."],"other":["-","0"," τρισ."]},"10000000000000":{"one":["-","00"," τρισ."],"other":["-","00"," τρισ."]},"100000000000000":{"one":["-","000"," τρισ."],"other":["-","000"," τρισ."]}}},"currency":{"positive":["","#,##0.00"," ¤"],"negative":["-","#,##0.00"," ¤"]},"percent":{"positive":["","#,##0","%"],"negative":["-","#,##0","%"]}};
      this.tokens = [];
      this.symbols = {"alias":"","decimal":",","exponential":"e","group":".","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+","superscripting_exponent":"×","time_separator":":"};
      this.default_symbols = {
        'group': ',',
        'decimal': '.',
        'plus_sign': '+',
        'minus_sign': '-'
      };
    }

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
        sign = number < 0 && prefix !== "-" ? this.symbols.minus_sign || this.default_symbols.minus_sign : "";
        return "" + prefix + result + suffix;
      } else {
        return number.toString();
      }
    };

    NumberFormatter.prototype.truncate_number = function(number, decimal_digits) {
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

  TwitterCldr.DecimalFormatter = (function(_super) {
    __extends(DecimalFormatter, _super);

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
      tokens = this.all_tokens[type];
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
      var cur_token, token, tokens;
      if (this.groups.length === 0) {
        return string;
      }
      tokens = [];
      cur_token = this.chop_group(string, this.groups[0]);
      tokens.push(cur_token);
      if (cur_token) {
        string = string.slice(0, string.length - cur_token.length);
      }
      while (string.length > this.groups[this.groups.length - 1]) {
        cur_token = this.chop_group(string, this.groups[this.groups.length - 1]);
        tokens.push(cur_token);
        if (cur_token) {
          string = string.slice(0, string.length - cur_token.length);
        }
      }
      tokens.push(string);
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
      if (string.length > size) {
        return string.slice(-size);
      } else {
        return null;
      }
    };

    IntegerHelper.prototype.prepare_format = function(format, symbols) {
      return format.replace(",", "").replace("+", symbols.plus_sign).replace("-", symbols.minus_sign);
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

  TwitterCldr.Currencies = (function() {
    function Currencies() {}

    Currencies.currencies = {"ADP":{"currency":"ADP","name":"Andorran peseta","cldr_symbol":"ADP","symbol":"ADP","code_points":[65,68,80]},"AED":{"currency":"AED","name":"UAE dirham","cldr_symbol":"AED","symbol":"AED","code_points":[65,69,68]},"AFA":{"currency":"AFA","name":"Afghan afghani (1927–2002)","cldr_symbol":"AFA","symbol":"AFA","code_points":[65,70,65]},"AFN":{"currency":"AFN","name":"Afghan Afghani","cldr_symbol":"AFN","symbol":"؋","code_points":[1547]},"ALK":{"currency":"ALK","name":"Albanian lek (1946–1965)","cldr_symbol":"ALK","symbol":"ALK","code_points":[65,76,75]},"ALL":{"currency":"ALL","name":"Albanian lek","cldr_symbol":"ALL","symbol":"LEK","code_points":[76,69,75]},"AMD":{"currency":"AMD","name":"Armenian dram","cldr_symbol":"AMD","symbol":"AMD","code_points":[65,77,68]},"ANG":{"currency":"ANG","name":"Netherlands Antillean guilder","cldr_symbol":"ANG","symbol":"ƒ","code_points":[402]},"AOA":{"currency":"AOA","name":"Angolan kwanza","cldr_symbol":"Kz","symbol":"Kz","code_points":[75,122]},"AOK":{"currency":"AOK","name":"Angolan kwanza (1977–1991)","cldr_symbol":"AOK","symbol":"AOK","code_points":[65,79,75]},"AON":{"currency":"AON","name":"Angolan new kwanza (1990–2000)","cldr_symbol":"AON","symbol":"AON","code_points":[65,79,78]},"AOR":{"currency":"AOR","name":"Angolan readjusted kwanza (1995–1999)","cldr_symbol":"AOR","symbol":"AOR","code_points":[65,79,82]},"ARA":{"currency":"ARA","name":"Argentine austral","cldr_symbol":"ARA","symbol":"ARA","code_points":[65,82,65]},"ARL":{"currency":"ARL","name":"Argentine peso ley (1970–1983)","cldr_symbol":"ARL","symbol":"ARL","code_points":[65,82,76]},"ARM":{"currency":"ARM","name":"Argentine peso (1881–1970)","cldr_symbol":"ARM","symbol":"ARM","code_points":[65,82,77]},"ARP":{"currency":"ARP","name":"Argentine peso (1983–1985)","cldr_symbol":"ARP","symbol":"ARP","code_points":[65,82,80]},"ARS":{"currency":"ARS","name":"Argentine peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"ATS":{"currency":"ATS","name":"Austrian schilling","cldr_symbol":"ATS","symbol":"ATS","code_points":[65,84,83]},"AUD":{"currency":"AUD","name":"Australian dollar","cldr_symbol":"A$","symbol":"$","code_points":[36]},"AWG":{"currency":"AWG","name":"Aruban florin","cldr_symbol":"AWG","symbol":"ƒ","code_points":[402],"alt_name":"Florins"},"AZM":{"currency":"AZM","name":"Azerbaijani manat (1993–2006)","cldr_symbol":"AZM","symbol":"AZM","code_points":[65,90,77]},"AZN":{"currency":"AZN","name":"Azerbaijani manat","cldr_symbol":"AZN","symbol":"ман","code_points":[1084,1072,1085]},"BAD":{"currency":"BAD","name":"Bosnia-Herzegovina dinar (1992–1994)","cldr_symbol":"BAD","symbol":"BAD","code_points":[66,65,68]},"BAM":{"currency":"BAM","name":"Bosnia-Herzegovina convertible mark","cldr_symbol":"KM","symbol":"KM","code_points":[75,77]},"BAN":{"currency":"BAN","name":"Bosnia-Herzegovina new dinar (1994–1997)","cldr_symbol":"BAN","symbol":"BAN","code_points":[66,65,78]},"BBD":{"currency":"BBD","name":"Barbadian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BDT":{"currency":"BDT","name":"Bangladeshi taka","cldr_symbol":"৳","symbol":"৳","code_points":[2547]},"BEC":{"currency":"BEC","name":"Belgian franc (convertible)","cldr_symbol":"BEC","symbol":"BEC","code_points":[66,69,67]},"BEF":{"currency":"BEF","name":"Belgian franc","cldr_symbol":"BEF","symbol":"BEF","code_points":[66,69,70]},"BEL":{"currency":"BEL","name":"Belgian franc (financial)","cldr_symbol":"BEL","symbol":"BEL","code_points":[66,69,76]},"BGL":{"currency":"BGL","name":"Bulgarian hard lev","cldr_symbol":"BGL","symbol":"BGL","code_points":[66,71,76]},"BGM":{"currency":"BGM","name":"Bulgarian socialist lev","cldr_symbol":"BGM","symbol":"BGM","code_points":[66,71,77]},"BGN":{"currency":"BGN","name":"Bulgarian lev","cldr_symbol":"BGN","symbol":"лв","code_points":[1083,1074]},"BGO":{"currency":"BGO","name":"Bulgarian lev (1879–1952)","cldr_symbol":"BGO","symbol":"BGO","code_points":[66,71,79]},"BHD":{"currency":"BHD","name":"Bahraini dinar","cldr_symbol":"BHD","symbol":"BHD","code_points":[66,72,68]},"BIF":{"currency":"BIF","name":"Burundian franc","cldr_symbol":"BIF","symbol":"BIF","code_points":[66,73,70]},"BMD":{"currency":"BMD","name":"Bermudan dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BND":{"currency":"BND","name":"Brunei dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BOB":{"currency":"BOB","name":"Bolivian boliviano","cldr_symbol":"Bs","symbol":"$b","code_points":[36,98]},"BOL":{"currency":"BOL","name":"Bolivian boliviano (1863–1963)","cldr_symbol":"BOL","symbol":"BOL","code_points":[66,79,76]},"BOP":{"currency":"BOP","name":"Bolivian peso","cldr_symbol":"BOP","symbol":"BOP","code_points":[66,79,80]},"BOV":{"currency":"BOV","name":"Bolivian mvdol","cldr_symbol":"BOV","symbol":"BOV","code_points":[66,79,86]},"BRB":{"currency":"BRB","name":"Brazilian new cruzeiro (1967–1986)","cldr_symbol":"BRB","symbol":"BRB","code_points":[66,82,66]},"BRC":{"currency":"BRC","name":"Brazilian cruzado (1986–1989)","cldr_symbol":"BRC","symbol":"BRC","code_points":[66,82,67]},"BRE":{"currency":"BRE","name":"Brazilian cruzeiro (1990–1993)","cldr_symbol":"BRE","symbol":"BRE","code_points":[66,82,69]},"BRL":{"currency":"BRL","name":"Brazilian real","cldr_symbol":"R$","symbol":"R$","code_points":[82,36]},"BRN":{"currency":"BRN","name":"Brazilian new cruzado (1989–1990)","cldr_symbol":"BRN","symbol":"BRN","code_points":[66,82,78]},"BRR":{"currency":"BRR","name":"Brazilian cruzeiro (1993–1994)","cldr_symbol":"BRR","symbol":"BRR","code_points":[66,82,82]},"BRZ":{"currency":"BRZ","name":"Brazilian cruzeiro (1942–1967)","cldr_symbol":"BRZ","symbol":"BRZ","code_points":[66,82,90]},"BSD":{"currency":"BSD","name":"Bahamian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BTN":{"currency":"BTN","name":"Bhutanese ngultrum","cldr_symbol":"BTN","symbol":"BTN","code_points":[66,84,78]},"BUK":{"currency":"BUK","name":"Burmese kyat","cldr_symbol":"BUK","symbol":"BUK","code_points":[66,85,75]},"BWP":{"currency":"BWP","name":"Botswanan pula","cldr_symbol":"P","symbol":"P","code_points":[80]},"BYB":{"currency":"BYB","name":"Belarusian new ruble (1994–1999)","cldr_symbol":"BYB","symbol":"BYB","code_points":[66,89,66]},"BYR":{"currency":"BYR","name":"Belarusian ruble","cldr_symbol":"р.","symbol":"p.","code_points":[112,46]},"BZD":{"currency":"BZD","name":"Belize dollar","cldr_symbol":"$","symbol":"BZ$","code_points":[66,90,36]},"CAD":{"currency":"CAD","name":"Canadian dollar","cldr_symbol":"CA$","symbol":"$","code_points":[36]},"CDF":{"currency":"CDF","name":"Congolese franc","cldr_symbol":"CDF","symbol":"CDF","code_points":[67,68,70]},"CHE":{"currency":"CHE","name":"WIR euro","cldr_symbol":"CHE","symbol":"CHE","code_points":[67,72,69]},"CHF":{"currency":"CHF","name":"Swiss franc","cldr_symbol":"CHF","symbol":"CHF","code_points":[67,72,70]},"CHW":{"currency":"CHW","name":"WIR franc","cldr_symbol":"CHW","symbol":"CHW","code_points":[67,72,87]},"CLE":{"currency":"CLE","name":"Chilean escudo","cldr_symbol":"CLE","symbol":"CLE","code_points":[67,76,69]},"CLF":{"currency":"CLF","name":"Chilean unit of account (UF)","cldr_symbol":"CLF","symbol":"CLF","code_points":[67,76,70]},"CLP":{"currency":"CLP","name":"Chilean peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"CNX":{"currency":"CNX","name":"Chinese People’s Bank dollar","cldr_symbol":"CNX","symbol":"CNX","code_points":[67,78,88]},"CNY":{"currency":"CNY","name":"Chinese yuan","cldr_symbol":"CN¥","symbol":"¥","code_points":[165]},"COP":{"currency":"COP","name":"Colombian peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"COU":{"currency":"COU","name":"Colombian real value unit","cldr_symbol":"COU","symbol":"COU","code_points":[67,79,85]},"CRC":{"currency":"CRC","name":"Costa Rican colón","cldr_symbol":"₡","symbol":"₡","code_points":[8353]},"CSD":{"currency":"CSD","name":"Serbian dinar (2002–2006)","cldr_symbol":"CSD","symbol":"CSD","code_points":[67,83,68]},"CSK":{"currency":"CSK","name":"Czechoslovak hard koruna","cldr_symbol":"CSK","symbol":"CSK","code_points":[67,83,75]},"CUC":{"currency":"CUC","name":"Cuban convertible peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"CUP":{"currency":"CUP","name":"Cuban peso","cldr_symbol":"$","symbol":"₱","code_points":[8369]},"CVE":{"currency":"CVE","name":"Cape Verdean escudo","cldr_symbol":"CVE","symbol":"CVE","code_points":[67,86,69]},"CYP":{"currency":"CYP","name":"Cypriot pound","cldr_symbol":"CYP","symbol":"CYP","code_points":[67,89,80]},"CZK":{"currency":"CZK","name":"Czech Republic koruna","cldr_symbol":"Kč","symbol":"Kč","code_points":[75,269]},"DDM":{"currency":"DDM","name":"East German mark","cldr_symbol":"DDM","symbol":"DDM","code_points":[68,68,77]},"DEM":{"currency":"DEM","name":"German mark","cldr_symbol":"DEM","symbol":"DEM","code_points":[68,69,77]},"DJF":{"currency":"DJF","name":"Djiboutian franc","cldr_symbol":"DJF","symbol":"DJF","code_points":[68,74,70]},"DKK":{"currency":"DKK","name":"Danish krone","cldr_symbol":"kr","symbol":"kr","code_points":[107,114]},"DOP":{"currency":"DOP","name":"Dominican peso","cldr_symbol":"$","symbol":"RD$","code_points":[82,68,36]},"DZD":{"currency":"DZD","name":"Algerian dinar","cldr_symbol":"DZD","symbol":"DZD","code_points":[68,90,68]},"ECS":{"currency":"ECS","name":"Ecuadorian sucre","cldr_symbol":"ECS","symbol":"ECS","code_points":[69,67,83]},"ECV":{"currency":"ECV","name":"Ecuadorian unit of constant value","cldr_symbol":"ECV","symbol":"ECV","code_points":[69,67,86]},"EEK":{"currency":"EEK","name":"Estonian kroon","cldr_symbol":"EEK","symbol":"kr","code_points":[107,114]},"EGP":{"currency":"EGP","name":"Egyptian pound","cldr_symbol":"E£","symbol":"£","code_points":[163]},"ERN":{"currency":"ERN","name":"Eritrean nakfa","cldr_symbol":"ERN","symbol":"ERN","code_points":[69,82,78]},"ESA":{"currency":"ESA","name":"Spanish peseta (A account)","cldr_symbol":"ESA","symbol":"ESA","code_points":[69,83,65]},"ESB":{"currency":"ESB","name":"Spanish peseta (convertible account)","cldr_symbol":"ESB","symbol":"ESB","code_points":[69,83,66]},"ESP":{"currency":"ESP","name":"Spanish peseta","cldr_symbol":"₧","symbol":"₧","code_points":[8359]},"ETB":{"currency":"ETB","name":"Ethiopian birr","cldr_symbol":"ETB","symbol":"ETB","code_points":[69,84,66]},"EUR":{"currency":"EUR","name":"euro","cldr_symbol":"€","symbol":"€","code_points":[8364]},"FIM":{"currency":"FIM","name":"Finnish markka","cldr_symbol":"FIM","symbol":"FIM","code_points":[70,73,77]},"FJD":{"currency":"FJD","name":"Fijian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"FKP":{"currency":"FKP","name":"Falkland Islands pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"FRF":{"currency":"FRF","name":"French franc","cldr_symbol":"FRF","symbol":"FRF","code_points":[70,82,70]},"GBP":{"currency":"GBP","name":"British pound sterling","cldr_symbol":"£","symbol":"£","code_points":[163]},"GEK":{"currency":"GEK","name":"Georgian kupon larit","cldr_symbol":"GEK","symbol":"GEK","code_points":[71,69,75]},"GEL":{"currency":"GEL","name":"Georgian lari","cldr_symbol":"GEL","symbol":"GEL","code_points":[71,69,76]},"GHC":{"currency":"GHC","name":"Ghanaian cedi (1979–2007)","cldr_symbol":"GHC","symbol":"GHC","code_points":[71,72,67]},"GHS":{"currency":"GHS","name":"Ghanaian cedi","cldr_symbol":"GHS","symbol":"¢","code_points":[162]},"GIP":{"currency":"GIP","name":"Gibraltar pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"GMD":{"currency":"GMD","name":"Gambian dalasi","cldr_symbol":"GMD","symbol":"GMD","code_points":[71,77,68]},"GNF":{"currency":"GNF","name":"Guinean franc","cldr_symbol":"FG","symbol":"FG","code_points":[70,71]},"GNS":{"currency":"GNS","name":"Guinean syli","cldr_symbol":"GNS","symbol":"GNS","code_points":[71,78,83]},"GQE":{"currency":"GQE","name":"Equatorial Guinean ekwele","cldr_symbol":"GQE","symbol":"GQE","code_points":[71,81,69]},"GRD":{"currency":"GRD","name":"Greek drachma","cldr_symbol":"GRD","symbol":"GRD","code_points":[71,82,68]},"GTQ":{"currency":"GTQ","name":"Guatemalan quetzal","cldr_symbol":"Q","symbol":"Q","code_points":[81]},"GWE":{"currency":"GWE","name":"Portuguese Guinea escudo","cldr_symbol":"GWE","symbol":"GWE","code_points":[71,87,69]},"GWP":{"currency":"GWP","name":"Guinea-Bissau peso","cldr_symbol":"GWP","symbol":"GWP","code_points":[71,87,80]},"GYD":{"currency":"GYD","name":"Guyanaese dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"HKD":{"currency":"HKD","name":"Hong Kong dollar","cldr_symbol":"HK$","symbol":"$","code_points":[36]},"HNL":{"currency":"HNL","name":"Honduran lempira","cldr_symbol":"L","symbol":"L","code_points":[76]},"HRD":{"currency":"HRD","name":"Croatian dinar","cldr_symbol":"HRD","symbol":"HRD","code_points":[72,82,68]},"HRK":{"currency":"HRK","name":"Croatian kuna","cldr_symbol":"kn","symbol":"kn","code_points":[107,110]},"HTG":{"currency":"HTG","name":"Haitian gourde","cldr_symbol":"HTG","symbol":"HTG","code_points":[72,84,71]},"HUF":{"currency":"HUF","name":"Hungarian forint","cldr_symbol":"Ft","symbol":"Ft","code_points":[70,116]},"IDR":{"currency":"IDR","name":"Indonesian rupiah","cldr_symbol":"Rp","symbol":"Rp","code_points":[82,112]},"IEP":{"currency":"IEP","name":"Irish pound","cldr_symbol":"IEP","symbol":"IEP","code_points":[73,69,80]},"ILP":{"currency":"ILP","name":"Israeli pound","cldr_symbol":"ILP","symbol":"ILP","code_points":[73,76,80]},"ILR":{"currency":"ILR","name":"Israeli sheqel (1980–1985)","cldr_symbol":"ILR","symbol":"ILR","code_points":[73,76,82]},"ILS":{"currency":"ILS","name":"Israeli new sheqel","cldr_symbol":"₪","symbol":"₪","code_points":[8362]},"INR":{"currency":"INR","name":"Indian rupee","cldr_symbol":"₹","symbol":"₨","code_points":[8360]},"IQD":{"currency":"IQD","name":"Iraqi dinar","cldr_symbol":"IQD","symbol":"IQD","code_points":[73,81,68]},"IRR":{"currency":"IRR","name":"Iranian rial","cldr_symbol":"IRR","symbol":"﷼","code_points":[65020]},"ISJ":{"currency":"ISJ","name":"Icelandic króna (1918–1981)","cldr_symbol":"ISJ","symbol":"ISJ","code_points":[73,83,74]},"ISK":{"currency":"ISK","name":"Icelandic króna","cldr_symbol":"kr","symbol":"kr","code_points":[107,114]},"ITL":{"currency":"ITL","name":"Italian lira","cldr_symbol":"ITL","symbol":"ITL","code_points":[73,84,76]},"JMD":{"currency":"JMD","name":"Jamaican dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"JOD":{"currency":"JOD","name":"Jordanian dinar","cldr_symbol":"JOD","symbol":"JOD","code_points":[74,79,68]},"JPY":{"currency":"JPY","name":"Japanese yen","cldr_symbol":"¥","symbol":"¥","code_points":[165]},"KES":{"currency":"KES","name":"Kenyan shilling","cldr_symbol":"KES","symbol":"KES","code_points":[75,69,83]},"KGS":{"currency":"KGS","name":"Kyrgystani som","cldr_symbol":"KGS","symbol":"лв","code_points":[1083,1074]},"KHR":{"currency":"KHR","name":"Cambodian riel","cldr_symbol":"៛","symbol":"៛","code_points":[6107]},"KMF":{"currency":"KMF","name":"Comorian franc","cldr_symbol":"CF","symbol":"CF","code_points":[67,70]},"KPW":{"currency":"KPW","name":"North Korean won","cldr_symbol":"₩","symbol":"₩","code_points":[8361]},"KRH":{"currency":"KRH","name":"South Korean hwan (1953–1962)","cldr_symbol":"KRH","symbol":"KRH","code_points":[75,82,72]},"KRO":{"currency":"KRO","name":"South Korean won (1945–1953)","cldr_symbol":"KRO","symbol":"KRO","code_points":[75,82,79]},"KRW":{"currency":"KRW","name":"South Korean won","cldr_symbol":"₩","symbol":"₩","code_points":[8361]},"KWD":{"currency":"KWD","name":"Kuwaiti dinar","cldr_symbol":"KWD","symbol":"KWD","code_points":[75,87,68]},"KYD":{"currency":"KYD","name":"Cayman Islands dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"KZT":{"currency":"KZT","name":"Kazakhstani tenge","cldr_symbol":"₸","symbol":"лв","code_points":[1083,1074]},"LAK":{"currency":"LAK","name":"Laotian kip","cldr_symbol":"₭","symbol":"₭","code_points":[8365]},"LBP":{"currency":"LBP","name":"Lebanese pound","cldr_symbol":"L£","symbol":"£","code_points":[163]},"LKR":{"currency":"LKR","name":"Sri Lankan rupee","cldr_symbol":"Rs","symbol":"₨","code_points":[8360]},"LRD":{"currency":"LRD","name":"Liberian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"LSL":{"currency":"LSL","name":"Lesotho loti","cldr_symbol":"LSL","symbol":"LSL","code_points":[76,83,76]},"LTL":{"currency":"LTL","name":"Lithuanian litas","cldr_symbol":"Lt","symbol":"Lt","code_points":[76,116]},"LTT":{"currency":"LTT","name":"Lithuanian talonas","cldr_symbol":"LTT","symbol":"LTT","code_points":[76,84,84]},"LUC":{"currency":"LUC","name":"Luxembourgian convertible franc","cldr_symbol":"LUC","symbol":"LUC","code_points":[76,85,67]},"LUF":{"currency":"LUF","name":"Luxembourgian franc","cldr_symbol":"LUF","symbol":"LUF","code_points":[76,85,70]},"LUL":{"currency":"LUL","name":"Luxembourg financial franc","cldr_symbol":"LUL","symbol":"LUL","code_points":[76,85,76]},"LVL":{"currency":"LVL","name":"Latvian lats","cldr_symbol":"Ls","symbol":"Ls","code_points":[76,115]},"LVR":{"currency":"LVR","name":"Latvian ruble","cldr_symbol":"LVR","symbol":"LVR","code_points":[76,86,82]},"LYD":{"currency":"LYD","name":"Libyan dinar","cldr_symbol":"LYD","symbol":"LYD","code_points":[76,89,68]},"MAD":{"currency":"MAD","name":"Moroccan dirham","cldr_symbol":"MAD","symbol":"MAD","code_points":[77,65,68]},"MAF":{"currency":"MAF","name":"Moroccan franc","cldr_symbol":"MAF","symbol":"MAF","code_points":[77,65,70]},"MCF":{"currency":"MCF","name":"Monegasque franc","cldr_symbol":"MCF","symbol":"MCF","code_points":[77,67,70]},"MDC":{"currency":"MDC","name":"Moldovan cupon","cldr_symbol":"MDC","symbol":"MDC","code_points":[77,68,67]},"MDL":{"currency":"MDL","name":"Moldovan leu","cldr_symbol":"MDL","symbol":"MDL","code_points":[77,68,76]},"MGA":{"currency":"MGA","name":"Malagasy Ariary","cldr_symbol":"Ar","symbol":"Ar","code_points":[65,114]},"MGF":{"currency":"MGF","name":"Malagasy franc","cldr_symbol":"MGF","symbol":"MGF","code_points":[77,71,70]},"MKD":{"currency":"MKD","name":"Macedonian denar","cldr_symbol":"MKD","symbol":"MKD","code_points":[77,75,68]},"MKN":{"currency":"MKN","name":"Macedonian denar (1992–1993)","cldr_symbol":"MKN","symbol":"MKN","code_points":[77,75,78]},"MLF":{"currency":"MLF","name":"Malian franc","cldr_symbol":"MLF","symbol":"MLF","code_points":[77,76,70]},"MMK":{"currency":"MMK","name":"Myanmar kyat","cldr_symbol":"K","symbol":"K","code_points":[75]},"MNT":{"currency":"MNT","name":"Mongolian tugrik","cldr_symbol":"₮","symbol":"₮","code_points":[8366]},"MOP":{"currency":"MOP","name":"Macanese pataca","cldr_symbol":"MOP","symbol":"MOP","code_points":[77,79,80]},"MRO":{"currency":"MRO","name":"Mauritanian ouguiya","cldr_symbol":"MRO","symbol":"MRO","code_points":[77,82,79]},"MTL":{"currency":"MTL","name":"Maltese lira","cldr_symbol":"MTL","symbol":"MTL","code_points":[77,84,76]},"MTP":{"currency":"MTP","name":"Maltese pound","cldr_symbol":"MTP","symbol":"MTP","code_points":[77,84,80]},"MUR":{"currency":"MUR","name":"Mauritian rupee","cldr_symbol":"Rs","symbol":"₨","code_points":[8360]},"MVP":{"currency":"MVP","name":"Maldivian rupee (1947–1981)","cldr_symbol":"MVP","symbol":"MVP","code_points":[77,86,80]},"MVR":{"currency":"MVR","name":"Maldivian rufiyaa","cldr_symbol":"MVR","symbol":"MVR","code_points":[77,86,82]},"MWK":{"currency":"MWK","name":"Malawian Kwacha","cldr_symbol":"MWK","symbol":"MWK","code_points":[77,87,75]},"MXN":{"currency":"MXN","name":"Mexican peso","cldr_symbol":"MX$","symbol":"$","code_points":[36]},"MXP":{"currency":"MXP","name":"Mexican silver peso (1861–1992)","cldr_symbol":"MXP","symbol":"MXP","code_points":[77,88,80]},"MXV":{"currency":"MXV","name":"Mexican investment unit","cldr_symbol":"MXV","symbol":"MXV","code_points":[77,88,86]},"MYR":{"currency":"MYR","name":"Malaysian ringgit","cldr_symbol":"RM","symbol":"RM","code_points":[82,77]},"MZE":{"currency":"MZE","name":"Mozambican escudo","cldr_symbol":"MZE","symbol":"MZE","code_points":[77,90,69]},"MZM":{"currency":"MZM","name":"Mozambican metical (1980–2006)","cldr_symbol":"MZM","symbol":"MZM","code_points":[77,90,77]},"MZN":{"currency":"MZN","name":"Mozambican metical","cldr_symbol":"MZN","symbol":"MT","code_points":[77,84]},"NAD":{"currency":"NAD","name":"Namibian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"NGN":{"currency":"NGN","name":"Nigerian naira","cldr_symbol":"₦","symbol":"₦","code_points":[8358]},"NIC":{"currency":"NIC","name":"Nicaraguan córdoba (1988–1991)","cldr_symbol":"NIC","symbol":"NIC","code_points":[78,73,67]},"NIO":{"currency":"NIO","name":"Nicaraguan córdoba","cldr_symbol":"C$","symbol":"C$","code_points":[67,36]},"NLG":{"currency":"NLG","name":"Dutch guilder","cldr_symbol":"NLG","symbol":"NLG","code_points":[78,76,71]},"NOK":{"currency":"NOK","name":"Norwegian krone","cldr_symbol":"kr","symbol":"kr","code_points":[107,114]},"NPR":{"currency":"NPR","name":"Nepalese rupee","cldr_symbol":"Rs","symbol":"₨","code_points":[8360]},"NZD":{"currency":"NZD","name":"New Zealand dollar","cldr_symbol":"NZ$","symbol":"$","code_points":[36]},"OMR":{"currency":"OMR","name":"Omani rial","cldr_symbol":"OMR","symbol":"﷼","code_points":[65020]},"PAB":{"currency":"PAB","name":"Panamanian balboa","cldr_symbol":"PAB","symbol":"B/.","code_points":[66,47,46]},"PEI":{"currency":"PEI","name":"Peruvian inti","cldr_symbol":"PEI","symbol":"PEI","code_points":[80,69,73]},"PEN":{"currency":"PEN","name":"Peruvian nuevo sol","cldr_symbol":"PEN","symbol":"S/.","code_points":[83,47,46]},"PES":{"currency":"PES","name":"Peruvian sol (1863–1965)","cldr_symbol":"PES","symbol":"PES","code_points":[80,69,83]},"PGK":{"currency":"PGK","name":"Papua New Guinean kina","cldr_symbol":"PGK","symbol":"PGK","code_points":[80,71,75]},"PHP":{"currency":"PHP","name":"Philippine peso","cldr_symbol":"₱","symbol":"Php","code_points":[80,104,112]},"PKR":{"currency":"PKR","name":"Pakistani rupee","cldr_symbol":"Rs","symbol":"₨","code_points":[8360]},"PLN":{"currency":"PLN","name":"Polish zloty","cldr_symbol":"zł","symbol":"zł","code_points":[122,322]},"PLZ":{"currency":"PLZ","name":"Polish zloty (PLZ)","cldr_symbol":"PLZ","symbol":"PLZ","code_points":[80,76,90]},"PTE":{"currency":"PTE","name":"Portuguese escudo","cldr_symbol":"PTE","symbol":"PTE","code_points":[80,84,69]},"PYG":{"currency":"PYG","name":"Paraguayan guarani","cldr_symbol":"₲","symbol":"Gs","code_points":[71,115]},"QAR":{"currency":"QAR","name":"Qatari rial","cldr_symbol":"QAR","symbol":"﷼","code_points":[65020]},"RHD":{"currency":"RHD","name":"Rhodesian dollar","cldr_symbol":"RHD","symbol":"RHD","code_points":[82,72,68]},"ROL":{"currency":"ROL","name":"Romanian leu (1952–2006)","cldr_symbol":"ROL","symbol":"ROL","code_points":[82,79,76]},"RON":{"currency":"RON","name":"Romanian leu","cldr_symbol":"RON","symbol":"lei","code_points":[108,101,105]},"RSD":{"currency":"RSD","name":"Serbian dinar","cldr_symbol":"RSD","symbol":"Дин.","code_points":[1044,1080,1085,46]},"RUB":{"currency":"RUB","name":"Russian ruble","cldr_symbol":"₽","symbol":"руб","code_points":[1088,1091,1073]},"RUR":{"currency":"RUR","name":"Russian ruble (1991–1998)","cldr_symbol":"р.","symbol":"р.","code_points":[1088,46]},"RWF":{"currency":"RWF","name":"Rwandan franc","cldr_symbol":"RF","symbol":"RF","code_points":[82,70]},"SAR":{"currency":"SAR","name":"Saudi riyal","cldr_symbol":"SAR","symbol":"﷼","code_points":[65020]},"SBD":{"currency":"SBD","name":"Solomon Islands dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SCR":{"currency":"SCR","name":"Seychellois rupee","cldr_symbol":"SCR","symbol":"₨","code_points":[8360]},"SDD":{"currency":"SDD","name":"Sudanese dinar (1992–2007)","cldr_symbol":"SDD","symbol":"SDD","code_points":[83,68,68]},"SDG":{"currency":"SDG","name":"Sudanese pound","cldr_symbol":"SDG","symbol":"SDG","code_points":[83,68,71]},"SDP":{"currency":"SDP","name":"Sudanese pound (1957–1998)","cldr_symbol":"SDP","symbol":"SDP","code_points":[83,68,80]},"SEK":{"currency":"SEK","name":"Swedish krona","cldr_symbol":"kr","symbol":"kr","code_points":[107,114]},"SGD":{"currency":"SGD","name":"Singapore dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SHP":{"currency":"SHP","name":"St. Helena pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"SIT":{"currency":"SIT","name":"Slovenian tolar","cldr_symbol":"SIT","symbol":"SIT","code_points":[83,73,84]},"SKK":{"currency":"SKK","name":"Slovak koruna","cldr_symbol":"SKK","symbol":"SKK","code_points":[83,75,75]},"SLL":{"currency":"SLL","name":"Sierra Leonean leone","cldr_symbol":"SLL","symbol":"SLL","code_points":[83,76,76]},"SOS":{"currency":"SOS","name":"Somali shilling","cldr_symbol":"SOS","symbol":"S","code_points":[83]},"SRD":{"currency":"SRD","name":"Surinamese dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SRG":{"currency":"SRG","name":"Surinamese guilder","cldr_symbol":"SRG","symbol":"SRG","code_points":[83,82,71]},"SSP":{"currency":"SSP","name":"South Sudanese pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"STD":{"currency":"STD","name":"São Tomé \u0026 Príncipe dobra","cldr_symbol":"Db","symbol":"Db","code_points":[68,98]},"SUR":{"currency":"SUR","name":"Soviet rouble","cldr_symbol":"SUR","symbol":"SUR","code_points":[83,85,82]},"SVC":{"currency":"SVC","name":"Salvadoran colón","cldr_symbol":"SVC","symbol":"SVC","code_points":[83,86,67]},"SYP":{"currency":"SYP","name":"Syrian pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"SZL":{"currency":"SZL","name":"Swazi lilangeni","cldr_symbol":"SZL","symbol":"SZL","code_points":[83,90,76]},"THB":{"currency":"THB","name":"Thai baht","cldr_symbol":"฿","symbol":"฿","code_points":[3647]},"TJR":{"currency":"TJR","name":"Tajikistani ruble","cldr_symbol":"TJR","symbol":"TJR","code_points":[84,74,82]},"TJS":{"currency":"TJS","name":"Tajikistani somoni","cldr_symbol":"TJS","symbol":"TJS","code_points":[84,74,83]},"TMM":{"currency":"TMM","name":"Turkmenistani manat (1993–2009)","cldr_symbol":"TMM","symbol":"TMM","code_points":[84,77,77]},"TMT":{"currency":"TMT","name":"Turkmenistani manat","cldr_symbol":"TMT","symbol":"TMT","code_points":[84,77,84]},"TND":{"currency":"TND","name":"Tunisian dinar","cldr_symbol":"TND","symbol":"TND","code_points":[84,78,68]},"TOP":{"currency":"TOP","name":"Tongan paʻanga","cldr_symbol":"T$","symbol":"T$","code_points":[84,36]},"TPE":{"currency":"TPE","name":"Timorese escudo","cldr_symbol":"TPE","symbol":"TPE","code_points":[84,80,69]},"TRL":{"currency":"TRL","name":"Turkish lira (1922–2005)","cldr_symbol":"TRL","symbol":"TRL","code_points":[84,82,76]},"TRY":{"currency":"TRY","name":"Turkish lira","cldr_symbol":"₺","symbol":"TL","code_points":[84,76]},"TTD":{"currency":"TTD","name":"Trinidad \u0026 Tobago dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"TWD":{"currency":"TWD","name":"New Taiwan dollar","cldr_symbol":"NT$","symbol":"NT$","code_points":[78,84,36]},"TZS":{"currency":"TZS","name":"Tanzanian shilling","cldr_symbol":"TZS","symbol":"TZS","code_points":[84,90,83]},"UAH":{"currency":"UAH","name":"Ukrainian hryvnia","cldr_symbol":"₴","symbol":"₴","code_points":[8372]},"UAK":{"currency":"UAK","name":"Ukrainian karbovanets","cldr_symbol":"UAK","symbol":"UAK","code_points":[85,65,75]},"UGS":{"currency":"UGS","name":"Ugandan shilling (1966–1987)","cldr_symbol":"UGS","symbol":"UGS","code_points":[85,71,83]},"UGX":{"currency":"UGX","name":"Ugandan shilling","cldr_symbol":"UGX","symbol":"UGX","code_points":[85,71,88]},"USD":{"currency":"USD","name":"US dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"USN":{"currency":"USN","name":"US dollar (next day)","cldr_symbol":"USN","symbol":"USN","code_points":[85,83,78]},"USS":{"currency":"USS","name":"US dollar (same day)","cldr_symbol":"USS","symbol":"USS","code_points":[85,83,83]},"UYI":{"currency":"UYI","name":"Uruguayan peso (indexed units)","cldr_symbol":"UYI","symbol":"UYI","code_points":[85,89,73]},"UYP":{"currency":"UYP","name":"Uruguayan peso (1975–1993)","cldr_symbol":"UYP","symbol":"UYP","code_points":[85,89,80]},"UYU":{"currency":"UYU","name":"Uruguayan peso","cldr_symbol":"$","symbol":"$U","code_points":[36,85]},"UZS":{"currency":"UZS","name":"Uzbekistan som","cldr_symbol":"UZS","symbol":"лв","code_points":[1083,1074]},"VEB":{"currency":"VEB","name":"Venezuelan bolívar (1871–2008)","cldr_symbol":"VEB","symbol":"VEB","code_points":[86,69,66]},"VEF":{"currency":"VEF","name":"Venezuelan bolívar","cldr_symbol":"Bs","symbol":"Bs","code_points":[66,115]},"VND":{"currency":"VND","name":"Vietnamese dong","cldr_symbol":"₫","symbol":"₫","code_points":[8363]},"VNN":{"currency":"VNN","name":"Vietnamese dong (1978–1985)","cldr_symbol":"VNN","symbol":"VNN","code_points":[86,78,78]},"VUV":{"currency":"VUV","name":"Vanuatu vatu","cldr_symbol":"VUV","symbol":"VUV","code_points":[86,85,86]},"WST":{"currency":"WST","name":"Samoan tala","cldr_symbol":"WST","symbol":"WST","code_points":[87,83,84]},"XAF":{"currency":"XAF","name":"CFA franc BEAC","cldr_symbol":"FCFA","symbol":"FCFA","code_points":[70,67,70,65]},"XAG":{"currency":"XAG","name":"troy ounce of silver","cldr_symbol":"XAG","symbol":"XAG","code_points":[88,65,71]},"XAU":{"currency":"XAU","name":"troy ounce of gold","cldr_symbol":"XAU","symbol":"XAU","code_points":[88,65,85]},"XBA":{"currency":"XBA","name":"European composite unit","cldr_symbol":"XBA","symbol":"XBA","code_points":[88,66,65]},"XBB":{"currency":"XBB","name":"European monetary unit","cldr_symbol":"XBB","symbol":"XBB","code_points":[88,66,66]},"XBC":{"currency":"XBC","name":"European unit of account (XBC)","cldr_symbol":"XBC","symbol":"XBC","code_points":[88,66,67]},"XBD":{"currency":"XBD","name":"European unit of account (XBD)","cldr_symbol":"XBD","symbol":"XBD","code_points":[88,66,68]},"XCD":{"currency":"XCD","name":"East Caribbean dollar","cldr_symbol":"EC$","symbol":"$","code_points":[36]},"XDR":{"currency":"XDR","name":"special drawing rights","cldr_symbol":"XDR","symbol":"XDR","code_points":[88,68,82]},"XEU":{"currency":"XEU","name":"European currency unit","cldr_symbol":"XEU","symbol":"XEU","code_points":[88,69,85]},"XFO":{"currency":"XFO","name":"French gold franc","cldr_symbol":"XFO","symbol":"XFO","code_points":[88,70,79]},"XFU":{"currency":"XFU","name":"French UIC-franc","cldr_symbol":"XFU","symbol":"XFU","code_points":[88,70,85]},"XOF":{"currency":"XOF","name":"CFA franc BCEAO","cldr_symbol":"CFA","symbol":"CFA","code_points":[67,70,65]},"XPD":{"currency":"XPD","name":"troy ounce of palladium","cldr_symbol":"XPD","symbol":"XPD","code_points":[88,80,68]},"XPF":{"currency":"XPF","name":"CFP franc","cldr_symbol":"CFPF","symbol":"CFPF","code_points":[67,70,80,70]},"XPT":{"currency":"XPT","name":"troy ounce of platinum","cldr_symbol":"XPT","symbol":"XPT","code_points":[88,80,84]},"XRE":{"currency":"XRE","name":"RINET Funds unit","cldr_symbol":"XRE","symbol":"XRE","code_points":[88,82,69]},"XSU":{"currency":"XSU","name":"Sucre","cldr_symbol":"XSU","symbol":"XSU","code_points":[88,83,85]},"XTS":{"currency":"XTS","name":"Testing Currency unit","cldr_symbol":"XTS","symbol":"XTS","code_points":[88,84,83]},"XUA":{"currency":"XUA","name":"ADB unit of account","cldr_symbol":"XUA","symbol":"XUA","code_points":[88,85,65]},"XXX":{"currency":"XXX","name":"(unknown unit of currency)","cldr_symbol":"XXX","symbol":"XXX","code_points":[88,88,88]},"YDD":{"currency":"YDD","name":"Yemeni dinar","cldr_symbol":"YDD","symbol":"YDD","code_points":[89,68,68]},"YER":{"currency":"YER","name":"Yemeni rial","cldr_symbol":"YER","symbol":"﷼","code_points":[65020]},"YUD":{"currency":"YUD","name":"Yugoslavian hard dinar (1966–1990)","cldr_symbol":"YUD","symbol":"YUD","code_points":[89,85,68]},"YUM":{"currency":"YUM","name":"Yugoslavian new dinar (1994–2002)","cldr_symbol":"YUM","symbol":"YUM","code_points":[89,85,77]},"YUN":{"currency":"YUN","name":"Yugoslavian convertible dinar (1990–1992)","cldr_symbol":"YUN","symbol":"YUN","code_points":[89,85,78]},"YUR":{"currency":"YUR","name":"Yugoslavian reformed dinar (1992–1993)","cldr_symbol":"YUR","symbol":"YUR","code_points":[89,85,82]},"ZAL":{"currency":"ZAL","name":"South African rand (financial)","cldr_symbol":"ZAL","symbol":"ZAL","code_points":[90,65,76]},"ZAR":{"currency":"ZAR","name":"South African rand","cldr_symbol":"R","symbol":"R","code_points":[82]},"ZMK":{"currency":"ZMK","name":"Zambian kwacha (1968–2012)","cldr_symbol":"ZMK","symbol":"ZMK","code_points":[90,77,75]},"ZMW":{"currency":"ZMW","name":"Zambian kwacha","cldr_symbol":"ZK","symbol":"ZK","code_points":[90,75]},"ZRN":{"currency":"ZRN","name":"Zairean new zaire (1993–1998)","cldr_symbol":"ZRN","symbol":"ZRN","code_points":[90,82,78]},"ZRZ":{"currency":"ZRZ","name":"Zairean zaire (1971–1993)","cldr_symbol":"ZRZ","symbol":"ZRZ","code_points":[90,82,90]},"ZWD":{"currency":"ZWD","name":"Zimbabwean dollar (1980–2008)","cldr_symbol":"ZWD","symbol":"Z$","code_points":[90,36]},"ZWL":{"currency":"ZWL","name":"Zimbabwean dollar (2009)","cldr_symbol":"ZWL","symbol":"ZWL","code_points":[90,87,76]},"ZWR":{"currency":"ZWR","name":"Zimbabwean dollar (2008)","cldr_symbol":"ZWR","symbol":"ZWR","code_points":[90,87,82]}};

    Currencies.currency_codes = function() {
      var data, _;
      return this.codes || (this.codes = (function() {
        var _ref, _results;
        _ref = this.currencies;
        _results = [];
        for (_ in _ref) {
          data = _ref[_];
          _results.push(data.code);
        }
        return _results;
      }).call(this));
    };

    Currencies.for_code = function(currency_code) {
      var country_name, data, result, _ref;
      result = null;
      _ref = this.currencies;
      for (country_name in _ref) {
        data = _ref[country_name];
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
      this.formats = {"2":"{0} και {1}","end":"{0} και {1}","middle":"{0}, {1}","start":"{0}, {1}"};
    }

    ListFormatter.prototype.format = function(list) {
      if (this.formats[list.length.toString()] != null) {
        return this.compose(this.formats[list.length.toString()], list);
      } else {
        return this.compose_list(list);
      }
    };

    ListFormatter.prototype.compose_list = function(list) {
      var format_key, i, result, _i, _ref;
      result = this.compose(this.formats.end || this.formats.middle || "", [list[list.length - 2], list[list.length - 1]]);
      if (list.length > 2) {
        for (i = _i = 3, _ref = list.length; 3 <= _ref ? _i <= _ref : _i >= _ref; i = 3 <= _ref ? ++_i : --_i) {
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
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          if (element != null) {
            _results.push(element);
          }
        }
        return _results;
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
      var bidi_class, end, range, range_list, range_offset, ranges, start, _i, _len, _ref;
      _ref = this.bidi_classes;
      for (bidi_class in _ref) {
        ranges = _ref[bidi_class];
        for (range_offset in ranges) {
          range_list = ranges[range_offset];
          for (_i = 0, _len = range_list.length; _i < _len; _i++) {
            range = range_list[_i];
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
      var code_point, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        code_point = arr[_i];
        _results.push(TwitterCldr.Bidi.bidi_class_for(code_point));
      }
      return _results;
    };

    Bidi.prototype.toString = function() {
      return TwitterCldr.Utilities.pack_array(this.string_arr);
    };

    Bidi.prototype.reorder_visually = function() {
      var depth, finish, i, level, lowest_odd, max, start, tmpb, tmpo, _i, _j, _k, _len, _ref, _ref1;
      if (!this.string_arr) {
        throw "No string given!";
      }
      max = 0;
      lowest_odd = MAX_DEPTH + 1;
      _ref = this.levels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        level = _ref[_i];
        max = TwitterCldr.Utilities.max([level, max]);
        if (!TwitterCldr.Utilities.is_even(level)) {
          lowest_odd = TwitterCldr.Utilities.min([lowest_odd, level]);
        }
      }
      for (depth = _j = max; max <= 0 ? _j < 0 : _j > 0; depth = max <= 0 ? ++_j : --_j) {
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
          for (i = _k = 0, _ref1 = (finish - start) / 2; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
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
      var type, _i, _len, _ref;
      if (["LTR", "RTL"].indexOf(this.direction) > -1) {
        if (this.direction === "LTR") {
          return 0;
        } else {
          return 1;
        }
      } else {
        _ref = this.types;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          type = _ref[_i];
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
      var current_embedding, directional_override, embedding_stack, i, input, is_ltr, is_special, len, new_embedding, next_fmt, output, size, sp, _i, _j, _ref, _ref1;
      current_embedding = this.base_embedding;
      directional_override = -1;
      embedding_stack = [];
      this.formatter_indices || (this.formatter_indices = []);
      sp = 0;
      for (i = _i = 0, _ref = this.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
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
              directional_override = new_embedding < 0 ? (_ref1 = (new_embedding & 1) === 0) != null ? _ref1 : {
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
      for (i = _j = 0; 0 <= size ? _j <= size : _j >= size; i = 0 <= size ? ++_j : --_j) {
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
      var current_embedding, i, last_run_start, run_count, where, _i, _j, _ref, _ref1;
      run_count = 0;
      current_embedding = this.base_embedding;
      for (i = _i = 0, _ref = this.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.levels[i] !== current_embedding) {
          current_embedding = this.levels[i];
          run_count += 1;
        }
      }
      where = 0;
      last_run_start = 0;
      current_embedding = this.base_embedding;
      for (i = _j = 0, _ref1 = this.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
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
      var eor, finish, i, j, k, level, next_level, next_type, prev_strong_type, prev_type, previous_level, run_count, run_idx, sor, start, _i, _j, _k;
      run_count = this.runs.length;
      previous_level = this.base_embedding;
      for (run_idx = _i = 0; 0 <= run_count ? _i < run_count : _i > run_count; run_idx = 0 <= run_count ? ++_i : --_i) {
        start = this.get_run_start(run_idx);
        finish = this.get_run_limit(run_idx);
        level = this.get_run_level(run_idx) || 0;
        sor = TwitterCldr.Utilities.is_even(TwitterCldr.Utilities.max([previous_level, level])) ? "L" : "R";
        next_level = run_idx === (run_count - 1) ? this.base_embedding : this.get_run_level(run_idx + 1) || 0;
        eor = TwitterCldr.Utilities.is_even(TwitterCldr.Utilities.max([level, next_level])) ? "L" : "R";
        prev_type = sor;
        prev_strong_type = sor;
        for (i = _j = start; start <= finish ? _j < finish : _j > finish; i = start <= finish ? ++_j : --_j) {
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
                for (k = _k = i; i <= j ? _k < j : _k > j; k = i <= j ? ++_k : --_k) {
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
      var i, _i, _ref;
      for (i = _i = 0, _ref = this.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
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
      var embedding_direction, eor, finish, i, j, level, neutral_start, new_strong, next_level, override, prev_strong, previous_level, run, run_count, sor, start, this_type, _i, _j, _k;
      run_count = this.get_run_count();
      previous_level = this.base_embedding;
      for (run = _i = 0; 0 <= run_count ? _i < run_count : _i > run_count; run = 0 <= run_count ? ++_i : --_i) {
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
        for (i = _j = start; start <= finish ? _j <= finish : _j >= finish; i = start <= finish ? ++_j : --_j) {
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
              for (j = _k = neutral_start; neutral_start <= i ? _k < i : _k > i; j = neutral_start <= i ? ++_k : --_k) {
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
      var index, input, left_level, len, next_fmt, output, right_level, _i, _ref;
      if ((this.formatter_indices != null) && this.formatter_indices.length > 0) {
        input = this.length;
        output = this.levels.length;
        for (index = _i = _ref = this.formatter_indices.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; index = _ref <= 0 ? ++_i : --_i) {
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

    Calendar.calendar = {"additional_formats":{"E":"ccc","EHm":"E HH:mm","EHms":"E HH:mm:ss","Ed":"E d","Ehm":"E h:mm a","Ehms":"E h:mm:ss a","Gy":"y G","GyMMM":"LLL y G","GyMMMEd":"E, d MMM y G","GyMMMd":"d MMM y G","H":"HH","HHmm":"HH:mm","HHmmss":"HH:mm:ss","Hm":"HH:mm","Hms":"HH:mm:ss","M":"L","MEd":"E, d/M","MMM":"LLL","MMMEd":"E, d MMM","MMMMEd":"E, d MMMM","MMMMd":"d MMMM","MMMd":"d MMM","Md":"d/M","d":"d","h":"h a","hm":"h:mm a","hms":"h:mm:ss a","ms":"mm:ss","y":"y","yM":"M/y","yMEd":"E, d/M/y","yMMM":"MMM y","yMMMEd":"E, d MMM y","yMMMM":"MMMM y","yMMMd":"d MMM y","yMd":"d/M/y","yQQQ":"y QQQ","yQQQQ":"y QQQQ"},"days":{"format":{"abbreviated":{"fri":"Παρ","mon":"Δευ","sat":"Σάβ","sun":"Κυρ","thu":"Πέμ","tue":"Τρί","wed":"Τετ"},"narrow":{"fri":"Π","mon":"Δ","sat":"Σ","sun":"Κ","thu":"Π","tue":"Τ","wed":"Τ"},"short":{"fri":"Πα","mon":"Δε","sat":"Σά","sun":"Κυ","thu":"Πέ","tue":"Τρ","wed":"Τε"},"wide":{"fri":"Παρασκευή","mon":"Δευτέρα","sat":"Σάββατο","sun":"Κυριακή","thu":"Πέμπτη","tue":"Τρίτη","wed":"Τετάρτη"}},"stand-alone":{"abbreviated":{"fri":"Παρ","mon":"Δευ","sat":"Σάβ","sun":"Κυρ","thu":"Πέμ","tue":"Τρί","wed":"Τετ"},"narrow":{"fri":"Π","mon":"Δ","sat":"Σ","sun":"Κ","thu":"Π","tue":"Τ","wed":"Τ"},"short":{"fri":"Πα","mon":"Δε","sat":"Σά","sun":"Κυ","thu":"Πέ","tue":"Τρ","wed":"Τε"},"wide":{"fri":"Παρασκευή","mon":"Δευτέρα","sat":"Σάββατο","sun":"Κυριακή","thu":"Πέμπτη","tue":"Τρίτη","wed":"Τετάρτη"}}},"eras":{"abbr":{"0":"π.Κ.Χ.","1":"ΚΧ"},"name":{"0":"πριν από την Κοινή Χρονολογία","1":"Κοινή Χρονολογία"},"narrow":{"0":""}},"fields":{"day":"Ημέρα","day-narrow":"ημέρα","day-short":"ημέρα","dayperiod":"π.μ./μ.μ.","era":"Περίοδος","hour":"Ώρα","hour-narrow":"ώ","hour-short":"ώρ.","minute":"Λεπτό","minute-narrow":"λ","minute-short":"λεπ.","month":"Μήνας","month-narrow":"μήν.","month-short":"μήν.","quarter":"Τρίμηνο","quarter-narrow":"τρίμ.","quarter-short":"τρίμ.","second":"Δευτερόλεπτο","second-narrow":"δ","second-short":"δευτ.","week":"Εβδομάδα","week-narrow":"εβδ.","week-short":"εβδ.","weekday":"Ημέρα εβδομάδας","year":"Έτος","year-narrow":"έτ.","year-short":"έτ.","zone":"Ζώνη ώρας"},"formats":{"date":{"full":{"pattern":"EEEE, d MMMM y"},"long":{"pattern":"d MMMM y"},"medium":{"pattern":"d MMM y"},"short":{"pattern":"d/M/yy"}},"datetime":{"full":{"pattern":"{{date}} - {{time}}"},"long":{"pattern":"{{date}} - {{time}}"},"medium":{"pattern":"{{date}}, {{time}}"},"short":{"pattern":"{{date}}, {{time}}"}},"time":{"full":{"pattern":"h:mm:ss a zzzz"},"long":{"pattern":"h:mm:ss a z"},"medium":{"pattern":"h:mm:ss a"},"short":{"pattern":"h:mm a"}}},"months":{"format":{"abbreviated":{"1":"Ιαν","10":"Οκτ","11":"Νοε","12":"Δεκ","2":"Φεβ","3":"Μαρ","4":"Απρ","5":"Μαΐ","6":"Ιουν","7":"Ιουλ","8":"Αυγ","9":"Σεπ"},"narrow":{"1":"Ι","10":"Ο","11":"Ν","12":"Δ","2":"Φ","3":"Μ","4":"Α","5":"Μ","6":"Ι","7":"Ι","8":"Α","9":"Σ"},"wide":{"1":"Ιανουαρίου","10":"Οκτωβρίου","11":"Νοεμβρίου","12":"Δεκεμβρίου","2":"Φεβρουαρίου","3":"Μαρτίου","4":"Απριλίου","5":"Μαΐου","6":"Ιουνίου","7":"Ιουλίου","8":"Αυγούστου","9":"Σεπτεμβρίου"}},"stand-alone":{"abbreviated":{"1":"Ιαν","10":"Οκτ","11":"Νοέ","12":"Δεκ","2":"Φεβ","3":"Μάρ","4":"Απρ","5":"Μάι","6":"Ιούν","7":"Ιούλ","8":"Αύγ","9":"Σεπ"},"narrow":{"1":"Ι","10":"Ο","11":"Ν","12":"Δ","2":"Φ","3":"Μ","4":"Α","5":"Μ","6":"Ι","7":"Ι","8":"Α","9":"Σ"},"wide":{"1":"Ιανουάριος","10":"Οκτώβριος","11":"Νοέμβριος","12":"Δεκέμβριος","2":"Φεβρουάριος","3":"Μάρτιος","4":"Απρίλιος","5":"Μάιος","6":"Ιούνιος","7":"Ιούλιος","8":"Αύγουστος","9":"Σεπτέμβριος"}}},"periods":{"format":{"abbreviated":"calendars.gregorian.dayPeriods.format.wide","narrow":{"am":"π","noon":"μεσ.","pm":"μ"},"wide":{"am":"π.μ.","noon":"μεσημέρι","pm":"μ.μ."}},"stand-alone":{}},"quarters":{"format":{"abbreviated":{"1":"Τ1","2":"Τ2","3":"Τ3","4":"Τ4"},"narrow":{"1":1,"2":2,"3":3,"4":4},"wide":{"1":"1ο τρίμηνο","2":"2ο τρίμηνο","3":"3ο τρίμηνο","4":"4ο τρίμηνο"}},"stand-alone":{"abbreviated":{"1":"Τ1","2":"Τ2","3":"Τ3","4":"Τ4"},"narrow":{"1":1,"2":2,"3":3,"4":4},"wide":{"1":"1ο τρίμηνο","2":"2ο τρίμηνο","3":"3ο τρίμηνο","4":"4ο τρίμηνο"}}}};

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
      var data, format, names_form, root, _ref, _ref1, _ref2, _ref3;
      if (options == null) {
        options = {};
      }
      root = this.calendar[key];
      names_form = options["names_form"] || "wide";
      format = options.format || ((root != null ? (_ref = root["stand-alone"]) != null ? _ref[names_form] : void 0 : void 0) != null ? "stand-alone" : "format");
      data = root[format][names_form];
      if (typeof data === "string" && data.indexOf(REDIRECT_PREFIX) === 0) {
        _ref1 = data.slice(REDIRECT_PREFIX.length).split("."), key = _ref1[0], format = _ref1[1], names_form = _ref1[2];
        return ((_ref2 = this.calendar[key]) != null ? (_ref3 = _ref2[format]) != null ? _ref3[names_form] : void 0 : void 0) || (function() {
          throw "invalid redirect " + data;
        })();
      } else {
        return data;
      }
    };

    return Calendar;

  })();

  TwitterCldr.CodePoint = (function() {
    var decomposition_data_index, decomposition_regex;

    CodePoint.code_point_fields = ["code_point", "name", "category", "combining_class", "bidi_class", "decomposition", "digit_value", "non_decimal_digit_value", "numeric_value", "bidi_mirrored", "unicode1_name", "iso_comment", "simple_uppercase_map", "simple_lowercase_map", "simple_titlecase_map"];

    decomposition_data_index = 5;

    decomposition_regex = /^(?:<(.+)>\s+)?(.+)?$/;

    CodePoint.indices = ["category", "bidi_class", "bidi_mirrored"];

    CodePoint.properties = ["sentence_break", "line_break", "word_break"];

    function CodePoint(fields) {
      var field, i, _i, _ref;
      this.fields = fields;
      for (i = _i = 0, _ref = TwitterCldr.CodePoint.code_point_fields.length; _i < _ref; i = _i += 1) {
        field = TwitterCldr.CodePoint.code_point_fields[i];
        if (field !== "decomposition") {
          this[field] = this.fields[i];
        }
      }
    }

    CodePoint.prototype.decomposition = function() {
      var decomp, match, s;
      decomp = this.fields[decomposition_data_index];
      match = decomp.match(decomposition_regex);
      if (match != null) {
        if (match[2] != null) {
          return (function() {
            var _i, _len, _ref, _results;
            _ref = match[2].match(/\S+/g);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              s = _ref[_i];
              _results.push(parseInt(s, 16));
            }
            return _results;
          })();
        } else {
          return null;
        }
      } else {
        throw "decomposition " + decomp + " has invalid format";
      }
    };

    CodePoint.prototype.compatibility_decomposition_tag = function() {
      var decomp, match;
      decomp = this.fields[decomposition_data_index];
      if ((match = decomp.match(decomposition_regex))) {
        if (match[1] != null) {
          return match[1];
        } else {
          return null;
        }
      } else {
        throw "decomposition " + decomp + " has invalid format";
      }
    };

    CodePoint.prototype.is_compatibility_decomposition = function() {
      return this.compatibility_decomposition_tag() != null;
    };

    CodePoint.code_points_for_property = function(property_name, value) {
      var property_data;
      property_data = this.get_property_data(property_name);
      if (property_data != null) {
        return property_data[value];
      } else {
        throw "Couldn't find property " + property_name;
      }
    };

    CodePoint.code_points_for_property_value = function(prop_value) {
      var index_key, index_name, index_names, result, _i, _len, _ref;
      if (this.index_key_cache[prop_value] != null) {
        return this.index_key_cache[prop_value];
      }
      result = [];
      _ref = this.index_keys;
      for (index_key in _ref) {
        index_names = _ref[index_key];
        if (index_key.indexOf(prop_value) > -1) {
          for (_i = 0, _len = index_names.length; _i < _len; _i++) {
            index_name = index_names[_i];
            result = result.concat(this.get_index(index_name)[index_key]);
          }
        }
      }
      return this.index_key_cache[prop_value] = result;
    };

    CodePoint.index_key_cache = {};

    CodePoint.index_keys = {"Cc":["category"],"Zs":["category"],"Po":["category"],"Sc":["category"],"Ps":["category"],"Pe":["category"],"Sm":["category"],"Pd":["category"],"Nd":["category"],"Lu":["category"],"Sk":["category"],"Pc":["category"],"Ll":["category"],"So":["category"],"Lo":["category"],"Pi":["category"],"Cf":["category"],"No":["category"],"Pf":["category"],"Lt":["category"],"Lm":["category"],"Mn":["category"],"Me":["category"],"Mc":["category"],"Nl":["category"],"Zl":["category"],"Zp":["category"],"Cs":["category"],"Co":["category"],"BN":["bidi_class"],"S":["bidi_class"],"B":["bidi_class"],"WS":["bidi_class"],"ON":["bidi_class"],"ET":["bidi_class"],"ES":["bidi_class"],"CS":["bidi_class"],"EN":["bidi_class"],"L":["bidi_class"],"NSM":["bidi_class"],"R":["bidi_class"],"AN":["bidi_class"],"AL":["bidi_class"],"LRE":["bidi_class"],"RLE":["bidi_class"],"PDF":["bidi_class"],"LRO":["bidi_class"],"RLO":["bidi_class"],"N":["bidi_mirrored"],"Y":["bidi_mirrored"]};

    CodePoint.index_data = {"category":{"Cc":[[0,31],[127,159]],"Zs":[[32,32],[160,160],[5760,5760],[6158,6158],[8192,8202],[8239,8239],[8287,8287],[12288,12288]],"Po":[[33,35],[37,39],[42,42],[44,44],[46,47],[58,59],[63,64],[92,92],[161,161],[167,167],[182,183],[191,191],[894,894],[903,903],[1370,1375],[1417,1417],[1472,1472],[1475,1475],[1478,1478],[1523,1524],[1545,1546],[1548,1549],[1563,1563],[1566,1567],[1642,1645],[1748,1748],[1792,1805],[2039,2041],[2096,2110],[2142,2142],[2404,2405],[2416,2416],[2800,2800],[3572,3572],[3663,3663],[3674,3675],[3844,3858],[3860,3860],[3973,3973],[4048,4052],[4057,4058],[4170,4175],[4347,4347],[4960,4968],[5741,5742],[5867,5869],[5941,5942],[6100,6102],[6104,6106],[6144,6149],[6151,6154],[6468,6469],[6686,6687],[6816,6822],[6824,6829],[7002,7008],[7164,7167],[7227,7231],[7294,7295],[7360,7367],[7379,7379],[8214,8215],[8224,8231],[8240,8248],[8251,8254],[8257,8259],[8263,8273],[8275,8275],[8277,8286],[11513,11516],[11518,11519],[11632,11632],[11776,11777],[11782,11784],[11787,11787],[11790,11798],[11800,11801],[11803,11803],[11806,11807],[11818,11822],[11824,11833],[12289,12291],[12349,12349],[12539,12539],[42238,42239],[42509,42511],[42611,42611],[42622,42622],[42738,42743],[43124,43127],[43214,43215],[43256,43258],[43310,43311],[43359,43359],[43457,43469],[43486,43487],[43612,43615],[43742,43743],[43760,43761],[44011,44011],[65040,65046],[65049,65049],[65072,65072],[65093,65094],[65097,65100],[65104,65106],[65108,65111],[65119,65121],[65128,65128],[65130,65131],[65281,65283],[65285,65287],[65290,65290],[65292,65292],[65294,65295],[65306,65307],[65311,65312],[65340,65340],[65377,65377],[65380,65381],[65792,65794],[66463,66463],[66512,66512],[67671,67671],[67871,67871],[67903,67903],[68176,68184],[68223,68223],[68409,68415],[69703,69709],[69819,69820],[69822,69825],[69952,69955],[70085,70088],[74864,74867]],"Sc":[[36,36],[162,165],[1423,1423],[1547,1547],[2546,2547],[2555,2555],[2801,2801],[3065,3065],[3647,3647],[6107,6107],[8352,8378],[43064,43064],[65020,65020],[65129,65129],[65284,65284],[65504,65505],[65509,65510]],"Ps":[[40,40],[91,91],[123,123],[3898,3898],[3900,3900],[5787,5787],[8218,8218],[8222,8222],[8261,8261],[8317,8317],[8333,8333],[9001,9001],[10088,10088],[10090,10090],[10092,10092],[10094,10094],[10096,10096],[10098,10098],[10100,10100],[10181,10181],[10214,10214],[10216,10216],[10218,10218],[10220,10220],[10222,10222],[10627,10627],[10629,10629],[10631,10631],[10633,10633],[10635,10635],[10637,10637],[10639,10639],[10641,10641],[10643,10643],[10645,10645],[10647,10647],[10712,10712],[10714,10714],[10748,10748],[11810,11810],[11812,11812],[11814,11814],[11816,11816],[12296,12296],[12298,12298],[12300,12300],[12302,12302],[12304,12304],[12308,12308],[12310,12310],[12312,12312],[12314,12314],[12317,12317],[64830,64830],[65047,65047],[65077,65077],[65079,65079],[65081,65081],[65083,65083],[65085,65085],[65087,65087],[65089,65089],[65091,65091],[65095,65095],[65113,65113],[65115,65115],[65117,65117],[65288,65288],[65339,65339],[65371,65371],[65375,65375],[65378,65378]],"Pe":[[41,41],[93,93],[125,125],[3899,3899],[3901,3901],[5788,5788],[8262,8262],[8318,8318],[8334,8334],[9002,9002],[10089,10089],[10091,10091],[10093,10093],[10095,10095],[10097,10097],[10099,10099],[10101,10101],[10182,10182],[10215,10215],[10217,10217],[10219,10219],[10221,10221],[10223,10223],[10628,10628],[10630,10630],[10632,10632],[10634,10634],[10636,10636],[10638,10638],[10640,10640],[10642,10642],[10644,10644],[10646,10646],[10648,10648],[10713,10713],[10715,10715],[10749,10749],[11811,11811],[11813,11813],[11815,11815],[11817,11817],[12297,12297],[12299,12299],[12301,12301],[12303,12303],[12305,12305],[12309,12309],[12311,12311],[12313,12313],[12315,12315],[12318,12319],[64831,64831],[65048,65048],[65078,65078],[65080,65080],[65082,65082],[65084,65084],[65086,65086],[65088,65088],[65090,65090],[65092,65092],[65096,65096],[65114,65114],[65116,65116],[65118,65118],[65289,65289],[65341,65341],[65373,65373],[65376,65376],[65379,65379]],"Sm":[[43,43],[60,62],[124,124],[126,126],[172,172],[177,177],[215,215],[247,247],[1014,1014],[1542,1544],[8260,8260],[8274,8274],[8314,8316],[8330,8332],[8472,8472],[8512,8516],[8523,8523],[8592,8596],[8602,8603],[8608,8608],[8611,8611],[8614,8614],[8622,8622],[8654,8655],[8658,8658],[8660,8660],[8692,8959],[8968,8971],[8992,8993],[9084,9084],[9115,9139],[9180,9185],[9655,9655],[9665,9665],[9720,9727],[9839,9839],[10176,10180],[10183,10213],[10224,10239],[10496,10626],[10649,10711],[10716,10747],[10750,11007],[11056,11076],[11079,11084],[64297,64297],[65122,65122],[65124,65126],[65291,65291],[65308,65310],[65372,65372],[65374,65374],[65506,65506],[65513,65516],[120513,120513],[120539,120539],[120571,120571],[120597,120597],[120629,120629],[120655,120655],[120687,120687],[120713,120713],[120745,120745],[120771,120771],[126704,126705]],"Pd":[[45,45],[1418,1418],[1470,1470],[5120,5120],[6150,6150],[8208,8213],[11799,11799],[11802,11802],[11834,11835],[12316,12316],[12336,12336],[12448,12448],[65073,65074],[65112,65112],[65123,65123],[65293,65293]],"Nd":[[48,57],[1632,1641],[1776,1785],[1984,1993],[2406,2415],[2534,2543],[2662,2671],[2790,2799],[2918,2927],[3046,3055],[3174,3183],[3302,3311],[3430,3439],[3664,3673],[3792,3801],[3872,3881],[4160,4169],[4240,4249],[6112,6121],[6160,6169],[6470,6479],[6608,6617],[6784,6793],[6800,6809],[6992,7001],[7088,7097],[7232,7241],[7248,7257],[42528,42537],[43216,43225],[43264,43273],[43472,43481],[43600,43609],[44016,44025],[65296,65305],[66720,66729],[69734,69743],[69872,69881],[69942,69951],[70096,70105],[71360,71369],[120782,120831]],"Lu":[[65,90],[192,214],[216,222],[256,256],[258,258],[260,260],[262,262],[264,264],[266,266],[268,268],[270,270],[272,272],[274,274],[276,276],[278,278],[280,280],[282,282],[284,284],[286,286],[288,288],[290,290],[292,292],[294,294],[296,296],[298,298],[300,300],[302,302],[304,304],[306,306],[308,308],[310,310],[313,313],[315,315],[317,317],[319,319],[321,321],[323,323],[325,325],[327,327],[330,330],[332,332],[334,334],[336,336],[338,338],[340,340],[342,342],[344,344],[346,346],[348,348],[350,350],[352,352],[354,354],[356,356],[358,358],[360,360],[362,362],[364,364],[366,366],[368,368],[370,370],[372,372],[374,374],[376,377],[379,379],[381,381],[385,386],[388,388],[390,391],[393,395],[398,401],[403,404],[406,408],[412,413],[415,416],[418,418],[420,420],[422,423],[425,425],[428,428],[430,431],[433,435],[437,437],[439,440],[444,444],[452,452],[455,455],[458,458],[461,461],[463,463],[465,465],[467,467],[469,469],[471,471],[473,473],[475,475],[478,478],[480,480],[482,482],[484,484],[486,486],[488,488],[490,490],[492,492],[494,494],[497,497],[500,500],[502,504],[506,506],[508,508],[510,510],[512,512],[514,514],[516,516],[518,518],[520,520],[522,522],[524,524],[526,526],[528,528],[530,530],[532,532],[534,534],[536,536],[538,538],[540,540],[542,542],[544,544],[546,546],[548,548],[550,550],[552,552],[554,554],[556,556],[558,558],[560,560],[562,562],[570,571],[573,574],[577,577],[579,582],[584,584],[586,586],[588,588],[590,590],[880,880],[882,882],[886,886],[902,902],[904,906],[908,908],[910,911],[913,929],[931,939],[975,975],[978,980],[984,984],[986,986],[988,988],[990,990],[992,992],[994,994],[996,996],[998,998],[1000,1000],[1002,1002],[1004,1004],[1006,1006],[1012,1012],[1015,1015],[1017,1018],[1021,1071],[1120,1120],[1122,1122],[1124,1124],[1126,1126],[1128,1128],[1130,1130],[1132,1132],[1134,1134],[1136,1136],[1138,1138],[1140,1140],[1142,1142],[1144,1144],[1146,1146],[1148,1148],[1150,1150],[1152,1152],[1162,1162],[1164,1164],[1166,1166],[1168,1168],[1170,1170],[1172,1172],[1174,1174],[1176,1176],[1178,1178],[1180,1180],[1182,1182],[1184,1184],[1186,1186],[1188,1188],[1190,1190],[1192,1192],[1194,1194],[1196,1196],[1198,1198],[1200,1200],[1202,1202],[1204,1204],[1206,1206],[1208,1208],[1210,1210],[1212,1212],[1214,1214],[1216,1217],[1219,1219],[1221,1221],[1223,1223],[1225,1225],[1227,1227],[1229,1229],[1232,1232],[1234,1234],[1236,1236],[1238,1238],[1240,1240],[1242,1242],[1244,1244],[1246,1246],[1248,1248],[1250,1250],[1252,1252],[1254,1254],[1256,1256],[1258,1258],[1260,1260],[1262,1262],[1264,1264],[1266,1266],[1268,1268],[1270,1270],[1272,1272],[1274,1274],[1276,1276],[1278,1278],[1280,1280],[1282,1282],[1284,1284],[1286,1286],[1288,1288],[1290,1290],[1292,1292],[1294,1294],[1296,1296],[1298,1298],[1300,1300],[1302,1302],[1304,1304],[1306,1306],[1308,1308],[1310,1310],[1312,1312],[1314,1314],[1316,1316],[1318,1318],[1329,1366],[4256,4293],[4295,4295],[4301,4301],[7680,7680],[7682,7682],[7684,7684],[7686,7686],[7688,7688],[7690,7690],[7692,7692],[7694,7694],[7696,7696],[7698,7698],[7700,7700],[7702,7702],[7704,7704],[7706,7706],[7708,7708],[7710,7710],[7712,7712],[7714,7714],[7716,7716],[7718,7718],[7720,7720],[7722,7722],[7724,7724],[7726,7726],[7728,7728],[7730,7730],[7732,7732],[7734,7734],[7736,7736],[7738,7738],[7740,7740],[7742,7742],[7744,7744],[7746,7746],[7748,7748],[7750,7750],[7752,7752],[7754,7754],[7756,7756],[7758,7758],[7760,7760],[7762,7762],[7764,7764],[7766,7766],[7768,7768],[7770,7770],[7772,7772],[7774,7774],[7776,7776],[7778,7778],[7780,7780],[7782,7782],[7784,7784],[7786,7786],[7788,7788],[7790,7790],[7792,7792],[7794,7794],[7796,7796],[7798,7798],[7800,7800],[7802,7802],[7804,7804],[7806,7806],[7808,7808],[7810,7810],[7812,7812],[7814,7814],[7816,7816],[7818,7818],[7820,7820],[7822,7822],[7824,7824],[7826,7826],[7828,7828],[7838,7838],[7840,7840],[7842,7842],[7844,7844],[7846,7846],[7848,7848],[7850,7850],[7852,7852],[7854,7854],[7856,7856],[7858,7858],[7860,7860],[7862,7862],[7864,7864],[7866,7866],[7868,7868],[7870,7870],[7872,7872],[7874,7874],[7876,7876],[7878,7878],[7880,7880],[7882,7882],[7884,7884],[7886,7886],[7888,7888],[7890,7890],[7892,7892],[7894,7894],[7896,7896],[7898,7898],[7900,7900],[7902,7902],[7904,7904],[7906,7906],[7908,7908],[7910,7910],[7912,7912],[7914,7914],[7916,7916],[7918,7918],[7920,7920],[7922,7922],[7924,7924],[7926,7926],[7928,7928],[7930,7930],[7932,7932],[7934,7934],[7944,7951],[7960,7965],[7976,7983],[7992,7999],[8008,8013],[8025,8025],[8027,8027],[8029,8029],[8031,8031],[8040,8047],[8120,8123],[8136,8139],[8152,8155],[8168,8172],[8184,8187],[8450,8450],[8455,8455],[8459,8461],[8464,8466],[8469,8469],[8473,8477],[8484,8484],[8486,8486],[8488,8488],[8490,8493],[8496,8499],[8510,8511],[8517,8517],[8579,8579],[11264,11310],[11360,11360],[11362,11364],[11367,11367],[11369,11369],[11371,11371],[11373,11376],[11378,11378],[11381,11381],[11390,11392],[11394,11394],[11396,11396],[11398,11398],[11400,11400],[11402,11402],[11404,11404],[11406,11406],[11408,11408],[11410,11410],[11412,11412],[11414,11414],[11416,11416],[11418,11418],[11420,11420],[11422,11422],[11424,11424],[11426,11426],[11428,11428],[11430,11430],[11432,11432],[11434,11434],[11436,11436],[11438,11438],[11440,11440],[11442,11442],[11444,11444],[11446,11446],[11448,11448],[11450,11450],[11452,11452],[11454,11454],[11456,11456],[11458,11458],[11460,11460],[11462,11462],[11464,11464],[11466,11466],[11468,11468],[11470,11470],[11472,11472],[11474,11474],[11476,11476],[11478,11478],[11480,11480],[11482,11482],[11484,11484],[11486,11486],[11488,11488],[11490,11490],[11499,11499],[11501,11501],[11506,11506],[42560,42560],[42562,42562],[42564,42564],[42566,42566],[42568,42568],[42570,42570],[42572,42572],[42574,42574],[42576,42576],[42578,42578],[42580,42580],[42582,42582],[42584,42584],[42586,42586],[42588,42588],[42590,42590],[42592,42592],[42594,42594],[42596,42596],[42598,42598],[42600,42600],[42602,42602],[42604,42604],[42624,42624],[42626,42626],[42628,42628],[42630,42630],[42632,42632],[42634,42634],[42636,42636],[42638,42638],[42640,42640],[42642,42642],[42644,42644],[42646,42646],[42786,42786],[42788,42788],[42790,42790],[42792,42792],[42794,42794],[42796,42796],[42798,42798],[42802,42802],[42804,42804],[42806,42806],[42808,42808],[42810,42810],[42812,42812],[42814,42814],[42816,42816],[42818,42818],[42820,42820],[42822,42822],[42824,42824],[42826,42826],[42828,42828],[42830,42830],[42832,42832],[42834,42834],[42836,42836],[42838,42838],[42840,42840],[42842,42842],[42844,42844],[42846,42846],[42848,42848],[42850,42850],[42852,42852],[42854,42854],[42856,42856],[42858,42858],[42860,42860],[42862,42862],[42873,42873],[42875,42875],[42877,42878],[42880,42880],[42882,42882],[42884,42884],[42886,42886],[42891,42891],[42893,42893],[42896,42896],[42898,42898],[42912,42912],[42914,42914],[42916,42916],[42918,42918],[42920,42920],[42922,42922],[65313,65338],[66560,66599],[119808,119833],[119860,119885],[119912,119937],[119964,119964],[119966,119967],[119970,119970],[119973,119974],[119977,119980],[119982,119989],[120016,120041],[120068,120069],[120071,120074],[120077,120084],[120086,120092],[120120,120121],[120123,120126],[120128,120132],[120134,120134],[120138,120144],[120172,120197],[120224,120249],[120276,120301],[120328,120353],[120380,120405],[120432,120457],[120488,120512],[120546,120570],[120604,120628],[120662,120686],[120720,120744],[120778,120778]],"Sk":[[94,94],[96,96],[168,168],[175,175],[180,180],[184,184],[706,709],[722,735],[741,747],[749,749],[751,767],[885,885],[900,901],[8125,8125],[8127,8129],[8141,8143],[8157,8159],[8173,8175],[8189,8190],[12443,12444],[42752,42774],[42784,42785],[42889,42890],[64434,64449],[65342,65342],[65344,65344],[65507,65507]],"Pc":[[95,95],[8255,8256],[8276,8276],[65075,65076],[65101,65103],[65343,65343]],"Ll":[[97,122],[181,181],[223,246],[248,255],[257,257],[259,259],[261,261],[263,263],[265,265],[267,267],[269,269],[271,271],[273,273],[275,275],[277,277],[279,279],[281,281],[283,283],[285,285],[287,287],[289,289],[291,291],[293,293],[295,295],[297,297],[299,299],[301,301],[303,303],[305,305],[307,307],[309,309],[311,312],[314,314],[316,316],[318,318],[320,320],[322,322],[324,324],[326,326],[328,329],[331,331],[333,333],[335,335],[337,337],[339,339],[341,341],[343,343],[345,345],[347,347],[349,349],[351,351],[353,353],[355,355],[357,357],[359,359],[361,361],[363,363],[365,365],[367,367],[369,369],[371,371],[373,373],[375,375],[378,378],[380,380],[382,384],[387,387],[389,389],[392,392],[396,397],[402,402],[405,405],[409,411],[414,414],[417,417],[419,419],[421,421],[424,424],[426,427],[429,429],[432,432],[436,436],[438,438],[441,442],[445,447],[454,454],[457,457],[460,460],[462,462],[464,464],[466,466],[468,468],[470,470],[472,472],[474,474],[476,477],[479,479],[481,481],[483,483],[485,485],[487,487],[489,489],[491,491],[493,493],[495,496],[499,499],[501,501],[505,505],[507,507],[509,509],[511,511],[513,513],[515,515],[517,517],[519,519],[521,521],[523,523],[525,525],[527,527],[529,529],[531,531],[533,533],[535,535],[537,537],[539,539],[541,541],[543,543],[545,545],[547,547],[549,549],[551,551],[553,553],[555,555],[557,557],[559,559],[561,561],[563,569],[572,572],[575,576],[578,578],[583,583],[585,585],[587,587],[589,589],[591,659],[661,687],[881,881],[883,883],[887,887],[891,893],[912,912],[940,974],[976,977],[981,983],[985,985],[987,987],[989,989],[991,991],[993,993],[995,995],[997,997],[999,999],[1001,1001],[1003,1003],[1005,1005],[1007,1011],[1013,1013],[1016,1016],[1019,1020],[1072,1119],[1121,1121],[1123,1123],[1125,1125],[1127,1127],[1129,1129],[1131,1131],[1133,1133],[1135,1135],[1137,1137],[1139,1139],[1141,1141],[1143,1143],[1145,1145],[1147,1147],[1149,1149],[1151,1151],[1153,1153],[1163,1163],[1165,1165],[1167,1167],[1169,1169],[1171,1171],[1173,1173],[1175,1175],[1177,1177],[1179,1179],[1181,1181],[1183,1183],[1185,1185],[1187,1187],[1189,1189],[1191,1191],[1193,1193],[1195,1195],[1197,1197],[1199,1199],[1201,1201],[1203,1203],[1205,1205],[1207,1207],[1209,1209],[1211,1211],[1213,1213],[1215,1215],[1218,1218],[1220,1220],[1222,1222],[1224,1224],[1226,1226],[1228,1228],[1230,1231],[1233,1233],[1235,1235],[1237,1237],[1239,1239],[1241,1241],[1243,1243],[1245,1245],[1247,1247],[1249,1249],[1251,1251],[1253,1253],[1255,1255],[1257,1257],[1259,1259],[1261,1261],[1263,1263],[1265,1265],[1267,1267],[1269,1269],[1271,1271],[1273,1273],[1275,1275],[1277,1277],[1279,1279],[1281,1281],[1283,1283],[1285,1285],[1287,1287],[1289,1289],[1291,1291],[1293,1293],[1295,1295],[1297,1297],[1299,1299],[1301,1301],[1303,1303],[1305,1305],[1307,1307],[1309,1309],[1311,1311],[1313,1313],[1315,1315],[1317,1317],[1319,1319],[1377,1415],[7424,7467],[7531,7543],[7545,7578],[7681,7681],[7683,7683],[7685,7685],[7687,7687],[7689,7689],[7691,7691],[7693,7693],[7695,7695],[7697,7697],[7699,7699],[7701,7701],[7703,7703],[7705,7705],[7707,7707],[7709,7709],[7711,7711],[7713,7713],[7715,7715],[7717,7717],[7719,7719],[7721,7721],[7723,7723],[7725,7725],[7727,7727],[7729,7729],[7731,7731],[7733,7733],[7735,7735],[7737,7737],[7739,7739],[7741,7741],[7743,7743],[7745,7745],[7747,7747],[7749,7749],[7751,7751],[7753,7753],[7755,7755],[7757,7757],[7759,7759],[7761,7761],[7763,7763],[7765,7765],[7767,7767],[7769,7769],[7771,7771],[7773,7773],[7775,7775],[7777,7777],[7779,7779],[7781,7781],[7783,7783],[7785,7785],[7787,7787],[7789,7789],[7791,7791],[7793,7793],[7795,7795],[7797,7797],[7799,7799],[7801,7801],[7803,7803],[7805,7805],[7807,7807],[7809,7809],[7811,7811],[7813,7813],[7815,7815],[7817,7817],[7819,7819],[7821,7821],[7823,7823],[7825,7825],[7827,7827],[7829,7837],[7839,7839],[7841,7841],[7843,7843],[7845,7845],[7847,7847],[7849,7849],[7851,7851],[7853,7853],[7855,7855],[7857,7857],[7859,7859],[7861,7861],[7863,7863],[7865,7865],[7867,7867],[7869,7869],[7871,7871],[7873,7873],[7875,7875],[7877,7877],[7879,7879],[7881,7881],[7883,7883],[7885,7885],[7887,7887],[7889,7889],[7891,7891],[7893,7893],[7895,7895],[7897,7897],[7899,7899],[7901,7901],[7903,7903],[7905,7905],[7907,7907],[7909,7909],[7911,7911],[7913,7913],[7915,7915],[7917,7917],[7919,7919],[7921,7921],[7923,7923],[7925,7925],[7927,7927],[7929,7929],[7931,7931],[7933,7933],[7935,7943],[7952,7957],[7968,7975],[7984,7991],[8000,8005],[8016,8023],[8032,8039],[8048,8061],[8064,8071],[8080,8087],[8096,8103],[8112,8116],[8118,8119],[8126,8126],[8130,8132],[8134,8135],[8144,8147],[8150,8151],[8160,8167],[8178,8180],[8182,8183],[8458,8458],[8462,8463],[8467,8467],[8495,8495],[8500,8500],[8505,8505],[8508,8509],[8518,8521],[8526,8526],[8580,8580],[11312,11358],[11361,11361],[11365,11366],[11368,11368],[11370,11370],[11372,11372],[11377,11377],[11379,11380],[11382,11387],[11393,11393],[11395,11395],[11397,11397],[11399,11399],[11401,11401],[11403,11403],[11405,11405],[11407,11407],[11409,11409],[11411,11411],[11413,11413],[11415,11415],[11417,11417],[11419,11419],[11421,11421],[11423,11423],[11425,11425],[11427,11427],[11429,11429],[11431,11431],[11433,11433],[11435,11435],[11437,11437],[11439,11439],[11441,11441],[11443,11443],[11445,11445],[11447,11447],[11449,11449],[11451,11451],[11453,11453],[11455,11455],[11457,11457],[11459,11459],[11461,11461],[11463,11463],[11465,11465],[11467,11467],[11469,11469],[11471,11471],[11473,11473],[11475,11475],[11477,11477],[11479,11479],[11481,11481],[11483,11483],[11485,11485],[11487,11487],[11489,11489],[11491,11492],[11500,11500],[11502,11502],[11507,11507],[11520,11557],[11559,11559],[11565,11565],[42561,42561],[42563,42563],[42565,42565],[42567,42567],[42569,42569],[42571,42571],[42573,42573],[42575,42575],[42577,42577],[42579,42579],[42581,42581],[42583,42583],[42585,42585],[42587,42587],[42589,42589],[42591,42591],[42593,42593],[42595,42595],[42597,42597],[42599,42599],[42601,42601],[42603,42603],[42605,42605],[42625,42625],[42627,42627],[42629,42629],[42631,42631],[42633,42633],[42635,42635],[42637,42637],[42639,42639],[42641,42641],[42643,42643],[42645,42645],[42647,42647],[42787,42787],[42789,42789],[42791,42791],[42793,42793],[42795,42795],[42797,42797],[42799,42801],[42803,42803],[42805,42805],[42807,42807],[42809,42809],[42811,42811],[42813,42813],[42815,42815],[42817,42817],[42819,42819],[42821,42821],[42823,42823],[42825,42825],[42827,42827],[42829,42829],[42831,42831],[42833,42833],[42835,42835],[42837,42837],[42839,42839],[42841,42841],[42843,42843],[42845,42845],[42847,42847],[42849,42849],[42851,42851],[42853,42853],[42855,42855],[42857,42857],[42859,42859],[42861,42861],[42863,42863],[42865,42872],[42874,42874],[42876,42876],[42879,42879],[42881,42881],[42883,42883],[42885,42885],[42887,42887],[42892,42892],[42894,42894],[42897,42897],[42899,42899],[42913,42913],[42915,42915],[42917,42917],[42919,42919],[42921,42921],[43002,43002],[64256,64262],[64275,64279],[65345,65370],[66600,66639],[119834,119859],[119886,119892],[119894,119911],[119938,119963],[119990,119993],[119995,119995],[119997,120003],[120005,120015],[120042,120067],[120094,120119],[120146,120171],[120198,120223],[120250,120275],[120302,120327],[120354,120379],[120406,120431],[120458,120485],[120514,120538],[120540,120545],[120572,120596],[120598,120603],[120630,120654],[120656,120661],[120688,120712],[120714,120719],[120746,120770],[120772,120777],[120779,120779]],"So":[[166,166],[169,169],[174,174],[176,176],[1154,1154],[1550,1551],[1758,1758],[1769,1769],[1789,1790],[2038,2038],[2554,2554],[2928,2928],[3059,3064],[3066,3066],[3199,3199],[3449,3449],[3841,3843],[3859,3859],[3861,3863],[3866,3871],[3892,3892],[3894,3894],[3896,3896],[4030,4037],[4039,4044],[4046,4047],[4053,4056],[4254,4255],[5008,5017],[6464,6464],[6622,6655],[7009,7018],[7028,7036],[8448,8449],[8451,8454],[8456,8457],[8468,8468],[8470,8471],[8478,8483],[8485,8485],[8487,8487],[8489,8489],[8494,8494],[8506,8507],[8522,8522],[8524,8525],[8527,8527],[8597,8601],[8604,8607],[8609,8610],[8612,8613],[8615,8621],[8623,8653],[8656,8657],[8659,8659],[8661,8691],[8960,8967],[8972,8991],[8994,9000],[9003,9083],[9085,9114],[9140,9179],[9186,9203],[9216,9254],[9280,9290],[9372,9449],[9472,9654],[9656,9664],[9666,9719],[9728,9838],[9840,9983],[9985,10087],[10132,10175],[10240,10495],[11008,11055],[11077,11078],[11088,11097],[11493,11498],[11904,11929],[11931,12019],[12032,12245],[12272,12283],[12292,12292],[12306,12307],[12320,12320],[12342,12343],[12350,12351],[12688,12689],[12694,12703],[12736,12771],[12800,12830],[12842,12871],[12880,12880],[12896,12927],[12938,12976],[12992,13054],[13056,13311],[19904,19967],[42128,42182],[43048,43051],[43062,43063],[43065,43065],[43639,43641],[65021,65021],[65508,65508],[65512,65512],[65517,65518],[65532,65533],[65847,65855],[65913,65929],[65936,65947],[66000,66044],[118784,119029],[119040,119078],[119081,119140],[119146,119148],[119171,119172],[119180,119209],[119214,119261],[119296,119361],[119365,119365],[119552,119638],[126976,127019],[127024,127123],[127136,127150],[127153,127166],[127169,127183],[127185,127199],[127248,127278],[127280,127339],[127344,127386],[127462,127490],[127504,127546],[127552,127560],[127568,127569],[127744,127776],[127792,127797],[127799,127868],[127872,127891],[127904,127940],[127942,127946],[127968,127984],[128000,128062],[128064,128064],[128066,128247],[128249,128252],[128256,128317],[128320,128323],[128336,128359],[128507,128576],[128581,128591],[128640,128709],[128768,128883]],"Lo":[[170,170],[186,186],[443,443],[448,451],[660,660],[1488,1514],[1520,1522],[1568,1599],[1601,1610],[1646,1647],[1649,1747],[1749,1749],[1774,1775],[1786,1788],[1791,1791],[1808,1808],[1810,1839],[1869,1957],[1969,1969],[1994,2026],[2048,2069],[2112,2136],[2208,2208],[2210,2220],[2308,2361],[2365,2365],[2384,2384],[2392,2401],[2418,2423],[2425,2431],[2437,2444],[2447,2448],[2451,2472],[2474,2480],[2482,2482],[2486,2489],[2493,2493],[2510,2510],[2524,2525],[2527,2529],[2544,2545],[2565,2570],[2575,2576],[2579,2600],[2602,2608],[2610,2611],[2613,2614],[2616,2617],[2649,2652],[2654,2654],[2674,2676],[2693,2701],[2703,2705],[2707,2728],[2730,2736],[2738,2739],[2741,2745],[2749,2749],[2768,2768],[2784,2785],[2821,2828],[2831,2832],[2835,2856],[2858,2864],[2866,2867],[2869,2873],[2877,2877],[2908,2909],[2911,2913],[2929,2929],[2947,2947],[2949,2954],[2958,2960],[2962,2965],[2969,2970],[2972,2972],[2974,2975],[2979,2980],[2984,2986],[2990,3001],[3024,3024],[3077,3084],[3086,3088],[3090,3112],[3114,3123],[3125,3129],[3133,3133],[3160,3161],[3168,3169],[3205,3212],[3214,3216],[3218,3240],[3242,3251],[3253,3257],[3261,3261],[3294,3294],[3296,3297],[3313,3314],[3333,3340],[3342,3344],[3346,3386],[3389,3389],[3406,3406],[3424,3425],[3450,3455],[3461,3478],[3482,3505],[3507,3515],[3517,3517],[3520,3526],[3585,3632],[3634,3635],[3648,3653],[3713,3714],[3716,3716],[3719,3720],[3722,3722],[3725,3725],[3732,3735],[3737,3743],[3745,3747],[3749,3749],[3751,3751],[3754,3755],[3757,3760],[3762,3763],[3773,3773],[3776,3780],[3804,3807],[3840,3840],[3904,3911],[3913,3948],[3976,3980],[4096,4138],[4159,4159],[4176,4181],[4186,4189],[4193,4193],[4197,4198],[4206,4208],[4213,4225],[4238,4238],[4304,4346],[4349,4680],[4682,4685],[4688,4694],[4696,4696],[4698,4701],[4704,4744],[4746,4749],[4752,4784],[4786,4789],[4792,4798],[4800,4800],[4802,4805],[4808,4822],[4824,4880],[4882,4885],[4888,4954],[4992,5007],[5024,5108],[5121,5740],[5743,5759],[5761,5786],[5792,5866],[5888,5900],[5902,5905],[5920,5937],[5952,5969],[5984,5996],[5998,6000],[6016,6067],[6108,6108],[6176,6210],[6212,6263],[6272,6312],[6314,6314],[6320,6389],[6400,6428],[6480,6509],[6512,6516],[6528,6571],[6593,6599],[6656,6678],[6688,6740],[6917,6963],[6981,6987],[7043,7072],[7086,7087],[7098,7141],[7168,7203],[7245,7247],[7258,7287],[7401,7404],[7406,7409],[7413,7414],[8501,8504],[11568,11623],[11648,11670],[11680,11686],[11688,11694],[11696,11702],[11704,11710],[11712,11718],[11720,11726],[11728,11734],[11736,11742],[12294,12294],[12348,12348],[12353,12438],[12447,12447],[12449,12538],[12543,12543],[12549,12589],[12593,12686],[12704,12730],[12784,12799],[13312,13312],[19893,19893],[19968,19968],[40908,40908],[40960,40980],[40982,42124],[42192,42231],[42240,42507],[42512,42527],[42538,42539],[42606,42606],[42656,42725],[43003,43009],[43011,43013],[43015,43018],[43020,43042],[43072,43123],[43138,43187],[43250,43255],[43259,43259],[43274,43301],[43312,43334],[43360,43388],[43396,43442],[43520,43560],[43584,43586],[43588,43595],[43616,43631],[43633,43638],[43642,43642],[43648,43695],[43697,43697],[43701,43702],[43705,43709],[43712,43712],[43714,43714],[43739,43740],[43744,43754],[43762,43762],[43777,43782],[43785,43790],[43793,43798],[43808,43814],[43816,43822],[43968,44002],[44032,44032],[55203,55203],[55216,55238],[55243,55291],[63744,64109],[64112,64217],[64285,64285],[64287,64296],[64298,64310],[64312,64316],[64318,64318],[64320,64321],[64323,64324],[64326,64433],[64467,64829],[64848,64911],[64914,64967],[65008,65019],[65136,65140],[65142,65276],[65382,65391],[65393,65437],[65440,65470],[65474,65479],[65482,65487],[65490,65495],[65498,65500],[65536,65547],[65549,65574],[65576,65594],[65596,65597],[65599,65613],[65616,65629],[65664,65786],[66176,66204],[66208,66256],[66304,66334],[66352,66368],[66370,66377],[66432,66461],[66464,66499],[66504,66511],[66640,66717],[67584,67589],[67592,67592],[67594,67637],[67639,67640],[67644,67644],[67647,67669],[67840,67861],[67872,67897],[67968,68023],[68030,68031],[68096,68096],[68112,68115],[68117,68119],[68121,68147],[68192,68220],[68352,68405],[68416,68437],[68448,68466],[68608,68680],[69635,69687],[69763,69807],[69840,69864],[69891,69926],[70019,70066],[70081,70084],[71296,71338],[73728,74606],[77824,78894],[92160,92728],[93952,94020],[94032,94032],[110592,110593],[126464,126467],[126469,126495],[126497,126498],[126500,126500],[126503,126503],[126505,126514],[126516,126519],[126521,126521],[126523,126523],[126530,126530],[126535,126535],[126537,126537],[126539,126539],[126541,126543],[126545,126546],[126548,126548],[126551,126551],[126553,126553],[126555,126555],[126557,126557],[126559,126559],[126561,126562],[126564,126564],[126567,126570],[126572,126578],[126580,126583],[126585,126588],[126590,126590],[126592,126601],[126603,126619],[126625,126627],[126629,126633],[126635,126651],[131072,131072],[173782,173782],[173824,173824],[177972,177972],[177984,177984],[178205,178205],[194560,195101]],"Pi":[[171,171],[8216,8216],[8219,8220],[8223,8223],[8249,8249],[11778,11778],[11780,11780],[11785,11785],[11788,11788],[11804,11804],[11808,11808]],"Cf":[[173,173],[1536,1540],[1757,1757],[1807,1807],[8203,8207],[8234,8238],[8288,8292],[8298,8303],[65279,65279],[65529,65531],[69821,69821],[119155,119162],[917505,917505],[917536,917631]],"No":[[178,179],[185,185],[188,190],[2548,2553],[2930,2935],[3056,3058],[3192,3198],[3440,3445],[3882,3891],[4969,4988],[6128,6137],[6618,6618],[8304,8304],[8308,8313],[8320,8329],[8528,8543],[8585,8585],[9312,9371],[9450,9471],[10102,10131],[11517,11517],[12690,12693],[12832,12841],[12872,12879],[12881,12895],[12928,12937],[12977,12991],[43056,43061],[65799,65843],[65909,65912],[65930,65930],[66336,66339],[67672,67679],[67862,67867],[68160,68167],[68221,68222],[68440,68447],[68472,68479],[69216,69246],[69714,69733],[119648,119665],[127232,127242]],"Pf":[[187,187],[8217,8217],[8221,8221],[8250,8250],[11779,11779],[11781,11781],[11786,11786],[11789,11789],[11805,11805],[11809,11809]],"Lt":[[453,453],[456,456],[459,459],[498,498],[8072,8079],[8088,8095],[8104,8111],[8124,8124],[8140,8140],[8188,8188]],"Lm":[[688,705],[710,721],[736,740],[748,748],[750,750],[884,884],[890,890],[1369,1369],[1600,1600],[1765,1766],[2036,2037],[2042,2042],[2074,2074],[2084,2084],[2088,2088],[2417,2417],[3654,3654],[3782,3782],[4348,4348],[6103,6103],[6211,6211],[6823,6823],[7288,7293],[7468,7530],[7544,7544],[7579,7615],[8305,8305],[8319,8319],[8336,8348],[11388,11389],[11631,11631],[11823,11823],[12293,12293],[12337,12341],[12347,12347],[12445,12446],[12540,12542],[40981,40981],[42232,42237],[42508,42508],[42623,42623],[42775,42783],[42864,42864],[42888,42888],[43000,43001],[43471,43471],[43632,43632],[43741,43741],[43763,43764],[65392,65392],[65438,65439],[94099,94111]],"Mn":[[768,879],[1155,1159],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1552,1562],[1611,1631],[1648,1648],[1750,1756],[1759,1764],[1767,1768],[1770,1773],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2070,2073],[2075,2083],[2085,2087],[2089,2093],[2137,2139],[2276,2302],[2304,2306],[2362,2362],[2364,2364],[2369,2376],[2381,2381],[2385,2391],[2402,2403],[2433,2433],[2492,2492],[2497,2500],[2509,2509],[2530,2531],[2561,2562],[2620,2620],[2625,2626],[2631,2632],[2635,2637],[2641,2641],[2672,2673],[2677,2677],[2689,2690],[2748,2748],[2753,2757],[2759,2760],[2765,2765],[2786,2787],[2817,2817],[2876,2876],[2879,2879],[2881,2884],[2893,2893],[2902,2902],[2914,2915],[2946,2946],[3008,3008],[3021,3021],[3134,3136],[3142,3144],[3146,3149],[3157,3158],[3170,3171],[3260,3260],[3263,3263],[3270,3270],[3276,3277],[3298,3299],[3393,3396],[3405,3405],[3426,3427],[3530,3530],[3538,3540],[3542,3542],[3633,3633],[3636,3642],[3655,3662],[3761,3761],[3764,3769],[3771,3772],[3784,3789],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3953,3966],[3968,3972],[3974,3975],[3981,3991],[3993,4028],[4038,4038],[4141,4144],[4146,4151],[4153,4154],[4157,4158],[4184,4185],[4190,4192],[4209,4212],[4226,4226],[4229,4230],[4237,4237],[4253,4253],[4957,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6068,6069],[6071,6077],[6086,6086],[6089,6099],[6109,6109],[6155,6157],[6313,6313],[6432,6434],[6439,6440],[6450,6450],[6457,6459],[6679,6680],[6742,6742],[6744,6750],[6752,6752],[6754,6754],[6757,6764],[6771,6780],[6783,6783],[6912,6915],[6964,6964],[6966,6970],[6972,6972],[6978,6978],[7019,7027],[7040,7041],[7074,7077],[7080,7081],[7083,7083],[7142,7142],[7144,7145],[7149,7149],[7151,7153],[7212,7219],[7222,7223],[7376,7378],[7380,7392],[7394,7400],[7405,7405],[7412,7412],[7616,7654],[7676,7679],[8400,8412],[8417,8417],[8421,8432],[11503,11505],[11647,11647],[11744,11775],[12330,12333],[12441,12442],[42607,42607],[42612,42621],[42655,42655],[42736,42737],[43010,43010],[43014,43014],[43019,43019],[43045,43046],[43204,43204],[43232,43249],[43302,43309],[43335,43345],[43392,43394],[43443,43443],[43446,43449],[43452,43452],[43561,43566],[43569,43570],[43573,43574],[43587,43587],[43596,43596],[43696,43696],[43698,43700],[43703,43704],[43710,43711],[43713,43713],[43756,43757],[43766,43766],[44005,44005],[44008,44008],[44013,44013],[64286,64286],[65024,65039],[65056,65062],[66045,66045],[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[69633,69633],[69688,69702],[69760,69761],[69811,69814],[69817,69818],[69888,69890],[69927,69931],[69933,69940],[70016,70017],[70070,70078],[71339,71339],[71341,71341],[71344,71349],[71351,71351],[94095,94098],[119143,119145],[119163,119170],[119173,119179],[119210,119213],[119362,119364],[917760,917999]],"Me":[[1160,1161],[8413,8416],[8418,8420],[42608,42610]],"Mc":[[2307,2307],[2363,2363],[2366,2368],[2377,2380],[2382,2383],[2434,2435],[2494,2496],[2503,2504],[2507,2508],[2519,2519],[2563,2563],[2622,2624],[2691,2691],[2750,2752],[2761,2761],[2763,2764],[2818,2819],[2878,2878],[2880,2880],[2887,2888],[2891,2892],[2903,2903],[3006,3007],[3009,3010],[3014,3016],[3018,3020],[3031,3031],[3073,3075],[3137,3140],[3202,3203],[3262,3262],[3264,3268],[3271,3272],[3274,3275],[3285,3286],[3330,3331],[3390,3392],[3398,3400],[3402,3404],[3415,3415],[3458,3459],[3535,3537],[3544,3551],[3570,3571],[3902,3903],[3967,3967],[4139,4140],[4145,4145],[4152,4152],[4155,4156],[4182,4183],[4194,4196],[4199,4205],[4227,4228],[4231,4236],[4239,4239],[4250,4252],[6070,6070],[6078,6085],[6087,6088],[6435,6438],[6441,6443],[6448,6449],[6451,6456],[6576,6592],[6600,6601],[6681,6683],[6741,6741],[6743,6743],[6753,6753],[6755,6756],[6765,6770],[6916,6916],[6965,6965],[6971,6971],[6973,6977],[6979,6980],[7042,7042],[7073,7073],[7078,7079],[7082,7082],[7084,7085],[7143,7143],[7146,7148],[7150,7150],[7154,7155],[7204,7211],[7220,7221],[7393,7393],[7410,7411],[12334,12335],[43043,43044],[43047,43047],[43136,43137],[43188,43203],[43346,43347],[43395,43395],[43444,43445],[43450,43451],[43453,43456],[43567,43568],[43571,43572],[43597,43597],[43643,43643],[43755,43755],[43758,43759],[43765,43765],[44003,44004],[44006,44007],[44009,44010],[44012,44012],[69632,69632],[69634,69634],[69762,69762],[69808,69810],[69815,69816],[69932,69932],[70018,70018],[70067,70069],[70079,70080],[71340,71340],[71342,71343],[71350,71350],[94033,94078],[119141,119142],[119149,119154]],"Nl":[[5870,5872],[8544,8578],[8581,8584],[12295,12295],[12321,12329],[12344,12346],[42726,42735],[65856,65908],[66369,66369],[66378,66378],[66513,66517],[74752,74850]],"Zl":[[8232,8232]],"Zp":[[8233,8233]],"Cs":[[55296,55296],[56191,56192],[56319,56320],[57343,57343]],"Co":[[57344,57344],[63743,63743],[983040,983040],[1048573,1048573],[1048576,1048576],[1114109,1114109]]},"bidi_class":{"BN":[[0,8],[14,27],[127,132],[134,159],[173,173],[8203,8205],[8288,8292],[8298,8303],[65279,65279],[119155,119162],[917505,917505],[917536,917631]],"S":[[9,9],[11,11],[31,31]],"B":[[10,10],[13,13],[28,30],[133,133],[8233,8233]],"WS":[[12,12],[32,32],[5760,5760],[6158,6158],[8192,8202],[8232,8232],[8287,8287],[12288,12288]],"ON":[[33,34],[38,42],[59,64],[91,96],[123,126],[161,161],[166,169],[171,172],[174,175],[180,180],[182,184],[187,191],[215,215],[247,247],[697,698],[706,719],[722,735],[741,749],[751,767],[884,885],[894,894],[900,901],[903,903],[1014,1014],[1418,1418],[1542,1543],[1550,1551],[1758,1758],[1769,1769],[2038,2041],[3059,3064],[3066,3066],[3192,3198],[3898,3901],[5008,5017],[5120,5120],[5787,5788],[6128,6137],[6144,6154],[6464,6464],[6468,6469],[6622,6655],[8125,8125],[8127,8129],[8141,8143],[8157,8159],[8173,8175],[8189,8190],[8208,8231],[8245,8259],[8261,8286],[8316,8318],[8332,8334],[8448,8449],[8451,8454],[8456,8457],[8468,8468],[8470,8472],[8478,8483],[8485,8485],[8487,8487],[8489,8489],[8506,8507],[8512,8516],[8522,8525],[8528,8543],[8585,8585],[8592,8721],[8724,9013],[9083,9108],[9110,9203],[9216,9254],[9280,9290],[9312,9351],[9450,9899],[9901,9983],[9985,10239],[10496,11084],[11088,11097],[11493,11498],[11513,11519],[11776,11835],[11904,11929],[11931,12019],[12032,12245],[12272,12283],[12289,12292],[12296,12320],[12336,12336],[12342,12343],[12349,12351],[12443,12444],[12448,12448],[12539,12539],[12736,12771],[12829,12830],[12880,12895],[12924,12926],[12977,12991],[13004,13007],[13175,13178],[13278,13279],[13311,13311],[19904,19967],[42128,42182],[42509,42511],[42611,42611],[42622,42623],[42752,42785],[42888,42888],[43048,43051],[43124,43127],[64830,64831],[65021,65021],[65040,65049],[65072,65103],[65105,65105],[65108,65108],[65110,65118],[65120,65121],[65124,65126],[65128,65128],[65131,65131],[65281,65282],[65286,65290],[65307,65312],[65339,65344],[65371,65381],[65506,65508],[65512,65518],[65529,65533],[65793,65793],[65856,65930],[65936,65947],[67871,67871],[68409,68415],[69714,69733],[119296,119361],[119365,119365],[119552,119638],[120539,120539],[120597,120597],[120655,120655],[120713,120713],[120771,120771],[126704,126705],[126976,127019],[127024,127123],[127136,127150],[127153,127166],[127169,127183],[127185,127199],[127338,127339],[127744,127776],[127792,127797],[127799,127868],[127872,127891],[127904,127940],[127942,127946],[127968,127984],[128000,128062],[128064,128064],[128066,128247],[128249,128252],[128256,128317],[128320,128323],[128336,128359],[128507,128576],[128581,128591],[128640,128709],[128768,128883]],"ET":[[35,37],[162,165],[176,177],[1423,1423],[1545,1546],[1642,1642],[2546,2547],[2555,2555],[2801,2801],[3065,3065],[3647,3647],[6107,6107],[8240,8244],[8352,8378],[8494,8494],[8723,8723],[43064,43065],[65119,65119],[65129,65130],[65283,65285],[65504,65505],[65509,65510]],"ES":[[43,43],[45,45],[8314,8315],[8330,8331],[8722,8722],[64297,64297],[65122,65123],[65291,65291],[65293,65293]],"CS":[[44,44],[46,47],[58,58],[160,160],[1548,1548],[8239,8239],[8260,8260],[65104,65104],[65106,65106],[65109,65109],[65292,65292],[65294,65295],[65306,65306]],"EN":[[48,57],[178,179],[185,185],[1776,1785],[8304,8304],[8308,8313],[8320,8329],[9352,9371],[65296,65305],[120782,120831],[127232,127242]],"L":[[65,90],[97,122],[170,170],[181,181],[186,186],[192,214],[216,246],[248,696],[699,705],[720,721],[736,740],[750,750],[880,883],[886,887],[890,893],[902,902],[904,906],[908,908],[910,929],[931,1013],[1015,1154],[1162,1319],[1329,1366],[1369,1375],[1377,1415],[1417,1417],[2307,2361],[2363,2363],[2365,2368],[2377,2380],[2382,2384],[2392,2401],[2404,2423],[2425,2431],[2434,2435],[2437,2444],[2447,2448],[2451,2472],[2474,2480],[2482,2482],[2486,2489],[2493,2496],[2503,2504],[2507,2508],[2510,2510],[2519,2519],[2524,2525],[2527,2529],[2534,2545],[2548,2554],[2563,2563],[2565,2570],[2575,2576],[2579,2600],[2602,2608],[2610,2611],[2613,2614],[2616,2617],[2622,2624],[2649,2652],[2654,2654],[2662,2671],[2674,2676],[2691,2691],[2693,2701],[2703,2705],[2707,2728],[2730,2736],[2738,2739],[2741,2745],[2749,2752],[2761,2761],[2763,2764],[2768,2768],[2784,2785],[2790,2800],[2818,2819],[2821,2828],[2831,2832],[2835,2856],[2858,2864],[2866,2867],[2869,2873],[2877,2878],[2880,2880],[2887,2888],[2891,2892],[2903,2903],[2908,2909],[2911,2913],[2918,2935],[2947,2947],[2949,2954],[2958,2960],[2962,2965],[2969,2970],[2972,2972],[2974,2975],[2979,2980],[2984,2986],[2990,3001],[3006,3007],[3009,3010],[3014,3016],[3018,3020],[3024,3024],[3031,3031],[3046,3058],[3073,3075],[3077,3084],[3086,3088],[3090,3112],[3114,3123],[3125,3129],[3133,3133],[3137,3140],[3160,3161],[3168,3169],[3174,3183],[3199,3199],[3202,3203],[3205,3212],[3214,3216],[3218,3240],[3242,3251],[3253,3257],[3261,3268],[3270,3272],[3274,3275],[3285,3286],[3294,3294],[3296,3297],[3302,3311],[3313,3314],[3330,3331],[3333,3340],[3342,3344],[3346,3386],[3389,3392],[3398,3400],[3402,3404],[3406,3406],[3415,3415],[3424,3425],[3430,3445],[3449,3455],[3458,3459],[3461,3478],[3482,3505],[3507,3515],[3517,3517],[3520,3526],[3535,3537],[3544,3551],[3570,3572],[3585,3632],[3634,3635],[3648,3654],[3663,3675],[3713,3714],[3716,3716],[3719,3720],[3722,3722],[3725,3725],[3732,3735],[3737,3743],[3745,3747],[3749,3749],[3751,3751],[3754,3755],[3757,3760],[3762,3763],[3773,3773],[3776,3780],[3782,3782],[3792,3801],[3804,3807],[3840,3863],[3866,3892],[3894,3894],[3896,3896],[3902,3911],[3913,3948],[3967,3967],[3973,3973],[3976,3980],[4030,4037],[4039,4044],[4046,4058],[4096,4140],[4145,4145],[4152,4152],[4155,4156],[4159,4183],[4186,4189],[4193,4208],[4213,4225],[4227,4228],[4231,4236],[4238,4252],[4254,4293],[4295,4295],[4301,4301],[4304,4680],[4682,4685],[4688,4694],[4696,4696],[4698,4701],[4704,4744],[4746,4749],[4752,4784],[4786,4789],[4792,4798],[4800,4800],[4802,4805],[4808,4822],[4824,4880],[4882,4885],[4888,4954],[4960,4988],[4992,5007],[5024,5108],[5121,5759],[5761,5786],[5792,5872],[5888,5900],[5902,5905],[5920,5937],[5941,5942],[5952,5969],[5984,5996],[5998,6000],[6016,6067],[6070,6070],[6078,6085],[6087,6088],[6100,6106],[6108,6108],[6112,6121],[6160,6169],[6176,6263],[6272,6312],[6314,6314],[6320,6389],[6400,6428],[6435,6438],[6441,6443],[6448,6449],[6451,6456],[6470,6509],[6512,6516],[6528,6571],[6576,6601],[6608,6618],[6656,6678],[6681,6683],[6686,6741],[6743,6743],[6753,6753],[6755,6756],[6765,6770],[6784,6793],[6800,6809],[6816,6829],[6916,6963],[6965,6965],[6971,6971],[6973,6977],[6979,6987],[6992,7018],[7028,7036],[7042,7073],[7078,7079],[7082,7082],[7084,7141],[7143,7143],[7146,7148],[7150,7150],[7154,7155],[7164,7211],[7220,7221],[7227,7241],[7245,7295],[7360,7367],[7379,7379],[7393,7393],[7401,7404],[7406,7411],[7413,7414],[7424,7615],[7680,7957],[7960,7965],[7968,8005],[8008,8013],[8016,8023],[8025,8025],[8027,8027],[8029,8029],[8031,8061],[8064,8116],[8118,8124],[8126,8126],[8130,8132],[8134,8140],[8144,8147],[8150,8155],[8160,8172],[8178,8180],[8182,8188],[8206,8206],[8305,8305],[8319,8319],[8336,8348],[8450,8450],[8455,8455],[8458,8467],[8469,8469],[8473,8477],[8484,8484],[8486,8486],[8488,8488],[8490,8493],[8495,8505],[8508,8511],[8517,8521],[8526,8527],[8544,8584],[9014,9082],[9109,9109],[9372,9449],[9900,9900],[10240,10495],[11264,11310],[11312,11358],[11360,11492],[11499,11502],[11506,11507],[11520,11557],[11559,11559],[11565,11565],[11568,11623],[11631,11632],[11648,11670],[11680,11686],[11688,11694],[11696,11702],[11704,11710],[11712,11718],[11720,11726],[11728,11734],[11736,11742],[12293,12295],[12321,12329],[12334,12335],[12337,12341],[12344,12348],[12353,12438],[12445,12447],[12449,12538],[12540,12543],[12549,12589],[12593,12686],[12688,12730],[12784,12828],[12832,12879],[12896,12923],[12927,12976],[12992,13003],[13008,13054],[13056,13174],[13179,13277],[13280,13310],[13312,13312],[19893,19893],[19968,19968],[40908,40908],[40960,42124],[42192,42508],[42512,42539],[42560,42606],[42624,42647],[42656,42735],[42738,42743],[42786,42887],[42889,42894],[42896,42899],[42912,42922],[43000,43009],[43011,43013],[43015,43018],[43020,43044],[43047,43047],[43056,43063],[43072,43123],[43136,43203],[43214,43225],[43250,43259],[43264,43301],[43310,43334],[43346,43347],[43359,43388],[43395,43442],[43444,43445],[43450,43451],[43453,43469],[43471,43481],[43486,43487],[43520,43560],[43567,43568],[43571,43572],[43584,43586],[43588,43595],[43597,43597],[43600,43609],[43612,43643],[43648,43695],[43697,43697],[43701,43702],[43705,43709],[43712,43712],[43714,43714],[43739,43755],[43758,43765],[43777,43782],[43785,43790],[43793,43798],[43808,43814],[43816,43822],[43968,44004],[44006,44007],[44009,44012],[44016,44025],[44032,44032],[55203,55203],[55216,55238],[55243,55291],[55296,55296],[56191,56192],[56319,56320],[57343,57344],[63743,64109],[64112,64217],[64256,64262],[64275,64279],[65313,65338],[65345,65370],[65382,65470],[65474,65479],[65482,65487],[65490,65495],[65498,65500],[65536,65547],[65549,65574],[65576,65594],[65596,65597],[65599,65613],[65616,65629],[65664,65786],[65792,65792],[65794,65794],[65799,65843],[65847,65855],[66000,66044],[66176,66204],[66208,66256],[66304,66334],[66336,66339],[66352,66378],[66432,66461],[66463,66499],[66504,66517],[66560,66717],[66720,66729],[69632,69632],[69634,69687],[69703,69709],[69734,69743],[69762,69810],[69815,69816],[69819,69825],[69840,69864],[69872,69881],[69891,69926],[69932,69932],[69942,69955],[70018,70069],[70079,70088],[70096,70105],[71296,71338],[71340,71340],[71342,71343],[71350,71350],[71360,71369],[73728,74606],[74752,74850],[74864,74867],[77824,78894],[92160,92728],[93952,94020],[94032,94078],[94099,94111],[110592,110593],[118784,119029],[119040,119078],[119081,119142],[119146,119154],[119171,119172],[119180,119209],[119214,119261],[119648,119665],[119808,119892],[119894,119964],[119966,119967],[119970,119970],[119973,119974],[119977,119980],[119982,119993],[119995,119995],[119997,120003],[120005,120069],[120071,120074],[120077,120084],[120086,120092],[120094,120121],[120123,120126],[120128,120132],[120134,120134],[120138,120144],[120146,120485],[120488,120538],[120540,120596],[120598,120654],[120656,120712],[120714,120770],[120772,120779],[127248,127278],[127280,127337],[127344,127386],[127462,127490],[127504,127546],[127552,127560],[127568,127569],[131072,131072],[173782,173782],[173824,173824],[177972,177972],[177984,177984],[178205,178205],[194560,195101],[983040,983040],[1048573,1048573],[1048576,1048576],[1114109,1114109]],"NSM":[[768,879],[1155,1161],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1552,1562],[1611,1631],[1648,1648],[1750,1756],[1759,1764],[1767,1768],[1770,1773],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2070,2073],[2075,2083],[2085,2087],[2089,2093],[2137,2139],[2276,2302],[2304,2306],[2362,2362],[2364,2364],[2369,2376],[2381,2381],[2385,2391],[2402,2403],[2433,2433],[2492,2492],[2497,2500],[2509,2509],[2530,2531],[2561,2562],[2620,2620],[2625,2626],[2631,2632],[2635,2637],[2641,2641],[2672,2673],[2677,2677],[2689,2690],[2748,2748],[2753,2757],[2759,2760],[2765,2765],[2786,2787],[2817,2817],[2876,2876],[2879,2879],[2881,2884],[2893,2893],[2902,2902],[2914,2915],[2946,2946],[3008,3008],[3021,3021],[3134,3136],[3142,3144],[3146,3149],[3157,3158],[3170,3171],[3260,3260],[3276,3277],[3298,3299],[3393,3396],[3405,3405],[3426,3427],[3530,3530],[3538,3540],[3542,3542],[3633,3633],[3636,3642],[3655,3662],[3761,3761],[3764,3769],[3771,3772],[3784,3789],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3953,3966],[3968,3972],[3974,3975],[3981,3991],[3993,4028],[4038,4038],[4141,4144],[4146,4151],[4153,4154],[4157,4158],[4184,4185],[4190,4192],[4209,4212],[4226,4226],[4229,4230],[4237,4237],[4253,4253],[4957,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6068,6069],[6071,6077],[6086,6086],[6089,6099],[6109,6109],[6155,6157],[6313,6313],[6432,6434],[6439,6440],[6450,6450],[6457,6459],[6679,6680],[6742,6742],[6744,6750],[6752,6752],[6754,6754],[6757,6764],[6771,6780],[6783,6783],[6912,6915],[6964,6964],[6966,6970],[6972,6972],[6978,6978],[7019,7027],[7040,7041],[7074,7077],[7080,7081],[7083,7083],[7142,7142],[7144,7145],[7149,7149],[7151,7153],[7212,7219],[7222,7223],[7376,7378],[7380,7392],[7394,7400],[7405,7405],[7412,7412],[7616,7654],[7676,7679],[8400,8432],[11503,11505],[11647,11647],[11744,11775],[12330,12333],[12441,12442],[42607,42610],[42612,42621],[42655,42655],[42736,42737],[43010,43010],[43014,43014],[43019,43019],[43045,43046],[43204,43204],[43232,43249],[43302,43309],[43335,43345],[43392,43394],[43443,43443],[43446,43449],[43452,43452],[43561,43566],[43569,43570],[43573,43574],[43587,43587],[43596,43596],[43696,43696],[43698,43700],[43703,43704],[43710,43711],[43713,43713],[43756,43757],[43766,43766],[44005,44005],[44008,44008],[44013,44013],[64286,64286],[65024,65039],[65056,65062],[66045,66045],[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[69633,69633],[69688,69702],[69760,69761],[69811,69814],[69817,69818],[69888,69890],[69927,69931],[69933,69940],[70016,70017],[70070,70078],[71339,71339],[71341,71341],[71344,71349],[71351,71351],[94095,94098],[119143,119145],[119163,119170],[119173,119179],[119210,119213],[119362,119364],[917760,917999]],"R":[[1470,1470],[1472,1472],[1475,1475],[1478,1478],[1488,1514],[1520,1524],[1984,2026],[2036,2037],[2042,2042],[2048,2069],[2074,2074],[2084,2084],[2088,2088],[2096,2110],[2112,2136],[2142,2142],[8207,8207],[64285,64285],[64287,64296],[64298,64310],[64312,64316],[64318,64318],[64320,64321],[64323,64324],[64326,64335],[67584,67589],[67592,67592],[67594,67637],[67639,67640],[67644,67644],[67647,67669],[67671,67679],[67840,67867],[67872,67897],[67903,67903],[67968,68023],[68030,68031],[68096,68096],[68112,68115],[68117,68119],[68121,68147],[68160,68167],[68176,68184],[68192,68223],[68352,68405],[68416,68437],[68440,68466],[68472,68479],[68608,68680]],"AN":[[1536,1540],[1632,1641],[1643,1644],[1757,1757],[69216,69246]],"AL":[[1544,1544],[1547,1547],[1549,1549],[1563,1563],[1566,1610],[1645,1647],[1649,1749],[1765,1766],[1774,1775],[1786,1805],[1807,1808],[1810,1839],[1869,1957],[1969,1969],[2208,2208],[2210,2220],[64336,64449],[64467,64829],[64848,64911],[64914,64967],[65008,65020],[65136,65140],[65142,65276],[126464,126467],[126469,126495],[126497,126498],[126500,126500],[126503,126503],[126505,126514],[126516,126519],[126521,126521],[126523,126523],[126530,126530],[126535,126535],[126537,126537],[126539,126539],[126541,126543],[126545,126546],[126548,126548],[126551,126551],[126553,126553],[126555,126555],[126557,126557],[126559,126559],[126561,126562],[126564,126564],[126567,126570],[126572,126578],[126580,126583],[126585,126588],[126590,126590],[126592,126601],[126603,126619],[126625,126627],[126629,126633],[126635,126651]],"LRE":[[8234,8234]],"RLE":[[8235,8235]],"PDF":[[8236,8236]],"LRO":[[8237,8237]],"RLO":[[8238,8238]]},"bidi_mirrored":{"N":[[0,39],[42,59],[61,61],[63,90],[92,92],[94,122],[124,124],[126,170],[172,186],[188,887],[890,894],[900,906],[908,908],[910,929],[931,1319],[1329,1366],[1369,1375],[1377,1415],[1417,1418],[1423,1423],[1425,1479],[1488,1514],[1520,1524],[1536,1540],[1542,1563],[1566,1805],[1807,1866],[1869,1969],[1984,2042],[2048,2093],[2096,2110],[2112,2139],[2142,2142],[2208,2208],[2210,2220],[2276,2302],[2304,2423],[2425,2431],[2433,2435],[2437,2444],[2447,2448],[2451,2472],[2474,2480],[2482,2482],[2486,2489],[2492,2500],[2503,2504],[2507,2510],[2519,2519],[2524,2525],[2527,2531],[2534,2555],[2561,2563],[2565,2570],[2575,2576],[2579,2600],[2602,2608],[2610,2611],[2613,2614],[2616,2617],[2620,2620],[2622,2626],[2631,2632],[2635,2637],[2641,2641],[2649,2652],[2654,2654],[2662,2677],[2689,2691],[2693,2701],[2703,2705],[2707,2728],[2730,2736],[2738,2739],[2741,2745],[2748,2757],[2759,2761],[2763,2765],[2768,2768],[2784,2787],[2790,2801],[2817,2819],[2821,2828],[2831,2832],[2835,2856],[2858,2864],[2866,2867],[2869,2873],[2876,2884],[2887,2888],[2891,2893],[2902,2903],[2908,2909],[2911,2915],[2918,2935],[2946,2947],[2949,2954],[2958,2960],[2962,2965],[2969,2970],[2972,2972],[2974,2975],[2979,2980],[2984,2986],[2990,3001],[3006,3010],[3014,3016],[3018,3021],[3024,3024],[3031,3031],[3046,3066],[3073,3075],[3077,3084],[3086,3088],[3090,3112],[3114,3123],[3125,3129],[3133,3140],[3142,3144],[3146,3149],[3157,3158],[3160,3161],[3168,3171],[3174,3183],[3192,3199],[3202,3203],[3205,3212],[3214,3216],[3218,3240],[3242,3251],[3253,3257],[3260,3268],[3270,3272],[3274,3277],[3285,3286],[3294,3294],[3296,3299],[3302,3311],[3313,3314],[3330,3331],[3333,3340],[3342,3344],[3346,3386],[3389,3396],[3398,3400],[3402,3406],[3415,3415],[3424,3427],[3430,3445],[3449,3455],[3458,3459],[3461,3478],[3482,3505],[3507,3515],[3517,3517],[3520,3526],[3530,3530],[3535,3540],[3542,3542],[3544,3551],[3570,3572],[3585,3642],[3647,3675],[3713,3714],[3716,3716],[3719,3720],[3722,3722],[3725,3725],[3732,3735],[3737,3743],[3745,3747],[3749,3749],[3751,3751],[3754,3755],[3757,3769],[3771,3773],[3776,3780],[3782,3782],[3784,3789],[3792,3801],[3804,3807],[3840,3897],[3902,3911],[3913,3948],[3953,3991],[3993,4028],[4030,4044],[4046,4058],[4096,4293],[4295,4295],[4301,4301],[4304,4680],[4682,4685],[4688,4694],[4696,4696],[4698,4701],[4704,4744],[4746,4749],[4752,4784],[4786,4789],[4792,4798],[4800,4800],[4802,4805],[4808,4822],[4824,4880],[4882,4885],[4888,4954],[4957,4988],[4992,5017],[5024,5108],[5120,5786],[5792,5872],[5888,5900],[5902,5908],[5920,5942],[5952,5971],[5984,5996],[5998,6000],[6002,6003],[6016,6109],[6112,6121],[6128,6137],[6144,6158],[6160,6169],[6176,6263],[6272,6314],[6320,6389],[6400,6428],[6432,6443],[6448,6459],[6464,6464],[6468,6509],[6512,6516],[6528,6571],[6576,6601],[6608,6618],[6622,6683],[6686,6750],[6752,6780],[6783,6793],[6800,6809],[6816,6829],[6912,6987],[6992,7036],[7040,7155],[7164,7223],[7227,7241],[7245,7295],[7360,7367],[7376,7414],[7424,7654],[7676,7957],[7960,7965],[7968,8005],[8008,8013],[8016,8023],[8025,8025],[8027,8027],[8029,8029],[8031,8061],[8064,8116],[8118,8132],[8134,8147],[8150,8155],[8157,8175],[8178,8180],[8182,8190],[8192,8248],[8251,8260],[8263,8292],[8298,8305],[8308,8316],[8319,8332],[8336,8348],[8352,8378],[8400,8432],[8448,8511],[8513,8585],[8592,8704],[8709,8711],[8718,8720],[8722,8724],[8727,8729],[8734,8734],[8739,8739],[8741,8741],[8743,8746],[8756,8760],[8762,8762],[8781,8785],[8790,8798],[8801,8801],[8803,8803],[8812,8813],[8845,8846],[8851,8855],[8857,8865],[8868,8869],[8889,8893],[8896,8904],[8910,8911],[8914,8917],[8942,8943],[8960,8967],[8972,8991],[8994,9000],[9003,9203],[9216,9254],[9280,9290],[9312,9983],[9985,10087],[10102,10175],[10177,10178],[10183,10183],[10186,10186],[10190,10194],[10199,10203],[10207,10209],[10224,10626],[10649,10650],[10672,10679],[10681,10687],[10694,10696],[10698,10701],[10707,10707],[10710,10711],[10717,10720],[10722,10722],[10726,10727],[10730,10739],[10746,10747],[10750,10761],[10781,10781],[10786,10787],[10789,10789],[10791,10792],[10794,10794],[10799,10803],[10806,10811],[10815,10838],[10841,10851],[10854,10857],[10862,10862],[10865,10866],[10869,10872],[10916,10917],[10926,10926],[10967,10971],[10973,10973],[10975,10977],[10983,10987],[10991,10994],[10996,10998],[11004,11004],[11006,11084],[11088,11097],[11264,11310],[11312,11358],[11360,11507],[11513,11557],[11559,11559],[11565,11565],[11568,11623],[11631,11632],[11647,11670],[11680,11686],[11688,11694],[11696,11702],[11704,11710],[11712,11718],[11720,11726],[11728,11734],[11736,11742],[11744,11777],[11782,11784],[11787,11787],[11790,11803],[11806,11807],[11818,11835],[11904,11929],[11931,12019],[12032,12245],[12272,12283],[12288,12295],[12306,12307],[12316,12351],[12353,12438],[12441,12543],[12549,12589],[12593,12686],[12688,12730],[12736,12771],[12784,12830],[12832,13054],[13056,13312],[19893,19893],[19904,19968],[40908,40908],[40960,42124],[42128,42182],[42192,42539],[42560,42647],[42655,42743],[42752,42894],[42896,42899],[42912,42922],[43000,43051],[43056,43065],[43072,43127],[43136,43204],[43214,43225],[43232,43259],[43264,43347],[43359,43388],[43392,43469],[43471,43481],[43486,43487],[43520,43574],[43584,43597],[43600,43609],[43612,43643],[43648,43714],[43739,43766],[43777,43782],[43785,43790],[43793,43798],[43808,43814],[43816,43822],[43968,44013],[44016,44025],[44032,44032],[55203,55203],[55216,55238],[55243,55291],[55296,55296],[56191,56192],[56319,56320],[57343,57344],[63743,64109],[64112,64217],[64256,64262],[64275,64279],[64285,64310],[64312,64316],[64318,64318],[64320,64321],[64323,64324],[64326,64449],[64467,64831],[64848,64911],[64914,64967],[65008,65021],[65024,65049],[65056,65062],[65072,65106],[65108,65112],[65119,65123],[65126,65126],[65128,65131],[65136,65140],[65142,65276],[65279,65279],[65281,65287],[65290,65307],[65309,65309],[65311,65338],[65340,65340],[65342,65370],[65372,65372],[65374,65374],[65377,65377],[65380,65470],[65474,65479],[65482,65487],[65490,65495],[65498,65500],[65504,65510],[65512,65518],[65529,65533],[65536,65547],[65549,65574],[65576,65594],[65596,65597],[65599,65613],[65616,65629],[65664,65786],[65792,65794],[65799,65843],[65847,65930],[65936,65947],[66000,66045],[66176,66204],[66208,66256],[66304,66334],[66336,66339],[66352,66378],[66432,66461],[66463,66499],[66504,66517],[66560,66717],[66720,66729],[67584,67589],[67592,67592],[67594,67637],[67639,67640],[67644,67644],[67647,67669],[67671,67679],[67840,67867],[67871,67897],[67903,67903],[67968,68023],[68030,68031],[68096,68099],[68101,68102],[68108,68115],[68117,68119],[68121,68147],[68152,68154],[68159,68167],[68176,68184],[68192,68223],[68352,68405],[68409,68437],[68440,68466],[68472,68479],[68608,68680],[69216,69246],[69632,69709],[69714,69743],[69760,69825],[69840,69864],[69872,69881],[69888,69940],[69942,69955],[70016,70088],[70096,70105],[71296,71351],[71360,71369],[73728,74606],[74752,74850],[74864,74867],[77824,78894],[92160,92728],[93952,94020],[94032,94078],[94095,94111],[110592,110593],[118784,119029],[119040,119078],[119081,119261],[119296,119365],[119552,119638],[119648,119665],[119808,119892],[119894,119964],[119966,119967],[119970,119970],[119973,119974],[119977,119980],[119982,119993],[119995,119995],[119997,120003],[120005,120069],[120071,120074],[120077,120084],[120086,120092],[120094,120121],[120123,120126],[120128,120132],[120134,120134],[120138,120144],[120146,120485],[120488,120538],[120540,120596],[120598,120654],[120656,120712],[120714,120770],[120772,120779],[120782,120831],[126464,126467],[126469,126495],[126497,126498],[126500,126500],[126503,126503],[126505,126514],[126516,126519],[126521,126521],[126523,126523],[126530,126530],[126535,126535],[126537,126537],[126539,126539],[126541,126543],[126545,126546],[126548,126548],[126551,126551],[126553,126553],[126555,126555],[126557,126557],[126559,126559],[126561,126562],[126564,126564],[126567,126570],[126572,126578],[126580,126583],[126585,126588],[126590,126590],[126592,126601],[126603,126619],[126625,126627],[126629,126633],[126635,126651],[126704,126705],[126976,127019],[127024,127123],[127136,127150],[127153,127166],[127169,127183],[127185,127199],[127232,127242],[127248,127278],[127280,127339],[127344,127386],[127462,127490],[127504,127546],[127552,127560],[127568,127569],[127744,127776],[127792,127797],[127799,127868],[127872,127891],[127904,127940],[127942,127946],[127968,127984],[128000,128062],[128064,128064],[128066,128247],[128249,128252],[128256,128317],[128320,128323],[128336,128359],[128507,128576],[128581,128591],[128640,128709],[128768,128883],[131072,131072],[173782,173782],[173824,173824],[177972,177972],[177984,177984],[178205,178205],[194560,195101],[917505,917505],[917536,917631],[917760,917999],[983040,983040],[1048573,1048573],[1048576,1048576],[1114109,1114109]],"Y":[[40,41],[60,60],[62,62],[91,91],[93,93],[123,123],[125,125],[171,171],[187,187],[3898,3901],[5787,5788],[8249,8250],[8261,8262],[8317,8318],[8333,8334],[8512,8512],[8705,8708],[8712,8717],[8721,8721],[8725,8726],[8730,8733],[8735,8738],[8740,8740],[8742,8742],[8747,8755],[8761,8761],[8763,8780],[8786,8789],[8799,8800],[8802,8802],[8804,8811],[8814,8844],[8847,8850],[8856,8856],[8866,8867],[8870,8888],[8894,8895],[8905,8909],[8912,8913],[8918,8941],[8944,8959],[8968,8971],[8992,8993],[9001,9002],[10088,10101],[10176,10176],[10179,10182],[10184,10185],[10187,10189],[10195,10198],[10204,10206],[10210,10223],[10627,10648],[10651,10671],[10680,10680],[10688,10693],[10697,10697],[10702,10706],[10708,10709],[10712,10716],[10721,10721],[10723,10725],[10728,10729],[10740,10745],[10748,10749],[10762,10780],[10782,10785],[10788,10788],[10790,10790],[10793,10793],[10795,10798],[10804,10805],[10812,10814],[10839,10840],[10852,10853],[10858,10861],[10863,10864],[10867,10868],[10873,10915],[10918,10925],[10927,10966],[10972,10972],[10974,10974],[10978,10982],[10988,10990],[10995,10995],[10999,11003],[11005,11005],[11778,11781],[11785,11786],[11788,11789],[11804,11805],[11808,11817],[12296,12305],[12308,12315],[65113,65118],[65124,65125],[65288,65289],[65308,65308],[65310,65310],[65339,65339],[65341,65341],[65371,65371],[65373,65373],[65375,65376],[65378,65379],[120539,120539],[120597,120597],[120655,120655],[120713,120713],[120771,120771]]}};

    CodePoint.get_index = function(index_name) {
      var index_data, index_data_formatted, k, range, v, _i, _len, _ref;
      if (this.index_cache[index_name] != null) {
        return this.index_cache[index_name];
      }
      index_data = this.index_data[index_name];
      index_data_formatted = {};
      for (k in index_data) {
        v = index_data[k];
        index_data_formatted[k] = [];
        _ref = index_data[k];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          range = _ref[_i];
          index_data_formatted[k].push(new TwitterCldr.Range(range[0], range[1]));
        }
      }
      return this.index_cache[index_name] = index_data_formatted;
    };

    CodePoint.property_data = {"line_break":{"CM":[[0,8],[14,31],[127,132],[134,159],[768,846],[848,859],[867,879],[1155,1161],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1552,1562],[1564,1564],[1611,1631],[1648,1648],[1750,1756],[1759,1764],[1767,1768],[1770,1773],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2070,2073],[2075,2083],[2085,2087],[2089,2093],[2137,2139],[2276,2302],[2304,2307],[2362,2364],[2366,2383],[2385,2391],[2402,2403],[2433,2435],[2492,2492],[2494,2500],[2503,2504],[2507,2509],[2519,2519],[2530,2531],[2561,2563],[2620,2620],[2622,2626],[2631,2632],[2635,2637],[2641,2641],[2672,2673],[2677,2677],[2689,2691],[2748,2748],[2750,2757],[2759,2761],[2763,2765],[2786,2787],[2817,2819],[2876,2876],[2878,2884],[2887,2888],[2891,2893],[2902,2903],[2914,2915],[2946,2946],[3006,3010],[3014,3016],[3018,3021],[3031,3031],[3073,3075],[3134,3140],[3142,3144],[3146,3149],[3157,3158],[3170,3171],[3202,3203],[3260,3260],[3262,3268],[3270,3272],[3274,3277],[3285,3286],[3298,3299],[3330,3331],[3390,3396],[3398,3400],[3402,3405],[3415,3415],[3426,3427],[3458,3459],[3530,3530],[3535,3540],[3542,3542],[3544,3551],[3570,3571],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3902,3903],[3953,3966],[3968,3972],[3974,3975],[3981,3991],[3993,4028],[4038,4038],[4957,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6155,6157],[6313,6313],[6432,6443],[6448,6459],[6679,6683],[6783,6783],[6912,6916],[6964,6980],[7019,7027],[7040,7042],[7073,7085],[7142,7155],[7204,7223],[7376,7378],[7380,7400],[7405,7405],[7410,7412],[7616,7654],[7676,7679],[8204,8207],[8234,8238],[8294,8303],[8400,8432],[11503,11505],[11647,11647],[11744,11775],[12330,12335],[12341,12341],[12441,12442],[42607,42610],[42612,42621],[42655,42655],[42736,42737],[43010,43010],[43014,43014],[43019,43019],[43043,43047],[43136,43137],[43188,43204],[43232,43249],[43302,43309],[43335,43347],[43392,43395],[43443,43456],[43561,43574],[43587,43587],[43596,43597],[43755,43759],[43765,43766],[44003,44010],[44012,44013],[64286,64286],[65024,65039],[65056,65062],[65529,65531],[66045,66045],[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[69632,69634],[69688,69702],[69760,69762],[69808,69818],[69888,69890],[69927,69940],[70016,70018],[70067,70080],[71339,71351],[94033,94078],[94095,94098],[119141,119145],[119149,119170],[119173,119179],[119210,119213],[119362,119364],[917505,917505],[917536,917631],[917760,917999]],"BA":[[9,9],[124,124],[173,173],[1418,1418],[1470,1470],[2404,2405],[3674,3675],[3851,3851],[3892,3892],[3967,3967],[3973,3973],[4030,4031],[4050,4050],[4170,4171],[4961,4961],[5120,5120],[5760,5760],[5867,5869],[5941,5942],[6100,6101],[6104,6104],[6106,6106],[6148,6149],[7002,7003],[7005,7008],[7227,7231],[7294,7295],[8192,8198],[8200,8202],[8208,8208],[8210,8211],[8231,8231],[8278,8278],[8280,8283],[8285,8287],[11514,11516],[11519,11519],[11632,11632],[11790,11797],[11799,11799],[11801,11801],[11818,11821],[11824,11825],[11827,11828],[12288,12288],[42238,42239],[42509,42509],[42511,42511],[42739,42743],[43214,43215],[43310,43311],[43463,43465],[43613,43615],[43760,43761],[44011,44011],[65792,65794],[66463,66463],[66512,66512],[67671,67671],[67871,67871],[68176,68183],[68409,68415],[69703,69704],[69822,69825],[69952,69955],[70085,70086],[70088,70088],[74864,74867]],"LF":[[10,10]],"BK":[[11,12],[8232,8233]],"CR":[[13,13]],"SP":[[32,32]],"EX":[[33,33],[63,63],[1478,1478],[1563,1563],[1566,1567],[1748,1748],[2041,2041],[3853,3857],[3860,3860],[6146,6147],[6152,6153],[6468,6469],[10082,10083],[11513,11513],[11518,11518],[11822,11822],[42510,42510],[43126,43127],[65045,65046],[65110,65111],[65281,65281],[65311,65311]],"QU":[[34,34],[39,39],[171,171],[187,187],[8216,8217],[8219,8221],[8223,8223],[8249,8250],[10075,10078],[11776,11789],[11804,11805],[11808,11809]],"AL":[[35,35],[38,38],[42,42],[60,62],[64,90],[94,122],[126,126],[166,166],[169,169],[172,172],[174,175],[181,181],[192,214],[216,246],[248,710],[718,719],[721,727],[732,732],[734,734],[736,767],[880,887],[890,893],[900,906],[908,908],[910,929],[931,1154],[1162,1319],[1329,1366],[1369,1375],[1377,1415],[1472,1472],[1475,1475],[1523,1524],[1536,1540],[1542,1544],[1550,1551],[1568,1610],[1645,1647],[1649,1747],[1749,1749],[1757,1758],[1765,1766],[1769,1769],[1774,1775],[1786,1805],[1807,1808],[1810,1839],[1869,1957],[1969,1969],[1994,2026],[2036,2039],[2042,2042],[2048,2069],[2074,2074],[2084,2084],[2088,2088],[2096,2110],[2112,2136],[2142,2142],[2208,2208],[2210,2220],[2308,2361],[2365,2365],[2384,2384],[2392,2401],[2416,2423],[2425,2431],[2437,2444],[2447,2448],[2451,2472],[2474,2480],[2482,2482],[2486,2489],[2493,2493],[2510,2510],[2524,2525],[2527,2529],[2544,2545],[2548,2552],[2554,2554],[2565,2570],[2575,2576],[2579,2600],[2602,2608],[2610,2611],[2613,2614],[2616,2617],[2649,2652],[2654,2654],[2674,2676],[2693,2701],[2703,2705],[2707,2728],[2730,2736],[2738,2739],[2741,2745],[2749,2749],[2768,2768],[2784,2785],[2800,2800],[2821,2828],[2831,2832],[2835,2856],[2858,2864],[2866,2867],[2869,2873],[2877,2877],[2908,2909],[2911,2913],[2928,2935],[2947,2947],[2949,2954],[2958,2960],[2962,2965],[2969,2970],[2972,2972],[2974,2975],[2979,2980],[2984,2986],[2990,3001],[3024,3024],[3056,3064],[3066,3066],[3077,3084],[3086,3088],[3090,3112],[3114,3123],[3125,3129],[3133,3133],[3160,3161],[3168,3169],[3192,3199],[3205,3212],[3214,3216],[3218,3240],[3242,3251],[3253,3257],[3261,3261],[3294,3294],[3296,3297],[3313,3314],[3333,3340],[3342,3344],[3346,3386],[3389,3389],[3406,3406],[3424,3425],[3440,3445],[3450,3455],[3461,3478],[3482,3505],[3507,3515],[3517,3517],[3520,3526],[3572,3572],[3663,3663],[3840,3840],[3845,3845],[3859,3859],[3861,3863],[3866,3871],[3882,3891],[3894,3894],[3896,3896],[3904,3911],[3913,3948],[3976,3980],[4032,4037],[4039,4044],[4046,4047],[4052,4056],[4172,4175],[4256,4293],[4295,4295],[4301,4301],[4304,4351],[4608,4680],[4682,4685],[4688,4694],[4696,4696],[4698,4701],[4704,4744],[4746,4749],[4752,4784],[4786,4789],[4792,4798],[4800,4800],[4802,4805],[4808,4822],[4824,4880],[4882,4885],[4888,4954],[4960,4960],[4962,4988],[4992,5017],[5024,5108],[5121,5759],[5761,5786],[5792,5866],[5870,5872],[5888,5900],[5902,5905],[5920,5937],[5952,5969],[5984,5996],[5998,6000],[6105,6105],[6128,6137],[6144,6145],[6151,6151],[6154,6154],[6176,6263],[6272,6312],[6314,6314],[6320,6389],[6400,6428],[6464,6464],[6624,6678],[6686,6687],[6917,6963],[6981,6987],[7004,7004],[7009,7018],[7028,7036],[7043,7072],[7086,7087],[7098,7141],[7164,7203],[7245,7247],[7258,7293],[7360,7367],[7379,7379],[7401,7404],[7406,7409],[7413,7414],[7424,7615],[7680,7957],[7960,7965],[7968,8005],[8008,8013],[8016,8023],[8025,8025],[8027,8027],[8029,8029],[8031,8061],[8064,8116],[8118,8132],[8134,8147],[8150,8155],[8157,8175],[8178,8180],[8182,8188],[8190,8190],[8215,8215],[8226,8227],[8248,8248],[8254,8259],[8266,8277],[8279,8279],[8284,8284],[8289,8292],[8304,8305],[8309,8316],[8320,8320],[8325,8332],[8336,8348],[8448,8450],[8452,8452],[8454,8456],[8458,8466],[8468,8469],[8471,8480],[8483,8490],[8492,8531],[8534,8538],[8540,8541],[8543,8543],[8556,8559],[8570,8584],[8602,8657],[8659,8659],[8661,8703],[8705,8705],[8708,8710],[8713,8714],[8716,8718],[8720,8720],[8724,8724],[8726,8729],[8731,8732],[8737,8738],[8740,8740],[8742,8742],[8749,8749],[8751,8755],[8760,8763],[8766,8775],[8777,8779],[8781,8785],[8787,8799],[8802,8803],[8808,8809],[8812,8813],[8816,8833],[8836,8837],[8840,8852],[8854,8856],[8858,8868],[8870,8894],[8896,8977],[8979,8985],[8988,9000],[9003,9199],[9216,9254],[9280,9290],[9471,9471],[9548,9551],[9589,9599],[9616,9617],[9622,9631],[9634,9634],[9642,9649],[9652,9653],[9656,9659],[9662,9663],[9666,9669],[9673,9674],[9676,9677],[9682,9697],[9702,9710],[9712,9727],[9732,9732],[9735,9736],[9738,9741],[9744,9747],[9753,9753],[9760,9784],[9788,9791],[9793,9793],[9795,9823],[9826,9826],[9830,9830],[9835,9835],[9838,9838],[9840,9854],[9856,9885],[9888,9916],[9934,9934],[9954,9954],[9956,9959],[9989,9991],[9998,10070],[10072,10074],[10079,10081],[10084,10087],[10132,10180],[10183,10213],[10224,10626],[10649,10711],[10716,10747],[10750,11084],[11088,11092],[11264,11310],[11312,11358],[11360,11502],[11506,11507],[11517,11517],[11520,11557],[11559,11559],[11565,11565],[11568,11623],[11631,11631],[11648,11670],[11680,11686],[11688,11694],[11696,11702],[11704,11710],[11712,11718],[11720,11726],[11728,11734],[11736,11742],[11798,11798],[11802,11803],[11806,11807],[11823,11823],[11826,11826],[11829,11833],[19904,19967],[42192,42237],[42240,42508],[42512,42527],[42538,42539],[42560,42606],[42611,42611],[42622,42647],[42656,42735],[42738,42738],[42752,42894],[42896,42899],[42912,42922],[43000,43009],[43011,43013],[43015,43018],[43020,43042],[43048,43051],[43056,43063],[43065,43065],[43072,43123],[43138,43187],[43250,43259],[43274,43301],[43312,43334],[43359,43359],[43396,43442],[43457,43462],[43466,43469],[43471,43471],[43486,43487],[43520,43560],[43584,43586],[43588,43595],[43612,43612],[43744,43754],[43762,43764],[43777,43782],[43785,43790],[43793,43798],[43808,43814],[43816,43822],[43968,44002],[64256,64262],[64275,64279],[64297,64297],[64336,64449],[64467,64829],[64848,64911],[64914,64967],[65008,65019],[65021,65021],[65136,65140],[65142,65276],[65382,65382],[65393,65437],[65440,65470],[65474,65479],[65482,65487],[65490,65495],[65498,65500],[65512,65518],[65536,65547],[65549,65574],[65576,65594],[65596,65597],[65599,65613],[65616,65629],[65664,65786],[65799,65843],[65847,65930],[65936,65947],[66000,66044],[66176,66204],[66208,66256],[66304,66334],[66336,66339],[66352,66378],[66432,66461],[66464,66499],[66504,66511],[66513,66517],[66560,66717],[67584,67589],[67592,67592],[67594,67637],[67639,67640],[67644,67644],[67647,67669],[67672,67679],[67840,67867],[67872,67897],[67903,67903],[67968,68023],[68030,68031],[68096,68096],[68112,68115],[68117,68119],[68121,68147],[68160,68167],[68184,68184],[68192,68223],[68352,68405],[68416,68437],[68440,68466],[68472,68479],[68608,68680],[69216,69246],[69635,69687],[69705,69709],[69714,69733],[69763,69807],[69819,69821],[69840,69864],[69891,69926],[70019,70066],[70081,70084],[70087,70087],[71296,71338],[73728,74606],[74752,74850],[77824,78423],[78430,78465],[78467,78469],[78474,78712],[78716,78894],[92160,92728],[93952,94020],[94032,94032],[94099,94111],[118784,119029],[119040,119078],[119081,119140],[119146,119148],[119171,119172],[119180,119209],[119214,119261],[119296,119361],[119365,119365],[119552,119638],[119648,119665],[119808,119892],[119894,119964],[119966,119967],[119970,119970],[119973,119974],[119977,119980],[119982,119993],[119995,119995],[119997,120003],[120005,120069],[120071,120074],[120077,120084],[120086,120092],[120094,120121],[120123,120126],[120128,120132],[120134,120134],[120138,120144],[120146,120485],[120488,120779],[126464,126467],[126469,126495],[126497,126498],[126500,126500],[126503,126503],[126505,126514],[126516,126519],[126521,126521],[126523,126523],[126530,126530],[126535,126535],[126537,126537],[126539,126539],[126541,126543],[126545,126546],[126548,126548],[126551,126551],[126553,126553],[126555,126555],[126557,126557],[126559,126559],[126561,126562],[126564,126564],[126567,126570],[126572,126578],[126580,126583],[126585,126588],[126590,126590],[126592,126601],[126603,126619],[126625,126627],[126629,126633],[126635,126651],[126704,126705],[127278,127278],[127338,127339],[127925,127926],[127932,127932],[128160,128160],[128162,128162],[128164,128164],[128175,128175],[128177,128178],[128256,128262],[128279,128292],[128306,128317],[128320,128323],[128768,128883]],"PR":[[36,36],[43,43],[92,92],[163,165],[177,177],[1423,1423],[2555,2555],[2801,2801],[3065,3065],[3647,3647],[6107,6107],[8352,8358],[8360,8373],[8375,8399],[8470,8470],[8722,8723],[65129,65129],[65284,65284],[65505,65505],[65509,65510]],"PO":[[37,37],[162,162],[176,176],[1545,1547],[1642,1642],[2546,2547],[2553,2553],[3449,3449],[8240,8247],[8359,8359],[8374,8374],[8451,8451],[8457,8457],[43064,43064],[65020,65020],[65130,65130],[65285,65285],[65504,65504]],"OP":[[40,40],[91,91],[123,123],[161,161],[191,191],[3898,3898],[3900,3900],[5787,5787],[8218,8218],[8222,8222],[8261,8261],[8317,8317],[8333,8333],[9001,9001],[10088,10088],[10090,10090],[10092,10092],[10094,10094],[10096,10096],[10098,10098],[10100,10100],[10181,10181],[10214,10214],[10216,10216],[10218,10218],[10220,10220],[10222,10222],[10627,10627],[10629,10629],[10631,10631],[10633,10633],[10635,10635],[10637,10637],[10639,10639],[10641,10641],[10643,10643],[10645,10645],[10647,10647],[10712,10712],[10714,10714],[10748,10748],[11800,11800],[11810,11810],[11812,11812],[11814,11814],[11816,11816],[12296,12296],[12298,12298],[12300,12300],[12302,12302],[12304,12304],[12308,12308],[12310,12310],[12312,12312],[12314,12314],[12317,12317],[64830,64830],[65047,65047],[65077,65077],[65079,65079],[65081,65081],[65083,65083],[65085,65085],[65087,65087],[65089,65089],[65091,65091],[65095,65095],[65113,65113],[65115,65115],[65117,65117],[65288,65288],[65339,65339],[65371,65371],[65375,65375],[65378,65378],[78424,78426],[78470,78470],[78472,78472],[78713,78713]],"CP":[[41,41],[93,93]],"IS":[[44,44],[46,46],[58,59],[894,894],[1417,1417],[1548,1549],[2040,2040],[8260,8260],[65040,65040],[65043,65044]],"HY":[[45,45]],"SY":[[47,47]],"NU":[[48,57],[1632,1641],[1643,1644],[1776,1785],[1984,1993],[2406,2415],[2534,2543],[2662,2671],[2790,2799],[2918,2927],[3046,3055],[3174,3183],[3302,3311],[3430,3439],[3664,3673],[3792,3801],[3872,3881],[4160,4169],[4240,4249],[6112,6121],[6160,6169],[6470,6479],[6608,6617],[6784,6793],[6800,6809],[6992,7001],[7088,7097],[7232,7241],[7248,7257],[42528,42537],[43216,43225],[43264,43273],[43472,43481],[43600,43609],[44016,44025],[66720,66729],[69734,69743],[69872,69881],[69942,69951],[70096,70105],[71360,71369],[120782,120831]],"CL":[[125,125],[3899,3899],[3901,3901],[5788,5788],[8262,8262],[8318,8318],[8334,8334],[9002,9002],[10089,10089],[10091,10091],[10093,10093],[10095,10095],[10097,10097],[10099,10099],[10101,10101],[10182,10182],[10215,10215],[10217,10217],[10219,10219],[10221,10221],[10223,10223],[10628,10628],[10630,10630],[10632,10632],[10634,10634],[10636,10636],[10638,10638],[10640,10640],[10642,10642],[10644,10644],[10646,10646],[10648,10648],[10713,10713],[10715,10715],[10749,10749],[11811,11811],[11813,11813],[11815,11815],[11817,11817],[12289,12290],[12297,12297],[12299,12299],[12301,12301],[12303,12303],[12305,12305],[12309,12309],[12311,12311],[12313,12313],[12315,12315],[12318,12319],[64831,64831],[65041,65042],[65048,65048],[65078,65078],[65080,65080],[65082,65082],[65084,65084],[65086,65086],[65088,65088],[65090,65090],[65092,65092],[65096,65096],[65104,65104],[65106,65106],[65114,65114],[65116,65116],[65118,65118],[65289,65289],[65292,65292],[65294,65294],[65341,65341],[65373,65373],[65376,65377],[65379,65380],[78427,78429],[78466,78466],[78471,78471],[78473,78473],[78714,78715]],"NL":[[133,133]],"GL":[[160,160],[847,847],[860,866],[3848,3848],[3852,3852],[3858,3858],[4057,4058],[6158,6158],[8199,8199],[8209,8209],[8239,8239]],"AI":[[167,168],[170,170],[178,179],[182,186],[188,190],[215,215],[247,247],[711,711],[713,715],[717,717],[720,720],[728,731],[733,733],[8213,8214],[8224,8225],[8251,8251],[8308,8308],[8319,8319],[8321,8324],[8453,8453],[8467,8467],[8481,8482],[8491,8491],[8532,8533],[8539,8539],[8542,8542],[8544,8555],[8560,8569],[8585,8585],[8592,8601],[8658,8658],[8660,8660],[8704,8704],[8706,8707],[8711,8712],[8715,8715],[8719,8719],[8721,8721],[8725,8725],[8730,8730],[8733,8736],[8739,8739],[8741,8741],[8743,8748],[8750,8750],[8756,8759],[8764,8765],[8776,8776],[8780,8780],[8786,8786],[8800,8801],[8804,8807],[8810,8811],[8814,8815],[8834,8835],[8838,8839],[8853,8853],[8857,8857],[8869,8869],[8895,8895],[8978,8978],[9312,9470],[9472,9547],[9552,9588],[9600,9615],[9618,9621],[9632,9633],[9635,9641],[9650,9651],[9654,9655],[9660,9661],[9664,9665],[9670,9672],[9675,9675],[9678,9681],[9698,9701],[9711,9711],[9733,9734],[9737,9737],[9742,9743],[9750,9751],[9792,9792],[9794,9794],[9824,9825],[9827,9829],[9831,9831],[9833,9834],[9836,9837],[9839,9839],[9886,9887],[9929,9932],[9938,9938],[9941,9943],[9946,9947],[9949,9950],[9955,9955],[9960,9961],[9963,9968],[9974,9974],[9979,9980],[10071,10071],[10102,10131],[11093,11097],[12872,12879],[65533,65533],[127232,127242],[127248,127277],[127280,127337],[127344,127386]],"BB":[[180,180],[712,712],[716,716],[735,735],[3841,3844],[3846,3847],[3849,3850],[4048,4049],[4051,4051],[6150,6150],[8189,8189],[43124,43125]],"HL":[[1488,1514],[1520,1522],[64285,64285],[64287,64296],[64298,64310],[64312,64316],[64318,64318],[64320,64321],[64323,64324],[64326,64335]],"SA":[[3585,3642],[3648,3662],[3713,3714],[3716,3716],[3719,3720],[3722,3722],[3725,3725],[3732,3735],[3737,3743],[3745,3747],[3749,3749],[3751,3751],[3754,3755],[3757,3769],[3771,3773],[3776,3780],[3782,3782],[3784,3789],[3804,3807],[4096,4159],[4176,4239],[4250,4255],[6016,6099],[6103,6103],[6108,6109],[6480,6509],[6512,6516],[6528,6571],[6576,6601],[6618,6618],[6622,6623],[6688,6750],[6752,6780],[6816,6829],[43616,43643],[43648,43714],[43739,43743]],"JL":[[4352,4447],[43360,43388]],"JV":[[4448,4519],[55216,55238]],"JT":[[4520,4607],[55243,55291]],"NS":[[6102,6102],[8252,8253],[8263,8265],[12293,12293],[12316,12316],[12347,12348],[12443,12446],[12448,12448],[12539,12539],[12541,12542],[40981,40981],[65108,65109],[65306,65307],[65381,65381],[65438,65439]],"ZW":[[8203,8203]],"B2":[[8212,8212],[11834,11835]],"IN":[[8228,8230],[65049,65049]],"WJ":[[8288,8288],[65279,65279]],"ID":[[8986,8987],[9200,9203],[9728,9731],[9748,9749],[9752,9752],[9754,9759],[9785,9787],[9832,9832],[9855,9855],[9917,9928],[9933,9933],[9935,9937],[9939,9940],[9944,9945],[9948,9948],[9951,9953],[9962,9962],[9969,9973],[9975,9978],[9981,9983],[9985,9988],[9992,9997],[11904,11929],[11931,12019],[12032,12245],[12272,12283],[12291,12292],[12294,12295],[12306,12307],[12320,12329],[12336,12340],[12342,12346],[12349,12351],[12354,12354],[12356,12356],[12358,12358],[12360,12360],[12362,12386],[12388,12418],[12420,12420],[12422,12422],[12424,12429],[12431,12436],[12447,12447],[12450,12450],[12452,12452],[12454,12454],[12456,12456],[12458,12482],[12484,12514],[12516,12516],[12518,12518],[12520,12525],[12527,12532],[12535,12538],[12543,12543],[12549,12589],[12593,12686],[12688,12730],[12736,12771],[12800,12830],[12832,12871],[12880,13054],[13056,19903],[19968,40980],[40982,42124],[42128,42182],[63744,64255],[65072,65076],[65093,65094],[65097,65103],[65105,65105],[65112,65112],[65119,65126],[65128,65128],[65131,65131],[65282,65283],[65286,65287],[65290,65291],[65293,65293],[65295,65305],[65308,65310],[65312,65338],[65340,65340],[65342,65370],[65372,65372],[65374,65374],[65506,65508],[110592,110593],[126976,127019],[127024,127123],[127136,127150],[127153,127166],[127169,127183],[127185,127199],[127488,127490],[127504,127546],[127552,127560],[127568,127569],[127744,127776],[127792,127797],[127799,127868],[127872,127891],[127904,127924],[127927,127931],[127933,127940],[127942,127946],[127968,127984],[128000,128062],[128064,128064],[128066,128159],[128161,128161],[128163,128163],[128165,128174],[128176,128176],[128179,128247],[128249,128252],[128263,128278],[128293,128305],[128336,128359],[128507,128576],[128581,128591],[128640,128709],[131072,196605],[196608,262141]],"CJ":[[12353,12353],[12355,12355],[12357,12357],[12359,12359],[12361,12361],[12387,12387],[12419,12419],[12421,12421],[12423,12423],[12430,12430],[12437,12438],[12449,12449],[12451,12451],[12453,12453],[12455,12455],[12457,12457],[12483,12483],[12515,12515],[12517,12517],[12519,12519],[12526,12526],[12533,12534],[12540,12540],[12784,12799],[65383,65392]],"H2":[[44032,44032],[44060,44060],[44088,44088],[44116,44116],[44144,44144],[44172,44172],[44200,44200],[44228,44228],[44256,44256],[44284,44284],[44312,44312],[44340,44340],[44368,44368],[44396,44396],[44424,44424],[44452,44452],[44480,44480],[44508,44508],[44536,44536],[44564,44564],[44592,44592],[44620,44620],[44648,44648],[44676,44676],[44704,44704],[44732,44732],[44760,44760],[44788,44788],[44816,44816],[44844,44844],[44872,44872],[44900,44900],[44928,44928],[44956,44956],[44984,44984],[45012,45012],[45040,45040],[45068,45068],[45096,45096],[45124,45124],[45152,45152],[45180,45180],[45208,45208],[45236,45236],[45264,45264],[45292,45292],[45320,45320],[45348,45348],[45376,45376],[45404,45404],[45432,45432],[45460,45460],[45488,45488],[45516,45516],[45544,45544],[45572,45572],[45600,45600],[45628,45628],[45656,45656],[45684,45684],[45712,45712],[45740,45740],[45768,45768],[45796,45796],[45824,45824],[45852,45852],[45880,45880],[45908,45908],[45936,45936],[45964,45964],[45992,45992],[46020,46020],[46048,46048],[46076,46076],[46104,46104],[46132,46132],[46160,46160],[46188,46188],[46216,46216],[46244,46244],[46272,46272],[46300,46300],[46328,46328],[46356,46356],[46384,46384],[46412,46412],[46440,46440],[46468,46468],[46496,46496],[46524,46524],[46552,46552],[46580,46580],[46608,46608],[46636,46636],[46664,46664],[46692,46692],[46720,46720],[46748,46748],[46776,46776],[46804,46804],[46832,46832],[46860,46860],[46888,46888],[46916,46916],[46944,46944],[46972,46972],[47000,47000],[47028,47028],[47056,47056],[47084,47084],[47112,47112],[47140,47140],[47168,47168],[47196,47196],[47224,47224],[47252,47252],[47280,47280],[47308,47308],[47336,47336],[47364,47364],[47392,47392],[47420,47420],[47448,47448],[47476,47476],[47504,47504],[47532,47532],[47560,47560],[47588,47588],[47616,47616],[47644,47644],[47672,47672],[47700,47700],[47728,47728],[47756,47756],[47784,47784],[47812,47812],[47840,47840],[47868,47868],[47896,47896],[47924,47924],[47952,47952],[47980,47980],[48008,48008],[48036,48036],[48064,48064],[48092,48092],[48120,48120],[48148,48148],[48176,48176],[48204,48204],[48232,48232],[48260,48260],[48288,48288],[48316,48316],[48344,48344],[48372,48372],[48400,48400],[48428,48428],[48456,48456],[48484,48484],[48512,48512],[48540,48540],[48568,48568],[48596,48596],[48624,48624],[48652,48652],[48680,48680],[48708,48708],[48736,48736],[48764,48764],[48792,48792],[48820,48820],[48848,48848],[48876,48876],[48904,48904],[48932,48932],[48960,48960],[48988,48988],[49016,49016],[49044,49044],[49072,49072],[49100,49100],[49128,49128],[49156,49156],[49184,49184],[49212,49212],[49240,49240],[49268,49268],[49296,49296],[49324,49324],[49352,49352],[49380,49380],[49408,49408],[49436,49436],[49464,49464],[49492,49492],[49520,49520],[49548,49548],[49576,49576],[49604,49604],[49632,49632],[49660,49660],[49688,49688],[49716,49716],[49744,49744],[49772,49772],[49800,49800],[49828,49828],[49856,49856],[49884,49884],[49912,49912],[49940,49940],[49968,49968],[49996,49996],[50024,50024],[50052,50052],[50080,50080],[50108,50108],[50136,50136],[50164,50164],[50192,50192],[50220,50220],[50248,50248],[50276,50276],[50304,50304],[50332,50332],[50360,50360],[50388,50388],[50416,50416],[50444,50444],[50472,50472],[50500,50500],[50528,50528],[50556,50556],[50584,50584],[50612,50612],[50640,50640],[50668,50668],[50696,50696],[50724,50724],[50752,50752],[50780,50780],[50808,50808],[50836,50836],[50864,50864],[50892,50892],[50920,50920],[50948,50948],[50976,50976],[51004,51004],[51032,51032],[51060,51060],[51088,51088],[51116,51116],[51144,51144],[51172,51172],[51200,51200],[51228,51228],[51256,51256],[51284,51284],[51312,51312],[51340,51340],[51368,51368],[51396,51396],[51424,51424],[51452,51452],[51480,51480],[51508,51508],[51536,51536],[51564,51564],[51592,51592],[51620,51620],[51648,51648],[51676,51676],[51704,51704],[51732,51732],[51760,51760],[51788,51788],[51816,51816],[51844,51844],[51872,51872],[51900,51900],[51928,51928],[51956,51956],[51984,51984],[52012,52012],[52040,52040],[52068,52068],[52096,52096],[52124,52124],[52152,52152],[52180,52180],[52208,52208],[52236,52236],[52264,52264],[52292,52292],[52320,52320],[52348,52348],[52376,52376],[52404,52404],[52432,52432],[52460,52460],[52488,52488],[52516,52516],[52544,52544],[52572,52572],[52600,52600],[52628,52628],[52656,52656],[52684,52684],[52712,52712],[52740,52740],[52768,52768],[52796,52796],[52824,52824],[52852,52852],[52880,52880],[52908,52908],[52936,52936],[52964,52964],[52992,52992],[53020,53020],[53048,53048],[53076,53076],[53104,53104],[53132,53132],[53160,53160],[53188,53188],[53216,53216],[53244,53244],[53272,53272],[53300,53300],[53328,53328],[53356,53356],[53384,53384],[53412,53412],[53440,53440],[53468,53468],[53496,53496],[53524,53524],[53552,53552],[53580,53580],[53608,53608],[53636,53636],[53664,53664],[53692,53692],[53720,53720],[53748,53748],[53776,53776],[53804,53804],[53832,53832],[53860,53860],[53888,53888],[53916,53916],[53944,53944],[53972,53972],[54000,54000],[54028,54028],[54056,54056],[54084,54084],[54112,54112],[54140,54140],[54168,54168],[54196,54196],[54224,54224],[54252,54252],[54280,54280],[54308,54308],[54336,54336],[54364,54364],[54392,54392],[54420,54420],[54448,54448],[54476,54476],[54504,54504],[54532,54532],[54560,54560],[54588,54588],[54616,54616],[54644,54644],[54672,54672],[54700,54700],[54728,54728],[54756,54756],[54784,54784],[54812,54812],[54840,54840],[54868,54868],[54896,54896],[54924,54924],[54952,54952],[54980,54980],[55008,55008],[55036,55036],[55064,55064],[55092,55092],[55120,55120],[55148,55148],[55176,55176]],"H3":[[44033,44059],[44061,44087],[44089,44115],[44117,44143],[44145,44171],[44173,44199],[44201,44227],[44229,44255],[44257,44283],[44285,44311],[44313,44339],[44341,44367],[44369,44395],[44397,44423],[44425,44451],[44453,44479],[44481,44507],[44509,44535],[44537,44563],[44565,44591],[44593,44619],[44621,44647],[44649,44675],[44677,44703],[44705,44731],[44733,44759],[44761,44787],[44789,44815],[44817,44843],[44845,44871],[44873,44899],[44901,44927],[44929,44955],[44957,44983],[44985,45011],[45013,45039],[45041,45067],[45069,45095],[45097,45123],[45125,45151],[45153,45179],[45181,45207],[45209,45235],[45237,45263],[45265,45291],[45293,45319],[45321,45347],[45349,45375],[45377,45403],[45405,45431],[45433,45459],[45461,45487],[45489,45515],[45517,45543],[45545,45571],[45573,45599],[45601,45627],[45629,45655],[45657,45683],[45685,45711],[45713,45739],[45741,45767],[45769,45795],[45797,45823],[45825,45851],[45853,45879],[45881,45907],[45909,45935],[45937,45963],[45965,45991],[45993,46019],[46021,46047],[46049,46075],[46077,46103],[46105,46131],[46133,46159],[46161,46187],[46189,46215],[46217,46243],[46245,46271],[46273,46299],[46301,46327],[46329,46355],[46357,46383],[46385,46411],[46413,46439],[46441,46467],[46469,46495],[46497,46523],[46525,46551],[46553,46579],[46581,46607],[46609,46635],[46637,46663],[46665,46691],[46693,46719],[46721,46747],[46749,46775],[46777,46803],[46805,46831],[46833,46859],[46861,46887],[46889,46915],[46917,46943],[46945,46971],[46973,46999],[47001,47027],[47029,47055],[47057,47083],[47085,47111],[47113,47139],[47141,47167],[47169,47195],[47197,47223],[47225,47251],[47253,47279],[47281,47307],[47309,47335],[47337,47363],[47365,47391],[47393,47419],[47421,47447],[47449,47475],[47477,47503],[47505,47531],[47533,47559],[47561,47587],[47589,47615],[47617,47643],[47645,47671],[47673,47699],[47701,47727],[47729,47755],[47757,47783],[47785,47811],[47813,47839],[47841,47867],[47869,47895],[47897,47923],[47925,47951],[47953,47979],[47981,48007],[48009,48035],[48037,48063],[48065,48091],[48093,48119],[48121,48147],[48149,48175],[48177,48203],[48205,48231],[48233,48259],[48261,48287],[48289,48315],[48317,48343],[48345,48371],[48373,48399],[48401,48427],[48429,48455],[48457,48483],[48485,48511],[48513,48539],[48541,48567],[48569,48595],[48597,48623],[48625,48651],[48653,48679],[48681,48707],[48709,48735],[48737,48763],[48765,48791],[48793,48819],[48821,48847],[48849,48875],[48877,48903],[48905,48931],[48933,48959],[48961,48987],[48989,49015],[49017,49043],[49045,49071],[49073,49099],[49101,49127],[49129,49155],[49157,49183],[49185,49211],[49213,49239],[49241,49267],[49269,49295],[49297,49323],[49325,49351],[49353,49379],[49381,49407],[49409,49435],[49437,49463],[49465,49491],[49493,49519],[49521,49547],[49549,49575],[49577,49603],[49605,49631],[49633,49659],[49661,49687],[49689,49715],[49717,49743],[49745,49771],[49773,49799],[49801,49827],[49829,49855],[49857,49883],[49885,49911],[49913,49939],[49941,49967],[49969,49995],[49997,50023],[50025,50051],[50053,50079],[50081,50107],[50109,50135],[50137,50163],[50165,50191],[50193,50219],[50221,50247],[50249,50275],[50277,50303],[50305,50331],[50333,50359],[50361,50387],[50389,50415],[50417,50443],[50445,50471],[50473,50499],[50501,50527],[50529,50555],[50557,50583],[50585,50611],[50613,50639],[50641,50667],[50669,50695],[50697,50723],[50725,50751],[50753,50779],[50781,50807],[50809,50835],[50837,50863],[50865,50891],[50893,50919],[50921,50947],[50949,50975],[50977,51003],[51005,51031],[51033,51059],[51061,51087],[51089,51115],[51117,51143],[51145,51171],[51173,51199],[51201,51227],[51229,51255],[51257,51283],[51285,51311],[51313,51339],[51341,51367],[51369,51395],[51397,51423],[51425,51451],[51453,51479],[51481,51507],[51509,51535],[51537,51563],[51565,51591],[51593,51619],[51621,51647],[51649,51675],[51677,51703],[51705,51731],[51733,51759],[51761,51787],[51789,51815],[51817,51843],[51845,51871],[51873,51899],[51901,51927],[51929,51955],[51957,51983],[51985,52011],[52013,52039],[52041,52067],[52069,52095],[52097,52123],[52125,52151],[52153,52179],[52181,52207],[52209,52235],[52237,52263],[52265,52291],[52293,52319],[52321,52347],[52349,52375],[52377,52403],[52405,52431],[52433,52459],[52461,52487],[52489,52515],[52517,52543],[52545,52571],[52573,52599],[52601,52627],[52629,52655],[52657,52683],[52685,52711],[52713,52739],[52741,52767],[52769,52795],[52797,52823],[52825,52851],[52853,52879],[52881,52907],[52909,52935],[52937,52963],[52965,52991],[52993,53019],[53021,53047],[53049,53075],[53077,53103],[53105,53131],[53133,53159],[53161,53187],[53189,53215],[53217,53243],[53245,53271],[53273,53299],[53301,53327],[53329,53355],[53357,53383],[53385,53411],[53413,53439],[53441,53467],[53469,53495],[53497,53523],[53525,53551],[53553,53579],[53581,53607],[53609,53635],[53637,53663],[53665,53691],[53693,53719],[53721,53747],[53749,53775],[53777,53803],[53805,53831],[53833,53859],[53861,53887],[53889,53915],[53917,53943],[53945,53971],[53973,53999],[54001,54027],[54029,54055],[54057,54083],[54085,54111],[54113,54139],[54141,54167],[54169,54195],[54197,54223],[54225,54251],[54253,54279],[54281,54307],[54309,54335],[54337,54363],[54365,54391],[54393,54419],[54421,54447],[54449,54475],[54477,54503],[54505,54531],[54533,54559],[54561,54587],[54589,54615],[54617,54643],[54645,54671],[54673,54699],[54701,54727],[54729,54755],[54757,54783],[54785,54811],[54813,54839],[54841,54867],[54869,54895],[54897,54923],[54925,54951],[54953,54979],[54981,55007],[55009,55035],[55037,55063],[55065,55091],[55093,55119],[55121,55147],[55149,55175],[55177,55203]],"SG":[[55296,57343]],"XX":[[57344,63743],[983040,1048573],[1048576,1114109]],"CB":[[65532,65532]],"RI":[[127462,127487]]},"sentence_break":{"CR":[[13,13]],"LF":[[10,10]],"Extend":[[768,879],[1155,1161],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1552,1562],[1611,1631],[1648,1648],[1750,1756],[1759,1764],[1767,1768],[1770,1773],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2070,2073],[2075,2083],[2085,2087],[2089,2093],[2137,2139],[2276,2302],[2304,2307],[2362,2364],[2366,2383],[2385,2391],[2402,2403],[2433,2435],[2492,2492],[2494,2500],[2503,2504],[2507,2509],[2519,2519],[2530,2531],[2561,2563],[2620,2620],[2622,2626],[2631,2632],[2635,2637],[2641,2641],[2672,2673],[2677,2677],[2689,2691],[2748,2748],[2750,2757],[2759,2761],[2763,2765],[2786,2787],[2817,2819],[2876,2876],[2878,2884],[2887,2888],[2891,2893],[2902,2903],[2914,2915],[2946,2946],[3006,3010],[3014,3016],[3018,3021],[3031,3031],[3073,3075],[3134,3140],[3142,3144],[3146,3149],[3157,3158],[3170,3171],[3202,3203],[3260,3260],[3262,3268],[3270,3272],[3274,3277],[3285,3286],[3298,3299],[3330,3331],[3390,3396],[3398,3400],[3402,3405],[3415,3415],[3426,3427],[3458,3459],[3530,3530],[3535,3540],[3542,3542],[3544,3551],[3570,3571],[3633,3633],[3636,3642],[3655,3662],[3761,3761],[3764,3769],[3771,3772],[3784,3789],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3902,3903],[3953,3972],[3974,3975],[3981,3991],[3993,4028],[4038,4038],[4139,4158],[4182,4185],[4190,4192],[4194,4196],[4199,4205],[4209,4212],[4226,4237],[4239,4239],[4250,4253],[4957,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6068,6099],[6109,6109],[6155,6157],[6313,6313],[6432,6443],[6448,6459],[6576,6592],[6600,6601],[6679,6683],[6741,6750],[6752,6780],[6783,6783],[6912,6916],[6964,6980],[7019,7027],[7040,7042],[7073,7085],[7142,7155],[7204,7223],[7376,7378],[7380,7400],[7405,7405],[7410,7412],[7616,7654],[7676,7679],[8204,8205],[8400,8432],[11503,11505],[11647,11647],[11744,11775],[12330,12335],[12441,12442],[42607,42610],[42612,42621],[42655,42655],[42736,42737],[43010,43010],[43014,43014],[43019,43019],[43043,43047],[43136,43137],[43188,43204],[43232,43249],[43302,43309],[43335,43347],[43392,43395],[43443,43456],[43561,43574],[43587,43587],[43596,43597],[43643,43643],[43696,43696],[43698,43700],[43703,43704],[43710,43711],[43713,43713],[43755,43759],[43765,43766],[44003,44010],[44012,44013],[64286,64286],[65024,65039],[65056,65062],[65438,65439],[66045,66045],[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[69632,69634],[69688,69702],[69760,69762],[69808,69818],[69888,69890],[69927,69940],[70016,70018],[70067,70080],[71339,71351],[94033,94078],[94095,94098],[119141,119145],[119149,119154],[119163,119170],[119173,119179],[119210,119213],[119362,119364],[917760,917999]],"Sep":[[133,133],[8232,8233]],"Format":[[173,173],[1536,1540],[1564,1564],[1757,1757],[1807,1807],[6158,6158],[8203,8203],[8206,8207],[8234,8238],[8288,8292],[8294,8303],[65279,65279],[65529,65531],[69821,69821],[119155,119162],[917505,917505],[917536,917631]],"Sp":[[9,9],[11,12],[32,32],[160,160],[5760,5760],[8192,8202],[8239,8239],[8287,8287],[12288,12288]],"Lower":[[97,122],[170,170],[181,181],[186,186],[223,246],[248,255],[257,257],[259,259],[261,261],[263,263],[265,265],[267,267],[269,269],[271,271],[273,273],[275,275],[277,277],[279,279],[281,281],[283,283],[285,285],[287,287],[289,289],[291,291],[293,293],[295,295],[297,297],[299,299],[301,301],[303,303],[305,305],[307,307],[309,309],[311,312],[314,314],[316,316],[318,318],[320,320],[322,322],[324,324],[326,326],[328,329],[331,331],[333,333],[335,335],[337,337],[339,339],[341,341],[343,343],[345,345],[347,347],[349,349],[351,351],[353,353],[355,355],[357,357],[359,359],[361,361],[363,363],[365,365],[367,367],[369,369],[371,371],[373,373],[375,375],[378,378],[380,380],[382,384],[387,387],[389,389],[392,392],[396,397],[402,402],[405,405],[409,411],[414,414],[417,417],[419,419],[421,421],[424,424],[426,427],[429,429],[432,432],[436,436],[438,438],[441,442],[445,447],[454,454],[457,457],[460,460],[462,462],[464,464],[466,466],[468,468],[470,470],[472,472],[474,474],[476,477],[479,479],[481,481],[483,483],[485,485],[487,487],[489,489],[491,491],[493,493],[495,496],[499,499],[501,501],[505,505],[507,507],[509,509],[511,511],[513,513],[515,515],[517,517],[519,519],[521,521],[523,523],[525,525],[527,527],[529,529],[531,531],[533,533],[535,535],[537,537],[539,539],[541,541],[543,543],[545,545],[547,547],[549,549],[551,551],[553,553],[555,555],[557,557],[559,559],[561,561],[563,569],[572,572],[575,576],[578,578],[583,583],[585,585],[587,587],[589,589],[591,659],[661,696],[704,705],[736,740],[881,881],[883,883],[887,887],[890,893],[912,912],[940,974],[976,977],[981,983],[985,985],[987,987],[989,989],[991,991],[993,993],[995,995],[997,997],[999,999],[1001,1001],[1003,1003],[1005,1005],[1007,1011],[1013,1013],[1016,1016],[1019,1020],[1072,1119],[1121,1121],[1123,1123],[1125,1125],[1127,1127],[1129,1129],[1131,1131],[1133,1133],[1135,1135],[1137,1137],[1139,1139],[1141,1141],[1143,1143],[1145,1145],[1147,1147],[1149,1149],[1151,1151],[1153,1153],[1163,1163],[1165,1165],[1167,1167],[1169,1169],[1171,1171],[1173,1173],[1175,1175],[1177,1177],[1179,1179],[1181,1181],[1183,1183],[1185,1185],[1187,1187],[1189,1189],[1191,1191],[1193,1193],[1195,1195],[1197,1197],[1199,1199],[1201,1201],[1203,1203],[1205,1205],[1207,1207],[1209,1209],[1211,1211],[1213,1213],[1215,1215],[1218,1218],[1220,1220],[1222,1222],[1224,1224],[1226,1226],[1228,1228],[1230,1231],[1233,1233],[1235,1235],[1237,1237],[1239,1239],[1241,1241],[1243,1243],[1245,1245],[1247,1247],[1249,1249],[1251,1251],[1253,1253],[1255,1255],[1257,1257],[1259,1259],[1261,1261],[1263,1263],[1265,1265],[1267,1267],[1269,1269],[1271,1271],[1273,1273],[1275,1275],[1277,1277],[1279,1279],[1281,1281],[1283,1283],[1285,1285],[1287,1287],[1289,1289],[1291,1291],[1293,1293],[1295,1295],[1297,1297],[1299,1299],[1301,1301],[1303,1303],[1305,1305],[1307,1307],[1309,1309],[1311,1311],[1313,1313],[1315,1315],[1317,1317],[1319,1319],[1377,1415],[7424,7615],[7681,7681],[7683,7683],[7685,7685],[7687,7687],[7689,7689],[7691,7691],[7693,7693],[7695,7695],[7697,7697],[7699,7699],[7701,7701],[7703,7703],[7705,7705],[7707,7707],[7709,7709],[7711,7711],[7713,7713],[7715,7715],[7717,7717],[7719,7719],[7721,7721],[7723,7723],[7725,7725],[7727,7727],[7729,7729],[7731,7731],[7733,7733],[7735,7735],[7737,7737],[7739,7739],[7741,7741],[7743,7743],[7745,7745],[7747,7747],[7749,7749],[7751,7751],[7753,7753],[7755,7755],[7757,7757],[7759,7759],[7761,7761],[7763,7763],[7765,7765],[7767,7767],[7769,7769],[7771,7771],[7773,7773],[7775,7775],[7777,7777],[7779,7779],[7781,7781],[7783,7783],[7785,7785],[7787,7787],[7789,7789],[7791,7791],[7793,7793],[7795,7795],[7797,7797],[7799,7799],[7801,7801],[7803,7803],[7805,7805],[7807,7807],[7809,7809],[7811,7811],[7813,7813],[7815,7815],[7817,7817],[7819,7819],[7821,7821],[7823,7823],[7825,7825],[7827,7827],[7829,7837],[7839,7839],[7841,7841],[7843,7843],[7845,7845],[7847,7847],[7849,7849],[7851,7851],[7853,7853],[7855,7855],[7857,7857],[7859,7859],[7861,7861],[7863,7863],[7865,7865],[7867,7867],[7869,7869],[7871,7871],[7873,7873],[7875,7875],[7877,7877],[7879,7879],[7881,7881],[7883,7883],[7885,7885],[7887,7887],[7889,7889],[7891,7891],[7893,7893],[7895,7895],[7897,7897],[7899,7899],[7901,7901],[7903,7903],[7905,7905],[7907,7907],[7909,7909],[7911,7911],[7913,7913],[7915,7915],[7917,7917],[7919,7919],[7921,7921],[7923,7923],[7925,7925],[7927,7927],[7929,7929],[7931,7931],[7933,7933],[7935,7943],[7952,7957],[7968,7975],[7984,7991],[8000,8005],[8016,8023],[8032,8039],[8048,8061],[8064,8071],[8080,8087],[8096,8103],[8112,8116],[8118,8119],[8126,8126],[8130,8132],[8134,8135],[8144,8147],[8150,8151],[8160,8167],[8178,8180],[8182,8183],[8305,8305],[8319,8319],[8336,8348],[8458,8458],[8462,8463],[8467,8467],[8495,8495],[8500,8500],[8505,8505],[8508,8509],[8518,8521],[8526,8526],[8560,8575],[8580,8580],[9424,9449],[11312,11358],[11361,11361],[11365,11366],[11368,11368],[11370,11370],[11372,11372],[11377,11377],[11379,11380],[11382,11389],[11393,11393],[11395,11395],[11397,11397],[11399,11399],[11401,11401],[11403,11403],[11405,11405],[11407,11407],[11409,11409],[11411,11411],[11413,11413],[11415,11415],[11417,11417],[11419,11419],[11421,11421],[11423,11423],[11425,11425],[11427,11427],[11429,11429],[11431,11431],[11433,11433],[11435,11435],[11437,11437],[11439,11439],[11441,11441],[11443,11443],[11445,11445],[11447,11447],[11449,11449],[11451,11451],[11453,11453],[11455,11455],[11457,11457],[11459,11459],[11461,11461],[11463,11463],[11465,11465],[11467,11467],[11469,11469],[11471,11471],[11473,11473],[11475,11475],[11477,11477],[11479,11479],[11481,11481],[11483,11483],[11485,11485],[11487,11487],[11489,11489],[11491,11492],[11500,11500],[11502,11502],[11507,11507],[11520,11557],[11559,11559],[11565,11565],[42561,42561],[42563,42563],[42565,42565],[42567,42567],[42569,42569],[42571,42571],[42573,42573],[42575,42575],[42577,42577],[42579,42579],[42581,42581],[42583,42583],[42585,42585],[42587,42587],[42589,42589],[42591,42591],[42593,42593],[42595,42595],[42597,42597],[42599,42599],[42601,42601],[42603,42603],[42605,42605],[42625,42625],[42627,42627],[42629,42629],[42631,42631],[42633,42633],[42635,42635],[42637,42637],[42639,42639],[42641,42641],[42643,42643],[42645,42645],[42647,42647],[42787,42787],[42789,42789],[42791,42791],[42793,42793],[42795,42795],[42797,42797],[42799,42801],[42803,42803],[42805,42805],[42807,42807],[42809,42809],[42811,42811],[42813,42813],[42815,42815],[42817,42817],[42819,42819],[42821,42821],[42823,42823],[42825,42825],[42827,42827],[42829,42829],[42831,42831],[42833,42833],[42835,42835],[42837,42837],[42839,42839],[42841,42841],[42843,42843],[42845,42845],[42847,42847],[42849,42849],[42851,42851],[42853,42853],[42855,42855],[42857,42857],[42859,42859],[42861,42861],[42863,42872],[42874,42874],[42876,42876],[42879,42879],[42881,42881],[42883,42883],[42885,42885],[42887,42887],[42892,42892],[42894,42894],[42897,42897],[42899,42899],[42913,42913],[42915,42915],[42917,42917],[42919,42919],[42921,42921],[43000,43002],[64256,64262],[64275,64279],[65345,65370],[66600,66639],[119834,119859],[119886,119892],[119894,119911],[119938,119963],[119990,119993],[119995,119995],[119997,120003],[120005,120015],[120042,120067],[120094,120119],[120146,120171],[120198,120223],[120250,120275],[120302,120327],[120354,120379],[120406,120431],[120458,120485],[120514,120538],[120540,120545],[120572,120596],[120598,120603],[120630,120654],[120656,120661],[120688,120712],[120714,120719],[120746,120770],[120772,120777],[120779,120779]],"Upper":[[65,90],[192,214],[216,222],[256,256],[258,258],[260,260],[262,262],[264,264],[266,266],[268,268],[270,270],[272,272],[274,274],[276,276],[278,278],[280,280],[282,282],[284,284],[286,286],[288,288],[290,290],[292,292],[294,294],[296,296],[298,298],[300,300],[302,302],[304,304],[306,306],[308,308],[310,310],[313,313],[315,315],[317,317],[319,319],[321,321],[323,323],[325,325],[327,327],[330,330],[332,332],[334,334],[336,336],[338,338],[340,340],[342,342],[344,344],[346,346],[348,348],[350,350],[352,352],[354,354],[356,356],[358,358],[360,360],[362,362],[364,364],[366,366],[368,368],[370,370],[372,372],[374,374],[376,377],[379,379],[381,381],[385,386],[388,388],[390,391],[393,395],[398,401],[403,404],[406,408],[412,413],[415,416],[418,418],[420,420],[422,423],[425,425],[428,428],[430,431],[433,435],[437,437],[439,440],[444,444],[452,453],[455,456],[458,459],[461,461],[463,463],[465,465],[467,467],[469,469],[471,471],[473,473],[475,475],[478,478],[480,480],[482,482],[484,484],[486,486],[488,488],[490,490],[492,492],[494,494],[497,498],[500,500],[502,504],[506,506],[508,508],[510,510],[512,512],[514,514],[516,516],[518,518],[520,520],[522,522],[524,524],[526,526],[528,528],[530,530],[532,532],[534,534],[536,536],[538,538],[540,540],[542,542],[544,544],[546,546],[548,548],[550,550],[552,552],[554,554],[556,556],[558,558],[560,560],[562,562],[570,571],[573,574],[577,577],[579,582],[584,584],[586,586],[588,588],[590,590],[880,880],[882,882],[886,886],[902,902],[904,906],[908,908],[910,911],[913,929],[931,939],[975,975],[978,980],[984,984],[986,986],[988,988],[990,990],[992,992],[994,994],[996,996],[998,998],[1000,1000],[1002,1002],[1004,1004],[1006,1006],[1012,1012],[1015,1015],[1017,1018],[1021,1071],[1120,1120],[1122,1122],[1124,1124],[1126,1126],[1128,1128],[1130,1130],[1132,1132],[1134,1134],[1136,1136],[1138,1138],[1140,1140],[1142,1142],[1144,1144],[1146,1146],[1148,1148],[1150,1150],[1152,1152],[1162,1162],[1164,1164],[1166,1166],[1168,1168],[1170,1170],[1172,1172],[1174,1174],[1176,1176],[1178,1178],[1180,1180],[1182,1182],[1184,1184],[1186,1186],[1188,1188],[1190,1190],[1192,1192],[1194,1194],[1196,1196],[1198,1198],[1200,1200],[1202,1202],[1204,1204],[1206,1206],[1208,1208],[1210,1210],[1212,1212],[1214,1214],[1216,1217],[1219,1219],[1221,1221],[1223,1223],[1225,1225],[1227,1227],[1229,1229],[1232,1232],[1234,1234],[1236,1236],[1238,1238],[1240,1240],[1242,1242],[1244,1244],[1246,1246],[1248,1248],[1250,1250],[1252,1252],[1254,1254],[1256,1256],[1258,1258],[1260,1260],[1262,1262],[1264,1264],[1266,1266],[1268,1268],[1270,1270],[1272,1272],[1274,1274],[1276,1276],[1278,1278],[1280,1280],[1282,1282],[1284,1284],[1286,1286],[1288,1288],[1290,1290],[1292,1292],[1294,1294],[1296,1296],[1298,1298],[1300,1300],[1302,1302],[1304,1304],[1306,1306],[1308,1308],[1310,1310],[1312,1312],[1314,1314],[1316,1316],[1318,1318],[1329,1366],[4256,4293],[4295,4295],[4301,4301],[7680,7680],[7682,7682],[7684,7684],[7686,7686],[7688,7688],[7690,7690],[7692,7692],[7694,7694],[7696,7696],[7698,7698],[7700,7700],[7702,7702],[7704,7704],[7706,7706],[7708,7708],[7710,7710],[7712,7712],[7714,7714],[7716,7716],[7718,7718],[7720,7720],[7722,7722],[7724,7724],[7726,7726],[7728,7728],[7730,7730],[7732,7732],[7734,7734],[7736,7736],[7738,7738],[7740,7740],[7742,7742],[7744,7744],[7746,7746],[7748,7748],[7750,7750],[7752,7752],[7754,7754],[7756,7756],[7758,7758],[7760,7760],[7762,7762],[7764,7764],[7766,7766],[7768,7768],[7770,7770],[7772,7772],[7774,7774],[7776,7776],[7778,7778],[7780,7780],[7782,7782],[7784,7784],[7786,7786],[7788,7788],[7790,7790],[7792,7792],[7794,7794],[7796,7796],[7798,7798],[7800,7800],[7802,7802],[7804,7804],[7806,7806],[7808,7808],[7810,7810],[7812,7812],[7814,7814],[7816,7816],[7818,7818],[7820,7820],[7822,7822],[7824,7824],[7826,7826],[7828,7828],[7838,7838],[7840,7840],[7842,7842],[7844,7844],[7846,7846],[7848,7848],[7850,7850],[7852,7852],[7854,7854],[7856,7856],[7858,7858],[7860,7860],[7862,7862],[7864,7864],[7866,7866],[7868,7868],[7870,7870],[7872,7872],[7874,7874],[7876,7876],[7878,7878],[7880,7880],[7882,7882],[7884,7884],[7886,7886],[7888,7888],[7890,7890],[7892,7892],[7894,7894],[7896,7896],[7898,7898],[7900,7900],[7902,7902],[7904,7904],[7906,7906],[7908,7908],[7910,7910],[7912,7912],[7914,7914],[7916,7916],[7918,7918],[7920,7920],[7922,7922],[7924,7924],[7926,7926],[7928,7928],[7930,7930],[7932,7932],[7934,7934],[7944,7951],[7960,7965],[7976,7983],[7992,7999],[8008,8013],[8025,8025],[8027,8027],[8029,8029],[8031,8031],[8040,8047],[8072,8079],[8088,8095],[8104,8111],[8120,8124],[8136,8140],[8152,8155],[8168,8172],[8184,8188],[8450,8450],[8455,8455],[8459,8461],[8464,8466],[8469,8469],[8473,8477],[8484,8484],[8486,8486],[8488,8488],[8490,8493],[8496,8499],[8510,8511],[8517,8517],[8544,8559],[8579,8579],[9398,9423],[11264,11310],[11360,11360],[11362,11364],[11367,11367],[11369,11369],[11371,11371],[11373,11376],[11378,11378],[11381,11381],[11390,11392],[11394,11394],[11396,11396],[11398,11398],[11400,11400],[11402,11402],[11404,11404],[11406,11406],[11408,11408],[11410,11410],[11412,11412],[11414,11414],[11416,11416],[11418,11418],[11420,11420],[11422,11422],[11424,11424],[11426,11426],[11428,11428],[11430,11430],[11432,11432],[11434,11434],[11436,11436],[11438,11438],[11440,11440],[11442,11442],[11444,11444],[11446,11446],[11448,11448],[11450,11450],[11452,11452],[11454,11454],[11456,11456],[11458,11458],[11460,11460],[11462,11462],[11464,11464],[11466,11466],[11468,11468],[11470,11470],[11472,11472],[11474,11474],[11476,11476],[11478,11478],[11480,11480],[11482,11482],[11484,11484],[11486,11486],[11488,11488],[11490,11490],[11499,11499],[11501,11501],[11506,11506],[42560,42560],[42562,42562],[42564,42564],[42566,42566],[42568,42568],[42570,42570],[42572,42572],[42574,42574],[42576,42576],[42578,42578],[42580,42580],[42582,42582],[42584,42584],[42586,42586],[42588,42588],[42590,42590],[42592,42592],[42594,42594],[42596,42596],[42598,42598],[42600,42600],[42602,42602],[42604,42604],[42624,42624],[42626,42626],[42628,42628],[42630,42630],[42632,42632],[42634,42634],[42636,42636],[42638,42638],[42640,42640],[42642,42642],[42644,42644],[42646,42646],[42786,42786],[42788,42788],[42790,42790],[42792,42792],[42794,42794],[42796,42796],[42798,42798],[42802,42802],[42804,42804],[42806,42806],[42808,42808],[42810,42810],[42812,42812],[42814,42814],[42816,42816],[42818,42818],[42820,42820],[42822,42822],[42824,42824],[42826,42826],[42828,42828],[42830,42830],[42832,42832],[42834,42834],[42836,42836],[42838,42838],[42840,42840],[42842,42842],[42844,42844],[42846,42846],[42848,42848],[42850,42850],[42852,42852],[42854,42854],[42856,42856],[42858,42858],[42860,42860],[42862,42862],[42873,42873],[42875,42875],[42877,42878],[42880,42880],[42882,42882],[42884,42884],[42886,42886],[42891,42891],[42893,42893],[42896,42896],[42898,42898],[42912,42912],[42914,42914],[42916,42916],[42918,42918],[42920,42920],[42922,42922],[65313,65338],[66560,66599],[119808,119833],[119860,119885],[119912,119937],[119964,119964],[119966,119967],[119970,119970],[119973,119974],[119977,119980],[119982,119989],[120016,120041],[120068,120069],[120071,120074],[120077,120084],[120086,120092],[120120,120121],[120123,120126],[120128,120132],[120134,120134],[120138,120144],[120172,120197],[120224,120249],[120276,120301],[120328,120353],[120380,120405],[120432,120457],[120488,120512],[120546,120570],[120604,120628],[120662,120686],[120720,120744],[120778,120778]],"OLetter":[[443,443],[448,451],[660,660],[697,703],[710,721],[748,748],[750,750],[884,884],[1369,1369],[1488,1514],[1520,1523],[1568,1610],[1646,1647],[1649,1747],[1749,1749],[1765,1766],[1774,1775],[1786,1788],[1791,1791],[1808,1808],[1810,1839],[1869,1957],[1969,1969],[1994,2026],[2036,2037],[2042,2042],[2048,2069],[2074,2074],[2084,2084],[2088,2088],[2112,2136],[2208,2208],[2210,2220],[2308,2361],[2365,2365],[2384,2384],[2392,2401],[2417,2423],[2425,2431],[2437,2444],[2447,2448],[2451,2472],[2474,2480],[2482,2482],[2486,2489],[2493,2493],[2510,2510],[2524,2525],[2527,2529],[2544,2545],[2565,2570],[2575,2576],[2579,2600],[2602,2608],[2610,2611],[2613,2614],[2616,2617],[2649,2652],[2654,2654],[2674,2676],[2693,2701],[2703,2705],[2707,2728],[2730,2736],[2738,2739],[2741,2745],[2749,2749],[2768,2768],[2784,2785],[2821,2828],[2831,2832],[2835,2856],[2858,2864],[2866,2867],[2869,2873],[2877,2877],[2908,2909],[2911,2913],[2929,2929],[2947,2947],[2949,2954],[2958,2960],[2962,2965],[2969,2970],[2972,2972],[2974,2975],[2979,2980],[2984,2986],[2990,3001],[3024,3024],[3077,3084],[3086,3088],[3090,3112],[3114,3123],[3125,3129],[3133,3133],[3160,3161],[3168,3169],[3205,3212],[3214,3216],[3218,3240],[3242,3251],[3253,3257],[3261,3261],[3294,3294],[3296,3297],[3313,3314],[3333,3340],[3342,3344],[3346,3386],[3389,3389],[3406,3406],[3424,3425],[3450,3455],[3461,3478],[3482,3505],[3507,3515],[3517,3517],[3520,3526],[3585,3632],[3634,3635],[3648,3654],[3713,3714],[3716,3716],[3719,3720],[3722,3722],[3725,3725],[3732,3735],[3737,3743],[3745,3747],[3749,3749],[3751,3751],[3754,3755],[3757,3760],[3762,3763],[3773,3773],[3776,3780],[3782,3782],[3804,3807],[3840,3840],[3904,3911],[3913,3948],[3976,3980],[4096,4138],[4159,4159],[4176,4181],[4186,4189],[4193,4193],[4197,4198],[4206,4208],[4213,4225],[4238,4238],[4304,4346],[4348,4680],[4682,4685],[4688,4694],[4696,4696],[4698,4701],[4704,4744],[4746,4749],[4752,4784],[4786,4789],[4792,4798],[4800,4800],[4802,4805],[4808,4822],[4824,4880],[4882,4885],[4888,4954],[4992,5007],[5024,5108],[5121,5740],[5743,5759],[5761,5786],[5792,5866],[5870,5872],[5888,5900],[5902,5905],[5920,5937],[5952,5969],[5984,5996],[5998,6000],[6016,6067],[6103,6103],[6108,6108],[6176,6263],[6272,6312],[6314,6314],[6320,6389],[6400,6428],[6480,6509],[6512,6516],[6528,6571],[6593,6599],[6656,6678],[6688,6740],[6823,6823],[6917,6963],[6981,6987],[7043,7072],[7086,7087],[7098,7141],[7168,7203],[7245,7247],[7258,7293],[7401,7404],[7406,7409],[7413,7414],[8501,8504],[8576,8578],[8581,8584],[11568,11623],[11631,11631],[11648,11670],[11680,11686],[11688,11694],[11696,11702],[11704,11710],[11712,11718],[11720,11726],[11728,11734],[11736,11742],[11823,11823],[12293,12295],[12321,12329],[12337,12341],[12344,12348],[12353,12438],[12445,12447],[12449,12538],[12540,12543],[12549,12589],[12593,12686],[12704,12730],[12784,12799],[13312,19893],[19968,40908],[40960,42124],[42192,42237],[42240,42508],[42512,42527],[42538,42539],[42606,42606],[42623,42623],[42656,42735],[42775,42783],[42888,42888],[43003,43009],[43011,43013],[43015,43018],[43020,43042],[43072,43123],[43138,43187],[43250,43255],[43259,43259],[43274,43301],[43312,43334],[43360,43388],[43396,43442],[43471,43471],[43520,43560],[43584,43586],[43588,43595],[43616,43638],[43642,43642],[43648,43695],[43697,43697],[43701,43702],[43705,43709],[43712,43712],[43714,43714],[43739,43741],[43744,43754],[43762,43764],[43777,43782],[43785,43790],[43793,43798],[43808,43814],[43816,43822],[43968,44002],[44032,55203],[55216,55238],[55243,55291],[63744,64109],[64112,64217],[64285,64285],[64287,64296],[64298,64310],[64312,64316],[64318,64318],[64320,64321],[64323,64324],[64326,64433],[64467,64829],[64848,64911],[64914,64967],[65008,65019],[65136,65140],[65142,65276],[65382,65437],[65440,65470],[65474,65479],[65482,65487],[65490,65495],[65498,65500],[65536,65547],[65549,65574],[65576,65594],[65596,65597],[65599,65613],[65616,65629],[65664,65786],[65856,65908],[66176,66204],[66208,66256],[66304,66334],[66352,66378],[66432,66461],[66464,66499],[66504,66511],[66513,66517],[66640,66717],[67584,67589],[67592,67592],[67594,67637],[67639,67640],[67644,67644],[67647,67669],[67840,67861],[67872,67897],[67968,68023],[68030,68031],[68096,68096],[68112,68115],[68117,68119],[68121,68147],[68192,68220],[68352,68405],[68416,68437],[68448,68466],[68608,68680],[69635,69687],[69763,69807],[69840,69864],[69891,69926],[70019,70066],[70081,70084],[71296,71338],[73728,74606],[74752,74850],[77824,78894],[92160,92728],[93952,94020],[94032,94032],[94099,94111],[110592,110593],[126464,126467],[126469,126495],[126497,126498],[126500,126500],[126503,126503],[126505,126514],[126516,126519],[126521,126521],[126523,126523],[126530,126530],[126535,126535],[126537,126537],[126539,126539],[126541,126543],[126545,126546],[126548,126548],[126551,126551],[126553,126553],[126555,126555],[126557,126557],[126559,126559],[126561,126562],[126564,126564],[126567,126570],[126572,126578],[126580,126583],[126585,126588],[126590,126590],[126592,126601],[126603,126619],[126625,126627],[126629,126633],[126635,126651],[131072,173782],[173824,177972],[177984,178205],[194560,195101]],"Numeric":[[48,57],[1632,1641],[1643,1644],[1776,1785],[1984,1993],[2406,2415],[2534,2543],[2662,2671],[2790,2799],[2918,2927],[3046,3055],[3174,3183],[3302,3311],[3430,3439],[3664,3673],[3792,3801],[3872,3881],[4160,4169],[4240,4249],[6112,6121],[6160,6169],[6470,6479],[6608,6617],[6784,6793],[6800,6809],[6992,7001],[7088,7097],[7232,7241],[7248,7257],[42528,42537],[43216,43225],[43264,43273],[43472,43481],[43600,43609],[44016,44025],[66720,66729],[69734,69743],[69872,69881],[69942,69951],[70096,70105],[71360,71369],[120782,120831]],"ATerm":[[46,46],[8228,8228],[65106,65106],[65294,65294]],"STerm":[[33,33],[63,63],[1372,1372],[1374,1374],[1417,1417],[1567,1567],[1748,1748],[1792,1794],[2041,2041],[2404,2405],[4170,4171],[4962,4962],[4967,4968],[5742,5742],[5941,5942],[6147,6147],[6153,6153],[6468,6469],[6824,6827],[7002,7003],[7006,7007],[7227,7228],[7294,7295],[8252,8253],[8263,8265],[11822,11822],[12290,12290],[42239,42239],[42510,42511],[42739,42739],[42743,42743],[43126,43127],[43214,43215],[43311,43311],[43464,43465],[43613,43615],[43760,43761],[44011,44011],[65110,65111],[65281,65281],[65311,65311],[65377,65377],[68182,68183],[69703,69704],[69822,69825],[69953,69955],[70085,70086]],"Close":[[34,34],[39,41],[91,91],[93,93],[123,123],[125,125],[171,171],[187,187],[3898,3901],[5787,5788],[8216,8223],[8249,8250],[8261,8262],[8317,8318],[8333,8334],[8968,8971],[9001,9002],[10075,10078],[10088,10101],[10181,10182],[10214,10223],[10627,10648],[10712,10715],[10748,10749],[11776,11789],[11804,11805],[11808,11817],[12296,12305],[12308,12315],[12317,12319],[64830,64831],[65047,65048],[65077,65092],[65095,65096],[65113,65118],[65288,65289],[65339,65339],[65341,65341],[65371,65371],[65373,65373],[65375,65376],[65378,65379]],"SContinue":[[44,45],[58,58],[1373,1373],[1548,1549],[2040,2040],[6146,6146],[6152,6152],[8211,8212],[12289,12289],[65040,65041],[65043,65043],[65073,65074],[65104,65105],[65109,65109],[65112,65112],[65123,65123],[65292,65293],[65306,65306],[65380,65380]]},"word_break":{"Double_Quote":[[34,34]],"Single_Quote":[[39,39]],"Hebrew_Letter":[[1488,1514],[1520,1522],[64285,64285],[64287,64296],[64298,64310],[64312,64316],[64318,64318],[64320,64321],[64323,64324],[64326,64335]],"CR":[[13,13]],"LF":[[10,10]],"Newline":[[11,12],[133,133],[8232,8233]],"Extend":[[768,879],[1155,1161],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1552,1562],[1611,1631],[1648,1648],[1750,1756],[1759,1764],[1767,1768],[1770,1773],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2070,2073],[2075,2083],[2085,2087],[2089,2093],[2137,2139],[2276,2302],[2304,2307],[2362,2364],[2366,2383],[2385,2391],[2402,2403],[2433,2435],[2492,2492],[2494,2500],[2503,2504],[2507,2509],[2519,2519],[2530,2531],[2561,2563],[2620,2620],[2622,2626],[2631,2632],[2635,2637],[2641,2641],[2672,2673],[2677,2677],[2689,2691],[2748,2748],[2750,2757],[2759,2761],[2763,2765],[2786,2787],[2817,2819],[2876,2876],[2878,2884],[2887,2888],[2891,2893],[2902,2903],[2914,2915],[2946,2946],[3006,3010],[3014,3016],[3018,3021],[3031,3031],[3073,3075],[3134,3140],[3142,3144],[3146,3149],[3157,3158],[3170,3171],[3202,3203],[3260,3260],[3262,3268],[3270,3272],[3274,3277],[3285,3286],[3298,3299],[3330,3331],[3390,3396],[3398,3400],[3402,3405],[3415,3415],[3426,3427],[3458,3459],[3530,3530],[3535,3540],[3542,3542],[3544,3551],[3570,3571],[3633,3633],[3636,3642],[3655,3662],[3761,3761],[3764,3769],[3771,3772],[3784,3789],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3902,3903],[3953,3972],[3974,3975],[3981,3991],[3993,4028],[4038,4038],[4139,4158],[4182,4185],[4190,4192],[4194,4196],[4199,4205],[4209,4212],[4226,4237],[4239,4239],[4250,4253],[4957,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6068,6099],[6109,6109],[6155,6157],[6313,6313],[6432,6443],[6448,6459],[6576,6592],[6600,6601],[6679,6683],[6741,6750],[6752,6780],[6783,6783],[6912,6916],[6964,6980],[7019,7027],[7040,7042],[7073,7085],[7142,7155],[7204,7223],[7376,7378],[7380,7400],[7405,7405],[7410,7412],[7616,7654],[7676,7679],[8204,8205],[8400,8432],[11503,11505],[11647,11647],[11744,11775],[12330,12335],[12441,12442],[42607,42610],[42612,42621],[42655,42655],[42736,42737],[43010,43010],[43014,43014],[43019,43019],[43043,43047],[43136,43137],[43188,43204],[43232,43249],[43302,43309],[43335,43347],[43392,43395],[43443,43456],[43561,43574],[43587,43587],[43596,43597],[43643,43643],[43696,43696],[43698,43700],[43703,43704],[43710,43711],[43713,43713],[43755,43759],[43765,43766],[44003,44010],[44012,44013],[64286,64286],[65024,65039],[65056,65062],[65438,65439],[66045,66045],[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[69632,69634],[69688,69702],[69760,69762],[69808,69818],[69888,69890],[69927,69940],[70016,70018],[70067,70080],[71339,71351],[94033,94078],[94095,94098],[119141,119145],[119149,119154],[119163,119170],[119173,119179],[119210,119213],[119362,119364],[917760,917999]],"Regional_Indicator":[[127462,127487]],"Format":[[173,173],[1536,1540],[1564,1564],[1757,1757],[1807,1807],[6158,6158],[8206,8207],[8234,8238],[8288,8292],[8294,8303],[65279,65279],[65529,65531],[69821,69821],[119155,119162],[917505,917505],[917536,917631]],"Katakana":[[12337,12341],[12443,12444],[12448,12538],[12540,12543],[12784,12799],[13008,13054],[13056,13143],[65382,65437],[110592,110592]],"ALetter":[[65,90],[97,122],[170,170],[181,181],[186,186],[192,214],[216,246],[248,705],[710,721],[736,740],[748,748],[750,750],[880,884],[886,887],[890,893],[902,902],[904,906],[908,908],[910,929],[931,1013],[1015,1153],[1162,1319],[1329,1366],[1369,1369],[1377,1415],[1523,1523],[1568,1610],[1646,1647],[1649,1747],[1749,1749],[1765,1766],[1774,1775],[1786,1788],[1791,1791],[1808,1808],[1810,1839],[1869,1957],[1969,1969],[1994,2026],[2036,2037],[2042,2042],[2048,2069],[2074,2074],[2084,2084],[2088,2088],[2112,2136],[2208,2208],[2210,2220],[2308,2361],[2365,2365],[2384,2384],[2392,2401],[2417,2423],[2425,2431],[2437,2444],[2447,2448],[2451,2472],[2474,2480],[2482,2482],[2486,2489],[2493,2493],[2510,2510],[2524,2525],[2527,2529],[2544,2545],[2565,2570],[2575,2576],[2579,2600],[2602,2608],[2610,2611],[2613,2614],[2616,2617],[2649,2652],[2654,2654],[2674,2676],[2693,2701],[2703,2705],[2707,2728],[2730,2736],[2738,2739],[2741,2745],[2749,2749],[2768,2768],[2784,2785],[2821,2828],[2831,2832],[2835,2856],[2858,2864],[2866,2867],[2869,2873],[2877,2877],[2908,2909],[2911,2913],[2929,2929],[2947,2947],[2949,2954],[2958,2960],[2962,2965],[2969,2970],[2972,2972],[2974,2975],[2979,2980],[2984,2986],[2990,3001],[3024,3024],[3077,3084],[3086,3088],[3090,3112],[3114,3123],[3125,3129],[3133,3133],[3160,3161],[3168,3169],[3205,3212],[3214,3216],[3218,3240],[3242,3251],[3253,3257],[3261,3261],[3294,3294],[3296,3297],[3313,3314],[3333,3340],[3342,3344],[3346,3386],[3389,3389],[3406,3406],[3424,3425],[3450,3455],[3461,3478],[3482,3505],[3507,3515],[3517,3517],[3520,3526],[3840,3840],[3904,3911],[3913,3948],[3976,3980],[4256,4293],[4295,4295],[4301,4301],[4304,4346],[4348,4680],[4682,4685],[4688,4694],[4696,4696],[4698,4701],[4704,4744],[4746,4749],[4752,4784],[4786,4789],[4792,4798],[4800,4800],[4802,4805],[4808,4822],[4824,4880],[4882,4885],[4888,4954],[4992,5007],[5024,5108],[5121,5740],[5743,5759],[5761,5786],[5792,5866],[5870,5872],[5888,5900],[5902,5905],[5920,5937],[5952,5969],[5984,5996],[5998,6000],[6176,6263],[6272,6312],[6314,6314],[6320,6389],[6400,6428],[6656,6678],[6917,6963],[6981,6987],[7043,7072],[7086,7087],[7098,7141],[7168,7203],[7245,7247],[7258,7293],[7401,7404],[7406,7409],[7413,7414],[7424,7615],[7680,7957],[7960,7965],[7968,8005],[8008,8013],[8016,8023],[8025,8025],[8027,8027],[8029,8029],[8031,8061],[8064,8116],[8118,8124],[8126,8126],[8130,8132],[8134,8140],[8144,8147],[8150,8155],[8160,8172],[8178,8180],[8182,8188],[8305,8305],[8319,8319],[8336,8348],[8450,8450],[8455,8455],[8458,8467],[8469,8469],[8473,8477],[8484,8484],[8486,8486],[8488,8488],[8490,8493],[8495,8505],[8508,8511],[8517,8521],[8526,8526],[8544,8584],[9398,9449],[11264,11310],[11312,11358],[11360,11492],[11499,11502],[11506,11507],[11520,11557],[11559,11559],[11565,11565],[11568,11623],[11631,11631],[11648,11670],[11680,11686],[11688,11694],[11696,11702],[11704,11710],[11712,11718],[11720,11726],[11728,11734],[11736,11742],[11823,11823],[12293,12293],[12347,12348],[12549,12589],[12593,12686],[12704,12730],[40960,42124],[42192,42237],[42240,42508],[42512,42527],[42538,42539],[42560,42606],[42623,42647],[42656,42735],[42775,42783],[42786,42888],[42891,42894],[42896,42899],[42912,42922],[43000,43009],[43011,43013],[43015,43018],[43020,43042],[43072,43123],[43138,43187],[43250,43255],[43259,43259],[43274,43301],[43312,43334],[43360,43388],[43396,43442],[43471,43471],[43520,43560],[43584,43586],[43588,43595],[43744,43754],[43762,43764],[43777,43782],[43785,43790],[43793,43798],[43808,43814],[43816,43822],[43968,44002],[44032,55203],[55216,55238],[55243,55291],[64256,64262],[64275,64279],[64336,64433],[64467,64829],[64848,64911],[64914,64967],[65008,65019],[65136,65140],[65142,65276],[65313,65338],[65345,65370],[65440,65470],[65474,65479],[65482,65487],[65490,65495],[65498,65500],[65536,65547],[65549,65574],[65576,65594],[65596,65597],[65599,65613],[65616,65629],[65664,65786],[65856,65908],[66176,66204],[66208,66256],[66304,66334],[66352,66378],[66432,66461],[66464,66499],[66504,66511],[66513,66517],[66560,66717],[67584,67589],[67592,67592],[67594,67637],[67639,67640],[67644,67644],[67647,67669],[67840,67861],[67872,67897],[67968,68023],[68030,68031],[68096,68096],[68112,68115],[68117,68119],[68121,68147],[68192,68220],[68352,68405],[68416,68437],[68448,68466],[68608,68680],[69635,69687],[69763,69807],[69840,69864],[69891,69926],[70019,70066],[70081,70084],[71296,71338],[73728,74606],[74752,74850],[77824,78894],[92160,92728],[93952,94020],[94032,94032],[94099,94111],[119808,119892],[119894,119964],[119966,119967],[119970,119970],[119973,119974],[119977,119980],[119982,119993],[119995,119995],[119997,120003],[120005,120069],[120071,120074],[120077,120084],[120086,120092],[120094,120121],[120123,120126],[120128,120132],[120134,120134],[120138,120144],[120146,120485],[120488,120512],[120514,120538],[120540,120570],[120572,120596],[120598,120628],[120630,120654],[120656,120686],[120688,120712],[120714,120744],[120746,120770],[120772,120779],[126464,126467],[126469,126495],[126497,126498],[126500,126500],[126503,126503],[126505,126514],[126516,126519],[126521,126521],[126523,126523],[126530,126530],[126535,126535],[126537,126537],[126539,126539],[126541,126543],[126545,126546],[126548,126548],[126551,126551],[126553,126553],[126555,126555],[126557,126557],[126559,126559],[126561,126562],[126564,126564],[126567,126570],[126572,126578],[126580,126583],[126585,126588],[126590,126590],[126592,126601],[126603,126619],[126625,126627],[126629,126633],[126635,126651]],"MidLetter":[[58,58],[183,183],[727,727],[903,903],[1524,1524],[8231,8231],[65043,65043],[65109,65109],[65306,65306]],"MidNum":[[44,44],[59,59],[894,894],[1417,1417],[1548,1549],[1644,1644],[2040,2040],[8260,8260],[65040,65040],[65044,65044],[65104,65104],[65108,65108],[65292,65292],[65307,65307]],"MidNumLet":[[46,46],[8216,8217],[8228,8228],[65106,65106],[65287,65287],[65294,65294]],"Numeric":[[48,57],[1632,1641],[1643,1643],[1776,1785],[1984,1993],[2406,2415],[2534,2543],[2662,2671],[2790,2799],[2918,2927],[3046,3055],[3174,3183],[3302,3311],[3430,3439],[3664,3673],[3792,3801],[3872,3881],[4160,4169],[4240,4249],[6112,6121],[6160,6169],[6470,6479],[6608,6617],[6784,6793],[6800,6809],[6992,7001],[7088,7097],[7232,7241],[7248,7257],[42528,42537],[43216,43225],[43264,43273],[43472,43481],[43600,43609],[44016,44025],[66720,66729],[69734,69743],[69872,69881],[69942,69951],[70096,70105],[71360,71369],[120782,120831]],"ExtendNumLet":[[95,95],[8255,8256],[8276,8276],[65075,65076],[65101,65103],[65343,65343]]}};

    CodePoint.get_property_data = function(property_name) {
      var k, property_data, property_data_formatted, range, v, _i, _len, _ref;
      if (this.property_data_cache[property_name] != null) {
        return this.property_data_cache[property_name];
      }
      property_data = this.property_data[property_name];
      property_data_formatted = {};
      for (k in property_data) {
        v = property_data[k];
        property_data_formatted[k] = [];
        _ref = property_data[k];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          range = _ref[_i];
          property_data_formatted[k].push(new TwitterCldr.Range(range[0], range[1]));
        }
      }
      return this.property_data_cache[property_name] = property_data_formatted;
    };

    CodePoint.index_cache = {};

    CodePoint.property_data_cache = {};

    CodePoint.get_block_name = function(code_point) {
      var k, range, _ref;
      if (this.block_cache[code_point] != null) {
        return this.block_cache[code_point];
      }
      _ref = this.blocks;
      for (k in _ref) {
        range = _ref[k];
        range = new TwitterCldr.Range(range[0], range[1]);
        if (range.includes(code_point)) {
          return this.block_cache[code_point] = k;
        }
      }
      return null;
    };

    return CodePoint;

  })();

  TwitterCldr.PhoneCodes = (function() {
    function PhoneCodes() {}

    PhoneCodes.phone_codes = {"ac":"247","ad":"376","ae":"971","af":"93","ag":"1","ai":"1","al":"355","am":"374","ao":"244","aq":"672","ar":"54","as":"1","at":"43","au":"61","aw":"297","ax":"358","az":"994","ba":"387","bb":"1","bd":"880","be":"32","bf":"226","bg":"359","bh":"973","bi":"257","bj":"229","bl":"590","bm":"1","bn":"673","bo":"591","bq":"599","br":"55","bs":"1","bt":"975","bw":"267","by":"375","bz":"501","ca":"1","cc":"61","cd":"243","cf":"236","cg":"242","ch":"41","ci":"225","ck":"682","cl":"56","cm":"237","cn":"86","co":"57","cr":"506","cu":"53","cv":"238","cw":"599","cx":"61","cy":"357","cz":"420","de":"49","dj":"253","dk":"45","dm":"1","do":"1","dz":"213","ec":"593","ee":"372","eg":"20","eh":"212","er":"291","es":"34","et":"251","fi":"358","fj":"679","fk":"500","fm":"691","fo":"298","fr":"33","ga":"241","gb":"44","gd":"1","ge":"995","gf":"594","gg":"44","gh":"233","gi":"350","gl":"299","gm":"220","gn":"224","gp":"590","gq":"240","gr":"30","gs":"500","gt":"502","gu":"1","gw":"245","gy":"592","hk":"852","hn":"504","hr":"385","ht":"509","hu":"36","id":"62","ie":"353","il":"972","im":"44","in":"91","io":"246","iq":"964","ir":"98","is":"354","it":"39","je":"44","jm":"1","jo":"962","jp":"81","ke":"254","kg":"996","kh":"855","ki":"686","km":"269","kn":"1","kp":"850","kr":"82","kw":"965","ky":"1","kz":"7","la":"856","lb":"961","lc":"1","li":"423","lk":"94","lr":"231","ls":"266","lt":"370","lu":"352","lv":"371","ly":"218","ma":"212","mc":"377","md":"373","me":"382","mf":"590","mg":"261","mh":"692","mk":"389","ml":"223","mm":"95","mn":"976","mo":"853","mp":"1","mq":"596","mr":"222","ms":"1","mt":"356","mu":"230","mv":"960","mw":"265","mx":"52","my":"60","mz":"258","na":"264","nc":"687","ne":"227","nf":"672","ng":"234","ni":"505","nl":"31","no":"47","np":"977","nr":"674","nu":"683","nz":"64","om":"968","pa":"507","pe":"51","pf":"689","pg":"675","ph":"63","pk":"92","pl":"48","pm":"508","pn":"870","pr":"1","ps":"972","pt":"351","pw":"680","py":"595","qa":"974","re":"262","ro":"40","rs":"381","ru":"7","rw":"250","sa":"966","sb":"677","sc":"248","sd":"249","se":"46","sg":"65","sh":"290","si":"386","sj":"47","sk":"421","sl":"232","sm":"378","sn":"221","so":"252","sr":"597","ss":"211","st":"239","sv":"503","sx":"1","sy":"963","sz":"268","tc":"1","td":"235","tf":"262","tg":"228","th":"66","tj":"992","tk":"690","tl":"670","tm":"993","tn":"216","to":"676","tr":"90","tt":"1","tv":"688","tw":"886","tz":"255","ua":"380","ug":"256","um":"1","us":"1","uy":"598","uz":"998","va":"39","vc":"1","ve":"58","vg":"1","vi":"1","vn":"84","vu":"678","wf":"681","ws":"685","xk":"377","ye":"967","yt":"262","za":"27","zm":"260","zw":"263"};

    PhoneCodes.territories = function() {
      var data, _;
      return this.codes || (this.codes = (function() {
        var _ref, _results;
        _ref = this.phone_codes;
        _results = [];
        for (data in _ref) {
          _ = _ref[data];
          _results.push(data);
        }
        return _results;
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
      var data, _;
      return this.codes || (this.codes = (function() {
        var _results;
        _results = [];
        for (data in postal_codes) {
          _ = postal_codes[data];
          _results.push(data);
        }
        return _results;
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

    Languages.all = {"aa":"Αφάρ","ab":"Αμπχαζικά","ace":"Αχινίζ","ach":"Ακολί","ada":"Αντάνγκμε","ady":"Αντιγκέα","ae":"Αβεστάν","af":"Αφρικάανς","afh":"Αφριχίλι","agq":"Αγκέμ","ain":"Αϊνού","ak":"Ακάν","akk":"Ακάντιαν","ale":"Αλούτ","alt":"Νότια Αλαταϊκά","am":"Αμαρικά","an":"Αραγκονικά","ang":"Παλαιά Αγγλικά","anp":"Ανγκικά","ar":"Αραβικά","ar-001":"Σύγχρονα Τυπικά Αραβικά","arc":"Αραμαϊκά","arn":"Αρουκάνιαν","arp":"Αράπαχο","arw":"Αραγουάκ","as":"Ασαμεζικά","asa":"Άσου","ast":"Αστουριανά","av":"Άβαρικ","awa":"Αγουαντί","ay":"Αϊμάρα","az":"Αζερικά","ba":"Μπασκίρ","bal":"Μπαλούτσι","ban":"Μπαλινίζ","bas":"Μπάσα","bax":"Μπαμούν","bbj":"Γκομάλα","be":"Λευκορωσικά","bej":"Μπέζα","bem":"Μπέμπα","bez":"Μπένα","bfd":"Μπαφούτ","bg":"Βουλγαρικά","bho":"Μποζπούρι","bi":"Μπισλάμα","bik":"Μπικόλ","bin":"Μπίνι","bkm":"Κομ","bla":"Σικσίκα","bm":"Μπαμπάρα","bn":"Μπενγκάλι","bo":"Θιβετιανά","br":"Βρετονικά","bra":"Μπρατζ","brx":"Μπόντο","bs":"Βοσνιακά","bss":"Ακόσι","bua":"Μπουριάτ","bug":"Μπουγκίζ","bum":"Μπουλού","byn":"Μπλιν","byv":"Μεντούμπα","ca":"Καταλανικά","cad":"Κάντο","car":"Καρίμπ","cay":"Καγιούγκα","cch":"Ατσάμ","ce":"Τσέτσνιαν","ceb":"Κεμπουάνο","cgg":"Τσίγκα","ch":"Καμόρρο","chb":"Τσίμπτσα","chg":"Τσαγκατάι","chk":"Τσουκίζι","chm":"Μάρι","chn":"Ιδιωματικά Σινούκ","cho":"Τσοκτάου","chp":"Τσίπιουαν","chr":"Τσερόκι","chy":"Σεγιέν","ckb":"Κουρδικά Σοράνι","co":"Κορσικανικά","cop":"Κοπτικά","cr":"Κρι","crh":"Τουρκικά Κριμαίας","cs":"Τσεχικά","csb":"Κασούμπιαν","cu":"Εκκλησιαστικά Σλαβικά","cv":"Χουβάς","cy":"Ουαλικά","da":"Δανικά","dak":"Ντακότα","dar":"Ντάργκουα","dav":"Τάιτα","de":"Γερμανικά","de-AT":"Γερμανικά Αυστρίας","de-CH":"Γερμανικά Ελβετίας","del":"Ντέλαγουερ","den":"Σλαβικά","dgr":"Ντόγκριμπ","din":"Ντίνκα","dje":"Ζάρμα","doi":"Ντόγκρι","dsb":"Γλώσσα Κάτω Λουσατίας","dua":"Ντουάλα","dum":"Μέσα Ολλανδικά","dv":"Ντιβέχι","dyo":"Τζόλα-Φόνι","dyu":"Ντογιούλα","dz":"Ντζόνγκχα","dzg":"Νταζάγκα","ebu":"Έμπου","ee":"Γι","efi":"Εφίκ","egy":"Αρχαία Αιγυπτιακά","eka":"Εκατζούκ","el":"Ελληνικά","elx":"Ελαμάιτ","en":"Αγγλικά","en-AU":"Αγγλικά Αυστραλίας","en-CA":"Αγγλικά Καναδά","en-GB":"Αγγλικά ΗΒ","en-US":"Αγγλικά ΗΠΑ","enm":"Μέσα Αγγλικά","eo":"Εσπεράντο","es":"Ισπανικά","es-419":"Ισπανικά Λατινικής Αμερικής","es-ES":"Ισπανικά Ευρώπης","es-MX":"Ισπανικά Μεξικού","et":"Εσθονικά","eu":"Βασκικά","ewo":"Εγουόντο","fa":"Περσικά","fan":"Φανγκ","fat":"Φάντι","ff":"Φουλάχ","fi":"Φινλανδικά","fil":"Φιλιππινεζικά","fj":"Φίτζι","fo":"Φαρόε","fon":"Φον","fr":"Γαλλικά","fr-CA":"Γαλλικά Καναδά","fr-CH":"Γαλλικά Ελβετίας","frm":"Μέσα Γαλλικά","fro":"Παλαιά Γαλλικά","frr":"Βόρεια Φριζιανά","frs":"Ανατολικά Φριζιανά","fur":"Φριούλιαν","fy":"Δυτικά Φριζιανά","ga":"Ιρλανδικά","gaa":"Γκα","gag":"Γκαγκάουζ","gay":"Γκάγιο","gba":"Γκμπάγια","gd":"Σκωτικά Κελτικά","gez":"Γκιζ","gil":"Γκιλμπερτίζ","gl":"Γαλικιανά","gmh":"Μέσα Άνω Γερμανικά","gn":"Γκουαρανί","goh":"Παλαιά Άνω Γερμανικά","gon":"Γκόντι","gor":"Γκοροντάλο","got":"Γοτθικά","grb":"Γκρίμπο","grc":"Αρχαία Ελληνικά","gsw":"Ελβετικά Γερμανικά","gu":"Γκουγιαράτι","guz":"Γκούσι","gv":"Μανξ","gwi":"Γκουίτσιν","ha":"Χάουσα","hai":"Χάιντα","haw":"Χαβανεζικά","he":"Εβραϊκά","hi":"Χίντι","hil":"Χιλιγκαγιόν","hit":"Χιτίτε","hmn":"Χμονγκ","ho":"Χίρι Μότου","hr":"Κροατικά","hsb":"Γλώσσα Άνω Λουσατίας","ht":"Αϊτιανά","hu":"Ουγγρικά","hup":"Χούπα","hy":"Αρμενικά","hz":"Χερέρο","ia":"Ιντερλίνγκουα","iba":"Ιμπάν","ibb":"Ιμπίμπιο","id":"Ινδονησιακά","ie":"Ιντερλίνγκουε","ig":"Ίγκμπο","ii":"Σικουάν Γι","ik":"Ινουπιάκ","ilo":"Ιλόκο","inh":"Ινγκούς","io":"Ίντο","is":"Ισλανδικά","it":"Ιταλικά","iu":"Ινουκτιτούτ","ja":"Ιαπωνικά","jbo":"Λόζμπαν","jgo":"Νγκόμπα","jmc":"Μάχαμε","jpr":"Ιουδαϊκά-Περσικά","jrb":"Ιουδαϊκά-Αραβικά","jv":"Ιαβανεζικά","ka":"Γεωργιανά","kaa":"Κάρα-Καλπάκ","kab":"Καμπίλε","kac":"Κατσίν","kaj":"Τζου","kam":"Κάμπα","kaw":"Κάουι","kbd":"Καμπαρντιανά","kbl":"Κανέμπου","kcg":"Τουάπ","kde":"Μακόντε","kea":"Γλώσσα του Πράσινου Ακρωτηρίου","kfo":"Κόρο","kg":"Κονγκό","kha":"Κάσι","kho":"Κοτανικά","khq":"Κόιρα Τσίνι","ki":"Κικούγιου","kj":"Κουανιγιάμα","kk":"Καζακικά","kkj":"Κάκο","kl":"Καλαάλισουτ","kln":"Καλεντζίν","km":"Καμποτζιανά","kmb":"Κιμπούντου","kn":"Κανάντα","ko":"Κορεατικά","koi":"Κόμι-Περμιάκ","kok":"Κονκάνι","kos":"Κοσραενικά","kpe":"Κπέλε","kr":"Κανούρι","krc":"Καρατσάι-Μπαλκάρ","krl":"Καρελιακά","kru":"Κουρούχ","ks":"Κασμίρι","ksb":"Σάμπαλα","ksf":"Μπάφια","ksh":"Κολωνικά","ku":"Κουρδικά","kum":"Κουμγιούκ","kut":"Κουτενάι","kv":"Κόμι","kw":"Κόρνις","ky":"Κυργιζικά","la":"Λατινικά","lad":"Λαδίνο","lag":"Λάνγκι","lah":"Λάχδα","lam":"Λάμπα","lb":"Λουξεμβουργιανά","lez":"Λαζγκιάν","lg":"Γκάντα","li":"Λιμβουργιανά","lkt":"Λακότα","ln":"Λινγκάλα","lo":"Λαοθιανά","lol":"Μόνγκο","loz":"Λόζι","lt":"Λιθουανικά","lu":"Λούμπα-Κατάνγκα","lua":"Λούμπα-Λουλούα","lui":"Λουισένο","lun":"Λούντα","luo":"Λούο","lus":"Λουσάι","luy":"Λουχία","lv":"Λετονικά","mad":"Μαντουρίζ","maf":"Μάφα","mag":"Μαγκάχι","mai":"Μαϊτχίλι","mak":"Μακαζάρ","man":"Μαντίνγκο","mas":"Μασάι","mde":"Μάμπα","mdf":"Μόκσα","mdr":"Μανδάρ","men":"Μέντε","mer":"Μερού","mfe":"Μορίσιεν","mg":"Μαλαγάσι","mga":"Μέσα Ιρλανδικά","mgh":"Μακούβα-Μέτο","mgo":"Μετά","mh":"Μάρσαλ","mi":"Μάορι","mic":"Μικμάκ","min":"Μινανγκαμπάου","mk":"Σλαβομακεδονικά","ml":"Μαλαγιαλάμ","mn":"Μογγολικά","mnc":"Μαντσού","mni":"Μανιπούρι","moh":"Μοχόκ","mos":"Μόσι","mr":"Μαράθι","ms":"Μαλάι","mt":"Μαλτεζικά","mua":"Μουντάνγκ","mul":"Πολλαπλές γλώσσες","mus":"Κρικ","mwl":"Μιραντεζικά","mwr":"Μαργουάρι","my":"Βιρμανικά","mye":"Μιένε","myv":"Έρζυα","na":"Ναούρου","nap":"Ναπολιτανικά","naq":"Νάμα","nb":"Νορβηγικά Μποκμάλ","nd":"Ντεμπέλε Βορρά","nds":"Κάτω Γερμανικά","ne":"Νεπάλι","new":"Νεγουάρι","ng":"Ντόνγκα","nia":"Νίας","niu":"Νιούεαν","nl":"Ολλανδικά","nl-BE":"Φλαμανδικά","nmg":"Κβάσιο","nn":"Νορβηγικά Νινόρσκ","nnh":"Νγκιεμπούν","no":"Νορβηγικά","nog":"Νογκάι","non":"Παλαιά Νορβηγικά","nqo":"Ν’Κο","nr":"Ντεμπέλε Νότου","nso":"Βόρεια Σόθο","nus":"Νουέρ","nv":"Νάβαχο","nwc":"Κλασικά Νεουάρι","ny":"Νιάντζα","nym":"Νιαμγουέζι","nyn":"Νιανκόλε","nyo":"Νιόρο","nzi":"Νζίμα","oc":"Οκσιτανικά","oj":"Οζιβίγουα","om":"Ορόμο","or":"Ορίγια","os":"Οσετικά","osa":"Οσάζ","ota":"Οθωμανικά Τουρκικά","pa":"Παντζαπικά","pag":"Πανγκασινάν","pal":"Παχλάβι","pam":"Παμπάνγκα","pap":"Παπιαμέντο","pau":"Παλάουαν","peo":"Αρχαία Περσικά","phn":"Φοινικικά","pi":"Πάλι","pl":"Πολωνικά","pon":"Ποχπέιαν","pro":"Παλαιά Προβενσιάλ","ps":"Πάστο","pt":"Πορτογαλικά","pt-BR":"Πορτογαλικά Βραζιλίας","pt-PT":"Πορτογαλικά Ευρώπης","qu":"Κετσούα","quc":"Κισέ","raj":"Ραζασθάνι","rap":"Ραπανούι","rar":"Ραροτονγκάν","rm":"Ρομανικά","rn":"Ρούντι","ro":"Ρουμανικά","ro-MD":"Μολδαβικά","rof":"Ρόμπο","rom":"Ρομανί","root":"Ρουτ","ru":"Ρωσικά","rup":"Αρομανικά","rw":"Κινιαρβάντα","rwk":"Ρουά","sa":"Σανσκριτικά","sad":"Σαντάγουε","sah":"Γιακούτ","sam":"Σαμαρίτικα Αραμαϊκά","saq":"Σαμπούρου","sas":"Σασάκ","sat":"Σαντάλι","sba":"Νγκαμπέι","sbp":"Σάνγκου","sc":"Σαρδινικά","scn":"Σικελιανά","sco":"Σκωτικά","sd":"Σίντι","se":"Βόρεια Σάμι","see":"Σένεκα","seh":"Σένα","sel":"Σελκούπ","ses":"Κοϊραμπόρο Σένι","sg":"Σάνγκο","sga":"Παλαιά Ιρλανδικά","sh":"Σερβοκροατικά","shi":"Τασελχίτ","shn":"Σαν","shu":"Αραβικά του Τσαντ","si":"Σινχαλεζικά","sid":"Σιντάμο","sk":"Σλοβακικά","sl":"Σλοβενικά","sm":"Σαμόαν","sma":"Νότια Σάμι","smj":"Λούλε Σάμι","smn":"Ινάρι Σάμι","sms":"Σκολτ Σάμι","sn":"Σχόνα","snk":"Σονίνκε","so":"Σομάλι","sog":"Σογκντιέν","sq":"Αλβανικά","sr":"Σερβικά","srn":"Σρανάρ Τόνγκο","srr":"Σερέρ","ss":"Σουάτι","ssy":"Σάχο","st":"Νότια Σόθο","su":"Σουδανικά","suk":"Σουκούμα","sus":"Σούσου","sux":"Σουμερικά","sv":"Σουηδικά","sw":"Σουαχίλι","swb":"Κομόρρια","swc":"Κονγκό Σουαχίλι","syc":"Κλασικά Συριακά","syr":"Συριακά","ta":"Ταμίλ","te":"Τελούγκου","tem":"Τίμνε","teo":"Τέσο","ter":"Τερένο","tet":"Τέτουμ","tg":"Τατζίκ","th":"Ταϊλανδικά","ti":"Τιγκρίνυα","tig":"Τίγκρε","tiv":"Τιβ","tk":"Τουρκμενικά","tkl":"Τοκελάου","tl":"Ταγκαλόγκ","tlh":"Κλίνγκον","tli":"Τλίνγκιτ","tmh":"Ταμασέκ","tn":"Τσιγουάνα","to":"Τονγκανικά","tog":"Νιάσα Τόνγκα","tpi":"Τοκ Πισίν","tr":"Τουρκικά","trv":"Ταρόκο","ts":"Τσόνγκα","tsi":"Τσίμσιαν","tt":"Τατάρ","tum":"Τουμπούκα","tvl":"Τουβαλού","tw":"Τούι","twq":"Τασαβάκ","ty":"Ταϊτιανά","tyv":"Τουβίνιαν","tzm":"Ταμαζίτ Κεντρικού Μαρόκο","udm":"Ουντμούρτ","ug":"Ουιγκούρ","uga":"Ουγκαρίτικ","uk":"Ουκρανικά","umb":"Ουμπούντου","und":"Άγνωστη γλώσσα","ur":"Ουρντού","uz":"Ουζμπεκικά","vai":"Βάι","ve":"Βένδα","vi":"Βιετναμικά","vo":"Βόλαπικ","vot":"Βότικ","vun":"Βούντζο","wa":"Γουαλούν","wae":"Βάλσερ","wal":"Γουάλαμο","war":"Γουάρει","was":"Γουασό","wo":"Γουόλοφ","xal":"Καλμίκ","xh":"Ζόσα","xog":"Σόγκα","yao":"Γιάο","yap":"Γιαπίζ","yav":"Γιανγκμπέν","ybb":"Γιέμπα","yi":"Γίντις","yo":"Γιορούμπα","yue":"Καντονέζικα","za":"Ζουάνγκ","zap":"Ζάποτεκ","zbl":"Σύμβολα Bliss","zen":"Ζενάγκα","zgh":"Τυπικά Ταμαζίγκτ Μαρόκου","zh":"Κινεζικά","zh-Hans":"Απλοποιημένα Κινεζικά","zh-Hant":"Παραδοσιακά Κινεζικά","zu":"Ζουλού","zun":"Ζούνι","zxx":"Χωρίς γλωσσολογικό περιεχόμενο","zza":"Ζάζα"};

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

  TwitterCldr.UnicodeRegex = (function() {
    function UnicodeRegex(elements, modifiers) {
      this.elements = elements;
      this.modifiers = modifiers != null ? modifiers : "";
    }

    UnicodeRegex.compile = function(str, modifiers, symbol_table) {
      if (modifiers == null) {
        modifiers = "";
      }
      if (symbol_table == null) {
        symbol_table = null;
      }
      return new TwitterCldr.UnicodeRegex(this.get_parser().parse(this.get_tokenizer().tokenize(str), {
        "symbol_table": symbol_table
      }), modifiers);
    };

    UnicodeRegex.get_all_unicode = function() {
      return this.all_unicode || (this.all_unicode = new TwitterCldr.RangeSet([new TwitterCldr.Range(0, 0xFFFF)]));
    };

    UnicodeRegex.get_invalid_regexp_chars = function() {
      return this.invalid_regexp_chars || (this.invalid_regexp_chars = new TwitterCldr.RangeSet([new TwitterCldr.Range(2, 7), new TwitterCldr.Range(55296, 57343)]));
    };

    UnicodeRegex.get_valid_regexp_chars = function() {
      return this.valid_regexp_chars || (this.valid_regexp_chars = this.get_all_unicode().subtract(this.get_invalid_regexp_chars()));
    };

    UnicodeRegex.get_unsupported_chars = function() {
      return this.unsupported_chars || (this.unsupported_chars = new TwitterCldr.RangeSet([new TwitterCldr.Range(0x10000, 0x10FFFF)]));
    };

    UnicodeRegex.get_tokenizer = function() {
      return this.tokenizer = new TwitterCldr.UnicodeRegexTokenizer();
    };

    UnicodeRegex.get_parser = function() {
      return this.parser = new TwitterCldr.UnicodeRegexParser();
    };

    UnicodeRegex.prototype.to_regexp_str = function() {
      var element;
      return this.regexp_str || (this.regexp_str = ((function() {
        var _i, _len, _ref, _results;
        _ref = this.elements;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          _results.push(element.to_regexp_str());
        }
        return _results;
      }).call(this)).join(""));
    };

    UnicodeRegex.prototype.to_regexp = function() {
      return new RegExp(this.to_regexp_str(), this.modifiers);
    };

    UnicodeRegex.prototype.match = function(str) {
      return str.match(this.to_regexp());
    };

    return UnicodeRegex;

  })();

  TwitterCldr.BreakIterator = (function() {
    function BreakIterator(locale, options) {
      if (locale == null) {
        locale = TwitterCldr.locale;
      }
      if (options == null) {
        options = {};
      }
      this.locale = locale;
      this.use_uli_exceptions = (options["use_uli_exceptions"] != null ? options["use_uli_exceptions"] : true);
      this.exceptions_cache = {};
      this.segmentation_tokenizer = new TwitterCldr.SegmentationTokenizer();
      this.segmentation_parser = new TwitterCldr.SegmentationParser();
      this.tailoring_resource_data = {"en":{"en":{"segments":{"SentenceBreak":{"rules":[{"id":9,"value":" ( $STerm | $ATerm ) $Close* ÷ ( $Close | $Sp | $Sep | $CR | $LF ) "}]}}}}};
      this.exceptions_resource_data = {"de":{"de":{"exceptions":["A.","A.M.","Abs.","Abt.","Abw.","Adj.","Adr.","Akt.","Allg.","Alt.","App.","Apr.","Art.","Aug.","Ausg.","Ausschl.","B.","Bed.","Ben.","Ber.","Best.","Bibl.","C.","Ca.","Chin.","Chr.","Co.","D.","D. h.","Dat.","Dez.","Dim.","Dipl.-Ing.","Dipl.-Kfm.","Dir.","Dr.","Dtzd.","Einh.","Erf.","Evtl.","F.","F.f.","Fa.","Fam.","Fn.","Folg.","Forts. f.","Fr.","Frl.","G.","Gebr.","Gem.","Geograph.","Ges.","Gesch.","Ggf.","Hbf.","Hptst.","Hr./Hrn.","Hrsg.","I.","Inc.","Ing.","Inh.","Int.","J.","J.D.","Jahrh.","Jan.","Jr.","Kap.","Kfm.","Kl.","Konv.","Kop.","L.","Ltd.","M.","Max.","Min.","Mind.","Mio.","Mod.","Mrd.","Msp.","N.","Nov.","Nr.","O.","Obj.","Okt.","Op.","P.","P.M.","PIN.","Pfd.","Phys.","Port.","Prot.","Proz.","Qu.","R.","Rd.","Reg.","Reg.-Bez.","Rel.","Rep.","S.A.","Schr.","Sek.","Sept.","Spezif.","St.","StR.","Std.","Str.","T.","Tel.","Temp.","Test.","Trans.","Tägl.","U.","U. U.","U.S.","U.S.A.","U.U.","Urspr.","Ursprüngl.","Verf.","Vgl.","W.","Wg.","Y.","Z.","Z. B.","Z. Zt.","Ztr.","a.D.","a.M.","a.Rh.","a.a.O.","a.a.S.","am.","amtl.","b.","beil.","d.J.","d.Ä.","e.V.","e.Wz.","e.h.","ehem.","eigtl.","einschl.","entspr.","erw.","ev.","evtl.","exkl.","frz.","geb.","gedr.","gek.","gesch.","gest.","ggf./ggfs.","hpts.","i.A.","i.B.","i.H.","i.J.","i.R.","i.V.","inkl.","jew.","jhrl.","k. u. k.","k.u.k.","kath.","kfm.","kgl.","led.","m.E.","m.W.","mtl.","möbl.","n.u.Z.","näml.","o.A.","o.B.","o.g.","od.","p.Adr.","r.","röm.","röm.-kath.","s.","s.a.","schles.","schweiz.","schwäb.","sog.","südd.","tägl.","u.","u.A.w.g.","u.U.","u.a.","u.v.a.","u.Ä.","u.ä.","v. H.","v.Chr.","v.H.","v.R.w.","v.T.","v.u.Z.","verh.","verw.","vgl.","z.","z.B.","z.Hd.","z.Z.","zzgl.","österr."]}},"en":{"en":{"exceptions":["A.","A.D.","A.M.","A.S.","AA.","AB.","AD.","Abs.","Act.","Adj.","Adv.","All.","Alt.","Approx.","As.","Aug.","B.","B.V.","By.","C.F.","C.O.D.","Cap.","Capt.","Card.","Col.","Comm.","Conn.","Cont.","D.","D.A.","D.C.","DC.","Dec.","Def.","Dept.","Diff.","Do.","E.","E.G.","E.g.","Ed.","Est.","Etc.","Ex.","Exec.","F.","Feb.","Fn.","Fri.","G.","Gb.","Go.","Hat.","Hon.B.A.","Hz.","I.","I.D.","I.T.","I.e.","Id.","In.","Is.","J.B.","J.D.","J.K.","Jam.","Jan.","Job.","Joe.","Jun.","K.","K.R.","Kb.","L.","L.A.","L.P.","Lev.","Lib.","Link.","Long.","Lt.","Lt.Cdr.","M.","M.I.T.","M.R.","M.T.","MR.","Maj.","Mar.","Mart.","Mb.","Md.","Mgr.","Min.","Misc.","Mr.","Mrs.","Ms.","Mt.","N.V.","N.Y.","Nov.","Nr.","Num.","O.","OK.","Ok.","On.","Op.","Or.","Org.","P.M.","P.O.","P.V.","PC.","PP.","Ph.D.","Phys.","Pro.","Prof.","Pvt.","Q.","R.L.","R.T.","Rep.","Rev.","S.","S.A.","S.A.R.","S.E.","S.p.A.","Sep.","Sept.","Sgt.","Sq.","T.","To.","U.","U.S.","U.S.A.","U.S.C.","Up.","VS.","Var.","X.","Yr.","Z.","a.m.","exec.","pp.","vs."]}},"es":{"es":{"exceptions":["A.C.","AA.","All.","Ant.","Av.","Avda.","Bien.","C.","C.P.","C.S.","C.V.","CA.","Col.","Comm.","Corp.","Cía.","D.","DC.","Da.","Desc.","Desv.","Dr.","Dra.","Drs.","Dto.","Dª.","Dña.","Em.","Emm.","Exc.","Excma.","Excmas.","Excmo.","Excmos.","Exma.","Exmas.","Exmo.","Exmos.","FF.CC.","Fabric.","Fr.","H.P.","Id.","Ilma.","Ilmas.","Ilmo.","Ilmos.","Inc.","JJ.OO.","K.","Kit.","Korn.","L.","Lcda.","Lcdo.","Lda.","Ldo.","Lic.","Ltd.","Ltda.","Ltdo.","M.","MM.","Mons.","Mr.","Mrs.","O.M.","PP.","R.D.","R.U.","RAM.","RR.HH.","Rdo.","Rdos.","Reg.","Rev.","Rol.","Rvdmo.","Rvdmos.","Rvdo.","Rvdos.","SA.","SS.AA.","SS.MM.","Sdad.","Seg.","Sol.","Sr.","Sra.","Sras.","Sres.","Srta.","Srtas.","Sta.","Sto.","Trab.","U.S.","U.S.A.","Var.","Vda.","afma.","afmas.","afmo.","afmos.","bco.","bol.","c/c.","cap.","cf.","cfr.","col.","depto.","deptos.","doc.","dpto.","dptos.","dtor.","e.g.","ed.","ej.","fig.","figs.","fund.","hnos.","licda.","licdo.","ms.","mss.","mtro.","ntra.","ntro.","p.ej.","prof.","prov.","sras.","sres.","srs.","ss.","trad.","v.gr.","vid.","vs."]}},"fr":{"fr":{"exceptions":["All.","C.","Comm.","D.","DC.","Desc.","Inc.","Jr.","L.","M.","MM.","Mart.","Op.","P.","P.-D. G.","P.O.","Prof.","S.A.","S.M.A.R.T.","U.","U.S.","U.S.A.","Var.","W.","acoust.","adr.","anc.","ann.","anon.","append.","aux.","broch.","bull.","cam.","categ.","coll.","collab.","config.","dest.","dict.","dir.","doc.","encycl.","exempl.","fig.","gouv.","graph.","hôp.","ill.","illustr.","imm.","imprim.","indus.","niv.","quart.","réf.","symb.","synth.","syst.","trav. publ.","voit.","éd.","édit.","équiv.","éval."]}},"it":{"it":{"exceptions":["C.P.","Cfr.","D.","DC.","Geom.","Ing.","L.","Liv.","Ltd.","Mod.","N.B.","N.d.A.","N.d.E.","N.d.T.","O.d.G.","S.A.R.","S.M.A.R.T.","S.p.A.","Sig.","U.S.","U.S.A.","a.C.","ag.","all.","arch.","avv.","c.c.p.","d.C.","d.p.R.","div.","dott.","dr.","fig.","int.","mitt.","on.","p.","p.i.","pag.","rag.","sez.","tab.","tav.","ver.","vol."]}},"pt":{"pt":{"exceptions":["A.C.","Alm.","Av.","D.C","Dir.","Dr.","Dra.","Dras.","Drs.","E.","Est.","Exma.","Exmo.","Fr.","Ilma.","Ilmo.","Jr.","Ltd.","Ltda.","Mar.","N.Sra.","N.T.","Pe.","Ph.D.","R.","S.","S.A.","Sta.","Sto.","V.T.","W.C.","a.C.","a.m. ; A.M","abr.","abrev.","adm.","aer.","ago.","agric.","anat.","ap.","apart.","apt.","arit.","arqueol.","arquit.","astron.","autom.","aux.","biogr.","bras.","cap.","caps.","cat.","cel.","cf.","col.","com.","comp.","compl.","cont.","contab.","créd.","cx.","círc.","cód.","d.C.","des.","desc.","dez.","dipl.","dir.","div.","doc.","déb.","ed.","educ.","elem.","eletr.","eletrôn.","end.","eng.","esp.","ex.","f.","fac.","fasc.","fem.","fev.","ff.","fig.","fil.","filos.","fisiol.","fl.","fot.","fr.","fís.","geom.","gram.","gên.","hist.","ind.","ingl.","jan.","jul.","jun.","jur.","l.","lat.","lin.","lit.","liter.","long.","mai.","mar.","mat.","matem.","mov.","máq.","méd.","mús.","neol.","nov.","náut.","obs.","odont.","odontol.","org.","organiz.","out.","p.","p. ex.","p.m. ; P.M.","pal.","pol.","port.","pp.","pq.","prod.","prof.","profa.","pron.","próx.","psicol.","pág.","quím.","r.s.v.p.","ref.","rel.","relat.","rementente","rep.","res.","rod.","set.","sociol.","sup.","séc.","símb.","tec.","tecnol.","tel.","trad.","transp.","univ.","vol.","vs.","álg.","índ."]}},"ru":{"ru":{"exceptions":["кв.","отд.","проф.","руб.","тел.","тыс.","ул."]}}};
      this.root_resource = {"segments":{"GraphemeClusterBreak":{"rules":[{"id":3,"value":" $CR × $LF "},{"id":4,"value":" ( $Control | $CR | $LF ) ÷ "},{"id":5,"value":" ÷ ( $Control | $CR | $LF ) "},{"id":6,"value":" $L × ( $L | $V | $LV | $LVT ) "},{"id":7,"value":" ( $LV | $V ) × ( $V | $T ) "},{"id":8,"value":" ( $LVT | $T) × $T "},{"id":"8.1","value":" $Regional_Indicator × $Regional_Indicator "},{"id":9,"value":" × $Extend "},{"id":"9.1","value":" × $SpacingMark "}],"variables":[{"id":"$CR","value":"\\p{Grapheme_Cluster_Break=CR}"},{"id":"$LF","value":"\\p{Grapheme_Cluster_Break=LF}"},{"id":"$Control","value":"\\p{Grapheme_Cluster_Break=Control}"},{"id":"$Extend","value":"\\p{Grapheme_Cluster_Break=Extend}"},{"id":"$SpacingMark","value":"\\p{Grapheme_Cluster_Break=SpacingMark}"},{"id":"$L","value":"\\p{Grapheme_Cluster_Break=L}"},{"id":"$V","value":"\\p{Grapheme_Cluster_Break=V}"},{"id":"$T","value":"\\p{Grapheme_Cluster_Break=T}"},{"id":"$LV","value":"\\p{Grapheme_Cluster_Break=LV}"},{"id":"$LVT","value":"\\p{Grapheme_Cluster_Break=LVT}"},{"id":"$Regional_Indicator","value":"\\p{Grapheme_Cluster_Break=Regional_Indicator}"}]},"LineBreak":{"rules":[{"id":4,"value":" $BK ÷ "},{"id":"5.01","value":" $CR × $LF "},{"id":"5.02","value":" $CR ÷ "},{"id":"5.03","value":" $LF ÷ "},{"id":"5.04","value":" $NL ÷ "},{"id":6,"value":" × ( $BK | $CR | $LF | $NL ) "},{"id":"7.01","value":" × $SP "},{"id":"7.02","value":" × $ZW "},{"id":8,"value":" $ZW $SP* ÷ "},{"id":9,"value":" $Spec2_ × $CM "},{"id":"11.01","value":" × $WJ "},{"id":"11.02","value":" $WJ × "},{"id":12,"value":" $GL × "},{"id":"12.1","value":" $Spec3a_ × $GL "},{"id":"12.2","value":" $Spec3b_ $CM+ × $GL "},{"id":"12.3","value":" ^ $CM+ × $GL "},{"id":"13.01","value":" × $EX "},{"id":"13.02","value":" $Spec4_ × ($CL | $CP | $IS | $SY) "},{"id":"13.03","value":" $Spec4_ $CM+ × ($CL | $CP | $IS | $SY) "},{"id":"13.04","value":" ^ $CM+ × ($CL | $CP | $IS | $SY) "},{"id":14,"value":" $OP $SP* × "},{"id":15,"value":" $QU $SP* × $OP "},{"id":16,"value":" ($CL | $CP) $SP* × $NS "},{"id":17,"value":" $B2 $SP* × $B2 "},{"id":18,"value":" $SP ÷ "},{"id":"19.01","value":" × $QU "},{"id":"19.02","value":" $QU × "},{"id":"20.01","value":" ÷ $CB "},{"id":"20.02","value":" $CB ÷ "},{"id":"21.01","value":" × $BA "},{"id":"21.02","value":" × $HY "},{"id":"21.03","value":" × $NS "},{"id":"21.04","value":" $BB × "},{"id":"21.1","value":" $HL ($HY | $BA) × "},{"id":"21.2","value":" $SY × $HL "},{"id":"22.01","value":" ($AL | $HL) × $IN "},{"id":"22.02","value":" $ID × $IN "},{"id":"22.03","value":" $IN × $IN "},{"id":"22.04","value":" $NU × $IN "},{"id":"23.01","value":" $ID × $PO "},{"id":"23.02","value":" ($AL | $HL) × $NU "},{"id":"23.03","value":" $NU × ($AL | $HL) "},{"id":"24.01","value":" $PR × $ID "},{"id":"24.02","value":" $PR × ($AL | $HL) "},{"id":"24.03","value":" $PO × ($AL | $HL) "},{"id":"25.01","value":" ($PR | $PO) × ( $OP | $HY )? $NU "},{"id":"25.02","value":" ( $OP | $HY ) × $NU "},{"id":"25.03","value":" $NU × ($NU | $SY | $IS) "},{"id":"25.04","value":" $NU ($NU | $SY | $IS)* × ($NU | $SY | $IS | $CL | $CP) "},{"id":"25.05","value":" $NU ($NU | $SY | $IS)* ($CL | $CP)? × ($PO | $PR) "},{"id":"26.01","value":" $JL × $JL | $JV | $H2 | $H3 "},{"id":"26.02","value":" $JV | $H2 × $JV | $JT "},{"id":"26.03","value":" $JT | $H3 × $JT "},{"id":"27.01","value":" $JL | $JV | $JT | $H2 | $H3 × $IN "},{"id":"27.02","value":" $JL | $JV | $JT | $H2 | $H3 × $PO "},{"id":"27.03","value":" $PR × $JL | $JV | $JT | $H2 | $H3 "},{"id":28,"value":" ($AL | $HL) × ($AL | $HL) "},{"id":29,"value":" $IS × ($AL | $HL) "},{"id":"30.01","value":" ($AL | $HL | $NU) × $OP "},{"id":"30.02","value":" $CP × ($AL | $HL | $NU) "},{"id":"30.11","value":" $RI × $RI "}],"variables":[{"id":"$AI","value":"\\p{Line_Break=Ambiguous}"},{"id":"$AL","value":"\\p{Line_Break=Alphabetic}"},{"id":"$B2","value":"\\p{Line_Break=Break_Both}"},{"id":"$BA","value":"\\p{Line_Break=Break_After}"},{"id":"$BB","value":"\\p{Line_Break=Break_Before}"},{"id":"$BK","value":"\\p{Line_Break=Mandatory_Break}"},{"id":"$CB","value":"\\p{Line_Break=Contingent_Break}"},{"id":"$CL","value":"\\p{Line_Break=Close_Punctuation}"},{"id":"$CP","value":"\\p{Line_Break=CP}"},{"id":"$CM","value":"\\p{Line_Break=Combining_Mark}"},{"id":"$CR","value":"\\p{Line_Break=Carriage_Return}"},{"id":"$EX","value":"\\p{Line_Break=Exclamation}"},{"id":"$GL","value":"\\p{Line_Break=Glue}"},{"id":"$H2","value":"\\p{Line_Break=H2}"},{"id":"$H3","value":"\\p{Line_Break=H3}"},{"id":"$HL","value":"\\p{Line_Break=HL}"},{"id":"$HY","value":"\\p{Line_Break=Hyphen}"},{"id":"$ID","value":"\\p{Line_Break=Ideographic}"},{"id":"$IN","value":"\\p{Line_Break=Inseparable}"},{"id":"$IS","value":"\\p{Line_Break=Infix_Numeric}"},{"id":"$JL","value":"\\p{Line_Break=JL}"},{"id":"$JT","value":"\\p{Line_Break=JT}"},{"id":"$JV","value":"\\p{Line_Break=JV}"},{"id":"$LF","value":"\\p{Line_Break=Line_Feed}"},{"id":"$NL","value":"\\p{Line_Break=Next_Line}"},{"id":"$NS","value":"\\p{Line_Break=Nonstarter}"},{"id":"$NU","value":"\\p{Line_Break=Numeric}"},{"id":"$OP","value":"\\p{Line_Break=Open_Punctuation}"},{"id":"$PO","value":"\\p{Line_Break=Postfix_Numeric}"},{"id":"$PR","value":"\\p{Line_Break=Prefix_Numeric}"},{"id":"$QU","value":"\\p{Line_Break=Quotation}"},{"id":"$SA","value":"\\p{Line_Break=Complex_Context}"},{"id":"$SG","value":"\\p{Line_Break=Surrogate}"},{"id":"$SP","value":"\\p{Line_Break=Space}"},{"id":"$SY","value":"\\p{Line_Break=Break_Symbols}"},{"id":"$WJ","value":"\\p{Line_Break=Word_Joiner}"},{"id":"$XX","value":"\\p{Line_Break=Unknown}"},{"id":"$ZW","value":"\\p{Line_Break=ZWSpace}"},{"id":"$CJ","value":"\\p{Line_Break=Conditional_Japanese_Starter}"},{"id":"$RI","value":"\\p{Line_Break=Regional_Indicator}"},{"id":"$AL","value":"[$AI $AL $XX $SA $SG]"},{"id":"$NS","value":"[$NS $CJ]"},{"id":"$X","value":"$CM*"},{"id":"$Spec1_","value":"[$SP $BK $CR $LF $NL $ZW]"},{"id":"$Spec2_","value":"[^ $SP $BK $CR $LF $NL $ZW]"},{"id":"$Spec3a_","value":"[^ $SP $BA $HY $CM]"},{"id":"$Spec3b_","value":"[^ $BA $HY $CM]"},{"id":"$Spec4_","value":"[^ $NU $CM]"},{"id":"$AI","value":"($AI $X)"},{"id":"$AL","value":"($AL $X)"},{"id":"$B2","value":"($B2 $X)"},{"id":"$BA","value":"($BA $X)"},{"id":"$BB","value":"($BB $X)"},{"id":"$CB","value":"($CB $X)"},{"id":"$CL","value":"($CL $X)"},{"id":"$CP","value":"($CP $X)"},{"id":"$CM","value":"($CM $X)"},{"id":"$CM","value":"($CM $X)"},{"id":"$GL","value":"($GL $X)"},{"id":"$H2","value":"($H2 $X)"},{"id":"$H3","value":"($H3 $X)"},{"id":"$HL","value":"($HL $X)"},{"id":"$HY","value":"($HY $X)"},{"id":"$ID","value":"($ID $X)"},{"id":"$IN","value":"($IN $X)"},{"id":"$IS","value":"($IS $X)"},{"id":"$JL","value":"($JL $X)"},{"id":"$JT","value":"($JT $X)"},{"id":"$JV","value":"($JV $X)"},{"id":"$NS","value":"($NS $X)"},{"id":"$NU","value":"($NU $X)"},{"id":"$OP","value":"($OP $X)"},{"id":"$PO","value":"($PO $X)"},{"id":"$PR","value":"($PR $X)"},{"id":"$QU","value":"($QU $X)"},{"id":"$SA","value":"($SA $X)"},{"id":"$SG","value":"($SG $X)"},{"id":"$SY","value":"($SY $X)"},{"id":"$WJ","value":"($WJ $X)"},{"id":"$XX","value":"($XX $X)"},{"id":"$RI","value":"($RI $X)"},{"id":"$AL","value":"($AL | ^ $CM | (?\u003c=$Spec1_) $CM)"}]},"SentenceBreak":{"rules":[{"id":3,"value":" $CR × $LF "},{"id":4,"value":" ($Sep | $CR | $LF) ÷ "},{"id":5,"value":" × [$Format $Extend] "},{"id":6,"value":" $ATerm × $Numeric "},{"id":7,"value":" $Upper $ATerm × $Upper "},{"id":8,"value":" $ATerm $Close* $Sp* × $NotPreLower_* $Lower "},{"id":"8.1","value":" ($STerm | $ATerm) $Close* $Sp* × ($SContinue | $STerm | $ATerm) "},{"id":9,"value":" ( $STerm | $ATerm ) $Close* × ( $Close | $Sp | $Sep | $CR | $LF ) "},{"id":10,"value":" ( $STerm | $ATerm ) $Close* $Sp* × ( $Sp | $Sep | $CR | $LF ) "},{"id":11,"value":" ( $STerm | $ATerm ) $Close* $Sp* ($Sep | $CR | $LF)? ÷ "},{"id":12,"value":" × $Any "}],"variables":[{"id":"$CR","value":"\\p{Sentence_Break=CR}"},{"id":"$LF","value":"\\p{Sentence_Break=LF}"},{"id":"$Extend","value":"\\p{Sentence_Break=Extend}"},{"id":"$Format","value":"\\p{Sentence_Break=Format}"},{"id":"$Sep","value":"\\p{Sentence_Break=Sep}"},{"id":"$Sp","value":"\\p{Sentence_Break=Sp}"},{"id":"$Lower","value":"\\p{Sentence_Break=Lower}"},{"id":"$Upper","value":"\\p{Sentence_Break=Upper}"},{"id":"$OLetter","value":"\\p{Sentence_Break=OLetter}"},{"id":"$Numeric","value":"\\p{Sentence_Break=Numeric}"},{"id":"$ATerm","value":"\\p{Sentence_Break=ATerm}"},{"id":"$STerm","value":"\\p{Sentence_Break=STerm}"},{"id":"$Close","value":"\\p{Sentence_Break=Close}"},{"id":"$SContinue","value":"\\p{Sentence_Break=SContinue}"},{"id":"$Any","value":"."},{"id":"$FE","value":"[$Format $Extend]"},{"id":"$NotPreLower_","value":"[^ $OLetter $Upper $Lower $Sep $CR $LF $STerm $ATerm]"},{"id":"$Sp","value":"($Sp $FE*)"},{"id":"$Lower","value":"($Lower $FE*)"},{"id":"$Upper","value":"($Upper $FE*)"},{"id":"$OLetter","value":"($OLetter $FE*)"},{"id":"$Numeric","value":"($Numeric $FE*)"},{"id":"$ATerm","value":"($ATerm $FE*)"},{"id":"$STerm","value":"($STerm $FE*)"},{"id":"$Close","value":"($Close $FE*)"},{"id":"$SContinue","value":"($SContinue $FE*)"}]},"WordBreak":{"rules":[{"id":3,"value":" $CR × $LF "},{"id":"3.1","value":" ($Newline | $CR | $LF) ÷ "},{"id":"3.2","value":" ÷ ($Newline | $CR | $LF) "},{"id":4,"value":" $NotBreak_ × [$Format $Extend] "},{"id":5,"value":" $ALetter × $ALetter "},{"id":6,"value":" $ALetter × ($MidLetter | $MidNumLet) $ALetter "},{"id":7,"value":" $ALetter ($MidLetter | $MidNumLet) × $ALetter "},{"id":8,"value":" $Numeric × $Numeric "},{"id":9,"value":" $ALetter × $Numeric "},{"id":10,"value":" $Numeric × $ALetter "},{"id":11,"value":" $Numeric ($MidNum | $MidNumLet) × $Numeric "},{"id":12,"value":" $Numeric × ($MidNum | $MidNumLet) $Numeric "},{"id":13,"value":" $Katakana × $Katakana "},{"id":"13.1","value":" ($ALetter | $Numeric | $Katakana | $ExtendNumLet) × $ExtendNumLet "},{"id":"13.2","value":" $ExtendNumLet × ($ALetter | $Numeric | $Katakana) "},{"id":"13.3","value":" $Regional_Indicator × $Regional_Indicator "}],"variables":[{"id":"$CR","value":"\\p{Word_Break=CR}"},{"id":"$LF","value":"\\p{Word_Break=LF}"},{"id":"$Newline","value":"\\p{Word_Break=Newline}"},{"id":"$Extend","value":"\\p{Word_Break=Extend}"},{"id":"$Format","value":"\\p{Word_Break=Format}"},{"id":"$Katakana","value":"\\p{Word_Break=Katakana}"},{"id":"$ALetter","value":"\\p{Word_Break=ALetter}"},{"id":"$MidLetter","value":"\\p{Word_Break=MidLetter}"},{"id":"$MidNum","value":"\\p{Word_Break=MidNum}"},{"id":"$MidNumLet","value":"\\p{Word_Break=MidNumLet}"},{"id":"$Numeric","value":"\\p{Word_Break=Numeric}"},{"id":"$ExtendNumLet","value":"\\p{Word_Break=ExtendNumLet}"},{"id":"$Regional_Indicator","value":"\\p{Word_Break=Regional_Indicator}"},{"id":"$FE","value":"[$Format $Extend]"},{"id":"$NotBreak_","value":"[^ $Newline $CR $LF ]"},{"id":"$Katakana","value":"($Katakana $FE*)"},{"id":"$ALetter","value":"($ALetter $FE*)"},{"id":"$MidLetter","value":"($MidLetter $FE*)"},{"id":"$MidNum","value":"($MidNum $FE*)"},{"id":"$MidNumLet","value":"($MidNumLet $FE*)"},{"id":"$Numeric","value":"($Numeric $FE*)"},{"id":"$ExtendNumLet","value":"($ExtendNumLet $FE*)"},{"id":"$Regional_Indicator","value":"($Regional_Indicator $FE*)"}]}}};
    }

    BreakIterator.prototype.each_sentence = function(str, block) {
      return this.each_boundary(str, "sentence", block);
    };

    BreakIterator.prototype.each_word = function(str, block) {
      throw "Word segmentation is not currently supported.";
    };

    BreakIterator.prototype.each_line = function(str, block) {
      throw "Line segmentation is not currently supported.";
    };

    BreakIterator.prototype.boundary_name_for = function(str) {
      return str.replace(/(?:^|\_)([A-Za-z])/, function(match) {
        return match.toUpperCase();
      }) + "Break";
    };

    BreakIterator.prototype.each_boundary = function(str, boundary_type, block) {
      var break_offset, current_position, last_offset, match, r, result, rule, rules, search_str, _i, _len;
      rules = this.compile_rules_for(this.locale, boundary_type);
      match = null;
      last_offset = 0;
      current_position = 0;
      search_str = str;
      result = [];
      while (search_str.length !== 0) {
        rule = null;
        for (_i = 0, _len = rules.length; _i < _len; _i++) {
          r = rules[_i];
          match = r.match(search_str);
          if (match != null) {
            rule = r;
            break;
          }
        }
        if (rule.boundary_symbol === "break") {
          break_offset = current_position + match.boundary_offset;
          result.push(str.slice(last_offset, break_offset));
          if (block != null) {
            block(result[result.length - 1]);
          }
          last_offset = break_offset;
        }
        search_str = search_str.slice(match.boundary_offset);
        current_position += match.boundary_offset;
      }
      if (last_offset < str.length - 1) {
        result.push(str.slice(last_offset));
        if (block != null) {
          block(str.slice(last_offset));
        }
      }
      return result;
    };

    BreakIterator.prototype.compile_exception_rule_for = function(locale, boundary_type, boundary_name) {
      var cache_key, exception, exceptions, regex_contents, result, _base;
      if (boundary_type === "sentence") {
        cache_key = TwitterCldr.Utilities.compute_cache_key([locale, boundary_type]);
        result = null;
        exceptions = this.exceptions_for(locale, boundary_name);
        regex_contents = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = exceptions.length; _i < _len; _i++) {
            exception = exceptions[_i];
            _results.push(TwitterCldr.Utilities.regex_escape(exception));
          }
          return _results;
        })()).join("|");
        return (_base = this.exceptions_cache)[cache_key] || (_base[cache_key] = this.segmentation_parser.parse(this.segmentation_tokenizer.tokenize("(?:" + regex_contents + ") \u00D7")));
      }
    };

    BreakIterator.prototype.compile_rules_for = function(locale, boundary_type) {
      var boundary_data, boundary_name, exception_rule, root_rules, rules, symbol_table, tailoring_boundary_data, tailoring_rules;
      boundary_name = this.boundary_name_for(boundary_type);
      boundary_data = this.resource_for(boundary_name);
      symbol_table = this.symbol_table_for(boundary_data);
      root_rules = this.rules_for(boundary_data, symbol_table);
      tailoring_boundary_data = this.tailoring_resource_for(locale, boundary_name);
      tailoring_rules = this.rules_for(tailoring_boundary_data, symbol_table);
      rules = this.merge_rules(root_rules, tailoring_rules);
      if (this.use_uli_exceptions === true) {
        exception_rule = this.compile_exception_rule_for(locale, boundary_type, boundary_name);
        rules.unshift(exception_rule);
      }
      return rules;
    };

    BreakIterator.prototype.merge_rules = function(ruleset1, ruleset2) {
      var i, j, result, _i, _j, _ref, _ref1;
      result = [];
      TwitterCldr.Utilities.arraycopy(ruleset1, 0, result, 0, ruleset1.length);
      for (i = _i = 0, _ref = ruleset2.length; _i < _ref; i = _i += 1) {
        for (j = _j = 0, _ref1 = result.length; _j < _ref1; j = _j += 1) {
          if (ruleset2[i].id === result[j].id) {
            result[j] = ruleset2[i];
          }
        }
      }
      return result;
    };

    BreakIterator.prototype.symbol_table_for = function(boundary_data) {
      var i, id, table, tokens, variable, _i, _ref;
      table = new TwitterCldr.SymbolTable();
      for (i = _i = 0, _ref = boundary_data.variables.length; _i < _ref; i = _i += 1) {
        variable = boundary_data.variables[i];
        id = variable.id.toString();
        tokens = this.segmentation_tokenizer.tokenize(variable.value);
        table.add(id, this.resolve_symbols(tokens, table));
      }
      return table;
    };

    BreakIterator.prototype.resolve_symbols = function(tokens, symbol_table) {
      var i, result, token, _i, _ref;
      result = [];
      for (i = _i = 0, _ref = tokens.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        token = tokens[i];
        if (token.type === "variable") {
          result = result.concat(symbol_table.fetch(token.value));
        } else {
          result.push(token);
        }
      }
      return result;
    };

    BreakIterator.prototype.rules_for = function(boundary_data, symbol_table) {
      var r, results, rule, _i, _len, _ref;
      results = [];
      _ref = boundary_data.rules;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        r = this.segmentation_parser.parse(this.segmentation_tokenizer.tokenize(rule.value), {
          "symbol_table": symbol_table
        });
        r.string = rule.value;
        r.id = rule.id;
        results.push(r);
      }
      return results;
    };

    BreakIterator.prototype.resource_for = function(boundary_name) {
      return this.root_resource["segments"][boundary_name];
    };

    BreakIterator.prototype.tailoring_resource_for = function(locale, boundary_name) {
      return this.tailoring_resource_data[locale][locale]["segments"][boundary_name];
    };

    BreakIterator.prototype.exceptions_for = function(locale, boundary_name) {
      var result;
      result = this.exceptions_resource_data[locale][locale]["exceptions"];
      if (result != null) {
        return result;
      } else {
        return [];
      }
    };

    return BreakIterator;

  })();

  TwitterCldr.TerritoriesContainment = (function() {
    function TerritoriesContainment() {}

    TerritoriesContainment.territories_data = {"001":["002","009","019","142","150"],"002":["011","014","015","017","018"],"003":["013","021","029"],"005":["AR","BO","BR","CL","CO","EC","FK","GF","GY","PE","PY","SR","UY","VE"],"009":["053","054","057","061","QO"],"011":["BF","BJ","CI","CV","GH","GM","GN","GW","LR","ML","MR","NE","NG","SH","SL","SN","TG"],"013":["BZ","CR","GT","HN","MX","NI","PA","SV"],"014":["BI","DJ","ER","ET","KE","KM","MG","MU","MW","MZ","RE","RW","SC","SO","TZ","UG","YT","ZM","ZW"],"015":["DZ","EA","EG","EH","IC","LY","MA","SD","SS","TN"],"017":["AO","CD","CF","CG","CM","GA","GQ","ST","TD","ZR"],"018":["BW","LS","NA","SZ","ZA"],"019":["003","005","013","021","029","419"],"021":["BM","CA","GL","PM","US"],"029":["AG","AI","AN","AW","BB","BL","BQ","BS","CU","CW","DM","DO","GD","GP","HT","JM","KN","KY","LC","MF","MQ","MS","PR","SX","TC","TT","VC","VG","VI"],"030":["CN","HK","JP","KP","KR","MN","MO","TW"],"034":["AF","BD","BT","IN","IR","LK","MV","NP","PK"],"035":["BN","BU","ID","KH","LA","MM","MY","PH","SG","TH","TL","TP","VN"],"039":["AD","AL","BA","CS","ES","GI","GR","HR","IT","ME","MK","MT","PT","RS","SI","SM","VA","XK","YU"],"053":["AU","NF","NZ"],"054":["FJ","NC","PG","SB","VU"],"057":["FM","GU","KI","MH","MP","NR","PW"],"061":["AS","CK","NU","PF","PN","TK","TO","TV","WF","WS"],"142":["030","034","035","143","145"],"143":["KG","KZ","TJ","TM","UZ"],"145":["AE","AM","AZ","BH","CY","GE","IL","IQ","JO","KW","LB","NT","OM","PS","QA","SA","SY","TR","YD","YE"],"150":["039","151","154","155","EU","QU"],"151":["BG","BY","CZ","HU","MD","PL","RO","RU","SK","SU","UA"],"154":["AX","DK","EE","FI","FO","GB","GG","IE","IM","IS","JE","LT","LV","false","SE","SJ"],"155":["AT","BE","CH","DD","DE","FR","FX","LI","LU","MC","NL"],"419":["005","013","029"],"EU":["AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI","FR","GB","GR","HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK"],"QO":["AC","AQ","BV","CC","CP","CX","DG","GS","HM","IO","TA","TF","UM"]};

    TerritoriesContainment.contains = function(parent_code, child_code) {
      var contains, immediate_child, immediate_children, _i, _len;
      this.validate_territory(parent_code);
      this.validate_territory(child_code);
      immediate_children = this.children(parent_code);
      contains = false;
      if (__indexOf.call(immediate_children, child_code) >= 0) {
        contains = true;
      } else {
        for (_i = 0, _len = immediate_children.length; _i < _len; _i++) {
          immediate_child = immediate_children[_i];
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
      var child, children, data, territory, _i, _len, _ref;
      data = {};
      _ref = this.territories_data;
      for (territory in _ref) {
        children = _ref[territory];
        if (!(territory in data)) {
          data[territory] = [];
        }
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
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

  TwitterCldr.NumberParser = (function() {
    function NumberParser() {
      this.group_separator = "\\\.";
      this.decimal_separator = ",";
      this.separator_chars = ['\\.', ',', '\\s'].join("");
    }

    NumberParser.prototype.parse = function(number_text, options) {
      var last, num, num_list, punct_list, result, separators, token, tokens, _i, _len;
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
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
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
          var _j, _len1, _ref, _results;
          _ref = num_list.slice(0, -1);
          _results = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            num = _ref[_j];
            _results.push(num.value);
          }
          return _results;
        })()).join("")) || 0;
        last = num_list.slice(-1)[0];
        return result + parseInt(last.value) / Math.pow(10.0, last.value.length);
      } else {
        return parseInt(((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = num_list.length; _j < _len1; _j++) {
            num = num_list[_j];
            _results.push(num.value);
          }
          return _results;
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
      var index, punct, valid, _i, _len;
      valid = true;
      for (index = _i = 0, _len = punct_list.length; _i < _len; index = ++_i) {
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
      var match, match_data, regexp, token, tokens, _i, _len, _results;
      regexp = new RegExp("([\\d]*)([" + group + "]{0,1})([\\d]*)([" + decimal + "]{0,1})([\\d]*)");
      match_data = number_text.split(regexp);
      match_data = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = match_data.length; _i < _len; _i++) {
          match = match_data[_i];
          if (match !== "") {
            _results.push(match);
          }
        }
        return _results;
      })();
      tokens = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = match_data.length; _i < _len; _i++) {
          match = match_data[_i];
          _results.push(this.identify(match, group, decimal));
        }
        return _results;
      }).call(this);
      _results = [];
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        if (token.type !== null) {
          _results.push(token);
        }
      }
      return _results;
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

  TwitterCldr.Component = (function() {
    function Component() {}

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
        return "[" + this.to_utf8(range.first) + "-" + this.to_utf8(range.last) + "]";
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
        if ((typeof custom_splitter !== "undefined" && custom_splitter !== null) && !(this.custom_splitter(tokenizer))) {
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
      pieces = text.match(new RegExp(this.get_splitter().source, "g"));
      result = [];
      for (_i = 0, _len = pieces.length; _i < _len; _i++) {
        piece = pieces[_i];
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

}).call(this);
