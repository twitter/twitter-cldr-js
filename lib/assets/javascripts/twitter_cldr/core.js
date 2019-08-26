
/*
// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

// TwitterCLDR (JavaScript) v3.2.0
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

    Utilities.traverse_object = function(obj, path) {
      var key, value, _i, _len;
      value = obj;
      if (path.length === 0) {
        return null;
      }
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        key = path[_i];
        if ((value != null) && value.hasOwnProperty(key)) {
          value = value[key];
        } else {
          return null;
        }
      }
      return value;
    };

    return Utilities;

  })();

  TwitterCldr.NotImplementedException = (function(_super) {
    __extends(NotImplementedException, _super);

    function NotImplementedException(message) {
      this.message = message != null ? message : "";
      NotImplementedException.__super__.constructor.apply(this, arguments);
    }

    return NotImplementedException;

  })(Error);

  TwitterCldr.Settings = (function() {
    function Settings() {}

    Settings.is_rtl = function() {
      return TwitterCldr.get_data().Settings.is_rtl;
    };

    Settings.locale = function() {
      return TwitterCldr.get_data().Settings.locale;
    };

    return Settings;

  })();

  TwitterCldr.PluralRules = (function() {
    function PluralRules() {}

    PluralRules.runtime = (function(context) {
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
}).call({})
;

    PluralRules.data = function() {
      return TwitterCldr.get_data().PluralRules;
    };

    PluralRules.all = function(type) {
      if (type == null) {
        type = 'cardinal';
      }
      return this.data().names[type];
    };

    PluralRules.rule_for = function(number, type) {
      var error;
      if (type == null) {
        type = 'cardinal';
      }
      try {
        return eval(this.data().rules[type])(number.toString(), this.runtime);
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

    TimespanFormatter.data = function() {
      return TwitterCldr.get_data().TimespanFormatter;
    };

    TimespanFormatter.prototype.patterns = function() {
      return this.constructor.data().patterns;
    };

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
      return this.patterns()[options["direction"]][options["unit"]][options["type"]][options["rule"]].replace(/\{[0-9]\}/, number.toString());
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

    DateTimeFormatter.data = function() {
      return TwitterCldr.get_data().DateTimeFormatter;
    };

    DateTimeFormatter.prototype.tokens = function() {
      return this.constructor.data().tokens;
    };

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
        return this.tokens()["date_time"][format][this.additional_format_selector().find_closest(options.type)];
      } else {
        return this.tokens()[format][type];
      }
    };

    DateTimeFormatter.prototype.result_for_token = function(token, date) {
      return this[this.methods[token.value[0]]](date, token.value, token.value.length);
    };

    DateTimeFormatter.prototype.additional_format_selector = function() {
      return new TwitterCldr.AdditionalDateFormatSelector(this.tokens()["date_time"]["additional"]);
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
          choices = TwitterCldr.Calendar.calendar()["eras"]["abbr"];
          break;
        default:
          choices = TwitterCldr.Calendar.calendar()["eras"]["name"];
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

  TwitterCldr.Currencies = (function() {
    function Currencies() {}

    Currencies.currencies = {"ADP":{"currency":"ADP","name":"Andorran peseta","cldr_symbol":"ADP","symbol":"ADP","code_points":[65,68,80]},"AED":{"currency":"AED","name":"UAE dirham","cldr_symbol":"AED","symbol":"AED","code_points":[65,69,68]},"AFA":{"currency":"AFA","name":"Afghan afghani (1927–2002)","cldr_symbol":"AFA","symbol":"AFA","code_points":[65,70,65]},"AFN":{"currency":"AFN","name":"Afghan Afghani","cldr_symbol":"AFN","symbol":"؋","code_points":[1547]},"ALK":{"currency":"ALK","name":"Albanian lek (1946–1965)","cldr_symbol":"ALK","symbol":"ALK","code_points":[65,76,75]},"ALL":{"currency":"ALL","name":"Albanian lek","cldr_symbol":"ALL","symbol":"LEK","code_points":[76,69,75]},"AMD":{"currency":"AMD","name":"Armenian dram","cldr_symbol":"AMD","symbol":"AMD","code_points":[65,77,68]},"ANG":{"currency":"ANG","name":"Netherlands Antillean guilder","cldr_symbol":"ANG","symbol":"ƒ","code_points":[402]},"AOA":{"currency":"AOA","name":"Angolan kwanza","cldr_symbol":"Kz","symbol":"Kz","code_points":[75,122]},"AOK":{"currency":"AOK","name":"Angolan kwanza (1977–1991)","cldr_symbol":"AOK","symbol":"AOK","code_points":[65,79,75]},"AON":{"currency":"AON","name":"Angolan new kwanza (1990–2000)","cldr_symbol":"AON","symbol":"AON","code_points":[65,79,78]},"AOR":{"currency":"AOR","name":"Angolan readjusted kwanza (1995–1999)","cldr_symbol":"AOR","symbol":"AOR","code_points":[65,79,82]},"ARA":{"currency":"ARA","name":"Argentine austral","cldr_symbol":"ARA","symbol":"ARA","code_points":[65,82,65]},"ARL":{"currency":"ARL","name":"Argentine peso ley (1970–1983)","cldr_symbol":"ARL","symbol":"ARL","code_points":[65,82,76]},"ARM":{"currency":"ARM","name":"Argentine peso (1881–1970)","cldr_symbol":"ARM","symbol":"ARM","code_points":[65,82,77]},"ARP":{"currency":"ARP","name":"Argentine peso (1983–1985)","cldr_symbol":"ARP","symbol":"ARP","code_points":[65,82,80]},"ARS":{"currency":"ARS","name":"Argentine peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"ATS":{"currency":"ATS","name":"Austrian schilling","cldr_symbol":"ATS","symbol":"ATS","code_points":[65,84,83]},"AUD":{"currency":"AUD","name":"Australian dollar","cldr_symbol":"A$","symbol":"$","code_points":[36]},"AWG":{"currency":"AWG","name":"Aruban florin","cldr_symbol":"AWG","symbol":"ƒ","code_points":[402],"alt_name":"Florins"},"AZM":{"currency":"AZM","name":"Azerbaijani manat (1993–2006)","cldr_symbol":"AZM","symbol":"AZM","code_points":[65,90,77]},"AZN":{"currency":"AZN","name":"Azerbaijani manat","cldr_symbol":"AZN","symbol":"ман","code_points":[1084,1072,1085]},"BAD":{"currency":"BAD","name":"Bosnia-Herzegovina dinar (1992–1994)","cldr_symbol":"BAD","symbol":"BAD","code_points":[66,65,68]},"BAM":{"currency":"BAM","name":"Bosnia-Herzegovina convertible mark","cldr_symbol":"KM","symbol":"KM","code_points":[75,77]},"BAN":{"currency":"BAN","name":"Bosnia-Herzegovina new dinar (1994–1997)","cldr_symbol":"BAN","symbol":"BAN","code_points":[66,65,78]},"BBD":{"currency":"BBD","name":"Barbadian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BDT":{"currency":"BDT","name":"Bangladeshi taka","cldr_symbol":"৳","symbol":"৳","code_points":[2547]},"BEC":{"currency":"BEC","name":"Belgian franc (convertible)","cldr_symbol":"BEC","symbol":"BEC","code_points":[66,69,67]},"BEF":{"currency":"BEF","name":"Belgian franc","cldr_symbol":"BEF","symbol":"BEF","code_points":[66,69,70]},"BEL":{"currency":"BEL","name":"Belgian franc (financial)","cldr_symbol":"BEL","symbol":"BEL","code_points":[66,69,76]},"BGL":{"currency":"BGL","name":"Bulgarian hard lev","cldr_symbol":"BGL","symbol":"BGL","code_points":[66,71,76]},"BGM":{"currency":"BGM","name":"Bulgarian socialist lev","cldr_symbol":"BGM","symbol":"BGM","code_points":[66,71,77]},"BGN":{"currency":"BGN","name":"Bulgarian lev","cldr_symbol":"BGN","symbol":"лв","code_points":[1083,1074]},"BGO":{"currency":"BGO","name":"Bulgarian lev (1879–1952)","cldr_symbol":"BGO","symbol":"BGO","code_points":[66,71,79]},"BHD":{"currency":"BHD","name":"Bahraini dinar","cldr_symbol":"BHD","symbol":"BHD","code_points":[66,72,68]},"BIF":{"currency":"BIF","name":"Burundian franc","cldr_symbol":"BIF","symbol":"BIF","code_points":[66,73,70]},"BMD":{"currency":"BMD","name":"Bermudan dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BND":{"currency":"BND","name":"Brunei dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BOB":{"currency":"BOB","name":"Bolivian boliviano","cldr_symbol":"Bs","symbol":"$b","code_points":[36,98]},"BOL":{"currency":"BOL","name":"Bolivian boliviano (1863–1963)","cldr_symbol":"BOL","symbol":"BOL","code_points":[66,79,76]},"BOP":{"currency":"BOP","name":"Bolivian peso","cldr_symbol":"BOP","symbol":"BOP","code_points":[66,79,80]},"BOV":{"currency":"BOV","name":"Bolivian mvdol","cldr_symbol":"BOV","symbol":"BOV","code_points":[66,79,86]},"BRB":{"currency":"BRB","name":"Brazilian new cruzeiro (1967–1986)","cldr_symbol":"BRB","symbol":"BRB","code_points":[66,82,66]},"BRC":{"currency":"BRC","name":"Brazilian cruzado (1986–1989)","cldr_symbol":"BRC","symbol":"BRC","code_points":[66,82,67]},"BRE":{"currency":"BRE","name":"Brazilian cruzeiro (1990–1993)","cldr_symbol":"BRE","symbol":"BRE","code_points":[66,82,69]},"BRL":{"currency":"BRL","name":"Brazilian real","cldr_symbol":"R$","symbol":"R$","code_points":[82,36]},"BRN":{"currency":"BRN","name":"Brazilian new cruzado (1989–1990)","cldr_symbol":"BRN","symbol":"BRN","code_points":[66,82,78]},"BRR":{"currency":"BRR","name":"Brazilian cruzeiro (1993–1994)","cldr_symbol":"BRR","symbol":"BRR","code_points":[66,82,82]},"BRZ":{"currency":"BRZ","name":"Brazilian cruzeiro (1942–1967)","cldr_symbol":"BRZ","symbol":"BRZ","code_points":[66,82,90]},"BSD":{"currency":"BSD","name":"Bahamian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"BTN":{"currency":"BTN","name":"Bhutanese ngultrum","cldr_symbol":"BTN","symbol":"BTN","code_points":[66,84,78]},"BUK":{"currency":"BUK","name":"Burmese kyat","cldr_symbol":"BUK","symbol":"BUK","code_points":[66,85,75]},"BWP":{"currency":"BWP","name":"Botswanan pula","cldr_symbol":"P","symbol":"P","code_points":[80]},"BYB":{"currency":"BYB","name":"Belarusian new ruble (1994–1999)","cldr_symbol":"BYB","symbol":"BYB","code_points":[66,89,66]},"BYR":{"currency":"BYR","name":"Belarusian ruble","cldr_symbol":"р.","symbol":"p.","code_points":[112,46]},"BZD":{"currency":"BZD","name":"Belize dollar","cldr_symbol":"$","symbol":"BZ$","code_points":[66,90,36]},"CAD":{"currency":"CAD","name":"Canadian dollar","cldr_symbol":"CA$","symbol":"$","code_points":[36]},"CDF":{"currency":"CDF","name":"Congolese franc","cldr_symbol":"CDF","symbol":"CDF","code_points":[67,68,70]},"CHE":{"currency":"CHE","name":"WIR euro","cldr_symbol":"CHE","symbol":"CHE","code_points":[67,72,69]},"CHF":{"currency":"CHF","name":"Swiss franc","cldr_symbol":"CHF","symbol":"CHF","code_points":[67,72,70]},"CHW":{"currency":"CHW","name":"WIR franc","cldr_symbol":"CHW","symbol":"CHW","code_points":[67,72,87]},"CLE":{"currency":"CLE","name":"Chilean escudo","cldr_symbol":"CLE","symbol":"CLE","code_points":[67,76,69]},"CLF":{"currency":"CLF","name":"Chilean unit of account (UF)","cldr_symbol":"CLF","symbol":"CLF","code_points":[67,76,70]},"CLP":{"currency":"CLP","name":"Chilean peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"CNX":{"currency":"CNX","name":"Chinese People’s Bank dollar","cldr_symbol":"CNX","symbol":"CNX","code_points":[67,78,88]},"CNY":{"currency":"CNY","name":"Chinese yuan","cldr_symbol":"CN¥","symbol":"¥","code_points":[165]},"COP":{"currency":"COP","name":"Colombian peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"COU":{"currency":"COU","name":"Colombian real value unit","cldr_symbol":"COU","symbol":"COU","code_points":[67,79,85]},"CRC":{"currency":"CRC","name":"Costa Rican colón","cldr_symbol":"₡","symbol":"₡","code_points":[8353]},"CSD":{"currency":"CSD","name":"Serbian dinar (2002–2006)","cldr_symbol":"CSD","symbol":"CSD","code_points":[67,83,68]},"CSK":{"currency":"CSK","name":"Czechoslovak hard koruna","cldr_symbol":"CSK","symbol":"CSK","code_points":[67,83,75]},"CUC":{"currency":"CUC","name":"Cuban convertible peso","cldr_symbol":"$","symbol":"$","code_points":[36]},"CUP":{"currency":"CUP","name":"Cuban peso","cldr_symbol":"$","symbol":"₱","code_points":[8369]},"CVE":{"currency":"CVE","name":"Cape Verdean escudo","cldr_symbol":"CVE","symbol":"CVE","code_points":[67,86,69]},"CYP":{"currency":"CYP","name":"Cypriot pound","cldr_symbol":"CYP","symbol":"CYP","code_points":[67,89,80]},"CZK":{"currency":"CZK","name":"Czech Republic koruna","cldr_symbol":"Kč","symbol":"Kč","code_points":[75,269]},"DDM":{"currency":"DDM","name":"East German mark","cldr_symbol":"DDM","symbol":"DDM","code_points":[68,68,77]},"DEM":{"currency":"DEM","name":"German mark","cldr_symbol":"DEM","symbol":"DEM","code_points":[68,69,77]},"DJF":{"currency":"DJF","name":"Djiboutian franc","cldr_symbol":"DJF","symbol":"DJF","code_points":[68,74,70]},"DKK":{"currency":"DKK","name":"Danish krone","cldr_symbol":"kr","symbol":"kr","code_points":[107,114]},"DOP":{"currency":"DOP","name":"Dominican peso","cldr_symbol":"$","symbol":"RD$","code_points":[82,68,36]},"DZD":{"currency":"DZD","name":"Algerian dinar","cldr_symbol":"DZD","symbol":"DZD","code_points":[68,90,68]},"ECS":{"currency":"ECS","name":"Ecuadorian sucre","cldr_symbol":"ECS","symbol":"ECS","code_points":[69,67,83]},"ECV":{"currency":"ECV","name":"Ecuadorian unit of constant value","cldr_symbol":"ECV","symbol":"ECV","code_points":[69,67,86]},"EEK":{"currency":"EEK","name":"Estonian kroon","cldr_symbol":"EEK","symbol":"kr","code_points":[107,114]},"EGP":{"currency":"EGP","name":"Egyptian pound","cldr_symbol":"E£","symbol":"£","code_points":[163]},"ERN":{"currency":"ERN","name":"Eritrean nakfa","cldr_symbol":"ERN","symbol":"ERN","code_points":[69,82,78]},"ESA":{"currency":"ESA","name":"Spanish peseta (A account)","cldr_symbol":"ESA","symbol":"ESA","code_points":[69,83,65]},"ESB":{"currency":"ESB","name":"Spanish peseta (convertible account)","cldr_symbol":"ESB","symbol":"ESB","code_points":[69,83,66]},"ESP":{"currency":"ESP","name":"Spanish peseta","cldr_symbol":"₧","symbol":"₧","code_points":[8359]},"ETB":{"currency":"ETB","name":"Ethiopian birr","cldr_symbol":"ETB","symbol":"ETB","code_points":[69,84,66]},"EUR":{"currency":"EUR","name":"euro","cldr_symbol":"€","symbol":"€","code_points":[8364]},"FIM":{"currency":"FIM","name":"Finnish markka","cldr_symbol":"FIM","symbol":"FIM","code_points":[70,73,77]},"FJD":{"currency":"FJD","name":"Fijian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"FKP":{"currency":"FKP","name":"Falkland Islands pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"FRF":{"currency":"FRF","name":"French franc","cldr_symbol":"FRF","symbol":"FRF","code_points":[70,82,70]},"GBP":{"currency":"GBP","name":"British pound sterling","cldr_symbol":"£","symbol":"£","code_points":[163]},"GEK":{"currency":"GEK","name":"Georgian kupon larit","cldr_symbol":"GEK","symbol":"GEK","code_points":[71,69,75]},"GEL":{"currency":"GEL","name":"Georgian lari","cldr_symbol":"GEL","symbol":"GEL","code_points":[71,69,76]},"GHC":{"currency":"GHC","name":"Ghanaian cedi (1979–2007)","cldr_symbol":"GHC","symbol":"GHC","code_points":[71,72,67]},"GHS":{"currency":"GHS","name":"Ghanaian cedi","cldr_symbol":"GHS","symbol":"¢","code_points":[162]},"GIP":{"currency":"GIP","name":"Gibraltar pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"GMD":{"currency":"GMD","name":"Gambian dalasi","cldr_symbol":"GMD","symbol":"GMD","code_points":[71,77,68]},"GNF":{"currency":"GNF","name":"Guinean franc","cldr_symbol":"FG","symbol":"FG","code_points":[70,71]},"GNS":{"currency":"GNS","name":"Guinean syli","cldr_symbol":"GNS","symbol":"GNS","code_points":[71,78,83]},"GQE":{"currency":"GQE","name":"Equatorial Guinean ekwele","cldr_symbol":"GQE","symbol":"GQE","code_points":[71,81,69]},"GRD":{"currency":"GRD","name":"Greek drachma","cldr_symbol":"GRD","symbol":"GRD","code_points":[71,82,68]},"GTQ":{"currency":"GTQ","name":"Guatemalan quetzal","cldr_symbol":"Q","symbol":"Q","code_points":[81]},"GWE":{"currency":"GWE","name":"Portuguese Guinea escudo","cldr_symbol":"GWE","symbol":"GWE","code_points":[71,87,69]},"GWP":{"currency":"GWP","name":"Guinea-Bissau peso","cldr_symbol":"GWP","symbol":"GWP","code_points":[71,87,80]},"GYD":{"currency":"GYD","name":"Guyanaese dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"HKD":{"currency":"HKD","name":"Hong Kong dollar","cldr_symbol":"HK$","symbol":"$","code_points":[36]},"HNL":{"currency":"HNL","name":"Honduran lempira","cldr_symbol":"L","symbol":"L","code_points":[76]},"HRD":{"currency":"HRD","name":"Croatian dinar","cldr_symbol":"HRD","symbol":"HRD","code_points":[72,82,68]},"HRK":{"currency":"HRK","name":"Croatian kuna","cldr_symbol":"kn","symbol":"kn","code_points":[107,110]},"HTG":{"currency":"HTG","name":"Haitian gourde","cldr_symbol":"HTG","symbol":"HTG","code_points":[72,84,71]},"HUF":{"currency":"HUF","name":"Hungarian forint","cldr_symbol":"Ft","symbol":"Ft","code_points":[70,116]},"IDR":{"currency":"IDR","name":"Indonesian rupiah","cldr_symbol":"Rp","symbol":"Rp","code_points":[82,112]},"IEP":{"currency":"IEP","name":"Irish pound","cldr_symbol":"IEP","symbol":"IEP","code_points":[73,69,80]},"ILP":{"currency":"ILP","name":"Israeli pound","cldr_symbol":"ILP","symbol":"ILP","code_points":[73,76,80]},"ILR":{"currency":"ILR","name":"Israeli sheqel (1980–1985)","cldr_symbol":"ILR","symbol":"ILR","code_points":[73,76,82]},"ILS":{"currency":"ILS","name":"Israeli new sheqel","cldr_symbol":"₪","symbol":"₪","code_points":[8362]},"INR":{"currency":"INR","name":"Indian rupee","cldr_symbol":"₹","symbol":"₨","code_points":[8360]},"IQD":{"currency":"IQD","name":"Iraqi dinar","cldr_symbol":"IQD","symbol":"IQD","code_points":[73,81,68]},"IRR":{"currency":"IRR","name":"Iranian rial","cldr_symbol":"IRR","symbol":"﷼","code_points":[65020]},"ISJ":{"currency":"ISJ","name":"Icelandic króna (1918–1981)","cldr_symbol":"ISJ","symbol":"ISJ","code_points":[73,83,74]},"ISK":{"currency":"ISK","name":"Icelandic króna","cldr_symbol":"kr","symbol":"kr","code_points":[107,114]},"ITL":{"currency":"ITL","name":"Italian lira","cldr_symbol":"ITL","symbol":"ITL","code_points":[73,84,76]},"JMD":{"currency":"JMD","name":"Jamaican dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"JOD":{"currency":"JOD","name":"Jordanian dinar","cldr_symbol":"JOD","symbol":"JOD","code_points":[74,79,68]},"JPY":{"currency":"JPY","name":"Japanese yen","cldr_symbol":"¥","symbol":"¥","code_points":[165]},"KES":{"currency":"KES","name":"Kenyan shilling","cldr_symbol":"KES","symbol":"KES","code_points":[75,69,83]},"KGS":{"currency":"KGS","name":"Kyrgystani som","cldr_symbol":"KGS","symbol":"лв","code_points":[1083,1074]},"KHR":{"currency":"KHR","name":"Cambodian riel","cldr_symbol":"៛","symbol":"៛","code_points":[6107]},"KMF":{"currency":"KMF","name":"Comorian franc","cldr_symbol":"CF","symbol":"CF","code_points":[67,70]},"KPW":{"currency":"KPW","name":"North Korean won","cldr_symbol":"₩","symbol":"₩","code_points":[8361]},"KRH":{"currency":"KRH","name":"South Korean hwan (1953–1962)","cldr_symbol":"KRH","symbol":"KRH","code_points":[75,82,72]},"KRO":{"currency":"KRO","name":"South Korean won (1945–1953)","cldr_symbol":"KRO","symbol":"KRO","code_points":[75,82,79]},"KRW":{"currency":"KRW","name":"South Korean won","cldr_symbol":"₩","symbol":"₩","code_points":[8361]},"KWD":{"currency":"KWD","name":"Kuwaiti dinar","cldr_symbol":"KWD","symbol":"KWD","code_points":[75,87,68]},"KYD":{"currency":"KYD","name":"Cayman Islands dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"KZT":{"currency":"KZT","name":"Kazakhstani tenge","cldr_symbol":"₸","symbol":"лв","code_points":[1083,1074]},"LAK":{"currency":"LAK","name":"Laotian kip","cldr_symbol":"₭","symbol":"₭","code_points":[8365]},"LBP":{"currency":"LBP","name":"Lebanese pound","cldr_symbol":"L£","symbol":"£","code_points":[163]},"LKR":{"currency":"LKR","name":"Sri Lankan rupee","cldr_symbol":"Rs","symbol":"₨","code_points":[8360]},"LRD":{"currency":"LRD","name":"Liberian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"LSL":{"currency":"LSL","name":"Lesotho loti","cldr_symbol":"LSL","symbol":"LSL","code_points":[76,83,76]},"LTL":{"currency":"LTL","name":"Lithuanian litas","cldr_symbol":"Lt","symbol":"Lt","code_points":[76,116]},"LTT":{"currency":"LTT","name":"Lithuanian talonas","cldr_symbol":"LTT","symbol":"LTT","code_points":[76,84,84]},"LUC":{"currency":"LUC","name":"Luxembourgian convertible franc","cldr_symbol":"LUC","symbol":"LUC","code_points":[76,85,67]},"LUF":{"currency":"LUF","name":"Luxembourgian franc","cldr_symbol":"LUF","symbol":"LUF","code_points":[76,85,70]},"LUL":{"currency":"LUL","name":"Luxembourg financial franc","cldr_symbol":"LUL","symbol":"LUL","code_points":[76,85,76]},"LVL":{"currency":"LVL","name":"Latvian lats","cldr_symbol":"Ls","symbol":"Ls","code_points":[76,115]},"LVR":{"currency":"LVR","name":"Latvian ruble","cldr_symbol":"LVR","symbol":"LVR","code_points":[76,86,82]},"LYD":{"currency":"LYD","name":"Libyan dinar","cldr_symbol":"LYD","symbol":"LYD","code_points":[76,89,68]},"MAD":{"currency":"MAD","name":"Moroccan dirham","cldr_symbol":"MAD","symbol":"MAD","code_points":[77,65,68]},"MAF":{"currency":"MAF","name":"Moroccan franc","cldr_symbol":"MAF","symbol":"MAF","code_points":[77,65,70]},"MCF":{"currency":"MCF","name":"Monegasque franc","cldr_symbol":"MCF","symbol":"MCF","code_points":[77,67,70]},"MDC":{"currency":"MDC","name":"Moldovan cupon","cldr_symbol":"MDC","symbol":"MDC","code_points":[77,68,67]},"MDL":{"currency":"MDL","name":"Moldovan leu","cldr_symbol":"MDL","symbol":"MDL","code_points":[77,68,76]},"MGA":{"currency":"MGA","name":"Malagasy Ariary","cldr_symbol":"Ar","symbol":"Ar","code_points":[65,114]},"MGF":{"currency":"MGF","name":"Malagasy franc","cldr_symbol":"MGF","symbol":"MGF","code_points":[77,71,70]},"MKD":{"currency":"MKD","name":"Macedonian denar","cldr_symbol":"MKD","symbol":"MKD","code_points":[77,75,68]},"MKN":{"currency":"MKN","name":"Macedonian denar (1992–1993)","cldr_symbol":"MKN","symbol":"MKN","code_points":[77,75,78]},"MLF":{"currency":"MLF","name":"Malian franc","cldr_symbol":"MLF","symbol":"MLF","code_points":[77,76,70]},"MMK":{"currency":"MMK","name":"Myanmar kyat","cldr_symbol":"K","symbol":"K","code_points":[75]},"MNT":{"currency":"MNT","name":"Mongolian tugrik","cldr_symbol":"₮","symbol":"₮","code_points":[8366]},"MOP":{"currency":"MOP","name":"Macanese pataca","cldr_symbol":"MOP","symbol":"MOP","code_points":[77,79,80]},"MRO":{"currency":"MRO","name":"Mauritanian ouguiya","cldr_symbol":"MRO","symbol":"MRO","code_points":[77,82,79]},"MTL":{"currency":"MTL","name":"Maltese lira","cldr_symbol":"MTL","symbol":"MTL","code_points":[77,84,76]},"MTP":{"currency":"MTP","name":"Maltese pound","cldr_symbol":"MTP","symbol":"MTP","code_points":[77,84,80]},"MUR":{"currency":"MUR","name":"Mauritian rupee","cldr_symbol":"Rs","symbol":"₨","code_points":[8360]},"MVP":{"currency":"MVP","name":"Maldivian rupee (1947–1981)","cldr_symbol":"MVP","symbol":"MVP","code_points":[77,86,80]},"MVR":{"currency":"MVR","name":"Maldivian rufiyaa","cldr_symbol":"MVR","symbol":"MVR","code_points":[77,86,82]},"MWK":{"currency":"MWK","name":"Malawian Kwacha","cldr_symbol":"MWK","symbol":"MWK","code_points":[77,87,75]},"MXN":{"currency":"MXN","name":"Mexican peso","cldr_symbol":"MX$","symbol":"$","code_points":[36]},"MXP":{"currency":"MXP","name":"Mexican silver peso (1861–1992)","cldr_symbol":"MXP","symbol":"MXP","code_points":[77,88,80]},"MXV":{"currency":"MXV","name":"Mexican investment unit","cldr_symbol":"MXV","symbol":"MXV","code_points":[77,88,86]},"MYR":{"currency":"MYR","name":"Malaysian ringgit","cldr_symbol":"RM","symbol":"RM","code_points":[82,77]},"MZE":{"currency":"MZE","name":"Mozambican escudo","cldr_symbol":"MZE","symbol":"MZE","code_points":[77,90,69]},"MZM":{"currency":"MZM","name":"Mozambican metical (1980–2006)","cldr_symbol":"MZM","symbol":"MZM","code_points":[77,90,77]},"MZN":{"currency":"MZN","name":"Mozambican metical","cldr_symbol":"MZN","symbol":"MT","code_points":[77,84]},"NAD":{"currency":"NAD","name":"Namibian dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"NGN":{"currency":"NGN","name":"Nigerian naira","cldr_symbol":"₦","symbol":"₦","code_points":[8358]},"NIC":{"currency":"NIC","name":"Nicaraguan córdoba (1988–1991)","cldr_symbol":"NIC","symbol":"NIC","code_points":[78,73,67]},"NIO":{"currency":"NIO","name":"Nicaraguan córdoba","cldr_symbol":"C$","symbol":"C$","code_points":[67,36]},"NLG":{"currency":"NLG","name":"Dutch guilder","cldr_symbol":"NLG","symbol":"NLG","code_points":[78,76,71]},"NOK":{"currency":"NOK","name":"Norwegian krone","cldr_symbol":"kr","symbol":"kr","code_points":[107,114]},"NPR":{"currency":"NPR","name":"Nepalese rupee","cldr_symbol":"Rs","symbol":"₨","code_points":[8360]},"NZD":{"currency":"NZD","name":"New Zealand dollar","cldr_symbol":"NZ$","symbol":"$","code_points":[36]},"OMR":{"currency":"OMR","name":"Omani rial","cldr_symbol":"OMR","symbol":"﷼","code_points":[65020]},"PAB":{"currency":"PAB","name":"Panamanian balboa","cldr_symbol":"PAB","symbol":"B/.","code_points":[66,47,46]},"PEI":{"currency":"PEI","name":"Peruvian inti","cldr_symbol":"PEI","symbol":"PEI","code_points":[80,69,73]},"PEN":{"currency":"PEN","name":"Peruvian nuevo sol","cldr_symbol":"PEN","symbol":"S/.","code_points":[83,47,46]},"PES":{"currency":"PES","name":"Peruvian sol (1863–1965)","cldr_symbol":"PES","symbol":"PES","code_points":[80,69,83]},"PGK":{"currency":"PGK","name":"Papua New Guinean kina","cldr_symbol":"PGK","symbol":"PGK","code_points":[80,71,75]},"PHP":{"currency":"PHP","name":"Philippine peso","cldr_symbol":"₱","symbol":"Php","code_points":[80,104,112]},"PKR":{"currency":"PKR","name":"Pakistani rupee","cldr_symbol":"Rs","symbol":"₨","code_points":[8360]},"PLN":{"currency":"PLN","name":"Polish zloty","cldr_symbol":"zł","symbol":"zł","code_points":[122,322]},"PLZ":{"currency":"PLZ","name":"Polish zloty (PLZ)","cldr_symbol":"PLZ","symbol":"PLZ","code_points":[80,76,90]},"PTE":{"currency":"PTE","name":"Portuguese escudo","cldr_symbol":"PTE","symbol":"PTE","code_points":[80,84,69]},"PYG":{"currency":"PYG","name":"Paraguayan guarani","cldr_symbol":"₲","symbol":"Gs","code_points":[71,115]},"QAR":{"currency":"QAR","name":"Qatari rial","cldr_symbol":"QAR","symbol":"﷼","code_points":[65020]},"RHD":{"currency":"RHD","name":"Rhodesian dollar","cldr_symbol":"RHD","symbol":"RHD","code_points":[82,72,68]},"ROL":{"currency":"ROL","name":"Romanian leu (1952–2006)","cldr_symbol":"ROL","symbol":"ROL","code_points":[82,79,76]},"RON":{"currency":"RON","name":"Romanian leu","cldr_symbol":"RON","symbol":"lei","code_points":[108,101,105]},"RSD":{"currency":"RSD","name":"Serbian dinar","cldr_symbol":"RSD","symbol":"Дин.","code_points":[1044,1080,1085,46]},"RUB":{"currency":"RUB","name":"Russian ruble","cldr_symbol":"₽","symbol":"руб","code_points":[1088,1091,1073]},"RUR":{"currency":"RUR","name":"Russian ruble (1991–1998)","cldr_symbol":"р.","symbol":"р.","code_points":[1088,46]},"RWF":{"currency":"RWF","name":"Rwandan franc","cldr_symbol":"RF","symbol":"RF","code_points":[82,70]},"SAR":{"currency":"SAR","name":"Saudi riyal","cldr_symbol":"SAR","symbol":"﷼","code_points":[65020]},"SBD":{"currency":"SBD","name":"Solomon Islands dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SCR":{"currency":"SCR","name":"Seychellois rupee","cldr_symbol":"SCR","symbol":"₨","code_points":[8360]},"SDD":{"currency":"SDD","name":"Sudanese dinar (1992–2007)","cldr_symbol":"SDD","symbol":"SDD","code_points":[83,68,68]},"SDG":{"currency":"SDG","name":"Sudanese pound","cldr_symbol":"SDG","symbol":"SDG","code_points":[83,68,71]},"SDP":{"currency":"SDP","name":"Sudanese pound (1957–1998)","cldr_symbol":"SDP","symbol":"SDP","code_points":[83,68,80]},"SEK":{"currency":"SEK","name":"Swedish krona","cldr_symbol":"kr","symbol":"kr","code_points":[107,114]},"SGD":{"currency":"SGD","name":"Singapore dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SHP":{"currency":"SHP","name":"St. Helena pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"SIT":{"currency":"SIT","name":"Slovenian tolar","cldr_symbol":"SIT","symbol":"SIT","code_points":[83,73,84]},"SKK":{"currency":"SKK","name":"Slovak koruna","cldr_symbol":"SKK","symbol":"SKK","code_points":[83,75,75]},"SLL":{"currency":"SLL","name":"Sierra Leonean leone","cldr_symbol":"SLL","symbol":"SLL","code_points":[83,76,76]},"SOS":{"currency":"SOS","name":"Somali shilling","cldr_symbol":"SOS","symbol":"S","code_points":[83]},"SRD":{"currency":"SRD","name":"Surinamese dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"SRG":{"currency":"SRG","name":"Surinamese guilder","cldr_symbol":"SRG","symbol":"SRG","code_points":[83,82,71]},"SSP":{"currency":"SSP","name":"South Sudanese pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"STD":{"currency":"STD","name":"São Tomé \u0026 Príncipe dobra","cldr_symbol":"Db","symbol":"Db","code_points":[68,98]},"SUR":{"currency":"SUR","name":"Soviet rouble","cldr_symbol":"SUR","symbol":"SUR","code_points":[83,85,82]},"SVC":{"currency":"SVC","name":"Salvadoran colón","cldr_symbol":"SVC","symbol":"SVC","code_points":[83,86,67]},"SYP":{"currency":"SYP","name":"Syrian pound","cldr_symbol":"£","symbol":"£","code_points":[163]},"SZL":{"currency":"SZL","name":"Swazi lilangeni","cldr_symbol":"SZL","symbol":"SZL","code_points":[83,90,76]},"THB":{"currency":"THB","name":"Thai baht","cldr_symbol":"฿","symbol":"฿","code_points":[3647]},"TJR":{"currency":"TJR","name":"Tajikistani ruble","cldr_symbol":"TJR","symbol":"TJR","code_points":[84,74,82]},"TJS":{"currency":"TJS","name":"Tajikistani somoni","cldr_symbol":"TJS","symbol":"TJS","code_points":[84,74,83]},"TMM":{"currency":"TMM","name":"Turkmenistani manat (1993–2009)","cldr_symbol":"TMM","symbol":"TMM","code_points":[84,77,77]},"TMT":{"currency":"TMT","name":"Turkmenistani manat","cldr_symbol":"TMT","symbol":"TMT","code_points":[84,77,84]},"TND":{"currency":"TND","name":"Tunisian dinar","cldr_symbol":"TND","symbol":"TND","code_points":[84,78,68]},"TOP":{"currency":"TOP","name":"Tongan paʻanga","cldr_symbol":"T$","symbol":"T$","code_points":[84,36]},"TPE":{"currency":"TPE","name":"Timorese escudo","cldr_symbol":"TPE","symbol":"TPE","code_points":[84,80,69]},"TRL":{"currency":"TRL","name":"Turkish lira (1922–2005)","cldr_symbol":"TRL","symbol":"TRL","code_points":[84,82,76]},"TRY":{"currency":"TRY","name":"Turkish lira","cldr_symbol":"₺","symbol":"TL","code_points":[84,76]},"TTD":{"currency":"TTD","name":"Trinidad \u0026 Tobago dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"TWD":{"currency":"TWD","name":"New Taiwan dollar","cldr_symbol":"NT$","symbol":"NT$","code_points":[78,84,36]},"TZS":{"currency":"TZS","name":"Tanzanian shilling","cldr_symbol":"TZS","symbol":"TZS","code_points":[84,90,83]},"UAH":{"currency":"UAH","name":"Ukrainian hryvnia","cldr_symbol":"₴","symbol":"₴","code_points":[8372]},"UAK":{"currency":"UAK","name":"Ukrainian karbovanets","cldr_symbol":"UAK","symbol":"UAK","code_points":[85,65,75]},"UGS":{"currency":"UGS","name":"Ugandan shilling (1966–1987)","cldr_symbol":"UGS","symbol":"UGS","code_points":[85,71,83]},"UGX":{"currency":"UGX","name":"Ugandan shilling","cldr_symbol":"UGX","symbol":"UGX","code_points":[85,71,88]},"USD":{"currency":"USD","name":"US dollar","cldr_symbol":"$","symbol":"$","code_points":[36]},"USN":{"currency":"USN","name":"US dollar (next day)","cldr_symbol":"USN","symbol":"USN","code_points":[85,83,78]},"USS":{"currency":"USS","name":"US dollar (same day)","cldr_symbol":"USS","symbol":"USS","code_points":[85,83,83]},"UYI":{"currency":"UYI","name":"Uruguayan peso (indexed units)","cldr_symbol":"UYI","symbol":"UYI","code_points":[85,89,73]},"UYP":{"currency":"UYP","name":"Uruguayan peso (1975–1993)","cldr_symbol":"UYP","symbol":"UYP","code_points":[85,89,80]},"UYU":{"currency":"UYU","name":"Uruguayan peso","cldr_symbol":"$","symbol":"$U","code_points":[36,85]},"UZS":{"currency":"UZS","name":"Uzbekistan som","cldr_symbol":"UZS","symbol":"лв","code_points":[1083,1074]},"VEB":{"currency":"VEB","name":"Venezuelan bolívar (1871–2008)","cldr_symbol":"VEB","symbol":"VEB","code_points":[86,69,66]},"VEF":{"currency":"VEF","name":"Venezuelan bolívar","cldr_symbol":"Bs","symbol":"Bs","code_points":[66,115]},"VND":{"currency":"VND","name":"Vietnamese dong","cldr_symbol":"₫","symbol":"₫","code_points":[8363]},"VNN":{"currency":"VNN","name":"Vietnamese dong (1978–1985)","cldr_symbol":"VNN","symbol":"VNN","code_points":[86,78,78]},"VUV":{"currency":"VUV","name":"Vanuatu vatu","cldr_symbol":"VUV","symbol":"VUV","code_points":[86,85,86]},"WST":{"currency":"WST","name":"Samoan tala","cldr_symbol":"WST","symbol":"WST","code_points":[87,83,84]},"XAF":{"currency":"XAF","name":"CFA franc BEAC","cldr_symbol":"FCFA","symbol":"FCFA","code_points":[70,67,70,65]},"XAG":{"currency":"XAG","name":"troy ounce of silver","cldr_symbol":"XAG","symbol":"XAG","code_points":[88,65,71]},"XAU":{"currency":"XAU","name":"troy ounce of gold","cldr_symbol":"XAU","symbol":"XAU","code_points":[88,65,85]},"XBA":{"currency":"XBA","name":"European composite unit","cldr_symbol":"XBA","symbol":"XBA","code_points":[88,66,65]},"XBB":{"currency":"XBB","name":"European monetary unit","cldr_symbol":"XBB","symbol":"XBB","code_points":[88,66,66]},"XBC":{"currency":"XBC","name":"European unit of account (XBC)","cldr_symbol":"XBC","symbol":"XBC","code_points":[88,66,67]},"XBD":{"currency":"XBD","name":"European unit of account (XBD)","cldr_symbol":"XBD","symbol":"XBD","code_points":[88,66,68]},"XCD":{"currency":"XCD","name":"East Caribbean dollar","cldr_symbol":"EC$","symbol":"$","code_points":[36]},"XDR":{"currency":"XDR","name":"special drawing rights","cldr_symbol":"XDR","symbol":"XDR","code_points":[88,68,82]},"XEU":{"currency":"XEU","name":"European currency unit","cldr_symbol":"XEU","symbol":"XEU","code_points":[88,69,85]},"XFO":{"currency":"XFO","name":"French gold franc","cldr_symbol":"XFO","symbol":"XFO","code_points":[88,70,79]},"XFU":{"currency":"XFU","name":"French UIC-franc","cldr_symbol":"XFU","symbol":"XFU","code_points":[88,70,85]},"XOF":{"currency":"XOF","name":"CFA franc BCEAO","cldr_symbol":"CFA","symbol":"CFA","code_points":[67,70,65]},"XPD":{"currency":"XPD","name":"troy ounce of palladium","cldr_symbol":"XPD","symbol":"XPD","code_points":[88,80,68]},"XPF":{"currency":"XPF","name":"CFP franc","cldr_symbol":"CFPF","symbol":"CFPF","code_points":[67,70,80,70]},"XPT":{"currency":"XPT","name":"troy ounce of platinum","cldr_symbol":"XPT","symbol":"XPT","code_points":[88,80,84]},"XRE":{"currency":"XRE","name":"RINET Funds unit","cldr_symbol":"XRE","symbol":"XRE","code_points":[88,82,69]},"XSU":{"currency":"XSU","name":"Sucre","cldr_symbol":"XSU","symbol":"XSU","code_points":[88,83,85]},"XTS":{"currency":"XTS","name":"Testing Currency unit","cldr_symbol":"XTS","symbol":"XTS","code_points":[88,84,83]},"XUA":{"currency":"XUA","name":"ADB unit of account","cldr_symbol":"XUA","symbol":"XUA","code_points":[88,85,65]},"XXX":{"currency":"XXX","name":"(unknown unit of currency)","cldr_symbol":"XXX","symbol":"XXX","code_points":[88,88,88]},"YDD":{"currency":"YDD","name":"Yemeni dinar","cldr_symbol":"YDD","symbol":"YDD","code_points":[89,68,68]},"YER":{"currency":"YER","name":"Yemeni rial","cldr_symbol":"YER","symbol":"﷼","code_points":[65020]},"YUD":{"currency":"YUD","name":"Yugoslavian hard dinar (1966–1990)","cldr_symbol":"YUD","symbol":"YUD","code_points":[89,85,68]},"YUM":{"currency":"YUM","name":"Yugoslavian new dinar (1994–2002)","cldr_symbol":"YUM","symbol":"YUM","code_points":[89,85,77]},"YUN":{"currency":"YUN","name":"Yugoslavian convertible dinar (1990–1992)","cldr_symbol":"YUN","symbol":"YUN","code_points":[89,85,78]},"YUR":{"currency":"YUR","name":"Yugoslavian reformed dinar (1992–1993)","cldr_symbol":"YUR","symbol":"YUR","code_points":[89,85,82]},"ZAL":{"currency":"ZAL","name":"South African rand (financial)","cldr_symbol":"ZAL","symbol":"ZAL","code_points":[90,65,76]},"ZAR":{"currency":"ZAR","name":"South African rand","cldr_symbol":"R","symbol":"R","code_points":[82]},"ZMK":{"currency":"ZMK","name":"Zambian kwacha (1968–2012)","cldr_symbol":"ZMK","symbol":"ZMK","code_points":[90,77,75]},"ZMW":{"currency":"ZMW","name":"Zambian kwacha","cldr_symbol":"ZK","symbol":"ZK","code_points":[90,75]},"ZRN":{"currency":"ZRN","name":"Zairean new zaire (1993–1998)","cldr_symbol":"ZRN","symbol":"ZRN","code_points":[90,82,78]},"ZRZ":{"currency":"ZRZ","name":"Zairean zaire (1971–1993)","cldr_symbol":"ZRZ","symbol":"ZRZ","code_points":[90,82,90]},"ZWD":{"currency":"ZWD","name":"Zimbabwean dollar (1980–2008)","cldr_symbol":"ZWD","symbol":"Z$","code_points":[90,36]},"ZWL":{"currency":"ZWL","name":"Zimbabwean dollar (2009)","cldr_symbol":"ZWL","symbol":"ZWL","code_points":[90,87,76]},"ZWR":{"currency":"ZWR","name":"Zimbabwean dollar (2008)","cldr_symbol":"ZWR","symbol":"ZWR","code_points":[90,87,82]}};

    Currencies.currency_codes = function() {
      var code, _;
      return this.codes || (this.codes = (function() {
        var _ref, _results;
        _ref = this.currencies;
        _results = [];
        for (code in _ref) {
          _ = _ref[code];
          _results.push(code);
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
            currency: data.currency,
            name: data.name,
            code_points: data.code_points
          };
          break;
        }
      }
      return result;
    };

    return Currencies;

  })();

  TwitterCldr.ListFormatter = (function() {
    function ListFormatter() {}

    ListFormatter.data = function() {
      return TwitterCldr.get_data().ListFormatter;
    };

    ListFormatter.prototype.formats = function() {
      return this.constructor.data().formats;
    };

    ListFormatter.prototype.format = function(list) {
      if (this.formats()[list.length.toString()] != null) {
        return this.compose(this.formats()[list.length.toString()], list);
      } else {
        return this.compose_list(list);
      }
    };

    ListFormatter.prototype.compose_list = function(list) {
      var format_key, i, result, _i, _ref;
      result = this.compose(this.formats().end || this.formats().middle || "", [list[list.length - 2], list[list.length - 1]]);
      if (list.length > 2) {
        for (i = _i = 3, _ref = list.length; 3 <= _ref ? _i <= _ref : _i >= _ref; i = 3 <= _ref ? ++_i : --_i) {
          format_key = i === list.length ? "start" : "middle";
          if (this.formats()[format_key] == null) {
            format_key = "middle";
          }
          result = this.compose(this.formats()[format_key] || "", [list[list.length - i], result]);
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
        if (TwitterCldr.Settings.is_rtl()) {
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

    Bidi.bidi_classes = {"BN":{"8":[0],"13":[14],"5":[127,8298],"25":[134],"0":[173,65279,917505],"2":[8203],"4":[8288],"7":[119155],"95":[917536]},"S":{"0":[9,11,31]},"B":{"0":[10,13,133,8233],"2":[28]},"WS":{"0":[12,32,5760,6158,8232,8287,12288],"10":[8192]},"ON":{"1":[33,171,174,697,884,900,1542,1550,5787,6468,8189,8448,8456,8506,12342,12443,12829,13278,42622,64830,65120,65281,126704,127338],"4":[38,187,8512,65286,65529,127942],"5":[59,91,3059,8478,11493,65307,65339,127792],"3":[123,166,2038,3898,8451,8522,12289,13004,13175,43048,43124,128249,128320],"0":[161,180,215,247,894,903,1014,1418,1758,1769,3066,5120,6464,8125,8468,8485,8487,8489,8585,12336,12448,12539,13311,42611,42888,65021,65105,65108,65128,65131,65793,67871,119365,120539,120597,120655,120713,120771,128064],"2":[182,8127,8141,8157,8173,8316,8332,8470,12349,12924,42509,65124,65506],"13":[706,722,127153],"8":[741,65110],"16":[751,127968],"6":[3192,11513,65512,68409],"9":[5008,6128,11088,65040],"10":[6144,9280,65371,128581],"33":[6622,42752],"23":[8208,128336],"14":[8245,12977,127136,127169,127185],"25":[8261,9083,11904],"15":[8528,12880],"129":[8592],"289":[8724],"93":[9110],"38":[9216],"39":[9312],"449":[9450],"82":[9901],"254":[9985],"588":[10496],"59":[11776],"88":[11931],"213":[12032],"11":[12272,65936],"24":[12296],"35":[12736],"63":[19904],"54":[42128],"31":[65072],"74":[65856],"19":[69714,127872],"65":[119296],"86":[119552],"43":[126976],"99":[127024],"32":[127744],"69":[127799,128507,128640],"36":[127904],"62":[128000],"181":[128066],"61":[128256],"115":[128768]},"ET":{"2":[35,65283],"3":[162],"1":[176,1545,2546,43064,65129,65504,65509],"0":[1423,1642,2555,2801,3065,3647,6107,8494,8723,65119],"4":[8240],"25":[8352]},"ES":{"0":[43,45,8722,64297,65291,65293],"1":[8314,8330,65122]},"CS":{"0":[44,58,160,1548,8239,8260,65104,65106,65109,65292,65306],"1":[46,65294]},"EN":{"9":[48,1776,8320,65296],"1":[178],"0":[185,8304],"5":[8308],"19":[9352],"49":[120782],"10":[127232]},"L":{"25":[65,97,5761,6576,65313,65345,65549],"0":[170,181,186,750,902,908,1417,2363,2482,2510,2519,2563,2654,2691,2761,2768,2880,2903,2947,2972,3024,3031,3133,3199,3294,3406,3415,3517,3716,3722,3725,3749,3751,3773,3782,3894,3896,3967,3973,4145,4152,4295,4301,4696,4800,6070,6108,6314,6743,6753,6965,6971,7082,7143,7150,7379,7393,8025,8027,8029,8126,8206,8305,8319,8450,8455,8469,8484,8486,8488,9109,9900,11559,11565,43047,43597,43697,43712,43714,65792,65794,69632,69932,71340,71350,119970,119995,120134],"22":[192,3090,3218,6656,11648],"30":[216,8031,13280,66304,127248],"448":[248],"6":[699,1369,2425,2474,2548,2602,2730,2858,3449,3520,3648,3737,4688,4792,6100,8118,8134,8182,11680,11688,11696,11704,11712,11720,11728,11736,43808,43816,64256,69703,69819,119997,120086,120138],"1":[720,886,2434,2447,2503,2507,2524,2575,2610,2613,2616,2738,2763,2784,2818,2831,2866,2877,2887,2891,2908,2969,2974,2979,3006,3009,3160,3168,3202,3274,3285,3296,3313,3330,3424,3458,3634,3713,3719,3754,3762,4155,4227,5941,6087,6448,6755,7078,7154,7220,7413,8526,11506,11631,12334,43346,43444,43450,43486,43567,43571,43701,44006,65596,69815,71342,110592,119171,119966,119973,127568],"4":[736,2741,2869,3125,3253,3776,3976,6512,6973,8473,8517,12337,12344,43705,64275,120128],"3":[880,890,2365,2377,2486,2493,2649,2749,2962,3137,3389,3732,3757,3804,4186,4682,4698,4746,4786,4802,4882,5902,6435,7401,8144,8490,8508,11499,12540,42896,43015,44009,66336,74864,119977,120071,120123],"2":[904,2382,2527,2622,2674,2703,2911,2958,2984,3014,3018,3073,3086,3214,3270,3342,3398,3402,3535,3570,3745,5998,6441,6681,7146,8130,8178,12293,12445,43011,43584,65498],"19":[910,2404],"82":[931],"139":[1015],"157":[1162,66560],"37":[1329,7968,11520,43264],"38":[1377,119040],"54":[2307],"9":[2392,2662,3114,3174,3242,3302,3792,3902,6112,6160,6784,6800,8458,43000,43250,43600,44016,66720,69734,69872,70079,70096,71360],"7":[2437,2821,3077,3205,3261,3333,3544,4030,6078,7360,8016,43056,43588,43758,120077,120772],"21":[2451,2579,2707,2835],"11":[2534,2990,12992,43214,65536,119982],"5":[2565,2949,4039,4231,6451,6765,7406,7960,8008,8150,42738,42889,43777,43785,43793,65474,65482,65490],"8":[2693,3507,6979,7028,12321,65847,119146,127552],"10":[2790,6608,8495,42912,43471],"17":[2918,3461,5920,5952,119648],"12":[3046,3663,4046,4213,5888,5984,8160,8336,94099],"40":[3346,4704,6272,8544,12549,43520],"15":[3430,4193,4992],"23":[3482,3840,42624],"47":[3585,6916,7164,12832,43395,43648,119214],"26":[3866,6992,66352],"35":[3913,69891],"44":[4096,12784,65799,66000],"24":[4159,43020,43310,69840],"14":[4238,4808,7227,65599],"39":[4254,6470],"376":[4304],"32":[4752],"56":[4824,120540,120598,120656,120714],"66":[4888],"28":[4960,6400,66176,127462],"84":[5024,119808],"638":[5121],"80":[5792],"51":[6016,43072,70018],"87":[6176],"69":[6320],"43":[6528],"55":[6686,11568],"13":[6816,65616,66504,69942],"31":[7042,43612],"57":[7084,127280],"50":[7245,120488],"191":[7424],"277":[7680],"52":[8064],"68":[9014,93952],"77":[9372],"255":[10240],"46":[11264,11312,13008,42560,94032],"132":[11360],"85":[12353],"89":[12449],"93":[12593],"42":[12688,71296,127344,127504],"27":[12896,42512,120094],"49":[12927],"118":[13056],"98":[13179,74752],"6591":[13312],"22156":[19968],"316":[42192],"79":[42656],"101":[42786],"67":[43136],"29":[43359,66432,119180],"16":[43453,43739],"36":[43968,66463],"11206":[44032],"48":[55243,66208,69762],"8813":[55296],"105":[64112],"88":[65382],"18":[65576],"122":[65664],"53":[69634],"878":[73728],"1070":[77824],"568":[92160],"245":[118784],"61":[119081],"70":[119894],"64":[120005],"339":[120146],"42719":[131072],"4383":[173824],"541":[194560],"131071":[983040]},"NSM":{"111":[768],"6":[1155,1750,2385,3636,6071,6744,7394,65056,119173],"44":[1425],"0":[1471,1479,1648,1809,2362,2364,2381,2433,2492,2509,2620,2641,2677,2748,2765,2817,2876,2879,2893,2902,2946,3008,3021,3260,3405,3530,3542,3633,3761,3893,3895,3897,4038,4226,4237,4253,6086,6109,6313,6450,6742,6752,6754,6783,6964,6972,6978,7083,7142,7149,7405,7412,11647,42655,43010,43014,43019,43204,43443,43452,43587,43596,43696,43713,43766,44005,44008,44013,64286,66045,68159,69633,71339,71341,71351],"1":[1473,1476,1767,2402,2530,2561,2625,2631,2672,2689,2759,2786,2914,3157,3170,3276,3298,3426,3771,3864,3974,4153,4157,4184,4229,5970,6002,6068,6439,6679,7040,7080,7144,7222,12441,42736,43045,43569,43573,43703,43710,43756,68101,69760,69817,70016],"10":[1552,1958,3981,6089,43335],"20":[1611],"5":[1759,3764,3784,4146,43561,71344],"3":[1770,2070,2497,2881,3146,3393,4141,4209,6912,7074,7676,12330,42607,43446,68108,69811,94095,119210],"26":[1840,2276],"8":[2027,2075,7019,70070],"2":[2085,2137,2304,2635,3134,3142,3538,4190,4957,5906,5938,6155,6432,6457,7151,7376,11503,43392,43698,68097,68152,69888,119143,119362],"4":[2089,2753,3968,6966,69927],"7":[2369,3655,6757,7212,43302,69933,119163],"13":[3953],"35":[3993],"9":[6771,42612],"12":[7380],"38":[7616],"32":[8400],"31":[11744],"17":[43232],"15":[65024],"14":[69688],"239":[917760]},"R":{"0":[1470,1472,1475,1478,2042,2074,2084,2088,2142,8207,64285,64318,67592,67644,67903,68096],"26":[1488,68121,68440],"4":[1520,64312],"42":[1984],"1":[2036,64320,64323,67639,68030],"21":[2048,68416],"14":[2096],"24":[2112],"9":[64287,64326],"12":[64298],"5":[67584],"43":[67594],"22":[67647],"8":[67671,68176],"27":[67840],"25":[67872],"55":[67968],"3":[68112],"2":[68117],"7":[68160,68472],"31":[68192],"53":[68352],"72":[68608]},"AN":{"4":[1536],"9":[1632],"1":[1643],"0":[1757],"30":[69216]},"AL":{"0":[1544,1547,1549,1563,1969,2208,126500,126503,126521,126523,126530,126535,126537,126539,126548,126551,126553,126555,126557,126559,126564,126590],"44":[1566],"2":[1645,126541,126625],"100":[1649],"1":[1765,1774,1807,126497,126545,126561],"19":[1786],"29":[1810],"88":[1869],"10":[2210],"113":[64336],"362":[64467],"63":[64848],"53":[64914],"12":[65008],"4":[65136,126629],"134":[65142],"3":[126464,126516,126567,126580,126585],"26":[126469],"9":[126505,126592],"6":[126572],"16":[126603,126635]},"LRE":{"0":[8234]},"RLE":{"0":[8235]},"PDF":{"0":[8236]},"LRO":{"0":[8237]},"RLO":{"0":[8238]}}
;

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

  TwitterCldr.BreakIterator = (function() {
    function BreakIterator(locale, options) {
      if (locale == null) {
        locale = TwitterCldr.Settings.locale();
      }
      if (options == null) {
        options = {};
      }
      this.locale = locale;
      this.use_uli_exceptions = (options["use_uli_exceptions"] != null ? options["use_uli_exceptions"] : true);
      this.exceptions_cache = {};
      this.segmentation_tokenizer = new TwitterCldr.SegmentationTokenizer();
      this.segmentation_parser = new TwitterCldr.SegmentationParser();
    }

    BreakIterator.data = function() {
      return TwitterCldr.get_data().BreakIterator;
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
      return this.constructor.data().root_resource["segments"][boundary_name];
    };

    BreakIterator.prototype.tailoring_resource_for = function(locale, boundary_name) {
      return this.constructor.data().tailoring_resource_data[locale][locale]["segments"][boundary_name];
    };

    BreakIterator.prototype.exceptions_for = function(locale, boundary_name) {
      var result;
      result = this.constructor.data().exceptions_resource_data[locale][locale]["exceptions"];
      if (result != null) {
        return result;
      } else {
        return [];
      }
    };

    return BreakIterator;

  })();

  TwitterCldr.Calendar = (function() {
    var REDIRECT_PREFIX;

    function Calendar() {}

    REDIRECT_PREFIX = "calendars.gregorian.";

    Calendar.calendar = function() {
      return TwitterCldr.get_data().Calendar.calendar;
    };

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
      root = this.calendar()[key];
      names_form = options["names_form"] || "wide";
      format = options.format || ((root != null ? (_ref = root["stand-alone"]) != null ? _ref[names_form] : void 0 : void 0) != null ? "stand-alone" : "format");
      data = root[format][names_form];
      if (typeof data === "string" && data.indexOf(REDIRECT_PREFIX) === 0) {
        _ref1 = data.slice(REDIRECT_PREFIX.length).split("."), key = _ref1[0], format = _ref1[1], names_form = _ref1[2];
        return ((_ref2 = this.calendar()[key]) != null ? (_ref3 = _ref2[format]) != null ? _ref3[names_form] : void 0 : void 0) || (function() {
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

    CodePoint.data = function() {
      return TwitterCldr.get_data().CodePoint;
    };

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
      _ref = this.data().index_keys;
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

    CodePoint.get_index = function(index_name) {
      var index_data, index_data_formatted, k, range, v, _i, _len, _ref;
      if (this.index_cache[index_name] != null) {
        return this.index_cache[index_name];
      }
      index_data = this.data().index_data[index_name];
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

    CodePoint.get_regex_for_index_group = function(index_name, group_name) {
      var component, group, group_data, regex, _i, _len;
      group_data = this.get_index(index_name)[group_name];
      regex = "";
      component = new TwitterCldr.Component();
      for (_i = 0, _len = group_data.length; _i < _len; _i++) {
        group = group_data[_i];
        regex = regex + "|" + component.range_to_regex(group);
      }
      return regex.slice(1);
    };

    CodePoint.get_property_data = function(property_name) {
      var k, property_data, property_data_formatted, range, v, _i, _len, _ref;
      if (this.property_data_cache[property_name] != null) {
        return this.property_data_cache[property_name];
      }
      property_data = this.data().property_data[property_name];
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

  TwitterCldr.NumberingSystems = (function() {
    NumberingSystems.for_name = function(name) {
      var system;
      return this.system_cache[name] || ((function() {
        if ((system = this.resource[name]) != null) {
          if (system["type"] !== "numeric") {
            throw "" + system[type] + " numbering systems not supported.";
          } else {
            return new this(system["name"], system["digits"]);
          }
        } else {
          return null;
        }
      }).call(this));
    };

    NumberingSystems.system_cache = {};

    NumberingSystems.resource = {"arab":{"digits":"٠١٢٣٤٥٦٧٨٩","type":"numeric"},"arabext":{"digits":"۰۱۲۳۴۵۶۷۸۹","type":"numeric"},"armn":{"rules":"armenian-upper","type":"algorithmic"},"armnlow":{"rules":"armenian-lower","type":"algorithmic"},"bali":{"digits":"᭐᭑᭒᭓᭔᭕᭖᭗᭘᭙","type":"numeric"},"beng":{"digits":"০১২৩৪৫৬৭৮৯","type":"numeric"},"brah":{"digits":"𑁦𑁧𑁨𑁩𑁪𑁫𑁬𑁭𑁮𑁯","type":"numeric"},"cakm":{"digits":"𑄶𑄷𑄸𑄹𑄺𑄻𑄼𑄽𑄾𑄿","type":"numeric"},"cham":{"digits":"꩐꩑꩒꩓꩔꩕꩖꩗꩘꩙","type":"numeric"},"deva":{"digits":"०१२३४५६७८९","type":"numeric"},"ethi":{"rules":"ethiopic","type":"algorithmic"},"fullwide":{"digits":"０１２３４５６７８９","type":"numeric"},"geor":{"rules":"georgian","type":"algorithmic"},"grek":{"rules":"greek-upper","type":"algorithmic"},"greklow":{"rules":"greek-lower","type":"algorithmic"},"gujr":{"digits":"૦૧૨૩૪૫૬૭૮૯","type":"numeric"},"guru":{"digits":"੦੧੨੩੪੫੬੭੮੯","type":"numeric"},"hanidays":{"rules":"zh/SpelloutRules/spellout-numbering-days","type":"algorithmic"},"hanidec":{"digits":"〇一二三四五六七八九","type":"numeric"},"hans":{"rules":"zh/SpelloutRules/spellout-cardinal","type":"algorithmic"},"hansfin":{"rules":"zh/SpelloutRules/spellout-cardinal-financial","type":"algorithmic"},"hant":{"rules":"zh_Hant/SpelloutRules/spellout-cardinal","type":"algorithmic"},"hantfin":{"rules":"zh_Hant/SpelloutRules/spellout-cardinal-financial","type":"algorithmic"},"hebr":{"rules":"hebrew","type":"algorithmic"},"java":{"digits":"꧐꧑꧒꧓꧔꧕꧖꧗꧘꧙","type":"numeric"},"jpan":{"rules":"ja/SpelloutRules/spellout-cardinal","type":"algorithmic"},"jpanfin":{"rules":"ja/SpelloutRules/spellout-cardinal-financial","type":"algorithmic"},"kali":{"digits":"꤀꤁꤂꤃꤄꤅꤆꤇꤈꤉","type":"numeric"},"khmr":{"digits":"០១២៣៤៥៦៧៨៩","type":"numeric"},"knda":{"digits":"೦೧೨೩೪೫೬೭೮೯","type":"numeric"},"lana":{"digits":"᪀᪁᪂᪃᪄᪅᪆᪇᪈᪉","type":"numeric"},"lanatham":{"digits":"᪐᪑᪒᪓᪔᪕᪖᪗᪘᪙","type":"numeric"},"laoo":{"digits":"໐໑໒໓໔໕໖໗໘໙","type":"numeric"},"latn":{"digits":"0123456789","type":"numeric"},"lepc":{"digits":"᱀᱁᱂᱃᱄᱅᱆᱇᱈᱉","type":"numeric"},"limb":{"digits":"᥆᥇᥈᥉᥊᥋᥌᥍᥎᥏","type":"numeric"},"mlym":{"digits":"൦൧൨൩൪൫൬൭൮൯","type":"numeric"},"mong":{"digits":"᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙","type":"numeric"},"mtei":{"digits":"꯰꯱꯲꯳꯴꯵꯶꯷꯸꯹","type":"numeric"},"mymr":{"digits":"၀၁၂၃၄၅၆၇၈၉","type":"numeric"},"mymrshan":{"digits":"႐႑႒႓႔႕႖႗႘႙","type":"numeric"},"nkoo":{"digits":"߀߁߂߃߄߅߆߇߈߉","type":"numeric"},"olck":{"digits":"᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙","type":"numeric"},"orya":{"digits":"୦୧୨୩୪୫୬୭୮୯","type":"numeric"},"osma":{"digits":"𐒠𐒡𐒢𐒣𐒤𐒥𐒦𐒧𐒨𐒩","type":"numeric"},"roman":{"rules":"roman-upper","type":"algorithmic"},"romanlow":{"rules":"roman-lower","type":"algorithmic"},"saur":{"digits":"꣐꣑꣒꣓꣔꣕꣖꣗꣘꣙","type":"numeric"},"shrd":{"digits":"𑇐𑇑𑇒𑇓𑇔𑇕𑇖𑇗𑇘𑇙","type":"numeric"},"sora":{"digits":"𑃰𑃱𑃲𑃳𑃴𑃵𑃶𑃷𑃸𑃹","type":"numeric"},"sund":{"digits":"᮰᮱᮲᮳᮴᮵᮶᮷᮸᮹","type":"numeric"},"takr":{"digits":"𑛀𑛁𑛂𑛃𑛄𑛅𑛆𑛇𑛈𑛉","type":"numeric"},"talu":{"digits":"᧐᧑᧒᧓᧔᧕᧖᧗᧘᧙","type":"numeric"},"taml":{"rules":"tamil","type":"algorithmic"},"tamldec":{"digits":"௦௧௨௩௪௫௬௭௮௯","type":"numeric"},"telu":{"digits":"౦౧౨౩౪౫౬౭౮౯","type":"numeric"},"thai":{"digits":"๐๑๒๓๔๕๖๗๘๙","type":"numeric"},"tibt":{"digits":"༠༡༢༣༤༥༦༧༨༩","type":"numeric"},"vaii":{"digits":"꘠꘡꘢꘣꘤꘥꘦꘧꘨꘩","type":"numeric"}};

    function NumberingSystems(name, digits) {
      this.name = name;
      this.digits = this.split_digits(digits);
    }

    NumberingSystems.prototype.split_digits = function(str) {
      return str.split('');
    };

    NumberingSystems.prototype.transliterate = function(number) {
      return (number + "").replace(/\d/g, (function(digit, position) {
        return this.digits[parseInt(digit)];
      }).bind(this));
    };

    return NumberingSystems;

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

    postal_codes = {"ad":"^AD\\d{3}$","am":"^(37)?\\d{4}$","ar":"^([A-HJ-NP-Z])?\\d{4}([A-Z]{3})?$","as":"^96799$","at":"^\\d{4}$","au":"^\\d{4}$","ax":"^22\\d{3}$","az":"^\\d{4}$","ba":"^\\d{5}$","bb":"^(BB\\d{5})?$","bd":"^\\d{4}$","be":"^\\d{4}$","bg":"^\\d{4}$","bh":"^((1[0-2]|[2-9])\\d{2})?$","bm":"^[A-Z]{2}[ ]?[A-Z0-9]{2}$","bn":"^[A-Z]{2}[ ]?\\d{4}$","br":"^\\d{5}[\\-]?\\d{3}$","by":"^\\d{6}$","ca":"^[ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z][ ]?\\d[ABCEGHJ-NPRSTV-Z]\\d$","cc":"^6799$","ch":"^\\d{4}$","ck":"^\\d{4}$","cl":"^\\d{7}$","cn":"^\\d{6}$","cr":"^\\d{4,5}|\\d{3}-\\d{4}$","cs":"^\\d{5}$","cv":"^\\d{4}$","cx":"^6798$","cy":"^\\d{4}$","cz":"^\\d{3}[ ]?\\d{2}$","de":"^\\d{5}$","dk":"^\\d{4}$","do":"^\\d{5}$","dz":"^\\d{5}$","ec":"^([A-Z]\\d{4}[A-Z]|(?:[A-Z]{2})?\\d{6})?$","ee":"^\\d{5}$","eg":"^\\d{5}$","es":"^\\d{5}$","et":"^\\d{4}$","fi":"^\\d{5}$","fk":"^FIQQ 1ZZ$","fm":"^(9694[1-4])([ \\-]\\d{4})?$","fo":"^\\d{3}$","fr":"^\\d{2}[ ]?\\d{3}$","gb":"^GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\\d{1,4}$","ge":"^\\d{4}$","gf":"^9[78]3\\d{2}$","gg":"^GY\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}$","gl":"^39\\d{2}$","gn":"^\\d{3}$","gp":"^9[78][01]\\d{2}$","gr":"^\\d{3}[ ]?\\d{2}$","gs":"^SIQQ 1ZZ$","gt":"^\\d{5}$","gu":"^969[123]\\d([ \\-]\\d{4})?$","gw":"^\\d{4}$","hm":"^\\d{4}$","hn":"^(?:\\d{5})?$","hr":"^\\d{5}$","ht":"^\\d{4}$","hu":"^\\d{4}$","id":"^\\d{5}$","il":"^\\d{5}$","im":"^IM\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}$","in":"^\\d{6}$","io":"^BBND 1ZZ$","iq":"^\\d{5}$","is":"^\\d{3}$","it":"^\\d{5}$","je":"^JE\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}$","jo":"^\\d{5}$","jp":"^\\d{3}-\\d{4}$","ke":"^\\d{5}$","kg":"^\\d{6}$","kh":"^\\d{5}$","kr":"^\\d{3}[\\-]\\d{3}$","kw":"^\\d{5}$","kz":"^\\d{6}$","la":"^\\d{5}$","lb":"^(\\d{4}([ ]?\\d{4})?)?$","li":"^(948[5-9])|(949[0-7])$","lk":"^\\d{5}$","lr":"^\\d{4}$","ls":"^\\d{3}$","lt":"^\\d{5}$","lu":"^\\d{4}$","lv":"^\\d{4}$","ma":"^\\d{5}$","mc":"^980\\d{2}$","md":"^\\d{4}$","me":"^8\\d{4}$","mg":"^\\d{3}$","mh":"^969[67]\\d([ \\-]\\d{4})?$","mk":"^\\d{4}$","mn":"^\\d{6}$","mp":"^9695[012]([ \\-]\\d{4})?$","mq":"^9[78]2\\d{2}$","mt":"^[A-Z]{3}[ ]?\\d{2,4}$","mu":"^(\\d{3}[A-Z]{2}\\d{3})?$","mv":"^\\d{5}$","mx":"^\\d{5}$","my":"^\\d{5}$","nc":"^988\\d{2}$","ne":"^\\d{4}$","nf":"^2899$","ng":"^(\\d{6})?$","ni":"^((\\d{4}-)?\\d{3}-\\d{3}(-\\d{1})?)?$","nl":"^\\d{4}[ ]?[A-Z]{2}$","no":"^\\d{4}$","np":"^\\d{5}$","nz":"^\\d{4}$","om":"^(PC )?\\d{3}$","pf":"^987\\d{2}$","pg":"^\\d{3}$","ph":"^\\d{4}$","pk":"^\\d{5}$","pl":"^\\d{2}-\\d{3}$","pm":"^9[78]5\\d{2}$","pn":"^PCRN 1ZZ$","pr":"^00[679]\\d{2}([ \\-]\\d{4})?$","pt":"^\\d{4}([\\-]\\d{3})?$","pw":"^96940$","py":"^\\d{4}$","re":"^9[78]4\\d{2}$","ro":"^\\d{6}$","rs":"^\\d{6}$","ru":"^\\d{6}$","sa":"^\\d{5}$","se":"^\\d{3}[ ]?\\d{2}$","sg":"^\\d{6}$","sh":"^(ASCN|STHL) 1ZZ$","si":"^\\d{4}$","sj":"^\\d{4}$","sk":"^\\d{3}[ ]?\\d{2}$","sm":"^4789\\d$","sn":"^\\d{5}$","so":"^\\d{5}$","sz":"^[HLMS]\\d{3}$","tc":"^TKCA 1ZZ$","th":"^\\d{5}$","tj":"^\\d{6}$","tm":"^\\d{6}$","tn":"^\\d{4}$","tr":"^\\d{5}$","tw":"^\\d{3}(\\d{2})?$","ua":"^\\d{5}$","us":"^\\d{5}([ \\-]\\d{4})?$","uy":"^\\d{5}$","uz":"^\\d{6}$","va":"^00120$","ve":"^\\d{4}$","vi":"^008(([0-4]\\d)|(5[01]))([ \\-]\\d{4})?$","wf":"^986\\d{2}$","xk":"^\\d{5}$","yt":"^976\\d{2}$","yu":"^\\d{5}$","za":"^\\d{4}$","zm":"^\\d{5}$"};

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
    function Languages() {}

    Languages.data = function() {
      return TwitterCldr.get_data().Languages;
    };

    Languages.all = function() {
      return this.data().all;
    };

    Languages.from_code = function(code) {
      return this.data().all[code] || null;
    };

    Languages.is_rtl = function(locale) {
      var result;
      result = this.data().rtl_data[locale];
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
      this.separator_chars = ['\\.', ',', '\\s'].join("");
    }

    NumberParser.data = function() {
      return TwitterCldr.get_data().NumberParser;
    };

    NumberParser.prototype.group_separator = function() {
      return this.constructor.data().group_separator;
    };

    NumberParser.prototype.decimal_separator = function() {
      return this.constructor.data().decimal_separator;
    };

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
      group = strict ? this.group_separator() : this.separator_chars;
      decimal = strict ? this.decimal_separator() : this.separator_chars;
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
      var r, recognizers, splitter, splitter_source;
      recognizers = [new TwitterCldr.TokenRecognizer("negative", new RegExp(/-x/)), new TwitterCldr.TokenRecognizer("improper_fraction", new RegExp(/x\.x/)), new TwitterCldr.TokenRecognizer("proper_fraction", new RegExp(/0\.x/)), new TwitterCldr.TokenRecognizer("master", new RegExp(/x\.0/)), new TwitterCldr.TokenRecognizer("equals", new RegExp(/\=/)), new TwitterCldr.TokenRecognizer("rule", TwitterCldr.RBNFTokenizer.get_rule_regexp()), new TwitterCldr.TokenRecognizer("right_arrow", new RegExp(/>/)), new TwitterCldr.TokenRecognizer("left_arrow", new RegExp(/</)), new TwitterCldr.TokenRecognizer("open_bracket", new RegExp(/\[/)), new TwitterCldr.TokenRecognizer("close_bracket", new RegExp(/\]/)), new TwitterCldr.TokenRecognizer("decimal", new RegExp(/[0#][0#,\.]+/)), new TwitterCldr.TokenRecognizer("plural", new RegExp(/\$\(.*\)\$/)), new TwitterCldr.TokenRecognizer("semicolon", new RegExp(/;/))];
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

    RBNFTokenizer.get_rule_regexp = function() {
      var component, word_regexp_components;
      if (this.rule_regexp != null) {
        return this.rule_regexp;
      }
      word_regexp_components = ["Ll", "Lm", "Lo", "Lt", "Lu", "Mc", "Me", "Mu", "Nd", "Nl", "No", "Pc", "Pd"];
      return this.rule_regexp = TwitterCldr.UnicodeRegex.compile("%%?[" + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = word_regexp_components.length; _i < _len; _i++) {
          component = word_regexp_components[_i];
          _results.push("[:" + component + ":]");
        }
        return _results;
      })()).join("") + "]*").to_regexp();
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

    NumberFormatter.data = function() {
      return TwitterCldr.get_data().NumberFormatter;
    };

    NumberFormatter.prototype.all_tokens = function() {
      return this.constructor.data().all_tokens;
    };

    NumberFormatter.prototype.symbols = function() {
      return this.constructor.data().symbols;
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
      this.default_currency_symbol = "$";
      this.default_precision = this.currencies_data().DEFAULT.digits;
      CurrencyFormatter.__super__.constructor.apply(this, arguments);
    }

    CurrencyFormatter.prototype.currencies_data = function() {
      return TwitterCldr.get_data().CurrencyFormatter.currencies_data;
    };

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
      return this.currencies_data()[currency] || this.currencies_data().DEFAULT;
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
      this.locale = locale != null ? locale : TwitterCldr.Settings.locale();
      this.default_spellout_options = {
        'rule_group': "SpelloutRules",
        'rule_set': "spellout-numbering"
      };
      this.rule_group_cache = {};
      this.rule_set_name_cache = {};
    }

    RBNF.data = function() {
      return TwitterCldr.get_data().RBNF;
    };

    RBNF.prototype.resource = function() {
      return this.constructor.data().resource;
    };

    RBNF.prototype.get_resource_for_locale = function(locale) {
      if (locale == null) {
        locale = this.locale;
      }
      return this.resource()[locale];
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
            throw "" + rule_set_name + " is a private rule set and cannot be used directly.";
          }
        } else {
          throw new TwitterCldr.NotImplementedException("rule set - " + rule_set_name + " - not implemented");
        }
      } else {
        throw new TwitterCldr.NotImplementedException("rule group - " + rule_group_name + " - not implemented");
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
    }

    NumberDataReader.data = function() {
      return TwitterCldr.get_data().NumberDataReader;
    };

    NumberDataReader.prototype.resource = function() {
      return this.constructor.data().resource;
    };

    NumberDataReader.prototype.traverse = function(path, obj) {
      if (obj == null) {
        obj = this.resource();
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
      return this.resource()[locale];
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
        locale = TwitterCldr.Settings.locale();
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

  TwitterCldr.set_data = function(bundle) {
    TwitterCldr.data = bundle;
    return null;
  };

  TwitterCldr.get_data = function() {
    if (TwitterCldr.data != null) {
      return TwitterCldr.data;
    } else {
      throw 'Data not set';
    }
  };

  TwitterCldr.is_data_set = function() {
    return TwitterCldr.data != null;
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : (this.TwitterCldr = {}, this.TwitterCldr);

  for (key in TwitterCldr) {
    obj = TwitterCldr[key];
    root[key] = obj;
  }

  if (this.TwitterCldrDataBundle != null) {
    TwitterCldr.set_data(this.TwitterCldrDataBundle);
  }

}).call(this);
