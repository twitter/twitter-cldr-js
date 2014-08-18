
/*
// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

// TwitterCLDR (JavaScript) v2.2.4
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

  TwitterCldr.locale = "en";

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

    PluralRules.rules = {"keys": ["one","other"], "rule": function(n) { return (function() { if (n == 1) { return "one" } else { return "other" } })(); }};

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
      this.tokens = {"ago":{"second":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" second ago","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" seconds ago","type":"plaintext"}]}},"minute":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" minute ago","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" minutes ago","type":"plaintext"}]}},"hour":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" hour ago","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" hours ago","type":"plaintext"}]}},"day":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" day ago","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" days ago","type":"plaintext"}]}},"week":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" week ago","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" weeks ago","type":"plaintext"}]}},"month":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" month ago","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" months ago","type":"plaintext"}]}},"year":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" year ago","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" years ago","type":"plaintext"}]}}},"until":{"second":{"default":{"one":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" second","type":"plaintext"}],"other":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" seconds","type":"plaintext"}]}},"minute":{"default":{"one":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" minute","type":"plaintext"}],"other":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" minutes","type":"plaintext"}]}},"hour":{"default":{"one":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" hour","type":"plaintext"}],"other":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" hours","type":"plaintext"}]}},"day":{"default":{"one":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" day","type":"plaintext"}],"other":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" days","type":"plaintext"}]}},"week":{"default":{"one":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" week","type":"plaintext"}],"other":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" weeks","type":"plaintext"}]}},"month":{"default":{"one":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" month","type":"plaintext"}],"other":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" months","type":"plaintext"}]}},"year":{"default":{"one":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" year","type":"plaintext"}],"other":[{"value":"In ","type":"plaintext"},{"value":"{0}","type":"placeholder"},{"value":" years","type":"plaintext"}]}}},"none":{"second":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" second","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" seconds","type":"plaintext"}]},"short":{"one":[{"value":"{0}","type":"placeholder"},{"value":" sec","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" secs","type":"plaintext"}]},"abbreviated":{"one":[{"value":"{0}","type":"placeholder"},{"value":"s","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":"s","type":"plaintext"}]}},"minute":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" minute","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" minutes","type":"plaintext"}]},"short":{"one":[{"value":"{0}","type":"placeholder"},{"value":" min","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" mins","type":"plaintext"}]},"abbreviated":{"one":[{"value":"{0}","type":"placeholder"},{"value":"m","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":"m","type":"plaintext"}]}},"hour":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" hour","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" hours","type":"plaintext"}]},"short":{"one":[{"value":"{0}","type":"placeholder"},{"value":" hr","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" hrs","type":"plaintext"}]},"abbreviated":{"one":[{"value":"{0}","type":"placeholder"},{"value":"h","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":"h","type":"plaintext"}]}},"day":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" day","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" days","type":"plaintext"}]},"short":{"one":[{"value":"{0}","type":"placeholder"},{"value":" day","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" days","type":"plaintext"}]},"abbreviated":{"one":[{"value":"{0}","type":"placeholder"},{"value":"d","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":"d","type":"plaintext"}]}},"week":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" week","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" weeks","type":"plaintext"}]},"short":{"one":[{"value":"{0}","type":"placeholder"},{"value":" wk","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" wks","type":"plaintext"}]}},"month":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" month","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" months","type":"plaintext"}]},"short":{"one":[{"value":"{0}","type":"placeholder"},{"value":" mth","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" mths","type":"plaintext"}]}},"year":{"default":{"one":[{"value":"{0}","type":"placeholder"},{"value":" year","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" years","type":"plaintext"}]},"short":{"one":[{"value":"{0}","type":"placeholder"},{"value":" yr","type":"plaintext"}],"other":[{"value":"{0}","type":"placeholder"},{"value":" yrs","type":"plaintext"}]}}}};
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
      var key, number, obj, options, strings, token;
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
      strings = (function() {
        var _i, _len, _ref, _results;
        _ref = this.tokens[options["direction"]][options["unit"]][options["type"]][options["rule"]];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          token = _ref[_i];
          _results.push(token.value);
        }
        return _results;
      }).call(this);
      return strings.join("").replace(/\{[0-9]\}/, number.toString());
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
      this.tokens = {"date_time":{"default":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"full":[{"value":"EEEE","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'at'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"zzzz","type":"pattern"}],"long":[{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"'at'","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"z","type":"pattern"}],"medium":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"short":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"yy","type":"pattern"},{"value":",","type":"plaintext"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"additional":{"EHm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"E","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"pattern"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"MMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Md":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"QQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQQ":[{"value":"QQQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}]}},"time":{"default":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"full":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"zzzz","type":"pattern"}],"long":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"z","type":"pattern"}],"medium":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"short":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"additional":{"EHm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"E","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"pattern"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"MMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Md":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"QQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQQ":[{"value":"QQQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}]}},"date":{"default":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"full":[{"value":"EEEE","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"long":[{"value":"MMMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"medium":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"short":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"yy","type":"pattern"}],"additional":{"EHm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"EHms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"Ed":[{"value":"d","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"E","type":"pattern"}],"Ehm":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Ehms":[{"value":"E","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"Gy":[{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"GyMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"G","type":"pattern"}],"H":[{"value":"HH","type":"pattern"}],"Hm":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"}],"Hms":[{"value":"HH","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"M":[{"value":"L","type":"pattern"}],"MEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"MMM":[{"value":"LLL","type":"pattern"}],"MMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"MMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"}],"Md":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"}],"d":[{"value":"d","type":"pattern"}],"h":[{"value":"h","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hm":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"hms":[{"value":"h","type":"pattern"},{"value":":","type":"plaintext"},{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"a","type":"pattern"}],"ms":[{"value":"mm","type":"pattern"},{"value":":","type":"plaintext"},{"value":"ss","type":"pattern"}],"y":[{"value":"y","type":"pattern"}],"yM":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMM":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMEd":[{"value":"E","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMMMd":[{"value":"MMM","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"d","type":"pattern"},{"value":", ","type":"plaintext"},{"value":"y","type":"pattern"}],"yMd":[{"value":"M","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"d","type":"pattern"},{"value":"/","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQ":[{"value":"QQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}],"yQQQQ":[{"value":"QQQQ","type":"pattern"},{"value":" ","type":"plaintext"},{"value":"y","type":"pattern"}]}}};
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
              if (token.value.length > 0 && token.value[0] === "'" && token.value[token.value.length - 1] === "'") {
                return token.value.substring(1, token.value.length - 1);
              } else {
                return token.value;
              }
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
          return TwitterCldr.Calendar.calendar.quarters.format.abbreviated[quarter];
        case 4:
          return TwitterCldr.Calendar.calendar.quarters.format.wide[quarter];
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
          return TwitterCldr.Calendar.calendar.quarters['stand-alone'].narrow[quarter];
      }
    };

    DateTimeFormatter.prototype.month = function(date, pattern, length) {
      var month_str;
      month_str = (date.getMonth() + 1).toString();
      switch (length) {
        case 1:
          return month_str;
        case 2:
          return ("0000" + month_str).slice(-length);
        case 3:
          return TwitterCldr.Calendar.calendar.months.format.abbreviated[month_str];
        case 4:
          return TwitterCldr.Calendar.calendar.months.format.wide[month_str];
        case 5:
          throw 'not yet implemented (requires cldr\'s "multiple inheritance")';
          break;
        default:
          throw "Unknown date format";
      }
    };

    DateTimeFormatter.prototype.month_stand_alone = function(date, pattern, length) {
      var month_str;
      month_str = (date.getMonth() + 1).toString();
      switch (length) {
        case 1:
          return month_str;
        case 2:
          return ("0000" + month_str).slice(-length);
        case 3:
          return TwitterCldr.Calendar.calendar.months['stand-alone'].abbreviated[month_str];
        case 4:
          return TwitterCldr.Calendar.calendar.months['stand-alone'].wide[month_str];
        case 5:
          return TwitterCldr.Calendar.calendar.months['stand-alone'].narrow[month_str];
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
          return TwitterCldr.Calendar.calendar.days.format.abbreviated[key];
        case 4:
          return TwitterCldr.Calendar.calendar.days.format.wide[key];
        case 5:
          return TwitterCldr.Calendar.calendar.days['stand-alone'].narrow[key];
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
        return TwitterCldr.Calendar.calendar.periods.format.wide["pm"];
      } else {
        return TwitterCldr.Calendar.calendar.periods.format.wide["am"];
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
      this.all_tokens = {"decimal":{"positive":["","#,##0.###"],"negative":["-","#,##0.###"]},"percent":{"positive":["","#,##0","%"],"negative":["-","#,##0","%"]},"currency":{"positive":["¤","#,##0.00"],"negative":["-(¤","#,##0.00",")"]},"short_decimal":{"positive":{"1000":["","0","K"],"10000":["","00","K"],"100000":["","000","K"],"1000000":["","0","M"],"10000000":["","00","M"],"100000000":["","000","M"],"1000000000":["","0","B"],"10000000000":["","00","B"],"100000000000":["","000","B"],"1000000000000":["","0","T"],"10000000000000":["","00","T"],"100000000000000":["","000","T"]},"negative":{"1000":["-","0","K"],"10000":["-","00","K"],"100000":["-","000","K"],"1000000":["-","0","M"],"10000000":["-","00","M"],"100000000":["-","000","M"],"1000000000":["-","0","B"],"10000000000":["-","00","B"],"100000000000":["-","000","B"],"1000000000000":["-","0","T"],"10000000000000":["-","00","T"],"100000000000000":["-","000","T"]}},"long_decimal":{"positive":{"1000":["","0"," thousand"],"10000":["","00"," thousand"],"100000":["","000"," thousand"],"1000000":["","0"," million"],"10000000":["","00"," million"],"100000000":["","000"," million"],"1000000000":["","0"," billion"],"10000000000":["","00"," billion"],"100000000000":["","000"," billion"],"1000000000000":["","0"," trillion"],"10000000000000":["","00"," trillion"],"100000000000000":["","000"," trillion"]},"negative":{"1000":["-","0"," thousand"],"10000":["-","00"," thousand"],"100000":["-","000"," thousand"],"1000000":["-","0"," million"],"10000000":["-","00"," million"],"100000000":["-","000"," million"],"1000000000":["-","0"," billion"],"10000000000":["-","00"," billion"],"100000000000":["-","000"," billion"],"1000000000000":["-","0"," trillion"],"10000000000000":["-","00"," trillion"],"100000000000000":["-","000"," trillion"]}}};
      this.tokens = [];
      this.symbols = {"alias":"","decimal":".","exponential":"E","group":",","infinity":"∞","list":";","minus_sign":"-","nan":"NaN","per_mille":"‰","percent_sign":"%","plus_sign":"+"};
      this.default_symbols = {
        'group': ',',
        'decimal': '.',
        'plus_sign': '+',
        'minus_sign': '-'
      };
    }

    NumberFormatter.prototype.format = function(number, options) {
      var fraction, fraction_format, integer_format, intg, key, opts, prefix, result, sign, suffix, val, _ref, _ref1;
      if (options == null) {
        options = {};
      }
      opts = this.default_format_options_for(number);
      for (key in options) {
        val = options[key];
        opts[key] = options[key] != null ? options[key] : opts[key];
      }
      _ref = this.partition_tokens(this.get_tokens(number, opts)), prefix = _ref[0], suffix = _ref[1], integer_format = _ref[2], fraction_format = _ref[3];
      number = this.transform_number(number);
      _ref1 = this.parse_number(number, opts), intg = _ref1[0], fraction = _ref1[1];
      result = integer_format.apply(parseFloat(intg), opts);
      if (fraction) {
        result += fraction_format.apply(fraction, opts);
      }
      sign = number < 0 && prefix !== "-" ? this.symbols.minus_sign || this.default_symbols.minus_sign : "";
      return "" + prefix + result + suffix;
    };

    NumberFormatter.prototype.transform_number = function(number) {
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
      this.default_currency_symbol = "$";
      this.default_precision = 2;
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

    AbbreviatedNumberFormatter.prototype.transform_number = function(number) {
      var factor, power;
      if ((number < this.NUMBER_MAX) && (number >= this.NUMBER_MIN)) {
        power = Math.floor((number.toString().length - 1) / 3) * 3;
        factor = Math.pow(10, power);
        return number / factor;
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

    Currencies.currencies = {"ADP":{"currency":"ADP","name":"Andorran peseta","cldr_symbol":"ADP","symbol":"ADP","code_points":[65,68,80]},"AED":{"currency":"AED","name":"UAE dirham","cldr_symbol":"AED","symbol":"AED","code_points":[65,69,68]},"AFA":{"currency":"AFA","name":"Afghan afghani (1927-2002)","cldr_symbol":"AFA","symbol":"AFA","code_points":[65,70,65]},"AFN":{"currency":"AFN","name":"Afghan Afghani","cldr_symbol":"AFN","symbol":"؋","code_points":[1547]},"ALK":{"currency":"ALK","name":"Albanian lek (1946-1965)","cldr_symbol":"ALK","symbol":"ALK","code_points":[65,76,75]},"ALL":{"currency":"ALL","name":"Albanian lek","cldr_symbol":"ALL","symbol":"LEK","code_points":[76,69,75]},"AMD":{"currency":"AMD","name":"Armenian dram","cldr_symbol":"AMD","symbol":"AMD","code_points":[65,77,68]},"ANG":{"currency":"ANG","name":"Netherlands Antillean guilder","cldr_symbol":"ANG","symbol":"ƒ","code_points":[402]},"AOA":{"currency":"AOA","name":"Angolan kwanza","cldr_symbol":"AOA","symbol":"AOA","code_points":[65,79,65]},"AOK":{"currency":"AOK","name":"Angolan kwanza (1977-1991)","cldr_symbol":"AOK","symbol":"AOK","code_points":[65,79,75]},"AON":{"currency":"AON","name":"Angolan new kwanza (1990-2000)","cldr_symbol":"AON","symbol":"AON","code_points":[65,79,78]},"AOR":{"currency":"AOR","name":"Angolan readjusted kwanza (1995-1999)","cldr_symbol":"AOR","symbol":"AOR","code_points":[65,79,82]},"ARA":{"currency":"ARA","name":"Argentine austral","cldr_symbol":"ARA","symbol":"ARA","code_points":[65,82,65]},"ARL":{"currency":"ARL","name":"Argentine peso ley (1970-1983)","cldr_symbol":"ARL","symbol":"ARL","code_points":[65,82,76]},"ARM":{"currency":"ARM","name":"Argentine peso (1881-1970)","cldr_symbol":"ARM","symbol":"ARM","code_points":[65,82,77]},"ARP":{"currency":"ARP","name":"Argentine peso (1983-1985)","cldr_symbol":"ARP","symbol":"ARP","code_points":[65,82,80]},"ARS":{"currency":"ARS","name":"Argentine peso","cldr_symbol":"ARS","symbol":"$","code_points":[36]},"ATS":{"currency":"ATS","name":"Austrian schilling","cldr_symbol":"ATS","symbol":"ATS","code_points":[65,84,83]},"AUD":{"currency":"AUD","name":"Australian dollar","cldr_symbol":"A$","symbol":"$","code_points":[36]},"AWG":{"currency":"AWG","name":"Aruban florin","cldr_symbol":"AWG","symbol":"ƒ","code_points":[402],"alt_name":"Florins"},"AZM":{"currency":"AZM","name":"Azerbaijani manat (1993-2006)","cldr_symbol":"AZM","symbol":"AZM","code_points":[65,90,77]},"AZN":{"currency":"AZN","name":"Azerbaijani manat","cldr_symbol":"AZN","symbol":"ман","code_points":[1084,1072,1085]},"BAD":{"currency":"BAD","name":"Bosnia-Herzegovina dinar (1992-1994)","cldr_symbol":"BAD","symbol":"BAD","code_points":[66,65,68]},"BAM":{"currency":"BAM","name":"Bosnia-Herzegovina convertible mark","cldr_symbol":"BAM","symbol":"KM","code_points":[75,77]},"BAN":{"currency":"BAN","name":"Bosnia-Herzegovina new dinar (1994-1997)","cldr_symbol":"BAN","symbol":"BAN","code_points":[66,65,78]},"BBD":{"currency":"BBD","name":"Barbadian dollar","cldr_symbol":"BBD","symbol":"$","code_points":[36]},"BDT":{"currency":"BDT","name":"Bangladeshi taka","cldr_symbol":"BDT","symbol":"BDT","code_points":[66,68,84]},"BEC":{"currency":"BEC","name":"Belgian franc (convertible)","cldr_symbol":"BEC","symbol":"BEC","code_points":[66,69,67]},"BEF":{"currency":"BEF","name":"Belgian franc","cldr_symbol":"BEF","symbol":"BEF","code_points":[66,69,70]},"BEL":{"currency":"BEL","name":"Belgian franc (financial)","cldr_symbol":"BEL","symbol":"BEL","code_points":[66,69,76]},"BGL":{"currency":"BGL","name":"Bulgarian hard lev","cldr_symbol":"BGL","symbol":"BGL","code_points":[66,71,76]},"BGM":{"currency":"BGM","name":"Bulgarian socialist lev","cldr_symbol":"BGM","symbol":"BGM","code_points":[66,71,77]},"BGN":{"currency":"BGN","name":"Bulgarian lev","cldr_symbol":"BGN","symbol":"лв","code_points":[1083,1074]},"BGO":{"currency":"BGO","name":"Bulgarian lev (1879-1952)","cldr_symbol":"BGO","symbol":"BGO","code_points":[66,71,79]},"BHD":{"currency":"BHD","name":"Bahraini dinar","cldr_symbol":"BHD","symbol":"BHD","code_points":[66,72,68]},"BIF":{"currency":"BIF","name":"Burundian franc","cldr_symbol":"BIF","symbol":"BIF","code_points":[66,73,70]},"BMD":{"currency":"BMD","name":"Bermudan dollar","cldr_symbol":"BMD","symbol":"$","code_points":[36]},"BND":{"currency":"BND","name":"Brunei dollar","cldr_symbol":"BND","symbol":"$","code_points":[36]},"BOB":{"currency":"BOB","name":"Bolivian boliviano","cldr_symbol":"BOB","symbol":"$b","code_points":[36,98]},"BOL":{"currency":"BOL","name":"Bolivian boliviano (1863-1963)","cldr_symbol":"BOL","symbol":"BOL","code_points":[66,79,76]},"BOP":{"currency":"BOP","name":"Bolivian peso","cldr_symbol":"BOP","symbol":"BOP","code_points":[66,79,80]},"BOV":{"currency":"BOV","name":"Bolivian mvdol","cldr_symbol":"BOV","symbol":"BOV","code_points":[66,79,86]},"BRB":{"currency":"BRB","name":"Brazilian new cruzeiro (1967-1986)","cldr_symbol":"BRB","symbol":"BRB","code_points":[66,82,66]},"BRC":{"currency":"BRC","name":"Brazilian cruzado (1986-1989)","cldr_symbol":"BRC","symbol":"BRC","code_points":[66,82,67]},"BRE":{"currency":"BRE","name":"Brazilian cruzeiro (1990-1993)","cldr_symbol":"BRE","symbol":"BRE","code_points":[66,82,69]},"BRL":{"currency":"BRL","name":"Brazilian real","cldr_symbol":"R$","symbol":"R$","code_points":[82,36]},"BRN":{"currency":"BRN","name":"Brazilian new cruzado (1989-1990)","cldr_symbol":"BRN","symbol":"BRN","code_points":[66,82,78]},"BRR":{"currency":"BRR","name":"Brazilian cruzeiro (1993-1994)","cldr_symbol":"BRR","symbol":"BRR","code_points":[66,82,82]},"BRZ":{"currency":"BRZ","name":"Brazilian cruzeiro (1942-1967)","cldr_symbol":"BRZ","symbol":"BRZ","code_points":[66,82,90]},"BSD":{"currency":"BSD","name":"Bahamian dollar","cldr_symbol":"BSD","symbol":"$","code_points":[36]},"BTN":{"currency":"BTN","name":"Bhutanese ngultrum","cldr_symbol":"BTN","symbol":"BTN","code_points":[66,84,78]},"BUK":{"currency":"BUK","name":"Burmese kyat","cldr_symbol":"BUK","symbol":"BUK","code_points":[66,85,75]},"BWP":{"currency":"BWP","name":"Botswanan pula","cldr_symbol":"BWP","symbol":"P","code_points":[80]},"BYB":{"currency":"BYB","name":"Belarusian new ruble (1994-1999)","cldr_symbol":"BYB","symbol":"BYB","code_points":[66,89,66]},"BYR":{"currency":"BYR","name":"Belarusian ruble","cldr_symbol":"BYR","symbol":"p.","code_points":[112,46]},"BZD":{"currency":"BZD","name":"Belize dollar","cldr_symbol":"BZD","symbol":"BZ$","code_points":[66,90,36]},"CAD":{"currency":"CAD","name":"Canadian dollar","cldr_symbol":"CA$","symbol":"$","code_points":[36]},"CDF":{"currency":"CDF","name":"Congolese franc","cldr_symbol":"CDF","symbol":"CDF","code_points":[67,68,70]},"CHE":{"currency":"CHE","name":"WIR euro","cldr_symbol":"CHE","symbol":"CHE","code_points":[67,72,69]},"CHF":{"currency":"CHF","name":"Swiss franc","cldr_symbol":"CHF","symbol":"CHF","code_points":[67,72,70]},"CHW":{"currency":"CHW","name":"WIR franc","cldr_symbol":"CHW","symbol":"CHW","code_points":[67,72,87]},"CLE":{"currency":"CLE","name":"Chilean escudo","cldr_symbol":"CLE","symbol":"CLE","code_points":[67,76,69]},"CLF":{"currency":"CLF","name":"Chilean unit of account (UF)","cldr_symbol":"CLF","symbol":"CLF","code_points":[67,76,70]},"CLP":{"currency":"CLP","name":"Chilean peso","cldr_symbol":"CLP","symbol":"$","code_points":[36]},"CNX":{"currency":"CNX","name":"Chinese People’s Bank dollar","cldr_symbol":"CNX","symbol":"CNX","code_points":[67,78,88]},"CNY":{"currency":"CNY","name":"Chinese yuan","cldr_symbol":"CN¥","symbol":"¥","code_points":[165]},"COP":{"currency":"COP","name":"Colombian peso","cldr_symbol":"COP","symbol":"$","code_points":[36]},"COU":{"currency":"COU","name":"Colombian real value unit","cldr_symbol":"COU","symbol":"COU","code_points":[67,79,85]},"CRC":{"currency":"CRC","name":"Costa Rican colón","cldr_symbol":"CRC","symbol":"₡","code_points":[8353]},"CSD":{"currency":"CSD","name":"Serbian dinar (2002-2006)","cldr_symbol":"CSD","symbol":"CSD","code_points":[67,83,68]},"CSK":{"currency":"CSK","name":"Czechoslovak hard koruna","cldr_symbol":"CSK","symbol":"CSK","code_points":[67,83,75]},"CUC":{"currency":"CUC","name":"Cuban convertible peso","cldr_symbol":"CUC","symbol":"CUC","code_points":[67,85,67]},"CUP":{"currency":"CUP","name":"Cuban peso","cldr_symbol":"CUP","symbol":"₱","code_points":[8369]},"CVE":{"currency":"CVE","name":"Cape Verdean escudo","cldr_symbol":"CVE","symbol":"CVE","code_points":[67,86,69]},"CYP":{"currency":"CYP","name":"Cypriot pound","cldr_symbol":"CYP","symbol":"CYP","code_points":[67,89,80]},"CZK":{"currency":"CZK","name":"Czech Republic koruna","cldr_symbol":"CZK","symbol":"Kč","code_points":[75,269]},"DDM":{"currency":"DDM","name":"East German mark","cldr_symbol":"DDM","symbol":"DDM","code_points":[68,68,77]},"DEM":{"currency":"DEM","name":"German mark","cldr_symbol":"DEM","symbol":"DEM","code_points":[68,69,77]},"DJF":{"currency":"DJF","name":"Djiboutian franc","cldr_symbol":"DJF","symbol":"DJF","code_points":[68,74,70]},"DKK":{"currency":"DKK","name":"Danish krone","cldr_symbol":"DKK","symbol":"kr","code_points":[107,114]},"DOP":{"currency":"DOP","name":"Dominican peso","cldr_symbol":"DOP","symbol":"RD$","code_points":[82,68,36]},"DZD":{"currency":"DZD","name":"Algerian dinar","cldr_symbol":"DZD","symbol":"DZD","code_points":[68,90,68]},"ECS":{"currency":"ECS","name":"Ecuadorian sucre","cldr_symbol":"ECS","symbol":"ECS","code_points":[69,67,83]},"ECV":{"currency":"ECV","name":"Ecuadorian unit of constant value","cldr_symbol":"ECV","symbol":"ECV","code_points":[69,67,86]},"EEK":{"currency":"EEK","name":"Estonian kroon","cldr_symbol":"EEK","symbol":"kr","code_points":[107,114]},"EGP":{"currency":"EGP","name":"Egyptian pound","cldr_symbol":"EGP","symbol":"£","code_points":[163]},"ERN":{"currency":"ERN","name":"Eritrean nakfa","cldr_symbol":"ERN","symbol":"ERN","code_points":[69,82,78]},"ESA":{"currency":"ESA","name":"Spanish peseta (A account)","cldr_symbol":"ESA","symbol":"ESA","code_points":[69,83,65]},"ESB":{"currency":"ESB","name":"Spanish peseta (convertible account)","cldr_symbol":"ESB","symbol":"ESB","code_points":[69,83,66]},"ESP":{"currency":"ESP","name":"Spanish peseta","cldr_symbol":"ESP","symbol":"ESP","code_points":[69,83,80]},"ETB":{"currency":"ETB","name":"Ethiopian birr","cldr_symbol":"ETB","symbol":"ETB","code_points":[69,84,66]},"EUR":{"currency":"EUR","name":"euro","cldr_symbol":"€","symbol":"€","code_points":[8364]},"FIM":{"currency":"FIM","name":"Finnish markka","cldr_symbol":"FIM","symbol":"FIM","code_points":[70,73,77]},"FJD":{"currency":"FJD","name":"Fijian dollar","cldr_symbol":"FJD","symbol":"FJD","code_points":[70,74,68]},"FKP":{"currency":"FKP","name":"Falkland Islands pound","cldr_symbol":"FKP","symbol":"£","code_points":[163]},"FRF":{"currency":"FRF","name":"French franc","cldr_symbol":"FRF","symbol":"FRF","code_points":[70,82,70]},"GBP":{"currency":"GBP","name":"British pound sterling","cldr_symbol":"£","symbol":"£","code_points":[163]},"GEK":{"currency":"GEK","name":"Georgian kupon larit","cldr_symbol":"GEK","symbol":"GEK","code_points":[71,69,75]},"GEL":{"currency":"GEL","name":"Georgian lari","cldr_symbol":"GEL","symbol":"GEL","code_points":[71,69,76]},"GHC":{"currency":"GHC","name":"Ghanaian cedi (1979-2007)","cldr_symbol":"GHC","symbol":"GHC","code_points":[71,72,67]},"GHS":{"currency":"GHS","name":"Ghanaian cedi","cldr_symbol":"GHS","symbol":"¢","code_points":[162]},"GIP":{"currency":"GIP","name":"Gibraltar pound","cldr_symbol":"GIP","symbol":"£","code_points":[163]},"GMD":{"currency":"GMD","name":"Gambian dalasi","cldr_symbol":"GMD","symbol":"GMD","code_points":[71,77,68]},"GNF":{"currency":"GNF","name":"Guinean franc","cldr_symbol":"GNF","symbol":"GNF","code_points":[71,78,70]},"GNS":{"currency":"GNS","name":"Guinean syli","cldr_symbol":"GNS","symbol":"GNS","code_points":[71,78,83]},"GQE":{"currency":"GQE","name":"Equatorial Guinean ekwele","cldr_symbol":"GQE","symbol":"GQE","code_points":[71,81,69]},"GRD":{"currency":"GRD","name":"Greek drachma","cldr_symbol":"GRD","symbol":"GRD","code_points":[71,82,68]},"GTQ":{"currency":"GTQ","name":"Guatemalan quetzal","cldr_symbol":"GTQ","symbol":"Q","code_points":[81]},"GWE":{"currency":"GWE","name":"Portuguese Guinea escudo","cldr_symbol":"GWE","symbol":"GWE","code_points":[71,87,69]},"GWP":{"currency":"GWP","name":"Guinea-Bissau peso","cldr_symbol":"GWP","symbol":"GWP","code_points":[71,87,80]},"GYD":{"currency":"GYD","name":"Guyanaese dollar","cldr_symbol":"GYD","symbol":"GYD","code_points":[71,89,68]},"HKD":{"currency":"HKD","name":"Hong Kong dollar","cldr_symbol":"HK$","symbol":"$","code_points":[36]},"HNL":{"currency":"HNL","name":"Honduran lempira","cldr_symbol":"HNL","symbol":"L","code_points":[76]},"HRD":{"currency":"HRD","name":"Croatian dinar","cldr_symbol":"HRD","symbol":"HRD","code_points":[72,82,68]},"HRK":{"currency":"HRK","name":"Croatian kuna","cldr_symbol":"HRK","symbol":"kn","code_points":[107,110]},"HTG":{"currency":"HTG","name":"Haitian gourde","cldr_symbol":"HTG","symbol":"HTG","code_points":[72,84,71]},"HUF":{"currency":"HUF","name":"Hungarian forint","cldr_symbol":"HUF","symbol":"Ft","code_points":[70,116]},"IDR":{"currency":"IDR","name":"Indonesian rupiah","cldr_symbol":"IDR","symbol":"Rp","code_points":[82,112]},"IEP":{"currency":"IEP","name":"Irish pound","cldr_symbol":"IEP","symbol":"IEP","code_points":[73,69,80]},"ILP":{"currency":"ILP","name":"Israeli pound","cldr_symbol":"ILP","symbol":"ILP","code_points":[73,76,80]},"ILR":{"currency":"ILR","name":"Israeli sheqel (1980-1985)","cldr_symbol":"ILR","symbol":"ILR","code_points":[73,76,82]},"ILS":{"currency":"ILS","name":"Israeli new sheqel","cldr_symbol":"₪","symbol":"₪","code_points":[8362]},"INR":{"currency":"INR","name":"Indian rupee","cldr_symbol":"₹","symbol":"₨","code_points":[8360]},"IQD":{"currency":"IQD","name":"Iraqi dinar","cldr_symbol":"IQD","symbol":"IQD","code_points":[73,81,68]},"IRR":{"currency":"IRR","name":"Iranian rial","cldr_symbol":"IRR","symbol":"﷼","code_points":[65020]},"ISJ":{"currency":"ISJ","name":"Icelandic króna (1918-1981)","cldr_symbol":"ISJ","symbol":"ISJ","code_points":[73,83,74]},"ISK":{"currency":"ISK","name":"Icelandic króna","cldr_symbol":"ISK","symbol":"kr","code_points":[107,114]},"ITL":{"currency":"ITL","name":"Italian lira","cldr_symbol":"ITL","symbol":"ITL","code_points":[73,84,76]},"JMD":{"currency":"JMD","name":"Jamaican dollar","cldr_symbol":"JMD","symbol":"JMD","code_points":[74,77,68]},"JOD":{"currency":"JOD","name":"Jordanian dinar","cldr_symbol":"JOD","symbol":"JOD","code_points":[74,79,68]},"JPY":{"currency":"JPY","name":"Japanese yen","cldr_symbol":"¥","symbol":"¥","code_points":[165]},"KES":{"currency":"KES","name":"Kenyan shilling","cldr_symbol":"KES","symbol":"KES","code_points":[75,69,83]},"KGS":{"currency":"KGS","name":"Kyrgystani som","cldr_symbol":"KGS","symbol":"лв","code_points":[1083,1074]},"KHR":{"currency":"KHR","name":"Cambodian riel","cldr_symbol":"KHR","symbol":"KHR","code_points":[75,72,82]},"KMF":{"currency":"KMF","name":"Comorian franc","cldr_symbol":"KMF","symbol":"KMF","code_points":[75,77,70]},"KPW":{"currency":"KPW","name":"North Korean won","cldr_symbol":"KPW","symbol":"₩","code_points":[8361]},"KRH":{"currency":"KRH","name":"South Korean hwan (1953-1962)","cldr_symbol":"KRH","symbol":"KRH","code_points":[75,82,72]},"KRO":{"currency":"KRO","name":"South Korean won (1945-1953)","cldr_symbol":"KRO","symbol":"KRO","code_points":[75,82,79]},"KRW":{"currency":"KRW","name":"South Korean won","cldr_symbol":"₩","symbol":"₩","code_points":[8361]},"KWD":{"currency":"KWD","name":"Kuwaiti dinar","cldr_symbol":"KWD","symbol":"KWD","code_points":[75,87,68]},"KYD":{"currency":"KYD","name":"Cayman Islands dollar","cldr_symbol":"KYD","symbol":"$","code_points":[36]},"KZT":{"currency":"KZT","name":"Kazakhstani tenge","cldr_symbol":"KZT","symbol":"лв","code_points":[1083,1074]},"LAK":{"currency":"LAK","name":"Laotian kip","cldr_symbol":"LAK","symbol":"₭","code_points":[8365]},"LBP":{"currency":"LBP","name":"Lebanese pound","cldr_symbol":"LBP","symbol":"£","code_points":[163]},"LKR":{"currency":"LKR","name":"Sri Lankan rupee","cldr_symbol":"LKR","symbol":"₨","code_points":[8360]},"LRD":{"currency":"LRD","name":"Liberian dollar","cldr_symbol":"LRD","symbol":"$","code_points":[36]},"LSL":{"currency":"LSL","name":"Lesotho loti","cldr_symbol":"LSL","symbol":"LSL","code_points":[76,83,76]},"LTL":{"currency":"LTL","name":"Lithuanian litas","cldr_symbol":"LTL","symbol":"Lt","code_points":[76,116]},"LTT":{"currency":"LTT","name":"Lithuanian talonas","cldr_symbol":"LTT","symbol":"LTT","code_points":[76,84,84]},"LUC":{"currency":"LUC","name":"Luxembourgian convertible franc","cldr_symbol":"LUC","symbol":"LUC","code_points":[76,85,67]},"LUF":{"currency":"LUF","name":"Luxembourgian franc","cldr_symbol":"LUF","symbol":"LUF","code_points":[76,85,70]},"LUL":{"currency":"LUL","name":"Luxembourg financial franc","cldr_symbol":"LUL","symbol":"LUL","code_points":[76,85,76]},"LVL":{"currency":"LVL","name":"Latvian lats","cldr_symbol":"LVL","symbol":"Ls","code_points":[76,115]},"LVR":{"currency":"LVR","name":"Latvian ruble","cldr_symbol":"LVR","symbol":"LVR","code_points":[76,86,82]},"LYD":{"currency":"LYD","name":"Libyan dinar","cldr_symbol":"LYD","symbol":"LYD","code_points":[76,89,68]},"MAD":{"currency":"MAD","name":"Moroccan dirham","cldr_symbol":"MAD","symbol":"MAD","code_points":[77,65,68]},"MAF":{"currency":"MAF","name":"Moroccan franc","cldr_symbol":"MAF","symbol":"MAF","code_points":[77,65,70]},"MCF":{"currency":"MCF","name":"Monegasque franc","cldr_symbol":"MCF","symbol":"MCF","code_points":[77,67,70]},"MDC":{"currency":"MDC","name":"Moldovan cupon","cldr_symbol":"MDC","symbol":"MDC","code_points":[77,68,67]},"MDL":{"currency":"MDL","name":"Moldovan leu","cldr_symbol":"MDL","symbol":"MDL","code_points":[77,68,76]},"MGA":{"currency":"MGA","name":"Malagasy Ariary","cldr_symbol":"MGA","symbol":"MGA","code_points":[77,71,65]},"MGF":{"currency":"MGF","name":"Malagasy franc","cldr_symbol":"MGF","symbol":"MGF","code_points":[77,71,70]},"MKD":{"currency":"MKD","name":"Macedonian denar","cldr_symbol":"MKD","symbol":"MKD","code_points":[77,75,68]},"MKN":{"currency":"MKN","name":"Macedonian denar (1992-1993)","cldr_symbol":"MKN","symbol":"MKN","code_points":[77,75,78]},"MLF":{"currency":"MLF","name":"Malian franc","cldr_symbol":"MLF","symbol":"MLF","code_points":[77,76,70]},"MMK":{"currency":"MMK","name":"Myanma kyat","cldr_symbol":"MMK","symbol":"MMK","code_points":[77,77,75]},"MNT":{"currency":"MNT","name":"Mongolian tugrik","cldr_symbol":"MNT","symbol":"₮","code_points":[8366]},"MOP":{"currency":"MOP","name":"Macanese pataca","cldr_symbol":"MOP","symbol":"MOP","code_points":[77,79,80]},"MRO":{"currency":"MRO","name":"Mauritanian ouguiya","cldr_symbol":"MRO","symbol":"MRO","code_points":[77,82,79]},"MTL":{"currency":"MTL","name":"Maltese lira","cldr_symbol":"MTL","symbol":"MTL","code_points":[77,84,76]},"MTP":{"currency":"MTP","name":"Maltese pound","cldr_symbol":"MTP","symbol":"MTP","code_points":[77,84,80]},"MUR":{"currency":"MUR","name":"Mauritian rupee","cldr_symbol":"MUR","symbol":"₨","code_points":[8360]},"MVP":{"currency":"MVP","name":"Maldivian rupee","cldr_symbol":"MVP","symbol":"MVP","code_points":[77,86,80]},"MVR":{"currency":"MVR","name":"Maldivian rufiyaa","cldr_symbol":"MVR","symbol":"MVR","code_points":[77,86,82]},"MWK":{"currency":"MWK","name":"Malawian Kwacha","cldr_symbol":"MWK","symbol":"MWK","code_points":[77,87,75]},"MXN":{"currency":"MXN","name":"Mexican peso","cldr_symbol":"MX$","symbol":"$","code_points":[36]},"MXP":{"currency":"MXP","name":"Mexican silver peso (1861-1992)","cldr_symbol":"MXP","symbol":"MXP","code_points":[77,88,80]},"MXV":{"currency":"MXV","name":"Mexican investment unit","cldr_symbol":"MXV","symbol":"MXV","code_points":[77,88,86]},"MYR":{"currency":"MYR","name":"Malaysian ringgit","cldr_symbol":"MYR","symbol":"RM","code_points":[82,77]},"MZE":{"currency":"MZE","name":"Mozambican escudo","cldr_symbol":"MZE","symbol":"MZE","code_points":[77,90,69]},"MZM":{"currency":"MZM","name":"Mozambican metical (1980-2006)","cldr_symbol":"MZM","symbol":"MZM","code_points":[77,90,77]},"MZN":{"currency":"MZN","name":"Mozambican metical","cldr_symbol":"MZN","symbol":"MT","code_points":[77,84]},"NAD":{"currency":"NAD","name":"Namibian dollar","cldr_symbol":"NAD","symbol":"$","code_points":[36]},"NGN":{"currency":"NGN","name":"Nigerian naira","cldr_symbol":"NGN","symbol":"₦","code_points":[8358]},"NIC":{"currency":"NIC","name":"Nicaraguan córdoba (1988-1991)","cldr_symbol":"NIC","symbol":"NIC","code_points":[78,73,67]},"NIO":{"currency":"NIO","name":"Nicaraguan córdoba","cldr_symbol":"NIO","symbol":"C$","code_points":[67,36]},"NLG":{"currency":"NLG","name":"Dutch guilder","cldr_symbol":"NLG","symbol":"NLG","code_points":[78,76,71]},"NOK":{"currency":"NOK","name":"Norwegian krone","cldr_symbol":"NOK","symbol":"kr","code_points":[107,114]},"NPR":{"currency":"NPR","name":"Nepalese rupee","cldr_symbol":"NPR","symbol":"₨","code_points":[8360]},"NZD":{"currency":"NZD","name":"New Zealand dollar","cldr_symbol":"NZ$","symbol":"$","code_points":[36]},"OMR":{"currency":"OMR","name":"Omani rial","cldr_symbol":"OMR","symbol":"﷼","code_points":[65020]},"PAB":{"currency":"PAB","name":"Panamanian balboa","cldr_symbol":"PAB","symbol":"B/.","code_points":[66,47,46]},"PEI":{"currency":"PEI","name":"Peruvian inti","cldr_symbol":"PEI","symbol":"PEI","code_points":[80,69,73]},"PEN":{"currency":"PEN","name":"Peruvian nuevo sol","cldr_symbol":"PEN","symbol":"S/.","code_points":[83,47,46]},"PES":{"currency":"PES","name":"Peruvian sol (1863-1965)","cldr_symbol":"PES","symbol":"PES","code_points":[80,69,83]},"PGK":{"currency":"PGK","name":"Papua New Guinean kina","cldr_symbol":"PGK","symbol":"PGK","code_points":[80,71,75]},"PHP":{"currency":"PHP","name":"Philippine peso","cldr_symbol":"PHP","symbol":"Php","code_points":[80,104,112]},"PKR":{"currency":"PKR","name":"Pakistani rupee","cldr_symbol":"PKR","symbol":"₨","code_points":[8360]},"PLN":{"currency":"PLN","name":"Polish zloty","cldr_symbol":"PLN","symbol":"zł","code_points":[122,322]},"PLZ":{"currency":"PLZ","name":"Polish zloty (PLZ)","cldr_symbol":"PLZ","symbol":"PLZ","code_points":[80,76,90]},"PTE":{"currency":"PTE","name":"Portuguese escudo","cldr_symbol":"PTE","symbol":"PTE","code_points":[80,84,69]},"PYG":{"currency":"PYG","name":"Paraguayan guarani","cldr_symbol":"PYG","symbol":"Gs","code_points":[71,115]},"QAR":{"currency":"QAR","name":"Qatari rial","cldr_symbol":"QAR","symbol":"﷼","code_points":[65020]},"RHD":{"currency":"RHD","name":"Rhodesian dollar","cldr_symbol":"RHD","symbol":"RHD","code_points":[82,72,68]},"ROL":{"currency":"ROL","name":"Romanian leu (1952-2006)","cldr_symbol":"ROL","symbol":"ROL","code_points":[82,79,76]},"RON":{"currency":"RON","name":"Romanian leu","cldr_symbol":"RON","symbol":"lei","code_points":[108,101,105]},"RSD":{"currency":"RSD","name":"Serbian dinar","cldr_symbol":"RSD","symbol":"Дин.","code_points":[1044,1080,1085,46]},"RUB":{"currency":"RUB","name":"Russian ruble","cldr_symbol":"RUB","symbol":"руб","code_points":[1088,1091,1073]},"RUR":{"currency":"RUR","name":"Russian ruble (1991-1998)","cldr_symbol":"RUR","symbol":"RUR","code_points":[82,85,82]},"RWF":{"currency":"RWF","name":"Rwandan franc","cldr_symbol":"RWF","symbol":"RWF","code_points":[82,87,70]},"SAR":{"currency":"SAR","name":"Saudi riyal","cldr_symbol":"SAR","symbol":"﷼","code_points":[65020]},"SBD":{"currency":"SBD","name":"Solomon Islands dollar","cldr_symbol":"SBD","symbol":"$","code_points":[36]},"SCR":{"currency":"SCR","name":"Seychellois rupee","cldr_symbol":"SCR","symbol":"₨","code_points":[8360]},"SDD":{"currency":"SDD","name":"Sudanese dinar (1992-2007)","cldr_symbol":"SDD","symbol":"SDD","code_points":[83,68,68]},"SDG":{"currency":"SDG","name":"Sudanese pound","cldr_symbol":"SDG","symbol":"SDG","code_points":[83,68,71]},"SDP":{"currency":"SDP","name":"Sudanese pound (1957-1998)","cldr_symbol":"SDP","symbol":"SDP","code_points":[83,68,80]},"SEK":{"currency":"SEK","name":"Swedish krona","cldr_symbol":"SEK","symbol":"kr","code_points":[107,114]},"SGD":{"currency":"SGD","name":"Singapore dollar","cldr_symbol":"SGD","symbol":"$","code_points":[36]},"SHP":{"currency":"SHP","name":"Saint Helena pound","cldr_symbol":"SHP","symbol":"£","code_points":[163]},"SIT":{"currency":"SIT","name":"Slovenian tolar","cldr_symbol":"SIT","symbol":"SIT","code_points":[83,73,84]},"SKK":{"currency":"SKK","name":"Slovak koruna","cldr_symbol":"SKK","symbol":"SKK","code_points":[83,75,75]},"SLL":{"currency":"SLL","name":"Sierra Leonean leone","cldr_symbol":"SLL","symbol":"SLL","code_points":[83,76,76]},"SOS":{"currency":"SOS","name":"Somali shilling","cldr_symbol":"SOS","symbol":"S","code_points":[83]},"SRD":{"currency":"SRD","name":"Surinamese dollar","cldr_symbol":"SRD","symbol":"$","code_points":[36]},"SRG":{"currency":"SRG","name":"Surinamese guilder","cldr_symbol":"SRG","symbol":"SRG","code_points":[83,82,71]},"SSP":{"currency":"SSP","name":"South Sudanese pound","cldr_symbol":"SSP","symbol":"SSP","code_points":[83,83,80]},"STD":{"currency":"STD","name":"São Tomé and Príncipe dobra","cldr_symbol":"STD","symbol":"STD","code_points":[83,84,68]},"SUR":{"currency":"SUR","name":"Soviet rouble","cldr_symbol":"SUR","symbol":"SUR","code_points":[83,85,82]},"SVC":{"currency":"SVC","name":"Salvadoran colón","cldr_symbol":"SVC","symbol":"SVC","code_points":[83,86,67]},"SYP":{"currency":"SYP","name":"Syrian pound","cldr_symbol":"SYP","symbol":"£","code_points":[163]},"SZL":{"currency":"SZL","name":"Swazi lilangeni","cldr_symbol":"SZL","symbol":"SZL","code_points":[83,90,76]},"THB":{"currency":"THB","name":"Thai baht","cldr_symbol":"฿","symbol":"฿","code_points":[3647]},"TJR":{"currency":"TJR","name":"Tajikistani ruble","cldr_symbol":"TJR","symbol":"TJR","code_points":[84,74,82]},"TJS":{"currency":"TJS","name":"Tajikistani somoni","cldr_symbol":"TJS","symbol":"TJS","code_points":[84,74,83]},"TMM":{"currency":"TMM","name":"Turkmenistani manat (1993-2009)","cldr_symbol":"TMM","symbol":"TMM","code_points":[84,77,77]},"TMT":{"currency":"TMT","name":"Turkmenistani manat","cldr_symbol":"TMT","symbol":"TMT","code_points":[84,77,84]},"TND":{"currency":"TND","name":"Tunisian dinar","cldr_symbol":"TND","symbol":"TND","code_points":[84,78,68]},"TOP":{"currency":"TOP","name":"Tongan paʻanga","cldr_symbol":"TOP","symbol":"TOP","code_points":[84,79,80]},"TPE":{"currency":"TPE","name":"Timorese escudo","cldr_symbol":"TPE","symbol":"TPE","code_points":[84,80,69]},"TRL":{"currency":"TRL","name":"Turkish lira (1922-2005)","cldr_symbol":"TRL","symbol":"TRL","code_points":[84,82,76]},"TRY":{"currency":"TRY","name":"Turkish lira","cldr_symbol":"TRY","symbol":"TL","code_points":[84,76]},"TTD":{"currency":"TTD","name":"Trinidad and Tobago dollar","cldr_symbol":"TTD","symbol":"$","code_points":[36]},"TWD":{"currency":"TWD","name":"New Taiwan dollar","cldr_symbol":"NT$","symbol":"NT$","code_points":[78,84,36]},"TZS":{"currency":"TZS","name":"Tanzanian shilling","cldr_symbol":"TZS","symbol":"TZS","code_points":[84,90,83]},"UAH":{"currency":"UAH","name":"Ukrainian hryvnia","cldr_symbol":"UAH","symbol":"₴","code_points":[8372]},"UAK":{"currency":"UAK","name":"Ukrainian karbovanets","cldr_symbol":"UAK","symbol":"UAK","code_points":[85,65,75]},"UGS":{"currency":"UGS","name":"Ugandan shilling (1966-1987)","cldr_symbol":"UGS","symbol":"UGS","code_points":[85,71,83]},"UGX":{"currency":"UGX","name":"Ugandan shilling","cldr_symbol":"UGX","symbol":"UGX","code_points":[85,71,88]},"USD":{"currency":"USD","name":"US dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"USN":{"currency":"USN","name":"US dollar (next day)","cldr_symbol":"USN","symbol":"USN","code_points":[85,83,78]},"USS":{"currency":"USS","name":"US dollar (same day)","cldr_symbol":"USS","symbol":"USS","code_points":[85,83,83]},"UYI":{"currency":"UYI","name":"Uruguayan peso (indexed units)","cldr_symbol":"UYI","symbol":"UYI","code_points":[85,89,73]},"UYP":{"currency":"UYP","name":"Uruguayan peso (1975-1993)","cldr_symbol":"UYP","symbol":"UYP","code_points":[85,89,80]},"UYU":{"currency":"UYU","name":"Uruguayan peso","cldr_symbol":"UYU","symbol":"$U","code_points":[36,85]},"UZS":{"currency":"UZS","name":"Uzbekistan som","cldr_symbol":"UZS","symbol":"лв","code_points":[1083,1074]},"VEB":{"currency":"VEB","name":"Venezuelan bolívar (1871-2008)","cldr_symbol":"VEB","symbol":"VEB","code_points":[86,69,66]},"VEF":{"currency":"VEF","name":"Venezuelan bolívar","cldr_symbol":"VEF","symbol":"Bs","code_points":[66,115]},"VND":{"currency":"VND","name":"Vietnamese dong","cldr_symbol":"₫","symbol":"₫","code_points":[8363]},"VNN":{"currency":"VNN","name":"Vietnamese dong (1978-1985)","cldr_symbol":"VNN","symbol":"VNN","code_points":[86,78,78]},"VUV":{"currency":"VUV","name":"Vanuatu vatu","cldr_symbol":"VUV","symbol":"VUV","code_points":[86,85,86]},"WST":{"currency":"WST","name":"Samoan tala","cldr_symbol":"WST","symbol":"WST","code_points":[87,83,84]},"XAF":{"currency":"XAF","name":"CFA franc BEAC","cldr_symbol":"FCFA","symbol":"FCFA","code_points":[70,67,70,65]},"XAG":{"currency":"XAG","name":"troy ounce of silver","cldr_symbol":"XAG","symbol":"XAG","code_points":[88,65,71]},"XAU":{"currency":"XAU","name":"troy ounce of gold","cldr_symbol":"XAU","symbol":"XAU","code_points":[88,65,85]},"XBA":{"currency":"XBA","name":"European composite unit","cldr_symbol":"XBA","symbol":"XBA","code_points":[88,66,65]},"XBB":{"currency":"XBB","name":"European monetary unit","cldr_symbol":"XBB","symbol":"XBB","code_points":[88,66,66]},"XBC":{"currency":"XBC","name":"European unit of account (XBC)","cldr_symbol":"XBC","symbol":"XBC","code_points":[88,66,67]},"XBD":{"currency":"XBD","name":"European unit of account (XBD)","cldr_symbol":"XBD","symbol":"XBD","code_points":[88,66,68]},"XCD":{"currency":"XCD","name":"East Caribbean dollar","cldr_symbol":"EC$","symbol":"$","code_points":[36]},"XDR":{"currency":"XDR","name":"special drawing rights","cldr_symbol":"XDR","symbol":"XDR","code_points":[88,68,82]},"XEU":{"currency":"XEU","name":"European currency unit","cldr_symbol":"XEU","symbol":"XEU","code_points":[88,69,85]},"XFO":{"currency":"XFO","name":"French gold franc","cldr_symbol":"XFO","symbol":"XFO","code_points":[88,70,79]},"XFU":{"currency":"XFU","name":"French UIC-franc","cldr_symbol":"XFU","symbol":"XFU","code_points":[88,70,85]},"XOF":{"currency":"XOF","name":"CFA franc BCEAO","cldr_symbol":"CFA","symbol":"CFA","code_points":[67,70,65]},"XPD":{"currency":"XPD","name":"troy ounce of palladium","cldr_symbol":"XPD","symbol":"XPD","code_points":[88,80,68]},"XPF":{"currency":"XPF","name":"CFP franc","cldr_symbol":"CFPF","symbol":"CFPF","code_points":[67,70,80,70]},"XPT":{"currency":"XPT","name":"troy ounce of platinum","cldr_symbol":"XPT","symbol":"XPT","code_points":[88,80,84]},"XRE":{"currency":"XRE","name":"RINET Funds unit","cldr_symbol":"XRE","symbol":"XRE","code_points":[88,82,69]},"XSU":{"currency":"XSU","name":"Sucre","cldr_symbol":"XSU","symbol":"XSU","code_points":[88,83,85]},"XTS":{"currency":"XTS","name":"Testing Currency unit","cldr_symbol":"XTS","symbol":"XTS","code_points":[88,84,83]},"XUA":{"currency":"XUA","name":"ADB unit of account","cldr_symbol":"XUA","symbol":"XUA","code_points":[88,85,65]},"XXX":{"currency":"XXX","name":"(unknown unit of currency)","cldr_symbol":"XXX","symbol":"XXX","code_points":[88,88,88]},"YDD":{"currency":"YDD","name":"Yemeni dinar","cldr_symbol":"YDD","symbol":"YDD","code_points":[89,68,68]},"YER":{"currency":"YER","name":"Yemeni rial","cldr_symbol":"YER","symbol":"﷼","code_points":[65020]},"YUD":{"currency":"YUD","name":"Yugoslavian hard dinar (1966-1990)","cldr_symbol":"YUD","symbol":"YUD","code_points":[89,85,68]},"YUM":{"currency":"YUM","name":"Yugoslavian new dinar (1994-2002)","cldr_symbol":"YUM","symbol":"YUM","code_points":[89,85,77]},"YUN":{"currency":"YUN","name":"Yugoslavian convertible dinar (1990-1992)","cldr_symbol":"YUN","symbol":"YUN","code_points":[89,85,78]},"YUR":{"currency":"YUR","name":"Yugoslavian reformed dinar (1992-1993)","cldr_symbol":"YUR","symbol":"YUR","code_points":[89,85,82]},"ZAL":{"currency":"ZAL","name":"South African rand (financial)","cldr_symbol":"ZAL","symbol":"ZAL","code_points":[90,65,76]},"ZAR":{"currency":"ZAR","name":"South African rand","cldr_symbol":"ZAR","symbol":"R","code_points":[82]},"ZMK":{"currency":"ZMK","name":"Zambian kwacha (1968-2012)","cldr_symbol":"ZMK","symbol":"ZMK","code_points":[90,77,75]},"ZMW":{"currency":"ZMW","name":"Zambian kwacha","cldr_symbol":"ZMW","symbol":"ZMW","code_points":[90,77,87]},"ZRN":{"currency":"ZRN","name":"Zairean new zaire (1993-1998)","cldr_symbol":"ZRN","symbol":"ZRN","code_points":[90,82,78]},"ZRZ":{"currency":"ZRZ","name":"Zairean zaire (1971-1993)","cldr_symbol":"ZRZ","symbol":"ZRZ","code_points":[90,82,90]},"ZWD":{"currency":"ZWD","name":"Zimbabwean dollar (1980-2008)","cldr_symbol":"ZWD","symbol":"Z$","code_points":[90,36]},"ZWL":{"currency":"ZWL","name":"Zimbabwean dollar (2009)","cldr_symbol":"ZWL","symbol":"ZWL","code_points":[90,87,76]},"ZWR":{"currency":"ZWR","name":"Zimbabwean dollar (2008)","cldr_symbol":"ZWR","symbol":"ZWR","code_points":[90,87,82]}};

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
      this.formats = {"2":"{0} and {1}","end":"{0}, and {1}","middle":"{0}, {1}","start":"{0}, {1}"};
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
        result = format.replace(/\{(\d+)\}/g, function() {
          return RegExp.$1;
        });
        if (TwitterCldr.is_rtl) {
          result = TwitterCldr.Bidi.from_string(result, {
            "direction": "RTL"
          }).reorder_visually().toString();
        }
        return result.replace(/(\d+)/g, function() {
          return elements[parseInt(RegExp.$1)];
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

    function Bidi(options) {
      if (options == null) {
        options = {};
      }
      this.bidi_classes = {"BN":{"8":[0],"13":[14],"5":[127,8298],"25":[134],"0":[173,65279,917505],"2":[8203],"4":[8288],"7":[119155],"95":[917536]},"S":{"0":[9,11,31]},"B":{"0":[10,13,133,8233],"2":[28]},"WS":{"0":[12,32,5760,6158,8232,8287,12288],"10":[8192]},"ON":{"1":[33,171,174,697,884,900,1542,1550,5787,6468,8189,8448,8456,8506,12342,12443,12829,13278,42622,64830,65120,65281,126704,127338],"4":[38,187,8512,65286,65529,127942],"5":[59,91,3059,8478,11493,65307,65339,127792],"3":[123,166,2038,3898,8451,8522,12289,13004,13175,43048,43124,128249,128320],"0":[161,180,215,247,894,903,1014,1418,1758,1769,3066,5120,6464,8125,8468,8485,8487,8489,8585,12336,12448,12539,13311,42611,42888,65021,65105,65108,65128,65131,65793,67871,119365,120539,120597,120655,120713,120771,128064],"2":[182,8127,8141,8157,8173,8316,8332,8470,12349,12924,42509,65124,65506],"13":[706,722,127153],"8":[741,65110],"16":[751,127968],"6":[3192,11513,65512,68409],"9":[5008,6128,11088,65040],"10":[6144,9280,65371,128581],"33":[6622,42752],"23":[8208,128336],"14":[8245,12977,127136,127169,127185],"25":[8261,9083,11904],"15":[8528,12880],"129":[8592],"289":[8724],"93":[9110],"38":[9216],"39":[9312],"449":[9450],"82":[9901],"254":[9985],"588":[10496],"59":[11776],"88":[11931],"213":[12032],"11":[12272,65936],"24":[12296],"35":[12736],"63":[19904],"54":[42128],"31":[65072],"74":[65856],"19":[69714,127872],"65":[119296],"86":[119552],"43":[126976],"99":[127024],"32":[127744],"69":[127799,128507,128640],"36":[127904],"62":[128000],"181":[128066],"61":[128256],"115":[128768]},"ET":{"2":[35,65283],"3":[162],"1":[176,1545,2546,43064,65129,65504,65509],"0":[1423,1642,2555,2801,3065,3647,6107,8494,8723,65119],"4":[8240],"25":[8352]},"ES":{"0":[43,45,8722,64297,65291,65293],"1":[8314,8330,65122]},"CS":{"0":[44,58,160,1548,8239,8260,65104,65106,65109,65292,65306],"1":[46,65294]},"EN":{"9":[48,1776,8320,65296],"1":[178],"0":[185,8304],"5":[8308],"19":[9352],"49":[120782],"10":[127232]},"L":{"25":[65,97,5761,6576,65313,65345,65549],"0":[170,181,186,750,902,908,1417,2363,2482,2510,2519,2563,2654,2691,2761,2768,2880,2903,2947,2972,3024,3031,3133,3199,3294,3406,3415,3517,3716,3722,3725,3749,3751,3773,3782,3894,3896,3967,3973,4145,4152,4295,4301,4696,4800,6070,6108,6314,6743,6753,6965,6971,7082,7143,7150,7379,7393,8025,8027,8029,8126,8206,8305,8319,8450,8455,8469,8484,8486,8488,9109,9900,11559,11565,43047,43597,43697,43712,43714,65792,65794,69632,69932,71340,71350,119970,119995,120134],"22":[192,3090,3218,6656,11648],"30":[216,8031,13280,66304,127248],"448":[248],"6":[699,1369,2425,2474,2548,2602,2730,2858,3449,3520,3648,3737,4688,4792,6100,8118,8134,8182,11680,11688,11696,11704,11712,11720,11728,11736,43808,43816,64256,69703,69819,119997,120086,120138],"1":[720,886,2434,2447,2503,2507,2524,2575,2610,2613,2616,2738,2763,2784,2818,2831,2866,2877,2887,2891,2908,2969,2974,2979,3006,3009,3160,3168,3202,3274,3285,3296,3313,3330,3424,3458,3634,3713,3719,3754,3762,4155,4227,5941,6087,6448,6755,7078,7154,7220,7413,8526,11506,11631,12334,43346,43444,43450,43486,43567,43571,43701,44006,65596,69815,71342,110592,119171,119966,119973,127568],"4":[736,2741,2869,3125,3253,3776,3976,6512,6973,8473,8517,12337,12344,43705,64275,120128],"3":[880,890,2365,2377,2486,2493,2649,2749,2962,3137,3389,3732,3757,3804,4186,4682,4698,4746,4786,4802,4882,5902,6435,7401,8144,8490,8508,11499,12540,42896,43015,44009,66336,74864,119977,120071,120123],"2":[904,2382,2527,2622,2674,2703,2911,2958,2984,3014,3018,3073,3086,3214,3270,3342,3398,3402,3535,3570,3745,5998,6441,6681,7146,8130,8178,12293,12445,43011,43584,65498],"19":[910,2404],"82":[931],"139":[1015],"157":[1162,66560],"37":[1329,7968,11520,43264],"38":[1377,119040],"54":[2307],"9":[2392,2662,3114,3174,3242,3302,3792,3902,6112,6160,6784,6800,8458,43000,43250,43600,44016,66720,69734,69872,70079,70096,71360],"7":[2437,2821,3077,3205,3261,3333,3544,4030,6078,7360,8016,43056,43588,43758,120077,120772],"21":[2451,2579,2707,2835],"11":[2534,2990,12992,43214,65536,119982],"5":[2565,2949,4039,4231,6451,6765,7406,7960,8008,8150,42738,42889,43777,43785,43793,65474,65482,65490],"8":[2693,3507,6979,7028,12321,65847,119146,127552],"10":[2790,6608,8495,42912,43471],"17":[2918,3461,5920,5952,119648],"12":[3046,3663,4046,4213,5888,5984,8160,8336,94099],"40":[3346,4704,6272,8544,12549,43520],"15":[3430,4193,4992],"23":[3482,3840,42624],"47":[3585,6916,7164,12832,43395,43648,119214],"26":[3866,6992,66352],"35":[3913,69891],"44":[4096,12784,65799,66000],"24":[4159,43020,43310,69840],"14":[4238,4808,7227,65599],"39":[4254,6470],"376":[4304],"32":[4752],"56":[4824,120540,120598,120656,120714],"66":[4888],"28":[4960,6400,66176,127462],"84":[5024,119808],"638":[5121],"80":[5792],"51":[6016,43072,70018],"87":[6176],"69":[6320],"43":[6528],"55":[6686,11568],"13":[6816,65616,66504,69942],"31":[7042,43612],"57":[7084,127280],"50":[7245,120488],"191":[7424],"277":[7680],"52":[8064],"68":[9014,93952],"77":[9372],"255":[10240],"46":[11264,11312,13008,42560,94032],"132":[11360],"85":[12353],"89":[12449],"93":[12593],"42":[12688,71296,127344,127504],"27":[12896,42512,120094],"49":[12927],"118":[13056],"98":[13179,74752],"6591":[13312],"22156":[19968],"316":[42192],"79":[42656],"101":[42786],"67":[43136],"29":[43359,66432,119180],"16":[43453,43739],"36":[43968,66463],"11206":[44032],"48":[55243,66208,69762],"8813":[55296],"105":[64112],"88":[65382],"18":[65576],"122":[65664],"53":[69634],"878":[73728],"1070":[77824],"568":[92160],"245":[118784],"61":[119081],"70":[119894],"64":[120005],"339":[120146],"42719":[131072],"4383":[173824],"541":[194560],"131071":[983040]},"NSM":{"111":[768],"6":[1155,1750,2385,3636,6071,6744,7394,65056,119173],"44":[1425],"0":[1471,1479,1648,1809,2362,2364,2381,2433,2492,2509,2620,2641,2677,2748,2765,2817,2876,2879,2893,2902,2946,3008,3021,3260,3405,3530,3542,3633,3761,3893,3895,3897,4038,4226,4237,4253,6086,6109,6313,6450,6742,6752,6754,6783,6964,6972,6978,7083,7142,7149,7405,7412,11647,42655,43010,43014,43019,43204,43443,43452,43587,43596,43696,43713,43766,44005,44008,44013,64286,66045,68159,69633,71339,71341,71351],"1":[1473,1476,1767,2402,2530,2561,2625,2631,2672,2689,2759,2786,2914,3157,3170,3276,3298,3426,3771,3864,3974,4153,4157,4184,4229,5970,6002,6068,6439,6679,7040,7080,7144,7222,12441,42736,43045,43569,43573,43703,43710,43756,68101,69760,69817,70016],"10":[1552,1958,3981,6089,43335],"20":[1611],"5":[1759,3764,3784,4146,43561,71344],"3":[1770,2070,2497,2881,3146,3393,4141,4209,6912,7074,7676,12330,42607,43446,68108,69811,94095,119210],"26":[1840,2276],"8":[2027,2075,7019,70070],"2":[2085,2137,2304,2635,3134,3142,3538,4190,4957,5906,5938,6155,6432,6457,7151,7376,11503,43392,43698,68097,68152,69888,119143,119362],"4":[2089,2753,3968,6966,69927],"7":[2369,3655,6757,7212,43302,69933,119163],"13":[3953],"35":[3993],"9":[6771,42612],"12":[7380],"38":[7616],"32":[8400],"31":[11744],"17":[43232],"15":[65024],"14":[69688],"239":[917760]},"R":{"0":[1470,1472,1475,1478,2042,2074,2084,2088,2142,8207,64285,64318,67592,67644,67903,68096],"26":[1488,68121,68440],"4":[1520,64312],"42":[1984],"1":[2036,64320,64323,67639,68030],"21":[2048,68416],"14":[2096],"24":[2112],"9":[64287,64326],"12":[64298],"5":[67584],"43":[67594],"22":[67647],"8":[67671,68176],"27":[67840],"25":[67872],"55":[67968],"3":[68112],"2":[68117],"7":[68160,68472],"31":[68192],"53":[68352],"72":[68608]},"AN":{"4":[1536],"9":[1632],"1":[1643],"0":[1757],"30":[69216]},"AL":{"0":[1544,1547,1549,1563,1969,2208,126500,126503,126521,126523,126530,126535,126537,126539,126548,126551,126553,126555,126557,126559,126564,126590],"44":[1566],"2":[1645,126541,126625],"100":[1649],"1":[1765,1774,1807,126497,126545,126561],"19":[1786],"29":[1810],"88":[1869],"10":[2210],"113":[64336],"362":[64467],"63":[64848],"53":[64914],"12":[65008],"4":[65136,126629],"134":[65142],"3":[126464,126516,126567,126580,126585],"26":[126469],"9":[126505,126592],"6":[126572],"16":[126603,126635]},"LRE":{"0":[8234]},"RLE":{"0":[8235]},"PDF":{"0":[8236]},"LRO":{"0":[8237]},"RLO":{"0":[8238]}};
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
    function Calendar() {}

    Calendar.calendar = {"additional_formats":{"EHm":"E HH:mm","EHms":"E HH:mm:ss","Ed":"d E","Ehm":"E h:mm a","Ehms":"E h:mm:ss a","Gy":"y G","GyMMM":"MMM y G","GyMMMEd":"E, MMM d, y G","GyMMMd":"MMM d, y G","H":"HH","Hm":"HH:mm","Hms":"HH:mm:ss","M":"L","MEd":"E, M/d","MMM":"LLL","MMMEd":"E, MMM d","MMMd":"MMM d","Md":"M/d","d":"d","h":"h a","hm":"h:mm a","hms":"h:mm:ss a","ms":"mm:ss","y":"y","yM":"M/y","yMEd":"E, M/d/y","yMMM":"MMM y","yMMMEd":"E, MMM d, y","yMMMd":"MMM d, y","yMd":"M/d/y","yQQQ":"QQQ y","yQQQQ":"QQQQ y"},"days":{"format":{"abbreviated":{"fri":"Fri","mon":"Mon","sat":"Sat","sun":"Sun","thu":"Thu","tue":"Tue","wed":"Wed"},"narrow":{"fri":"F","mon":"M","sat":"S","sun":"S","thu":"T","tue":"T","wed":"W"},"short":{"fri":"Fr","mon":"Mo","sat":"Sa","sun":"Su","thu":"Th","tue":"Tu","wed":"We"},"wide":{"fri":"Friday","mon":"Monday","sat":"Saturday","sun":"Sunday","thu":"Thursday","tue":"Tuesday","wed":"Wednesday"}},"stand-alone":{"abbreviated":{"fri":"Fri","mon":"Mon","sat":"Sat","sun":"Sun","thu":"Thu","tue":"Tue","wed":"Wed"},"narrow":{"fri":"F","mon":"M","sat":"S","sun":"S","thu":"T","tue":"T","wed":"W"},"short":{"fri":"Fr","mon":"Mo","sat":"Sa","sun":"Su","thu":"Th","tue":"Tu","wed":"We"},"wide":{"fri":"Friday","mon":"Monday","sat":"Saturday","sun":"Sunday","thu":"Thursday","tue":"Tuesday","wed":"Wednesday"}}},"eras":{"abbr":{"0":"BC","1":"AD"},"name":{"0":"Before Christ","1":"Anno Domini"},"narrow":{"0":"B","1":"A"}},"fields":{"day":"Day","dayperiod":"AM/PM","era":"Era","hour":"Hour","minute":"Minute","month":"Month","second":"Second","week":"Week","weekday":"Day of the Week","year":"Year","zone":"Time Zone"},"formats":{"date":{"full":{"pattern":"EEEE, MMMM d, y"},"long":{"pattern":"MMMM d, y"},"medium":{"pattern":"MMM d, y"},"short":{"pattern":"M/d/yy"}},"datetime":{"full":{"pattern":"{{date}} 'at' {{time}}"},"long":{"pattern":"{{date}} 'at' {{time}}"},"medium":{"pattern":"{{date}}, {{time}}"},"short":{"pattern":"{{date}}, {{time}}"}},"time":{"full":{"pattern":"h:mm:ss a zzzz"},"long":{"pattern":"h:mm:ss a z"},"medium":{"pattern":"h:mm:ss a"},"short":{"pattern":"h:mm a"}}},"months":{"format":{"abbreviated":{"1":"Jan","10":"Oct","11":"Nov","12":"Dec","2":"Feb","3":"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sep"},"narrow":{"1":"J","10":"O","11":"N","12":"D","2":"F","3":"M","4":"A","5":"M","6":"J","7":"J","8":"A","9":"S"},"wide":{"1":"January","10":"October","11":"November","12":"December","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September"}},"stand-alone":{"abbreviated":{"1":"Jan","10":"Oct","11":"Nov","12":"Dec","2":"Feb","3":"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sep"},"narrow":{"1":"J","10":"O","11":"N","12":"D","2":"F","3":"M","4":"A","5":"M","6":"J","7":"J","8":"A","9":"S"},"wide":{"1":"January","10":"October","11":"November","12":"December","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September"}}},"periods":{"format":{"abbreviated":null,"narrow":{"am":"a","noon":"n","pm":"p"},"wide":{"am":"AM","noon":"noon","pm":"PM","variant":{"am":"a.m.","pm":"p.m."}}},"stand-alone":{}},"quarters":{"format":{"abbreviated":{"1":"Q1","2":"Q2","3":"Q3","4":"Q4"},"narrow":{"1":1,"2":2,"3":3,"4":4},"wide":{"1":"1st quarter","2":"2nd quarter","3":"3rd quarter","4":"4th quarter"}},"stand-alone":{"abbreviated":{"1":"Q1","2":"Q2","3":"Q3","4":"Q4"},"narrow":{"1":1,"2":2,"3":3,"4":4},"wide":{"1":"1st quarter","2":"2nd quarter","3":"3rd quarter","4":"4th quarter"}}}};

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

    Calendar.get_root = function(key, options) {
      var format, names_form, root, _ref;
      if (options == null) {
        options = {};
      }
      root = this.calendar[key];
      names_form = options["names_form"] || "wide";
      format = options.format || ((root != null ? (_ref = root["stand-alone"]) != null ? _ref[names_form] : void 0 : void 0) != null ? "stand-alone" : "format");
      return root[format][names_form];
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
      var decomp, match;
      decomp = this.fields[decomposition_data_index];
      match = decomp.match(decomposition_regex);
      if ((match != null) && (match[2] != null)) {
        return match[2].match(/\S+/g).map((function(s) {
          return parseInt(s, 16);
        }));
      } else {
        throw "decomposition " + decomp + " has invalid format";
      }
    };

    CodePoint.prototype.compatibility_decomposition_tag = function() {
      var decomp, match;
      decomp = this.fields[decomposition_data_index];
      if ((match = decomp.match(decomposition_regex))) {
        if (match[1] == null) {
          return null;
        } else {
          return match[1];
        }
      } else {
        throw "decomposition " + decomp + " has invalid format";
      }
    };

    CodePoint.prototype.is_compatibility_decomposition = function() {
      return this.compatibility_decomposition_tag() != null;
    };

    CodePoint.prototype.hangul_type = function() {
      return TwitterCldr.CodePoint.hangul_type(code_point);
    };

    CodePoint.prototype.is_excluded_from_composition = function() {
      return TwitterCldr.CodePoint.is_excluded_from_composition(code_point);
    };

    CodePoint.find = function(code_point) {
      var code_point_data, target, target_data;
      if (this.code_point_cache[code_point] != null) {
        return this.code_point_cache[code_point];
      }
      target = this.get_block_name(code_point);
      if (target == null) {
        return null;
      }
      target_data = this.block_data[target];
      code_point_data = target_data[code_point];
      if (code_point_data == null) {
        code_point_data = this.get_range_start(code_point, target_data);
      }
      if (code_point_data != null) {
        return this.code_point_cache[code_point] = new CodePoint(code_point_data);
      }
    };

    CodePoint.code_points_for_index_name = function(index_name, value) {
      return this.get_index(index_name)[value];
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

    CodePoint.for_canonical_decomposition = function(code_points) {
      if (this.canonical_compositions[code_points.join("|")] != null) {
        return this.find(this.canonical_compositions[code_points.join("|")]);
      } else {
        return null;
      }
    };

    CodePoint.canonical_compositions = {};

    CodePoint.hangul_type = function(code_point) {
      var range, type, _i, _j, _len, _len1, _ref, _ref1;
      if (this.hangul_type_cache[code_point] != null) {
        return this.hangul_type_cache[code_point];
      }
      if (code_point) {
        _ref = ["lparts", "vparts", "tparts", "compositions"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          type = _ref[_i];
          _ref1 = this.hangul_blocks[type];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            range = _ref1[_j];
            range = new TwitterCldr.Range(range[0], range[1]);
            if (range.includes(code_point)) {
              return this.hangul_type_cache[code_point] = type;
            }
          }
        }
        return this.hangul_type_cache[code_point] = null;
      } else {
        return this.hangul_type_cache[code_point] = null;
      }
    };

    CodePoint.is_excluded_from_composition = function(code_point) {
      var exclusion, range, _i, _len, _ref;
      if (this.composition_exclusion_cache[code_point] != null) {
        return this.composition_exclusion_cache[code_point];
      }
      _ref = this.composition_exclusions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        exclusion = _ref[_i];
        range = new TwitterCldr.Range(exclusion[0], exclusion[1]);
        if (range.includes(code_point)) {
          return this.composition_exclusion_cache[code_point] = true;
        }
      }
      return this.composition_exclusion_cache[code_point] = false;
    };

    CodePoint.index_key_cache = {};

    CodePoint.index_keys = {};

    CodePoint.indices = {};

    CodePoint.get_index = function(index_name) {
      var index_data, index_data_formatted, k, range, v, _i, _len, _ref;
      if (this.index_cache[index_name] != null) {
        return this.index_cache[index_name];
      }
      index_data = this.indices[index_name];
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

    CodePoint.properties = {};

    CodePoint.get_property_data = function(property_name) {
      var k, property_data, property_data_formatted, range, v, _i, _len, _ref;
      if (this.property_data_cache[property_name] != null) {
        return this.property_data_cache[property_name];
      }
      property_data = this.properties[property_name];
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

    CodePoint.hangul_type_cache = {};

    CodePoint.code_point_cache = {};

    CodePoint.composition_exclusion_cache = {};

    CodePoint.hangul_blocks = {};

    CodePoint.composition_exclusions = {};

    CodePoint.block_cache = {};

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

    CodePoint.get_block_range = function(block_name) {
      var block_data;
      if (block_name == null) {
        return null;
      }
      block_data = this.blocks[block_name];
      if (block_data != null) {
        return new TwitterCldr.Range(block_data[0], block_data[1]);
      } else {
        return null;
      }
    };

    CodePoint.blocks = {};

    CodePoint.block_data = {};

    CodePoint.get_range_start = function(code_point, block_data) {
      var k, keys, start_data, v;
      keys = [];
      for (k in block_data) {
        v = block_data[k];
        keys.push(k);
      }
      start_data = block_data[TwitterCldr.Utilities.min(keys)];
      if ((start_data[1] != null) && /<.*, First>/.test(start_data[1])) {
        start_data = TwitterCldr.Utilities.clone(start_data);
        start_data[0] = code_point;
        start_data[1] = start_data[1].replace(', First', '');
        return start_data;
      } else {
        return null;
      }
    };

    return CodePoint;

  })();

  TwitterCldr.PhoneCodes = (function() {
    function PhoneCodes() {}

    PhoneCodes.phone_codes = {"ac":"247","ad":"376","ae":"971","af":"93","ag":"1","ai":"1","al":"355","am":"374","an":"599","ao":"244","aq":"672","ar":"54","as":"1","at":"43","au":"61","aw":"297","ax":"358","az":"994","ba":"387","bb":"1","bd":"880","be":"32","bf":"226","bg":"359","bh":"973","bi":"257","bj":"229","bl":"590","bm":"1","bn":"673","bo":"591","br":"55","bs":"1","bt":"975","bw":"267","by":"375","bz":"501","ca":"1","cc":"61","cd":"243","cf":"236","cg":"242","ch":"41","ci":"225","ck":"682","cl":"56","cm":"237","cn":"86","co":"57","cr":"506","cu":"53","cv":"238","cx":"61","cy":"357","cz":"420","de":"49","dj":"253","dk":"45","dm":"1","do":"1","dz":"213","ec":"593","ee":"372","eg":"20","er":"291","es":"34","et":"251","fi":"358","fj":"679","fk":"500","fm":"691","fo":"298","fr":"33","ga":"241","gb":"44","gd":"1","ge":"995","gf":"594","gg":"44","gh":"233","gi":"350","gl":"299","gm":"220","gn":"224","gp":"590","gq":"240","gr":"30","gt":"502","gu":"1","gw":"245","gy":"592","hk":"852","hn":"504","hr":"385","ht":"509","hu":"36","id":"62","ie":"353","il":"972","im":"44","in":"91","io":"246","iq":"964","ir":"98","is":"354","it":"39","je":"44","jm":"1","jo":"962","jp":"81","ke":"254","kg":"996","kh":"855","ki":"686","km":"269","kn":"1","kp":"850","kr":"82","kw":"965","ky":"1","kz":"7","la":"856","lb":"961","lc":"1","li":"423","lk":"94","lr":"231","ls":"266","lt":"370","lu":"352","lv":"371","ly":"218","ma":"212","mc":"377","md":"373","me":"382","mg":"261","mh":"692","mk":"389","ml":"223","mm":"95","mn":"976","mo":"853","mp":"1","mq":"596","mr":"222","ms":"1","mt":"356","mu":"230","mv":"960","mw":"265","mx":"52","my":"60","mz":"258","na":"264","nc":"687","ne":"227","nf":"672","ng":"234","ni":"505","nl":"31","no":"47","np":"977","nr":"674","nu":"683","nz":"64","om":"968","pa":"507","pe":"51","pf":"689","pg":"675","ph":"63","pk":"92","pl":"48","pm":"508","pr":"1","ps":"972","pt":"351","pw":"680","py":"595","qa":"974","re":"262","ro":"40","rs":"381","ru":"7","rw":"250","sa":"966","sb":"677","sc":"248","sd":"249","se":"46","sg":"65","sh":"290","si":"386","sj":"47","sk":"421","sl":"232","sm":"378","sn":"221","so":"252","sr":"597","ss":"211","st":"239","sv":"503","sy":"963","sz":"268","tc":"1","td":"235","tf":"262","tg":"228","th":"66","tj":"992","tk":"690","tl":"670","tm":"993","tn":"216","to":"676","tr":"90","tt":"1","tv":"688","tw":"886","tz":"255","ua":"380","ug":"256","us":"1","uy":"598","uz":"998","va":"39","vc":"1","ve":"58","vg":"1","vi":"1","vn":"84","vu":"678","wf":"681","ws":"685","ye":"967","yt":"262","za":"27","zm":"260","zw":"263"};

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

    postal_codes = {"ad":"AD\\d{3}","am":"(37)?\\d{4}","ar":"([A-HJ-NP-Z])?\\d{4}([A-Z]{3})?","as":"96799","at":"\\d{4}","au":"\\d{4}","ax":"22\\d{3}","az":"\\d{4}","ba":"\\d{5}","bb":"(BB\\d{5})?","bd":"\\d{4}","be":"\\d{4}","bg":"\\d{4}","bh":"((1[0-2]|[2-9])\\d{2})?","bm":"[A-Z]{2}[ ]?[A-Z0-9]{2}","bn":"[A-Z]{2}[ ]?\\d{4}","br":"\\d{5}[\\-]?\\d{3}","by":"\\d{6}","ca":"[ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z][ ]?\\d[ABCEGHJ-NPRSTV-Z]\\d","cc":"6799","ch":"\\d{4}","ck":"\\d{4}","cl":"\\d{7}","cn":"\\d{6}","cr":"\\d{4,5}|\\d{3}-\\d{4}","cs":"\\d{5}","cv":"\\d{4}","cx":"6798","cy":"\\d{4}","cz":"\\d{3}[ ]?\\d{2}","de":"\\d{5}","dk":"\\d{4}","do":"\\d{5}","dz":"\\d{5}","ec":"([A-Z]\\d{4}[A-Z]|(?:[A-Z]{2})?\\d{6})?","ee":"\\d{5}","eg":"\\d{5}","es":"\\d{5}","et":"\\d{4}","fi":"\\d{5}","fk":"FIQQ 1ZZ","fm":"(9694[1-4])([ \\-]\\d{4})?","fo":"\\d{3}","fr":"\\d{2}[ ]?\\d{3}","gb":"GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\\d{1,4}","ge":"\\d{4}","gf":"9[78]3\\d{2}","gg":"GY\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}","gl":"39\\d{2}","gn":"\\d{3}","gp":"9[78][01]\\d{2}","gr":"\\d{3}[ ]?\\d{2}","gs":"SIQQ 1ZZ","gt":"\\d{5}","gu":"969[123]\\d([ \\-]\\d{4})?","gw":"\\d{4}","hm":"\\d{4}","hn":"(?:\\d{5})?","hr":"\\d{5}","ht":"\\d{4}","hu":"\\d{4}","id":"\\d{5}","ie":"((D|DUBLIN)?([1-9]|6[wW]|1[0-8]|2[024]))?","il":"\\d{5}","im":"IM\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}","in":"\\d{6}","io":"BBND 1ZZ","iq":"\\d{5}","is":"\\d{3}","it":"\\d{5}","je":"JE\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}","jo":"\\d{5}","jp":"\\d{3}-\\d{4}","ke":"\\d{5}","kg":"\\d{6}","kh":"\\d{5}","kr":"\\d{3}[\\-]\\d{3}","kw":"\\d{5}","kz":"\\d{6}","la":"\\d{5}","lb":"(\\d{4}([ ]?\\d{4})?)?","li":"(948[5-9])|(949[0-7])","lk":"\\d{5}","lr":"\\d{4}","ls":"\\d{3}","lt":"\\d{5}","lu":"\\d{4}","lv":"\\d{4}","ma":"\\d{5}","mc":"980\\d{2}","md":"\\d{4}","me":"8\\d{4}","mg":"\\d{3}","mh":"969[67]\\d([ \\-]\\d{4})?","mk":"\\d{4}","mn":"\\d{6}","mp":"9695[012]([ \\-]\\d{4})?","mq":"9[78]2\\d{2}","mt":"[A-Z]{3}[ ]?\\d{2,4}","mu":"(\\d{3}[A-Z]{2}\\d{3})?","mv":"\\d{5}","mx":"\\d{5}","my":"\\d{5}","nc":"988\\d{2}","ne":"\\d{4}","nf":"2899","ng":"(\\d{6})?","ni":"((\\d{4}-)?\\d{3}-\\d{3}(-\\d{1})?)?","nl":"\\d{4}[ ]?[A-Z]{2}","no":"\\d{4}","np":"\\d{5}","nz":"\\d{4}","om":"(PC )?\\d{3}","pf":"987\\d{2}","pg":"\\d{3}","ph":"\\d{4}","pk":"\\d{5}","pl":"\\d{2}-\\d{3}","pm":"9[78]5\\d{2}","pn":"PCRN 1ZZ","pr":"00[679]\\d{2}([ \\-]\\d{4})?","pt":"\\d{4}([\\-]\\d{3})?","pw":"96940","py":"\\d{4}","re":"9[78]4\\d{2}","ro":"\\d{6}","rs":"\\d{6}","ru":"\\d{6}","sa":"\\d{5}","se":"\\d{3}[ ]?\\d{2}","sg":"\\d{6}","sh":"(ASCN|STHL) 1ZZ","si":"\\d{4}","sj":"\\d{4}","sk":"\\d{3}[ ]?\\d{2}","sm":"4789\\d","sn":"\\d{5}","so":"\\d{5}","sz":"[HLMS]\\d{3}","tc":"TKCA 1ZZ","th":"\\d{5}","tj":"\\d{6}","tm":"\\d{6}","tn":"\\d{4}","tr":"\\d{5}","tw":"\\d{3}(\\d{2})?","ua":"\\d{5}","us":"\\d{5}([ \\-]\\d{4})?","uy":"\\d{5}","uz":"\\d{6}","va":"00120","ve":"\\d{4}","vi":"008(([0-4]\\d)|(5[01]))([ \\-]\\d{4})?","wf":"986\\d{2}","yt":"976\\d{2}","yu":"\\d{5}","za":"\\d{4}","zm":"\\d{5}"};

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
    var code_for_language, data_for_locale, language_data, rtl_data;

    function Languages() {}

    language_data = {"af":{"aa":"Afar","ab":"Abkasies","ace":"Achinese","ach":"Akoli","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"Afrikaans","afa":"Ander Afro-Asiaties","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"Amharies","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"Arabies","ar-001":"Modern Standard Arabic","arc":"Aramees","arn":"Mapuche","arp":"Arapaho","art":"Kunsmatige taal","arw":"Arawak","as":"Assamees","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"Aymara","az":"Azeri","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"Wit-Russies","bej":"Beja","bem":"Bemba","ber":"Berbers","bez":"Bena","bfd":"Bafut","bg":"Bulgaars","bh":"Bihari","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengaals","bnt":"Bantoe","bo":"Tibettaans","br":"Bretons","bra":"Braj","brx":"Bodo","bs":"Bosnies","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Katalaans","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Keltiese taal","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokees","chy":"Cheyenne","ckb":"Sorani Koerdies","cmc":"Chamic Language","co":"Korsikaans","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"Tsjeggies","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"Wallies","da":"Deens","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"Duits","de-AT":"Oostenrykse Duits","de-CH":"Switserse hoog-Duits","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Antieke Egipties","eka":"Ekajuk","el":"Grieks","elx":"Elamite","en":"Engels","en-AU":"Australiese Engels","en-CA":"Kanadese Engels","en-GB":"Britse Engels","en-US":"Amerikaanse Engels","enm":"Middle English","eo":"Esperanto","es":"Spaans","es-419":"Latyns-Amerikaanse Spaans","es-ES":"Europese Spaans","et":"Estnies","eu":"Baskies","ewo":"Ewondo","fa":"Persies","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Fins","fil":"Filippyns","fiu":"Finno-Ugrian Language","fj":"Fidjiaans","fo":"Faroees","fon":"Fon","fr":"Frans","fr-CA":"Kanadese Frans","fr-CH":"Switserse Frans","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"Wes-Fries","ga":"Iers","gaa":"Gaa","gay":"Gayo","gba":"Gbaya","gd":"Skotse Gallies","gem":"Germaanse taal","gez":"Geez","gil":"Gilbertese","gl":"Galisies","gmh":"Middle High German","gn":"Guarani","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Goties","grb":"Grebo","grc":"Antieke Grieks","gsw":"Switserse Duits","gu":"Gudjarati","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaies","he":"Hebreeus","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"Kroaties","hsb":"Upper Sorbian","ht":"Haïtiaans","hu":"Hongaars","hup":"Hupa","hy":"Armeens","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indonesies","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-Europese taal","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"Yslands","it":"Italiaans","iu":"Inuktitut","ja":"Japannees","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"Javaans","ka":"Georgies","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongolees","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazak","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"Kannada","ko":"Koreaans","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Kasjmirs","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Koerdies","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"Kirgisies","la":"Latyn","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luxemburgs","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"Lingaals","lo":"Lao","lol":"Mongo","loz":"Lozi","lt":"Litaus","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"Letties","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisjen","mg":"Malgassies","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maori","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"Masedonies","mkh":"Mon-Khmer Language","ml":"Malabaars","mn":"Mongools","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Maleisies","mt":"Maltees","mua":"Mundang","mul":"Veelvuldige tale","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Birmaans","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"Noorse Bokmål","nd":"Noord-Ndebele","nds":"Low German","ne":"Nepalees","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"Nederlands","nl-BE":"Vlaams","nmg":"Kwasio","nn":"Noorweegse Nynorsk","nnh":"Ngiemboon","no":"Norwegian","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"Suid-Ndebele","nso":"Noord-Sotho","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Oksitaans","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Osseties","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"Pandjabi","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"Pools","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"Pushto","pt":"Portugees","pt-BR":"Brasiliaanse Portugees","pt-PT":"Europese Portugees","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Reto-Romaans","rn":"Rundi","ro":"Roemeens","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"Russies","rup":"Aromanian","rw":"Rwandees","rwk":"Rwa","sa":"Sanskrit","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"Sindhi","se":"Noordelike Sami","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Old Irish","sgn":"Sign Language","sh":"Serbo-Croatian","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"Sinhala","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"Slowaaks","sl":"Sloweens","sla":"Slawiese taal","sm":"Samoaans","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somalies","sog":"Sogdien","son":"Songhai","sq":"Albanees","sr":"Serwies","srn":"Sranan Tongo","srr":"Serer","ss":"Swazi","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Suid-Sotho","su":"Sundanees","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"Sweeds","sw":"Swahili","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"Tamil","tai":"Tai Language","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tadjik","th":"Thais","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Turkmeens","tkl":"Tokelau","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongaans","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Turks","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tataars","tum":"Toemboeka","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahities","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"Uyghur","uga":"Ugaritic","uk":"Oekraïens","umb":"Umbundu","und":"Onbekende of ongeldige taal","ur":"Oerdoe","uz":"Oezbeeks","vai":"Vai","ve":"Venda","vi":"Viëtnamees","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Wolof","xal":"Kalmyk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Jiddisj","yo":"Yoruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"Sjinees","zh-Hans":"Vereenvoudigde Chinees","zh-Hant":"Tradisionele Chinees","znd":"Zande","zu":"Zoeloe","zun":"Zuni","zxx":"Geen linguistiese inhoud","zza":"Zaza"},"ar":{"aa":"الأفارية","ab":"الأبخازية","ace":"الأتشينيزية","ach":"الأكولية","ada":"الأدانجمية","ady":"الأديجه","ae":"الأفستية","af":"الأفريقية","afa":"لغة أفرو آسيوية","afh":"الأفريهيلية","agq":"أغم","ain":"الآينوية","ak":"الأكانية","akk":"الأكادية","ale":"الأليوتية","alg":"اللغات الأمريكية الهندية","alt":"الألطائية الجنوبية","am":"الأمهرية","an":"الأراجونية","ang":"الإنجليزية القديمة","anp":"الأنجيكا","apa":"اللغات الأباتشية","ar":"العربية","ar-001":"Modern Standard Arabic","arc":"الآرامية","arn":"الأروكانية","arp":"الأراباهو","art":"الصناعية - أخرى","arw":"الأراواكية","as":"الأسامية","asa":"آسو","ast":"الأسترية","ath":"اللغة الأزباسكانية","aus":"اللغة الأسترالية","av":"الأفاريكية","awa":"الأوادية","ay":"الأيمارا","az":"الأذرية","ba":"الباشكيرية","bad":"الباندا","bai":"اللغة الباميليكية","bal":"البلوشية","ban":"اللغة البالية","bas":"الباسا","bat":"اللغة البلطيقية","bax":"بامن","bbj":"Ghomala","be":"البيلوروسية","bej":"البيجا","bem":"البيمبا","ber":"البربرية","bez":"بينا","bfd":"Bafut","bg":"البلغارية","bh":"البيهارية","bho":"البهوجبرية","bi":"البيسلامية","bik":"البيكولية","bin":"البينية","bkm":"Kom","bla":"السيكسيكية","bm":"البامبارا","bn":"البنغالية","bnt":"البانتو","bo":"التبتية","br":"البريتونية","bra":"البراجية","brx":"البودو","bs":"البوسنية","bss":"أكوس","btk":"الباتاكية","bua":"البرياتية","bug":"البجينيزية","bum":"Bulu","byn":"البلينية","byv":"Medumba","ca":"الكتالانية","cad":"الكادو","cai":"اللغة الهندية الأمريكية الوسطى","car":"الكاريبية","cau":"القوقازية - أخرى","cay":"Cayuga","cch":"الأتسام","ce":"الشيشانية","ceb":"السيبيونو","cel":"السلتية - أخرى","cgg":"تشيغا","ch":"التشامورو","chb":"التشيبشا","chg":"التشاجاتاي","chk":"التشكيزية","chm":"الماري","chn":"الشينوك جارجون","cho":"الشوكتو","chp":"الشيباوايان","chr":"الشيروكي","chy":"الشايان","ckb":"السريانية الكردية","cmc":"اللغة التشاميكية","co":"الكورسيكية","cop":"القبطية","cpe":"الكرييولى و اللغات المبسطة الأخرى للتفاهم بين الشعوب على أساس الأنجليزية","cpf":"الكرييولى و اللغات المبسطة الأخرى للتفاهم بين الشعوب على أساس الفرنسية","cpp":"الكرييولي واللغات المبسطة الأخرى للتفاهم بين الشعوب على أساس البرتغالية","cr":"الكرى","crh":"التركية الكريمينية","crp":"الكرييولى و اللغات المبسطة الأخرى للتفاهم بين الشعوب - أخرى","cs":"التشيكية","csb":"الكاشبايان","cu":"سلافية كنسية","cus":"اللغة الكشيتيكية","cv":"التشفاش","cy":"الولزية","da":"الدانماركية","dak":"الداكوتا","dar":"الدارجوا","dav":"تيتا","day":"الدياك","de":"الألمانية","de-AT":"الألمانية النمساوية","de-CH":"الألمانية العليا السويسرية","del":"الديلوير","den":"السلافية","dgr":"الدوجريب","din":"الدنكا","dje":"زرمة","doi":"الدوجري","dra":"اللغة الدرافيدينية","dsb":"الصربية السفلى","dua":"الديولا","dum":"الهولندية الوسطى","dv":"المالديفية","dyo":"جولا فونيا","dyu":"الدايلا","dz":"الزونخاية","dzg":"القرعانية","ebu":"إمبو","ee":"الإيوي","efi":"الإفيك","egy":"المصرية القديمة","eka":"الإكاجك","el":"اليونانية","elx":"الإمايت","en":"الإنجليزية","en-AU":"الإنجليزية الأسترالية","en-CA":"الإنجليزية الكندية","en-GB":"الإنجليزية البريطانية","en-US":"الإنجليزية الولايات المتحدة","enm":"الإنجليزية الوسطى","eo":"الإسبرانتو","es":"الإسبانية","es-419":"إسبانية أمريكا اللاتينية","es-ES":"الإسبانية الأوروبية","et":"الإستونية","eu":"لغة الباسك","ewo":"الإيوندو","fa":"الفارسية","fan":"الفانج","fat":"الفانتي","ff":"الفلة","fi":"الفنلندية","fil":"الفلبينية","fiu":"لغة فينو أجريانية","fj":"الفيجية","fo":"الفارويز","fon":"الفون","fr":"الفرنسية","fr-CA":"الفرنسية الكندية","fr-CH":"الفرنسية السويسرية","frm":"الفرنسية الوسطى","fro":"الفرنسية القديمة","frr":"الفريزينية الشمالية","frs":"الفريزينية الشرقية","fur":"الفريلايان","fy":"الفريزيان","ga":"الأيرلندية","gaa":"الجا","gay":"الجايو","gba":"الجبيا","gd":"الغيلية الأسكتلندية","gem":"اللغة الجرمانية","gez":"الجيز","gil":"لغة أهل جبل طارق","gl":"الجاليكية","gmh":"الألمانية العليا الوسطى","gn":"الجواراني","goh":"الألمانية العليا القديمة","gon":"الجندي","gor":"الجورونتالو","got":"القوطية","grb":"الجريبو","grc":"اليونانية القديمة","gsw":"الألمانية السويسرية","gu":"الغوجاراتية","guz":"قيسي","gv":"المنكية","gwi":"غوتشن","ha":"الهوسا","hai":"الهيدا","haw":"لغة أهل الهاواي","he":"العبرية","hi":"الهندية","hil":"الهيليجينون","him":"الهيماتشالي","hit":"الحثية","hmn":"الهمونجية","ho":"الهيري موتو","hr":"الكرواتية","hsb":"الصربية العليا","ht":"الهايتية","hu":"الهنغارية","hup":"الهبا","hy":"الأرمينية","hz":"الهيريرو","ia":"اللّغة الوسيطة","iba":"الإيبان","ibb":"Ibibio","id":"الإندونيسية","ie":"الإنترلينج","ig":"الإيجبو","ii":"السيتشيون يي","ijo":"الإجو","ik":"الإينبياك","ilo":"الإيلوكو","inc":"اللغة الهندية","ine":"الهندية الأوروبية - أخرى","inh":"الإنجوشية","io":"الإيدو","ira":"اللغة الإيرانية","iro":"اللغة الإيروكويانية","is":"الأيسلاندية","it":"الإيطالية","iu":"الإينكتيتت","ja":"اليابانية","jbo":"اللوجبان","jgo":"Ngomba","jmc":"Machame","jpr":"الجيدو - الفارسي","jrb":"الجيدو - العربي","jv":"الجاوية","ka":"الجورجية","kaa":"الكارا-كالباك","kab":"القبيلية","kac":"الكاتشين","kaj":"الجو","kam":"الكامبا","kar":"الكاريين","kaw":"الكوي","kbd":"الكاباردايان","kbl":"كانمبو","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"الكورو","kg":"الكونغو","kha":"الكازية","khi":"اللغة الخويسانية","kho":"الخوتانيز","khq":"Koyra Chiini","ki":"الكيكيو","kj":"الكيونياما","kk":"الكازاخستانية","kkj":"Kako","kl":"الكالاليست","kln":"Kalenjin","km":"الخميرية","kmb":"الكيمبندو","kn":"الكانادا","ko":"الكورية","kok":"الكونكانية","kos":"الكوسراين","kpe":"الكبيل","kr":"الكانيوري","krc":"الكاراتشاي-بالكار","krl":"الكريلية","kro":"الكرو","kru":"كرخانة","ks":"الكشميرية","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"الكردية","kum":"الكميك","kut":"الكتيناي","kv":"الكومي","kw":"الكورنية","ky":"القيرغستانية","la":"اللاتينية","lad":"الإسباعبرية","lag":"Langi","lah":"اللاهندا","lam":"اللامبا","lb":"اللوكسمبرجية","lez":"الليزجهايانية","lg":"الجاندا","li":"الليمبرجيشية","lkt":"Lakota","ln":"اللينجالا","lo":"اللاوية","lol":"منغولى","loz":"اللوزي","lt":"اللتوانية","lu":"اللبا-كاتانجا","lua":"اللبا-لؤلؤ","lui":"اللوسينو","lun":"اللوندا","luo":"اللو","lus":"اللشاي","luy":"Luyia","lv":"اللاتفية","mad":"المادريز","maf":"Mafa","mag":"الماجا","mai":"المايثيلي","mak":"الماكاسار","man":"الماندينغ","map":"الأوسترونيسيان","mas":"الماساي","mde":"مابا","mdf":"الموكشا","mdr":"الماندار","men":"الميند","mer":"Meru","mfe":"المورسيانية","mg":"المالاجاشية","mga":"الأيرلندية الوسطى","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"المارشالية","mi":"الماورية","mic":"الميكماكيونية","min":"المينانجكاباو","mis":"اللغة المتنوعة","mk":"المقدونية","mkh":"لغة المون - خمير","ml":"الماليالام","mn":"المنغولية","mnc":"المانشو","mni":"المانيبري","mno":"لغات مانوبو","mo":"المولدوفية","moh":"الموهوك","mos":"الموسي","mr":"الماراثي","ms":"لغة الملايو","mt":"المالطية","mua":"مندنج","mul":"لغات متعددة","mun":"لغة المندا","mus":"الكريك","mwl":"الميرانديز","mwr":"المارواري","my":"البورمية","mye":"Myene","myn":"لغة المايا","myv":"الأرزية","na":"النورو","nah":"الناهيوتل","nai":"اللغة الهندية الأمريكية الشمالية","nap":"اللغة النابولية","naq":"Nama","nb":"البوكمالية النرويجية","nd":"النديبيل الشمالي","nds":"الألمانية السفلى","ne":"النيبالية","new":"النيواري","ng":"الندونجا","nia":"النياس","nic":"النيجر - كوردوفانايان","niu":"النيوي","nl":"الهولندية","nl-BE":"الفلمنك","nmg":"Kwasio","nn":"النينورسك النرويجي","nnh":"Ngiemboon","no":"النرويجية","nog":"النوجاي","non":"النورس القديم","nqo":"أنكو","nr":"النديبيل الجنوبي","nso":"السوتو الشمالية","nub":"لغة نوبية","nus":"Nuer","nv":"النافاجو","nwc":"النوارية التقليدية","ny":"النيانجا","nym":"النيامويزي","nyn":"النيانكول","nyo":"النيورو","nzi":"النزيما","oc":"الأوكيتانية","oj":"الأوجيبوا","om":"الأورومو","or":"الأورييا","os":"الأوسيتيك","osa":"الأوساج","ota":"التركية العثمانية","oto":"اللغة الأوتومية","pa":"البنجابية","paa":"اللغة الغينية","pag":"البانجاسينان","pal":"البهلوية","pam":"البامبانجا","pap":"البابيامينتو","pau":"البالوان","peo":"الفارسية القديمة","phi":"اللغة الفليبينية","phn":"الفينيقية","pi":"البالية","pl":"البولندية","pon":"البوهنبيايان","pra":"اللغات البراقريطية","pro":"البروفانسية القديمة","ps":"بشتو","pt":"البرتغالية","pt-BR":"البرتغالية البرازيلية","pt-PT":"البرتغالية الأوروبية","qu":"الكويتشوا","raj":"الراجاسثانية","rap":"الراباني","rar":"الراروتونجاني","rm":"الرومانشية","rn":"الرندي","ro":"الرومانية","roa":"اللغة الرومانسية","rof":"Rombo","rom":"غجري","root":"الجذر","ru":"الروسية","rup":"الأرومانيان","rw":"الكينيارواندا","rwk":"Rwa","sa":"السنسكريتية","sad":"السانداوي","sah":"الساخية","sai":"اللغة الهندية الأمريكية الجنوبية","sal":"اللغة الساليشانية","sam":"الآرامية السومارية","saq":"Samburu","sas":"الساساك","sat":"السانتالي","sba":"نامبي","sbp":"Sangu","sc":"السردينية","scn":"الصقلية","sco":"الأسكتلندية","sd":"السندية","se":"السامي الشمالي","see":"Seneca","seh":"Sena","sel":"السيلكب","sem":"لغة سامية","ses":"Koyraboro Senni","sg":"السانجو","sga":"الأيرلندية القديمة","sgn":"لغات الإشارة","sh":"Serbo-Croatian","shi":"Tachelhit","shn":"الشانية","shu":"العربية التشادية","si":"السنهالية","sid":"السيدامو","sio":"لغة السيويون","sit":"اللغة الصينية التيبتية","sk":"السلوفاكية","sl":"السلوفانية","sla":"اللغة السلافية","sm":"الساموائية","sma":"السامي الجنوبي","smi":"اللغة السامية","smj":"اللول سامي","smn":"الإيناري سامي","sms":"السكولت سامي","sn":"الشونا","snk":"السونينك","so":"الصومالية","sog":"السوجدين","son":"السونجهاي","sq":"الألبانية","sr":"الصربية","srn":"السرانان تونجو","srr":"السرر","ss":"السواتي","ssa":"لغة نيلية الصحراوية","ssy":"Saho","st":"السوتو الجنوبية","su":"السوندانية","suk":"السوكوما","sus":"السوسو","sux":"السومارية","sv":"السويدية","sw":"السواحلية","swb":"القمرية","swc":"Congo Swahili","syc":"سريانية تقليدية","syr":"السريانية","ta":"التاميلية","tai":"لغة تاي","te":"التيلجو","tem":"التيمن","teo":"Teso","ter":"التيرينو","tet":"التيتم","tg":"الطاجيكية","th":"التايلاندية","ti":"التيجرينيا","tig":"التيجر","tiv":"التيف","tk":"التركمانية","tkl":"التوكيلاو","tl":"التاغالوغية","tlh":"الكلينجون","tli":"التلينغيتية","tmh":"التاماشيك","tn":"التسوانية","to":"التونغية","tog":"تونجا - نياسا","tpi":"التوك بيسين","tr":"التركية","trv":"Taroko","ts":"السونجا","tsi":"التسيمشيان","tt":"التتارية","tum":"التامبوكا","tup":"اللغة التوبية","tut":"الألطائية - أخرى","tvl":"التوفالو","tw":"التوي","twq":"Tasawaq","ty":"التاهيتية","tyv":"التُرك","tzm":"Central Atlas Tamazight","udm":"الأدمرت","ug":"الأيغورية","uga":"اليجاريتيك","uk":"الأوكرانية","umb":"الأمبندو","und":"لغة غير معروفة","ur":"الأردية","uz":"الأوزباكية","vai":"الفاي","ve":"الفيندا","vi":"الفيتنامية","vo":"Volapük","vot":"الفوتيك","vun":"Vunjo","wa":"الولونية","wae":"Walser","wak":"اللغة الواكاشانية","wal":"الوالامو","war":"الواراي","was":"الواشو","wen":"اللغة الصربية","wo":"الولوف","xal":"الكالميك","xh":"الخوسا","xog":"Soga","yao":"الياو","yap":"اليابيز","yav":"Yangben","ybb":"Yemba","yi":"اليديشية","yo":"اليوروبية","ypk":"اللغة اليوبيكية","yue":"الكَنْتُونية","za":"الزهيونج","zap":"الزابوتيك","zbl":"رموز المعايير الأساسية","zen":"الزيناجا","zh":"الصينية","zh-Hans":"الصينية المبسطة","zh-Hant":"الصينية التقليدية","znd":"الزاند","zu":"الزولو","zun":"الزونية","zxx":"بدون محتوى لغوي","zza":"زازا"},"be":{"aa":"Afar","ab":"абхазская","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"адыгейская","ae":"Avestan","af":"афрыкаанс","afa":"афра-азіяцкая мова","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"акадзкая","ale":"алеуцкая","alg":"Algonquian Language","alt":"Southern Altai","am":"амхарская","an":"арагонская","ang":"стараанглійская","anp":"Angika","apa":"Apache Language","ar":"арабская","ar-001":"Modern Standard Arabic","arc":"арамейская","arn":"Mapuche","arp":"Arapaho","art":"штучная мова","arw":"Arawak","as":"асамская","asa":"Asu","ast":"астурыйская","ath":"Athapascan Language","aus":"аўстралійская","av":"аварская","awa":"Awadhi","ay":"аймара","az":"азербайджанская","ba":"башкірская","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"беларуская","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"балгарская","bh":"біхары","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"бенгальская","bnt":"Bantu","bo":"Tibetan","br":"брэтонская","bra":"Braj","brx":"Bodo","bs":"баснійская","bss":"Akoose","btk":"Batak","bua":"бурацкая","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"каталонская","cad":"Caddo","cai":"мова індзейцаў Цэнтральнай Амерыкі","car":"Carib","cau":"каўказская мова","cay":"Cayuga","cch":"Atsam","ce":"чачэнская","ceb":"Cebuano","cel":"кельцкая мова","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Sorani Kurdish","cmc":"Chamic Language","co":"Corsican","cop":"копцкая","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"чэшская","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"чувашская","cy":"валійская","da":"дацкая","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"нямецкая","de-AT":"нямецкая (аўстр.)","de-CH":"нямецкая (швейц.)","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"стараэгіпецкая","eka":"Ekajuk","el":"грэцкая","elx":"Elamite","en":"англійская","en-AU":"англійская (аўстрал.)","en-CA":"англійская (канад.)","en-GB":"англійская (Вялікабрытанія)","en-US":"англійская (ЗША)","enm":"Middle English","eo":"эсперанта","es":"іспанская","es-419":"іспанская (лацінаамер.)","es-ES":"European Spanish","et":"эстонская","eu":"баскская","ewo":"Ewondo","fa":"фарсі","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"фінская","fil":"тагальская","fiu":"Finno-Ugrian Language","fj":"Fijian","fo":"фарэрская","fon":"Fon","fr":"французская","fr-CA":"французская (канад.)","fr-CH":"французская (швейц.)","frm":"Middle French","fro":"старафранцузская","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"фрызская","ga":"ірландская","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"шатландская гэльская","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"галісійская","gmh":"Middle High German","gn":"гуарані","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"старагрэцкая","gsw":"Swiss German","gu":"гуяраці","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaiian","he":"іўрыт","hi":"хіндзі","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"харвацкая","hsb":"Upper Sorbian","ht":"Haitian","hu":"венгерская","hup":"Hupa","hy":"армянская","hz":"Herero","ia":"інтэрлінгва","iba":"Iban","ibb":"Ibibio","id":"інданезійская","ie":"інтэрлінгве","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"ісландская","it":"італьянская","iu":"Inuktitut","ja":"японская","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"яванская","ka":"грузінская","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"казахская","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"каннада","ko":"карэйская","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Kashmiri","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"курдская","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"Kirghiz","la":"лацінская","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luxembourgish","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"лінгала","lo":"лаоская","lol":"Mongo","loz":"Lozi","lt":"літоўская","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"латышская","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"аўстранезійская","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagasy","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maori","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"македонская","mkh":"Mon-Khmer Language","ml":"малаяламская","mn":"мангольская","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"малдаўская","moh":"Mohawk","mos":"Mossi","mr":"маратхі","ms":"малайская","mt":"мальтыйская","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Burmese","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"нарвэская букмал","nd":"North Ndebele","nds":"Low German","ne":"непальская","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"галандская","nl-BE":"фламандская","nmg":"Kwasio","nn":"нарвежская (нюнорск)","nnh":"Ngiemboon","no":"нарвежская","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"Northern Sotho","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"правансальская","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetic","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"панджабі","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"польская","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"пушту","pt":"партугальская","pt-BR":"партугальская (бразіл.)","pt-PT":"European Portuguese","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Romansh","rn":"Rundi","ro":"румынская","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"руская","rup":"Aromanian","rw":"Kinyarwanda","rwk":"Rwa","sa":"санскрыт","sad":"Sandawe","sah":"якуцкая","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"сіндхі","se":"Northern Sami","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Old Irish","sgn":"знакавая мова","sh":"сербска-харвацкая","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"сінгальская","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"славацкая","sl":"славенская","sla":"славянская мова","sm":"Samoan","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"самалійская","sog":"Sogdien","son":"Songhai","sq":"албанская","sr":"сербская","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Southern Sotho","su":"суданская","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"шведская","sw":"суахілі","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"тамільская","tai":"Tai Language","te":"тэлугу","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tajik","th":"тайская","ti":"тыгрынья","tig":"Tigre","tiv":"Tiv","tk":"туркменская","tkl":"Tokelau","tl":"Tagalog","tlh":"клінгон","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongan","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"турэцкая","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"татарская","tum":"Tumbuka","tup":"Tupi Language","tut":"алтайская мова","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahitian","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"уйгурская","uga":"Ugaritic","uk":"украінская","umb":"Umbundu","und":"невядомая мова","ur":"урду","uz":"узбекская","vai":"Vai","ve":"Venda","vi":"в'етнамская","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Wolof","xal":"Kalmyk","xh":"хоса","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"ідыш","yo":"Yoruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"кітайская","zh-Hans":"спрошчаная кітайская","zh-Hant":"традыцыйная кітайская","znd":"Zande","zu":"зулу","zun":"Zuni","zxx":"No linguistic content","zza":"Zaza"},"bg":{"aa":"афар","ab":"абхазски","ace":"ачински","ach":"аколи","ada":"адангме","ady":"адиге","ae":"авестски","af":"африканс","afa":"афро-азиатски","afh":"африхили","agq":"Aghem","ain":"айну","ak":"акан","akk":"акадски","ale":"алеутски","alg":"алгонквин","alt":"южноалтайски","am":"амхарски","an":"арагонски","ang":"староанглийски","anp":"ангика","apa":"езици на апахите","ar":"арабски","ar-001":"Modern Standard Arabic","arc":"арамейски","arn":"мапуче","arp":"арапахо","art":"изкуствен","arw":"аравак","as":"асамски","asa":"Asu","ast":"астурски","ath":"атабаски езици","aus":"австралийски езици","av":"аварски","awa":"авади","ay":"аймара","az":"азербайджански","ba":"башкирски","bad":"банда","bai":"бамикеле","bal":"балучи","ban":"балинейски","bas":"баса","bat":"балтийски","bax":"Bamun","bbj":"Ghomala","be":"беларуски","bej":"бея","bem":"бемба","ber":"берберски","bez":"Bena","bfd":"Bafut","bg":"български","bh":"бихари","bho":"божпури","bi":"бислама","bik":"биколски","bin":"бини","bkm":"Kom","bla":"сиксика","bm":"бамбара","bn":"бенгалски","bnt":"банту","bo":"тибетски","br":"бретонски","bra":"брадж","brx":"Bodo","bs":"босненски","bss":"Akoose","btk":"батак","bua":"бурятски","bug":"бугински","bum":"Bulu","byn":"биленски","byv":"Medumba","ca":"каталонски","cad":"каддо","cai":"централноамерикански индиански","car":"карибски","cau":"кавказски","cay":"Cayuga","cch":"атсам","ce":"чеченски","ceb":"себуано","cel":"келтски","cgg":"Chiga","ch":"чаморо","chb":"чибча","chg":"чагатай","chk":"чуук","chm":"марийски","chn":"жаргон чинуук","cho":"чокто","chp":"чиипувски","chr":"чероки","chy":"чейенски","ckb":"кюрдски [сорани]","cmc":"чамски","co":"корсикански","cop":"коптски","cpe":"креолски или пиджин от английски","cpf":"креолски и пиджин от френски","cpp":"креолски или пиджин от португалски","cr":"крии","crh":"кримскотатарски","crp":"креолски или пиджини","cs":"чешки","csb":"кашубски","cu":"църковно славянски","cus":"кушитски езици","cv":"чувашки","cy":"уелски","da":"датски","dak":"дакотски","dar":"даргва","dav":"Taita","day":"даякски","de":"немски","de-AT":"австрийски немски","de-CH":"швейцарски горногермански","del":"делауер","den":"слейви","dgr":"догриб","din":"динка","dje":"Zarma","doi":"догри","dra":"дравидски езици","dsb":"долносербски","dua":"дуала","dum":"средновековен холандски","dv":"дивехи","dyo":"Jola-Fonyi","dyu":"диула","dz":"дзонха","dzg":"Dazaga","ebu":"Embu","ee":"еуе","efi":"ефик","egy":"египетски","eka":"екажук","el":"гръцки","elx":"еламитски","en":"английски","en-AU":"австралийски английски","en-CA":"канадски английски","en-GB":"британски английски","en-US":"американски английски","enm":"средновековен английски","eo":"есперанто","es":"испански","es-419":"латиноамерикански испански","es-ES":"иберийски испански","et":"естонски","eu":"баски","ewo":"евондо","fa":"персийски","fan":"фанг","fat":"фанти","ff":"фула","fi":"фински","fil":"филипински","fiu":"угрофински","fj":"фиджийски","fo":"фарьорски","fon":"фон","fr":"френски","fr-CA":"канадски френски","fr-CH":"швейцарски френски","frm":"средновековен френски","fro":"старофренски","frr":"северен фризски","frs":"източен фризски","fur":"фриулиански","fy":"фризийски","ga":"ирландски","gaa":"га","gay":"гайо","gba":"гбая","gd":"шотландски галски","gem":"германски","gez":"гииз","gil":"гилбертски","gl":"галисийски","gmh":"средновековен немски","gn":"гуарани","goh":"старовисоконемски","gon":"гонди","gor":"горонтало","got":"готически","grb":"гребо","grc":"древногръцки","gsw":"швейцарски немски","gu":"гуджарати","guz":"Gusii","gv":"манкски","gwi":"гвичин","ha":"хауза","hai":"хайда","haw":"хавайски","he":"иврит","hi":"хинди","hil":"хилигайнон","him":"химачали","hit":"хитски","hmn":"хмонг","ho":"хири моту","hr":"хърватски","hsb":"горносербски","ht":"хаитянски","hu":"унгарски","hup":"хупа","hy":"арменски","hz":"хереро","ia":"интерлингва","iba":"ибан","ibb":"Ibibio","id":"индонезийски","ie":"оксидентал","ig":"игбо","ii":"сечуански","ijo":"иджо","ik":"инупиак","ilo":"илоко","inc":"индийска група","ine":"индо-европейски","inh":"ингушетски","io":"идо","ira":"ирански","iro":"ироквиански езици","is":"исландски","it":"италиански","iu":"инуктитут","ja":"японски","jbo":"лоджбан","jgo":"Ngomba","jmc":"Machame","jpr":"еврейско-персийски","jrb":"еврейско-арабски","jv":"явански","ka":"грузински","kaa":"каракалпашки","kab":"кабилски","kac":"качински","kaj":"жжи","kam":"камба","kar":"каренски","kaw":"кави","kbd":"кабардиан","kbl":"Kanembu","kcg":"туап","kde":"Makonde","kea":"Kabuverdianu","kfo":"коро","kg":"конгоански","kha":"кхаси","khi":"езици коисан","kho":"котски","khq":"Koyra Chiini","ki":"кикуйу","kj":"кваняма","kk":"казахски","kkj":"Kako","kl":"гренландски ескимоски","kln":"Kalenjin","km":"кхмерски","kmb":"кимбунду","kn":"каннада","ko":"корейски","kok":"конкани","kos":"косраен","kpe":"кпеле","kr":"канури","krc":"карачай-балкарски","krl":"карелски","kro":"кру","kru":"курук","ks":"кашмирски","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"кюрдски","kum":"кумикски","kut":"кутенай","kv":"Коми","kw":"корнуолски келтски","ky":"киргизски","la":"латински","lad":"ладино","lag":"Langi","lah":"лахнда","lam":"ламба","lb":"люксембургски","lez":"лезгински","lg":"ганда","li":"лимбургски","lkt":"Lakota","ln":"лингала","lo":"лаоски","lol":"монго","loz":"лози","lt":"литовски","lu":"луба катанга","lua":"луба-лулуа","lui":"луисеньо","lun":"лунда","luo":"луо","lus":"лушаи","luy":"Luyia","lv":"латвийски","mad":"мадурски","maf":"Mafa","mag":"магахи","mai":"майтхили","mak":"макасар","man":"мандинго","map":"австронезийски","mas":"масайски","mde":"Maba","mdf":"мокша","mdr":"мандар","men":"менде","mer":"Meru","mfe":"морисиен","mg":"малгашки","mga":"средновековен ирландски","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"маршалезе","mi":"маорски","mic":"микмак","min":"минангбау","mis":"други езици","mk":"македонски","mkh":"мон-кхмерски език","ml":"малаялам","mn":"монголски","mnc":"манчжурски","mni":"манипури","mno":"манобо","mo":"молдовски","moh":"мохавк","mos":"моси","mr":"маратхи","ms":"малайски","mt":"малтийски","mua":"Mundang","mul":"многоезични","mun":"мунда","mus":"крик","mwl":"мирандийски","mwr":"марвари","my":"бирмански","mye":"Myene","myn":"майя език","myv":"ерзиа","na":"науру","nah":"нахуатл","nai":"северноамерикански индиански","nap":"неаполитански","naq":"Nama","nb":"норвежки бокмал","nd":"северен ндебеле","nds":"долносаксонски","ne":"непалски","new":"неварски","ng":"ндонга","nia":"ниас","nic":"нигер-кордофански","niu":"ниуеан","nl":"холандски","nl-BE":"фламандски","nmg":"Kwasio","nn":"съвременен норвежки","nnh":"Ngiemboon","no":"норвежки","nog":"ногаи","non":"старонорвежски","nqo":"н’ко","nr":"южен ндебеле","nso":"северен сото","nub":"нубийски езици","nus":"Nuer","nv":"навахо","nwc":"класически невари","ny":"чинянджа","nym":"ниамвези","nyn":"нианколе","nyo":"нуоро","nzi":"нзима","oc":"окситански","oj":"оджибва","om":"оромо","or":"ория","os":"осетски","osa":"оседжи","ota":"отомански турски","oto":"старотурски езици","pa":"пенджабски","paa":"папуаски","pag":"пангасинан","pal":"пехлевийски","pam":"пампанга","pap":"папиаменту","pau":"палауан","peo":"староперсийски","phi":"филипински (други)","phn":"финикийски","pi":"пали","pl":"полски","pon":"похнпеиан","pra":"пракритски език","pro":"провансалски","ps":"пущу","pt":"португалски","pt-BR":"бразилски португалски","pt-PT":"европейски португалски","qu":"кечуа","raj":"раджастански","rap":"рапа нуи","rar":"рапотонган","rm":"реторомански","rn":"рунди","ro":"румънски","roa":"романски","rof":"Rombo","rom":"цигански език","root":"роот","ru":"руски","rup":"арумънски","rw":"киняруанда","rwk":"Rwa","sa":"санкскритски","sad":"сандве","sah":"якутски","sai":"южноамерикански индиански","sal":"салишански език","sam":"самаритански арамейски","saq":"Samburu","sas":"сасак","sat":"сантали","sba":"Ngambay","sbp":"Sangu","sc":"сардински","scn":"сицилиански","sco":"шотландски","sd":"синдхи","se":"северен сами","see":"Seneca","seh":"Sena","sel":"селкуп","sem":"семитски","ses":"Koyraboro Senni","sg":"санго","sga":"староирландски","sgn":"жестомимичен език","sh":"сърбохърватски","shi":"Tachelhit","shn":"шан","shu":"Chadian Arabic","si":"синхалски","sid":"сидамо","sio":"език сиу","sit":"синотибетски","sk":"словашки","sl":"словенски","sla":"славянски","sm":"самоански","sma":"южносаамски","smi":"саамски езици","smj":"луле-саамски","smn":"инари-саамски","sms":"сколт-саамски","sn":"шона","snk":"сонинке","so":"сомалийски","sog":"согдийски","son":"сонгхай","sq":"албански","sr":"сръбски","srn":"сранан тонго","srr":"серер","ss":"суази","ssa":"нило-сахарски език","ssy":"Saho","st":"сесуто","su":"сундански","suk":"сукума","sus":"сусу","sux":"шумерски","sv":"шведски","sw":"суахили","swb":"коморски","swc":"Congo Swahili","syc":"класически сирийски","syr":"сирийски","ta":"тамилски","tai":"тайландски","te":"телугу","tem":"темне","teo":"Teso","ter":"терено","tet":"тетум","tg":"таджикски","th":"таи","ti":"тигриня","tig":"тигре","tiv":"тив","tk":"туркменски","tkl":"токелайски","tl":"тагалог","tlh":"клингон","tli":"тлингит","tmh":"тамашек","tn":"тсвана","to":"тонга","tog":"нианса тонга","tpi":"ток писин","tr":"турски","trv":"Taroko","ts":"тсонга","tsi":"цимшиански","tt":"татарски","tum":"тумбука","tup":"тупи","tut":"алтайски","tvl":"тувалуански","tw":"туи","twq":"Tasawaq","ty":"таитянски","tyv":"тувински","tzm":"Central Atlas Tamazight","udm":"удмуртски","ug":"уйгурски","uga":"угаритски","uk":"украински","umb":"умбунду","und":"неопределен","ur":"урду","uz":"узбекски","vai":"ваи","ve":"венда","vi":"виетнамски","vo":"волапюк","vot":"вотик","vun":"Vunjo","wa":"валонски","wae":"Walser","wak":"вакашански език","wal":"валамо","war":"варай","was":"уашо","wen":"лужишки език","wo":"волоф","xal":"калмик","xh":"ксоса","xog":"Soga","yao":"яо","yap":"япезе","yav":"Yangben","ybb":"Yemba","yi":"идиш","yo":"йоруба","ypk":"юпик","yue":"кантонски","za":"зуанг","zap":"запотек","zbl":"блис символи","zen":"зенага","zh":"китайски","zh-Hans":"опростен китайски","zh-Hant":"традиционен китайски","znd":"занде","zu":"зулуски","zun":"зуни","zxx":"без лингвистично съдържание","zza":"заза"},"bn":{"aa":"আফার","ab":"আব্খাজিয়","ace":"আচিনিয়","ach":"আকোলী","ada":"অদাগ্মে","ady":"আদেগে","ae":"আবেস্তীয়","af":"আফ্রিকান্স","afa":"অফ্রো-এশিয়াটিক","afh":"আফ্রিহিলি","agq":"Aghem","ain":"আইনু","ak":"আকান","akk":"আক্কাদিয়ান","ale":"আলেউত","alg":"আলগোঙকুইআন","alt":"দক্ষিন আলতাই","am":"আমহারিক","an":"আর্গোনিজ","ang":"প্রাচীন ইংরেজী","anp":"আঙ্গীকা","apa":"অ্যাপাচি","ar":"আরবী","ar-001":"Modern Standard Arabic","arc":"আরামাইক","arn":"অ্যারোকেনিয়","arp":"আরাপাহো","art":"কৃত্রিম","arw":"আরাওয়াক","as":"আসামি","asa":"Asu","ast":"আস্তুরিয়","ath":"আথাপাস্কান","aus":"অস্ট্রেলিয়","av":"আভেরিক","awa":"আওয়াধি","ay":"আয়মারা","az":"আজেরি","ba":"বাশকির","bad":"বান্দা","bai":"বামিলেকে ভাষা","bal":"বেলুচী","ban":"বালিনীয়","bas":"বাসা","bat":"বাল্টিক ভাষা","bax":"Bamun","bbj":"Ghomala","be":"বেলারুশিয়","bej":"বেজা","bem":"বেম্বা","ber":"বেরবের","bez":"Bena","bfd":"Bafut","bg":"বুলগেরিয়","bh":"বিহারি","bho":"ভোজপুরি","bi":"বিসলামা","bik":"বিকোল","bin":"বিনি","bkm":"Kom","bla":"সিকসিকা","bm":"বামবারা","bn":"বাংলা","bnt":"বান্টু","bo":"তিব্বতি","br":"ব্রেটোন","bra":"ব্রাজ","brx":"Bodo","bs":"বসনীয়","bss":"Akoose","btk":"বাতাক","bua":"বুরিয়াত","bug":"বুগিনি","bum":"Bulu","byn":"ব্লিন","byv":"Medumba","ca":"কাতালান","cad":"ক্যাডো","cai":"মধ্য যুক্তরাষ্ঠের আদিবাসীদের ভাষা","car":"ক্যারিব","cau":"ককেশীয","cay":"Cayuga","cch":"আত্সাম","ce":"চেচেন","ceb":"চেবুয়ানো","cel":"কেল্টিক","cgg":"Chiga","ch":"চামেরো","chb":"চিবচা","chg":"চাগাতাই","chk":"চুকি","chm":"মারি","chn":"চিনুক পরিভাষা","cho":"চক্টো","chp":"চিপেওয়ান","chr":"চেরোকি","chy":"শাইয়েন","ckb":"সোরানি কুর্দিশ","cmc":"চামিক ভাষা","co":"কর্সিকান","cop":"কপটিক","cpe":"ইংরেজি জাত ক্রেওল অথবা পিজিন","cpf":"ফরাসি জাত ক্রেওল অথবা পিজিন","cpp":"পোর্তুগিজ-ভিত্তিক ক্রেওল বা পিজন","cr":"ক্রি","crh":"ক্রিমিয়ান তুর্কি","crp":"ক্রেওল অথবা পিজিন","cs":"চেক","csb":"কাশুবিয়ান","cu":"চার্চ স্লাভিও","cus":"কুশিতিক ভাষা","cv":"চুবাস","cy":"ওয়েলশ","da":"ডেনিশ","dak":"ডাকোটা","dar":"দার্গওয়া","dav":"Taita","day":"দায়াক","de":"জার্মান","de-AT":"অস্ট্রিয়ান জার্মানি","de-CH":"সুইস উচ্চ জার্মানি","del":"ডেলাওয়ের","den":"স্ল্যাভ","dgr":"দোগ্রীব","din":"ডিংকা","dje":"Zarma","doi":"দোগরি","dra":"দ্রাবীড় ভাষা","dsb":"নিম্নতর সোর্বিয়ান","dua":"দুয়ালা","dum":"মধ্য ডাচ","dv":"দিবেহি","dyo":"Jola-Fonyi","dyu":"ডিউলা","dz":"ভুটানি","dzg":"Dazaga","ebu":"Embu","ee":"ইওয়ে","efi":"এফিক","egy":"প্রাচীন মিশরীয়","eka":"ইকাজুক","el":"গ্রিক","elx":"এলামাইট","en":"ইংরেজি","en-AU":"অস্ট্রেলীয় ইংরেজি","en-CA":"কানাডীয় ইংরেজি","en-GB":"ব্রিটিশ ইংরেজি","en-US":"যুক্তরাষ্ট্র ইংরেজি","enm":"মধ্য ইংরেজি","eo":"এস্পেরান্তো","es":"স্পেনীয়","es-419":"ল্যাটিন আমেরিকান স্প্যানিশ","es-ES":"আইবেরিয়ান স্প্যানিশ","et":"এস্তোনীয়","eu":"বাস্ক","ewo":"ইওন্ডো","fa":"ফার্সি","fan":"ফ্যাঙ্গ","fat":"ফান্তি","ff":"ফুলাহ্","fi":"ফিনিশ","fil":"ফিলিপিনো","fiu":"ফিনো-ইউগ্রিক","fj":"ফিজিও","fo":"ফেরাউনি","fon":"ফন","fr":"ফরাসি","fr-CA":"কানাডীয় ফরাসি","fr-CH":"সুইস ফরাসি","frm":"মধ্য ফরাসি","fro":"প্রাচীন ফরাসি","frr":"উত্তরাঞ্চলীয় ফ্রিসিয়ান","frs":"পূর্ব ফ্রিসিয়","fur":"ফ্রিউলিয়ান","fy":"পশ্চিম ফ্রিসিয়","ga":"আইরিশ","gaa":"গা","gay":"গায়ো","gba":"বায়া","gd":"স্কটস-গ্যেলিক","gem":"জার্মানিক ভাষা","gez":"গীজ","gil":"গিলবার্টিজ","gl":"গ্যালিশিয়","gmh":"মধ্য-উচ্চ জার্মানি","gn":"গুয়ারানি","goh":"প্রাচীন উচ্চ জার্মানি","gon":"গোন্ডি","gor":"গোরোন্তালো","got":"গথিক","grb":"গ্রেবো","grc":"প্রাচীন গ্রীক","gsw":"সুইস জার্মান","gu":"গুজরাটি","guz":"Gusii","gv":"ম্যাঙ্কস","gwi":"গওইচ্’ইন","ha":"হাউসা","hai":"হাইডা","haw":"হাওয়াইয়ান","he":"হিব্রু","hi":"হিন্দি","hil":"হিলিগ্যায়নোন","him":"হিমাচালি","hit":"হিট্টিট","hmn":"হ্‌মোঙ","ho":"হিরি মোতু","hr":"ক্রোয়েশীয়","hsb":"উচ্চ সোর্বিয়ান","ht":"হাইতিয়ান","hu":"হাঙ্গেরীয়","hup":"হুপা","hy":"আর্মেনিয়","hz":"হেরেরো","ia":"ইন্টারলিঙ্গুয়া","iba":"ইবান","ibb":"Ibibio","id":"ইন্দোনেশীয়","ie":"ইন্টারলিঙ্গ","ig":"ইগ্‌বো","ii":"সিচুয়ান য়ি","ijo":"ইজো","ik":"ইনুপিয়াক","ilo":"ইলোকো","inc":"ভারতীয় ভাষা","ine":"ইন্দো-ইউরোপীয় ভাষা","inh":"ইঙ্গুশ","io":"ইডো","ira":"ইরানী ভাষা","iro":"ইরোকোইয়ান ভাষা","is":"আইসল্যান্ডীয়","it":"ইতালীয়","iu":"ইনুক্টিটুট","ja":"জাপানি","jbo":"লোজবান","jgo":"Ngomba","jmc":"Machame","jpr":"জুদেও ফার্সি","jrb":"জুদেও আরবি","jv":"জাভানি","ka":"জর্জিয়ান","kaa":"কারা-কাল্পাক","kab":"কাবাইলে","kac":"কাচিন","kaj":"অজ্জু","kam":"কাম্বা","kar":"কারেন","kaw":"কাউই","kbd":"কাবার্ডিয়ান","kbl":"Kanembu","kcg":"টাইয়াপ","kde":"Makonde","kea":"Kabuverdianu","kfo":"কোরো","kg":"কোঙ্গো","kha":"খাশি","khi":"খোয়েশান ভাষা","kho":"খোটানিজ","khq":"Koyra Chiini","ki":"কিকু্ইয়ু","kj":"কোয়ানিয়ামা","kk":"কাজাখ","kkj":"Kako","kl":"ক্যালাল্লিসুট","kln":"Kalenjin","km":"খমের","kmb":"কিম্বুন্দু","kn":"কান্নাড়ী","ko":"কোরিয়ান","kok":"কোঙ্কানি","kos":"কোস্রাইন","kpe":"ক্‌পেল্লে","kr":"কানুরি","krc":"কারচে-বাল্কার","krl":"কারেলিয়ান","kro":"ক্রু","kru":"কুরুখ","ks":"কাশ্মীরী","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"কুর্দি","kum":"কুমিক","kut":"কুটেনাই","kv":"কোমি","kw":"কর্ণিশ","ky":"কির্গিজ","la":"লাটিন","lad":"লাডিনো","lag":"Langi","lah":"লান্ডা","lam":"লাম্বা","lb":"লুক্সেমবার্গীয়","lez":"লেজঘিয়ান","lg":"গ্যান্ডা","li":"লিম্বুর্গিশ","lkt":"Lakota","ln":"লিঙ্গালা","lo":"লাও","lol":"মোঙ্গো","loz":"লোজি","lt":"লিথুয়েনীয","lu":"লুবা-কাটাঙ্গা","lua":"লুবা-লুলুয়া","lui":"লুইসেনো","lun":"লুন্ডা","luo":"লুয়ো","lus":"লুশাই","luy":"Luyia","lv":"লাত্‌ভীয়","mad":"মাদুরেসে","maf":"Mafa","mag":"মাগাহি","mai":"মৈথিলি","mak":"ম্যাকাসার","man":"ম্যান্ডিঙ্গো","map":"অস্ট্রোনেশীয়","mas":"মাসাই","mde":"Maba","mdf":"মোকশা","mdr":"ম্যাণ্ডার","men":"মেন্ডে","mer":"Meru","mfe":"মরিসিয়ান","mg":"মালাগাসি","mga":"মধ্য আইরিশ","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"মার্শালিজ","mi":"মাওরি","mic":"মিকম্যাক","min":"মিনাঙ্গ্‌কাবাউ","mis":"বিবিধ ভাষা","mk":"ম্যাসেডোনীয","mkh":"মন-খমের ভাষা","ml":"মালেয়ালাম","mn":"মঙ্গোলিয়","mnc":"মাঞ্চু","mni":"মণিপুরী","mno":"ম্যানোবো ভাষা","mo":"মলদাভিয়","moh":"মোহাওক","mos":"মসি","mr":"মারাঠি","ms":"মালে","mt":"মল্টিয়","mua":"Mundang","mul":"বহুগুণিতক ভাষাসমূহ","mun":"মুণ্ডা ভাষা","mus":"ক্রিক","mwl":"মিরান্ডিজ","mwr":"মারোয়ারি","my":"বর্মি","mye":"Myene","myn":"মায়ান ভাষা","myv":"এরজিয়া","na":"নাউরু","nah":"নাহুৎল","nai":"উত্তৱ আমেরিকার ইন্ডিয়ান ভাষা","nap":"নেয়াপোলিটান","naq":"Nama","nb":"নরওয়ে বোকমাল","nd":"উত্তর এন্দেবিলি","nds":"নিম্ন জার্মানি","ne":"নেপালী","new":"নেওয়ারি","ng":"এন্দোঙ্গা","nia":"নিয়াস","nic":"নাইজার-কোর্ডোফানিয়ান ভাষা","niu":"নিউয়ান","nl":"ডাচ","nl-BE":"ফ্লেমিশ","nmg":"Kwasio","nn":"নরওয়েজীয়ান নিনর্স্ক","nnh":"Ngiemboon","no":"নরওয়েজীয়","nog":"নোগাই","non":"প্রাচীন নর্স","nqo":"এন’কো","nr":"দক্ষিণ এনডেবেলে","nso":"উত্তরাঞ্চলীয় সোথো","nub":"নুবিয়ান ভাষা","nus":"Nuer","nv":"নাভাজো","nwc":"প্রাচীন নেওয়ারী","ny":"নায়াঞ্জা","nym":"ন্যায়ামওয়েজি","nyn":"ন্যায়াঙ্কোলে","nyo":"ন্যোরো","nzi":"এন্.জিমা","oc":"অক্সিটান","oj":"ওজিবওয়া","om":"অরোমো","or":"উড়িয়া","os":"ওসেটিক","osa":"ওসেজ","ota":"অটোমান তুর্কি","oto":"অটোমান ভাষা","pa":"পাঞ্জাবী","paa":"পাপুয়ান ভাষা","pag":"পাঙ্গাসিনান","pal":"পাহ্লাভি","pam":"পাম্পাঙ্গা","pap":"পাপিয়ামেন্টো","pau":"পালায়ুয়ান","peo":"প্রাচীন ফার্সি","phi":"ফিলিপাইন ভাষা","phn":"ফোনিশীয়ান","pi":"পালি","pl":"পোলিশ","pon":"পোহ্নপেইয়ান","pra":"প্রাকৃত ভাষা","pro":"প্রাচীন প্রোভেনসাল","ps":"পুশতো","pt":"পর্তুগীজ","pt-BR":"ব্রাজিলীয় পর্তুগীজ","pt-PT":"আইবেরিয়ান পর্তুগিজ","qu":"কেচুয়া","raj":"রাজস্থানী","rap":"রাপানুই","rar":"রারোটোংগান","rm":"রোমান্স","rn":"রুন্দি","ro":"রোমানীয়","roa":"রোমান ভাষা","rof":"Rombo","rom":"রোমানি","root":"মূল","ru":"রুশ","rup":"আরোমানিয়","rw":"কিনয়ারোয়ান্ডা","rwk":"Rwa","sa":"সংষ্কৃত","sad":"স্যান্ডাওয়ে","sah":"ইয়াকুট","sai":"উত্তর আমেরিকান ইন্ডিয়ান ভাষা","sal":"শালিশান ভাষা","sam":"সামারিটান আরামিক","saq":"Samburu","sas":"সাসাক","sat":"সাঁওতালি","sba":"Ngambay","sbp":"Sangu","sc":"সার্ডিনিয়ান","scn":"সিসিলিয়ান","sco":"স্কটস","sd":"সিন্ধি","se":"উত্তরাঞ্চলীয় সামি","see":"Seneca","seh":"Sena","sel":"সেল্কুপ","sem":"সেমেটিক ভাষা","ses":"Koyraboro Senni","sg":"সাঙ্গো","sga":"প্রাচীন আইরিশ","sgn":"চিহ্ন ভাষা","sh":"সার্বো-ক্রোয়েশিয়","shi":"Tachelhit","shn":"শান","shu":"Chadian Arabic","si":"সিংহলী","sid":"সিডামো","sio":"সিওয়ুয়ান ভাষা","sit":"সিনো-তিব্বোতীয় ভাষা","sk":"স্লোভাক","sl":"স্লোভেনীয়","sla":"স্ল্যাভিক ভাষা","sm":"সামোয়ান","sma":"দক্ষিণাঞ্চলীয় সামি","smi":"সামি ভাষা","smj":"লুলে সামি","smn":"ইনারি সামি","sms":"স্কোল্ট সামি","sn":"শোনা","snk":"সোনিঙ্কে","so":"সোমালী","sog":"সোগডিয়ান","son":"সোঙ্গহাই","sq":"আলবেনীয়","sr":"সার্বীয়","srn":"স্রানান টোঙ্গো","srr":"সেরের","ss":"সোয়াতি","ssa":"নিলো-সাহারান ভাষা","ssy":"Saho","st":"দক্ষিন সোথো","su":"সুদানী","suk":"সুকুমা","sus":"সুসু","sux":"সুমেরীয়","sv":"সুইডিশ","sw":"সোয়াহিলি","swb":"কমোরিয়ান","swc":"Congo Swahili","syc":"প্রাচীন সিরিও","syr":"সিরিয়াক","ta":"তামিল","tai":"তাই ভাষা","te":"তেলেগু","tem":"টাইম্নে","teo":"Teso","ter":"তেরেনো","tet":"তেতুম","tg":"তাজিক","th":"থাই","ti":"তিগরিনিয়া","tig":"টাইগ্রে","tiv":"টিভ","tk":"তুর্কমেনী","tkl":"টোকেলাউ","tl":"তাগালগ","tlh":"ক্লিঙ্গন","tli":"ত্লিঙ্গিট","tmh":"তামাশেক","tn":"সোয়ানা","to":"টঙ্গা","tog":"নায়াসা টোঙ্গা","tpi":"টোক পিসিন","tr":"তুর্কী","trv":"Taroko","ts":"সঙ্গা","tsi":"সিমশিয়ান","tt":"তাতার","tum":"তুম্বুকা","tup":"তুপি ভাষা","tut":"আলতায়ীক ভাষা","tvl":"টুভালু","tw":"টোয়াই","twq":"Tasawaq","ty":"তাহিতিয়ান","tyv":"টুভিনিয়ান","tzm":"Central Atlas Tamazight","udm":"উডমুর্ট","ug":"ইউঘুর","uga":"উগারিটিক","uk":"ইউক্রেনীয়","umb":"উম্বুন্দু","und":"অজানা বা ভুল ভাষা","ur":"উর্দু","uz":"উজবেকীয়","vai":"ভাই","ve":"ভেন্ডা","vi":"ভিয়েতনামী","vo":"ভোলাপুক","vot":"ভোটিক","vun":"Vunjo","wa":"ওয়ালুন","wae":"Walser","wak":"ওয়াকাশান ভাষা","wal":"ওয়ালামো","war":"ওয়ারে","was":"ওয়াশো","wen":"সোরবিয়ান ভাষা","wo":"উওলোফ","xal":"কাল্মইক","xh":"জোসা","xog":"Soga","yao":"ইয়াও","yap":"ইয়াপেসে","yav":"Yangben","ybb":"Yemba","yi":"য়িদ্দিশ","yo":"ইওরুবা","ypk":"ইয়ুপিক ভাষা","yue":"ক্যানটোনীজ","za":"ঝু্য়াঙ","zap":"জাপোটেক","zbl":"চিত্র ভাষা","zen":"জেনাগা","zh":"চীনা","zh-Hans":"সহজ চীনা","zh-Hant":"প্রথাগত চীনা","znd":"জান্ডে","zu":"জুলু","zun":"জুনি","zxx":"ভাষাতাত্তিক বিষয়সূচী বহির্ভুত","zza":"জাজা"},"ca":{"aa":"àfar","ab":"abkhaz","ace":"atjeh","ach":"acoli","ada":"adangme","ady":"adigué","ae":"avèstic","af":"afrikaans","afa":"llengua afroasiàtica","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"àkan","akk":"accadi","ale":"aleuta","alg":"llengua algonquina","alt":"altaic meridional","am":"amhàric","an":"aragonès","ang":"anglès antic","anp":"angika","apa":"llengua apatxe","ar":"àrab","ar-001":"Modern Standard Arabic","arc":"arameu","arn":"araucà","arp":"arapaho","art":"llengua artificial","arw":"arauac","as":"assamès","asa":"pare","ast":"asturià","ath":"llengua atapascana","aus":"llengua australiana","av":"àvar","awa":"awadhi","ay":"aimara","az":"àzeri","ba":"baixkir","bad":"banda","bai":"bamileké","bal":"balutxi","ban":"balinès","bas":"basa","bat":"llengua bàltica","bax":"bamun","bbj":"ghomala","be":"bielorús","bej":"beja","bem":"bemba","ber":"berber","bez":"bena","bfd":"bafut","bg":"búlgar","bh":"bihari","bho":"bhojpuri","bi":"bislama","bik":"bicol","bin":"bini","bkm":"kom","bla":"blackfoot","bm":"bambara","bn":"bengalí","bnt":"bantu","bo":"tibetà","br":"bretó","bra":"braj","brx":"bodo","bs":"bosnià","bss":"akoose","btk":"batak","bua":"buriat","bug":"bugui","bum":"seki","byn":"bilin","byv":"medumba","ca":"català","cad":"caddo","cai":"llengua ameríndia d'Amèrica Central","car":"carib","cau":"llengua caucàsica","cay":"cayuga","cch":"atsam","ce":"txetxè","ceb":"cebuà","cel":"llengua cèltica","cgg":"chiga","ch":"chamorro","chb":"txibtxa","chg":"txagatai","chk":"chuuk","chm":"mari","chn":"pidgin chinook","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"xeienne","ckb":"kurd sorani","cmc":"txam","co":"cors","cop":"copte","cpe":"llengua criolla o pidgin basada en l'anglès","cpf":"llengua criolla o pidgin basada en el francès","cpp":"llengua criolla o pidgin basada en el portuguès","cr":"cree","crh":"tàtar de Crimea","crp":"llengua criolla o pidgin","cs":"txec","csb":"caixubi","cu":"eslau eclesiàstic","cus":"llengua cuixítica","cv":"txuvaix","cy":"gal·lès","da":"danès","dak":"dakota","dar":"darguà","dav":"taita","day":"daiak","de":"alemany","de-AT":"alemany austríac","de-CH":"alt alemany suís","del":"delaware","den":"slavey","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"llengua dravídica","dsb":"baix sòrab","dua":"duala","dum":"neerlandès mitjà","dv":"divehi","dyo":"jola-fonyi","dyu":"jula","dz":"dzongka","dzg":"dazaga","ebu":"embu","ee":"ewe","efi":"efik","egy":"egipci antic","eka":"ekajuk","el":"grec","elx":"elamita","en":"anglès","en-AU":"anglès australià","en-CA":"anglès canadenc","en-GB":"anglès britànic","en-US":"anglès americà","enm":"anglès mitjà","eo":"esperanto","es":"espanyol","es-419":"espanyol d'Hispanoamèrica","es-ES":"espanyol d'Espanya","et":"estonià","eu":"basc","ewo":"ewondo","fa":"persa","fan":"fang","fat":"fanti","ff":"ful","fi":"finès","fil":"filipí","fiu":"llengua finoúgrica","fj":"fijià","fo":"feroès","fon":"fon","fr":"francès","fr-CA":"francès canadenc","fr-CH":"francès suís","frm":"francès mitjà","fro":"francès antic","frr":"frisó septentrional","frs":"frisó occidental","fur":"friülà","fy":"frisó oriental","ga":"irlandès","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"gaèlic escocès","gem":"llengua germànica","gez":"gueez","gil":"gilbertès","gl":"gallec","gmh":"alt alemany mitjà","gn":"guaraní","goh":"alt alemany antic","gon":"gondi","gor":"gorontalo","got":"gòtic","grb":"grebo","grc":"grec antic","gsw":"alemany suís","gu":"gujarati","guz":"gusí","gv":"manx","gwi":"gwichin","ha":"haussa","hai":"haida","haw":"hawaià","he":"hebreu","hi":"hindi","hil":"hiligainon","him":"himachali","hit":"hitita","hmn":"hmong","ho":"hiri motu","hr":"croat","hsb":"alt sòrab","ht":"haitià","hu":"hongarès","hup":"hupa","hy":"armeni","hz":"herero","ia":"interlingua","iba":"iban","ibb":"ibibio","id":"indonesi","ie":"interlingue","ig":"igbo","ii":"yi sichuan","ijo":"ijo","ik":"inupiak","ilo":"ilocà","inc":"llengua índica","ine":"llengua indoeuropea","inh":"ingúix","io":"ido","ira":"llengua irànica","iro":"iroquès","is":"islandès","it":"italià","iu":"inuktitut","ja":"japonès","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"judeopersa","jrb":"judeoàrab","jv":"javanès","ka":"georgià","kaa":"karakalpak","kab":"cabilenc","kac":"katxin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardí","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"crioll capverdià","kfo":"koro","kg":"kongo","kha":"khasi","khi":"llengua khoisan","kho":"khotanès","khq":"koyra chiini","ki":"kikuiu","kj":"kuanyama","kk":"kazakh","kkj":"kako","kl":"grenlandès","kln":"kalenjin","km":"khmer","kmb":"kimbundu","kn":"kannada","ko":"coreà","kok":"konkani","kos":"kosraeà","kpe":"kpelle","kr":"kanuri","krc":"karatxai","krl":"carelià","kro":"kru","kru":"kurukh","ks":"caixmiri","ksb":"shambala","ksf":"bafia","ksh":"colognian","ku":"kurd","kum":"kúmik","kut":"kutenai","kv":"komi","kw":"còrnic","ky":"kirguís","la":"llatí","lad":"ladí","lag":"langi","lah":"panjabi occidental","lam":"lamba","lb":"luxemburguès","lez":"lesguià","lg":"ganda","li":"limburguès","lkt":"Lakota","ln":"lingala","lo":"laosià","lol":"mongo","loz":"lozi","lt":"lituà","lu":"luba katanga","lua":"luba-lulua","lui":"luisenyo","lun":"lunda","luo":"luo","lus":"mizo","luy":"luyia","lv":"letó","mad":"madurès","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makassar","man":"mandinga","map":"llengua austronèsia","mas":"massai","mde":"maba","mdf":"mordovià moksa","mdr":"mandar","men":"mende","mer":"meru","mfe":"mauricià","mg":"malgaix","mga":"gaèlic irlandès mitjà","mgh":"makhuwa-metto","mgo":"Meta'","mh":"marshallès","mi":"maori","mic":"micmac","min":"minangkabau","mis":"llengua miscel·lània","mk":"macedoni","mkh":"llengua monkhmer","ml":"malaialam","mn":"mongol","mnc":"manxú","mni":"manipurí","mno":"llengua manobo","mo":"moldau","moh":"mohawk","mos":"moré","mr":"marathi","ms":"malai","mt":"maltès","mua":"mundang","mul":"llengües vàries","mun":"llengua munda","mus":"creek","mwl":"mirandès","mwr":"marwari","my":"birmà","mye":"myene","myn":"llengua maia","myv":"mordovià erza","na":"nauruà","nah":"nàhuatl","nai":"llengua ameríndia septentrional","nap":"napolità","naq":"nama","nb":"noruec bokmål","nd":"ndebele septentrional","nds":"baix alemany","ne":"nepalès","new":"newari","ng":"ndonga","nia":"nias","nic":"llengua nigerokurdufaniana","niu":"niueà","nl":"neerlandès","nl-BE":"flamenc","nmg":"bissio","nn":"noruec nynorsk","nnh":"ngiemboon","no":"noruec","nog":"nogai","non":"nòrdic antic","nqo":"n’Ko","nr":"ndebele meridional","nso":"sotho septentrional","nub":"llengua nubiana","nus":"nuer","nv":"navaho","nwc":"newari clàssic","ny":"nyanja","nym":"nyamwesi","nyn":"nyankole","nyo":"nyoro","nzi":"nzema","oc":"occità","oj":"ojibwa","om":"oromo","or":"oriya","os":"osset","osa":"osage","ota":"turc otomà","oto":"llengua otomangueana","pa":"panjabi","paa":"llengua papú","pag":"pangasi","pal":"pahlavi","pam":"pampangà","pap":"papiamento","pau":"palauà","peo":"persa antic","phi":"llengua filipina","phn":"fenici","pi":"pali","pl":"polonès","pon":"ponapeà","pra":"pràcrit","pro":"provençal antic","ps":"pushtu","pt":"portuguès","pt-BR":"portuguès de Brasil","pt-PT":"portuguès de Portugal","qu":"quítxua","raj":"rajasthani","rap":"rapanui","rar":"rarotongà","rm":"retoromànic","rn":"rundi","ro":"romanès","roa":"llengua romànica","rof":"rombo","rom":"romaní","root":"arrel","ru":"rus","rup":"aromanès","rw":"ruandès","rwk":"rwo","sa":"sànscrit","sad":"sandawe","sah":"iacut","sai":"llengua ameríndia meridional","sal":"llengua salish","sam":"arameu samarità","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sard","scn":"sicilià","sco":"escocès","sd":"sindhi","se":"sami septentrional","see":"seneca","seh":"sena","sel":"selkup","sem":"llengua semítica","ses":"koyraboro senni","sg":"sango","sga":"irlandès antic","sgn":"llengua de signes","sh":"serbocroat","shi":"tachelhit","shn":"xan","shu":"àrab txadià","si":"singalès","sid":"sidamo","sio":"llengua sioux","sit":"llengua sinotibetana","sk":"eslovac","sl":"eslovè","sla":"llengua eslava","sm":"samoà","sma":"sami meridional","smi":"llengua sami","smj":"sami lule","smn":"sami d'Inari","sms":"sami skolt","sn":"shona","snk":"soninke","so":"somali","sog":"sogdià","son":"songhai","sq":"albanès","sr":"serbi","srn":"sranan","srr":"serer","ss":"siswati","ssa":"llengua nilosahariana","ssy":"saho","st":"sotho meridional","su":"sundanès","suk":"sukuma","sus":"susú","sux":"sumeri","sv":"suec","sw":"suahili","swb":"comorià","swc":"suahili del Congo","syc":"siríac clàssic","syr":"siríac","ta":"tàmil","tai":"llengua tai","te":"telugu","tem":"temne","teo":"teso","ter":"terena","tet":"tetun","tg":"tadjik","th":"tailandès","ti":"tigrinya","tig":"tigre","tiv":"tiv","tk":"turcman","tkl":"tokelauès","tl":"tagàlog","tlh":"klingonià","tli":"tlingit","tmh":"tamazight","tn":"tswana","to":"tongalès","tog":"tonga","tpi":"tok pisin","tr":"turc","trv":"taroko","ts":"tsonga","tsi":"tsimshià","tt":"tàtar","tum":"tumbuka","tup":"llengua tupí","tut":"llengua altaica","tvl":"tuvaluà","tw":"twi","twq":"tasawaq","ty":"tahitià","tyv":"tuvinià","tzm":"amazic del Marroc central","udm":"udmurt","ug":"uigur","uga":"ugarític","uk":"ucraïnès","umb":"umbundu","und":"idioma desconegut","ur":"urdú","uz":"uzbek","vai":"vai","ve":"venda","vi":"vietnamita","vo":"volapük","vot":"vòtic","vun":"vunjo","wa":"való","wae":"walser","wak":"llengua wakash","wal":"ameto","war":"waray-waray","was":"washo","wen":"sòrab","wo":"wòlof","xal":"calmuc","xh":"xosa","xog":"soga","yao":"yao","yap":"yapeà","yav":"yangben","ybb":"yemba","yi":"jiddisch","yo":"ioruba","ypk":"llengua iupik","yue":"cantonès","za":"zhuang","zap":"zapoteca","zbl":"símbols Bliss","zen":"zenaga","zh":"xinès","zh-Hans":"xinès simplificat","zh-Hant":"xinès tradicional","znd":"zande","zu":"zulu","zun":"zuni","zxx":"sense contingut lingüístic","zza":"zaza"},"cs":{"aa":"afarština","ab":"abcházština","ace":"acehština","ach":"akolština","ada":"adangme","ady":"adygejština","ae":"avestánština","af":"afrikánština","afa":"afroasijské jazyky","afh":"afrihili","agq":"aghem","ain":"ainština","ak":"akanština","akk":"akkadština","ale":"aleutština","alg":"algonkinské jazyky","alt":"altajština (jižní)","am":"amharština","an":"aragonština","ang":"staroangličtina","anp":"angika","apa":"apačské jazyky","ar":"arabština","ar-001":"Modern Standard Arabic","arc":"aramejština","arn":"araukánština","arp":"arapažština","art":"umělé jazyky","arw":"arawacké jazyky","as":"asámština","asa":"asu","ast":"asturština","ath":"athapaskánské jazyky","aus":"australské jazyky","av":"avarština","awa":"awadhština","ay":"ajmarština","az":"ázerbájdžánština","ba":"baškirština","bad":"banda","bai":"bamilek","bal":"balúčština","ban":"balijština","bas":"basa","bat":"baltské jazyky","bax":"bamun","bbj":"ghomala","be":"běloruština","bej":"bedža","bem":"bembština","ber":"berberské jazyky","bez":"bena","bfd":"bafut","bg":"bulharština","bh":"bihárština","bho":"bhojpurština","bi":"bislamština","bik":"bikolština","bin":"bini","bkm":"Kom","bla":"siksika","bm":"bambarština","bn":"bengálština","bnt":"bantuské jazyky","bo":"tibetština","br":"bretonština","bra":"bradžština","brx":"bodoština","bs":"bosenština","bss":"akoose","btk":"batačtina","bua":"burjatština","bug":"bugiština","bum":"bulu","byn":"blinština","byv":"medumba","ca":"katalánština","cad":"caddo","cai":"středoamerické indiánské jazyky","car":"karibština","cau":"kavkazské jazyky","cay":"kajugština","cch":"atsam","ce":"čečenština","ceb":"cebuánština","cel":"keltské jazyky","cgg":"kiga","ch":"čamoro","chb":"čibča","chg":"čagatajština","chk":"čukština","chm":"marijština","chn":"činuk pidžin","cho":"čoktština","chp":"čipevajština","chr":"čerokézština","chy":"čejenština","ckb":"kurdština (sorání)","cmc":"čamština","co":"korsičtina","cop":"koptština","cpe":"anglická kreolština či pidgin","cpf":"francouzská kreolština či pidgin","cpp":"portugalská kreolština či pidgin","cr":"kríjština","crh":"krymská turečtina","crp":"kreolština či pidgin","cs":"čeština","csb":"kašubština","cu":"staroslověnština","cus":"kúšitské jazyky","cv":"čuvaština","cy":"velština","da":"dánština","dak":"dakotština","dar":"dargština","dav":"taita","day":"dajáčtina","de":"němčina","de-AT":"Austrian German","de-CH":"němčina standardní (Švýcarsko)","del":"delawarština","den":"slave","dgr":"dogrib","din":"dinkština","dje":"zarmština","doi":"dogarština","dra":"drávidské jazyky","dsb":"dolnolužická srbština","dua":"dualština","dum":"středoholandština","dv":"divehi","dyo":"jola-fonyi","dyu":"djula","dz":"dzongkä","dzg":"dazaga","ebu":"embu","ee":"eweština","efi":"efikština","egy":"egyptština stará","eka":"ekajuk","el":"řečtina","elx":"elamitština","en":"angličtina","en-AU":"Australian English","en-CA":"Canadian English","en-GB":"British English","en-US":"angličtina (USA)","enm":"středověká angličtina","eo":"esperanto","es":"španělština","es-419":"Latin American Spanish","es-ES":"španělština (Evropa)","et":"estonština","eu":"baskičtina","ewo":"ewondo","fa":"perština","fan":"fang","fat":"fantština","ff":"fulahština","fi":"finština","fil":"filipínština","fiu":"ugrofinské jazyky","fj":"fidžijština","fo":"faerština","fon":"fonština","fr":"francouzština","fr-CA":"Canadian French","fr-CH":"Swiss French","frm":"středověká francouzština","fro":"starofrancouzština","frr":"fríština (severní)","frs":"fríština (východní)","fur":"furlandština","fy":"fríština","ga":"irština","gaa":"gaština","gay":"gayo","gba":"gbaja","gd":"skotská gaelština","gem":"germánské jazyky","gez":"geez","gil":"kiribatština","gl":"galicijština","gmh":"hornoněmčina (středověká)","gn":"guaranština","goh":"hornoněmčina (stará)","gon":"góndština","gor":"gorontalo","got":"gótština","grb":"grebo","grc":"starořečtina","gsw":"němčina (Švýcarsko)","gu":"gudžarátština","guz":"gusii","gv":"manština","gwi":"gwichʼin","ha":"hauština","hai":"haidština","haw":"havajština","he":"hebrejština","hi":"hindština","hil":"hiligaynonština","him":"himáčalština","hit":"chetitština","hmn":"hmongština","ho":"hiri motu","hr":"chorvatština","hsb":"hornolužická srbština","ht":"haitština","hu":"maďarština","hup":"hupa","hy":"arménština","hz":"hererština","ia":"interlingua","iba":"ibanština","ibb":"ibibio","id":"indonéština","ie":"interlingue","ig":"igboština","ii":"Sichuan Yi","ijo":"idžo","ik":"inupiakština","ilo":"ilokánština","inc":"indické jazyky","ine":"indoevropské jazyky","inh":"inguština","io":"ido","ira":"íránské jazyky","iro":"irokézské jazyky","is":"islandština","it":"italština","iu":"inuktitutština","ja":"japonština","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"judeoperština","jrb":"judeoarabština","jv":"javánština","ka":"gruzínština","kaa":"karakalpačtina","kab":"kabylština","kac":"kačijština","kaj":"jju","kam":"kambština","kar":"karenština","kaw":"kawi","kbd":"kabardinština","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"kapverdština","kfo":"koro","kg":"konžština","kha":"khásí","khi":"kojsanské jazyky","kho":"chotánština","khq":"Koyra Chiini","ki":"kikujština","kj":"kuaňamština","kk":"kazaština","kkj":"kako","kl":"grónština","kln":"Kalenjin","km":"khmérština","kmb":"kimbundština","kn":"kannadština","ko":"korejština","kok":"konkánština","kos":"kosrajština","kpe":"kpelle","kr":"kanuri","krc":"karačajevo-balkarština","krl":"karelština","kro":"kru","kru":"kuruchština","ks":"kašmírština","ksb":"shambala","ksf":"bafia","ksh":"kölsch","ku":"kurdština","kum":"kumyčtina","kut":"kutenai","kv":"komijština","kw":"kornština","ky":"kyrgyzština","la":"latina","lad":"ladinština","lag":"langi","lah":"lahndština","lam":"lambština","lb":"lucemburština","lez":"lezginština","lg":"gandština","li":"limburština","lkt":"Lakota","ln":"lingalština","lo":"laoština","lol":"mongština","loz":"lozština","lt":"litevština","lu":"lubu-katanžština","lua":"luba-luluaština","lui":"luiseňo","lun":"lundština","luo":"luoština","lus":"lišáí","luy":"luhja","lv":"lotyština","mad":"madurština","maf":"mafa","mag":"magahijština","mai":"maithiliština","mak":"makasarština","man":"mandingština","map":"austronéské jazyky","mas":"masajština","mde":"maba","mdf":"mokšanština","mdr":"mandar","men":"mende","mer":"meru","mfe":"mauricijská kreolština","mg":"malgaština","mga":"středoirština","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"maršálština","mi":"maorština","mic":"micmac","min":"minangkabau","mis":"různé jazyky","mk":"makedonština","mkh":"mon-khmerské jazyky","ml":"malabarština","mn":"mongolština","mnc":"mandžuština","mni":"manipurština","mno":"manobo jazyky","mo":"moldavština","moh":"mohawk","mos":"mosi","mr":"maráthština","ms":"malajština","mt":"maltština","mua":"mundang","mul":"složené (víceřádkové) jazyky","mun":"mundské jazyky","mus":"Creek","mwl":"mirandština","mwr":"márvárština","my":"barmština","mye":"myene","myn":"mayské jazyky","myv":"erzjanština","na":"naurština","nah":"nahuatl","nai":"severoamerické indiánské jazyky","nap":"neapolština","naq":"Nama","nb":"norština (bokmål)","nd":"ndebele (Zimbabwe)","nds":"dolnoněmčina","ne":"nepálština","new":"névárština","ng":"ndondština","nia":"nias","nic":"nigero-kordofánské jazyky","niu":"niueština","nl":"nizozemština","nl-BE":"vlámština","nmg":"Kwasio","nn":"norština (nynorsk)","nnh":"ngiemboon","no":"norština","nog":"nogajština","non":"norština historická","nqo":"n’ko","nr":"ndebele (Jižní Afrika)","nso":"sotština (severní)","nub":"núbijské jazyky","nus":"nuerština","nv":"navažština","nwc":"newarština (klasická)","ny":"ňandžština","nym":"ňamwežština","nyn":"nyankole","nyo":"nyorština","nzi":"nzima","oc":"okcitánština","oj":"odžibvejština","om":"oromština","or":"urijština","os":"osetština","osa":"osage","ota":"osmanská turečtina","oto":"otomijské jazyky","pa":"paňdžábština","paa":"papuánské jazyky","pag":"pangasinanština","pal":"pahlavština","pam":"papangau","pap":"papiamento","pau":"palauština","peo":"staroperština","phi":"filipínské jazyky","phn":"féničtina","pi":"pálí","pl":"polština","pon":"pohnpeiština","pra":"prákrtské jazyky","pro":"provensálština","ps":"paštština","pt":"portugalština","pt-BR":"Brazilian Portuguese","pt-PT":"portugalština (Evropa)","qu":"kečuánština","raj":"rádžastánština","rap":"rapanuiština","rar":"rarotongaština","rm":"rétorománština","rn":"kirundština","ro":"rumunština","roa":"románské jazyky","rof":"rombo","rom":"romština","root":"Root","ru":"ruština","rup":"arumunština","rw":"kinyarwandština","rwk":"rwa","sa":"sanskrt","sad":"sandawština","sah":"jakutština","sai":"jihoamerické indiánské jazyky","sal":"sališské jazyky","sam":"samarština","saq":"samburu","sas":"sasakština","sat":"santálština","sba":"ngambay","sbp":"sangoština","sc":"sardština","scn":"sicilština","sco":"skotština","sd":"sindhština","se":"sámština (severní)","see":"seneca","seh":"sena","sel":"selkupština","sem":"semitské jazyky","ses":"koyraboro senni","sg":"sangština","sga":"staroirština","sgn":"znakové jazyky","sh":"srbochorvatština","shi":"Tachelhit","shn":"šanština","shu":"arabština (čadská)","si":"sinhálština","sid":"sidamo","sio":"siouxské jazyky","sit":"tibetočínské jazyky","sk":"slovenština","sl":"slovinština","sla":"slovanský jazyk","sm":"samojština","sma":"sámština (jižní)","smi":"sámské jazyky","smj":"sámština (lulejská)","smn":"sámština (inarijská)","sms":"sámština (skoltská)","sn":"šonština","snk":"sonikština","so":"somálština","sog":"sogdština","son":"songhajština","sq":"albánština","sr":"srbština","srn":"sranan tongo","srr":"sererština","ss":"siswatština","ssa":"nilosaharské jazyky","ssy":"saho","st":"sotština (jižní)","su":"sundanština","suk":"sukuma","sus":"susu","sux":"sumerština","sv":"švédština","sw":"svahilština","swb":"komorština","swc":"swahilština (Kongo)","syc":"syrština (klasická)","syr":"syrština","ta":"tamilština","tai":"thajské jazyky","te":"telugština","tem":"temne","teo":"teso","ter":"tereno","tet":"tetumština","tg":"tádžičtina","th":"thajština","ti":"tigrinijština","tig":"tigrejština","tiv":"tivština","tk":"turkmenština","tkl":"tokelauština","tl":"tagalog","tlh":"klingonština","tli":"tlingit","tmh":"tamašek","tn":"setswanština","to":"tongánština","tog":"Nyasa Tonga","tpi":"tok pisin","tr":"turečtina","trv":"taroko","ts":"tsonga","tsi":"tsimšijské jazyky","tt":"tatarština","tum":"tumbukština","tup":"tupijské jazyky","tut":"altajské jazyky","tvl":"tuvalština","tw":"twi","twq":"Tasawaq","ty":"tahitština","tyv":"tuvinština","tzm":"tamazight (Střední Maroko)","udm":"udmurtština","ug":"ujgurština","uga":"ugaritština","uk":"ukrajinština","umb":"umbundu","und":"neznámý jazyk","ur":"urdština","uz":"uzbečtina","vai":"vai","ve":"venda","vi":"vietnamština","vo":"volapuk","vot":"votiatština","vun":"Vunjo","wa":"valonština","wae":"němčina (walser)","wak":"wakašské jazyky","wal":"walamština","war":"waray","was":"waština","wen":"lužickosrbské jazyky","wo":"wolofština","xal":"kalmyčtina","xh":"xhoština","xog":"sogština","yao":"jaoština","yap":"yapese","yav":"yangben","ybb":"yemba","yi":"jidiš","yo":"jorubština","ypk":"yupik","yue":"kantonština","za":"čuangština","zap":"zapotéčtina","zbl":"bliss systém","zen":"zenaga","zh":"čínština","zh-Hans":"čínština (zjednodušená)","zh-Hant":"Traditional Chinese","znd":"zandština","zu":"zuluština","zun":"zunijština","zxx":"žádný jazykový obsah","zza":"zaza"},"cy":{"aa":"Afar","ab":"Abchaseg","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"Affricâneg","afa":"Iaith Affro-Asiaidd","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"Amhareg","an":"Aragonese","ang":"Hen Saesneg","anp":"Angika","apa":"Apache Language","ar":"Arabeg","ar-001":"Modern Standard Arabic","arc":"Aramaeg","arn":"Mapuche","arp":"Arapaho","art":"Iaith Artiffisial","arw":"Arawak","as":"Asameg","asa":"Asu","ast":"Asturian","ath":"Iaith Athabasgaidd","aus":"Iaith Awstralaidd","av":"Avaric","awa":"Awadhi","ay":"Aymara","az":"Aserbaijaneg","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"Belarwseg","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"Bwlgareg","bh":"Bihari","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengaleg","bnt":"Bantu","bo":"Tibeteg","br":"Llydaweg","bra":"Braj","brx":"Bodo","bs":"Bosnieg","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Catalaneg","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Iaith Geltaidd","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Sorani Kurdish","cmc":"Chamic Language","co":"Corsican","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"Tsieceg","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"Cymraeg","da":"Daneg","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"Almaeneg","de-AT":"Almaeneg Awstria","de-CH":"Almaeneg Safonol y Swistir","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Iseldireg Canol","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Hen Eiffteg","eka":"Ekajuk","el":"Groeg","elx":"Elamite","en":"Saesneg","en-AU":"Saesneg Awstralia","en-CA":"Saesneg Canada","en-GB":"Saesneg Prydain","en-US":"Saesneg UDA","enm":"Saesneg Canol","eo":"Esperanto","es":"Sbaeneg","es-419":"Sbaeneg America Ladin","es-ES":"Sbaeneg Ewrop","et":"Estoneg","eu":"Basgeg","ewo":"Ewondo","fa":"Perseg","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Ffinneg","fil":"Ffilipineg","fiu":"Iaith Ffinno-Wgrig","fj":"Ffijïeg","fo":"Ffaroeg","fon":"Fon","fr":"Ffrangeg","fr-CA":"Ffrangeg Canada","fr-CH":"Ffrangeg y Swistir","frm":"Ffrangeg Canol","fro":"Hen Ffrangeg","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Ffriwleg","fy":"Ffriseg y Gorllewin","ga":"Gwyddeleg","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Gaeleg yr Alban","gem":"Iaith Germanaidd","gez":"Geez","gil":"Gilbertese","gl":"Galiseg","gmh":"Middle High German","gn":"Guaraní","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gotheg","grb":"Grebo","grc":"Hen Roeg","gsw":"Almaeneg y Swistir","gu":"Gwjarati","guz":"Gusii","gv":"Manaweg","gwi":"Gwichʼin","ha":"Hawsa","hai":"Haida","haw":"Hawäieg","he":"Hebraeg","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"Croateg","hsb":"Upper Sorbian","ht":"Creol Haiti","hu":"Hwngareg","hup":"Hupa","hy":"Armeneg","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indoneseg","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Iaith Indo-Ewropeaidd","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"Islandeg","it":"Eidaleg","iu":"Inuktitut","ja":"Japaneeg","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"Jafanaeg","ka":"Georgeg","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Casacheg","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Chmereg","kmb":"Kimbundu","kn":"Canareg","ko":"Corëeg","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Cashmireg","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Cwrdeg","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cernyweg","ky":"Cirgiseg","la":"Lladin","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Lwcsembwrgeg","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"Lingala","lo":"Laoeg","lol":"Mongo","loz":"Lozi","lt":"Lithwaneg","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"Latfieg","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagaseg","mga":"Gwyddeleg Canol","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maori","mic":"Micmaceg","min":"Minangkabau","mis":"Iaith Amrywiol","mk":"Macedoneg","mkh":"Mon-Khmer Language","ml":"Malayalam","mn":"Mongoleg","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldofeg","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Maleieg","mt":"Malteg","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Byrmaneg","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"Norwyeg Bokmål","nd":"North Ndebele","nds":"Low German","ne":"Nepaleg","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"Iseldireg","nl-BE":"Fflemeg","nmg":"Kwasio","nn":"Norwyeg Nynorsk","nnh":"Ngiemboon","no":"Norwyeg","nog":"Nogai","non":"Hen Norseg","nqo":"N’Ko","nr":"South Ndebele","nso":"Northern Sotho","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Ocsitaneg","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetic","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"Pwnjabeg","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Hen Bersieg","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"Pwyleg","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Hen Brofensaleg","ps":"Pashto","pt":"Portiwgeeg","pt-BR":"Portiwgeeg Brasil","pt-PT":"Portiwgeeg Ewrop","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Romaunsch","rn":"Rundi","ro":"Rwmaneg","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"Rwseg","rup":"Aromanian","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sansgrit","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Sgoteg","sd":"Sindhi","se":"Northern Sami","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Hen Wyddeleg","sgn":"Sign Language","sh":"Serbo-Croateg","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"Sinhaleg","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"Slofaceg","sl":"Slofeneg","sla":"Iaith Slafig","sm":"Samoan","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somaleg","sog":"Sogdien","son":"Songhai","sq":"Albaneg","sr":"Serbeg","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Sesotheg","su":"Swndaneg","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"Swedeg","sw":"Swahili","swb":"Comorian","swc":"Swahili'r Congo","syc":"Classical Syriac","syr":"Syriac","ta":"Tamileg","tai":"Tai Language","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tajiceg","th":"Thai","ti":"Tigriniaeg","tig":"Tigre","tiv":"Tiv","tk":"Twrcmeneg","tkl":"Tokelau","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongeg","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Tyrceg","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tatareg","tum":"Tumbuka","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahitian","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"Uighur","uga":"Ugaritic","uk":"Wcreineg","umb":"Umbundu","und":"Iaith Anhysbys","ur":"Wrdw","uz":"Wsbeceg","vai":"Vai","ve":"Venda","vi":"Fietnameg","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Woloff","xal":"Kalmyk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Yiddish","yo":"Iorwba","ypk":"Yupik Language","yue":"Cantoneeg","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"Tsieineeg","zh-Hans":"Tsieineeg Symledig","zh-Hant":"Tsieineeg Traddodiadol","znd":"Zande","zu":"Swlw","zun":"Zuni","zxx":"Dim cynnwys ieithyddol","zza":"Zaza"},"da":{"aa":"afar","ab":"abkhasisk","ace":"achinesisk","ach":"acoli","ada":"adangme","ady":"adyghe","ae":"avestan","af":"afrikaans","afa":"afro-asiatisk sprog","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"akan","akk":"akkadisk","ale":"aleutisk","alg":"algonkisk sprog","alt":"sydaltaisk","am":"amharisk","an":"aragonesisk","ang":"oldengelsk","anp":"angika","apa":"apachesprog","ar":"arabisk","ar-001":"Modern Standard Arabic","arc":"aramæisk","arn":"araukansk","arp":"arapaho","art":"kunstsprog","arw":"arawak","as":"assamesisk","asa":"asu","ast":"asturisk","ath":"athapaskisk sprog","aus":"australsk sprog","av":"avarisk","awa":"awadhi","ay":"aymara","az":"azeri","ba":"bashkir","bad":"banda","bai":"bamilekisk sprog","bal":"baluchi","ban":"balinesisk","bas":"basa","bat":"baltisk sprog","bax":"bamun","bbj":"ghomala","be":"hviderussisk","bej":"beja","bem":"bemba","ber":"berberisk","bez":"bena","bfd":"bafut","bg":"bulgarsk","bh":"bihari","bho":"bhojpuri","bi":"bislama","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengalsk","bnt":"bantu","bo":"tibetansk","br":"bretonsk","bra":"braj","brx":"bodo","bs":"bosnisk","bss":"bakossi","btk":"batak","bua":"buriatisk","bug":"buginesisk","bum":"bulu","byn":"blin","byv":"medumba","ca":"catalansk","cad":"caddo","cai":"mellemamerikansk indiansk sprog","car":"caribisk","cau":"kaukasisk sprog","cay":"cayuga","cch":"atsam","ce":"tjetjensk","ceb":"cebuano","cel":"keltisk sprog","cgg":"chiga","ch":"chamorro","chb":"chibcha","chg":"chagatai","chk":"chuukese","chm":"mari","chn":"chinook","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"cheyenne","ckb":"sorani","cmc":"chamiske sprog","co":"korsikansk","cop":"koptisk","cpe":"engelsk baseret kreolsk eller pidgin","cpf":"fransk baseret kreolsk eller pidginsprog","cpp":"portugisisk baseret kreolsk eller pidginsprog","cr":"cree","crh":"krim tyrkisk","crp":"kreolsk eller pidginsprog","cs":"tjekkisk","csb":"kasjubisk","cu":"kirkeslavisk","cus":"kusjitisk sprog","cv":"chuvash","cy":"walisisk","da":"dansk","dak":"dakota","dar":"dargwa","dav":"taita","day":"dayak","de":"tysk","de-AT":"østrigsk tysk","de-CH":"schweizerhøjtysk","del":"delaware","den":"athapaskisk","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"dravidisk sprog","dsb":"nedersorbisk","dua":"duala","dum":"middelhollandsk","dv":"divehi","dyo":"jola-fonyi","dyu":"dyula","dz":"dzongkha","dzg":"dazaga","ebu":"kiembu","ee":"ewe","efi":"efik","egy":"oldegyptisk","eka":"ekajuk","el":"græsk","elx":"elamitisk","en":"engelsk","en-AU":"australsk engelsk","en-CA":"canadisk engelsk","en-GB":"britisk engelsk","en-US":"amerikansk engelsk","enm":"middelengelsk","eo":"esperanto","es":"spansk","es-419":"latinamerikansk spansk","es-ES":"europæisk spansk","et":"estisk","eu":"baskisk","ewo":"ewondo","fa":"persisk","fan":"fang","fat":"fanti","ff":"fulah","fi":"finsk","fil":"filippinsk","fiu":"finsk-ugrisk sprog","fj":"fijiansk","fo":"færøsk","fon":"fon","fr":"fransk","fr-CA":"canadisk fransk","fr-CH":"schweizisk fransk","frm":"middelfransk","fro":"oldfransk","frr":"nordfrisisk","frs":"østfrisisk","fur":"friulian","fy":"frisisk","ga":"irsk","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"skotsk gælisk","gem":"germansk sprog","gez":"geez","gil":"gilbertesisk","gl":"galicisk","gmh":"middelhøjtysk","gn":"guarani","goh":"oldhøjtysk","gon":"gondi","gor":"gorontalo","got":"gotisk","grb":"grebo","grc":"oldgræsk","gsw":"schweizertysk","gu":"gujarati","guz":"gusii","gv":"manx","gwi":"gwichin","ha":"hausa","hai":"haida","haw":"hawaiiansk","he":"hebraisk","hi":"hindi","hil":"hiligaynon","him":"himachali","hit":"hittitisk","hmn":"hmong","ho":"hirimotu","hr":"kroatisk","hsb":"øvresorbisk","ht":"haitisk","hu":"ungarsk","hup":"hupa","hy":"armensk","hz":"herero","ia":"interlingua","iba":"iban","ibb":"ibibio","id":"indonesisk","ie":"interlingue","ig":"igbo","ii":"sichuan yi","ijo":"ijo","ik":"inupiaq","ilo":"iloko","inc":"indisk sprog","ine":"indo-europæisk sprog","inh":"ingush","io":"ido","ira":"iransk sprog","iro":"irokesisk sprog","is":"islandsk","it":"italiensk","iu":"inuktitut","ja":"japansk","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"jødisk-persisk","jrb":"jødisk-arabisk","jv":"javanesisk","ka":"georgisk","kaa":"karakalpakisk","kab":"kabyle","kac":"kachin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardian","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"kapverdisk","kfo":"koro","kg":"kongo","kha":"khasi","khi":"khoisansprog","kho":"khotanesisk","khq":"koyra-chiini","ki":"kikuyu","kj":"kuanyama","kk":"kasakhisk","kkj":"kako","kl":"grønlandsk","kln":"kalenjin","km":"khmer","kmb":"kimbundu","kn":"kannaresisk","ko":"koreansk","kok":"konkani","kos":"kosraean","kpe":"kpelle","kr":"kanuri","krc":"karatjai-balkar","krl":"karelsk","kro":"kru","kru":"kurukh","ks":"kashmiri","ksb":"shambala","ksf":"bafia","ksh":"kölsch","ku":"kurdisk","kum":"kymyk","kut":"kutenaj","kv":"komi","kw":"cornisk","ky":"kirgisisk","la":"latin","lad":"ladino","lag":"langi","lah":"lahnda","lam":"lamba","lb":"luxembourgsk","lez":"lezghian","lg":"ganda","li":"limburgsk","lkt":"Lakota","ln":"lingala","lo":"laotisk","lol":"mongo","loz":"lozi","lt":"litauisk","lu":"luba-Katanga","lua":"luba-Lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"olulujia","lv":"lettisk","mad":"madurese","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makasar","man":"mandingo","map":"austronesisk sprog","mas":"masai","mde":"maba","mdf":"moksha","mdr":"mandar","men":"mende","mer":"meru","mfe":"morisyen","mg":"malagasy","mga":"middelirsk","mgh":"makhuwa-meetto","mgo":"Meta'","mh":"marshallese","mi":"maori","mic":"micmac","min":"minangkabau","mis":"diverse sprog","mk":"makedonsk","mkh":"mon-khmer sprog","ml":"malayalam","mn":"mongolsk","mnc":"manchu","mni":"manipuri","mno":"manobo sprog","mo":"moldovisk","moh":"mohawk","mos":"mossi","mr":"marathisk","ms":"malay","mt":"maltesisk","mua":"mundang","mul":"flere sprog","mun":"mundasprog","mus":"creek","mwl":"mirandesisk","mwr":"marwari","my":"burmesisk","mye":"myene","myn":"mayasprog","myv":"erzya","na":"nauru","nah":"nahuatl","nai":"nordamerikansk indiansk sprog","nap":"neapolitansk","naq":"nama","nb":"norsk bokmål","nd":"nordndebele","nds":"nedertysk","ne":"nepalesisk","new":"newari","ng":"ndonga","nia":"nias","nic":"niger-kordofanisk sprog","niu":"niuean","nl":"hollandsk","nl-BE":"flamsk","nmg":"kwasio","nn":"nynorsk","nnh":"ngiemboon","no":"norsk","nog":"nogai","non":"oldislandsk","nqo":"n-ko","nr":"sydndebele","nso":"nordsotho","nub":"nubisk sprog","nus":"nuer","nv":"navajo","nwc":"klassisk newarisk","ny":"nyanja","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro sprog","nzi":"nzima","oc":"occitansk","oj":"ojibwa","om":"oromo","or":"oriya","os":"ossetisk","osa":"osage","ota":"osmannisk-tyrkisk","oto":"otomi sprog","pa":"punjabi","paa":"papua-australsk sprog","pag":"pangasinan","pal":"pahlavi","pam":"pampanga","pap":"papiamento","pau":"palauansk","peo":"oldpersisk","phi":"filippinsk sprog","phn":"fønikisk","pi":"pali","pl":"polsk","pon":"ponape","pra":"prakritsprog","pro":"oldprovencalsk","ps":"pushto","pt":"portugisisk","pt-BR":"brasiliansk portugisisk","pt-PT":"europæisk portugisisk","qu":"quechua","raj":"rajasthani","rap":"rapanui","rar":"rarotongan","rm":"rætoromansk","rn":"rundi","ro":"rumænsk","roa":"romansk sprog","rof":"rombo","rom":"romani","root":"rot","ru":"russisk","rup":"arumænsk","rw":"kinyarwanda","rwk":"rwa","sa":"sanskrit","sad":"sandawe","sah":"yakut","sai":"sydamerikansk indiansk sprog","sal":"salikisk sprog","sam":"samaritansk","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sardinsk","scn":"siciliansk","sco":"skotsk","sd":"sindhi","se":"nordsamisk","see":"seneca","seh":"sena","sel":"selkupisk","sem":"semitisk sprog","ses":"koyraboro senni","sg":"sango","sga":"oldirsk","sgn":"tegnsprog","sh":"serbokroatisk","shi":"tachelhit","shn":"shan","shu":"tchadisk-arabisk","si":"singalesisk","sid":"sidamo","sio":"sioux sprog","sit":"sino-tibetansk sprog","sk":"slovakisk","sl":"slovensk","sla":"slavisk sprog","sm":"samoansk","sma":"sydsamisk","smi":"samisk sprog","smj":"lule sami","smn":"inari sami","sms":"skolt sami","sn":"shona","snk":"soninke","so":"somalisk","sog":"sogdiansk","son":"songhai","sq":"albansk","sr":"serbisk","srn":"sranan tongo","srr":"serer","ss":"swati","ssa":"nilo-saharansk sprog","ssy":"saho","st":"sydsotho","su":"sundanesisk","suk":"sukuma","sus":"susu","sux":"sumerisk","sv":"svensk","sw":"swahili","swb":"shimaore","swc":"congolesisk swahili","syc":"klassisk syrisk","syr":"syrisk","ta":"tamilsk","tai":"thaisprog","te":"telugu","tem":"temne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tajik","th":"thailandsk","ti":"tigrinya","tig":"tigre","tiv":"tivi","tk":"turkmensk","tkl":"tokelau","tl":"tagalog","tlh":"klingon","tli":"tlingit","tmh":"tamashek","tn":"tswana","to":"tongansk","tog":"nyasa tongansk","tpi":"tok pisin","tr":"tyrkisk","trv":"taroko","ts":"tsonga","tsi":"tsimshisk","tt":"tatarisk","tum":"tumbuka","tup":"tupisprog","tut":"altaisk sprog","tvl":"tuvalu","tw":"twi","twq":"tasawaq","ty":"tahitiansk","tyv":"tuvinian","tzm":"centralmarokkansk tamazight","udm":"udmurt","ug":"uygurisk","uga":"ugaristisk","uk":"ukrainsk","umb":"umbundu","und":"ukendt sprog","ur":"urdu","uz":"usbekisk","vai":"vai","ve":"venda","vi":"vietnamesisk","vo":"volapyk","vot":"votisk","vun":"vunjo","wa":"vallonsk","wae":"walsertysk","wak":"wakashansk sprog","wal":"walamo","war":"waray","was":"washo","wen":"vendisk sprog","wo":"wolof","xal":"kalmyk","xh":"xhosa","xog":"soga","yao":"yao","yap":"yapese","yav":"yangben","ybb":"yemba","yi":"jiddisch","yo":"yoruba","ypk":"yupisk sprog","yue":"kantonesisk","za":"zhuang","zap":"zapotec","zbl":"blissymboler","zen":"zenaga","zh":"kinesisk","zh-Hans":"forenklet kinesisk","zh-Hant":"traditionelt kinesisk","znd":"zande","zu":"zulu","zun":"zuni","zxx":"intet sprogligt indhold","zza":"zaza"},"de":{"aa":"Afar","ab":"Abchasisch","ace":"Aceh-Sprache","ach":"Acholi-Sprache","ada":"Adangme","ady":"Adygeisch","ae":"Avestisch","af":"Afrikaans","afa":"Afroasiatisch","afh":"Afrihili","agq":"Aghem","ain":"Ainu-Sprache","ak":"Akan","akk":"Akkadisch","ale":"Aleutisch","alg":"Algonkin-Sprache","alt":"Süd-Altaisch","am":"Amharisch","an":"Aragonesisch","ang":"Altenglisch","anp":"Angika","apa":"Apache-Sprache","ar":"Arabisch","ar-001":"Modern Standard Arabic","arc":"Aramäisch","arn":"Araukanisch","arp":"Arapaho-Sprache","art":"Kunstsprache","arw":"Arawak-Sprache","as":"Assamesisch","asa":"Asu","ast":"Asturianisch","ath":"Athapaskisch","aus":"Australisch","av":"Awarisch","awa":"Awadhi","ay":"Aymara","az":"Aserbaidschanisch","ba":"Baschkirisch","bad":"Banda-Sprache","bai":"Bamileke-Sprache","bal":"Belutschisch","ban":"Balinesisch","bas":"Basaa-Sprache","bat":"Baltisch","bax":"Bamun","bbj":"Ghomala","be":"Weißrussisch","bej":"Bedauye","bem":"Bemba-Sprache","ber":"Berbersprache","bez":"Bena","bfd":"Bafut","bg":"Bulgarisch","bh":"Biharisch","bho":"Bhodschpuri","bi":"Bislama","bik":"Bikol-Sprache","bin":"Bini-Sprache","bkm":"Kom","bla":"Blackfoot-Sprache","bm":"Bambara-Sprache","bn":"Bengalisch","bnt":"Bantusprache","bo":"Tibetisch","br":"Bretonisch","bra":"Braj-Bhakha","brx":"Bodo","bs":"Bosnisch","bss":"Akoose","btk":"Batak","bua":"Burjatisch","bug":"Buginesisch","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Katalanisch","cad":"Caddo","cai":"Zentralamerikanische Indianersprache","car":"Karibisch","cau":"Kaukasisch","cay":"Cayuga","cch":"Atsam","ce":"Tschetschenisch","ceb":"Cebuano","cel":"Keltisch","cgg":"Chiga","ch":"Chamorro-Sprache","chb":"Chibcha-Sprache","chg":"Tschagataisch","chk":"Trukesisch","chm":"Tscheremissisch","chn":"Chinook","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Sorani","cmc":"Cham-Sprache","co":"Korsisch","cop":"Koptisch","cpe":"Kreolisch-Englische Sprache","cpf":"Kreolisch-Französische Sprache","cpp":"Kreolisch-Portugiesische Sprache","cr":"Cree","crh":"Krimtatarisch","crp":"Kreolische Sprache","cs":"Tschechisch","csb":"Kaschubisch","cu":"Kirchenslawisch","cus":"Kuschitisch","cv":"Tschuwaschisch","cy":"Walisisch","da":"Dänisch","dak":"Dakota-Sprache","dar":"Darginisch","dav":"Taita","day":"Dajak","de":"Deutsch","de-AT":"Österreichisches Deutsch","de-CH":"Schweizer Hochdeutsch","del":"Delaware-Sprache","den":"Slave","dgr":"Dogrib","din":"Dinka-Sprache","dje":"Zarma","doi":"Dogri","dra":"Drawidisch","dsb":"Niedersorbisch","dua":"Duala","dum":"Mittelniederländisch","dv":"Maledivisch","dyo":"Jola-Fonyi","dyu":"Dyula-Sprache","dz":"Bhutanisch","dzg":"Dazaga","ebu":"Kiembu","ee":"Ewe-Sprache","efi":"Efik","egy":"Ägyptisch","eka":"Ekajuk","el":"Griechisch","elx":"Elamisch","en":"Englisch","en-AU":"Australisches Englisch","en-CA":"Kanadisches Englisch","en-GB":"Britisches Englisch","en-US":"Amerikanisches Englisch","enm":"Mittelenglisch","eo":"Esperanto","es":"Spanisch","es-419":"Lateinamerikanisches Spanisch","es-ES":"Europäisches Spanisch","et":"Estnisch","eu":"Baskisch","ewo":"Ewondo","fa":"Persisch","fan":"Pangwe-Sprache","fat":"Fanti-Sprache","ff":"Ful","fi":"Finnisch","fil":"Filipino","fiu":"Finnougrisch","fj":"Fidschianisch","fo":"Färöisch","fon":"Fon-Sprache","fr":"Französisch","fr-CA":"Kanadisches Französisch","fr-CH":"Schweizer Französisch","frm":"Mittelfranzösisch","fro":"Altfranzösisch","frr":"Nordfriesisch","frs":"Ostfriesisch","fur":"Friulisch","fy":"Westfriesisch","ga":"Irisch","gaa":"Ga-Sprache","gay":"Gayo","gba":"Gbaya-Sprache","gd":"Schottisches Gälisch","gem":"Germanisch","gez":"Geez","gil":"Gilbertesisch","gl":"Galizisch","gmh":"Mittelhochdeutsch","gn":"Guarani","goh":"Althochdeutsch","gon":"Gondi-Sprache","gor":"Mongondou","got":"Gotisch","grb":"Grebo-Sprache","grc":"Altgriechisch","gsw":"Schweizerdeutsch","gu":"Gujarati","guz":"Gusii","gv":"Manx","gwi":"Kutchin-Sprache","ha":"Hausa","hai":"Haida-Sprache","haw":"Hawaiisch","he":"Hebräisch","hi":"Hindi","hil":"Hiligaynon-Sprache","him":"Himachali","hit":"Hethitisch","hmn":"Miao-Sprache","ho":"Hiri-Motu","hr":"Kroatisch","hsb":"Obersorbisch","ht":"Haitianisch","hu":"Ungarisch","hup":"Hupa","hy":"Armenisch","hz":"Herero-Sprache","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indonesisch","ie":"Interlingue","ig":"Igbo-Sprache","ii":"Sichuan Yi","ijo":"Ijo-Sprache","ik":"Inupiak","ilo":"Ilokano-Sprache","inc":"Indoarisch","ine":"Indogermanisch","inh":"Inguschisch","io":"Ido-Sprache","ira":"Iranische Sprache","iro":"Irokesische Sprache","is":"Isländisch","it":"Italienisch","iu":"Inukitut","ja":"Japanisch","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Jüdisch-Persisch","jrb":"Jüdisch-Arabisch","jv":"Javanisch","ka":"Georgisch","kaa":"Karakalpakisch","kab":"Kabylisch","kac":"Kachin-Sprache","kaj":"Jju","kam":"Kamba","kar":"Karenisch","kaw":"Kawi","kbd":"Kabardinisch","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongolesisch","kha":"Khasi-Sprache","khi":"Khoisan-Sprache","kho":"Sakisch","khq":"Koyra Chiini","ki":"Kikuyu-Sprache","kj":"Kwanyama","kk":"Kasachisch","kkj":"Kako","kl":"Grönländisch","kln":"Kalenjin","km":"Kambodschanisch","kmb":"Kimbundu-Sprache","kn":"Kannada","ko":"Koreanisch","kok":"Konkani","kos":"Kosraeanisch","kpe":"Kpelle-Sprache","kr":"Kanuri-Sprache","krc":"Karatschaiisch-Balkarisch","krl":"Karelisch","kro":"Kru-Sprache","kru":"Oraon-Sprache","ks":"Kaschmirisch","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Kurdisch","kum":"Kumükisch","kut":"Kutenai-Sprache","kv":"Komi-Sprache","kw":"Kornisch","ky":"Kirgisisch","la":"Latein","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba-Sprache","lb":"Luxemburgisch","lez":"Lesgisch","lg":"Ganda-Sprache","li":"Limburgisch","lkt":"Lakota","ln":"Lingala","lo":"Laotisch","lol":"Mongo","loz":"Rotse-Sprache","lt":"Litauisch","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno-Sprache","lun":"Lunda-Sprache","luo":"Luo-Sprache","lus":"Lushai-Sprache","luy":"Olulujia","lv":"Lettisch","mad":"Maduresisch","maf":"Mafa","mag":"Khotta","mai":"Maithili","mak":"Makassarisch","man":"Manding-Sprache","map":"Austronesisch","mas":"Massai-Sprache","mde":"Maba","mdf":"Moksha","mdr":"Mandaresisch","men":"Mende-Sprache","mer":"Meru","mfe":"Morisyen","mg":"Malagassi-Sprache","mga":"Mittelirisch","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marschallesisch","mi":"Maori","mic":"Micmac-Sprache","min":"Minangkabau-Sprache","mis":"Andere Sprache","mk":"Mazedonisch","mkh":"Mon-Khmer-Sprache","ml":"Malayalam","mn":"Mongolisch","mnc":"Mandschurisch","mni":"Meithei-Sprache","mno":"Manobo-Sprache","mo":"Moldauisch","moh":"Mohawk-Sprache","mos":"Mossi-Sprache","mr":"Marathi","ms":"Malaiisch","mt":"Maltesisch","mua":"Mundang","mul":"Mehrsprachig","mun":"Munda-Sprache","mus":"Muskogee-Sprache","mwl":"Mirandesisch","mwr":"Marwari","my":"Birmanisch","mye":"Myene","myn":"Maya-Sprache","myv":"Ersja-Mordwinisch","na":"Nauruisch","nah":"Nahuatl","nai":"Nordamerikanische Indianersprache","nap":"Neapolitanisch","naq":"Nama","nb":"Norwegisch Bokmål","nd":"Nord-Ndebele-Sprache","nds":"Niederdeutsch","ne":"Nepalesisch","new":"Newari","ng":"Ndonga","nia":"Nias-Sprache","nic":"Nigerkordofanisch","niu":"Niue-Sprache","nl":"Niederländisch","nl-BE":"Flämisch","nmg":"Kwasio","nn":"Norwegisch Nynorsk","nnh":"Ngiemboon","no":"Norwegisch","nog":"Nogai","non":"Altnordisch","nqo":"N’Ko","nr":"Süd-Ndebele-Sprache","nso":"Nord-Sotho-Sprache","nub":"Nubisch","nus":"Nuer","nv":"Navajo","nwc":"Alt-Newari","ny":"Nyanja-Sprache","nym":"Nyamwezi-Sprache","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Okzitanisch","oj":"Ojibwa-Sprache","om":"Oromo","or":"Orija","os":"Ossetisch","osa":"Osage-Sprache","ota":"Osmanisch","oto":"Otomangue-Sprache","pa":"Pandschabisch","paa":"Papuasprache","pag":"Pangasinan-Sprache","pal":"Mittelpersisch","pam":"Pampanggan-Sprache","pap":"Papiamento","pau":"Palau","peo":"Altpersisch","phi":"Philippinen-Austronesisch","phn":"Phönikisch","pi":"Pali","pl":"Polnisch","pon":"Ponapeanisch","pra":"Prakrit","pro":"Altprovenzalisch","ps":"Paschtu","pt":"Portugiesisch","pt-BR":"Brasilianisches Portugiesisch","pt-PT":"Europäisches Portugiesisch","qu":"Quechua","raj":"Rajasthani","rap":"Osterinsel-Sprache","rar":"Rarotonganisch","rm":"Rätoromanisch","rn":"Rundi-Sprache","ro":"Rumänisch","roa":"Romanische Sprache","rof":"Rombo","rom":"Romani","root":"Root","ru":"Russisch","rup":"Aromunisch","rw":"Ruandisch","rwk":"Rwa","sa":"Sanskrit","sad":"Sandawe-Sprache","sah":"Jakutisch","sai":"Südamerikanische Indianersprache","sal":"Salish-Sprache","sam":"Samaritanisch","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardisch","scn":"Sizilianisch","sco":"Schottisch","sd":"Sindhi","se":"Nord-Samisch","see":"Seneca","seh":"Sena","sel":"Selkupisch","sem":"Semitisch","ses":"Koyraboro Senni","sg":"Sango","sga":"Altirisch","sgn":"Gebärdensprache","sh":"Serbo-Kroatisch","shi":"Tachelhit","shn":"Schan-Sprache","shu":"Chadian Arabic","si":"Singhalesisch","sid":"Sidamo","sio":"Sioux-Sprache","sit":"Sinotibetisch","sk":"Slowakisch","sl":"Slowenisch","sla":"Slawisch","sm":"Samoanisch","sma":"Süd-Samisch","smi":"Lappisch","smj":"Lule-Lappisch","smn":"Inari-Lappisch","sms":"Skolt-Lappisch","sn":"Shona","snk":"Soninke-Sprache","so":"Somali","sog":"Sogdisch","son":"Songhai-Sprache","sq":"Albanisch","sr":"Serbisch","srn":"Srananisch","srr":"Serer-Sprache","ss":"Swazi","ssa":"Nilosaharanisch","ssy":"Saho","st":"Süd-Sotho-Sprache","su":"Sundanesisch","suk":"Sukuma-Sprache","sus":"Susu","sux":"Sumerisch","sv":"Schwedisch","sw":"Suaheli","swb":"Komorisch","swc":"Congo Swahili","syc":"Altsyrisch","syr":"Syrisch","ta":"Tamilisch","tai":"Tai-Sprache","te":"Telugu","tem":"Temne","teo":"Teso","ter":"Tereno-Sprache","tet":"Tetum-Sprache","tg":"Tadschikisch","th":"Thailändisch","ti":"Tigrinja","tig":"Tigre","tiv":"Tiv-Sprache","tk":"Turkmenisch","tkl":"Tokelauanisch","tl":"Tagalog","tlh":"Klingonisch","tli":"Tlingit-Sprache","tmh":"Tamaseq","tn":"Tswana-Sprache","to":"Tongaisch","tog":"Tsonga-Sprache","tpi":"Neumelanesisch","tr":"Türkisch","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian-Sprache","tt":"Tatarisch","tum":"Tumbuka-Sprache","tup":"Tupi-Sprache","tut":"Altaisch","tvl":"Elliceanisch","tw":"Twi","twq":"Tasawaq","ty":"Tahitisch","tyv":"Tuwinisch","tzm":"Central Atlas Tamazight","udm":"Udmurtisch","ug":"Uigurisch","uga":"Ugaritisch","uk":"Ukrainisch","umb":"Mbundu-Sprache","und":"Unbestimmte Sprache","ur":"Urdu","uz":"Usbekisch","vai":"Vai-Sprache","ve":"Venda-Sprache","vi":"Vietnamesisch","vo":"Volapük","vot":"Wotisch","vun":"Vunjo","wa":"Wallonisch","wae":"Walser","wak":"Wakashanisch","wal":"Walamo-Sprache","war":"Waray","was":"Washo-Sprache","wen":"Sorbisch","wo":"Wolof","xal":"Kalmückisch","xh":"Xhosa","xog":"Soga","yao":"Yao-Sprache","yap":"Yapesisch","yav":"Yangben","ybb":"Yemba","yi":"Jiddisch","yo":"Yoruba","ypk":"Yupik-Sprache","yue":"Kantonesisch","za":"Zhuang","zap":"Zapotekisch","zbl":"Bliss-Symbole","zen":"Zenaga","zh":"Chinesisch","zh-Hans":"Chinesisch (vereinfacht)","zh-Hant":"Chinesisch (traditionell)","znd":"Zande-Sprache","zu":"Zulu","zun":"Zuni-Sprache","zxx":"Keine Sprachinhalte","zza":"Zaza"},"el":{"aa":"Αφάρ","ab":"Αμπχαζικά","ace":"Αχινίζ","ach":"Ακολί","ada":"Αντάνγκμε","ady":"Αντιγκέα","ae":"Αβεστάν","af":"Αφρικάανς","afa":"Αφροασιατική γλώσσα","afh":"Αφριχίλι","agq":"Αγκέμ","ain":"Αϊνού","ak":"Ακάν","akk":"Ακάντιαν","ale":"Αλούτ","alg":"Γλώσσα Αλγκονκιάν","alt":"Νότια Αλαταϊκά","am":"Αμαρικά","an":"Αραγκονικά","ang":"Παλαιά Αγγλικά","anp":"Ανγκικά","apa":"Γλώσσα Απάτσι","ar":"Αραβικά","ar-001":"Modern Standard Arabic","arc":"Αραμαϊκά","arn":"Αρουκάνιαν","arp":"Αράπαχο","art":"Τεχνητή γλώσσα","arw":"Αραγουάκ","as":"Ασαμεζικά","asa":"Άσου","ast":"Αστουριανά","ath":"Γλώσσα Αθαπάσκαν","aus":"Αυστραλιανή γλώσσα","av":"Άβαρικ","awa":"Αγουαντί","ay":"Αϊμάρα","az":"Αζερικά","ba":"Μπασκίρ","bad":"Μπάντα","bai":"Γλώσσα Μπαμιλέκ","bal":"Μπαλούτσι","ban":"Μπαλινίζ","bas":"Μπάσα","bat":"Βαλτική γλώσσα","bax":"Μπαμούν","bbj":"Γκομάλα","be":"Λευκορωσικά","bej":"Μπέζα","bem":"Μπέμπα","ber":"Μπέρμπερ","bez":"Μπένα","bfd":"Μπαφούτ","bg":"Βουλγαρικά","bh":"Μπιχάρι","bho":"Μποζπούρι","bi":"Μπισλάμα","bik":"Μπικόλ","bin":"Μπίνι","bkm":"Κομ","bla":"Σικσίκα","bm":"Μπαμπάρα","bn":"Μπενγκάλι","bnt":"Μπαντού","bo":"Θιβετιανά","br":"Βρετονικά","bra":"Μπρατζ","brx":"Μπόντο","bs":"Βοσνιακά","bss":"Ακόσι","btk":"Μπατάκ","bua":"Μπουριάτ","bug":"Μπουγκίζ","bum":"Μπουλού","byn":"Μπλιν","byv":"Μεντούμπα","ca":"Καταλανικά","cad":"Κάντο","cai":"Ινδιανική γλώσσα Κεντρικής Αμερικής","car":"Καρίμπ","cau":"Καυκάσια γλώσσα","cay":"Καγιούγκα","cch":"Ατσάμ","ce":"Τσέτσνιαν","ceb":"Κεμπουάνο","cel":"Κελτική γλώσσα","cgg":"Τσίγκα","ch":"Καμόρρο","chb":"Τσίμπτσα","chg":"Τσαγκατάι","chk":"Τσουκίζι","chm":"Μάρι","chn":"Ιδιωματικά Σινούκ","cho":"Τσοκτάου","chp":"Τσίπιουαν","chr":"Τσερόκι","chy":"Σεγιέν","ckb":"Κουρδικά Sorani","cmc":"Χαμική γλώσσα","co":"Κορσικανικά","cop":"Κοπτικά","cpe":"Κρεόλ ή Πίντγκιν βάσει Αγγλικών","cpf":"Κρεόλ ή Πίντγκιν βάσει Γαλλικών","cpp":"Κρεόλ και Πίντγκιν βάσει Πορτογαλικών","cr":"Κρι","crh":"Τουρκικά Κριμαίας","crp":"Κρεόλ ή Πίντγκιν","cs":"Τσεχικά","csb":"Κασούμπιαν","cu":"Εκκλησιαστικά Σλαβικά","cus":"Γλώσσα Κουσιτίκ","cv":"Χουβάς","cy":"Ουαλικά","da":"Δανικά","dak":"Ντακότα","dar":"Ντάργκουα","dav":"Τάιτα","day":"Νταγιάκ","de":"Γερμανικά","de-AT":"Γερμανικά Αυστρίας","de-CH":"Γερμανικά Ελβετίας","del":"Ντέλαγουερ","den":"Σλαβικά","dgr":"Ντόγκριμπ","din":"Ντίνκα","dje":"Ζάρμα","doi":"Ντόγκρι","dra":"Γλώσσα Ντραβίδιαν","dsb":"Γλώσσα Κάτω Λουσατίας","dua":"Ντουάλα","dum":"Μέσα Ολλανδικά","dv":"Ντιβέχι","dyo":"Τζόλα-Φόνι","dyu":"Ντογιούλα","dz":"Ντζόνγκχα","dzg":"Νταζάγκα","ebu":"Έμπου","ee":"Γι","efi":"Εφίκ","egy":"Αρχαία Αιγυπτιακά","eka":"Εκατζούκ","el":"Ελληνικά","elx":"Ελαμάιτ","en":"Αγγλικά","en-AU":"Αγγλικά Αυστραλίας","en-CA":"Αγγλικά Καναδά","en-GB":"Αγγλικά Ηνωμένου Βασιλείου","en-US":"Αγγλικά Η.Π.Α.","enm":"Μέσα Αγγλικά","eo":"Εσπεράντο","es":"Ισπανικά","es-419":"Ισπανικά Λατινικής Αμερικής","es-ES":"Ισπανικά Ευρώπης","et":"Εσθονικά","eu":"Βασκικά","ewo":"Εγουόντο","fa":"Περσικά","fan":"Φανγκ","fat":"Φάντι","ff":"Φουλάχ","fi":"Φινλανδικά","fil":"Φιλιππινεζικά","fiu":"Φιννο-Ούγκριαν","fj":"Φίτζι","fo":"Φαρόε","fon":"Φον","fr":"Γαλλικά","fr-CA":"Γαλλικά Καναδά","fr-CH":"Γαλλικά Ελβετίας","frm":"Μέσα Γαλλικά","fro":"Παλαιά Γαλλικά","frr":"Βόρεια Φριζιανά","frs":"Ανατολικά Φριζιανά","fur":"Φριούλιαν","fy":"Δυτικά Φριζιανά","ga":"Ιρλανδικά","gaa":"Γκα","gay":"Γκάγιο","gba":"Γκμπάγια","gd":"Σκωτικά Κελτικά","gem":"Γερμανική γλώσσα","gez":"Γκιζ","gil":"Γκιλμπερτίζ","gl":"Γαλικιανά","gmh":"Μέσα Άνω Γερμανικά","gn":"Γκουαρανί","goh":"Παλαιά Άνω Γερμανικά","gon":"Γκόντι","gor":"Γκοροντάλο","got":"Γοτθικά","grb":"Γκρίμπο","grc":"Αρχαία Ελληνικά","gsw":"Ελβετικά Γερμανικά","gu":"Γκουγιαράτι","guz":"Γκούσι","gv":"Μανξ","gwi":"Γκουίτσιν","ha":"Χάουσα","hai":"Χάιντα","haw":"Χαβανεζικά","he":"Εβραϊκά","hi":"Χίντι","hil":"Χιλιγκαγιόν","him":"Χιματσάλι","hit":"Χιτίτε","hmn":"Χμονγκ","ho":"Χίρι Μότου","hr":"Κροατικά","hsb":"Γλώσσα Άνω Λουσατίας","ht":"Αϊτιανά","hu":"Ουγγρικά","hup":"Χούπα","hy":"Αρμενικά","hz":"Χερέρο","ia":"Ιντερλίνγκουα","iba":"Ιμπάν","ibb":"Ιμπίμπιο","id":"Ινδονησιακά","ie":"Ιντερλίνγκουε","ig":"Ίγκμπο","ii":"Σικουάν Γι","ijo":"Ιζό","ik":"Ινουπιάκ","ilo":"Ιλόκο","inc":"Ινδική γλώσσα","ine":"Ινδοευρωπαϊκή γλώσσα","inh":"Ινγκούς","io":"Ίντο","ira":"Ιρανική γλώσσα","iro":"Γλώσσα Ιροκόιαν","is":"Ισλανδικά","it":"Ιταλικά","iu":"Ινουκτιτούτ","ja":"Ιαπωνικά","jbo":"Λόζμπαν","jgo":"Ngomba","jmc":"Μάχαμε","jpr":"Ιουδαϊκά-Περσικά","jrb":"Ιουδαϊκά-Αραβικά","jv":"Ιαβανεζικά","ka":"Γεωργιανά","kaa":"Κάρα-Καλπάκ","kab":"Καμπίλε","kac":"Κατσίν","kaj":"Τζου","kam":"Κάμπα","kar":"Καρέν","kaw":"Κάουι","kbd":"Καμπαρντιανά","kbl":"Κανέμπου","kcg":"Τουάπ","kde":"Μακόντε","kea":"Γλώσσα του Πράσινου Ακρωτηρίου","kfo":"Κόρο","kg":"Κονγκό","kha":"Κάσι","khi":"Γλώσσα Κοϊσάν","kho":"Κοτανικά","khq":"Κόιρα Τσίνι","ki":"Κικούγιου","kj":"Κουανιγιάμα","kk":"Καζακικά","kkj":"Κάκο","kl":"Καλααλισούτ","kln":"Καλεντζίν","km":"Καμποτζιανά","kmb":"Κιμπούντου","kn":"Κανάντα","ko":"Κορεατικά","kok":"Κονκάνι","kos":"Κοσραενικά","kpe":"Κπέλε","kr":"Κανούρι","krc":"Καρατσάι-Μπαλκάρ","krl":"Καρελιακά","kro":"Κρου","kru":"Κουρούχ","ks":"Κασμίρι","ksb":"Σάμπαλα","ksf":"Μπάφια","ksh":"Κολωνικά","ku":"Κουρδικά","kum":"Κουμγιούκ","kut":"Κουτενάι","kv":"Κόμι","kw":"Κόρνις","ky":"Κυργιζικά","la":"Λατινικά","lad":"Λαδίνο","lag":"Λάνγκι","lah":"Λάχδα","lam":"Λάμπα","lb":"Λουξεμβουργικά","lez":"Λαζγκιάν","lg":"Γκάντα","li":"Λιμβουργιανά","lkt":"Lakota","ln":"Λινγκάλα","lo":"Λαοθιανά","lol":"Μόνγκο","loz":"Λόζι","lt":"Λιθουανικά","lu":"Λούμπα-Κατάνγκα","lua":"Λούμπα-Λουλούα","lui":"Λουισένο","lun":"Λούντα","luo":"Λούο","lus":"Λουσάι","luy":"Λουχία","lv":"Λετονικά","mad":"Μαντουρίζ","maf":"Μάφα","mag":"Μαγκάχι","mai":"Μαϊτχίλι","mak":"Μακαζάρ","man":"Μαντίνγκο","map":"Οστρονέζιαν","mas":"Μασάι","mde":"Μάμπα","mdf":"Μόκσα","mdr":"Μανδάρ","men":"Μέντε","mer":"Μερού","mfe":"Μορίσιεν","mg":"Μαλαγάσι","mga":"Μέσα Ιρλανδικά","mgh":"Μακούβα-Μέτο","mgo":"Meta'","mh":"Μάρσαλ","mi":"Μάορι","mic":"Μικμάκ","min":"Μινανγκαμπάου","mis":"Διάφορες γλώσσες","mk":"Σλαβομακεδονικά","mkh":"Γλώσσα Μον-Χμερ","ml":"Μαλαγιαλάμ","mn":"Μογγολικά","mnc":"Μαντσού","mni":"Μανιπούρι","mno":"Γλώσσα Μανόμπο","mo":"Μολδαβικά","moh":"Μοχόκ","mos":"Μόσι","mr":"Μαράθι","ms":"Μαλάι","mt":"Μαλτεζικά","mua":"Μουντάνγκ","mul":"Πολλαπλές γλώσσες","mun":"Γλώσσα Μούντα","mus":"Κρικ","mwl":"Μιραντεζικά","mwr":"Μαργουάρι","my":"Βιρμανικά","mye":"Μιένε","myn":"Γλώσσα Μάγιαν","myv":"Έρζυα","na":"Ναούρου","nah":"Ναχουάτλ","nai":"Ινδιανική γλώσσα Βόρειας Αμερικής","nap":"Ναπολιτανικά","naq":"Νάμα","nb":"Νορβηγικά Μποκμάλ","nd":"Ντεμπέλε Βορρά","nds":"Κάτω Γερμανικά","ne":"Νεπάλι","new":"Νεγουάρι","ng":"Ντόνγκα","nia":"Νίας","nic":"Γλώσσα Νίγηρα-Κορδοφάνιαν","niu":"Νιούεαν","nl":"Ολλανδικά","nl-BE":"Φλαμανδικά","nmg":"Κβάσιο","nn":"Νορβηγικά Νινόρσκ","nnh":"Νγκιεμπούν","no":"Νορβηγικά","nog":"Νογκάι","non":"Παλαιά Νορβηγικά","nqo":"Ν'Κο","nr":"Ντεμπέλε Νότου","nso":"Βόρεια Σόθο","nub":"Γλώσσα Νούμπιαν","nus":"Νουέρ","nv":"Νάβαχο","nwc":"Κλασικά Νεουάρι","ny":"Νιάντζα","nym":"Νιαμγουέζι","nyn":"Νιανκόλε","nyo":"Νιόρο","nzi":"Νζίμα","oc":"Οκσιτανικά","oj":"Οζιβίγουα","om":"Ορόμο","or":"Ορίγια","os":"Οσετικά","osa":"Οσάζ","ota":"Οθωμανικά Τουρκικά","oto":"Οθωμανική γλώσσα","pa":"Παντζαπικά","paa":"Παπούα","pag":"Πανγκασινάν","pal":"Παχλάβι","pam":"Παμπάνγκα","pap":"Παπιαμέντο","pau":"Παλάουαν","peo":"Αρχαία Περσικά","phi":"Φιλιππινεζική γλώσσα","phn":"Φοινικικά","pi":"Πάλι","pl":"Πολωνικά","pon":"Ποχπέιαν","pra":"Γλώσσα Πράκριτ","pro":"Παλαιά Προβενσιάλ","ps":"Πάστο","pt":"Πορτογαλικά","pt-BR":"Πορτογαλικά Βραζιλίας","pt-PT":"Πορτογαλικά Ευρώπης","qu":"Κετσούα","raj":"Ραζασθάνι","rap":"Ραπανούι","rar":"Ραροτονγκάν","rm":"Ρομανικά","rn":"Ρούντι","ro":"Ρουμανικά","roa":"Ρομανική γλώσσα","rof":"Ρόμπο","rom":"Ρομανί","root":"Ρουτ","ru":"Ρωσικά","rup":"Αρομανικά","rw":"Κινιαρβάντα","rwk":"Ρουά","sa":"Σανσκριτικά","sad":"Σαντάγουε","sah":"Γιακούτ","sai":"Ινδιανική γλώσσα Νότιας Αμερικής","sal":"Γλώσσα Σαλισάν","sam":"Σαμαρίτικα Αραμαϊκά","saq":"Σαμπούρου","sas":"Σασάκ","sat":"Σαντάλι","sba":"Νγκαμπέι","sbp":"Σάνγκου","sc":"Σαρδινικά","scn":"Σικελιανά","sco":"Σκωτικά","sd":"Σίντι","se":"Βόρεια Σάμι","see":"Σένεκα","seh":"Σένα","sel":"Σελκούπ","sem":"Σημητική γλώσσα","ses":"Κοϊραμπόρο Σένι","sg":"Σάνγκο","sga":"Παλαιά Ιρλανδικά","sgn":"Νοηματική γλώσσα","sh":"Σερβοκροατικά","shi":"Τασελχίτ","shn":"Σαν","shu":"Αραβικά του Τσαντ","si":"Σινχαλεζικά","sid":"Σιντάμο","sio":"Γλώσσα Σιουάν","sit":"Σινοθιβετιανή γλώσσα","sk":"Σλοβακικά","sl":"Σλοβενικά","sla":"Σλαβική γλώσσα","sm":"Σαμόαν","sma":"Νότια Σάμι","smi":"Γλώσσα Σάμι","smj":"Λούλε Σάμι","smn":"Ινάρι Σάμι","sms":"Σκολτ Σάμι","sn":"Σχόνα","snk":"Σονίνκε","so":"Σομάλι","sog":"Σογκντιέν","son":"Σονγκχάι","sq":"Αλβανικά","sr":"Σερβικά","srn":"Σρανάρ Τόνγκο","srr":"Σερέρ","ss":"Σουάτι","ssa":"Νιλο-Σαχαριανή γλώσσα","ssy":"Σάχο","st":"Νότια Σόθο","su":"Σουδανικά","suk":"Σουκούμα","sus":"Σούσου","sux":"Σουμερικά","sv":"Σουηδικά","sw":"Σουαχίλι","swb":"Κομόρρια","swc":"Κονγκό Σουαχίλι","syc":"Κλασικά Συριακά","syr":"Συριακά","ta":"Ταμίλ","tai":"Ταϊλανδική γλώσσα","te":"Τελούγκου","tem":"Τίμνε","teo":"Τέσο","ter":"Τερένο","tet":"Τέτουμ","tg":"Τατζίκ","th":"Ταϊλανδικά","ti":"Τιγκρίνυα","tig":"Τίγκρε","tiv":"Τιβ","tk":"Τουρκμενικά","tkl":"Τοκελάου","tl":"Ταγκαλόγκ","tlh":"Κλίνγκον","tli":"Τλίνγκιτ","tmh":"Ταμασέκ","tn":"Τσιγουάνα","to":"Τονγκάν","tog":"Νιάσα Τόνγκα","tpi":"Τοκ Πισίν","tr":"Τουρκικά","trv":"Ταρόκο","ts":"Τσόνγκα","tsi":"Τσίμσιαν","tt":"Τατάρ","tum":"Τουμπούκα","tup":"Γλώσσα Τούπι","tut":"Αλταϊκή γλώσσα","tvl":"Τουβαλού","tw":"Τούι","twq":"Τασαβάκ","ty":"Ταϊτιανά","tyv":"Τουβίνιαν","tzm":"Ταμαζίτ Κεντρικού Μαρόκο","udm":"Ουντμούρτ","ug":"Ουιγκούρ","uga":"Ουγκαρίτικ","uk":"Ουκρανικά","umb":"Ουμπούντου","und":"Άγνωστη γλώσσα","ur":"Ουρντού","uz":"Ουζμπεκικά","vai":"Βάι","ve":"Βένδα","vi":"Βιετναμεζικά","vo":"Βόλαπικ","vot":"Βότικ","vun":"Βούντζο","wa":"Γουαλούν","wae":"Βάλσερ","wak":"Γλώσσα Γουακασάν","wal":"Γουάλαμο","war":"Γουάρει","was":"Γουασό","wen":"Διάλεκτος Άνω Λουσατίας","wo":"Γουόλοφ","xal":"Καλμίκ","xh":"Ζόσα","xog":"Σόγκα","yao":"Γιάο","yap":"Γιαπίζ","yav":"Γιανγκμπέν","ybb":"Γιέμπα","yi":"Γίντις","yo":"Γιορούμπα","ypk":"Γλώσσα Γιούπικ","yue":"Καντονέζικα","za":"Ζουάνγκ","zap":"Ζάποτεκ","zbl":"Σύμβολα Bliss","zen":"Ζενάγκα","zh":"Κινεζικά","zh-Hans":"Απλοποιημένα Κινεζικά","zh-Hant":"Παραδοσιακά Κινεζικά","znd":"Ζάντε","zu":"Ζουλού","zun":"Ζούνι","zxx":"Χωρίς γλωσσολογικό περιεχόμενο","zza":"Ζάζα"},"en":{"aa":"Afar","ab":"Abkhazian","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"Afrikaans","afa":"Afro-Asiatic Language","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"Amharic","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"Arabic","ar-001":"Modern Standard Arabic","arc":"Aramaic","arn":"Mapuche","arp":"Arapaho","art":"Artificial Language","arw":"Arawak","as":"Assamese","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"Aymara","az":"Azeri","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"Belarusian","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"Bulgarian","bh":"Bihari","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengali","bnt":"Bantu","bo":"Tibetan","br":"Breton","bra":"Braj","brx":"Bodo","bs":"Bosnian","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Catalan","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Celtic Language","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Sorani Kurdish","cmc":"Chamic Language","co":"Corsican","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"Czech","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"Welsh","da":"Danish","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"German","de-AT":"Austrian German","de-CH":"Swiss High German","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Ancient Egyptian","eka":"Ekajuk","el":"Greek","elx":"Elamite","en":"English","en-AU":"Australian English","en-CA":"Canadian English","en-GB":"British English","en-US":"U.S. English","enm":"Middle English","eo":"Esperanto","es":"Spanish","es-419":"Latin American Spanish","es-ES":"European Spanish","et":"Estonian","eu":"Basque","ewo":"Ewondo","fa":"Persian","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Finnish","fil":"Filipino","fiu":"Finno-Ugrian Language","fj":"Fijian","fo":"Faroese","fon":"Fon","fr":"French","fr-CA":"Canadian French","fr-CH":"Swiss French","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"Western Frisian","ga":"Irish","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Scottish Gaelic","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"Galician","gmh":"Middle High German","gn":"Guarani","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Ancient Greek","gsw":"Swiss German","gu":"Gujarati","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaiian","he":"Hebrew","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"Croatian","hsb":"Upper Sorbian","ht":"Haitian","hu":"Hungarian","hup":"Hupa","hy":"Armenian","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indonesian","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"Icelandic","it":"Italian","iu":"Inuktitut","ja":"Japanese","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"Javanese","ka":"Georgian","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazakh","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"Kannada","ko":"Korean","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Kashmiri","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Kurdish","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"Kirghiz","la":"Latin","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luxembourgish","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"Lingala","lo":"Lao","lol":"Mongo","loz":"Lozi","lt":"Lithuanian","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"Latvian","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagasy","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maori","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"Macedonian","mkh":"Mon-Khmer Language","ml":"Malayalam","mn":"Mongolian","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Malay","mt":"Maltese","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Burmese","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"Norwegian Bokmål","nd":"North Ndebele","nds":"Low German","ne":"Nepali","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"Dutch","nl-BE":"Flemish","nmg":"Kwasio","nn":"Norwegian Nynorsk","nnh":"Ngiemboon","no":"Norwegian","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"Northern Sotho","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Occitan","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetic","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"Punjabi","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"Polish","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"Pushto","pt":"Portuguese","pt-BR":"Brazilian Portuguese","pt-PT":"European Portuguese","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Romansh","rn":"Rundi","ro":"Romanian","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"Russian","rup":"Aromanian","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sanskrit","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"Sindhi","se":"Northern Sami","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Old Irish","sgn":"Sign Language","sh":"Serbo-Croatian","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"Sinhala","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"Slovak","sl":"Slovenian","sla":"Slavic Language","sm":"Samoan","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somali","sog":"Sogdien","son":"Songhai","sq":"Albanian","sr":"Serbian","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Southern Sotho","su":"Sundanese","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"Swedish","sw":"Swahili","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"Tamil","tai":"Tai Language","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tajik","th":"Thai","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Turkmen","tkl":"Tokelau","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongan","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Turkish","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tatar","tum":"Tumbuka","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahitian","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"Uighur","uga":"Ugaritic","uk":"Ukrainian","umb":"Umbundu","und":"Unknown Language","ur":"Urdu","uz":"Uzbek","vai":"Vai","ve":"Venda","vi":"Vietnamese","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Wolof","xal":"Kalmyk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Yiddish","yo":"Yoruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"Chinese","zh-Hans":"Simplified Chinese","zh-Hant":"Traditional Chinese","znd":"Zande","zu":"Zulu","zun":"Zuni","zxx":"No linguistic content","zza":"Zaza"},"en-GB":{"aa":"Afar","ab":"Abkhazian","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"Afrikaans","afa":"Afro-Asiatic Language","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"Amharic","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"Arabic","ar-001":"Modern Standard Arabic","arc":"Aramaic","arn":"Araucanian","arp":"Arapaho","art":"Artificial Language","arw":"Arawak","as":"Assamese","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"Aymara","az":"Azeri","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamum","bbj":"Ghomala","be":"Belarusian","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"Bulgarian","bh":"Bihari","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengali","bnt":"Bantu","bo":"Tibetan","br":"Breton","bra":"Braj","brx":"Bodo","bs":"Bosnian","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Catalan","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Celtic Language","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Sorani Kurdish","cmc":"Chamic Language","co":"Corsican","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"Czech","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"Welsh","da":"Danish","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"German","de-AT":"Austrian German","de-CH":"Swiss High German","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Ancient Egyptian","eka":"Ekajuk","el":"Greek","elx":"Elamite","en":"English","en-AU":"Australian English","en-CA":"Canadian English","en-GB":"British English","en-US":"US English","enm":"Middle English","eo":"Esperanto","es":"Spanish","es-419":"Latin American Spanish","es-ES":"European Spanish","et":"Estonian","eu":"Basque","ewo":"Ewondo","fa":"Persian","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Finnish","fil":"Filipino","fiu":"Finno-Ugrian Language","fj":"Fijian","fo":"Faroese","fon":"Fon","fr":"French","fr-CA":"Canadian French","fr-CH":"Swiss French","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"Western Frisian","ga":"Irish","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Scottish Gaelic","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"Galician","gmh":"Middle High German","gn":"Guarani","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Ancient Greek","gsw":"Swiss German","gu":"Gujarati","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaiian","he":"Hebrew","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"Croatian","hsb":"Upper Sorbian","ht":"Haitian","hu":"Hungarian","hup":"Hupa","hy":"Armenian","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indonesian","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"Icelandic","it":"Italian","iu":"Inuktitut","ja":"Japanese","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"Javanese","ka":"Georgian","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazakh","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"Kannada","ko":"Korean","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Kashmiri","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Kurdish","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"Kirghiz","la":"Latin","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luxembourgish","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"Lingala","lo":"Lao","lol":"Mongo","loz":"Lozi","lt":"Lithuanian","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"Latvian","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagasy","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maori","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"Macedonian","mkh":"Mon-Khmer Language","ml":"Malayalam","mn":"Mongolian","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Malay","mt":"Maltese","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Burmese","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"Norwegian Bokmål","nd":"North Ndebele","nds":"Low German","ne":"Nepali","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"Dutch","nl-BE":"Flemish","nmg":"Kwasio","nn":"Norwegian Nynorsk","nnh":"Ngiemboon","no":"Norwegian","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"Northern Sotho","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Occitan","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetic","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"Punjabi","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"Polish","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"Pushto","pt":"Portuguese","pt-BR":"Brazilian Portuguese","pt-PT":"European Portuguese","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Romansh","rn":"Rundi","ro":"Romanian","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"Russian","rup":"Aromanian","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sanskrit","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"Sindhi","se":"Northern Sami","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Old Irish","sgn":"Sign Language","sh":"Serbo-Croatian","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"Sinhala","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"Slovak","sl":"Slovenian","sla":"Slavic Language","sm":"Samoan","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somali","sog":"Sogdien","son":"Songhai","sq":"Albanian","sr":"Serbian","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Southern Sotho","su":"Sundanese","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"Swedish","sw":"Swahili","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"Tamil","tai":"Tai Language","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tajik","th":"Thai","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Turkmen","tkl":"Tokelau","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongan","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Turkish","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tatar","tum":"Tumbuka","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahitian","tyv":"Tuvinian","tzm":"Central Morocco Tamazight","udm":"Udmurt","ug":"Uighur","uga":"Ugaritic","uk":"Ukrainian","umb":"Umbundu","und":"Unknown Language","ur":"Urdu","uz":"Uzbek","vai":"Vai","ve":"Venda","vi":"Vietnamese","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Walamo","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Wolof","xal":"Kalmyk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Yiddish","yo":"Yoruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"Chinese","zh-Hans":"Simplified Chinese","zh-Hant":"Traditional Chinese","znd":"Zande","zu":"Zulu","zun":"Zuni","zxx":"No linguistic content","zza":"Zaza"},"es":{"aa":"afar","ab":"abjasio","ace":"acehnés","ach":"acoli","ada":"adangme","ady":"adigeo","ae":"avéstico","af":"afrikaans","afa":"lengua afroasiática","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"akan","akk":"acadio","ale":"aleutiano","alg":"lenguas algonquinas","alt":"altái meridional","am":"amárico","an":"aragonés","ang":"inglés antiguo","anp":"angika","apa":"lenguas apache","ar":"árabe","ar-001":"Modern Standard Arabic","arc":"arameo","arn":"araucano","arp":"arapaho","art":"lengua artificial","arw":"arahuaco","as":"asamés","asa":"asu","ast":"asturiano","ath":"lenguas atabascas","aus":"lenguas australianas","av":"avar","awa":"avadhi","ay":"aimara","az":"azerí","ba":"bashkir","bad":"banda","bai":"lenguas bamileke","bal":"baluchi","ban":"balinés","bas":"basa","bat":"lengua báltica","bax":"bamun","bbj":"ghomala","be":"bielorruso","bej":"beja","bem":"bemba","ber":"bereber","bez":"bena","bfd":"bafut","bg":"búlgaro","bh":"bihari","bho":"bhojpuri","bi":"bislama","bik":"bicol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengalí","bnt":"bantú","bo":"tibetano","br":"bretón","bra":"braj","brx":"bodo","bs":"bosnio","bss":"akoose","btk":"batak","bua":"buriat","bug":"buginés","bum":"bulu","byn":"blin","byv":"medumba","ca":"catalán","cad":"caddo","cai":"lengua india centroamericana","car":"caribe","cau":"lengua caucásica","cay":"cayuga","cch":"atsam","ce":"checheno","ceb":"cebuano","cel":"lengua celta","cgg":"chiga","ch":"chamorro","chb":"chibcha","chg":"chagatái","chk":"trukés","chm":"marí","chn":"jerga chinuk","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"cheyene","ckb":"kurdo central","cmc":"lenguas chámicas","co":"corso","cop":"copto","cpe":"lengua criolla o pidgin basada en el inglés","cpf":"lengua criolla o pidgin basada en el francés","cpp":"lengua criolla o pidgin basada en el portugués","cr":"cree","crh":"tártaro de Crimea","crp":"lengua criolla o pidgin","cs":"checo","csb":"casubio","cu":"eslavo eclesiástico","cus":"lengua cusita","cv":"chuvash","cy":"galés","da":"danés","dak":"dakota","dar":"dargva","dav":"taita","day":"dayak","de":"alemán","de-AT":"alemán austríaco","de-CH":"alto alemán de Suiza","del":"delaware","den":"slave","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"lengua dravídica","dsb":"sorbio inferior","dua":"duala","dum":"neerlandés medieval","dv":"divehi","dyo":"jola-fonyi","dyu":"diula","dz":"dzongkha","dzg":"dazaga","ebu":"embu","ee":"ewe","efi":"efik","egy":"egipcio antiguo","eka":"ekajuk","el":"griego","elx":"elamita","en":"inglés","en-AU":"inglés australiano","en-CA":"inglés canadiense","en-GB":"inglés británico","en-US":"inglés estadounidense","enm":"inglés medieval","eo":"esperanto","es":"español","es-419":"español latinoamericano","es-ES":"español de España","et":"estonio","eu":"vasco","ewo":"ewondo","fa":"persa","fan":"fang","fat":"fanti","ff":"fula","fi":"finés","fil":"filipino","fiu":"lengua finoúgria","fj":"fidjiano","fo":"feroés","fon":"fon","fr":"francés","fr-CA":"francés canadiense","fr-CH":"francés de Suiza","frm":"francés medieval","fro":"francés antiguo","frr":"frisón septentrional","frs":"frisón oriental","fur":"friulano","fy":"frisón occidental","ga":"irlandés","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"gaélico escocés","gem":"lengua germánica","gez":"geez","gil":"gilbertés","gl":"gallego","gmh":"alemán de la alta edad media","gn":"guaraní","goh":"alemán de la alta edad antigua","gon":"gondi","gor":"gorontalo","got":"gótico","grb":"grebo","grc":"griego antiguo","gsw":"alemán suizo","gu":"gujarati","guz":"gusii","gv":"gaélico manés","gwi":"kutchin","ha":"hausa","hai":"haida","haw":"hawaiano","he":"hebreo","hi":"hindi","hil":"hiligaynon","him":"himachali","hit":"hitita","hmn":"hmong","ho":"hiri motu","hr":"croata","hsb":"sorbio superior","ht":"haitiano","hu":"húngaro","hup":"hupa","hy":"armenio","hz":"herero","ia":"interlingua","iba":"iban","ibb":"ibibio","id":"indonesio","ie":"interlingue","ig":"igbo","ii":"sichuan yi","ijo":"ijo","ik":"inupiaq","ilo":"ilocano","inc":"lengua índica","ine":"lengua indoeuropea","inh":"ingush","io":"ido","ira":"lengua irania","iro":"lenguas iroquesas","is":"islandés","it":"italiano","iu":"inuktitut","ja":"japonés","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"judeo-persa","jrb":"judeo-árabe","jv":"javanés","ka":"georgiano","kaa":"karakalpako","kab":"cabila","kac":"kachin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardiano","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"criollo caboverdiano","kfo":"koro","kg":"kongo","kha":"khasi","khi":"lengua joisana","kho":"kotanés","khq":"koyra chiini","ki":"kikuyu","kj":"kuanyama","kk":"kazajo","kkj":"kako","kl":"groenlandés","kln":"kalenyin","km":"jemer","kmb":"kimbundu","kn":"canarés","ko":"coreano","kok":"konkani","kos":"kosraeano","kpe":"kpelle","kr":"kanuri","krc":"karachay-balkar","krl":"carelio","kro":"kru","kru":"kurukh","ks":"cachemiro","ksb":"shambala","ksf":"bafia","ksh":"kölsch","ku":"kurdo","kum":"kumyk","kut":"kutenai","kv":"komi","kw":"córnico","ky":"kirghiz","la":"latín","lad":"ladino","lag":"langi","lah":"lahnda","lam":"lamba","lb":"luxemburgués","lez":"lezgiano","lg":"ganda","li":"limburgués","lkt":"Lakota","ln":"lingala","lo":"laosiano","lol":"mongo","loz":"lozi","lt":"lituano","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseño","lun":"lunda","luo":"luo","lus":"lushai","luy":"luyia","lv":"letón","mad":"madurés","maf":"mafa","mag":"magahi","mai":"maithili","mak":"macasar","man":"mandingo","map":"lengua austronesia","mas":"masai","mde":"maba","mdf":"moksha","mdr":"mandar","men":"mende","mer":"meru","mfe":"criollo mauriciano","mg":"malgache","mga":"irlandés medieval","mgh":"makhuwa-meetto","mgo":"Meta'","mh":"marshalés","mi":"maorí","mic":"micmac","min":"minangkabau","mis":"lenguas varias","mk":"macedonio","mkh":"lengua mon-jemer","ml":"malayalam","mn":"mongol","mnc":"manchú","mni":"manipuri","mno":"lenguas manobo","mo":"moldavo","moh":"mohawk","mos":"mossi","mr":"marathi","ms":"malayo","mt":"maltés","mua":"mundang","mul":"lenguas múltiples","mun":"lenguas munda","mus":"creek","mwl":"mirandés","mwr":"marwari","my":"birmano","mye":"myene","myn":"maya","myv":"erzya","na":"nauruano","nah":"náhuatl","nai":"lengua india norteamericana","nap":"napolitano","naq":"nama","nb":"bokmal noruego","nd":"ndebele septentrional","nds":"bajo alemán","ne":"nepalí","new":"newari","ng":"ndonga","nia":"nias","nic":"lengua níger-cordofana","niu":"niueano","nl":"neerlandés","nl-BE":"flamenco","nmg":"kwasio","nn":"nynorsk noruego","nnh":"ngiemboon","no":"noruego","nog":"nogai","non":"nórdico antiguo","nqo":"n’ko","nr":"ndebele meridional","nso":"sotho septentrional","nub":"lenguas nubias","nus":"nuer","nv":"navajo","nwc":"newari clásico","ny":"nyanja","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzima","oc":"occitano","oj":"ojibwa","om":"oromo","or":"oriya","os":"osético","osa":"osage","ota":"turco otomano","oto":"lenguas otomanas","pa":"punjabí","paa":"lengua papú","pag":"pangasinán","pal":"pahlavi","pam":"pampanga","pap":"papiamento","pau":"palauano","peo":"persa antiguo","phi":"lengua filipina","phn":"fenicio","pi":"pali","pl":"polaco","pon":"pohnpeiano","pra":"lenguas prácritas","pro":"provenzal antiguo","ps":"pastú","pt":"portugués","pt-BR":"portugués de Brasil","pt-PT":"portugués de Portugal","qu":"quechua","raj":"rajasthani","rap":"rapanui","rar":"rarotongano","rm":"retorrománico","rn":"kiroundi","ro":"rumano","roa":"lengua romance","rof":"rombo","rom":"romaní","root":"raíz","ru":"ruso","rup":"arrumano","rw":"kinyarwanda","rwk":"rwa","sa":"sánscrito","sad":"sandawe","sah":"sakha","sai":"lengua india sudamericana","sal":"lenguas salish","sam":"arameo samaritano","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sardo","scn":"siciliano","sco":"escocés","sd":"sindhi","se":"sami septentrional","see":"seneca","seh":"sena","sel":"selkup","sem":"lengua semítica","ses":"koyraboro senni","sg":"sango","sga":"irlandés antiguo","sgn":"lenguajes de signos","sh":"serbocroata","shi":"tashelhit","shn":"shan","shu":"árabe chadiano","si":"cingalés","sid":"sidamo","sio":"lenguas sioux","sit":"lengua sino-tibetana","sk":"eslovaco","sl":"esloveno","sla":"lengua eslava","sm":"samoano","sma":"sami meridional","smi":"lengua sami","smj":"sami lule","smn":"sami inari","sms":"sami skolt","sn":"shona","snk":"soninké","so":"somalí","sog":"sogdiano","son":"songhai","sq":"albanés","sr":"serbio","srn":"sranan tongo","srr":"serer","ss":"siswati","ssa":"lengua nilo-sahariana","ssy":"saho","st":"sesotho meridional","su":"sundanés","suk":"sukuma","sus":"susu","sux":"sumerio","sv":"sueco","sw":"swahili","swb":"comorense","swc":"swahili del Congo","syc":"siríaco clásico","syr":"siriaco","ta":"tamil","tai":"lengua tai","te":"telugu","tem":"temne","teo":"teso","ter":"tereno","tet":"tetún","tg":"tayiko","th":"tailandés","ti":"tigriña","tig":"tigré","tiv":"tiv","tk":"turcomano","tkl":"tokelauano","tl":"tagalo","tlh":"klingon","tli":"tlingit","tmh":"tamashek","tn":"setchwana","to":"tongano","tog":"tonga del Nyasa","tpi":"tok pisin","tr":"turco","trv":"taroko","ts":"tsonga","tsi":"tsimshiano","tt":"tártaro","tum":"tumbuka","tup":"lenguas tupí","tut":"lengua altaica","tvl":"tuvaluano","tw":"twi","twq":"tasawaq","ty":"tahitiano","tyv":"tuviniano","tzm":"tamazight del Marruecos Central","udm":"udmurt","ug":"uygur","uga":"ugarítico","uk":"ucraniano","umb":"umbundu","und":"lengua desconocida","ur":"urdu","uz":"uzbeko","vai":"vai","ve":"venda","vi":"vietnamita","vo":"volapük","vot":"vótico","vun":"kivunyo","wa":"valón","wae":"walser","wak":"lenguas wakasha","wal":"walamo","war":"waray","was":"washo","wen":"lenguas sorbias","wo":"uolof","xal":"kalmyk","xh":"xhosa","xog":"soga","yao":"yao","yap":"yapés","yav":"yangben","ybb":"yemba","yi":"yídish","yo":"yoruba","ypk":"lenguas yupik","yue":"cantonés","za":"zhuang","zap":"zapoteco","zbl":"símbolos Bliss","zen":"zenaga","zh":"chino","zh-Hans":"chino simplificado","zh-Hant":"chino tradicional","znd":"zande","zu":"zulú","zun":"zuni","zxx":"sin contenido lingüístico","zza":"zazaki"},"eu":{"aa":"Afar","ab":"abkhazera","ace":"Achinese","ach":"Acholiera","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"afrikaans","afa":"Afro-Asiatic Language","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akanera","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"amharikera","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"arabiera","ar-001":"Modern Standard Arabic","arc":"Aramaic","arn":"Mapuche","arp":"Arapaho","art":"Artificial Language","arw":"Arawak","as":"assamera","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"aimara","az":"azerbaijanera","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"bielorrusiera","bej":"Beja","bem":"Bembera","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"bulgariera","bh":"Bihariera","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"bengalera","bnt":"Bantu","bo":"tibetera","br":"Bretoiera","bra":"Braj","brx":"Bodo","bs":"bosniera","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"katalana","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Celtic Language","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Txerokiera","chy":"Cheyenne","ckb":"Soraniera","cmc":"Chamic Language","co":"Korsikera","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"txekiera","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"galesera","da":"daniera","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"alemana","de-AT":"Austrian German","de-CH":"aleman garaia (Suitza)","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"divehiera","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Eweera","efi":"efikera","egy":"Ancient Egyptian","eka":"Ekajuk","el":"greziera","elx":"Elamite","en":"ingelesa","en-AU":"Australian English","en-CA":"Canadian English","en-GB":"British English","en-US":"ingelesa (AEB)","enm":"Middle English","eo":"esperantoa","es":"gaztelania","es-419":"espainiera (Latinoamerika)","es-ES":"espainiera (Europa)","et":"estoniera","eu":"euskara","ewo":"Ewondo","fa":"pertsiera","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"finlandiera","fil":"tagalo","fiu":"Finno-Ugrian Language","fj":"fijiera","fo":"faroera","fon":"Fon","fr":"frantsesa","fr-CA":"Canadian French","fr-CH":"Swiss French","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"frisiera","ga":"gaelikoa","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"eskoziako gaelikoa","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"galiziera","gmh":"Middle High German","gn":"guaraniera","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Ancient Greek","gsw":"alemana (Suitza)","gu":"gujaratera","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"hausa","hai":"Haida","haw":"hawaiiera","he":"hebreera","hi":"hindia","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"kroaziera","hsb":"Upper Sorbian","ht":"haitiera","hu":"hungariera","hup":"Hupa","hy":"armeniera","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"indonesiera","ie":"interlingue","ig":"igboera","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"islandiera","it":"italiera","iu":"Inuktitut","ja":"japoniera","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"javera","ka":"georgiera","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kikongoa","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"kazakhera","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"khemerera","kmb":"Kimbundu","kn":"kannada","ko":"koreera","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"kashmirera","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"kurduera","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"kirgizera","la":"latina","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"luxenburgera","lez":"Lezghian","lg":"Gandera","li":"Limburgish","lkt":"Lakota","ln":"lingala","lo":"laosera","lol":"Mongo","loz":"Loziera","lt":"lituaniera","lu":"Luba-Katanga","lua":"Luba-lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"letoniera","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Mauritaniako kreolera","mg":"malgaxea","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"maoriera","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"mazedoniera","mkh":"Mon-Khmer Language","ml":"malayalamera","mn":"mongoliera","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"marathera","ms":"malaysiera","mt":"maltera","mua":"Mundang","mul":"hizkuntza anitzak","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"burmatarra","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"bokmala (Norvegia)","nd":"iparraldeko ndebeleera","nds":"Low German","ne":"nepalera","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"nederlandera","nl-BE":"flandriera","nmg":"Kwasio","nn":"nynorsk norvegiera","nnh":"Ngiemboon","no":"norvegiera","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"pediera","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"nyanja","nym":"Nyamwezi","nyn":"Ankolera","nyo":"Nyoro","nzi":"Nzima","oc":"Okzitaniera","oj":"Ojibwa","om":"Oromoera","or":"oriya","os":"osetiera","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"punjabera","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"poloniera","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"pashtoera","pt":"portugesa","pt-BR":"Brazilian Portuguese","pt-PT":"portugesa (Europa)","qu":"quechuera","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"erromantxera","rn":"rundiera","ro":"errumaniera","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"errusiera","rup":"Aromanian","rw":"kinyaruanda","rwk":"Rwa","sa":"sanskritoa","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"sindhia","se":"iparraldeko samiera","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"sangoera","sga":"Old Irish","sgn":"Sign Language","sh":"serbokroaziera","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"sinhala","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"eslovakiera","sl":"esloveniera","sla":"Slavic Language","sm":"samoera","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"shonera","snk":"Soninke","so":"somaliera","sog":"Sogdien","son":"Songhai","sq":"albaniera","sr":"serbiera","srn":"Sranan Tongo","srr":"Serer","ss":"swatiera","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"hegoaldeko sothoera","su":"sundanera","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"suediera","sw":"swahili","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"tamilera","tai":"Tai Language","te":"telugua","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"tetuma","tg":"tajikistanera","th":"thailandiera","ti":"tigrinya","tig":"Tigre","tiv":"Tiv","tk":"turkmeniera","tkl":"Tokelau","tl":"tagalog","tlh":"Klingonera","tli":"Tlingit","tmh":"Tamashek","tn":"tswanera","to":"tongera","tog":"Nyasa Tonga","tpi":"tok pisina","tr":"turkiera","trv":"Taroko","ts":"tsongera","tsi":"Tsimshian","tt":"tatarera","tum":"Tumbukera","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"twia","twq":"Tasawaq","ty":"tahitiera","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"uyghurera","uga":"Ugaritic","uk":"ukrainera","umb":"Umbundu","und":"hizkuntza ezezaguna","ur":"urdu","uz":"uzbekera","vai":"Vai","ve":"vendera","vi":"vietnamera","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"wolofera","xal":"Kalmyk","xh":"xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Jiddisha","yo":"yorubera","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"txinera","zh-Hans":"txinera (soildua)","zh-Hant":"txinera (tradizionala)","znd":"Zande","zu":"zuluera","zun":"Zuni","zxx":"ez dago eduki linguistikorik","zza":"Zaza"},"fa":{"aa":"آفاری","ab":"آبخازی","ace":"آچئی","ach":"آچولیایی","ada":"آدانگمه‌ای","ady":"آدیجیایی","ae":"اوستایی","af":"آفریکانس","afa":"زبان افریقا و آسیایی","afh":"آفریهیلی","agq":"Aghem","ain":"آینویی","ak":"آکان","akk":"آکدی","ale":"آلئوتی","alg":"زبان آلگونکینی","alt":"آلتایی جنوبی","am":"امهری","an":"آراگونی","ang":"انگلیسی باستان","anp":"آنگیکا","apa":"زبان آپاچیایی","ar":"عربی","ar-001":"Modern Standard Arabic","arc":"آرامی","arn":"آروکانیایی","arp":"آراپاهویی","art":"زبان ساختگی","arw":"آراواکی","as":"آسامی","asa":"Asu","ast":"Asturian","ath":"زبان آتاپاسکایی","aus":"زبان استرالیایی","av":"آواری","awa":"Awadhi","ay":"آیمارایی","az":"آذربایجانی","ba":"باشغیری","bad":"باندایی","bai":"Bamileke Language","bal":"بلوچی","ban":"بالیایی","bas":"باسایی","bat":"زبان بالتیکی","bax":"بمونی","bbj":"Ghomala","be":"بلوروسی","bej":"بجایی","bem":"بمبایی","ber":"بربری","bez":"Bena","bfd":"Bafut","bg":"بلغاری","bh":"بیهاری","bho":"بوجپوری","bi":"بیسلاما","bik":"بیکولی","bin":"بینی","bkm":"Kom","bla":"Siksika","bm":"بامبارایی","bn":"بنگالی","bnt":"بانتویی","bo":"تبتی","br":"برتانیایی","bra":"براج","brx":"Bodo","bs":"بوسنیایی","bss":"Akoose","btk":"باتاکی","bua":"بوریاتی","bug":"بوگیایی","bum":"Bulu","byn":"بلین","byv":"Medumba","ca":"کاتالان","cad":"کادویی","cai":"زبان سرخپوستی امریکای مرکزی","car":"کاریبی","cau":"زبان قفقازی","cay":"Cayuga","cch":"Atsam","ce":"چچنی","ceb":"سبویی","cel":"زبان سلتی","cgg":"Chiga","ch":"چامورویی","chb":"چیبچا","chg":"جغتایی","chk":"چوکی","chm":"ماریایی","chn":"Chinook Jargon","cho":"چوکتویی","chp":"چیپه‌ویه‌ای","chr":"چروکیایی","chy":"شایانی","ckb":"کردی سورانی","cmc":"Chamic Language","co":"کورسی","cop":"قبطی","cpe":"کریول یا پیجین مبتنی بر انگلیسی","cpf":"کریول یا پیجین مبتنی بر فرانسوی","cpp":"کریول یا پیجین مبتنی بر پرتغالی","cr":"کریایی","crh":"ترکی کریمه","crp":"کریول یا پیجین","cs":"چکی","csb":"کاشوبی","cu":"اسلاوی کلیسایی","cus":"زبان کوشی","cv":"چوواشی","cy":"ویلزی","da":"دانمارکی","dak":"داکوتایی","dar":"دارقینی","dav":"Taita","day":"دایاک","de":"آلمانی","de-AT":"آلمانی اتریش","de-CH":"آلمانی علیای سوئیس","del":"دلاواری","den":"Slave","dgr":"دوگریب","din":"دینکایی","dje":"Zarma","doi":"دوگری","dra":"زبان دراویدی","dsb":"صُربی سفلی","dua":"دوآلایی","dum":"هلندی میانه","dv":"مالدیوی","dyo":"Jola-Fonyi","dyu":"دایولایی","dz":"جونخایی","dzg":"Dazaga","ebu":"Embu","ee":"اوه‌ای","efi":"افیکی","egy":"مصری کهن","eka":"اکاجوک","el":"یونانی","elx":"عیلامی","en":"انگلیسی","en-AU":"انگلیسی استرالیا","en-CA":"انگلیسی کانادا","en-GB":"انگلیسی بریتانیا","en-US":"انگلیسی امریکا","enm":"انگلیسی میانه","eo":"اسپرانتو","es":"اسپانیایی","es-419":"اسپانیایی امریکای لاتین","es-ES":"اسپانیایی اروپا","et":"استونیایی","eu":"باسکی","ewo":"اواندو","fa":"فارسی","fan":"فانکی","fat":"فانتیایی","ff":"فولایی","fi":"فنلاندی","fil":"فیلیپینی","fiu":"زبان فین و اوگرایی","fj":"فیجیایی","fo":"فارویی","fon":"فونی","fr":"فرانسوی","fr-CA":"فرانسوی کانادا","fr-CH":"فرانسوی سوئیس","frm":"فرانسوی میانه","fro":"فرانسوی باستان","frr":"فریزی شمالی","frs":"فریزی شرقی","fur":"فریولیایی","fy":"فریزی غربی","ga":"ایرلندی","gaa":"گایی","gay":"گایویی","gba":"گبایایی","gd":"گیلی اسکاتلندی","gem":"زبان ژرمنی","gez":"گی‌ئزی","gil":"گیلبرتی","gl":"گالیسیایی","gmh":"آلمانی علیای میانه","gn":"گوارانی","goh":"آلمانی علیای باستان","gon":"گوندی","gor":"گورونتالو","got":"گوتی","grb":"گریبویی","grc":"یونانی کهن","gsw":"آلمانی سوئیسی","gu":"گجراتی","guz":"Gusii","gv":"مانی","gwi":"گویچ این","ha":"هوسیایی","hai":"هایدایی","haw":"هاوائیایی","he":"عبری","hi":"هندی","hil":"هیلی‌گاینونی","him":"هیماچالی","hit":"هیتی","hmn":"همونگ","ho":"موتویی هیری","hr":"کروات","hsb":"صُربی علیا","ht":"هائیتیایی","hu":"مجاری","hup":"هوپا","hy":"ارمنی","hz":"هریرویی","ia":"میان‌زبان","iba":"آیبن","ibb":"Ibibio","id":"اندونزیایی","ie":"اکسیدنتال","ig":"ایگبویی","ii":"یی سیچوان","ijo":"ایجویی","ik":"اینوپیک","ilo":"ایلوکویی","inc":"زبان هندیک","ine":"زبان هند و اروپایی","inh":"اینگوشی","io":"ایدو","ira":"زبان ایرانی","iro":"زبان ایروکوایی","is":"ایسلندی","it":"ایتالیایی","iu":"اینوکتیتوت","ja":"ژاپنی","jbo":"لوجبان","jgo":"Ngomba","jmc":"Machame","jpr":"فارسی یهودی","jrb":"عربی یهودی","jv":"جاوه‌ای","ka":"گرجی","kaa":"قره‌قالپاقی","kab":"قبایلی","kac":"کاچینی","kaj":"جو","kam":"کامبایی","kar":"کارنی","kaw":"کاویایی","kbd":"کاباردینی","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"کورو","kg":"کنگویی","kha":"خاسیایی","khi":"زبان خواسی","kho":"ختنی","khq":"Koyra Chiini","ki":"کیکویویی","kj":"کوانیاما","kk":"قزاقی","kkj":"Kako","kl":"گرینلندی","kln":"Kalenjin","km":"خمری","kmb":"کیمبوندویی","kn":"کاناده‌ای","ko":"کره‌ای","kok":"کنکانی","kos":"Kosraean","kpe":"کپله‌ای","kr":"کانوریایی","krc":"قره‌چایی‐بالکاری","krl":"Karelian","kro":"کرویی","kru":"کوروخی","ks":"کشمیری","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"کردی","kum":"کومیکی","kut":"کوتنی","kv":"کومیایی","kw":"کرنوالی","ky":"قرقیزی","la":"لاتینی","lad":"لادینو","lag":"Langi","lah":"لاهندا","lam":"لامبا","lb":"لوگزامبورگی","lez":"لزگی","lg":"گاندایی","li":"لیمبورگی","lkt":"Lakota","ln":"لینگالا","lo":"لائوسی","lol":"مونگویی","loz":"لوزیایی","lt":"لیتوانیایی","lu":"لوبایی‐کاتانگا","lua":"لوبایی‐لولوا","lui":"لویسنو","lun":"لوندایی","luo":"لوئویی","lus":"لوشه‌ای","luy":"Luyia","lv":"لتونیایی","mad":"مادورایی","maf":"Mafa","mag":"ماگاهیایی","mai":"مایدیلی","mak":"ماکاسار","man":"ماندینگویی","map":"زبان آسترونیزیایی","mas":"ماسایی","mde":"Maba","mdf":"مکشایی","mdr":"ماندار","men":"منده‌ای","mer":"Meru","mfe":"موریسین","mg":"مالاگاسیایی","mga":"ایرلندی میانه","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"مارشالی","mi":"مائوریایی","mic":"میکماکی","min":"مینانگ‌کابویی","mis":"زبان متفرقه","mk":"مقدونی","mkh":"زبان مون‌خمری","ml":"مالایالامی","mn":"مغولی","mnc":"مانچویی","mni":"میته‌ای","mno":"زبان مانوبو","mo":"مولداویایی","moh":"موهاکی","mos":"ماسیایی","mr":"مراتی","ms":"مالایی","mt":"مالتی","mua":"Mundang","mul":"چندین زبان","mun":"زبان موندایی","mus":"کریکی","mwl":"Mirandese","mwr":"مارواری","my":"برمه‌ای","mye":"Myene","myn":"زبان مایایی","myv":"ارزیایی","na":"نائورویی","nah":"ناواتلی","nai":"زبان سرخپوستی امریکای شمالی","nap":"ناپلی","naq":"Nama","nb":"بوکسمال نروژی","nd":"انده‌بله‌ای شمالی","nds":"آلمانی سفلی","ne":"نپالی","new":"نواریایی","ng":"اندونگایی","nia":"نیاسی","nic":"Niger-Kordofanian Language","niu":"نیویی","nl":"هلندی","nl-BE":"فلمنگی","nmg":"Kwasio","nn":"نرس جدید نروژی","nnh":"Ngiemboon","no":"نروژی","nog":"نغایی","non":"نرس باستان","nqo":"N’Ko","nr":"انده‌بله‌ای جنوبی","nso":"سوتویی شمالی","nub":"زبان نوبیایی","nus":"Nuer","nv":"ناواهویی","nwc":"نواریایی کلاسیک","ny":"نیانجایی","nym":"نیام‌وزیایی","nyn":"نیانکوله‌ای","nyo":"نیورویی","nzi":"نزیمایی","oc":"اوکیتایی","oj":"اوجیبوایی","om":"اورومویی","or":"اوریه‌ای","os":"آسی","osa":"اوسیجی","ota":"ترکی عثمانی","oto":"زبان اتومیایی","pa":"پنجابی","paa":"زبان پاپوایی","pag":"پانگاسینانی","pal":"پهلوی","pam":"پامپانگایی","pap":"پاپیامنتو","pau":"پالائویی","peo":"فارسی باستان","phi":"زبان فیلیپینی","phn":"فنیقی","pi":"پالی","pl":"لهستانی","pon":"پانپیی","pra":"زبان پراکریتی","pro":"پرووانسی باستان","ps":"پختو","pt":"پرتغالی","pt-BR":"پرتغالی برزیل","pt-PT":"پرتغالی اروپا","qu":"کچوایی","raj":"راجستانی","rap":"راپانویی","rar":"راروتونگایی","rm":"رومانش","rn":"روندیایی","ro":"رومانیایی","roa":"زبان رومیایی","rof":"Rombo","rom":"رومانویی","root":"ریشه","ru":"روسی","rup":"Aromanian","rw":"کینیارواندایی","rwk":"Rwa","sa":"سنسکریت","sad":"سانداوه‌ای","sah":"یاقوتی","sai":"زبان سرخپوستی امریکای جنوبی","sal":"زبان سالیشی","sam":"آرامی سامری","saq":"Samburu","sas":"ساساکی","sat":"سانتالی","sba":"Ngambay","sbp":"Sangu","sc":"ساردینیایی","scn":"سیسیلی","sco":"اسکاتلندی","sd":"سندی","se":"سامی شمالی","see":"Seneca","seh":"Sena","sel":"سلکوپی","sem":"زبان سامی","ses":"Koyraboro Senni","sg":"سانگویی","sga":"ایرلندی باستان","sgn":"زبان اشاره","sh":"صرب و کرواتی","shi":"Tachelhit","shn":"شانی","shu":"عربی چادی","si":"سینهالی","sid":"سیدامویی","sio":"زبان سویی","sit":"زبان چین و تبتی","sk":"اسلواکی","sl":"اسلووینیایی","sla":"زبان اسلاوی","sm":"ساموآیی","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"شونایی","snk":"سونینکه‌ای","so":"سومالیایی","sog":"سغدی","son":"سونغایی","sq":"آلبانیایی","sr":"صربی","srn":"تاکی‌تاکی","srr":"سریری","ss":"سوازیایی","ssa":"زبان نیلی و صحرایی","ssy":"Saho","st":"سوتویی جنوبی","su":"سوندایی","suk":"سوکومایی","sus":"سوسویی","sux":"سومری","sv":"سوئدی","sw":"سواحلی","swb":"کوموری","swc":"سواحلی کنگویی","syc":"سریانی کلاسیک","syr":"سریانی","ta":"تامیلی","tai":"زبان تایی","te":"تلوگویی","tem":"تمنه‌ای","teo":"Teso","ter":"ترنو","tet":"تتومی","tg":"تاجیکی","th":"تایلندی","ti":"تیگرینیایی","tig":"تیگره‌ای","tiv":"تیوی","tk":"ترکمنی","tkl":"Tokelau","tl":"تاگالوگی","tlh":"کلینگون","tli":"تلین‌گیتی","tmh":"تاماشقی","tn":"تسوانایی","to":"تونگایی","tog":"تونگایی نیاسا","tpi":"توک‌پیسینی","tr":"ترکی","trv":"Taroko","ts":"تسونگایی","tsi":"تسیم‌شیانی","tt":"تاتاری","tum":"تومبوکایی","tup":"زبان توپیایی","tut":"زبان آلتاییک","tvl":"تووالویی","tw":"توی‌یایی","twq":"Tasawaq","ty":"تاهیتیایی","tyv":"تووایی","tzm":"Central Atlas Tamazight","udm":"اودمورتی","ug":"اویغوری","uga":"اوگاریتی","uk":"اوکراینی","umb":"امبوندویی","und":"زبان نامشخص","ur":"اردو","uz":"ازبکی","vai":"ویایی","ve":"وندایی","vi":"ویتنامی","vo":"ولاپوک","vot":"وتی","vun":"Vunjo","wa":"والونی","wae":"Walser","wak":"زبان واکاشی","wal":"والامو","war":"وارایی","was":"واشویی","wen":"زبان صُربی","wo":"ولوفی","xal":"قلموقی","xh":"خوسایی","xog":"Soga","yao":"یائویی","yap":"یاپی","yav":"Yangben","ybb":"Yemba","yi":"یدی","yo":"یوروبایی","ypk":"زبان یوپیکی","yue":"کانتونیز","za":"چوانگی","zap":"زاپوتکی","zbl":"Blissymbols","zen":"زناگا","zh":"چینی","zh-Hans":"چینی ساده‌شده","zh-Hant":"چینی سنتی","znd":"زانده‌ای","zu":"زولویی","zun":"زونیایی","zxx":"بدون محتوای زبانی","zza":"زازایی"},"fi":{"aa":"afar","ab":"abhaasi","ace":"atšeh","ach":"atšoli","ada":"adangme","ady":"adyge","ae":"avesta","af":"afrikaans","afa":"afroaasialainen kieli","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"akan","akk":"akkadi","ale":"aleutti","alg":"algonkikieli","alt":"altai","am":"amhara","an":"aragonia","ang":"muinaisenglanti","anp":"angika","apa":"apaššikieli","ar":"arabia","ar-001":"Modern Standard Arabic","arc":"valtakunnanaramea","arn":"mapudungun","arp":"arapaho","art":"keinotekoinen kieli","arw":"arawak","as":"assami","asa":"asu","ast":"asturia","ath":"athabascakieli","aus":"australialainen kieli","av":"avaari","awa":"awadhi","ay":"aimara","az":"azeri","ba":"baškiiri","bad":"banda","bai":"bamilekekieli","bal":"belutši","ban":"bali","bas":"basaa","bat":"balttilainen kieli","bax":"bamum","bbj":"ghomala","be":"valkovenäjä","bej":"bedža","bem":"bemba","ber":"berberikieli","bez":"bena","bfd":"fut","bg":"bulgaria","bh":"bihari","bho":"bhodžpuri","bi":"bislama","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengali","bnt":"bantukieli","bo":"tiibet","br":"bretoni","bra":"bradž","brx":"bodo","bs":"bosnia","bss":"koose","btk":"batakkieli","bua":"burjaatti","bug":"bugi","bum":"bulu","byn":"bilin","byv":"medumba","ca":"katalaani","cad":"caddo","cai":"keskiamerikkalainen intiaanikieli","car":"karibi","cau":"kaukasialainen kieli","cay":"cayuga","cch":"atsam","ce":"tšetšeeni","ceb":"cebuano","cel":"kelttiläinen kieli","cgg":"kiga","ch":"tšamorro","chb":"tšibtša","chg":"tšagatai","chk":"chuuk","chm":"mari","chn":"chinook-jargon","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"cheyenne","ckb":"sorani","cmc":"tšamkieli","co":"korsika","cop":"kopti","cpe":"englantiin perustuva kreoli- tai pidgin-kieli","cpf":"ranskaan perustuva kreoli- tai pidgin-kieli","cpp":"portugaliin perustuva kreoli- tai pidgin-kieli","cr":"cree","crh":"kriminturkki","crp":"kreoli- tai pidgin-kieli","cs":"tšekki","csb":"kašubi","cu":"kirkkoslaavi","cus":"kuušilainen kieli","cv":"tšuvassi","cy":"kymri","da":"tanska","dak":"dakota","dar":"dargi","dav":"taita","day":"land-dajakki-kieli","de":"saksa","de-AT":"itävallansaksa","de-CH":"sveitsinyläsaksa","del":"delaware","den":"slevi","dgr":"dogrib","din":"dinka","dje":"djerma","doi":"dogri","dra":"dravidakieli","dsb":"alasorbi","dua":"duala","dum":"keskihollanti","dv":"divehi","dyo":"jola-fonyi","dyu":"djula","dz":"dzongkha","dzg":"dazaga","ebu":"embu","ee":"ewe","efi":"efik","egy":"muinaisegypti","eka":"ekajuk","el":"kreikka","elx":"elami","en":"englanti","en-AU":"australianenglanti","en-CA":"kanadanenglanti","en-GB":"britannianenglanti","en-US":"amerikanenglanti","enm":"keskienglanti","eo":"esperanto","es":"espanja","es-419":"amerikanespanja","es-ES":"espanjanespanja","et":"viro","eu":"baski","ewo":"ewondo","fa":"persia","fan":"fang","fat":"fanti","ff":"fulani","fi":"suomi","fil":"filipino","fiu":"suomalais-ugrilainen kieli","fj":"fidži","fo":"fääri","fon":"fon","fr":"ranska","fr-CA":"kanadanranska","fr-CH":"sveitsinranska","frm":"keskiranska","fro":"muinaisranska","frr":"pohjoisfriisi","frs":"itäfriisi","fur":"friuli","fy":"länsifriisi","ga":"iiri","gaa":"ga","gay":"gajo","gba":"gbaja","gd":"gaeli","gem":"germaaninen kieli","gez":"ge’ez","gil":"kiribati","gl":"galicia","gmh":"keskiyläsaksa","gn":"guarani","goh":"muinaisyläsaksa","gon":"gondi","gor":"gorontalo","got":"gootti","grb":"grebo","grc":"muinaiskreikka","gsw":"sveitsinsaksa","gu":"gudžarati","guz":"gusii","gv":"manksi","gwi":"gwitšin","ha":"hausa","hai":"haida","haw":"havaiji","he":"heprea","hi":"hindi","hil":"hiligaino","him":"himatšali","hit":"heetti","hmn":"hmong","ho":"hiri-motu","hr":"kroatia","hsb":"yläsorbi","ht":"haiti","hu":"unkari","hup":"hupa","hy":"armenia","hz":"herero","ia":"interlingua","iba":"iban","ibb":"ibibio","id":"indonesia","ie":"interlingue","ig":"igbo","ii":"sichuanin-yi","ijo":"idžokieli","ik":"inupiaq","ilo":"iloko","inc":"indoarjalainen kieli","ine":"indoeurooppalainen kieli","inh":"inguuši","io":"ido","ira":"iranilainen kieli","iro":"irokeesikieli","is":"islanti","it":"italia","iu":"inuktitut","ja":"japani","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"juutalaispersia","jrb":"juutalaisarabia","jv":"jaava","ka":"georgia","kaa":"karakalpakki","kab":"kabyyli","kac":"katšin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kavi","kbd":"kabardi","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"kapverdenkreoli","kfo":"norsunluurannikonkoro","kg":"kongo","kha":"khasi","khi":"khoisankieli","kho":"khotani","khq":"koyra chiini","ki":"kikuju","kj":"kuanjama","kk":"kazakki","kkj":"kako","kl":"grönlanti","kln":"kalenjin","km":"keskikhmer","kmb":"kimbundu","kn":"kannada","ko":"korea","kok":"konkani","kos":"kosrae","kpe":"kpelle","kr":"kanuri","krc":"karatšai-balkaari","krl":"karjala","kro":"kru-kieli","kru":"kurukh","ks":"kašmiri","ksb":"shambala","ksf":"bafia","ksh":"kölsch","ku":"kurdi","kum":"kumykki","kut":"kutenai","kv":"komi","kw":"korni","ky":"kirgiisi","la":"latina","lad":"juutalaisespanja","lag":"lango","lah":"lahnda","lam":"lamba","lb":"luxemburg","lez":"lezgi","lg":"ganda","li":"limburg","lkt":"Lakota","ln":"lingala","lo":"lao","lol":"mongo","loz":"lozi","lt":"liettua","lu":"katanganluba","lua":"luluanluba","lui":"luiseño","lun":"lunda","luo":"luo","lus":"lusai","luy":"luhya","lv":"latvia","mad":"madura","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makassar","man":"mandingo","map":"austronesialainen kieli","mas":"maasai","mde":"maba","mdf":"mokša","mdr":"mandar","men":"mende","mer":"meru","mfe":"morisyen","mg":"malagassi","mga":"keski-iiri","mgh":"makua-meetto","mgo":"Meta'","mh":"marshall","mi":"maori","mic":"micmac","min":"minangkabau","mis":"luokittelematon kieli","mk":"makedonia","mkh":"mon-khmer-kieli","ml":"malajalam","mn":"mongoli","mnc":"mantšu","mni":"manipuri","mno":"manobokieli","mo":"moldova","moh":"mohawk","mos":"mossi","mr":"marathi","ms":"malaiji","mt":"malta","mua":"mundang","mul":"monia kieliä","mun":"mundakieli","mus":"creek","mwl":"mirandeesi","mwr":"marwari","my":"burma","mye":"myene","myn":"mayakieli","myv":"ersä","na":"nauru","nah":"nahuatlkieli","nai":"pohjoisamerikkalainen intiaanikieli","nap":"napoli","naq":"nama","nb":"norjan bokmål","nd":"pohjois-ndebele","nds":"alasaksa","ne":"nepali","new":"newari","ng":"ndonga","nia":"nias","nic":"nigeriläis-kongolainen kieli","niu":"niue","nl":"hollanti","nl-BE":"flaami","nmg":"kwasio","nn":"norjan nynorsk","nnh":"ngiemboon","no":"norja","nog":"nogai","non":"muinaisnorja","nqo":"n’ko","nr":"etelä-ndebele","nso":"pohjoissotho","nub":"nubialainen kieli","nus":"nuer","nv":"navajo","nwc":"klassinen newari","ny":"njandža","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzima","oc":"oksitaani","oj":"odžibwa","om":"oromo","or":"orija","os":"osseetti","osa":"osage","ota":"osmani","oto":"otomikieli","pa":"pandžabi","paa":"papualaiskieli","pag":"pangasinan","pal":"pahlavi","pam":"pampanga","pap":"papiamentu","pau":"palau","peo":"muinaispersia","phi":"filippiiniläiskieli","phn":"foinikia","pi":"paali","pl":"puola","pon":"pohnpei","pra":"prakritkieli","pro":"muinaisprovensaali","ps":"paštu","pt":"portugali","pt-BR":"brasilianportugali","pt-PT":"portugalinportugali","qu":"ketšua","raj":"radžastani","rap":"rapanui","rar":"rarotonga","rm":"retoromaani","rn":"rundi","ro":"romania","roa":"romaaninen kieli","rof":"rombo","rom":"romani","root":"juuri","ru":"venäjä","rup":"aromania","rw":"ruanda","rwk":"rwa","sa":"sanskrit","sad":"sandawe","sah":"jakuutti","sai":"eteläamerikkalainen intiaanikieli","sal":"sališilainen kieli","sam":"samarianaramea","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sardi","scn":"sisilia","sco":"skotti","sd":"sindhi","se":"pohjoissaame","see":"seneca","seh":"sena","sel":"selkuppi","sem":"seemiläinen kieli","ses":"koyraboro senni","sg":"sango","sga":"muinaisiiri","sgn":"viittomakieli","sh":"serbokroaatti","shi":"tašelhit","shn":"shan","shu":"tšadinarabia","si":"sinhala","sid":"sidamo","sio":"siouxkieli","sit":"sinotiibetiläinen kieli","sk":"slovakki","sl":"sloveeni","sla":"slaavilainen kieli","sm":"samoa","sma":"eteläsaame","smi":"saamelaiskieli","smj":"luulajansaame","smn":"inarinsaame","sms":"koltansaame","sn":"šona","snk":"soninke","so":"somali","sog":"sogdi","son":"songhaikieli","sq":"albania","sr":"serbia","srn":"sranan","srr":"serer","ss":"swazi","ssa":"niililäis-saharalainen kieli","ssy":"saho","st":"eteläsotho","su":"sunda","suk":"sukuma","sus":"susu","sux":"sumeri","sv":"ruotsi","sw":"swahili","swb":"komori","swc":"kingwana","syc":"muinaissyyria","syr":"syyria","ta":"tamili","tai":"thaikieli","te":"telugu","tem":"temne","teo":"ateso","ter":"tereno","tet":"tetum","tg":"tadžikki","th":"thai","ti":"tigrinja","tig":"tigre","tiv":"tiv","tk":"turkmeeni","tkl":"tokelau","tl":"tagalog","tlh":"klingon","tli":"tlingit","tmh":"tamašek","tn":"tswana","to":"tonga","tog":"malawintonga","tpi":"tok-pisin","tr":"turkki","trv":"taroko","ts":"tsonga","tsi":"tsimši","tt":"tataari","tum":"tumbuka","tup":"tupikieli","tut":"altailainen kieli","tvl":"tuvalu","tw":"twi","twq":"tasawaq","ty":"tahiti","tyv":"tuva","tzm":"tamazight","udm":"udmurtti","ug":"uiguuri","uga":"ugarit","uk":"ukraina","umb":"mbundu","und":"määrittämätön kieli","ur":"urdu","uz":"uzbekki","vai":"vai","ve":"venda","vi":"vietnam","vo":"volapük","vot":"vatja","vun":"vunjo","wa":"valloni","wae":"walser","wak":"wakashkieli","wal":"wolaitta","war":"waray","was":"washo","wen":"sorbikieli","wo":"wolof","xal":"kalmukki","xh":"xhosa","xog":"soga","yao":"jao","yap":"japi","yav":"yangben","ybb":"yemba","yi":"jiddiš","yo":"joruba","ypk":"jupikkikieli","yue":"kantoninkiina","za":"zhuang","zap":"zapoteekki","zbl":"blisskieli","zen":"zenaga","zh":"kiina","zh-Hans":"yksinkertaistettu kiina","zh-Hant":"perinteinen kiina","znd":"zandekieli","zu":"zulu","zun":"zuni","zxx":"ei kielellistä sisältöä","zza":"zaza"},"fil":{"aa":"Afar","ab":"Abkhazian","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"Afrikaans","afa":"Afro-Asiatic Language","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"Amharic","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"Arabic","ar-001":"Modern Standard Arabic","arc":"Aramaic","arn":"Mapuche","arp":"Arapaho","art":"Artificial Language","arw":"Arawak","as":"Assamese","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"Aymara","az":"Azeri","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"Belarusian","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"Bulgarian","bh":"Bihari","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengali","bnt":"Bantu","bo":"Tibetan","br":"Breton","bra":"Braj","brx":"Bodo","bs":"Bosnian","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Catalan","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Celtic Language","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Sorani Kurdish","cmc":"Chamic Language","co":"Corsican","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"Czech","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"Welsh","da":"Danish","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"German","de-AT":"Austrian German","de-CH":"Swiss High German","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Ancient Egyptian","eka":"Ekajuk","el":"Griyego","elx":"Elamite","en":"Ingles","en-AU":"Ingles sa Australia","en-CA":"Ingles sa Canada","en-GB":"Ingles (UK)","en-US":"Ingles sa U.S.","enm":"Middle English","eo":"Esperanto","es":"Espanyol","es-419":"Espanyol sa Latin America","es-ES":"European Spanish","et":"Estonian","eu":"Basque","ewo":"Ewondo","fa":"Persian","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Finnish","fil":"Filipino","fiu":"Finno-Ugrian Language","fj":"Fijian","fo":"Faroeso","fon":"Fon","fr":"Pranses","fr-CA":"Canadian French","fr-CH":"Swiss French","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"Western Frisian","ga":"Irish","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Scots Gaelic","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"Galician","gmh":"Middle High German","gn":"Guarani","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Ancient Greek","gsw":"Swiss German","gu":"Gujarati","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaiian","he":"Hebreo","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"Croatian","hsb":"Upper Sorbian","ht":"Haitian","hu":"Hungarian","hup":"Hupa","hy":"Armenian","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indonesian","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"Icelandic","it":"Italyano","iu":"Inuktitut","ja":"Japanese","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"Javanese","ka":"Georgian","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazakh","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"Kannada","ko":"Korean","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Kashmiri","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Kurdish","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"Kirghiz","la":"Latin","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luxembourgish","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"Lingala","lo":"Lao","lol":"Mongo","loz":"Lozi","lt":"Lithuanian","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"Latvian","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagasy","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maori","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"Macedonian","mkh":"Mon-Khmer Language","ml":"Malayalam","mn":"Mongolian","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Malay","mt":"Maltese","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Burmese","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"Norwegian Bokmal","nd":"North Ndebele","nds":"Low German","ne":"Nepali","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"Dutch","nl-BE":"Flemish","nmg":"Kwasio","nn":"Norwegian Nynorsk","nnh":"Ngiemboon","no":"Norwegian","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"Northern Sotho","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Occitan","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetic","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"Punjabi","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"Polish","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"Pushto","pt":"Portuges","pt-BR":"Portuges sa Brazil","pt-PT":"European Portuguese","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Rhaeto-Romance","rn":"Rundi","ro":"Romanian","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"Russian","rup":"Aromanian","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sanskrit","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"Sindhi","se":"Northern Sami","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Old Irish","sgn":"Sign Language","sh":"Serbo-Croatian","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"Sinhala","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"Slovak","sl":"Slovenian","sla":"Slavic Language","sm":"Samoan","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somali","sog":"Sogdien","son":"Songhai","sq":"Albanian","sr":"Serbian","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Southern Sotho","su":"Sundanese","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"Swedish","sw":"Swahili","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"Tamil","tai":"Tai Language","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tajik","th":"Thai","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Turkmen","tkl":"Tokelau","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongan","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Turkish","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tatar","tum":"Tumbuka","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahitian","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"Uyghur","uga":"Ugaritic","uk":"Ukranian","umb":"Umbundu","und":"Hindi Kilalang Wika","ur":"Urdu","uz":"Uzbek","vai":"Vai","ve":"Venda","vi":"Vietnamese","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Wolof","xal":"Kalmyk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Yiddish","yo":"Yoruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"Chinese","zh-Hans":"Chinese (pinasimple)","zh-Hant":"Chinese (tradisyunal)","znd":"Zande","zu":"Zulu","zun":"Zuni","zxx":"Walang nilalamang linguistic","zza":"Zaza"},"fr":{"aa":"afar","ab":"abkhaze","ace":"aceh","ach":"acoli","ada":"adangme","ady":"adyghéen","ae":"avestique","af":"afrikaans","afa":"langue afro-asiatique","afh":"afrihili","agq":"Aghem","ain":"aïnou","ak":"akan","akk":"akkadien","ale":"aléoute","alg":"langue algonquienne","alt":"altaï du Sud","am":"amharique","an":"aragonais","ang":"ancien anglais","anp":"angika","apa":"langue apache","ar":"arabe","ar-001":"Modern Standard Arabic","arc":"araméen","arn":"araukan","arp":"arapaho","art":"langue artificielle","arw":"arawak","as":"assamais","asa":"Asu","ast":"asturien","ath":"langue athapascane","aus":"langue australienne","av":"avar","awa":"awadhi","ay":"aymara","az":"azéri","ba":"bachkir","bad":"banda","bai":"langue bamilékée","bal":"baloutchi","ban":"balinais","bas":"bassa","bat":"langue balte","bax":"bamoun","bbj":"ghomala","be":"biélorusse","bej":"bedja","bem":"bemba","ber":"berbère","bez":"Bena","bfd":"bafut","bg":"bulgare","bh":"bihari","bho":"bhojpuri","bi":"bichelamar","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengali","bnt":"bantou","bo":"tibétain","br":"breton","bra":"braj","brx":"Bodo","bs":"bosniaque","bss":"akoose","btk":"batak","bua":"bouriate","bug":"bugi","bum":"boulou","byn":"blin","byv":"medumba","ca":"catalan","cad":"caddo","cai":"langue amérindienne centrale","car":"caribe","cau":"langue caucasienne","cay":"Cayuga","cch":"atsam","ce":"tchétchène","ceb":"cebuano","cel":"langue celtique","cgg":"Chiga","ch":"chamorro","chb":"chibcha","chg":"tchaghataï","chk":"chuuk","chm":"mari","chn":"jargon chinook","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"cheyenne","ckb":"sorani","cmc":"langue chame","co":"corse","cop":"copte","cpe":"créole ou pidgin anglais","cpf":"créole ou pidgin français","cpp":"créole ou pidgin portugais","cr":"cree","crh":"turc de Crimée","crp":"créole ou pidgin","cs":"tchèque","csb":"kachoube","cu":"slavon d’église","cus":"langue couchitique","cv":"tchouvache","cy":"gallois","da":"danois","dak":"dakota","dar":"dargwa","dav":"Taita","day":"dayak","de":"allemand","de-AT":"allemand autrichien","de-CH":"allemand suisse","del":"delaware","den":"slavey","dgr":"dogrib","din":"dinka","dje":"Zarma","doi":"dogri","dra":"langue dravidienne","dsb":"bas-sorabe","dua":"douala","dum":"moyen néerlandais","dv":"maldivien","dyo":"Jola-Fonyi","dyu":"dioula","dz":"dzongkha","dzg":"dazaga","ebu":"Embu","ee":"éwé","efi":"efik","egy":"égyptien ancien","eka":"ekajuk","el":"grec","elx":"élamite","en":"anglais","en-AU":"anglais australien","en-CA":"anglais canadien","en-GB":"anglais britannique","en-US":"anglais américain","enm":"moyen anglais","eo":"espéranto","es":"espagnol","es-419":"espagnol latino-américain","es-ES":"espagnol d’Europe","et":"estonien","eu":"basque","ewo":"éwondo","fa":"persan","fan":"fang","fat":"fanti","ff":"peul","fi":"finnois","fil":"filipino","fiu":"langue finno-ougrienne","fj":"fidjien","fo":"féroïen","fon":"fon","fr":"français","fr-CA":"français canadien","fr-CH":"français suisse","frm":"moyen français","fro":"ancien français","frr":"frison du Nord","frs":"frison oriental","fur":"frioulan","fy":"frison","ga":"irlandais","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"gaélique écossais","gem":"langue germanique","gez":"guèze","gil":"gilbertais","gl":"galicien","gmh":"moyen haut-allemand","gn":"guarani","goh":"ancien haut allemand","gon":"gondi","gor":"gorontalo","got":"gotique","grb":"grebo","grc":"grec ancien","gsw":"alémanique","gu":"goudjarâtî","guz":"Gusii","gv":"manx","gwi":"gwichʼin","ha":"haoussa","hai":"haida","haw":"hawaïen","he":"hébreu","hi":"hindi","hil":"hiligaynon","him":"himachali","hit":"hittite","hmn":"hmong","ho":"hiri motu","hr":"croate","hsb":"haut-sorabe","ht":"haïtien","hu":"hongrois","hup":"hupa","hy":"arménien","hz":"héréro","ia":"interlingua","iba":"iban","ibb":"Ibibio","id":"indonésien","ie":"interlingue","ig":"igbo","ii":"yi de Sichuan","ijo":"ijo","ik":"inupiaq","ilo":"ilokano","inc":"langue indo-aryenne","ine":"langue indo-européenne","inh":"ingouche","io":"ido","ira":"langue iranienne","iro":"langue iroquoienne","is":"islandais","it":"italien","iu":"inuktitut","ja":"japonais","jbo":"lojban","jgo":"Ngomba","jmc":"Machame","jpr":"judéo-persan","jrb":"judéo-arabe","jv":"javanais","ka":"géorgien","kaa":"karakalpak","kab":"kabyle","kac":"kachin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardin","kbl":"kanembou","kcg":"tyap","kde":"Makonde","kea":"capverdien","kfo":"koro","kg":"kongo","kha":"khasi","khi":"langue khoïsan","kho":"khotanais","khq":"Koyra Chiini","ki":"kikuyu","kj":"kuanyama","kk":"kazakh","kkj":"kako","kl":"groenlandais","kln":"Kalenjin","km":"khmer","kmb":"kiMboundou","kn":"kannada","ko":"coréen","kok":"konkani","kos":"kusaien","kpe":"kpellé","kr":"kanouri","krc":"karatchaï balkar","krl":"carélien","kro":"krou","kru":"kurukh","ks":"kâshmîrî","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"kurde","kum":"koumyk","kut":"kutenai","kv":"komi","kw":"cornique","ky":"kirghize","la":"latin","lad":"ladino","lag":"Langi","lah":"lahnda","lam":"lamba","lb":"luxembourgeois","lez":"lezghien","lg":"ganda","li":"limbourgeois","lkt":"Lakota","ln":"lingala","lo":"lao","lol":"mongo","loz":"lozi","lt":"lituanien","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"Luyia","lv":"letton","mad":"madurais","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makassar","man":"mandingue","map":"malayo-polynésien","mas":"masai","mde":"maba","mdf":"moksa","mdr":"mandar","men":"mendé","mer":"Meru","mfe":"créole mauricien","mg":"malgache","mga":"moyen irlandais","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"marshall","mi":"maori","mic":"micmac","min":"minangkabau","mis":"langue diverse","mk":"macédonien","mkh":"langue mon-khmère","ml":"malayalam","mn":"mongol","mnc":"mandchou","mni":"manipuri","mno":"langue manobo","mo":"moldave","moh":"mohawk","mos":"moré","mr":"marathe","ms":"malais","mt":"maltais","mua":"mundang","mul":"multilingue","mun":"langue mounda","mus":"creek","mwl":"mirandais","mwr":"marwarî","my":"birman","mye":"myènè","myn":"langue maya","myv":"erzya","na":"nauruan","nah":"nahuatl","nai":"langue amérindienne du Nord","nap":"napolitain","naq":"Nama","nb":"norvégien bokmål","nd":"ndébélé du Nord","nds":"bas-allemand","ne":"népalais","new":"newari","ng":"ndonga","nia":"nias","nic":"langue nigéro-congolaise","niu":"niué","nl":"néerlandais","nl-BE":"flamand","nmg":"Kwasio","nn":"norvégien nynorsk","nnh":"ngiemboon","no":"norvégien","nog":"nogaï","non":"vieux norrois","nqo":"n’ko","nr":"ndébélé du Sud","nso":"sotho du Nord","nub":"langue nubienne","nus":"Nuer","nv":"navaho","nwc":"newarî classique","ny":"nyanja","nym":"nyamwezi","nyn":"nyankolé","nyo":"nyoro","nzi":"nzema","oc":"occitan","oj":"ojibwa","om":"oromo","or":"oriya","os":"ossète","osa":"osage","ota":"turc ottoman","oto":"langue otomangue","pa":"pendjabi","paa":"langue papoue","pag":"pangasinan","pal":"pahlavi","pam":"pampangan","pap":"papiamento","pau":"palau","peo":"persan ancien","phi":"langue philippine","phn":"phénicien","pi":"pali","pl":"polonais","pon":"pohnpei","pra":"langues prâkrit","pro":"provençal ancien","ps":"pashto","pt":"portugais","pt-BR":"portugais brésilien","pt-PT":"portugais d’Europe","qu":"quechua","raj":"rajasthani","rap":"rapanui","rar":"rarotongien","rm":"romanche","rn":"roundi","ro":"roumain","roa":"langue romane","rof":"Rombo","rom":"tzigane","root":"racine","ru":"russe","rup":"valaque","rw":"rwanda","rwk":"Rwa","sa":"sanskrit","sad":"sandawe","sah":"iakoute","sai":"langue amérindienne du Sud","sal":"langue salishenne","sam":"araméen samaritain","saq":"samburu","sas":"sasak","sat":"santal","sba":"ngambay","sbp":"Sangu","sc":"sarde","scn":"sicilien","sco":"écossais","sd":"sindhî","se":"sami du Nord","see":"seneca","seh":"sena","sel":"selkoupe","sem":"langue sémitique","ses":"songhaï koyraboro senni","sg":"sangho","sga":"ancien irlandais","sgn":"langue des signes","sh":"serbo-croate","shi":"chleuh","shn":"shan","shu":"arabe tchadien","si":"cinghalais","sid":"sidamo","sio":"langue sioux","sit":"langue sino-tibétaine","sk":"slovaque","sl":"slovène","sla":"langue slave","sm":"samoan","sma":"sami du Sud","smi":"langue samie","smj":"sami de Lule","smn":"sami d’Inari","sms":"sami skolt","sn":"shona","snk":"soninké","so":"somali","sog":"sogdien","son":"songhai","sq":"albanais","sr":"serbe","srn":"sranan tongo","srr":"sérère","ss":"swati","ssa":"langue nilo-saharienne","ssy":"saho","st":"sesotho","su":"soundanais","suk":"sukuma","sus":"soussou","sux":"sumérien","sv":"suédois","sw":"swahili","swb":"comorien","swc":"swahili du Congo","syc":"syriaque classique","syr":"syriaque","ta":"tamoul","tai":"langue taï","te":"télougou","tem":"temne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tadjik","th":"thaï","ti":"tigrigna","tig":"tigré","tiv":"tiv","tk":"turkmène","tkl":"tokelau","tl":"tagalog","tlh":"klingon","tli":"tlingit","tmh":"tamacheq","tn":"tswana","to":"tongien","tog":"tonga nyasa","tpi":"tok pisin","tr":"turc","trv":"taroko","ts":"tsonga","tsi":"tsimshian","tt":"tatar","tum":"tumbuka","tup":"langue tupi","tut":"langue altaïque","tvl":"tuvalu","tw":"twi","twq":"Tasawaq","ty":"tahitien","tyv":"touva","tzm":"tamazight","udm":"oudmourte","ug":"ouïgour","uga":"ougaritique","uk":"ukrainien","umb":"umbundu","und":"langue indéterminée","ur":"ourdou","uz":"ouzbek","vai":"vaï","ve":"venda","vi":"vietnamien","vo":"volapuk","vot":"vote","vun":"vunjo","wa":"wallon","wae":"walser","wak":"langues wakashennes","wal":"walamo","war":"waray","was":"washo","wen":"langue sorabe","wo":"wolof","xal":"kalmouk","xh":"xhosa","xog":"soga","yao":"yao","yap":"yapois","yav":"yangben","ybb":"yémba","yi":"yiddish","yo":"yoruba","ypk":"langues yupik","yue":"cantonais","za":"zhuang","zap":"zapotèque","zbl":"symboles Bliss","zen":"zenaga","zh":"chinois","zh-Hans":"chinois simplifié","zh-Hant":"chinois traditionnel","znd":"zandé","zu":"zoulou","zun":"zuni","zxx":"sans contenu linguistique","zza":"zazaki"},"ga":{"aa":"aa","ab":"Abcáisis","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adyghe","ae":"Aivéistis","af":"Afracáinis","afa":"Afro-Asiatic Language","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"Amarais","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"Araibis","ar-001":"Modern Standard Arabic","arc":"Aramaic","arn":"Mapuche","arp":"Arapaho","art":"Artificial Language","arw":"Arawak","as":"Asaimis","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"Aymara","az":"Asarbaiseáinis","ba":"Baiscíris","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"Bealarúisis","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"Bulgáiris","bh":"Bihairis","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Beangáilis","bnt":"Bantu","bo":"Tibéadais","br":"Briotáinis","bra":"Braj","brx":"Bodo","bs":"Boisnis","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Catalóinis","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Sisinis","ceb":"Cebuano","cel":"Celtic Language","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Sorani Kurdish","cmc":"Chamic Language","co":"Corsaicis","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Craíais","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"Seicis","csb":"Kashubian","cu":"Slavais na hEaglaise","cus":"Cushitic Language","cv":"Suvaisis","cy":"Breatnais","da":"Danmhairgis","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"Gearmáinis","de-AT":"Austrian German","de-CH":"Swiss High German","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Ancient Egyptian","eka":"Ekajuk","el":"Gréigis","elx":"Elamite","en":"Béarla","en-AU":"Australian English","en-CA":"Canadian English","en-GB":"British English","en-US":"U.S. English","enm":"Middle English","eo":"Esperanto","es":"Spáinnis","es-419":"Latin American Spanish","es-ES":"European Spanish","et":"Eastóinis","eu":"Bascais","ewo":"Ewondo","fa":"Peirsis","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Fionlainnis","fil":"Filipino","fiu":"Finno-Ugrian Language","fj":"Fidsis","fo":"Faróis","fon":"Fon","fr":"Fraincis","fr-CA":"Canadian French","fr-CH":"Swiss French","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"Freaslainnis Iartharach","ga":"Gaeilge","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Gaeilge na hAlban","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"Gailísis","gmh":"Middle High German","gn":"Guaráinis","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Ancient Greek","gsw":"Swiss German","gu":"Gúisearáitis","guz":"Gusii","gv":"Mannainis","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Haváíais","he":"Eabhrais","hi":"Hiondúis","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"Cróitis","hsb":"Upper Sorbian","ht":"Haitian","hu":"Ungáiris","hup":"Hupa","hy":"Airméinis","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indinéisis","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"Íoslainnis","it":"Iodáilis","iu":"Ionúitis","ja":"Seapáinis","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"Iávais","ka":"Seoirsis","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Casachais","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Cambóidis","kmb":"Kimbundu","kn":"Cannadais","ko":"Cóiréis","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Caismíris","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Coirdis","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornais","ky":"Cirgeasais","la":"Laidin","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Leitseabuirgis","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"ln","lo":"Laosais","lol":"Mongo","loz":"Lozi","lt":"Liotuáinis","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"Laitvis","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagásais","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maorais","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"Macadóinis","mkh":"Mon-Khmer Language","ml":"Mailéalaimis","mn":"Mongóilis","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldáivis","moh":"Mohawk","mos":"Mossi","mr":"Maraitis","ms":"Malaeis","mt":"Maltais","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Burmais","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nárúis","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"Ioruais Bokmål","nd":"North Ndebele","nds":"Low German","ne":"Neipealais","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"Ollainnis","nl-BE":"Flemish","nmg":"Kwasio","nn":"Ioruais Nynorsk","nnh":"Ngiemboon","no":"Ioruais","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"Northern Sotho","nub":"Nubian Language","nus":"Nuer","nv":"Navachóis","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Ocatáinis","oj":"Ojibwa","om":"Oromo","or":"Oraisis","os":"Óiséitis","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"Puinseáibis","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"Polainnis","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"Paistis","pt":"Portaingéilis","pt-BR":"Portaingéilis Bhrasaíleach","pt-PT":"Portaingéilis Ibéireach","qu":"Ceatsuais","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Romansh","rn":"Rundi","ro":"Rómáinis","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"Rúisis","rup":"Aromanian","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sanscrait","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sairdínis","scn":"Sicilian","sco":"Scots","sd":"Sindis","se":"Sáimis Thuaidh","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Old Irish","sgn":"Sign Language","sh":"Seirbea-Chróitis","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"Siolóinis","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"Slóvaicis","sl":"Slóivéinis","sla":"Slavic Language","sm":"Samóis","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somáilis","sog":"Sogdien","son":"Songhai","sq":"Albáinis","sr":"Seirbis","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Sótais Dheisceartach","su":"Sundais","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"Sualainnis","sw":"Svahaílis","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"Tamailis","tai":"Tai Language","te":"Teileagúis","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tajik","th":"Téalainnis","ti":"Tigrinis","tig":"Tigre","tiv":"Tiv","tk":"Tuircméinis","tkl":"Tokelau","tl":"Tagálaigis","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongan","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Tuircis","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tatarais","tum":"Tumbuka","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Tvís","twq":"Tasawaq","ty":"Taihítis","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"ug","uga":"Ugaritic","uk":"Úcráinis","umb":"Umbundu","und":"Teanga Anaithnid nó Neamhbhailí","ur":"Urdais","uz":"Úisbéicis","vai":"Vai","ve":"Venda","vi":"Vítneamais","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Vallúnais","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Wolof","xal":"Kalmyk","xh":"Cósais","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Giúdais","yo":"Yoruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"Sínis","zh-Hans":"Sínis Shimplithe","zh-Hant":"Sínis Thraidisiúnta","znd":"Zande","zu":"Súlúis","zun":"Zuni","zxx":"No linguistic content","zza":"Zaza"},"gl":{"aa":"Afar","ab":"abkhazo","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"afrikaans","afa":"lingua afro-asiática","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akán","akk":"Akkadian","ale":"Aleut","alg":"lingua algonquina","alt":"Southern Altai","am":"amárico","an":"aragonés","ang":"Old English","anp":"Angika","apa":"lingua apache","ar":"árabe","ar-001":"Modern Standard Arabic","arc":"arameo","arn":"Mapuche","arp":"Arapaho","art":"lingua artificial","arw":"Arawak","as":"assamés","asa":"Asu","ast":"asturiano","ath":"Athapascan Language","aus":"lingua australiana","av":"Avaric","awa":"Awadhi","ay":"aimará","az":"acerbaixano","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"lingua báltica","bax":"Bamun","bbj":"Ghomala","be":"bielorruso","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"búlgaro","bh":"Bihariano","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"bengalí","bnt":"Bantu","bo":"tibetano","br":"Bretón","bra":"Braj","brx":"Bodo","bs":"bosnio","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"catalán","cad":"Caddo","cai":"lingua india centroamericana","car":"Carib","cau":"lingua caucásica","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"lingua céltica","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cheroqui","chy":"Cheyenne","ckb":"Kurdo soraní","cmc":"Chamic Language","co":"Corso","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"checo","csb":"Kashubian","cu":"eslavo eclesiástico","cus":"Cushitic Language","cv":"Chuvash","cy":"galés","da":"dinamarqués","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"alemán","de-AT":"alemán de austria","de-CH":"alto alemán suízo","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewé","efi":"ibibio","egy":"exipcio antigo","eka":"Ekajuk","el":"grego","elx":"Elamite","en":"inglés","en-AU":"inglés australiano","en-CA":"inglés canadiano","en-GB":"inglés británico","en-US":"inglés americano","enm":"Middle English","eo":"esperanto","es":"español","es-419":"español latinoamericano","es-ES":"castelán","et":"estoniano","eu":"éuscaro","ewo":"Ewondo","fa":"persa","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"finés","fil":"filipino","fiu":"lingua finno-úgrica","fj":"fixiano","fo":"faroés","fon":"Fon","fr":"francés","fr-CA":"francés canadiano","fr-CH":"francés suízo","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"frisón","ga":"irlandés","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"gaélico escocés","gem":"lingua xermánica","gez":"Geez","gil":"Gilbertese","gl":"galego","gmh":"Middle High German","gn":"guaraní","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"grego antigo","gsw":"alemán suízo","gu":"guxaratiano","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"hausa","hai":"Haida","haw":"hawaiano","he":"hebreo","hi":"hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"croata","hsb":"Upper Sorbian","ht":"haitiano","hu":"húngaro","hup":"Hupa","hy":"armenio","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"indonesio","ie":"Interlingue","ig":"ibo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"lingua índica","ine":"lingua indoeuropea","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"islandés","it":"italiano","iu":"Inuktitut","ja":"xaponés","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"xavanés","ka":"xeorxiano","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Congolés","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"casaco","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"cambodiano","kmb":"Kimbundu","kn":"kannada","ko":"coreano","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"cachemir","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"kurdo","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"kyrgiz","la":"latín","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"luxemburgués","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"lingala","lo":"laotiano","lol":"Mongo","loz":"Lozi","lt":"lituano","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"letón","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Crioulo mauritano","mg":"malgaxe","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"maorí","mic":"Micmac","min":"Minangkabau","mis":"lingua miscelánea","mk":"macedonio","mkh":"Mon-Khmer Language","ml":"malabar","mn":"mongol","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"marathi","ms":"malaio","mt":"maltés","mua":"Mundang","mul":"varias linguas","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"birmano","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"lingua india norteamericana","nap":"Neapolitan","naq":"Nama","nb":"noruegués bokmal","nd":"ndebele do norte","nds":"Low German","ne":"nepalí","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"holandés","nl-BE":"flamenco","nmg":"Kwasio","nn":"noruegués nynorsk","nnh":"Ngiemboon","no":"noruegués","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"Sesotho sa leboa","nub":"lingua nubia","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"chewa","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Occitano","oj":"Ojibwa","om":"Oromo","or":"oriya","os":"osetio","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"punjabi","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"lingua filipina","phn":"Phoenician","pi":"Pali","pl":"polaco","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"paxtún","pt":"portugués","pt-BR":"portugués brasileiro","pt-PT":"Portugués europeo","qu":"quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"romanche","rn":"rundi","ro":"romanés","roa":"lingua románica","rof":"Rombo","rom":"Romany","root":"Root","ru":"ruso","rup":"Aromanian","rw":"ruandés","rwk":"Rwa","sa":"sánscrito","sad":"Sandawe","sah":"Sakha","sai":"lingua india sudamericana","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"sindhi","se":"sami do norte","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"lingua semita","ses":"Koyraboro Senni","sg":"sango","sga":"Old Irish","sgn":"lingua de signos","sh":"serbocroata","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"cingalés","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"eslovaco","sl":"esloveno","sla":"lingua eslávica","sm":"samoano","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"shona","snk":"Soninke","so":"somalí","sog":"Sogdien","son":"Songhai","sq":"albanés","sr":"serbio","srn":"Sranan Tongo","srr":"Serer","ss":"swati","ssa":"lingua do nilo-sáhara","ssy":"Saho","st":"sesoto","su":"sondanés","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"sueco","sw":"swahili","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"tamil","tai":"Tai Language","te":"telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"tetún","tg":"taxico","th":"tailandés","ti":"tigriña","tig":"Tigre","tiv":"Tiv","tk":"turcomano","tkl":"Tokelau","tl":"tagalo","tlh":"Clingon","tli":"Tlingit","tmh":"Tamashek","tn":"tswana","to":"tonganés","tog":"Nyasa Tonga","tpi":"tok pisin","tr":"turco","trv":"Taroko","ts":"xitsonga","tsi":"Tsimshian","tt":"tártaro","tum":"Tumbuka","tup":"Tupi Language","tut":"lingua altaica","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"tahitiano","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"uigur","uga":"Ugaritic","uk":"ucraíno","umb":"Umbundu","und":"lingua descoñecida ou non válida","ur":"urdú","uz":"uzbeco","vai":"Vai","ve":"venda","vi":"vietnamita","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"wólof","xal":"Kalmyk","xh":"xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Yiddish","yo":"ioruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"chinés","zh-Hans":"chinés simplificado","zh-Hant":"chinés tradicional","znd":"Zande","zu":"zulú","zun":"Zuni","zxx":"sen contido lingüístico","zza":"Zaza"},"he":{"aa":"אפארית","ab":"אבחזית","ace":"אכינזית","ach":"אקולי","ada":"אדנמה","ady":"אדיגית","ae":"אבסטן","af":"אפריקאנס","afa":"שפה אפרו-אסייתית","afh":"אפריהילי","agq":"אהיים","ain":"אינו","ak":"אקאן","akk":"אכדית","ale":"אלאוט","alg":"השפה האלגונקוויאנית","alt":"אלטאי דרומית","am":"אמהרית","an":"אראגונית","ang":"אנגלית עתיקה","anp":"אנג'יקה","apa":"שפה אפאצ׳ית","ar":"ערבית","ar-001":"Modern Standard Arabic","arc":"ארמית","arn":"אראוקנית","arp":"ארפהו","art":"שפה מלאכותית","arw":"ארוואק","as":"אסאמית","asa":"אסו","ast":"אסטורית","ath":"השפה האת'פסקנית","aus":"שפה אוסטרלית","av":"אבארית","awa":"אוואדית","ay":"איימארית","az":"אזרית","ba":"בשקירית","bad":"בנדה","bai":"השפה הבאמילקית","bal":"באלוצ׳י","ban":"בלינזית","bas":"בסאא","bat":"שפות בלטיות","bax":"באקס","bbj":"גומל","be":"בלארוסית","bej":"בז׳ה","bem":"במבה","ber":"ברברית","bez":"בנה","bfd":"באפוט","bg":"בולגרית","bh":"ביהארי","bho":"בוג'פורי","bi":"ביסלמה","bik":"ביקול","bin":"ביני","bkm":"קום","bla":"סיקסיקה","bm":"במבארה","bn":"בנגלית","bnt":"בנטו","bo":"טיבטית","br":"ברטונית","bra":"בראג'","brx":"בודו","bs":"בוסנית","bss":"אקוסה","btk":"בטאק","bua":"בוריאט","bug":"בוגינזית","bum":"בולו","byn":"בלין","byv":"מדומבה","ca":"קטלאנית","cad":"קאדו","cai":"שפה אינדיאנית מרכז-אמריקאית","car":"קאריב","cau":"שפה קווקזית","cay":"קאיוגה","cch":"אטסם","ce":"צ׳צ׳נית","ceb":"קבואנו","cel":"שפה קלטית","cgg":"צ'יגה","ch":"צ'מורו","chb":"צ'יבצ'ה","chg":"צ׳אגאטאי","chk":"צ'וקסה","chm":"מארי","chn":"ניב צ'ינוק","cho":"צ'וקטאו","chp":"צ'יפוויאן","chr":"צ׳רוקי","chy":"שאיין","ckb":"כורדית סוראנית","cmc":"השפה הצ'אמית","co":"קורסיקנית","cop":"קופטית","cpe":"קריאולית או פידג'ין מבוססת אנגלית","cpf":"קריאולית או פידג'ין מבוססת-צרפתית","cpp":"קריאולית או פידג'ין מבוססת-פורטוגזית","cr":"קרי","crh":"טטרית של קרים","crp":"שפה קראולית או פידג׳אנית","cs":"צ׳כית","csb":"קשוביאן","cu":"סלאבית כנסייתית עתיקה","cus":"השפה הקושיטית","cv":"צ'ובאש","cy":"וולשית","da":"דנית","dak":"דקוטה","dar":"דרגווה","dav":"טאיטה","day":"דיאק","de":"גרמנית","de-AT":"גרמנית אוסטרית","de-CH":"גרמנית שוויצרית (גבוהה)","del":"דלאוור","den":"סלאבית","dgr":"דוגריב","din":"דינקה","dje":"זארמה","doi":"דוגרי","dra":"השפה הדראווידיאנית","dsb":"סורביאן נמוכה","dua":"דואלה","dum":"הולנדית תיכונה","dv":"דיבהי","dyo":"הולה-פוניי","dyu":"דיולה","dz":"דזונקה","dzg":"דזאנגה","ebu":"אמבו","ee":"אווה","efi":"אפיק","egy":"מצרית עתיקה","eka":"אקיוק","el":"יוונית","elx":"עילמית","en":"אנגלית","en-AU":"אנגלית אוסטרלית","en-CA":"אנגלית קנדית","en-GB":"אנגלית בריטית","en-US":"אנגלית אמריקנית","enm":"אנגלית תיכונה","eo":"אספרנטו","es":"ספרדית","es-419":"ספרדית לטינו־אמריקאית","es-ES":"ספרדית אירופאית","et":"אסטונית","eu":"בסקית","ewo":"אוונדו","fa":"פרסית","fan":"פנג","fat":"פאנטי","ff":"פולה","fi":"פינית","fil":"פיליפינית","fiu":"השפה הפינו-אוגרית","fj":"פיג׳ית","fo":"פארואזית","fon":"פון","fr":"צרפתית","fr-CA":"צרפתית קנדית","fr-CH":"צרפתית שוויצרית","frm":"צרפתית תיכונה","fro":"צרפתית עתיקה","frr":"פריזית צפונית","frs":"פריזיאן מזרחית","fur":"פריולית","fy":"פריזית","ga":"אירית","gaa":"גא","gay":"גאיו","gba":"גבאיה","gd":"גאלית סקוטית","gem":"שפה גרמאנית","gez":"געז","gil":"גילברטזית","gl":"גליציאנית","gmh":"גרמנית בינונית-גבוהה","gn":"גוארני","goh":"גרמנית עתיקה גבוהה","gon":"גונדי","gor":"גורונטאלו","got":"גותית","grb":"גרבו","grc":"יוונית עתיקה","gsw":"גרמנית שוויצרית","gu":"גוג׳ראטית","guz":"גוסי","gv":"מאנית","gwi":"גוויצ'ין","ha":"האוסה","hai":"האידה","haw":"הוואית","he":"עברית","hi":"הינדי","hil":"היליגאינון","him":"הימצ'אלי","hit":"חיתית","hmn":"מונג","ho":"הארי מוטו","hr":"קרואטית","hsb":"סורביאנית עליונה","ht":"האיטית","hu":"הונגרית","hup":"הופה","hy":"ארמנית","hz":"הררו","ia":"‏אינטרלינגואה","iba":"איבאן","ibb":"איביביו","id":"אינדונזית","ie":"אינטרלינגה","ig":"איגבו","ii":"סיצ'ואן יי","ijo":"איג'ו","ik":"אינופיאק","ilo":"אילוקו","inc":"שפת האינדיק","ine":"שפה הודו-אירופית","inh":"אינגושית","io":"אידו","ira":"שפה איראנית","iro":"השפה האירוקואונית","is":"איסלנדית","it":"איטלקית","iu":"אינוקטיטוט","ja":"יפנית","jbo":"לויבאן","jgo":"Ngomba","jmc":"מצ'אמה","jpr":"פרסית יהודית","jrb":"ערבית יהודית","jv":"יאוונית","ka":"גאורגית","kaa":"קארא-קלפאק","kab":"קבילה","kac":"קצ'ין","kaj":"ג'יו","kam":"קמבה","kar":"קארן","kaw":"קאווי","kbd":"קברדית","kbl":"קנמבו","kcg":"טיאפ","kde":"מקונדה","kea":"קאבוורדיאנו","kfo":"קורו","kg":"קונגו","kha":"קאסי","khi":"השפה הקויסאנית","kho":"קוטאנזית","khq":"קוירה צ'יני","ki":"קיקויו","kj":"קואניאמה","kk":"קזחית","kkj":"קאקו","kl":"קאלאליסוטית","kln":"קאלנג'ין","km":"קמרית","kmb":"קימבונדו","kn":"קנאדה","ko":"קוריאנית","kok":"קונקאני","kos":"קוסראיאן","kpe":"קפלה","kr":"קאנורי","krc":"קראצ'י-בלקר","krl":"קארלית","kro":"קרו","kru":"קורוק","ks":"קשמירית","ksb":"שמבאלה","ksf":"באפיה","ksh":"קולוניאן","ku":"כורדית","kum":"קומיק","kut":"קוטנאי","kv":"קומי","kw":"קורנית","ky":"קירגיזית","la":"לטינית","lad":"לדינו","lag":"לאנגי","lah":"לנדה","lam":"למבה","lb":"לוקסמבורגית","lez":"לזגית","lg":"גאנדה","li":"לימבורגיש","lkt":"Lakota","ln":"לינגלה","lo":"לאית","lol":"מונגו","loz":"לוזי","lt":"ליטאית","lu":"לובה-קטנגה","lua":"לובה-לולואה","lui":"לואיסנו","lun":"לונדה","luo":"לואו","lus":"לושאי","luy":"לויה","lv":"לטבית","mad":"מדורסה","maf":"מאפא","mag":"מאגאהית","mai":"מאיטילית","mak":"מקסאר","man":"מנדינגו","map":"אוסטרונזית","mas":"מאסאית","mde":"מאבא","mdf":"מוקשה","mdr":"מנדאר","men":"מנדה","mer":"מרו","mfe":"מוריסיין","mg":"מלגשית","mga":"אירית תיכונה","mgh":"מקואה-מיטו","mgo":"Meta'","mh":"מרשאלס","mi":"מאורית","mic":"מיקמק","min":"מיננגקבאו","mis":"שפה אחרת","mk":"מקדונית","mkh":"שפת מון-חמר","ml":"מלאיאלם","mn":"מונגולית","mnc":"מנצ'ו","mni":"מניפורית","mno":"שפת מנובו","mo":"מולדבית","moh":"מוהוק","mos":"מוסי","mr":"מרטהי","ms":"מלאית","mt":"מלטית","mua":"מונדאנג","mul":"מספר שפות","mun":"שפת מונדה","mus":"קריק","mwl":"מירנדזית","mwr":"מרווארי","my":"בורמזית","mye":"מאיין","myn":"מאיה","myv":"ארזיה","na":"נאורית","nah":"נאהואטל","nai":"שפה אינדיאנית צפון-אמריקאית","nap":"נפוליטנית","naq":"נאמה","nb":"‏נורבגית ספרותית","nd":"צפון נדבלה","nds":"גרמנית תחתית","ne":"נפאלית","new":"נווארי","ng":"נדונגה","nia":"ניאס","nic":"השפה הניגר-קורדופניאנית","niu":"ניואיאן","nl":"הולנדית","nl-BE":"פלמית","nmg":"קוואסיו","nn":"נורבגית חדשה","nnh":"נגיאמבון","no":"נורבגית","nog":"נוגאי","non":"‏נורדית עתיקה","nqo":"נ'קו","nr":"דרום נדבלה","nso":"סוטו הצפונית","nub":"שפות נבטיות","nus":"נואר","nv":"נבחו","nwc":"נווארית קלאסית","ny":"ניאנג'ה","nym":"ניאמווזי","nyn":"ניאנקולה","nyo":"ניורו","nzi":"נזימה","oc":"אוקסיטנית","oj":"אוג'יבווה","om":"אורומו","or":"אוריה","os":"אוסטית","osa":"אוסג'ה","ota":"טורקית עותומנית","oto":"השפה האוטומיאנית","pa":"פנג׳אבית","paa":"השפה הפפואנית","pag":"פנגסינאן","pal":"פלאבי","pam":"פמפאניה","pap":"פפיאמנטו","pau":"פלוואן","peo":"פרסית עתיקה","phi":"שפה פיליפינית","phn":"פניקית","pi":"פאלי","pl":"פולנית","pon":"פונפיאן","pra":"שפת פרקריט","pro":"פרובנסאל עתיקה","ps":"פושטו","pt":"פורטוגזית","pt-BR":"פורטוגזית ברזילאית","pt-PT":"פורטוגזית אירופאית","qu":"קצ'ואה","raj":"ראג׳סטן","rap":"רפאנוי","rar":"ררוטונגאן","rm":"רומאנש","rn":"קירונדי","ro":"רומנית","roa":"שפת רומאנס","rof":"רומבו","rom":"רומאנית","root":"רוט","ru":"רוסית","rup":"ארומנית","rw":"קינירואנדה","rwk":"רווא","sa":"סנסקריט","sad":"סנדאווה","sah":"סאחה","sai":"שפה אינדיאנית דרום אמריקאית","sal":"השפה הסלישאנית","sam":"ארמית שומרונית","saq":"סמבורו","sas":"ססאק","sat":"סאנטלי","sba":"נגמבאי","sbp":"סאנגו","sc":"סרדינית","scn":"סיציליאנית","sco":"סקוטית","sd":"סינדהית","se":"לאפית צפונית","see":"סנקה","seh":"סנה","sel":"סלקופ","sem":"שפה שמית","ses":"קויראבורו סני","sg":"סנגו","sga":"אירית עתיקה","sgn":"שפת סימנים","sh":"סרבו-קרואטית","shi":"טצ'להיט","shn":"שאן","shu":"ערבית צ'אדית","si":"סינהלה","sid":"סידמו","sio":"שפת סו","sit":"שפה סינו־טיבטית","sk":"סלובקית","sl":"סלובנית","sla":"שפה סלאבית","sm":"סמואית","sma":"סאמי דרומית","smi":"שפת סאמי","smj":"לולה סאמי","smn":"אינארי סאמי","sms":"סקולט סאמי","sn":"שונה","snk":"סונינקה","so":"סומלית","sog":"סוגדיאן","son":"סונגהאי","sq":"אלבנית","sr":"סרבית","srn":"סרנאן טונגו","srr":"סרר","ss":"סיסוואטי","ssa":"השפה הנילו-סהרנית","ssy":"סאהו","st":"ססות׳ו","su":"סודנית","suk":"סוקומה","sus":"סוסו","sux":"שומרית","sv":"שוודית","sw":"סווהילית","swb":"קומורו","swc":"קונגו סוואהילי","syc":"סירית קלאסית","syr":"סורית","ta":"טמילית","tai":"שפת טאי","te":"טלוגו","tem":"טימנה","teo":"טסו","ter":"טרנו","tet":"טטום","tg":"טג׳יקית","th":"תאי","ti":"טיגרינאית","tig":"טיגרית","tiv":"טיב","tk":"טורקמנית","tkl":"טוקלאו","tl":"טגלוג","tlh":"קלינגון","tli":"טלינגיט","tmh":"טמאשק","tn":"טוניסיה","to":"טונגן","tog":"ניאסה טונגה","tpi":"טוק פיסין","tr":"טורקית","trv":"טרוקו","ts":"טסונגה","tsi":"טסימשיאן","tt":"טטרית","tum":"טומבוקה","tup":"שפת טופי","tut":"השפה האלטאית","tvl":"טובאלו","tw":"טווי","twq":"טסוואק","ty":"טהיטית","tyv":"טובינית","tzm":"טמזייט של מרכז מרוקו","udm":"אודמורט","ug":"אויגור","uga":"אוגריתית","uk":"אוקראינית","umb":"אומבונדו","und":"שפה לא ידועה","ur":"אורדו","uz":"אוזבקית","vai":"ואי","ve":"וונדה","vi":"ויאטנמית","vo":"‏וולאפיק","vot":"ווטיק","vun":"וונג'ו","wa":"וואלון","wae":"וואלסר","wak":"שפת ווקשאן","wal":"וולאמו","war":"ווראי","was":"וואשו","wen":"השפה הסורבית","wo":"ג׳ולוף","xal":"קלמיק","xh":"קסוסה","xog":"סוגה","yao":"יאו","yap":"יאפזית","yav":"יאנגבן","ybb":"ימבה","yi":"יידיש","yo":"יורובה","ypk":"השפה היופית","yue":"קנטונזית","za":"ז'ואנג","zap":"זאפוטק","zbl":"בליסימבולס","zen":"זנאגה","zh":"סינית","zh-Hans":"סינית (מפושטת)","zh-Hant":"סינית מסורתית","znd":"זאנדה","zu":"זולו","zun":"זוני","zxx":"ללא תוכן לשוני","zza":"זאזא"},"hi":{"aa":"अफ़ार","ab":"अब्खाज़ियन्","ace":"अचाइनीस","ach":"अकोली","ada":"अदान्गमे","ady":"अदिघे","ae":"अवस्ताई","af":"अफ्रीकी","afa":"अफ़्रीकी-एशियाई भाषा","afh":"अफ्रिहिली","agq":"Aghem","ain":"ऐनू","ak":"अकन","akk":"अक्कादी","ale":"अलेउत","alg":"एल्गोनक्युइअन भाषा","alt":"दक्षिणी अल्ताई","am":"अम्हारी","an":"अर्गोनी","ang":"पुरानी अंग्रेज़ी","anp":"अंगिका","apa":"अपाचे भाषा","ar":"अरबी","ar-001":"आधुनिक मानक अरबी","arc":"ऐरेमेक","arn":"मापूचे","arp":"अराफाओ","art":"कृत्रिम भाषा","arw":"अरावक","as":"आसामी","asa":"Asu","ast":"अस्तुरियन","ath":"अथापास्कान भाषा","aus":"आस्ट्रेलियाई भाषा","av":"अवेरिक","awa":"अवधी","ay":"आयमारा","az":"अज़ेरी","ba":"बशख़िर","bad":"बांदा","bai":"बमिलेके भाषा","bal":"बलूची","ban":"बालिनीस","bas":"बसा","bat":"बाल्टिक भाषा","bax":"Bamun","bbj":"Ghomala","be":"बेलारूसी","bej":"बेजा","bem":"बेम्बा","ber":"बरबर","bez":"Bena","bfd":"Bafut","bg":"बुल्गारियाई","bh":"बिहारी","bho":"भोजपुरी","bi":"बिस्लामा","bik":"बिकोल","bin":"बिनी","bkm":"Kom","bla":"सिक्सिका","bm":"बाम्बारा","bn":"बंगाली","bnt":"बन्तु","bo":"तिब्बती","br":"ब्रेटन","bra":"ब्रज","brx":"Bodo","bs":"बोस्नियाई","bss":"Akoose","btk":"बताक","bua":"बुरियात","bug":"बगिनीस","bum":"Bulu","byn":"ब्लिन","byv":"Medumba","ca":"कातालान","cad":"कैड्डो","cai":"मध्य अमेरिकी इंडियन भाषा","car":"कैरिब","cau":"कॉकेशियन भाषा","cay":"Cayuga","cch":"अत्सम","ce":"चेचन","ceb":"सिबुआनो","cel":"केल्टिक भाषा","cgg":"Chiga","ch":"कमोरो","chb":"चिब्चा","chg":"छगाताई","chk":"चूकीस","chm":"मारी","chn":"चिनूक जारगॉन","cho":"चोक्तौ","chp":"शिपेव्यान","chr":"चेरोकी","chy":"शेयेन्न","ckb":"सोरानी कुर्द","cmc":"शैमिक भाषा","co":"कोर्सीकन","cop":"कॉप्टिक","cpe":"अंग्रेज़ी आधारित क्रेओल या पिजिन","cpf":"फ़्रांसीसी आधारित क्रेओल या पिजिन","cpp":"पुर्तगाली आधारित क्रेओल या पिजिन","cr":"क्री","crh":"क्रीमीन तुर्की","crp":"क्रेओल या पिजिन","cs":"चेक","csb":"काशुबियन","cu":"चर्च साल्विक","cus":"कुशितिक भाषा","cv":"चूवाश","cy":"वेल्श","da":"डेनिश","dak":"दाकोता","dar":"दार्गवा","dav":"Taita","day":"दायक","de":"जर्मन","de-AT":"Austrian German","de-CH":"स्विस हाई जर्मन","del":"डिलैवेयर","den":"स्लेव","dgr":"डोग्रिब","din":"दिन्का","dje":"Zarma","doi":"डोग्री","dra":"द्रविड़ भाषा","dsb":"निचला सॉर्बियन","dua":"दुआला","dum":"मध्य पुर्तगाली","dv":"दिवेही","dyo":"Jola-Fonyi","dyu":"ड्युला","dz":"ज़ोन्गखा","dzg":"Dazaga","ebu":"Embu","ee":"ईवे","efi":"एफिक","egy":"प्राचीन मिस्री","eka":"एकाजुक","el":"यूनानी","elx":"एलामाइट","en":"अंग्रेज़ी","en-AU":"Australian English","en-CA":"Canadian English","en-GB":"British English","en-US":"U.S. English","enm":"मध्यकालीन अंग्रेज़ी","eo":"एस्पेरान्तो","es":"स्पेनी","es-419":"Latin American Spanish","es-ES":"स्पेनी (यूरोप)","et":"एस्टोनियाई","eu":"बास्क","ewo":"इवोन्डो","fa":"फ़ारसी","fan":"फैन्ग","fat":"फन्टी","ff":"फुलाह","fi":"फ़िनिश","fil":"फ़िलिपीनो","fiu":"फिन्नो-उग्रीयन भाषा","fj":"फ़ीजी","fo":"फिरोज़ी","fon":"फॉन","fr":"फ़्रांसीसी","fr-CA":"Canadian French","fr-CH":"Swiss French","frm":"मध्यकालीन फ़्रांसीसी","fro":"पुरातन फ़्रांसीसी","frr":"उत्तरी फ्रीसीयन","frs":"पूर्वी फ्रीसीयन","fur":"फ्रीयुलीयान","fy":"पश्चिमी फ़्रिसियाई","ga":"आइरिश","gaa":"गा","gay":"गायो","gba":"ग्बाया","gd":"स्काट्स् गायेलिक्","gem":"जर्मनिक भाषा","gez":"गीज़","gil":"गिल्बरतीस","gl":"गैलिशियन्","gmh":"मध्यकालीन हाइ जर्मन","gn":"गुआरानी","goh":"पुरातन हाइ जर्मन","gon":"गाँडी","gor":"गोरोन्तालो","got":"गॉथिक","grb":"ग्रेबो","grc":"प्राचीन यूनानी","gsw":"स्विस जर्मन","gu":"गुजराती","guz":"Gusii","gv":"मैंक्स","gwi":"ग्विच'इन","ha":"होउसा","hai":"हैडा","haw":"हवाई","he":"हीब्रू","hi":"हिन्दी","hil":"हिलिगेनन","him":"हिमाचली","hit":"हिताइत","hmn":"ह्मॉंग","ho":"हिरी मोटू","hr":"क्रोएशियाई","hsb":"ऊपरी सॉर्बियन","ht":"हैतीयन","hu":"हंगेरी","hup":"हूपा","hy":"अरमेनियन्","hz":"हरैरो","ia":"ईन्टरलिंगुआ","iba":"इबान","ibb":"Ibibio","id":"इंडोनीशियाई","ie":"ईन्टरलिंगुइ","ig":"ईग्बो","ii":"सिचुआन यी","ijo":"इजो","ik":"इनुपियाक्","ilo":"इलोको","inc":"भारतीय भाषा","ine":"इंडो-युरोपीय भाषा","inh":"इंगुश","io":"इडौ","ira":"ईरानी भाषा","iro":"इरोक्युओइयन भाषा","is":"आइसलैंडी","it":"इतालवी","iu":"इनूकीटूत्","ja":"जापानी","jbo":"लोज्बान","jgo":"Ngomba","jmc":"Machame","jpr":"जुदेओ-पर्शियन","jrb":"जुदेओ-अरेबिक","jv":"जावानीस","ka":"जॉर्जियाई","kaa":"कारा-कल्पक","kab":"कबाइल","kac":"काचिन","kaj":"ज्जु","kam":"कम्बा","kar":"कारेन","kaw":"कावी","kbd":"कबार्डियन","kbl":"Kanembu","kcg":"त्याप","kde":"Makonde","kea":"Kabuverdianu","kfo":"कोरो","kg":"कोंगो","kha":"खासी","khi":"खोइसन भाषा","kho":"खोतानीस","khq":"Koyra Chiini","ki":"किकुयू","kj":"क्वान्यामा","kk":"कज़ाख","kkj":"Kako","kl":"ग्रीनलैंडिक","kln":"Kalenjin","km":"कैम्बोडियन्","kmb":"किम्बन्दु","kn":"कन्नड़","ko":"कोरियाई","kok":"कोंकणी","kos":"कोसरैन","kpe":"क्पेल्लै","kr":"कनुरी","krc":"कराचय-बल्कार","krl":"करेलियन","kro":"क्रु","kru":"कुरूख","ks":"कश्मीरी","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"कुर्दी","kum":"कुमीक","kut":"कुतेनाई","kv":"कोमी","kw":"कोर्निश","ky":"किरघिज़","la":"लातिनी","lad":"लादीनो","lag":"Langi","lah":"लाह्न्डा","lam":"लाम्बा","lb":"लक्ष्ज़ेमबर्गिश","lez":"लेज़्घीयन","lg":"गांडा","li":"लिंबर्गिश","lkt":"Lakota","ln":"लिंगाला","lo":"लाओ","lol":"मोंगो","loz":"लोज़ी","lt":"लिथुएनियाई","lu":"ल्यूबा-कटांगा","lua":"ल्यूबा-लुलुआ","lui":"लुइसेनो","lun":"लुन्डा","luo":"ल्युओ","lus":"लुशाई","luy":"Luyia","lv":"लातवी","mad":"मादुरीस","maf":"Mafa","mag":"मगाही","mai":"मैथिली","mak":"मकासर","man":"मन्डिन्गो","map":"ऑस्ट्रोनेशियन","mas":"मसाई","mde":"Maba","mdf":"मोक्ष","mdr":"मंधार","men":"मेन्डे","mer":"Meru","mfe":"मोरीस्येन","mg":"मालागासी","mga":"मध्यकाल आइरिश","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"मार्शलीज़","mi":"माओरी","mic":"मिकमैक","min":"मिनांग्काबाउ","mis":"विविध भाषा","mk":"मैसिडोनियाई","mkh":"मॉन-ख्मेर भाषा","ml":"मलयालम","mn":"मंगोलीयाई","mnc":"मन्चु","mni":"मणिपूरी","mno":"मनोबो भाषा","mo":"मोलडावियन्","moh":"मोहौक","mos":"मोस्सी","mr":"मराठी","ms":"मलय","mt":"माल्टी","mua":"Mundang","mul":"विविध भाषाएँ","mun":"मुन्डा भाषा","mus":"क्रीक","mwl":"मिरांडी","mwr":"मारवाड़ी","my":"बर्मी","mye":"Myene","myn":"माया भाषा","myv":"एर्ज़या","na":"नाउरू","nah":"नहुआत्ल","nai":"उत्तरी अमेरीकी इंडियन भाषा","nap":"नीपोलिटन","naq":"Nama","nb":"नॉर्वेजियाई बोकमाल","nd":"उत्तरी देबेल","nds":"निचला जर्मन","ne":"नेपाली","new":"नेवाड़ी","ng":"डोन्गा","nia":"नियास","nic":"नाइगर-कोर्डोफैनियन भाषा","niu":"नियुआन","nl":"डच","nl-BE":"फ़्लेमिश","nmg":"Kwasio","nn":"नॉर्वेजियाई नाइनोर्स्क","nnh":"Ngiemboon","no":"नॉर्वेजियाई","nog":"नोगाई","non":"पुराना नॉर्स","nqo":"एन्को","nr":"दक्षिण देबेल","nso":"उत्तरी सोथो","nub":"न्युबियान भाषा","nus":"Nuer","nv":"नावाजो","nwc":"पारम्परिक नेवारी","ny":"न्यानजा","nym":"न्यामवेज़ी","nyn":"न्यानकोल","nyo":"न्योरो","nzi":"न्ज़ीमा","oc":"ओसीटान","oj":"ओजिब्वा","om":"ओरोमो","or":"उड़िया","os":"ओस्सेटिक","osa":"ओसेज","ota":"ओटोमान तुर्किश","oto":"ओटोमियन भाषा","pa":"पंजाबी","paa":"पापुआन भाषा","pag":"पंगासीनान","pal":"पाह्लावी","pam":"पाम्पान्गा","pap":"पापियामेन्टो","pau":"पलोउआन","peo":"पुरानी फारसी","phi":"फिलिपीन भाषा","phn":"फोएनिशियन","pi":"पाली","pl":"पोलिश","pon":"पोह्नपिएन","pra":"प्राकृत","pro":"पुरानी प्रोवेन्सल","ps":"पुश्तो","pt":"पुर्तगाली","pt-BR":"Brazilian Portuguese","pt-PT":"पुर्तगाली (यूरोप)","qu":"क्वेशुआ","raj":"राजस्थानी","rap":"रापानुई","rar":"रारोतोंगन","rm":"रोमान्श","rn":"रुन्दी","ro":"रोमानियाई","roa":"रोमांस भाषा","rof":"Rombo","rom":"रोमानी","root":"रूट","ru":"रूसी","rup":"अरोमानियन","rw":"किन्यारवाण्डा","rwk":"Rwa","sa":"संस्कृत","sad":"सन्डावे","sah":"याकूत","sai":"दक्षिण अमेरीकी इंडियन भाषा","sal":"सलीशन भाषा","sam":"सामैरिटन अरैमिक","saq":"Samburu","sas":"सासाक","sat":"संताली","sba":"Ngambay","sbp":"Sangu","sc":"सार्दिनियन","scn":"सिसिलियन","sco":"स्कॉट्स","sd":"सिन्धी","se":"नॉर्दन सामी","see":"Seneca","seh":"Sena","sel":"सेल्कप","sem":"सेमिटिक भाषा","ses":"Koyraboro Senni","sg":"सांगो","sga":"पुरानी आइरिश","sgn":"सांकेतिक भाषा","sh":"सेर्बो-क्रोएशन्","shi":"Tachelhit","shn":"शैन","shu":"Chadian Arabic","si":"सिंहली","sid":"सिदामो","sio":"सिउआन भाषा","sit":"चीनी-तिब्ब्ती भाषा","sk":"स्लोवाक","sl":"स्लोवेनियन्","sla":"स्लोवियाई भाषा","sm":"सामोन","sma":"दक्षिण सामी","smi":"सामी भाषा","smj":"ल्युल सामी","smn":"इनारी सामी","sms":"स्कोल्ट सामी","sn":"सोणा","snk":"सोनिन्के","so":"सोमाली","sog":"सोग्डिएन","son":"सोन्घाई","sq":"अल्बेनियन्","sr":"सर्बी","srn":"स्रानान टॉन्गो","srr":"सेरेर","ss":"स्वाती","ssa":"नील सहारी भाषा","ssy":"Saho","st":"सेसोथो","su":"सुंडानी","suk":"सुकुमा","sus":"सुसु","sux":"सुमेरियन","sv":"स्वीडिश","sw":"स्वाहिली","swb":"कोमोरियन","swc":"Congo Swahili","syc":"क्लासिकल सिरिएक","syr":"सिरिएक","ta":"तमिल","tai":"ताई भाषा","te":"तेलुगू","tem":"टिम्ने","teo":"Teso","ter":"तेरेनो","tet":"तेतुम","tg":"ताजिक","th":"थाई","ti":"तिग्रीन्या","tig":"टाइग्रे","tiv":"तिव","tk":"तुर्कमेन","tkl":"तोकेलाऊ","tl":"तागालोग","tlh":"क्लिंगन","tli":"त्लिंगित","tmh":"तामाशेक","tn":"सेत्स्वाना","to":"टोंगा","tog":"न्यासा टोन्गा","tpi":"टोक पिसिन","tr":"तुर्की","trv":"Taroko","ts":"सोंगा","tsi":"त्सिमीशियन","tt":"टाटर","tum":"तम्बूका","tup":"ट्यूपी भाषा","tut":"अल्तैक भाषा","tvl":"तुवालु","tw":"ट्वी","twq":"Tasawaq","ty":"ताहितियन","tyv":"तुवीनियन","tzm":"Central Atlas Tamazight","udm":"उदमुर्त","ug":"विग्वर","uga":"युगैरिटिक","uk":"यूक्रेनी","umb":"उम्बुन्डु","und":"अज्ञात भाषा","ur":"उर्दू","uz":"उज़्बेक","vai":"वाई","ve":"वेन्दा","vi":"वियतनामी","vo":"वोलापुक","vot":"वॉटिक","vun":"Vunjo","wa":"वाल्लून","wae":"Walser","wak":"वाकाशन भाषा","wal":"वलामो","war":"वारै","was":"वाशो","wen":"सॉर्बियन भाषा","wo":"वोलोफ़","xal":"काल्मिक","xh":"ख़ोसा","xog":"Soga","yao":"याओ","yap":"यापीस","yav":"Yangben","ybb":"Yemba","yi":"येहुदी","yo":"योरूबा","ypk":"यूपिक भाषा","yue":"कैंटोनीस","za":"ज़ुआंग","zap":"ज़ेपोटेक","zbl":"ब्लिसिम्बॉल्स","zen":"ज़ेनान्गा","zh":"चीनी","zh-Hans":"Simplified Chinese","zh-Hant":"Traditional Chinese","znd":"ज़न्डे","zu":"ज़ुलू","zun":"ज़ूनी","zxx":"कोई लिंग्विस्ट सामग्री नहीं","zza":"ज़ाज़ा"},"hr":{"aa":"afarski","ab":"abhaski","ace":"achinese","ach":"acoli","ada":"adangme","ady":"adigejski","ae":"avestan","af":"afrikaans","afa":"ostali afričko-azijski","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"akanski","akk":"akkadian","ale":"aleutski","alg":"algonquian","alt":"južni altai","am":"amharik","an":"aragonski","ang":"staroengleski","anp":"angika","apa":"apaški","ar":"arapski","ar-001":"Modern Standard Arabic","arc":"aramejski","arn":"araukanski","arp":"arapaho","art":"umjetni jezik","arw":"arawak","as":"asamski","asa":"asu","ast":"asturijski","ath":"athapascan","aus":"australski","av":"avarski","awa":"awadhi","ay":"aymara","az":"azerski","ba":"baškirski","bad":"banda","bai":"bamileke","bal":"baluchi","ban":"balinezijski","bas":"basa","bat":"baltički","bax":"bamunski","bbj":"ghomala","be":"bjeloruski","bej":"beja","bem":"bemba","ber":"berberski","bez":"bena","bfd":"bafut","bg":"bugarski","bh":"bihari","bho":"bhojpuri","bi":"bislama","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengalski","bnt":"bantu","bo":"tibetanski","br":"bretonski","bra":"braj","brx":"bodo","bs":"bosanski","bss":"akoose","btk":"batak","bua":"buriat","bug":"buginski","bum":"bulu","byn":"blin","byv":"medumba","ca":"katalonski","cad":"caddo","cai":"jezik srednjoameričkih Indijanaca","car":"karipski","cau":"kavkaski","cay":"cayuga","cch":"atsam","ce":"čečenski","ceb":"cebuano","cel":"keltski","cgg":"chiga","ch":"chamorro","chb":"chibcha","chg":"chagatai","chk":"chuukese","chm":"mari","chn":"chinook žargon","cho":"choctaw","chp":"chipewyan","chr":"čeroki","chy":"čejenski","ckb":"soranski kurdski","cmc":"chamic","co":"korzički","cop":"koptski","cpe":"engleski - na osnovi kreolskog ili pidgin","cpf":"francuski - na osnovi kreolskog ili pidgin","cpp":"kreolski ili pidgin na osnovi portugalskog","cr":"cree","crh":"krimski turski","crp":"kreolski ili pidgin","cs":"češki","csb":"kašupski","cu":"crkvenoslavenski","cus":"kušitski","cv":"chuvash","cy":"velški","da":"danski","dak":"dakota jezik","dar":"dargwa","dav":"taita","day":"dayak","de":"njemački","de-AT":"austrijski njemački","de-CH":"gornjonjemački (švicarski)","del":"delavarski","den":"slave","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"dravidski","dsb":"lužičkosrpski","dua":"duala","dum":"nizozemski, srednji","dv":"divehi","dyo":"jola-fonyi","dyu":"dyula","dz":"dzongkha","dzg":"dazaga","ebu":"embu","ee":"ewe","efi":"efik","egy":"staroegipatski","eka":"ekajuk","el":"grčki","elx":"elamitski","en":"engleski","en-AU":"engleski (australski)","en-CA":"kanadski engleski","en-GB":"engleski (britanski)","en-US":"engleski (američki)","enm":"engleski, srednji","eo":"esperanto","es":"španjolski","es-419":"španjolski (latinoamerički)","es-ES":"europski španjolski","et":"estonijski","eu":"baskijski","ewo":"ewondo","fa":"perzijski","fan":"fang","fat":"fanti","ff":"fulah","fi":"finski","fil":"filipino","fiu":"ugro-finski jezik","fj":"fidžijski","fo":"faroanski","fon":"fon","fr":"francuski","fr-CA":"kanadski francuski","fr-CH":"švicarski francuski","frm":"francuski, srednji","fro":"starofrancuski","frr":"sjevernofrizijski","frs":"istočnofrizijski","fur":"friulski","fy":"zapadnofrizijski","ga":"irski","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"škotski-galski","gem":"germanski","gez":"staroetiopski","gil":"gilbertski","gl":"galicijski","gmh":"njemački, srednji visoki","gn":"guarani","goh":"staronjemački, visoki","gon":"gondi","gor":"gorontalo","got":"gothic","grb":"grebo","grc":"starogrčki","gsw":"švicarski njemački","gu":"gujarati","guz":"gusii","gv":"manx","gwi":"gwich'in","ha":"hausa","hai":"haidi","haw":"havajski","he":"hebrejski","hi":"hindski","hil":"hiligaynon","him":"himachali","hit":"hetitski","hmn":"hmong","ho":"hiri motu","hr":"hrvatski","hsb":"gornjolužički","ht":"kreolski","hu":"mađarski","hup":"hupa","hy":"armenski","hz":"herero","ia":"interlingua","iba":"iban","ibb":"ibibio","id":"indonezijski","ie":"interligua","ig":"igbo","ii":"sichuan yi","ijo":"ijo","ik":"inupiaq","ilo":"iloko","inc":"indijski","ine":"indoeuropski","inh":"ingušetski","io":"ido","ira":"iranski","iro":"irokeški","is":"islandski","it":"talijanski","iu":"inuktitut","ja":"japanski","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"judejsko-perzijski","jrb":"judejsko-arapski","jv":"javanski","ka":"gruzijski","kaa":"kara-kalpak","kab":"kabyle","kac":"kachin","kaj":"kaje","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardian","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"zelenortski","kfo":"koro","kg":"kongo","kha":"khasi","khi":"kojsanski","kho":"khotanese","khq":"koyra chiini","ki":"kikuyu","kj":"kuanyama","kk":"kazaški","kkj":"kako","kl":"kalaallisut","kln":"kalenjin","km":"kmerski","kmb":"kimbundu","kn":"kannadski","ko":"korejski","kok":"konkani","kos":"naurski","kpe":"kpelle","kr":"kanuri","krc":"karachay-balkar","krl":"karelijski","kro":"kru","kru":"kuruški","ks":"kašmirski","ksb":"shambala","ksf":"bafia","ksh":"kelnski","ku":"kurdski","kum":"kumyk","kut":"kutenai","kv":"komi","kw":"kornski","ky":"kirgiški","la":"latinski","lad":"ladino","lag":"langi","lah":"lahnda","lam":"lamba","lb":"luksemburški","lez":"lezgiški","lg":"ganda","li":"limburgish","lkt":"Lakota","ln":"lingala","lo":"laoski","lol":"mongo","loz":"lozi","lt":"litvanski","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"luyia","lv":"latvijski","mad":"madurski","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makasar","man":"mandingo","map":"austronezijski","mas":"masajski","mde":"maba","mdf":"moksha","mdr":"mandar","men":"mende","mer":"meru","mfe":"mauricijski kreolski","mg":"malgaški","mga":"irski, srednji","mgh":"makhuwa-meetto","mgo":"Meta'","mh":"maršalski","mi":"maorski","mic":"micmac","min":"minangkabau","mis":"ostali jezici","mk":"makedonski","mkh":"mon-kmerski","ml":"malajalamski","mn":"mongolski","mnc":"mandžurski","mni":"manipurski","mno":"manobo","mo":"moldavski","moh":"mohawk","mos":"mossi","mr":"marathi","ms":"malajski","mt":"malteški","mua":"mundang","mul":"više jezika","mun":"munda","mus":"creek","mwl":"mirandski","mwr":"marwari","my":"burmanski","mye":"myene","myn":"majanski","myv":"mordvinski","na":"nauru","nah":"nahuatl","nai":"jezik sjevernoameričkih Indijanaca","nap":"napolitanski","naq":"nama","nb":"književni norveški","nd":"sjeverni ndebele","nds":"donjonjemački","ne":"nepalski","new":"newari","ng":"ndonga","nia":"nias","nic":"nigersko-kordofanski","niu":"niujski","nl":"nizozemski","nl-BE":"flamanski","nmg":"kwasio","nn":"novonorveški","nnh":"ngiemboon","no":"norveški","nog":"nogajski","non":"staronorveški","nqo":"n'ko","nr":"južni ndebele","nso":"sjeverni sotho","nub":"nubijski","nus":"nuer","nv":"navajo","nwc":"klasični newari","ny":"nyanja","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzima","oc":"okcitanski","oj":"ojibwa","om":"oromski","or":"orijski","os":"osetski","osa":"osage","ota":"turski - otomanski","oto":"otomijski","pa":"punjabi","paa":"papuanski","pag":"pangasinan","pal":"pahlavi","pam":"pampanga","pap":"papiamento","pau":"palauanski","peo":"staroperzijski","phi":"filipinski","phn":"fenički","pi":"pali","pl":"poljski","pon":"pohnpeian","pra":"prakrit","pro":"staroprovansalski","ps":"puštu","pt":"portugalski","pt-BR":"brazilski portugalski","pt-PT":"europski portugalski","qu":"quechua","raj":"rajasthani","rap":"rapa nui","rar":"rarotonški","rm":"romanš","rn":"rundi","ro":"rumunjski","roa":"romanski","rof":"rombo","rom":"romski","root":"korijenski","ru":"ruski","rup":"aromunski","rw":"kinyarwanda","rwk":"rwa","sa":"sanskrtski","sad":"sandawe","sah":"jakutski","sai":"jezik južnoameričkih Indijanaca","sal":"salishan","sam":"samarijanski aramejski","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sardski","scn":"sicilijski","sco":"škotski","sd":"sindhi","se":"južni sami","see":"seneca","seh":"sena","sel":"selkupski","sem":"semitic","ses":"koyraboro senni","sg":"sango","sga":"staroirski","sgn":"znakovni jezik","sh":"srpsko-hrvatski","shi":"tachelhit","shn":"shan","shu":"čadski arapski","si":"sinhaleški","sid":"sidamo","sio":"siouan","sit":"sino-tibetski","sk":"slovački","sl":"slovenski","sla":"slavenski","sm":"samoanski","sma":"sjeverni sami","smi":"sami","smj":"lule sami","smn":"inari sami","sms":"skolt sami","sn":"shona","snk":"soninke","so":"somalski","sog":"sogdien","son":"songhai","sq":"albanski","sr":"srpski","srn":"sranan tongo","srr":"serer","ss":"svati","ssa":"nilo-saharski","ssy":"saho","st":"sesotski","su":"sundanski","suk":"sukuma","sus":"susu","sux":"sumerski","sv":"švedski","sw":"svahili","swb":"komorski","swc":"kongoanski swahili","syc":"klasični sirski","syr":"sirijski","ta":"tamilski","tai":"tajski","te":"telugu","tem":"temne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tajik","th":"tajlandski","ti":"tigrinya","tig":"tigriški","tiv":"tiv","tk":"turkmenski","tkl":"tokelaunski","tl":"tagalog","tlh":"klingonski","tli":"tlingit","tmh":"tamashek","tn":"cvana","to":"tonganski","tog":"nyasa tonga","tpi":"tok pisin","tr":"turski","trv":"taroko","ts":"tsonga","tsi":"tsimshian","tt":"tatarski","tum":"tumbuka","tup":"tupi","tut":"altajski","tvl":"tuvaluanski","tw":"twi","twq":"tasawaq","ty":"tahićanski","tyv":"tuvinian","tzm":"marokanski tamazight","udm":"udmurtski","ug":"ujgurski","uga":"ugaritski","uk":"ukrajinski","umb":"umbundu","und":"nepoznati jezik","ur":"urdski","uz":"uzbečki","vai":"vai","ve":"venda","vi":"vijetnamski","vo":"volapük","vot":"votic","vun":"vunjo","wa":"valonski","wae":"walser","wak":"wakashan","wal":"walamo","war":"waray","was":"washo","wen":"lužički","wo":"wolof","xal":"kalmyk","xh":"xhosa","xog":"soga","yao":"yao","yap":"japski","yav":"yangben","ybb":"yemba","yi":"jidiš","yo":"joruba","ypk":"yupik","yue":"kantonski","za":"zhuang","zap":"zapotec","zbl":"blissymbols","zen":"zenaga","zh":"kineski","zh-Hans":"kineski (pojednostavljeni)","zh-Hant":"kineski (tradicionalni)","znd":"zande","zu":"zulu","zun":"zuni","zxx":"bez jezičnog sadržaja","zza":"zazaki"},"hu":{"aa":"afar","ab":"abház","ace":"achinéz","ach":"akoli","ada":"adangme","ady":"adyghe","ae":"avesztán","af":"afrikaans","afa":"afroázsiai nyelv","afh":"afrihili","agq":"agem","ain":"ainu","ak":"akan","akk":"akkád","ale":"aleut","alg":"algonkin nyelv","alt":"dél-altaji","am":"amhara","an":"aragonéz","ang":"óangol","anp":"angika","apa":"apacs nyelvek","ar":"arab","ar-001":"Modern Standard Arabic","arc":"arámi","arn":"araucani","arp":"arapaho","art":"mesterséges nyelv","arw":"aravak","as":"asszámi","asa":"asu","ast":"asztúr","ath":"atapaszkan nyelvek","aus":"ausztrál nyelvek","av":"avar","awa":"awádi","ay":"ajmara","az":"azeri","ba":"baskír","bad":"banda","bai":"bamileke nyelvek","bal":"balucsi","ban":"balinéz","bas":"basza","bat":"balti nyelv","bax":"bamun","bbj":"gomala","be":"belorusz","bej":"bedzsa","bem":"bemba","ber":"berber","bez":"bena","bfd":"bafut","bg":"bolgár","bh":"bihari","bho":"bodzspuri","bi":"bislama","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengáli","bnt":"bantu","bo":"tibeti","br":"breton","bra":"braj","brx":"bodo","bs":"bosnyák","bss":"koszi","btk":"batak","bua":"burját","bug":"buginéz","bum":"bulu","byn":"blin","byv":"medumba","ca":"katalán","cad":"caddo","cai":"egyéb közép-amerikai indián","car":"karib","cau":"egyéb kaukázusi","cay":"kajuga","cch":"atszam","ce":"csecsen","ceb":"cebui","cel":"egyéb kelta","cgg":"kiga","ch":"csamoró","chb":"csibcsa","chg":"csagatáj","chk":"csukéz","chm":"mari","chn":"csinuk zsargon","cho":"csoktó","chp":"csipevé","chr":"cseroki","chy":"csejen","ckb":"szoráni kurd","cmc":"csam nyelv","co":"korzikai","cop":"kopt","cpe":"egyéb angol alapú kreol és pidgin","cpf":"egyéb francia alapú kreol és pidgin","cpp":"portugál alapú kreol vagy pidgin","cr":"krí","crh":"krími tatár","crp":"kreol és pidzsin","cs":"cseh","csb":"kasub","cu":"egyházi szláv","cus":"kusita nyelv","cv":"csuvas","cy":"walesi","da":"dán","dak":"dakota","dar":"dargva","dav":"taita","day":"dajak","de":"német","de-AT":"osztrák német","de-CH":"svájci felnémet","del":"delavár","den":"szlevi","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"egyéb dravida","dsb":"alsó szorb","dua":"duala","dum":"közép holland","dv":"divehi","dyo":"jola-fonyi","dyu":"diula","dz":"butáni","dzg":"dazaga","ebu":"embu","ee":"eve","efi":"efik","egy":"óegyiptomi","eka":"ekadzsuk","el":"görög","elx":"elamit","en":"angol","en-AU":"ausztrál angol","en-CA":"kanadai angol","en-GB":"brit angol","en-US":"amerikai angol","enm":"közép angol","eo":"eszperantó","es":"spanyol","es-419":"latin-amerikai spanyol","es-ES":"európai spanyol","et":"észt","eu":"baszk","ewo":"evondo","fa":"perzsa","fan":"fang","fat":"fanti","ff":"fulani","fi":"finn","fil":"filippínó","fiu":"finnugor nyelv","fj":"fidzsi","fo":"feröeri","fon":"fon","fr":"francia","fr-CA":"kanadai francia","fr-CH":"svájci francia","frm":"közép francia","fro":"ófrancia","frr":"északi fríz","frs":"keleti fríz","fur":"friuli","fy":"fríz","ga":"ír","gaa":"ga","gay":"gajo","gba":"gbaja","gd":"skót gael","gem":"germán nyelv","gez":"geez","gil":"ikiribati","gl":"galíciai","gmh":"közép felső német","gn":"guarani","goh":"ófelső német","gon":"gondi","gor":"gorontalo","got":"gót","grb":"grebó","grc":"ógörög","gsw":"svájci német","gu":"gudzsarati","guz":"guszii","gv":"Man-szigeti","gwi":"gvicsin","ha":"hausza","hai":"haida","haw":"hawaii","he":"héber","hi":"hindi","hil":"hiligajnon","him":"himaháli","hit":"hittite","hmn":"hmong","ho":"hiri motu","hr":"horvát","hsb":"felső szorb","ht":"haiti","hu":"magyar","hup":"hupa","hy":"örmény","hz":"herero","ia":"interlingva","iba":"iban","ibb":"ibibió","id":"indonéz","ie":"interlingue","ig":"igbó","ii":"szecsuán ji","ijo":"idzsó","ik":"inupiak","ilo":"ilokó","inc":"egyéb indiai","ine":"indoeurópai nyelv","inh":"ingus","io":"idó","ira":"iráni","iro":"irokéz nyelvek","is":"izlandi","it":"olasz","iu":"inuktitut","ja":"japán","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"zsidó-perzsa","jrb":"zsidó-arab","jv":"jávai","ka":"grúz","kaa":"kara-kalpak","kab":"kabije","kac":"kacsin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardi","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"kabuverdianu","kfo":"koro","kg":"kongo","kha":"kaszi","khi":"egyéb koiszan","kho":"kotanéz","khq":"kojra-csíni","ki":"kikuju","kj":"kuanyama","kk":"kazah","kkj":"kakó","kl":"grönlandi","kln":"kalendzsin","km":"kambodzsai","kmb":"kimbundu","kn":"kannada","ko":"koreai","kok":"konkani","kos":"kosrei","kpe":"kpelle","kr":"kanuri","krc":"karacsáj-balkár","krl":"karelai","kro":"kru","kru":"kuruh","ks":"kásmíri","ksb":"sambala","ksf":"bafia","ksh":"kölsch","ku":"kurd","kum":"kumük","kut":"kutenai","kv":"komi","kw":"korni","ky":"kirgiz","la":"latin","lad":"ladino","lag":"langi","lah":"lahnda","lam":"lamba","lb":"luxemburgi","lez":"lezg","lg":"ganda","li":"limburgi","lkt":"Lakota","ln":"lingala","lo":"laoszi","lol":"mongó","loz":"lozi","lt":"litván","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"lujia","lv":"lett","mad":"madurai","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makaszar","man":"mandingó","map":"ausztronéz","mas":"masai","mde":"maba","mdf":"moksán","mdr":"mandar","men":"mende","mer":"meru","mfe":"mauritiusi kreol","mg":"málgas","mga":"közép ír","mgh":"makua-metó","mgo":"Meta'","mh":"marshalli","mi":"maori","mic":"mikmak","min":"minangkabau","mis":"egyéb nyelvek","mk":"macedón","mkh":"egyéb mon-khmer","ml":"malajálam","mn":"mongol","mnc":"mandzsu","mni":"manipuri","mno":"manobó nyelvek","mo":"moldvai","moh":"mohawk","mos":"moszi","mr":"marathi","ms":"maláj","mt":"máltai","mua":"mundang","mul":"többszörös nyelvek","mun":"munda nyelvek","mus":"krík","mwl":"mirandéz","mwr":"marvari","my":"burmai","mye":"myene","myn":"maja nyelvek","myv":"erzjány","na":"naurui","nah":"nahuati","nai":"észak-amerikai indián nyelv","nap":"nápolyi","naq":"nama","nb":"norvég bokmal","nd":"északi ndebele","nds":"alsónémet","ne":"nepáli","new":"nevari","ng":"ndonga","nia":"nias","nic":"niger-kordofan nyelv","niu":"niui","nl":"holland","nl-BE":"flamand","nmg":"ngumba","nn":"norvég nynorsk","nnh":"ngiemboon","no":"norvég","nog":"nogaj","non":"óskandináv","nqo":"n'kó","nr":"déli ndebele","nso":"északi szotó","nub":"núbiai nyelv","nus":"nuer","nv":"navahó","nwc":"klasszikus newari","ny":"nyanja","nym":"nyamvézi","nyn":"nyankole","nyo":"nyoró","nzi":"nzima","oc":"okszitán","oj":"ojibva","om":"oromói","or":"orija","os":"oszét","osa":"osage","ota":"ottomán török","oto":"otomi nyelv","pa":"pandzsábi","paa":"pápuai nyelv","pag":"pangaszinan","pal":"pahlavi","pam":"pampangan","pap":"papiamentó","pau":"palaui","peo":"óperzsa","phi":"Fülöp-szigeteki nyelv","phn":"főniciai","pi":"pali","pl":"lengyel","pon":"pohnpei","pra":"prakrit nyelvek","pro":"óprovánszi","ps":"pastu","pt":"portugál","pt-BR":"brazíliai portugál","pt-PT":"európai portugál","qu":"kecsua","raj":"radzsasztáni","rap":"rapanui","rar":"rarotongai","rm":"réto-román","rn":"kirundi","ro":"román","roa":"román nyelv","rof":"rombo","rom":"roma","root":"ősi","ru":"orosz","rup":"aromán","rw":"kiruanda","rwk":"rwo","sa":"szanszkrit","sad":"szandave","sah":"jakut","sai":"dél-amerikai indián nyelv","sal":"szelis nyelv","sam":"szamaritánus arámi","saq":"szamburu","sas":"sasak","sat":"szantáli","sba":"ngambay","sbp":"szangu","sc":"szardíniai","scn":"szicíliai","sco":"skót","sd":"szindhi","se":"északi számi","see":"szeneka","seh":"szena","sel":"szölkup","sem":"egyéb szemita","ses":"kojra-szenni","sg":"szangó","sga":"óír","sgn":"jelnyelv","sh":"szerbhorvát","shi":"tachelhit","shn":"san","shu":"csádi arab","si":"szingaléz","sid":"szidamó","sio":"sziú nyelvek","sit":"sinotibeti nyelv","sk":"szlovák","sl":"szlovén","sla":"szláv nyelv","sm":"szamoai","sma":"déli számi","smi":"lapp nyelv","smj":"lule számi","smn":"inar sami","sms":"koltta lapp","sn":"sona","snk":"szoninke","so":"szomáliai","sog":"sogdien","son":"szongai","sq":"albán","sr":"szerb","srn":"szranai tongó","srr":"szerer","ss":"sziszuati","ssa":"nílusi-szaharai nyelv","ssy":"szahó","st":"szeszotó","su":"szundanéz","suk":"szukuma","sus":"szuszu","sux":"sumér","sv":"svéd","sw":"szuahéli","swb":"comorei","swc":"kongói szuahéli","syc":"klasszikus szír","syr":"szíriai","ta":"tamil","tai":"thai nyelv","te":"telugu","tem":"temne","teo":"teszó","ter":"terenó","tet":"tetum","tg":"tadzsik","th":"thai","ti":"tigrinja","tig":"tigré","tiv":"tiv","tk":"türkmén","tkl":"tokelaui","tl":"tagalog","tlh":"klingon","tli":"tlingit","tmh":"tamasek","tn":"szecsuáni","to":"tonga","tog":"nyasa tonga","tpi":"tok pisin","tr":"török","trv":"tarokó","ts":"conga","tsi":"csimsiáni","tt":"tatár","tum":"tumbuka","tup":"tupi nyelv","tut":"altáji nyelv","tvl":"tuvalu","tw":"twi","twq":"szavák","ty":"tahiti","tyv":"tuvai","tzm":"közép-marokkói tamazigt","udm":"udmurt","ug":"ujgur","uga":"ugariti","uk":"ukrán","umb":"umbundu","und":"ismeretlen vagy érvénytelen nyelv","ur":"urdu","uz":"üzbég","vai":"vai","ve":"venda","vi":"vietnami","vo":"volapük","vot":"votják","vun":"vunjo","wa":"vallon","wae":"walser","wak":"vakas nyelv","wal":"valamo","war":"varaó","was":"vasó","wen":"szorb nyelvek","wo":"volof","xal":"kalmük","xh":"hosza","xog":"szoga","yao":"jaó","yap":"japi","yav":"jangben","ybb":"jemba","yi":"jiddis","yo":"joruba","ypk":"jupik nyelv","yue":"kantoni","za":"zsuang","zap":"zapoték","zbl":"Bliss jelképrendszer","zen":"zenaga","zh":"kínai","zh-Hans":"egyszerűsített kínai","zh-Hant":"hagyományos kínai","znd":"zande","zu":"zulu","zun":"zuni","zxx":"nincs nyelvészeti tartalom","zza":"zaza"},"id":{"aa":"Afar","ab":"Abkhaz","ace":"Aceh","ach":"Acoli","ada":"Adangme","ady":"Adygei","ae":"Avestan","af":"Afrikaans","afa":"Rumpun Bahasa Afro-Asia","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadia","ale":"Aleut","alg":"Bahasa Algonquia","alt":"Altai Selatan","am":"Amharik","an":"Aragon","ang":"Inggris Kuno","anp":"Angika","apa":"Rumpun Bahasa Apache","ar":"Arab","ar-001":"Modern Standard Arabic","arc":"Aram","arn":"Araukan","arp":"Arapaho","art":"Bahasa Buatan","arw":"Arawak","as":"Assam","asa":"Asu","ast":"Astur","ath":"Rumpun Bahasa Athapaska","aus":"Rumpun Bahasa Australia","av":"Avar","awa":"Awadhi","ay":"Aymara","az":"Azeri","ba":"Bashkir","bad":"Banda","bai":"Rumpun Bahasa Bamileke","bal":"Baluchi","ban":"Bali","bas":"Basa","bat":"Rumpun Bahasa Baltik","bax":"Bamun","bbj":"Ghomala","be":"Belarusia","bej":"Beja","bem":"Bemba","ber":"Rumpun Bahasa Berber","bez":"Bena","bfd":"Bafut","bg":"Bulgar","bh":"Bihari","bho":"Bhojpur","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengali","bnt":"Bantu","bo":"Tibet","br":"Breton","bra":"Braj","brx":"Bodo","bs":"Bosnia","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Bugis","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Katalan","cad":"Kado","cai":"India Amerika Tengah","car":"Karib","cau":"Rumpun Bahasa Kaukasia","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Sebuano","cel":"Rumpun Bahasa Keltik","cgg":"Kiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuuke","chm":"Mari","chn":"Jargon Chinook","cho":"Koktaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Kurdi Sorani","cmc":"Rumpun Bahasa Chamik","co":"Korsika","cop":"Koptik","cpe":"Kreol dan Pijin Lain berbasis Inggris","cpf":"Kreol dan Pijin Lain berbasis Prancis","cpp":"Kreol dan Pijin Lain berbasis Portugis","cr":"Kree","crh":"Tatar Krimea","crp":"Kreol dan Pijin Lain","cs":"Cheska","csb":"Kashubia","cu":"Bahasa Gereja Slavonia","cus":"Rumpun Bahasa Kush","cv":"Chuvash","cy":"Welsh","da":"Dansk","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"Jerman","de-AT":"Jerman Austria","de-CH":"Jerman Tinggi Swiss","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Rumpun Bahasa Dravidia","dsb":"Sorbia Rendah","dua":"Duala","dum":"Belanda Tengah","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Mesir Kuno","eka":"Ekajuk","el":"Yunani","elx":"Elam","en":"Inggris","en-AU":"Inggris Australia","en-CA":"Inggris Kanada","en-GB":"Inggris Inggris","en-US":"Inggris A.S.","enm":"Inggris Abad Pertengahan","eo":"Esperanto","es":"Spanyol","es-419":"Spanyol Amerika Latin","es-ES":"Spanyol Eropa","et":"Estonia","eu":"Bask","ewo":"Ewondo","fa":"Persia","fan":"Fang","fat":"Fanti","ff":"Fula","fi":"Suomi","fil":"Filipino","fiu":"Rumpun Bahasa Finno-Ugrik","fj":"Fiji","fo":"Faro","fon":"Fon","fr":"Prancis","fr-CA":"Prancis Kanada","fr-CH":"Prancis Swiss","frm":"Prancis Abad Pertengahan","fro":"Prancis Kuno","frr":"Frisia Utara","frs":"Frisia Timur","fur":"Friuli","fy":"Frisia Barat","ga":"Irlandia","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Gaelik Skotlandia","gem":"Rumpun Bahasa Jermanik","gez":"Geez","gil":"Gilbert","gl":"Galisia","gmh":"Jerman Abad Pertengahan","gn":"Guarani","goh":"Jerman Kuno","gon":"Gondi","gor":"Gorontalo","got":"Gothik","grb":"Grebo","grc":"Yunani Kuno","gsw":"Jerman Swiss","gu":"Gujarati","guz":"Gusii","gv":"Manx","gwi":"Gwich'in","ha":"Hausa","hai":"Haida","haw":"Hawaii","he":"Ibrani","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hitit","hmn":"Hmong","ho":"Hiri Motu","hr":"Kroasia","hsb":"Sorbia Atas","ht":"Haiti","hu":"Hungaria","hup":"Hupa","hy":"Armenia","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Bahasa Indonesia","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiak","ilo":"Iloko","inc":"Rumpun Bahasa Indik","ine":"Rumpun Bahasa Indo-Eropa","inh":"Ingushetia","io":"Ido","ira":"Rumpun Bahasa Iran","iro":"Rumpun Bahasa Iroquis","is":"Islandia","it":"Italia","iu":"Inuktitut","ja":"Jepang","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Ibrani-Persia","jrb":"Ibrani-Arab","jv":"Jawa","ka":"Georgia","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardi","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Rumpun Bahasa Khoisa","kho":"Khotan","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazakh","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"Kannada","ko":"Korea","kok":"Konkani","kos":"Kosre","kpe":"Kpelle","kr":"Kanuri","krc":"Karachai Balkar","krl":"Karelia","kro":"Kru","kru":"Kuruk","ks":"Kashmir","ksb":"Shambala","ksf":"Bafia","ksh":"Dialek Kolsch","ku":"Kurdi","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Kornish","ky":"Kirgiz","la":"Latin","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luksemburg","lez":"Lezghia","lg":"Ganda","li":"Limburgia","lkt":"Lakota","ln":"Lingala","lo":"Lao","lol":"Mongo","loz":"Lozi","lt":"Lituavi","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Lushai","luy":"Luyia","lv":"Latvi","mad":"Madura","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesia","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisien","mg":"Malagasi","mga":"Irlandia Abad Pertengahan","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshall","mi":"Maori","mic":"Mikmak","min":"Minangkabau","mis":"Bahasa Lain-lain","mk":"Makedonia","mkh":"Rumpun Bahasa Mon-Khmer","ml":"Malayalam","mn":"Mongolia","mnc":"Manchuria","mni":"Manipuri","mno":"Rumpun Bahasa Manobo","mo":"Moldavia","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Melayu","mt":"Malta","mua":"Mundang","mul":"Beberapa Bahasa","mun":"Rumpun Bahasa Munda","mus":"Bahasa Muskogee","mwl":"Miranda","mwr":"Marwari","my":"Burma","mye":"Myene","myn":"Rumpun Bahasa Maya","myv":"Eryza","na":"Nauru","nah":"Nahuatl","nai":"Rumpun Bahasa Indian Amerika Utara","nap":"Neapolitan","naq":"Nama","nb":"Bokmål Norwegia","nd":"Ndebele Utara","nds":"Jerman Rendah","ne":"Nepali","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Rumpun Bahasa Niger-Kordofania","niu":"Niuea","nl":"Belanda","nl-BE":"Flemish","nmg":"Kwasio","nn":"Nynorsk Norwegia","nnh":"Ngiemboon","no":"Norwegia","nog":"Nogai","non":"Norse Kuno","nqo":"N'Ko","nr":"Ndebele Selatan","nso":"Sotho Utara","nub":"Rumpun Bahasa Nubia","nus":"Nuer","nv":"Navajo","nwc":"Newari Klasik","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Ositania","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetia","osa":"Osage","ota":"Turki Osmani","oto":"Rumpun Bahasa Otomia","pa":"Punjabi","paa":"Rumpun Bahasa Papua","pag":"Pangasina","pal":"Pahlevi","pam":"Pampanga","pap":"Papiamento","pau":"Palau","peo":"Persia Kuno","phi":"Rumpun Bahasa Filipina","phn":"Funisia","pi":"Pali","pl":"Polski","pon":"Pohnpeia","pra":"Rumpun Bahasa Prakrit","pro":"Provencal Lama","ps":"Pashto","pt":"Portugis","pt-BR":"Portugis Brasil","pt-PT":"Portugis Eropa","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotonga","rm":"Reto-Roman","rn":"Rundi","ro":"Rumania","roa":"Rumpun Bahasa Roman","rof":"Rombo","rom":"Romani","root":"Root","ru":"Rusia","rup":"Makedo-Rumania","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sansekerta","sad":"Sandawe","sah":"Sakha","sai":"Rumpun Bahasa Indian Amerika Selatan","sal":"Rumpun Bahasa Salisha","sam":"Aram Samaria","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambai","sbp":"Sangu","sc":"Sardinia","scn":"Sisilia","sco":"Skotlandia","sd":"Sindhi","se":"Sami Utara","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Rumpun Bahasa Semit","ses":"Koyraboro Senni","sg":"Sango","sga":"Irlandia Kuno","sgn":"Bahasa Isyarat","sh":"Serbo-Kroasia","shi":"Tachelhit","shn":"Shan","shu":"Arab Suwa","si":"Sinhala","sid":"Sidamo","sio":"Rumpun Bahasa Sioux","sit":"Rumpun Bahasa Sino-Tibet","sk":"Slovak","sl":"Sloven","sla":"Rumpun Bahasa Slavik","sm":"Samoa","sma":"Sami Selatan","smi":"Rumpun Bahasa Sami","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somali","sog":"Sogdien","son":"Songhai","sq":"Albania","sr":"Serb","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Rumpun Bahasa Nilo-Sahara","ssy":"Saho","st":"Sotho Selatan","su":"Sunda","suk":"Sukuma","sus":"Susu","sux":"Sumeria","sv":"Swedia","sw":"Swahili","swb":"Komoria","swc":"Kongo Swahili","syc":"Suriah Klasik","syr":"Suriah","ta":"Tamil","tai":"Rumpun Bahasa Tai","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetun","tg":"Tajik","th":"Thai","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Turkmen","tkl":"Tokelau","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tonga","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Turki","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshia","tt":"Tatar","tum":"Tumbuka","tup":"Rumpun Bahasa Tupi","tut":"Altai","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahiti","tyv":"Tuvinia","tzm":"Tamazight Maroko Tengah","udm":"Udmurt","ug":"Uyghur","uga":"Ugarit","uk":"Ukraina","umb":"Umbundu","und":"Bahasa Tidak Dikenal","ur":"Urdu","uz":"Uzbek","vai":"Vai","ve":"Venda","vi":"Vietnam","vo":"Volapuk","vot":"Votia","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Rumpun Bahasa Wakasha","wal":"Walamo","war":"Warai","was":"Washo","wen":"Rumpun Bahasa Sorbia","wo":"Wolof","xal":"Kalmuk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapois","yav":"Yangben","ybb":"Yemba","yi":"Yiddish","yo":"Yoruba","ypk":"Rumpun Bahasa Yupik","yue":"Kanton","za":"Zhuang","zap":"Zapotek","zbl":"Blissymbol","zen":"Zenaga","zh":"China","zh-Hans":"China (Aksara Sederhana)","zh-Hant":"China (Aksara Tradisional)","znd":"Zande","zu":"Zulu","zun":"Zuni","zxx":"Tidak ada konten linguistik","zza":"Zaza"},"is":{"aa":"Afar","ab":"abkasíska","ace":"akkíska","ach":"acoli","ada":"adangme","ady":"adýge","ae":"avestíska","af":"afríkanska","afa":"afróasísk mál (önnur)","afh":"afríhílí","agq":"Aghem","ain":"Ainu","ak":"akan","akk":"akkadíska","ale":"aleúska","alg":"algonkvínsk mál","alt":"Southern Altai","am":"amharíska","an":"aragonska","ang":"fornenska","anp":"Angika","apa":"apatsjamál","ar":"arabíska","ar-001":"Modern Standard Arabic","arc":"arameíska","arn":"arákaníska","arp":"arapahó","art":"alþjóðamál (önnur)","arw":"aravakska","as":"assamska","asa":"Asu","ast":"astúríska","ath":"atapaskísk mál","aus":"áströlsk mál","av":"avaríska","awa":"avadí","ay":"aímara","az":"azeri","ba":"baskír","bad":"banda","bai":"bamílekemál","bal":"balúkí","ban":"balíska","bas":"basa","bat":"baltnesk mál (önnur)","bax":"Bamun","bbj":"Ghomala","be":"hvítrússneska","bej":"beja","bem":"bemba","ber":"berbamál","bez":"Bena","bfd":"Bafut","bg":"búlgarska","bh":"bíharísk mál","bho":"bojpúrí","bi":"bíslama","bik":"bíkol","bin":"bíní","bkm":"Kom","bla":"siksika","bm":"bambara","bn":"bengalska","bnt":"bantúmál","bo":"tíbeska","br":"bretónska","bra":"braí","brx":"Bodo","bs":"bosníska","bss":"Akoose","btk":"batak","bua":"búríat","bug":"búgíska","bum":"Bulu","byn":"blín","byv":"Medumba","ca":"katalónska","cad":"kaddó","cai":"indíánamál mið-ameríku (önnur)","car":"karíbamál","cau":"kákasusmál (önnur)","cay":"Cayuga","cch":"Atsam","ce":"tsjetsjenska","ceb":"kebúanó","cel":"keltnesk (önnur)","cgg":"Chiga","ch":"kamorró","chb":"síbsja","chg":"sjagataí","chk":"sjúkíska","chm":"marí","chn":"sínúk","cho":"sjoktá","chp":"sípevíska","chr":"Cherokee-mál","chy":"sjeyen","ckb":"sorani-kúrdíska","cmc":"kamísk mál","co":"korsíska","cop":"koptíska","cpe":"kreól- og pidginmál á enskum grunni","cpf":"kreól- og pidginmál á frönskum grunni","cpp":"kreól- og pidginmál á portúgölskum grunni","cr":"krí","crh":"krímtyrkneska","crp":"kreól- og pidginmál (önnur)","cs":"tékkneska","csb":"kasúbíska","cu":"kirkjuslavneska","cus":"kúsitísk mál (önnur)","cv":"sjúvas","cy":"velska","da":"danska","dak":"dakóta","dar":"dargva","dav":"Taita","day":"dajak","de":"þýska","de-AT":"austurrísk þýska","de-CH":"svissnesk háþýska","del":"delaver","den":"slavneska","dgr":"dogríb","din":"dinka","dje":"Zarma","doi":"dogrí","dra":"dravidísk mál (önnur)","dsb":"lágsorbneska","dua":"dúala","dum":"miðhollenska","dv":"dívehí","dyo":"Jola-Fonyi","dyu":"djúla","dz":"dsongka","dzg":"Dazaga","ebu":"Embu","ee":"ewe","efi":"efík","egy":"fornegypska","eka":"ekajúk","el":"gríska","elx":"elamít","en":"enska","en-AU":"áströlsk enska","en-CA":"kanadísk enska","en-GB":"bresk enska","en-US":"bandarísk enska","enm":"miðenska","eo":"esperantó","es":"spænska","es-419":"latnesk-amerísk spænska","es-ES":"evrópsk spænska","et":"eistneska","eu":"baskneska","ewo":"evondó","fa":"persneska","fan":"fang","fat":"fantí","ff":"fúla","fi":"finnska","fil":"filipínska","fiu":"finnskúgrísk mál (önnur)","fj":"fídjeyska","fo":"færeyska","fon":"fón","fr":"franska","fr-CA":"kanadísk franska","fr-CH":"svissnesk franska","frm":"miðfranska","fro":"fornfranska","frr":"norðurfrísneska","frs":"austurfrísneska","fur":"fríúlska","fy":"frísneska","ga":"írska","gaa":"ga","gay":"gajó","gba":"gbaja","gd":"skosk gelíska","gem":"germönsk mál (önnur)","gez":"gís","gil":"gilberska","gl":"gallegska","gmh":"miðháþýska","gn":"gvaraní","goh":"fornháþýska","gon":"gondí","gor":"gorontaló","got":"gotneska","grb":"gerbó","grc":"forngríska","gsw":"svissnesk þýska","gu":"gújaratí","guz":"Gusii","gv":"manx","gwi":"gvísín","ha":"hása","hai":"haída","haw":"havaíska","he":"hebreska","hi":"hindí","hil":"híligaínon","him":"hímasjalí","hit":"hettitíska","hmn":"hmong","ho":"hírímótú","hr":"króatíska","hsb":"hásorbneska","ht":"haítíska","hu":"ungverska","hup":"húpa","hy":"armenska","hz":"hereró","ia":"alþjóðatunga","iba":"íban","ibb":"Ibibio","id":"indónesíska","ie":"interlingve","ig":"ígbó","ii":"sísúanjí","ijo":"íjó","ik":"ínúpíak","ilo":"ílokó","inc":"indversk mál (önnur)","ine":"indóevrópsk mál (önnur)","inh":"ingús","io":"ídó","ira":"íranska","iro":"írókesk mál","is":"íslenska","it":"ítalska","iu":"inúktitút","ja":"japanska","jbo":"lojban","jgo":"Ngomba","jmc":"Machame","jpr":"gyðingapersneska","jrb":"gyðingaarabíska","jv":"javanska","ka":"georgíska","kaa":"karakalpak","kab":"kabíle","kac":"kasín","kaj":"Jju","kam":"kamba","kar":"karen","kaw":"kaví","kbd":"kabardíska","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"kongóska","kha":"kasí","khi":"koímál (önnur)","kho":"kotaska","khq":"Koyra Chiini","ki":"kíkújú","kj":"kúanjama","kk":"kasakska","kkj":"Kako","kl":"grænlenska","kln":"Kalenjin","km":"kmer","kmb":"kimbúndú","kn":"kannada","ko":"kóreska","kok":"konkaní","kos":"kosraska","kpe":"kpelle","kr":"kanúrí","krc":"karasaíbalkar","krl":"Karelian","kro":"krú","kru":"kúrúk","ks":"kasmírska","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"kúrdneska","kum":"kúmík","kut":"kútenaí","kv":"komíska","kw":"korníska","ky":"kirgiska","la":"latína","lad":"ladínska","lag":"Langi","lah":"landa","lam":"lamba","lb":"lúxemborgíska","lez":"lesgíska","lg":"ganda","li":"limbúrgíska","lkt":"Lakota","ln":"lingala","lo":"laó","lol":"mongó","loz":"lozi","lt":"litháíska","lu":"lúbakatanga","lua":"luba-lulua","lui":"lúisenó","lun":"lúnda","luo":"lúó","lus":"lúsaí","luy":"Luyia","lv":"lettneska","mad":"madúrska","maf":"Mafa","mag":"magahí","mai":"maítílí","mak":"makasar","man":"mandingó","map":"ástrónesíska","mas":"masaí","mde":"Maba","mdf":"moksa","mdr":"mandar","men":"mende","mer":"Meru","mfe":"morisyen","mg":"malagasíska","mga":"miðírska","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"marshallska","mi":"maórí","mic":"mikmak","min":"mínangkabá","mis":"ýmis mál","mk":"makedónska","mkh":"monkmermál (önnur)","ml":"malajalam","mn":"mongólska","mnc":"mansjú","mni":"manípúrí","mno":"manóbómál","mo":"moldóvska","moh":"móhíska","mos":"mossí","mr":"maratí","ms":"malaíska","mt":"maltneska","mua":"Mundang","mul":"margvísleg mál","mun":"múndamál","mus":"krík","mwl":"Mirandese","mwr":"marvarí","my":"burmneska","mye":"Myene","myn":"majamál","myv":"ersja","na":"nárúska","nah":"nahúatl","nai":"indíánamál norður-ameríku (önnur)","nap":"napólíska","naq":"Nama","nb":"norskt bókmál","nd":"norðurndebele","nds":"lágþýska; lágsaxneska","ne":"nepalska","new":"nevarí","ng":"ndonga","nia":"nías","nic":"nígerkordófanmál (önnur)","niu":"níveska","nl":"hollenska","nl-BE":"flæmska","nmg":"Kwasio","nn":"nýnorska","nnh":"Ngiemboon","no":"norska","nog":"nógaí","non":"norræna","nqo":"n’ko","nr":"suðurndebele","nso":"norðursótó","nub":"núbísk mál","nus":"Nuer","nv":"navahó","nwc":"Classical Newari","ny":"njanja; sísjeva; sjeva","nym":"njamvesí","nyn":"nyankole","nyo":"njóró","nzi":"nsíma","oc":"oksítaníska","oj":"ojibva","om":"oromo","or":"óría","os":"ossetíska","osa":"ósage","ota":"tyrkneska, ottóman","oto":"ótommál","pa":"púnjabí","paa":"papúsk mál (önnur)","pag":"pangasínmál","pal":"palaví","pam":"pampanga","pap":"papíamentó","pau":"paláska","peo":"fornpersneska","phi":"filippseysk mál (önnur)","phn":"fönikíska","pi":"palí","pl":"pólska","pon":"ponpeiska","pra":"prakrítmál","pro":"fornpróvensalska","ps":"pushto","pt":"portúgalska","pt-BR":"brasílísk portúgalska","pt-PT":"evrópsk portúgalska","qu":"kvesjúa","raj":"rajastaní","rap":"rapanúí","rar":"rarótongska","rm":"rómanska","rn":"rúndí","ro":"rúmenska","roa":"rómönsk mál (önnur)","rof":"Rombo","rom":"romaní","root":"rót","ru":"rússneska","rup":"Aromanian","rw":"kínjarvanda","rwk":"Rwa","sa":"sanskrít","sad":"sandave","sah":"jakút","sai":"indíánamál suður-ameríku (önnur)","sal":"salísmál","sam":"samversk arameíska","saq":"Samburu","sas":"sasak","sat":"santalí","sba":"Ngambay","sbp":"Sangu","sc":"sardínska","scn":"sikileyska","sco":"skoska","sd":"sindí","se":"norðursamíska","see":"Seneca","seh":"Sena","sel":"selkúp","sem":"semísk mál (önnur)","ses":"Koyraboro Senni","sg":"sangó","sga":"fornírska","sgn":"táknmál","sh":"serbókróatíska","shi":"Tachelhit","shn":"sjan","shu":"Chadian Arabic","si":"sinhala","sid":"sídamó","sio":"síúmál","sit":"Sino-Tibetan Language","sk":"slóvakíska","sl":"slóvenska","sla":"slavnesk mál (önnur)","sm":"samóska","sma":"suðursamíska","smi":"samísk mál (önnur)","smj":"lúlesamíska","smn":"enaresamíska","sms":"skoltesamíska","sn":"shóna","snk":"sóninke","so":"sómalska","sog":"sogdíen","son":"songhaí","sq":"albanska","sr":"serbneska","srn":"Sranan Tongo","srr":"serer","ss":"svatí","ssa":"nílósaharamál (önnur)","ssy":"Saho","st":"suðursótó","su":"súndanska","suk":"súkúma","sus":"súsú","sux":"súmerska","sv":"sænska","sw":"svahílí","swb":"Comorian","swc":"Congo Swahili","syc":"klassísk sýrlenska","syr":"sýrlenska","ta":"tamílska","tai":"taímál (önnur)","te":"telúgú","tem":"tímne","teo":"Teso","ter":"terenó","tet":"tetúm","tg":"tadsjikska","th":"taílenska","ti":"tígrinja","tig":"tígre","tiv":"tív","tk":"túrkmenska","tkl":"tókeláska","tl":"tagalog","tlh":"klingonska","tli":"tlingit","tmh":"tamasjek","tn":"tsúana","to":"tongverska","tog":"tongverska (nyasa)","tpi":"tokpisin","tr":"tyrkneska","trv":"Taroko","ts":"tsonga","tsi":"tsimsíska","tt":"tatarska","tum":"túmbúka","tup":"túpímál","tut":"altaísk mál (önnur)","tvl":"túvalúska","tw":"tví","twq":"Tasawaq","ty":"tahítíska","tyv":"túvínska","tzm":"Central Atlas Tamazight","udm":"údmúrt","ug":"uyghur","uga":"úgarítíska","uk":"úkraínska","umb":"úmbúndú","und":"óþekkt tungumál","ur":"úrdú","uz":"úsbekska","vai":"vaí","ve":"venda","vi":"víetnamska","vo":"Volapük","vot":"votíska","vun":"Vunjo","wa":"vallónska","wae":"Walser","wak":"vakasmál","wal":"valamó","war":"varaí","was":"vasjó","wen":"sorbnesk mál","wo":"volof","xal":"kalmúkska","xh":"sósa","xog":"Soga","yao":"jaó","yap":"japíska","yav":"Yangben","ybb":"Yemba","yi":"jiddíska","yo":"jórúba","ypk":"júpísk mál","yue":"Cantonese","za":"súang","zap":"sapótek","zbl":"blisstákn","zen":"senaga","zh":"kínverska","zh-Hans":"kínverska (einfölduð)","zh-Hant":"kínverska (hefðbundin)","znd":"sande","zu":"súlú","zun":"súní","zxx":"ekkert tungutengt efni","zza":"Zaza"},"it":{"aa":"afar","ab":"abkhazian","ace":"accinese","ach":"acioli","ada":"adangme","ady":"adyghe","ae":"avestan","af":"afrikaans","afa":"lingua afroasiatica","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"akan","akk":"accado","ale":"aleuto","alg":"lingue algonchine","alt":"altai meridionale","am":"amarico","an":"aragonese","ang":"inglese antico","anp":"angika","apa":"lingue apache","ar":"arabo","ar-001":"Modern Standard Arabic","arc":"aramaico","arn":"araucano","arp":"arapaho","art":"lingua artificiale","arw":"aruaco","as":"assamese","asa":"asu","ast":"asturiano","ath":"lingue athabaska","aus":"lingue australiane","av":"avaro","awa":"awadhi","ay":"aymara","az":"azero","ba":"baschiro","bad":"banda","bai":"lingue bamileke","bal":"beluci","ban":"balinese","bas":"basa","bat":"lingua baltica","bax":"bamun","bbj":"ghomala","be":"bielorusso","bej":"begia","bem":"wemba","ber":"berbero","bez":"bena","bfd":"bafut","bg":"bulgaro","bh":"bihari","bho":"bhojpuri","bi":"bislama","bik":"bicol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengalese","bnt":"bantu","bo":"tibetano","br":"bretone","bra":"braj","brx":"bodo","bs":"bosniaco","bss":"akoose","btk":"batak","bua":"buriat","bug":"bugi","bum":"bulu","byn":"blin","byv":"medumba","ca":"catalano","cad":"caddo","cai":"lingua indiana dell'America Centrale","car":"caribico","cau":"lingua caucasica","cay":"cayuga","cch":"atsam","ce":"ceceno","ceb":"cebuano","cel":"celtica altra lingua","cgg":"chiga","ch":"chamorro","chb":"chibcha","chg":"ciagataico","chk":"chuukese","chm":"mari","chn":"gergo chinook","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"cheyenne","ckb":"curdo sorani","cmc":"lingue chamic","co":"corso","cop":"copto","cpe":"creolo o pidgin basati sull'inglese","cpf":"creolo o pidgin basati sul francese","cpp":"creolo o pidgin basati sul portoghese","cr":"cree","crh":"turco crimeo","crp":"creolo o pidgin","cs":"ceco","csb":"kashubian","cu":"slavo della Chiesa","cus":"lingua cuscitica","cv":"chuvash","cy":"gallese","da":"danese","dak":"dakota","dar":"dargwa","dav":"taita","day":"dayak","de":"tedesco","de-AT":"tedesco austriaco","de-CH":"alto tedesco svizzero","del":"delaware","den":"slave","dgr":"dogrib","din":"dinca","dje":"zarma","doi":"dogri","dra":"lingua dravidica","dsb":"basso sorabo","dua":"duala","dum":"olandese medio","dv":"divehi","dyo":"jola-fony","dyu":"diula","dz":"dzongkha","dzg":"dazaga","ebu":"embu","ee":"ewe","efi":"efik","egy":"egiziano antico","eka":"ekajuka","el":"greco","elx":"elamitico","en":"inglese","en-AU":"inglese australiano","en-CA":"inglese canadese","en-GB":"inglese britannico","en-US":"inglese americano","enm":"inglese medio","eo":"esperanto","es":"spagnolo","es-419":"spagnolo latinoamericano","es-ES":"spagnolo europeo","et":"estone","eu":"basco","ewo":"ewondo","fa":"persiano","fan":"fang","fat":"fanti","ff":"fulah","fi":"finlandese","fil":"filippino","fiu":"lingua ungrofinnica","fj":"figiano","fo":"faroese","fon":"fon","fr":"francese","fr-CA":"francese canadese","fr-CH":"francese svizzero","frm":"francese medio","fro":"francese antico","frr":"frisone settentrionale","frs":"frisone orientale","fur":"friulano","fy":"frisone occidentale","ga":"irlandese","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"gaelico scozzese","gem":"lingua germanica","gez":"geez","gil":"gilbertese","gl":"galiziano","gmh":"tedesco medio alto","gn":"guarana","goh":"tedesco antico alto","gon":"gondi","gor":"gorontalo","got":"gotico","grb":"gerbo","grc":"greco antico","gsw":"tedesco svizzero","gu":"gujarati","guz":"gusii","gv":"manx","gwi":"gwichʼin","ha":"haussa","hai":"haida","haw":"hawaiano","he":"ebraico","hi":"hindi","hil":"hiligayna","him":"himachali","hit":"hittite","hmn":"hmong","ho":"hiri motu","hr":"croato","hsb":"alto sorabo","ht":"haitiano","hu":"ungherese","hup":"hupa","hy":"armeno","hz":"herero","ia":"interlingua","iba":"iban","ibb":"ibibio","id":"indonesiano","ie":"interlingue","ig":"igbo","ii":"sichuan yi","ijo":"ijo","ik":"inupiak","ilo":"ilocano","inc":"lingua indiana","ine":"lingua indoeuropea","inh":"ingush","io":"ido","ira":"iraniana","iro":"lingue irochesi","is":"islandese","it":"italiano","iu":"inuktitut","ja":"giapponese","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"giudeo persiano","jrb":"giudeo arabo","jv":"giavanese","ka":"georgiano","kaa":"kara-kalpak","kab":"kabyle","kac":"kachin","kaj":"kai","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardia","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"capoverdiano","kfo":"koro","kg":"kongo","kha":"khasi","khi":"lingua khoisan","kho":"khotanese","khq":"koyra chiini","ki":"kikuyu","kj":"kuanyama","kk":"kazako","kkj":"kako","kl":"kalaallisut","kln":"kalenjin","km":"khmer","kmb":"kimbundu","kn":"kannada","ko":"coreano","kok":"konkani","kos":"kosraean","kpe":"kpelle","kr":"kanuri","krc":"karachay-Balkar","krl":"careliano","kro":"kru","kru":"kurukh","ks":"kashmiri","ksb":"shambala","ksf":"bafia","ksh":"coloniese","ku":"curdo","kum":"kumyk","kut":"kutenai","kv":"komi","kw":"cornico","ky":"kirghiso","la":"latino","lad":"ladino","lag":"langi","lah":"lahnda","lam":"lamba","lb":"lussemburghese","lez":"lezghian","lg":"ganda","li":"limburgese","lkt":"Lakota","ln":"lingala","lo":"lao","lol":"lolo bantu","loz":"lozi","lt":"lituano","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"luyia","lv":"lettone","mad":"madurese","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makasar","man":"mandingo","map":"austronesiano","mas":"masai","mde":"maba","mdf":"moksha","mdr":"mandar","men":"mende","mer":"meru","mfe":"creolo mauriziano","mg":"malgascio","mga":"irlandese medio","mgh":"makhuwa-meetto","mgo":"Meta'","mh":"marshallese","mi":"maori","mic":"micmac","min":"menangkabau","mis":"lingue diverse","mk":"macedone","mkh":"lingua mon-khmer","ml":"malayalam","mn":"mongolo","mnc":"manchu","mni":"manipuri","mno":"manobo","mo":"moldavo","moh":"mohawk","mos":"mossi","mr":"marathi","ms":"malese","mt":"maltese","mua":"mundang","mul":"multilingua","mun":"lingua munda","mus":"creek","mwl":"mirandese","mwr":"marwari","my":"birmano","mye":"myene","myn":"lingue maya","myv":"erzya","na":"nauru","nah":"nahuatl","nai":"lingua indiana del Nord America","nap":"napoletano","naq":"nama","nb":"norvegese bokmal","nd":"ndebele del nord","nds":"basso tedesco","ne":"nepalese","new":"newari","ng":"ndonga","nia":"nias","nic":"lingua niger-cordofan","niu":"niue","nl":"olandese","nl-BE":"fiammingo belga","nmg":"kwasio","nn":"norvegese nynorsk","nnh":"ngiemboon","no":"norvegese","nog":"nogai","non":"norse antico","nqo":"n'ko","nr":"ndebele del sud","nso":"sotho del nord","nub":"nubiano","nus":"nuer","nv":"navajo","nwc":"newari classico","ny":"nyanja","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzima","oc":"occitano","oj":"ojibwa","om":"oromo","or":"oriya","os":"ossetico","osa":"osage","ota":"turco ottomano","oto":"lingue otomi","pa":"punjabi","paa":"lingua papuana","pag":"pangasinan","pal":"pahlavi","pam":"pampanga","pap":"papiamento","pau":"palau","peo":"persiano antico","phi":"lingua filippina","phn":"fenicio","pi":"pali","pl":"polacco","pon":"ponape","pra":"pracrito","pro":"provenzale antico","ps":"pashto","pt":"portoghese","pt-BR":"portoghese brasiliano","pt-PT":"portoghese europeo","qu":"quechua","raj":"rajasthani","rap":"rapanui","rar":"rarotonga","rm":"romancio","rn":"rundi","ro":"rumeno","roa":"lingua romanza","rof":"rombo","rom":"romani","root":"root","ru":"russo","rup":"arumeno","rw":"kinyarwanda","rwk":"rwa","sa":"sanscrito","sad":"sandawe","sah":"yakut","sai":"lingua indiana del Sud America","sal":"lingue salish","sam":"aramaico samaritano","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sardo","scn":"siciliano","sco":"scozzese","sd":"sindhi","se":"sami del nord","see":"seneca","seh":"sena","sel":"selkup","sem":"lingua semitica","ses":"koyraboro senni","sg":"sango","sga":"irlandese antico","sgn":"lingue sign","sh":"serbo-croato","shi":"tachelhit","shn":"shan","shu":"chadian arabic","si":"singalese","sid":"sidamo","sio":"lingue sioux","sit":"lingua sino-tibetana","sk":"slovacco","sl":"sloveno","sla":"lingua slava","sm":"samoano","sma":"sami del sud","smi":"lingua sami","smj":"sami lule","smn":"sami inari","sms":"sami skolt","sn":"shona","snk":"soninke","so":"somalo","sog":"sogdiano","son":"songhai","sq":"albanese","sr":"serbo","srn":"sranan tongo","srr":"serer","ss":"swati","ssa":"lingua nilo-sahariana","ssy":"saho","st":"sotho del sud","su":"sundanese","suk":"sukuma","sus":"susu","sux":"sumero","sv":"svedese","sw":"swahili","swb":"comoriano","swc":"congo swahili","syc":"siriaco classico","syr":"siriaco","ta":"tamil","tai":"lingua tailandese","te":"telugu","tem":"temne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tagicco","th":"thai","ti":"tigrinya","tig":"tigre","tiv":"tiv","tk":"turcomanno","tkl":"tokelau","tl":"tagalog","tlh":"klingon","tli":"tlingit","tmh":"tamashek","tn":"tswana","to":"tongano","tog":"nyasa del Tonga","tpi":"tok pisin","tr":"turco","trv":"taroko","ts":"tsonga","tsi":"tsimshian","tt":"tatarico","tum":"tumbuka","tup":"lingue tupi","tut":"lingua altaica","tvl":"tuvalu","tw":"ci","twq":"tasawaq","ty":"taitiano","tyv":"tuvinian","tzm":"tamazight","udm":"udmurt","ug":"uiguro","uga":"ugaritico","uk":"ucraino","umb":"mbundu","und":"lingua imprecisata","ur":"urdu","uz":"usbeco","vai":"vai","ve":"venda","vi":"vietnamita","vo":"volapük","vot":"voto","vun":"vunjo","wa":"vallone","wae":"walser","wak":"lingue wakash","wal":"walamo","war":"waray","was":"washo","wen":"sorabo","wo":"volof","xal":"kalmyk","xh":"xosa","xog":"soga","yao":"yao (bantu)","yap":"yapese","yav":"yangben","ybb":"yemba","yi":"yiddish","yo":"yoruba","ypk":"lingue yupik","yue":"cantonese","za":"zhuang","zap":"zapotec","zbl":"blissymbol","zen":"zenaga","zh":"cinese","zh-Hans":"cinese semplificato","zh-Hant":"cinese tradizionale","znd":"zande","zu":"zulu","zun":"zuni","zxx":"nessun contenuto linguistico","zza":"zaza"},"ja":{"aa":"アファル語","ab":"アブハズ語","ace":"アチェ語","ach":"アチョリ語","ada":"アダングメ語","ady":"アディゲ語","ae":"アヴェスタ語","af":"アフリカーンス語","afa":"セム・ハム諸語","afh":"アフリヒリ語","agq":"アゲム語","ain":"アイヌ語","ak":"アカン語","akk":"アッカド語","ale":"アレウト語","alg":"アルゴンキアン語族","alt":"南アルタイ語","am":"アムハラ語","an":"アラゴン語","ang":"古英語","anp":"アンギカ語","apa":"アパッチ語族","ar":"アラビア語","ar-001":"Modern Standard Arabic","arc":"アラム語","arn":"アラウカン語","arp":"アラパホー語","art":"人工言語","arw":"アラワク語","as":"アッサム語","asa":"アス語","ast":"アストゥリアス語","ath":"アサパスカン語族","aus":"オーストラリア諸語","av":"アヴァル語","awa":"アワディー語","ay":"アイマラ語","az":"アゼリー語","ba":"バシキール語","bad":"バンダ語","bai":"バミレケ語族","bal":"バルーチー語","ban":"バリ語","bas":"バサ語","bat":"バルト諸語","bax":"バムン語","bbj":"ゴーマラ語","be":"ベラルーシ語","bej":"ベジャ語","bem":"ベンバ語","ber":"ベルベル諸語","bez":"ベナ語","bfd":"バフット語","bg":"ブルガリア語","bh":"ビハール語","bho":"ボージュプリー語","bi":"ビスラマ語","bik":"ビコル語","bin":"ビニ語","bkm":"コム語","bla":"シクシカ語","bm":"バンバラ語","bn":"ベンガル語","bnt":"バントゥ諸語","bo":"チベット語","br":"ブルトン語","bra":"ブラジ語","brx":"ボド語","bs":"ボスニア語","bss":"アコース語","btk":"バタク語","bua":"ブリヤート語","bug":"ブギ語","bum":"ブル語","byn":"ビリン語","byv":"メドゥンバ語","ca":"カタロニア語","cad":"カドー語","cai":"中米インディアン諸語","car":"カリブ語","cau":"コーカサス諸語","cay":"カユーガ語","cch":"チャワイ語","ce":"チェチェン語","ceb":"セブアノ語","cel":"ケルト諸語","cgg":"チガ語","ch":"チャモロ語","chb":"チブチャ語","chg":"チャガタイ語","chk":"チューク語","chm":"マリ語","chn":"チヌーク混成語","cho":"チョクトー語","chp":"チペワイアン語","chr":"チェロキー語","chy":"シャイアン語","ckb":"クルド語[ソラニー]","cmc":"チャム語族","co":"コルシカ語","cop":"コプト語","cpe":"英語が基盤の混成語・混合語","cpf":"フランス語が基盤の混成語・混合語","cpp":"ポルトガル語が基盤の混成語・混合語","cr":"クリー語","crh":"クリミア・タタール語","crp":"その他の混成語・混合語","cs":"チェコ語","csb":"カシューブ語","cu":"教会スラブ語","cus":"クシュ諸語","cv":"チュヴァシ語","cy":"ウェールズ語","da":"デンマーク語","dak":"ダコタ語","dar":"ダルガン語","dav":"タイタ語","day":"ダヤク語","de":"ドイツ語","de-AT":"ドイツ語[オーストリア]","de-CH":"正統ドイツ語[スイス]","del":"デラウェア語","den":"スレイビー語","dgr":"ドグリブ語","din":"ディンカ語","dje":"ザルマ語","doi":"ドーグリー語","dra":"ドラヴィダ諸語","dsb":"低ソルビア語","dua":"ドゥアラ語","dum":"中世オランダ語","dv":"ディベヒ語","dyo":"ジョラ＝フォニィ語","dyu":"ジュラ語","dz":"ゾンカ語","dzg":"ダザガ語","ebu":"エンブ語","ee":"エウェ語","efi":"エフィク語","egy":"古代エジプト語","eka":"エカジュク語","el":"ギリシャ語","elx":"エラム語","en":"英語","en-AU":"オーストラリア英語","en-CA":"カナダ英語","en-GB":"イギリス英語","en-US":"アメリカ英語","enm":"中世英語","eo":"エスペラント語","es":"スペイン語","es-419":"スペイン語[ラテンアメリカ]","es-ES":"スペイン語[イベリア半島]","et":"エストニア語","eu":"バスク語","ewo":"エウォンド語","fa":"ペルシア語","fan":"ファング語","fat":"ファンティー語","ff":"フラニ語","fi":"フィンランド語","fil":"フィリピノ語","fiu":"フィン・ウゴル諸語","fj":"フィジー語","fo":"フェロー語","fon":"フォン語","fr":"フランス語","fr-CA":"フランス語[カナダ]","fr-CH":"フランス語[スイス]","frm":"中期フランス語","fro":"古フランス語","frr":"北フリジア語","frs":"東フリジア語","fur":"フリウリ語","fy":"西フリジア語","ga":"アイルランド語","gaa":"ガ語","gay":"ガヨ語","gba":"バヤ語","gd":"スコットランド・ゲール語","gem":"ゲルマン諸語","gez":"ゲエズ語","gil":"キリバス語","gl":"ガリシア語","gmh":"中高ドイツ語","gn":"グアラニー語","goh":"古高ドイツ語","gon":"ゴーンディー語","gor":"ゴロンタロ語","got":"ゴート語","grb":"グレボ語","grc":"古代ギリシャ語","gsw":"スイスドイツ語","gu":"グジャラート語","guz":"グシイ語","gv":"マン島語","gwi":"グウィッチン語","ha":"ハウサ語","hai":"ハイダ語","haw":"ハワイ語","he":"ヘブライ語","hi":"ヒンディー語","hil":"ヒリガイノン語","him":"ヒマチャル語","hit":"ヒッタイト語","hmn":"フモン語","ho":"ヒリモツ語","hr":"クロアチア語","hsb":"上ソルビア語","ht":"ハイチ語","hu":"ハンガリー語","hup":"アタパスカ語","hy":"アルメニア語","hz":"ヘレロ語","ia":"インターリングア","iba":"イバン語","ibb":"イビビオ語","id":"インドネシア語","ie":"インターリング","ig":"イボ語","ii":"四川イ語","ijo":"イジョー語","ik":"イヌピアック語","ilo":"イロカノ語","inc":"インド諸語","ine":"印欧諸語","inh":"イングーシ語","io":"イド語","ira":"イラン語","iro":"イロコイ語族","is":"アイスランド語","it":"イタリア語","iu":"イヌクウティトット語","ja":"日本語","jbo":"ロジバン語","jgo":"Ngomba","jmc":"マチャメ語","jpr":"ユダヤ・ペルシア語","jrb":"ユダヤ・アラビア語","jv":"ジャワ語","ka":"グルジア語","kaa":"カラカルパク語","kab":"カビル語","kac":"カチン語","kaj":"カジェ語","kam":"カンバ語","kar":"カレン諸語","kaw":"カウィ語","kbd":"カバルド語","kbl":"カネンブ語","kcg":"カタブ語","kde":"マコンデ語","kea":"カーボベルデ・クレオール語","kfo":"コロ語","kg":"コンゴ語","kha":"カシ語","khi":"コイサン諸語","kho":"コータン語","khq":"コイラ・チーニ語","ki":"キクユ語","kj":"クワニャマ語","kk":"カザフ語","kkj":"カコ語","kl":"グリーンランド語","kln":"カレンジン語","km":"クメール語","kmb":"キンブンド語","kn":"カンナダ語","ko":"韓国語","kok":"コンカニ語","kos":"コスラエ語","kpe":"クペレ語","kr":"カヌリ語","krc":"カラチャイ語","krl":"カレリア語","kro":"クルー諸語","kru":"クルク語","ks":"カシミール語","ksb":"サンバー語","ksf":"バフィア語","ksh":"ケルン語","ku":"クルド語","kum":"クムク語","kut":"クテナイ語","kv":"コミ語","kw":"コーンウォール語","ky":"キルギス語","la":"ラテン語","lad":"ラディノ語","lag":"ランギ語","lah":"ラフンダー語","lam":"ランバ語","lb":"ルクセンブルク語","lez":"レズギ語","lg":"ガンダ語","li":"リンブルフ語","lkt":"Lakota","ln":"リンガラ語","lo":"ラオ語","lol":"モンゴ語","loz":"ロジ語","lt":"リトアニア語","lu":"ルバ・カタンガ語","lua":"ルバ・ルルア語","lui":"ルイセーニョ語","lun":"ルンダ語","luo":"ルオ語","lus":"ルシャイ語","luy":"ルヒヤ語","lv":"ラトビア語","mad":"マドゥラ語","maf":"マファ語","mag":"マガヒー語","mai":"マイティリー語","mak":"マカッサル語","man":"マンディンゴ語","map":"オーストロネシア諸語","mas":"マサイ語","mde":"マバ語","mdf":"モクシャ語","mdr":"マンダル語","men":"メンデ語","mer":"メル語","mfe":"モーリシャス・クレオール語","mg":"マダガスカル語","mga":"中期アイルランド語","mgh":"マクア・ミート語","mgo":"Meta'","mh":"マーシャル語","mi":"マオリ語","mic":"ミクマク語","min":"ミナンカバウ語","mis":"その他の言語","mk":"マケドニア語","mkh":"モン・クメール諸語","ml":"マラヤーラム語","mn":"モンゴル語","mnc":"満州語","mni":"マニプリ語","mno":"マノボ語族","mo":"モルダビア語","moh":"モーホーク語","mos":"モシ語","mr":"マラーティー語","ms":"マレー語","mt":"マルタ語","mua":"ムンダン語","mul":"複数言語","mun":"ムンダ語族","mus":"クリーク語","mwl":"ミランダ語","mwr":"マールワーリー語","my":"ビルマ語","mye":"ミエネ語","myn":"マヤ語族","myv":"エルジャ語","na":"ナウル語","nah":"ナワトル語","nai":"北米インディアン諸語","nap":"ナポリ語","naq":"ナマ語","nb":"ノルウェー語[ブークモール]","nd":"北ンデベレ語","nds":"低地ドイツ語","ne":"ネパール語","new":"ネワール語","ng":"ンドンガ語","nia":"ニアス語","nic":"ニジェール・コルドファン諸語","niu":"ニウーエイ語","nl":"オランダ語","nl-BE":"フレミッシュ語","nmg":"クワシオ語","nn":"ノルウェー語[ニーノシュク]","nnh":"ンジエムブーン語","no":"ノルウェー語","nog":"ノガイ語","non":"古ノルド語","nqo":"ンコ語","nr":"南ンデベレ語","nso":"北部ソト語","nub":"ヌビア語族","nus":"ヌエル語","nv":"ナバホ語","nwc":"古典ネワール語","ny":"ニャンジャ語","nym":"ニャムウェジ語","nyn":"ニャンコレ語","nyo":"ニョロ語","nzi":"ンゼマ語","oc":"オック語","oj":"オジブウェー語","om":"オロモ語","or":"オリヤー語","os":"オセット語","osa":"オセージ語","ota":"オスマントルコ語","oto":"オトミ語族","pa":"パンジャブ語","paa":"パプア諸語","pag":"パンガシナン語","pal":"パフラヴィー語","pam":"パンパンガ語","pap":"パピアメント語","pau":"パラオ語","peo":"古代ペルシア語","phi":"フィリピン諸語","phn":"フェニキア語","pi":"パーリ語","pl":"ポーランド語","pon":"ポンペイ語","pra":"プラークリット諸語","pro":"古期プロバンス語","ps":"パシュトゥ語","pt":"ポルトガル語","pt-BR":"ポルトガル語[ブラジル]","pt-PT":"ポルトガル語[イベリア半島]","qu":"ケチュア語","raj":"ラージャスターン語","rap":"ラパヌイ語","rar":"ラロトンガ語","rm":"ロマンシュ語","rn":"ルンディ語","ro":"ルーマニア語","roa":"ロマンス諸語","rof":"ロンボ語","rom":"ロマーニー語","root":"ルート","ru":"ロシア語","rup":"アルーマニア語","rw":"ルワンダ語","rwk":"ルワ語","sa":"サンスクリット語","sad":"サンダウェ語","sah":"ヤクート語","sai":"南米インディアン諸語","sal":"セイリッシュ語族","sam":"サマリア・アラム語","saq":"サンブル語","sas":"ササク語","sat":"サンターリー語","sba":"ンガムバイ語","sbp":"サング語","sc":"サルデーニャ語","scn":"シチリア語","sco":"スコットランド語","sd":"シンド語","se":"北サーミ語","see":"セネカ語","seh":"セナ語","sel":"セリクプ語","sem":"セム諸語","ses":"コイラボロ・センニ語","sg":"サンゴ語","sga":"古期アイルランド語","sgn":"手話","sh":"セルボ・クロアチア語","shi":"タシルハイト語","shn":"シャン語","shu":"チャド・アラビア語","si":"シンハラ語","sid":"シダモ語","sio":"スー諸語","sit":"シナ・チベット諸語","sk":"スロバキア語","sl":"スロベニア語","sla":"スラブ諸語","sm":"サモア語","sma":"南サーミ語","smi":"サーミ諸語","smj":"ルレ・サーミ語","smn":"イナリ・サーミ語","sms":"スコルト・サーミ語","sn":"ショナ語","snk":"ソニンケ語","so":"ソマリ語","sog":"ソグド語","son":"ソンガイ語","sq":"アルバニア語","sr":"セルビア語","srn":"スリナム語","srr":"セレル語","ss":"スワジ語","ssa":"ナイル・サハラ諸語","ssy":"サホ語","st":"南部ソト語","su":"スンダ語","suk":"スクマ語","sus":"スス語","sux":"シュメール語","sv":"スウェーデン語","sw":"スワヒリ語","swb":"コモロ語","swc":"コンゴ・スワヒリ語","syc":"古典シリア語","syr":"シリア語","ta":"タミル語","tai":"タイ諸語","te":"テルグ語","tem":"テムネ語","teo":"テソ語","ter":"テレーノ語","tet":"テトゥン語","tg":"タジク語","th":"タイ語","ti":"ティグリニア語","tig":"ティグレ語","tiv":"ティブ語","tk":"トルクメン語","tkl":"トケラウ語","tl":"タガログ語","tlh":"クリンゴン語","tli":"トリンギット語","tmh":"タマシェク語","tn":"ツワナ語","to":"トンガ語","tog":"トンガ語[ニアサ]","tpi":"トク・ピシン語","tr":"トルコ語","trv":"タロコ語","ts":"ツォンガ語","tsi":"チムシュ語","tt":"タタール語","tum":"トゥンブカ語","tup":"トゥピ語族","tut":"アルタイ諸語","tvl":"ツバル語","tw":"トウィ語","twq":"タサワク語","ty":"タヒチ語","tyv":"トゥヴァ語","tzm":"中央アトラス・タマジクト語","udm":"ウドムルト語","ug":"ウイグル","uga":"ウガリト語","uk":"ウクライナ語","umb":"ムブンドゥ語","und":"言語不明","ur":"ウルドゥー語","uz":"ウズベク語","vai":"ヴァイ語","ve":"ベンダ語","vi":"ベトナム語","vo":"ヴォラピュク語","vot":"ヴォート語","vun":"ヴンジョ語","wa":"ワロン語","wae":"ヴァリス語","wak":"ワカシ語族","wal":"ウォライタ語","war":"ワライ語","was":"ワショ語","wen":"ソルビア語族","wo":"ウォロフ語","xal":"カルムイク語","xh":"コサ語","xog":"ソガ語","yao":"ヤオ語","yap":"ヤップ語","yav":"ヤンベン語","ybb":"イエンバ語","yi":"イディッシュ語","yo":"ヨルバ語","ypk":"ユピック語族","yue":"広東語","za":"チワン語","zap":"サポテカ語","zbl":"ブリスシンボル","zen":"ゼナガ語","zh":"中国語","zh-Hans":"簡体中国語","zh-Hant":"繁体中国語","znd":"ザンデ語","zu":"ズールー語","zun":"ズニ語","zxx":"言語的内容なし","zza":"ザザ語"},"ko":{"aa":"아파르어","ab":"압카즈어","ace":"아체어","ach":"아콜리어","ada":"아당메어","ady":"아닥헤어","ae":"아베스타어","af":"남아공 공용어","afa":"아시아-아프리카어 (기타)","afh":"아프리히리어","agq":"아그햄어","ain":"아이누어","ak":"아칸어","akk":"아카드어","ale":"알류트어","alg":"알공킨어족","alt":"남부 알타이어","am":"암하라어","an":"아라곤어","ang":"고대 영어","anp":"앙가어","apa":"아파치어","ar":"아랍어","ar-001":"Modern Standard Arabic","arc":"아람어","arn":"아라우칸어","arp":"아라파호어","art":"기계어 (기타)","arw":"아라와크어","as":"아샘어","asa":"아수어","ast":"아스투리아어","ath":"아타파스카어군","aus":"오스트레일리아어족","av":"아바릭어","awa":"아와히어","ay":"아이마라어","az":"아제리어","ba":"바슈키르어","bad":"반다어","bai":"바밀레케어족","bal":"발루치어","ban":"발리어","bas":"바사어","bat":"발트어 (기타)","bax":"바문어","bbj":"고말라어","be":"벨로루시어","bej":"베자어","bem":"벰바어","ber":"베르베르어","bez":"베나어","bfd":"바푸트어","bg":"불가리아어","bh":"비하르어","bho":"호즈푸리어","bi":"비슬라마어","bik":"비콜어","bin":"비니어","bkm":"콤어","bla":"식시카어","bm":"밤바라어","bn":"벵골어","bnt":"반투어","bo":"티베트어","br":"브르타뉴어","bra":"브라지어","brx":"보도어","bs":"보스니아어","bss":"아쿠즈어","btk":"바타크어","bua":"부리아타","bug":"부기어","bum":"불루어","byn":"브린어","byv":"메둠바어","ca":"카탈로니아어","cad":"카도어","cai":"중앙 아메리카 인디안어 (기타)","car":"카리브어","cau":"카프카스어 (기타)","cay":"카유가어","cch":"아삼어","ce":"체첸어","ceb":"세부아노어","cel":"켈트어 (기타)","cgg":"치가어","ch":"차모로어","chb":"치브차어","chg":"차가타이어","chk":"추크어","chm":"마리어","chn":"치누크어와 영어 프랑스어의 혼성어","cho":"촉토어","chp":"치페우얀","chr":"체로키어","chy":"샤이엔어","ckb":"소라니 쿠르드어","cmc":"참어군","co":"코르시카어","cop":"콥트어","cpe":"크리올어 및 피진어 (영어를 기반으로 한 기타)","cpf":"크리올어 및 피진어 (프랑스어를 기반으로 한 기타)","cpp":"크리올어 및 피진어 (포르투갈어를 기반으로 한 기타)","cr":"크리어","crh":"크리민 터키어; 크리민 타타르어","crp":"크리올어 및 피진어 (기타)","cs":"체코어","csb":"카슈비아어","cu":"교회 슬라브어","cus":"쿠시어족","cv":"추바시어","cy":"웨일스어","da":"덴마크어","dak":"다코타어","dar":"다르그와어","dav":"타이타어","day":"다야크어","de":"독일어","de-AT":"독일어 (오스트리아)","de-CH":"고지 독일어 (스위스)","del":"델라웨어어","den":"슬라브어","dgr":"도그리브어","din":"딩카어","dje":"자르마어","doi":"도그리어","dra":"드라비다어 (기타)","dsb":"저지 소르비아어","dua":"드와라어","dum":"중세 네덜란드어","dv":"디베히어","dyo":"졸라 포니어","dyu":"드율라어","dz":"종카어","dzg":"다장가어","ebu":"엠부어","ee":"에웨어","efi":"이픽어","egy":"이집트어 (고대)","eka":"이카죽어","el":"그리스어","elx":"엘람어","en":"영어","en-AU":"영어(호주)","en-CA":"영어 (캐나다)","en-GB":"영어 (영국식)","en-US":"영어 (미국식)","enm":"영어, 중세","eo":"에스페란토어","es":"스페인어","es-419":"중남미 스페인어","es-ES":"유럽식 스페인어","et":"에스토니아어","eu":"바스크어","ewo":"이원도어","fa":"페르시아어","fan":"팡그어","fat":"판티어","ff":"풀라어","fi":"핀란드어","fil":"필리핀어","fiu":"피노우그리아어 (기타)","fj":"피지어","fo":"페로어","fon":"폰어","fr":"프랑스어","fr-CA":"프랑스어 (캐나다)","fr-CH":"프랑스어 (스위스)","frm":"중세 프랑스어","fro":"고대 프랑스어","frr":"북부 프리슬란드어","frs":"동부 프리슬란드어","fur":"프리우리안어","fy":"프리지아어","ga":"아일랜드어","gaa":"가어","gay":"가요어","gba":"그바야어","gd":"스코틀랜드 게일어","gem":"독일어 (기타)","gez":"게이즈어","gil":"키리바시어","gl":"갈리시아어","gmh":"중세 고지 독일어","gn":"과라니어","goh":"고대 고지 독일어","gon":"곤디어","gor":"고론탈로어","got":"고트어","grb":"게르보어","grc":"그리스어, 고대","gsw":"독일어(스위스)","gu":"구자라트어","guz":"구시어","gv":"맹크스어","gwi":"그위친어","ha":"하우사어","hai":"하이다어","haw":"하와이어","he":"히브리어","hi":"힌디어","hil":"헤리가뇬어","him":"히마차리어","hit":"하타이트어","hmn":"히몸어","ho":"히리 모투어","hr":"크로아티아어","hsb":"고지 소르비아어","ht":"아이티어","hu":"헝가리어","hup":"후파어","hy":"아르메니아어","hz":"헤레로어","ia":"인테르링구아 (국제보조어협회)","iba":"이반어","ibb":"이비비오어","id":"인도네시아어","ie":"인테르링구에","ig":"이그보어","ii":"쓰촨 이어","ijo":"이조어","ik":"이누피아크어","ilo":"이로코어","inc":"인도어 (기타)","ine":"인도유럽어 (기타)","inh":"인귀시어","io":"이도어","ira":"이란어","iro":"이러쿼이어","is":"아이슬란드어","it":"이탈리아어","iu":"이눅티투트어","ja":"일본어","jbo":"로반어","jgo":"Ngomba","jmc":"마차메어","jpr":"유대-페르시아어","jrb":"유대-아라비아어","jv":"자바어","ka":"그루지야어","kaa":"카라칼파크어","kab":"커바일어","kac":"카친어","kaj":"까꼬토끄어","kam":"캄바어","kar":"카렌어","kaw":"카위어","kbd":"카바르디어","kbl":"카넴부어","kcg":"티얍어","kde":"마콘데어","kea":"크리올어","kfo":"코로어","kg":"콩고어","kha":"카시어","khi":"코이산어 (기타)","kho":"호탄어","khq":"코이라 친니어","ki":"키쿠유어","kj":"쿠안야마어","kk":"카자흐어","kkj":"카코어","kl":"그린란드어","kln":"칼렌진어","km":"캄보디아어","kmb":"킴분두어","kn":"카나다어","ko":"한국어","kok":"코카니어","kos":"코스라이엔어","kpe":"크펠레어","kr":"칸누리어","krc":"카라챠이-발카르어","krl":"카렐리야어","kro":"크루어","kru":"쿠르크어","ks":"카슈미르어","ksb":"샴발라어","ksf":"바피아어","ksh":"콜로그니안어","ku":"쿠르드어","kum":"쿠믹어","kut":"쿠테네어","kv":"코미어","kw":"콘월어","ky":"키르기스어","la":"라틴어","lad":"라디노어","lag":"랑기어","lah":"라한다어","lam":"람바어","lb":"룩셈부르크어","lez":"레즈기안어","lg":"간다어","li":"림버거어","lkt":"Lakota","ln":"링갈라어","lo":"라오어","lol":"몽구어","loz":"로지어","lt":"리투아니아어","lu":"루바-카탄가어","lua":"루바-룰루아어","lui":"루이세노어","lun":"룬다어","luo":"루오어","lus":"루샤이어","luy":"루야어","lv":"라트비아어","mad":"마두라어","maf":"마파어","mag":"마가히","mai":"마이틸리","mak":"마카사어","man":"만딩고어","map":"남도어","mas":"마사이어","mde":"마바어","mdf":"모크샤어","mdr":"만다르어","men":"멘데어","mer":"메루어","mfe":"모리스얀어","mg":"마다가스카르어","mga":"아일랜드어, 중세","mgh":"마크후와-메토어","mgo":"Meta'","mh":"마셜제도어","mi":"마오리어","mic":"미크맥어","min":"미낭카바우","mis":"기타 언어","mk":"마케도니아어","mkh":"몬크메르어 (기타)","ml":"말라얄람어","mn":"몽고어","mnc":"만주어","mni":"마니푸리어","mno":"마노보어","mo":"몰도바어","moh":"모호크어","mos":"모시어","mr":"마라티어","ms":"말레이어","mt":"몰타어","mua":"문당어","mul":"다중 언어","mun":"문다어","mus":"크리크어","mwl":"미란데어","mwr":"마르와리어","my":"버마어","mye":"미예네어","myn":"마야어","myv":"엘즈야어","na":"나우루어","nah":"나우아틀어","nai":"북아메리카 인디언어 (기타)","nap":"나폴리어","naq":"나마어","nb":"노르웨이어(보크말)","nd":"북부 은데벨레어","nds":"저지 독일어","ne":"네팔어","new":"네와르어","ng":"느동가어","nia":"니아스어","nic":"니제르 - 코르도파니아어 (기타)","niu":"니웨언어","nl":"네덜란드어","nl-BE":"플라망어","nmg":"크와시오어","nn":"노르웨이어(니노르스크)","nnh":"느기엠본어","no":"노르웨이어","nog":"노가이어","non":"노르웨이, 고대","nqo":"응코어","nr":"남부 은데벨레어","nso":"소토어 (북부)","nub":"누비안어","nus":"누에르어","nv":"나바호어","nwc":"네와르어 (고전)","ny":"니안자어; 치츄어; 츄어","nym":"니암웨지어","nyn":"니안콜어","nyo":"뉴로어","nzi":"느지마어","oc":"오크어","oj":"오지브웨이어","om":"오로모어","or":"오리야어","os":"오세트어","osa":"오세이지어","ota":"터키어, 오스만","oto":"오토미안어","pa":"펀잡어","paa":"파푸아어 (기타)","pag":"판가시난어","pal":"팔레비어","pam":"팜팡가어","pap":"파피아먼토어","pau":"파라우안어","peo":"고대 페르시아어","phi":"필리핀어 (기타)","phn":"페니키아어","pi":"팔리어","pl":"폴란드어","pon":"폼페이어","pra":"프라크리트어","pro":"고대 프로방스어","ps":"파슈토어","pt":"포르투갈어","pt-BR":"포르투갈어 (브라질)","pt-PT":"유럽식 포르투갈어","qu":"케추아어","raj":"라자스탄어","rap":"라파뉴이","rar":"라로통가어","rm":"레토로만어","rn":"룬디어","ro":"루마니아어","roa":"로망스어 (기타)","rof":"롬보어","rom":"집시어","root":"어근","ru":"러시아어","rup":"아로마니아어","rw":"르완다어","rwk":"르와어","sa":"산스크리트어","sad":"산다웨어","sah":"야큐트어","sai":"남아메리카 인디언어 (기타)","sal":"샐리시어어","sam":"사마리아 아랍어","saq":"삼부루어","sas":"사사크어","sat":"산탈리어","sba":"느감바이어","sbp":"상구어","sc":"사르디니아어","scn":"시칠리아어","sco":"스코틀랜드어","sd":"신디어","se":"북부 사미어","see":"세네카어","seh":"세나어","sel":"셀쿠프어","sem":"셈어 (기타)","ses":"코이야보로 세니어","sg":"산고어","sga":"아일랜드, 고대","sgn":"수화","sh":"세르비아-크로아티아어","shi":"타셸히트어","shn":"샨어","shu":"차디언 아라비아어","si":"스리랑카어","sid":"시다모어","sio":"수족어","sit":"중국 티베트 어족","sk":"슬로바키아어","sl":"슬로베니아어","sla":"슬라브어 (기타)","sm":"사모아어","sma":"남부 사미어","smi":"사미어 (기타)","smj":"룰레 사미어","smn":"이나리 사미어","sms":"스콜트 사미어","sn":"쇼나어","snk":"소닌케어","so":"소말리아어","sog":"소그디엔어","son":"송가이족어","sq":"알바니아어","sr":"세르비아어","srn":"스라난 통가어","srr":"세레르어","ss":"시스와티어","ssa":"니로-사하람어 (기타)","ssy":"사호어","st":"소토어 (남부)","su":"순다어","suk":"수쿠마족어","sus":"수수어","sux":"수메르어","sv":"스웨덴어","sw":"스와힐리어","swb":"코모로어","swc":"콩고 스와힐리어","syc":"시리아어 (고전)","syr":"시리아어","ta":"타밀어","tai":"태국어 (기타)","te":"텔루구어","tem":"팀니어","teo":"테조어","ter":"테레노어","tet":"테툼어","tg":"타지키스탄어","th":"태국어","ti":"티그리냐어","tig":"티그레어","tiv":"티비어","tk":"투르크멘어","tkl":"토켈라우제도어","tl":"타갈로그어","tlh":"클링온어","tli":"틀링깃족어","tmh":"타마섹어","tn":"세츠와나어","to":"통가어","tog":"통가어 (니아살랜드)","tpi":"토크 피신어","tr":"터키어","trv":"타로코어","ts":"총가어","tsi":"트심시안어","tt":"타타르어","tum":"툼부카어","tup":"투피어","tut":"알타이제어 (기타)","tvl":"투발루어","tw":"트위어","twq":"타사와크어","ty":"타히티어","tyv":"투비니안어","tzm":"중앙모로코 타마지트어","udm":"우드말트어","ug":"위구르어","uga":"유가리틱어","uk":"우크라이나어","umb":"윤번두어","und":"알 수 없는 언어","ur":"우르두어","uz":"우즈베크어","vai":"바이어","ve":"벤다어","vi":"베트남어","vo":"볼라퓌크어","vot":"보틱어","vun":"분조어","wa":"왈론어","wae":"월저어","wak":"와카샨어","wal":"와라모어","war":"와라이어","was":"와쇼어","wen":"소르브어","wo":"올로프어","xal":"칼미크어","xh":"코사어","xog":"소가어","yao":"야오족어","yap":"얍페세어","yav":"양본어","ybb":"옘바어","yi":"이디시어","yo":"요루바어","ypk":"야픽어","yue":"광둥어","za":"주앙어","zap":"사포테크어","zbl":"블리스 심볼","zen":"제나가어","zh":"중국어","zh-Hans":"중국어(간체)","zh-Hant":"중국어(번체)","znd":"아잔데족어","zu":"줄루어","zun":"주니어","zxx":"언어 관련 내용 없음","zza":"자자어"},"lv":{"aa":"afāru","ab":"abhāzu","ace":"ačinu","ach":"ačolu","ada":"adangmu","ady":"adigu","ae":"avesta","af":"afrikandu","afa":"afroaziātu valodas","afh":"afrihili","agq":"aghemu","ain":"ainu","ak":"akanu","akk":"akadiešu","ale":"aleutu","alg":"algonkinu valodas","alt":"dienvidaltajiešu","am":"amharu","an":"aragoniešu","ang":"senangļu","anp":"angika","apa":"apaču valodas","ar":"arābu","ar-001":"Modern Standard Arabic","arc":"aramiešu","arn":"araukāņu","arp":"arapahu","art":"mākslīgās valodas","arw":"aravaku","as":"asamiešu","asa":"asu","ast":"astūriešu","ath":"atapasku valodas","aus":"austrāliešu valodas","av":"avāru","awa":"avadhu","ay":"aimaru","az":"azerbaidžāņu","ba":"baškīru","bad":"bandu","bai":"bamileku valodas","bal":"beludžu","ban":"baliešu","bas":"basu","bat":"baltu valodas","bax":"bamumu","bbj":"gomalu","be":"baltkrievu","bej":"bedžu","bem":"bembu","ber":"berberu","bez":"bena","bfd":"bafutu","bg":"bulgāru","bh":"biharu","bho":"bhodžpūru","bi":"bišlamā","bik":"bikolu","bin":"binu","bkm":"komu","bla":"siksiku","bm":"bambaru","bn":"bengāļu","bnt":"bantu","bo":"tibetiešu","br":"bretoņu","bra":"bradžiešu","brx":"bodo","bs":"bosniešu","bss":"nkosi","btk":"bataku","bua":"burjatu","bug":"bugu","bum":"bulu","byn":"bilinu","byv":"medumbu","ca":"katalāņu","cad":"kadu","cai":"Centrālamerikas indiāņu valodas","car":"karību","cau":"kaukāziešu valodas","cay":"kajuga","cch":"atsamu","ce":"čečenu","ceb":"sebuāņu","cel":"ķeltu valoda","cgg":"kiga","ch":"čamorru","chb":"čibču","chg":"džagatajs","chk":"čūku","chm":"mariešu","chn":"činuku žargons","cho":"čoktavu","chp":"čipevaianu","chr":"čiroku","chy":"šejenu","ckb":"kurdu (Sorani)","cmc":"čamiešu valodas","co":"korsikāņu","cop":"koptu","cpe":"angliskās kreoliskās valodas un pidžinvalodas","cpf":"franciskās kreoliskās valodas un pidžinvalodas","cpp":"portugāliskās kreoliskās valodas un pidžinvalodas","cr":"krī","crh":"Krimas tatāru","crp":"kreoliskās valodas un pidžinvalodas","cs":"čehu","csb":"kašubu","cu":"baznīcslāvu","cus":"kušītu valodas","cv":"čuvašu","cy":"velsiešu","da":"dāņu","dak":"dakotu","dar":"dargu","dav":"taitu","day":"dajaku","de":"vācu","de-AT":"Austrijas vācu","de-CH":"Šveices augšvācu","del":"delavēru","den":"sleivu","dgr":"dogribu","din":"dinku","dje":"zarmu","doi":"dogru","dra":"dravīdu valodas","dsb":"lejassorbu","dua":"dualu","dum":"vidusholandiešu","dv":"maldīviešu","dyo":"diola-fonjī","dyu":"diūlu","dz":"dzongke","dzg":"dazu","ebu":"kjembu","ee":"evu","efi":"efiku","egy":"ēģiptiešu","eka":"ekadžuku","el":"grieķu","elx":"elamiešu","en":"angļu","en-AU":"Austrālijas angļu","en-CA":"Kanādas angļu","en-GB":"Lielbritānijas angļu","en-US":"ASV angļu","enm":"vidusangļu","eo":"esperanto","es":"spāņu","es-419":"Latīņamerikas spāņu","es-ES":"Eiropas spāņu","et":"igauņu","eu":"basku","ewo":"evondu","fa":"persiešu","fan":"fangu","fat":"fantu","ff":"fulu","fi":"somu","fil":"filipīniešu","fiu":"somugru valodas","fj":"fidžiešu","fo":"fēru","fon":"fonu","fr":"franču","fr-CA":"Kanādas franču","fr-CH":"Šveices franču","frm":"vidusfranču","fro":"senfranču","frr":"ziemeļfrīzu","frs":"austrumfrīzu","fur":"friūlu","fy":"rietumfrīzu","ga":"īru","gaa":"ga","gay":"gajo","gba":"gbaju","gd":"gēlu","gem":"ģermāņu valodas","gez":"gēzu","gil":"kiribatiešu","gl":"galisiešu","gmh":"vidusaugšvācu","gn":"gvaranu","goh":"senaugšvācu","gon":"gondu valodas","gor":"gorontalu","got":"gotu","grb":"grebo","grc":"sengrieķu","gsw":"Šveices vācu","gu":"gudžaratu","guz":"gusii","gv":"meniešu","gwi":"kučinu","ha":"hausu","hai":"haidu","haw":"havajiešu","he":"ivrits","hi":"hindi","hil":"hiligainonu","him":"himačali","hit":"hetu","hmn":"hmongu","ho":"hirimotu","hr":"horvātu","hsb":"augšsorbu","ht":"haitiešu","hu":"ungāru","hup":"hupu","hy":"armēņu","hz":"hereru","ia":"interlingva","iba":"ibanu","ibb":"ibibio","id":"indonēziešu","ie":"interlingve","ig":"igbo","ii":"Sičuaņas ji","ijo":"idžbu","ik":"inupiaku","ilo":"iloku","inc":"indoāriešu valodas","ine":"indoeiropiešu valodas","inh":"ingušu","io":"ido","ira":"irāņu valodas","iro":"irokēzu valodas","is":"īslandiešu","it":"itāļu","iu":"inuītu","ja":"japāņu","jbo":"ložbans","jgo":"Ngomba","jmc":"mačamu","jpr":"jūdpersiešu","jrb":"jūdarābu","jv":"javiešu","ka":"gruzīnu","kaa":"karakalpaku","kab":"kabilu","kac":"kačinu","kaj":"kadži","kam":"kambu","kar":"karenu","kaw":"kāvi","kbd":"kabardiešu","kbl":"kaņembu","kcg":"katabu","kde":"makonde","kea":"kaboverdiešu","kfo":"koru","kg":"kongu","kha":"khasu","khi":"hosjanu valodas","kho":"hotaniešu","khq":"koiračiinī","ki":"kikuju","kj":"kvaņamu","kk":"kazahu","kkj":"kako","kl":"grenlandiešu","kln":"kalendžīnu","km":"khmeru","kmb":"kimbundu","kn":"kannadu","ko":"korejiešu","kok":"konkanu","kos":"kosrājiešu","kpe":"kpellu","kr":"kanuru","krc":"karačaju un balkāru","krl":"karēļu","kro":"krū","kru":"kuruhu","ks":"kašmiriešu","ksb":"šambalu","ksf":"bafiju","ksh":"Ķelnes vācu","ku":"kurdu","kum":"kumiku","kut":"kutenaju","kv":"komiešu","kw":"korniešu","ky":"kirgīzu","la":"latīņu","lad":"ladino","lag":"langi","lah":"landu","lam":"lambu","lb":"luksemburgiešu","lez":"lezgīnu","lg":"gandu","li":"limburgiešu","lkt":"Lakota","ln":"lingala","lo":"laosiešu","lol":"mongu","loz":"lozu","lt":"lietuviešu","lu":"lubakatanga","lua":"lubalulva","lui":"luisenu","lun":"lundu","luo":"luo","lus":"lušeju","luy":"luhju","lv":"latviešu","mad":"maduriešu","maf":"mafu","mag":"magahiešu","mai":"maithili","mak":"makasaru","man":"mandingu","map":"austronēziešu valoda","mas":"masaju","mde":"mabu","mdf":"mokšu","mdr":"mandaru","men":"mendu","mer":"meru","mfe":"Maurīcijas kreolu","mg":"malagasu","mga":"vidusīru","mgh":"makua-meetto","mgo":"Meta'","mh":"māršaliešu","mi":"maoru","mic":"mikmaku","min":"minangkabavu","mis":"dažādas valodas","mk":"maķedoniešu","mkh":"monkhmeru valodas","ml":"malajalu","mn":"mongoļu","mnc":"mandžūru","mni":"manipūru","mno":"manobu valodas","mo":"moldāvu","moh":"mohauku","mos":"mosu","mr":"maratu","ms":"malajiešu","mt":"maltiešu","mua":"mundangu","mul":"vairākas valodas","mun":"mundu valodas","mus":"krīku","mwl":"mirandiešu","mwr":"marvaru","my":"birmiešu","mye":"mjenu","myn":"maiju valodas","myv":"erzju","na":"nauruiešu","nah":"navatlu","nai":"Ziemeļamerikas indiāņu valodas","nap":"neapoliešu","naq":"nama","nb":"norvēģu bukmols","nd":"ziemeļndebelu","nds":"lejasvācu","ne":"nepāliešu","new":"nevaru","ng":"ndongu","nia":"njasu","nic":"nigēriešu-kordofāņu valodas","niu":"niuāņu","nl":"holandiešu","nl-BE":"flāmu","nmg":"kvasio","nn":"jaunnorvēģu","nnh":"ngjembūnu","no":"norvēģu","nog":"nogaju","non":"sennorvēģu","nqo":"nko","nr":"dienvidndebelu","nso":"ziemeļsotu","nub":"nūbiešu valodas","nus":"nueru","nv":"navahu","nwc":"klasiskā nevaru","ny":"čičeva","nym":"ņamvezu","nyn":"ņankolu","nyo":"ņoru","nzi":"nzemu","oc":"oksitāņu","oj":"odžibvu","om":"oromu","or":"oriju","os":"osetīnu","osa":"važāžu","ota":"turku osmaņu","oto":"otomu valodas","pa":"pandžabu","paa":"papuasu valodas","pag":"pangasinanu","pal":"pehlevi","pam":"pampanganu","pap":"papjamento","pau":"palaviešu","peo":"senpersu","phi":"filipīniešu valodas","phn":"feniķiešu","pi":"pāli","pl":"poļu","pon":"ponapiešu","pra":"prākrita valodas","pro":"senprovansiešu","ps":"puštu","pt":"portugāļu","pt-BR":"Brazīlijas portugāļu","pt-PT":"Eiropas portugāļu","qu":"kečvu","raj":"radžastāņu","rap":"rapanuju","rar":"rarotongiešu","rm":"retoromāņu","rn":"rundu","ro":"rumāņu","roa":"romāņu valoda","rof":"rombo","rom":"čigānu","root":"sakne","ru":"krievu","rup":"aromūnu","rw":"kiņaruanda","rwk":"ruanda","sa":"sanskrits","sad":"sandavu","sah":"jakutu","sai":"Dienvidamerikas indiāņu","sal":"sališu valodas","sam":"samārijas aramiešu","saq":"samburu","sas":"sasaku","sat":"santalu","sba":"ngambeju","sbp":"sangu","sc":"sardīniešu","scn":"sicīliešu","sco":"skotu","sd":"sindhu","se":"ziemeļsāmu","see":"seneku","seh":"senu","sel":"selkupu","sem":"semītu valodas","ses":"koiraboro senni","sg":"sango","sga":"senīru","sgn":"zīmju valodas","sh":"serbu-horvātu","shi":"šilhu","shn":"šanu","shu":"Čadas arābu","si":"singāļu","sid":"sidamu","sio":"siū valodas","sit":"sinotibetiešu valodas","sk":"slovāku","sl":"slovēņu","sla":"slāvu","sm":"samoāņu","sma":"dienvidsāmu","smi":"sāmu valodas","smj":"luleo sāmu","smn":"inari sāmu","sms":"skoltsāmu","sn":"šonu","snk":"soninku","so":"somāļu","sog":"sogdiešu","son":"songaju","sq":"albāņu","sr":"serbu","srn":"sranantogo","srr":"serēru","ss":"svatu","ssa":"nīlas-sahāras valodas","ssy":"saho","st":"dienvidsotu","su":"sundaniešu","suk":"sukumu","sus":"susu","sux":"šumeru","sv":"zviedru","sw":"svahili","swb":"komoru","swc":"Kongo svahili","syc":"klasiskā sīriešu","syr":"sīriešu","ta":"tamilu","tai":"taju valodas","te":"telugu","tem":"temnu","teo":"teso","ter":"tereno","tet":"tetumu","tg":"tadžiku","th":"taju","ti":"tigrinja","tig":"tigru","tiv":"tivu","tk":"turkmēņu","tkl":"tokelaviešu","tl":"tagalu","tlh":"klingoņu","tli":"tlinkitu","tmh":"tuaregu","tn":"cvanu","to":"tongiešu","tog":"njasas tongu","tpi":"tokpisins","tr":"turku","trv":"taroko","ts":"congu","tsi":"cimšiāņu","tt":"tatāru","tum":"tumbuku","tup":"tupu valodas","tut":"altajiešu valodas","tvl":"tuvaliešu","tw":"tvī","twq":"tasavaku","ty":"taitiešu","tyv":"tuviešu","tzm":"Centrālmarokas tamazīts","udm":"udmurtu","ug":"uiguru","uga":"ugaritiešu","uk":"ukraiņu","umb":"umbundu","und":"nezināma valoda","ur":"urdu","uz":"uzbeku","vai":"vaju","ve":"vendu","vi":"vjetnamiešu","vo":"volapiks","vot":"votu","vun":"vundžo","wa":"valoņu","wae":"Vallisas vācu","wak":"vakašu valodas","wal":"valamu","war":"varaju","was":"vašo","wen":"sorbu","wo":"volofu","xal":"kalmiku","xh":"khosu","xog":"sogu","yao":"jao","yap":"japiešu","yav":"janbaņu","ybb":"jembu","yi":"jidišs","yo":"jorubu","ypk":"jopiku valodas","yue":"kantoniešu","za":"džuanu","zap":"sapoteku","zbl":"blissimbolika","zen":"zenagu","zh":"ķīniešu","zh-Hans":"ķīniešu vienkāršotā","zh-Hant":"ķīniešu tradicionālā","znd":"zandē","zu":"zulu","zun":"zunju","zxx":"bez lingvistiska satura","zza":"zazaki"},"ms":{"aa":"Afar","ab":"Abkhazia","ace":"Achinese","ach":"Akoli","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"Afrikaans","afa":"Afro-Asiatic Language","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"Amharic","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"Arab","ar-001":"Modern Standard Arabic","arc":"Aramaic","arn":"Mapuche","arp":"Arapaho","art":"Artificial Language","arw":"Arawak","as":"Assam","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"Aymara","az":"Azeri","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"Belarus","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"Bulgaria","bh":"Bihari","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Benggala","bnt":"Bantu","bo":"Tibet","br":"Breton","bra":"Braj","brx":"Bodo","bs":"Bosnia","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Catalonia","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Celtic Language","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Kurdi Sorani","cmc":"Chamic Language","co":"Corsica","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"Czech","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"Wales","da":"Denmark","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"Jerman","de-AT":"Jerman Austria","de-CH":"Jerman Halus Switzerland","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Ancient Egyptian","eka":"Ekajuk","el":"Greek","elx":"Elamite","en":"Inggeris","en-AU":"Inggeris Australia","en-CA":"Inggeris Kanada","en-GB":"Inggeris British","en-US":"Bahasa Inggeris AS","enm":"Middle English","eo":"Esperanto","es":"Sepanyol","es-419":"Sepanyol Amerika Latin","es-ES":"Sepanyol Eropah","et":"Estonia","eu":"Basque","ewo":"Ewondo","fa":"Parsi","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Finland","fil":"Filipina","fiu":"Finno-Ugrian Language","fj":"Fiji","fo":"Faroe","fon":"Fon","fr":"Perancis","fr-CA":"Perancis Kanada","fr-CH":"Perancis Switzerland","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"Frisian","ga":"Ireland","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Scots Gaelic","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"Galicia","gmh":"Middle High German","gn":"Guarani","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Ancient Greek","gsw":"Jerman Switzerland","gu":"Gujerat","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaii","he":"Ibrani","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"Croat","hsb":"Upper Sorbian","ht":"Haiti","hu":"Hungary","hup":"Hupa","hy":"Armenia","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indonesia","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"Iceland","it":"Itali","iu":"Inuktitut","ja":"Jepun","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"Jawa","ka":"Georgia","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazakhstan","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"Kannada","ko":"Korea","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Kashmir","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Kurdish","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"Kirghiz","la":"Latin","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luxembourg","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"Lingala","lo":"Laos","lol":"Mongo","loz":"Lozi","lt":"Lithuania","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"Latvia","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagasy","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maori","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"Macedonia","mkh":"Mon-Khmer Language","ml":"Malayalam","mn":"Mongolia","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Bahasa Melayu","mt":"Malta","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Burma","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"Bokmål Norway","nd":"Ndebele Utara","nds":"Low German","ne":"Nepal","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"Belanda","nl-BE":"Flemish","nmg":"Kwasio","nn":"Nynorsk Norway","nnh":"Ngiemboon","no":"Norwegian","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"Sotho Utara","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Occitania","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossete","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"Punjabi","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"Poland","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"Pushto","pt":"Portugis","pt-BR":"Portugis Brazil","pt-PT":"Portugis Eropah","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Romansh","rn":"Rundi","ro":"Romania","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"Rusia","rup":"Aromanian","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sanskrit","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"Sindhi","se":"Sami Utara","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Old Irish","sgn":"Sign Language","sh":"SerboCroatia","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"Sinhala","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"Slovak","sl":"Slovenia","sla":"Slavic Language","sm":"Samoa","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somali","sog":"Sogdien","son":"Songhai","sq":"Albania","sr":"Serbia","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Sotho Selatan","su":"Sunda","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"Sweden","sw":"Swahili","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"Tamil","tai":"Tai Language","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tajik","th":"Thai","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Turkmen","tkl":"Tokelau","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tonga","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Turki","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tatar","tum":"Tumbuka","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahiti","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"Uyghur","uga":"Ugaritic","uk":"Ukraine","umb":"Umbundu","und":"Bahasa Tidak Diketahui","ur":"Urdu","uz":"Uzbekistan","vai":"Vai","ve":"Venda","vi":"Vietnam","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Wolof","xal":"Kalmyk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Yiddish","yo":"Yoruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"Cina","zh-Hans":"Cina Ringkas","zh-Hant":"Cina Tradisional","znd":"Zande","zu":"Zulu","zun":"Zuni","zxx":"Tidak kandungan linguistik","zza":"Zaza"},"nb":{"aa":"afar","ab":"abkhasisk","ace":"achinesisk","ach":"acoli","ada":"adangme","ady":"adyghe","ae":"avestisk","af":"afrikaans","afa":"afroasiatisk språk","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"akan","akk":"akkadisk","ale":"aleutisk","alg":"algonkinsk språk","alt":"søraltaisk","am":"amharisk","an":"aragonsk","ang":"gammelengelsk","anp":"angika","apa":"apachespråk","ar":"arabisk","ar-001":"Modern Standard Arabic","arc":"arameisk","arn":"araukansk","arp":"arapaho","art":"kunstig språk","arw":"arawak","as":"assamisk","asa":"asu","ast":"asturisk","ath":"athapaskansk språk","aus":"australsk språk","av":"avarisk","awa":"awadhi","ay":"aymara","az":"aserbajdsjansk","ba":"basjkirsk","bad":"banda","bai":"bamilekisk språk","bal":"baluchi","ban":"balinesisk","bas":"basa","bat":"baltisk språk","bax":"bamun","bbj":"ghomala","be":"hviterussisk","bej":"beja","bem":"bemba","ber":"berbisk","bez":"bena","bfd":"bafut","bg":"bulgarsk","bh":"bihari","bho":"bhojpuri","bi":"bislama","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengali","bnt":"bantu","bo":"tibetansk","br":"bretonsk","bra":"braj","brx":"bodo","bs":"bosnisk","bss":"Akoose","btk":"batak","bua":"buriat","bug":"buginesisk","bum":"bulu","byn":"blin","byv":"medumba","ca":"katalansk","cad":"caddo","cai":"sentralamerikansk indiansk språk","car":"karibisk","cau":"kaukasisk språk","cay":"cayuga","cch":"atsam","ce":"tsjetsjensk","ceb":"cebuansk","cel":"keltisk språk","cgg":"kiga","ch":"chamorro","chb":"chibcha","chg":"chagatai","chk":"chuukesisk","chm":"mari","chn":"chinook","cho":"choctaw","chp":"chipewiansk","chr":"cherokee","chy":"cheyenne","ckb":"kurdisk (sorani)","cmc":"kamisk språk","co":"korsikansk","cop":"koptisk","cpe":"engelskbasert kreol- eller pidginspråk","cpf":"franskbasert kreol- eller pidginspråk","cpp":"portugisiskbasert kreol- eller pidginspråk","cr":"cree","crh":"krimtatarisk","crp":"kreol- eller pidginspråk","cs":"tsjekkisk","csb":"kasjubisk","cu":"kirkeslavisk","cus":"kusjitisk språk","cv":"tsjuvansk","cy":"walisisk","da":"dansk","dak":"dakota","dar":"dargwa","dav":"taita","day":"dayak","de":"tysk","de-AT":"østerriksk tysk","de-CH":"sveitsisk høytysk","del":"delaware","den":"slavisk","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"dravidisk språk","dsb":"lavsorbisk","dua":"duala","dum":"mellomnederlandsk","dv":"divehi","dyo":"jola-fonyi","dyu":"dyula","dz":"dzongkha","dzg":"dazaga","ebu":"kiembu","ee":"ewe","efi":"efik","egy":"gammelegyptisk","eka":"ekajuk","el":"gresk","elx":"elamittisk","en":"engelsk","en-AU":"australsk engelsk","en-CA":"canadisk engelsk","en-GB":"britisk engelsk","en-US":"amerikansk engelsk","enm":"mellomengelsk","eo":"esperanto","es":"spansk","es-419":"latinamerikansk spansk","es-ES":"europeisk spansk","et":"estisk","eu":"baskisk","ewo":"ewondo","fa":"persisk","fan":"fang","fat":"fanti","ff":"fulani","fi":"finsk","fil":"filippinsk","fiu":"finsk-ugrisk språk","fj":"fijiansk","fo":"færøysk","fon":"fon","fr":"fransk","fr-CA":"canadisk fransk","fr-CH":"sveitsisk fransk","frm":"mellomfransk","fro":"gammelfransk","frr":"nordfrisisk","frs":"østfrisisk","fur":"friuliansk","fy":"vestfrisisk","ga":"irsk","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"skotsk gælisk","gem":"germansk språk","gez":"ges","gil":"kiribatisk","gl":"galisisk","gmh":"mellomhøytysk","gn":"guarani","goh":"gammelhøytysk","gon":"gondi","gor":"gorontalo","got":"gotisk","grb":"grebo","grc":"gammelgresk","gsw":"sveitsertysk","gu":"gujarati","guz":"gusii","gv":"manx","gwi":"gwichin","ha":"hausa","hai":"haida","haw":"hawaiisk","he":"hebraisk","hi":"hindi","hil":"hiligaynon","him":"himachali","hit":"hettittisk","hmn":"hmong","ho":"hiri motu","hr":"kroatisk","hsb":"høysorbisk","ht":"haitisk","hu":"ungarsk","hup":"hupa","hy":"armensk","hz":"herero","ia":"interlingua","iba":"iban","ibb":"Ibibio","id":"indonesisk","ie":"interlingue","ig":"ibo","ii":"sichuan-yi","ijo":"ijo","ik":"inupiak","ilo":"iloko","inc":"indisk språk","ine":"indoeuropeisk språk","inh":"ingusjisk","io":"ido","ira":"iransk språk","iro":"irokansk språk","is":"islandsk","it":"italiensk","iu":"inuktitut","ja":"japansk","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"jødepersisk","jrb":"jødearabisk","jv":"javanesisk","ka":"georgisk","kaa":"karakalpakisk","kab":"kabylsk","kac":"kachin","kaj":"jju","kam":"kamba","kar":"karensk","kaw":"kawi","kbd":"kabardisk","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"kappverdisk","kfo":"koro","kg":"kikongo","kha":"khasi","khi":"khoisanspråk","kho":"khotanesisk","khq":"koyra chiini","ki":"kikuyu","kj":"kuanyama","kk":"kasakhisk","kkj":"Kako","kl":"grønlandsk","kln":"kalenjin","km":"khmer","kmb":"kimbundu","kn":"kannada","ko":"koreansk","kok":"konkani","kos":"kosraeansk","kpe":"kpelle","kr":"kanuri","krc":"karachay-balkar","krl":"karelsk","kro":"kru","kru":"kurukh","ks":"kasjmiri","ksb":"shambala","ksf":"bafia","ksh":"kølnsk","ku":"kurdisk","kum":"kumyk","kut":"kutenai","kv":"komi","kw":"kornisk","ky":"kirgisisk","la":"latin","lad":"ladinsk","lag":"langi","lah":"lahnda","lam":"lamba","lb":"luxemburgsk","lez":"lezghian","lg":"ganda","li":"limburgisk","lkt":"Lakota","ln":"lingala","lo":"laotisk","lol":"mongo","loz":"lozi","lt":"litauisk","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"oluluyia","lv":"latvisk","mad":"maduresisk","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makasar","man":"mandingo","map":"austronesisk språk","mas":"masai","mde":"maba","mdf":"moksha","mdr":"mandar","men":"mende","mer":"meru","mfe":"mauritisk-kreolsk","mg":"madagassisk","mga":"mellomirsk","mgh":"makhuwa-meetto","mgo":"Meta'","mh":"marshallesisk","mi":"maori","mic":"micmac","min":"minangkabau","mis":"annet språk","mk":"makedonsk","mkh":"mon-khmerspråk","ml":"malayalam","mn":"mongolsk","mnc":"mandsju","mni":"manipuri","mno":"manobospråk","mo":"moldavisk","moh":"mohawk","mos":"mossi","mr":"marathi","ms":"malayisk","mt":"maltesisk","mua":"mundang","mul":"flere språk","mun":"mundaspråk","mus":"creek","mwl":"mirandesisk","mwr":"marwari","my":"burmesisk","mye":"myene","myn":"mayaspråk","myv":"erzya","na":"nauru","nah":"nahuatl","nai":"nordamerikansk indiansk språk","nap":"napolitansk","naq":"nama","nb":"norsk bokmål","nd":"nord-ndebele","nds":"lavtysk","ne":"nepalsk","new":"newari","ng":"ndonga","nia":"nias","nic":"niger-kordofiansk språk","niu":"niueansk","nl":"nederlandsk","nl-BE":"flamsk","nmg":"kwasio","nn":"norsk nynorsk","nnh":"ngiemboon","no":"norsk","nog":"nogai","non":"gammelnorsk","nqo":"nkå","nr":"sør-ndebele","nso":"nord-sotho","nub":"nubisk språk","nus":"nuer","nv":"navajo","nwc":"klassisk newari","ny":"nyanja","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzima","oc":"oksitansk","oj":"ojibwa","om":"oromo","or":"oriya","os":"ossetisk","osa":"osage","ota":"ottomansk tyrkisk","oto":"otomisk språk","pa":"panjabi","paa":"papuisk språk","pag":"pangasinan","pal":"pahlavi","pam":"pampanga","pap":"papiamento","pau":"palauisk","peo":"gammelpersisk","phi":"filippinsk språk","phn":"fønikisk","pi":"pali","pl":"polsk","pon":"ponapisk","pra":"prakritspråk","pro":"gammelprovençalsk","ps":"pushto","pt":"portugisisk","pt-BR":"brasiliansk portugisisk","pt-PT":"europeisk portugisisk","qu":"quechua","raj":"rajasthani","rap":"rapanui","rar":"rarotongansk","rm":"retoromansk","rn":"rundi","ro":"rumensk","roa":"romansk språk","rof":"rombo","rom":"romani","root":"rot","ru":"russisk","rup":"aromansk","rw":"kinjarwanda","rwk":"rwa","sa":"sanskrit","sad":"sandawe","sah":"jakutsk","sai":"søramerikansk indiansk språk","sal":"salishansk språk","sam":"samaritansk arameisk","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sardinsk","scn":"siciliansk","sco":"skotsk","sd":"sindhi","se":"nordsamisk","see":"seneca","seh":"sena","sel":"selkupisk","sem":"semittisk språk","ses":"koyraboro senni","sg":"sango","sga":"gammelirsk","sgn":"tegnspråk","sh":"serbokroatisk","shi":"tachelhit","shn":"shan","shu":"Tsjad-arabisk","si":"singalesisk","sid":"sidamo","sio":"siouxspråk","sit":"sino-tibetansk språk","sk":"slovakisk","sl":"slovensk","sla":"slavisk språk","sm":"samoansk","sma":"sørsamisk","smi":"samisk språk","smj":"lulesamisk","smn":"enaresamisk","sms":"skoltesamisk","sn":"shona","snk":"soninke","so":"somali","sog":"sogdisk","son":"songhai","sq":"albansk","sr":"serbisk","srn":"sranan tongo","srr":"serer","ss":"swati","ssa":"nilo-saharaspråk","ssy":"saho","st":"sør-sotho","su":"sundanesisk","suk":"sukuma","sus":"susu","sux":"sumerisk","sv":"svensk","sw":"swahili","swb":"komorisk","swc":"kongolesisk swahili","syc":"klassisk syrisk","syr":"syrisk","ta":"tamil","tai":"taispråk","te":"telugu","tem":"temne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tadsjikisk","th":"thai","ti":"tigrinja","tig":"tigré","tiv":"tiv","tk":"turkmensk","tkl":"tokelau","tl":"tagalog","tlh":"klingon","tli":"tlingit","tmh":"tamasjek","tn":"setswana","to":"tongansk","tog":"nyasa-tongansk","tpi":"tok pisin","tr":"tyrkisk","trv":"taroko","ts":"tsonga","tsi":"tsimshian","tt":"tatarisk","tum":"tumbuka","tup":"tupispråk","tut":"altaisk språk","tvl":"tuvalu","tw":"twi","twq":"tasawaq","ty":"tahitisk","tyv":"tuvinisk","tzm":"sentralmarokkansk tamazight","udm":"udmurt","ug":"uigurisk","uga":"ugaritisk","uk":"ukrainsk","umb":"umbundu","und":"ukjent språk","ur":"urdu","uz":"usbekisk","vai":"vai","ve":"venda","vi":"vietnamesisk","vo":"volapyk","vot":"votisk","vun":"vunjo","wa":"vallonsk","wae":"Walser","wak":"wakasjansk språk","wal":"walamo","war":"waray","was":"washo","wen":"sorbisk språk","wo":"wolof","xal":"kalmyk","xh":"xhosa","xog":"soga","yao":"yao","yap":"yapesisk","yav":"yangben","ybb":"yemba","yi":"jiddisk","yo":"joruba","ypk":"jupisk språk","yue":"kantonesisk","za":"zhuang","zap":"zapotec","zbl":"blissymboler","zen":"zenaga","zh":"kinesisk","zh-Hans":"forenklet kinesisk","zh-Hant":"tradisjonell kinesisk","znd":"zande","zu":"zulu","zun":"zuni","zxx":"uten språklig innhold","zza":"zaza"},"nl":{"aa":"Afar","ab":"Abchazisch","ace":"Atjees","ach":"Akoli","ada":"Adangme","ady":"Adyghe","ae":"Avestisch","af":"Afrikaans","afa":"Afro-Aziatische taal","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadisch","ale":"Aleut","alg":"Algonkium-taal","alt":"Zuid-Altaïsch","am":"Amhaars","an":"Aragonees","ang":"Oudengels","anp":"Angika","apa":"Apache-taal","ar":"Arabisch","ar-001":"Modern Standard Arabic","arc":"Aramees","arn":"Araukaans","arp":"Arapaho","art":"Kunstmatige taal","arw":"Arawak","as":"Assamees","asa":"Asu","ast":"Asturisch","ath":"Athapascaanse taal","aus":"Australische taal","av":"Avarisch","awa":"Awadhi","ay":"Aymara","az":"Azeri","ba":"Basjkiers","bad":"Banda","bai":"Bamileke-taal","bal":"Baloetsji","ban":"Balinees","bas":"Basa","bat":"Baltische taal","bax":"Bamun","bbj":"Ghomala","be":"Wit-Russisch","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"Bulgaars","bh":"Bihari","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengalees","bnt":"Bantoe","bo":"Tibetaans","br":"Bretons","bra":"Braj","brx":"Bodo","bs":"Bosnisch","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginees","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Catalaans","cad":"Caddo","cai":"Midden-Amerikaans Indiaanse taal","car":"Caribisch","cau":"Kaukasische taal","cay":"Cayuga","cch":"Atsam","ce":"Tsjetsjeens","ceb":"Cebuano","cel":"Keltische taal","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukees","chm":"Mari","chn":"Chinook-jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Soranî","cmc":"Chamische taal","co":"Corsicaans","cop":"Koptisch","cpe":"Op Engels gebaseerd Creools of Pidgin","cpf":"Op Frans gebaseerd Creools of Pidgin","cpp":"Op Portugees gebaseerd Creools of Pidgin","cr":"Cree","crh":"Krim-Tataars","crp":"Creools of Pidgin","cs":"Tsjechisch","csb":"Kasjoebisch","cu":"Kerkslavisch","cus":"Koesjitische taal","cv":"Tsjoevasjisch","cy":"Welsh","da":"Deens","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dajak","de":"Duits","de-AT":"Oostenrijks Duits","de-CH":"Zwitsers Hoogduits","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidische taal","dsb":"Nedersorbisch","dua":"Duala","dum":"Middelnederlands","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Oudegyptisch","eka":"Ekajuk","el":"Grieks","elx":"Elamitisch","en":"Engels","en-AU":"Australisch Engels","en-CA":"Canadees Engels","en-GB":"Brits Engels","en-US":"Amerikaans Engels","enm":"Middelengels","eo":"Esperanto","es":"Spaans","es-419":"Latijns-Amerikaans Spaans","es-ES":"Europees Spaans","et":"Estlands","eu":"Baskisch","ewo":"Ewondo","fa":"Perzisch","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Fins","fil":"Filipijns","fiu":"Fins-Oegrische taal","fj":"Fijisch","fo":"Faeröers","fon":"Fon","fr":"Frans","fr-CA":"Canadees Frans","fr-CH":"Zwitsers Frans","frm":"Middelfrans","fro":"Oudfrans","frr":"Noord-Fries","frs":"Oost-Fries","fur":"Friulisch","fy":"West-Fries","ga":"Iers","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Schots Gaelic","gem":"Germaanse taal","gez":"Geez","gil":"Gilbertees","gl":"Galicisch","gmh":"Middelhoogduits","gn":"Guaraní","goh":"Oudhoogduits","gon":"Gondi","gor":"Gorontalo","got":"Gothisch","grb":"Grebo","grc":"Oudgrieks","gsw":"Zwitsers Duits","gu":"Gujarati","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaïaans","he":"Hebreeuws","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hettitisch","hmn":"Hmong","ho":"Hiri Motu","hr":"Kroatisch","hsb":"Oppersorbisch","ht":"Haïtiaans","hu":"Hongaars","hup":"Hupa","hy":"Armeens","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indonesisch","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indische taal","ine":"Indo-Europese taal","inh":"Ingoesj","io":"Ido","ira":"Iraanse taal","iro":"Irokese taal","is":"IJslands","it":"Italiaans","iu":"Inuktitut","ja":"Japans","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Perzisch","jrb":"Judeo-Arabisch","jv":"Javaans","ka":"Georgisch","kaa":"Karakalpaks","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardisch","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan-taal","kho":"Khotanees","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazachs","kkj":"Kako","kl":"Groenlands","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"Kannada","ko":"Koreaans","kok":"Konkani","kos":"Kosraeaans","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelisch","kro":"Kru","kru":"Kurukh","ks":"Kasjmiri","ksb":"Shambala","ksf":"Bafia","ksh":"Kölsch","ku":"Koerdisch","kum":"Koemuks","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"Kirgizisch","la":"Latijn","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luxemburgs","lez":"Lezgisch","lg":"Ganda","li":"Limburgs","lkt":"Lakota","ln":"Lingala","lo":"Laotiaans","lol":"Mongo","loz":"Lozi","lt":"Litouws","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Lushai","luy":"Luyia","lv":"Letlands","mad":"Madurees","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makassaars","man":"Mandingo","map":"Austronesisch","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagasisch","mga":"Middeliers","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallees","mi":"Maori","mic":"Mi'kmaq","min":"Minangkabau","mis":"Diverse talen","mk":"Macedonisch","mkh":"Mon-Khmer-taal","ml":"Malayalam","mn":"Mongools","mnc":"Mantsjoe","mni":"Manipoeri","mno":"Manobo-taal","mo":"Moldavisch","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Maleis","mt":"Maltees","mua":"Mundang","mul":"Meerdere talen","mun":"Munda-taal","mus":"Creek","mwl":"Mirandees","mwr":"Marwari","my":"Birmees","mye":"Myene","myn":"Mayan-taal","myv":"Erzja","na":"Nauruaans","nah":"Nahuatl","nai":"Noord-Amerikaans Indiaanse taal","nap":"Napolitaans","naq":"Nama","nb":"Noors - Bokmål","nd":"Noord-Ndbele","nds":"Laagduits","ne":"Nepalees","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanische taal","niu":"Niueaans","nl":"Nederlands","nl-BE":"Vlaams","nmg":"Kwasio","nn":"Noors - Nynorsk","nnh":"Ngiemboon","no":"Noors","nog":"Nogai","non":"Oudnoors","nqo":"N’ko","nr":"Zuid-Ndbele","nso":"Noord-Sotho","nub":"Nubische taal","nus":"Nuer","nv":"Navajo","nwc":"Klassiek Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Occitaans","oj":"Ojibwa","om":"Oromo","or":"Odia","os":"Ossetisch","osa":"Osage","ota":"Ottomaans-Turks","oto":"Otomi-taal","pa":"Punjabi","paa":"Papoeataal","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiaments","pau":"Palauaans","peo":"Oudperzisch","phi":"Filippijnse taal","phn":"Foenicisch","pi":"Pali","pl":"Pools","pon":"Pohnpeiaans","pra":"Prakrit-taal","pro":"Oudprovençaals","ps":"Pashto","pt":"Portugees","pt-BR":"Braziliaans Portugees","pt-PT":"Europees Portugees","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Reto-Romaans","rn":"Kirundi","ro":"Roemeens","roa":"Romaanse taal","rof":"Rombo","rom":"Romani","root":"Root","ru":"Russisch","rup":"Aromaniaans","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sanskriet","sad":"Sandawe","sah":"Jakoets","sai":"Zuid-Amerikaans Indiaanse taal","sal":"Salishan-taal","sam":"Samaritaans-Aramees","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinisch","scn":"Siciliaans","sco":"Schots","sd":"Sindhi","se":"Noord-Samisch","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitische taal","ses":"Koyraboro Senni","sg":"Sango","sga":"Oudiers","sgn":"Gebarentaal","sh":"Servokroatisch","shi":"Tachelhit","shn":"Shan","shu":"Tsjadisch Arabisch","si":"Singalees","sid":"Sidamo","sio":"Siouaanse talen","sit":"Sino-Tibetaanse taal","sk":"Slowaaks","sl":"Sloveens","sla":"Slavische taal","sm":"Samoaans","sma":"Zuid-Samisch","smi":"Sami-taal","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somalisch","sog":"Sogdisch","son":"Songhai","sq":"Albanees","sr":"Servisch","srn":"Sranantongo","srr":"Serer","ss":"Swazi","ssa":"Nilo-Saharaanse taal","ssy":"Saho","st":"Zuid-Sotho","su":"Soendanees","suk":"Sukuma","sus":"Soesoe","sux":"Soemerisch","sv":"Zweeds","sw":"Swahili","swb":"Shimaore","swc":"Congo Swahili","syc":"Klassiek Syrisch","syr":"Syrisch","ta":"Tamil","tai":"Tai-taal","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetun","tg":"Tadzjieks","th":"Thais","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Turkmeens","tkl":"Tokelaus","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongaans","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Turks","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tataars","tum":"Toemboeka","tup":"Tupi-taal","tut":"Altaïsche taal","tvl":"Tuvaluaans","tw":"Twi","twq":"Tasawaq","ty":"Tahitisch","tyv":"Tuvinisch","tzm":"Tamazight (Centraal-Marokko)","udm":"Oedmoerts","ug":"Oeigoers","uga":"Oegaritisch","uk":"Oekraïens","umb":"Umbundu","und":"Onbekende taal","ur":"Urdu","uz":"Oezbeeks","vai":"Vai","ve":"Venda","vi":"Vietnamees","vo":"Volapük","vot":"Votisch","vun":"Vunjo","wa":"Waals","wae":"Walser","wak":"Wakashan-taal","wal":"Walamo","war":"Waray","was":"Washo","wen":"Sorbische taal","wo":"Wolof","xal":"Kalmyk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapees","yav":"Yangben","ybb":"Yemba","yi":"Jiddisch","yo":"Yoruba","ypk":"Yupik-talen","yue":"Kantonees","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbolen","zen":"Zenaga","zh":"Chinees","zh-Hans":"Vereenvoudigd Chinees","zh-Hant":"Traditioneel Chinees","znd":"Zande","zu":"Zulu","zun":"Zuni","zxx":"Geen linguïstische inhoud","zza":"Zaza"},"pl":{"aa":"afar","ab":"abchaski","ace":"aceh","ach":"aczoli","ada":"adangme","ady":"adygejski","ae":"awestyjski","af":"afrikaans","afa":"afro-azjatycki","afh":"afrihili","agq":"Aghem","ain":"ajnu","ak":"akan","akk":"akadyjski","ale":"aleucki","alg":"języki algonkin","alt":"południowoałtajski","am":"amharski","an":"aragoński","ang":"staroangielski","anp":"angika","apa":"język Apaczów","ar":"arabski","ar-001":"Modern Standard Arabic","arc":"aramejski","arn":"araukański","arp":"arapaho","art":"sztuczny","arw":"arawak","as":"asamski","asa":"Asu","ast":"asturyjski","ath":"język Atapasków","aus":"język australijski","av":"awarski","awa":"awadhi","ay":"ajmara","az":"azerski","ba":"baszkirski","bad":"język banda","bai":"język bamileke","bal":"beludżi","ban":"balijski","bas":"basa","bat":"bałtycki","bax":"Bamun","bbj":"Ghomala","be":"białoruski","bej":"bedża","bem":"bemba","ber":"berberski","bez":"Bena","bfd":"Bafut","bg":"bułgarski","bh":"biharski","bho":"bhodźpuri","bi":"bislama","bik":"bikol","bin":"bini","bkm":"Kom","bla":"siksika","bm":"bambara","bn":"bengalski","bnt":"bantu","bo":"tybetański","br":"bretoński","bra":"bradź","brx":"Bodo","bs":"bośniacki","bss":"Akoose","btk":"batak","bua":"buriacki","bug":"bugiński","bum":"Bulu","byn":"blin","byv":"Medumba","ca":"kataloński","cad":"kaddo","cai":"język Indian środkowoamerykańskich","car":"karibi","cau":"kaukaski","cay":"Cayuga","cch":"atsam","ce":"czeczeński","ceb":"cebuano","cel":"celtycki","cgg":"Chiga","ch":"chamorro","chb":"czibcza","chg":"czagatajski","chk":"truk","chm":"maryjski","chn":"żargon Chinook","cho":"choctaw","chp":"chipewyan","chr":"czirokeski","chy":"język Czejenów","ckb":"sorani kurdyjski","cmc":"czam","co":"korsykański","cop":"koptyjski","cpe":"angielski kreolski lub pidżin","cpf":"francuski kreolski lub pidżin","cpp":"portugalski kreolski lub pidżin","cr":"kri","crh":"krymski turecki","crp":"kreolski lub pidżin","cs":"czeski","csb":"kaszubski","cu":"staro-cerkiewno-słowiański","cus":"kuszycki","cv":"czuwaski","cy":"walijski","da":"duński","dak":"dakota","dar":"dargwijski","dav":"Taita","day":"dajak","de":"niemiecki","de-AT":"austriacki niemiecki","de-CH":"wysokoniemiecki (Szwajcaria)","del":"delaware","den":"slave","dgr":"dogrib","din":"dinka","dje":"Zarma","doi":"dogri","dra":"drawidyjski","dsb":"dolnołużycki","dua":"duala","dum":"średniowieczny niderlandzki","dv":"malediwski","dyo":"Jola-Fonyi","dyu":"dyula","dz":"dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"ewe","efi":"efik","egy":"starożytny egipski","eka":"ekajuk","el":"grecki","elx":"elamicki","en":"angielski","en-AU":"australijski angielski","en-CA":"kanadyjski angielski","en-GB":"brytyjski angielski","en-US":"angielski (USA)","enm":"średnioangielski","eo":"esperanto","es":"hiszpański","es-419":"amerykański hiszpański","es-ES":"europejski hiszpański","et":"estoński","eu":"baskijski","ewo":"ewondo","fa":"perski","fan":"fang","fat":"fanti","ff":"fulani","fi":"fiński","fil":"filipino","fiu":"ugrofiński","fj":"fidżijski","fo":"farerski","fon":"fon","fr":"francuski","fr-CA":"kanadyjski francuski","fr-CH":"szwajcarski francuski","frm":"średniofrancuski","fro":"starofrancuski","frr":"północnofryzyjski","frs":"fryzyjski wschodni","fur":"friulijski","fy":"zachodniofryzyjski","ga":"irlandzki","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"szkocki gaelicki","gem":"germański","gez":"gyyz","gil":"gilbertański","gl":"galisyjski","gmh":"średnio-wysoko-niemiecki","gn":"guarani","goh":"staro-wysoko-niemiecki","gon":"gondi","gor":"gorontalo","got":"gocki","grb":"grebo","grc":"starogrecki","gsw":"szwajcarski niemiecki","gu":"gudźaracki","guz":"Gusii","gv":"manx","gwi":"gwichʼin","ha":"hausa","hai":"haida","haw":"hawajski","he":"hebrajski","hi":"hindi","hil":"hiligajnon","him":"himachali","hit":"hetycki","hmn":"hmongijski","ho":"hiri motu","hr":"chorwacki","hsb":"górnołużycki","ht":"haitański","hu":"węgierski","hup":"hupa","hy":"ormiański","hz":"herero","ia":"interlingua","iba":"ibanag","ibb":"Ibibio","id":"indonezyjski","ie":"interlingue","ig":"igbo","ii":"syczuański","ijo":"ijo","ik":"inupiak","ilo":"ilokano","inc":"indoaryjski","ine":"indoeuropejski","inh":"inguski","io":"ido","ira":"irański","iro":"irokeski","is":"islandzki","it":"włoski","iu":"inuktitut","ja":"japoński","jbo":"lojban","jgo":"Ngomba","jmc":"Machame","jpr":"judeoperski","jrb":"judeoarabski","jv":"jawajski","ka":"gruziński","kaa":"karakałpacki","kab":"kabylski","kac":"kaczin","kaj":"jju","kam":"kamba","kar":"kareński","kaw":"kawi","kbd":"kabardyjski","kbl":"Kanembu","kcg":"tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"koro","kg":"kongo","kha":"khasi","khi":"khoisan","kho":"chotański","khq":"Koyra Chiini","ki":"kikuju","kj":"kwanyama","kk":"kazachski","kkj":"Kako","kl":"grenlandzki","kln":"Kalenjin","km":"khmerski","kmb":"kimbundu","kn":"kannada","ko":"koreański","kok":"konkani","kos":"kosrae","kpe":"kpelle","kr":"kanuri","krc":"karaczajsko-bałkarski","krl":"karelski","kro":"kru","kru":"kurukh","ks":"kaszmirski","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"kurdyjski","kum":"kumycki","kut":"kutenai","kv":"komi","kw":"kornijski","ky":"kirgiski","la":"łaciński","lad":"ladyński","lag":"Langi","lah":"lahnda","lam":"lamba","lb":"luksemburski","lez":"lezgijski","lg":"ganda","li":"limburgijski","lkt":"Lakota","ln":"lingala","lo":"laotański","lol":"mongo","loz":"lozi","lt":"litewski","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"Luyia","lv":"łotewski","mad":"madurajski","maf":"Mafa","mag":"magahi","mai":"maithili","mak":"makasar","man":"mandingo","map":"austronezyjski","mas":"masajski","mde":"Maba","mdf":"moksha","mdr":"mandar","men":"mende","mer":"Meru","mfe":"kreolski Mauritiusa","mg":"malgaski","mga":"średnioirlandzki","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"marshall","mi":"maoryjski","mic":"micmac","min":"minangkabu","mis":"inny język","mk":"macedoński","mkh":"mon-khmer","ml":"malajalam","mn":"mongolski","mnc":"manchu","mni":"manipuryjski","mno":"manobo","mo":"mołdawski","moh":"mohawk","mos":"mossi","mr":"marathi","ms":"malajski","mt":"maltański","mua":"Mundang","mul":"wiele języków","mun":"mundajski","mus":"creek","mwl":"mirandese","mwr":"marwari","my":"birmański","mye":"Myene","myn":"język Majów","myv":"erzya","na":"nauru","nah":"nahuatl","nai":"język Indian północnoamerykańskich","nap":"neapolitański","naq":"Nama","nb":"norweski Bokmål","nd":"ndebele północny","nds":"dolnosaksoński","ne":"nepalski","new":"newarski","ng":"ndonga","nia":"nias","nic":"nigrokordofański","niu":"niue","nl":"niderlandzki","nl-BE":"flamandzki (Belgia)","nmg":"Kwasio","nn":"norweski Nynorsk","nnh":"Ngiemboon","no":"norweski","nog":"nogajski","non":"staronordyjski","nqo":"n’ko","nr":"ndebele południowy","nso":"sotho północny","nub":"nubijski","nus":"Nuer","nv":"nawaho","nwc":"newarski klasyczny","ny":"njandża","nym":"niamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzema","oc":"prowansalski","oj":"odżibwa","om":"oromski","or":"orija","os":"osetyjski","osa":"osage","ota":"osmańsko-turecki","oto":"otomi","pa":"pendżabski","paa":"papuaski","pag":"pangasino","pal":"pahlavi","pam":"pampango","pap":"papiamento","pau":"palau","peo":"staroperski","phi":"filipiński","phn":"fenicki","pi":"palijski","pl":"polski","pon":"ponpejski","pra":"prakryty","pro":"staroprowansalski","ps":"pasztuński","pt":"portugalski","pt-BR":"brazylijski portugalski","pt-PT":"europejski portugalski","qu":"keczua","raj":"radźasthani","rap":"rapanui","rar":"rarotonga","rm":"retoromański","rn":"rundi","ro":"rumuński","roa":"romański","rof":"Rombo","rom":"cygański","root":"język rdzenny","ru":"rosyjski","rup":"arumuński","rw":"kinya-ruanda","rwk":"Rwa","sa":"sanskryt","sad":"sandawe","sah":"jakucki","sai":"język Indian południowoamerykańskich","sal":"salisz","sam":"samarytański aramejski","saq":"Samburu","sas":"sasak","sat":"santali","sba":"Ngambay","sbp":"Sangu","sc":"sardyński","scn":"sycylijski","sco":"szkocki","sd":"sindhi","se":"lapoński północny","see":"Seneca","seh":"Sena","sel":"selkupski","sem":"semicki","ses":"Koyraboro Senni","sg":"sango","sga":"staroirlandzki","sgn":"migowy","sh":"serbsko-chorwacki","shi":"Tachelhit","shn":"shan","shu":"Chadian Arabic","si":"syngaleski","sid":"sidamo","sio":"siouański","sit":"chińsko-tybetański","sk":"słowacki","sl":"słoweński","sla":"słowiański","sm":"samoański","sma":"lapoński południowy","smi":"lapoński","smj":"lapoński Lule","smn":"lapoński Inari","sms":"lapoński Skolt","sn":"szona","snk":"soninke","so":"somalijski","sog":"sogdyjski","son":"songhaj","sq":"albański","sr":"serbski","srn":"sranan tongo","srr":"serer","ss":"siswati","ssa":"nilosaharyjski","ssy":"Saho","st":"sotho południowy","su":"sundajski","suk":"sukuma","sus":"susu","sux":"sumeryjski","sv":"szwedzki","sw":"suahili","swb":"komoryjski","swc":"Congo Swahili","syc":"syriacki","syr":"syryjski","ta":"tamilski","tai":"Tai Language","te":"telugu","tem":"temne","teo":"Teso","ter":"tereno","tet":"tetum","tg":"tadżycki","th":"tajski","ti":"tigrinia","tig":"tigre","tiv":"tiw","tk":"turkmeński","tkl":"tokelau","tl":"tagalski","tlh":"klingoński","tli":"tlingit","tmh":"tamaszek","tn":"setswana","to":"tonga","tog":"tonga (Niasa)","tpi":"tok pisin","tr":"turecki","trv":"Taroko","ts":"tsonga","tsi":"tsimshian","tt":"tatarski","tum":"tumbuka","tup":"tupi","tut":"ałtajski","tvl":"tuvalu","tw":"twi","twq":"Tasawaq","ty":"tahitański","tyv":"tuwiński","tzm":"Central Atlas Tamazight","udm":"udmurcki","ug":"ujgurski","uga":"ugarycki","uk":"ukraiński","umb":"umbundu","und":"nieznany język","ur":"urdu","uz":"uzbecki","vai":"wai","ve":"venda","vi":"wietnamski","vo":"volapuk","vot":"wotiacki","vun":"Vunjo","wa":"waloński","wae":"Walser","wak":"wakasz","wal":"walamo","war":"waraj","was":"washo","wen":"łużycki","wo":"wolof","xal":"kałmucki","xh":"khosa","xog":"Soga","yao":"yao","yap":"japski","yav":"Yangben","ybb":"Yemba","yi":"jidysz","yo":"joruba","ypk":"jupik","yue":"kantoński","za":"czuang","zap":"zapotecki","zbl":"bliss","zen":"zenaga","zh":"chiński","zh-Hans":"chiński (uproszczony)","zh-Hant":"chiński (tradycyjny)","znd":"azande","zu":"zulu","zun":"zuni","zxx":"brak treści o charakterze lingwistycznym","zza":"zazaki"},"pt":{"aa":"afar","ab":"abcázio","ace":"achém","ach":"acoli","ada":"adangme","ady":"adigue","ae":"avéstico","af":"africâner","afa":"idioma afro-asiático","afh":"afrihili","agq":"Aghem","ain":"ainu","ak":"akan","akk":"acadiano","ale":"aleúte","alg":"idioma algonquiano","alt":"altai do sul","am":"amárico","an":"aragonês","ang":"inglês arcaico","anp":"angika","apa":"idioma apache","ar":"árabe","ar-001":"Modern Standard Arabic","arc":"aramaico","arn":"araucano","arp":"arapaho","art":"idioma artificial","arw":"arauaqui","as":"assamês","asa":"asa","ast":"asturiano","ath":"idioma atabascano","aus":"idioma australiano","av":"avaric","awa":"awadhi","ay":"aimara","az":"azeri","ba":"bashkir","bad":"banda","bai":"idioma bamileke","bal":"balúchi","ban":"balinês","bas":"basa","bat":"idioma báltico","bax":"Bamun","bbj":"Ghomala","be":"bielo-russo","bej":"beja","bem":"bemba","ber":"berbere","bez":"Bena","bfd":"Bafut","bg":"búlgaro","bh":"biari","bho":"bhojpuri","bi":"bislamá","bik":"bikol","bin":"bini","bkm":"Kom","bla":"siksika","bm":"bambara","bn":"bengali","bnt":"banto","bo":"tibetano","br":"bretão","bra":"braj","brx":"bodo","bs":"bósnio","bss":"Akoose","btk":"bataque","bua":"buriat","bug":"buguinês","bum":"Bulu","byn":"blin","byv":"Medumba","ca":"catalão","cad":"caddo","cai":"idioma indígena centro-americano","car":"caribe","cau":"idioma caucásico","cay":"Cayuga","cch":"atsam","ce":"checheno","ceb":"cebuano","cel":"idioma celta","cgg":"Chiga","ch":"chamorro","chb":"chibcha","chg":"chagatai","chk":"chuukese","chm":"mari","chn":"chinook jargon","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"cheiene","ckb":"Sorâni curdo","cmc":"idioma chamic","co":"córsico","cop":"copta","cpe":"crioulo ou pidgin baseado no inglês","cpf":"crioulo ou pidgin baseado no francês","cpp":"crioulo ou pidgin baseado no português","cr":"cree","crh":"turco da Crimeia","crp":"crioulo ou pidgin","cs":"tcheco","csb":"kashubian","cu":"eslavo eclesiástico","cus":"idioma cuchítico","cv":"chuvash","cy":"galês","da":"dinamarquês","dak":"dacota","dar":"dargwa","dav":"Taita","day":"dayak","de":"alemão","de-AT":"alemão austríaco","de-CH":"alto alemão suíço","del":"delaware","den":"slave","dgr":"dogrib","din":"dinka","dje":"Zarma","doi":"dogri","dra":"idioma dravidiano","dsb":"sérvio baixo","dua":"duala","dum":"holandês médio","dv":"divehi","dyo":"Jola-Fonyi","dyu":"diúla","dz":"dzonga","dzg":"Dazaga","ebu":"embu","ee":"eve","efi":"efique","egy":"egípcio arcaico","eka":"ekajuk","el":"grego","elx":"elamite","en":"inglês","en-AU":"inglês australiano","en-CA":"inglês canadense","en-GB":"inglês britânico","en-US":"inglês americano","enm":"inglês médio","eo":"esperanto","es":"espanhol","es-419":"espanhol latino-americano","es-ES":"espanhol europeu","et":"estoniano","eu":"basco","ewo":"ewondo","fa":"persa","fan":"fangue","fat":"fanti","ff":"fula","fi":"finlandês","fil":"filipino","fiu":"idioma fino-úgrico","fj":"fijiano","fo":"feroês","fon":"fom","fr":"francês","fr-CA":"francês canadense","fr-CH":"francês suíço","frm":"francês médio","fro":"francês arcaico","frr":"frísio setentrional","frs":"frisão oriental","fur":"friulano","fy":"frísio ocidental","ga":"irlandês","gaa":"ga","gay":"gayo","gba":"gbaia","gd":"gaélico escocês","gem":"idioma germânico","gez":"geez","gil":"gilbertês","gl":"galego","gmh":"alemão médio-alto","gn":"guarani","goh":"alemão arcaico alto","gon":"gondi","gor":"gorontalo","got":"gótico","grb":"grebo","grc":"grego arcaico","gsw":"alemão suíço","gu":"guzerate","guz":"Gusii","gv":"manx","gwi":"gwichʼin","ha":"hauçá","hai":"haida","haw":"havaiano","he":"hebraico","hi":"híndi","hil":"hiligaynon","him":"himachali","hit":"hitita","hmn":"hmong","ho":"hiri motu","hr":"croata","hsb":"sorábio superior","ht":"haitiano","hu":"húngaro","hup":"hupa","hy":"armênio","hz":"herero","ia":"interlíngua","iba":"iban","ibb":"Ibibio","id":"indonésio","ie":"interlingue","ig":"ibo","ii":"sichuan yi","ijo":"ijo","ik":"inupiaque","ilo":"ilocano","inc":"idioma índico","ine":"idioma indo-europeu","inh":"inguche","io":"ido","ira":"iraniano","iro":"idioma iroquês","is":"islandês","it":"italiano","iu":"inuktitut","ja":"japonês","jbo":"lojban","jgo":"Ngomba","jmc":"Machame","jpr":"judaico-persa","jrb":"judaico-arábico","jv":"javanês","ka":"georgiano","kaa":"kara-kalpak","kab":"kabyle","kac":"kachin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardiano","kbl":"Kanembu","kcg":"tyap","kde":"Makonde","kea":"kabuverdianu","kfo":"koro","kg":"congolês","kha":"khasi","khi":"idioma coisã","kho":"khotanês","khq":"Koyra Chiini","ki":"quicuio","kj":"kuanyama","kk":"cazaque","kkj":"Kako","kl":"groenlandês","kln":"Kalenjin","km":"cmer","kmb":"quimbundo","kn":"canarês","ko":"coreano","kok":"concani","kos":"kosraean","kpe":"kpelle","kr":"canúri","krc":"karachay-balkar","krl":"idioma carélio","kro":"kru","kru":"kurukh","ks":"caxemira","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"curdo","kum":"kumyk","kut":"kutenai","kv":"komi","kw":"córnico","ky":"quirguiz","la":"latim","lad":"ladino","lag":"Langi","lah":"lahnda","lam":"lamba","lb":"luxemburguês","lez":"lezghian","lg":"luganda","li":"limburguês","lkt":"Lakota","ln":"lingala","lo":"laosiano","lol":"mongo","loz":"lozi","lt":"lituano","lu":"luba-catanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lushai","luy":"Luyia","lv":"letão","mad":"madurês","maf":"Mafa","mag":"magahi","mai":"maithili","mak":"makasar","man":"mandinga","map":"austronésio","mas":"massai","mde":"Maba","mdf":"mocsa","mdr":"mandar","men":"mende","mer":"Meru","mfe":"Morisyen","mg":"malgaxe","mga":"irlandês médio","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"marshalês","mi":"maori","mic":"miquemaque","min":"minangkabau","mis":"idiomas diversos","mk":"macedônio","mkh":"idioma mon-khmer","ml":"malaiala","mn":"mongol","mnc":"manchu","mni":"manipuri","mno":"idioma manobo","mo":"moldávio","moh":"mohawk","mos":"mossi","mr":"marata","ms":"malaio","mt":"maltês","mua":"Mundang","mul":"idiomas múltiplos","mun":"idiomas munda","mus":"creek","mwl":"mirandês","mwr":"marwari","my":"birmanês","mye":"Myene","myn":"maia","myv":"erzya","na":"nauruano","nah":"náuatle","nai":"idioma indígena norte-americano","nap":"napolitano","naq":"Nama","nb":"bokmål norueguês","nd":"ndebele do norte","nds":"baixo-alemão","ne":"nepali","new":"newari","ng":"dongo","nia":"nias","nic":"idioma cordofano-nigeriano","niu":"niueano","nl":"holandês","nl-BE":"flamengo","nmg":"Kwasio","nn":"nynorsk norueguês","nnh":"Ngiemboon","no":"norueguês","nog":"nogai","non":"nórdico arcaico","nqo":"n'ko","nr":"ndebele do sul","nso":"soto setentrional","nub":"idioma núbio","nus":"Nuer","nv":"navajo","nwc":"newari clássico","ny":"nianja","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzima","oc":"occitânico","oj":"ojibwa","om":"oromo","or":"oriya","os":"ossetic","osa":"osage","ota":"turco otomano","oto":"idioma otomano","pa":"panjabi","paa":"idioma papuano","pag":"pangasinã","pal":"pálavi","pam":"pampanga","pap":"papiamento","pau":"palauano","peo":"persa arcaico","phi":"idioma filipino","phn":"fenício","pi":"páli","pl":"polonês","pon":"pohnpeian","pra":"idioma prácrito","pro":"provençal arcaico","ps":"pushto","pt":"português","pt-BR":"português do Brasil","pt-PT":"português europeu","qu":"quíchua","raj":"rajastani","rap":"rapanui","rar":"rarotongano","rm":"romanche","rn":"rundi","ro":"romeno","roa":"idioma românico","rof":"rombo","rom":"romani","root":"Root","ru":"russo","rup":"aromeno","rw":"kinyarwanda","rwk":"rwa","sa":"sânscrito","sad":"sandawe","sah":"iacuto","sai":"idioma indígena sul-americano","sal":"idioma salisano","sam":"aramaico samaritano","saq":"Samburu","sas":"sasak","sat":"santali","sba":"Ngambay","sbp":"Sangu","sc":"sardo","scn":"siciliano","sco":"escocês","sd":"sindi","se":"sami do norte","see":"Seneca","seh":"Sena","sel":"selkup","sem":"idioma semítico","ses":"Koyraboro Senni","sg":"sango","sga":"irlandês arcaico","sgn":"linguagem de sinais","sh":"servo-croata","shi":"Tachelhit","shn":"shan","shu":"Chadian Arabic","si":"cingalês","sid":"sidamo","sio":"idioma sioux","sit":"idioma sino-tibetano","sk":"eslovaco","sl":"esloveno","sla":"idioma eslavo","sm":"samoano","sma":"sami do sul","smi":"idioma sami","smj":"lule sami","smn":"inari sami","sms":"skolt sami","sn":"shona","snk":"soninquê","so":"somali","sog":"sogdiano","son":"songai","sq":"albanês","sr":"sérvio","srn":"idioma surinamês","srr":"serere","ss":"swati","ssa":"idioma nilo-saariano","ssy":"Saho","st":"soto do sul","su":"sundanês","suk":"sukuma","sus":"sosso","sux":"sumério","sv":"sueco","sw":"suaili","swb":"comoriano","swc":"Congo Swahili","syc":"siríaco clássico","syr":"siríaco","ta":"tâmil","tai":"idioma tailandês","te":"telugu","tem":"timne","teo":"Teso","ter":"tereno","tet":"tétum","tg":"tadjique","th":"tailandês","ti":"tigrínia","tig":"tigré","tiv":"tiv","tk":"turcomano","tkl":"toquelauano","tl":"tagalo","tlh":"klingon","tli":"tlinguite","tmh":"tamaxeque","tn":"tswana","to":"tonganês","tog":"tonganês de Nyasa","tpi":"tok pisin","tr":"turco","trv":"Taroko","ts":"tsonga","tsi":"tsimshian","tt":"tatar","tum":"tumbuka","tup":"idioma tupi","tut":"idioma altaico","tvl":"tuvaluano","tw":"twi","twq":"Tasawaq","ty":"taitiano","tyv":"tuvinian","tzm":"Central Atlas Tamazight","udm":"udmurt","ug":"uyghur","uga":"ugarítico","uk":"ucraniano","umb":"umbundu","und":"idioma inválido ou desconhecido","ur":"urdu","uz":"usbeque","vai":"vai","ve":"venda","vi":"vietnamita","vo":"volapuque","vot":"votic","vun":"Vunjo","wa":"valão","wae":"walser","wak":"idioma wakashan","wal":"walamo","war":"waray","was":"washo","wen":"idioma sorábio","wo":"uólofe","xal":"kalmyk","xh":"xosa","xog":"Soga","yao":"yao","yap":"yapese","yav":"Yangben","ybb":"Yemba","yi":"iídiche","yo":"ioruba","ypk":"idioma iúpique","yue":"cantonês","za":"zhuang","zap":"zapoteca","zbl":"símbolos blis","zen":"zenaga","zh":"chinês","zh-Hans":"chinês simplificado","zh-Hant":"chinês tradicional","znd":"zande","zu":"zulu","zun":"zunhi","zxx":"sem conteúdo linguístico","zza":"zaza"},"ro":{"aa":"afar","ab":"abhază","ace":"aceh","ach":"acoli","ada":"adangme","ady":"adyghe","ae":"avestană","af":"afrikaans","afa":"limbă afro-asiatică","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"akan","akk":"akkadiană","ale":"aleută","alg":"limbă algonchiană","alt":"altaică meridională","am":"amharică","an":"aragoneză","ang":"engleză veche","anp":"angika","apa":"limbă apașă","ar":"arabă","ar-001":"Modern Standard Arabic","arc":"aramaică","arn":"araucaniană","arp":"arapaho","art":"limbă artificială","arw":"arawak","as":"asameză","asa":"asu","ast":"asturiană","ath":"limbă athapascană","aus":"limbă australiană","av":"avară","awa":"awadhi","ay":"aymara","az":"azeră","ba":"bașkiră","bad":"banda","bai":"limbă bamileke","bal":"baluchi","ban":"balineză","bas":"basaa","bat":"limbă baltică","bax":"bamun","bbj":"ghomala","be":"bielorusă","bej":"beja","bem":"bemba","ber":"berberă","bez":"bena","bfd":"bafut","bg":"bulgară","bh":"bihari","bho":"bhojpuri","bi":"bislama","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambara","bn":"bengaleză","bnt":"bantu","bo":"tibetană","br":"bretonă","bra":"braj","brx":"bodo","bs":"bosniacă","bss":"akoose","btk":"batak","bua":"buriat","bug":"bugineză","bum":"bulu","byn":"blin","byv":"medumba","ca":"catalană","cad":"caddo","cai":"limbă central-amerindiană","car":"carib","cau":"limbă caucaziană","cay":"cayuga","cch":"atsam","ce":"cecenă","ceb":"cebuano","cel":"limbă celtică","cgg":"chiga","ch":"chamorro","chb":"chibcha","chg":"chagatai","chk":"chuukese","chm":"mari","chn":"jargon chinook","cho":"choctaw","chp":"chipewyan","chr":"cherokee","chy":"cheyenne","ckb":"kurdă sorani","cmc":"limbă chamică","co":"corsicană","cop":"coptă","cpe":"creolă sau pidgin bazată pe engleză","cpf":"creolă sau pidgin bazată pe franceză","cpp":"creolă sau pidgin bazată pe portugheză","cr":"cree","crh":"turcă crimeeană","crp":"creolă sau pidgin","cs":"cehă","csb":"cașubiană","cu":"slavonă","cus":"limbă cushitică","cv":"ciuvașă","cy":"velșă","da":"daneză","dak":"dakota","dar":"dargwa","dav":"taita","day":"dayak","de":"germană","de-AT":"germană austriacă","de-CH":"germană standard elvețiană","del":"delaware","den":"slave","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"limbă dravidiană","dsb":"sorabă de jos","dua":"duala","dum":"olandeză mijlocie","dv":"divehi","dyo":"Jola-Fonyi","dyu":"dyula","dz":"dzongkha","dzg":"dazaga","ebu":"embu","ee":"ewe","efi":"efik","egy":"egipteană veche","eka":"ekajuk","el":"greacă","elx":"elamită","en":"engleză","en-AU":"engleză australiană","en-CA":"engleză canadiană","en-GB":"engleză britanică","en-US":"engleză americană","enm":"engleză mijlocie","eo":"esperanto","es":"spaniolă","es-419":"spaniolă latino-americană","es-ES":"spaniolă europeană","et":"estoniană","eu":"bască","ewo":"ewondo","fa":"persană","fan":"fang","fat":"fanti","ff":"fulah","fi":"finlandeză","fil":"filipineză","fiu":"limbă fino-ugrică","fj":"fijiană","fo":"faroeză","fon":"fon","fr":"franceză","fr-CA":"franceză canadiană","fr-CH":"franceză elvețiană","frm":"franceză mijlocie","fro":"franceză veche","frr":"frizonă nordică","frs":"frizonă orientală","fur":"friulană","fy":"frizonă occidentală","ga":"irlandeză","gaa":"ga","gay":"gayo","gba":"gbaya","gd":"gaelică scoțiană","gem":"limbă germanică","gez":"geez","gil":"gilbertină","gl":"galiciană","gmh":"germană mijlocie înaltă","gn":"guarani","goh":"germană veche înaltă","gon":"gondi","gor":"gorontalo","got":"gotică","grb":"grebo","grc":"greacă veche","gsw":"germană elvețiană","gu":"gujarati","guz":"gusii","gv":"manx","gwi":"gwichʼin","ha":"hausa","hai":"haida","haw":"hawaiană","he":"ebraică","hi":"hindi","hil":"hiligaynon","him":"himachali","hit":"hitită","hmn":"hmong","ho":"hiri motu","hr":"croată","hsb":"sorabă de sus","ht":"haitiană","hu":"maghiară","hup":"hupa","hy":"armeană","hz":"herero","ia":"interlingua","iba":"iban","ibb":"ibibio","id":"indoneziană","ie":"interlingue","ig":"igbo","ii":"sichuan yi","ijo":"ijo","ik":"inupiak","ilo":"iloko","inc":"limbă indiană","ine":"limbă indo-europeană","inh":"ingușă","io":"ido","ira":"limbă iraniană","iro":"limbă irocheză","is":"islandeză","it":"italiană","iu":"inuktitut","ja":"japoneză","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"iudeo-persană","jrb":"iudeo-arabă","jv":"javaneză","ka":"georgiană","kaa":"karakalpak","kab":"kabyle","kac":"kachin","kaj":"jju","kam":"kamba","kar":"karen","kaw":"kawi","kbd":"kabardian","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"kabuverdianu","kfo":"koro","kg":"congoleză","kha":"khasi","khi":"limbă khoisan","kho":"limbp khotaneză","khq":"koyra chiini","ki":"kikuyu","kj":"kuanyama","kk":"kazahă","kkj":"kako","kl":"kalaallisut","kln":"kalenjin","km":"khmeră","kmb":"kimbundu","kn":"kannada","ko":"coreeană","kok":"konkani","kos":"kosrae","kpe":"kpelle","kr":"kanuri","krc":"karaceai-balkar","krl":"kareliană","kro":"kru","kru":"kurukh","ks":"cașmireză","ksb":"shambala","ksf":"bafia","ksh":"kölsch","ku":"kurdă","kum":"kumyk","kut":"kutenai","kv":"komi","kw":"cornică","ky":"kîrgîză","la":"latină","lad":"ladino","lag":"langi","lah":"lahnda","lam":"lamba","lb":"luxemburgheză","lez":"lezghian","lg":"ganda","li":"limburgheză","lkt":"Lakota","ln":"lingala","lo":"laoțiană","lol":"mongo","loz":"lozi","lt":"lituaniană","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseno","lun":"lunda","luo":"luo","lus":"lusahi","luy":"luyia","lv":"letonă","mad":"madureză","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makasar","man":"mandingo","map":"austroneziană","mas":"masai","mde":"maba","mdf":"moksha","mdr":"mandar","men":"mende","mer":"meru","mfe":"morisyen","mg":"malgașă","mga":"irlandeză mijlocie","mgh":"makhuwa-meetto","mgo":"Meta'","mh":"marshalleză","mi":"maori","mic":"micmac","min":"minangkabau","mis":"limbi diverse","mk":"macedoneană","mkh":"limbă mon-khmeră","ml":"malayalam","mn":"mongolă","mnc":"manciuriană","mni":"manipur","mno":"limbă manobo","mo":"moldovenească","moh":"mohawk","mos":"mossi","mr":"marathi","ms":"malay","mt":"malteză","mua":"mundang","mul":"limbi multiple","mun":"limbă munda","mus":"creek","mwl":"mirandeză","mwr":"marwari","my":"birmaneză","mye":"myene","myn":"limbă mayașă","myv":"erzya","na":"nauru","nah":"nahuatl","nai":"limbă nord-amerindiană","nap":"napolitană","naq":"nama","nb":"norvegiana bokmål","nd":"ndebele de nord","nds":"germana de jos","ne":"nepaleză","new":"newari","ng":"ndonga","nia":"nias","nic":"limbă nigero-kordofaniană","niu":"niueană","nl":"olandeză","nl-BE":"flamandă","nmg":"kwasio","nn":"norvegiană nynorsk","nnh":"ngiemboon","no":"norvegiană","nog":"nogai","non":"nordică veche","nqo":"n’ko","nr":"ndebele de sud","nso":"sotho de nord","nub":"limbă nubiană","nus":"nuer","nv":"navajo","nwc":"newari clasică","ny":"nyanja","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzima","oc":"occitană","oj":"ojibwa","om":"oromo","or":"oriya","os":"osetă","osa":"osage","ota":"turcă otomană","oto":"limbă otomi","pa":"punjabi","paa":"limbă papuașă","pag":"pangasinan","pal":"pahlavi","pam":"pampanga","pap":"papiamento","pau":"palauană","peo":"persană veche","phi":"limbă filipineză","phn":"feniciană","pi":"pali","pl":"poloneză","pon":"pohnpeiană","pra":"limbă prakrit","pro":"provensală veche","ps":"pushto","pt":"portugheză","pt-BR":"portugheză braziliană","pt-PT":"portugheză europeană","qu":"quechua","raj":"rajasthani","rap":"rapanui","rar":"rarotongan","rm":"retoromană","rn":"kirundi","ro":"română","roa":"limbă romanică","rof":"rombo","rom":"romani","root":"root","ru":"rusă","rup":"aromână","rw":"kinyarwanda","rwk":"rwa","sa":"sanscrită","sad":"sandawe","sah":"sakha","sai":"limbă sud-amerindiană","sal":"limbă salishan","sam":"aramaică samariteană","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sardiniană","scn":"siciliană","sco":"scots","sd":"sindhi","se":"sami de nord","see":"seneca","seh":"sena","sel":"selkup","sem":"limbă semitică","ses":"koyraboro Senni","sg":"sango","sga":"irlandeză veche","sgn":"limbaj mimico-gestual","sh":"sârbo-croată","shi":"tachelhit","shn":"shan","shu":"arabă ciadiană","si":"singaleză","sid":"sidamo","sio":"limbă siouană","sit":"limbă sino-tibetană","sk":"slovacă","sl":"slovenă","sla":"limbă slavă","sm":"samoană","sma":"sami de sud","smi":"limbă sami","smj":"lule sami","smn":"inari sami","sms":"skolt sami","sn":"shona","snk":"soninke","so":"somaleză","sog":"sogdien","son":"songhai","sq":"albaneză","sr":"sârbă","srn":"sranan tongo","srr":"serer","ss":"swati","ssa":"limbă nilo-sahariană","ssy":"saho","st":"sesotho","su":"sundaneză","suk":"sukuma","sus":"susu","sux":"sumeriană","sv":"suedeză","sw":"swahili","swb":"comoreză","swc":"swahili Congo","syc":"siriacă clasică","syr":"siriacă","ta":"tamilă","tai":"limbă thai","te":"telugu","tem":"timne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tadjică","th":"thailandeză","ti":"tigrinya","tig":"tigre","tiv":"tiv","tk":"turkmenă","tkl":"tokelau","tl":"tagalog","tlh":"klingoniană","tli":"tlingit","tmh":"tamashek","tn":"setswana","to":"tonga","tog":"nyasa tonga","tpi":"tok pisin","tr":"turcă","trv":"taroko","ts":"tsonga","tsi":"tsimshian","tt":"tătară","tum":"tumbuka","tup":"limbă tupi","tut":"limbă altaică","tvl":"tuvalu","tw":"twi","twq":"tasawaq","ty":"tahitiană","tyv":"tuvană","tzm":"tamazight central marocană","udm":"udmurt","ug":"uigur","uga":"ugaritică","uk":"ucraineană","umb":"umbundu","und":"limbă necunoscută","ur":"urdu","uz":"uzbecă","vai":"vai","ve":"venda","vi":"vietnameză","vo":"volapuk","vot":"votic","vun":"vunjo","wa":"valonă","wae":"walser","wak":"limbă wakashan","wal":"walamo","war":"waray","was":"washo","wen":"limbă sorabă","wo":"wolof","xal":"calmucă","xh":"xhosa","xog":"soga","yao":"yao","yap":"yapeză","yav":"yangben","ybb":"yemba","yi":"idiș","yo":"yoruba","ypk":"limbă yupik","yue":"cantoneză","za":"zhuang","zap":"zapotecă","zbl":"simboluri Bilss","zen":"zenaga","zh":"chineză","zh-Hans":"chineză simplificată","zh-Hant":"chineză tradițională","znd":"zande","zu":"zulu","zun":"zuni","zxx":"fară conținut lingvistic","zza":"zaza"},"ru":{"aa":"афар","ab":"абхазский","ace":"ачехский","ach":"ачоли","ada":"адангме","ady":"адыгейский","ae":"авестийский","af":"африкаанс","afa":"афразийский язык","afh":"африхили","agq":"агхем","ain":"айну","ak":"акан","akk":"аккадский","ale":"алеутский","alg":"алгонкинские языки","alt":"южноалтайский","am":"амхарский","an":"арагонский","ang":"староанглийский","anp":"ангика","apa":"апачские языки","ar":"арабский","ar-001":"Modern Standard Arabic","arc":"арамейский","arn":"арауканский","arp":"арапахо","art":"искусственный язык","arw":"аравакский","as":"ассамский","asa":"аса","ast":"астурийский","ath":"атапачские языки","aus":"австралийский язык","av":"аварский","awa":"авадхи","ay":"аймара","az":"азербайджанский","ba":"башкирский","bad":"банда","bai":"бамилеке языки","bal":"белуджский","ban":"балийский","bas":"баса","bat":"балтийский язык","bax":"бамум","bbj":"Ghomala","be":"белорусский","bej":"беджа","bem":"бемба","ber":"берберский","bez":"бена","bfd":"Bafut","bg":"болгарский","bh":"бихари","bho":"бходжпури","bi":"бислама","bik":"бикольский","bin":"бини","bkm":"Kom","bla":"сиксика","bm":"бамбарийский","bn":"бенгальский","bnt":"банту","bo":"тибетский","br":"бретонский","bra":"брауи","brx":"бодо","bs":"боснийский","bss":"Akoose","btk":"батакский","bua":"бурятский","bug":"бугийский","bum":"Bulu","byn":"билин (блин)","byv":"Medumba","ca":"каталанский","cad":"каддо","cai":"язык индейцев Центральной Америки","car":"кариб","cau":"кавказский язык","cay":"Cayuga","cch":"атсам","ce":"чеченский","ceb":"кебуано","cel":"кельтские другие","cgg":"чига","ch":"чаморро","chb":"чибча","chg":"чагатайский","chk":"чукотский","chm":"марийский (черемисский)","chn":"чинук жаргон","cho":"чоктав","chp":"чипевайян","chr":"чероки","chy":"чейенн","ckb":"сорани курдский","cmc":"чамский язык","co":"корсиканский","cop":"коптский","cpe":"англо-креольские и пиджин","cpf":"франко-креольские и пиджины","cpp":"португало-креольские и пиджины","cr":"криийский","crh":"крымско-татарский","crp":"креольские и пиджины","cs":"чешский","csb":"кашубианский","cu":"церковнославянский","cus":"кушитский язык","cv":"чувашский","cy":"валлийский","da":"датский","dak":"дакота","dar":"даргва","dav":"таита","day":"даяк","de":"немецкий","de-AT":"австрийский немецкий","de-CH":"швейцарский верхненемецкий","del":"делаварский","den":"славянский","dgr":"догриб","din":"динка","dje":"зарма","doi":"догри","dra":"дравидийский язык","dsb":"нижнелужицкий","dua":"дуала","dum":"средненидерландский","dv":"мальдивский","dyo":"дьола-фоньи","dyu":"диула (дьюла)","dz":"дзонг-кэ","dzg":"Dazaga","ebu":"эмбу","ee":"эве","efi":"эфик","egy":"древнеегипетский","eka":"экаджук","el":"греческий","elx":"эламский","en":"английский","en-AU":"австралийский английский","en-CA":"канадский английский","en-GB":"британский английский","en-US":"американский английский","enm":"среднеанглийский","eo":"эсперанто","es":"испанский","es-419":"латиноамериканский испанский","es-ES":"европейский испанский","et":"эстонский","eu":"баскский","ewo":"эвондо","fa":"персидский","fan":"фанг","fat":"фанти","ff":"фулах","fi":"финский","fil":"филиппинский","fiu":"финно-угорский язык","fj":"фиджи","fo":"фарерский","fon":"фон","fr":"французский","fr-CA":"канадский французский","fr-CH":"швейцарский французский","frm":"среднефранцузский","fro":"старофранцузский","frr":"фризский северный","frs":"восточный фризский","fur":"фриульский","fy":"западный фризский","ga":"ирландский","gaa":"га","gay":"гайо","gba":"гбая","gd":"гэльский","gem":"германский язык","gez":"геэз","gil":"гильбертский","gl":"галисийский","gmh":"средневерхненемецкий","gn":"гуарани","goh":"древневерхненемецкий","gon":"гонди","gor":"горонтало","got":"готский","grb":"гребо","grc":"древнегреческий","gsw":"швейцарский немецкий","gu":"гуджарати","guz":"гусии","gv":"мэнский","gwi":"гвичин","ha":"хауса","hai":"хайда","haw":"гавайский","he":"иврит","hi":"хинди","hil":"хилигайнон","him":"химачали","hit":"хеттский","hmn":"хмонг","ho":"хиримоту","hr":"хорватский","hsb":"верхнелужицкий","ht":"гаитянский","hu":"венгерский","hup":"хупа","hy":"армянский","hz":"гереро","ia":"интерлингва","iba":"ибанский","ibb":"Ibibio","id":"индонезийский","ie":"интерлингве","ig":"игбо","ii":"сычуань","ijo":"иджо","ik":"инупиак","ilo":"илоко","inc":"индийский язык","ine":"индоевропейский язык","inh":"ингушский","io":"идо","ira":"иранский язык","iro":"ирокезские языки","is":"исландский","it":"итальянский","iu":"инуктитут","ja":"японский","jbo":"ложбан","jgo":"Ngomba","jmc":"мачаме","jpr":"еврейско-персидский","jrb":"еврейско-арабский","jv":"яванский","ka":"грузинский","kaa":"каракалпакский","kab":"кабильский","kac":"качинский","kaj":"каджи","kam":"камба","kar":"каренский","kaw":"кави","kbd":"кабардинский","kbl":"Kanembu","kcg":"тьяп","kde":"маконде","kea":"кабувердьяну","kfo":"коро","kg":"конго","kha":"кхаси","khi":"койсанский язык","kho":"хотанский","khq":"койра чиини","ki":"кикуйю","kj":"кунама","kk":"казахский","kkj":"како","kl":"гренландский","kln":"календжин","km":"кхмерский","kmb":"кимбундийский","kn":"каннада","ko":"корейский","kok":"конкани","kos":"косраенский","kpe":"кпелле","kr":"канури","krc":"карачаево-балкарский","krl":"карельский","kro":"кру","kru":"курух","ks":"кашмири","ksb":"шамбала","ksf":"бафия","ksh":"кёльш","ku":"курдский","kum":"кумыкский","kut":"кутенаи","kv":"коми","kw":"корнийский","ky":"киргизский","la":"латинский","lad":"ладино","lag":"ланги","lah":"лахнда","lam":"ламба","lb":"люксембургский","lez":"лезгинский","lg":"ганда","li":"лимбургский","lkt":"Lakota","ln":"лингала","lo":"лаосский","lol":"монго","loz":"лози","lt":"литовский","lu":"луба-катанга","lua":"луба-лулуа","lui":"луисеньо","lun":"лунда","luo":"луо (Кения и Танзания)","lus":"лушай","luy":"лухья","lv":"латышский","mad":"мадурский","maf":"Mafa","mag":"магахи","mai":"майтхили","mak":"макассарский","man":"мандинго","map":"австронезийский","mas":"масаи","mde":"Maba","mdf":"мокшанский","mdr":"мандарский","men":"менде","mer":"меру","mfe":"маврикийский креольский","mg":"малагасийский","mga":"среднеирландский","mgh":"макуа-меетто","mgo":"Meta'","mh":"маршалльский","mi":"маори","mic":"микмак","min":"минангкабау","mis":"смешанные языки","mk":"македонский","mkh":"монкхмерский язык","ml":"малаялам","mn":"монгольский","mnc":"маньчжурский","mni":"манипурский","mno":"манобо языки","mo":"молдавский","moh":"мохаук","mos":"моси","mr":"маратхи","ms":"малайский","mt":"мальтийский","mua":"мунданг","mul":"несколько языков","mun":"мунда языки","mus":"крик","mwl":"мирандийский","mwr":"марвари","my":"бирманский","mye":"Myene","myn":"майя языки","myv":"эрзя","na":"науру","nah":"ацтекский","nai":"язык индейцев Северной Америки","nap":"неаполитанский","naq":"нама","nb":"норвежский букмол","nd":"северный ндебели","nds":"нижнегерманский","ne":"непальский","new":"неварский","ng":"ндонга","nia":"ниас","nic":"нигер-кордофанский язык","niu":"ниуэ","nl":"голландский","nl-BE":"фламандский","nmg":"квасио","nn":"норвежский нюнорск","nnh":"Ngiemboon","no":"норвежский","nog":"ногайский","non":"старонорвежский","nqo":"нко","nr":"ндебели южный","nso":"сото северный","nub":"нубийские языки","nus":"нуэр","nv":"навахо","nwc":"невари (классический)","ny":"ньянджа","nym":"ньямвези","nyn":"ньянколе","nyo":"ньоро","nzi":"нзима","oc":"окситанский","oj":"оджибва","om":"оромо","or":"ория","os":"осетинский","osa":"оседжи","ota":"старотурецкий","oto":"отомангские языки","pa":"панджаби","paa":"папуасский язык","pag":"пангасинан","pal":"пехлевийский","pam":"пампанга","pap":"папьяменто","pau":"палау","peo":"староперсидский","phi":"филиппинский язык","phn":"финикийский","pi":"пали","pl":"польский","pon":"понапе","pra":"пракриты языки","pro":"старопровансальский","ps":"пушту","pt":"португальский","pt-BR":"бразильский португальский","pt-PT":"европейский португальский","qu":"кечуа","raj":"раджастхани","rap":"рапануи","rar":"раротонганский","rm":"романшский","rn":"рунди","ro":"румынский","roa":"романский язык","rof":"ромбо","rom":"цыганский","root":"корневой язык","ru":"русский","rup":"арумынский","rw":"киньяруанда","rwk":"руанда","sa":"санскрит","sad":"сандаве","sah":"якутский","sai":"язык индейцев Южной Америки","sal":"салишские языки","sam":"самаритянский арамейский","saq":"самбуру","sas":"сасаки","sat":"сантали","sba":"Ngambay","sbp":"сангу","sc":"сардинский","scn":"сицилийский","sco":"шотландский","sd":"синдхи","se":"северносаамский","see":"сенека","seh":"сена","sel":"селькупский","sem":"семитский язык","ses":"койраборо сенни","sg":"санго","sga":"староирландский","sgn":"язык глухонемых","sh":"сербскохорватский","shi":"тахелхит","shn":"шанский","shu":"Chadian Arabic","si":"сингальский","sid":"сидама","sio":"сиу языки","sit":"синотибетский язык","sk":"словацкий","sl":"словенский","sla":"славянский язык","sm":"самоанский","sma":"саамский (южный)","smi":"саамские языки","smj":"луле-саамский","smn":"инари-саамский","sms":"скольт-саамский","sn":"шона","snk":"сонинке","so":"сомали","sog":"согдийский","son":"сонгаи","sq":"албанский","sr":"сербский","srn":"сранан тонго","srr":"серер","ss":"свази","ssa":"нило-сахарский язык","ssy":"Saho","st":"сото южный","su":"сунданский","suk":"сукума","sus":"сусу","sux":"шумерский","sv":"шведский","sw":"суахили","swb":"коморский","swc":"конголезский суахили","syc":"классический сирийский","syr":"сирийский","ta":"тамильский","tai":"тайский язык","te":"телугу","tem":"темне","teo":"тесо","ter":"терено","tet":"тетум","tg":"таджикский","th":"тайский","ti":"тигринья","tig":"тигре","tiv":"тиви","tk":"туркменский","tkl":"токелайский","tl":"тагалог","tlh":"клингонский","tli":"тлингит","tmh":"тамашек","tn":"тсвана","to":"тонганский","tog":"ньяса (тонга)","tpi":"ток-писин","tr":"турецкий","trv":"Taroko","ts":"тсонга","tsi":"цимшиан","tt":"татарский","tum":"тумбука","tup":"тупи","tut":"алтайский язык","tvl":"тувалу","tw":"тви","twq":"тасавак","ty":"таитянский","tyv":"тувинский","tzm":"тамазит (Центральное Марокко)","udm":"удмуртский","ug":"уйгурский","uga":"угаритский","uk":"украинский","umb":"умбунду","und":"неизвестный язык","ur":"урду","uz":"узбекский","vai":"ваи","ve":"венда","vi":"вьетнамский","vo":"волапюк","vot":"водский","vun":"вунджо","wa":"валлонский","wae":"Walser","wak":"вакашские языки","wal":"воламо","war":"варай","was":"вашо","wen":"лужицкие языки","wo":"волоф","xal":"калмыцкий","xh":"ксоза","xog":"сога","yao":"яо","yap":"яп","yav":"янбан","ybb":"Yemba","yi":"идиш","yo":"йоруба","ypk":"юпикский язык","yue":"кантонский","za":"чжуань","zap":"сапотекский","zbl":"блиссимволика","zen":"зенагский","zh":"китайский","zh-Hans":"упрощенный китайский","zh-Hant":"традиционный китайский","znd":"занде","zu":"зулу","zun":"зуньи","zxx":"без языкового содержания","zza":"заза"},"sk":{"aa":"afarčina","ab":"abcházština","ace":"acehčina","ach":"ačoli","ada":"adangme","ady":"adygčina","ae":"avestčina","af":"afrikánčina","afa":"afroázijské jazyky","afh":"afrihili","agq":"aghem","ain":"ainčina","ak":"akančina","akk":"akkadčina","ale":"aleutčina","alg":"algonkinské jazyky","alt":"južná altajčina","am":"amharčina","an":"aragónčina","ang":"stará angličtina","anp":"angika","apa":"apačské jazyky","ar":"arabčina","ar-001":"Modern Standard Arabic","arc":"aramejčina","arn":"araukánčina","arp":"arapaho","art":"umelý jazyk","arw":"arawačtina","as":"ásámčina","asa":"asu","ast":"astúrčina","ath":"athabaské jazyky","aus":"austrálske jazyky","av":"avarčina","awa":"avadhčina","ay":"aymarčina","az":"azerčina","ba":"baskirčina","bad":"banda","bai":"bamileke","bal":"balúčtina","ban":"balijčina","bas":"basa","bat":"baltské jazyky","bax":"bamun","bbj":"ghomala","be":"bieloruština","bej":"bedža","bem":"bemba","ber":"berberské jazyky","bez":"bena","bfd":"bafut","bg":"bulharčina","bh":"bihárske jazyky","bho":"bhódžpurčina","bi":"bislama","bik":"bikol","bin":"bini","bkm":"kom","bla":"siksika","bm":"bambarčina","bn":"bengálčina","bnt":"bantuské jazyky","bo":"tibetčina","br":"bretónčina","bra":"bradžčina","brx":"bodo","bs":"bosniačtina","bss":"akoose","btk":"batacké jazyky","bua":"buriatčina","bug":"bugiština","bum":"bulu","byn":"blin","byv":"medumba","ca":"katalánčina","cad":"kaddo","cai":"jazyk stredoamerických indiánov","car":"karibský","cau":"kaukazské jazyky","cay":"cayuga","cch":"atsam","ce":"čečenčina","ceb":"cebuánčina","cel":"keltské jazyky","cgg":"čiga","ch":"čamorčina","chb":"čibča","chg":"čagatajčina","chk":"truk","chm":"marijčina","chn":"činucký žargón","cho":"čoktavčina","chp":"čipevajčina","chr":"čerokí","chy":"čejenčina","ckb":"kurdčina (sorání)","cmc":"čamaské jazyky","co":"korzičtina","cop":"koptčina","cpe":"anglická kreolčina alebo pidžin","cpf":"francúzska kreolčina alebo pidžin","cpp":"portugalská kreolčina alebo pidžin","cr":"krí","crh":"krymská turečtina","crp":"kreolčina alebo pidžin","cs":"čeština","csb":"kašubčina","cu":"cirkevná slovančina","cus":"kušitské jazyky","cv":"čuvaština","cy":"waleština","da":"dánčina","dak":"dakotčina","dar":"darginčina","dav":"taita","day":"dajačtina","de":"nemčina","de-AT":"rakúska nemčina","de-CH":"švajčiarska spisovná nemčina","del":"delawarčina","den":"slovančina","dgr":"dogribčina","din":"dinka","dje":"zarma","doi":"dógrí","dra":"drávidské jazyky","dsb":"dolnolužická srbčina","dua":"duala","dum":"stredná holandčina","dv":"divehi","dyo":"jola-fonyi","dyu":"ďula","dz":"dzongkä","dzg":"dazaga","ebu":"embu","ee":"eweština","efi":"efik","egy":"staroegyptský","eka":"ekadžuk","el":"gréčtina","elx":"elamčina","en":"angličtina","en-AU":"austrálska angličtina","en-CA":"kanadská angličtina","en-GB":"britská angličtina","en-US":"americká angličtina","enm":"stredná angličtina","eo":"esperanto","es":"španielčina","es-419":"latinskoamerická španielčina","es-ES":"iberská španielčina","et":"estónčina","eu":"baskičtina","ewo":"ewondo","fa":"perzština","fan":"fangčina","fat":"fanti","ff":"fulbčina","fi":"fínčina","fil":"filipínčina","fiu":"ugrofínske jazyky","fj":"fidžijčina","fo":"faerčina","fon":"fončina","fr":"francúzština","fr-CA":"kanadská francúzština","fr-CH":"švajčiarska francúzština","frm":"stredná francúzština","fro":"stará francúzština","frr":"severná frízština","frs":"východná frízština","fur":"friulčina","fy":"západná frízština","ga":"írčina","gaa":"ga","gay":"gayo","gba":"gbaja","gd":"škótska gaelčina","gem":"germánske jazyky","gez":"etiópčina","gil":"kiribatčina","gl":"galícijčina","gmh":"stredná horná nemčina","gn":"guaraní","goh":"stará horná nemčina","gon":"góndčina","gor":"gorontalo","got":"gótčina","grb":"grebo","grc":"starogréčtina","gsw":"švajčiarska nemčina","gu":"gudžarátčina","guz":"gusii","gv":"mančina","gwi":"gwichʼin","ha":"hauština","hai":"haida","haw":"havajčina","he":"hebrejčina","hi":"hindčina","hil":"hiligajnončina","him":"himachali","hit":"chetitčina","hmn":"hmong","ho":"hiri motu","hr":"chorvátčina","hsb":"hornolužická srbčina","ht":"haitčina","hu":"maďarčina","hup":"hupčina","hy":"arménčina","hz":"herero","ia":"interlingua","iba":"ibančina","ibb":"ibibio","id":"indonézština","ie":"interlingue","ig":"igboština","ii":"s’čchuanská ioština","ijo":"idžo","ik":"inupiaq","ilo":"ilokánčina","inc":"indické jazyky","ine":"indoeurópske jazyky","inh":"inguština","io":"ido","ira":"iránske jazyky","iro":"irokézske jazyky","is":"islandčina","it":"taliančina","iu":"inuktitut","ja":"japončina","jbo":"lojban","jgo":"Ngomba","jmc":"machame","jpr":"židovská perzština","jrb":"židovská arabčina","jv":"jávčina","ka":"gruzínčina","kaa":"karakalpačtina","kab":"kabylčina","kac":"kačjinčina","kaj":"jju","kam":"kamba","kar":"karenčina","kaw":"kawi","kbd":"kabardčina","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"kapverdčina","kfo":"koro","kg":"kongčina","kha":"khasijčina","khi":"kojsanské jazyky","kho":"chotančina","khq":"západná songhajčina","ki":"kikuju","kj":"kuaňama","kk":"kazaština","kkj":"kako","kl":"grónska eskimáčtina","kln":"kalenjin","km":"kambodžská khmérčina","kmb":"kimbundu","kn":"kannadčina","ko":"kórejčina","kok":"kónkánčina","kos":"kusaie","kpe":"kpelle","kr":"kanurijčina","krc":"karačajevsko-balkarský jazyk","krl":"karelčina","kro":"kru","kru":"kurukhčina","ks":"kašmírčina","ksb":"šambala","ksf":"bafia","ksh":"kolínčina","ku":"kurdčina","kum":"kumyčtina","kut":"kutenajčina","kv":"komijčina","kw":"kornčina","ky":"kirgizština","la":"latinčina","lad":"židovská španielčina","lag":"langi","lah":"lahandčina","lam":"lamba","lb":"luxemburčina","lez":"lezginčina","lg":"gandčina","li":"limburčina","lkt":"Lakota","ln":"lingalčina","lo":"laoština","lol":"mongo","loz":"lozi","lt":"litovčina","lu":"luba-katanga","lua":"luba-luluánčina","lui":"luiseňo","lun":"lunda","luo":"luo","lus":"mizorámčina","luy":"luyia","lv":"lotyština","mad":"madurčina","maf":"mafa","mag":"magadhčina","mai":"maithilčina","mak":"makasarčina","man":"mandingo","map":"austronézske jazyky","mas":"masajčina","mde":"maba","mdf":"mokšiančina","mdr":"mandarčina","men":"mendi","mer":"meru","mfe":"maurícijská kreolčina","mg":"malgaština","mga":"stredná írčina","mgh":"makhuwa-meetto","mgo":"Meta'","mh":"kajin-majol","mi":"maorijčina","mic":"mikmakčina","min":"minangkabaučina","mis":"rôznorodý jazyk","mk":"macedónčina","mkh":"mon-khmérsky jazyk","ml":"malajálamčina","mn":"mongolčina","mnc":"mandžuština","mni":"manípurčina","mno":"jazyk manobo","mo":"moldavčina","moh":"mohawk","mos":"mossi","mr":"maráthčina","ms":"malajčina","mt":"maltčina","mua":"mundang","mul":"viaceré jazyky","mun":"mundský jazyk","mus":"kríkčina","mwl":"mirandčina","mwr":"marawari","my":"barmčina","mye":"myene","myn":"mayské jazyky","myv":"erzjančina","na":"nauru","nah":"nahuaský jazyk","nai":"jazyk severoamerických indiánov","nap":"neapolčina","naq":"nama","nb":"nórsky bokmål","nd":"severné ndbele","nds":"dolná nemčina","ne":"nepálčina","new":"nevárčina","ng":"ndonga","nia":"niasánčina","nic":"nigersko-konžský jazyk","niu":"niueština","nl":"holandčina","nl-BE":"flámčina","nmg":"kwasio","nn":"nórsky nynorsk","nnh":"ngiemboon","no":"nórčina","nog":"nogajčina","non":"stará nórčina","nqo":"n’ko","nr":"južná ndebelčina","nso":"severná sothčina","nub":"núbijský jazyk","nus":"nuer","nv":"navajo","nwc":"klasická nevárčina","ny":"čewa","nym":"ňamwezi","nyn":"ňankole","nyo":"ňoro","nzi":"nzima","oc":"okcitánčina","oj":"odžibva","om":"oromčina","or":"uríjčina","os":"osetčina","osa":"osagčina","ota":"osmanská turečtina","oto":"oto-pameský jazyk","pa":"pandžábčina","paa":"papuánsky","pag":"pangasinančina","pal":"pahlaví","pam":"pampanga","pap":"papiamento","pau":"palaučina","peo":"stará perzština","phi":"filipínsky jazyk","phn":"feničtina","pi":"pálí","pl":"poľština","pon":"pohnpeičina","pra":"prakrity","pro":"stará okcitánčina","ps":"paštčina","pt":"portugalčina","pt-BR":"brazílska portugalčina","pt-PT":"iberská portugalčina","qu":"kečuánčina","raj":"radžastančina","rap":"rapanujčina","rar":"rarotongan","rm":"rétorománčina","rn":"rundčina","ro":"rumunčina","roa":"románsky jazyk","rof":"rombo","rom":"rómčina","root":"koreň","ru":"ruština","rup":"arumunčina","rw":"rwandčina","rwk":"rwa","sa":"sanskrit","sad":"sandawe","sah":"jakutčina","sai":"jazyk juhoamerických indiánov","sal":"sališský jazyk","sam":"samaritánska aramejčina","saq":"samburu","sas":"sasačtina","sat":"santalčina","sba":"ngambay","sbp":"sangu","sc":"sardínčina","scn":"sicílčina","sco":"škótčina","sd":"sindhčina","se":"severná saamčina","see":"seneca","seh":"sena","sel":"selkupčina","sem":"semitský jazyk","ses":"koyraboro senni","sg":"sango","sga":"stará írčina","sgn":"znaková reč","sh":"srbochorvátčina","shi":"tachelhit","shn":"šančina","shu":"čadská arabčina","si":"sinhalčina","sid":"sidamo","sio":"siouský jazyk","sit":"sinotibetský jazyk","sk":"slovenčina","sl":"slovinčina","sla":"slovenský jazyk","sm":"samojčina","sma":"južná saamčina","smi":"saamský jazyk","smj":"luleská saamčina","smn":"inariská saamčina","sms":"skolt","sn":"šončina","snk":"soninke","so":"somálčina","sog":"sogdijčina","son":"songhajčina","sq":"albánčina","sr":"srbčina","srn":"sranan","srr":"serer","ss":"svazijčina","ssa":"nilosaharský jazyk","ssy":"saho","st":"južná sothčina","su":"sundčina","suk":"sukuma","sus":"susu","sux":"sumerčina","sv":"švédčina","sw":"swahilčina","swb":"komorčina","swc":"konžská svahilčina","syc":"klasická sýrčina","syr":"sýrčina","ta":"tamilčina","tai":"thajský jazyk","te":"telugčina","tem":"temne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tadžičtina","th":"thajčina","ti":"tigriňa","tig":"tigrejčina","tiv":"tiv","tk":"turkménčina","tkl":"tokelaučina","tl":"tagalčina","tlh":"klingónčina","tli":"tlingitčina","tmh":"tamašek","tn":"tswančina","to":"tongčina","tog":"ňasa tonga","tpi":"tok pisin","tr":"turečtina","trv":"taroko","ts":"tsonga","tsi":"tsimshijské jazyky","tt":"tatárčina","tum":"tumbuka","tup":"jazyk tupi","tut":"altajské jazyky","tvl":"tuvalčina","tw":"twi","twq":"tasawak","ty":"tahitčina","tyv":"tuviančina","tzm":"stredomarocká berberčina","udm":"udmurtčina","ug":"ujgurčina","uga":"ugaritčina","uk":"ukrajinčina","umb":"umbundu","und":"neznámy jazyk","ur":"urdčina","uz":"uzbečtina","vai":"vai","ve":"vendčina","vi":"vietnamčina","vo":"volapük","vot":"vodčina","vun":"vunjo","wa":"valónčina","wae":"walserčina","wak":"wakašský jazyk","wal":"walamo","war":"waray","was":"washo","wen":"lužickosrbský jazyk","wo":"wolof","xal":"kalmyčtina","xh":"xhosa","xog":"soga","yao":"jao","yap":"japčina","yav":"jangben","ybb":"yemba","yi":"jidiš","yo":"jorubčina","ypk":"juitsko-jupický jazyk","yue":"kantončina","za":"čuangčina","zap":"zapotéčtina","zbl":"systém Bliss","zen":"zenaga","zh":"čínština","zh-Hans":"zjednodušená čínština","zh-Hant":"tradičná čínština","znd":"zandský jazyk","zu":"zuluština","zun":"zuniština","zxx":"bez jazykového obsahu","zza":"zázá"},"sq":{"aa":"Afar","ab":"Abkhazian","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"Afrikaans","afa":"Afro-Asiatic Language","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"Akan","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"Amharic","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"Arabisht","ar-001":"Modern Standard Arabic","arc":"Aramaic","arn":"Mapuche","arp":"Arapaho","art":"Artificial Language","arw":"Arawak","as":"Assamese","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"Aymara","az":"Azeri","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"Belarusian","bej":"Beja","bem":"Bemba","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"Bulgarian","bh":"Bihari","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengali","bnt":"Bantu","bo":"Tibetan","br":"Breton","bra":"Braj","brx":"Bodo","bs":"Bosnian","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Catalan","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Celtic Language","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Cheyenne","ckb":"Sorani Kurdish","cmc":"Chamic Language","co":"Corsican","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"Czech","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"Welsh","da":"Danish","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"Gjermanisht","de-AT":"Austrian German","de-CH":"Swiss High German","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Dzongkha","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Ancient Egyptian","eka":"Ekajuk","el":"Greek","elx":"Elamite","en":"Anglisht","en-AU":"Australian English","en-CA":"Canadian English","en-GB":"British English","en-US":"U.S. English","enm":"Middle English","eo":"Esperanto","es":"Spanjisht","es-419":"Latin American Spanish","es-ES":"European Spanish","et":"Estonian","eu":"Basque","ewo":"Ewondo","fa":"Persian","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Finnish","fil":"Filipino","fiu":"Finno-Ugrian Language","fj":"Fijian","fo":"Faroese","fon":"Fon","fr":"Frengjisht","fr-CA":"Canadian French","fr-CH":"Swiss French","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"Western Frisian","ga":"Irish","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"Scottish Gaelic","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"Galician","gmh":"Middle High German","gn":"Guarani","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Ancient Greek","gsw":"Swiss German","gu":"Gujarati","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaiian","he":"Hebrew","hi":"Hindi","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"Croatian","hsb":"Upper Sorbian","ht":"Haitian","hu":"Hungarian","hup":"Hupa","hy":"Armenian","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Indonesian","ie":"Interlingue","ig":"Igbo","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"Icelandic","it":"Italisht","iu":"Inuktitut","ja":"Japanisht","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"Javanese","ka":"Georgian","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazakh","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"Khmer","kmb":"Kimbundu","kn":"Kannada","ko":"Korean","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"Kashmiri","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Kurdish","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"Kirghiz","la":"Latin","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Luxembourgish","lez":"Lezghian","lg":"Ganda","li":"Limburgish","lkt":"Lakota","ln":"Lingala","lo":"Lao","lol":"Mongo","loz":"Lozi","lt":"Lithuanian","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"Latvian","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malagasy","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"Maori","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"Macedonian","mkh":"Mon-Khmer Language","ml":"Malayalam","mn":"Mongolian","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"Marathi","ms":"Malay","mt":"Maltese","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"Burmese","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"Norwegian Bokmål","nd":"North Ndebele","nds":"Low German","ne":"Nepali","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"Holandisht","nl-BE":"Flemish","nmg":"Kwasio","nn":"Norwegian Nynorsk","nnh":"Ngiemboon","no":"Norwegian","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"Northern Sotho","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"Nyanja","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Occitan","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetic","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"Punjabi","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"Polish","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"Pushto","pt":"Portugeze","pt-BR":"Brazilian Portuguese","pt-PT":"European Portuguese","qu":"Quechua","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Romansh","rn":"Rundi","ro":"Romanian","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"Rusisht","rup":"Aromanian","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sanskrit","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"Sindhi","se":"Northern Sami","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"Sango","sga":"Old Irish","sgn":"Sign Language","sh":"Serbo-Kroatisht","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"Sinhala","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"Slovak","sl":"Slovenian","sla":"Slavic Language","sm":"Samoan","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somali","sog":"Sogdien","son":"Songhai","sq":"shqip","sr":"Serbian","srn":"Sranan Tongo","srr":"Serer","ss":"Swati","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"Southern Sotho","su":"Sundanese","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"Swedish","sw":"Swahili","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"Tamil","tai":"Tai Language","te":"Telugu","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tajik","th":"Thai","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Turkmen","tkl":"Tokelau","tl":"Tagalog","tlh":"Klingon","tli":"Tlingit","tmh":"Tamashek","tn":"Tswana","to":"Tongan","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Turkish","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tatar","tum":"Tumbuka","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"Tahitian","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"Uighur","uga":"Ugaritic","uk":"Ukrainian","umb":"Umbundu","und":"Unknown Language","ur":"Urdu","uz":"Uzbek","vai":"Vai","ve":"Venda","vi":"Vietnamese","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"Wolof","xal":"Kalmyk","xh":"Xhosa","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"Yiddish","yo":"Yoruba","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"Kineze","zh-Hans":"Simplified Chinese","zh-Hant":"Traditional Chinese","znd":"Zande","zu":"Zulu","zun":"Zuni","zxx":"No linguistic content","zza":"Zaza"},"sr":{"aa":"Афарски","ab":"Абказијски","ace":"Ачинески","ach":"Аколи","ada":"Адангмејски","ady":"Адигејски","ae":"Авестански","af":"Африканерски","afa":"Афро-азијатски","afh":"Африхили","agq":"Aghem","ain":"Аину","ak":"Акан","akk":"Акадијски","ale":"Аљут","alg":"Алгонквијански језик","alt":"Јужни алтаи","am":"Амхарски","an":"Арагонежански","ang":"Староенглески","anp":"Ангика","apa":"Апачки језик","ar":"Арапски","ar-001":"Modern Standard Arabic","arc":"Армајски","arn":"Ароканијски","arp":"Арапахо","art":"Вештачки","arw":"Аравак","as":"Асемијски","asa":"Asu","ast":"Астуријски","ath":"Атапаскан","aus":"Аустралијски језик","av":"Аварски","awa":"Авадхи","ay":"Ајмара","az":"Азерски","ba":"Башкир","bad":"Банда","bai":"Бамилеке","bal":"Балучи","ban":"Балинезијски","bas":"Баса","bat":"Балтички језик","bax":"Bamun","bbj":"Ghomala","be":"Белоруски","bej":"Беја","bem":"Бемба","ber":"Бербер","bez":"Bena","bfd":"Bafut","bg":"Бугарски","bh":"Бихарски","bho":"Бојпури","bi":"Бислама","bik":"Бикол","bin":"Бини","bkm":"Kom","bla":"Сисика","bm":"Бамбара","bn":"Бенгласки","bnt":"Банту","bo":"Тибетански","br":"Бретонски","bra":"Брај","brx":"Bodo","bs":"Босански","bss":"Akoose","btk":"Батак","bua":"Буриат","bug":"Бугинежански","bum":"Bulu","byn":"Блин","byv":"Medumba","ca":"Каталонски","cad":"Кадо","cai":"Централно амерички Индијански језик","car":"Карипски","cau":"Кавкаски","cay":"Cayuga","cch":"Атсамски","ce":"Чеченски","ceb":"Цебуано","cel":"Келтски","cgg":"Chiga","ch":"Чаморо","chb":"Чибча","chg":"Чагатаи","chk":"Чукески","chm":"Мари","chn":"Чинукски","cho":"Чоктавски","chp":"Чипвијански","chr":"Чероки","chy":"Чејенски","ckb":"сорани курдски","cmc":"Чамски језик","co":"Корзикански","cop":"Коптски","cpe":"Креолски или пиџин заснован на енглеском","cpf":"Креолски или пиџин заснован на француском","cpp":"Креолски или пиџин базиран на португалском","cr":"Кри","crh":"Кримеански турски","crp":"креолски или пиџин","cs":"Чешки","csb":"Кашубијански","cu":"Старословенски","cus":"Кушитички језик","cv":"Чувашки","cy":"Велшки","da":"Дански","dak":"Дакота","dar":"Даргва","dav":"Taita","day":"Дајашки","de":"Немачки","de-AT":"Аустријски немачки","de-CH":"Швајцарски високи немачки","del":"Делавер","den":"Славски","dgr":"Догриб","din":"Динка","dje":"Zarma","doi":"Догри","dra":"Дарвидијски језик","dsb":"Ниски сорбијански","dua":"Дуала","dum":"Средњи холандски","dv":"Дивехијски","dyo":"Jola-Fonyi","dyu":"Ђула","dz":"Џонга","dzg":"Dazaga","ebu":"Embu","ee":"Еве","efi":"Ефикски","egy":"Староегипатски","eka":"Екајук","el":"Грчки","elx":"Еламитски","en":"Енглески","en-AU":"Аустралијски енглески","en-CA":"Канадски енглески","en-GB":"Британски енглески","en-US":"САД енглески","enm":"Средњи енглески","eo":"Есперанто","es":"Шпански","es-419":"Латино-амерички шпански","es-ES":"Иберијски шпански","et":"Естонски","eu":"Баскијски","ewo":"Евондо","fa":"Персијски","fan":"Фанг","fat":"Фанти","ff":"Фулах","fi":"Фински","fil":"Филипински","fiu":"Угро-фински","fj":"Фиджијски","fo":"Фарски","fon":"Фон","fr":"Француски","fr-CA":"Канадски француски","fr-CH":"Швајцарски француски","frm":"Средњи француски","fro":"Старофранцуски","frr":"Северно-фризијски","frs":"Источни фризијски","fur":"Фриулијски","fy":"Фризијски","ga":"Ирски","gaa":"Га","gay":"Гајо","gba":"Гбаја","gd":"Шкотски Галски","gem":"Германски језик","gez":"Џиз","gil":"Гилбертшки","gl":"Галски","gmh":"Средњи високи немачки","gn":"Гварани","goh":"Старонемачки","gon":"Гонди","gor":"Горонтало","got":"Готски","grb":"Гребо","grc":"Старогрчки","gsw":"Швајцарски немачки","gu":"Гуџарати","guz":"Gusii","gv":"Манкс","gwi":"Гвич'ин","ha":"Хауса","hai":"Хаида","haw":"Хавајски","he":"Хебрејски","hi":"Хинди","hil":"Хилигајнон","him":"Химачали","hit":"Хитите","hmn":"Хмонг","ho":"Хири Моту","hr":"Хрватски","hsb":"Горњи сорбијски","ht":"Хаитски","hu":"Мађарски","hup":"Хупа","hy":"Јерменски","hz":"Хереро","ia":"Интерлингва","iba":"Ибан","ibb":"Ibibio","id":"Индонежански","ie":"Међујезички","ig":"Игбо","ii":"Сичуан ји","ijo":"Ијо","ik":"Унупиак","ilo":"Илоко","inc":"Индик","ine":"Индо-европски језик","inh":"Ингвишки","io":"Идо","ira":"Ирански језик","iro":"Ироквојански","is":"Исландски","it":"Италијански","iu":"Инуктитут","ja":"Јапански","jbo":"Лојбан","jgo":"Ngomba","jmc":"Machame","jpr":"Јудео-персијски","jrb":"Јудео-арапски","jv":"Јавански","ka":"Грузијски","kaa":"Кара-калпашки","kab":"Кабиле","kac":"Качин","kaj":"Ђу","kam":"Камба","kar":"Каренски","kaw":"Кави","kbd":"Кабардијски","kbl":"Kanembu","kcg":"Тјап","kde":"Makonde","kea":"Kabuverdianu","kfo":"Коро","kg":"Конго","kha":"Каси","khi":"Коисански језик","kho":"Котанешки","khq":"Koyra Chiini","ki":"Кикују","kj":"Куањама","kk":"Козачки","kkj":"Kako","kl":"Калалисут","kln":"Kalenjin","km":"Кмерски","kmb":"Кимбунду","kn":"Канада","ko":"Корејски","kok":"Конкани","kos":"Косреански","kpe":"Кпеле","kr":"Канури","krc":"Карачај-балкар","krl":"Карелијски","kro":"Кру","kru":"Курукх","ks":"Кашмирски","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"Курдски","kum":"Кумик","kut":"Кутенаи","kv":"Коми","kw":"Корнишки","ky":"Киргиски","la":"Латински","lad":"Ладино","lag":"Langi","lah":"Ланда","lam":"Ламба","lb":"Луксембуршки","lez":"Лезгиан","lg":"Ганда","li":"Лимбургиш","lkt":"Lakota","ln":"Лингала","lo":"Лаоски","lol":"Монго","loz":"Лози","lt":"Литвански","lu":"Луба-катанга","lua":"Луба-лулуа","lui":"Луисено","lun":"Лунда","luo":"Луо","lus":"Лушаи","luy":"Luyia","lv":"Летонски","mad":"Мадурешки","maf":"Mafa","mag":"Магахи","mai":"Маитили","mak":"Макасар","man":"Мандинго","map":"Аустронежански","mas":"Масаи","mde":"Maba","mdf":"Мокша","mdr":"Мандар","men":"Менде","mer":"Meru","mfe":"Морисјен","mg":"Малагасијски","mga":"Средњи ирски","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Маршалски","mi":"Маорски","mic":"Микмак","min":"Минангкабау","mis":"Разни језици","mk":"Македонски","mkh":"Мон-кмерски језик","ml":"Малајалам","mn":"Монголски","mnc":"Манчу","mni":"Манипури","mno":"Манобо језик","mo":"Молдавски","moh":"Махавски","mos":"Моси","mr":"Марати","ms":"Малајски","mt":"Мелтешки","mua":"Mundang","mul":"Више језика","mun":"Мунда језик","mus":"Кришки","mwl":"Мирандешки","mwr":"Марвари","my":"Бурмански","mye":"Myene","myn":"Мајански језик","myv":"Ерзија","na":"Науру","nah":"Нахуатл","nai":"Језик северноамеричких Индијанаца","nap":"Неаполитански","naq":"Nama","nb":"Норвешки бокмал","nd":"Северни ндебеле","nds":"Ниски немачки","ne":"Непалски","new":"Невари","ng":"Ндонга","nia":"Ниас","nic":"Нигер-кордофанијски језик","niu":"Ниуеан","nl":"Холандски","nl-BE":"Фламански","nmg":"Kwasio","nn":"Норвешки њорск","nnh":"Ngiemboon","no":"Норвешки","nog":"Ногаи","non":"Стари норски","nqo":"Н’ко","nr":"Јужни ндебеле","nso":"Северни сото","nub":"Нубијски језик","nus":"Nuer","nv":"Навахо","nwc":"Класични невари","ny":"Њања","nym":"Њамвези","nyn":"Њанколе","nyo":"Њоро","nzi":"Нзима","oc":"Провансалски","oj":"Ојибва","om":"Оромо","or":"Оријски","os":"Осетски","osa":"Осаге","ota":"Отомански турски","oto":"Отомански језик","pa":"Панџабски","paa":"Папуански језик","pag":"Пангасински","pal":"Пахлави","pam":"Пампанга","pap":"Папиаменто","pau":"Палауански","peo":"Староперсијски","phi":"Филипински језик","phn":"Феничански","pi":"Пали","pl":"Пољски","pon":"Понпејски","pra":"Пракритски","pro":"Старопровансалски","ps":"пашто","pt":"Португалски","pt-BR":"Бразилски португалски","pt-PT":"Иберијски португалски","qu":"Квенча","raj":"Рађастани","rap":"Рапануи","rar":"Раротонган","rm":"Рето-Романски","rn":"Рунди","ro":"Румунски","roa":"Романски језик","rof":"Rombo","rom":"Романи","root":"Рут","ru":"Руски","rup":"Ароманијски","rw":"Кинјаруанда","rwk":"Rwa","sa":"Санскрит","sad":"Сандаве","sah":"Јакут","sai":"Језик јужноамеричких Индијанаца","sal":"Салишански језик","sam":"Самаритански арамејски","saq":"Samburu","sas":"Сасак","sat":"Сантали","sba":"Ngambay","sbp":"Sangu","sc":"Сардињаски","scn":"Сицилијански","sco":"Шкотски","sd":"Синди","se":"Северни сами","see":"Seneca","seh":"Sena","sel":"Селкап","sem":"Семитски језик","ses":"Koyraboro Senni","sg":"Санго","sga":"Староирски","sgn":"Знаковни језик","sh":"Српскохрватски","shi":"Tachelhit","shn":"Шан","shu":"Chadian Arabic","si":"Сингалески","sid":"Сидамо","sio":"Сиуански језик","sit":"Сино-тибетански језик","sk":"Словачки","sl":"Словеначки","sla":"Словенски језик","sm":"Самоански","sma":"Јужни сами","smi":"Сами језик","smj":"Луле сами","smn":"Инари сами","sms":"Сколтски језик","sn":"Шона","snk":"Сонинке","so":"Сомалски","sog":"Соџијенски","son":"Сонгаи","sq":"Албански","sr":"Српски","srn":"Сранански тонго","srr":"Серер","ss":"Свати","ssa":"Нило-сахарски језик","ssy":"Saho","st":"Сесото","su":"Судански","suk":"Сукума","sus":"Сусу","sux":"Сумерски","sv":"Шведски","sw":"Свахили","swb":"Коморски","swc":"Congo Swahili","syc":"Класични сиријски","syr":"Сиријски","ta":"Тамилски","tai":"Таи језик","te":"Телугу","tem":"Тимне","teo":"Teso","ter":"Терено","tet":"Тетум","tg":"Тађик","th":"Тајландски","ti":"Тигриња","tig":"Тигре","tiv":"Тив","tk":"Туркменски","tkl":"Токелау","tl":"Тагалски","tlh":"Клингонски","tli":"Тлингит","tmh":"Тамашек","tn":"Тсвана","to":"Тонга","tog":"Њаса тонга","tpi":"Ток Писин","tr":"Турски","trv":"Taroko","ts":"Тсонга","tsi":"Тсимшиан","tt":"Татарски","tum":"Тумбука","tup":"Тупи језик","tut":"Алтаички језик","tvl":"Тувалу","tw":"Тви","twq":"Tasawaq","ty":"Тахићански","tyv":"Тувинијски","tzm":"Central Atlas Tamazight","udm":"Удмурт","ug":"ујгурски","uga":"Угаритски","uk":"Украјински","umb":"Умбунду","und":"Непознат или неважећи језик","ur":"Урду","uz":"Узбечки","vai":"Ваи","ve":"Венда","vi":"Вијетнамски","vo":"Волапук","vot":"Вотски","vun":"Vunjo","wa":"Валун","wae":"Walser","wak":"Вакашански језик","wal":"Валамо","war":"Варај","was":"Вашо","wen":"Сорбијански језик","wo":"Волоф","xal":"Калмик","xh":"Ксхоса","xog":"Soga","yao":"Јао","yap":"Јапешки","yav":"Yangben","ybb":"Yemba","yi":"Јидиш","yo":"Јоруба","ypk":"Јупик","yue":"Кантонски","za":"Жуанг","zap":"Запотечки","zbl":"Блисимболи","zen":"Зенага","zh":"Кинески","zh-Hans":"Кинески (поједностављен)","zh-Hant":"Кинески (традиционални)","znd":"Занде","zu":"Зулу","zun":"Зуни","zxx":"Без лингвистичког садржаја","zza":"Заза"},"sv":{"aa":"afar","ab":"abchaziska","ace":"acehnesiska","ach":"acholi","ada":"adangme","ady":"adygeiska","ae":"avestiska","af":"afrikaans","afa":"afroasiatiskt språk","afh":"afrihili","agq":"aghem","ain":"ainu","ak":"akan","akk":"akkadiska","ale":"aleutiska","alg":"algonkinskt språk","alt":"sydaltaiska","am":"amhariska","an":"aragonesiska","ang":"fornengelska","anp":"angika","apa":"apachespråk","ar":"arabiska","ar-001":"Modern Standard Arabic","arc":"arameiska","arn":"araukanska","arp":"arapaho","art":"konstgjort språk","arw":"arawakiska","as":"assamesiska","asa":"asu","ast":"asturiska","ath":"athapaskiskt språk","aus":"australiskt språk","av":"avariska","awa":"awadhi","ay":"aymara","az":"azerbajdzjanska","ba":"basjkiriska","bad":"bandaspråk","bai":"bamilekespråk","bal":"baluchiska","ban":"balinesiska","bas":"basa","bat":"baltiskt språk","bax":"bamunska","bbj":"ghomala","be":"vitryska","bej":"beja","bem":"bemba","ber":"berberspråk","bez":"bena","bfd":"bafut","bg":"bulgariska","bh":"bihari","bho":"bhojpuri","bi":"bislama","bik":"bikol","bin":"bini","bkm":"bamekon","bla":"siksika","bm":"bambara","bn":"bengali","bnt":"bantuspråk","bo":"tibetanska","br":"bretonska","bra":"braj","brx":"bodo","bs":"bosniska","bss":"bakossi","btk":"batak","bua":"burjätiska","bug":"buginesiska","bum":"boulou","byn":"blin","byv":"bagangte","ca":"katalanska","cad":"caddo","cai":"centralamerikanskt indianspråk","car":"karibiska","cau":"kaukasiskt språk","cay":"cayuga","cch":"atsam","ce":"tjetjenska","ceb":"cebuano","cel":"keltiskt språk","cgg":"chiga","ch":"chamorro","chb":"chibcha","chg":"chagatai","chk":"chuukesiska","chm":"mari","chn":"chinook","cho":"choctaw","chp":"chipewyan","chr":"cherokesiska","chy":"cheyenne","ckb":"soranisk kurdiska","cmc":"chamispråk","co":"korsikanska","cop":"koptiska","cpe":"engelskbaserat kreol- eller pidginspråk","cpf":"franskbaserat kreol- eller pidginspråk","cpp":"portugisiskbaserat kreol- eller pidginspråk","cr":"cree","crh":"krimtatariska","crp":"kreol- eller pidginspråk","cs":"tjeckiska","csb":"kasjubiska","cu":"kyrkslaviska","cus":"kusjitiskt språk","cv":"tjuvasjiska","cy":"walesiska","da":"danska","dak":"dakota","dar":"darginska","dav":"taita","day":"dajakiska","de":"tyska","de-AT":"österrikisk tyska","de-CH":"schweizisk högtyska","del":"delaware","den":"slavej","dgr":"dogrib","din":"dinka","dje":"zarma","doi":"dogri","dra":"dravidiskt språk","dsb":"lågsorbiska","dua":"duala","dum":"medelnederländska","dv":"divehi","dyo":"jola-fonyi","dyu":"dyula","dz":"bhutanesiska","dzg":"dazaga","ebu":"embu","ee":"ewe","efi":"efik","egy":"fornegyptiska","eka":"ekajuk","el":"grekiska","elx":"elamitiska","en":"engelska","en-AU":"australisk engelska","en-CA":"kanadensisk engelska","en-GB":"brittisk engelska","en-US":"amerikansk engelska","enm":"medelengelska","eo":"esperanto","es":"spanska","es-419":"latinamerikansk spanska","es-ES":"europeisk spanska","et":"estniska","eu":"baskiska","ewo":"ewondo","fa":"persiska","fan":"fang","fat":"fanti","ff":"fulani","fi":"finska","fil":"filippinska","fiu":"finskugriskt språk","fj":"fidjianska","fo":"färöiska","fon":"fonspråket","fr":"franska","fr-CA":"kanadensisk franska","fr-CH":"schweizisk franska","frm":"medelfranska","fro":"fornfranska","frr":"nordfrisiska","frs":"östfrisiska","fur":"friulianska","fy":"västfrisiska","ga":"iriska","gaa":"gã","gay":"gayo","gba":"gbaya","gd":"höglandsskotska","gem":"germanskt språk","gez":"etiopiska","gil":"gilbertiska","gl":"galiciska","gmh":"medelhögtyska","gn":"guaraní","goh":"fornhögtyska","gon":"gondi","gor":"gorontalo","got":"gotiska","grb":"grebo","grc":"forngrekiska","gsw":"schweizertyska","gu":"gujarati","guz":"gusli","gv":"manx","gwi":"gwichin","ha":"haussa","hai":"haida","haw":"hawaiiska","he":"hebreiska","hi":"hindi","hil":"hiligaynon","him":"himachali","hit":"hettitiska","hmn":"hmongspråk","ho":"hirimotu","hr":"kroatiska","hsb":"högsorbiska","ht":"haitiska","hu":"ungerska","hup":"hupa","hy":"armeniska","hz":"herero","ia":"interlingua","iba":"ibanska","ibb":"ibibio","id":"indonesiska","ie":"interlingue","ig":"ibo","ii":"szezuan i","ijo":"ijospråket","ik":"inupiak","ilo":"iloko","inc":"indiskt språk","ine":"indoeuropeiskt språk","inh":"ingusjiska","io":"ido","ira":"iranskt språk","iro":"irokesiskt språk","is":"isländska","it":"italienska","iu":"inuktitut","ja":"japanska","jbo":"lojban","jgo":"Ngomba","jmc":"kimashami","jpr":"judisk persiska","jrb":"judisk arabiska","jv":"javanesiska","ka":"georgiska","kaa":"karakalpakiska","kab":"kabyliska","kac":"kachin","kaj":"jju","kam":"kamba","kar":"karenska","kaw":"kawi","kbd":"kabardinska","kbl":"kanembu","kcg":"tyap","kde":"makonde","kea":"kapverdiska","kfo":"koro","kg":"kikongo","kha":"khasi","khi":"khoisanspråk","kho":"khotanesiska","khq":"Timbuktu-songhoy","ki":"kikuyu","kj":"kuanyama","kk":"kazakiska","kkj":"mkako","kl":"grönländska","kln":"kalenjin","km":"kambodjanska","kmb":"kimbundu","kn":"kannada","ko":"koreanska","kok":"konkani","kos":"kosreanska","kpe":"kpelle","kr":"kanuri","krc":"karachay-balkar","krl":"karelska","kro":"kru","kru":"kurukh","ks":"kashmiriska","ksb":"kisambaa","ksf":"bafia","ksh":"kölniska","ku":"kurdiska","kum":"kumykiska","kut":"kutenaj","kv":"kome","kw":"korniska","ky":"kirgisiska","la":"latin","lad":"ladino","lag":"langi","lah":"lahnda","lam":"lamba","lb":"luxemburgiska","lez":"lezghien","lg":"luganda","li":"limburgiska","lkt":"Lakota","ln":"lingala","lo":"laotiska","lol":"mongo","loz":"lozi","lt":"litauiska","lu":"luba-katanga","lua":"luba-lulua","lui":"luiseño","lun":"lunda","luo":"luo","lus":"lushai","luy":"luhya","lv":"lettiska","mad":"maduresiska","maf":"mafa","mag":"magahi","mai":"maithili","mak":"makasar","man":"mande","map":"austronesiskt språk","mas":"massajiska","mde":"maba","mdf":"moksja","mdr":"mandar","men":"mende","mer":"meru","mfe":"mauritansk kreol","mg":"malagassiska","mga":"medeliriska","mgh":"makhuwa-meetto","mgo":"Meta'","mh":"marshalliska","mi":"maori","mic":"mic-mac","min":"minangkabau","mis":"annat språk","mk":"makedonska","mkh":"mon-khmeriskt språk","ml":"malayalam","mn":"mongoliska","mnc":"manchuriska","mni":"manipuri","mno":"manobospråk","mo":"moldaviska","moh":"mohawk","mos":"mossi","mr":"marathi","ms":"malajiska","mt":"maltesiska","mua":"mundang","mul":"flera språk","mun":"mundaspråk","mus":"muskogee","mwl":"mirandesiska","mwr":"marwari","my":"burmesiska","mye":"myene","myn":"mayaspråk","myv":"erjya","na":"nauru","nah":"aztekiska","nai":"nordamerikanskt indianspråk","nap":"napolitanska","naq":"nama","nb":"norskt bokmål","nd":"nordndebele","nds":"lågtyska","ne":"nepalesiska","new":"newariska","ng":"ndonga","nia":"nias","nic":"Niger-Kongospråk","niu":"niueanska","nl":"nederländska","nl-BE":"flamländska","nmg":"kwasio","nn":"nynorska","nnh":"bamileké-ngiemboon","no":"norska","nog":"nogai","non":"fornnordiska","nqo":"n-kå","nr":"sydndebele","nso":"nordsotho","nub":"nubiskt språk","nus":"nuer","nv":"navaho","nwc":"klassisk newariska","ny":"nyanja","nym":"nyamwezi","nyn":"nyankole","nyo":"nyoro","nzi":"nzima","oc":"occitanska","oj":"odjibwa","om":"oromo","or":"oriya","os":"ossetiska","osa":"osage","ota":"ottomanska","oto":"otomispråk","pa":"punjabi","paa":"papuanskt språk","pag":"pangasinan","pal":"medelpersiska","pam":"pampanga","pap":"papiamento","pau":"palau","peo":"fornpersiska","phi":"filippinskt språk","phn":"feniciska","pi":"pali","pl":"polska","pon":"ponape","pra":"prakritspråk","pro":"fornprovensalska","ps":"pashto","pt":"portugisiska","pt-BR":"brasiliansk portugisiska","pt-PT":"europeisk portugisiska","qu":"quechua","raj":"rajasthani","rap":"rapanui","rar":"rarotonganska","rm":"rätoromanska","rn":"rundi","ro":"rumänska","roa":"romanskt språk","rof":"rombo","rom":"romani","root":"rot","ru":"ryska","rup":"arumänska","rw":"kinjarwanda","rwk":"rwa","sa":"sanskrit","sad":"sandawe","sah":"jakutiska","sai":"sydamerikanskt indianspråk","sal":"salikiskt språk","sam":"samaritanska","saq":"samburu","sas":"sasak","sat":"santali","sba":"ngambay","sbp":"sangu","sc":"sardiska","scn":"sicilianska","sco":"skotska","sd":"sindhi","se":"nordsamiska","see":"seneca","seh":"chisena","sel":"selkup","sem":"semitiskt språk","ses":"Gao-songhay","sg":"sango","sga":"forniriska","sgn":"teckenspråk","sh":"serbokroatiska","shi":"tachelhit","shn":"shan","shu":"Chad-arabiska","si":"singalesiska","sid":"sidamo","sio":"siouxspråk","sit":"sinotibetanskt språk","sk":"slovakiska","sl":"slovenska","sla":"slaviskt språk","sm":"samoanska","sma":"sydsamiska","smi":"samiskt språk","smj":"lulesamiska","smn":"enaresamiska","sms":"skoltsamiska","sn":"shona","snk":"soninke","so":"somaliska","sog":"sogdiska","son":"songhai","sq":"albanska","sr":"serbiska","srn":"sranan tongo","srr":"serer","ss":"swati","ssa":"nilosahariskt språk","ssy":"saho","st":"sydsotho","su":"sundanesiska","suk":"sukuma","sus":"susu","sux":"sumeriska","sv":"svenska","sw":"swahili","swb":"shimaoré","swc":"Kongo-swahili","syc":"klassisk syriska","syr":"syriska","ta":"tamil","tai":"thaispråk","te":"telugiska","tem":"temne","teo":"teso","ter":"tereno","tet":"tetum","tg":"tadzjikiska","th":"thailändska","ti":"tigrinja","tig":"tigré","tiv":"tivi","tk":"turkmeniska","tkl":"tokelauiska","tl":"tagalog","tlh":"klingonska","tli":"tlingit","tmh":"tamashek","tn":"tswana","to":"tonganska","tog":"nyasatonganska","tpi":"tok pisin","tr":"turkiska","trv":"taroko","ts":"tsonga","tsi":"tsimshian","tt":"tatariska","tum":"tumbuka","tup":"tupíspråk","tut":"altaiskt språk","tvl":"tuvaluanska","tw":"twi","twq":"tasawaq","ty":"tahitiska","tyv":"tuviniska","tzm":"centralmarockansk tamazight","udm":"udmurtiska","ug":"uiguriska","uga":"ugaritiska","uk":"ukrainska","umb":"umbundu","und":"obestämt språk","ur":"urdu","uz":"uzbekiska","vai":"vaj","ve":"venda","vi":"vietnamesiska","vo":"volapük","vot":"votiska","vun":"vunjo","wa":"vallonska","wae":"walsertyska","wak":"wakusjiskt språk","wal":"walamo","war":"waray","was":"washo","wen":"sorbiskt språk","wo":"wolof","xal":"kalmuckiska","xh":"xhosa","xog":"lusoga","yao":"kiyao","yap":"japetiska","yav":"yangben","ybb":"bamileké-jemba","yi":"jiddisch","yo":"yoruba","ypk":"eskimåspråk","yue":"kantonesiska","za":"zhuang","zap":"zapotek","zbl":"blissymboler","zen":"zenaga","zh":"kinesiska","zh-Hans":"förenklad kinesiska","zh-Hant":"traditionell kinesiska","znd":"zandé","zu":"zulu","zun":"zuni","zxx":"inget språkligt innehåll","zza":"zazaiska"},"ta":{"aa":"அஃபார்","ab":"அப்காஜியான்","ace":"ஆச்சினீஸ்","ach":"அகோலி","ada":"அதாங்மே","ady":"அதகே","ae":"அவெஸ்தான்","af":"ஆஃப்ரிகான்ஸ்","afa":"அஃப்ரோ-ஏசியாடிக் மொழி","afh":"அஃப்ரிஹிலி","agq":"Aghem","ain":"ஐனு","ak":"ஆகான்","akk":"அக்கேதியன்","ale":"அலூட்","alg":"அல்கான்கியன் மொழி","alt":"தெற்கு அல்தை","am":"அம்ஹாரிக்","an":"ஆர்கோனீஸ்","ang":"பழைய ஆங்கிலம்","anp":"அங்கிகா","apa":"அபாச்சி மொழி","ar":"அரபு","ar-001":"Modern Standard Arabic","arc":"அராமைக்","arn":"அரௌகேனியன்","arp":"அரபஹோ","art":"செயற்கையான மொழி","arw":"அராவாக்","as":"அஸ்ஸாமி","asa":"Asu","ast":"அஸ்துரியன்","ath":"அதாபஸ்கான் மொழி","aus":"ஆஸ்த்ரேலிய மொழி","av":"அவேரிக்","awa":"அவதி","ay":"அய்மரா","az":"அஸேரி","ba":"பாஷ்கிர்","bad":"பாண்டா","bai":"பமிலெகே மொழி","bal":"பெலுசி","ban":"பலினீஸ்","bas":"பாஸா","bat":"பால்டிக் மொழி","bax":"Bamun","bbj":"Ghomala","be":"பைலோருஷ்ன்","bej":"பேஜா","bem":"பெம்பா","ber":"பெர்பெர்","bez":"Bena","bfd":"Bafut","bg":"பல்கேரியன்","bh":"பீஹாரி","bho":"போஜ்பூரி","bi":"பிஸ்லாமா","bik":"பிகோல்","bin":"பினி","bkm":"Kom","bla":"சிக்சிகா","bm":"பம்பாரா","bn":"வங்காளம்","bnt":"பான்டு","bo":"திபெத்து","br":"பிரெட்டன்","bra":"ப்ராஜ்","brx":"Bodo","bs":"போஸ்னியன்","bss":"Akoose","btk":"பாடாக்","bua":"புரியாத்","bug":"புகினீஸ்","bum":"Bulu","byn":"ப்லின்","byv":"Medumba","ca":"காடலான்","cad":"கேடோ","cai":"மத்திய அமெரிக்கன் இன்டியன் மொழி","car":"கரீப்","cau":"காகேஷியன் மொழி","cay":"Cayuga","cch":"ஆட்சம்","ce":"செசென்","ceb":"செபுவானோ","cel":"கெல்டிக் மொழி","cgg":"Chiga","ch":"சாமோரோ","chb":"சிப்சா","chg":"ஷகதை","chk":"சூகிசே","chm":"மாரி","chn":"சினூக் ஜார்கான்","cho":"சோக்தௌ","chp":"சிபெவ்யான்","chr":"செரொகி","chy":"செயேனி","ckb":"சொரானி குர்திஷ்","cmc":"சாமிக் மொழி","co":"கோர்சிகன்","cop":"காப்டிக்","cpe":"ஆங்கில அடைப்படையிலான கிரியோல் மற்றும் பிஜின்","cpf":"ஃப்ரென்ச் அடைப்படையிலான கிரியோல் மற்றும் பிஜின்","cpp":"போர்சுக்கீஸ் அடைப்படையிலான கிரியோல் மற்றும் பிஜின்","cr":"க்ரீ","crh":"கிரிமியன் துர்க்கி","crp":"கிரியோல் மற்றும் பிஜின்","cs":"செக்","csb":"கஷுபியன்","cu":"சர்ச் ஸ்லாவிக்","cus":"குஷிடிக் மொழி","cv":"சுவாஷ்","cy":"வெல்ஷ்","da":"டேனிஷ்","dak":"தகோடா","dar":"தார்குவா","dav":"Taita","day":"தயாக்","de":"ஜெர்மன்","de-AT":"ஆஸ்ட்ரியன் ஜெர்மன்","de-CH":"ஸ்விஸ் ஹை ஜெர்மன்","del":"தெலாவேர்","den":"ஸ்லாவ்","dgr":"டோக்ரிப்","din":"டின்கா","dje":"Zarma","doi":"டோக்ரி","dra":"திராவிட மொழி","dsb":"லோவர் சோர்பியன்","dua":"துவாலா","dum":"மத்திய டச்சு","dv":"திவேஹி","dyo":"Jola-Fonyi","dyu":"ட்யூலா","dz":"பூடானி","dzg":"Dazaga","ebu":"Embu","ee":"ஈவ்","efi":"எஃபிக்","egy":"பண்டைய எகிப்தியன்","eka":"ஈகாஜுக்","el":"கிரேக்கம்","elx":"எலமைட்","en":"ஆங்கிலம்","en-AU":"ஆஸ்ட்ரேலியன் ஆங்கிலம்","en-CA":"கனடியன் ஆங்கிலம்","en-GB":"ஆங்கிலம் (யூகே)","en-US":"ஆங்கிலம் (யூஎஸ்)","enm":"மத்திய ஆங்கிலம்","eo":"எஸ்பரேன்டோ","es":"ஸ்பானிஷ்","es-419":"லத்தின் அமெரிக்கன் ஸ்பானிஷ்","es-ES":"ஐரோப்பிய ஸ்பானிஷ்","et":"எஸ்டோனியன்","eu":"பஸ்க்","ewo":"எவோன்டோ","fa":"பர்ஸியன்","fan":"ஃபங்க்","fat":"ஃபான்டி","ff":"ஃபுலா","fi":"பின்னிஷ்","fil":"ஃபிலிபினோ","fiu":"ஃபினோ-உக்ரைன் மொழி","fj":"ஃபிஜி","fo":"ஃபரிஸ்த்","fon":"ஃபான்","fr":"பிரெஞ்சு","fr-CA":"கெனடியன் பிரன்சு","fr-CH":"ஸ்விஸ் பிரன்சு","frm":"மத்திய ஃப்ரென்ச்","fro":"பழைய ஃப்ரென்ச்","frr":"வடக்கு ஃப்ரிஸியான்","frs":"கிழக்கு ஃப்ரிஸியான்","fur":"ஃப்ரியூலியன்","fy":"மேற்கத்திய பிரிஷிய","ga":"ஐரிஷ்","gaa":"கா","gay":"கயோ","gba":"பயா","gd":"ஸ்காட்ஸ் கேலிக்","gem":"ஜெர்மானிய மொழி","gez":"கீஜ்","gil":"கில்பெர்டீஸ்","gl":"காலிஸியன்","gmh":"மத்திய ஹை ஜெர்மன்","gn":"குரானி","goh":"பழைய ஹை ஜெர்மன்","gon":"கோன்டி","gor":"கோரோன்டலோ","got":"கோதிக்","grb":"க்ரேபோ","grc":"பண்டைய கிரேக்கம்","gsw":"ஸ்விஸ் ஜெர்மன்","gu":"குஜராத்தி","guz":"Gusii","gv":"மேங்க்ஸ்","gwi":"குவிசின்","ha":"ஹௌஸா","hai":"ஹைடா","haw":"ஹவாய்யான்","he":"ஹுப்ரு","hi":"இந்தி","hil":"ஹிலிகாய்னான்","him":"ஹிமாச்சலி","hit":"ஹிட்டைட்","hmn":"மாங்க்","ho":"ஹிரி மோட்டு","hr":"குரோஷியன்","hsb":"அப்பர் சோர்பியான்","ht":"ஹைத்தியன்","hu":"ஹங்கேரியன்","hup":"ஹுபா","hy":"ஆர்மேனியன்","hz":"ஹெரேரோ","ia":"இண்டர்லிங்வா","iba":"இபான்","ibb":"Ibibio","id":"இந்தோனேஷியன்","ie":"இன்டர்லிங்","ig":"இக்போ","ii":"சிசுவான் ஈ","ijo":"இஜோ","ik":"இனுபியாக்","ilo":"இலோகோ","inc":"இந்திய மொழி","ine":"இன்டோ-ஐரோப்பியன் மொழி","inh":"இங்குஷ்","io":"இடோ","ira":"இரானியன் மொழி","iro":"இரோகோயியன் மொழி","is":"ஐஸ்லென்டிக்","it":"இத்தாலியன்","iu":"இனுகிடூட்","ja":"ஜப்பானீஸ்","jbo":"லோஜ்பன்","jgo":"Ngomba","jmc":"Machame","jpr":"ஜூதேயோ-பெர்ஷியன்","jrb":"ஜூதேயோ-அராபிக்","jv":"ஜாவானீஸ்","ka":"ஜியோர்ஜியன்","kaa":"காரா-கல்பாக்","kab":"கபாய்ல்","kac":"காசின்","kaj":"ஜ்ஜூ","kam":"கம்பா","kar":"கரேன்","kaw":"காவி","kbd":"கபார்டியன்","kbl":"Kanembu","kcg":"தையாப்","kde":"Makonde","kea":"Kabuverdianu","kfo":"கோரோ","kg":"காங்கோ","kha":"காஸி","khi":"கொய்ஸன் மொழி","kho":"கோதானீஸ்","khq":"Koyra Chiini","ki":"கிகுயூ","kj":"குவான்யாமா","kk":"கசாக்","kkj":"Kako","kl":"கலாலிசூட்","kln":"Kalenjin","km":"கெமெர்","kmb":"கிம்புன்து","kn":"கன்னடம்","ko":"கொரியன்","kok":"கொங்கனி","kos":"கோஸ்ரைன்","kpe":"க்பெல்லே","kr":"கனுரி","krc":"கராசே-பல்கார்","krl":"கரேலியன்","kro":"க்ரு","kru":"குருக்","ks":"காஷ்மிரி","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"குர்திஷ்","kum":"கும்இக்","kut":"குடேனை","kv":"கோமி","kw":"கார்னிஷ்","ky":"கிர்கிஷ்","la":"லத்தின்","lad":"லடினோ","lag":"Langi","lah":"லஹன்டா","lam":"லம்பா","lb":"லக்க்ஷெம்பர்கிஷ்","lez":"லெஜ்ஜியன்","lg":"ஹான்டா","li":"லிம்பர்கிஷ்","lkt":"Lakota","ln":"லிங்காலா","lo":"லோத்தியன்","lol":"மோங்கோ","loz":"லோசி","lt":"லிதுவேனியன்","lu":"லுபா-கடாங்கா","lua":"லுபா-லுலுலா","lui":"லுய்சேனோ","lun":"லூன்டா","luo":"லுயோ","lus":"லுஷய்","luy":"Luyia","lv":"லேட்வியன்","mad":"மதுரீஸ்","maf":"Mafa","mag":"மகாஹி","mai":"மைதிலி","mak":"மகாசார்","man":"மான்டிங்கோ","map":"ஆஸ்ட்ரோனேஷியன்","mas":"மாசாய்","mde":"Maba","mdf":"மோக்க்ஷா","mdr":"மான்டார்","men":"மென்டீ","mer":"Meru","mfe":"மொரிசியன்","mg":"மலகாஸி","mga":"மத்திய ஐரிஷ்","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"மார்ஷெலிஷ்","mi":"மௌரி","mic":"மிக்மாக்","min":"மின்னாங்கபௌ","mis":"பலதரப்பட்ட மொழிகள்","mk":"மாஸிடோனியன்","mkh":"மான்-க்மெர் மொழி","ml":"மலையாளம்","mn":"மங்கோலியன்","mnc":"மன்சு","mni":"மனிபூரி","mno":"மனோபோ மொழி","mo":"மோல்டாவியன்","moh":"மோஹாவ்க்","mos":"மோஸ்ஸி","mr":"மராத்தி","ms":"மலாய்","mt":"மால்டிஸ்","mua":"Mundang","mul":"பல மொழிகள்","mun":"முண்டா மொழி","mus":"க்ரீக்","mwl":"மிரான்டீஸ்","mwr":"மார்வாரி","my":"பர்மிஸ்","mye":"Myene","myn":"மாயான் மொழி","myv":"ஏர்ஜியா","na":"நவ்ரூ","nah":"நஹுவால்","nai":"வடக்கு அமெரிக்கன் இன்டியன் மொழி","nap":"நியோபோலிடன்","naq":"Nama","nb":"நார்வே பொக்மால்","nd":"வடக்கு தெபெலே","nds":"லோ ஜெர்மன்","ne":"நேபாளி","new":"நெவாரி","ng":"தோங்கா","nia":"நியாஸ்","nic":"நைஜர்-கோரடோஃபனியன் மொழி","niu":"நியூவான்","nl":"டச்சு","nl-BE":"பிலெமிஷ்","nmg":"Kwasio","nn":"நார்வேஜியன் நியூநார்ஸ்க்","nnh":"Ngiemboon","no":"நார்வே","nog":"நோகை","non":"பழைய நோர்ஸ்","nqo":"என்'கோ","nr":"தெற்கு தெபெலே","nso":"வடக்கு சோதோ","nub":"நியூபியன் மொழி","nus":"Nuer","nv":"நவாஜோ","nwc":"பாரம்பரிய நேவாரி","ny":"நயன்ஜா","nym":"நியாம்வேஜி","nyn":"நியான்கோலே","nyo":"நியோரோ","nzi":"நிஜ்மா","oc":"ஒக்கிடன்","oj":"ஓஜிபவா","om":"ஒரோமோ","or":"ஒரியா","os":"ஒசெட்டிக்","osa":"ஓசேஜ்","ota":"ஒட்டோமன் துர்க்கி","oto":"ஒட்டோமன் மொழி","pa":"பஞ்சாபி","paa":"பபுவான் மொழி","pag":"பன்காசினன்","pal":"பாஹ்லவி","pam":"பம்பாங்கா","pap":"பபியேமென்டோ","pau":"பலௌவ்ன்","peo":"பழைய பெர்ஷியன்","phi":"பிலிபைன் மொழி","phn":"ஃபொனிஷியன்","pi":"பாலி","pl":"போலிஷ்","pon":"ஃபோன்பெயென்","pra":"பராக்ரித் மொழி","pro":"பழைய ப்ரோவென்சால்","ps":"புஷ்டோ","pt":"போர்ச்சுக்கீஸ்","pt-BR":"போர்ச்சுகீஸ் (பிரேசில்)","pt-PT":"ஐரோப்பிய போர்த்துகீசியம்","qu":"கிவேசுவா","raj":"ராஜஸ்தானி","rap":"ரபனுய்","rar":"ரரோடோங்கன்","rm":"ரோமென்ஸ்","rn":"ருண்டி","ro":"ரோமேனியன்","roa":"ரோமன்ஸ் மொழி","rof":"Rombo","rom":"ரோமானி","root":"ரூட்","ru":"ரஷியன்","rup":"அரோமானியன்","rw":"கின்யாருவான்டா","rwk":"Rwa","sa":"சமஸ்கிருதம்","sad":"சான்டாவே","sah":"யாகுட்","sai":"தென் அமெரிக்க இன்டியன் மொழி","sal":"சாலிஷன் மொழி","sam":"சமாரிடன் அராமைக்","saq":"Samburu","sas":"சாசாக்","sat":"சான்டாலி","sba":"Ngambay","sbp":"Sangu","sc":"சாடினியன்","scn":"சிசிலியன்","sco":"ஸ்காட்ஸ்","sd":"சிந்தி","se":"வடக்கு சாமி","see":"Seneca","seh":"Sena","sel":"செல்குப்","sem":"செமிடிக் மொழி","ses":"Koyraboro Senni","sg":"சாங்கோ","sga":"பழைய ஐரிஷ்","sgn":"சங்கேத மொழி","sh":"செர்போ-க்ரோஷியன்","shi":"Tachelhit","shn":"ஷான்","shu":"Chadian Arabic","si":"சிங்களம்","sid":"சிடாமோ","sio":"சியோயுவான் மொழி","sit":"சினோ-திபேத்தியன் மொழி","sk":"ஸ்லோவாக்","sl":"ஸ்லோவேனியன்","sla":"ஸ்லாவிக் மொழி","sm":"ஸாமோவான்","sma":"தெற்கு சாமி","smi":"சாமி மொழி","smj":"லுலே சாமி","smn":"இனாரி சாமி","sms":"ஸ்கோல்ட் சாமி","sn":"ஷோனா","snk":"சோனின்கே","so":"சோமாலி","sog":"சோக்தியன்","son":"சோங்காய்","sq":"அல்பெனியன்","sr":"செர்பியன்","srn":"ஸ்ரானன் டோங்கோ","srr":"செரெர்","ss":"ஸ்வாடீ","ssa":"நிலோ-சஹாரன் மொழி","ssy":"Saho","st":"தெற்கு ஸோதோ","su":"சுடானீஸ்","suk":"சுகுமா","sus":"சுசு","sux":"சுமேரியன்","sv":"ஸ்வீடிஷ்","sw":"சுவாஹிலி","swb":"கொமோரியன்","swc":"Congo Swahili","syc":"பாரம்பரிய சிரியாக்","syr":"சிரியாக்","ta":"தமிழ்","tai":"தாய் மொழி","te":"தெலுங்கு","tem":"டிம்னே","teo":"Teso","ter":"டெரெனோ","tet":"டெடும்","tg":"தாஜிக்","th":"தாய்","ti":"டிக்ரின்யா","tig":"டைக்ரே","tiv":"டிவ்","tk":"டர்க்மென்","tkl":"டோகேலௌ","tl":"டாகாலோக்","tlh":"க்ளிங்கோன்","tli":"டிலிங்கிட்","tmh":"டாமாஷேக்","tn":"ஸ்வானா","to":"டோங்கான்","tog":"நயாசா டோங்கா","tpi":"டோக் பிஸின்","tr":"டர்கிஷ்","trv":"Taroko","ts":"ஸோங்கா","tsi":"ட்ஸிம்ஷியன்","tt":"டாடர்","tum":"தும்புகா","tup":"துபி மொழி","tut":"அல்தேய்க் மொழி","tvl":"டுவாலு","tw":"ட்வி","twq":"Tasawaq","ty":"டஹிதியான்","tyv":"டுவினியன்","tzm":"Central Atlas Tamazight","udm":"உட்முர்ட்","ug":"யூகுர்","uga":"உகாரிட்க்","uk":"உக்ரைனியன்","umb":"அம்பொண்டு","und":"அறியப்படாத மொழி","ur":"உருது","uz":"உஸ்பெக்","vai":"வை","ve":"வென்டா","vi":"வியட்நாமிஸ்","vo":"ஒலாபூக்","vot":"வோட்க்","vun":"Vunjo","wa":"ஒவாலூன்","wae":"Walser","wak":"வகாஷான் மொழி","wal":"வாலாமோ","war":"வாரே","was":"வாஷோ","wen":"சொர்பியன் மொழி","wo":"ஒலூஃப்","xal":"கல்மிக்","xh":"ஹோஷா","xog":"Soga","yao":"யாவ்","yap":"யாபேசி","yav":"Yangben","ybb":"Yemba","yi":"இத்திஷ்","yo":"யோருப்பா","ypk":"யுபிக் மொழி","yue":"காண்டோனீஸ்","za":"ஜுவாங்","zap":"ஜாபோடெக்","zbl":"ப்லிஸ்ஸிம்பால்ஸ்","zen":"ஜெனகா","zh":"சீனம்","zh-Hans":"Simplified Chinese","zh-Hant":"சீனம் (மரபுவழி)","znd":"ஜான்டே","zu":"ஜூலூ","zun":"ஜூனி","zxx":"மொழிக்கிணங்க உள்ளடக்கம் இல்லை","zza":"ஜாஜா"},"th":{"aa":"อะฟาร์","ab":"อับคาซ","ace":"อาเจะห์","ach":"อาโคลิ","ada":"อาแดงมี","ady":"อะดืยเก","ae":"อเวสตะ","af":"แอฟริกานส์","afa":"ภาษาแอฟโร-เอเชียติก","afh":"แอฟริฮีลี","agq":"อักเฮม","ain":"ไอนุ","ak":"อาคัน","akk":"อักกาด","ale":"อาลิวต์","alg":"ภาษาอัลกองเควียน","alt":"อัลไตใต้","am":"อัมฮารา","an":"อารากอน","ang":"อังกฤษโบราณ","anp":"อังคิกา","apa":"ภาษาอาปาเช่","ar":"อาหรับ","ar-001":"Modern Standard Arabic","arc":"อราเมอิก","arn":"อาเราคาเนียน","arp":"อาราปาโฮ","art":"ภาษาประดิษฐ์","arw":"อาราวัก","as":"อัสสัม","asa":"อาซู","ast":"อัสตูเรียส","ath":"ภาษาอาทาพาสกาน","aus":"ภาษาออสเตรเลีย","av":"อาวาร์","awa":"อวธี","ay":"ไอย์มารา","az":"อะเซอรี","ba":"บัชคีร์","bad":"บันดา","bai":"ภาษาบามีเลก์","bal":"บาลูชิ","ban":"บาหลี","bas":"บาสา","bat":"ภาษาบอลติก","bax":"บามัน","bbj":"โคมาลา","be":"เบลารุส","bej":"เบจา","bem":"เบมบา","ber":"เบอร์เบอร์","bez":"เบนา","bfd":"บาฟัต","bg":"บัลแกเรีย","bh":"พิหาร","bho":"โภชปุรี","bi":"บิสลามา","bik":"บิกอล","bin":"บินี","bkm":"กม","bla":"สิกสิกา","bm":"บัมบารา","bn":"เบงกาลี","bnt":"บันตู","bo":"ทิเบต","br":"เบรตัน","bra":"พัรช","brx":"โพโฑ","bs":"บอสเนีย","bss":"อาโคซี","btk":"บาตัก","bua":"บูเรียต","bug":"บูกิส","bum":"บูลู","byn":"บลิน","byv":"เมดุมบา","ca":"กาตาลัง","cad":"คัดโด","cai":"ภาษาอเมริกันอินเดียนกลาง","car":"คาริบ","cau":"ภาษาคอเคเซียน","cay":"คายูกา","cch":"แอตแซม","ce":"เชเชน","ceb":"เซบู","cel":"ภาษาเซลติก","cgg":"คีกา","ch":"ชามอร์โร","chb":"ชิบชา","chg":"ชะกะไต","chk":"ชูก","chm":"มารี","chn":"ชินุกจาร์กอน","cho":"ช็อกทอว์","chp":"ชิพิวยัน","chr":"เชอโรกี","chy":"เชเยนเน","ckb":"เคิร์ดโซรานี","cmc":"ภาษาชามิก","co":"คอร์ซิกา","cop":"คอปติก","cpe":"ครีโอลหรือพิดจิ้นที่มาจากภาษาอังกฤษ","cpf":"ครีโอลหรือพิดจิ้นที่มาจากภาษาฝรั่งเศส","cpp":"ครีโอลหรือพิดจิ้นที่มาจากภาษาโปรตุเกส","cr":"ครี","crh":"ตุรกีไครเมีย","crp":"ครีโอลหรือพิดจิ้น","cs":"เช็ก","csb":"คาซูเบียน","cu":"เชอร์ชสลาวิก","cus":"ภาษาคูชิทิก","cv":"ชูวัช","cy":"เวลส์","da":"เดนมาร์ก","dak":"ดาโกทา","dar":"ดาร์กิน","dav":"ไททา","day":"ดายัก","de":"เยอรมัน","de-AT":"เยอรมัน - ออสเตรีย","de-CH":"เยอรมันสูง (สวิส)","del":"เดลาแวร์","den":"สเลวี","dgr":"โดกริบ","din":"ดิงกา","dje":"ซาร์มา","doi":"โฑครี","dra":"ภาษาดราวิเดียน","dsb":"ซอร์บส์ตอนล่าง","dua":"ดัวลา","dum":"ดัตช์กลาง","dv":"ธิเวหิ","dyo":"โจลา-ฟอนยี","dyu":"ดิวลา","dz":"ซองคา","dzg":"ดาซากา","ebu":"เอ็มบู","ee":"เอเว","efi":"อีฟิก","egy":"อียิปต์โบราณ","eka":"อีกาจุก","el":"กรีก","elx":"อีลาไมต์","en":"อังกฤษ","en-AU":"อังกฤษ - ออสเตรเลีย","en-CA":"อังกฤษ - แคนาดา","en-GB":"อังกฤษ - สหราชอาณาจักร","en-US":"อังกฤษ - อเมริกัน","enm":"อังกฤษกลาง","eo":"เอสเปอรันโต","es":"สเปน","es-419":"Latin American Spanish","es-ES":"สเปนในยุโรป","et":"เอสโตเนีย","eu":"บัสเก","ewo":"อีวันโด","fa":"เปอร์เซีย","fan":"ฟอง","fat":"ฟันติ","ff":"ฟูลาฮ์","fi":"ฟินแลนด์","fil":"ฟิลิปปินส์","fiu":"ภาษาฟินโน-อูกริก","fj":"ฟิจิ","fo":"แฟโร","fon":"ฟอน","fr":"ฝรั่งเศส","fr-CA":"ฝรั่งเศสในแคนาดา","fr-CH":"ฝรั่งเศส (สวิส)","frm":"ฝรั่งเศสกลาง","fro":"ฝรั่งเศสโบราณ","frr":"ฟริเซียนเหนือ","frs":"ฟริเซียนตะวันออก","fur":"ฟรูลี","fy":"ฟริเซียนตะวันตก","ga":"ไอริช","gaa":"กา","gay":"กาโย","gba":"กบายา","gd":"สกอตส์กาลิก","gem":"ภาษาเจอร์เมนิก","gez":"กีซ","gil":"กิลเบอร์ต","gl":"กาลิเซีย","gmh":"เยอรมันสูงกลาง","gn":"กวารานี","goh":"เยอรมันสูงโบราณ","gon":"กอนดิ","gor":"กอรอนทาโล","got":"โกธิก","grb":"เกรโบ","grc":"กรีกโบราณ","gsw":"เยอรมันสวิส","gu":"คุชราต","guz":"กุซซี","gv":"มานซ์","gwi":"กวิชอิน","ha":"เฮาชา","hai":"ไฮดา","haw":"ฮาวาย","he":"ฮิบรู","hi":"ฮินดี","hil":"ฮีลีกัยนน","him":"หิมาจัล","hit":"ฮิตไตต์","hmn":"ม้ง","ho":"ฮีรีโมตู","hr":"โครเอเชีย","hsb":"ซอร์บส์ตอนบน","ht":"เฮติ","hu":"ฮังการี","hup":"ฮูปา","hy":"อาร์เมเนีย","hz":"เฮเรโร","ia":"อินเตอร์ลิงกัว","iba":"อิบาน","ibb":"อิบิบิโอ","id":"อินโดนีเชีย","ie":"อินเตอร์ลิงกิว","ig":"อิกโบ","ii":"เสฉวนยิ","ijo":"อิโจ","ik":"อีนูเปียก","ilo":"อีโลโก","inc":"ภาษาอินดิก","ine":"ภาษาอินโด-ยุโรป","inh":"อินกุช","io":"อีโด","ira":"ภาษาอิหร่าน","iro":"ภาษาอีโรกัวส์","is":"ไอซ์แลนด์","it":"อิตาลี","iu":"อินุกติตุต","ja":"ญี่ปุ่น","jbo":"โลชบัน","jgo":"Ngomba","jmc":"มาชาเม","jpr":"ยิว-เปอร์เซีย","jrb":"ยิว-อาหรับ","jv":"ชวา","ka":"จอร์เจีย","kaa":"การา-กาลพาก","kab":"กาไบล","kac":"กะฉิ่น","kaj":"คจู","kam":"คัมบา","kar":"กะเหรี่ยง","kaw":"กวี","kbd":"คาร์บาเดีย","kbl":"คาเนมบู","kcg":"ทีแยป","kde":"มาคอนเด","kea":"คาบูเวอร์เดียนู","kfo":"โคโร","kg":"คองโก","kha":"กาสี","khi":"ภาษาคอยซาน","kho":"โคตัน","khq":"โคย์ราชีนี","ki":"กีกูยู","kj":"กวนยามา","kk":"คาซัค","kkj":"คาโก","kl":"กรีนแลนด์","kln":"คาเลนจิน","km":"เขมร","kmb":"คิมบุนดู","kn":"กันนาดา","ko":"เกาหลี","kok":"กอนกานี","kos":"คูสไร","kpe":"กาแปล","kr":"คานูรี","krc":"คาราไช-บัลคาร์","krl":"แกรเลียน","kro":"ครู","kru":"กุรุข","ks":"กัศมีร์","ksb":"ชัมบาลา","ksf":"บาเฟีย","ksh":"โคโลญ","ku":"เคิร์ด","kum":"คูมืยค์","kut":"คูเทไน","kv":"โกมิ","kw":"คอร์นิช","ky":"คีร์กีซ","la":"ละติน","lad":"ลาดิโน","lag":"แลนจี","lah":"ลาฮ์นดา","lam":"แลมบา","lb":"ลักเซมเบิร์ก","lez":"เลซเกียน","lg":"ยูกันดา","li":"ลิมเบิร์ก","lkt":"Lakota","ln":"ลิงกาลา","lo":"ลาว","lol":"มองโก","loz":"โลซิ","lt":"ลิทัวเนีย","lu":"ลูบา-กาตองกา","lua":"ลูบา-ลูลัว","lui":"ลุยเซโน","lun":"ลันดา","luo":"ลัว","lus":"ลูไช","luy":"ลูเยีย","lv":"ลัตเวีย","mad":"มาดูรา","maf":"มาฟา","mag":"มคหี","mai":"ไมถิลี","mak":"มากาซาร์","man":"มันดิงกา","map":"ออสโตรนีเซียน","mas":"มาไซ","mde":"มาบา","mdf":"มอคชา","mdr":"มานดาร์","men":"เมนเด","mer":"เมรู","mfe":"มอริสเยน","mg":"มาลากาซี","mga":"ไอริชกลาง","mgh":"มากัววา-มีทโท","mgo":"Meta'","mh":"มาร์แชลลิส","mi":"เมารี","mic":"มิกแมก","min":"มีนังกาเบา","mis":"ภาษาอื่นๆ","mk":"มาซิโดเนีย","mkh":"ภาษามอญ-เขมร","ml":"มาลายาลัม","mn":"มองโกเลีย","mnc":"แมนจู","mni":"มณีปุระ","mno":"ภาษามาโนโบ","mo":"มอลโดวา","moh":"โมฮอว์ก","mos":"โมซี","mr":"มราฐี","ms":"มาเลย์","mt":"มอลตา","mua":"มันดัง","mul":"หลายภาษา","mun":"ภาษามันดา","mus":"ครีก","mwl":"มีรันดา","mwr":"มารวาฑี","my":"พม่า","mye":"มยีน","myn":"ภาษามายา","myv":"เอียร์ซยา","na":"นาอูรู","nah":"นาฮัว","nai":"ภาษาอินเดียอเมริกาเหนือ","nap":"นาโปลี","naq":"นามา","nb":"นอร์เวย์บุคมอล","nd":"เอ็นเดเบเลเหนือ","nds":"เยอรมันต่ำ - แซกซอนต่ำ","ne":"เนปาล","new":"เนวาร์","ng":"ดองกา","nia":"นีอัส","nic":"ภาษาไนเจอร์-คอร์โดฟาเนียน","niu":"นีอู","nl":"ดัตช์","nl-BE":"เฟลมิช","nmg":"กวาซิโอ","nn":"นอร์เวย์นีนอสก์","nnh":"จีมบูน","no":"นอร์เวย์","nog":"โนไก","non":"นอร์สโบราณ","nqo":"เอ็นโก","nr":"เอ็นเดเบเลใต้","nso":"โซโทเหนือ","nub":"ภาษานูเบียน","nus":"เนือร์","nv":"นาวาโฮ","nwc":"เนวาร์ดั้งเดิม","ny":"เนียนจา","nym":"เนียมเวซี","nyn":"เนียนโกเล","nyo":"นิโอโร","nzi":"นซิมา","oc":"อ็อกซิตัน","oj":"โอจิบวา","om":"โอโรโม","or":"โอริยา","os":"ออสเซเตีย","osa":"โอซากี","ota":"ตุรกีออตโตมัน","oto":"ภาษาโอโตมี","pa":"ปัญจาบ","paa":"ภาษาปาปัว","pag":"ปางาซีนัน","pal":"ปะห์ลาวี","pam":"ปัมปางา","pap":"ปาเปียเมนโต","pau":"ปาเลา","peo":"เปอร์เซียโบราณ","phi":"ภาษาฟิลิปปิน","phn":"ฟินิเชีย","pi":"บาลี","pl":"โปแลนด์","pon":"พอห์นเพ","pra":"ภาษาปรากฤต","pro":"โปรวองซาลโบราณ","ps":"พุชโต","pt":"โปรตุเกส","pt-BR":"โปรตุเกส - บราซิล","pt-PT":"โปรตุเกสในยุโรป","qu":"ควิชัว","raj":"ราชสถาน","rap":"ราปานู","rar":"ราโรทองกา","rm":"โรแมนซ์","rn":"บุรุนดี","ro":"โรมาเนีย","roa":"ภาษาโรมานซ์","rof":"รอมโบ","rom":"โรมานี","root":"รูท","ru":"รัสเซีย","rup":"อาโรมาเนียน","rw":"รวันดา","rwk":"รวา","sa":"สันสกฤต","sad":"ซันดาเว","sah":"ซาฮา","sai":"ภาษาอเมริกันอินเดียนใต้","sal":"ภาษาชาลิช","sam":"อราเมอิกซามาเรีย","saq":"แซมบูรู","sas":"ซาซัก","sat":"สันตาลี","sba":"กัมเบ","sbp":"แซงกู","sc":"ซาร์เดญา","scn":"ซิซิลี","sco":"สกอตส์","sd":"สินธุ","se":"ซามิเหนือ","see":"เซนิกา","seh":"เซนา","sel":"เซลคุป","sem":"ภาษาเซมิติก","ses":"โคย์ราโบโรเซนนี","sg":"แซงโก","sga":"ไอริชโบราณ","sgn":"ภาษาสัญญาณ","sh":"เซอร์โบ-โครเอเชีย","shi":"ทาเชลีห์ท","shn":"ไทใหญ่","shu":"อาหรับ-ชาด","si":"สิงหล","sid":"ซิดาโม","sio":"ภาษาซิอวน","sit":"ภาษาซิโน-ทิเบต","sk":"สโลวัก","sl":"สโลวีเนีย","sla":"ภาษาสลาวิก","sm":"ซามัว","sma":"ซามิใต้","smi":"ภาษาซามิ","smj":"ซามิลูเล","smn":"ซามิอีนารี","sms":"ซามิสคอลต์","sn":"โชนา","snk":"โซนีนเก","so":"โซมาลี","sog":"ซอกดีน","son":"ซองไฮ","sq":"แอลเบเนีย","sr":"เซอร์เบีย","srn":"ซูรินาเม","srr":"เซแรร์","ss":"สวาติ","ssa":"ภาษานิโล-ซาฮารัน","ssy":"ซาโฮ","st":"โซโทใต้","su":"ซุนดา","suk":"ซูคูมา","sus":"ซูซู","sux":"ซูเมอ","sv":"สวีเดน","sw":"สวาฮีลี","swb":"โคเมอเรียน","swc":"สวาฮีลี-คองโก","syc":"ซีเรียแบบดั้งเดิม","syr":"ซีเรีย","ta":"ทมิฬ","tai":"ภาษาไท","te":"เตลูกู","tem":"ทิมเน","teo":"เตโซ","ter":"เทเรโน","tet":"เตตุม","tg":"ทาจิก","th":"ไทย","ti":"ติกริญญา","tig":"ตีเกร","tiv":"ทิฟ","tk":"เติร์กเมนิสถาน","tkl":"โตเกเลา","tl":"ตากาล็อก","tlh":"คลิงกอน","tli":"ทลิงกิต","tmh":"ทามาเชก","tn":"บอตสวานา","to":"ตองกา","tog":"ไนอะซาตองกา","tpi":"ท็อกพิซิน","tr":"ตุรกี","trv":"ทาโรโก","ts":"ซิิตซองกา","tsi":"ซิมชีแอน","tt":"ตาตาร์","tum":"ทุมบูกา","tup":"ภาษาตูปี","tut":"ภาษาอัลตาอิก","tvl":"ตูวาลู","tw":"ทวิ","twq":"ตัสซาวัค","ty":"ตาฮิตี","tyv":"ตูวา","tzm":"เบอร์เบอร์-โมร็อกโกกลาง","udm":"อุดมูร์ต","ug":"อุยกูร์","uga":"ยูการิต","uk":"ยูเครน","umb":"อุมบุนดู","und":"ไม่มีข้อมูล","ur":"อูรดู","uz":"อุซเบก","vai":"ไว","ve":"เวนดา","vi":"เวียดนาม","vo":"โวลาพึค","vot":"โวทิก","vun":"วุนจู","wa":"วาโลนี","wae":"วัลเซอร์","wak":"ภาษาวากาชาน","wal":"วาลาโม","war":"วาเรย์","was":"วาโช","wen":"ภาษาซอร์บส์","wo":"โวลอฟ","xal":"คัลมืยค์","xh":"คะห์โอซา","xog":"โซกา","yao":"เย้า","yap":"ยัป","yav":"แยงเบน","ybb":"เยมบา","yi":"ยิว","yo":"โยรูบา","ypk":"ภาษาอูย์ปิค","yue":"กวางตุ้ง","za":"จ้วง","zap":"ซาโปเตก","zbl":"บลิสซิมโบลส์","zen":"เซนากา","zh":"จีน","zh-Hans":"จีนประยุกต์","zh-Hant":"จีนดั้งเดิม","znd":"ซันเด","zu":"ซูลู","zun":"ซูนิ","zxx":"ไม่มีข้อมูลภาษา","zza":"ซาซา"},"tr":{"aa":"Afar","ab":"Abhazca","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adigece","ae":"Avestçe","af":"Afrikaanca","afa":"Afro-Asyatik Diller","afh":"Afrihili","agq":"Aghem","ain":"Ayni Dili","ak":"Akan","akk":"Akad Dili","ale":"Aleut","alg":"Algonkin Dili","alt":"Güney Altayca","am":"Amharca","an":"Aragonca","ang":"Eski İngilizce","anp":"Angika","apa":"Apaçi Dilleri","ar":"Arapça","ar-001":"Modern Standard Arabic","arc":"Aramice","arn":"Araukanya Dili","arp":"Arapaho Dili","art":"Yapay Diller","arw":"Arawak Dili","as":"Assamca","asa":"Asu","ast":"Asturyasca","ath":"Atabaşkan Dilleri","aus":"Avustralya Dilleri","av":"Avar Dili","awa":"Awadhi","ay":"Aymara","az":"Azerice","ba":"Başkırtça","bad":"Banda Dili","bai":"Bamileke Dilleri","bal":"Baluchi","ban":"Bali Dili","bas":"Basa Dili","bat":"Baltık Dilleri","bax":"Bamun","bbj":"Ghomala","be":"Beyaz Rusça","bej":"Beja Dili","bem":"Bemba","ber":"Berberi","bez":"Bena","bfd":"Bafut","bg":"Bulgarca","bh":"Bihari","bho":"Arayanice","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"Bengalce","bnt":"Bantu Dili","bo":"Tibetçe","br":"Breton","bra":"Braj","brx":"Bodo","bs":"Boşnakça","bss":"Akoose","btk":"Batak","bua":"Buryat","bug":"Bugis","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"Katalanca","cad":"Caddo","cai":"Orta Amerika Yerli Dilleri","car":"Carib","cau":"Kafkas Dilleri","cay":"Cayuga","cch":"Atsam","ce":"Çeçence","ceb":"Cebuano","cel":"Kelt Dilleri","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Çağatay Dili","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"Cherokee","chy":"Şayen Dili","ckb":"Orta Kürtçe","cmc":"Chamic Dilleri","co":"Korsikaca","cop":"Kıptice","cpe":"İngilizce tabanlı Creole ve Pidgin Dilleri","cpf":"Fransızca tabanlı Creole ve Pidgin Dilleri","cpp":"Portekizce tabanlı Creole ve Pidgin Dilleri","cr":"Cree","crh":"Kırım Türkçesi","crp":"Creole ve Pidgin Dilleri","cs":"Çekçe","csb":"Kashubian","cu":"Kilise Slavcası","cus":"Kuşitik Diller","cv":"Çuvaşça","cy":"Galce","da":"Danca","dak":"Dakota","dar":"Dargince","dav":"Taita","day":"Dayak","de":"Almanca","de-AT":"Avusturya Almancası","de-CH":"İsviçre Yüksek Almancası","del":"Delaware","den":"Slavey","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravid Dilleri","dsb":"Aşağı Sorbça","dua":"Duala","dum":"Ortaçağ Felemenkçesi","dv":"Divehi","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"Butan Dili","dzg":"Dazaga","ebu":"Embu","ee":"Ewe","efi":"Efik","egy":"Eski Mısır Dili","eka":"Ekajuk","el":"Yunanca","elx":"Elam","en":"İngilizce","en-AU":"Avustralya İngilizcesi","en-CA":"Kanada İngilizcesi","en-GB":"İngiliz İngilizcesi","en-US":"Amerikan İngilizcesi","enm":"Ortaçağ İngilizcesi","eo":"Esperanto","es":"İspanyolca","es-419":"Latin Amerika İspanyolcası","es-ES":"Avrupa İspanyolcası","et":"Estonca","eu":"Baskça","ewo":"Ewondo","fa":"Farsça","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"Fince","fil":"Filipince","fiu":"Finno - Ugrik Diller","fj":"Fiji Dili","fo":"Faroe Dili","fon":"Fon","fr":"Fransızca","fr-CA":"Kanada Fransızcası","fr-CH":"İsviçre Fransızcası","frm":"Ortaçağ Fransızcası","fro":"Eski Fransızca","frr":"Kuzey Frizce","frs":"Doğu Frizcesi","fur":"Friulian","fy":"Batı Frizcesi","ga":"İrlandaca","gaa":"Ga","gay":"Gayo","gba":"Gbaya","gd":"İskoç Gal Dili","gem":"Cermen Dilleri","gez":"Geez","gil":"Kiribati Dili","gl":"Galiçyaca","gmh":"Ortaçağ Yüksek Almancası","gn":"Guarani Dili","goh":"Eski Yüksek Almanca","gon":"Gondi","gor":"Gorontalo","got":"Gotça","grb":"Grebo","grc":"Antik Yunanca","gsw":"İsviçre Almancası","gu":"Gücerat Dili","guz":"Gusii","gv":"Manks","gwi":"Gwichʼin","ha":"Hausa","hai":"Haida","haw":"Hawaii Dili","he":"İbranice","hi":"Hintçe","hil":"Hiligaynon","him":"Himachali","hit":"Hititçe","hmn":"Hmong","ho":"Hiri Motu","hr":"Hırvatça","hsb":"Yukarı Sorbça","ht":"Haiti Dili","hu":"Macarca","hup":"Hupa","hy":"Ermenice","hz":"Herero","ia":"Interlingua","iba":"Iban","ibb":"Ibibio","id":"Endonezce","ie":"Interlingue","ig":"İbo Dili","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiak","ilo":"Iloko","inc":"Hint Dilleri","ine":"Hint-Avrupa Dilleri","inh":"İnguşça","io":"Ido","ira":"İran Dilleri","iro":"İroqua Dili","is":"İzlandaca","it":"İtalyanca","iu":"Inuktitut","ja":"Japonca","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Yahudi Farsçası","jrb":"Yahudi Arapçası","jv":"Cava Dili","ka":"Gürcüce","kaa":"Karakalpakça","kab":"Kabile","kac":"Kaçin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardeyce","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"Kongo","kha":"Khasi","khi":"Hoisan Dilleri","kho":"Hotanca","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"Kazakça","kkj":"Kako","kl":"Grönland Dili","kln":"Kalenjin","km":"Kmerce","kmb":"Kimbundu","kn":"Kannada","ko":"Korece","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karaçay-Balkarca","krl":"Karelyaca","kro":"Kru","kru":"Kurukh","ks":"Keşmirce","ksb":"Shambala","ksf":"Bafia","ksh":"Köln Diyalekti","ku":"Kürtçe","kum":"Kumukça","kut":"Kutenai","kv":"Komi","kw":"Kernevekçe","ky":"Kırgızca","la":"Latince","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"Lüksemburgca","lez":"Lezgice","lg":"Ganda","li":"Limburgca","lkt":"Lakota","ln":"Lingala","lo":"Laoca","lol":"Mongo","loz":"Lozi","lt":"Litvanyaca","lu":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Lushai","luy":"Luyia","lv":"Letonca","mad":"Madura Dili","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Avustronezya Dili","mas":"Masai","mde":"Maba","mdf":"Mokşa Dili","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"Morisyen","mg":"Malgaşça","mga":"Ortaçağ İrlandacası","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshall Adaları Dili","mi":"Maori Dili","mic":"Micmac","min":"Minangkabau","mis":"Çeşitli Diller","mk":"Makedonca","mkh":"Mon-Khmer Dilleri","ml":"Malayalam","mn":"Moğolca","mnc":"Mançurya Dili","mni":"Manipuri","mno":"Manobo Dilleri","mo":"Moldovaca","moh":"Mohavk Dili","mos":"Mossi","mr":"Marathi","ms":"Malayca","mt":"Maltaca","mua":"Mundang","mul":"Birden Fazla Dil","mun":"Munda Dilleri","mus":"Creek","mwl":"Miranda Dili","mwr":"Marvari","my":"Burmaca","mye":"Myene","myn":"Maya Dilleri","myv":"Erzya","na":"Nauru Dili","nah":"Nahuatl","nai":"Kuzey Amerika Yerli Dilleri","nap":"Napolice","naq":"Nama","nb":"Norveççe Bokmål","nd":"Kuzey Ndebele","nds":"Aşağı Almanca","ne":"Nepalce","new":"Nevari","ng":"Ndonga","nia":"Nias","nic":"Nijer-Kordofan Dilleri","niu":"Niuean","nl":"Hollandaca","nl-BE":"Flamanca","nmg":"Kwasio","nn":"Norveççe Nynorsk","nnh":"Ngiemboon","no":"Norveççe","nog":"Nogayca","non":"Eski Norse","nqo":"N’Ko","nr":"Güney Ndebele","nso":"Kuzey Sotho","nub":"Nubian Dilleri","nus":"Nuer","nv":"Navaho Dili","nwc":"Klasik Nevari","ny":"Nyanja","nym":"Nyamvezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oc":"Occitan","oj":"Ojibva Dili","om":"Oromo","or":"Oriya Dili","os":"Osetçe","osa":"Osage","ota":"Osmanlı Türkçesi","oto":"Otomi Dilleri","pa":"Pencapça","paa":"Papua Dilleri","pag":"Pangasinan","pal":"Pehlevi Dili","pam":"Pampanga","pap":"Papiamento","pau":"Palau Dili","peo":"Eski Farsça","phi":"Filipinler Dilleri","phn":"Fenike Dili","pi":"Pali","pl":"Lehçe","pon":"Pohnpeian","pra":"Prakrit Dilleri","pro":"Eski Provensal","ps":"Peştuca","pt":"Portekizce","pt-BR":"Brezilya Portekizcesi","pt-PT":"Avrupa Portekizcesi","qu":"Keçuvaca","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"Romanşça","rn":"Kirundi","ro":"Romence","roa":"Roman Dilleri","rof":"Rombo","rom":"Romanca","root":"Köken","ru":"Rusça","rup":"Ulahça","rw":"Kinyarwanda","rwk":"Rwa","sa":"Sanskritçe","sad":"Sandave","sah":"Yakutça","sai":"Güney Amerika Yerli Dilleri","sal":"Salishan Dilleri","sam":"Samarit Aramcası","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardunya Dili","scn":"Sicilyaca","sco":"Scots","sd":"Sindhi","se":"Kuzey Sami","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitik Diller","ses":"Koyraboro Senni","sg":"Sangho","sga":"Eski İrlandaca","sgn":"İşaret Dilleri","sh":"Sırp-Hırvat Dili","shi":"Taşelhit","shn":"Shan Dili","shu":"Çad Arapçası","si":"Seylanca","sid":"Sidamo","sio":"Siu Dilleri","sit":"Sino-Tibet Dilleri","sk":"Slovakça","sl":"Slovence","sla":"Slav Dilleri","sm":"Samoa Dili","sma":"Güney Sami","smi":"Sami Dilleri","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"Shona","snk":"Soninke","so":"Somalice","sog":"Sogdiana Dili","son":"Songhai","sq":"Arnavutça","sr":"Sırpça","srn":"Sranan Tongo","srr":"Serer","ss":"Sisvati","ssa":"Nil-Sahara Dilleri","ssy":"Saho","st":"Güney Sotho","su":"Sunda Dili","suk":"Sukuma","sus":"Susu","sux":"Sümerce","sv":"İsveççe","sw":"Svahili","swb":"Komorca","swc":"Kongo Svahili","syc":"Klasik Süryanice","syr":"Süryanice","ta":"Tamilce","tai":"Tai Dili","te":"Telugu Dili","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"Tetum","tg":"Tacikçe","th":"Tayca","ti":"Tigrinya","tig":"Tigre","tiv":"Tiv","tk":"Türkmence","tkl":"Tokelau","tl":"Takalotça","tlh":"Klingonca","tli":"Tlingit","tmh":"Tamaşek","tn":"Setsvana","to":"Tongaca","tog":"Nyasa Tonga","tpi":"Tok Pisin","tr":"Türkçe","trv":"Taroko","ts":"Tsonga","tsi":"Tsimshian","tt":"Tatarca","tum":"Tumbuka","tup":"Tupi Dilleri","tut":"Altay Dilleri","tvl":"Tuvalu","tw":"Tvi","twq":"Tasawaq","ty":"Tahiti Dili","tyv":"Tuvaca","tzm":"Orta Atlas Tamazigt","udm":"Udmurtça","ug":"Uygurca","uga":"Ugarit Dili","uk":"Ukraynaca","umb":"Umbundu","und":"Bilinmeyen Dil","ur":"Urduca","uz":"Özbekçe","vai":"Vai","ve":"Venda","vi":"Vietnamca","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Valonca","wae":"Walser","wak":"Vakaşan Dilleri","wal":"Valamo","war":"Varay","was":"Vaşo","wen":"Sorb Dilleri","wo":"Volofça","xal":"Kalmıkça","xh":"Zosa","xog":"Soga","yao":"Yao","yap":"Yapça","yav":"Yangben","ybb":"Yemba","yi":"Yidiş","yo":"Yoruba","ypk":"Yupik Dili","yue":"Kantonca","za":"Zhuang","zap":"Zapotek Dili","zbl":"Blis Sembolleri","zen":"Zenaga","zh":"Çince","zh-Hans":"Basitleştirilmiş Çince","zh-Hant":"Geleneksel Çince","znd":"Zande","zu":"Zuluca","zun":"Zuni","zxx":"Dilbilim içeriği yok","zza":"Zazaca"},"uk":{"aa":"афарська","ab":"абхазька","ace":"ачехська","ach":"ачолі","ada":"адангме","ady":"адигейська","ae":"авестійська","af":"африкаанс","afa":"афро-азійська мова","afh":"африхілі","agq":"агем","ain":"айнська","ak":"акан","akk":"аккадська","ale":"алеутська","alg":"алгонкінські мови","alt":"південноалтайська","am":"амхарська","an":"арагонська","ang":"давньоанглійська","anp":"ангіка","apa":"апачі мови","ar":"арабська","ar-001":"Modern Standard Arabic","arc":"арамейська","arn":"арауканська","arp":"арапахо","art":"штучна мова","arw":"аравакська","as":"ассамська","asa":"Асу","ast":"астурська","ath":"атапаскські мови","aus":"австралійські мови","av":"аварська","awa":"авадхі","ay":"аймара","az":"азербайджанська","ba":"башкирська","bad":"банда","bai":"бамілеке мови","bal":"балучі","ban":"балійська","bas":"баса","bat":"балтійська мова","bax":"бамум","bbj":"гомала","be":"білоруська","bej":"беджа","bem":"бемба","ber":"берберська","bez":"Бена","bfd":"бафут","bg":"болгарська","bh":"біхарі","bho":"бходжпурі","bi":"біслама","bik":"бікольська","bin":"біні","bkm":"ком","bla":"сіксіка","bm":"бамбара","bn":"бенгальська","bnt":"банту","bo":"тибетська","br":"бретонська","bra":"брадж","brx":"Бодо","bs":"боснійська","bss":"акус","btk":"батак","bua":"бурятська","bug":"бугійська","bum":"булу","byn":"блін","byv":"медумба","ca":"каталонська","cad":"каддо","cai":"центральноамериканьских індіанців мова","car":"карібська","cau":"кавказька мова","cay":"кайюга","cch":"атсам","ce":"чеченська","ceb":"себуанська","cel":"кельтська мова","cgg":"кіга","ch":"чаморро","chb":"чібча","chg":"чагатайська","chk":"чуукська","chm":"марійська","chn":"чинук жаргон","cho":"чокто","chp":"чіпев’ян","chr":"черокі","chy":"чейєнн","ckb":"курдська (сорані)","cmc":"хамітські мови","co":"корсиканська","cop":"коптська","cpe":"англо-креольські та піджінізовані англійські мови","cpf":"франко-креольські та піджінізовані франкофонні мови","cpp":"португальсько-креольські та піджінізовані португальські мови","cr":"крі","crh":"кримськотатарська","crp":"креольські та піджінізовані мови","cs":"чеська","csb":"кашубська","cu":"церковнослов’янська","cus":"кушітська мова","cv":"чуваська","cy":"валлійська","da":"данська","dak":"дакота","dar":"даргінська","dav":"таіта","day":"даяк","de":"німецька","de-AT":"німецька австрійська","de-CH":"верхньонімецька швейцарська","del":"делаварська","den":"слейв","dgr":"догрибська","din":"дінка","dje":"джерма","doi":"догрі","dra":"дравідійська мова","dsb":"нижньолужицька","dua":"дуала","dum":"середньонідерландська","dv":"дівехі","dyo":"дьола-фоні","dyu":"діула","dz":"дзонг-ке","dzg":"дазага","ebu":"Ембу","ee":"еве","efi":"ефік","egy":"давньоєгипетська","eka":"екаджук","el":"грецька","elx":"еламська","en":"англійська","en-AU":"англійська австралійська","en-CA":"англійська канадська","en-GB":"англійська британська","en-US":"англійська США","enm":"середньоанглійська","eo":"есперанто","es":"іспанська","es-419":"латиноамериканська іспанська","es-ES":"іберійська іспанська","et":"естонська","eu":"басків","ewo":"евондо","fa":"перська","fan":"фанг","fat":"фанті","ff":"фула","fi":"фінська","fil":"філіппінська","fiu":"фінно-угорські мови","fj":"фіджі","fo":"фарерська","fon":"фон","fr":"французька","fr-CA":"французька канадська","fr-CH":"французька швейцарська","frm":"середньофранцузька","fro":"давньофранцузька","frr":"фризька північна","frs":"фризька східна","fur":"фріульська","fy":"фризька","ga":"ірландська","gaa":"га","gay":"гайо","gba":"гбайя","gd":"гаельська","gem":"германська мова","gez":"гєез","gil":"гільбертська","gl":"галісійська","gmh":"середньоверхньонімецька","gn":"гуарані","goh":"давньоверхньонімецька","gon":"гонді","gor":"горонтало","got":"готська","grb":"гребо","grc":"давньогрецька","gsw":"німецька швейцарська","gu":"гуджараті","guz":"ікігусії","gv":"менкська","gwi":"кучін","ha":"хауса","hai":"хайда","haw":"гавайська","he":"іврит","hi":"гінді","hil":"хілігайнон","him":"хімачалі","hit":"хітіті","hmn":"хмонг","ho":"хірі-моту","hr":"хорватська","hsb":"верхньолужицька","ht":"гаїтянська","hu":"угорська","hup":"хупа","hy":"вірменська","hz":"гереро","ia":"інтерлінгва","iba":"ібанська","ibb":"ібібіо","id":"індонезійська","ie":"інтерлінгве","ig":"ігбо","ii":"сичуань","ijo":"іджо","ik":"інупіак","ilo":"ілоканська","inc":"індійські мови","ine":"індоєвропейські мови","inh":"інгуська","io":"ідо","ira":"іранська","iro":"ірокезькі мови","is":"ісландська","it":"італійська","iu":"інуктітут","ja":"японська","jbo":"ложбан","jgo":"Ngomba","jmc":"мачаме","jpr":"іудео-перська","jrb":"іудео-арабська","jv":"яванська","ka":"грузинська","kaa":"каракалпацька","kab":"кабильська","kac":"качін","kaj":"йю","kam":"камба","kar":"каренська","kaw":"каві","kbd":"кабардинська","kbl":"канембу","kcg":"тіап","kde":"маконде","kea":"Кабувердіану","kfo":"коро","kg":"конґолезька","kha":"кхасі","khi":"койсанські мови","kho":"хотаносакська","khq":"койра чіїні","ki":"кікуйю","kj":"кунама","kk":"казахська","kkj":"како","kl":"калааллісут","kln":"каленжин","km":"кхмерська","kmb":"кімбунду","kn":"каннада","ko":"корейська","kok":"конкані","kos":"косрае","kpe":"кпеллє","kr":"канурі","krc":"карачаєво-балкарська","krl":"карельська","kro":"кру","kru":"курукх","ks":"кашмірська","ksb":"шамбала","ksf":"бафіа","ksh":"колоніан","ku":"курдська","kum":"кумицька","kut":"кутенаї","kv":"комі","kw":"корнійська","ky":"киргизька","la":"латинська","lad":"ладіно","lag":"лангі","lah":"ланда","lam":"ламба","lb":"люксембурзька","lez":"лезгінська","lg":"ганда","li":"лімбургійська","lkt":"Lakota","ln":"лінгала","lo":"лаоська","lol":"монго","loz":"лозі","lt":"литовська","lu":"луба-катанга","lua":"луба-лулуа","lui":"луїсеньо","lun":"лунда","luo":"луо","lus":"лушей","luy":"Луія","lv":"латвійська","mad":"мадурська","maf":"мафа","mag":"магадхі","mai":"майтхілі","mak":"макасарська","man":"мандінго","map":"австронезійська мова","mas":"масаї","mde":"маба","mdf":"мокша","mdr":"мандарська","men":"менде","mer":"меру","mfe":"маврикійська креольська","mg":"малагасійська","mga":"середньоірландська","mgh":"макува-меето","mgo":"Meta'","mh":"маршалльська","mi":"маорі","mic":"мікмак","min":"мінангкабау","mis":"інші мови","mk":"македонська","mkh":"мон-кхмерські мови","ml":"малайялам","mn":"монгольська","mnc":"манчжурська","mni":"маніпурі","mno":"манобо мови","mo":"молдавська","moh":"магавк","mos":"моссі","mr":"маратхі","ms":"малайська","mt":"мальтійська","mua":"мунданг","mul":"декілька мов","mun":"мунда мови","mus":"крік","mwl":"мірандська","mwr":"марварі","my":"бірманська","mye":"миін","myn":"майя мови","myv":"ерзя","na":"науру","nah":"нахуатль","nai":"північноамериканських індіанців мови","nap":"неаполітанська","naq":"нама","nb":"норвезька букмол","nd":"ндебелє північна","nds":"нижньонімецька","ne":"непальська","new":"неварі","ng":"ндонга","nia":"ніаська","nic":"ніґеро-кордофанські мови","niu":"ніуе","nl":"голландська","nl-BE":"фламандська","nmg":"квазіо","nn":"норвезька нюнорськ","nnh":"нгємбун","no":"норвезька","nog":"ногайська","non":"давньонорвезька","nqo":"нко","nr":"ндебелє південна","nso":"сото північна","nub":"нубійські мови","nus":"нуер","nv":"навахо","nwc":"неварі класична","ny":"ньянджа","nym":"ньямвезі","nyn":"ньянколе","nyo":"ньоро","nzi":"нзіма","oc":"окитан","oj":"оджібва","om":"оромо","or":"орія","os":"осетинська","osa":"осейдж","ota":"османська","oto":"отомі мови","pa":"панджабі","paa":"папуаські мови","pag":"пангасінанська","pal":"пехлеві","pam":"пампанга","pap":"пап’яменто","pau":"палауанська","peo":"давньоперська","phi":"філіппінські мови","phn":"фінікійсько-пунічна","pi":"палі","pl":"польська","pon":"понапе","pra":"пракріті мови","pro":"давньопровансальська","ps":"пушту","pt":"португальська","pt-BR":"португальська бразильська","pt-PT":"португальська іберійська","qu":"кечуа","raj":"раджастхані","rap":"рапануї","rar":"раротонга","rm":"ретороманська","rn":"рунді","ro":"румунська","roa":"романські мови","rof":"Ромбо","rom":"циганська","root":"корінь","ru":"російська","rup":"арумунська","rw":"кіньяруанда","rwk":"Рва","sa":"санскрит","sad":"сандаве","sah":"якутська","sai":"південноамериканських індіанців мови","sal":"салішські мови","sam":"самаритянська арамейська","saq":"самбуру","sas":"сасакська","sat":"сантальська","sba":"нгамбай","sbp":"сангу","sc":"сардинська","scn":"сицилійська","sco":"шотландська","sd":"сіндхі","se":"саамська північна","see":"сенека","seh":"сена","sel":"селькупська","sem":"семітські мови","ses":"койраборо сені","sg":"санго","sga":"давньоірландська","sgn":"знакові мови","sh":"сербсько-хорватська","shi":"тачеліт","shn":"шанська","shu":"чадійська арабська","si":"сингальська","sid":"сідамо","sio":"сіу мови","sit":"китайсько-тибетські мови","sk":"словацька","sl":"словенська","sla":"слов’янські мови","sm":"самоанська","sma":"саамська південна","smi":"саамські мови","smj":"саамська луле","smn":"саамська інарі","sms":"саамська скольт","sn":"шона","snk":"сонінке","so":"сомалі","sog":"согдійська","son":"сонгай","sq":"албанська","sr":"сербська","srn":"сранан тонго","srr":"серер","ss":"сісваті","ssa":"ніло-сахарські мови","ssy":"сахо","st":"сото південна","su":"сунданська","suk":"сукума","sus":"сусу","sux":"шумерська","sv":"шведська","sw":"суахілі","swb":"коморська","swc":"конгійське суахілі","syc":"сирійська класична","syr":"сирійська","ta":"тамільська","tai":"тайські мови","te":"телугу","tem":"темне","teo":"тесо","ter":"терено","tet":"тетум","tg":"таджицька","th":"тайська","ti":"тигріні","tig":"тигре","tiv":"тів","tk":"туркменська","tkl":"токелау","tl":"тагальська","tlh":"клінгон","tli":"тлінгіт","tmh":"тамашек","tn":"тсвана","to":"тонга","tog":"ньяса тонга","tpi":"ток-пісін","tr":"турецька","trv":"тароко","ts":"тсонга","tsi":"цимшиан","tt":"татарська","tum":"тумбука","tup":"тупі","tut":"алтайська мова","tvl":"тувалу","tw":"тві","twq":"тасавак","ty":"таїтянська","tyv":"тувинська","tzm":"центральномароканська тамазіт","udm":"удмуртська","ug":"уйгурська","uga":"угаритська","uk":"українська","umb":"умбунду","und":"невідома мова","ur":"урду","uz":"узбецька","vai":"ваї","ve":"венда","vi":"вʼєтнамська","vo":"волап’юк","vot":"водська","vun":"вуньо","wa":"валлонська","wae":"Валзерська","wak":"вакашські мови","wal":"валамо","war":"варай","was":"вашо","wen":"лужицькі мови","wo":"волоф","xal":"калмицька","xh":"кхоса","xog":"сога","yao":"яо","yap":"яп","yav":"Yangben","ybb":"ємба","yi":"ідиш","yo":"йоруба","ypk":"юпік мови","yue":"кантонська","za":"чжуан","zap":"сапотекська","zbl":"блісса мова","zen":"зенага","zh":"китайська","zh-Hans":"китайська спрощена","zh-Hant":"китайська традиційна","znd":"занде","zu":"зулуська","zun":"зуньї","zxx":"немає мовного вмісту","zza":"зазакі"},"ur":{"aa":"Afar","ab":"ابقازیان","ace":"Achinese","ach":"اکولی","ada":"Adangme","ady":"Adyghe","ae":"Avestan","af":"ایفریکانز","afa":"Afro-Asiatic Language","afh":"Afrihili","agq":"Aghem","ain":"Ainu","ak":"اکان","akk":"Akkadian","ale":"Aleut","alg":"Algonquian Language","alt":"Southern Altai","am":"امہاری","an":"Aragonese","ang":"Old English","anp":"Angika","apa":"Apache Language","ar":"عربی","ar-001":"Modern Standard Arabic","arc":"Aramaic","arn":"Mapuche","arp":"Arapaho","art":"Artificial Language","arw":"Arawak","as":"آسامی","asa":"Asu","ast":"Asturian","ath":"Athapascan Language","aus":"Australian Language","av":"Avaric","awa":"Awadhi","ay":"ایمارا","az":"ازیری","ba":"Bashkir","bad":"Banda","bai":"Bamileke Language","bal":"Baluchi","ban":"Balinese","bas":"Basaa","bat":"Baltic Language","bax":"Bamun","bbj":"Ghomala","be":"بیلاروسی","bej":"Beja","bem":"بیمبا","ber":"Berber","bez":"Bena","bfd":"Bafut","bg":"بلغاری","bh":"بہاری","bho":"Bhojpuri","bi":"Bislama","bik":"Bikol","bin":"Bini","bkm":"Kom","bla":"Siksika","bm":"Bambara","bn":"بنگالی","bnt":"Bantu","bo":"تبتی","br":"بریٹن","bra":"Braj","brx":"Bodo","bs":"بوسنی","bss":"Akoose","btk":"Batak","bua":"Buriat","bug":"Buginese","bum":"Bulu","byn":"Blin","byv":"Medumba","ca":"کاٹالانین","cad":"Caddo","cai":"Central American Indian Language","car":"Carib","cau":"Caucasian Language","cay":"Cayuga","cch":"Atsam","ce":"Chechen","ceb":"Cebuano","cel":"Celtic Language","cgg":"Chiga","ch":"Chamorro","chb":"Chibcha","chg":"Chagatai","chk":"Chuukese","chm":"Mari","chn":"Chinook Jargon","cho":"Choctaw","chp":"Chipewyan","chr":"چیروکی","chy":"Cheyenne","ckb":"سورانی کردش","cmc":"Chamic Language","co":"کوراسیکن","cop":"Coptic","cpe":"English-based Creole or Pidgin","cpf":"French-based Creole or Pidgin","cpp":"Portuguese-based Creole or Pidgin","cr":"Cree","crh":"Crimean Turkish","crp":"Creole or Pidgin","cs":"چیک","csb":"Kashubian","cu":"Church Slavic","cus":"Cushitic Language","cv":"Chuvash","cy":"ویلش","da":"ڈینش","dak":"Dakota","dar":"Dargwa","dav":"Taita","day":"Dayak","de":"جرمن","de-AT":"آسٹریائی جرمن","de-CH":"سوئس ہائی جرمن","del":"Delaware","den":"Slave","dgr":"Dogrib","din":"Dinka","dje":"Zarma","doi":"Dogri","dra":"Dravidian Language","dsb":"Lower Sorbian","dua":"Duala","dum":"Middle Dutch","dv":"ڈیویہی","dyo":"Jola-Fonyi","dyu":"Dyula","dz":"ژونگکھا","dzg":"Dazaga","ebu":"Embu","ee":"ایو","efi":"ایفِک","egy":"Ancient Egyptian","eka":"Ekajuk","el":"یونانی","elx":"Elamite","en":"انگریزی","en-AU":"آسٹریلیائی انگریزی","en-CA":"کینیڈین انگریزی","en-GB":"برطانوی انگریزی","en-US":"امریکی انگریزی","enm":"Middle English","eo":"ایسپرانٹو","es":"ہسپانوی","es-419":"لاطینی امریکی ہسپانوی","es-ES":"یورپی ہسپانوی","et":"اسٹونین","eu":"باسکی","ewo":"Ewondo","fa":"فارسی","fan":"Fang","fat":"Fanti","ff":"Fulah","fi":"فینیش","fil":"فلیپینو","fiu":"Finno-Ugrian Language","fj":"فجی کا باشندہ","fo":"فیروئیز","fon":"Fon","fr":"فرانسیسی","fr-CA":"کینیڈین فرانسیسی","fr-CH":"سوئس فرینچ","frm":"Middle French","fro":"Old French","frr":"Northern Frisian","frs":"Eastern Frisian","fur":"Friulian","fy":"مغربی فریسیئن","ga":"آئیرِش","gaa":"گا","gay":"Gayo","gba":"Gbaya","gd":"سکاٹ گیلِک","gem":"Germanic Language","gez":"Geez","gil":"Gilbertese","gl":"گالیشیائی","gmh":"Middle High German","gn":"گُارانی","goh":"Old High German","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Ancient Greek","gsw":"سوئس جرمن","gu":"گجراتی","guz":"Gusii","gv":"Manx","gwi":"Gwichʼin","ha":"ہؤسا","hai":"Haida","haw":"ہوائی کا باشندہ","he":"عبرانی","hi":"ہندی","hil":"Hiligaynon","him":"Himachali","hit":"Hittite","hmn":"Hmong","ho":"Hiri Motu","hr":"کراتی","hsb":"Upper Sorbian","ht":"ہیتی","hu":"ہنگیرین","hup":"Hupa","hy":"ارمینی","hz":"Herero","ia":"بین لسانیات","iba":"Iban","ibb":"Ibibio","id":"انڈونیثیائی","ie":"Interlingue","ig":"اِگبو","ii":"Sichuan Yi","ijo":"Ijo","ik":"Inupiaq","ilo":"Iloko","inc":"Indic Language","ine":"Indo-European Language","inh":"Ingush","io":"Ido","ira":"Iranian Language","iro":"Iroquoian Language","is":"آئس لینڈ کا باشندہ","it":"اطالوی","iu":"Inuktitut","ja":"جاپانی","jbo":"Lojban","jgo":"Ngomba","jmc":"Machame","jpr":"Judeo-Persian","jrb":"Judeo-Arabic","jv":"جاوی","ka":"جارجی","kaa":"Kara-Kalpak","kab":"Kabyle","kac":"Kachin","kaj":"Jju","kam":"Kamba","kar":"Karen","kaw":"Kawi","kbd":"Kabardian","kbl":"Kanembu","kcg":"Tyap","kde":"Makonde","kea":"Kabuverdianu","kfo":"Koro","kg":"کانگو","kha":"Khasi","khi":"Khoisan Language","kho":"Khotanese","khq":"Koyra Chiini","ki":"Kikuyu","kj":"Kuanyama","kk":"قزاخ","kkj":"Kako","kl":"Kalaallisut","kln":"Kalenjin","km":"کمبوڈیَن","kmb":"Kimbundu","kn":"کنّاڈا","ko":"کورین","kok":"Konkani","kos":"Kosraean","kpe":"Kpelle","kr":"Kanuri","krc":"Karachay-Balkar","krl":"Karelian","kro":"Kru","kru":"Kurukh","ks":"کشمیری","ksb":"Shambala","ksf":"Bafia","ksh":"Colognian","ku":"کردش","kum":"Kumyk","kut":"Kutenai","kv":"Komi","kw":"Cornish","ky":"کرغیزی","la":"لاطینی","lad":"Ladino","lag":"Langi","lah":"Lahnda","lam":"Lamba","lb":"لگژمبرگ کا باشندہ","lez":"Lezghian","lg":"گینڈا","li":"Limburgish","lkt":"Lakota","ln":"لِنگَلا","lo":"لاؤشِیَن","lol":"Mongo","loz":"لوزی","lt":"لتھُواینین","lu":"Luba-Katanga","lua":"لیوبا لولوآ","lui":"Luiseno","lun":"Lunda","luo":"Luo","lus":"Mizo","luy":"Luyia","lv":"لیٹوین","mad":"Madurese","maf":"Mafa","mag":"Magahi","mai":"Maithili","mak":"Makasar","man":"Mandingo","map":"Austronesian Language","mas":"Masai","mde":"Maba","mdf":"Moksha","mdr":"Mandar","men":"Mende","mer":"Meru","mfe":"موریسیین","mg":"ملاگاسی","mga":"Middle Irish","mgh":"Makhuwa-Meetto","mgo":"Meta'","mh":"Marshallese","mi":"ماؤری","mic":"Micmac","min":"Minangkabau","mis":"Miscellaneous Language","mk":"مقدونیائی","mkh":"Mon-Khmer Language","ml":"مالایالم","mn":"منگؤلی","mnc":"Manchu","mni":"Manipuri","mno":"Manobo Language","mo":"Moldavian","moh":"Mohawk","mos":"Mossi","mr":"مراٹهی","ms":"مالائی","mt":"مالٹی","mua":"Mundang","mul":"Multiple Languages","mun":"Munda Language","mus":"Creek","mwl":"Mirandese","mwr":"Marwari","my":"برمی","mye":"Myene","myn":"Mayan Language","myv":"Erzya","na":"Nauru","nah":"Nahuatl","nai":"North American Indian Language","nap":"Neapolitan","naq":"Nama","nb":"نارویجین بوکمل","nd":"شمالی دبیل","nds":"Low German","ne":"نیپالی","new":"Newari","ng":"Ndonga","nia":"Nias","nic":"Niger-Kordofanian Language","niu":"Niuean","nl":"ڈچ","nl-BE":"فلیمِش","nmg":"Kwasio","nn":"نورویجینی نینورسک","nnh":"Ngiemboon","no":"نارویجین","nog":"Nogai","non":"Old Norse","nqo":"N’Ko","nr":"South Ndebele","nso":"شمالی سوتھو","nub":"Nubian Language","nus":"Nuer","nv":"Navajo","nwc":"Classical Newari","ny":"نیانجا","nym":"Nyamwezi","nyn":"نینکول","nyo":"Nyoro","nzi":"Nzima","oc":"آکسیٹان","oj":"Ojibwa","om":"اورومو","or":"اورِیا","os":"اوسیٹک","osa":"Osage","ota":"Ottoman Turkish","oto":"Otomian Language","pa":"پنجابی","paa":"Papuan Language","pag":"Pangasinan","pal":"Pahlavi","pam":"Pampanga","pap":"Papiamento","pau":"Palauan","peo":"Old Persian","phi":"Philippine Language","phn":"Phoenician","pi":"Pali","pl":"پولستانی","pon":"Pohnpeian","pra":"Prakrit Language","pro":"Old Provençal","ps":"پشتو","pt":"پُرتگالی","pt-BR":"برازیلی پرتگالی","pt-PT":"یورپی پرتگالی","qu":"کویچوآ","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","rm":"رومانش","rn":"رونڈی","ro":"رومنی","roa":"Romance Language","rof":"Rombo","rom":"Romany","root":"Root","ru":"روسی","rup":"Aromanian","rw":"کینیاروانڈا","rwk":"Rwa","sa":"سَنسکرِت","sad":"Sandawe","sah":"Sakha","sai":"South American Indian Language","sal":"Salishan Language","sam":"Samaritan Aramaic","saq":"Samburu","sas":"Sasak","sat":"Santali","sba":"Ngambay","sbp":"Sangu","sc":"Sardinian","scn":"Sicilian","sco":"Scots","sd":"سندھی","se":"شمالی سامی","see":"Seneca","seh":"Sena","sel":"Selkup","sem":"Semitic Language","ses":"Koyraboro Senni","sg":"سانگو","sga":"Old Irish","sgn":"Sign Language","sh":"سربو-کروئیشین","shi":"Tachelhit","shn":"Shan","shu":"Chadian Arabic","si":"سنہالا","sid":"Sidamo","sio":"Siouan Language","sit":"Sino-Tibetan Language","sk":"سلوواک","sl":"سلووینیائی","sla":"Slavic Language","sm":"ساموآن","sma":"Southern Sami","smi":"Sami Language","smj":"Lule Sami","smn":"Inari Sami","sms":"Skolt Sami","sn":"شونا","snk":"Soninke","so":"صومالی","sog":"Sogdien","son":"Songhai","sq":"البانی","sr":"صربی","srn":"Sranan Tongo","srr":"Serer","ss":"سواتی","ssa":"Nilo-Saharan Language","ssy":"Saho","st":"جنوبی سوتھو","su":"سنڈانیز","suk":"Sukuma","sus":"Susu","sux":"Sumerian","sv":"سویڈش","sw":"سواحلی","swb":"Comorian","swc":"Congo Swahili","syc":"Classical Syriac","syr":"Syriac","ta":"تمل","tai":"Tai Language","te":"تیلگو","tem":"Timne","teo":"Teso","ter":"Tereno","tet":"ٹیٹم","tg":"تاجک","th":"تھائی","ti":"ٹگرینیا","tig":"Tigre","tiv":"Tiv","tk":"ترکمان","tkl":"Tokelau","tl":"Tagalog","tlh":"کلنگن","tli":"Tlingit","tmh":"Tamashek","tn":"سوانا","to":"ٹونگن","tog":"Nyasa Tonga","tpi":"ٹوک پِسِن","tr":"ترکی","trv":"Taroko","ts":"زونگا","tsi":"Tsimshian","tt":"تاتار","tum":"ٹمبوکا","tup":"Tupi Language","tut":"Altaic Language","tvl":"Tuvalu","tw":"Twi","twq":"Tasawaq","ty":"تاہیتی","tyv":"Tuvinian","tzm":"Central Atlas Tamazight","udm":"Udmurt","ug":"ییگہر","uga":"Ugaritic","uk":"یوکرینیائی","umb":"Umbundu","und":"نامعلوم زبان","ur":"اردو","uz":"ازبیک","vai":"Vai","ve":"وینڈا","vi":"ویتنامی","vo":"Volapük","vot":"Votic","vun":"Vunjo","wa":"Walloon","wae":"Walser","wak":"Wakashan Language","wal":"Wolaytta","war":"Waray","was":"Washo","wen":"Sorbian Language","wo":"وولوف","xal":"Kalmyk","xh":"ژوسا","xog":"Soga","yao":"Yao","yap":"Yapese","yav":"Yangben","ybb":"Yemba","yi":"یدش","yo":"یوروبا","ypk":"Yupik Language","yue":"Cantonese","za":"Zhuang","zap":"Zapotec","zbl":"Blissymbols","zen":"Zenaga","zh":"چینی","zh-Hans":"چینی (آسان کردہ)","zh-Hant":"روایتی چینی","znd":"Zande","zu":"زولو","zun":"Zuni","zxx":"کوئی لسانی مواد نہیں","zza":"Zaza"},"vi":{"aa":"Tiếng Afar","ab":"Tiếng Abkhazia","ace":"Tiếng Achinese","ach":"Tiếng Acoli","ada":"Tiếng Adangme","ady":"Tiếng Adyghe","ae":"Tiếng Avestan","af":"Tiếng Nam Phi","afa":"Ngôn ngữ Phi-Á","afh":"Tiếng Afrihili","agq":"Tiếng Aghem","ain":"Tiếng Ainu","ak":"Tiếng Akan","akk":"Tiếng Akkadia","ale":"Tiếng Aleut","alg":"Ngôn ngữ Algonquin","alt":"Tiếng Altai Miền Nam","am":"Tiếng Amharic","an":"Tiếng Aragon","ang":"Tiếng Anh cổ","anp":"Tiếng Angika","apa":"Ngôn ngữ Apache","ar":"Tiếng Ả Rập","ar-001":"Modern Standard Arabic","arc":"Tiếng Aramaic","arn":"Tiếng Araucanian","arp":"Tiếng Arapaho","art":"Ngôn ngữ Nhân tạo","arw":"Tiếng Arawak","as":"Tiếng Assam","asa":"Tiếng Asu","ast":"Tiếng Asturias","ath":"Ngôn ngữ Athapascan","aus":"Ngôn ngữ Châu Úc","av":"Tiếng Avaric","awa":"Tiếng Awadhi","ay":"Tiếng Aymara","az":"Tiếng Azeri","ba":"Tiếng Bashkir","bad":"Tiếng Banda","bai":"Ngôn ngữ Bamileke","bal":"Tiếng Baluchi","ban":"Tiếng Bali","bas":"Tiếng Basaa","bat":"Ngôn ngữ Baltic","bax":"Tiếng Bamun","bbj":"Tiếng Ghomala","be":"Tiếng Bê-la-rút","bej":"Tiếng Beja","bem":"Tiếng Bemba","ber":"Tiếng Berber","bez":"Tiếng Bena","bfd":"Tiếng Bafut","bg":"Tiếng Bun-ga-ri","bh":"Tiếng Bihari","bho":"Tiếng Bhojpuri","bi":"Tiếng Bislama","bik":"Tiếng Bikol","bin":"Tiếng Bini","bkm":"Tiếng Kom","bla":"Tiếng Siksika","bm":"Tiếng Bambara","bn":"Tiếng Bengali","bnt":"Tiếng Ban-tu","bo":"Tiếng Tây Tạng","br":"Tiếng Breton","bra":"Tiếng Braj","brx":"Tiếng Bodo","bs":"Tiếng Nam Tư","bss":"Tiếng Akoose","btk":"Tiếng Batak","bua":"Tiếng Buriat","bug":"Tiếng Bugin","bum":"Tiếng Bulu","byn":"Tiếng Blin","byv":"Tiếng Medumba","ca":"Tiếng Ca-ta-lăng","cad":"Tiếng Caddo","cai":"Ngôn ngữ Thổ dân Trung Mỹ","car":"Tiếng Carib","cau":"Ngôn ngữ Cáp-ca","cay":"Tiếng Cayuga","cch":"Tiếng Atsam","ce":"Tiếng Chechen","ceb":"Tiếng Cebuano","cel":"Ngôn ngữ Xen-tơ","cgg":"Tiếng Chiga","ch":"Tiếng Chamorro","chb":"Tiếng Chibcha","chg":"Tiếng Chagatai","chk":"Tiếng Chuuk","chm":"Tiếng Mari","chn":"Biệt ngữ Chinook","cho":"Tiếng Choctaw","chp":"Tiếng Chipewyan","chr":"Tiếng Cherokee","chy":"Tiếng Cheyenne","ckb":"Tiếng Kurd Sorani","cmc":"Ngôn ngữ Chamic","co":"Tiếng Corse","cop":"Tiếng Coptic","cpe":"Tiếng Creole hoặc Pidgin gốc Anh","cpf":"Tiếng Creole hoặc Pidgin gốc Pháp","cpp":"Tiếng Creole hoặc Pidgin gốc Bồ Đào Nha","cr":"Tiếng Cree","crh":"Tiếng Thổ Nhĩ Kỳ Crimean","crp":"Tiếng Creole hoặc Pidgin","cs":"Tiếng Séc","csb":"Tiếng Kashubia","cu":"Tiếng Slavơ Nhà thờ","cus":"Tiếng Cushit","cv":"Tiếng Chuvash","cy":"Tiếng Xentơ","da":"Tiếng Đan Mạch","dak":"Tiếng Dakota","dar":"Tiếng Dargwa","dav":"Tiếng Taita","day":"Tiếng Dayak","de":"Tiếng Đức","de-AT":"Austrian German","de-CH":"Tiếng Đức Chuẩn (Thụy Sĩ)","del":"Tiếng Delaware","den":"Tiếng Slave","dgr":"Tiếng Dogrib","din":"Tiếng Dinka","dje":"Tiếng Zarma","doi":"Tiếng Dogri","dra":"Ngôn ngữ Dravidia","dsb":"Tiếng Hạ Sorbia","dua":"Tiếng Duala","dum":"Tiếng Hà Lan Trung cổ","dv":"Tiếng Divehi","dyo":"Tiếng Jola-Fonyi","dyu":"Tiếng Dyula","dz":"Tiếng Dzongkha","dzg":"Tiếng Dazaga","ebu":"Tiếng Embu","ee":"Tiếng Ewe","efi":"Tiếng Efik","egy":"Tiếng Ai Cập cổ","eka":"Tiếng Ekajuk","el":"Tiếng Hy Lạp","elx":"Tiếng Elamite","en":"Tiếng Anh","en-AU":"Australian English","en-CA":"Tiếng Anh (Canada)","en-GB":"Tiếng Anh (Anh)","en-US":"Tiếng Anh (Mỹ)","enm":"Tiếng Anh Trung cổ","eo":"Tiếng Quốc Tế Ngữ","es":"Tiếng Tây Ban Nha","es-419":"Tiếng Tây Ban Nha (Mỹ La tinh)","es-ES":"Tiếng Tây Ban Nha (I-bê-ri)","et":"Tiếng E-xtô-ni-a","eu":"Tiếng Basque","ewo":"Tiếng Ewondo","fa":"Tiếng Ba Tư","fan":"Tiếng Fang","fat":"Tiếng Fanti","ff":"Tiếng Fulah","fi":"Tiếng Phần Lan","fil":"Tiếng Philipin","fiu":"Ngôn ngữ Finno-Ugrian","fj":"Tiếng Fiji","fo":"Tiếng Faore","fon":"Tiếng Fon","fr":"Tiếng Pháp","fr-CA":"Tiếng Pháp (Canada)","fr-CH":"Swiss French","frm":"Tiếng Pháp Trung cổ","fro":"Tiếng Pháp cổ","frr":"Tiếng Frisian Miền Bắc","frs":"Tiếng Frisian Miền Đông","fur":"Tiếng Friulian","fy":"Tiếng Frisian","ga":"Tiếng Ai-len","gaa":"Ga","gay":"Tiếng Gayo","gba":"Tiếng Gbaya","gd":"Tiếng Xentơ (Xcốt len)","gem":"Ngôn ngữ Giéc-man","gez":"Tiếng Geez","gil":"Tiếng Gilbert","gl":"Tiếng Galician","gmh":"Tiếng Thượng Giéc-man Trung cổ","gn":"Tiếng Guarani","goh":"Tiếng Thượng Giéc-man cổ","gon":"Tiếng Gondi","gor":"Tiếng Gorontalo","got":"Tiếng Gô-tích","grb":"Tiếng Grebo","grc":"Tiếng Hy Lạp cổ","gsw":"Tiếng Đức Thụy Sĩ","gu":"Tiếng Gujarati","guz":"Tiếng Gusii","gv":"Tiếng Manx","gwi":"Tiếng Gwichʼin","ha":"Tiếng Hausa","hai":"Tiếng Haida","haw":"Tiếng Hawaii","he":"Tiếng Hê-brơ","hi":"Tiếng Hin-đi","hil":"Tiếng Hiligaynon","him":"Tiếng Himachali","hit":"Tiếng Hittite","hmn":"Tiếng Hmông","ho":"Tiếng Hiri Motu","hr":"Tiếng Crô-a-ti-a","hsb":"Tiếng Thượng Sorbia","ht":"Tiếng Haiti","hu":"Tiếng Hung-ga-ri","hup":"Tiếng Hupa","hy":"Tiếng Ác-mê-ni","hz":"Tiếng Herero","ia":"Tiếng Khoa Học Quốc Tế","iba":"Tiếng Iban","ibb":"Tiếng Ibibio","id":"Tiếng In-đô-nê-xia","ie":"Tiếng Interlingue","ig":"Tiếng Igbo","ii":"Tiếng Di Tứ Xuyên","ijo":"Tiếng Ijo","ik":"Tiếng Inupiaq","ilo":"Tiếng Iloko","inc":"Ngôn ngữ Indic","ine":"Ngôn ngữ Ấn-Âu","inh":"Tiếng Ingush","io":"Tiếng Ido","ira":"Ngôn ngữ Iran","iro":"Ngôn ngữ Iroquoia","is":"Tiếng Ai-xơ-len","it":"Tiếng Ý","iu":"Tiếng Inuktitut","ja":"Tiếng Nhật","jbo":"Tiếng Lojban","jgo":"Ngomba","jmc":"Tiếng Machame","jpr":"Tiếng Judeo-Ba Tư","jrb":"Tiếng Judeo-Ả Rập","jv":"Tiếng Gia-va","ka":"Tiếng Georgian","kaa":"Tiếng Kara-Kalpak","kab":"Tiếng Kabyle","kac":"Tiếng Kachin","kaj":"Tiếng Jju","kam":"Tiếng Kamba","kar":"Tiếng Karen","kaw":"Tiếng Kawi","kbd":"Tiếng Kabardian","kbl":"Tiếng Kanembu","kcg":"Tiếng Tyap","kde":"Tiếng Makonde","kea":"Tiếng Kabuverdianu","kfo":"Tiếng Koro","kg":"Tiếng Congo","kha":"Tiếng Khasi","khi":"Ngôn ngữ Khoisan","kho":"Tiếng Khotan","khq":"Tiếng Koyra Chiini","ki":"Tiếng Kikuyu","kj":"Tiếng Kuanyama","kk":"Tiếng Kazakh","kkj":"Tiếng Kako","kl":"Tiếng Kalaallisut","kln":"Tiếng Kalenjin","km":"Tiếng Campuchia","kmb":"Tiếng Kimbundu","kn":"Tiếng Kan-na-đa","ko":"Tiếng Hàn Quốc","kok":"Tiếng Konkani","kos":"Tiếng Kosrae","kpe":"Tiếng Kpelle","kr":"Tiếng Kanuri","krc":"Tiếng Karachay-Balkar","krl":"Tiếng Karelian","kro":"Tiếng Kru","kru":"Tiếng Kurukh","ks":"Tiếng Kashmiri","ksb":"Tiếng Shambala","ksf":"Tiếng Bafia","ksh":"Tiếng Cologne","ku":"Tiếng Kurd","kum":"Tiếng Kumyk","kut":"Tiếng Kutenai","kv":"Tiếng Komi","kw":"Tiếng Cornish","ky":"Tiếng Kyrgyz","la":"Tiếng La-tinh","lad":"Tiếng Ladino","lag":"Tiếng Langi","lah":"Tiếng Lahnda","lam":"Tiếng Lamba","lb":"Tiếng Luxembourg","lez":"Tiếng Lezghian","lg":"Tiếng Ganda","li":"Tiếng Limburg","lkt":"Lakota","ln":"Tiếng Lingala","lo":"Tiếng Lào","lol":"Tiếng Mongo","loz":"Tiếng Lozi","lt":"Tiếng Lít-va","lu":"Tiếng Luba-Katanga","lua":"Tiếng Luba-Lulua","lui":"Tiếng Luiseno","lun":"Tiếng Lunda","luo":"Tiếng Luo","lus":"Tiếng Lushai","luy":"Tiếng Luyia","lv":"Tiếng Lát-vi-a","mad":"Tiếng Madura","maf":"Tiếng Mafa","mag":"Tiếng Magahi","mai":"Tiếng Maithili","mak":"Tiếng Makasar","man":"Tiếng Mandingo","map":"Ngôn ngữ Úc-Á","mas":"Tiếng Masai","mde":"Tiếng Maba","mdf":"Tiếng Moksha","mdr":"Tiếng Mandar","men":"Tiếng Mende","mer":"Tiếng Meru","mfe":"Tiếng Morisyen","mg":"Tiếng Malagasy","mga":"Tiếng Ai-len Trung cổ","mgh":"Tiếng Makhuwa-Meetto","mgo":"Meta'","mh":"Tiếng Marshall","mi":"Tiếng Maori","mic":"Tiếng Micmac","min":"Tiếng Minangkabau","mis":"Ngôn ngữ Khác","mk":"Tiếng Ma-xê-đô-ni-a","mkh":"Ngôn ngữ Mon-Khmer","ml":"Tiếng Malayalam","mn":"Tiếng Mông Cổ","mnc":"Tiếng Manchu","mni":"Tiếng Manipuri","mno":"Ngôn ngữ Manobo","mo":"Tiếng Moldova","moh":"Tiếng Mohawk","mos":"Tiếng Mossi","mr":"Tiếng Marathi","ms":"Tiếng Ma-lay-xi-a","mt":"Tiếng Mantơ","mua":"Tiếng Mundang","mul":"Nhiều Ngôn ngữ","mun":"Ngôn ngữ Munda","mus":"Tiếng Creek","mwl":"Tiếng Miranda","mwr":"Tiếng Marwari","my":"Tiếng Miến Điện","mye":"Tiếng Myene","myn":"Ngôn ngữ Maya","myv":"Tiếng Erzya","na":"Tiếng Nauru","nah":"Tiếng Nahuatl","nai":"Ngôn ngữ Thổ dân Bắc Mỹ","nap":"Tiếng Napoli","naq":"Tiếng Nama","nb":"Tiếng Na Uy (Bokmål)","nd":"Bắc Ndebele","nds":"Tiếng Hạ Giéc-man","ne":"Tiếng Nê-pan","new":"Tiếng Newari","ng":"Tiếng Ndonga","nia":"Tiếng Nias","nic":"Ngôn ngữ Niger-Kordofan","niu":"Tiếng Niuean","nl":"Tiếng Hà Lan","nl-BE":"Tiếng Flemish","nmg":"Tiếng Kwasio","nn":"Tiếng Na Uy (Nynorsk)","nnh":"Tiếng Ngiemboon","no":"Tiếng Na Uy","nog":"Tiếng Nogai","non":"Tiếng Na Uy cổ","nqo":"Tiếng N'Ko","nr":"Tiếng Ndebele Miền Nam","nso":"Bắc Sotho","nub":"Ngôn ngữ Nubia","nus":"Tiếng Nuer","nv":"Tiếng Navajo","nwc":"Tiếng Newari Cổ điển","ny":"Tiếng Nyanja","nym":"Tiếng Nyamwezi","nyn":"Tiếng Nyankole","nyo":"Tiếng Nyoro","nzi":"Tiếng Nzima","oc":"Tiếng Occitan","oj":"Tiếng Ojibwa","om":"Tiếng Oromo","or":"Tiếng Ô-ri-a","os":"Tiếng Ossetic","osa":"Tiếng Osage","ota":"Tiếng Thổ Nhĩ Kỳ Ottoman","oto":"Ngôn ngữ Otomia","pa":"Tiếng Punjabi","paa":"Ngôn ngữ Papua","pag":"Tiếng Pangasinan","pal":"Tiếng Pahlavi","pam":"Tiếng Pampanga","pap":"Tiếng Papiamento","pau":"Tiếng Palauan","peo":"Tiếng Ba Tư cổ","phi":"Ngôn ngữ Philippine","phn":"Tiếng Phoenicia","pi":"Tiếng Pali","pl":"Tiếng Ba Lan","pon":"Tiếng Pohnpeian","pra":"Ngôn ngữ Prakrit","pro":"Tiếng Provençal cổ","ps":"Tiếng Pushto","pt":"Tiếng Bồ Đào Nha","pt-BR":"Tiếng Bồ Đào Nha (Braxin)","pt-PT":"Tiếng Bồ Đào Nha (I-bê-ri)","qu":"Tiếng Quechua","raj":"Tiếng Rajasthani","rap":"Tiếng Rapanui","rar":"Tiếng Rarotongan","rm":"Tiếng Romansh","rn":"Tiếng Rundi","ro":"Tiếng Ru-ma-ni","roa":"Ngôn ngữ Roman","rof":"Tiếng Rombo","rom":"Tiếng Rumani","root":"Tiếng Root","ru":"Tiếng Nga","rup":"Tiếng Aromania","rw":"Tiếng Kinyarwanda","rwk":"Tiếng Rwa","sa":"Tiếng Phạn","sad":"Tiếng Sandawe","sah":"Tiếng Sakha","sai":"Ngôn ngữ Thổ dân Nam Mỹ","sal":"Ngôn ngữ Salishan","sam":"Tiếng Samaritan Aramaic","saq":"Tiếng Samburu","sas":"Tiếng Sasak","sat":"Tiếng Santali","sba":"Tiếng Ngambay","sbp":"Tiếng Sangu","sc":"Tiếng Sardinia","scn":"Tiếng Sicilia","sco":"Tiếng Scots","sd":"Tiếng Sin-hi","se":"Bắc Sami","see":"Tiếng Seneca","seh":"Tiếng Sena","sel":"Tiếng Selkup","sem":"Ngôn ngữ Semitic","ses":"Tiếng Koyraboro Senni","sg":"Tiếng Sango","sga":"Tiếng Ai-len cổ","sgn":"Ngôn ngữ Ký hiệu","sh":"Tiếng Xéc bi - Croatia","shi":"Tiếng Tachelhit","shn":"Tiếng Shan","shu":"Tiếng Ả-Rập Chad","si":"Tiếng Sinhala","sid":"Tiếng Sidamo","sio":"Ngôn ngữ Sioua","sit":"Ngôn ngữ Sino-Tây Tạng","sk":"Tiếng Xlô-vác","sl":"Tiếng Xlô-ven","sla":"Ngôn ngữ Slavơ","sm":"Tiếng Samoa","sma":"TIếng Sami Miền Nam","smi":"Ngôn ngữ Sami","smj":"Tiếng Lule Sami","smn":"Tiếng Inari Sami","sms":"Tiếng Skolt Sami","sn":"Tiếng Shona","snk":"Tiếng Soninke","so":"Tiếng Xô-ma-li","sog":"Tiếng Sogdien","son":"Tiếng Songhai","sq":"Tiếng An-ba-ni","sr":"Tiếng Séc-bi","srn":"Tiếng Sranan Tongo","srr":"Tiếng Serer","ss":"Tiếng Swati","ssa":"Ngôn ngữ Nilo-Sahara","ssy":"Tiếng Saho","st":"Tiếng Sesotho","su":"Tiếng Xu đăng","suk":"Tiếng Sukuma","sus":"Tiếng Susu","sux":"Tiếng Sumeria","sv":"Tiếng Thụy Điển","sw":"Tiếng Swahili","swb":"Tiếng Cômo","swc":"Tiếng Swahili Công-gô","syc":"Tiếng Syria Cổ điển","syr":"Tiếng Syriac","ta":"Tiếng Tamil","tai":"Ngôn ngữ Thái","te":"Tiếng Telugu","tem":"Tiếng Timne","teo":"Tiếng Teso","ter":"Tiếng Tereno","tet":"Tetum","tg":"Tiếng Tajik","th":"Tiếng Thái","ti":"Tiếng Tigrigya","tig":"Tiếng Tigre","tiv":"Tiếng Tiv","tk":"Tiếng Tuôc-men","tkl":"Tiếng Tokelau","tl":"Tiếng Tagalog","tlh":"Tiếng Klingon","tli":"Tiếng Tlingit","tmh":"Tiếng Tamashek","tn":"Tiếng Tswana","to":"Tiếng Tonga","tog":"Tiếng Nyasa Tonga","tpi":"Tiếng Tok Pisin","tr":"Tiếng Thổ Nhĩ Kỳ","trv":"Tiếng Taroko","ts":"Tiếng Tsonga","tsi":"Tiếng Tsimshian","tt":"Tiếng Tatar","tum":"Tiếng Tumbuka","tup":"Ngôn ngữ Tupi","tut":"Ngôn ngữ Altai","tvl":"Tiếng Tuvalu","tw":"Tiếng Twi","twq":"Tiếng Tasawaq","ty":"Tiếng Tahiti","tyv":"Tiếng Tuvinian","tzm":"Tiếng Tamazight Miền Trung Ma-rốc","udm":"Tiếng Udmurt","ug":"Tiếng Uyghur","uga":"Tiếng Ugaritic","uk":"Tiếng U-crai-na","umb":"Tiếng Umbundu","und":"Tiếng không xác định","ur":"Tiếng Uđu","uz":"Tiếng U-dơ-bếch","vai":"Tiếng Vai","ve":"Tiếng Venda","vi":"Tiếng Việt","vo":"Tiếng Volapük","vot":"Tiếng Votic","vun":"Tiếng Vunjo","wa":"Tiếng Walloon","wae":"Tiếng Walser","wak":"Ngôn ngữ Wakashan","wal":"Tiếng Walamo","war":"Tiếng Waray","was":"Tiếng Washo","wen":"Ngôn ngữ Sorbia","wo":"Tiếng Wolof","xal":"Tiếng Kalmyk","xh":"Tiếng Xhosa","xog":"Tiếng Soga","yao":"Tiếng Yao","yap":"Tiếng Yap","yav":"Tiếng Yangben","ybb":"Tiếng Yemba","yi":"Tiếng Y-đit","yo":"Tiếng Yoruba","ypk":"Tiếng Yupik","yue":"Tiếng Quảng Đông","za":"Tiếng Zhuang","zap":"Tiếng Zapotec","zbl":"Ký hiệu Blissymbols","zen":"Tiếng Zenaga","zh":"Tiếng Trung","zh-Hans":"Tiếng Trung (Giản thể)","zh-Hant":"Tiếng Trung (Phồn thể)","znd":"Tiếng Zande","zu":"Tiếng Zulu","zun":"Tiếng Zuni","zxx":"Không có nội dung ngôn ngữ","zza":"Tiếng Zaza"},"zh":{"aa":"阿法文","ab":"阿布哈西亚文","ace":"亚齐文","ach":"阿乔利文","ada":"阿当梅文","ady":"阿迪何文","ae":"阿维斯塔文","af":"南非荷兰文","afa":"其他亚非语系","afh":"阿弗里希利文","agq":"亚罕文","ain":"阿伊努文","ak":"阿肯文","akk":"阿卡德文","ale":"阿留申文","alg":"其他阿尔贡语系","alt":"南阿尔泰文","am":"阿姆哈拉文","an":"阿拉贡文","ang":"古英文","anp":"昂加文","apa":"阿帕切文","ar":"阿拉伯文","ar-001":"Modern Standard Arabic","arc":"阿拉米文","arn":"阿劳坎文","arp":"阿拉帕霍文","art":"其他人工语系","arw":"阿拉瓦克文","as":"阿萨姆文","asa":"阿苏文","ast":"阿斯图里亚思特文","ath":"阿萨帕斯坎语系","aus":"澳大利亚语系","av":"阿瓦尔文","awa":"阿瓦乔文","ay":"艾马拉文","az":"阿塞拜疆文","ba":"巴什客尔文","bad":"班达文","bai":"巴米累克语系","bal":"俾路支文","ban":"巴里文","bas":"巴萨文","bat":"其他波罗的语系","bax":"巴姆穆文","bbj":"戈马拉文","be":"白俄罗斯文","bej":"别札文","bem":"别姆巴文","ber":"柏柏尔文","bez":"贝纳文","bfd":"巴非特文","bg":"保加利亚文","bh":"比哈尔文","bho":"博杰普尔文","bi":"比斯拉马文","bik":"毕库尔文","bin":"比尼文","bkm":"科姆文","bla":"司克司卡文","bm":"班巴拉文","bn":"孟加拉文","bnt":"班图文","bo":"藏文","br":"布里多尼文","bra":"布拉杰文","brx":"博多文","bs":"波斯尼亚文","bss":"阿库色文","btk":"巴塔克文","bua":"布里亚特文","bug":"布吉文","bum":"布鲁文","byn":"布林文","byv":"梅敦巴文","ca":"加泰罗尼亚文","cad":"卡多文","cai":"其他中美印第安语系","car":"巴勒比文","cau":"其他高加索语系","cay":"卡尤加文","cch":"阿灿文","ce":"车臣文","ceb":"宿务文","cel":"其他凯尔特语系","cgg":"奇加文","ch":"查莫罗文","chb":"契布卡文","chg":"查加文","chk":"楚吾克文","chm":"马里文","chn":"契努克文","cho":"乔克托文","chp":"佩瓦扬文","chr":"彻罗基文","chy":"夏延文","ckb":"索拉尼库尔德文","cmc":"查米克文","co":"科西嘉文","cop":"科普特文","cpe":"其他以英文为基础的克里奥尔混合语系","cpf":"其他以法文为基础的克里奥尔混合语系","cpp":"其他以葡萄牙文为基础的克里奥尔混合语系","cr":"克里族文","crh":"克里米亚土耳其文","crp":"其他克里奥尔混合语系","cs":"捷克文","csb":"卡舒文","cu":"宗教斯拉夫文","cus":"其他库施特语系","cv":"楚瓦什文","cy":"威尔士文","da":"丹麦文","dak":"达科他文","dar":"达尔格瓦文","dav":"台塔文","day":"达雅克文","de":"德文","de-AT":"奥地利德文","de-CH":"瑞士高地德文","del":"特拉华文","den":"司雷夫文","dgr":"多格里布文","din":"丁卡文","dje":"哲尔马文","doi":"多格拉文","dra":"其他德拉维语系","dsb":"下索布文","dua":"都阿拉文","dum":"中古荷兰文","dv":"迪维希文","dyo":"朱拉文","dyu":"迪尤拉文","dz":"不丹文","dzg":"达扎葛文","ebu":"恩布文","ee":"埃维文","efi":"埃菲克文","egy":"古埃及文","eka":"埃克丘克文","el":"希腊文","elx":"艾拉米特文","en":"英文","en-AU":"澳大利亚英文","en-CA":"加拿大英文","en-GB":"英国英文","en-US":"美国英文","enm":"中古英文","eo":"世界文","es":"西班牙文","es-419":"拉丁美洲西班牙文","es-ES":"西班牙语（伊比利亚）","et":"爱沙尼亚文","eu":"巴斯克文","ewo":"旺杜文","fa":"波斯文","fan":"芳格文","fat":"芳蒂文","ff":"夫拉文","fi":"芬兰文","fil":"菲律宾文","fiu":"其他芬兰乌戈尔语系","fj":"斐济文","fo":"法罗文","fon":"丰文","fr":"法文","fr-CA":"加拿大法文","fr-CH":"瑞士法文","frm":"中古法文","fro":"古法文","frr":"北弗里西亚文","frs":"东弗里西亚文","fur":"弗留利文","fy":"西弗里西亚文","ga":"爱尔兰文","gaa":"加文","gay":"迦约文","gba":"葛巴亚文","gd":"苏格兰盖尔文","gem":"其他日尔曼语系","gez":"吉兹文","gil":"吉尔伯特斯文","gl":"加利西亚文","gmh":"中古高地德文","gn":"瓜拉尼文","goh":"古高地德文","gon":"岗德文","gor":"科洛涅达罗文","got":"哥特文","grb":"格列博文","grc":"古希腊文","gsw":"瑞士德文","gu":"古吉拉特文","guz":"古西文","gv":"马恩岛文","gwi":"吉维克琴文","ha":"豪萨文","hai":"海达文","haw":"夏威夷文","he":"希伯来文","hi":"印地文","hil":"希利盖农文","him":"赫马查利文","hit":"赫梯文","hmn":"赫蒙文","ho":"希里莫图文","hr":"克罗地亚文","hsb":"上索布文","ht":"海地文","hu":"匈牙利文","hup":"胡帕文","hy":"亚美尼亚文","hz":"赫雷罗文","ia":"国际文字","iba":"伊班文","ibb":"伊比比奥文","id":"印度尼西亚文","ie":"国际文字（E）","ig":"伊布文","ii":"四川彝文","ijo":"伊乔文","ik":"依奴皮维克文","ilo":"伊洛干诺文","inc":"其他印度语系","ine":"其他印欧语系","inh":"印古什文","io":"伊多文","ira":"伊朗文","iro":"伊洛魁语系","is":"冰岛文","it":"意大利文","iu":"伊努伊特文","ja":"日文","jbo":"逻辑文","jgo":"Ngomba","jmc":"马切姆文","jpr":"犹太波斯文","jrb":"犹太阿拉伯文","jv":"爪哇文","ka":"格鲁吉亚文","kaa":"卡拉卡尔帕克文","kab":"卡比尔文","kac":"卡琴文","kaj":"卡捷文","kam":"卡姆巴文","kar":"喀伦文","kaw":"卡威文","kbd":"卡巴尔达文","kbl":"加涅姆布文","kcg":"卡塔布文","kde":"马孔德文","kea":"卡布佛得鲁文","kfo":"科罗文","kg":"刚果文","kha":"卡西文","khi":"其他科伊桑语系","kho":"和田文","khq":"西桑海文","ki":"吉库尤文","kj":"宽亚玛文","kk":"哈萨克文","kkj":"卡库文","kl":"格陵兰文","kln":"卡伦金文","km":"高棉文","kmb":"金邦杜文","kn":"卡纳达文","ko":"韩文","kok":"刚卡尼文","kos":"科斯拉伊文","kpe":"克佩列文","kr":"卡努里文","krc":"卡拉恰伊巴尔卡尔文","krl":"卡累利阿文","kro":"克鲁文","kru":"库鲁克文","ks":"克什米尔文","ksb":"香巴拉文","ksf":"巴菲亚文","ksh":"科隆文","ku":"库尔德文","kum":"库梅克文","kut":"库特内文","kv":"科米文","kw":"凯尔特文","ky":"吉尔吉斯文","la":"拉丁文","lad":"拉迪诺文","lag":"朗吉文","lah":"拉亨达文","lam":"兰巴文","lb":"卢森堡文","lez":"莱兹依昂文","lg":"卢干达文","li":"淋布尔吉文","lkt":"Lakota","ln":"林加拉文","lo":"老挝文","lol":"芒戈文","loz":"洛兹文","lt":"立陶宛文","lu":"鲁巴加丹加文","lua":"鲁巴鲁瓦文","lui":"路易塞诺文","lun":"隆达文","luo":"卢奥文","lus":"卢晒文","luy":"卢雅文","lv":"拉脱维亚文","mad":"马都拉文","maf":"马法文","mag":"马加伊文","mai":"迈蒂利文","mak":"望加锡文","man":"曼丁哥文","map":"澳斯特罗尼西亚语系","mas":"萨伊文","mde":"马坝文","mdf":"莫克沙文","mdr":"曼达尔文","men":"门迪文","mer":"梅鲁文","mfe":"毛里求斯克里奥尔文","mg":"马尔加什文","mga":"中古爱尔兰文","mgh":"马夸文","mgo":"Meta'","mh":"马绍尔文","mi":"毛利文","mic":"米克马克文","min":"米南卡保文","mis":"各种不同语系","mk":"马其顿文","mkh":"其他孟高棉语系","ml":"马拉雅拉姆文","mn":"蒙古文","mnc":"满文","mni":"曼尼普里文","mno":"马诺博语系","mo":"摩尔多瓦文","moh":"摩霍克文","mos":"莫西文","mr":"马拉地文","ms":"马来文","mt":"马耳他文","mua":"蒙当文","mul":"多种语系","mun":"蒙达语系","mus":"克里克文","mwl":"米兰德斯文","mwr":"马尔瓦利文","my":"缅甸文","mye":"姆耶内文","myn":"玛雅语系","myv":"俄日亚文","na":"瑙鲁文","nah":"纳瓦特尔文","nai":"其他北美印第安语系","nap":"拿波里文","naq":"纳马文","nb":"挪威博克马尔文","nd":"北恩德贝勒文","nds":"低地德文","ne":"尼泊尔文","new":"尼瓦尔文","ng":"恩东加文","nia":"尼亚斯文","nic":"其他尼日尔科尔多凡语系","niu":"纽埃文","nl":"荷兰文","nl-BE":"佛兰芒文","nmg":"夸西奥文","nn":"挪威尼诺斯克文","nnh":"恩甘澎文","no":"挪威文","nog":"诺盖文","non":"古诺尔斯文","nqo":"西非书面文字","nr":"南恩德贝勒文","nso":"北索托文","nub":"努比亚语系","nus":"努埃尔文","nv":"纳瓦霍文","nwc":"经典尼瓦尔文","ny":"尼扬扎文","nym":"尼亚姆韦齐文","nyn":"尼昂科勒文","nyo":"尼约罗文","nzi":"恩济马文","oc":"奥克西唐文","oj":"奥吉布瓦文","om":"奥洛莫文","or":"欧里亚文","os":"奥塞梯文","osa":"奥萨格文","ota":"奥托曼土耳其文","oto":"奥托米语系","pa":"旁遮普文","paa":"其他巴布亚文","pag":"邦阿西楠文","pal":"帕拉维文","pam":"邦板牙文","pap":"帕皮亚门托文","pau":"帕劳文","peo":"古老波斯文","phi":"其他菲律宾语系","phn":"腓尼基文","pi":"巴利文","pl":"波兰文","pon":"波纳佩文","pra":"普拉克里特诸语言","pro":"普罗文斯文","ps":"普什图文","pt":"葡萄牙文","pt-BR":"巴西葡萄牙文","pt-PT":"欧洲葡萄牙文","qu":"盖丘亚文","raj":"拉贾斯坦文","rap":"拉帕努伊文","rar":"拉罗汤加文","rm":"罗曼什文","rn":"基隆迪文","ro":"罗马尼亚文","roa":"其他拉丁语系","rof":"兰博文","rom":"吉普赛文","root":"根语言","ru":"俄文","rup":"阿罗马尼亚文","rw":"卢旺达文","rwk":"罗瓦文","sa":"梵文","sad":"散达维文","sah":"雅库特文","sai":"其他南美印第安文","sal":"萨利什文","sam":"萨玛利亚文","saq":"桑布鲁文","sas":"萨萨克文","sat":"桑塔利文","sba":"甘拜文","sbp":"桑古文","sc":"萨丁文","scn":"西西里文","sco":"苏格兰文","sd":"信德文","se":"北萨米文","see":"塞内卡文","seh":"塞纳文","sel":"塞尔库普文","sem":"其他闪族语系","ses":"东桑海文","sg":"桑戈文","sga":"古爱尔兰文","sgn":"手语","sh":"塞尔维亚-克罗地亚文","shi":"希尔哈文","shn":"掸文","shu":"乍得阿拉伯文","si":"僧伽罗文","sid":"悉达摩文","sio":"苏语诸语言","sit":"其他汉藏语系","sk":"斯洛伐克文","sl":"斯洛文尼亚文","sla":"其他斯拉夫语系","sm":"萨摩亚文","sma":"南萨米文","smi":"其他萨米文","smj":"律勒欧萨莫斯文","smn":"伊纳里萨米文","sms":"斯科特萨米文","sn":"绍纳文","snk":"索尼基文","so":"索马里文","sog":"古粟特文","son":"桑海文","sq":"阿尔巴尼亚文","sr":"塞尔维亚文","srn":"苏里南汤加文","srr":"谢列尔文","ss":"斯瓦特文","ssa":"非洲撒哈拉沙漠边缘地带语言","ssy":"萨霍文","st":"南索托文","su":"巽他文","suk":"苏库马文","sus":"苏苏文","sux":"苏马文","sv":"瑞典文","sw":"斯瓦希里文","swb":"科摩罗文","swc":"刚果斯瓦希里文","syc":"经典叙利亚文","syr":"叙利亚文","ta":"泰米尔文","tai":"傣语诸语言","te":"泰卢固文","tem":"滕内文","teo":"特索文","ter":"特列纳文","tet":"特塔姆文","tg":"塔吉克文","th":"泰文","ti":"提格里尼亚文","tig":"提格雷文","tiv":"蒂夫文","tk":"土库曼文","tkl":"托克劳文","tl":"塔加洛文","tlh":"克林贡文","tli":"特林吉特文","tmh":"塔马奇克文","tn":"塞茨瓦纳文","to":"汤加文","tog":"汤加文（尼亚萨地区）","tpi":"托克皮辛文","tr":"土耳其文","trv":"太鲁阁文","ts":"宗加文","tsi":"蒂姆西亚文","tt":"塔塔尔文","tum":"通布卡文","tup":"图皮语系","tut":"阿尔泰诸语言","tvl":"图瓦卢文","tw":"特威文","twq":"北桑海文","ty":"塔西提文","tyv":"图瓦文","tzm":"塔马齐格特文","udm":"乌德穆尔特文","ug":"维吾尔文","uga":"乌加里特文","uk":"乌克兰文","umb":"翁本杜文","und":"未知语言","ur":"乌尔都文","uz":"乌兹别克文","vai":"瓦伊文","ve":"文达文","vi":"越南文","vo":"沃拉普克文","vot":"沃提克文","vun":"温旧文","wa":"瓦隆文","wae":"瓦尔瑟文","wak":"瓦卡什诸语言","wal":"瓦拉莫文","war":"瓦赖文","was":"瓦绍文","wen":"索布诸语言","wo":"沃洛夫文","xal":"卡尔梅克文","xh":"科萨文","xog":"索加文","yao":"瑶族文","yap":"雅浦文","yav":"洋卞文","ybb":"耶姆巴文","yi":"依地文","yo":"约鲁巴文","ypk":"尤皮克诸语言","yue":"粤语","za":"壮文","zap":"萨波蒂克文","zbl":"布利斯符号","zen":"泽纳加文","zh":"中文","zh-Hans":"简体中文","zh-Hant":"繁体中文","znd":"赞德文","zu":"祖鲁文","zun":"祖尼文","zxx":"无语言内容","zza":"扎扎文"},"zh-Hant":{"aa":"阿法文","ab":"阿布哈茲文","ace":"亞齊文","ach":"阿僑利文","ada":"阿當莫文","ady":"阿迪各文","ae":"阿緯斯陀文","af":"南非荷蘭文","afa":"亞非諸語言","afh":"阿弗里希利文","agq":"亞罕文","ain":"愛努文","ak":"阿坎文","akk":"阿卡德文","ale":"阿留申文","alg":"阿爾岡昆諸語言","alt":"南阿爾泰文","am":"阿姆哈拉文","an":"阿拉貢文","ang":"古英文","anp":"昂加文","apa":"阿帕切諸語言","ar":"阿拉伯文","ar-001":"Modern Standard Arabic","arc":"阿拉米文","arn":"阿勞坎文","arp":"阿拉帕霍文","art":"人工語言","arw":"阿拉瓦克文","as":"阿薩姆文","asa":"阿蘇文","ast":"阿斯圖里亞文","ath":"阿薩帕斯坎諸語言","aus":"澳洲諸語言","av":"阿瓦爾文","awa":"阿瓦文","ay":"艾馬拉文","az":"亞塞拜然文","ba":"巴什客爾文","bad":"班達文","bai":"巴米累克諸語言","bal":"俾路支文","ban":"峇里文","bas":"巴薩文","bat":"波羅的海諸語言","bax":"巴姆穆文","bbj":"戈馬拉文","be":"白俄羅斯文","bej":"貝扎文","bem":"別姆巴文","ber":"柏柏爾文","bez":"貝納文","bfd":"富特文","bg":"保加利亞文","bh":"比哈爾文","bho":"博傑普爾文","bi":"比斯拉馬文","bik":"比科爾文","bin":"比尼文","bkm":"康姆文","bla":"錫克錫卡文","bm":"班巴拉文","bn":"孟加拉文","bnt":"班圖諸語言","bo":"藏文","br":"布里多尼文","bra":"布拉杰文","brx":"博多文","bs":"波士尼亞文","bss":"阿庫色文","btk":"巴塔克文","bua":"布里阿特文","bug":"布吉斯文","bum":"布魯文","byn":"比林文","byv":"梅敦巴文","ca":"加泰羅尼亞文","cad":"卡多文","cai":"中美印第安諸語言","car":"加勒比文","cau":"高加索諸語言","cay":"卡尤加文","cch":"阿燦文","ce":"車臣文","ceb":"宿霧文","cel":"凱爾特諸語言","cgg":"奇加文","ch":"查莫洛文","chb":"奇布查文","chg":"查加文","chk":"處奇斯文","chm":"馬里文","chn":"契奴克文","cho":"喬克托文","chp":"奇佩瓦揚文","chr":"柴羅基文","chy":"沙伊安文","ckb":"索拉尼庫爾德文","cmc":"佔語諸語言","co":"科西嘉文","cop":"科普特文","cpe":"源自英文的克里奧爾文和皮欽文","cpf":"源自法文的克里奧爾文和皮欽文","cpp":"源自葡萄牙文的克里奧爾文和皮欽文","cr":"克裡文","crh":"克里米亞半島的土耳其文；克里米亞半島的塔塔爾文","crp":"克里奧爾文和皮欽文","cs":"捷克文","csb":"卡舒布文","cu":"宗教斯拉夫文","cus":"庫施特諸語言","cv":"楚瓦什文","cy":"威爾斯文","da":"丹麥文","dak":"達科他文","dar":"達爾格瓦文","dav":"台塔文","day":"迪雅克文","de":"德文","de-AT":"德文 (奧地利)","de-CH":"高地德文 (瑞士)","del":"德拉瓦文","den":"斯拉夫","dgr":"多格里布文","din":"丁卡文","dje":"扎爾馬文","doi":"多格來文","dra":"德拉威諸語言","dsb":"下索布文","dua":"杜亞拉文","dum":"中古荷蘭文","dv":"迪維西文","dyo":"朱拉文","dyu":"迪尤拉文","dz":"不丹文","dzg":"達薩文","ebu":"恩布文","ee":"埃維文","efi":"埃菲克文","egy":"古埃及文","eka":"艾卡朱克文","el":"希臘文","elx":"埃蘭文","en":"英文","en-AU":"英文 (澳洲)","en-CA":"英文 (加拿大)","en-GB":"英文 (英國)","en-US":"英文 (美國)","enm":"中古英文","eo":"世界語","es":"西班牙文","es-419":"西班牙文 (拉丁美洲)","es-ES":"西班牙文 (歐洲)","et":"愛沙尼亞文","eu":"巴斯克文","ewo":"依汪都文","fa":"波斯文","fan":"芳族文","fat":"芳蒂文","ff":"富拉文","fi":"芬蘭文","fil":"菲律賓文","fiu":"芬烏諸語言","fj":"斐濟文","fo":"法羅文","fon":"豐文","fr":"法文","fr-CA":"法文 (加拿大)","fr-CH":"法文 (瑞士)","frm":"中古法文","fro":"古法文","frr":"北弗里西亞文","frs":"東弗里西亞文","fur":"弗留利文","fy":"西弗里西亞文","ga":"愛爾蘭文","gaa":"加族文","gay":"加約文","gba":"葛巴亞文","gd":"蘇格蘭 - 蓋爾文","gem":"日耳曼諸語言","gez":"吉茲文","gil":"吉爾伯特群島文","gl":"加里西亞文","gmh":"中古高地德文","gn":"瓜拉尼文","goh":"古高地日耳曼文","gon":"岡德文","gor":"科隆達羅文","got":"哥德文","grb":"格列博文","grc":"古希臘文","gsw":"德文（瑞士）","gu":"吉亞拉塔文","guz":"古西文","gv":"曼島文","gwi":"圭契文","ha":"豪撒文","hai":"海達文","haw":"夏威夷文","he":"希伯來文","hi":"北印度文","hil":"希利蓋農文","him":"赫馬查利文","hit":"赫梯文","hmn":"孟文","ho":"西里莫圖土文","hr":"克羅埃西亞文","hsb":"上索布文","ht":"海地文","hu":"匈牙利文","hup":"胡帕文","hy":"亞美尼亞文","hz":"赫雷羅文","ia":"國際文","iba":"伊班文","ibb":"伊比比奧文","id":"印尼文","ie":"國際文（E）","ig":"伊布文","ii":"四川彝文","ijo":"伊喬文","ik":"依奴皮維克文","ilo":"伊洛闊文","inc":"印度諸語言","ine":"印歐諸語言","inh":"印古什文","io":"伊朗文","ira":"伊朗諸語言","iro":"易洛魁文","is":"冰島文","it":"義大利文","iu":"因紐特文","ja":"日文","jbo":"邏輯文","jgo":"Ngomba","jmc":"馬恰美文","jpr":"猶太教-波斯文","jrb":"猶太阿拉伯文","jv":"爪哇文","ka":"喬治亞文","kaa":"卡拉卡爾帕克文","kab":"卡比爾文","kac":"卡琴文","kaj":"卡捷文","kam":"卡姆巴文","kar":"克倫文","kaw":"卡威文","kbd":"卡巴爾達文","kbl":"卡念布文","kcg":"卡塔布文","kde":"馬孔德文","kea":"卡布威爾第文","kfo":"科羅文","kg":"剛果文","kha":"卡西文","khi":"科依桑諸語言","kho":"和闐文","khq":"西桑海文","ki":"吉庫尤文","kj":"廣亞馬文","kk":"哈薩克文","kkj":"卡庫文","kl":"格陵蘭文","kln":"卡倫金文","km":"高棉文","kmb":"金邦杜文","kn":"坎那達文","ko":"韓文","kok":"貢根文","kos":"科斯雷恩文","kpe":"克佩列文","kr":"卡努裡文","krc":"卡拉柴-包爾卡爾文","krl":"卡累利阿文","kro":"克魯文","kru":"庫魯科文","ks":"克什米爾文","ksb":"尚巴拉文","ksf":"巴菲亞文","ksh":"科隆文","ku":"庫爾德文","kum":"庫密克文","kut":"庫特奈文","kv":"科米文","kw":"康瓦耳文","ky":"吉爾吉斯文","la":"拉丁文","lad":"拉迪諾文","lag":"朗吉文","lah":"拉亨達文","lam":"蘭巴文","lb":"盧森堡文","lez":"列茲干文","lg":"干達文","li":"林堡文","lkt":"Lakota","ln":"林加拉文","lo":"寮國文","lol":"芒戈文","loz":"洛齊文","lt":"立陶宛文","lu":"魯巴加丹加文","lua":"魯巴魯魯亞文","lui":"路易塞諾文","lun":"盧恩達文","luo":"盧奧文","lus":"盧晒文","luy":"盧雅文","lv":"拉脫維亞文","mad":"馬都拉文","maf":"馬法文","mag":"馬加伊文","mai":"邁蒂利文","mak":"望加錫文","man":"曼丁哥文","map":"南島諸語言","mas":"馬賽文","mde":"馬巴文","mdf":"莫克沙文","mdr":"曼達文","men":"門德文","mer":"梅魯文","mfe":"克里奧文（模里西斯）","mg":"馬爾加什文","mga":"中古愛爾蘭文","mgh":"馬夸文","mgo":"Meta'","mh":"馬紹爾文","mi":"毛利文","mic":"米克馬克文","min":"米南卡堡文","mis":"混雜語諸語言","mk":"馬其頓文","mkh":"孟高棉諸語言","ml":"馬來亞拉姆文","mn":"蒙古文","mnc":"滿族文","mni":"曼尼普裡文","mno":"馬諾博諸語言","mo":"摩爾多瓦文","moh":"莫霍克文","mos":"莫西文","mr":"馬拉地文","ms":"馬來文","mt":"馬爾他文","mua":"蒙當文","mul":"多種語言","mun":"蒙達諸語言","mus":"克里克文","mwl":"米蘭德斯文","mwr":"馬爾尼裡文","my":"緬甸文","mye":"姆耶內文","myn":"馬雅諸語言","myv":"厄爾茲亞文","na":"諾魯文","nah":"納瓦特文","nai":"北美印第安諸語言","nap":"拿波里文","naq":"納馬文","nb":"挪威波克默爾文","nd":"北地畢列文","nds":"低地德文","ne":"尼泊爾文","new":"尼瓦爾文","ng":"恩東加文","nia":"尼亞斯文","nic":"尼日爾科爾多凡諸語言","niu":"紐埃文","nl":"荷蘭文","nl-BE":"法蘭德斯文","nmg":"夸西奧文","nn":"新挪威文","nnh":"恩甘澎文","no":"挪威文","nog":"諾蓋文","non":"古諾爾斯文","nqo":"西非書面語言（N'ko）","nr":"南地畢列文","nso":"北索托文","nub":"努比亞諸語言","nus":"努埃爾文","nv":"納瓦約文","nwc":"古尼瓦爾文","ny":"尼揚賈文","nym":"尼揚韋齊文","nyn":"尼揚科萊文","nyo":"尼奧囉文","nzi":"尼茲馬文","oc":"奧克西坦文","oj":"奧杰布瓦文","om":"奧羅莫文","or":"歐里亞文","os":"奧塞提文","osa":"歐塞奇文","ota":"鄂圖曼土耳其文","oto":"奧托米諸語言","pa":"旁遮普文","paa":"巴布亞諸語言","pag":"潘加辛文","pal":"巴列維文","pam":"潘帕嘉文","pap":"帕皮阿門托文","pau":"帛琉文","peo":"古波斯文","phi":"菲律賓諸語言","phn":"腓尼基文","pi":"巴利文","pl":"波蘭文","pon":"波那貝文","pra":"普拉克里特諸語言","pro":"古普羅旺斯文","ps":"普什圖語","pt":"葡萄牙文","pt-BR":"葡萄牙文 (巴西)","pt-PT":"葡萄牙文 (歐洲)","qu":"蓋丘亞文","raj":"拉賈斯坦諸文","rap":"復活島文","rar":"拉羅通加文","rm":"里托羅曼斯文","rn":"隆迪文","ro":"羅馬尼亞文","roa":"羅曼諸語言","rof":"蘭博文","rom":"吉普賽文","root":"根語言","ru":"俄文","rup":"羅馬尼亞語系","rw":"盧安達文","rwk":"羅瓦文","sa":"梵文","sad":"桑達韋文","sah":"雅庫特文","sai":"南美印第安諸語言","sal":"薩利什諸語言","sam":"薩瑪利亞阿拉姆文","saq":"薩布魯文","sas":"撒撒克文","sat":"散塔利文","sba":"甘拜文","sbp":"桑古文","sc":"撒丁文","scn":"西西里文","sco":"蘇格蘭文","sd":"印度語","se":"北方薩米文","see":"塞訥卡文","seh":"賽納文","sel":"瑟爾卡普文","sem":"閃語諸語言","ses":"東桑海文","sg":"桑戈文","sga":"古愛爾蘭文","sgn":"手語","sh":"塞爾維亞克羅埃西亞文","shi":"希爾哈文","shn":"撣文","shu":"阿拉伯文（查德）","si":"僧伽羅文","sid":"希達摩文","sio":"蘇語諸語言","sit":"漢藏諸語言","sk":"斯洛伐克文","sl":"斯洛維尼亞文","sla":"斯拉夫諸語言","sm":"薩摩亞文","sma":"南薩米文","smi":"薩米諸語言","smj":"魯勒薩米文","smn":"伊納裡薩米文","sms":"斯科特薩米文","sn":"塞內加爾文","snk":"索尼基文","so":"索馬利文","sog":"索格底亞納文","son":"桑海文","sq":"阿爾巴尼亞文","sr":"塞爾維亞文","srn":"蘇拉南東墎文","srr":"塞雷爾文","ss":"斯瓦特文","ssa":"尼羅撒哈拉諸語言","ssy":"薩霍文","st":"塞索托文","su":"巽他語","suk":"蘇庫馬文","sus":"蘇蘇文","sux":"蘇美文","sv":"瑞典文","sw":"史瓦希里文","swb":"葛摩文","swc":"史瓦希里文（剛果）","syc":"古敘利亞文","syr":"敘利亞文","ta":"坦米爾文","tai":"傣語諸語言","te":"泰盧固文","tem":"提姆文","teo":"特索文","ter":"泰雷諾文","tet":"泰頓文","tg":"塔吉克文","th":"泰文","ti":"提格利尼亞文","tig":"蒂格雷文","tiv":"提夫文","tk":"土庫曼文","tkl":"托克勞文","tl":"塔加路族文","tlh":"克林貢文","tli":"特林基特文","tmh":"塔馬奇克文","tn":"突尼西亞文","to":"東加文","tog":"東加文（尼亞薩）","tpi":"托比辛文","tr":"土耳其文","trv":"太魯閣文","ts":"特松加文","tsi":"欽西安文","tt":"韃靼文","tum":"圖姆布卡文","tup":"圖皮諸語言","tut":"阿爾泰諸語言（其他）","tvl":"吐瓦魯文","tw":"特威文","twq":"北桑海文","ty":"大溪地文","tyv":"土凡文","tzm":"塔馬齊格特文","udm":"沃蒂艾克文","ug":"維吾爾文","uga":"烏加列文","uk":"烏克蘭文","umb":"姆本杜文","und":"不確定語言","ur":"烏爾都文","uz":"烏茲別克文","vai":"越南文（Vai）","ve":"溫達文","vi":"越南文","vo":"沃拉普克文","vot":"沃提克文","vun":"溫舊文","wa":"瓦隆文","wae":"瓦瑟文","wak":"瓦卡什諸語言","wal":"瓦拉莫文","war":"瓦瑞文","was":"瓦紹文","wen":"索布諸語言","wo":"沃爾夫文","xal":"卡爾梅克文","xh":"科薩文","xog":"索加文","yao":"瑤文","yap":"雅浦文","yav":"洋卞文","ybb":"耶姆巴文","yi":"意第緒文","yo":"約魯巴文","ypk":"尤皮克諸語言","yue":"粵語","za":"壯文","zap":"薩波特克文","zbl":"布列斯符號","zen":"澤納加文","zh":"中文","zh-Hans":"簡體中文","zh-Hant":"繁體中文","znd":"贊德文","zu":"祖魯文","zun":"祖尼文","zxx":"無語言內容","zza":"扎扎文"}};

    rtl_data = {"af":false,"ar":true,"be":false,"bg":false,"bn":false,"ca":false,"cs":false,"cy":false,"da":false,"de":false,"el":false,"en":false,"en-GB":false,"es":false,"eu":false,"fa":true,"fi":false,"fil":false,"fr":false,"ga":false,"gl":false,"he":true,"hi":false,"hr":false,"hu":false,"id":false,"is":false,"it":false,"ja":false,"ko":false,"lv":false,"ms":false,"nb":false,"nl":false,"pl":false,"pt":false,"ro":false,"ru":false,"sk":false,"sq":false,"sr":false,"sv":false,"ta":false,"th":false,"tr":false,"uk":false,"ur":true,"vi":false,"zh":false,"zh-Hant":false};

    data_for_locale = function(locale) {
      var result;
      result = language_data[locale];
      if (result != null) {
        return result;
      } else {
        return null;
      }
    };

    code_for_language = function(language, locale) {
      var language_name, locale_code, locale_data, result;
      result = null;
      language = language.toLowerCase();
      locale_data = data_for_locale(locale);
      for (locale_code in locale_data) {
        language_name = locale_data[locale_code];
        if (language_name.toLowerCase() === language) {
          result = locale_code;
          break;
        }
      }
      return result;
    };

    Languages.all = function() {
      return data_for_locale("en");
    };

    Languages.all_for = function(locale) {
      return data_for_locale(locale);
    };

    Languages.from_code = function(code) {
      return this.from_code_for_locale(code, "en");
    };

    Languages.from_code_for_locale = function(code, locale) {
      var locale_data, result;
      locale_data = this.all_for(locale);
      if (locale_data == null) {
        return null;
      }
      result = locale_data[code];
      if (result != null) {
        return result;
      } else {
        return null;
      }
    };

    Languages.translate_language = function(language, source_locale, dest_locale) {
      var dest_locale_data, language_code;
      language_code = code_for_language(language, source_locale);
      dest_locale_data = this.all_for(dest_locale);
      if (language_code != null) {
        return dest_locale_data[language_code];
      } else {
        return null;
      }
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
      return this.regexp_str || (this.regexp_str = this.elements.map((function(element) {
        return element.to_regexp_str();
      }), this).join(""));
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
      this.tailoring_resource_data = {"en":{"en":{"segments":{"SentenceBreak":{"rules":[{"id":9,"value":"\\u0020\\u0028\\u0020\\u0024\\u0053\\u0054\\u0065\\u0072\\u006d\\u0020\\u007c\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0020\\u0029\\u0020\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u002a\\u0020\\u00f7\\u0020\\u0028\\u0020\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u0020\\u007c\\u0020\\u0024\\u0053\\u0070\\u0020\\u007c\\u0020\\u0024\\u0053\\u0065\\u0070\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0020\\u0029\\u0020"}]}}}}};
      this.exceptions_resource_data = {"de":{"de":{"exceptions":["Abs.","Abt.","Adr.","Chr.","Dipl.-Ing.","Dipl.-Kfm.","Dir.","Dtzd.","F.f.","Fa.","Fam.","Forts. f.","Fr.","Frl.","Gebr.","Ges.","Hbf.","Hptst.","Hr./Hrn.","Hrsg.","Ing.","Inh.","Kap.","Kfm.","Kl.","Mio.","Mrd.","Msp.","Nr.","Pfd.","Reg.-Bez.","St.","StR.","Str.","Verf.","Ztr.","a.D.","a.M.","a.Rh.","a.a.O.","a.a.S.","am.","amtl.","b.","beil.","d.J.","d.Ä.","e.V.","e.Wz.","e.h.","ehem.","eigtl.","einschl.","entspr.","erw.","ev.","evtl.","exkl.","frz.","geb.","gedr.","gek.","gesch.","gest.","ggf./ggfs.","hpts.","i.A.","i.B.","i.H.","i.J.","i.R.","i.V.","inkl.","jew.","jhrl.","k. u. k.","k.u.k.","kath.","kfm.","kgl.","led.","m.E.","m.W.","mtl.","möbl.","n.u.Z.","näml.","o.A.","o.B.","o.g.","od.","p.Adr.","r.","röm.","röm.-kath.","s.","s.a.","schles.","schweiz.","schwäb.","sog.","südd.","tägl.","u.","u.A.w.g.","u.U.","u.a.","u.v.a.","u.Ä.","u.ä.","v. H.","v.Chr.","v.H.","v.R.w.","v.T.","v.u.Z.","verh.","verw.","vgl.","z.","z.B.","z.Hd.","z.Z.","zzgl.","österr."]}},"en":{"en":{"exceptions":["A.","A.D.","A.M.","A.S.","AA.","AB.","AD.","Abs.","Act.","Adj.","Adv.","All.","Alt.","Approx.","As.","Aug.","B.","B.V.","By.","C.F.","C.O.D.","Cap.","Capt.","Card.","Col.","Comm.","Conn.","Cont.","D.","D.A.","D.C.","DC.","Dec.","Def.","Dept.","Diff.","Do.","E.","E.G.","E.g.","Ed.","Est.","Etc.","Ex.","Exec.","F.","Feb.","Fn.","Fri.","G.","Gb.","Go.","Hat.","Hon.B.A.","Hz.","I.","I.D.","I.T.","I.e.","Id.","In.","Is.","J.B.","J.D.","J.K.","Jam.","Jan.","Job.","Joe.","Jun.","K.","K.R.","Kb.","L.","L.A.","L.P.","Lev.","Lib.","Link.","Long.","Lt.","Lt.Cdr.","M.","M.I.T.","M.R.","M.T.","MR.","Maj.","Mar.","Mart.","Mb.","Md.","Mgr.","Min.","Misc.","Mr.","Mrs.","Ms.","Mt.","N.V.","N.Y.","Nov.","Nr.","Num.","O.","OK.","Ok.","On.","Op.","Or.","Org.","P.M.","P.O.","P.V.","PC.","PP.","Ph.D.","Phys.","Pro.","Prof.","Pvt.","Q.","R.L.","R.T.","Rep.","Rev.","S.","S.A.","S.A.R.","S.E.","S.p.A.","Sep.","Sept.","Sgt.","Sq.","T.","To.","U.","U.S.","U.S.A.","U.S.C.","Up.","VS.","Var.","X.","Yr.","Z.","a.m.","exec.","pp.","vs."]}},"es":{"es":{"exceptions":["AA.","Av.","Avda.","Col.","Corp.","Cía.","D.","Da.","Dr.","Dra.","Drs.","Dto.","Dª.","Dña.","Em.","Emm.","Exc.","Excma.","Excmas.","Excmo.","Excmos.","Exma.","Exmas.","Exmo.","Exmos.","FF.CC.","Fr.","Ilma.","Ilmas.","Ilmo.","Ilmos.","JJ.OO.","Lcda.","Lcdo.","Lda.","Ldo.","Lic.","Ltd.","Ltda.","Ltdo.","MM.","Mons.","Mr.","Mrs.","O.M.","PP.","R.D.","Rdo.","Rdos.","Reg.","Rev.","Rvdmo.","Rvdmos.","Rvdo.","Rvdos.","SS.AA.","SS.MM.","Sdad.","Sr.","Sra.","Sras.","Sres.","Srta.","Srtas.","Sta.","Sto.","Vda.","afma.","afmas.","afmo.","afmos.","bco.","bol.","c/c.","cap.","cf.","cfr.","col.","depto.","deptos.","doc.","dpto.","dptos.","dtor.","e.g.","ed.","ej.","fig.","figs.","fund.","hnos.","licda.","licdo.","ms.","mss.","mtro.","ntra.","ntro.","p.ej.","prof.","prov.","sras.","sres.","srs.","ss.","trad.","v.gr.","vid.","vs."]}},"fr":{"fr":{"exceptions":["M.","MM.","P.-D. G.","acoust.","adr.","anc.","ann.","anon.","append.","aux.","broch.","bull.","cam.","categ.","coll.","collab.","config.","dest.","dict.","dir.","doc.","encycl.","exempl.","fig.","gouv.","graph.","hôp.","ill.","illustr.","imm.","imprim.","indus.","niv.","quart.","réf.","symb.","synth.","syst.","trav. publ.","voit.","éd.","édit.","équiv.","éval."]}},"it":{"it":{"exceptions":["C.P.","Geom.","Ing.","N.B.","N.d.A.","N.d.E.","N.d.T.","O.d.G.","S.p.A.","Sig.","a.C.","ag.","all.","arch.","avv.","c.c.p.","d.C.","d.p.R.","div.","dott.","dr.","fig.","int.","mitt.","on.","p.","p.i.","pag.","rag.","sez.","tab.","tav.","ver.","vol."]}},"pt":{"pt":{"exceptions":["A.C.","Alm.","Av.","D.C","Dir.","Dr.","Dra.","Dras.","Drs.","E.","Est.","Exma.","Exmo.","Fr.","Ilma.","Ilmo.","Jr.","Ltd.","Ltda.","Mar.","N.Sra.","N.T.","Pe.","Ph.D.","R.","S.","S.A.","Sta.","Sto.","V.T.","W.C.","a.C.","a.m. ; A.M","abr.","abrev.","adm.","aer.","ago.","agric.","anat.","ap.","apart.","apt.","arit.","arqueol.","arquit.","astron.","autom.","aux.","biogr.","bras.","cap.","caps.","cat.","cel.","cf.","col.","com.","comp.","compl.","cont.","contab.","créd.","cx.","círc.","cód.","d.C.","des.","desc.","dez.","dipl.","dir.","div.","doc.","déb.","ed.","educ.","elem.","eletr.","eletrôn.","end.","eng.","esp.","ex.","f.","fac.","fasc.","fem.","fev.","ff.","fig.","fil.","filos.","fisiol.","fl.","fot.","fr.","fís.","geom.","gram.","gên.","hist.","ind.","ingl.","jan.","jul.","jun.","jur.","l.","lat.","lin.","lit.","liter.","long.","mai.","mar.","mat.","matem.","mov.","máq.","méd.","mús.","neol.","nov.","náut.","obs.","odont.","odontol.","org.","organiz.","out.","p.","p. ex.","p.m. ; P.M.","pal.","pol.","port.","pp.","pq.","prod.","prof.","profa.","pron.","próx.","psicol.","pág.","quím.","r.s.v.p.","ref.","rel.","relat.","rementente","rep.","res.","rod.","set.","sociol.","sup.","séc.","símb.","tec.","tecnol.","tel.","trad.","transp.","univ.","vol.","vs.","álg.","índ."]}},"ru":{"ru":{"exceptions":["кв.","отд.","проф.","руб.","тел.","тыс.","ул."]}}};
      this.root_resource = {"segments":{"GraphemeClusterBreak":{"rules":[{"id":3,"value":"\\u0020\\u0024\\u0043\\u0052\\u0020\\u00d7\\u0020\\u0024\\u004c\\u0046\\u0020"},{"id":4,"value":"\\u0020\\u0028\\u0020\\u0024\\u0043\\u006f\\u006e\\u0074\\u0072\\u006f\\u006c\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0020\\u0029\\u0020\\u00f7\\u0020"},{"id":5,"value":"\\u0020\\u00f7\\u0020\\u0028\\u0020\\u0024\\u0043\\u006f\\u006e\\u0074\\u0072\\u006f\\u006c\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0020\\u0029\\u0020"},{"id":6,"value":"\\u0020\\u0024\\u004c\\u0020\\u00d7\\u0020\\u0028\\u0020\\u0024\\u004c\\u0020\\u007c\\u0020\\u0024\\u0056\\u0020\\u007c\\u0020\\u0024\\u004c\\u0056\\u0020\\u007c\\u0020\\u0024\\u004c\\u0056\\u0054\\u0020\\u0029\\u0020"},{"id":7,"value":"\\u0020\\u0028\\u0020\\u0024\\u004c\\u0056\\u0020\\u007c\\u0020\\u0024\\u0056\\u0020\\u0029\\u0020\\u00d7\\u0020\\u0028\\u0020\\u0024\\u0056\\u0020\\u007c\\u0020\\u0024\\u0054\\u0020\\u0029\\u0020"},{"id":8,"value":"\\u0020\\u0028\\u0020\\u0024\\u004c\\u0056\\u0054\\u0020\\u007c\\u0020\\u0024\\u0054\\u0029\\u0020\\u00d7\\u0020\\u0024\\u0054\\u0020"},{"id":"8.1","value":"\\u0020\\u0024\\u0052\\u0065\\u0067\\u0069\\u006f\\u006e\\u0061\\u006c\\u005f\\u0049\\u006e\\u0064\\u0069\\u0063\\u0061\\u0074\\u006f\\u0072\\u0020\\u00d7\\u0020\\u0024\\u0052\\u0065\\u0067\\u0069\\u006f\\u006e\\u0061\\u006c\\u005f\\u0049\\u006e\\u0064\\u0069\\u0063\\u0061\\u0074\\u006f\\u0072\\u0020"},{"id":9,"value":"\\u0020\\u00d7\\u0020\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u0020"},{"id":"9.1","value":"\\u0020\\u00d7\\u0020\\u0024\\u0053\\u0070\\u0061\\u0063\\u0069\\u006e\\u0067\\u004d\\u0061\\u0072\\u006b\\u0020"}],"variables":[{"id":"$CR","value":"\\p{Grapheme_Cluster_Break=CR}"},{"id":"$LF","value":"\\p{Grapheme_Cluster_Break=LF}"},{"id":"$Control","value":"\\p{Grapheme_Cluster_Break=Control}"},{"id":"$Extend","value":"\\p{Grapheme_Cluster_Break=Extend}"},{"id":"$SpacingMark","value":"\\p{Grapheme_Cluster_Break=SpacingMark}"},{"id":"$L","value":"\\p{Grapheme_Cluster_Break=L}"},{"id":"$V","value":"\\p{Grapheme_Cluster_Break=V}"},{"id":"$T","value":"\\p{Grapheme_Cluster_Break=T}"},{"id":"$LV","value":"\\p{Grapheme_Cluster_Break=LV}"},{"id":"$LVT","value":"\\p{Grapheme_Cluster_Break=LVT}"},{"id":"$Regional_Indicator","value":"\\p{Grapheme_Cluster_Break=Regional_Indicator}"}]},"LineBreak":{"rules":[{"id":4,"value":"\\u0020\\u0024\\u0042\\u004b\\u0020\\u00f7\\u0020"},{"id":"5.01","value":"\\u0020\\u0024\\u0043\\u0052\\u0020\\u00d7\\u0020\\u0024\\u004c\\u0046\\u0020"},{"id":"5.02","value":"\\u0020\\u0024\\u0043\\u0052\\u0020\\u00f7\\u0020"},{"id":"5.03","value":"\\u0020\\u0024\\u004c\\u0046\\u0020\\u00f7\\u0020"},{"id":"5.04","value":"\\u0020\\u0024\\u004e\\u004c\\u0020\\u00f7\\u0020"},{"id":6,"value":"\\u0020\\u00d7\\u0020\\u0028\\u0020\\u0024\\u0042\\u004b\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0020\\u007c\\u0020\\u0024\\u004e\\u004c\\u0020\\u0029\\u0020"},{"id":"7.01","value":"\\u0020\\u00d7\\u0020\\u0024\\u0053\\u0050\\u0020"},{"id":"7.02","value":"\\u0020\\u00d7\\u0020\\u0024\\u005a\\u0057\\u0020"},{"id":8,"value":"\\u0020\\u0024\\u005a\\u0057\\u0020\\u0024\\u0053\\u0050\\u002a\\u0020\\u00f7\\u0020"},{"id":9,"value":"\\u0020\\u0024\\u0053\\u0070\\u0065\\u0063\\u0032\\u005f\\u0020\\u00d7\\u0020\\u0024\\u0043\\u004d\\u0020"},{"id":"11.01","value":"\\u0020\\u00d7\\u0020\\u0024\\u0057\\u004a\\u0020"},{"id":"11.02","value":"\\u0020\\u0024\\u0057\\u004a\\u0020\\u00d7\\u0020"},{"id":12,"value":"\\u0020\\u0024\\u0047\\u004c\\u0020\\u00d7\\u0020"},{"id":"12.1","value":"\\u0020\\u0024\\u0053\\u0070\\u0065\\u0063\\u0033\\u0061\\u005f\\u0020\\u00d7\\u0020\\u0024\\u0047\\u004c\\u0020"},{"id":"12.2","value":"\\u0020\\u0024\\u0053\\u0070\\u0065\\u0063\\u0033\\u0062\\u005f\\u0020\\u0024\\u0043\\u004d\\u002b\\u0020\\u00d7\\u0020\\u0024\\u0047\\u004c\\u0020"},{"id":"12.3","value":"\\u0020\\u005e\\u0020\\u0024\\u0043\\u004d\\u002b\\u0020\\u00d7\\u0020\\u0024\\u0047\\u004c\\u0020"},{"id":"13.01","value":"\\u0020\\u00d7\\u0020\\u0024\\u0045\\u0058\\u0020"},{"id":"13.02","value":"\\u0020\\u0024\\u0053\\u0070\\u0065\\u0063\\u0034\\u005f\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0043\\u004c\\u0020\\u007c\\u0020\\u0024\\u0043\\u0050\\u0020\\u007c\\u0020\\u0024\\u0049\\u0053\\u0020\\u007c\\u0020\\u0024\\u0053\\u0059\\u0029\\u0020"},{"id":"13.03","value":"\\u0020\\u0024\\u0053\\u0070\\u0065\\u0063\\u0034\\u005f\\u0020\\u0024\\u0043\\u004d\\u002b\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0043\\u004c\\u0020\\u007c\\u0020\\u0024\\u0043\\u0050\\u0020\\u007c\\u0020\\u0024\\u0049\\u0053\\u0020\\u007c\\u0020\\u0024\\u0053\\u0059\\u0029\\u0020"},{"id":"13.04","value":"\\u0020\\u005e\\u0020\\u0024\\u0043\\u004d\\u002b\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0043\\u004c\\u0020\\u007c\\u0020\\u0024\\u0043\\u0050\\u0020\\u007c\\u0020\\u0024\\u0049\\u0053\\u0020\\u007c\\u0020\\u0024\\u0053\\u0059\\u0029\\u0020"},{"id":14,"value":"\\u0020\\u0024\\u004f\\u0050\\u0020\\u0024\\u0053\\u0050\\u002a\\u0020\\u00d7\\u0020"},{"id":15,"value":"\\u0020\\u0024\\u0051\\u0055\\u0020\\u0024\\u0053\\u0050\\u002a\\u0020\\u00d7\\u0020\\u0024\\u004f\\u0050\\u0020"},{"id":16,"value":"\\u0020\\u0028\\u0024\\u0043\\u004c\\u0020\\u007c\\u0020\\u0024\\u0043\\u0050\\u0029\\u0020\\u0024\\u0053\\u0050\\u002a\\u0020\\u00d7\\u0020\\u0024\\u004e\\u0053\\u0020"},{"id":17,"value":"\\u0020\\u0024\\u0042\\u0032\\u0020\\u0024\\u0053\\u0050\\u002a\\u0020\\u00d7\\u0020\\u0024\\u0042\\u0032\\u0020"},{"id":18,"value":"\\u0020\\u0024\\u0053\\u0050\\u0020\\u00f7\\u0020"},{"id":"19.01","value":"\\u0020\\u00d7\\u0020\\u0024\\u0051\\u0055\\u0020"},{"id":"19.02","value":"\\u0020\\u0024\\u0051\\u0055\\u0020\\u00d7\\u0020"},{"id":"20.01","value":"\\u0020\\u00f7\\u0020\\u0024\\u0043\\u0042\\u0020"},{"id":"20.02","value":"\\u0020\\u0024\\u0043\\u0042\\u0020\\u00f7\\u0020"},{"id":"21.01","value":"\\u0020\\u00d7\\u0020\\u0024\\u0042\\u0041\\u0020"},{"id":"21.02","value":"\\u0020\\u00d7\\u0020\\u0024\\u0048\\u0059\\u0020"},{"id":"21.03","value":"\\u0020\\u00d7\\u0020\\u0024\\u004e\\u0053\\u0020"},{"id":"21.04","value":"\\u0020\\u0024\\u0042\\u0042\\u0020\\u00d7\\u0020"},{"id":"21.1","value":"\\u0020\\u0024\\u0048\\u004c\\u0020\\u0028\\u0024\\u0048\\u0059\\u0020\\u007c\\u0020\\u0024\\u0042\\u0041\\u0029\\u0020\\u00d7\\u0020"},{"id":"22.01","value":"\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0029\\u0020\\u00d7\\u0020\\u0024\\u0049\\u004e\\u0020"},{"id":"22.02","value":"\\u0020\\u0024\\u0049\\u0044\\u0020\\u00d7\\u0020\\u0024\\u0049\\u004e\\u0020"},{"id":"22.03","value":"\\u0020\\u0024\\u0049\\u004e\\u0020\\u00d7\\u0020\\u0024\\u0049\\u004e\\u0020"},{"id":"22.04","value":"\\u0020\\u0024\\u004e\\u0055\\u0020\\u00d7\\u0020\\u0024\\u0049\\u004e\\u0020"},{"id":"23.01","value":"\\u0020\\u0024\\u0049\\u0044\\u0020\\u00d7\\u0020\\u0024\\u0050\\u004f\\u0020"},{"id":"23.02","value":"\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0029\\u0020\\u00d7\\u0020\\u0024\\u004e\\u0055\\u0020"},{"id":"23.03","value":"\\u0020\\u0024\\u004e\\u0055\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0029\\u0020"},{"id":"24.01","value":"\\u0020\\u0024\\u0050\\u0052\\u0020\\u00d7\\u0020\\u0024\\u0049\\u0044\\u0020"},{"id":"24.02","value":"\\u0020\\u0024\\u0050\\u0052\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0029\\u0020"},{"id":"24.03","value":"\\u0020\\u0024\\u0050\\u004f\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0029\\u0020"},{"id":"25.01","value":"\\u0020\\u0028\\u0024\\u0050\\u0052\\u0020\\u007c\\u0020\\u0024\\u0050\\u004f\\u0029\\u0020\\u00d7\\u0020\\u0028\\u0020\\u0024\\u004f\\u0050\\u0020\\u007c\\u0020\\u0024\\u0048\\u0059\\u0020\\u0029\\u003f\\u0020\\u0024\\u004e\\u0055\\u0020"},{"id":"25.02","value":"\\u0020\\u0028\\u0020\\u0024\\u004f\\u0050\\u0020\\u007c\\u0020\\u0024\\u0048\\u0059\\u0020\\u0029\\u0020\\u00d7\\u0020\\u0024\\u004e\\u0055\\u0020"},{"id":"25.03","value":"\\u0020\\u0024\\u004e\\u0055\\u0020\\u00d7\\u0020\\u0028\\u0024\\u004e\\u0055\\u0020\\u007c\\u0020\\u0024\\u0053\\u0059\\u0020\\u007c\\u0020\\u0024\\u0049\\u0053\\u0029\\u0020"},{"id":"25.04","value":"\\u0020\\u0024\\u004e\\u0055\\u0020\\u0028\\u0024\\u004e\\u0055\\u0020\\u007c\\u0020\\u0024\\u0053\\u0059\\u0020\\u007c\\u0020\\u0024\\u0049\\u0053\\u0029\\u002a\\u0020\\u00d7\\u0020\\u0028\\u0024\\u004e\\u0055\\u0020\\u007c\\u0020\\u0024\\u0053\\u0059\\u0020\\u007c\\u0020\\u0024\\u0049\\u0053\\u0020\\u007c\\u0020\\u0024\\u0043\\u004c\\u0020\\u007c\\u0020\\u0024\\u0043\\u0050\\u0029\\u0020"},{"id":"25.05","value":"\\u0020\\u0024\\u004e\\u0055\\u0020\\u0028\\u0024\\u004e\\u0055\\u0020\\u007c\\u0020\\u0024\\u0053\\u0059\\u0020\\u007c\\u0020\\u0024\\u0049\\u0053\\u0029\\u002a\\u0020\\u0028\\u0024\\u0043\\u004c\\u0020\\u007c\\u0020\\u0024\\u0043\\u0050\\u0029\\u003f\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0050\\u004f\\u0020\\u007c\\u0020\\u0024\\u0050\\u0052\\u0029\\u0020"},{"id":"26.01","value":"\\u0020\\u0024\\u004a\\u004c\\u0020\\u00d7\\u0020\\u0024\\u004a\\u004c\\u0020\\u007c\\u0020\\u0024\\u004a\\u0056\\u0020\\u007c\\u0020\\u0024\\u0048\\u0032\\u0020\\u007c\\u0020\\u0024\\u0048\\u0033\\u0020"},{"id":"26.02","value":"\\u0020\\u0024\\u004a\\u0056\\u0020\\u007c\\u0020\\u0024\\u0048\\u0032\\u0020\\u00d7\\u0020\\u0024\\u004a\\u0056\\u0020\\u007c\\u0020\\u0024\\u004a\\u0054\\u0020"},{"id":"26.03","value":"\\u0020\\u0024\\u004a\\u0054\\u0020\\u007c\\u0020\\u0024\\u0048\\u0033\\u0020\\u00d7\\u0020\\u0024\\u004a\\u0054\\u0020"},{"id":"27.01","value":"\\u0020\\u0024\\u004a\\u004c\\u0020\\u007c\\u0020\\u0024\\u004a\\u0056\\u0020\\u007c\\u0020\\u0024\\u004a\\u0054\\u0020\\u007c\\u0020\\u0024\\u0048\\u0032\\u0020\\u007c\\u0020\\u0024\\u0048\\u0033\\u0020\\u00d7\\u0020\\u0024\\u0049\\u004e\\u0020"},{"id":"27.02","value":"\\u0020\\u0024\\u004a\\u004c\\u0020\\u007c\\u0020\\u0024\\u004a\\u0056\\u0020\\u007c\\u0020\\u0024\\u004a\\u0054\\u0020\\u007c\\u0020\\u0024\\u0048\\u0032\\u0020\\u007c\\u0020\\u0024\\u0048\\u0033\\u0020\\u00d7\\u0020\\u0024\\u0050\\u004f\\u0020"},{"id":"27.03","value":"\\u0020\\u0024\\u0050\\u0052\\u0020\\u00d7\\u0020\\u0024\\u004a\\u004c\\u0020\\u007c\\u0020\\u0024\\u004a\\u0056\\u0020\\u007c\\u0020\\u0024\\u004a\\u0054\\u0020\\u007c\\u0020\\u0024\\u0048\\u0032\\u0020\\u007c\\u0020\\u0024\\u0048\\u0033\\u0020"},{"id":28,"value":"\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0029\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0029\\u0020"},{"id":29,"value":"\\u0020\\u0024\\u0049\\u0053\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0029\\u0020"},{"id":"30.01","value":"\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0020\\u007c\\u0020\\u0024\\u004e\\u0055\\u0029\\u0020\\u00d7\\u0020\\u0024\\u004f\\u0050\\u0020"},{"id":"30.02","value":"\\u0020\\u0024\\u0043\\u0050\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u0024\\u0048\\u004c\\u0020\\u007c\\u0020\\u0024\\u004e\\u0055\\u0029\\u0020"},{"id":"30.11","value":"\\u0020\\u0024\\u0052\\u0049\\u0020\\u00d7\\u0020\\u0024\\u0052\\u0049\\u0020"}],"variables":[{"id":"$AI","value":"\\p{Line_Break=Ambiguous}"},{"id":"$AL","value":"\\p{Line_Break=Alphabetic}"},{"id":"$B2","value":"\\p{Line_Break=Break_Both}"},{"id":"$BA","value":"\\p{Line_Break=Break_After}"},{"id":"$BB","value":"\\p{Line_Break=Break_Before}"},{"id":"$BK","value":"\\p{Line_Break=Mandatory_Break}"},{"id":"$CB","value":"\\p{Line_Break=Contingent_Break}"},{"id":"$CL","value":"\\p{Line_Break=Close_Punctuation}"},{"id":"$CP","value":"\\p{Line_Break=CP}"},{"id":"$CM","value":"\\p{Line_Break=Combining_Mark}"},{"id":"$CR","value":"\\p{Line_Break=Carriage_Return}"},{"id":"$EX","value":"\\p{Line_Break=Exclamation}"},{"id":"$GL","value":"\\p{Line_Break=Glue}"},{"id":"$H2","value":"\\p{Line_Break=H2}"},{"id":"$H3","value":"\\p{Line_Break=H3}"},{"id":"$HL","value":"\\p{Line_Break=HL}"},{"id":"$HY","value":"\\p{Line_Break=Hyphen}"},{"id":"$ID","value":"\\p{Line_Break=Ideographic}"},{"id":"$IN","value":"\\p{Line_Break=Inseparable}"},{"id":"$IS","value":"\\p{Line_Break=Infix_Numeric}"},{"id":"$JL","value":"\\p{Line_Break=JL}"},{"id":"$JT","value":"\\p{Line_Break=JT}"},{"id":"$JV","value":"\\p{Line_Break=JV}"},{"id":"$LF","value":"\\p{Line_Break=Line_Feed}"},{"id":"$NL","value":"\\p{Line_Break=Next_Line}"},{"id":"$NS","value":"\\p{Line_Break=Nonstarter}"},{"id":"$NU","value":"\\p{Line_Break=Numeric}"},{"id":"$OP","value":"\\p{Line_Break=Open_Punctuation}"},{"id":"$PO","value":"\\p{Line_Break=Postfix_Numeric}"},{"id":"$PR","value":"\\p{Line_Break=Prefix_Numeric}"},{"id":"$QU","value":"\\p{Line_Break=Quotation}"},{"id":"$SA","value":"\\p{Line_Break=Complex_Context}"},{"id":"$SG","value":"\\p{Line_Break=Surrogate}"},{"id":"$SP","value":"\\p{Line_Break=Space}"},{"id":"$SY","value":"\\p{Line_Break=Break_Symbols}"},{"id":"$WJ","value":"\\p{Line_Break=Word_Joiner}"},{"id":"$XX","value":"\\p{Line_Break=Unknown}"},{"id":"$ZW","value":"\\p{Line_Break=ZWSpace}"},{"id":"$CJ","value":"\\p{Line_Break=Conditional_Japanese_Starter}"},{"id":"$RI","value":"\\p{Line_Break=Regional_Indicator}"},{"id":"$AL","value":"\\u005b\\u0024\\u0041\\u0049\\u0020\\u0024\\u0041\\u004c\\u0020\\u0024\\u0058\\u0058\\u0020\\u0024\\u0053\\u0041\\u0020\\u0024\\u0053\\u0047\\u005d"},{"id":"$NS","value":"\\u005b\\u0024\\u004e\\u0053\\u0020\\u0024\\u0043\\u004a\\u005d"},{"id":"$X","value":"\\u0024\\u0043\\u004d\\u002a"},{"id":"$Spec1_","value":"\\u005b\\u0024\\u0053\\u0050\\u0020\\u0024\\u0042\\u004b\\u0020\\u0024\\u0043\\u0052\\u0020\\u0024\\u004c\\u0046\\u0020\\u0024\\u004e\\u004c\\u0020\\u0024\\u005a\\u0057\\u005d"},{"id":"$Spec2_","value":"\\u005b\\u005e\\u0020\\u0024\\u0053\\u0050\\u0020\\u0024\\u0042\\u004b\\u0020\\u0024\\u0043\\u0052\\u0020\\u0024\\u004c\\u0046\\u0020\\u0024\\u004e\\u004c\\u0020\\u0024\\u005a\\u0057\\u005d"},{"id":"$Spec3a_","value":"\\u005b\\u005e\\u0020\\u0024\\u0053\\u0050\\u0020\\u0024\\u0042\\u0041\\u0020\\u0024\\u0048\\u0059\\u0020\\u0024\\u0043\\u004d\\u005d"},{"id":"$Spec3b_","value":"\\u005b\\u005e\\u0020\\u0024\\u0042\\u0041\\u0020\\u0024\\u0048\\u0059\\u0020\\u0024\\u0043\\u004d\\u005d"},{"id":"$Spec4_","value":"\\u005b\\u005e\\u0020\\u0024\\u004e\\u0055\\u0020\\u0024\\u0043\\u004d\\u005d"},{"id":"$AI","value":"\\u0028\\u0024\\u0041\\u0049\\u0020\\u0024\\u0058\\u0029"},{"id":"$AL","value":"\\u0028\\u0024\\u0041\\u004c\\u0020\\u0024\\u0058\\u0029"},{"id":"$B2","value":"\\u0028\\u0024\\u0042\\u0032\\u0020\\u0024\\u0058\\u0029"},{"id":"$BA","value":"\\u0028\\u0024\\u0042\\u0041\\u0020\\u0024\\u0058\\u0029"},{"id":"$BB","value":"\\u0028\\u0024\\u0042\\u0042\\u0020\\u0024\\u0058\\u0029"},{"id":"$CB","value":"\\u0028\\u0024\\u0043\\u0042\\u0020\\u0024\\u0058\\u0029"},{"id":"$CL","value":"\\u0028\\u0024\\u0043\\u004c\\u0020\\u0024\\u0058\\u0029"},{"id":"$CP","value":"\\u0028\\u0024\\u0043\\u0050\\u0020\\u0024\\u0058\\u0029"},{"id":"$CM","value":"\\u0028\\u0024\\u0043\\u004d\\u0020\\u0024\\u0058\\u0029"},{"id":"$CM","value":"\\u0028\\u0024\\u0043\\u004d\\u0020\\u0024\\u0058\\u0029"},{"id":"$GL","value":"\\u0028\\u0024\\u0047\\u004c\\u0020\\u0024\\u0058\\u0029"},{"id":"$H2","value":"\\u0028\\u0024\\u0048\\u0032\\u0020\\u0024\\u0058\\u0029"},{"id":"$H3","value":"\\u0028\\u0024\\u0048\\u0033\\u0020\\u0024\\u0058\\u0029"},{"id":"$HL","value":"\\u0028\\u0024\\u0048\\u004c\\u0020\\u0024\\u0058\\u0029"},{"id":"$HY","value":"\\u0028\\u0024\\u0048\\u0059\\u0020\\u0024\\u0058\\u0029"},{"id":"$ID","value":"\\u0028\\u0024\\u0049\\u0044\\u0020\\u0024\\u0058\\u0029"},{"id":"$IN","value":"\\u0028\\u0024\\u0049\\u004e\\u0020\\u0024\\u0058\\u0029"},{"id":"$IS","value":"\\u0028\\u0024\\u0049\\u0053\\u0020\\u0024\\u0058\\u0029"},{"id":"$JL","value":"\\u0028\\u0024\\u004a\\u004c\\u0020\\u0024\\u0058\\u0029"},{"id":"$JT","value":"\\u0028\\u0024\\u004a\\u0054\\u0020\\u0024\\u0058\\u0029"},{"id":"$JV","value":"\\u0028\\u0024\\u004a\\u0056\\u0020\\u0024\\u0058\\u0029"},{"id":"$NS","value":"\\u0028\\u0024\\u004e\\u0053\\u0020\\u0024\\u0058\\u0029"},{"id":"$NU","value":"\\u0028\\u0024\\u004e\\u0055\\u0020\\u0024\\u0058\\u0029"},{"id":"$OP","value":"\\u0028\\u0024\\u004f\\u0050\\u0020\\u0024\\u0058\\u0029"},{"id":"$PO","value":"\\u0028\\u0024\\u0050\\u004f\\u0020\\u0024\\u0058\\u0029"},{"id":"$PR","value":"\\u0028\\u0024\\u0050\\u0052\\u0020\\u0024\\u0058\\u0029"},{"id":"$QU","value":"\\u0028\\u0024\\u0051\\u0055\\u0020\\u0024\\u0058\\u0029"},{"id":"$SA","value":"\\u0028\\u0024\\u0053\\u0041\\u0020\\u0024\\u0058\\u0029"},{"id":"$SG","value":"\\u0028\\u0024\\u0053\\u0047\\u0020\\u0024\\u0058\\u0029"},{"id":"$SY","value":"\\u0028\\u0024\\u0053\\u0059\\u0020\\u0024\\u0058\\u0029"},{"id":"$WJ","value":"\\u0028\\u0024\\u0057\\u004a\\u0020\\u0024\\u0058\\u0029"},{"id":"$XX","value":"\\u0028\\u0024\\u0058\\u0058\\u0020\\u0024\\u0058\\u0029"},{"id":"$RI","value":"\\u0028\\u0024\\u0052\\u0049\\u0020\\u0024\\u0058\\u0029"},{"id":"$AL","value":"\\u0028\\u0024\\u0041\\u004c\\u0020\\u007c\\u0020\\u005e\\u0020\\u0024\\u0043\\u004d\\u0020\\u007c\\u0020\\u0028\\u003f\\u003c\\u003d\\u0024\\u0053\\u0070\\u0065\\u0063\\u0031\\u005f\\u0029\\u0020\\u0024\\u0043\\u004d\\u0029"}]},"SentenceBreak":{"rules":[{"id":3,"value":"\\u0020\\u0024\\u0043\\u0052\\u0020\\u00d7\\u0020\\u0024\\u004c\\u0046\\u0020"},{"id":4,"value":"\\u0020\\u0028\\u0024\\u0053\\u0065\\u0070\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0029\\u0020\\u00f7\\u0020"},{"id":5,"value":"\\u0020\\u00d7\\u0020\\u005b\\u0024\\u0046\\u006f\\u0072\\u006d\\u0061\\u0074\\u0020\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u005d\\u0020"},{"id":6,"value":"\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0020\\u00d7\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020"},{"id":7,"value":"\\u0020\\u0024\\u0055\\u0070\\u0070\\u0065\\u0072\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0020\\u00d7\\u0020\\u0024\\u0055\\u0070\\u0070\\u0065\\u0072\\u0020"},{"id":8,"value":"\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0020\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u002a\\u0020\\u0024\\u0053\\u0070\\u002a\\u0020\\u00d7\\u0020\\u0024\\u004e\\u006f\\u0074\\u0050\\u0072\\u0065\\u004c\\u006f\\u0077\\u0065\\u0072\\u005f\\u002a\\u0020\\u0024\\u004c\\u006f\\u0077\\u0065\\u0072\\u0020"},{"id":"8.1","value":"\\u0020\\u0028\\u0024\\u0053\\u0054\\u0065\\u0072\\u006d\\u0020\\u007c\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0029\\u0020\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u002a\\u0020\\u0024\\u0053\\u0070\\u002a\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0053\\u0043\\u006f\\u006e\\u0074\\u0069\\u006e\\u0075\\u0065\\u0020\\u007c\\u0020\\u0024\\u0053\\u0054\\u0065\\u0072\\u006d\\u0020\\u007c\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0029\\u0020"},{"id":9,"value":"\\u0020\\u0028\\u0020\\u0024\\u0053\\u0054\\u0065\\u0072\\u006d\\u0020\\u007c\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0020\\u0029\\u0020\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u002a\\u0020\\u00d7\\u0020\\u0028\\u0020\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u0020\\u007c\\u0020\\u0024\\u0053\\u0070\\u0020\\u007c\\u0020\\u0024\\u0053\\u0065\\u0070\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0020\\u0029\\u0020"},{"id":10,"value":"\\u0020\\u0028\\u0020\\u0024\\u0053\\u0054\\u0065\\u0072\\u006d\\u0020\\u007c\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0020\\u0029\\u0020\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u002a\\u0020\\u0024\\u0053\\u0070\\u002a\\u0020\\u00d7\\u0020\\u0028\\u0020\\u0024\\u0053\\u0070\\u0020\\u007c\\u0020\\u0024\\u0053\\u0065\\u0070\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0020\\u0029\\u0020"},{"id":11,"value":"\\u0020\\u0028\\u0020\\u0024\\u0053\\u0054\\u0065\\u0072\\u006d\\u0020\\u007c\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0020\\u0029\\u0020\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u002a\\u0020\\u0024\\u0053\\u0070\\u002a\\u0020\\u0028\\u0024\\u0053\\u0065\\u0070\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0029\\u003f\\u0020\\u00f7\\u0020"},{"id":12,"value":"\\u0020\\u00d7\\u0020\\u0024\\u0041\\u006e\\u0079\\u0020"}],"variables":[{"id":"$CR","value":"\\p{Sentence_Break=CR}"},{"id":"$LF","value":"\\p{Sentence_Break=LF}"},{"id":"$Extend","value":"\\p{Sentence_Break=Extend}"},{"id":"$Format","value":"\\p{Sentence_Break=Format}"},{"id":"$Sep","value":"\\p{Sentence_Break=Sep}"},{"id":"$Sp","value":"\\p{Sentence_Break=Sp}"},{"id":"$Lower","value":"\\p{Sentence_Break=Lower}"},{"id":"$Upper","value":"\\p{Sentence_Break=Upper}"},{"id":"$OLetter","value":"\\p{Sentence_Break=OLetter}"},{"id":"$Numeric","value":"\\p{Sentence_Break=Numeric}"},{"id":"$ATerm","value":"\\p{Sentence_Break=ATerm}"},{"id":"$STerm","value":"\\p{Sentence_Break=STerm}"},{"id":"$Close","value":"\\p{Sentence_Break=Close}"},{"id":"$SContinue","value":"\\p{Sentence_Break=SContinue}"},{"id":"$Any","value":"\\u002e"},{"id":"$FE","value":"\\u005b\\u0024\\u0046\\u006f\\u0072\\u006d\\u0061\\u0074\\u0020\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u005d"},{"id":"$NotPreLower_","value":"\\u005b\\u005e\\u0020\\u0024\\u004f\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u0024\\u0055\\u0070\\u0070\\u0065\\u0072\\u0020\\u0024\\u004c\\u006f\\u0077\\u0065\\u0072\\u0020\\u0024\\u0053\\u0065\\u0070\\u0020\\u0024\\u0043\\u0052\\u0020\\u0024\\u004c\\u0046\\u0020\\u0024\\u0053\\u0054\\u0065\\u0072\\u006d\\u0020\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u005d"},{"id":"$Sp","value":"\\u0028\\u0024\\u0053\\u0070\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$Lower","value":"\\u0028\\u0024\\u004c\\u006f\\u0077\\u0065\\u0072\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$Upper","value":"\\u0028\\u0024\\u0055\\u0070\\u0070\\u0065\\u0072\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$OLetter","value":"\\u0028\\u0024\\u004f\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$Numeric","value":"\\u0028\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$ATerm","value":"\\u0028\\u0024\\u0041\\u0054\\u0065\\u0072\\u006d\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$STerm","value":"\\u0028\\u0024\\u0053\\u0054\\u0065\\u0072\\u006d\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$Close","value":"\\u0028\\u0024\\u0043\\u006c\\u006f\\u0073\\u0065\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$SContinue","value":"\\u0028\\u0024\\u0053\\u0043\\u006f\\u006e\\u0074\\u0069\\u006e\\u0075\\u0065\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"}]},"WordBreak":{"rules":[{"id":3,"value":"\\u0020\\u0024\\u0043\\u0052\\u0020\\u00d7\\u0020\\u0024\\u004c\\u0046\\u0020"},{"id":"3.1","value":"\\u0020\\u0028\\u0024\\u004e\\u0065\\u0077\\u006c\\u0069\\u006e\\u0065\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0029\\u0020\\u00f7\\u0020"},{"id":"3.2","value":"\\u0020\\u00f7\\u0020\\u0028\\u0024\\u004e\\u0065\\u0077\\u006c\\u0069\\u006e\\u0065\\u0020\\u007c\\u0020\\u0024\\u0043\\u0052\\u0020\\u007c\\u0020\\u0024\\u004c\\u0046\\u0029\\u0020"},{"id":4,"value":"\\u0020\\u0024\\u004e\\u006f\\u0074\\u0042\\u0072\\u0065\\u0061\\u006b\\u005f\\u0020\\u00d7\\u0020\\u005b\\u0024\\u0046\\u006f\\u0072\\u006d\\u0061\\u0074\\u0020\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u005d\\u0020"},{"id":5,"value":"\\u0020\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u00d7\\u0020\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020"},{"id":6,"value":"\\u0020\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u00d7\\u0020\\u0028\\u0024\\u004d\\u0069\\u0064\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u007c\\u0020\\u0024\\u004d\\u0069\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0029\\u0020\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020"},{"id":7,"value":"\\u0020\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u0028\\u0024\\u004d\\u0069\\u0064\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u007c\\u0020\\u0024\\u004d\\u0069\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0029\\u0020\\u00d7\\u0020\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020"},{"id":8,"value":"\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020\\u00d7\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020"},{"id":9,"value":"\\u0020\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u00d7\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020"},{"id":10,"value":"\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020\\u00d7\\u0020\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020"},{"id":11,"value":"\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020\\u0028\\u0024\\u004d\\u0069\\u0064\\u004e\\u0075\\u006d\\u0020\\u007c\\u0020\\u0024\\u004d\\u0069\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0029\\u0020\\u00d7\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020"},{"id":12,"value":"\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020\\u00d7\\u0020\\u0028\\u0024\\u004d\\u0069\\u0064\\u004e\\u0075\\u006d\\u0020\\u007c\\u0020\\u0024\\u004d\\u0069\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0029\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020"},{"id":13,"value":"\\u0020\\u0024\\u004b\\u0061\\u0074\\u0061\\u006b\\u0061\\u006e\\u0061\\u0020\\u00d7\\u0020\\u0024\\u004b\\u0061\\u0074\\u0061\\u006b\\u0061\\u006e\\u0061\\u0020"},{"id":"13.1","value":"\\u0020\\u0028\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u007c\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020\\u007c\\u0020\\u0024\\u004b\\u0061\\u0074\\u0061\\u006b\\u0061\\u006e\\u0061\\u0020\\u007c\\u0020\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0029\\u0020\\u00d7\\u0020\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0020"},{"id":"13.2","value":"\\u0020\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0020\\u00d7\\u0020\\u0028\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u007c\\u0020\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020\\u007c\\u0020\\u0024\\u004b\\u0061\\u0074\\u0061\\u006b\\u0061\\u006e\\u0061\\u0029\\u0020"},{"id":"13.3","value":"\\u0020\\u0024\\u0052\\u0065\\u0067\\u0069\\u006f\\u006e\\u0061\\u006c\\u005f\\u0049\\u006e\\u0064\\u0069\\u0063\\u0061\\u0074\\u006f\\u0072\\u0020\\u00d7\\u0020\\u0024\\u0052\\u0065\\u0067\\u0069\\u006f\\u006e\\u0061\\u006c\\u005f\\u0049\\u006e\\u0064\\u0069\\u0063\\u0061\\u0074\\u006f\\u0072\\u0020"}],"variables":[{"id":"$CR","value":"\\p{Word_Break=CR}"},{"id":"$LF","value":"\\p{Word_Break=LF}"},{"id":"$Newline","value":"\\p{Word_Break=Newline}"},{"id":"$Extend","value":"\\p{Word_Break=Extend}"},{"id":"$Format","value":"\\p{Word_Break=Format}"},{"id":"$Katakana","value":"\\p{Word_Break=Katakana}"},{"id":"$ALetter","value":"\\p{Word_Break=ALetter}"},{"id":"$MidLetter","value":"\\p{Word_Break=MidLetter}"},{"id":"$MidNum","value":"\\p{Word_Break=MidNum}"},{"id":"$MidNumLet","value":"\\p{Word_Break=MidNumLet}"},{"id":"$Numeric","value":"\\p{Word_Break=Numeric}"},{"id":"$ExtendNumLet","value":"\\p{Word_Break=ExtendNumLet}"},{"id":"$Regional_Indicator","value":"\\p{Word_Break=Regional_Indicator}"},{"id":"$FE","value":"\\u005b\\u0024\\u0046\\u006f\\u0072\\u006d\\u0061\\u0074\\u0020\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u005d"},{"id":"$NotBreak_","value":"\\u005b\\u005e\\u0020\\u0024\\u004e\\u0065\\u0077\\u006c\\u0069\\u006e\\u0065\\u0020\\u0024\\u0043\\u0052\\u0020\\u0024\\u004c\\u0046\\u0020\\u005d"},{"id":"$Katakana","value":"\\u0028\\u0024\\u004b\\u0061\\u0074\\u0061\\u006b\\u0061\\u006e\\u0061\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$ALetter","value":"\\u0028\\u0024\\u0041\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$MidLetter","value":"\\u0028\\u0024\\u004d\\u0069\\u0064\\u004c\\u0065\\u0074\\u0074\\u0065\\u0072\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$MidNum","value":"\\u0028\\u0024\\u004d\\u0069\\u0064\\u004e\\u0075\\u006d\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$MidNumLet","value":"\\u0028\\u0024\\u004d\\u0069\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$Numeric","value":"\\u0028\\u0024\\u004e\\u0075\\u006d\\u0065\\u0072\\u0069\\u0063\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$ExtendNumLet","value":"\\u0028\\u0024\\u0045\\u0078\\u0074\\u0065\\u006e\\u0064\\u004e\\u0075\\u006d\\u004c\\u0065\\u0074\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"},{"id":"$Regional_Indicator","value":"\\u0028\\u0024\\u0052\\u0065\\u0067\\u0069\\u006f\\u006e\\u0061\\u006c\\u005f\\u0049\\u006e\\u0064\\u0069\\u0063\\u0061\\u0074\\u006f\\u0072\\u0020\\u0024\\u0046\\u0045\\u002a\\u0029"}]}}};
      this.unescape_resource(this.tailoring_resource_data);
      this.unescape_resource(this.root_resource);
    }

    BreakIterator.prototype.unescape_resource = function(resource) {
      var element, k, v, _i, _len;
      if (resource instanceof Array) {
        for (_i = 0, _len = resource.length; _i < _len; _i++) {
          element = resource[_i];
          if (element instanceof Array || element instanceof Object) {
            this.unescape_resource(element);
          }
        }
      } else if (resource instanceof Object) {
        for (k in resource) {
          v = resource[k];
          if ((typeof v === 'string' || v instanceof String) && k === "value") {
            resource[k] = this.unescape_string(v);
          } else if (v instanceof Array || v instanceof Object) {
            this.unescape_resource(v);
          }
        }
      }
    };

    BreakIterator.prototype.unescape_string = function(str) {
      return str.replace(/\\u([a-fA-F0-9]{4})/gi, function(g, m1) {
        return String.fromCharCode(parseInt(m1, 16));
      });
    };

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
      var cache_key, exceptions, regex_contents, result, _base;
      if (boundary_type === "sentence") {
        cache_key = TwitterCldr.Utilities.compute_cache_key([locale, boundary_type]);
        result = null;
        exceptions = this.exceptions_for(locale, boundary_name);
        regex_contents = exceptions.map((function(exception) {
          return TwitterCldr.Utilities.regex_escape(exception);
        }), this).join("|");
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
      return boundary_data.rules.map((function(rule) {
        var r;
        r = this.segmentation_parser.parse(this.segmentation_tokenizer.tokenize(rule.value), {
          "symbol_table": symbol_table
        });
        r.string = rule.value;
        r.id = rule.id;
        return r;
      }), this);
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

  TwitterCldr.NumberParser = (function() {
    function NumberParser() {
      this.group_separator = ",";
      this.decimal_separator = "\\\.";
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
        return result || default_value;
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
      if (!(codepoints instanceof Array)) {
        codepoints = [codepoints];
      }
      return codepoints.map((function(cp) {
        var first, second;
        if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
          return this.to_hex(cp);
        } else if (cp >= 0x10000 && cp <= 0x10FFFF) {
          cp -= 0x10000;
          first = ((0xffc00 & cp) >> 10) + 0xD800;
          second = (0x3ff & cp) + 0xDC00;
          return this.to_hex(first) + '+' + this.to_hex(second);
        }
      }), this);
    };

    Component.prototype.to_hex = function(codepoint) {
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
      return (arr.map((function(c) {
        return "(?:" + this.to_utf8(c) + ")";
      }), this)).join("");
    };

    Component.prototype.set_to_regex = function(set) {
      var strs;
      strs = TwitterCldr.Utilities.remove_duplicates(set.to_array(true)).map((function(obj) {
        if (obj instanceof TwitterCldr.Range) {
          return this.range_to_regex(obj);
        } else if (obj instanceof Array) {
          return this.array_to_regex(obj);
        } else {
          return this.to_utf8(obj);
        }
      }), this);
      return "(?:" + strs.join("|") + ")";
    };

    return Component;

  })();

  TwitterCldr.Literal = (function(_super) {
    __extends(Literal, _super);

    function Literal(text) {
      this.text = text;
      this.special_characters = {
        s: [32],
        t: [9],
        r: [13],
        n: [10],
        f: [12],
        d: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((function(c) {
          return this.ordinalize(c.toString());
        }), this),
        w: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_".split("").map((function(c) {
          return this.ordinalize(c);
        }), this)
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
      var key, keys, value, _ref;
      keys = [];
      _ref = this.grouping_pairs;
      for (key in _ref) {
        value = _ref[key];
        keys.push(value);
      }
      return keys;
    };

    CharacterClass.closing_types = function() {
      var key, value, values, _ref;
      values = [];
      _ref = this.grouping_pairs;
      for (key in _ref) {
        value = _ref[key];
        values.push(key);
      }
      return values;
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
      return UnicodeRegexParser.__super__.parse.call(this, this.preprocess(this.substitute_variables(tokens, options["symbol_table"])), options);
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
      return this.tokens.map(function(token) {
        return token.to_string();
      }).join("");
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
      this.recognizers = recognizers;
      this.custom_splitter = custom_splitter != null ? custom_splitter : null;
      this.remove_empty_entries = remove_empty_entries != null ? remove_empty_entries : true;
      this.splitter = this.custom_splitter || new RegExp("(" + this.recognizers.map(function(recognizer) {
        return recognizer.regex.source;
      }).join("|") + ")");
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
        splitter = new Regexp(tokenizers.map((function(tokenizer) {
          return tokenizer.custom_splitter.source;
        }).join("|")));
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
      return this.splitter = this.custom_splitter || new RegExp("(" + this.recognizers.map(function(recognizer) {
        return recognizer.regex.source;
      }).join("|") + ")");
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
      var diff, item, last_item, sorted_list, sub_lists, _i, _len;
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
      return sub_lists.map((function(sub_list) {
        if (compress && sub_list.length === 1) {
          return sub_list[0];
        } else {
          return new TwitterCldr.Range(sub_list[0], sub_list[sub_list.length - 1]);
        }
      }));
    };

    RangeSet.prototype.to_array = function(compress) {
      if (compress == null) {
        compress = false;
      }
      if (compress) {
        return this.ranges.map((function(range) {
          if (range.first === range.last) {
            return range.first;
          } else {
            return TwitterCldr.Utilities.clone(range);
          }
        }));
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
      return chars.map((function(char) {
        return this.from_char(char);
      }), this);
    };

    CodePoints.to_chars = function(code_points) {
      return code_points.map((function(code_point) {
        return this.to_char(code_point);
      }), this);
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
