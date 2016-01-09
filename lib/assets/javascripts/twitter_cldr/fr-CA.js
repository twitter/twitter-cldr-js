
/*
// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

// TwitterCLDR (JavaScript) v3.0.0
// Authors:     Cameron Dutro [@camertron]
                Kirill Lashuk [@KL_7]
                portions by Sven Fuchs [@svenfuchs]
// Homepage:    https://twitter.com
// Description: Provides date, time, number, and list formatting functionality for various Twitter-supported locales in Javascript.
 */


/*-module-*/
/*_lib/twitter_cldr_*/

(function() {
  var TwitterCldrDataBundle, key, obj, root;

  TwitterCldrDataBundle = {
    "Settings": {
      "is_rtl": false,
      "locale": "fr-CA"
    },
    "PluralRules": {
      "rules": {
        "cardinal": "(function(num, runtime) { var n = runtime.n(num); var i = runtime.i(num); var v = runtime.v(num); var w = runtime.w(num); var f = runtime.f(num); var t = runtime.t(num); return (((i == 0) || (i == 1)) ? 'one' : 'other'); })",
        "ordinal": "(function(num, runtime) { var n = runtime.n(num); var i = runtime.i(num); var v = runtime.v(num); var w = runtime.w(num); var f = runtime.f(num); var t = runtime.t(num); return (n == 1 ? 'one' : 'other'); })"
      },
      "names": {
        "cardinal": ["one", "other"],
        "ordinal": ["one", "other"]
      }
    },
    "TimespanFormatter": {
      "patterns": {
        "ago": {
          "second": {
            "default": {
              "one": "Il y a {0} seconde",
              "other": "Il y a {0} secondes"
            }
          },
          "minute": {
            "default": {
              "one": "Il y a {0} minute",
              "other": "Il y a {0} minutes"
            }
          },
          "hour": {
            "default": {
              "one": "Il y a {0} heure",
              "other": "Il y a {0} heures"
            }
          },
          "day": {
            "default": {
              "one": "Il y a {0} jour",
              "other": "Il y a {0} jours"
            }
          },
          "week": {
            "default": {
              "one": "Il y a {0} semaine",
              "other": "Il y a {0} semaines"
            }
          },
          "month": {
            "default": {
              "one": "Il y a {0} mois",
              "other": "Il y a {0} mois"
            }
          },
          "year": {
            "default": {
              "one": "Il y a {0} an",
              "other": "Il y a {0} ans"
            }
          }
        },
        "until": {
          "second": {
            "default": {
              "one": "Dans {0} seconde",
              "other": "Dans {0} secondes"
            }
          },
          "minute": {
            "default": {
              "one": "Dans {0} minute",
              "other": "Dans {0} minutes"
            }
          },
          "hour": {
            "default": {
              "one": "Dans {0} heure",
              "other": "Dans {0} heures"
            }
          },
          "day": {
            "default": {
              "one": "Dans {0} jour",
              "other": "Dans {0} jours"
            }
          },
          "week": {
            "default": {
              "one": "Dans {0} semaine",
              "other": "Dans {0} semaines"
            }
          },
          "month": {
            "default": {
              "one": "Dans {0} mois",
              "other": "Dans {0} mois"
            }
          },
          "year": {
            "default": {
              "one": "Dans {0} an",
              "other": "Dans {0} ans"
            }
          }
        },
        "none": {
          "second": {
            "default": {
              "one": "{0} seconde",
              "other": "{0} secondes"
            },
            "short": {
              "one": "{0} s",
              "other": "{0} s"
            }
          },
          "minute": {
            "default": {
              "one": "{0} minute",
              "other": "{0} minutes"
            },
            "short": {
              "one": "{0} min",
              "other": "{0} min"
            }
          },
          "hour": {
            "default": {
              "one": "{0} heure",
              "other": "{0} heures"
            },
            "short": {
              "one": "{0} h",
              "other": "{0} h"
            }
          },
          "day": {
            "default": {
              "one": "{0} jour",
              "other": "{0} jours"
            },
            "short": {
              "one": "{0} j",
              "other": "{0} j"
            }
          },
          "week": {
            "default": {
              "one": "{0} semaine",
              "other": "{0} semaines"
            },
            "short": {
              "one": "{0} sem.",
              "other": "{0} sem."
            }
          },
          "month": {
            "default": {
              "one": "{0} mois",
              "other": "{0} mois"
            },
            "short": {
              "one": "{0} mois",
              "other": "{0} mois"
            }
          },
          "year": {
            "default": {
              "one": "{0} année",
              "other": "{0} années"
            },
            "short": {
              "one": "{0} an",
              "other": "{0} ans"
            }
          }
        }
      }
    },
    "DateTimeFormatter": {
      "tokens": {
        "date_time": {
          "default": [
            {
              "value": "y",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "MM",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "dd",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "ss",
              "type": "pattern"
            }
          ],
          "full": [
            {
              "value": "EEEE",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "d",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "MMMM",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "y",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "'à'",
              "type": "plaintext"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "'h'",
              "type": "plaintext"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "'min'",
              "type": "plaintext"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "ss",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "'s'",
              "type": "plaintext"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "zzzz",
              "type": "pattern"
            }
          ],
          "long": [
            {
              "value": "d",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "MMMM",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "y",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "'à'",
              "type": "plaintext"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "ss",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "z",
              "type": "pattern"
            }
          ],
          "medium": [
            {
              "value": "y",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "MM",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "dd",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "ss",
              "type": "pattern"
            }
          ],
          "short": [
            {
              "value": "yy",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "MM",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "dd",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }
          ],
          "additional": {
            "E": [
              {
                "value": "E",
                "type": "pattern"
              }
            ],
            "EHm": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }
            ],
            "EHms": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }
            ],
            "Ed": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }
            ],
            "Ehm": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "h",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "Ehms": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "h",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "Gy": [
              {
                "value": "y",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "G",
                "type": "pattern"
              }
            ],
            "GyMMM": [
              {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "G",
                "type": "pattern"
              }
            ],
            "GyMMMEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "G",
                "type": "pattern"
              }
            ],
            "GyMMMd": [
              {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "G",
                "type": "pattern"
              }
            ],
            "H": [
              {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": " 'h'",
                "type": "plaintext"
              }
            ],
            "Hm": [
              {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }
            ],
            "Hms": [
              {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }
            ],
            "M": [
              {
                "value": "L",
                "type": "pattern"
              }
            ],
            "MEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "M",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }
            ],
            "MMM": [
              {
                "value": "LLL",
                "type": "pattern"
              }
            ],
            "MMMEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }
            ],
            "MMMd": [
              {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }
            ],
            "MMd": [
              {
                "value": "MM",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }
            ],
            "MMdd": [
              {
                "value": "MM",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "dd",
                "type": "pattern"
              }
            ],
            "Md": [
              {
                "value": "M",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }
            ],
            "d": [
              {
                "value": "d",
                "type": "pattern"
              }
            ],
            "h": [
              {
                "value": "h",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "hm": [
              {
                "value": "h",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "hms": [
              {
                "value": "h",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "ms": [
              {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }
            ],
            "y": [
              {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yM": [
              {
                "value": "y",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "MM",
                "type": "pattern"
              }
            ],
            "yMEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "MM",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "dd",
                "type": "pattern"
              }
            ],
            "yMM": [
              {
                "value": "y",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "MM",
                "type": "pattern"
              }
            ],
            "yMMM": [
              {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yMMMEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yMMMM": [
              {
                "value": "MMMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yMMMd": [
              {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yMd": [
              {
                "value": "y",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "MM",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "dd",
                "type": "pattern"
              }
            ],
            "yQQQ": [
              {
                "value": "QQQ",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yQQQQ": [
              {
                "value": "QQQQ",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ]
          }
        },
        "time": {
          "default": [
            {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "ss",
              "type": "pattern"
            }
          ],
          "full": [
            {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "'h'",
              "type": "plaintext"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "'min'",
              "type": "plaintext"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "ss",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "'s'",
              "type": "plaintext"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "zzzz",
              "type": "pattern"
            }
          ],
          "long": [
            {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "ss",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "z",
              "type": "pattern"
            }
          ],
          "medium": [
            {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "ss",
              "type": "pattern"
            }
          ],
          "short": [
            {
              "value": "HH",
              "type": "pattern"
            }, {
              "value": ":",
              "type": "plaintext"
            }, {
              "value": "mm",
              "type": "pattern"
            }
          ],
          "additional": {
            "E": [
              {
                "value": "E",
                "type": "plaintext"
              }
            ],
            "EHm": [
              {
                "value": "E ",
                "type": "plaintext"
              }, {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }
            ],
            "EHms": [
              {
                "value": "E ",
                "type": "plaintext"
              }, {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }
            ],
            "Ed": [
              {
                "value": "E d",
                "type": "plaintext"
              }
            ],
            "Ehm": [
              {
                "value": "E ",
                "type": "plaintext"
              }, {
                "value": "h",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "Ehms": [
              {
                "value": "E ",
                "type": "plaintext"
              }, {
                "value": "h",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "Gy": [
              {
                "value": "y G",
                "type": "plaintext"
              }
            ],
            "GyMMM": [
              {
                "value": "MMM y G",
                "type": "plaintext"
              }
            ],
            "GyMMMEd": [
              {
                "value": "E d MMM y G",
                "type": "plaintext"
              }
            ],
            "GyMMMd": [
              {
                "value": "d MMM y G",
                "type": "plaintext"
              }
            ],
            "H": [
              {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "'h'",
                "type": "plaintext"
              }
            ],
            "Hm": [
              {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }
            ],
            "Hms": [
              {
                "value": "HH",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }
            ],
            "M": [
              {
                "value": "L",
                "type": "plaintext"
              }
            ],
            "MEd": [
              {
                "value": "E M-d",
                "type": "plaintext"
              }
            ],
            "MMM": [
              {
                "value": "LLL",
                "type": "plaintext"
              }
            ],
            "MMMEd": [
              {
                "value": "E d MMM",
                "type": "plaintext"
              }
            ],
            "MMMd": [
              {
                "value": "d MMM",
                "type": "plaintext"
              }
            ],
            "MMd": [
              {
                "value": "MM-d",
                "type": "plaintext"
              }
            ],
            "MMdd": [
              {
                "value": "MM-dd",
                "type": "plaintext"
              }
            ],
            "Md": [
              {
                "value": "M-d",
                "type": "plaintext"
              }
            ],
            "d": [
              {
                "value": "d",
                "type": "plaintext"
              }
            ],
            "h": [
              {
                "value": "h",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "hm": [
              {
                "value": "h",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "hms": [
              {
                "value": "h",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "a",
                "type": "pattern"
              }
            ],
            "ms": [
              {
                "value": "mm",
                "type": "pattern"
              }, {
                "value": ":",
                "type": "plaintext"
              }, {
                "value": "ss",
                "type": "pattern"
              }
            ],
            "y": [
              {
                "value": "y",
                "type": "plaintext"
              }
            ],
            "yM": [
              {
                "value": "y-MM",
                "type": "plaintext"
              }
            ],
            "yMEd": [
              {
                "value": "E y-MM-dd",
                "type": "plaintext"
              }
            ],
            "yMM": [
              {
                "value": "y-MM",
                "type": "plaintext"
              }
            ],
            "yMMM": [
              {
                "value": "MMM y",
                "type": "plaintext"
              }
            ],
            "yMMMEd": [
              {
                "value": "E d MMM y",
                "type": "plaintext"
              }
            ],
            "yMMMM": [
              {
                "value": "MMMM y",
                "type": "plaintext"
              }
            ],
            "yMMMd": [
              {
                "value": "d MMM y",
                "type": "plaintext"
              }
            ],
            "yMd": [
              {
                "value": "y-MM-dd",
                "type": "plaintext"
              }
            ],
            "yQQQ": [
              {
                "value": "QQQ y",
                "type": "plaintext"
              }
            ],
            "yQQQQ": [
              {
                "value": "QQQQ y",
                "type": "plaintext"
              }
            ]
          }
        },
        "date": {
          "default": [
            {
              "value": "y",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "MM",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "dd",
              "type": "pattern"
            }
          ],
          "full": [
            {
              "value": "EEEE",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "d",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "MMMM",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "y",
              "type": "pattern"
            }
          ],
          "long": [
            {
              "value": "d",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "MMMM",
              "type": "pattern"
            }, {
              "value": " ",
              "type": "plaintext"
            }, {
              "value": "y",
              "type": "pattern"
            }
          ],
          "medium": [
            {
              "value": "y",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "MM",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "dd",
              "type": "pattern"
            }
          ],
          "short": [
            {
              "value": "yy",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "MM",
              "type": "pattern"
            }, {
              "value": "-",
              "type": "plaintext"
            }, {
              "value": "dd",
              "type": "pattern"
            }
          ],
          "additional": {
            "E": [
              {
                "value": "E",
                "type": "pattern"
              }
            ],
            "EHm": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " HH:mm",
                "type": "plaintext"
              }
            ],
            "EHms": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " HH:mm:ss",
                "type": "plaintext"
              }
            ],
            "Ed": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }
            ],
            "Ehm": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " h:mm a",
                "type": "plaintext"
              }
            ],
            "Ehms": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " h:mm:ss a",
                "type": "plaintext"
              }
            ],
            "Gy": [
              {
                "value": "y",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "G",
                "type": "pattern"
              }
            ],
            "GyMMM": [
              {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "G",
                "type": "pattern"
              }
            ],
            "GyMMMEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "G",
                "type": "pattern"
              }
            ],
            "GyMMMd": [
              {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "G",
                "type": "pattern"
              }
            ],
            "H": [
              {
                "value": "HH",
                "type": "plaintext"
              }, {
                "value": " 'h'",
                "type": "plaintext"
              }
            ],
            "Hm": [
              {
                "value": "HH:mm",
                "type": "plaintext"
              }
            ],
            "Hms": [
              {
                "value": "HH:mm:ss",
                "type": "plaintext"
              }
            ],
            "M": [
              {
                "value": "L",
                "type": "pattern"
              }
            ],
            "MEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "M",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }
            ],
            "MMM": [
              {
                "value": "LLL",
                "type": "pattern"
              }
            ],
            "MMMEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }
            ],
            "MMMd": [
              {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }
            ],
            "MMd": [
              {
                "value": "MM",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }
            ],
            "MMdd": [
              {
                "value": "MM",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "dd",
                "type": "pattern"
              }
            ],
            "Md": [
              {
                "value": "M",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }
            ],
            "d": [
              {
                "value": "d",
                "type": "pattern"
              }
            ],
            "h": [
              {
                "value": "h a",
                "type": "plaintext"
              }
            ],
            "hm": [
              {
                "value": "h:mm a",
                "type": "plaintext"
              }
            ],
            "hms": [
              {
                "value": "h:mm:ss a",
                "type": "plaintext"
              }
            ],
            "ms": [
              {
                "value": "mm:ss",
                "type": "plaintext"
              }
            ],
            "y": [
              {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yM": [
              {
                "value": "y",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "MM",
                "type": "pattern"
              }
            ],
            "yMEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "MM",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "dd",
                "type": "pattern"
              }
            ],
            "yMM": [
              {
                "value": "y",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "MM",
                "type": "pattern"
              }
            ],
            "yMMM": [
              {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yMMMEd": [
              {
                "value": "E",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yMMMM": [
              {
                "value": "MMMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yMMMd": [
              {
                "value": "d",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "MMM",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yMd": [
              {
                "value": "y",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "MM",
                "type": "pattern"
              }, {
                "value": "-",
                "type": "plaintext"
              }, {
                "value": "dd",
                "type": "pattern"
              }
            ],
            "yQQQ": [
              {
                "value": "QQQ",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ],
            "yQQQQ": [
              {
                "value": "QQQQ",
                "type": "pattern"
              }, {
                "value": " ",
                "type": "plaintext"
              }, {
                "value": "y",
                "type": "pattern"
              }
            ]
          }
        }
      }
    },
    "BreakIterator": {
      "tailoring_resource_data": {
        "en": {
          "en": {
            "segments": {
              "SentenceBreak": {
                "rules": [
                  {
                    "id": 9,
                    "value": " ( $STerm | $ATerm ) $Close* ÷ ( $Close | $Sp | $Sep | $CR | $LF ) "
                  }
                ]
              }
            }
          }
        }
      },
      "exceptions_resource_data": {
        "de": {
          "de": {
            "exceptions": ["A.", "A.M.", "Abs.", "Abt.", "Abw.", "Adj.", "Adr.", "Akt.", "Allg.", "Alt.", "App.", "Apr.", "Art.", "Aug.", "Ausg.", "Ausschl.", "B.", "Bed.", "Ben.", "Ber.", "Best.", "Bibl.", "C.", "Ca.", "Chin.", "Chr.", "Co.", "D.", "D. h.", "Dat.", "Dez.", "Dim.", "Dipl.-Ing.", "Dipl.-Kfm.", "Dir.", "Dr.", "Dtzd.", "Einh.", "Erf.", "Evtl.", "F.", "F.f.", "Fa.", "Fam.", "Fn.", "Folg.", "Forts. f.", "Fr.", "Frl.", "G.", "Gebr.", "Gem.", "Geograph.", "Ges.", "Gesch.", "Ggf.", "Hbf.", "Hptst.", "Hr./Hrn.", "Hrsg.", "I.", "Inc.", "Ing.", "Inh.", "Int.", "J.", "J.D.", "Jahrh.", "Jan.", "Jr.", "Kap.", "Kfm.", "Kl.", "Konv.", "Kop.", "L.", "Ltd.", "M.", "Max.", "Min.", "Mind.", "Mio.", "Mod.", "Mrd.", "Msp.", "N.", "Nov.", "Nr.", "O.", "Obj.", "Okt.", "Op.", "P.", "P.M.", "PIN.", "Pfd.", "Phys.", "Port.", "Prot.", "Proz.", "Qu.", "R.", "Rd.", "Reg.", "Reg.-Bez.", "Rel.", "Rep.", "S.A.", "Schr.", "Sek.", "Sept.", "Spezif.", "St.", "StR.", "Std.", "Str.", "T.", "Tel.", "Temp.", "Test.", "Trans.", "Tägl.", "U.", "U. U.", "U.S.", "U.S.A.", "U.U.", "Urspr.", "Ursprüngl.", "Verf.", "Vgl.", "W.", "Wg.", "Y.", "Z.", "Z. B.", "Z. Zt.", "Ztr.", "a.D.", "a.M.", "a.Rh.", "a.a.O.", "a.a.S.", "am.", "amtl.", "b.", "beil.", "d.J.", "d.Ä.", "e.V.", "e.Wz.", "e.h.", "ehem.", "eigtl.", "einschl.", "entspr.", "erw.", "ev.", "evtl.", "exkl.", "frz.", "geb.", "gedr.", "gek.", "gesch.", "gest.", "ggf./ggfs.", "hpts.", "i.A.", "i.B.", "i.H.", "i.J.", "i.R.", "i.V.", "inkl.", "jew.", "jhrl.", "k. u. k.", "k.u.k.", "kath.", "kfm.", "kgl.", "led.", "m.E.", "m.W.", "mtl.", "möbl.", "n.u.Z.", "näml.", "o.A.", "o.B.", "o.g.", "od.", "p.Adr.", "r.", "röm.", "röm.-kath.", "s.", "s.a.", "schles.", "schweiz.", "schwäb.", "sog.", "südd.", "tägl.", "u.", "u.A.w.g.", "u.U.", "u.a.", "u.v.a.", "u.Ä.", "u.ä.", "v. H.", "v.Chr.", "v.H.", "v.R.w.", "v.T.", "v.u.Z.", "verh.", "verw.", "vgl.", "z.", "z.B.", "z.Hd.", "z.Z.", "zzgl.", "österr."]
          }
        },
        "en": {
          "en": {
            "exceptions": ["A.", "A.D.", "A.M.", "A.S.", "AA.", "AB.", "AD.", "Abs.", "Act.", "Adj.", "Adv.", "All.", "Alt.", "Approx.", "As.", "Aug.", "B.", "B.V.", "By.", "C.F.", "C.O.D.", "Cap.", "Capt.", "Card.", "Col.", "Comm.", "Conn.", "Cont.", "D.", "D.A.", "D.C.", "DC.", "Dec.", "Def.", "Dept.", "Diff.", "Do.", "E.", "E.G.", "E.g.", "Ed.", "Est.", "Etc.", "Ex.", "Exec.", "F.", "Feb.", "Fn.", "Fri.", "G.", "Gb.", "Go.", "Hat.", "Hon.B.A.", "Hz.", "I.", "I.D.", "I.T.", "I.e.", "Id.", "In.", "Is.", "J.B.", "J.D.", "J.K.", "Jam.", "Jan.", "Job.", "Joe.", "Jun.", "K.", "K.R.", "Kb.", "L.", "L.A.", "L.P.", "Lev.", "Lib.", "Link.", "Long.", "Lt.", "Lt.Cdr.", "M.", "M.I.T.", "M.R.", "M.T.", "MR.", "Maj.", "Mar.", "Mart.", "Mb.", "Md.", "Mgr.", "Min.", "Misc.", "Mr.", "Mrs.", "Ms.", "Mt.", "N.V.", "N.Y.", "Nov.", "Nr.", "Num.", "O.", "OK.", "Ok.", "On.", "Op.", "Or.", "Org.", "P.M.", "P.O.", "P.V.", "PC.", "PP.", "Ph.D.", "Phys.", "Pro.", "Prof.", "Pvt.", "Q.", "R.L.", "R.T.", "Rep.", "Rev.", "S.", "S.A.", "S.A.R.", "S.E.", "S.p.A.", "Sep.", "Sept.", "Sgt.", "Sq.", "T.", "To.", "U.", "U.S.", "U.S.A.", "U.S.C.", "Up.", "VS.", "Var.", "X.", "Yr.", "Z.", "a.m.", "exec.", "pp.", "vs."]
          }
        },
        "es": {
          "es": {
            "exceptions": ["A.C.", "AA.", "All.", "Ant.", "Av.", "Avda.", "Bien.", "C.", "C.P.", "C.S.", "C.V.", "CA.", "Col.", "Comm.", "Corp.", "Cía.", "D.", "DC.", "Da.", "Desc.", "Desv.", "Dr.", "Dra.", "Drs.", "Dto.", "Dª.", "Dña.", "Em.", "Emm.", "Exc.", "Excma.", "Excmas.", "Excmo.", "Excmos.", "Exma.", "Exmas.", "Exmo.", "Exmos.", "FF.CC.", "Fabric.", "Fr.", "H.P.", "Id.", "Ilma.", "Ilmas.", "Ilmo.", "Ilmos.", "Inc.", "JJ.OO.", "K.", "Kit.", "Korn.", "L.", "Lcda.", "Lcdo.", "Lda.", "Ldo.", "Lic.", "Ltd.", "Ltda.", "Ltdo.", "M.", "MM.", "Mons.", "Mr.", "Mrs.", "O.M.", "PP.", "R.D.", "R.U.", "RAM.", "RR.HH.", "Rdo.", "Rdos.", "Reg.", "Rev.", "Rol.", "Rvdmo.", "Rvdmos.", "Rvdo.", "Rvdos.", "SA.", "SS.AA.", "SS.MM.", "Sdad.", "Seg.", "Sol.", "Sr.", "Sra.", "Sras.", "Sres.", "Srta.", "Srtas.", "Sta.", "Sto.", "Trab.", "U.S.", "U.S.A.", "Var.", "Vda.", "afma.", "afmas.", "afmo.", "afmos.", "bco.", "bol.", "c/c.", "cap.", "cf.", "cfr.", "col.", "depto.", "deptos.", "doc.", "dpto.", "dptos.", "dtor.", "e.g.", "ed.", "ej.", "fig.", "figs.", "fund.", "hnos.", "licda.", "licdo.", "ms.", "mss.", "mtro.", "ntra.", "ntro.", "p.ej.", "prof.", "prov.", "sras.", "sres.", "srs.", "ss.", "trad.", "v.gr.", "vid.", "vs."]
          }
        },
        "fr": {
          "fr": {
            "exceptions": ["All.", "C.", "Comm.", "D.", "DC.", "Desc.", "Inc.", "Jr.", "L.", "M.", "MM.", "Mart.", "Op.", "P.", "P.-D. G.", "P.O.", "Prof.", "S.A.", "S.M.A.R.T.", "U.", "U.S.", "U.S.A.", "Var.", "W.", "acoust.", "adr.", "anc.", "ann.", "anon.", "append.", "aux.", "broch.", "bull.", "cam.", "categ.", "coll.", "collab.", "config.", "dest.", "dict.", "dir.", "doc.", "encycl.", "exempl.", "fig.", "gouv.", "graph.", "hôp.", "ill.", "illustr.", "imm.", "imprim.", "indus.", "niv.", "quart.", "réf.", "symb.", "synth.", "syst.", "trav. publ.", "voit.", "éd.", "édit.", "équiv.", "éval."]
          }
        },
        "it": {
          "it": {
            "exceptions": ["C.P.", "Cfr.", "D.", "DC.", "Geom.", "Ing.", "L.", "Liv.", "Ltd.", "Mod.", "N.B.", "N.d.A.", "N.d.E.", "N.d.T.", "O.d.G.", "S.A.R.", "S.M.A.R.T.", "S.p.A.", "Sig.", "U.S.", "U.S.A.", "a.C.", "ag.", "all.", "arch.", "avv.", "c.c.p.", "d.C.", "d.p.R.", "div.", "dott.", "dr.", "fig.", "int.", "mitt.", "on.", "p.", "p.i.", "pag.", "rag.", "sez.", "tab.", "tav.", "ver.", "vol."]
          }
        },
        "pt": {
          "pt": {
            "exceptions": ["A.C.", "Alm.", "Av.", "D.C", "Dir.", "Dr.", "Dra.", "Dras.", "Drs.", "E.", "Est.", "Exma.", "Exmo.", "Fr.", "Ilma.", "Ilmo.", "Jr.", "Ltd.", "Ltda.", "Mar.", "N.Sra.", "N.T.", "Pe.", "Ph.D.", "R.", "S.", "S.A.", "Sta.", "Sto.", "V.T.", "W.C.", "a.C.", "a.m. ; A.M", "abr.", "abrev.", "adm.", "aer.", "ago.", "agric.", "anat.", "ap.", "apart.", "apt.", "arit.", "arqueol.", "arquit.", "astron.", "autom.", "aux.", "biogr.", "bras.", "cap.", "caps.", "cat.", "cel.", "cf.", "col.", "com.", "comp.", "compl.", "cont.", "contab.", "créd.", "cx.", "círc.", "cód.", "d.C.", "des.", "desc.", "dez.", "dipl.", "dir.", "div.", "doc.", "déb.", "ed.", "educ.", "elem.", "eletr.", "eletrôn.", "end.", "eng.", "esp.", "ex.", "f.", "fac.", "fasc.", "fem.", "fev.", "ff.", "fig.", "fil.", "filos.", "fisiol.", "fl.", "fot.", "fr.", "fís.", "geom.", "gram.", "gên.", "hist.", "ind.", "ingl.", "jan.", "jul.", "jun.", "jur.", "l.", "lat.", "lin.", "lit.", "liter.", "long.", "mai.", "mar.", "mat.", "matem.", "mov.", "máq.", "méd.", "mús.", "neol.", "nov.", "náut.", "obs.", "odont.", "odontol.", "org.", "organiz.", "out.", "p.", "p. ex.", "p.m. ; P.M.", "pal.", "pol.", "port.", "pp.", "pq.", "prod.", "prof.", "profa.", "pron.", "próx.", "psicol.", "pág.", "quím.", "r.s.v.p.", "ref.", "rel.", "relat.", "rementente", "rep.", "res.", "rod.", "set.", "sociol.", "sup.", "séc.", "símb.", "tec.", "tecnol.", "tel.", "trad.", "transp.", "univ.", "vol.", "vs.", "álg.", "índ."]
          }
        },
        "ru": {
          "ru": {
            "exceptions": ["кв.", "отд.", "проф.", "руб.", "тел.", "тыс.", "ул."]
          }
        }
      },
      "root_resource": {
        "segments": {
          "GraphemeClusterBreak": {
            "rules": [
              {
                "id": 3,
                "value": " $CR × $LF "
              }, {
                "id": 4,
                "value": " ( $Control | $CR | $LF ) ÷ "
              }, {
                "id": 5,
                "value": " ÷ ( $Control | $CR | $LF ) "
              }, {
                "id": 6,
                "value": " $L × ( $L | $V | $LV | $LVT ) "
              }, {
                "id": 7,
                "value": " ( $LV | $V ) × ( $V | $T ) "
              }, {
                "id": 8,
                "value": " ( $LVT | $T) × $T "
              }, {
                "id": "8.1",
                "value": " $Regional_Indicator × $Regional_Indicator "
              }, {
                "id": 9,
                "value": " × $Extend "
              }, {
                "id": "9.1",
                "value": " × $SpacingMark "
              }
            ],
            "variables": [
              {
                "id": "$CR",
                "value": "\\p{Grapheme_Cluster_Break=CR}"
              }, {
                "id": "$LF",
                "value": "\\p{Grapheme_Cluster_Break=LF}"
              }, {
                "id": "$Control",
                "value": "\\p{Grapheme_Cluster_Break=Control}"
              }, {
                "id": "$Extend",
                "value": "\\p{Grapheme_Cluster_Break=Extend}"
              }, {
                "id": "$SpacingMark",
                "value": "\\p{Grapheme_Cluster_Break=SpacingMark}"
              }, {
                "id": "$L",
                "value": "\\p{Grapheme_Cluster_Break=L}"
              }, {
                "id": "$V",
                "value": "\\p{Grapheme_Cluster_Break=V}"
              }, {
                "id": "$T",
                "value": "\\p{Grapheme_Cluster_Break=T}"
              }, {
                "id": "$LV",
                "value": "\\p{Grapheme_Cluster_Break=LV}"
              }, {
                "id": "$LVT",
                "value": "\\p{Grapheme_Cluster_Break=LVT}"
              }, {
                "id": "$Regional_Indicator",
                "value": "\\p{Grapheme_Cluster_Break=Regional_Indicator}"
              }
            ]
          },
          "LineBreak": {
            "rules": [
              {
                "id": 4,
                "value": " $BK ÷ "
              }, {
                "id": "5.01",
                "value": " $CR × $LF "
              }, {
                "id": "5.02",
                "value": " $CR ÷ "
              }, {
                "id": "5.03",
                "value": " $LF ÷ "
              }, {
                "id": "5.04",
                "value": " $NL ÷ "
              }, {
                "id": 6,
                "value": " × ( $BK | $CR | $LF | $NL ) "
              }, {
                "id": "7.01",
                "value": " × $SP "
              }, {
                "id": "7.02",
                "value": " × $ZW "
              }, {
                "id": 8,
                "value": " $ZW $SP* ÷ "
              }, {
                "id": 9,
                "value": " $Spec2_ × $CM "
              }, {
                "id": "11.01",
                "value": " × $WJ "
              }, {
                "id": "11.02",
                "value": " $WJ × "
              }, {
                "id": 12,
                "value": " $GL × "
              }, {
                "id": "12.1",
                "value": " $Spec3a_ × $GL "
              }, {
                "id": "12.2",
                "value": " $Spec3b_ $CM+ × $GL "
              }, {
                "id": "12.3",
                "value": " ^ $CM+ × $GL "
              }, {
                "id": "13.01",
                "value": " × $EX "
              }, {
                "id": "13.02",
                "value": " $Spec4_ × ($CL | $CP | $IS | $SY) "
              }, {
                "id": "13.03",
                "value": " $Spec4_ $CM+ × ($CL | $CP | $IS | $SY) "
              }, {
                "id": "13.04",
                "value": " ^ $CM+ × ($CL | $CP | $IS | $SY) "
              }, {
                "id": 14,
                "value": " $OP $SP* × "
              }, {
                "id": 15,
                "value": " $QU $SP* × $OP "
              }, {
                "id": 16,
                "value": " ($CL | $CP) $SP* × $NS "
              }, {
                "id": 17,
                "value": " $B2 $SP* × $B2 "
              }, {
                "id": 18,
                "value": " $SP ÷ "
              }, {
                "id": "19.01",
                "value": " × $QU "
              }, {
                "id": "19.02",
                "value": " $QU × "
              }, {
                "id": "20.01",
                "value": " ÷ $CB "
              }, {
                "id": "20.02",
                "value": " $CB ÷ "
              }, {
                "id": "21.01",
                "value": " × $BA "
              }, {
                "id": "21.02",
                "value": " × $HY "
              }, {
                "id": "21.03",
                "value": " × $NS "
              }, {
                "id": "21.04",
                "value": " $BB × "
              }, {
                "id": "21.1",
                "value": " $HL ($HY | $BA) × "
              }, {
                "id": "21.2",
                "value": " $SY × $HL "
              }, {
                "id": "22.01",
                "value": " ($AL | $HL) × $IN "
              }, {
                "id": "22.02",
                "value": " $ID × $IN "
              }, {
                "id": "22.03",
                "value": " $IN × $IN "
              }, {
                "id": "22.04",
                "value": " $NU × $IN "
              }, {
                "id": "23.01",
                "value": " $ID × $PO "
              }, {
                "id": "23.02",
                "value": " ($AL | $HL) × $NU "
              }, {
                "id": "23.03",
                "value": " $NU × ($AL | $HL) "
              }, {
                "id": "24.01",
                "value": " $PR × $ID "
              }, {
                "id": "24.02",
                "value": " $PR × ($AL | $HL) "
              }, {
                "id": "24.03",
                "value": " $PO × ($AL | $HL) "
              }, {
                "id": "25.01",
                "value": " ($PR | $PO) × ( $OP | $HY )? $NU "
              }, {
                "id": "25.02",
                "value": " ( $OP | $HY ) × $NU "
              }, {
                "id": "25.03",
                "value": " $NU × ($NU | $SY | $IS) "
              }, {
                "id": "25.04",
                "value": " $NU ($NU | $SY | $IS)* × ($NU | $SY | $IS | $CL | $CP) "
              }, {
                "id": "25.05",
                "value": " $NU ($NU | $SY | $IS)* ($CL | $CP)? × ($PO | $PR) "
              }, {
                "id": "26.01",
                "value": " $JL × $JL | $JV | $H2 | $H3 "
              }, {
                "id": "26.02",
                "value": " $JV | $H2 × $JV | $JT "
              }, {
                "id": "26.03",
                "value": " $JT | $H3 × $JT "
              }, {
                "id": "27.01",
                "value": " $JL | $JV | $JT | $H2 | $H3 × $IN "
              }, {
                "id": "27.02",
                "value": " $JL | $JV | $JT | $H2 | $H3 × $PO "
              }, {
                "id": "27.03",
                "value": " $PR × $JL | $JV | $JT | $H2 | $H3 "
              }, {
                "id": 28,
                "value": " ($AL | $HL) × ($AL | $HL) "
              }, {
                "id": 29,
                "value": " $IS × ($AL | $HL) "
              }, {
                "id": "30.01",
                "value": " ($AL | $HL | $NU) × $OP "
              }, {
                "id": "30.02",
                "value": " $CP × ($AL | $HL | $NU) "
              }, {
                "id": "30.11",
                "value": " $RI × $RI "
              }
            ],
            "variables": [
              {
                "id": "$AI",
                "value": "\\p{Line_Break=Ambiguous}"
              }, {
                "id": "$AL",
                "value": "\\p{Line_Break=Alphabetic}"
              }, {
                "id": "$B2",
                "value": "\\p{Line_Break=Break_Both}"
              }, {
                "id": "$BA",
                "value": "\\p{Line_Break=Break_After}"
              }, {
                "id": "$BB",
                "value": "\\p{Line_Break=Break_Before}"
              }, {
                "id": "$BK",
                "value": "\\p{Line_Break=Mandatory_Break}"
              }, {
                "id": "$CB",
                "value": "\\p{Line_Break=Contingent_Break}"
              }, {
                "id": "$CL",
                "value": "\\p{Line_Break=Close_Punctuation}"
              }, {
                "id": "$CP",
                "value": "\\p{Line_Break=CP}"
              }, {
                "id": "$CM",
                "value": "\\p{Line_Break=Combining_Mark}"
              }, {
                "id": "$CR",
                "value": "\\p{Line_Break=Carriage_Return}"
              }, {
                "id": "$EX",
                "value": "\\p{Line_Break=Exclamation}"
              }, {
                "id": "$GL",
                "value": "\\p{Line_Break=Glue}"
              }, {
                "id": "$H2",
                "value": "\\p{Line_Break=H2}"
              }, {
                "id": "$H3",
                "value": "\\p{Line_Break=H3}"
              }, {
                "id": "$HL",
                "value": "\\p{Line_Break=HL}"
              }, {
                "id": "$HY",
                "value": "\\p{Line_Break=Hyphen}"
              }, {
                "id": "$ID",
                "value": "\\p{Line_Break=Ideographic}"
              }, {
                "id": "$IN",
                "value": "\\p{Line_Break=Inseparable}"
              }, {
                "id": "$IS",
                "value": "\\p{Line_Break=Infix_Numeric}"
              }, {
                "id": "$JL",
                "value": "\\p{Line_Break=JL}"
              }, {
                "id": "$JT",
                "value": "\\p{Line_Break=JT}"
              }, {
                "id": "$JV",
                "value": "\\p{Line_Break=JV}"
              }, {
                "id": "$LF",
                "value": "\\p{Line_Break=Line_Feed}"
              }, {
                "id": "$NL",
                "value": "\\p{Line_Break=Next_Line}"
              }, {
                "id": "$NS",
                "value": "\\p{Line_Break=Nonstarter}"
              }, {
                "id": "$NU",
                "value": "\\p{Line_Break=Numeric}"
              }, {
                "id": "$OP",
                "value": "\\p{Line_Break=Open_Punctuation}"
              }, {
                "id": "$PO",
                "value": "\\p{Line_Break=Postfix_Numeric}"
              }, {
                "id": "$PR",
                "value": "\\p{Line_Break=Prefix_Numeric}"
              }, {
                "id": "$QU",
                "value": "\\p{Line_Break=Quotation}"
              }, {
                "id": "$SA",
                "value": "\\p{Line_Break=Complex_Context}"
              }, {
                "id": "$SG",
                "value": "\\p{Line_Break=Surrogate}"
              }, {
                "id": "$SP",
                "value": "\\p{Line_Break=Space}"
              }, {
                "id": "$SY",
                "value": "\\p{Line_Break=Break_Symbols}"
              }, {
                "id": "$WJ",
                "value": "\\p{Line_Break=Word_Joiner}"
              }, {
                "id": "$XX",
                "value": "\\p{Line_Break=Unknown}"
              }, {
                "id": "$ZW",
                "value": "\\p{Line_Break=ZWSpace}"
              }, {
                "id": "$CJ",
                "value": "\\p{Line_Break=Conditional_Japanese_Starter}"
              }, {
                "id": "$RI",
                "value": "\\p{Line_Break=Regional_Indicator}"
              }, {
                "id": "$AL",
                "value": "[$AI $AL $XX $SA $SG]"
              }, {
                "id": "$NS",
                "value": "[$NS $CJ]"
              }, {
                "id": "$X",
                "value": "$CM*"
              }, {
                "id": "$Spec1_",
                "value": "[$SP $BK $CR $LF $NL $ZW]"
              }, {
                "id": "$Spec2_",
                "value": "[^ $SP $BK $CR $LF $NL $ZW]"
              }, {
                "id": "$Spec3a_",
                "value": "[^ $SP $BA $HY $CM]"
              }, {
                "id": "$Spec3b_",
                "value": "[^ $BA $HY $CM]"
              }, {
                "id": "$Spec4_",
                "value": "[^ $NU $CM]"
              }, {
                "id": "$AI",
                "value": "($AI $X)"
              }, {
                "id": "$AL",
                "value": "($AL $X)"
              }, {
                "id": "$B2",
                "value": "($B2 $X)"
              }, {
                "id": "$BA",
                "value": "($BA $X)"
              }, {
                "id": "$BB",
                "value": "($BB $X)"
              }, {
                "id": "$CB",
                "value": "($CB $X)"
              }, {
                "id": "$CL",
                "value": "($CL $X)"
              }, {
                "id": "$CP",
                "value": "($CP $X)"
              }, {
                "id": "$CM",
                "value": "($CM $X)"
              }, {
                "id": "$CM",
                "value": "($CM $X)"
              }, {
                "id": "$GL",
                "value": "($GL $X)"
              }, {
                "id": "$H2",
                "value": "($H2 $X)"
              }, {
                "id": "$H3",
                "value": "($H3 $X)"
              }, {
                "id": "$HL",
                "value": "($HL $X)"
              }, {
                "id": "$HY",
                "value": "($HY $X)"
              }, {
                "id": "$ID",
                "value": "($ID $X)"
              }, {
                "id": "$IN",
                "value": "($IN $X)"
              }, {
                "id": "$IS",
                "value": "($IS $X)"
              }, {
                "id": "$JL",
                "value": "($JL $X)"
              }, {
                "id": "$JT",
                "value": "($JT $X)"
              }, {
                "id": "$JV",
                "value": "($JV $X)"
              }, {
                "id": "$NS",
                "value": "($NS $X)"
              }, {
                "id": "$NU",
                "value": "($NU $X)"
              }, {
                "id": "$OP",
                "value": "($OP $X)"
              }, {
                "id": "$PO",
                "value": "($PO $X)"
              }, {
                "id": "$PR",
                "value": "($PR $X)"
              }, {
                "id": "$QU",
                "value": "($QU $X)"
              }, {
                "id": "$SA",
                "value": "($SA $X)"
              }, {
                "id": "$SG",
                "value": "($SG $X)"
              }, {
                "id": "$SY",
                "value": "($SY $X)"
              }, {
                "id": "$WJ",
                "value": "($WJ $X)"
              }, {
                "id": "$XX",
                "value": "($XX $X)"
              }, {
                "id": "$RI",
                "value": "($RI $X)"
              }, {
                "id": "$AL",
                "value": "($AL | ^ $CM | (?\u003c=$Spec1_) $CM)"
              }
            ]
          },
          "SentenceBreak": {
            "rules": [
              {
                "id": 3,
                "value": " $CR × $LF "
              }, {
                "id": 4,
                "value": " ($Sep | $CR | $LF) ÷ "
              }, {
                "id": 5,
                "value": " × [$Format $Extend] "
              }, {
                "id": 6,
                "value": " $ATerm × $Numeric "
              }, {
                "id": 7,
                "value": " $Upper $ATerm × $Upper "
              }, {
                "id": 8,
                "value": " $ATerm $Close* $Sp* × $NotPreLower_* $Lower "
              }, {
                "id": "8.1",
                "value": " ($STerm | $ATerm) $Close* $Sp* × ($SContinue | $STerm | $ATerm) "
              }, {
                "id": 9,
                "value": " ( $STerm | $ATerm ) $Close* × ( $Close | $Sp | $Sep | $CR | $LF ) "
              }, {
                "id": 10,
                "value": " ( $STerm | $ATerm ) $Close* $Sp* × ( $Sp | $Sep | $CR | $LF ) "
              }, {
                "id": 11,
                "value": " ( $STerm | $ATerm ) $Close* $Sp* ($Sep | $CR | $LF)? ÷ "
              }, {
                "id": 12,
                "value": " × $Any "
              }
            ],
            "variables": [
              {
                "id": "$CR",
                "value": "\\p{Sentence_Break=CR}"
              }, {
                "id": "$LF",
                "value": "\\p{Sentence_Break=LF}"
              }, {
                "id": "$Extend",
                "value": "\\p{Sentence_Break=Extend}"
              }, {
                "id": "$Format",
                "value": "\\p{Sentence_Break=Format}"
              }, {
                "id": "$Sep",
                "value": "\\p{Sentence_Break=Sep}"
              }, {
                "id": "$Sp",
                "value": "\\p{Sentence_Break=Sp}"
              }, {
                "id": "$Lower",
                "value": "\\p{Sentence_Break=Lower}"
              }, {
                "id": "$Upper",
                "value": "\\p{Sentence_Break=Upper}"
              }, {
                "id": "$OLetter",
                "value": "\\p{Sentence_Break=OLetter}"
              }, {
                "id": "$Numeric",
                "value": "\\p{Sentence_Break=Numeric}"
              }, {
                "id": "$ATerm",
                "value": "\\p{Sentence_Break=ATerm}"
              }, {
                "id": "$STerm",
                "value": "\\p{Sentence_Break=STerm}"
              }, {
                "id": "$Close",
                "value": "\\p{Sentence_Break=Close}"
              }, {
                "id": "$SContinue",
                "value": "\\p{Sentence_Break=SContinue}"
              }, {
                "id": "$Any",
                "value": "."
              }, {
                "id": "$FE",
                "value": "[$Format $Extend]"
              }, {
                "id": "$NotPreLower_",
                "value": "[^ $OLetter $Upper $Lower $Sep $CR $LF $STerm $ATerm]"
              }, {
                "id": "$Sp",
                "value": "($Sp $FE*)"
              }, {
                "id": "$Lower",
                "value": "($Lower $FE*)"
              }, {
                "id": "$Upper",
                "value": "($Upper $FE*)"
              }, {
                "id": "$OLetter",
                "value": "($OLetter $FE*)"
              }, {
                "id": "$Numeric",
                "value": "($Numeric $FE*)"
              }, {
                "id": "$ATerm",
                "value": "($ATerm $FE*)"
              }, {
                "id": "$STerm",
                "value": "($STerm $FE*)"
              }, {
                "id": "$Close",
                "value": "($Close $FE*)"
              }, {
                "id": "$SContinue",
                "value": "($SContinue $FE*)"
              }
            ]
          },
          "WordBreak": {
            "rules": [
              {
                "id": 3,
                "value": " $CR × $LF "
              }, {
                "id": "3.1",
                "value": " ($Newline | $CR | $LF) ÷ "
              }, {
                "id": "3.2",
                "value": " ÷ ($Newline | $CR | $LF) "
              }, {
                "id": 4,
                "value": " $NotBreak_ × [$Format $Extend] "
              }, {
                "id": 5,
                "value": " $ALetter × $ALetter "
              }, {
                "id": 6,
                "value": " $ALetter × ($MidLetter | $MidNumLet) $ALetter "
              }, {
                "id": 7,
                "value": " $ALetter ($MidLetter | $MidNumLet) × $ALetter "
              }, {
                "id": 8,
                "value": " $Numeric × $Numeric "
              }, {
                "id": 9,
                "value": " $ALetter × $Numeric "
              }, {
                "id": 10,
                "value": " $Numeric × $ALetter "
              }, {
                "id": 11,
                "value": " $Numeric ($MidNum | $MidNumLet) × $Numeric "
              }, {
                "id": 12,
                "value": " $Numeric × ($MidNum | $MidNumLet) $Numeric "
              }, {
                "id": 13,
                "value": " $Katakana × $Katakana "
              }, {
                "id": "13.1",
                "value": " ($ALetter | $Numeric | $Katakana | $ExtendNumLet) × $ExtendNumLet "
              }, {
                "id": "13.2",
                "value": " $ExtendNumLet × ($ALetter | $Numeric | $Katakana) "
              }, {
                "id": "13.3",
                "value": " $Regional_Indicator × $Regional_Indicator "
              }
            ],
            "variables": [
              {
                "id": "$CR",
                "value": "\\p{Word_Break=CR}"
              }, {
                "id": "$LF",
                "value": "\\p{Word_Break=LF}"
              }, {
                "id": "$Newline",
                "value": "\\p{Word_Break=Newline}"
              }, {
                "id": "$Extend",
                "value": "\\p{Word_Break=Extend}"
              }, {
                "id": "$Format",
                "value": "\\p{Word_Break=Format}"
              }, {
                "id": "$Katakana",
                "value": "\\p{Word_Break=Katakana}"
              }, {
                "id": "$ALetter",
                "value": "\\p{Word_Break=ALetter}"
              }, {
                "id": "$MidLetter",
                "value": "\\p{Word_Break=MidLetter}"
              }, {
                "id": "$MidNum",
                "value": "\\p{Word_Break=MidNum}"
              }, {
                "id": "$MidNumLet",
                "value": "\\p{Word_Break=MidNumLet}"
              }, {
                "id": "$Numeric",
                "value": "\\p{Word_Break=Numeric}"
              }, {
                "id": "$ExtendNumLet",
                "value": "\\p{Word_Break=ExtendNumLet}"
              }, {
                "id": "$Regional_Indicator",
                "value": "\\p{Word_Break=Regional_Indicator}"
              }, {
                "id": "$FE",
                "value": "[$Format $Extend]"
              }, {
                "id": "$NotBreak_",
                "value": "[^ $Newline $CR $LF ]"
              }, {
                "id": "$Katakana",
                "value": "($Katakana $FE*)"
              }, {
                "id": "$ALetter",
                "value": "($ALetter $FE*)"
              }, {
                "id": "$MidLetter",
                "value": "($MidLetter $FE*)"
              }, {
                "id": "$MidNum",
                "value": "($MidNum $FE*)"
              }, {
                "id": "$MidNumLet",
                "value": "($MidNumLet $FE*)"
              }, {
                "id": "$Numeric",
                "value": "($Numeric $FE*)"
              }, {
                "id": "$ExtendNumLet",
                "value": "($ExtendNumLet $FE*)"
              }, {
                "id": "$Regional_Indicator",
                "value": "($Regional_Indicator $FE*)"
              }
            ]
          }
        }
      }
    },
    "Calendar": {
      "calendar": {
        "additional_formats": {
          "E": "E",
          "EHm": "E HH:mm",
          "EHms": "E HH:mm:ss",
          "Ed": "E d",
          "Ehm": "E h:mm a",
          "Ehms": "E h:mm:ss a",
          "Gy": "y G",
          "GyMMM": "MMM y G",
          "GyMMMEd": "E d MMM y G",
          "GyMMMd": "d MMM y G",
          "H": "HH 'h'",
          "Hm": "HH:mm",
          "Hms": "HH:mm:ss",
          "M": "L",
          "MEd": "E M-d",
          "MMM": "LLL",
          "MMMEd": "E d MMM",
          "MMMd": "d MMM",
          "MMd": "MM-d",
          "MMdd": "MM-dd",
          "Md": "M-d",
          "d": "d",
          "h": "h a",
          "hm": "h:mm a",
          "hms": "h:mm:ss a",
          "ms": "mm:ss",
          "y": "y",
          "yM": "y-MM",
          "yMEd": "E y-MM-dd",
          "yMM": "y-MM",
          "yMMM": "MMM y",
          "yMMMEd": "E d MMM y",
          "yMMMM": "MMMM y",
          "yMMMd": "d MMM y",
          "yMd": "y-MM-dd",
          "yQQQ": "QQQ y",
          "yQQQQ": "QQQQ y"
        },
        "days": {
          "format": {
            "abbreviated": {
              "fri": "ven.",
              "mon": "lun.",
              "sat": "sam.",
              "sun": "dim.",
              "thu": "jeu.",
              "tue": "mar.",
              "wed": "mer."
            },
            "narrow": {
              "fri": "V",
              "mon": "L",
              "sat": "S",
              "sun": "D",
              "thu": "J",
              "tue": "M",
              "wed": "M"
            },
            "short": {
              "fri": "ve",
              "mon": "lu",
              "sat": "sa",
              "sun": "di",
              "thu": "je",
              "tue": "ma",
              "wed": "me"
            },
            "wide": {
              "fri": "vendredi",
              "mon": "lundi",
              "sat": "samedi",
              "sun": "dimanche",
              "thu": "jeudi",
              "tue": "mardi",
              "wed": "mercredi"
            }
          },
          "stand-alone": {
            "abbreviated": {
              "fri": "ven.",
              "mon": "lun.",
              "sat": "sam.",
              "sun": "dim.",
              "thu": "jeu.",
              "tue": "mar.",
              "wed": "mer."
            },
            "narrow": {
              "fri": "V",
              "mon": "L",
              "sat": "S",
              "sun": "D",
              "thu": "J",
              "tue": "M",
              "wed": "M"
            },
            "short": {
              "fri": "ven.",
              "mon": "lun.",
              "sat": "sam.",
              "sun": "dim.",
              "thu": "jeu.",
              "tue": "mar.",
              "wed": "mer."
            },
            "wide": {
              "fri": "vendredi",
              "mon": "lundi",
              "sat": "samedi",
              "sun": "dimanche",
              "thu": "jeudi",
              "tue": "mardi",
              "wed": "mercredi"
            }
          }
        },
        "eras": {
          "abbr": {
            "0": "AEC",
            "1": "EC"
          },
          "name": {
            "0": "avant l’ère commune",
            "1": "ère commune"
          },
          "narrow": {
            "0": "AEC",
            "1": "EC"
          }
        },
        "fields": {
          "day": "jour",
          "day-narrow": "j",
          "day-short": "j",
          "dayperiod": "système horaire",
          "era": "ère",
          "hour": "heure",
          "hour-narrow": "h",
          "hour-short": "h",
          "minute": "minute",
          "minute-narrow": "min",
          "minute-short": "min",
          "month": "mois",
          "month-narrow": "m.",
          "month-short": "m.",
          "quarter": "trimestre",
          "quarter-narrow": "trim.",
          "quarter-short": "trim.",
          "second": "seconde",
          "second-narrow": "s",
          "second-short": "s",
          "week": "semaine",
          "week-narrow": "sem.",
          "week-short": "sem.",
          "weekday": "jour de la semaine",
          "year": "année",
          "year-narrow": "a",
          "year-short": "a",
          "zone": "fuseau horaire"
        },
        "formats": {
          "date": {
            "full": {
              "pattern": "EEEE d MMMM y"
            },
            "long": {
              "pattern": "d MMMM y"
            },
            "medium": {
              "pattern": "y-MM-dd"
            },
            "short": {
              "pattern": "yy-MM-dd"
            }
          },
          "datetime": {
            "full": {
              "pattern": "{{date}} 'à' {{time}}"
            },
            "long": {
              "pattern": "{{date}} 'à' {{time}}"
            },
            "medium": {
              "pattern": "{{date}} {{time}}"
            },
            "short": {
              "pattern": "{{date}} {{time}}"
            }
          },
          "time": {
            "full": {
              "pattern": "HH 'h' mm 'min' ss 's' zzzz"
            },
            "long": {
              "pattern": "HH:mm:ss z"
            },
            "medium": {
              "pattern": "HH:mm:ss"
            },
            "short": {
              "pattern": "HH:mm"
            }
          }
        },
        "months": {
          "format": {
            "abbreviated": {
              "1": "janv.",
              "10": "oct.",
              "11": "nov.",
              "12": "déc.",
              "2": "févr.",
              "3": "mars",
              "4": "avr.",
              "5": "mai",
              "6": "juin",
              "7": "juil.",
              "8": "août",
              "9": "sept."
            },
            "narrow": {
              "1": "J",
              "10": "O",
              "11": "N",
              "12": "D",
              "2": "F",
              "3": "M",
              "4": "A",
              "5": "M",
              "6": "J",
              "7": "J",
              "8": "A",
              "9": "S"
            },
            "wide": {
              "1": "janvier",
              "10": "octobre",
              "11": "novembre",
              "12": "décembre",
              "2": "février",
              "3": "mars",
              "4": "avril",
              "5": "mai",
              "6": "juin",
              "7": "juillet",
              "8": "août",
              "9": "septembre"
            }
          },
          "stand-alone": {
            "abbreviated": {
              "1": "janv.",
              "10": "oct.",
              "11": "nov.",
              "12": "déc.",
              "2": "févr.",
              "3": "mars",
              "4": "avr.",
              "5": "mai",
              "6": "juin",
              "7": "juil.",
              "8": "août",
              "9": "sept."
            },
            "narrow": {
              "1": "J",
              "10": "O",
              "11": "N",
              "12": "D",
              "2": "F",
              "3": "M",
              "4": "A",
              "5": "M",
              "6": "J",
              "7": "J",
              "8": "A",
              "9": "S"
            },
            "wide": {
              "1": "janvier",
              "10": "octobre",
              "11": "novembre",
              "12": "décembre",
              "2": "février",
              "3": "mars",
              "4": "avril",
              "5": "mai",
              "6": "juin",
              "7": "juillet",
              "8": "août",
              "9": "septembre"
            }
          }
        },
        "periods": {
          "format": {
            "abbreviated": {
              "afternoon": "ap.m.",
              "am": "AM",
              "pm": "PM"
            },
            "narrow": {
              "afternoon": "ap.-m.",
              "am": "a",
              "morning": "matin",
              "night": "soir",
              "noon": "midi",
              "pm": "p"
            },
            "wide": {
              "afternoon": "après-midi",
              "am": "AM",
              "morning": "matin",
              "night": "soir",
              "noon": "midi",
              "pm": "PM"
            }
          },
          "stand-alone": {
            "abbreviated": {
              "afternoon": "ap.m.",
              "am": "av.m.",
              "pm": "ap.m."
            },
            "wide": {
              "afternoon": "après-midi",
              "am": "avant-midi",
              "morning": "matin",
              "night": "soir",
              "noon": "midi",
              "pm": "après-midi"
            }
          }
        },
        "quarters": {
          "format": {
            "abbreviated": {
              "1": "T1",
              "2": "T2",
              "3": "T3",
              "4": "T4"
            },
            "narrow": {
              "1": 1,
              "2": 2,
              "3": 3,
              "4": 4
            },
            "wide": {
              "1": "1er trimestre",
              "2": "2e trimestre",
              "3": "3e trimestre",
              "4": "4e trimestre"
            }
          },
          "stand-alone": {
            "abbreviated": {
              "1": "T1",
              "2": "T2",
              "3": "T3",
              "4": "T4"
            },
            "narrow": {
              "1": 1,
              "2": 2,
              "3": 3,
              "4": 4
            },
            "wide": {
              "1": "1er trimestre",
              "2": "2e trimestre",
              "3": "3e trimestre",
              "4": "4e trimestre"
            }
          }
        }
      }
    },
    "CodePoint": {
      "index_keys": {
        "Cc": ["category"],
        "Zs": ["category"],
        "Po": ["category"],
        "Sc": ["category"],
        "Ps": ["category"],
        "Pe": ["category"],
        "Sm": ["category"],
        "Pd": ["category"],
        "Nd": ["category"],
        "Lu": ["category"],
        "Sk": ["category"],
        "Pc": ["category"],
        "Ll": ["category"],
        "So": ["category"],
        "Lo": ["category"],
        "Pi": ["category"],
        "Cf": ["category"],
        "No": ["category"],
        "Pf": ["category"],
        "Lt": ["category"],
        "Lm": ["category"],
        "Mn": ["category"],
        "Me": ["category"],
        "Mc": ["category"],
        "Nl": ["category"],
        "Zl": ["category"],
        "Zp": ["category"],
        "Cs": ["category"],
        "Co": ["category"],
        "BN": ["bidi_class"],
        "S": ["bidi_class"],
        "B": ["bidi_class"],
        "WS": ["bidi_class"],
        "ON": ["bidi_class"],
        "ET": ["bidi_class"],
        "ES": ["bidi_class"],
        "CS": ["bidi_class"],
        "EN": ["bidi_class"],
        "L": ["bidi_class"],
        "NSM": ["bidi_class"],
        "R": ["bidi_class"],
        "AN": ["bidi_class"],
        "AL": ["bidi_class"],
        "LRE": ["bidi_class"],
        "RLE": ["bidi_class"],
        "PDF": ["bidi_class"],
        "LRO": ["bidi_class"],
        "RLO": ["bidi_class"],
        "N": ["bidi_mirrored"],
        "Y": ["bidi_mirrored"]
      },
      "index_data": {
        "category": {
          "Cc": [[0, 31], [127, 159]],
          "Zs": [[32, 32], [160, 160], [5760, 5760], [6158, 6158], [8192, 8202], [8239, 8239], [8287, 8287], [12288, 12288]],
          "Po": [[33, 35], [37, 39], [42, 42], [44, 44], [46, 47], [58, 59], [63, 64], [92, 92], [161, 161], [167, 167], [182, 183], [191, 191], [894, 894], [903, 903], [1370, 1375], [1417, 1417], [1472, 1472], [1475, 1475], [1478, 1478], [1523, 1524], [1545, 1546], [1548, 1549], [1563, 1563], [1566, 1567], [1642, 1645], [1748, 1748], [1792, 1805], [2039, 2041], [2096, 2110], [2142, 2142], [2404, 2405], [2416, 2416], [2800, 2800], [3572, 3572], [3663, 3663], [3674, 3675], [3844, 3858], [3860, 3860], [3973, 3973], [4048, 4052], [4057, 4058], [4170, 4175], [4347, 4347], [4960, 4968], [5741, 5742], [5867, 5869], [5941, 5942], [6100, 6102], [6104, 6106], [6144, 6149], [6151, 6154], [6468, 6469], [6686, 6687], [6816, 6822], [6824, 6829], [7002, 7008], [7164, 7167], [7227, 7231], [7294, 7295], [7360, 7367], [7379, 7379], [8214, 8215], [8224, 8231], [8240, 8248], [8251, 8254], [8257, 8259], [8263, 8273], [8275, 8275], [8277, 8286], [11513, 11516], [11518, 11519], [11632, 11632], [11776, 11777], [11782, 11784], [11787, 11787], [11790, 11798], [11800, 11801], [11803, 11803], [11806, 11807], [11818, 11822], [11824, 11833], [12289, 12291], [12349, 12349], [12539, 12539], [42238, 42239], [42509, 42511], [42611, 42611], [42622, 42622], [42738, 42743], [43124, 43127], [43214, 43215], [43256, 43258], [43310, 43311], [43359, 43359], [43457, 43469], [43486, 43487], [43612, 43615], [43742, 43743], [43760, 43761], [44011, 44011], [65040, 65046], [65049, 65049], [65072, 65072], [65093, 65094], [65097, 65100], [65104, 65106], [65108, 65111], [65119, 65121], [65128, 65128], [65130, 65131], [65281, 65283], [65285, 65287], [65290, 65290], [65292, 65292], [65294, 65295], [65306, 65307], [65311, 65312], [65340, 65340], [65377, 65377], [65380, 65381], [65792, 65794], [66463, 66463], [66512, 66512], [67671, 67671], [67871, 67871], [67903, 67903], [68176, 68184], [68223, 68223], [68409, 68415], [69703, 69709], [69819, 69820], [69822, 69825], [69952, 69955], [70085, 70088], [74864, 74867]],
          "Sc": [[36, 36], [162, 165], [1423, 1423], [1547, 1547], [2546, 2547], [2555, 2555], [2801, 2801], [3065, 3065], [3647, 3647], [6107, 6107], [8352, 8378], [43064, 43064], [65020, 65020], [65129, 65129], [65284, 65284], [65504, 65505], [65509, 65510]],
          "Ps": [[40, 40], [91, 91], [123, 123], [3898, 3898], [3900, 3900], [5787, 5787], [8218, 8218], [8222, 8222], [8261, 8261], [8317, 8317], [8333, 8333], [9001, 9001], [10088, 10088], [10090, 10090], [10092, 10092], [10094, 10094], [10096, 10096], [10098, 10098], [10100, 10100], [10181, 10181], [10214, 10214], [10216, 10216], [10218, 10218], [10220, 10220], [10222, 10222], [10627, 10627], [10629, 10629], [10631, 10631], [10633, 10633], [10635, 10635], [10637, 10637], [10639, 10639], [10641, 10641], [10643, 10643], [10645, 10645], [10647, 10647], [10712, 10712], [10714, 10714], [10748, 10748], [11810, 11810], [11812, 11812], [11814, 11814], [11816, 11816], [12296, 12296], [12298, 12298], [12300, 12300], [12302, 12302], [12304, 12304], [12308, 12308], [12310, 12310], [12312, 12312], [12314, 12314], [12317, 12317], [64830, 64830], [65047, 65047], [65077, 65077], [65079, 65079], [65081, 65081], [65083, 65083], [65085, 65085], [65087, 65087], [65089, 65089], [65091, 65091], [65095, 65095], [65113, 65113], [65115, 65115], [65117, 65117], [65288, 65288], [65339, 65339], [65371, 65371], [65375, 65375], [65378, 65378]],
          "Pe": [[41, 41], [93, 93], [125, 125], [3899, 3899], [3901, 3901], [5788, 5788], [8262, 8262], [8318, 8318], [8334, 8334], [9002, 9002], [10089, 10089], [10091, 10091], [10093, 10093], [10095, 10095], [10097, 10097], [10099, 10099], [10101, 10101], [10182, 10182], [10215, 10215], [10217, 10217], [10219, 10219], [10221, 10221], [10223, 10223], [10628, 10628], [10630, 10630], [10632, 10632], [10634, 10634], [10636, 10636], [10638, 10638], [10640, 10640], [10642, 10642], [10644, 10644], [10646, 10646], [10648, 10648], [10713, 10713], [10715, 10715], [10749, 10749], [11811, 11811], [11813, 11813], [11815, 11815], [11817, 11817], [12297, 12297], [12299, 12299], [12301, 12301], [12303, 12303], [12305, 12305], [12309, 12309], [12311, 12311], [12313, 12313], [12315, 12315], [12318, 12319], [64831, 64831], [65048, 65048], [65078, 65078], [65080, 65080], [65082, 65082], [65084, 65084], [65086, 65086], [65088, 65088], [65090, 65090], [65092, 65092], [65096, 65096], [65114, 65114], [65116, 65116], [65118, 65118], [65289, 65289], [65341, 65341], [65373, 65373], [65376, 65376], [65379, 65379]],
          "Sm": [[43, 43], [60, 62], [124, 124], [126, 126], [172, 172], [177, 177], [215, 215], [247, 247], [1014, 1014], [1542, 1544], [8260, 8260], [8274, 8274], [8314, 8316], [8330, 8332], [8472, 8472], [8512, 8516], [8523, 8523], [8592, 8596], [8602, 8603], [8608, 8608], [8611, 8611], [8614, 8614], [8622, 8622], [8654, 8655], [8658, 8658], [8660, 8660], [8692, 8959], [8968, 8971], [8992, 8993], [9084, 9084], [9115, 9139], [9180, 9185], [9655, 9655], [9665, 9665], [9720, 9727], [9839, 9839], [10176, 10180], [10183, 10213], [10224, 10239], [10496, 10626], [10649, 10711], [10716, 10747], [10750, 11007], [11056, 11076], [11079, 11084], [64297, 64297], [65122, 65122], [65124, 65126], [65291, 65291], [65308, 65310], [65372, 65372], [65374, 65374], [65506, 65506], [65513, 65516], [120513, 120513], [120539, 120539], [120571, 120571], [120597, 120597], [120629, 120629], [120655, 120655], [120687, 120687], [120713, 120713], [120745, 120745], [120771, 120771], [126704, 126705]],
          "Pd": [[45, 45], [1418, 1418], [1470, 1470], [5120, 5120], [6150, 6150], [8208, 8213], [11799, 11799], [11802, 11802], [11834, 11835], [12316, 12316], [12336, 12336], [12448, 12448], [65073, 65074], [65112, 65112], [65123, 65123], [65293, 65293]],
          "Nd": [[48, 57], [1632, 1641], [1776, 1785], [1984, 1993], [2406, 2415], [2534, 2543], [2662, 2671], [2790, 2799], [2918, 2927], [3046, 3055], [3174, 3183], [3302, 3311], [3430, 3439], [3664, 3673], [3792, 3801], [3872, 3881], [4160, 4169], [4240, 4249], [6112, 6121], [6160, 6169], [6470, 6479], [6608, 6617], [6784, 6793], [6800, 6809], [6992, 7001], [7088, 7097], [7232, 7241], [7248, 7257], [42528, 42537], [43216, 43225], [43264, 43273], [43472, 43481], [43600, 43609], [44016, 44025], [65296, 65305], [66720, 66729], [69734, 69743], [69872, 69881], [69942, 69951], [70096, 70105], [71360, 71369], [120782, 120831]],
          "Lu": [[65, 90], [192, 214], [216, 222], [256, 256], [258, 258], [260, 260], [262, 262], [264, 264], [266, 266], [268, 268], [270, 270], [272, 272], [274, 274], [276, 276], [278, 278], [280, 280], [282, 282], [284, 284], [286, 286], [288, 288], [290, 290], [292, 292], [294, 294], [296, 296], [298, 298], [300, 300], [302, 302], [304, 304], [306, 306], [308, 308], [310, 310], [313, 313], [315, 315], [317, 317], [319, 319], [321, 321], [323, 323], [325, 325], [327, 327], [330, 330], [332, 332], [334, 334], [336, 336], [338, 338], [340, 340], [342, 342], [344, 344], [346, 346], [348, 348], [350, 350], [352, 352], [354, 354], [356, 356], [358, 358], [360, 360], [362, 362], [364, 364], [366, 366], [368, 368], [370, 370], [372, 372], [374, 374], [376, 377], [379, 379], [381, 381], [385, 386], [388, 388], [390, 391], [393, 395], [398, 401], [403, 404], [406, 408], [412, 413], [415, 416], [418, 418], [420, 420], [422, 423], [425, 425], [428, 428], [430, 431], [433, 435], [437, 437], [439, 440], [444, 444], [452, 452], [455, 455], [458, 458], [461, 461], [463, 463], [465, 465], [467, 467], [469, 469], [471, 471], [473, 473], [475, 475], [478, 478], [480, 480], [482, 482], [484, 484], [486, 486], [488, 488], [490, 490], [492, 492], [494, 494], [497, 497], [500, 500], [502, 504], [506, 506], [508, 508], [510, 510], [512, 512], [514, 514], [516, 516], [518, 518], [520, 520], [522, 522], [524, 524], [526, 526], [528, 528], [530, 530], [532, 532], [534, 534], [536, 536], [538, 538], [540, 540], [542, 542], [544, 544], [546, 546], [548, 548], [550, 550], [552, 552], [554, 554], [556, 556], [558, 558], [560, 560], [562, 562], [570, 571], [573, 574], [577, 577], [579, 582], [584, 584], [586, 586], [588, 588], [590, 590], [880, 880], [882, 882], [886, 886], [902, 902], [904, 906], [908, 908], [910, 911], [913, 929], [931, 939], [975, 975], [978, 980], [984, 984], [986, 986], [988, 988], [990, 990], [992, 992], [994, 994], [996, 996], [998, 998], [1000, 1000], [1002, 1002], [1004, 1004], [1006, 1006], [1012, 1012], [1015, 1015], [1017, 1018], [1021, 1071], [1120, 1120], [1122, 1122], [1124, 1124], [1126, 1126], [1128, 1128], [1130, 1130], [1132, 1132], [1134, 1134], [1136, 1136], [1138, 1138], [1140, 1140], [1142, 1142], [1144, 1144], [1146, 1146], [1148, 1148], [1150, 1150], [1152, 1152], [1162, 1162], [1164, 1164], [1166, 1166], [1168, 1168], [1170, 1170], [1172, 1172], [1174, 1174], [1176, 1176], [1178, 1178], [1180, 1180], [1182, 1182], [1184, 1184], [1186, 1186], [1188, 1188], [1190, 1190], [1192, 1192], [1194, 1194], [1196, 1196], [1198, 1198], [1200, 1200], [1202, 1202], [1204, 1204], [1206, 1206], [1208, 1208], [1210, 1210], [1212, 1212], [1214, 1214], [1216, 1217], [1219, 1219], [1221, 1221], [1223, 1223], [1225, 1225], [1227, 1227], [1229, 1229], [1232, 1232], [1234, 1234], [1236, 1236], [1238, 1238], [1240, 1240], [1242, 1242], [1244, 1244], [1246, 1246], [1248, 1248], [1250, 1250], [1252, 1252], [1254, 1254], [1256, 1256], [1258, 1258], [1260, 1260], [1262, 1262], [1264, 1264], [1266, 1266], [1268, 1268], [1270, 1270], [1272, 1272], [1274, 1274], [1276, 1276], [1278, 1278], [1280, 1280], [1282, 1282], [1284, 1284], [1286, 1286], [1288, 1288], [1290, 1290], [1292, 1292], [1294, 1294], [1296, 1296], [1298, 1298], [1300, 1300], [1302, 1302], [1304, 1304], [1306, 1306], [1308, 1308], [1310, 1310], [1312, 1312], [1314, 1314], [1316, 1316], [1318, 1318], [1329, 1366], [4256, 4293], [4295, 4295], [4301, 4301], [7680, 7680], [7682, 7682], [7684, 7684], [7686, 7686], [7688, 7688], [7690, 7690], [7692, 7692], [7694, 7694], [7696, 7696], [7698, 7698], [7700, 7700], [7702, 7702], [7704, 7704], [7706, 7706], [7708, 7708], [7710, 7710], [7712, 7712], [7714, 7714], [7716, 7716], [7718, 7718], [7720, 7720], [7722, 7722], [7724, 7724], [7726, 7726], [7728, 7728], [7730, 7730], [7732, 7732], [7734, 7734], [7736, 7736], [7738, 7738], [7740, 7740], [7742, 7742], [7744, 7744], [7746, 7746], [7748, 7748], [7750, 7750], [7752, 7752], [7754, 7754], [7756, 7756], [7758, 7758], [7760, 7760], [7762, 7762], [7764, 7764], [7766, 7766], [7768, 7768], [7770, 7770], [7772, 7772], [7774, 7774], [7776, 7776], [7778, 7778], [7780, 7780], [7782, 7782], [7784, 7784], [7786, 7786], [7788, 7788], [7790, 7790], [7792, 7792], [7794, 7794], [7796, 7796], [7798, 7798], [7800, 7800], [7802, 7802], [7804, 7804], [7806, 7806], [7808, 7808], [7810, 7810], [7812, 7812], [7814, 7814], [7816, 7816], [7818, 7818], [7820, 7820], [7822, 7822], [7824, 7824], [7826, 7826], [7828, 7828], [7838, 7838], [7840, 7840], [7842, 7842], [7844, 7844], [7846, 7846], [7848, 7848], [7850, 7850], [7852, 7852], [7854, 7854], [7856, 7856], [7858, 7858], [7860, 7860], [7862, 7862], [7864, 7864], [7866, 7866], [7868, 7868], [7870, 7870], [7872, 7872], [7874, 7874], [7876, 7876], [7878, 7878], [7880, 7880], [7882, 7882], [7884, 7884], [7886, 7886], [7888, 7888], [7890, 7890], [7892, 7892], [7894, 7894], [7896, 7896], [7898, 7898], [7900, 7900], [7902, 7902], [7904, 7904], [7906, 7906], [7908, 7908], [7910, 7910], [7912, 7912], [7914, 7914], [7916, 7916], [7918, 7918], [7920, 7920], [7922, 7922], [7924, 7924], [7926, 7926], [7928, 7928], [7930, 7930], [7932, 7932], [7934, 7934], [7944, 7951], [7960, 7965], [7976, 7983], [7992, 7999], [8008, 8013], [8025, 8025], [8027, 8027], [8029, 8029], [8031, 8031], [8040, 8047], [8120, 8123], [8136, 8139], [8152, 8155], [8168, 8172], [8184, 8187], [8450, 8450], [8455, 8455], [8459, 8461], [8464, 8466], [8469, 8469], [8473, 8477], [8484, 8484], [8486, 8486], [8488, 8488], [8490, 8493], [8496, 8499], [8510, 8511], [8517, 8517], [8579, 8579], [11264, 11310], [11360, 11360], [11362, 11364], [11367, 11367], [11369, 11369], [11371, 11371], [11373, 11376], [11378, 11378], [11381, 11381], [11390, 11392], [11394, 11394], [11396, 11396], [11398, 11398], [11400, 11400], [11402, 11402], [11404, 11404], [11406, 11406], [11408, 11408], [11410, 11410], [11412, 11412], [11414, 11414], [11416, 11416], [11418, 11418], [11420, 11420], [11422, 11422], [11424, 11424], [11426, 11426], [11428, 11428], [11430, 11430], [11432, 11432], [11434, 11434], [11436, 11436], [11438, 11438], [11440, 11440], [11442, 11442], [11444, 11444], [11446, 11446], [11448, 11448], [11450, 11450], [11452, 11452], [11454, 11454], [11456, 11456], [11458, 11458], [11460, 11460], [11462, 11462], [11464, 11464], [11466, 11466], [11468, 11468], [11470, 11470], [11472, 11472], [11474, 11474], [11476, 11476], [11478, 11478], [11480, 11480], [11482, 11482], [11484, 11484], [11486, 11486], [11488, 11488], [11490, 11490], [11499, 11499], [11501, 11501], [11506, 11506], [42560, 42560], [42562, 42562], [42564, 42564], [42566, 42566], [42568, 42568], [42570, 42570], [42572, 42572], [42574, 42574], [42576, 42576], [42578, 42578], [42580, 42580], [42582, 42582], [42584, 42584], [42586, 42586], [42588, 42588], [42590, 42590], [42592, 42592], [42594, 42594], [42596, 42596], [42598, 42598], [42600, 42600], [42602, 42602], [42604, 42604], [42624, 42624], [42626, 42626], [42628, 42628], [42630, 42630], [42632, 42632], [42634, 42634], [42636, 42636], [42638, 42638], [42640, 42640], [42642, 42642], [42644, 42644], [42646, 42646], [42786, 42786], [42788, 42788], [42790, 42790], [42792, 42792], [42794, 42794], [42796, 42796], [42798, 42798], [42802, 42802], [42804, 42804], [42806, 42806], [42808, 42808], [42810, 42810], [42812, 42812], [42814, 42814], [42816, 42816], [42818, 42818], [42820, 42820], [42822, 42822], [42824, 42824], [42826, 42826], [42828, 42828], [42830, 42830], [42832, 42832], [42834, 42834], [42836, 42836], [42838, 42838], [42840, 42840], [42842, 42842], [42844, 42844], [42846, 42846], [42848, 42848], [42850, 42850], [42852, 42852], [42854, 42854], [42856, 42856], [42858, 42858], [42860, 42860], [42862, 42862], [42873, 42873], [42875, 42875], [42877, 42878], [42880, 42880], [42882, 42882], [42884, 42884], [42886, 42886], [42891, 42891], [42893, 42893], [42896, 42896], [42898, 42898], [42912, 42912], [42914, 42914], [42916, 42916], [42918, 42918], [42920, 42920], [42922, 42922], [65313, 65338], [66560, 66599], [119808, 119833], [119860, 119885], [119912, 119937], [119964, 119964], [119966, 119967], [119970, 119970], [119973, 119974], [119977, 119980], [119982, 119989], [120016, 120041], [120068, 120069], [120071, 120074], [120077, 120084], [120086, 120092], [120120, 120121], [120123, 120126], [120128, 120132], [120134, 120134], [120138, 120144], [120172, 120197], [120224, 120249], [120276, 120301], [120328, 120353], [120380, 120405], [120432, 120457], [120488, 120512], [120546, 120570], [120604, 120628], [120662, 120686], [120720, 120744], [120778, 120778]],
          "Sk": [[94, 94], [96, 96], [168, 168], [175, 175], [180, 180], [184, 184], [706, 709], [722, 735], [741, 747], [749, 749], [751, 767], [885, 885], [900, 901], [8125, 8125], [8127, 8129], [8141, 8143], [8157, 8159], [8173, 8175], [8189, 8190], [12443, 12444], [42752, 42774], [42784, 42785], [42889, 42890], [64434, 64449], [65342, 65342], [65344, 65344], [65507, 65507]],
          "Pc": [[95, 95], [8255, 8256], [8276, 8276], [65075, 65076], [65101, 65103], [65343, 65343]],
          "Ll": [[97, 122], [181, 181], [223, 246], [248, 255], [257, 257], [259, 259], [261, 261], [263, 263], [265, 265], [267, 267], [269, 269], [271, 271], [273, 273], [275, 275], [277, 277], [279, 279], [281, 281], [283, 283], [285, 285], [287, 287], [289, 289], [291, 291], [293, 293], [295, 295], [297, 297], [299, 299], [301, 301], [303, 303], [305, 305], [307, 307], [309, 309], [311, 312], [314, 314], [316, 316], [318, 318], [320, 320], [322, 322], [324, 324], [326, 326], [328, 329], [331, 331], [333, 333], [335, 335], [337, 337], [339, 339], [341, 341], [343, 343], [345, 345], [347, 347], [349, 349], [351, 351], [353, 353], [355, 355], [357, 357], [359, 359], [361, 361], [363, 363], [365, 365], [367, 367], [369, 369], [371, 371], [373, 373], [375, 375], [378, 378], [380, 380], [382, 384], [387, 387], [389, 389], [392, 392], [396, 397], [402, 402], [405, 405], [409, 411], [414, 414], [417, 417], [419, 419], [421, 421], [424, 424], [426, 427], [429, 429], [432, 432], [436, 436], [438, 438], [441, 442], [445, 447], [454, 454], [457, 457], [460, 460], [462, 462], [464, 464], [466, 466], [468, 468], [470, 470], [472, 472], [474, 474], [476, 477], [479, 479], [481, 481], [483, 483], [485, 485], [487, 487], [489, 489], [491, 491], [493, 493], [495, 496], [499, 499], [501, 501], [505, 505], [507, 507], [509, 509], [511, 511], [513, 513], [515, 515], [517, 517], [519, 519], [521, 521], [523, 523], [525, 525], [527, 527], [529, 529], [531, 531], [533, 533], [535, 535], [537, 537], [539, 539], [541, 541], [543, 543], [545, 545], [547, 547], [549, 549], [551, 551], [553, 553], [555, 555], [557, 557], [559, 559], [561, 561], [563, 569], [572, 572], [575, 576], [578, 578], [583, 583], [585, 585], [587, 587], [589, 589], [591, 659], [661, 687], [881, 881], [883, 883], [887, 887], [891, 893], [912, 912], [940, 974], [976, 977], [981, 983], [985, 985], [987, 987], [989, 989], [991, 991], [993, 993], [995, 995], [997, 997], [999, 999], [1001, 1001], [1003, 1003], [1005, 1005], [1007, 1011], [1013, 1013], [1016, 1016], [1019, 1020], [1072, 1119], [1121, 1121], [1123, 1123], [1125, 1125], [1127, 1127], [1129, 1129], [1131, 1131], [1133, 1133], [1135, 1135], [1137, 1137], [1139, 1139], [1141, 1141], [1143, 1143], [1145, 1145], [1147, 1147], [1149, 1149], [1151, 1151], [1153, 1153], [1163, 1163], [1165, 1165], [1167, 1167], [1169, 1169], [1171, 1171], [1173, 1173], [1175, 1175], [1177, 1177], [1179, 1179], [1181, 1181], [1183, 1183], [1185, 1185], [1187, 1187], [1189, 1189], [1191, 1191], [1193, 1193], [1195, 1195], [1197, 1197], [1199, 1199], [1201, 1201], [1203, 1203], [1205, 1205], [1207, 1207], [1209, 1209], [1211, 1211], [1213, 1213], [1215, 1215], [1218, 1218], [1220, 1220], [1222, 1222], [1224, 1224], [1226, 1226], [1228, 1228], [1230, 1231], [1233, 1233], [1235, 1235], [1237, 1237], [1239, 1239], [1241, 1241], [1243, 1243], [1245, 1245], [1247, 1247], [1249, 1249], [1251, 1251], [1253, 1253], [1255, 1255], [1257, 1257], [1259, 1259], [1261, 1261], [1263, 1263], [1265, 1265], [1267, 1267], [1269, 1269], [1271, 1271], [1273, 1273], [1275, 1275], [1277, 1277], [1279, 1279], [1281, 1281], [1283, 1283], [1285, 1285], [1287, 1287], [1289, 1289], [1291, 1291], [1293, 1293], [1295, 1295], [1297, 1297], [1299, 1299], [1301, 1301], [1303, 1303], [1305, 1305], [1307, 1307], [1309, 1309], [1311, 1311], [1313, 1313], [1315, 1315], [1317, 1317], [1319, 1319], [1377, 1415], [7424, 7467], [7531, 7543], [7545, 7578], [7681, 7681], [7683, 7683], [7685, 7685], [7687, 7687], [7689, 7689], [7691, 7691], [7693, 7693], [7695, 7695], [7697, 7697], [7699, 7699], [7701, 7701], [7703, 7703], [7705, 7705], [7707, 7707], [7709, 7709], [7711, 7711], [7713, 7713], [7715, 7715], [7717, 7717], [7719, 7719], [7721, 7721], [7723, 7723], [7725, 7725], [7727, 7727], [7729, 7729], [7731, 7731], [7733, 7733], [7735, 7735], [7737, 7737], [7739, 7739], [7741, 7741], [7743, 7743], [7745, 7745], [7747, 7747], [7749, 7749], [7751, 7751], [7753, 7753], [7755, 7755], [7757, 7757], [7759, 7759], [7761, 7761], [7763, 7763], [7765, 7765], [7767, 7767], [7769, 7769], [7771, 7771], [7773, 7773], [7775, 7775], [7777, 7777], [7779, 7779], [7781, 7781], [7783, 7783], [7785, 7785], [7787, 7787], [7789, 7789], [7791, 7791], [7793, 7793], [7795, 7795], [7797, 7797], [7799, 7799], [7801, 7801], [7803, 7803], [7805, 7805], [7807, 7807], [7809, 7809], [7811, 7811], [7813, 7813], [7815, 7815], [7817, 7817], [7819, 7819], [7821, 7821], [7823, 7823], [7825, 7825], [7827, 7827], [7829, 7837], [7839, 7839], [7841, 7841], [7843, 7843], [7845, 7845], [7847, 7847], [7849, 7849], [7851, 7851], [7853, 7853], [7855, 7855], [7857, 7857], [7859, 7859], [7861, 7861], [7863, 7863], [7865, 7865], [7867, 7867], [7869, 7869], [7871, 7871], [7873, 7873], [7875, 7875], [7877, 7877], [7879, 7879], [7881, 7881], [7883, 7883], [7885, 7885], [7887, 7887], [7889, 7889], [7891, 7891], [7893, 7893], [7895, 7895], [7897, 7897], [7899, 7899], [7901, 7901], [7903, 7903], [7905, 7905], [7907, 7907], [7909, 7909], [7911, 7911], [7913, 7913], [7915, 7915], [7917, 7917], [7919, 7919], [7921, 7921], [7923, 7923], [7925, 7925], [7927, 7927], [7929, 7929], [7931, 7931], [7933, 7933], [7935, 7943], [7952, 7957], [7968, 7975], [7984, 7991], [8000, 8005], [8016, 8023], [8032, 8039], [8048, 8061], [8064, 8071], [8080, 8087], [8096, 8103], [8112, 8116], [8118, 8119], [8126, 8126], [8130, 8132], [8134, 8135], [8144, 8147], [8150, 8151], [8160, 8167], [8178, 8180], [8182, 8183], [8458, 8458], [8462, 8463], [8467, 8467], [8495, 8495], [8500, 8500], [8505, 8505], [8508, 8509], [8518, 8521], [8526, 8526], [8580, 8580], [11312, 11358], [11361, 11361], [11365, 11366], [11368, 11368], [11370, 11370], [11372, 11372], [11377, 11377], [11379, 11380], [11382, 11387], [11393, 11393], [11395, 11395], [11397, 11397], [11399, 11399], [11401, 11401], [11403, 11403], [11405, 11405], [11407, 11407], [11409, 11409], [11411, 11411], [11413, 11413], [11415, 11415], [11417, 11417], [11419, 11419], [11421, 11421], [11423, 11423], [11425, 11425], [11427, 11427], [11429, 11429], [11431, 11431], [11433, 11433], [11435, 11435], [11437, 11437], [11439, 11439], [11441, 11441], [11443, 11443], [11445, 11445], [11447, 11447], [11449, 11449], [11451, 11451], [11453, 11453], [11455, 11455], [11457, 11457], [11459, 11459], [11461, 11461], [11463, 11463], [11465, 11465], [11467, 11467], [11469, 11469], [11471, 11471], [11473, 11473], [11475, 11475], [11477, 11477], [11479, 11479], [11481, 11481], [11483, 11483], [11485, 11485], [11487, 11487], [11489, 11489], [11491, 11492], [11500, 11500], [11502, 11502], [11507, 11507], [11520, 11557], [11559, 11559], [11565, 11565], [42561, 42561], [42563, 42563], [42565, 42565], [42567, 42567], [42569, 42569], [42571, 42571], [42573, 42573], [42575, 42575], [42577, 42577], [42579, 42579], [42581, 42581], [42583, 42583], [42585, 42585], [42587, 42587], [42589, 42589], [42591, 42591], [42593, 42593], [42595, 42595], [42597, 42597], [42599, 42599], [42601, 42601], [42603, 42603], [42605, 42605], [42625, 42625], [42627, 42627], [42629, 42629], [42631, 42631], [42633, 42633], [42635, 42635], [42637, 42637], [42639, 42639], [42641, 42641], [42643, 42643], [42645, 42645], [42647, 42647], [42787, 42787], [42789, 42789], [42791, 42791], [42793, 42793], [42795, 42795], [42797, 42797], [42799, 42801], [42803, 42803], [42805, 42805], [42807, 42807], [42809, 42809], [42811, 42811], [42813, 42813], [42815, 42815], [42817, 42817], [42819, 42819], [42821, 42821], [42823, 42823], [42825, 42825], [42827, 42827], [42829, 42829], [42831, 42831], [42833, 42833], [42835, 42835], [42837, 42837], [42839, 42839], [42841, 42841], [42843, 42843], [42845, 42845], [42847, 42847], [42849, 42849], [42851, 42851], [42853, 42853], [42855, 42855], [42857, 42857], [42859, 42859], [42861, 42861], [42863, 42863], [42865, 42872], [42874, 42874], [42876, 42876], [42879, 42879], [42881, 42881], [42883, 42883], [42885, 42885], [42887, 42887], [42892, 42892], [42894, 42894], [42897, 42897], [42899, 42899], [42913, 42913], [42915, 42915], [42917, 42917], [42919, 42919], [42921, 42921], [43002, 43002], [64256, 64262], [64275, 64279], [65345, 65370], [66600, 66639], [119834, 119859], [119886, 119892], [119894, 119911], [119938, 119963], [119990, 119993], [119995, 119995], [119997, 120003], [120005, 120015], [120042, 120067], [120094, 120119], [120146, 120171], [120198, 120223], [120250, 120275], [120302, 120327], [120354, 120379], [120406, 120431], [120458, 120485], [120514, 120538], [120540, 120545], [120572, 120596], [120598, 120603], [120630, 120654], [120656, 120661], [120688, 120712], [120714, 120719], [120746, 120770], [120772, 120777], [120779, 120779]],
          "So": [[166, 166], [169, 169], [174, 174], [176, 176], [1154, 1154], [1550, 1551], [1758, 1758], [1769, 1769], [1789, 1790], [2038, 2038], [2554, 2554], [2928, 2928], [3059, 3064], [3066, 3066], [3199, 3199], [3449, 3449], [3841, 3843], [3859, 3859], [3861, 3863], [3866, 3871], [3892, 3892], [3894, 3894], [3896, 3896], [4030, 4037], [4039, 4044], [4046, 4047], [4053, 4056], [4254, 4255], [5008, 5017], [6464, 6464], [6622, 6655], [7009, 7018], [7028, 7036], [8448, 8449], [8451, 8454], [8456, 8457], [8468, 8468], [8470, 8471], [8478, 8483], [8485, 8485], [8487, 8487], [8489, 8489], [8494, 8494], [8506, 8507], [8522, 8522], [8524, 8525], [8527, 8527], [8597, 8601], [8604, 8607], [8609, 8610], [8612, 8613], [8615, 8621], [8623, 8653], [8656, 8657], [8659, 8659], [8661, 8691], [8960, 8967], [8972, 8991], [8994, 9000], [9003, 9083], [9085, 9114], [9140, 9179], [9186, 9203], [9216, 9254], [9280, 9290], [9372, 9449], [9472, 9654], [9656, 9664], [9666, 9719], [9728, 9838], [9840, 9983], [9985, 10087], [10132, 10175], [10240, 10495], [11008, 11055], [11077, 11078], [11088, 11097], [11493, 11498], [11904, 11929], [11931, 12019], [12032, 12245], [12272, 12283], [12292, 12292], [12306, 12307], [12320, 12320], [12342, 12343], [12350, 12351], [12688, 12689], [12694, 12703], [12736, 12771], [12800, 12830], [12842, 12871], [12880, 12880], [12896, 12927], [12938, 12976], [12992, 13054], [13056, 13311], [19904, 19967], [42128, 42182], [43048, 43051], [43062, 43063], [43065, 43065], [43639, 43641], [65021, 65021], [65508, 65508], [65512, 65512], [65517, 65518], [65532, 65533], [65847, 65855], [65913, 65929], [65936, 65947], [66000, 66044], [118784, 119029], [119040, 119078], [119081, 119140], [119146, 119148], [119171, 119172], [119180, 119209], [119214, 119261], [119296, 119361], [119365, 119365], [119552, 119638], [126976, 127019], [127024, 127123], [127136, 127150], [127153, 127166], [127169, 127183], [127185, 127199], [127248, 127278], [127280, 127339], [127344, 127386], [127462, 127490], [127504, 127546], [127552, 127560], [127568, 127569], [127744, 127776], [127792, 127797], [127799, 127868], [127872, 127891], [127904, 127940], [127942, 127946], [127968, 127984], [128000, 128062], [128064, 128064], [128066, 128247], [128249, 128252], [128256, 128317], [128320, 128323], [128336, 128359], [128507, 128576], [128581, 128591], [128640, 128709], [128768, 128883]],
          "Lo": [[170, 170], [186, 186], [443, 443], [448, 451], [660, 660], [1488, 1514], [1520, 1522], [1568, 1599], [1601, 1610], [1646, 1647], [1649, 1747], [1749, 1749], [1774, 1775], [1786, 1788], [1791, 1791], [1808, 1808], [1810, 1839], [1869, 1957], [1969, 1969], [1994, 2026], [2048, 2069], [2112, 2136], [2208, 2208], [2210, 2220], [2308, 2361], [2365, 2365], [2384, 2384], [2392, 2401], [2418, 2423], [2425, 2431], [2437, 2444], [2447, 2448], [2451, 2472], [2474, 2480], [2482, 2482], [2486, 2489], [2493, 2493], [2510, 2510], [2524, 2525], [2527, 2529], [2544, 2545], [2565, 2570], [2575, 2576], [2579, 2600], [2602, 2608], [2610, 2611], [2613, 2614], [2616, 2617], [2649, 2652], [2654, 2654], [2674, 2676], [2693, 2701], [2703, 2705], [2707, 2728], [2730, 2736], [2738, 2739], [2741, 2745], [2749, 2749], [2768, 2768], [2784, 2785], [2821, 2828], [2831, 2832], [2835, 2856], [2858, 2864], [2866, 2867], [2869, 2873], [2877, 2877], [2908, 2909], [2911, 2913], [2929, 2929], [2947, 2947], [2949, 2954], [2958, 2960], [2962, 2965], [2969, 2970], [2972, 2972], [2974, 2975], [2979, 2980], [2984, 2986], [2990, 3001], [3024, 3024], [3077, 3084], [3086, 3088], [3090, 3112], [3114, 3123], [3125, 3129], [3133, 3133], [3160, 3161], [3168, 3169], [3205, 3212], [3214, 3216], [3218, 3240], [3242, 3251], [3253, 3257], [3261, 3261], [3294, 3294], [3296, 3297], [3313, 3314], [3333, 3340], [3342, 3344], [3346, 3386], [3389, 3389], [3406, 3406], [3424, 3425], [3450, 3455], [3461, 3478], [3482, 3505], [3507, 3515], [3517, 3517], [3520, 3526], [3585, 3632], [3634, 3635], [3648, 3653], [3713, 3714], [3716, 3716], [3719, 3720], [3722, 3722], [3725, 3725], [3732, 3735], [3737, 3743], [3745, 3747], [3749, 3749], [3751, 3751], [3754, 3755], [3757, 3760], [3762, 3763], [3773, 3773], [3776, 3780], [3804, 3807], [3840, 3840], [3904, 3911], [3913, 3948], [3976, 3980], [4096, 4138], [4159, 4159], [4176, 4181], [4186, 4189], [4193, 4193], [4197, 4198], [4206, 4208], [4213, 4225], [4238, 4238], [4304, 4346], [4349, 4680], [4682, 4685], [4688, 4694], [4696, 4696], [4698, 4701], [4704, 4744], [4746, 4749], [4752, 4784], [4786, 4789], [4792, 4798], [4800, 4800], [4802, 4805], [4808, 4822], [4824, 4880], [4882, 4885], [4888, 4954], [4992, 5007], [5024, 5108], [5121, 5740], [5743, 5759], [5761, 5786], [5792, 5866], [5888, 5900], [5902, 5905], [5920, 5937], [5952, 5969], [5984, 5996], [5998, 6000], [6016, 6067], [6108, 6108], [6176, 6210], [6212, 6263], [6272, 6312], [6314, 6314], [6320, 6389], [6400, 6428], [6480, 6509], [6512, 6516], [6528, 6571], [6593, 6599], [6656, 6678], [6688, 6740], [6917, 6963], [6981, 6987], [7043, 7072], [7086, 7087], [7098, 7141], [7168, 7203], [7245, 7247], [7258, 7287], [7401, 7404], [7406, 7409], [7413, 7414], [8501, 8504], [11568, 11623], [11648, 11670], [11680, 11686], [11688, 11694], [11696, 11702], [11704, 11710], [11712, 11718], [11720, 11726], [11728, 11734], [11736, 11742], [12294, 12294], [12348, 12348], [12353, 12438], [12447, 12447], [12449, 12538], [12543, 12543], [12549, 12589], [12593, 12686], [12704, 12730], [12784, 12799], [13312, 13312], [19893, 19893], [19968, 19968], [40908, 40908], [40960, 40980], [40982, 42124], [42192, 42231], [42240, 42507], [42512, 42527], [42538, 42539], [42606, 42606], [42656, 42725], [43003, 43009], [43011, 43013], [43015, 43018], [43020, 43042], [43072, 43123], [43138, 43187], [43250, 43255], [43259, 43259], [43274, 43301], [43312, 43334], [43360, 43388], [43396, 43442], [43520, 43560], [43584, 43586], [43588, 43595], [43616, 43631], [43633, 43638], [43642, 43642], [43648, 43695], [43697, 43697], [43701, 43702], [43705, 43709], [43712, 43712], [43714, 43714], [43739, 43740], [43744, 43754], [43762, 43762], [43777, 43782], [43785, 43790], [43793, 43798], [43808, 43814], [43816, 43822], [43968, 44002], [44032, 44032], [55203, 55203], [55216, 55238], [55243, 55291], [63744, 64109], [64112, 64217], [64285, 64285], [64287, 64296], [64298, 64310], [64312, 64316], [64318, 64318], [64320, 64321], [64323, 64324], [64326, 64433], [64467, 64829], [64848, 64911], [64914, 64967], [65008, 65019], [65136, 65140], [65142, 65276], [65382, 65391], [65393, 65437], [65440, 65470], [65474, 65479], [65482, 65487], [65490, 65495], [65498, 65500], [65536, 65547], [65549, 65574], [65576, 65594], [65596, 65597], [65599, 65613], [65616, 65629], [65664, 65786], [66176, 66204], [66208, 66256], [66304, 66334], [66352, 66368], [66370, 66377], [66432, 66461], [66464, 66499], [66504, 66511], [66640, 66717], [67584, 67589], [67592, 67592], [67594, 67637], [67639, 67640], [67644, 67644], [67647, 67669], [67840, 67861], [67872, 67897], [67968, 68023], [68030, 68031], [68096, 68096], [68112, 68115], [68117, 68119], [68121, 68147], [68192, 68220], [68352, 68405], [68416, 68437], [68448, 68466], [68608, 68680], [69635, 69687], [69763, 69807], [69840, 69864], [69891, 69926], [70019, 70066], [70081, 70084], [71296, 71338], [73728, 74606], [77824, 78894], [92160, 92728], [93952, 94020], [94032, 94032], [110592, 110593], [126464, 126467], [126469, 126495], [126497, 126498], [126500, 126500], [126503, 126503], [126505, 126514], [126516, 126519], [126521, 126521], [126523, 126523], [126530, 126530], [126535, 126535], [126537, 126537], [126539, 126539], [126541, 126543], [126545, 126546], [126548, 126548], [126551, 126551], [126553, 126553], [126555, 126555], [126557, 126557], [126559, 126559], [126561, 126562], [126564, 126564], [126567, 126570], [126572, 126578], [126580, 126583], [126585, 126588], [126590, 126590], [126592, 126601], [126603, 126619], [126625, 126627], [126629, 126633], [126635, 126651], [131072, 131072], [173782, 173782], [173824, 173824], [177972, 177972], [177984, 177984], [178205, 178205], [194560, 195101]],
          "Pi": [[171, 171], [8216, 8216], [8219, 8220], [8223, 8223], [8249, 8249], [11778, 11778], [11780, 11780], [11785, 11785], [11788, 11788], [11804, 11804], [11808, 11808]],
          "Cf": [[173, 173], [1536, 1540], [1757, 1757], [1807, 1807], [8203, 8207], [8234, 8238], [8288, 8292], [8298, 8303], [65279, 65279], [65529, 65531], [69821, 69821], [119155, 119162], [917505, 917505], [917536, 917631]],
          "No": [[178, 179], [185, 185], [188, 190], [2548, 2553], [2930, 2935], [3056, 3058], [3192, 3198], [3440, 3445], [3882, 3891], [4969, 4988], [6128, 6137], [6618, 6618], [8304, 8304], [8308, 8313], [8320, 8329], [8528, 8543], [8585, 8585], [9312, 9371], [9450, 9471], [10102, 10131], [11517, 11517], [12690, 12693], [12832, 12841], [12872, 12879], [12881, 12895], [12928, 12937], [12977, 12991], [43056, 43061], [65799, 65843], [65909, 65912], [65930, 65930], [66336, 66339], [67672, 67679], [67862, 67867], [68160, 68167], [68221, 68222], [68440, 68447], [68472, 68479], [69216, 69246], [69714, 69733], [119648, 119665], [127232, 127242]],
          "Pf": [[187, 187], [8217, 8217], [8221, 8221], [8250, 8250], [11779, 11779], [11781, 11781], [11786, 11786], [11789, 11789], [11805, 11805], [11809, 11809]],
          "Lt": [[453, 453], [456, 456], [459, 459], [498, 498], [8072, 8079], [8088, 8095], [8104, 8111], [8124, 8124], [8140, 8140], [8188, 8188]],
          "Lm": [[688, 705], [710, 721], [736, 740], [748, 748], [750, 750], [884, 884], [890, 890], [1369, 1369], [1600, 1600], [1765, 1766], [2036, 2037], [2042, 2042], [2074, 2074], [2084, 2084], [2088, 2088], [2417, 2417], [3654, 3654], [3782, 3782], [4348, 4348], [6103, 6103], [6211, 6211], [6823, 6823], [7288, 7293], [7468, 7530], [7544, 7544], [7579, 7615], [8305, 8305], [8319, 8319], [8336, 8348], [11388, 11389], [11631, 11631], [11823, 11823], [12293, 12293], [12337, 12341], [12347, 12347], [12445, 12446], [12540, 12542], [40981, 40981], [42232, 42237], [42508, 42508], [42623, 42623], [42775, 42783], [42864, 42864], [42888, 42888], [43000, 43001], [43471, 43471], [43632, 43632], [43741, 43741], [43763, 43764], [65392, 65392], [65438, 65439], [94099, 94111]],
          "Mn": [[768, 879], [1155, 1159], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1552, 1562], [1611, 1631], [1648, 1648], [1750, 1756], [1759, 1764], [1767, 1768], [1770, 1773], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2070, 2073], [2075, 2083], [2085, 2087], [2089, 2093], [2137, 2139], [2276, 2302], [2304, 2306], [2362, 2362], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2391], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2641, 2641], [2672, 2673], [2677, 2677], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2884], [2893, 2893], [2902, 2902], [2914, 2915], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3170, 3171], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3396], [3405, 3405], [3426, 3427], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3981, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4151], [4153, 4154], [4157, 4158], [4184, 4185], [4190, 4192], [4209, 4212], [4226, 4226], [4229, 4230], [4237, 4237], [4253, 4253], [4957, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6742, 6742], [6744, 6750], [6752, 6752], [6754, 6754], [6757, 6764], [6771, 6780], [6783, 6783], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7040, 7041], [7074, 7077], [7080, 7081], [7083, 7083], [7142, 7142], [7144, 7145], [7149, 7149], [7151, 7153], [7212, 7219], [7222, 7223], [7376, 7378], [7380, 7392], [7394, 7400], [7405, 7405], [7412, 7412], [7616, 7654], [7676, 7679], [8400, 8412], [8417, 8417], [8421, 8432], [11503, 11505], [11647, 11647], [11744, 11775], [12330, 12333], [12441, 12442], [42607, 42607], [42612, 42621], [42655, 42655], [42736, 42737], [43010, 43010], [43014, 43014], [43019, 43019], [43045, 43046], [43204, 43204], [43232, 43249], [43302, 43309], [43335, 43345], [43392, 43394], [43443, 43443], [43446, 43449], [43452, 43452], [43561, 43566], [43569, 43570], [43573, 43574], [43587, 43587], [43596, 43596], [43696, 43696], [43698, 43700], [43703, 43704], [43710, 43711], [43713, 43713], [43756, 43757], [43766, 43766], [44005, 44005], [44008, 44008], [44013, 44013], [64286, 64286], [65024, 65039], [65056, 65062], [66045, 66045], [68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [69633, 69633], [69688, 69702], [69760, 69761], [69811, 69814], [69817, 69818], [69888, 69890], [69927, 69931], [69933, 69940], [70016, 70017], [70070, 70078], [71339, 71339], [71341, 71341], [71344, 71349], [71351, 71351], [94095, 94098], [119143, 119145], [119163, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917760, 917999]],
          "Me": [[1160, 1161], [8413, 8416], [8418, 8420], [42608, 42610]],
          "Mc": [[2307, 2307], [2363, 2363], [2366, 2368], [2377, 2380], [2382, 2383], [2434, 2435], [2494, 2496], [2503, 2504], [2507, 2508], [2519, 2519], [2563, 2563], [2622, 2624], [2691, 2691], [2750, 2752], [2761, 2761], [2763, 2764], [2818, 2819], [2878, 2878], [2880, 2880], [2887, 2888], [2891, 2892], [2903, 2903], [3006, 3007], [3009, 3010], [3014, 3016], [3018, 3020], [3031, 3031], [3073, 3075], [3137, 3140], [3202, 3203], [3262, 3262], [3264, 3268], [3271, 3272], [3274, 3275], [3285, 3286], [3330, 3331], [3390, 3392], [3398, 3400], [3402, 3404], [3415, 3415], [3458, 3459], [3535, 3537], [3544, 3551], [3570, 3571], [3902, 3903], [3967, 3967], [4139, 4140], [4145, 4145], [4152, 4152], [4155, 4156], [4182, 4183], [4194, 4196], [4199, 4205], [4227, 4228], [4231, 4236], [4239, 4239], [4250, 4252], [6070, 6070], [6078, 6085], [6087, 6088], [6435, 6438], [6441, 6443], [6448, 6449], [6451, 6456], [6576, 6592], [6600, 6601], [6681, 6683], [6741, 6741], [6743, 6743], [6753, 6753], [6755, 6756], [6765, 6770], [6916, 6916], [6965, 6965], [6971, 6971], [6973, 6977], [6979, 6980], [7042, 7042], [7073, 7073], [7078, 7079], [7082, 7082], [7084, 7085], [7143, 7143], [7146, 7148], [7150, 7150], [7154, 7155], [7204, 7211], [7220, 7221], [7393, 7393], [7410, 7411], [12334, 12335], [43043, 43044], [43047, 43047], [43136, 43137], [43188, 43203], [43346, 43347], [43395, 43395], [43444, 43445], [43450, 43451], [43453, 43456], [43567, 43568], [43571, 43572], [43597, 43597], [43643, 43643], [43755, 43755], [43758, 43759], [43765, 43765], [44003, 44004], [44006, 44007], [44009, 44010], [44012, 44012], [69632, 69632], [69634, 69634], [69762, 69762], [69808, 69810], [69815, 69816], [69932, 69932], [70018, 70018], [70067, 70069], [70079, 70080], [71340, 71340], [71342, 71343], [71350, 71350], [94033, 94078], [119141, 119142], [119149, 119154]],
          "Nl": [[5870, 5872], [8544, 8578], [8581, 8584], [12295, 12295], [12321, 12329], [12344, 12346], [42726, 42735], [65856, 65908], [66369, 66369], [66378, 66378], [66513, 66517], [74752, 74850]],
          "Zl": [[8232, 8232]],
          "Zp": [[8233, 8233]],
          "Cs": [[55296, 55296], [56191, 56192], [56319, 56320], [57343, 57343]],
          "Co": [[57344, 57344], [63743, 63743], [983040, 983040], [1048573, 1048573], [1048576, 1048576], [1114109, 1114109]]
        },
        "bidi_class": {
          "BN": [[0, 8], [14, 27], [127, 132], [134, 159], [173, 173], [8203, 8205], [8288, 8292], [8298, 8303], [65279, 65279], [119155, 119162], [917505, 917505], [917536, 917631]],
          "S": [[9, 9], [11, 11], [31, 31]],
          "B": [[10, 10], [13, 13], [28, 30], [133, 133], [8233, 8233]],
          "WS": [[12, 12], [32, 32], [5760, 5760], [6158, 6158], [8192, 8202], [8232, 8232], [8287, 8287], [12288, 12288]],
          "ON": [[33, 34], [38, 42], [59, 64], [91, 96], [123, 126], [161, 161], [166, 169], [171, 172], [174, 175], [180, 180], [182, 184], [187, 191], [215, 215], [247, 247], [697, 698], [706, 719], [722, 735], [741, 749], [751, 767], [884, 885], [894, 894], [900, 901], [903, 903], [1014, 1014], [1418, 1418], [1542, 1543], [1550, 1551], [1758, 1758], [1769, 1769], [2038, 2041], [3059, 3064], [3066, 3066], [3192, 3198], [3898, 3901], [5008, 5017], [5120, 5120], [5787, 5788], [6128, 6137], [6144, 6154], [6464, 6464], [6468, 6469], [6622, 6655], [8125, 8125], [8127, 8129], [8141, 8143], [8157, 8159], [8173, 8175], [8189, 8190], [8208, 8231], [8245, 8259], [8261, 8286], [8316, 8318], [8332, 8334], [8448, 8449], [8451, 8454], [8456, 8457], [8468, 8468], [8470, 8472], [8478, 8483], [8485, 8485], [8487, 8487], [8489, 8489], [8506, 8507], [8512, 8516], [8522, 8525], [8528, 8543], [8585, 8585], [8592, 8721], [8724, 9013], [9083, 9108], [9110, 9203], [9216, 9254], [9280, 9290], [9312, 9351], [9450, 9899], [9901, 9983], [9985, 10239], [10496, 11084], [11088, 11097], [11493, 11498], [11513, 11519], [11776, 11835], [11904, 11929], [11931, 12019], [12032, 12245], [12272, 12283], [12289, 12292], [12296, 12320], [12336, 12336], [12342, 12343], [12349, 12351], [12443, 12444], [12448, 12448], [12539, 12539], [12736, 12771], [12829, 12830], [12880, 12895], [12924, 12926], [12977, 12991], [13004, 13007], [13175, 13178], [13278, 13279], [13311, 13311], [19904, 19967], [42128, 42182], [42509, 42511], [42611, 42611], [42622, 42623], [42752, 42785], [42888, 42888], [43048, 43051], [43124, 43127], [64830, 64831], [65021, 65021], [65040, 65049], [65072, 65103], [65105, 65105], [65108, 65108], [65110, 65118], [65120, 65121], [65124, 65126], [65128, 65128], [65131, 65131], [65281, 65282], [65286, 65290], [65307, 65312], [65339, 65344], [65371, 65381], [65506, 65508], [65512, 65518], [65529, 65533], [65793, 65793], [65856, 65930], [65936, 65947], [67871, 67871], [68409, 68415], [69714, 69733], [119296, 119361], [119365, 119365], [119552, 119638], [120539, 120539], [120597, 120597], [120655, 120655], [120713, 120713], [120771, 120771], [126704, 126705], [126976, 127019], [127024, 127123], [127136, 127150], [127153, 127166], [127169, 127183], [127185, 127199], [127338, 127339], [127744, 127776], [127792, 127797], [127799, 127868], [127872, 127891], [127904, 127940], [127942, 127946], [127968, 127984], [128000, 128062], [128064, 128064], [128066, 128247], [128249, 128252], [128256, 128317], [128320, 128323], [128336, 128359], [128507, 128576], [128581, 128591], [128640, 128709], [128768, 128883]],
          "ET": [[35, 37], [162, 165], [176, 177], [1423, 1423], [1545, 1546], [1642, 1642], [2546, 2547], [2555, 2555], [2801, 2801], [3065, 3065], [3647, 3647], [6107, 6107], [8240, 8244], [8352, 8378], [8494, 8494], [8723, 8723], [43064, 43065], [65119, 65119], [65129, 65130], [65283, 65285], [65504, 65505], [65509, 65510]],
          "ES": [[43, 43], [45, 45], [8314, 8315], [8330, 8331], [8722, 8722], [64297, 64297], [65122, 65123], [65291, 65291], [65293, 65293]],
          "CS": [[44, 44], [46, 47], [58, 58], [160, 160], [1548, 1548], [8239, 8239], [8260, 8260], [65104, 65104], [65106, 65106], [65109, 65109], [65292, 65292], [65294, 65295], [65306, 65306]],
          "EN": [[48, 57], [178, 179], [185, 185], [1776, 1785], [8304, 8304], [8308, 8313], [8320, 8329], [9352, 9371], [65296, 65305], [120782, 120831], [127232, 127242]],
          "L": [[65, 90], [97, 122], [170, 170], [181, 181], [186, 186], [192, 214], [216, 246], [248, 696], [699, 705], [720, 721], [736, 740], [750, 750], [880, 883], [886, 887], [890, 893], [902, 902], [904, 906], [908, 908], [910, 929], [931, 1013], [1015, 1154], [1162, 1319], [1329, 1366], [1369, 1375], [1377, 1415], [1417, 1417], [2307, 2361], [2363, 2363], [2365, 2368], [2377, 2380], [2382, 2384], [2392, 2401], [2404, 2423], [2425, 2431], [2434, 2435], [2437, 2444], [2447, 2448], [2451, 2472], [2474, 2480], [2482, 2482], [2486, 2489], [2493, 2496], [2503, 2504], [2507, 2508], [2510, 2510], [2519, 2519], [2524, 2525], [2527, 2529], [2534, 2545], [2548, 2554], [2563, 2563], [2565, 2570], [2575, 2576], [2579, 2600], [2602, 2608], [2610, 2611], [2613, 2614], [2616, 2617], [2622, 2624], [2649, 2652], [2654, 2654], [2662, 2671], [2674, 2676], [2691, 2691], [2693, 2701], [2703, 2705], [2707, 2728], [2730, 2736], [2738, 2739], [2741, 2745], [2749, 2752], [2761, 2761], [2763, 2764], [2768, 2768], [2784, 2785], [2790, 2800], [2818, 2819], [2821, 2828], [2831, 2832], [2835, 2856], [2858, 2864], [2866, 2867], [2869, 2873], [2877, 2878], [2880, 2880], [2887, 2888], [2891, 2892], [2903, 2903], [2908, 2909], [2911, 2913], [2918, 2935], [2947, 2947], [2949, 2954], [2958, 2960], [2962, 2965], [2969, 2970], [2972, 2972], [2974, 2975], [2979, 2980], [2984, 2986], [2990, 3001], [3006, 3007], [3009, 3010], [3014, 3016], [3018, 3020], [3024, 3024], [3031, 3031], [3046, 3058], [3073, 3075], [3077, 3084], [3086, 3088], [3090, 3112], [3114, 3123], [3125, 3129], [3133, 3133], [3137, 3140], [3160, 3161], [3168, 3169], [3174, 3183], [3199, 3199], [3202, 3203], [3205, 3212], [3214, 3216], [3218, 3240], [3242, 3251], [3253, 3257], [3261, 3268], [3270, 3272], [3274, 3275], [3285, 3286], [3294, 3294], [3296, 3297], [3302, 3311], [3313, 3314], [3330, 3331], [3333, 3340], [3342, 3344], [3346, 3386], [3389, 3392], [3398, 3400], [3402, 3404], [3406, 3406], [3415, 3415], [3424, 3425], [3430, 3445], [3449, 3455], [3458, 3459], [3461, 3478], [3482, 3505], [3507, 3515], [3517, 3517], [3520, 3526], [3535, 3537], [3544, 3551], [3570, 3572], [3585, 3632], [3634, 3635], [3648, 3654], [3663, 3675], [3713, 3714], [3716, 3716], [3719, 3720], [3722, 3722], [3725, 3725], [3732, 3735], [3737, 3743], [3745, 3747], [3749, 3749], [3751, 3751], [3754, 3755], [3757, 3760], [3762, 3763], [3773, 3773], [3776, 3780], [3782, 3782], [3792, 3801], [3804, 3807], [3840, 3863], [3866, 3892], [3894, 3894], [3896, 3896], [3902, 3911], [3913, 3948], [3967, 3967], [3973, 3973], [3976, 3980], [4030, 4037], [4039, 4044], [4046, 4058], [4096, 4140], [4145, 4145], [4152, 4152], [4155, 4156], [4159, 4183], [4186, 4189], [4193, 4208], [4213, 4225], [4227, 4228], [4231, 4236], [4238, 4252], [4254, 4293], [4295, 4295], [4301, 4301], [4304, 4680], [4682, 4685], [4688, 4694], [4696, 4696], [4698, 4701], [4704, 4744], [4746, 4749], [4752, 4784], [4786, 4789], [4792, 4798], [4800, 4800], [4802, 4805], [4808, 4822], [4824, 4880], [4882, 4885], [4888, 4954], [4960, 4988], [4992, 5007], [5024, 5108], [5121, 5759], [5761, 5786], [5792, 5872], [5888, 5900], [5902, 5905], [5920, 5937], [5941, 5942], [5952, 5969], [5984, 5996], [5998, 6000], [6016, 6067], [6070, 6070], [6078, 6085], [6087, 6088], [6100, 6106], [6108, 6108], [6112, 6121], [6160, 6169], [6176, 6263], [6272, 6312], [6314, 6314], [6320, 6389], [6400, 6428], [6435, 6438], [6441, 6443], [6448, 6449], [6451, 6456], [6470, 6509], [6512, 6516], [6528, 6571], [6576, 6601], [6608, 6618], [6656, 6678], [6681, 6683], [6686, 6741], [6743, 6743], [6753, 6753], [6755, 6756], [6765, 6770], [6784, 6793], [6800, 6809], [6816, 6829], [6916, 6963], [6965, 6965], [6971, 6971], [6973, 6977], [6979, 6987], [6992, 7018], [7028, 7036], [7042, 7073], [7078, 7079], [7082, 7082], [7084, 7141], [7143, 7143], [7146, 7148], [7150, 7150], [7154, 7155], [7164, 7211], [7220, 7221], [7227, 7241], [7245, 7295], [7360, 7367], [7379, 7379], [7393, 7393], [7401, 7404], [7406, 7411], [7413, 7414], [7424, 7615], [7680, 7957], [7960, 7965], [7968, 8005], [8008, 8013], [8016, 8023], [8025, 8025], [8027, 8027], [8029, 8029], [8031, 8061], [8064, 8116], [8118, 8124], [8126, 8126], [8130, 8132], [8134, 8140], [8144, 8147], [8150, 8155], [8160, 8172], [8178, 8180], [8182, 8188], [8206, 8206], [8305, 8305], [8319, 8319], [8336, 8348], [8450, 8450], [8455, 8455], [8458, 8467], [8469, 8469], [8473, 8477], [8484, 8484], [8486, 8486], [8488, 8488], [8490, 8493], [8495, 8505], [8508, 8511], [8517, 8521], [8526, 8527], [8544, 8584], [9014, 9082], [9109, 9109], [9372, 9449], [9900, 9900], [10240, 10495], [11264, 11310], [11312, 11358], [11360, 11492], [11499, 11502], [11506, 11507], [11520, 11557], [11559, 11559], [11565, 11565], [11568, 11623], [11631, 11632], [11648, 11670], [11680, 11686], [11688, 11694], [11696, 11702], [11704, 11710], [11712, 11718], [11720, 11726], [11728, 11734], [11736, 11742], [12293, 12295], [12321, 12329], [12334, 12335], [12337, 12341], [12344, 12348], [12353, 12438], [12445, 12447], [12449, 12538], [12540, 12543], [12549, 12589], [12593, 12686], [12688, 12730], [12784, 12828], [12832, 12879], [12896, 12923], [12927, 12976], [12992, 13003], [13008, 13054], [13056, 13174], [13179, 13277], [13280, 13310], [13312, 13312], [19893, 19893], [19968, 19968], [40908, 40908], [40960, 42124], [42192, 42508], [42512, 42539], [42560, 42606], [42624, 42647], [42656, 42735], [42738, 42743], [42786, 42887], [42889, 42894], [42896, 42899], [42912, 42922], [43000, 43009], [43011, 43013], [43015, 43018], [43020, 43044], [43047, 43047], [43056, 43063], [43072, 43123], [43136, 43203], [43214, 43225], [43250, 43259], [43264, 43301], [43310, 43334], [43346, 43347], [43359, 43388], [43395, 43442], [43444, 43445], [43450, 43451], [43453, 43469], [43471, 43481], [43486, 43487], [43520, 43560], [43567, 43568], [43571, 43572], [43584, 43586], [43588, 43595], [43597, 43597], [43600, 43609], [43612, 43643], [43648, 43695], [43697, 43697], [43701, 43702], [43705, 43709], [43712, 43712], [43714, 43714], [43739, 43755], [43758, 43765], [43777, 43782], [43785, 43790], [43793, 43798], [43808, 43814], [43816, 43822], [43968, 44004], [44006, 44007], [44009, 44012], [44016, 44025], [44032, 44032], [55203, 55203], [55216, 55238], [55243, 55291], [55296, 55296], [56191, 56192], [56319, 56320], [57343, 57344], [63743, 64109], [64112, 64217], [64256, 64262], [64275, 64279], [65313, 65338], [65345, 65370], [65382, 65470], [65474, 65479], [65482, 65487], [65490, 65495], [65498, 65500], [65536, 65547], [65549, 65574], [65576, 65594], [65596, 65597], [65599, 65613], [65616, 65629], [65664, 65786], [65792, 65792], [65794, 65794], [65799, 65843], [65847, 65855], [66000, 66044], [66176, 66204], [66208, 66256], [66304, 66334], [66336, 66339], [66352, 66378], [66432, 66461], [66463, 66499], [66504, 66517], [66560, 66717], [66720, 66729], [69632, 69632], [69634, 69687], [69703, 69709], [69734, 69743], [69762, 69810], [69815, 69816], [69819, 69825], [69840, 69864], [69872, 69881], [69891, 69926], [69932, 69932], [69942, 69955], [70018, 70069], [70079, 70088], [70096, 70105], [71296, 71338], [71340, 71340], [71342, 71343], [71350, 71350], [71360, 71369], [73728, 74606], [74752, 74850], [74864, 74867], [77824, 78894], [92160, 92728], [93952, 94020], [94032, 94078], [94099, 94111], [110592, 110593], [118784, 119029], [119040, 119078], [119081, 119142], [119146, 119154], [119171, 119172], [119180, 119209], [119214, 119261], [119648, 119665], [119808, 119892], [119894, 119964], [119966, 119967], [119970, 119970], [119973, 119974], [119977, 119980], [119982, 119993], [119995, 119995], [119997, 120003], [120005, 120069], [120071, 120074], [120077, 120084], [120086, 120092], [120094, 120121], [120123, 120126], [120128, 120132], [120134, 120134], [120138, 120144], [120146, 120485], [120488, 120538], [120540, 120596], [120598, 120654], [120656, 120712], [120714, 120770], [120772, 120779], [127248, 127278], [127280, 127337], [127344, 127386], [127462, 127490], [127504, 127546], [127552, 127560], [127568, 127569], [131072, 131072], [173782, 173782], [173824, 173824], [177972, 177972], [177984, 177984], [178205, 178205], [194560, 195101], [983040, 983040], [1048573, 1048573], [1048576, 1048576], [1114109, 1114109]],
          "NSM": [[768, 879], [1155, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1552, 1562], [1611, 1631], [1648, 1648], [1750, 1756], [1759, 1764], [1767, 1768], [1770, 1773], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2070, 2073], [2075, 2083], [2085, 2087], [2089, 2093], [2137, 2139], [2276, 2302], [2304, 2306], [2362, 2362], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2391], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2641, 2641], [2672, 2673], [2677, 2677], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2884], [2893, 2893], [2902, 2902], [2914, 2915], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3170, 3171], [3260, 3260], [3276, 3277], [3298, 3299], [3393, 3396], [3405, 3405], [3426, 3427], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3981, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4151], [4153, 4154], [4157, 4158], [4184, 4185], [4190, 4192], [4209, 4212], [4226, 4226], [4229, 4230], [4237, 4237], [4253, 4253], [4957, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6742, 6742], [6744, 6750], [6752, 6752], [6754, 6754], [6757, 6764], [6771, 6780], [6783, 6783], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7040, 7041], [7074, 7077], [7080, 7081], [7083, 7083], [7142, 7142], [7144, 7145], [7149, 7149], [7151, 7153], [7212, 7219], [7222, 7223], [7376, 7378], [7380, 7392], [7394, 7400], [7405, 7405], [7412, 7412], [7616, 7654], [7676, 7679], [8400, 8432], [11503, 11505], [11647, 11647], [11744, 11775], [12330, 12333], [12441, 12442], [42607, 42610], [42612, 42621], [42655, 42655], [42736, 42737], [43010, 43010], [43014, 43014], [43019, 43019], [43045, 43046], [43204, 43204], [43232, 43249], [43302, 43309], [43335, 43345], [43392, 43394], [43443, 43443], [43446, 43449], [43452, 43452], [43561, 43566], [43569, 43570], [43573, 43574], [43587, 43587], [43596, 43596], [43696, 43696], [43698, 43700], [43703, 43704], [43710, 43711], [43713, 43713], [43756, 43757], [43766, 43766], [44005, 44005], [44008, 44008], [44013, 44013], [64286, 64286], [65024, 65039], [65056, 65062], [66045, 66045], [68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [69633, 69633], [69688, 69702], [69760, 69761], [69811, 69814], [69817, 69818], [69888, 69890], [69927, 69931], [69933, 69940], [70016, 70017], [70070, 70078], [71339, 71339], [71341, 71341], [71344, 71349], [71351, 71351], [94095, 94098], [119143, 119145], [119163, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917760, 917999]],
          "R": [[1470, 1470], [1472, 1472], [1475, 1475], [1478, 1478], [1488, 1514], [1520, 1524], [1984, 2026], [2036, 2037], [2042, 2042], [2048, 2069], [2074, 2074], [2084, 2084], [2088, 2088], [2096, 2110], [2112, 2136], [2142, 2142], [8207, 8207], [64285, 64285], [64287, 64296], [64298, 64310], [64312, 64316], [64318, 64318], [64320, 64321], [64323, 64324], [64326, 64335], [67584, 67589], [67592, 67592], [67594, 67637], [67639, 67640], [67644, 67644], [67647, 67669], [67671, 67679], [67840, 67867], [67872, 67897], [67903, 67903], [67968, 68023], [68030, 68031], [68096, 68096], [68112, 68115], [68117, 68119], [68121, 68147], [68160, 68167], [68176, 68184], [68192, 68223], [68352, 68405], [68416, 68437], [68440, 68466], [68472, 68479], [68608, 68680]],
          "AN": [[1536, 1540], [1632, 1641], [1643, 1644], [1757, 1757], [69216, 69246]],
          "AL": [[1544, 1544], [1547, 1547], [1549, 1549], [1563, 1563], [1566, 1610], [1645, 1647], [1649, 1749], [1765, 1766], [1774, 1775], [1786, 1805], [1807, 1808], [1810, 1839], [1869, 1957], [1969, 1969], [2208, 2208], [2210, 2220], [64336, 64449], [64467, 64829], [64848, 64911], [64914, 64967], [65008, 65020], [65136, 65140], [65142, 65276], [126464, 126467], [126469, 126495], [126497, 126498], [126500, 126500], [126503, 126503], [126505, 126514], [126516, 126519], [126521, 126521], [126523, 126523], [126530, 126530], [126535, 126535], [126537, 126537], [126539, 126539], [126541, 126543], [126545, 126546], [126548, 126548], [126551, 126551], [126553, 126553], [126555, 126555], [126557, 126557], [126559, 126559], [126561, 126562], [126564, 126564], [126567, 126570], [126572, 126578], [126580, 126583], [126585, 126588], [126590, 126590], [126592, 126601], [126603, 126619], [126625, 126627], [126629, 126633], [126635, 126651]],
          "LRE": [[8234, 8234]],
          "RLE": [[8235, 8235]],
          "PDF": [[8236, 8236]],
          "LRO": [[8237, 8237]],
          "RLO": [[8238, 8238]]
        },
        "bidi_mirrored": {
          "N": [[0, 39], [42, 59], [61, 61], [63, 90], [92, 92], [94, 122], [124, 124], [126, 170], [172, 186], [188, 887], [890, 894], [900, 906], [908, 908], [910, 929], [931, 1319], [1329, 1366], [1369, 1375], [1377, 1415], [1417, 1418], [1423, 1423], [1425, 1479], [1488, 1514], [1520, 1524], [1536, 1540], [1542, 1563], [1566, 1805], [1807, 1866], [1869, 1969], [1984, 2042], [2048, 2093], [2096, 2110], [2112, 2139], [2142, 2142], [2208, 2208], [2210, 2220], [2276, 2302], [2304, 2423], [2425, 2431], [2433, 2435], [2437, 2444], [2447, 2448], [2451, 2472], [2474, 2480], [2482, 2482], [2486, 2489], [2492, 2500], [2503, 2504], [2507, 2510], [2519, 2519], [2524, 2525], [2527, 2531], [2534, 2555], [2561, 2563], [2565, 2570], [2575, 2576], [2579, 2600], [2602, 2608], [2610, 2611], [2613, 2614], [2616, 2617], [2620, 2620], [2622, 2626], [2631, 2632], [2635, 2637], [2641, 2641], [2649, 2652], [2654, 2654], [2662, 2677], [2689, 2691], [2693, 2701], [2703, 2705], [2707, 2728], [2730, 2736], [2738, 2739], [2741, 2745], [2748, 2757], [2759, 2761], [2763, 2765], [2768, 2768], [2784, 2787], [2790, 2801], [2817, 2819], [2821, 2828], [2831, 2832], [2835, 2856], [2858, 2864], [2866, 2867], [2869, 2873], [2876, 2884], [2887, 2888], [2891, 2893], [2902, 2903], [2908, 2909], [2911, 2915], [2918, 2935], [2946, 2947], [2949, 2954], [2958, 2960], [2962, 2965], [2969, 2970], [2972, 2972], [2974, 2975], [2979, 2980], [2984, 2986], [2990, 3001], [3006, 3010], [3014, 3016], [3018, 3021], [3024, 3024], [3031, 3031], [3046, 3066], [3073, 3075], [3077, 3084], [3086, 3088], [3090, 3112], [3114, 3123], [3125, 3129], [3133, 3140], [3142, 3144], [3146, 3149], [3157, 3158], [3160, 3161], [3168, 3171], [3174, 3183], [3192, 3199], [3202, 3203], [3205, 3212], [3214, 3216], [3218, 3240], [3242, 3251], [3253, 3257], [3260, 3268], [3270, 3272], [3274, 3277], [3285, 3286], [3294, 3294], [3296, 3299], [3302, 3311], [3313, 3314], [3330, 3331], [3333, 3340], [3342, 3344], [3346, 3386], [3389, 3396], [3398, 3400], [3402, 3406], [3415, 3415], [3424, 3427], [3430, 3445], [3449, 3455], [3458, 3459], [3461, 3478], [3482, 3505], [3507, 3515], [3517, 3517], [3520, 3526], [3530, 3530], [3535, 3540], [3542, 3542], [3544, 3551], [3570, 3572], [3585, 3642], [3647, 3675], [3713, 3714], [3716, 3716], [3719, 3720], [3722, 3722], [3725, 3725], [3732, 3735], [3737, 3743], [3745, 3747], [3749, 3749], [3751, 3751], [3754, 3755], [3757, 3769], [3771, 3773], [3776, 3780], [3782, 3782], [3784, 3789], [3792, 3801], [3804, 3807], [3840, 3897], [3902, 3911], [3913, 3948], [3953, 3991], [3993, 4028], [4030, 4044], [4046, 4058], [4096, 4293], [4295, 4295], [4301, 4301], [4304, 4680], [4682, 4685], [4688, 4694], [4696, 4696], [4698, 4701], [4704, 4744], [4746, 4749], [4752, 4784], [4786, 4789], [4792, 4798], [4800, 4800], [4802, 4805], [4808, 4822], [4824, 4880], [4882, 4885], [4888, 4954], [4957, 4988], [4992, 5017], [5024, 5108], [5120, 5786], [5792, 5872], [5888, 5900], [5902, 5908], [5920, 5942], [5952, 5971], [5984, 5996], [5998, 6000], [6002, 6003], [6016, 6109], [6112, 6121], [6128, 6137], [6144, 6158], [6160, 6169], [6176, 6263], [6272, 6314], [6320, 6389], [6400, 6428], [6432, 6443], [6448, 6459], [6464, 6464], [6468, 6509], [6512, 6516], [6528, 6571], [6576, 6601], [6608, 6618], [6622, 6683], [6686, 6750], [6752, 6780], [6783, 6793], [6800, 6809], [6816, 6829], [6912, 6987], [6992, 7036], [7040, 7155], [7164, 7223], [7227, 7241], [7245, 7295], [7360, 7367], [7376, 7414], [7424, 7654], [7676, 7957], [7960, 7965], [7968, 8005], [8008, 8013], [8016, 8023], [8025, 8025], [8027, 8027], [8029, 8029], [8031, 8061], [8064, 8116], [8118, 8132], [8134, 8147], [8150, 8155], [8157, 8175], [8178, 8180], [8182, 8190], [8192, 8248], [8251, 8260], [8263, 8292], [8298, 8305], [8308, 8316], [8319, 8332], [8336, 8348], [8352, 8378], [8400, 8432], [8448, 8511], [8513, 8585], [8592, 8704], [8709, 8711], [8718, 8720], [8722, 8724], [8727, 8729], [8734, 8734], [8739, 8739], [8741, 8741], [8743, 8746], [8756, 8760], [8762, 8762], [8781, 8785], [8790, 8798], [8801, 8801], [8803, 8803], [8812, 8813], [8845, 8846], [8851, 8855], [8857, 8865], [8868, 8869], [8889, 8893], [8896, 8904], [8910, 8911], [8914, 8917], [8942, 8943], [8960, 8967], [8972, 8991], [8994, 9000], [9003, 9203], [9216, 9254], [9280, 9290], [9312, 9983], [9985, 10087], [10102, 10175], [10177, 10178], [10183, 10183], [10186, 10186], [10190, 10194], [10199, 10203], [10207, 10209], [10224, 10626], [10649, 10650], [10672, 10679], [10681, 10687], [10694, 10696], [10698, 10701], [10707, 10707], [10710, 10711], [10717, 10720], [10722, 10722], [10726, 10727], [10730, 10739], [10746, 10747], [10750, 10761], [10781, 10781], [10786, 10787], [10789, 10789], [10791, 10792], [10794, 10794], [10799, 10803], [10806, 10811], [10815, 10838], [10841, 10851], [10854, 10857], [10862, 10862], [10865, 10866], [10869, 10872], [10916, 10917], [10926, 10926], [10967, 10971], [10973, 10973], [10975, 10977], [10983, 10987], [10991, 10994], [10996, 10998], [11004, 11004], [11006, 11084], [11088, 11097], [11264, 11310], [11312, 11358], [11360, 11507], [11513, 11557], [11559, 11559], [11565, 11565], [11568, 11623], [11631, 11632], [11647, 11670], [11680, 11686], [11688, 11694], [11696, 11702], [11704, 11710], [11712, 11718], [11720, 11726], [11728, 11734], [11736, 11742], [11744, 11777], [11782, 11784], [11787, 11787], [11790, 11803], [11806, 11807], [11818, 11835], [11904, 11929], [11931, 12019], [12032, 12245], [12272, 12283], [12288, 12295], [12306, 12307], [12316, 12351], [12353, 12438], [12441, 12543], [12549, 12589], [12593, 12686], [12688, 12730], [12736, 12771], [12784, 12830], [12832, 13054], [13056, 13312], [19893, 19893], [19904, 19968], [40908, 40908], [40960, 42124], [42128, 42182], [42192, 42539], [42560, 42647], [42655, 42743], [42752, 42894], [42896, 42899], [42912, 42922], [43000, 43051], [43056, 43065], [43072, 43127], [43136, 43204], [43214, 43225], [43232, 43259], [43264, 43347], [43359, 43388], [43392, 43469], [43471, 43481], [43486, 43487], [43520, 43574], [43584, 43597], [43600, 43609], [43612, 43643], [43648, 43714], [43739, 43766], [43777, 43782], [43785, 43790], [43793, 43798], [43808, 43814], [43816, 43822], [43968, 44013], [44016, 44025], [44032, 44032], [55203, 55203], [55216, 55238], [55243, 55291], [55296, 55296], [56191, 56192], [56319, 56320], [57343, 57344], [63743, 64109], [64112, 64217], [64256, 64262], [64275, 64279], [64285, 64310], [64312, 64316], [64318, 64318], [64320, 64321], [64323, 64324], [64326, 64449], [64467, 64831], [64848, 64911], [64914, 64967], [65008, 65021], [65024, 65049], [65056, 65062], [65072, 65106], [65108, 65112], [65119, 65123], [65126, 65126], [65128, 65131], [65136, 65140], [65142, 65276], [65279, 65279], [65281, 65287], [65290, 65307], [65309, 65309], [65311, 65338], [65340, 65340], [65342, 65370], [65372, 65372], [65374, 65374], [65377, 65377], [65380, 65470], [65474, 65479], [65482, 65487], [65490, 65495], [65498, 65500], [65504, 65510], [65512, 65518], [65529, 65533], [65536, 65547], [65549, 65574], [65576, 65594], [65596, 65597], [65599, 65613], [65616, 65629], [65664, 65786], [65792, 65794], [65799, 65843], [65847, 65930], [65936, 65947], [66000, 66045], [66176, 66204], [66208, 66256], [66304, 66334], [66336, 66339], [66352, 66378], [66432, 66461], [66463, 66499], [66504, 66517], [66560, 66717], [66720, 66729], [67584, 67589], [67592, 67592], [67594, 67637], [67639, 67640], [67644, 67644], [67647, 67669], [67671, 67679], [67840, 67867], [67871, 67897], [67903, 67903], [67968, 68023], [68030, 68031], [68096, 68099], [68101, 68102], [68108, 68115], [68117, 68119], [68121, 68147], [68152, 68154], [68159, 68167], [68176, 68184], [68192, 68223], [68352, 68405], [68409, 68437], [68440, 68466], [68472, 68479], [68608, 68680], [69216, 69246], [69632, 69709], [69714, 69743], [69760, 69825], [69840, 69864], [69872, 69881], [69888, 69940], [69942, 69955], [70016, 70088], [70096, 70105], [71296, 71351], [71360, 71369], [73728, 74606], [74752, 74850], [74864, 74867], [77824, 78894], [92160, 92728], [93952, 94020], [94032, 94078], [94095, 94111], [110592, 110593], [118784, 119029], [119040, 119078], [119081, 119261], [119296, 119365], [119552, 119638], [119648, 119665], [119808, 119892], [119894, 119964], [119966, 119967], [119970, 119970], [119973, 119974], [119977, 119980], [119982, 119993], [119995, 119995], [119997, 120003], [120005, 120069], [120071, 120074], [120077, 120084], [120086, 120092], [120094, 120121], [120123, 120126], [120128, 120132], [120134, 120134], [120138, 120144], [120146, 120485], [120488, 120538], [120540, 120596], [120598, 120654], [120656, 120712], [120714, 120770], [120772, 120779], [120782, 120831], [126464, 126467], [126469, 126495], [126497, 126498], [126500, 126500], [126503, 126503], [126505, 126514], [126516, 126519], [126521, 126521], [126523, 126523], [126530, 126530], [126535, 126535], [126537, 126537], [126539, 126539], [126541, 126543], [126545, 126546], [126548, 126548], [126551, 126551], [126553, 126553], [126555, 126555], [126557, 126557], [126559, 126559], [126561, 126562], [126564, 126564], [126567, 126570], [126572, 126578], [126580, 126583], [126585, 126588], [126590, 126590], [126592, 126601], [126603, 126619], [126625, 126627], [126629, 126633], [126635, 126651], [126704, 126705], [126976, 127019], [127024, 127123], [127136, 127150], [127153, 127166], [127169, 127183], [127185, 127199], [127232, 127242], [127248, 127278], [127280, 127339], [127344, 127386], [127462, 127490], [127504, 127546], [127552, 127560], [127568, 127569], [127744, 127776], [127792, 127797], [127799, 127868], [127872, 127891], [127904, 127940], [127942, 127946], [127968, 127984], [128000, 128062], [128064, 128064], [128066, 128247], [128249, 128252], [128256, 128317], [128320, 128323], [128336, 128359], [128507, 128576], [128581, 128591], [128640, 128709], [128768, 128883], [131072, 131072], [173782, 173782], [173824, 173824], [177972, 177972], [177984, 177984], [178205, 178205], [194560, 195101], [917505, 917505], [917536, 917631], [917760, 917999], [983040, 983040], [1048573, 1048573], [1048576, 1048576], [1114109, 1114109]],
          "Y": [[40, 41], [60, 60], [62, 62], [91, 91], [93, 93], [123, 123], [125, 125], [171, 171], [187, 187], [3898, 3901], [5787, 5788], [8249, 8250], [8261, 8262], [8317, 8318], [8333, 8334], [8512, 8512], [8705, 8708], [8712, 8717], [8721, 8721], [8725, 8726], [8730, 8733], [8735, 8738], [8740, 8740], [8742, 8742], [8747, 8755], [8761, 8761], [8763, 8780], [8786, 8789], [8799, 8800], [8802, 8802], [8804, 8811], [8814, 8844], [8847, 8850], [8856, 8856], [8866, 8867], [8870, 8888], [8894, 8895], [8905, 8909], [8912, 8913], [8918, 8941], [8944, 8959], [8968, 8971], [8992, 8993], [9001, 9002], [10088, 10101], [10176, 10176], [10179, 10182], [10184, 10185], [10187, 10189], [10195, 10198], [10204, 10206], [10210, 10223], [10627, 10648], [10651, 10671], [10680, 10680], [10688, 10693], [10697, 10697], [10702, 10706], [10708, 10709], [10712, 10716], [10721, 10721], [10723, 10725], [10728, 10729], [10740, 10745], [10748, 10749], [10762, 10780], [10782, 10785], [10788, 10788], [10790, 10790], [10793, 10793], [10795, 10798], [10804, 10805], [10812, 10814], [10839, 10840], [10852, 10853], [10858, 10861], [10863, 10864], [10867, 10868], [10873, 10915], [10918, 10925], [10927, 10966], [10972, 10972], [10974, 10974], [10978, 10982], [10988, 10990], [10995, 10995], [10999, 11003], [11005, 11005], [11778, 11781], [11785, 11786], [11788, 11789], [11804, 11805], [11808, 11817], [12296, 12305], [12308, 12315], [65113, 65118], [65124, 65125], [65288, 65289], [65308, 65308], [65310, 65310], [65339, 65339], [65341, 65341], [65371, 65371], [65373, 65373], [65375, 65376], [65378, 65379], [120539, 120539], [120597, 120597], [120655, 120655], [120713, 120713], [120771, 120771]]
        }
      },
      "property_data": {
        "line_break": {
          "CM": [[0, 8], [14, 31], [127, 132], [134, 159], [768, 846], [848, 859], [867, 879], [1155, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1552, 1562], [1564, 1564], [1611, 1631], [1648, 1648], [1750, 1756], [1759, 1764], [1767, 1768], [1770, 1773], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2070, 2073], [2075, 2083], [2085, 2087], [2089, 2093], [2137, 2139], [2276, 2302], [2304, 2307], [2362, 2364], [2366, 2383], [2385, 2391], [2402, 2403], [2433, 2435], [2492, 2492], [2494, 2500], [2503, 2504], [2507, 2509], [2519, 2519], [2530, 2531], [2561, 2563], [2620, 2620], [2622, 2626], [2631, 2632], [2635, 2637], [2641, 2641], [2672, 2673], [2677, 2677], [2689, 2691], [2748, 2748], [2750, 2757], [2759, 2761], [2763, 2765], [2786, 2787], [2817, 2819], [2876, 2876], [2878, 2884], [2887, 2888], [2891, 2893], [2902, 2903], [2914, 2915], [2946, 2946], [3006, 3010], [3014, 3016], [3018, 3021], [3031, 3031], [3073, 3075], [3134, 3140], [3142, 3144], [3146, 3149], [3157, 3158], [3170, 3171], [3202, 3203], [3260, 3260], [3262, 3268], [3270, 3272], [3274, 3277], [3285, 3286], [3298, 3299], [3330, 3331], [3390, 3396], [3398, 3400], [3402, 3405], [3415, 3415], [3426, 3427], [3458, 3459], [3530, 3530], [3535, 3540], [3542, 3542], [3544, 3551], [3570, 3571], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3902, 3903], [3953, 3966], [3968, 3972], [3974, 3975], [3981, 3991], [3993, 4028], [4038, 4038], [4957, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6155, 6157], [6313, 6313], [6432, 6443], [6448, 6459], [6679, 6683], [6783, 6783], [6912, 6916], [6964, 6980], [7019, 7027], [7040, 7042], [7073, 7085], [7142, 7155], [7204, 7223], [7376, 7378], [7380, 7400], [7405, 7405], [7410, 7412], [7616, 7654], [7676, 7679], [8204, 8207], [8234, 8238], [8294, 8303], [8400, 8432], [11503, 11505], [11647, 11647], [11744, 11775], [12330, 12335], [12341, 12341], [12441, 12442], [42607, 42610], [42612, 42621], [42655, 42655], [42736, 42737], [43010, 43010], [43014, 43014], [43019, 43019], [43043, 43047], [43136, 43137], [43188, 43204], [43232, 43249], [43302, 43309], [43335, 43347], [43392, 43395], [43443, 43456], [43561, 43574], [43587, 43587], [43596, 43597], [43755, 43759], [43765, 43766], [44003, 44010], [44012, 44013], [64286, 64286], [65024, 65039], [65056, 65062], [65529, 65531], [66045, 66045], [68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [69632, 69634], [69688, 69702], [69760, 69762], [69808, 69818], [69888, 69890], [69927, 69940], [70016, 70018], [70067, 70080], [71339, 71351], [94033, 94078], [94095, 94098], [119141, 119145], [119149, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]],
          "BA": [[9, 9], [124, 124], [173, 173], [1418, 1418], [1470, 1470], [2404, 2405], [3674, 3675], [3851, 3851], [3892, 3892], [3967, 3967], [3973, 3973], [4030, 4031], [4050, 4050], [4170, 4171], [4961, 4961], [5120, 5120], [5760, 5760], [5867, 5869], [5941, 5942], [6100, 6101], [6104, 6104], [6106, 6106], [6148, 6149], [7002, 7003], [7005, 7008], [7227, 7231], [7294, 7295], [8192, 8198], [8200, 8202], [8208, 8208], [8210, 8211], [8231, 8231], [8278, 8278], [8280, 8283], [8285, 8287], [11514, 11516], [11519, 11519], [11632, 11632], [11790, 11797], [11799, 11799], [11801, 11801], [11818, 11821], [11824, 11825], [11827, 11828], [12288, 12288], [42238, 42239], [42509, 42509], [42511, 42511], [42739, 42743], [43214, 43215], [43310, 43311], [43463, 43465], [43613, 43615], [43760, 43761], [44011, 44011], [65792, 65794], [66463, 66463], [66512, 66512], [67671, 67671], [67871, 67871], [68176, 68183], [68409, 68415], [69703, 69704], [69822, 69825], [69952, 69955], [70085, 70086], [70088, 70088], [74864, 74867]],
          "LF": [[10, 10]],
          "BK": [[11, 12], [8232, 8233]],
          "CR": [[13, 13]],
          "SP": [[32, 32]],
          "EX": [[33, 33], [63, 63], [1478, 1478], [1563, 1563], [1566, 1567], [1748, 1748], [2041, 2041], [3853, 3857], [3860, 3860], [6146, 6147], [6152, 6153], [6468, 6469], [10082, 10083], [11513, 11513], [11518, 11518], [11822, 11822], [42510, 42510], [43126, 43127], [65045, 65046], [65110, 65111], [65281, 65281], [65311, 65311]],
          "QU": [[34, 34], [39, 39], [171, 171], [187, 187], [8216, 8217], [8219, 8221], [8223, 8223], [8249, 8250], [10075, 10078], [11776, 11789], [11804, 11805], [11808, 11809]],
          "AL": [[35, 35], [38, 38], [42, 42], [60, 62], [64, 90], [94, 122], [126, 126], [166, 166], [169, 169], [172, 172], [174, 175], [181, 181], [192, 214], [216, 246], [248, 710], [718, 719], [721, 727], [732, 732], [734, 734], [736, 767], [880, 887], [890, 893], [900, 906], [908, 908], [910, 929], [931, 1154], [1162, 1319], [1329, 1366], [1369, 1375], [1377, 1415], [1472, 1472], [1475, 1475], [1523, 1524], [1536, 1540], [1542, 1544], [1550, 1551], [1568, 1610], [1645, 1647], [1649, 1747], [1749, 1749], [1757, 1758], [1765, 1766], [1769, 1769], [1774, 1775], [1786, 1805], [1807, 1808], [1810, 1839], [1869, 1957], [1969, 1969], [1994, 2026], [2036, 2039], [2042, 2042], [2048, 2069], [2074, 2074], [2084, 2084], [2088, 2088], [2096, 2110], [2112, 2136], [2142, 2142], [2208, 2208], [2210, 2220], [2308, 2361], [2365, 2365], [2384, 2384], [2392, 2401], [2416, 2423], [2425, 2431], [2437, 2444], [2447, 2448], [2451, 2472], [2474, 2480], [2482, 2482], [2486, 2489], [2493, 2493], [2510, 2510], [2524, 2525], [2527, 2529], [2544, 2545], [2548, 2552], [2554, 2554], [2565, 2570], [2575, 2576], [2579, 2600], [2602, 2608], [2610, 2611], [2613, 2614], [2616, 2617], [2649, 2652], [2654, 2654], [2674, 2676], [2693, 2701], [2703, 2705], [2707, 2728], [2730, 2736], [2738, 2739], [2741, 2745], [2749, 2749], [2768, 2768], [2784, 2785], [2800, 2800], [2821, 2828], [2831, 2832], [2835, 2856], [2858, 2864], [2866, 2867], [2869, 2873], [2877, 2877], [2908, 2909], [2911, 2913], [2928, 2935], [2947, 2947], [2949, 2954], [2958, 2960], [2962, 2965], [2969, 2970], [2972, 2972], [2974, 2975], [2979, 2980], [2984, 2986], [2990, 3001], [3024, 3024], [3056, 3064], [3066, 3066], [3077, 3084], [3086, 3088], [3090, 3112], [3114, 3123], [3125, 3129], [3133, 3133], [3160, 3161], [3168, 3169], [3192, 3199], [3205, 3212], [3214, 3216], [3218, 3240], [3242, 3251], [3253, 3257], [3261, 3261], [3294, 3294], [3296, 3297], [3313, 3314], [3333, 3340], [3342, 3344], [3346, 3386], [3389, 3389], [3406, 3406], [3424, 3425], [3440, 3445], [3450, 3455], [3461, 3478], [3482, 3505], [3507, 3515], [3517, 3517], [3520, 3526], [3572, 3572], [3663, 3663], [3840, 3840], [3845, 3845], [3859, 3859], [3861, 3863], [3866, 3871], [3882, 3891], [3894, 3894], [3896, 3896], [3904, 3911], [3913, 3948], [3976, 3980], [4032, 4037], [4039, 4044], [4046, 4047], [4052, 4056], [4172, 4175], [4256, 4293], [4295, 4295], [4301, 4301], [4304, 4351], [4608, 4680], [4682, 4685], [4688, 4694], [4696, 4696], [4698, 4701], [4704, 4744], [4746, 4749], [4752, 4784], [4786, 4789], [4792, 4798], [4800, 4800], [4802, 4805], [4808, 4822], [4824, 4880], [4882, 4885], [4888, 4954], [4960, 4960], [4962, 4988], [4992, 5017], [5024, 5108], [5121, 5759], [5761, 5786], [5792, 5866], [5870, 5872], [5888, 5900], [5902, 5905], [5920, 5937], [5952, 5969], [5984, 5996], [5998, 6000], [6105, 6105], [6128, 6137], [6144, 6145], [6151, 6151], [6154, 6154], [6176, 6263], [6272, 6312], [6314, 6314], [6320, 6389], [6400, 6428], [6464, 6464], [6624, 6678], [6686, 6687], [6917, 6963], [6981, 6987], [7004, 7004], [7009, 7018], [7028, 7036], [7043, 7072], [7086, 7087], [7098, 7141], [7164, 7203], [7245, 7247], [7258, 7293], [7360, 7367], [7379, 7379], [7401, 7404], [7406, 7409], [7413, 7414], [7424, 7615], [7680, 7957], [7960, 7965], [7968, 8005], [8008, 8013], [8016, 8023], [8025, 8025], [8027, 8027], [8029, 8029], [8031, 8061], [8064, 8116], [8118, 8132], [8134, 8147], [8150, 8155], [8157, 8175], [8178, 8180], [8182, 8188], [8190, 8190], [8215, 8215], [8226, 8227], [8248, 8248], [8254, 8259], [8266, 8277], [8279, 8279], [8284, 8284], [8289, 8292], [8304, 8305], [8309, 8316], [8320, 8320], [8325, 8332], [8336, 8348], [8448, 8450], [8452, 8452], [8454, 8456], [8458, 8466], [8468, 8469], [8471, 8480], [8483, 8490], [8492, 8531], [8534, 8538], [8540, 8541], [8543, 8543], [8556, 8559], [8570, 8584], [8602, 8657], [8659, 8659], [8661, 8703], [8705, 8705], [8708, 8710], [8713, 8714], [8716, 8718], [8720, 8720], [8724, 8724], [8726, 8729], [8731, 8732], [8737, 8738], [8740, 8740], [8742, 8742], [8749, 8749], [8751, 8755], [8760, 8763], [8766, 8775], [8777, 8779], [8781, 8785], [8787, 8799], [8802, 8803], [8808, 8809], [8812, 8813], [8816, 8833], [8836, 8837], [8840, 8852], [8854, 8856], [8858, 8868], [8870, 8894], [8896, 8977], [8979, 8985], [8988, 9000], [9003, 9199], [9216, 9254], [9280, 9290], [9471, 9471], [9548, 9551], [9589, 9599], [9616, 9617], [9622, 9631], [9634, 9634], [9642, 9649], [9652, 9653], [9656, 9659], [9662, 9663], [9666, 9669], [9673, 9674], [9676, 9677], [9682, 9697], [9702, 9710], [9712, 9727], [9732, 9732], [9735, 9736], [9738, 9741], [9744, 9747], [9753, 9753], [9760, 9784], [9788, 9791], [9793, 9793], [9795, 9823], [9826, 9826], [9830, 9830], [9835, 9835], [9838, 9838], [9840, 9854], [9856, 9885], [9888, 9916], [9934, 9934], [9954, 9954], [9956, 9959], [9989, 9991], [9998, 10070], [10072, 10074], [10079, 10081], [10084, 10087], [10132, 10180], [10183, 10213], [10224, 10626], [10649, 10711], [10716, 10747], [10750, 11084], [11088, 11092], [11264, 11310], [11312, 11358], [11360, 11502], [11506, 11507], [11517, 11517], [11520, 11557], [11559, 11559], [11565, 11565], [11568, 11623], [11631, 11631], [11648, 11670], [11680, 11686], [11688, 11694], [11696, 11702], [11704, 11710], [11712, 11718], [11720, 11726], [11728, 11734], [11736, 11742], [11798, 11798], [11802, 11803], [11806, 11807], [11823, 11823], [11826, 11826], [11829, 11833], [19904, 19967], [42192, 42237], [42240, 42508], [42512, 42527], [42538, 42539], [42560, 42606], [42611, 42611], [42622, 42647], [42656, 42735], [42738, 42738], [42752, 42894], [42896, 42899], [42912, 42922], [43000, 43009], [43011, 43013], [43015, 43018], [43020, 43042], [43048, 43051], [43056, 43063], [43065, 43065], [43072, 43123], [43138, 43187], [43250, 43259], [43274, 43301], [43312, 43334], [43359, 43359], [43396, 43442], [43457, 43462], [43466, 43469], [43471, 43471], [43486, 43487], [43520, 43560], [43584, 43586], [43588, 43595], [43612, 43612], [43744, 43754], [43762, 43764], [43777, 43782], [43785, 43790], [43793, 43798], [43808, 43814], [43816, 43822], [43968, 44002], [64256, 64262], [64275, 64279], [64297, 64297], [64336, 64449], [64467, 64829], [64848, 64911], [64914, 64967], [65008, 65019], [65021, 65021], [65136, 65140], [65142, 65276], [65382, 65382], [65393, 65437], [65440, 65470], [65474, 65479], [65482, 65487], [65490, 65495], [65498, 65500], [65512, 65518], [65536, 65547], [65549, 65574], [65576, 65594], [65596, 65597], [65599, 65613], [65616, 65629], [65664, 65786], [65799, 65843], [65847, 65930], [65936, 65947], [66000, 66044], [66176, 66204], [66208, 66256], [66304, 66334], [66336, 66339], [66352, 66378], [66432, 66461], [66464, 66499], [66504, 66511], [66513, 66517], [66560, 66717], [67584, 67589], [67592, 67592], [67594, 67637], [67639, 67640], [67644, 67644], [67647, 67669], [67672, 67679], [67840, 67867], [67872, 67897], [67903, 67903], [67968, 68023], [68030, 68031], [68096, 68096], [68112, 68115], [68117, 68119], [68121, 68147], [68160, 68167], [68184, 68184], [68192, 68223], [68352, 68405], [68416, 68437], [68440, 68466], [68472, 68479], [68608, 68680], [69216, 69246], [69635, 69687], [69705, 69709], [69714, 69733], [69763, 69807], [69819, 69821], [69840, 69864], [69891, 69926], [70019, 70066], [70081, 70084], [70087, 70087], [71296, 71338], [73728, 74606], [74752, 74850], [77824, 78423], [78430, 78465], [78467, 78469], [78474, 78712], [78716, 78894], [92160, 92728], [93952, 94020], [94032, 94032], [94099, 94111], [118784, 119029], [119040, 119078], [119081, 119140], [119146, 119148], [119171, 119172], [119180, 119209], [119214, 119261], [119296, 119361], [119365, 119365], [119552, 119638], [119648, 119665], [119808, 119892], [119894, 119964], [119966, 119967], [119970, 119970], [119973, 119974], [119977, 119980], [119982, 119993], [119995, 119995], [119997, 120003], [120005, 120069], [120071, 120074], [120077, 120084], [120086, 120092], [120094, 120121], [120123, 120126], [120128, 120132], [120134, 120134], [120138, 120144], [120146, 120485], [120488, 120779], [126464, 126467], [126469, 126495], [126497, 126498], [126500, 126500], [126503, 126503], [126505, 126514], [126516, 126519], [126521, 126521], [126523, 126523], [126530, 126530], [126535, 126535], [126537, 126537], [126539, 126539], [126541, 126543], [126545, 126546], [126548, 126548], [126551, 126551], [126553, 126553], [126555, 126555], [126557, 126557], [126559, 126559], [126561, 126562], [126564, 126564], [126567, 126570], [126572, 126578], [126580, 126583], [126585, 126588], [126590, 126590], [126592, 126601], [126603, 126619], [126625, 126627], [126629, 126633], [126635, 126651], [126704, 126705], [127278, 127278], [127338, 127339], [127925, 127926], [127932, 127932], [128160, 128160], [128162, 128162], [128164, 128164], [128175, 128175], [128177, 128178], [128256, 128262], [128279, 128292], [128306, 128317], [128320, 128323], [128768, 128883]],
          "PR": [[36, 36], [43, 43], [92, 92], [163, 165], [177, 177], [1423, 1423], [2555, 2555], [2801, 2801], [3065, 3065], [3647, 3647], [6107, 6107], [8352, 8358], [8360, 8373], [8375, 8399], [8470, 8470], [8722, 8723], [65129, 65129], [65284, 65284], [65505, 65505], [65509, 65510]],
          "PO": [[37, 37], [162, 162], [176, 176], [1545, 1547], [1642, 1642], [2546, 2547], [2553, 2553], [3449, 3449], [8240, 8247], [8359, 8359], [8374, 8374], [8451, 8451], [8457, 8457], [43064, 43064], [65020, 65020], [65130, 65130], [65285, 65285], [65504, 65504]],
          "OP": [[40, 40], [91, 91], [123, 123], [161, 161], [191, 191], [3898, 3898], [3900, 3900], [5787, 5787], [8218, 8218], [8222, 8222], [8261, 8261], [8317, 8317], [8333, 8333], [9001, 9001], [10088, 10088], [10090, 10090], [10092, 10092], [10094, 10094], [10096, 10096], [10098, 10098], [10100, 10100], [10181, 10181], [10214, 10214], [10216, 10216], [10218, 10218], [10220, 10220], [10222, 10222], [10627, 10627], [10629, 10629], [10631, 10631], [10633, 10633], [10635, 10635], [10637, 10637], [10639, 10639], [10641, 10641], [10643, 10643], [10645, 10645], [10647, 10647], [10712, 10712], [10714, 10714], [10748, 10748], [11800, 11800], [11810, 11810], [11812, 11812], [11814, 11814], [11816, 11816], [12296, 12296], [12298, 12298], [12300, 12300], [12302, 12302], [12304, 12304], [12308, 12308], [12310, 12310], [12312, 12312], [12314, 12314], [12317, 12317], [64830, 64830], [65047, 65047], [65077, 65077], [65079, 65079], [65081, 65081], [65083, 65083], [65085, 65085], [65087, 65087], [65089, 65089], [65091, 65091], [65095, 65095], [65113, 65113], [65115, 65115], [65117, 65117], [65288, 65288], [65339, 65339], [65371, 65371], [65375, 65375], [65378, 65378], [78424, 78426], [78470, 78470], [78472, 78472], [78713, 78713]],
          "CP": [[41, 41], [93, 93]],
          "IS": [[44, 44], [46, 46], [58, 59], [894, 894], [1417, 1417], [1548, 1549], [2040, 2040], [8260, 8260], [65040, 65040], [65043, 65044]],
          "HY": [[45, 45]],
          "SY": [[47, 47]],
          "NU": [[48, 57], [1632, 1641], [1643, 1644], [1776, 1785], [1984, 1993], [2406, 2415], [2534, 2543], [2662, 2671], [2790, 2799], [2918, 2927], [3046, 3055], [3174, 3183], [3302, 3311], [3430, 3439], [3664, 3673], [3792, 3801], [3872, 3881], [4160, 4169], [4240, 4249], [6112, 6121], [6160, 6169], [6470, 6479], [6608, 6617], [6784, 6793], [6800, 6809], [6992, 7001], [7088, 7097], [7232, 7241], [7248, 7257], [42528, 42537], [43216, 43225], [43264, 43273], [43472, 43481], [43600, 43609], [44016, 44025], [66720, 66729], [69734, 69743], [69872, 69881], [69942, 69951], [70096, 70105], [71360, 71369], [120782, 120831]],
          "CL": [[125, 125], [3899, 3899], [3901, 3901], [5788, 5788], [8262, 8262], [8318, 8318], [8334, 8334], [9002, 9002], [10089, 10089], [10091, 10091], [10093, 10093], [10095, 10095], [10097, 10097], [10099, 10099], [10101, 10101], [10182, 10182], [10215, 10215], [10217, 10217], [10219, 10219], [10221, 10221], [10223, 10223], [10628, 10628], [10630, 10630], [10632, 10632], [10634, 10634], [10636, 10636], [10638, 10638], [10640, 10640], [10642, 10642], [10644, 10644], [10646, 10646], [10648, 10648], [10713, 10713], [10715, 10715], [10749, 10749], [11811, 11811], [11813, 11813], [11815, 11815], [11817, 11817], [12289, 12290], [12297, 12297], [12299, 12299], [12301, 12301], [12303, 12303], [12305, 12305], [12309, 12309], [12311, 12311], [12313, 12313], [12315, 12315], [12318, 12319], [64831, 64831], [65041, 65042], [65048, 65048], [65078, 65078], [65080, 65080], [65082, 65082], [65084, 65084], [65086, 65086], [65088, 65088], [65090, 65090], [65092, 65092], [65096, 65096], [65104, 65104], [65106, 65106], [65114, 65114], [65116, 65116], [65118, 65118], [65289, 65289], [65292, 65292], [65294, 65294], [65341, 65341], [65373, 65373], [65376, 65377], [65379, 65380], [78427, 78429], [78466, 78466], [78471, 78471], [78473, 78473], [78714, 78715]],
          "NL": [[133, 133]],
          "GL": [[160, 160], [847, 847], [860, 866], [3848, 3848], [3852, 3852], [3858, 3858], [4057, 4058], [6158, 6158], [8199, 8199], [8209, 8209], [8239, 8239]],
          "AI": [[167, 168], [170, 170], [178, 179], [182, 186], [188, 190], [215, 215], [247, 247], [711, 711], [713, 715], [717, 717], [720, 720], [728, 731], [733, 733], [8213, 8214], [8224, 8225], [8251, 8251], [8308, 8308], [8319, 8319], [8321, 8324], [8453, 8453], [8467, 8467], [8481, 8482], [8491, 8491], [8532, 8533], [8539, 8539], [8542, 8542], [8544, 8555], [8560, 8569], [8585, 8585], [8592, 8601], [8658, 8658], [8660, 8660], [8704, 8704], [8706, 8707], [8711, 8712], [8715, 8715], [8719, 8719], [8721, 8721], [8725, 8725], [8730, 8730], [8733, 8736], [8739, 8739], [8741, 8741], [8743, 8748], [8750, 8750], [8756, 8759], [8764, 8765], [8776, 8776], [8780, 8780], [8786, 8786], [8800, 8801], [8804, 8807], [8810, 8811], [8814, 8815], [8834, 8835], [8838, 8839], [8853, 8853], [8857, 8857], [8869, 8869], [8895, 8895], [8978, 8978], [9312, 9470], [9472, 9547], [9552, 9588], [9600, 9615], [9618, 9621], [9632, 9633], [9635, 9641], [9650, 9651], [9654, 9655], [9660, 9661], [9664, 9665], [9670, 9672], [9675, 9675], [9678, 9681], [9698, 9701], [9711, 9711], [9733, 9734], [9737, 9737], [9742, 9743], [9750, 9751], [9792, 9792], [9794, 9794], [9824, 9825], [9827, 9829], [9831, 9831], [9833, 9834], [9836, 9837], [9839, 9839], [9886, 9887], [9929, 9932], [9938, 9938], [9941, 9943], [9946, 9947], [9949, 9950], [9955, 9955], [9960, 9961], [9963, 9968], [9974, 9974], [9979, 9980], [10071, 10071], [10102, 10131], [11093, 11097], [12872, 12879], [65533, 65533], [127232, 127242], [127248, 127277], [127280, 127337], [127344, 127386]],
          "BB": [[180, 180], [712, 712], [716, 716], [735, 735], [3841, 3844], [3846, 3847], [3849, 3850], [4048, 4049], [4051, 4051], [6150, 6150], [8189, 8189], [43124, 43125]],
          "HL": [[1488, 1514], [1520, 1522], [64285, 64285], [64287, 64296], [64298, 64310], [64312, 64316], [64318, 64318], [64320, 64321], [64323, 64324], [64326, 64335]],
          "SA": [[3585, 3642], [3648, 3662], [3713, 3714], [3716, 3716], [3719, 3720], [3722, 3722], [3725, 3725], [3732, 3735], [3737, 3743], [3745, 3747], [3749, 3749], [3751, 3751], [3754, 3755], [3757, 3769], [3771, 3773], [3776, 3780], [3782, 3782], [3784, 3789], [3804, 3807], [4096, 4159], [4176, 4239], [4250, 4255], [6016, 6099], [6103, 6103], [6108, 6109], [6480, 6509], [6512, 6516], [6528, 6571], [6576, 6601], [6618, 6618], [6622, 6623], [6688, 6750], [6752, 6780], [6816, 6829], [43616, 43643], [43648, 43714], [43739, 43743]],
          "JL": [[4352, 4447], [43360, 43388]],
          "JV": [[4448, 4519], [55216, 55238]],
          "JT": [[4520, 4607], [55243, 55291]],
          "NS": [[6102, 6102], [8252, 8253], [8263, 8265], [12293, 12293], [12316, 12316], [12347, 12348], [12443, 12446], [12448, 12448], [12539, 12539], [12541, 12542], [40981, 40981], [65108, 65109], [65306, 65307], [65381, 65381], [65438, 65439]],
          "ZW": [[8203, 8203]],
          "B2": [[8212, 8212], [11834, 11835]],
          "IN": [[8228, 8230], [65049, 65049]],
          "WJ": [[8288, 8288], [65279, 65279]],
          "ID": [[8986, 8987], [9200, 9203], [9728, 9731], [9748, 9749], [9752, 9752], [9754, 9759], [9785, 9787], [9832, 9832], [9855, 9855], [9917, 9928], [9933, 9933], [9935, 9937], [9939, 9940], [9944, 9945], [9948, 9948], [9951, 9953], [9962, 9962], [9969, 9973], [9975, 9978], [9981, 9983], [9985, 9988], [9992, 9997], [11904, 11929], [11931, 12019], [12032, 12245], [12272, 12283], [12291, 12292], [12294, 12295], [12306, 12307], [12320, 12329], [12336, 12340], [12342, 12346], [12349, 12351], [12354, 12354], [12356, 12356], [12358, 12358], [12360, 12360], [12362, 12386], [12388, 12418], [12420, 12420], [12422, 12422], [12424, 12429], [12431, 12436], [12447, 12447], [12450, 12450], [12452, 12452], [12454, 12454], [12456, 12456], [12458, 12482], [12484, 12514], [12516, 12516], [12518, 12518], [12520, 12525], [12527, 12532], [12535, 12538], [12543, 12543], [12549, 12589], [12593, 12686], [12688, 12730], [12736, 12771], [12800, 12830], [12832, 12871], [12880, 13054], [13056, 19903], [19968, 40980], [40982, 42124], [42128, 42182], [63744, 64255], [65072, 65076], [65093, 65094], [65097, 65103], [65105, 65105], [65112, 65112], [65119, 65126], [65128, 65128], [65131, 65131], [65282, 65283], [65286, 65287], [65290, 65291], [65293, 65293], [65295, 65305], [65308, 65310], [65312, 65338], [65340, 65340], [65342, 65370], [65372, 65372], [65374, 65374], [65506, 65508], [110592, 110593], [126976, 127019], [127024, 127123], [127136, 127150], [127153, 127166], [127169, 127183], [127185, 127199], [127488, 127490], [127504, 127546], [127552, 127560], [127568, 127569], [127744, 127776], [127792, 127797], [127799, 127868], [127872, 127891], [127904, 127924], [127927, 127931], [127933, 127940], [127942, 127946], [127968, 127984], [128000, 128062], [128064, 128064], [128066, 128159], [128161, 128161], [128163, 128163], [128165, 128174], [128176, 128176], [128179, 128247], [128249, 128252], [128263, 128278], [128293, 128305], [128336, 128359], [128507, 128576], [128581, 128591], [128640, 128709], [131072, 196605], [196608, 262141]],
          "CJ": [[12353, 12353], [12355, 12355], [12357, 12357], [12359, 12359], [12361, 12361], [12387, 12387], [12419, 12419], [12421, 12421], [12423, 12423], [12430, 12430], [12437, 12438], [12449, 12449], [12451, 12451], [12453, 12453], [12455, 12455], [12457, 12457], [12483, 12483], [12515, 12515], [12517, 12517], [12519, 12519], [12526, 12526], [12533, 12534], [12540, 12540], [12784, 12799], [65383, 65392]],
          "H2": [[44032, 44032], [44060, 44060], [44088, 44088], [44116, 44116], [44144, 44144], [44172, 44172], [44200, 44200], [44228, 44228], [44256, 44256], [44284, 44284], [44312, 44312], [44340, 44340], [44368, 44368], [44396, 44396], [44424, 44424], [44452, 44452], [44480, 44480], [44508, 44508], [44536, 44536], [44564, 44564], [44592, 44592], [44620, 44620], [44648, 44648], [44676, 44676], [44704, 44704], [44732, 44732], [44760, 44760], [44788, 44788], [44816, 44816], [44844, 44844], [44872, 44872], [44900, 44900], [44928, 44928], [44956, 44956], [44984, 44984], [45012, 45012], [45040, 45040], [45068, 45068], [45096, 45096], [45124, 45124], [45152, 45152], [45180, 45180], [45208, 45208], [45236, 45236], [45264, 45264], [45292, 45292], [45320, 45320], [45348, 45348], [45376, 45376], [45404, 45404], [45432, 45432], [45460, 45460], [45488, 45488], [45516, 45516], [45544, 45544], [45572, 45572], [45600, 45600], [45628, 45628], [45656, 45656], [45684, 45684], [45712, 45712], [45740, 45740], [45768, 45768], [45796, 45796], [45824, 45824], [45852, 45852], [45880, 45880], [45908, 45908], [45936, 45936], [45964, 45964], [45992, 45992], [46020, 46020], [46048, 46048], [46076, 46076], [46104, 46104], [46132, 46132], [46160, 46160], [46188, 46188], [46216, 46216], [46244, 46244], [46272, 46272], [46300, 46300], [46328, 46328], [46356, 46356], [46384, 46384], [46412, 46412], [46440, 46440], [46468, 46468], [46496, 46496], [46524, 46524], [46552, 46552], [46580, 46580], [46608, 46608], [46636, 46636], [46664, 46664], [46692, 46692], [46720, 46720], [46748, 46748], [46776, 46776], [46804, 46804], [46832, 46832], [46860, 46860], [46888, 46888], [46916, 46916], [46944, 46944], [46972, 46972], [47000, 47000], [47028, 47028], [47056, 47056], [47084, 47084], [47112, 47112], [47140, 47140], [47168, 47168], [47196, 47196], [47224, 47224], [47252, 47252], [47280, 47280], [47308, 47308], [47336, 47336], [47364, 47364], [47392, 47392], [47420, 47420], [47448, 47448], [47476, 47476], [47504, 47504], [47532, 47532], [47560, 47560], [47588, 47588], [47616, 47616], [47644, 47644], [47672, 47672], [47700, 47700], [47728, 47728], [47756, 47756], [47784, 47784], [47812, 47812], [47840, 47840], [47868, 47868], [47896, 47896], [47924, 47924], [47952, 47952], [47980, 47980], [48008, 48008], [48036, 48036], [48064, 48064], [48092, 48092], [48120, 48120], [48148, 48148], [48176, 48176], [48204, 48204], [48232, 48232], [48260, 48260], [48288, 48288], [48316, 48316], [48344, 48344], [48372, 48372], [48400, 48400], [48428, 48428], [48456, 48456], [48484, 48484], [48512, 48512], [48540, 48540], [48568, 48568], [48596, 48596], [48624, 48624], [48652, 48652], [48680, 48680], [48708, 48708], [48736, 48736], [48764, 48764], [48792, 48792], [48820, 48820], [48848, 48848], [48876, 48876], [48904, 48904], [48932, 48932], [48960, 48960], [48988, 48988], [49016, 49016], [49044, 49044], [49072, 49072], [49100, 49100], [49128, 49128], [49156, 49156], [49184, 49184], [49212, 49212], [49240, 49240], [49268, 49268], [49296, 49296], [49324, 49324], [49352, 49352], [49380, 49380], [49408, 49408], [49436, 49436], [49464, 49464], [49492, 49492], [49520, 49520], [49548, 49548], [49576, 49576], [49604, 49604], [49632, 49632], [49660, 49660], [49688, 49688], [49716, 49716], [49744, 49744], [49772, 49772], [49800, 49800], [49828, 49828], [49856, 49856], [49884, 49884], [49912, 49912], [49940, 49940], [49968, 49968], [49996, 49996], [50024, 50024], [50052, 50052], [50080, 50080], [50108, 50108], [50136, 50136], [50164, 50164], [50192, 50192], [50220, 50220], [50248, 50248], [50276, 50276], [50304, 50304], [50332, 50332], [50360, 50360], [50388, 50388], [50416, 50416], [50444, 50444], [50472, 50472], [50500, 50500], [50528, 50528], [50556, 50556], [50584, 50584], [50612, 50612], [50640, 50640], [50668, 50668], [50696, 50696], [50724, 50724], [50752, 50752], [50780, 50780], [50808, 50808], [50836, 50836], [50864, 50864], [50892, 50892], [50920, 50920], [50948, 50948], [50976, 50976], [51004, 51004], [51032, 51032], [51060, 51060], [51088, 51088], [51116, 51116], [51144, 51144], [51172, 51172], [51200, 51200], [51228, 51228], [51256, 51256], [51284, 51284], [51312, 51312], [51340, 51340], [51368, 51368], [51396, 51396], [51424, 51424], [51452, 51452], [51480, 51480], [51508, 51508], [51536, 51536], [51564, 51564], [51592, 51592], [51620, 51620], [51648, 51648], [51676, 51676], [51704, 51704], [51732, 51732], [51760, 51760], [51788, 51788], [51816, 51816], [51844, 51844], [51872, 51872], [51900, 51900], [51928, 51928], [51956, 51956], [51984, 51984], [52012, 52012], [52040, 52040], [52068, 52068], [52096, 52096], [52124, 52124], [52152, 52152], [52180, 52180], [52208, 52208], [52236, 52236], [52264, 52264], [52292, 52292], [52320, 52320], [52348, 52348], [52376, 52376], [52404, 52404], [52432, 52432], [52460, 52460], [52488, 52488], [52516, 52516], [52544, 52544], [52572, 52572], [52600, 52600], [52628, 52628], [52656, 52656], [52684, 52684], [52712, 52712], [52740, 52740], [52768, 52768], [52796, 52796], [52824, 52824], [52852, 52852], [52880, 52880], [52908, 52908], [52936, 52936], [52964, 52964], [52992, 52992], [53020, 53020], [53048, 53048], [53076, 53076], [53104, 53104], [53132, 53132], [53160, 53160], [53188, 53188], [53216, 53216], [53244, 53244], [53272, 53272], [53300, 53300], [53328, 53328], [53356, 53356], [53384, 53384], [53412, 53412], [53440, 53440], [53468, 53468], [53496, 53496], [53524, 53524], [53552, 53552], [53580, 53580], [53608, 53608], [53636, 53636], [53664, 53664], [53692, 53692], [53720, 53720], [53748, 53748], [53776, 53776], [53804, 53804], [53832, 53832], [53860, 53860], [53888, 53888], [53916, 53916], [53944, 53944], [53972, 53972], [54000, 54000], [54028, 54028], [54056, 54056], [54084, 54084], [54112, 54112], [54140, 54140], [54168, 54168], [54196, 54196], [54224, 54224], [54252, 54252], [54280, 54280], [54308, 54308], [54336, 54336], [54364, 54364], [54392, 54392], [54420, 54420], [54448, 54448], [54476, 54476], [54504, 54504], [54532, 54532], [54560, 54560], [54588, 54588], [54616, 54616], [54644, 54644], [54672, 54672], [54700, 54700], [54728, 54728], [54756, 54756], [54784, 54784], [54812, 54812], [54840, 54840], [54868, 54868], [54896, 54896], [54924, 54924], [54952, 54952], [54980, 54980], [55008, 55008], [55036, 55036], [55064, 55064], [55092, 55092], [55120, 55120], [55148, 55148], [55176, 55176]],
          "H3": [[44033, 44059], [44061, 44087], [44089, 44115], [44117, 44143], [44145, 44171], [44173, 44199], [44201, 44227], [44229, 44255], [44257, 44283], [44285, 44311], [44313, 44339], [44341, 44367], [44369, 44395], [44397, 44423], [44425, 44451], [44453, 44479], [44481, 44507], [44509, 44535], [44537, 44563], [44565, 44591], [44593, 44619], [44621, 44647], [44649, 44675], [44677, 44703], [44705, 44731], [44733, 44759], [44761, 44787], [44789, 44815], [44817, 44843], [44845, 44871], [44873, 44899], [44901, 44927], [44929, 44955], [44957, 44983], [44985, 45011], [45013, 45039], [45041, 45067], [45069, 45095], [45097, 45123], [45125, 45151], [45153, 45179], [45181, 45207], [45209, 45235], [45237, 45263], [45265, 45291], [45293, 45319], [45321, 45347], [45349, 45375], [45377, 45403], [45405, 45431], [45433, 45459], [45461, 45487], [45489, 45515], [45517, 45543], [45545, 45571], [45573, 45599], [45601, 45627], [45629, 45655], [45657, 45683], [45685, 45711], [45713, 45739], [45741, 45767], [45769, 45795], [45797, 45823], [45825, 45851], [45853, 45879], [45881, 45907], [45909, 45935], [45937, 45963], [45965, 45991], [45993, 46019], [46021, 46047], [46049, 46075], [46077, 46103], [46105, 46131], [46133, 46159], [46161, 46187], [46189, 46215], [46217, 46243], [46245, 46271], [46273, 46299], [46301, 46327], [46329, 46355], [46357, 46383], [46385, 46411], [46413, 46439], [46441, 46467], [46469, 46495], [46497, 46523], [46525, 46551], [46553, 46579], [46581, 46607], [46609, 46635], [46637, 46663], [46665, 46691], [46693, 46719], [46721, 46747], [46749, 46775], [46777, 46803], [46805, 46831], [46833, 46859], [46861, 46887], [46889, 46915], [46917, 46943], [46945, 46971], [46973, 46999], [47001, 47027], [47029, 47055], [47057, 47083], [47085, 47111], [47113, 47139], [47141, 47167], [47169, 47195], [47197, 47223], [47225, 47251], [47253, 47279], [47281, 47307], [47309, 47335], [47337, 47363], [47365, 47391], [47393, 47419], [47421, 47447], [47449, 47475], [47477, 47503], [47505, 47531], [47533, 47559], [47561, 47587], [47589, 47615], [47617, 47643], [47645, 47671], [47673, 47699], [47701, 47727], [47729, 47755], [47757, 47783], [47785, 47811], [47813, 47839], [47841, 47867], [47869, 47895], [47897, 47923], [47925, 47951], [47953, 47979], [47981, 48007], [48009, 48035], [48037, 48063], [48065, 48091], [48093, 48119], [48121, 48147], [48149, 48175], [48177, 48203], [48205, 48231], [48233, 48259], [48261, 48287], [48289, 48315], [48317, 48343], [48345, 48371], [48373, 48399], [48401, 48427], [48429, 48455], [48457, 48483], [48485, 48511], [48513, 48539], [48541, 48567], [48569, 48595], [48597, 48623], [48625, 48651], [48653, 48679], [48681, 48707], [48709, 48735], [48737, 48763], [48765, 48791], [48793, 48819], [48821, 48847], [48849, 48875], [48877, 48903], [48905, 48931], [48933, 48959], [48961, 48987], [48989, 49015], [49017, 49043], [49045, 49071], [49073, 49099], [49101, 49127], [49129, 49155], [49157, 49183], [49185, 49211], [49213, 49239], [49241, 49267], [49269, 49295], [49297, 49323], [49325, 49351], [49353, 49379], [49381, 49407], [49409, 49435], [49437, 49463], [49465, 49491], [49493, 49519], [49521, 49547], [49549, 49575], [49577, 49603], [49605, 49631], [49633, 49659], [49661, 49687], [49689, 49715], [49717, 49743], [49745, 49771], [49773, 49799], [49801, 49827], [49829, 49855], [49857, 49883], [49885, 49911], [49913, 49939], [49941, 49967], [49969, 49995], [49997, 50023], [50025, 50051], [50053, 50079], [50081, 50107], [50109, 50135], [50137, 50163], [50165, 50191], [50193, 50219], [50221, 50247], [50249, 50275], [50277, 50303], [50305, 50331], [50333, 50359], [50361, 50387], [50389, 50415], [50417, 50443], [50445, 50471], [50473, 50499], [50501, 50527], [50529, 50555], [50557, 50583], [50585, 50611], [50613, 50639], [50641, 50667], [50669, 50695], [50697, 50723], [50725, 50751], [50753, 50779], [50781, 50807], [50809, 50835], [50837, 50863], [50865, 50891], [50893, 50919], [50921, 50947], [50949, 50975], [50977, 51003], [51005, 51031], [51033, 51059], [51061, 51087], [51089, 51115], [51117, 51143], [51145, 51171], [51173, 51199], [51201, 51227], [51229, 51255], [51257, 51283], [51285, 51311], [51313, 51339], [51341, 51367], [51369, 51395], [51397, 51423], [51425, 51451], [51453, 51479], [51481, 51507], [51509, 51535], [51537, 51563], [51565, 51591], [51593, 51619], [51621, 51647], [51649, 51675], [51677, 51703], [51705, 51731], [51733, 51759], [51761, 51787], [51789, 51815], [51817, 51843], [51845, 51871], [51873, 51899], [51901, 51927], [51929, 51955], [51957, 51983], [51985, 52011], [52013, 52039], [52041, 52067], [52069, 52095], [52097, 52123], [52125, 52151], [52153, 52179], [52181, 52207], [52209, 52235], [52237, 52263], [52265, 52291], [52293, 52319], [52321, 52347], [52349, 52375], [52377, 52403], [52405, 52431], [52433, 52459], [52461, 52487], [52489, 52515], [52517, 52543], [52545, 52571], [52573, 52599], [52601, 52627], [52629, 52655], [52657, 52683], [52685, 52711], [52713, 52739], [52741, 52767], [52769, 52795], [52797, 52823], [52825, 52851], [52853, 52879], [52881, 52907], [52909, 52935], [52937, 52963], [52965, 52991], [52993, 53019], [53021, 53047], [53049, 53075], [53077, 53103], [53105, 53131], [53133, 53159], [53161, 53187], [53189, 53215], [53217, 53243], [53245, 53271], [53273, 53299], [53301, 53327], [53329, 53355], [53357, 53383], [53385, 53411], [53413, 53439], [53441, 53467], [53469, 53495], [53497, 53523], [53525, 53551], [53553, 53579], [53581, 53607], [53609, 53635], [53637, 53663], [53665, 53691], [53693, 53719], [53721, 53747], [53749, 53775], [53777, 53803], [53805, 53831], [53833, 53859], [53861, 53887], [53889, 53915], [53917, 53943], [53945, 53971], [53973, 53999], [54001, 54027], [54029, 54055], [54057, 54083], [54085, 54111], [54113, 54139], [54141, 54167], [54169, 54195], [54197, 54223], [54225, 54251], [54253, 54279], [54281, 54307], [54309, 54335], [54337, 54363], [54365, 54391], [54393, 54419], [54421, 54447], [54449, 54475], [54477, 54503], [54505, 54531], [54533, 54559], [54561, 54587], [54589, 54615], [54617, 54643], [54645, 54671], [54673, 54699], [54701, 54727], [54729, 54755], [54757, 54783], [54785, 54811], [54813, 54839], [54841, 54867], [54869, 54895], [54897, 54923], [54925, 54951], [54953, 54979], [54981, 55007], [55009, 55035], [55037, 55063], [55065, 55091], [55093, 55119], [55121, 55147], [55149, 55175], [55177, 55203]],
          "SG": [[55296, 57343]],
          "XX": [[57344, 63743], [983040, 1048573], [1048576, 1114109]],
          "CB": [[65532, 65532]],
          "RI": [[127462, 127487]]
        },
        "sentence_break": {
          "CR": [[13, 13]],
          "LF": [[10, 10]],
          "Extend": [[768, 879], [1155, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1552, 1562], [1611, 1631], [1648, 1648], [1750, 1756], [1759, 1764], [1767, 1768], [1770, 1773], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2070, 2073], [2075, 2083], [2085, 2087], [2089, 2093], [2137, 2139], [2276, 2302], [2304, 2307], [2362, 2364], [2366, 2383], [2385, 2391], [2402, 2403], [2433, 2435], [2492, 2492], [2494, 2500], [2503, 2504], [2507, 2509], [2519, 2519], [2530, 2531], [2561, 2563], [2620, 2620], [2622, 2626], [2631, 2632], [2635, 2637], [2641, 2641], [2672, 2673], [2677, 2677], [2689, 2691], [2748, 2748], [2750, 2757], [2759, 2761], [2763, 2765], [2786, 2787], [2817, 2819], [2876, 2876], [2878, 2884], [2887, 2888], [2891, 2893], [2902, 2903], [2914, 2915], [2946, 2946], [3006, 3010], [3014, 3016], [3018, 3021], [3031, 3031], [3073, 3075], [3134, 3140], [3142, 3144], [3146, 3149], [3157, 3158], [3170, 3171], [3202, 3203], [3260, 3260], [3262, 3268], [3270, 3272], [3274, 3277], [3285, 3286], [3298, 3299], [3330, 3331], [3390, 3396], [3398, 3400], [3402, 3405], [3415, 3415], [3426, 3427], [3458, 3459], [3530, 3530], [3535, 3540], [3542, 3542], [3544, 3551], [3570, 3571], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3902, 3903], [3953, 3972], [3974, 3975], [3981, 3991], [3993, 4028], [4038, 4038], [4139, 4158], [4182, 4185], [4190, 4192], [4194, 4196], [4199, 4205], [4209, 4212], [4226, 4237], [4239, 4239], [4250, 4253], [4957, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6443], [6448, 6459], [6576, 6592], [6600, 6601], [6679, 6683], [6741, 6750], [6752, 6780], [6783, 6783], [6912, 6916], [6964, 6980], [7019, 7027], [7040, 7042], [7073, 7085], [7142, 7155], [7204, 7223], [7376, 7378], [7380, 7400], [7405, 7405], [7410, 7412], [7616, 7654], [7676, 7679], [8204, 8205], [8400, 8432], [11503, 11505], [11647, 11647], [11744, 11775], [12330, 12335], [12441, 12442], [42607, 42610], [42612, 42621], [42655, 42655], [42736, 42737], [43010, 43010], [43014, 43014], [43019, 43019], [43043, 43047], [43136, 43137], [43188, 43204], [43232, 43249], [43302, 43309], [43335, 43347], [43392, 43395], [43443, 43456], [43561, 43574], [43587, 43587], [43596, 43597], [43643, 43643], [43696, 43696], [43698, 43700], [43703, 43704], [43710, 43711], [43713, 43713], [43755, 43759], [43765, 43766], [44003, 44010], [44012, 44013], [64286, 64286], [65024, 65039], [65056, 65062], [65438, 65439], [66045, 66045], [68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [69632, 69634], [69688, 69702], [69760, 69762], [69808, 69818], [69888, 69890], [69927, 69940], [70016, 70018], [70067, 70080], [71339, 71351], [94033, 94078], [94095, 94098], [119141, 119145], [119149, 119154], [119163, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917760, 917999]],
          "Sep": [[133, 133], [8232, 8233]],
          "Format": [[173, 173], [1536, 1540], [1564, 1564], [1757, 1757], [1807, 1807], [6158, 6158], [8203, 8203], [8206, 8207], [8234, 8238], [8288, 8292], [8294, 8303], [65279, 65279], [65529, 65531], [69821, 69821], [119155, 119162], [917505, 917505], [917536, 917631]],
          "Sp": [[9, 9], [11, 12], [32, 32], [160, 160], [5760, 5760], [8192, 8202], [8239, 8239], [8287, 8287], [12288, 12288]],
          "Lower": [[97, 122], [170, 170], [181, 181], [186, 186], [223, 246], [248, 255], [257, 257], [259, 259], [261, 261], [263, 263], [265, 265], [267, 267], [269, 269], [271, 271], [273, 273], [275, 275], [277, 277], [279, 279], [281, 281], [283, 283], [285, 285], [287, 287], [289, 289], [291, 291], [293, 293], [295, 295], [297, 297], [299, 299], [301, 301], [303, 303], [305, 305], [307, 307], [309, 309], [311, 312], [314, 314], [316, 316], [318, 318], [320, 320], [322, 322], [324, 324], [326, 326], [328, 329], [331, 331], [333, 333], [335, 335], [337, 337], [339, 339], [341, 341], [343, 343], [345, 345], [347, 347], [349, 349], [351, 351], [353, 353], [355, 355], [357, 357], [359, 359], [361, 361], [363, 363], [365, 365], [367, 367], [369, 369], [371, 371], [373, 373], [375, 375], [378, 378], [380, 380], [382, 384], [387, 387], [389, 389], [392, 392], [396, 397], [402, 402], [405, 405], [409, 411], [414, 414], [417, 417], [419, 419], [421, 421], [424, 424], [426, 427], [429, 429], [432, 432], [436, 436], [438, 438], [441, 442], [445, 447], [454, 454], [457, 457], [460, 460], [462, 462], [464, 464], [466, 466], [468, 468], [470, 470], [472, 472], [474, 474], [476, 477], [479, 479], [481, 481], [483, 483], [485, 485], [487, 487], [489, 489], [491, 491], [493, 493], [495, 496], [499, 499], [501, 501], [505, 505], [507, 507], [509, 509], [511, 511], [513, 513], [515, 515], [517, 517], [519, 519], [521, 521], [523, 523], [525, 525], [527, 527], [529, 529], [531, 531], [533, 533], [535, 535], [537, 537], [539, 539], [541, 541], [543, 543], [545, 545], [547, 547], [549, 549], [551, 551], [553, 553], [555, 555], [557, 557], [559, 559], [561, 561], [563, 569], [572, 572], [575, 576], [578, 578], [583, 583], [585, 585], [587, 587], [589, 589], [591, 659], [661, 696], [704, 705], [736, 740], [881, 881], [883, 883], [887, 887], [890, 893], [912, 912], [940, 974], [976, 977], [981, 983], [985, 985], [987, 987], [989, 989], [991, 991], [993, 993], [995, 995], [997, 997], [999, 999], [1001, 1001], [1003, 1003], [1005, 1005], [1007, 1011], [1013, 1013], [1016, 1016], [1019, 1020], [1072, 1119], [1121, 1121], [1123, 1123], [1125, 1125], [1127, 1127], [1129, 1129], [1131, 1131], [1133, 1133], [1135, 1135], [1137, 1137], [1139, 1139], [1141, 1141], [1143, 1143], [1145, 1145], [1147, 1147], [1149, 1149], [1151, 1151], [1153, 1153], [1163, 1163], [1165, 1165], [1167, 1167], [1169, 1169], [1171, 1171], [1173, 1173], [1175, 1175], [1177, 1177], [1179, 1179], [1181, 1181], [1183, 1183], [1185, 1185], [1187, 1187], [1189, 1189], [1191, 1191], [1193, 1193], [1195, 1195], [1197, 1197], [1199, 1199], [1201, 1201], [1203, 1203], [1205, 1205], [1207, 1207], [1209, 1209], [1211, 1211], [1213, 1213], [1215, 1215], [1218, 1218], [1220, 1220], [1222, 1222], [1224, 1224], [1226, 1226], [1228, 1228], [1230, 1231], [1233, 1233], [1235, 1235], [1237, 1237], [1239, 1239], [1241, 1241], [1243, 1243], [1245, 1245], [1247, 1247], [1249, 1249], [1251, 1251], [1253, 1253], [1255, 1255], [1257, 1257], [1259, 1259], [1261, 1261], [1263, 1263], [1265, 1265], [1267, 1267], [1269, 1269], [1271, 1271], [1273, 1273], [1275, 1275], [1277, 1277], [1279, 1279], [1281, 1281], [1283, 1283], [1285, 1285], [1287, 1287], [1289, 1289], [1291, 1291], [1293, 1293], [1295, 1295], [1297, 1297], [1299, 1299], [1301, 1301], [1303, 1303], [1305, 1305], [1307, 1307], [1309, 1309], [1311, 1311], [1313, 1313], [1315, 1315], [1317, 1317], [1319, 1319], [1377, 1415], [7424, 7615], [7681, 7681], [7683, 7683], [7685, 7685], [7687, 7687], [7689, 7689], [7691, 7691], [7693, 7693], [7695, 7695], [7697, 7697], [7699, 7699], [7701, 7701], [7703, 7703], [7705, 7705], [7707, 7707], [7709, 7709], [7711, 7711], [7713, 7713], [7715, 7715], [7717, 7717], [7719, 7719], [7721, 7721], [7723, 7723], [7725, 7725], [7727, 7727], [7729, 7729], [7731, 7731], [7733, 7733], [7735, 7735], [7737, 7737], [7739, 7739], [7741, 7741], [7743, 7743], [7745, 7745], [7747, 7747], [7749, 7749], [7751, 7751], [7753, 7753], [7755, 7755], [7757, 7757], [7759, 7759], [7761, 7761], [7763, 7763], [7765, 7765], [7767, 7767], [7769, 7769], [7771, 7771], [7773, 7773], [7775, 7775], [7777, 7777], [7779, 7779], [7781, 7781], [7783, 7783], [7785, 7785], [7787, 7787], [7789, 7789], [7791, 7791], [7793, 7793], [7795, 7795], [7797, 7797], [7799, 7799], [7801, 7801], [7803, 7803], [7805, 7805], [7807, 7807], [7809, 7809], [7811, 7811], [7813, 7813], [7815, 7815], [7817, 7817], [7819, 7819], [7821, 7821], [7823, 7823], [7825, 7825], [7827, 7827], [7829, 7837], [7839, 7839], [7841, 7841], [7843, 7843], [7845, 7845], [7847, 7847], [7849, 7849], [7851, 7851], [7853, 7853], [7855, 7855], [7857, 7857], [7859, 7859], [7861, 7861], [7863, 7863], [7865, 7865], [7867, 7867], [7869, 7869], [7871, 7871], [7873, 7873], [7875, 7875], [7877, 7877], [7879, 7879], [7881, 7881], [7883, 7883], [7885, 7885], [7887, 7887], [7889, 7889], [7891, 7891], [7893, 7893], [7895, 7895], [7897, 7897], [7899, 7899], [7901, 7901], [7903, 7903], [7905, 7905], [7907, 7907], [7909, 7909], [7911, 7911], [7913, 7913], [7915, 7915], [7917, 7917], [7919, 7919], [7921, 7921], [7923, 7923], [7925, 7925], [7927, 7927], [7929, 7929], [7931, 7931], [7933, 7933], [7935, 7943], [7952, 7957], [7968, 7975], [7984, 7991], [8000, 8005], [8016, 8023], [8032, 8039], [8048, 8061], [8064, 8071], [8080, 8087], [8096, 8103], [8112, 8116], [8118, 8119], [8126, 8126], [8130, 8132], [8134, 8135], [8144, 8147], [8150, 8151], [8160, 8167], [8178, 8180], [8182, 8183], [8305, 8305], [8319, 8319], [8336, 8348], [8458, 8458], [8462, 8463], [8467, 8467], [8495, 8495], [8500, 8500], [8505, 8505], [8508, 8509], [8518, 8521], [8526, 8526], [8560, 8575], [8580, 8580], [9424, 9449], [11312, 11358], [11361, 11361], [11365, 11366], [11368, 11368], [11370, 11370], [11372, 11372], [11377, 11377], [11379, 11380], [11382, 11389], [11393, 11393], [11395, 11395], [11397, 11397], [11399, 11399], [11401, 11401], [11403, 11403], [11405, 11405], [11407, 11407], [11409, 11409], [11411, 11411], [11413, 11413], [11415, 11415], [11417, 11417], [11419, 11419], [11421, 11421], [11423, 11423], [11425, 11425], [11427, 11427], [11429, 11429], [11431, 11431], [11433, 11433], [11435, 11435], [11437, 11437], [11439, 11439], [11441, 11441], [11443, 11443], [11445, 11445], [11447, 11447], [11449, 11449], [11451, 11451], [11453, 11453], [11455, 11455], [11457, 11457], [11459, 11459], [11461, 11461], [11463, 11463], [11465, 11465], [11467, 11467], [11469, 11469], [11471, 11471], [11473, 11473], [11475, 11475], [11477, 11477], [11479, 11479], [11481, 11481], [11483, 11483], [11485, 11485], [11487, 11487], [11489, 11489], [11491, 11492], [11500, 11500], [11502, 11502], [11507, 11507], [11520, 11557], [11559, 11559], [11565, 11565], [42561, 42561], [42563, 42563], [42565, 42565], [42567, 42567], [42569, 42569], [42571, 42571], [42573, 42573], [42575, 42575], [42577, 42577], [42579, 42579], [42581, 42581], [42583, 42583], [42585, 42585], [42587, 42587], [42589, 42589], [42591, 42591], [42593, 42593], [42595, 42595], [42597, 42597], [42599, 42599], [42601, 42601], [42603, 42603], [42605, 42605], [42625, 42625], [42627, 42627], [42629, 42629], [42631, 42631], [42633, 42633], [42635, 42635], [42637, 42637], [42639, 42639], [42641, 42641], [42643, 42643], [42645, 42645], [42647, 42647], [42787, 42787], [42789, 42789], [42791, 42791], [42793, 42793], [42795, 42795], [42797, 42797], [42799, 42801], [42803, 42803], [42805, 42805], [42807, 42807], [42809, 42809], [42811, 42811], [42813, 42813], [42815, 42815], [42817, 42817], [42819, 42819], [42821, 42821], [42823, 42823], [42825, 42825], [42827, 42827], [42829, 42829], [42831, 42831], [42833, 42833], [42835, 42835], [42837, 42837], [42839, 42839], [42841, 42841], [42843, 42843], [42845, 42845], [42847, 42847], [42849, 42849], [42851, 42851], [42853, 42853], [42855, 42855], [42857, 42857], [42859, 42859], [42861, 42861], [42863, 42872], [42874, 42874], [42876, 42876], [42879, 42879], [42881, 42881], [42883, 42883], [42885, 42885], [42887, 42887], [42892, 42892], [42894, 42894], [42897, 42897], [42899, 42899], [42913, 42913], [42915, 42915], [42917, 42917], [42919, 42919], [42921, 42921], [43000, 43002], [64256, 64262], [64275, 64279], [65345, 65370], [66600, 66639], [119834, 119859], [119886, 119892], [119894, 119911], [119938, 119963], [119990, 119993], [119995, 119995], [119997, 120003], [120005, 120015], [120042, 120067], [120094, 120119], [120146, 120171], [120198, 120223], [120250, 120275], [120302, 120327], [120354, 120379], [120406, 120431], [120458, 120485], [120514, 120538], [120540, 120545], [120572, 120596], [120598, 120603], [120630, 120654], [120656, 120661], [120688, 120712], [120714, 120719], [120746, 120770], [120772, 120777], [120779, 120779]],
          "Upper": [[65, 90], [192, 214], [216, 222], [256, 256], [258, 258], [260, 260], [262, 262], [264, 264], [266, 266], [268, 268], [270, 270], [272, 272], [274, 274], [276, 276], [278, 278], [280, 280], [282, 282], [284, 284], [286, 286], [288, 288], [290, 290], [292, 292], [294, 294], [296, 296], [298, 298], [300, 300], [302, 302], [304, 304], [306, 306], [308, 308], [310, 310], [313, 313], [315, 315], [317, 317], [319, 319], [321, 321], [323, 323], [325, 325], [327, 327], [330, 330], [332, 332], [334, 334], [336, 336], [338, 338], [340, 340], [342, 342], [344, 344], [346, 346], [348, 348], [350, 350], [352, 352], [354, 354], [356, 356], [358, 358], [360, 360], [362, 362], [364, 364], [366, 366], [368, 368], [370, 370], [372, 372], [374, 374], [376, 377], [379, 379], [381, 381], [385, 386], [388, 388], [390, 391], [393, 395], [398, 401], [403, 404], [406, 408], [412, 413], [415, 416], [418, 418], [420, 420], [422, 423], [425, 425], [428, 428], [430, 431], [433, 435], [437, 437], [439, 440], [444, 444], [452, 453], [455, 456], [458, 459], [461, 461], [463, 463], [465, 465], [467, 467], [469, 469], [471, 471], [473, 473], [475, 475], [478, 478], [480, 480], [482, 482], [484, 484], [486, 486], [488, 488], [490, 490], [492, 492], [494, 494], [497, 498], [500, 500], [502, 504], [506, 506], [508, 508], [510, 510], [512, 512], [514, 514], [516, 516], [518, 518], [520, 520], [522, 522], [524, 524], [526, 526], [528, 528], [530, 530], [532, 532], [534, 534], [536, 536], [538, 538], [540, 540], [542, 542], [544, 544], [546, 546], [548, 548], [550, 550], [552, 552], [554, 554], [556, 556], [558, 558], [560, 560], [562, 562], [570, 571], [573, 574], [577, 577], [579, 582], [584, 584], [586, 586], [588, 588], [590, 590], [880, 880], [882, 882], [886, 886], [902, 902], [904, 906], [908, 908], [910, 911], [913, 929], [931, 939], [975, 975], [978, 980], [984, 984], [986, 986], [988, 988], [990, 990], [992, 992], [994, 994], [996, 996], [998, 998], [1000, 1000], [1002, 1002], [1004, 1004], [1006, 1006], [1012, 1012], [1015, 1015], [1017, 1018], [1021, 1071], [1120, 1120], [1122, 1122], [1124, 1124], [1126, 1126], [1128, 1128], [1130, 1130], [1132, 1132], [1134, 1134], [1136, 1136], [1138, 1138], [1140, 1140], [1142, 1142], [1144, 1144], [1146, 1146], [1148, 1148], [1150, 1150], [1152, 1152], [1162, 1162], [1164, 1164], [1166, 1166], [1168, 1168], [1170, 1170], [1172, 1172], [1174, 1174], [1176, 1176], [1178, 1178], [1180, 1180], [1182, 1182], [1184, 1184], [1186, 1186], [1188, 1188], [1190, 1190], [1192, 1192], [1194, 1194], [1196, 1196], [1198, 1198], [1200, 1200], [1202, 1202], [1204, 1204], [1206, 1206], [1208, 1208], [1210, 1210], [1212, 1212], [1214, 1214], [1216, 1217], [1219, 1219], [1221, 1221], [1223, 1223], [1225, 1225], [1227, 1227], [1229, 1229], [1232, 1232], [1234, 1234], [1236, 1236], [1238, 1238], [1240, 1240], [1242, 1242], [1244, 1244], [1246, 1246], [1248, 1248], [1250, 1250], [1252, 1252], [1254, 1254], [1256, 1256], [1258, 1258], [1260, 1260], [1262, 1262], [1264, 1264], [1266, 1266], [1268, 1268], [1270, 1270], [1272, 1272], [1274, 1274], [1276, 1276], [1278, 1278], [1280, 1280], [1282, 1282], [1284, 1284], [1286, 1286], [1288, 1288], [1290, 1290], [1292, 1292], [1294, 1294], [1296, 1296], [1298, 1298], [1300, 1300], [1302, 1302], [1304, 1304], [1306, 1306], [1308, 1308], [1310, 1310], [1312, 1312], [1314, 1314], [1316, 1316], [1318, 1318], [1329, 1366], [4256, 4293], [4295, 4295], [4301, 4301], [7680, 7680], [7682, 7682], [7684, 7684], [7686, 7686], [7688, 7688], [7690, 7690], [7692, 7692], [7694, 7694], [7696, 7696], [7698, 7698], [7700, 7700], [7702, 7702], [7704, 7704], [7706, 7706], [7708, 7708], [7710, 7710], [7712, 7712], [7714, 7714], [7716, 7716], [7718, 7718], [7720, 7720], [7722, 7722], [7724, 7724], [7726, 7726], [7728, 7728], [7730, 7730], [7732, 7732], [7734, 7734], [7736, 7736], [7738, 7738], [7740, 7740], [7742, 7742], [7744, 7744], [7746, 7746], [7748, 7748], [7750, 7750], [7752, 7752], [7754, 7754], [7756, 7756], [7758, 7758], [7760, 7760], [7762, 7762], [7764, 7764], [7766, 7766], [7768, 7768], [7770, 7770], [7772, 7772], [7774, 7774], [7776, 7776], [7778, 7778], [7780, 7780], [7782, 7782], [7784, 7784], [7786, 7786], [7788, 7788], [7790, 7790], [7792, 7792], [7794, 7794], [7796, 7796], [7798, 7798], [7800, 7800], [7802, 7802], [7804, 7804], [7806, 7806], [7808, 7808], [7810, 7810], [7812, 7812], [7814, 7814], [7816, 7816], [7818, 7818], [7820, 7820], [7822, 7822], [7824, 7824], [7826, 7826], [7828, 7828], [7838, 7838], [7840, 7840], [7842, 7842], [7844, 7844], [7846, 7846], [7848, 7848], [7850, 7850], [7852, 7852], [7854, 7854], [7856, 7856], [7858, 7858], [7860, 7860], [7862, 7862], [7864, 7864], [7866, 7866], [7868, 7868], [7870, 7870], [7872, 7872], [7874, 7874], [7876, 7876], [7878, 7878], [7880, 7880], [7882, 7882], [7884, 7884], [7886, 7886], [7888, 7888], [7890, 7890], [7892, 7892], [7894, 7894], [7896, 7896], [7898, 7898], [7900, 7900], [7902, 7902], [7904, 7904], [7906, 7906], [7908, 7908], [7910, 7910], [7912, 7912], [7914, 7914], [7916, 7916], [7918, 7918], [7920, 7920], [7922, 7922], [7924, 7924], [7926, 7926], [7928, 7928], [7930, 7930], [7932, 7932], [7934, 7934], [7944, 7951], [7960, 7965], [7976, 7983], [7992, 7999], [8008, 8013], [8025, 8025], [8027, 8027], [8029, 8029], [8031, 8031], [8040, 8047], [8072, 8079], [8088, 8095], [8104, 8111], [8120, 8124], [8136, 8140], [8152, 8155], [8168, 8172], [8184, 8188], [8450, 8450], [8455, 8455], [8459, 8461], [8464, 8466], [8469, 8469], [8473, 8477], [8484, 8484], [8486, 8486], [8488, 8488], [8490, 8493], [8496, 8499], [8510, 8511], [8517, 8517], [8544, 8559], [8579, 8579], [9398, 9423], [11264, 11310], [11360, 11360], [11362, 11364], [11367, 11367], [11369, 11369], [11371, 11371], [11373, 11376], [11378, 11378], [11381, 11381], [11390, 11392], [11394, 11394], [11396, 11396], [11398, 11398], [11400, 11400], [11402, 11402], [11404, 11404], [11406, 11406], [11408, 11408], [11410, 11410], [11412, 11412], [11414, 11414], [11416, 11416], [11418, 11418], [11420, 11420], [11422, 11422], [11424, 11424], [11426, 11426], [11428, 11428], [11430, 11430], [11432, 11432], [11434, 11434], [11436, 11436], [11438, 11438], [11440, 11440], [11442, 11442], [11444, 11444], [11446, 11446], [11448, 11448], [11450, 11450], [11452, 11452], [11454, 11454], [11456, 11456], [11458, 11458], [11460, 11460], [11462, 11462], [11464, 11464], [11466, 11466], [11468, 11468], [11470, 11470], [11472, 11472], [11474, 11474], [11476, 11476], [11478, 11478], [11480, 11480], [11482, 11482], [11484, 11484], [11486, 11486], [11488, 11488], [11490, 11490], [11499, 11499], [11501, 11501], [11506, 11506], [42560, 42560], [42562, 42562], [42564, 42564], [42566, 42566], [42568, 42568], [42570, 42570], [42572, 42572], [42574, 42574], [42576, 42576], [42578, 42578], [42580, 42580], [42582, 42582], [42584, 42584], [42586, 42586], [42588, 42588], [42590, 42590], [42592, 42592], [42594, 42594], [42596, 42596], [42598, 42598], [42600, 42600], [42602, 42602], [42604, 42604], [42624, 42624], [42626, 42626], [42628, 42628], [42630, 42630], [42632, 42632], [42634, 42634], [42636, 42636], [42638, 42638], [42640, 42640], [42642, 42642], [42644, 42644], [42646, 42646], [42786, 42786], [42788, 42788], [42790, 42790], [42792, 42792], [42794, 42794], [42796, 42796], [42798, 42798], [42802, 42802], [42804, 42804], [42806, 42806], [42808, 42808], [42810, 42810], [42812, 42812], [42814, 42814], [42816, 42816], [42818, 42818], [42820, 42820], [42822, 42822], [42824, 42824], [42826, 42826], [42828, 42828], [42830, 42830], [42832, 42832], [42834, 42834], [42836, 42836], [42838, 42838], [42840, 42840], [42842, 42842], [42844, 42844], [42846, 42846], [42848, 42848], [42850, 42850], [42852, 42852], [42854, 42854], [42856, 42856], [42858, 42858], [42860, 42860], [42862, 42862], [42873, 42873], [42875, 42875], [42877, 42878], [42880, 42880], [42882, 42882], [42884, 42884], [42886, 42886], [42891, 42891], [42893, 42893], [42896, 42896], [42898, 42898], [42912, 42912], [42914, 42914], [42916, 42916], [42918, 42918], [42920, 42920], [42922, 42922], [65313, 65338], [66560, 66599], [119808, 119833], [119860, 119885], [119912, 119937], [119964, 119964], [119966, 119967], [119970, 119970], [119973, 119974], [119977, 119980], [119982, 119989], [120016, 120041], [120068, 120069], [120071, 120074], [120077, 120084], [120086, 120092], [120120, 120121], [120123, 120126], [120128, 120132], [120134, 120134], [120138, 120144], [120172, 120197], [120224, 120249], [120276, 120301], [120328, 120353], [120380, 120405], [120432, 120457], [120488, 120512], [120546, 120570], [120604, 120628], [120662, 120686], [120720, 120744], [120778, 120778]],
          "OLetter": [[443, 443], [448, 451], [660, 660], [697, 703], [710, 721], [748, 748], [750, 750], [884, 884], [1369, 1369], [1488, 1514], [1520, 1523], [1568, 1610], [1646, 1647], [1649, 1747], [1749, 1749], [1765, 1766], [1774, 1775], [1786, 1788], [1791, 1791], [1808, 1808], [1810, 1839], [1869, 1957], [1969, 1969], [1994, 2026], [2036, 2037], [2042, 2042], [2048, 2069], [2074, 2074], [2084, 2084], [2088, 2088], [2112, 2136], [2208, 2208], [2210, 2220], [2308, 2361], [2365, 2365], [2384, 2384], [2392, 2401], [2417, 2423], [2425, 2431], [2437, 2444], [2447, 2448], [2451, 2472], [2474, 2480], [2482, 2482], [2486, 2489], [2493, 2493], [2510, 2510], [2524, 2525], [2527, 2529], [2544, 2545], [2565, 2570], [2575, 2576], [2579, 2600], [2602, 2608], [2610, 2611], [2613, 2614], [2616, 2617], [2649, 2652], [2654, 2654], [2674, 2676], [2693, 2701], [2703, 2705], [2707, 2728], [2730, 2736], [2738, 2739], [2741, 2745], [2749, 2749], [2768, 2768], [2784, 2785], [2821, 2828], [2831, 2832], [2835, 2856], [2858, 2864], [2866, 2867], [2869, 2873], [2877, 2877], [2908, 2909], [2911, 2913], [2929, 2929], [2947, 2947], [2949, 2954], [2958, 2960], [2962, 2965], [2969, 2970], [2972, 2972], [2974, 2975], [2979, 2980], [2984, 2986], [2990, 3001], [3024, 3024], [3077, 3084], [3086, 3088], [3090, 3112], [3114, 3123], [3125, 3129], [3133, 3133], [3160, 3161], [3168, 3169], [3205, 3212], [3214, 3216], [3218, 3240], [3242, 3251], [3253, 3257], [3261, 3261], [3294, 3294], [3296, 3297], [3313, 3314], [3333, 3340], [3342, 3344], [3346, 3386], [3389, 3389], [3406, 3406], [3424, 3425], [3450, 3455], [3461, 3478], [3482, 3505], [3507, 3515], [3517, 3517], [3520, 3526], [3585, 3632], [3634, 3635], [3648, 3654], [3713, 3714], [3716, 3716], [3719, 3720], [3722, 3722], [3725, 3725], [3732, 3735], [3737, 3743], [3745, 3747], [3749, 3749], [3751, 3751], [3754, 3755], [3757, 3760], [3762, 3763], [3773, 3773], [3776, 3780], [3782, 3782], [3804, 3807], [3840, 3840], [3904, 3911], [3913, 3948], [3976, 3980], [4096, 4138], [4159, 4159], [4176, 4181], [4186, 4189], [4193, 4193], [4197, 4198], [4206, 4208], [4213, 4225], [4238, 4238], [4304, 4346], [4348, 4680], [4682, 4685], [4688, 4694], [4696, 4696], [4698, 4701], [4704, 4744], [4746, 4749], [4752, 4784], [4786, 4789], [4792, 4798], [4800, 4800], [4802, 4805], [4808, 4822], [4824, 4880], [4882, 4885], [4888, 4954], [4992, 5007], [5024, 5108], [5121, 5740], [5743, 5759], [5761, 5786], [5792, 5866], [5870, 5872], [5888, 5900], [5902, 5905], [5920, 5937], [5952, 5969], [5984, 5996], [5998, 6000], [6016, 6067], [6103, 6103], [6108, 6108], [6176, 6263], [6272, 6312], [6314, 6314], [6320, 6389], [6400, 6428], [6480, 6509], [6512, 6516], [6528, 6571], [6593, 6599], [6656, 6678], [6688, 6740], [6823, 6823], [6917, 6963], [6981, 6987], [7043, 7072], [7086, 7087], [7098, 7141], [7168, 7203], [7245, 7247], [7258, 7293], [7401, 7404], [7406, 7409], [7413, 7414], [8501, 8504], [8576, 8578], [8581, 8584], [11568, 11623], [11631, 11631], [11648, 11670], [11680, 11686], [11688, 11694], [11696, 11702], [11704, 11710], [11712, 11718], [11720, 11726], [11728, 11734], [11736, 11742], [11823, 11823], [12293, 12295], [12321, 12329], [12337, 12341], [12344, 12348], [12353, 12438], [12445, 12447], [12449, 12538], [12540, 12543], [12549, 12589], [12593, 12686], [12704, 12730], [12784, 12799], [13312, 19893], [19968, 40908], [40960, 42124], [42192, 42237], [42240, 42508], [42512, 42527], [42538, 42539], [42606, 42606], [42623, 42623], [42656, 42735], [42775, 42783], [42888, 42888], [43003, 43009], [43011, 43013], [43015, 43018], [43020, 43042], [43072, 43123], [43138, 43187], [43250, 43255], [43259, 43259], [43274, 43301], [43312, 43334], [43360, 43388], [43396, 43442], [43471, 43471], [43520, 43560], [43584, 43586], [43588, 43595], [43616, 43638], [43642, 43642], [43648, 43695], [43697, 43697], [43701, 43702], [43705, 43709], [43712, 43712], [43714, 43714], [43739, 43741], [43744, 43754], [43762, 43764], [43777, 43782], [43785, 43790], [43793, 43798], [43808, 43814], [43816, 43822], [43968, 44002], [44032, 55203], [55216, 55238], [55243, 55291], [63744, 64109], [64112, 64217], [64285, 64285], [64287, 64296], [64298, 64310], [64312, 64316], [64318, 64318], [64320, 64321], [64323, 64324], [64326, 64433], [64467, 64829], [64848, 64911], [64914, 64967], [65008, 65019], [65136, 65140], [65142, 65276], [65382, 65437], [65440, 65470], [65474, 65479], [65482, 65487], [65490, 65495], [65498, 65500], [65536, 65547], [65549, 65574], [65576, 65594], [65596, 65597], [65599, 65613], [65616, 65629], [65664, 65786], [65856, 65908], [66176, 66204], [66208, 66256], [66304, 66334], [66352, 66378], [66432, 66461], [66464, 66499], [66504, 66511], [66513, 66517], [66640, 66717], [67584, 67589], [67592, 67592], [67594, 67637], [67639, 67640], [67644, 67644], [67647, 67669], [67840, 67861], [67872, 67897], [67968, 68023], [68030, 68031], [68096, 68096], [68112, 68115], [68117, 68119], [68121, 68147], [68192, 68220], [68352, 68405], [68416, 68437], [68448, 68466], [68608, 68680], [69635, 69687], [69763, 69807], [69840, 69864], [69891, 69926], [70019, 70066], [70081, 70084], [71296, 71338], [73728, 74606], [74752, 74850], [77824, 78894], [92160, 92728], [93952, 94020], [94032, 94032], [94099, 94111], [110592, 110593], [126464, 126467], [126469, 126495], [126497, 126498], [126500, 126500], [126503, 126503], [126505, 126514], [126516, 126519], [126521, 126521], [126523, 126523], [126530, 126530], [126535, 126535], [126537, 126537], [126539, 126539], [126541, 126543], [126545, 126546], [126548, 126548], [126551, 126551], [126553, 126553], [126555, 126555], [126557, 126557], [126559, 126559], [126561, 126562], [126564, 126564], [126567, 126570], [126572, 126578], [126580, 126583], [126585, 126588], [126590, 126590], [126592, 126601], [126603, 126619], [126625, 126627], [126629, 126633], [126635, 126651], [131072, 173782], [173824, 177972], [177984, 178205], [194560, 195101]],
          "Numeric": [[48, 57], [1632, 1641], [1643, 1644], [1776, 1785], [1984, 1993], [2406, 2415], [2534, 2543], [2662, 2671], [2790, 2799], [2918, 2927], [3046, 3055], [3174, 3183], [3302, 3311], [3430, 3439], [3664, 3673], [3792, 3801], [3872, 3881], [4160, 4169], [4240, 4249], [6112, 6121], [6160, 6169], [6470, 6479], [6608, 6617], [6784, 6793], [6800, 6809], [6992, 7001], [7088, 7097], [7232, 7241], [7248, 7257], [42528, 42537], [43216, 43225], [43264, 43273], [43472, 43481], [43600, 43609], [44016, 44025], [66720, 66729], [69734, 69743], [69872, 69881], [69942, 69951], [70096, 70105], [71360, 71369], [120782, 120831]],
          "ATerm": [[46, 46], [8228, 8228], [65106, 65106], [65294, 65294]],
          "STerm": [[33, 33], [63, 63], [1372, 1372], [1374, 1374], [1417, 1417], [1567, 1567], [1748, 1748], [1792, 1794], [2041, 2041], [2404, 2405], [4170, 4171], [4962, 4962], [4967, 4968], [5742, 5742], [5941, 5942], [6147, 6147], [6153, 6153], [6468, 6469], [6824, 6827], [7002, 7003], [7006, 7007], [7227, 7228], [7294, 7295], [8252, 8253], [8263, 8265], [11822, 11822], [12290, 12290], [42239, 42239], [42510, 42511], [42739, 42739], [42743, 42743], [43126, 43127], [43214, 43215], [43311, 43311], [43464, 43465], [43613, 43615], [43760, 43761], [44011, 44011], [65110, 65111], [65281, 65281], [65311, 65311], [65377, 65377], [68182, 68183], [69703, 69704], [69822, 69825], [69953, 69955], [70085, 70086]],
          "Close": [[34, 34], [39, 41], [91, 91], [93, 93], [123, 123], [125, 125], [171, 171], [187, 187], [3898, 3901], [5787, 5788], [8216, 8223], [8249, 8250], [8261, 8262], [8317, 8318], [8333, 8334], [8968, 8971], [9001, 9002], [10075, 10078], [10088, 10101], [10181, 10182], [10214, 10223], [10627, 10648], [10712, 10715], [10748, 10749], [11776, 11789], [11804, 11805], [11808, 11817], [12296, 12305], [12308, 12315], [12317, 12319], [64830, 64831], [65047, 65048], [65077, 65092], [65095, 65096], [65113, 65118], [65288, 65289], [65339, 65339], [65341, 65341], [65371, 65371], [65373, 65373], [65375, 65376], [65378, 65379]],
          "SContinue": [[44, 45], [58, 58], [1373, 1373], [1548, 1549], [2040, 2040], [6146, 6146], [6152, 6152], [8211, 8212], [12289, 12289], [65040, 65041], [65043, 65043], [65073, 65074], [65104, 65105], [65109, 65109], [65112, 65112], [65123, 65123], [65292, 65293], [65306, 65306], [65380, 65380]]
        },
        "word_break": {
          "Double_Quote": [[34, 34]],
          "Single_Quote": [[39, 39]],
          "Hebrew_Letter": [[1488, 1514], [1520, 1522], [64285, 64285], [64287, 64296], [64298, 64310], [64312, 64316], [64318, 64318], [64320, 64321], [64323, 64324], [64326, 64335]],
          "CR": [[13, 13]],
          "LF": [[10, 10]],
          "Newline": [[11, 12], [133, 133], [8232, 8233]],
          "Extend": [[768, 879], [1155, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1552, 1562], [1611, 1631], [1648, 1648], [1750, 1756], [1759, 1764], [1767, 1768], [1770, 1773], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2070, 2073], [2075, 2083], [2085, 2087], [2089, 2093], [2137, 2139], [2276, 2302], [2304, 2307], [2362, 2364], [2366, 2383], [2385, 2391], [2402, 2403], [2433, 2435], [2492, 2492], [2494, 2500], [2503, 2504], [2507, 2509], [2519, 2519], [2530, 2531], [2561, 2563], [2620, 2620], [2622, 2626], [2631, 2632], [2635, 2637], [2641, 2641], [2672, 2673], [2677, 2677], [2689, 2691], [2748, 2748], [2750, 2757], [2759, 2761], [2763, 2765], [2786, 2787], [2817, 2819], [2876, 2876], [2878, 2884], [2887, 2888], [2891, 2893], [2902, 2903], [2914, 2915], [2946, 2946], [3006, 3010], [3014, 3016], [3018, 3021], [3031, 3031], [3073, 3075], [3134, 3140], [3142, 3144], [3146, 3149], [3157, 3158], [3170, 3171], [3202, 3203], [3260, 3260], [3262, 3268], [3270, 3272], [3274, 3277], [3285, 3286], [3298, 3299], [3330, 3331], [3390, 3396], [3398, 3400], [3402, 3405], [3415, 3415], [3426, 3427], [3458, 3459], [3530, 3530], [3535, 3540], [3542, 3542], [3544, 3551], [3570, 3571], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3902, 3903], [3953, 3972], [3974, 3975], [3981, 3991], [3993, 4028], [4038, 4038], [4139, 4158], [4182, 4185], [4190, 4192], [4194, 4196], [4199, 4205], [4209, 4212], [4226, 4237], [4239, 4239], [4250, 4253], [4957, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6443], [6448, 6459], [6576, 6592], [6600, 6601], [6679, 6683], [6741, 6750], [6752, 6780], [6783, 6783], [6912, 6916], [6964, 6980], [7019, 7027], [7040, 7042], [7073, 7085], [7142, 7155], [7204, 7223], [7376, 7378], [7380, 7400], [7405, 7405], [7410, 7412], [7616, 7654], [7676, 7679], [8204, 8205], [8400, 8432], [11503, 11505], [11647, 11647], [11744, 11775], [12330, 12335], [12441, 12442], [42607, 42610], [42612, 42621], [42655, 42655], [42736, 42737], [43010, 43010], [43014, 43014], [43019, 43019], [43043, 43047], [43136, 43137], [43188, 43204], [43232, 43249], [43302, 43309], [43335, 43347], [43392, 43395], [43443, 43456], [43561, 43574], [43587, 43587], [43596, 43597], [43643, 43643], [43696, 43696], [43698, 43700], [43703, 43704], [43710, 43711], [43713, 43713], [43755, 43759], [43765, 43766], [44003, 44010], [44012, 44013], [64286, 64286], [65024, 65039], [65056, 65062], [65438, 65439], [66045, 66045], [68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [69632, 69634], [69688, 69702], [69760, 69762], [69808, 69818], [69888, 69890], [69927, 69940], [70016, 70018], [70067, 70080], [71339, 71351], [94033, 94078], [94095, 94098], [119141, 119145], [119149, 119154], [119163, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917760, 917999]],
          "Regional_Indicator": [[127462, 127487]],
          "Format": [[173, 173], [1536, 1540], [1564, 1564], [1757, 1757], [1807, 1807], [6158, 6158], [8206, 8207], [8234, 8238], [8288, 8292], [8294, 8303], [65279, 65279], [65529, 65531], [69821, 69821], [119155, 119162], [917505, 917505], [917536, 917631]],
          "Katakana": [[12337, 12341], [12443, 12444], [12448, 12538], [12540, 12543], [12784, 12799], [13008, 13054], [13056, 13143], [65382, 65437], [110592, 110592]],
          "ALetter": [[65, 90], [97, 122], [170, 170], [181, 181], [186, 186], [192, 214], [216, 246], [248, 705], [710, 721], [736, 740], [748, 748], [750, 750], [880, 884], [886, 887], [890, 893], [902, 902], [904, 906], [908, 908], [910, 929], [931, 1013], [1015, 1153], [1162, 1319], [1329, 1366], [1369, 1369], [1377, 1415], [1523, 1523], [1568, 1610], [1646, 1647], [1649, 1747], [1749, 1749], [1765, 1766], [1774, 1775], [1786, 1788], [1791, 1791], [1808, 1808], [1810, 1839], [1869, 1957], [1969, 1969], [1994, 2026], [2036, 2037], [2042, 2042], [2048, 2069], [2074, 2074], [2084, 2084], [2088, 2088], [2112, 2136], [2208, 2208], [2210, 2220], [2308, 2361], [2365, 2365], [2384, 2384], [2392, 2401], [2417, 2423], [2425, 2431], [2437, 2444], [2447, 2448], [2451, 2472], [2474, 2480], [2482, 2482], [2486, 2489], [2493, 2493], [2510, 2510], [2524, 2525], [2527, 2529], [2544, 2545], [2565, 2570], [2575, 2576], [2579, 2600], [2602, 2608], [2610, 2611], [2613, 2614], [2616, 2617], [2649, 2652], [2654, 2654], [2674, 2676], [2693, 2701], [2703, 2705], [2707, 2728], [2730, 2736], [2738, 2739], [2741, 2745], [2749, 2749], [2768, 2768], [2784, 2785], [2821, 2828], [2831, 2832], [2835, 2856], [2858, 2864], [2866, 2867], [2869, 2873], [2877, 2877], [2908, 2909], [2911, 2913], [2929, 2929], [2947, 2947], [2949, 2954], [2958, 2960], [2962, 2965], [2969, 2970], [2972, 2972], [2974, 2975], [2979, 2980], [2984, 2986], [2990, 3001], [3024, 3024], [3077, 3084], [3086, 3088], [3090, 3112], [3114, 3123], [3125, 3129], [3133, 3133], [3160, 3161], [3168, 3169], [3205, 3212], [3214, 3216], [3218, 3240], [3242, 3251], [3253, 3257], [3261, 3261], [3294, 3294], [3296, 3297], [3313, 3314], [3333, 3340], [3342, 3344], [3346, 3386], [3389, 3389], [3406, 3406], [3424, 3425], [3450, 3455], [3461, 3478], [3482, 3505], [3507, 3515], [3517, 3517], [3520, 3526], [3840, 3840], [3904, 3911], [3913, 3948], [3976, 3980], [4256, 4293], [4295, 4295], [4301, 4301], [4304, 4346], [4348, 4680], [4682, 4685], [4688, 4694], [4696, 4696], [4698, 4701], [4704, 4744], [4746, 4749], [4752, 4784], [4786, 4789], [4792, 4798], [4800, 4800], [4802, 4805], [4808, 4822], [4824, 4880], [4882, 4885], [4888, 4954], [4992, 5007], [5024, 5108], [5121, 5740], [5743, 5759], [5761, 5786], [5792, 5866], [5870, 5872], [5888, 5900], [5902, 5905], [5920, 5937], [5952, 5969], [5984, 5996], [5998, 6000], [6176, 6263], [6272, 6312], [6314, 6314], [6320, 6389], [6400, 6428], [6656, 6678], [6917, 6963], [6981, 6987], [7043, 7072], [7086, 7087], [7098, 7141], [7168, 7203], [7245, 7247], [7258, 7293], [7401, 7404], [7406, 7409], [7413, 7414], [7424, 7615], [7680, 7957], [7960, 7965], [7968, 8005], [8008, 8013], [8016, 8023], [8025, 8025], [8027, 8027], [8029, 8029], [8031, 8061], [8064, 8116], [8118, 8124], [8126, 8126], [8130, 8132], [8134, 8140], [8144, 8147], [8150, 8155], [8160, 8172], [8178, 8180], [8182, 8188], [8305, 8305], [8319, 8319], [8336, 8348], [8450, 8450], [8455, 8455], [8458, 8467], [8469, 8469], [8473, 8477], [8484, 8484], [8486, 8486], [8488, 8488], [8490, 8493], [8495, 8505], [8508, 8511], [8517, 8521], [8526, 8526], [8544, 8584], [9398, 9449], [11264, 11310], [11312, 11358], [11360, 11492], [11499, 11502], [11506, 11507], [11520, 11557], [11559, 11559], [11565, 11565], [11568, 11623], [11631, 11631], [11648, 11670], [11680, 11686], [11688, 11694], [11696, 11702], [11704, 11710], [11712, 11718], [11720, 11726], [11728, 11734], [11736, 11742], [11823, 11823], [12293, 12293], [12347, 12348], [12549, 12589], [12593, 12686], [12704, 12730], [40960, 42124], [42192, 42237], [42240, 42508], [42512, 42527], [42538, 42539], [42560, 42606], [42623, 42647], [42656, 42735], [42775, 42783], [42786, 42888], [42891, 42894], [42896, 42899], [42912, 42922], [43000, 43009], [43011, 43013], [43015, 43018], [43020, 43042], [43072, 43123], [43138, 43187], [43250, 43255], [43259, 43259], [43274, 43301], [43312, 43334], [43360, 43388], [43396, 43442], [43471, 43471], [43520, 43560], [43584, 43586], [43588, 43595], [43744, 43754], [43762, 43764], [43777, 43782], [43785, 43790], [43793, 43798], [43808, 43814], [43816, 43822], [43968, 44002], [44032, 55203], [55216, 55238], [55243, 55291], [64256, 64262], [64275, 64279], [64336, 64433], [64467, 64829], [64848, 64911], [64914, 64967], [65008, 65019], [65136, 65140], [65142, 65276], [65313, 65338], [65345, 65370], [65440, 65470], [65474, 65479], [65482, 65487], [65490, 65495], [65498, 65500], [65536, 65547], [65549, 65574], [65576, 65594], [65596, 65597], [65599, 65613], [65616, 65629], [65664, 65786], [65856, 65908], [66176, 66204], [66208, 66256], [66304, 66334], [66352, 66378], [66432, 66461], [66464, 66499], [66504, 66511], [66513, 66517], [66560, 66717], [67584, 67589], [67592, 67592], [67594, 67637], [67639, 67640], [67644, 67644], [67647, 67669], [67840, 67861], [67872, 67897], [67968, 68023], [68030, 68031], [68096, 68096], [68112, 68115], [68117, 68119], [68121, 68147], [68192, 68220], [68352, 68405], [68416, 68437], [68448, 68466], [68608, 68680], [69635, 69687], [69763, 69807], [69840, 69864], [69891, 69926], [70019, 70066], [70081, 70084], [71296, 71338], [73728, 74606], [74752, 74850], [77824, 78894], [92160, 92728], [93952, 94020], [94032, 94032], [94099, 94111], [119808, 119892], [119894, 119964], [119966, 119967], [119970, 119970], [119973, 119974], [119977, 119980], [119982, 119993], [119995, 119995], [119997, 120003], [120005, 120069], [120071, 120074], [120077, 120084], [120086, 120092], [120094, 120121], [120123, 120126], [120128, 120132], [120134, 120134], [120138, 120144], [120146, 120485], [120488, 120512], [120514, 120538], [120540, 120570], [120572, 120596], [120598, 120628], [120630, 120654], [120656, 120686], [120688, 120712], [120714, 120744], [120746, 120770], [120772, 120779], [126464, 126467], [126469, 126495], [126497, 126498], [126500, 126500], [126503, 126503], [126505, 126514], [126516, 126519], [126521, 126521], [126523, 126523], [126530, 126530], [126535, 126535], [126537, 126537], [126539, 126539], [126541, 126543], [126545, 126546], [126548, 126548], [126551, 126551], [126553, 126553], [126555, 126555], [126557, 126557], [126559, 126559], [126561, 126562], [126564, 126564], [126567, 126570], [126572, 126578], [126580, 126583], [126585, 126588], [126590, 126590], [126592, 126601], [126603, 126619], [126625, 126627], [126629, 126633], [126635, 126651]],
          "MidLetter": [[58, 58], [183, 183], [727, 727], [903, 903], [1524, 1524], [8231, 8231], [65043, 65043], [65109, 65109], [65306, 65306]],
          "MidNum": [[44, 44], [59, 59], [894, 894], [1417, 1417], [1548, 1549], [1644, 1644], [2040, 2040], [8260, 8260], [65040, 65040], [65044, 65044], [65104, 65104], [65108, 65108], [65292, 65292], [65307, 65307]],
          "MidNumLet": [[46, 46], [8216, 8217], [8228, 8228], [65106, 65106], [65287, 65287], [65294, 65294]],
          "Numeric": [[48, 57], [1632, 1641], [1643, 1643], [1776, 1785], [1984, 1993], [2406, 2415], [2534, 2543], [2662, 2671], [2790, 2799], [2918, 2927], [3046, 3055], [3174, 3183], [3302, 3311], [3430, 3439], [3664, 3673], [3792, 3801], [3872, 3881], [4160, 4169], [4240, 4249], [6112, 6121], [6160, 6169], [6470, 6479], [6608, 6617], [6784, 6793], [6800, 6809], [6992, 7001], [7088, 7097], [7232, 7241], [7248, 7257], [42528, 42537], [43216, 43225], [43264, 43273], [43472, 43481], [43600, 43609], [44016, 44025], [66720, 66729], [69734, 69743], [69872, 69881], [69942, 69951], [70096, 70105], [71360, 71369], [120782, 120831]],
          "ExtendNumLet": [[95, 95], [8255, 8256], [8276, 8276], [65075, 65076], [65101, 65103], [65343, 65343]]
        }
      }
    },
    "ListFormatter": {
      "formats": {
        "2": "{0} et {1}",
        "end": "{0} et {1}",
        "middle": "{0}, {1}",
        "start": "{0}, {1}"
      }
    },
    "Languages": {
      "all": {
        "aa": "afar",
        "ab": "abkhaze",
        "ace": "aceh",
        "ach": "acoli",
        "ada": "adangme",
        "ady": "adyghéen",
        "ae": "avestique",
        "af": "afrikaans",
        "afh": "afrihili",
        "agq": "aghem",
        "ain": "aïnou",
        "ak": "akan",
        "akk": "akkadien",
        "ale": "aléoute",
        "alt": "altaï du Sud",
        "am": "amharique",
        "an": "aragonais",
        "ang": "ancien anglais",
        "anp": "angika",
        "ar": "arabe",
        "ar-001": "arabe standard moderne",
        "arc": "araméen",
        "arn": "araukan",
        "arp": "arapaho",
        "arw": "arawak",
        "as": "assamais",
        "asa": "assou",
        "ast": "asturien",
        "av": "avar",
        "awa": "awadhi",
        "ay": "aymara",
        "az": "azéri",
        "ba": "bachkir",
        "bal": "baloutchi",
        "ban": "balinais",
        "bas": "bassa",
        "bax": "bamoun",
        "bbj": "ghomala",
        "be": "biélorusse",
        "bej": "bedja",
        "bem": "bemba",
        "bez": "béna",
        "bfd": "bafut",
        "bg": "bulgare",
        "bho": "bhojpuri",
        "bi": "bichelamar",
        "bik": "bikol",
        "bin": "bini",
        "bkm": "kom",
        "bla": "siksika",
        "bm": "bambara",
        "bn": "bengali",
        "bo": "tibétain",
        "br": "breton",
        "bra": "braj",
        "brx": "bodo",
        "bs": "bosniaque",
        "bss": "akoose",
        "bua": "bouriate",
        "bug": "bugi",
        "bum": "boulou",
        "byn": "blin",
        "byv": "medumba",
        "ca": "catalan",
        "cad": "caddo",
        "car": "caribe",
        "cay": "cayuga",
        "cch": "atsam",
        "ce": "tchétchène",
        "ceb": "cebuano",
        "cgg": "kiga",
        "ch": "chamorro",
        "chb": "chibcha",
        "chg": "tchaghataï",
        "chk": "chuuk",
        "chm": "mari",
        "chn": "jargon chinook",
        "cho": "choctaw",
        "chp": "chipewyan",
        "chr": "cherokee",
        "chy": "cheyenne",
        "ckb": "sorani",
        "co": "corse",
        "cop": "copte",
        "cr": "cree",
        "crh": "turc de Crimée",
        "cs": "tchèque",
        "csb": "kachoube",
        "cu": "slavon d’église",
        "cv": "tchouvache",
        "cy": "gallois",
        "da": "danois",
        "dak": "dakota",
        "dar": "dargwa",
        "dav": "taita",
        "de": "allemand",
        "de-AT": "allemand autrichien",
        "de-CH": "allemand suisse",
        "del": "delaware",
        "den": "slavey",
        "dgr": "dogrib",
        "din": "dinka",
        "dje": "zarma",
        "doi": "dogri",
        "dsb": "bas-sorabe",
        "dua": "douala",
        "dum": "moyen néerlandais",
        "dv": "maldivien",
        "dyo": "diola-fogny",
        "dyu": "dioula",
        "dz": "dzongkha",
        "dzg": "dazaga",
        "ebu": "embou",
        "ee": "éwé",
        "efi": "efik",
        "egy": "égyptien ancien",
        "eka": "ekajuk",
        "el": "grec",
        "elx": "élamite",
        "en": "anglais",
        "en-AU": "anglais australien",
        "en-CA": "anglais canadien",
        "en-GB": "anglais (GB)",
        "en-US": "anglais (É.-U.)",
        "enm": "moyen anglais",
        "eo": "espéranto",
        "es": "espagnol",
        "es-419": "espagnol latino-américain",
        "es-ES": "espagnol ibérique",
        "es-MX": "espagnol mexicain",
        "et": "estonien",
        "eu": "basque",
        "ewo": "éwondo",
        "fa": "persan",
        "fan": "fang",
        "fat": "fanti",
        "ff": "peul",
        "fi": "finnois",
        "fil": "filipino",
        "fj": "fidjien",
        "fo": "féroïen",
        "fon": "fon",
        "fr": "français",
        "fr-CA": "français canadien",
        "fr-CH": "français suisse",
        "frm": "moyen français",
        "fro": "ancien français",
        "frp": "franco-provençal",
        "frr": "frison du Nord",
        "frs": "frison oriental",
        "fur": "frioulan",
        "fy": "frison",
        "ga": "irlandais",
        "gaa": "ga",
        "gag": "gag",
        "gay": "gayo",
        "gba": "gbaya",
        "gd": "gaélique écossais",
        "gez": "guèze",
        "gil": "gilbertais",
        "gl": "galicien",
        "gmh": "moyen haut-allemand",
        "gn": "guarani",
        "goh": "ancien haut allemand",
        "gon": "gondi",
        "gor": "gorontalo",
        "got": "gotique",
        "grb": "grebo",
        "grc": "grec ancien",
        "gsw": "suisse allemand",
        "gu": "goudjarâtî",
        "guz": "gusii",
        "gv": "manx",
        "gwi": "gwichʼin",
        "ha": "haoussa",
        "hai": "haida",
        "haw": "hawaïen",
        "he": "hébreu",
        "hi": "hindi",
        "hil": "hiligaynon",
        "hit": "hittite",
        "hmn": "hmong",
        "ho": "hiri motu",
        "hr": "croate",
        "hsb": "haut-sorabe",
        "ht": "haïtien",
        "hu": "hongrois",
        "hup": "hupa",
        "hy": "arménien",
        "hz": "héréro",
        "ia": "interlingua",
        "iba": "iban",
        "ibb": "ibibio",
        "id": "indonésien",
        "ie": "interlingue",
        "ig": "igbo",
        "ii": "yi de Sichuan",
        "ik": "inupiaq",
        "ilo": "ilokano",
        "inh": "ingouche",
        "io": "ido",
        "is": "islandais",
        "it": "italien",
        "iu": "inuktitut",
        "ja": "japonais",
        "jbo": "lojban",
        "jgo": "ngomba",
        "jmc": "machame",
        "jpr": "judéo-persan",
        "jrb": "judéo-arabe",
        "jv": "javanais",
        "ka": "géorgien",
        "kaa": "karakalpak",
        "kab": "kabyle",
        "kac": "kachin",
        "kaj": "jju",
        "kam": "kamba",
        "kaw": "kawi",
        "kbd": "kabardin",
        "kbl": "kanembou",
        "kcg": "tyap",
        "kde": "makonde",
        "kea": "capverdien",
        "kfo": "koro",
        "kg": "kongo",
        "kha": "khasi",
        "kho": "khotanais",
        "khq": "koyra chiini",
        "ki": "kikuyu",
        "kj": "kuanyama",
        "kk": "kazakh",
        "kkj": "kako",
        "kl": "groenlandais",
        "kln": "kalenjin",
        "km": "khmer",
        "kmb": "kiMboundou",
        "kn": "kannada",
        "ko": "coréen",
        "koi": "komi-permiak",
        "kok": "konkani",
        "kos": "kusaien",
        "kpe": "kpellé",
        "kr": "kanouri",
        "krc": "karatchaï balkar",
        "krl": "carélien",
        "kru": "kurukh",
        "ks": "kashmiri",
        "ksb": "chambala",
        "ksf": "bafia",
        "ksh": "francique ripuaire",
        "ku": "kurde",
        "kum": "koumyk",
        "kut": "kutenai",
        "kv": "komi",
        "kw": "cornique",
        "ky": "kirghize",
        "la": "latin",
        "lad": "ladino",
        "lag": "langi",
        "lah": "lahnda",
        "lam": "lamba",
        "lb": "luxembourgeois",
        "lez": "lezghien",
        "lg": "ganda",
        "li": "limbourgeois",
        "lkt": "lakota",
        "ln": "lingala",
        "lo": "lao",
        "lol": "mongo",
        "loz": "lozi",
        "lt": "lituanien",
        "lu": "luba-katanga",
        "lua": "luba-lulua",
        "lui": "luiseno",
        "lun": "lunda",
        "luo": "luo",
        "lus": "lushai",
        "luy": "oluluyia",
        "lv": "letton",
        "mad": "madurais",
        "maf": "mafa",
        "mag": "magahi",
        "mai": "maithili",
        "mak": "makassar",
        "man": "mandingue",
        "mas": "masai",
        "mde": "maba",
        "mdf": "moksa",
        "mdr": "mandar",
        "men": "mendé",
        "mer": "merou",
        "mfe": "créole mauricien",
        "mg": "malgache",
        "mga": "moyen irlandais",
        "mgh": "makhuwa-meetto",
        "mgo": "méta’",
        "mh": "marshall",
        "mi": "maori",
        "mic": "micmac",
        "min": "minangkabau",
        "mk": "macédonien",
        "ml": "malayalam",
        "mn": "mongol",
        "mnc": "mandchou",
        "mni": "manipuri",
        "moh": "mohawk",
        "mos": "moré",
        "mr": "marathe",
        "ms": "malais",
        "mt": "maltais",
        "mua": "mundang",
        "mul": "multilingue",
        "mus": "creek",
        "mwl": "mirandais",
        "mwr": "marwarî",
        "my": "birman",
        "mye": "myènè",
        "myv": "erzya",
        "na": "nauruan",
        "nap": "napolitain",
        "naq": "nama",
        "nb": "norvégien bokmål",
        "nd": "ndébélé du Nord",
        "nds": "bas-allemand",
        "ne": "népalais",
        "new": "newari",
        "ng": "ndonga",
        "nia": "nias",
        "niu": "niué",
        "nl": "néerlandais",
        "nl-BE": "flamand",
        "nmg": "kwasio",
        "nn": "norvégien nynorsk",
        "nnh": "ngiemboon",
        "no": "norvégien",
        "nog": "nogaï",
        "non": "vieux norrois",
        "nqo": "n’ko",
        "nr": "ndébélé du Sud",
        "nso": "sotho du Nord",
        "nus": "nuer",
        "nv": "navaho",
        "nwc": "newarî classique",
        "ny": "nyanja",
        "nym": "nyamwezi",
        "nyn": "nyankolé",
        "nyo": "nyoro",
        "nzi": "nzema",
        "oc": "occitan",
        "oj": "ojibwa",
        "om": "oromo",
        "or": "oriya",
        "os": "ossète",
        "osa": "osage",
        "ota": "turc ottoman",
        "pa": "pendjabi",
        "pag": "pangasinan",
        "pal": "pahlavi",
        "pam": "pampangan",
        "pap": "papiamento",
        "pau": "palau",
        "peo": "persan ancien",
        "phn": "phénicien",
        "pi": "pali",
        "pl": "polonais",
        "pon": "pohnpei",
        "pro": "provençal ancien",
        "ps": "pashto",
        "pt": "portugais",
        "pt-BR": "portugais brésilien",
        "pt-PT": "portugais ibérique",
        "qu": "quechua",
        "quc": "k’iche’",
        "raj": "rajasthani",
        "rap": "rapanui",
        "rar": "rarotongien",
        "rm": "romanche",
        "rn": "roundi",
        "ro": "roumain",
        "ro-MD": "moldave",
        "rof": "rombo",
        "rom": "tzigane",
        "root": "racine",
        "ru": "russe",
        "rup": "valaque",
        "rw": "kinyarwanda",
        "rwk": "rwa",
        "sa": "sanskrit",
        "sad": "sandawe",
        "sah": "iakoute",
        "sam": "araméen samaritain",
        "saq": "samburu",
        "sas": "sasak",
        "sat": "santal",
        "sba": "ngambay",
        "sbp": "sangu",
        "sc": "sarde",
        "scn": "sicilien",
        "sco": "écossais",
        "sd": "sindhi",
        "se": "sami du Nord",
        "see": "seneca",
        "seh": "sena",
        "sel": "selkoupe",
        "ses": "koyraboro senni",
        "sg": "sangho",
        "sga": "ancien irlandais",
        "sh": "serbo-croate",
        "shi": "chleuh",
        "shn": "shan",
        "shu": "arabe tchadien",
        "si": "cingalais",
        "sid": "sidamo",
        "sk": "slovaque",
        "sl": "slovène",
        "sm": "samoan",
        "sma": "sami du Sud",
        "smj": "sami de Lule",
        "smn": "sami d’Inari",
        "sms": "sami skolt",
        "sn": "shona",
        "snk": "soninké",
        "so": "somali",
        "sog": "sogdien",
        "sq": "albanais",
        "sr": "serbe",
        "srn": "sranan tongo",
        "srr": "sérère",
        "ss": "swati",
        "ssy": "saho",
        "st": "sesotho",
        "su": "soundanais",
        "suk": "sukuma",
        "sus": "soussou",
        "sux": "sumérien",
        "sv": "suédois",
        "sw": "swahili",
        "swb": "comorien",
        "swc": "swahili du Congo",
        "syc": "syriaque classique",
        "syr": "syriaque",
        "ta": "tamoul",
        "te": "télougou",
        "tem": "temne",
        "teo": "teso",
        "ter": "tereno",
        "tet": "tetum",
        "tg": "tadjik",
        "th": "thaï",
        "ti": "tigrigna",
        "tig": "tigré",
        "tiv": "tiv",
        "tk": "turkmène",
        "tkl": "tokelau",
        "tl": "tagalog",
        "tlh": "klingon",
        "tli": "tlingit",
        "tmh": "tamacheq",
        "tn": "tswana",
        "to": "tongan",
        "tog": "tonga nyasa",
        "tpi": "tok pisin",
        "tr": "turc",
        "trv": "taroko",
        "ts": "tsonga",
        "tsi": "tsimshian",
        "tt": "tatar",
        "tum": "tumbuka",
        "tvl": "tuvalu",
        "tw": "twi",
        "twq": "tasawaq",
        "ty": "tahitien",
        "tyv": "touva",
        "tzm": "tamazight",
        "udm": "oudmourte",
        "ug": "ouïghour",
        "uga": "ougaritique",
        "uk": "ukrainien",
        "umb": "umbundu",
        "und": "indéterminé",
        "ur": "ourdou",
        "uz": "ouzbek",
        "vai": "vaï",
        "ve": "venda",
        "vi": "vietnamien",
        "vo": "volapuk",
        "vot": "vote",
        "vun": "vunjo",
        "wa": "wallon",
        "wae": "walser",
        "wal": "walamo",
        "war": "waray",
        "was": "washo",
        "wo": "wolof",
        "xal": "kalmouk",
        "xh": "xhosa",
        "xog": "soga",
        "yao": "yao",
        "yap": "yapois",
        "yav": "yangben",
        "ybb": "yémba",
        "yi": "yiddish",
        "yo": "yoruba",
        "yue": "cantonais",
        "za": "zhuang",
        "zap": "zapotèque",
        "zbl": "symboles Bliss",
        "zen": "zenaga",
        "zgh": "amazighe standard marocain",
        "zh": "chinois",
        "zh-Hans": "chinois simplifié",
        "zh-Hant": "chinois traditionnel",
        "zu": "zoulou",
        "zun": "zuni",
        "zxx": "sans contenu linguistique",
        "zza": "zazaki"
      },
      "rtl_data": {
        "af": false,
        "ar": true,
        "be": false,
        "bg": false,
        "bn": false,
        "ca": false,
        "cs": false,
        "cy": false,
        "da": false,
        "de": false,
        "de-CH": false,
        "el": false,
        "en": false,
        "en-150": false,
        "en-AU": false,
        "en-CA": false,
        "en-GB": false,
        "en-IE": false,
        "en-SG": false,
        "en-ZA": false,
        "es": false,
        "es-419": false,
        "es-CO": false,
        "es-MX": false,
        "es-US": false,
        "eu": false,
        "fa": true,
        "fi": false,
        "fil": false,
        "fr": false,
        "fr-BE": false,
        "fr-CA": false,
        "fr-CH": false,
        "ga": false,
        "gl": false,
        "he": true,
        "hi": false,
        "hr": false,
        "hu": false,
        "id": false,
        "is": false,
        "it": false,
        "it-CH": false,
        "ja": false,
        "ko": false,
        "lv": false,
        "ms": false,
        "nb": false,
        "nl": false,
        "pl": false,
        "pt": false,
        "ro": false,
        "ru": false,
        "sk": false,
        "sq": false,
        "sr": false,
        "sv": false,
        "ta": false,
        "th": false,
        "tr": false,
        "uk": false,
        "ur": true,
        "vi": false,
        "zh": false,
        "zh-Hant": false
      }
    },
    "NumberParser": {
      "group_separator": " ",
      "decimal_separator": ","
    },
    "NumberFormatter": {
      "all_tokens": {
        "default": {
          "positive": ["", "#,##0.###"],
          "negative": ["-", "#,##0.###"]
        },
        "decimal": {
          "positive": ["", "#,##0.###"],
          "negative": ["-", "#,##0.###"]
        },
        "long_decimal": {
          "positive": {
            "1000": {
              "one": ["", "0", " millier"],
              "other": ["", "0", " mille"]
            },
            "10000": {
              "one": ["", "00", " millier"],
              "other": ["", "00", " mille"]
            },
            "100000": {
              "one": ["", "000", " millier"],
              "other": ["", "000", " mille"]
            },
            "1000000": {
              "one": ["", "0", " million"],
              "other": ["", "0", " millions"]
            },
            "10000000": {
              "one": ["", "00", " million"],
              "other": ["", "00", " millions"]
            },
            "100000000": {
              "one": ["", "000", " million"],
              "other": ["", "000", " millions"]
            },
            "1000000000": {
              "one": ["", "0", " milliard"],
              "other": ["", "0", " milliards"]
            },
            "10000000000": {
              "one": ["", "00", " milliard"],
              "other": ["", "00", " milliards"]
            },
            "100000000000": {
              "one": ["", "000", " milliards"],
              "other": ["", "000", " milliards"]
            },
            "1000000000000": {
              "one": ["", "0", " billion"],
              "other": ["", "0", " billions"]
            },
            "10000000000000": {
              "one": ["", "00", " billions"],
              "other": ["", "00", " billions"]
            },
            "100000000000000": {
              "one": ["", "000", " billions"],
              "other": ["", "000", " billions"]
            }
          },
          "negative": {
            "1000": {
              "one": ["-", "0", " millier"],
              "other": ["-", "0", " mille"]
            },
            "10000": {
              "one": ["-", "00", " millier"],
              "other": ["-", "00", " mille"]
            },
            "100000": {
              "one": ["-", "000", " millier"],
              "other": ["-", "000", " mille"]
            },
            "1000000": {
              "one": ["-", "0", " million"],
              "other": ["-", "0", " millions"]
            },
            "10000000": {
              "one": ["-", "00", " million"],
              "other": ["-", "00", " millions"]
            },
            "100000000": {
              "one": ["-", "000", " million"],
              "other": ["-", "000", " millions"]
            },
            "1000000000": {
              "one": ["-", "0", " milliard"],
              "other": ["-", "0", " milliards"]
            },
            "10000000000": {
              "one": ["-", "00", " milliard"],
              "other": ["-", "00", " milliards"]
            },
            "100000000000": {
              "one": ["-", "000", " milliards"],
              "other": ["-", "000", " milliards"]
            },
            "1000000000000": {
              "one": ["-", "0", " billion"],
              "other": ["-", "0", " billions"]
            },
            "10000000000000": {
              "one": ["-", "00", " billions"],
              "other": ["-", "00", " billions"]
            },
            "100000000000000": {
              "one": ["-", "000", " billions"],
              "other": ["-", "000", " billions"]
            }
          }
        },
        "short_decimal": {
          "positive": {
            "1000": {
              "one": ["", "0", " k"],
              "other": ["", "0", " k"]
            },
            "10000": {
              "one": ["", "00", " k"],
              "other": ["", "00", " k"]
            },
            "100000": {
              "one": ["", "000", " k"],
              "other": ["", "000", " k"]
            },
            "1000000": {
              "one": ["", "0", " M"],
              "other": ["", "0", " M"]
            },
            "10000000": {
              "one": ["", "00", " M"],
              "other": ["", "00", " M"]
            },
            "100000000": {
              "one": ["", "000", " M"],
              "other": ["", "000", " M"]
            },
            "1000000000": {
              "one": ["", "0", " G"],
              "other": ["", "0", " G"]
            },
            "10000000000": {
              "one": ["", "00", " G"],
              "other": ["", "00", " G"]
            },
            "100000000000": {
              "one": ["", "000", " G"],
              "other": ["", "000", " G"]
            },
            "1000000000000": {
              "one": ["", "0", " T"],
              "other": ["", "0", " T"]
            },
            "10000000000000": {
              "one": ["", "00", " T"],
              "other": ["", "00", " T"]
            },
            "100000000000000": {
              "one": ["", "000", " T"],
              "other": ["", "000", " T"]
            }
          },
          "negative": {
            "1000": {
              "one": ["-", "0", " k"],
              "other": ["-", "0", " k"]
            },
            "10000": {
              "one": ["-", "00", " k"],
              "other": ["-", "00", " k"]
            },
            "100000": {
              "one": ["-", "000", " k"],
              "other": ["-", "000", " k"]
            },
            "1000000": {
              "one": ["-", "0", " M"],
              "other": ["-", "0", " M"]
            },
            "10000000": {
              "one": ["-", "00", " M"],
              "other": ["-", "00", " M"]
            },
            "100000000": {
              "one": ["-", "000", " M"],
              "other": ["-", "000", " M"]
            },
            "1000000000": {
              "one": ["-", "0", " G"],
              "other": ["-", "0", " G"]
            },
            "10000000000": {
              "one": ["-", "00", " G"],
              "other": ["-", "00", " G"]
            },
            "100000000000": {
              "one": ["-", "000", " G"],
              "other": ["-", "000", " G"]
            },
            "1000000000000": {
              "one": ["-", "0", " T"],
              "other": ["-", "0", " T"]
            },
            "10000000000000": {
              "one": ["-", "00", " T"],
              "other": ["-", "00", " T"]
            },
            "100000000000000": {
              "one": ["-", "000", " T"],
              "other": ["-", "000", " T"]
            }
          }
        },
        "currency": {
          "positive": ["", "#,##0.00", " ¤"],
          "negative": ["-", "#,##0.00", " ¤"]
        },
        "percent": {
          "positive": ["", "#,##0", " %"],
          "negative": ["-", "#,##0", " %"]
        }
      },
      "symbols": {
        "alias": "",
        "decimal": ",",
        "exponential": "E",
        "group": " ",
        "infinity": "∞",
        "list": ";",
        "minus_sign": "-",
        "nan": "NaN",
        "per_mille": "‰",
        "percent_sign": "%",
        "plus_sign": "+",
        "superscripting_exponent": "×",
        "time_separator": ":"
      }
    },
    "CurrencyFormatter": {
      "currencies_data": {
        "ADP": {
          "digits": 0,
          "rounding": 0
        },
        "AFN": {
          "digits": 0,
          "rounding": 0
        },
        "ALL": {
          "digits": 0,
          "rounding": 0
        },
        "AMD": {
          "digits": 0,
          "rounding": 0
        },
        "BHD": {
          "digits": 3,
          "rounding": 0
        },
        "BIF": {
          "digits": 0,
          "rounding": 0
        },
        "BYR": {
          "digits": 0,
          "rounding": 0
        },
        "CAD": {
          "digits": 2,
          "rounding": 0
        },
        "CHF": {
          "digits": 2,
          "rounding": 0
        },
        "CLF": {
          "digits": 4,
          "rounding": 0
        },
        "CLP": {
          "digits": 0,
          "rounding": 0
        },
        "COP": {
          "digits": 0,
          "rounding": 0
        },
        "CRC": {
          "digits": 0,
          "rounding": 0
        },
        "CZK": {
          "digits": 2,
          "rounding": 0
        },
        "DEFAULT": {
          "digits": 2,
          "rounding": 0
        },
        "DJF": {
          "digits": 0,
          "rounding": 0
        },
        "ESP": {
          "digits": 0,
          "rounding": 0
        },
        "GNF": {
          "digits": 0,
          "rounding": 0
        },
        "GYD": {
          "digits": 0,
          "rounding": 0
        },
        "HUF": {
          "digits": 2,
          "rounding": 0
        },
        "IDR": {
          "digits": 0,
          "rounding": 0
        },
        "IQD": {
          "digits": 0,
          "rounding": 0
        },
        "IRR": {
          "digits": 0,
          "rounding": 0
        },
        "ISK": {
          "digits": 0,
          "rounding": 0
        },
        "ITL": {
          "digits": 0,
          "rounding": 0
        },
        "JOD": {
          "digits": 3,
          "rounding": 0
        },
        "JPY": {
          "digits": 0,
          "rounding": 0
        },
        "KMF": {
          "digits": 0,
          "rounding": 0
        },
        "KPW": {
          "digits": 0,
          "rounding": 0
        },
        "KRW": {
          "digits": 0,
          "rounding": 0
        },
        "KWD": {
          "digits": 3,
          "rounding": 0
        },
        "LAK": {
          "digits": 0,
          "rounding": 0
        },
        "LBP": {
          "digits": 0,
          "rounding": 0
        },
        "LUF": {
          "digits": 0,
          "rounding": 0
        },
        "LYD": {
          "digits": 3,
          "rounding": 0
        },
        "MGA": {
          "digits": 0,
          "rounding": 0
        },
        "MGF": {
          "digits": 0,
          "rounding": 0
        },
        "MMK": {
          "digits": 0,
          "rounding": 0
        },
        "MNT": {
          "digits": 0,
          "rounding": 0
        },
        "MRO": {
          "digits": 0,
          "rounding": 0
        },
        "MUR": {
          "digits": 0,
          "rounding": 0
        },
        "OMR": {
          "digits": 3,
          "rounding": 0
        },
        "PKR": {
          "digits": 0,
          "rounding": 0
        },
        "PYG": {
          "digits": 0,
          "rounding": 0
        },
        "RSD": {
          "digits": 0,
          "rounding": 0
        },
        "RWF": {
          "digits": 0,
          "rounding": 0
        },
        "SLL": {
          "digits": 0,
          "rounding": 0
        },
        "SOS": {
          "digits": 0,
          "rounding": 0
        },
        "STD": {
          "digits": 0,
          "rounding": 0
        },
        "SYP": {
          "digits": 0,
          "rounding": 0
        },
        "TMM": {
          "digits": 0,
          "rounding": 0
        },
        "TND": {
          "digits": 3,
          "rounding": 0
        },
        "TRL": {
          "digits": 0,
          "rounding": 0
        },
        "TWD": {
          "digits": 2,
          "rounding": 0
        },
        "TZS": {
          "digits": 0,
          "rounding": 0
        },
        "UGX": {
          "digits": 0,
          "rounding": 0
        },
        "UYI": {
          "digits": 0,
          "rounding": 0
        },
        "UZS": {
          "digits": 0,
          "rounding": 0
        },
        "VND": {
          "digits": 0,
          "rounding": 0
        },
        "VUV": {
          "digits": 0,
          "rounding": 0
        },
        "XAF": {
          "digits": 0,
          "rounding": 0
        },
        "XOF": {
          "digits": 0,
          "rounding": 0
        },
        "XPF": {
          "digits": 0,
          "rounding": 0
        },
        "YER": {
          "digits": 0,
          "rounding": 0
        },
        "ZMK": {
          "digits": 0,
          "rounding": 0
        },
        "ZWD": {
          "digits": 0,
          "rounding": 0
        }
      }
    },
    "RBNF": {
      "resource": {
        "fr-CA": {}
      }
    },
    "NumberDataReader": {
      "resource": {
        "af": {
          "af": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 duisend",
                        "other": "0 duisend"
                      },
                      "10000": {
                        "one": "00 duisend",
                        "other": "00 duisend"
                      },
                      "100000": {
                        "one": "000 duisend",
                        "other": "000 duisend"
                      },
                      "1000000": {
                        "one": "0 miljoen",
                        "other": "0 miljoen"
                      },
                      "10000000": {
                        "one": "00 miljoen",
                        "other": "00 miljoen"
                      },
                      "100000000": {
                        "one": "000 miljoen",
                        "other": "000 miljoen"
                      },
                      "1000000000": {
                        "one": "0 miljard",
                        "other": "0 miljard"
                      },
                      "10000000000": {
                        "one": "00 miljard",
                        "other": "00 miljard"
                      },
                      "100000000000": {
                        "one": "000 miljard",
                        "other": "000 miljard"
                      },
                      "1000000000000": {
                        "one": "0 biljoen",
                        "other": "0 biljoen"
                      },
                      "10000000000000": {
                        "one": "00 biljoen",
                        "other": "00 biljoen"
                      },
                      "100000000000000": {
                        "one": "000 biljoen",
                        "other": "000 biljoen"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": 0,
                        "other": 0
                      },
                      "10000": {
                        "one": 0,
                        "other": 0
                      },
                      "100000": {
                        "one": 0,
                        "other": 0
                      },
                      "1000000": {
                        "one": "0 m",
                        "other": "0 m"
                      },
                      "10000000": {
                        "one": "00 m",
                        "other": "00 m"
                      },
                      "100000000": {
                        "one": "000 m",
                        "other": "000 m"
                      },
                      "1000000000": {
                        "one": "0 mjd",
                        "other": "0 mjd"
                      },
                      "10000000000": {
                        "one": "00 mjd",
                        "other": "00 mjd"
                      },
                      "100000000000": {
                        "one": "000 mjd",
                        "other": "000 mjd"
                      },
                      "1000000000000": {
                        "one": "0 bn",
                        "other": "0 bn"
                      },
                      "10000000000000": {
                        "one": "00 bn",
                        "other": "00 bn"
                      },
                      "100000000000000": {
                        "one": "000 bn",
                        "other": "000 bn"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ar": {
          "ar": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "arab",
                  "patterns": {
                    "default": "¤ #,##0.00"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}",
                    "two": "{0} {1}",
                    "zero": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "arab",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 آلاف",
                        "many": "0 ألف",
                        "one": "0 ألف",
                        "other": "0 ألف",
                        "two": "0 ألف",
                        "zero": "0 ألف"
                      },
                      "10000": {
                        "few": "00 ألف",
                        "many": "00 ألف",
                        "one": "00 ألف",
                        "other": "00 ألف",
                        "two": "00 ألف",
                        "zero": "00 ألف"
                      },
                      "100000": {
                        "few": "000 ألف",
                        "many": "000 ألف",
                        "one": "000 ألف",
                        "other": "000 ألف",
                        "two": "000 ألف",
                        "zero": "000 ألف"
                      },
                      "1000000": {
                        "few": "0 ملايين",
                        "many": "0 مليون",
                        "one": "0 مليون",
                        "other": "0 مليون",
                        "two": "0 مليون",
                        "zero": "0 مليون"
                      },
                      "10000000": {
                        "few": "00 ملايين",
                        "many": "00 مليون",
                        "one": "00 مليون",
                        "other": "00 مليون",
                        "two": "00 مليون",
                        "zero": "00 مليون"
                      },
                      "100000000": {
                        "few": "000 مليون",
                        "many": "000 مليون",
                        "one": "000 مليون",
                        "other": "000 مليون",
                        "two": "000 مليون",
                        "zero": "000 مليون"
                      },
                      "1000000000": {
                        "few": "0 بلايين",
                        "many": "0 بليون",
                        "one": "0 بليون",
                        "other": "0 بليون",
                        "two": "0 بليون",
                        "zero": "0 بليون"
                      },
                      "10000000000": {
                        "few": "00 بليون",
                        "many": "00 بليون",
                        "one": "00 بليون",
                        "other": "00 بليون",
                        "two": "00 بليون",
                        "zero": "00 بليون"
                      },
                      "100000000000": {
                        "few": "000 بليون",
                        "many": "000 بليون",
                        "one": "000 بليون",
                        "other": "000 بليون",
                        "two": "000 بليون",
                        "zero": "000 بليون"
                      },
                      "1000000000000": {
                        "few": "0 تريليونات",
                        "many": "0 تريليون",
                        "one": "0 تريليون",
                        "other": "0 تريليون",
                        "two": "0 تريليون",
                        "zero": "0 تريليون"
                      },
                      "10000000000000": {
                        "few": "00 تريليون",
                        "many": "00 تريليون",
                        "one": "00 تريليون",
                        "other": "00 تريليون",
                        "two": "00 تريليون",
                        "zero": "00 تريليون"
                      },
                      "100000000000000": {
                        "few": "000 تريليون",
                        "many": "000 تريليون",
                        "one": "000 تريليون",
                        "other": "000 تريليون",
                        "two": "000 تريليون",
                        "zero": "000 تريليون"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 آلاف",
                        "many": "0 ألف",
                        "one": "0 ألف",
                        "other": "0 ألف",
                        "two": "0 ألف",
                        "zero": "0 ألف"
                      },
                      "10000": {
                        "few": "00 ألف",
                        "many": "00 ألف",
                        "one": "00 ألف",
                        "other": "00 ألف",
                        "two": "00 ألف",
                        "zero": "00 ألف"
                      },
                      "100000": {
                        "few": "000 ألف",
                        "many": "000 ألف",
                        "one": "000 ألف",
                        "other": "000 ألف",
                        "two": "000 ألف",
                        "zero": "000 ألف"
                      },
                      "1000000": {
                        "few": "0 مليو",
                        "many": "0 مليو",
                        "one": "0 مليو",
                        "other": "0 مليو",
                        "two": "0 مليو",
                        "zero": "0 مليو"
                      },
                      "10000000": {
                        "few": "00 مليو",
                        "many": "00 مليو",
                        "one": "00 مليو",
                        "other": "00 مليو",
                        "two": "00 مليو",
                        "zero": "00 مليو"
                      },
                      "100000000": {
                        "few": "000 مليو",
                        "many": "000 مليو",
                        "one": "000 مليو",
                        "other": "000 مليو",
                        "two": "000 مليو",
                        "zero": "000 مليو"
                      },
                      "1000000000": {
                        "few": "0 بليو",
                        "many": "0 بليو",
                        "one": "0 بليو",
                        "other": "0 بليو",
                        "two": "0 بليو",
                        "zero": "0 بليو"
                      },
                      "10000000000": {
                        "few": "00 بليو",
                        "many": "00 بليو",
                        "one": "00 بليو",
                        "other": "00 بليو",
                        "two": "00 بليو",
                        "zero": "00 بليو"
                      },
                      "100000000000": {
                        "few": "000 بليو",
                        "many": "000 بليو",
                        "one": "000 بليو",
                        "other": "000 بليو",
                        "two": "000 بليو",
                        "zero": "000 بليو"
                      },
                      "1000000000000": {
                        "few": "0 ترليو",
                        "many": "0 ترليو",
                        "one": "0 ترليو",
                        "other": "0 ترليو",
                        "two": "0 ترليو",
                        "zero": "0 ترليو"
                      },
                      "10000000000000": {
                        "few": "00 ترليو",
                        "many": "00 ترليو",
                        "one": "00 ترليو",
                        "other": "00 ترليو",
                        "two": "00 ترليو",
                        "zero": "00 ترليو"
                      },
                      "100000000000000": {
                        "few": "000 ترليو",
                        "many": "000 ترليو",
                        "one": "000 ترليو",
                        "other": "000 ترليو",
                        "two": "000 ترليو",
                        "zero": "000 ترليو"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "arab",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "arab",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "‎-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "‎+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "be": {
          "be": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": "numbers.formats.decimal.patterns.short",
                    "short": {
                      "1000": {
                        "other": "0K"
                      },
                      "10000": {
                        "other": "00K"
                      },
                      "100000": {
                        "other": "000K"
                      },
                      "1000000": {
                        "other": "0M"
                      },
                      "10000000": {
                        "other": "00M"
                      },
                      "100000000": {
                        "other": "000M"
                      },
                      "1000000000": {
                        "other": "0G"
                      },
                      "10000000000": {
                        "other": "00G"
                      },
                      "100000000000": {
                        "other": "000G"
                      },
                      "1000000000000": {
                        "other": "0T"
                      },
                      "10000000000000": {
                        "other": "00T"
                      },
                      "100000000000000": {
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "bg": {
          "bg": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 хиляда",
                        "other": "0 хиляди"
                      },
                      "10000": {
                        "one": "00 хиляди",
                        "other": "00 хиляди"
                      },
                      "100000": {
                        "one": "000 хиляди",
                        "other": "000 хиляди"
                      },
                      "1000000": {
                        "one": "0 милион",
                        "other": "0 милиона"
                      },
                      "10000000": {
                        "one": "00 милиона",
                        "other": "00 милиона"
                      },
                      "100000000": {
                        "one": "000 милиона",
                        "other": "000 милиона"
                      },
                      "1000000000": {
                        "one": "0 милиард",
                        "other": "0 милиарда"
                      },
                      "10000000000": {
                        "one": "00 милиарда",
                        "other": "00 милиарда"
                      },
                      "100000000000": {
                        "one": "000 милиарда",
                        "other": "000 милиарда"
                      },
                      "1000000000000": {
                        "one": "0 трилион",
                        "other": "0 трилиона"
                      },
                      "10000000000000": {
                        "one": "00 трилиона",
                        "other": "00 трилиона"
                      },
                      "100000000000000": {
                        "one": "000 трилиона",
                        "other": "000 трилиона"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 хил'.'",
                        "other": "0 хил'.'"
                      },
                      "10000": {
                        "one": "00 хил'.'",
                        "other": "00 хил'.'"
                      },
                      "100000": {
                        "one": "000 хил'.'",
                        "other": "000 хил'.'"
                      },
                      "1000000": {
                        "one": "0 млн'.'",
                        "other": "0 млн'.'"
                      },
                      "10000000": {
                        "one": "00 млн'.'",
                        "other": "00 млн'.'"
                      },
                      "100000000": {
                        "one": "000 млн'.'",
                        "other": "000 млн'.'"
                      },
                      "1000000000": {
                        "one": "0 млрд'.'",
                        "other": "0 млрд'.'"
                      },
                      "10000000000": {
                        "one": "00 млрд'.'",
                        "other": "00 млрд'.'"
                      },
                      "100000000000": {
                        "one": "000 млрд'.'",
                        "other": "000 млрд'.'"
                      },
                      "1000000000000": {
                        "one": "0 трлн'.'",
                        "other": "0 трлн'.'"
                      },
                      "10000000000000": {
                        "one": "00 трлн'.'",
                        "other": "00 трлн'.'"
                      },
                      "100000000000000": {
                        "one": "000 трлн'.'",
                        "other": "000 трлн'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": ".",
                "time_separator": ":"
              }
            }
          }
        },
        "bn": {
          "bn": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##,##0.00¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 হাজার",
                        "other": "0 হাজার"
                      },
                      "10000": {
                        "one": "00 হাজার",
                        "other": "00 হাজার"
                      },
                      "100000": {
                        "one": "0 লাখ",
                        "other": "0 লাখ"
                      },
                      "1000000": {
                        "one": "0 মিলিয়ন",
                        "other": "0 মিলিয়ন"
                      },
                      "10000000": {
                        "one": "00 মিলিয়ন",
                        "other": "00 মিলিয়ন"
                      },
                      "100000000": {
                        "one": "000 মিলিয়ন",
                        "other": "000 মিলিয়ন"
                      },
                      "1000000000": {
                        "one": "0 বিলিয়ন",
                        "other": "0 বিলিয়ন"
                      },
                      "10000000000": {
                        "one": "00 বিলিয়ন",
                        "other": "00 বিলিয়ন"
                      },
                      "100000000000": {
                        "one": "000 বিলিয়ন",
                        "other": "000 বিলিয়ন"
                      },
                      "1000000000000": {
                        "one": "0 ট্রিলিয়ন",
                        "other": "0 ট্রিলিয়ন"
                      },
                      "10000000000000": {
                        "one": "00 ট্রিলিয়ন",
                        "other": "00 ট্রিলিয়ন"
                      },
                      "100000000000000": {
                        "one": "000 ট্রিলিয়ন",
                        "other": "000 ট্রিলিয়ন"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 হাজার",
                        "other": "0 হাজার"
                      },
                      "10000": {
                        "one": "00 হাজার",
                        "other": "00 হাজার"
                      },
                      "100000": {
                        "one": "0 লাখ",
                        "other": "0 লাখ"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ca": {
          "ca": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 miler",
                        "other": "0 milers"
                      },
                      "10000": {
                        "one": "00 milers",
                        "other": "00 milers"
                      },
                      "100000": {
                        "one": "000 milers",
                        "other": "000 milers"
                      },
                      "1000000": {
                        "one": "0 milió",
                        "other": "0 milions"
                      },
                      "10000000": {
                        "one": "00 milions",
                        "other": "00 milions"
                      },
                      "100000000": {
                        "one": "000 milions",
                        "other": "000 milions"
                      },
                      "1000000000": {
                        "one": "0 miler de milions",
                        "other": "0 milers de milions"
                      },
                      "10000000000": {
                        "one": "00 milers de milions",
                        "other": "00 milers de milions"
                      },
                      "100000000000": {
                        "one": "000 milers de milions",
                        "other": "000 milers de milions"
                      },
                      "1000000000000": {
                        "one": "0 bilió",
                        "other": "0 bilions"
                      },
                      "10000000000000": {
                        "one": "00 bilions",
                        "other": "00 bilions"
                      },
                      "100000000000000": {
                        "one": "000 bilions",
                        "other": "000 bilions"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0m",
                        "other": "0m"
                      },
                      "10000": {
                        "one": "00m",
                        "other": "00m"
                      },
                      "100000": {
                        "one": "000m",
                        "other": "000m"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00 M",
                        "other": "00 M"
                      },
                      "100000000": {
                        "one": "000 M",
                        "other": "000 M"
                      },
                      "1000000000": {
                        "one": "0000 M",
                        "other": "0000 M"
                      },
                      "10000000000": {
                        "one": "00mM",
                        "other": "00mM"
                      },
                      "100000000000": {
                        "one": "000mM",
                        "other": "000mM"
                      },
                      "1000000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000000": {
                        "one": "00 B",
                        "other": "00 B"
                      },
                      "100000000000000": {
                        "one": "000 B",
                        "other": "000 B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "cs": {
          "cs": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 tisíce",
                        "many": "0 tisíce",
                        "one": "0 tisíc",
                        "other": "0 tisíc"
                      },
                      "10000": {
                        "few": "00 tisíc",
                        "many": "00 tisíce",
                        "one": "00 tisíc",
                        "other": "00 tisíc"
                      },
                      "100000": {
                        "few": "000 tisíc",
                        "many": "000 tisíce",
                        "one": "000 tisíc",
                        "other": "000 tisíc"
                      },
                      "1000000": {
                        "few": "0 miliony",
                        "many": "0 milionu",
                        "one": "0 milion",
                        "other": "0 milionů"
                      },
                      "10000000": {
                        "few": "00 milionů",
                        "many": "00 milionu",
                        "one": "00 milionů",
                        "other": "00 milionů"
                      },
                      "100000000": {
                        "few": "000 milionů",
                        "many": "000 milionu",
                        "one": "000 milionů",
                        "other": "000 milionů"
                      },
                      "1000000000": {
                        "few": "0 miliardy",
                        "many": "0 miliardy",
                        "one": "0 miliarda",
                        "other": "0 miliard"
                      },
                      "10000000000": {
                        "few": "00 miliard",
                        "many": "00 miliardy",
                        "one": "00 miliard",
                        "other": "00 miliard"
                      },
                      "100000000000": {
                        "few": "000 miliard",
                        "many": "000 miliardy",
                        "one": "000 miliard",
                        "other": "000 miliard"
                      },
                      "1000000000000": {
                        "few": "0 biliony",
                        "many": "0 bilionu",
                        "one": "0 bilion",
                        "other": "0 bilionů"
                      },
                      "10000000000000": {
                        "few": "00 bilionů",
                        "many": "00 bilionu",
                        "one": "00 bilionů",
                        "other": "00 bilionů"
                      },
                      "100000000000000": {
                        "few": "000 bilionů",
                        "many": "000 bilionu",
                        "one": "000 bilionů",
                        "other": "000 bilionů"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 tis'.'",
                        "many": "0 tis'.'",
                        "one": "0 tis'.'",
                        "other": "0 tis'.'"
                      },
                      "10000": {
                        "few": "00 tis'.'",
                        "many": "00 tis'.'",
                        "one": "00 tis'.'",
                        "other": "00 tis'.'"
                      },
                      "100000": {
                        "few": "000 tis'.'",
                        "many": "000 tis'.'",
                        "one": "000 tis'.'",
                        "other": "000 tis'.'"
                      },
                      "1000000": {
                        "few": "0 mil'.'",
                        "many": "0 mil'.'",
                        "one": "0 mil'.'",
                        "other": "0 mil'.'"
                      },
                      "10000000": {
                        "few": "00 mil'.'",
                        "many": "00 mil'.'",
                        "one": "00 mil'.'",
                        "other": "00 mil'.'"
                      },
                      "100000000": {
                        "few": "000 mil'.'",
                        "many": "000 mil'.'",
                        "one": "000 mil'.'",
                        "other": "000 mil'.'"
                      },
                      "1000000000": {
                        "few": "0 mld'.'",
                        "many": "0 mld'.'",
                        "one": "0 mld'.'",
                        "other": "0 mld'.'"
                      },
                      "10000000000": {
                        "few": "00 mld'.'",
                        "many": "00 mld'.'",
                        "one": "00 mld'.'",
                        "other": "00 mld'.'"
                      },
                      "100000000000": {
                        "few": "000 mld'.'",
                        "many": "000 mld'.'",
                        "one": "000 mld'.'",
                        "other": "000 mld'.'"
                      },
                      "1000000000000": {
                        "few": "0 bil'.'",
                        "many": "0 bil'.'",
                        "one": "0 bil'.'",
                        "other": "0 bil'.'"
                      },
                      "10000000000000": {
                        "few": "00 bil'.'",
                        "many": "00 bil'.'",
                        "one": "00 bil'.'",
                        "other": "00 bil'.'"
                      },
                      "100000000000000": {
                        "few": "000 bil'.'",
                        "many": "000 bil'.'",
                        "one": "000 bil'.'",
                        "other": "000 bil'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "cy": {
          "cy": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}",
                    "two": "{0} {1}",
                    "zero": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 mil",
                        "many": "0 mil",
                        "one": "0 fil",
                        "other": "0 mil",
                        "two": "0 fil",
                        "zero": "0 mil"
                      },
                      "10000": {
                        "few": "00 mil",
                        "many": "00 mil",
                        "one": "00 mil",
                        "other": "00 mil",
                        "two": "00 mil",
                        "zero": "00 mil"
                      },
                      "100000": {
                        "few": "000 mil",
                        "many": "000 mil",
                        "one": "000 mil",
                        "other": "000 mil",
                        "two": "000 mil",
                        "zero": "000 mil"
                      },
                      "1000000": {
                        "few": "0 miliwn",
                        "many": "0 miliwn",
                        "one": "0 filiwn",
                        "other": "0 miliwn",
                        "two": "0 filiwn",
                        "zero": "0 miliwn"
                      },
                      "10000000": {
                        "few": "00 miliwn",
                        "many": "00 miliwn",
                        "one": "00 miliwn",
                        "other": "00 miliwn",
                        "two": "00 miliwn",
                        "zero": "00 miliwn"
                      },
                      "100000000": {
                        "few": "000 miliwn",
                        "many": "000 miliwn",
                        "one": "000 miliwn",
                        "other": "000 miliwn",
                        "two": "000 miliwn",
                        "zero": "000 miliwn"
                      },
                      "1000000000": {
                        "few": "0 biliwn",
                        "many": "0 biliwn",
                        "one": "0 biliwn",
                        "other": "0 biliwn",
                        "two": "0 biliwn",
                        "zero": "0 biliwn"
                      },
                      "10000000000": {
                        "few": "00 biliwn",
                        "many": "00 biliwn",
                        "one": "00 biliwn",
                        "other": "00 biliwn",
                        "two": "00 biliwn",
                        "zero": "00 biliwn"
                      },
                      "100000000000": {
                        "few": "000 biliwn",
                        "many": "000 biliwn",
                        "one": "000 biliwn",
                        "other": "000 biliwn",
                        "two": "000 biliwn",
                        "zero": "000 biliwn"
                      },
                      "1000000000000": {
                        "few": "0 thriliwn",
                        "many": "0 thriliwn",
                        "one": "0 triliwn",
                        "other": "0 triliwn",
                        "two": "0 driliwn",
                        "zero": "0 triliwn"
                      },
                      "10000000000000": {
                        "few": "00 triliwn",
                        "many": "00 triliwn",
                        "one": "00 triliwn",
                        "other": "00 triliwn",
                        "two": "00 triliwn",
                        "zero": "00 triliwn"
                      },
                      "100000000000000": {
                        "few": "000 triliwn",
                        "many": "000 triliwn",
                        "one": "000 triliwn",
                        "other": "000 triliwn",
                        "two": "000 triliwn",
                        "zero": "000 triliwn"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0K",
                        "many": "0K",
                        "one": "0K",
                        "other": "0K",
                        "two": "0K",
                        "zero": "0K"
                      },
                      "10000": {
                        "few": "00K",
                        "many": "00K",
                        "one": "00K",
                        "other": "00K",
                        "two": "00K",
                        "zero": "00K"
                      },
                      "100000": {
                        "few": "000K",
                        "many": "000K",
                        "one": "000K",
                        "other": "000K",
                        "two": "000K",
                        "zero": "000K"
                      },
                      "1000000": {
                        "few": "0M",
                        "many": "0M",
                        "one": "0M",
                        "other": "0M",
                        "two": "0M",
                        "zero": "0M"
                      },
                      "10000000": {
                        "few": "00M",
                        "many": "00M",
                        "one": "00M",
                        "other": "00M",
                        "two": "00M",
                        "zero": "00M"
                      },
                      "100000000": {
                        "few": "000M",
                        "many": "000M",
                        "one": "000M",
                        "other": "000M",
                        "two": "000M",
                        "zero": "000M"
                      },
                      "1000000000": {
                        "few": "0B",
                        "many": "0B",
                        "one": "0B",
                        "other": "0B",
                        "two": "0B",
                        "zero": "0B"
                      },
                      "10000000000": {
                        "few": "00B",
                        "many": "00B",
                        "one": "00B",
                        "other": "00B",
                        "two": "00B",
                        "zero": "00B"
                      },
                      "100000000000": {
                        "few": "000B",
                        "many": "000B",
                        "one": "000B",
                        "other": "000B",
                        "two": "000B",
                        "zero": "000B"
                      },
                      "1000000000000": {
                        "few": "0T",
                        "many": "0T",
                        "one": "0T",
                        "other": "0T",
                        "two": "0T",
                        "zero": "0T"
                      },
                      "10000000000000": {
                        "few": "00T",
                        "many": "00T",
                        "one": "00T",
                        "other": "00T",
                        "two": "00T",
                        "zero": "00T"
                      },
                      "100000000000000": {
                        "few": "000T",
                        "many": "000T",
                        "one": "000T",
                        "other": "000T",
                        "two": "000T",
                        "zero": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "x",
                "time_separator": ":"
              }
            }
          }
        },
        "da": {
          "da": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 tusind",
                        "other": "0 tusind"
                      },
                      "10000": {
                        "one": "00 tusind",
                        "other": "00 tusind"
                      },
                      "100000": {
                        "one": "000 tusind",
                        "other": "000 tusind"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 millioner"
                      },
                      "10000000": {
                        "one": "00 millioner",
                        "other": "00 millioner"
                      },
                      "100000000": {
                        "one": "000 millioner",
                        "other": "000 millioner"
                      },
                      "1000000000": {
                        "one": "0 milliard",
                        "other": "0 milliarder"
                      },
                      "10000000000": {
                        "one": "00 milliarder",
                        "other": "00 milliarder"
                      },
                      "100000000000": {
                        "one": "000 milliarder",
                        "other": "000 milliarder"
                      },
                      "1000000000000": {
                        "one": "0 billion",
                        "other": "0 billioner"
                      },
                      "10000000000000": {
                        "one": "00 billioner",
                        "other": "00 billioner"
                      },
                      "100000000000000": {
                        "one": "000 billioner",
                        "other": "000 billioner"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 td",
                        "other": "0 td"
                      },
                      "10000": {
                        "one": "00 td",
                        "other": "00 td"
                      },
                      "100000": {
                        "one": "000 td",
                        "other": "000 td"
                      },
                      "1000000": {
                        "one": "0 mio",
                        "other": "0 mio"
                      },
                      "10000000": {
                        "one": "00 mio",
                        "other": "00 mio"
                      },
                      "100000000": {
                        "one": "000 mio",
                        "other": "000 mio"
                      },
                      "1000000000": {
                        "one": "0 mia",
                        "other": "0 mia"
                      },
                      "10000000000": {
                        "one": "00 mia",
                        "other": "00 mia"
                      },
                      "100000000000": {
                        "one": "000 mia",
                        "other": "000 mia"
                      },
                      "1000000000000": {
                        "one": "0 bill",
                        "other": "0 bill"
                      },
                      "10000000000000": {
                        "one": "00 bill",
                        "other": "00 bill"
                      },
                      "100000000000000": {
                        "one": "000 bill",
                        "other": "000 bill"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": "."
              }
            }
          }
        },
        "de": {
          "de": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 Tausend",
                        "other": "0 Tausend"
                      },
                      "10000": {
                        "one": "00 Tausend",
                        "other": "00 Tausend"
                      },
                      "100000": {
                        "one": "000 Tausend",
                        "other": "000 Tausend"
                      },
                      "1000000": {
                        "one": "0 Million",
                        "other": "0 Millionen"
                      },
                      "10000000": {
                        "one": "00 Millionen",
                        "other": "00 Millionen"
                      },
                      "100000000": {
                        "one": "000 Millionen",
                        "other": "000 Millionen"
                      },
                      "1000000000": {
                        "one": "0 Milliarde",
                        "other": "0 Milliarden"
                      },
                      "10000000000": {
                        "one": "00 Milliarden",
                        "other": "00 Milliarden"
                      },
                      "100000000000": {
                        "one": "000 Milliarden",
                        "other": "000 Milliarden"
                      },
                      "1000000000000": {
                        "one": "0 Billion",
                        "other": "0 Billionen"
                      },
                      "10000000000000": {
                        "one": "00 Billionen",
                        "other": "00 Billionen"
                      },
                      "100000000000000": {
                        "one": "000 Billionen",
                        "other": "000 Billionen"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 Tsd'.'",
                        "other": "0 Tsd'.'"
                      },
                      "10000": {
                        "one": "00 Tsd'.'",
                        "other": "00 Tsd'.'"
                      },
                      "100000": {
                        "one": "000 Tsd'.'",
                        "other": "000 Tsd'.'"
                      },
                      "1000000": {
                        "one": "0 Mio",
                        "other": "0 Mio"
                      },
                      "10000000": {
                        "one": "00 Mio",
                        "other": "00 Mio"
                      },
                      "100000000": {
                        "one": "000 Mio",
                        "other": "000 Mio"
                      },
                      "1000000000": {
                        "one": "0 Mrd",
                        "other": "0 Mrd"
                      },
                      "10000000000": {
                        "one": "00 Mrd",
                        "other": "00 Mrd"
                      },
                      "100000000000": {
                        "one": "000 Mrd",
                        "other": "000 Mrd"
                      },
                      "1000000000000": {
                        "one": "0 Bio'.'",
                        "other": "0 Bio'.'"
                      },
                      "10000000000000": {
                        "one": "00 Bio'.'",
                        "other": "00 Bio'.'"
                      },
                      "100000000000000": {
                        "one": "000 Bio'.'",
                        "other": "000 Bio'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "·",
                "time_separator": ":"
              }
            }
          }
        },
        "de-CH": {
          "de-CH": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤ #,##0.00;¤-#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 Tausend",
                        "other": "0 Tausend"
                      },
                      "10000": {
                        "one": "00 Tausend",
                        "other": "00 Tausend"
                      },
                      "100000": {
                        "one": "000 Tausend",
                        "other": "000 Tausend"
                      },
                      "1000000": {
                        "one": "0 Million",
                        "other": "0 Millionen"
                      },
                      "10000000": {
                        "one": "00 Millionen",
                        "other": "00 Millionen"
                      },
                      "100000000": {
                        "one": "000 Millionen",
                        "other": "000 Millionen"
                      },
                      "1000000000": {
                        "one": "0 Milliarde",
                        "other": "0 Milliarden"
                      },
                      "10000000000": {
                        "one": "00 Milliarden",
                        "other": "00 Milliarden"
                      },
                      "100000000000": {
                        "one": "000 Milliarden",
                        "other": "000 Milliarden"
                      },
                      "1000000000000": {
                        "one": "0 Billion",
                        "other": "0 Billionen"
                      },
                      "10000000000000": {
                        "one": "00 Billionen",
                        "other": "00 Billionen"
                      },
                      "100000000000000": {
                        "one": "000 Billionen",
                        "other": "000 Billionen"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 Tsd'.'",
                        "other": "0 Tsd'.'"
                      },
                      "10000": {
                        "one": "00 Tsd'.'",
                        "other": "00 Tsd'.'"
                      },
                      "100000": {
                        "one": "000 Tsd'.'",
                        "other": "000 Tsd'.'"
                      },
                      "1000000": {
                        "one": "0 Mio",
                        "other": "0 Mio"
                      },
                      "10000000": {
                        "one": "00 Mio",
                        "other": "00 Mio"
                      },
                      "100000000": {
                        "one": "000 Mio",
                        "other": "000 Mio"
                      },
                      "1000000000": {
                        "one": "0 Mrd",
                        "other": "0 Mrd"
                      },
                      "10000000000": {
                        "one": "00 Mrd",
                        "other": "00 Mrd"
                      },
                      "100000000000": {
                        "one": "000 Mrd",
                        "other": "000 Mrd"
                      },
                      "1000000000000": {
                        "one": "0 Bio'.'",
                        "other": "0 Bio'.'"
                      },
                      "10000000000000": {
                        "one": "00 Bio'.'",
                        "other": "00 Bio'.'"
                      },
                      "100000000000000": {
                        "one": "000 Bio'.'",
                        "other": "000 Bio'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": "'",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "·",
                "time_separator": ":"
              }
            }
          }
        },
        "el": {
          "el": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 χιλιάδα",
                        "other": "0 χιλιάδες"
                      },
                      "10000": {
                        "one": "00 χιλιάδες",
                        "other": "00 χιλιάδες"
                      },
                      "100000": {
                        "one": "000 χιλιάδες",
                        "other": "000 χιλιάδες"
                      },
                      "1000000": {
                        "one": "0 εκατομμύριο",
                        "other": "0 εκατομμύρια"
                      },
                      "10000000": {
                        "one": "00 εκατομμύρια",
                        "other": "00 εκατομμύρια"
                      },
                      "100000000": {
                        "one": "000 εκατομμύρια",
                        "other": "000 εκατομμύρια"
                      },
                      "1000000000": {
                        "one": "0 δισεκατομμύριο",
                        "other": "0 δισεκατομμύρια"
                      },
                      "10000000000": {
                        "one": "00 δισεκατομμύρια",
                        "other": "00 δισεκατομμύρια"
                      },
                      "100000000000": {
                        "one": "000 δισεκατομμύρια",
                        "other": "000 δισεκατομμύρια"
                      },
                      "1000000000000": {
                        "one": "0 τρισεκατομμύριο",
                        "other": "0 τρισεκατομμύρια"
                      },
                      "10000000000000": {
                        "one": "00 τρισεκατομμύρια",
                        "other": "00 τρισεκατομμύρια"
                      },
                      "100000000000000": {
                        "one": "000 τρισεκατομμύρια",
                        "other": "000 τρισεκατομμύρια"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 χιλ'.'",
                        "other": "0 χιλ'.'"
                      },
                      "10000": {
                        "one": "00 χιλ'.'",
                        "other": "00 χιλ'.'"
                      },
                      "100000": {
                        "one": "000 χιλ'.'",
                        "other": "000 χιλ'.'"
                      },
                      "1000000": {
                        "one": "0 εκ'.'",
                        "other": "0 εκ'.'"
                      },
                      "10000000": {
                        "one": "00 εκ'.'",
                        "other": "00 εκ'.'"
                      },
                      "100000000": {
                        "one": "000 εκ'.'",
                        "other": "000 εκ'.'"
                      },
                      "1000000000": {
                        "one": "0 δισ'.'",
                        "other": "0 δισ'.'"
                      },
                      "10000000000": {
                        "one": "00 δισ'.'",
                        "other": "00 δισ'.'"
                      },
                      "100000000000": {
                        "one": "000 δισ'.'",
                        "other": "000 δισ'.'"
                      },
                      "1000000000000": {
                        "one": "0 τρισ'.'",
                        "other": "0 τρισ'.'"
                      },
                      "10000000000000": {
                        "one": "00 τρισ'.'",
                        "other": "00 τρισ'.'"
                      },
                      "100000000000000": {
                        "one": "000 τρισ'.'",
                        "other": "000 τρισ'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "e",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "en": {
          "en": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 thousand",
                        "other": "0 thousand"
                      },
                      "10000": {
                        "one": "00 thousand",
                        "other": "00 thousand"
                      },
                      "100000": {
                        "one": "000 thousand",
                        "other": "000 thousand"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 million"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 million"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 million"
                      },
                      "1000000000": {
                        "one": "0 billion",
                        "other": "0 billion"
                      },
                      "10000000000": {
                        "one": "00 billion",
                        "other": "00 billion"
                      },
                      "100000000000": {
                        "one": "000 billion",
                        "other": "000 billion"
                      },
                      "1000000000000": {
                        "one": "0 trillion",
                        "other": "0 trillion"
                      },
                      "10000000000000": {
                        "one": "00 trillion",
                        "other": "00 trillion"
                      },
                      "100000000000000": {
                        "one": "000 trillion",
                        "other": "000 trillion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "en-150": {
          "en-150": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 thousand",
                        "other": "0 thousand"
                      },
                      "10000": {
                        "one": "00 thousand",
                        "other": "00 thousand"
                      },
                      "100000": {
                        "one": "000 thousand",
                        "other": "000 thousand"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 million"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 million"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 million"
                      },
                      "1000000000": {
                        "one": "0 billion",
                        "other": "0 billion"
                      },
                      "10000000000": {
                        "one": "00 billion",
                        "other": "00 billion"
                      },
                      "100000000000": {
                        "one": "000 billion",
                        "other": "000 billion"
                      },
                      "1000000000000": {
                        "one": "0 trillion",
                        "other": "0 trillion"
                      },
                      "10000000000000": {
                        "one": "00 trillion",
                        "other": "00 trillion"
                      },
                      "100000000000000": {
                        "one": "000 trillion",
                        "other": "000 trillion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "en-AU": {
          "en-AU": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 thousand",
                        "other": "0 thousand"
                      },
                      "10000": {
                        "one": "00 thousand",
                        "other": "00 thousand"
                      },
                      "100000": {
                        "one": "000 thousand",
                        "other": "000 thousand"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 million"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 million"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 million"
                      },
                      "1000000000": {
                        "one": "0 billion",
                        "other": "0 billion"
                      },
                      "10000000000": {
                        "one": "00 billion",
                        "other": "00 billion"
                      },
                      "100000000000": {
                        "one": "000 billion",
                        "other": "000 billion"
                      },
                      "1000000000000": {
                        "one": "0 trillion",
                        "other": "0 trillion"
                      },
                      "10000000000000": {
                        "one": "00 trillion",
                        "other": "00 trillion"
                      },
                      "100000000000000": {
                        "one": "000 trillion",
                        "other": "000 trillion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "en-CA": {
          "en-CA": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 thousand",
                        "other": "0 thousand"
                      },
                      "10000": {
                        "one": "00 thousand",
                        "other": "00 thousand"
                      },
                      "100000": {
                        "one": "000 thousand",
                        "other": "000 thousand"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 million"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 million"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 million"
                      },
                      "1000000000": {
                        "one": "0 billion",
                        "other": "0 billion"
                      },
                      "10000000000": {
                        "one": "00 billion",
                        "other": "00 billion"
                      },
                      "100000000000": {
                        "one": "000 billion",
                        "other": "000 billion"
                      },
                      "1000000000000": {
                        "one": "0 trillion",
                        "other": "0 trillion"
                      },
                      "10000000000000": {
                        "one": "00 trillion",
                        "other": "00 trillion"
                      },
                      "100000000000000": {
                        "one": "000 trillion",
                        "other": "000 trillion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "en-GB": {
          "en-GB": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 thousand",
                        "other": "0 thousand"
                      },
                      "10000": {
                        "one": "00 thousand",
                        "other": "00 thousand"
                      },
                      "100000": {
                        "one": "000 thousand",
                        "other": "000 thousand"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 million"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 million"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 million"
                      },
                      "1000000000": {
                        "one": "0 billion",
                        "other": "0 billion"
                      },
                      "10000000000": {
                        "one": "00 billion",
                        "other": "00 billion"
                      },
                      "100000000000": {
                        "one": "000 billion",
                        "other": "000 billion"
                      },
                      "1000000000000": {
                        "one": "0 trillion",
                        "other": "0 trillion"
                      },
                      "10000000000000": {
                        "one": "00 trillion",
                        "other": "00 trillion"
                      },
                      "100000000000000": {
                        "one": "000 trillion",
                        "other": "000 trillion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "en-IE": {
          "en-IE": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 thousand",
                        "other": "0 thousand"
                      },
                      "10000": {
                        "one": "00 thousand",
                        "other": "00 thousand"
                      },
                      "100000": {
                        "one": "000 thousand",
                        "other": "000 thousand"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 million"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 million"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 million"
                      },
                      "1000000000": {
                        "one": "0 billion",
                        "other": "0 billion"
                      },
                      "10000000000": {
                        "one": "00 billion",
                        "other": "00 billion"
                      },
                      "100000000000": {
                        "one": "000 billion",
                        "other": "000 billion"
                      },
                      "1000000000000": {
                        "one": "0 trillion",
                        "other": "0 trillion"
                      },
                      "10000000000000": {
                        "one": "00 trillion",
                        "other": "00 trillion"
                      },
                      "100000000000000": {
                        "one": "000 trillion",
                        "other": "000 trillion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "en-SG": {
          "en-SG": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 thousand",
                        "other": "0 thousand"
                      },
                      "10000": {
                        "one": "00 thousand",
                        "other": "00 thousand"
                      },
                      "100000": {
                        "one": "000 thousand",
                        "other": "000 thousand"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 million"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 million"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 million"
                      },
                      "1000000000": {
                        "one": "0 billion",
                        "other": "0 billion"
                      },
                      "10000000000": {
                        "one": "00 billion",
                        "other": "00 billion"
                      },
                      "100000000000": {
                        "one": "000 billion",
                        "other": "000 billion"
                      },
                      "1000000000000": {
                        "one": "0 trillion",
                        "other": "0 trillion"
                      },
                      "10000000000000": {
                        "one": "00 trillion",
                        "other": "00 trillion"
                      },
                      "100000000000000": {
                        "one": "000 trillion",
                        "other": "000 trillion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "en-ZA": {
          "en-ZA": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 thousand",
                        "other": "0 thousand"
                      },
                      "10000": {
                        "one": "00 thousand",
                        "other": "00 thousand"
                      },
                      "100000": {
                        "one": "000 thousand",
                        "other": "000 thousand"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 million"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 million"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 million"
                      },
                      "1000000000": {
                        "one": "0 billion",
                        "other": "0 billion"
                      },
                      "10000000000": {
                        "one": "00 billion",
                        "other": "00 billion"
                      },
                      "100000000000": {
                        "one": "000 billion",
                        "other": "000 billion"
                      },
                      "1000000000000": {
                        "one": "0 trillion",
                        "other": "0 trillion"
                      },
                      "10000000000000": {
                        "one": "00 trillion",
                        "other": "00 trillion"
                      },
                      "100000000000000": {
                        "one": "000 trillion",
                        "other": "000 trillion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "es": {
          "es": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 mil",
                        "other": "0 mil"
                      },
                      "10000": {
                        "one": "00 mil",
                        "other": "00 mil"
                      },
                      "100000": {
                        "one": "000 mil",
                        "other": "000 mil"
                      },
                      "1000000": {
                        "one": "0 millón",
                        "other": "0 millones"
                      },
                      "10000000": {
                        "one": "00 millones",
                        "other": "00 millones"
                      },
                      "100000000": {
                        "one": "000 millones",
                        "other": "000 millones"
                      },
                      "1000000000": {
                        "one": "0 mil millones",
                        "other": "0 mil millones"
                      },
                      "10000000000": {
                        "one": "00 mil millones",
                        "other": "00 mil millones"
                      },
                      "100000000000": {
                        "one": "000 mil millones",
                        "other": "000 mil millones"
                      },
                      "1000000000000": {
                        "one": "0 billón",
                        "other": "0 billones"
                      },
                      "10000000000000": {
                        "one": "00 billones",
                        "other": "00 billones"
                      },
                      "100000000000000": {
                        "one": "000 billones",
                        "other": "000 billones"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0000M",
                        "other": "0000M"
                      },
                      "10000000000": {
                        "one": "00MRD",
                        "other": "00MRD"
                      },
                      "100000000000": {
                        "one": "000MRD",
                        "other": "000MRD"
                      },
                      "1000000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000000": {
                        "one": "000B",
                        "other": "000B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "es-419": {
          "es-419": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 mil",
                        "other": "0 mil"
                      },
                      "10000": {
                        "one": "00 mil",
                        "other": "00 mil"
                      },
                      "100000": {
                        "one": "000 mil",
                        "other": "000 mil"
                      },
                      "1000000": {
                        "one": "0 millón",
                        "other": "0 millones"
                      },
                      "10000000": {
                        "one": "00 millones",
                        "other": "00 millones"
                      },
                      "100000000": {
                        "one": "000 millones",
                        "other": "000 millones"
                      },
                      "1000000000": {
                        "one": "0 mil millones",
                        "other": "0 mil millones"
                      },
                      "10000000000": {
                        "one": "00 mil millones",
                        "other": "00 mil millones"
                      },
                      "100000000000": {
                        "one": "000 mil millones",
                        "other": "000 mil millones"
                      },
                      "1000000000000": {
                        "one": "0 billón",
                        "other": "0 billones"
                      },
                      "10000000000000": {
                        "one": "00 billones",
                        "other": "00 billones"
                      },
                      "100000000000000": {
                        "one": "000 billones",
                        "other": "000 billones"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": 0,
                        "other": 0
                      },
                      "10000": {
                        "one": "00k",
                        "other": "00k"
                      },
                      "100000": {
                        "one": "000k",
                        "other": "000k"
                      },
                      "1000000": {
                        "one": "0 M",
                        "other": "0 M"
                      },
                      "10000000": {
                        "one": "00 M",
                        "other": "00 M"
                      },
                      "100000000": {
                        "one": "000 M",
                        "other": "000 M"
                      },
                      "1000000000": {
                        "one": "0k M",
                        "other": "0k M"
                      },
                      "10000000000": {
                        "one": "00k M",
                        "other": "00k M"
                      },
                      "100000000000": {
                        "one": "000k M",
                        "other": "000k M"
                      },
                      "1000000000000": {
                        "one": "0 B",
                        "other": "0 B"
                      },
                      "10000000000000": {
                        "one": "00 B",
                        "other": "00 B"
                      },
                      "100000000000000": {
                        "one": "000 B",
                        "other": "000 B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "es-CO": {
          "es-CO": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 mil",
                        "other": "0 mil"
                      },
                      "10000": {
                        "one": "00 mil",
                        "other": "00 mil"
                      },
                      "100000": {
                        "one": "000 mil",
                        "other": "000 mil"
                      },
                      "1000000": {
                        "one": "0 millón",
                        "other": "0 millones"
                      },
                      "10000000": {
                        "one": "00 millones",
                        "other": "00 millones"
                      },
                      "100000000": {
                        "one": "000 millones",
                        "other": "000 millones"
                      },
                      "1000000000": {
                        "one": "0 mil millones",
                        "other": "0 mil millones"
                      },
                      "10000000000": {
                        "one": "00 mil millones",
                        "other": "00 mil millones"
                      },
                      "100000000000": {
                        "one": "000 mil millones",
                        "other": "000 mil millones"
                      },
                      "1000000000000": {
                        "one": "0 billón",
                        "other": "0 billones"
                      },
                      "10000000000000": {
                        "one": "00 billones",
                        "other": "00 billones"
                      },
                      "100000000000000": {
                        "one": "000 billones",
                        "other": "000 billones"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0000M",
                        "other": "0000M"
                      },
                      "10000000000": {
                        "one": "00MRD",
                        "other": "00MRD"
                      },
                      "100000000000": {
                        "one": "000MRD",
                        "other": "000MRD"
                      },
                      "1000000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000000": {
                        "one": "000B",
                        "other": "000B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "es-MX": {
          "es-MX": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 mil",
                        "other": "0 mil"
                      },
                      "10000": {
                        "one": "00 mil",
                        "other": "00 mil"
                      },
                      "100000": {
                        "one": "000 mil",
                        "other": "000 mil"
                      },
                      "1000000": {
                        "one": "0 millón",
                        "other": "0 millones"
                      },
                      "10000000": {
                        "one": "00 millones",
                        "other": "00 millones"
                      },
                      "100000000": {
                        "one": "000 millones",
                        "other": "000 millones"
                      },
                      "1000000000": {
                        "one": "0 mil millones",
                        "other": "0 mil millones"
                      },
                      "10000000000": {
                        "one": "00 mil millones",
                        "other": "00 mil millones"
                      },
                      "100000000000": {
                        "one": "000 mil millones",
                        "other": "000 mil millones"
                      },
                      "1000000000000": {
                        "one": "0 billón",
                        "other": "0 billones"
                      },
                      "10000000000000": {
                        "one": "00 billones",
                        "other": "00 billones"
                      },
                      "100000000000000": {
                        "one": "000 billones",
                        "other": "000 billones"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0k",
                        "other": "0k"
                      },
                      "10000": {
                        "one": "00k",
                        "other": "00k"
                      },
                      "100000": {
                        "one": "000k",
                        "other": "000k"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0000M",
                        "other": "0000M"
                      },
                      "10000000000": {
                        "one": "00MRD",
                        "other": "00MRD"
                      },
                      "100000000000": {
                        "one": "000MRD",
                        "other": "000MRD"
                      },
                      "1000000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000000": {
                        "one": "000B",
                        "other": "000B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "es-US": {
          "es-US": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 mil",
                        "other": "0 mil"
                      },
                      "10000": {
                        "one": "00 mil",
                        "other": "00 mil"
                      },
                      "100000": {
                        "one": "000 mil",
                        "other": "000 mil"
                      },
                      "1000000": {
                        "one": "0 millón",
                        "other": "0 millones"
                      },
                      "10000000": {
                        "one": "00 millones",
                        "other": "00 millones"
                      },
                      "100000000": {
                        "one": "000 millones",
                        "other": "000 millones"
                      },
                      "1000000000": {
                        "one": "0 mil millones",
                        "other": "0 mil millones"
                      },
                      "10000000000": {
                        "one": "00 mil millones",
                        "other": "00 mil millones"
                      },
                      "100000000000": {
                        "one": "000 mil millones",
                        "other": "000 mil millones"
                      },
                      "1000000000000": {
                        "one": "0 billón",
                        "other": "0 billones"
                      },
                      "10000000000000": {
                        "one": "00 billones",
                        "other": "00 billones"
                      },
                      "100000000000000": {
                        "one": "000 billones",
                        "other": "000 billones"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0000M",
                        "other": "0000M"
                      },
                      "10000000000": {
                        "one": "00MRD",
                        "other": "00MRD"
                      },
                      "100000000000": {
                        "one": "000MRD",
                        "other": "000MRD"
                      },
                      "1000000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000000": {
                        "one": "000B",
                        "other": "000B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "eu": {
          "eu": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0000",
                        "other": "0000"
                      },
                      "10000": {
                        "one": "00000",
                        "other": "00000"
                      },
                      "100000": {
                        "one": "000000",
                        "other": "000000"
                      },
                      "1000000": {
                        "one": "0 milioi",
                        "other": "0 milioi"
                      },
                      "10000000": {
                        "one": "00 milioi",
                        "other": "00 milioi"
                      },
                      "100000000": {
                        "one": "000 milioi",
                        "other": "000 milioi"
                      },
                      "1000000000": {
                        "one": "0000 milioi",
                        "other": "0000 milioi"
                      },
                      "10000000000": {
                        "one": "00000 milioi",
                        "other": "00000 milioi"
                      },
                      "100000000000": {
                        "one": "000000 milioi",
                        "other": "000000 milioi"
                      },
                      "1000000000000": {
                        "one": "0 bilioi",
                        "other": "0 bilioi"
                      },
                      "10000000000000": {
                        "one": "00 bilioi",
                        "other": "00 bilioi"
                      },
                      "100000000000000": {
                        "one": "000 bilioi",
                        "other": "000 bilioi"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0000",
                        "other": "0000"
                      },
                      "10000": {
                        "one": "00000",
                        "other": "00000"
                      },
                      "100000": {
                        "one": "000000",
                        "other": "000000"
                      },
                      "1000000": {
                        "one": "0 M",
                        "other": "0 M"
                      },
                      "10000000": {
                        "one": "00 M",
                        "other": "00 M"
                      },
                      "100000000": {
                        "one": "000 M",
                        "other": "000 M"
                      },
                      "1000000000": {
                        "one": "0000 M",
                        "other": "0000 M"
                      },
                      "10000000000": {
                        "one": "00000 M",
                        "other": "00000 M"
                      },
                      "100000000000": {
                        "one": "000000 M",
                        "other": "000000 M"
                      },
                      "1000000000000": {
                        "one": "0 B",
                        "other": "0 B"
                      },
                      "10000000000000": {
                        "one": "00 B",
                        "other": "00 B"
                      },
                      "100000000000000": {
                        "one": "000 B",
                        "other": "000 B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "% #,##0"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "fa": {
          "fa": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "‎¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "arabext",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 هزار",
                        "other": "0 هزار"
                      },
                      "10000": {
                        "one": "00 هزار",
                        "other": "00 هزار"
                      },
                      "100000": {
                        "one": "000 هزار",
                        "other": "000 هزار"
                      },
                      "1000000": {
                        "one": "0 میلیون",
                        "other": "0 میلیون"
                      },
                      "10000000": {
                        "one": "00 میلیون",
                        "other": "00 میلیون"
                      },
                      "100000000": {
                        "one": "000 میلیون",
                        "other": "000 میلیون"
                      },
                      "1000000000": {
                        "one": "0 میلیارد",
                        "other": "0 میلیارد"
                      },
                      "10000000000": {
                        "one": "00 میلیارد",
                        "other": "00 میلیارد"
                      },
                      "100000000000": {
                        "one": "000 میلیارد",
                        "other": "000 میلیارد"
                      },
                      "1000000000000": {
                        "one": "0 هزار میلیارد",
                        "other": "0 هزار میلیارد"
                      },
                      "10000000000000": {
                        "one": "00 هزار میلیارد",
                        "other": "00 هزار میلیارد"
                      },
                      "100000000000000": {
                        "one": "000 هزار میلیارد",
                        "other": "000 هزار میلیارد"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0G",
                        "other": "0G"
                      },
                      "10000000000": {
                        "one": "00G",
                        "other": "00G"
                      },
                      "100000000000": {
                        "one": "000G",
                        "other": "000G"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "arabext",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "arabext",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "‎−",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "‎+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "fi": {
          "fi": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 tuhat",
                        "other": "0 tuhatta"
                      },
                      "10000": {
                        "one": "00 tuhatta",
                        "other": "00 tuhatta"
                      },
                      "100000": {
                        "one": "000 tuhatta",
                        "other": "000 tuhatta"
                      },
                      "1000000": {
                        "one": "0 miljoona",
                        "other": "0 miljoonaa"
                      },
                      "10000000": {
                        "one": "00 miljoonaa",
                        "other": "00 miljoonaa"
                      },
                      "100000000": {
                        "one": "000 miljoonaa",
                        "other": "000 miljoonaa"
                      },
                      "1000000000": {
                        "one": "0 miljardi",
                        "other": "0 miljardia"
                      },
                      "10000000000": {
                        "one": "00 miljardia",
                        "other": "00 miljardia"
                      },
                      "100000000000": {
                        "one": "000 miljardia",
                        "other": "000 miljardia"
                      },
                      "1000000000000": {
                        "one": "0 biljoona",
                        "other": "0 biljoonaa"
                      },
                      "10000000000000": {
                        "one": "00 biljoonaa",
                        "other": "00 biljoonaa"
                      },
                      "100000000000000": {
                        "one": "000 biljoonaa",
                        "other": "000 biljoonaa"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 t'.'",
                        "other": "0 t'.'"
                      },
                      "10000": {
                        "one": "00 t'.'",
                        "other": "00 t'.'"
                      },
                      "100000": {
                        "one": "000 t'.'",
                        "other": "000 t'.'"
                      },
                      "1000000": {
                        "one": "0 milj'.'",
                        "other": "0 milj'.'"
                      },
                      "10000000": {
                        "one": "00 milj'.'",
                        "other": "00 milj'.'"
                      },
                      "100000000": {
                        "one": "000 milj'.'",
                        "other": "000 milj'.'"
                      },
                      "1000000000": {
                        "one": "0 mrd'.'",
                        "other": "0 mrd'.'"
                      },
                      "10000000000": {
                        "one": "00 mrd'.'",
                        "other": "00 mrd'.'"
                      },
                      "100000000000": {
                        "one": "000 mrd'.'",
                        "other": "000 mrd'.'"
                      },
                      "1000000000000": {
                        "one": "0 bilj'.'",
                        "other": "0 bilj'.'"
                      },
                      "10000000000000": {
                        "one": "00 bilj'.'",
                        "other": "00 bilj'.'"
                      },
                      "100000000000000": {
                        "one": "000 bilj'.'",
                        "other": "000 bilj'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "−",
                "nan": "epäluku",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": "."
              }
            }
          }
        },
        "fil": {
          "fil": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 libo",
                        "other": "0 libo"
                      },
                      "10000": {
                        "one": "00 libo",
                        "other": "00 libo"
                      },
                      "100000": {
                        "one": "000 libo",
                        "other": "000 libo"
                      },
                      "1000000": {
                        "one": "0 milyon",
                        "other": "0 milyon"
                      },
                      "10000000": {
                        "one": "00 milyon",
                        "other": "00 milyon"
                      },
                      "100000000": {
                        "one": "000 milyon",
                        "other": "000 milyon"
                      },
                      "1000000000": {
                        "one": "0 bilyon",
                        "other": "0 bilyon"
                      },
                      "10000000000": {
                        "one": "00 bilyon",
                        "other": "00 bilyon"
                      },
                      "100000000000": {
                        "one": "000 bilyon",
                        "other": "000 bilyon"
                      },
                      "1000000000000": {
                        "one": "0 trilyon",
                        "other": "0 trilyon"
                      },
                      "10000000000000": {
                        "one": "00 trilyon",
                        "other": "00 trilyon"
                      },
                      "100000000000000": {
                        "one": "000 trilyon",
                        "other": "000 trilyon"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0B",
                        "other": "0B"
                      },
                      "10000000000": {
                        "one": "00B",
                        "other": "00B"
                      },
                      "100000000000": {
                        "one": "000B",
                        "other": "000B"
                      },
                      "1000000000000": {
                        "one": "0T",
                        "other": "0T"
                      },
                      "10000000000000": {
                        "one": "00T",
                        "other": "00T"
                      },
                      "100000000000000": {
                        "one": "000T",
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "fr": {
          "fr": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 millier",
                        "other": "0 mille"
                      },
                      "10000": {
                        "one": "00 millier",
                        "other": "00 mille"
                      },
                      "100000": {
                        "one": "000 millier",
                        "other": "000 mille"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 millions"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 millions"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 millions"
                      },
                      "1000000000": {
                        "one": "0 milliard",
                        "other": "0 milliards"
                      },
                      "10000000000": {
                        "one": "00 milliard",
                        "other": "00 milliards"
                      },
                      "100000000000": {
                        "one": "000 milliards",
                        "other": "000 milliards"
                      },
                      "1000000000000": {
                        "one": "0 billion",
                        "other": "0 billions"
                      },
                      "10000000000000": {
                        "one": "00 billions",
                        "other": "00 billions"
                      },
                      "100000000000000": {
                        "one": "000 billions",
                        "other": "000 billions"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 k",
                        "other": "0 k"
                      },
                      "10000": {
                        "one": "00 k",
                        "other": "00 k"
                      },
                      "100000": {
                        "one": "000 k",
                        "other": "000 k"
                      },
                      "1000000": {
                        "one": "0 M",
                        "other": "0 M"
                      },
                      "10000000": {
                        "one": "00 M",
                        "other": "00 M"
                      },
                      "100000000": {
                        "one": "000 M",
                        "other": "000 M"
                      },
                      "1000000000": {
                        "one": "0 Md",
                        "other": "0 Md"
                      },
                      "10000000000": {
                        "one": "00 Md",
                        "other": "00 Md"
                      },
                      "100000000000": {
                        "one": "000 Md",
                        "other": "000 Md"
                      },
                      "1000000000000": {
                        "one": "0 Bn",
                        "other": "0 Bn"
                      },
                      "10000000000000": {
                        "one": "00 Bn",
                        "other": "00 Bn"
                      },
                      "100000000000000": {
                        "one": "000 Bn",
                        "other": "000 Bn"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "fr-BE": {
          "fr-BE": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 millier",
                        "other": "0 mille"
                      },
                      "10000": {
                        "one": "00 millier",
                        "other": "00 mille"
                      },
                      "100000": {
                        "one": "000 millier",
                        "other": "000 mille"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 millions"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 millions"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 millions"
                      },
                      "1000000000": {
                        "one": "0 milliard",
                        "other": "0 milliards"
                      },
                      "10000000000": {
                        "one": "00 milliard",
                        "other": "00 milliards"
                      },
                      "100000000000": {
                        "one": "000 milliards",
                        "other": "000 milliards"
                      },
                      "1000000000000": {
                        "one": "0 billion",
                        "other": "0 billions"
                      },
                      "10000000000000": {
                        "one": "00 billions",
                        "other": "00 billions"
                      },
                      "100000000000000": {
                        "one": "000 billions",
                        "other": "000 billions"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 k",
                        "other": "0 k"
                      },
                      "10000": {
                        "one": "00 k",
                        "other": "00 k"
                      },
                      "100000": {
                        "one": "000 k",
                        "other": "000 k"
                      },
                      "1000000": {
                        "one": "0 M",
                        "other": "0 M"
                      },
                      "10000000": {
                        "one": "00 M",
                        "other": "00 M"
                      },
                      "100000000": {
                        "one": "000 M",
                        "other": "000 M"
                      },
                      "1000000000": {
                        "one": "0 Md",
                        "other": "0 Md"
                      },
                      "10000000000": {
                        "one": "00 Md",
                        "other": "00 Md"
                      },
                      "100000000000": {
                        "one": "000 Md",
                        "other": "000 Md"
                      },
                      "1000000000000": {
                        "one": "0 Bn",
                        "other": "0 Bn"
                      },
                      "10000000000000": {
                        "one": "00 Bn",
                        "other": "00 Bn"
                      },
                      "100000000000000": {
                        "one": "000 Bn",
                        "other": "000 Bn"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "fr-CA": {
          "fr-CA": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 millier",
                        "other": "0 mille"
                      },
                      "10000": {
                        "one": "00 millier",
                        "other": "00 mille"
                      },
                      "100000": {
                        "one": "000 millier",
                        "other": "000 mille"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 millions"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 millions"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 millions"
                      },
                      "1000000000": {
                        "one": "0 milliard",
                        "other": "0 milliards"
                      },
                      "10000000000": {
                        "one": "00 milliard",
                        "other": "00 milliards"
                      },
                      "100000000000": {
                        "one": "000 milliards",
                        "other": "000 milliards"
                      },
                      "1000000000000": {
                        "one": "0 billion",
                        "other": "0 billions"
                      },
                      "10000000000000": {
                        "one": "00 billions",
                        "other": "00 billions"
                      },
                      "100000000000000": {
                        "one": "000 billions",
                        "other": "000 billions"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 k",
                        "other": "0 k"
                      },
                      "10000": {
                        "one": "00 k",
                        "other": "00 k"
                      },
                      "100000": {
                        "one": "000 k",
                        "other": "000 k"
                      },
                      "1000000": {
                        "one": "0 M",
                        "other": "0 M"
                      },
                      "10000000": {
                        "one": "00 M",
                        "other": "00 M"
                      },
                      "100000000": {
                        "one": "000 M",
                        "other": "000 M"
                      },
                      "1000000000": {
                        "one": "0 G",
                        "other": "0 G"
                      },
                      "10000000000": {
                        "one": "00 G",
                        "other": "00 G"
                      },
                      "100000000000": {
                        "one": "000 G",
                        "other": "000 G"
                      },
                      "1000000000000": {
                        "one": "0 T",
                        "other": "0 T"
                      },
                      "10000000000000": {
                        "one": "00 T",
                        "other": "00 T"
                      },
                      "100000000000000": {
                        "one": "000 T",
                        "other": "000 T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "fr-CH": {
          "fr-CH": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤ #,##0.00;¤-#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 millier",
                        "other": "0 mille"
                      },
                      "10000": {
                        "one": "00 millier",
                        "other": "00 mille"
                      },
                      "100000": {
                        "one": "000 millier",
                        "other": "000 mille"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 millions"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 millions"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 millions"
                      },
                      "1000000000": {
                        "one": "0 milliard",
                        "other": "0 milliards"
                      },
                      "10000000000": {
                        "one": "00 milliard",
                        "other": "00 milliards"
                      },
                      "100000000000": {
                        "one": "000 milliards",
                        "other": "000 milliards"
                      },
                      "1000000000000": {
                        "one": "0 billion",
                        "other": "0 billions"
                      },
                      "10000000000000": {
                        "one": "00 billions",
                        "other": "00 billions"
                      },
                      "100000000000000": {
                        "one": "000 billions",
                        "other": "000 billions"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 k",
                        "other": "0 k"
                      },
                      "10000": {
                        "one": "00 k",
                        "other": "00 k"
                      },
                      "100000": {
                        "one": "000 k",
                        "other": "000 k"
                      },
                      "1000000": {
                        "one": "0 M",
                        "other": "0 M"
                      },
                      "10000000": {
                        "one": "00 M",
                        "other": "00 M"
                      },
                      "100000000": {
                        "one": "000 M",
                        "other": "000 M"
                      },
                      "1000000000": {
                        "one": "0 Md",
                        "other": "0 Md"
                      },
                      "10000000000": {
                        "one": "00 Md",
                        "other": "00 Md"
                      },
                      "100000000000": {
                        "one": "000 Md",
                        "other": "000 Md"
                      },
                      "1000000000000": {
                        "one": "0 Bn",
                        "other": "0 Bn"
                      },
                      "10000000000000": {
                        "one": "00 Bn",
                        "other": "00 Bn"
                      },
                      "100000000000000": {
                        "one": "000 Bn",
                        "other": "000 Bn"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ga": {
          "ga": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}",
                    "two": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 mhíle",
                        "many": "0 míle",
                        "one": "0 mhíle",
                        "other": "0 míle",
                        "two": "0 mhíle"
                      },
                      "10000": {
                        "few": "00 míle",
                        "many": "00 míle",
                        "one": "00 míle",
                        "other": "00 míle",
                        "two": "00 míle"
                      },
                      "100000": {
                        "few": "000 míle",
                        "many": "000 míle",
                        "one": "000 míle",
                        "other": "000 míle",
                        "two": "000 míle"
                      },
                      "1000000": {
                        "few": "0 mhilliún",
                        "many": "0 milliún",
                        "one": "0 mhilliún",
                        "other": "0 milliún",
                        "two": "0 mhilliún"
                      },
                      "10000000": {
                        "few": "00 milliún",
                        "many": "00 milliún",
                        "one": "00 milliún",
                        "other": "00 milliún",
                        "two": "00 milliún"
                      },
                      "100000000": {
                        "few": "000 milliún",
                        "many": "000 milliún",
                        "one": "000 milliún",
                        "other": "000 milliún",
                        "two": "000 milliún"
                      },
                      "1000000000": {
                        "few": "0 bhilliún",
                        "many": "0 mbilliún",
                        "one": "0 bhilliún",
                        "other": "0 billiún",
                        "two": "0 bhilliún"
                      },
                      "10000000000": {
                        "few": "00 billiún",
                        "many": "00 mbilliún",
                        "one": "00 billiún",
                        "other": "00 billiún",
                        "two": "00 billiún"
                      },
                      "100000000000": {
                        "few": "000 billiún",
                        "many": "000 billiún",
                        "one": "000 billiún",
                        "other": "000 billiún",
                        "two": "000 billiún"
                      },
                      "1000000000000": {
                        "few": "0 thrilliún",
                        "many": "0 dtrilliún",
                        "one": "0 trilliún",
                        "other": "0 trilliún",
                        "two": "0 thrilliún"
                      },
                      "10000000000000": {
                        "few": "00 trilliún",
                        "many": "00 dtrilliún",
                        "one": "00 trilliún",
                        "other": "00 trilliún",
                        "two": "00 trilliún"
                      },
                      "100000000000000": {
                        "few": "000 trilliún",
                        "many": "000 trilliún",
                        "one": "000 trilliún",
                        "other": "000 trilliún",
                        "two": "000 trilliún"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0k",
                        "many": "0k",
                        "one": "0k",
                        "other": "0k",
                        "two": "0k"
                      },
                      "10000": {
                        "few": "00k",
                        "many": "00k",
                        "one": "00k",
                        "other": "00k",
                        "two": "00k"
                      },
                      "100000": {
                        "few": "000k",
                        "many": "000k",
                        "one": "000k",
                        "other": "000k",
                        "two": "000k"
                      },
                      "1000000": {
                        "few": "0M",
                        "many": "0M",
                        "one": "0M",
                        "other": "0M",
                        "two": "0M"
                      },
                      "10000000": {
                        "few": "00M",
                        "many": "00M",
                        "one": "00M",
                        "other": "00M",
                        "two": "00M"
                      },
                      "100000000": {
                        "few": "000M",
                        "many": "000M",
                        "one": "000M",
                        "other": "000M",
                        "two": "000M"
                      },
                      "1000000000": {
                        "few": "0B",
                        "many": "0B",
                        "one": "0B",
                        "other": "0B",
                        "two": "0B"
                      },
                      "10000000000": {
                        "few": "00B",
                        "many": "00B",
                        "one": "00B",
                        "other": "00B",
                        "two": "00B"
                      },
                      "100000000000": {
                        "few": "000B",
                        "many": "000B",
                        "one": "000B",
                        "other": "000B",
                        "two": "000B"
                      },
                      "1000000000000": {
                        "few": "0T",
                        "many": "0T",
                        "one": "0T",
                        "other": "0T",
                        "two": "0T"
                      },
                      "10000000000000": {
                        "few": "00T",
                        "many": "00T",
                        "one": "00T",
                        "other": "00T",
                        "two": "00T"
                      },
                      "100000000000000": {
                        "few": "000T",
                        "many": "000T",
                        "one": "000T",
                        "other": "000T",
                        "two": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "gl": {
          "gl": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 mil",
                        "other": "0 mil"
                      },
                      "10000": {
                        "one": "00 mil",
                        "other": "00 mil"
                      },
                      "100000": {
                        "one": "000 mil",
                        "other": "000 mil"
                      },
                      "1000000": {
                        "one": "0 millón",
                        "other": "0 millóns"
                      },
                      "10000000": {
                        "one": "00 millóns",
                        "other": "00 millóns"
                      },
                      "100000000": {
                        "one": "000 millóns",
                        "other": "000 millóns"
                      },
                      "1000000000": {
                        "one": "0 mil millóns",
                        "other": "0 mil millóns"
                      },
                      "10000000000": {
                        "one": "00 mil millóns",
                        "other": "00 mil millóns"
                      },
                      "100000000000": {
                        "one": "000 mil millóns",
                        "other": "000 mil millóns"
                      },
                      "1000000000000": {
                        "one": "0 billóns",
                        "other": "0 billóns"
                      },
                      "10000000000000": {
                        "one": "00 billóns",
                        "other": "00 billóns"
                      },
                      "100000000000000": {
                        "one": "000 billóns",
                        "other": "000 billóns"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0M",
                        "other": "0M"
                      },
                      "10000000": {
                        "one": "00M",
                        "other": "00M"
                      },
                      "100000000": {
                        "one": "000M",
                        "other": "000M"
                      },
                      "1000000000": {
                        "one": "0k M",
                        "other": "0k M"
                      },
                      "10000000000": {
                        "one": "00k M",
                        "other": "00k M"
                      },
                      "100000000000": {
                        "one": "000k M",
                        "other": "000k M"
                      },
                      "1000000000000": {
                        "one": "0 B",
                        "other": "0 B"
                      },
                      "10000000000000": {
                        "one": "00 B",
                        "other": "00 B"
                      },
                      "100000000000000": {
                        "one": "000 B",
                        "other": "000 B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "he": {
          "he": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}",
                    "two": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "many": "‏0 אלף",
                        "one": "‏0 אלף",
                        "other": "‏0 אלף",
                        "two": "‏0 אלף"
                      },
                      "10000": {
                        "many": "‏00 אלף",
                        "one": "‏00 אלף",
                        "other": "‏00 אלף",
                        "two": "‏00 אלף"
                      },
                      "100000": {
                        "many": "‏000 אלף",
                        "one": "‏000 אלף",
                        "other": "‏000 אלף",
                        "two": "‏000 אלף"
                      },
                      "1000000": {
                        "many": "‏0 מיליון",
                        "one": "‏0 מיליון",
                        "other": "‏0 מיליון",
                        "two": "‏0 מיליון"
                      },
                      "10000000": {
                        "many": "‏00 מיליון",
                        "one": "‏00 מיליון",
                        "other": "‏00 מיליון",
                        "two": "‏00 מיליון"
                      },
                      "100000000": {
                        "many": "‏000 מיליון",
                        "one": "‏000 מיליון",
                        "other": "‏000 מיליון",
                        "two": "‏000 מיליון"
                      },
                      "1000000000": {
                        "many": "‏0 מיליארד",
                        "one": "‏0 מיליארד",
                        "other": "‏0 מיליארד",
                        "two": "‏0 מיליארד"
                      },
                      "10000000000": {
                        "many": "‏00 מיליארד",
                        "one": "‏00 מיליארד",
                        "other": "‏00 מיליארד",
                        "two": "‏00 מיליארד"
                      },
                      "100000000000": {
                        "many": "‏000 מיליארד",
                        "one": "‏000 מיליארד",
                        "other": "‏000 מיליארד",
                        "two": "‏000 מיליארד"
                      },
                      "1000000000000": {
                        "many": "‏0 טריליון",
                        "one": "‏0 טריליון",
                        "other": "‏0 טריליון",
                        "two": "‏0 טריליון"
                      },
                      "10000000000000": {
                        "many": "‏00 טריליון",
                        "one": "‏00 טריליון",
                        "other": "‏00 טריליון",
                        "two": "‏00 טריליון"
                      },
                      "100000000000000": {
                        "many": "‏000 טריליון",
                        "one": "‏000 טריליון",
                        "other": "‏000 טריליון",
                        "two": "‏000 טריליון"
                      }
                    },
                    "short": {
                      "1000": {
                        "many": "‏0 אלף",
                        "one": "‏0 אלף",
                        "other": "‏0 אלף",
                        "two": "‏0 אלף"
                      },
                      "10000": {
                        "many": "‏00 אלף",
                        "one": "‏00 אלף",
                        "other": "‏00 אלף",
                        "two": "‏00 אלף"
                      },
                      "100000": {
                        "many": "‏000 אלף",
                        "one": "‏000 אלף",
                        "other": "‏000 אלף",
                        "two": "‏000 אלף"
                      },
                      "1000000": {
                        "many": "‏0 מיל׳",
                        "one": "‏0 מיל׳",
                        "other": "‏0 מיל׳",
                        "two": "‏0 מיל׳"
                      },
                      "10000000": {
                        "many": "‏00 מיל׳",
                        "one": "‏00 מיל׳",
                        "other": "‏00 מיל׳",
                        "two": "‏00 מיל׳"
                      },
                      "100000000": {
                        "many": "‏000 מיל׳",
                        "one": "‏000 מיל׳",
                        "other": "‏000 מיל׳",
                        "two": "‏000 מיל׳"
                      },
                      "1000000000": {
                        "many": "‏0 מלרד",
                        "one": "‏0 מלרד",
                        "other": "‏0 מלרד",
                        "two": "‏0 מלרד"
                      },
                      "10000000000": {
                        "many": "‏00 מלרד",
                        "one": "‏00 מלרד",
                        "other": "‏00 מלרד",
                        "two": "‏00 מלרד"
                      },
                      "100000000000": {
                        "many": "‏000 מלרד",
                        "one": "‏000 מלרד",
                        "other": "‏000 מלרד",
                        "two": "‏000 מלרד"
                      },
                      "1000000000000": {
                        "many": "‏0 ביל׳",
                        "one": "‏0 ביל׳",
                        "other": "‏0 ביל׳",
                        "two": "‏0 ביל׳"
                      },
                      "10000000000000": {
                        "many": "‏00 ביל׳",
                        "one": "‏00 ביל׳",
                        "other": "‏00 ביל׳",
                        "two": "‏00 ביל׳"
                      },
                      "100000000000000": {
                        "many": "‏000 ביל׳",
                        "one": "‏000 ביל׳",
                        "other": "‏000 ביל׳",
                        "two": "‏000 ביל׳"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "‎-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "‎+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "hi": {
          "hi": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 हज़ार",
                        "other": "0 हज़ार"
                      },
                      "10000": {
                        "one": "00 हज़ार",
                        "other": "00 हज़ार"
                      },
                      "100000": {
                        "one": "0 लाख",
                        "other": "0 लाख"
                      },
                      "1000000": {
                        "one": "00 लाख",
                        "other": "00 लाख"
                      },
                      "10000000": {
                        "one": "0 करोड़",
                        "other": "0 करोड़"
                      },
                      "100000000": {
                        "one": "00 करोड़",
                        "other": "00 करोड़"
                      },
                      "1000000000": {
                        "one": "0 अरब",
                        "other": "0 अरब"
                      },
                      "10000000000": {
                        "one": "00 अरब",
                        "other": "00 अरब"
                      },
                      "100000000000": {
                        "one": "0 खरब",
                        "other": "0 खरब"
                      },
                      "1000000000000": {
                        "one": "00 खरब",
                        "other": "00 खरब"
                      },
                      "10000000000000": {
                        "one": "000 खरब",
                        "other": "000 खरब"
                      },
                      "100000000000000": {
                        "one": "0000 खरब",
                        "other": "0000 खरब"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 हज़ार",
                        "other": "0 हज़ार"
                      },
                      "10000": {
                        "one": "00 हज़ार",
                        "other": "00 हज़ार"
                      },
                      "100000": {
                        "one": "0 लाख",
                        "other": "0 लाख"
                      },
                      "1000000": {
                        "one": "00 लाख",
                        "other": "00 लाख"
                      },
                      "10000000": {
                        "one": "0 क'.'",
                        "other": "0 क'.'"
                      },
                      "100000000": {
                        "one": "00 क'.'",
                        "other": "00 क'.'"
                      },
                      "1000000000": {
                        "one": "0 अ'.'",
                        "other": "0 अ'.'"
                      },
                      "10000000000": {
                        "one": "00 अ'.'",
                        "other": "00 अ'.'"
                      },
                      "100000000000": {
                        "one": "0 ख'.'",
                        "other": "0 ख'.'"
                      },
                      "1000000000000": {
                        "one": "00 ख'.'",
                        "other": "00 ख'.'"
                      },
                      "10000000000000": {
                        "one": "0 नील",
                        "other": "0 नील"
                      },
                      "100000000000000": {
                        "one": "00 नील",
                        "other": "00 नील"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "[#E0]"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "hr": {
          "hr": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 tisuće",
                        "one": "0 tisuća",
                        "other": "0 tisuća"
                      },
                      "10000": {
                        "few": "00 tisuće",
                        "one": "00 tisuća",
                        "other": "00 tisuća"
                      },
                      "100000": {
                        "few": "000 tisuće",
                        "one": "000 tisuća",
                        "other": "000 tisuća"
                      },
                      "1000000": {
                        "few": "0 milijuna",
                        "one": "0 milijun",
                        "other": "0 milijuna"
                      },
                      "10000000": {
                        "few": "00 milijuna",
                        "one": "00 milijun",
                        "other": "00 milijuna"
                      },
                      "100000000": {
                        "few": "000 milijuna",
                        "one": "000 milijun",
                        "other": "000 milijuna"
                      },
                      "1000000000": {
                        "few": "0 milijarde",
                        "one": "0 milijarda",
                        "other": "0 milijardi"
                      },
                      "10000000000": {
                        "few": "00 milijarde",
                        "one": "00 milijarda",
                        "other": "00 milijardi"
                      },
                      "100000000000": {
                        "few": "000 milijarde",
                        "one": "000 milijarda",
                        "other": "000 milijardi"
                      },
                      "1000000000000": {
                        "few": "0 bilijuna",
                        "one": "0 bilijun",
                        "other": "0 bilijuna"
                      },
                      "10000000000000": {
                        "few": "00 bilijuna",
                        "one": "00 bilijun",
                        "other": "00 bilijuna"
                      },
                      "100000000000000": {
                        "few": "000 bilijuna",
                        "one": "000 bilijun",
                        "other": "000 bilijuna"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 tis'.'",
                        "one": "0 tis'.'",
                        "other": "0 tis'.'"
                      },
                      "10000": {
                        "few": "00 tis'.'",
                        "one": "00 tis'.'",
                        "other": "00 tis'.'"
                      },
                      "100000": {
                        "few": "000 tis'.'",
                        "one": "000 tis'.'",
                        "other": "000 tis'.'"
                      },
                      "1000000": {
                        "few": "0 mil'.'",
                        "one": "0 mil'.'",
                        "other": "0 mil'.'"
                      },
                      "10000000": {
                        "few": "00 mil'.'",
                        "one": "00 mil'.'",
                        "other": "00 mil'.'"
                      },
                      "100000000": {
                        "few": "000 mil'.'",
                        "one": "000 mil'.'",
                        "other": "000 mil'.'"
                      },
                      "1000000000": {
                        "few": "0 mlr'.'",
                        "one": "0 mlr'.'",
                        "other": "0 mlr'.'"
                      },
                      "10000000000": {
                        "few": "00 mlr'.'",
                        "one": "00 mlr'.'",
                        "other": "00 mlr'.'"
                      },
                      "100000000000": {
                        "few": "000 mlr'.'",
                        "one": "000 mlr'.'",
                        "other": "000 mlr'.'"
                      },
                      "1000000000000": {
                        "few": "0 bil'.'",
                        "one": "0 bil'.'",
                        "other": "0 bil'.'"
                      },
                      "10000000000000": {
                        "few": "00 bil'.'",
                        "one": "00 bil'.'",
                        "other": "00 bil'.'"
                      },
                      "100000000000000": {
                        "few": "000 bil'.'",
                        "one": "000 bil'.'",
                        "other": "000 bil'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "hu": {
          "hu": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 ezer",
                        "other": "0 ezer"
                      },
                      "10000": {
                        "one": "00 ezer",
                        "other": "00 ezer"
                      },
                      "100000": {
                        "one": "000 ezer",
                        "other": "000 ezer"
                      },
                      "1000000": {
                        "one": "0 millió",
                        "other": "0 millió"
                      },
                      "10000000": {
                        "one": "00 millió",
                        "other": "00 millió"
                      },
                      "100000000": {
                        "one": "000 millió",
                        "other": "000 millió"
                      },
                      "1000000000": {
                        "one": "0 milliárd",
                        "other": "0 milliárd"
                      },
                      "10000000000": {
                        "one": "00 milliárd",
                        "other": "00 milliárd"
                      },
                      "100000000000": {
                        "one": "000 milliárd",
                        "other": "000 milliárd"
                      },
                      "1000000000000": {
                        "one": "0 billió",
                        "other": "0 billió"
                      },
                      "10000000000000": {
                        "one": "00 billió",
                        "other": "00 billió"
                      },
                      "100000000000000": {
                        "one": "000 billió",
                        "other": "000 billió"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 E",
                        "other": "0 E"
                      },
                      "10000": {
                        "one": "00 E",
                        "other": "00 E"
                      },
                      "100000": {
                        "one": "000 E",
                        "other": "000 E"
                      },
                      "1000000": {
                        "one": "0 M",
                        "other": "0 M"
                      },
                      "10000000": {
                        "one": "00 M",
                        "other": "00 M"
                      },
                      "100000000": {
                        "one": "000 M",
                        "other": "000 M"
                      },
                      "1000000000": {
                        "one": "0 Mrd",
                        "other": "0 Mrd"
                      },
                      "10000000000": {
                        "one": "00 Mrd",
                        "other": "00 Mrd"
                      },
                      "100000000000": {
                        "one": "000 Mrd",
                        "other": "000 Mrd"
                      },
                      "1000000000000": {
                        "one": "0 B",
                        "other": "0 B"
                      },
                      "10000000000000": {
                        "one": "00 B",
                        "other": "00 B"
                      },
                      "100000000000000": {
                        "one": "000 B",
                        "other": "000 B"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "id": {
          "id": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "other": "0 ribu"
                      },
                      "10000": {
                        "other": "00 ribu"
                      },
                      "100000": {
                        "other": "000 ribu"
                      },
                      "1000000": {
                        "other": "0 juta"
                      },
                      "10000000": {
                        "other": "00 juta"
                      },
                      "100000000": {
                        "other": "000 juta"
                      },
                      "1000000000": {
                        "other": "0 miliar"
                      },
                      "10000000000": {
                        "other": "00 miliar"
                      },
                      "100000000000": {
                        "other": "000 miliar"
                      },
                      "1000000000000": {
                        "other": "0 triliun"
                      },
                      "10000000000000": {
                        "other": "00 triliun"
                      },
                      "100000000000000": {
                        "other": "000 triliun"
                      }
                    },
                    "short": {
                      "1000": {
                        "other": 0
                      },
                      "10000": {
                        "other": "00 rb"
                      },
                      "100000": {
                        "other": "000 rb"
                      },
                      "1000000": {
                        "other": "0 jt"
                      },
                      "10000000": {
                        "other": "00 jt"
                      },
                      "100000000": {
                        "other": "000 jt"
                      },
                      "1000000000": {
                        "other": "0 M"
                      },
                      "10000000000": {
                        "other": "00 M"
                      },
                      "100000000000": {
                        "other": "000 M"
                      },
                      "1000000000000": {
                        "other": "0 T"
                      },
                      "10000000000000": {
                        "other": "00 T"
                      },
                      "100000000000000": {
                        "other": "000 T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": "."
              }
            }
          }
        },
        "is": {
          "is": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 þúsund",
                        "other": "0 þúsund"
                      },
                      "10000": {
                        "one": "00 þúsund",
                        "other": "00 þúsund"
                      },
                      "100000": {
                        "one": "000 þúsund",
                        "other": "000 þúsund"
                      },
                      "1000000": {
                        "one": "0 milljón",
                        "other": "0 milljónir"
                      },
                      "10000000": {
                        "one": "00 milljón",
                        "other": "00 milljónir"
                      },
                      "100000000": {
                        "one": "000 milljón",
                        "other": "000 milljónir"
                      },
                      "1000000000": {
                        "one": "0 milljarður",
                        "other": "0 milljarðar"
                      },
                      "10000000000": {
                        "one": "00 milljarður",
                        "other": "00 milljarðar"
                      },
                      "100000000000": {
                        "one": "000 milljarður",
                        "other": "000 milljarðar"
                      },
                      "1000000000000": {
                        "one": "0 billjón",
                        "other": "0 billjónir"
                      },
                      "10000000000000": {
                        "one": "00 billjón",
                        "other": "00 billjónir"
                      },
                      "100000000000000": {
                        "one": "000 billjón",
                        "other": "000 billjónir"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 þ'.'",
                        "other": "0 þ'.'"
                      },
                      "10000": {
                        "one": "00 þ'.'",
                        "other": "00 þ'.'"
                      },
                      "100000": {
                        "one": "000 þ'.'",
                        "other": "000 þ'.'"
                      },
                      "1000000": {
                        "one": "0 m'.'",
                        "other": "0 m'.'"
                      },
                      "10000000": {
                        "one": "00 m'.'",
                        "other": "00 m'.'"
                      },
                      "100000000": {
                        "one": "000 m'.'",
                        "other": "000 m'.'"
                      },
                      "1000000000": {
                        "one": "0 ma'.'",
                        "other": "0 ma'.'"
                      },
                      "10000000000": {
                        "one": "00 ma'.'",
                        "other": "00 ma'.'"
                      },
                      "100000000000": {
                        "one": "000 ma'.'",
                        "other": "000 ma'.'"
                      },
                      "1000000000000": {
                        "one": "0 bn",
                        "other": "0 bn"
                      },
                      "10000000000000": {
                        "one": "00 bn",
                        "other": "00 bn"
                      },
                      "100000000000000": {
                        "one": "000 bn",
                        "other": "000 bn"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "it": {
          "it": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 migliaio",
                        "other": "0 migliaia"
                      },
                      "10000": {
                        "one": "00 migliaia",
                        "other": "00 migliaia"
                      },
                      "100000": {
                        "one": "000 migliaia",
                        "other": "000 migliaia"
                      },
                      "1000000": {
                        "one": "0 milione",
                        "other": "0 milioni"
                      },
                      "10000000": {
                        "one": "00 milioni",
                        "other": "00 milioni"
                      },
                      "100000000": {
                        "one": "000 milioni",
                        "other": "000 milioni"
                      },
                      "1000000000": {
                        "one": "0 miliardo",
                        "other": "0 miliardi"
                      },
                      "10000000000": {
                        "one": "00 miliardi",
                        "other": "00 miliardi"
                      },
                      "100000000000": {
                        "one": "000 miliardi",
                        "other": "000 miliardi"
                      },
                      "1000000000000": {
                        "one": "0 migliaio di miliardi",
                        "other": "0 migliaia di miliardi"
                      },
                      "10000000000000": {
                        "one": "00 migliaia di miliardi",
                        "other": "00 migliaia di miliardi"
                      },
                      "100000000000000": {
                        "one": "000 migliaia di miliardi",
                        "other": "000 migliaia di miliardi"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": 0,
                        "other": 0
                      },
                      "10000": {
                        "one": 0,
                        "other": 0
                      },
                      "100000": {
                        "one": 0,
                        "other": 0
                      },
                      "1000000": {
                        "one": "0 Mln",
                        "other": "0 Mln"
                      },
                      "10000000": {
                        "one": "00 Mln",
                        "other": "00 Mln"
                      },
                      "100000000": {
                        "one": "000 Mln",
                        "other": "000 Mln"
                      },
                      "1000000000": {
                        "one": "0 Mld",
                        "other": "0 Mld"
                      },
                      "10000000000": {
                        "one": "00 Mld",
                        "other": "00 Mld"
                      },
                      "100000000000": {
                        "one": "000 Mld",
                        "other": "000 Mld"
                      },
                      "1000000000000": {
                        "one": "0 Bln",
                        "other": "0 Bln"
                      },
                      "10000000000000": {
                        "one": "00 Bln",
                        "other": "00 Bln"
                      },
                      "100000000000000": {
                        "one": "000 Bln",
                        "other": "000 Bln"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "it-CH": {
          "it-CH": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤ #,##0.00;¤-#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 migliaio",
                        "other": "0 migliaia"
                      },
                      "10000": {
                        "one": "00 migliaia",
                        "other": "00 migliaia"
                      },
                      "100000": {
                        "one": "000 migliaia",
                        "other": "000 migliaia"
                      },
                      "1000000": {
                        "one": "0 milione",
                        "other": "0 milioni"
                      },
                      "10000000": {
                        "one": "00 milioni",
                        "other": "00 milioni"
                      },
                      "100000000": {
                        "one": "000 milioni",
                        "other": "000 milioni"
                      },
                      "1000000000": {
                        "one": "0 miliardo",
                        "other": "0 miliardi"
                      },
                      "10000000000": {
                        "one": "00 miliardi",
                        "other": "00 miliardi"
                      },
                      "100000000000": {
                        "one": "000 miliardi",
                        "other": "000 miliardi"
                      },
                      "1000000000000": {
                        "one": "0 migliaio di miliardi",
                        "other": "0 migliaia di miliardi"
                      },
                      "10000000000000": {
                        "one": "00 migliaia di miliardi",
                        "other": "00 migliaia di miliardi"
                      },
                      "100000000000000": {
                        "one": "000 migliaia di miliardi",
                        "other": "000 migliaia di miliardi"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": 0,
                        "other": 0
                      },
                      "10000": {
                        "one": 0,
                        "other": 0
                      },
                      "100000": {
                        "one": 0,
                        "other": 0
                      },
                      "1000000": {
                        "one": "0 Mln",
                        "other": "0 Mln"
                      },
                      "10000000": {
                        "one": "00 Mln",
                        "other": "00 Mln"
                      },
                      "100000000": {
                        "one": "000 Mln",
                        "other": "000 Mln"
                      },
                      "1000000000": {
                        "one": "0 Mld",
                        "other": "0 Mld"
                      },
                      "10000000000": {
                        "one": "00 Mld",
                        "other": "00 Mld"
                      },
                      "100000000000": {
                        "one": "000 Mld",
                        "other": "000 Mld"
                      },
                      "1000000000000": {
                        "one": "0 Bln",
                        "other": "0 Bln"
                      },
                      "10000000000000": {
                        "one": "00 Bln",
                        "other": "00 Bln"
                      },
                      "100000000000000": {
                        "one": "000 Bln",
                        "other": "000 Bln"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": "'",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ja": {
          "ja": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "other": "0千"
                      },
                      "10000": {
                        "other": "0万"
                      },
                      "100000": {
                        "other": "00万"
                      },
                      "1000000": {
                        "other": "000万"
                      },
                      "10000000": {
                        "other": "0000万"
                      },
                      "100000000": {
                        "other": "0億"
                      },
                      "1000000000": {
                        "other": "00億"
                      },
                      "10000000000": {
                        "other": "000億"
                      },
                      "100000000000": {
                        "other": "0000億"
                      },
                      "1000000000000": {
                        "other": "0兆"
                      },
                      "10000000000000": {
                        "other": "00兆"
                      },
                      "100000000000000": {
                        "other": "000兆"
                      }
                    },
                    "short": {
                      "1000": {
                        "other": "0千"
                      },
                      "10000": {
                        "other": "0万"
                      },
                      "100000": {
                        "other": "00万"
                      },
                      "1000000": {
                        "other": "000万"
                      },
                      "10000000": {
                        "other": "0000万"
                      },
                      "100000000": {
                        "other": "0億"
                      },
                      "1000000000": {
                        "other": "00億"
                      },
                      "10000000000": {
                        "other": "000億"
                      },
                      "100000000000": {
                        "other": "0000億"
                      },
                      "1000000000000": {
                        "other": "0兆"
                      },
                      "10000000000000": {
                        "other": "00兆"
                      },
                      "100000000000000": {
                        "other": "000兆"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ko": {
          "ko": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "other": "0000"
                      },
                      "10000": {
                        "other": "0만"
                      },
                      "100000": {
                        "other": "00만"
                      },
                      "1000000": {
                        "other": "000만"
                      },
                      "10000000": {
                        "other": "0000만"
                      },
                      "100000000": {
                        "other": "0억"
                      },
                      "1000000000": {
                        "other": "00억"
                      },
                      "10000000000": {
                        "other": "000억"
                      },
                      "100000000000": {
                        "other": "0000억"
                      },
                      "1000000000000": {
                        "other": "0조"
                      },
                      "10000000000000": {
                        "other": "00조"
                      },
                      "100000000000000": {
                        "other": "000조"
                      }
                    },
                    "short": {
                      "1000": {
                        "other": "0000"
                      },
                      "10000": {
                        "other": "0만"
                      },
                      "100000": {
                        "other": "00만"
                      },
                      "1000000": {
                        "other": "000만"
                      },
                      "10000000": {
                        "other": "0000만"
                      },
                      "100000000": {
                        "other": "0억"
                      },
                      "1000000000": {
                        "other": "00억"
                      },
                      "10000000000": {
                        "other": "000억"
                      },
                      "100000000000": {
                        "other": "0000억"
                      },
                      "1000000000000": {
                        "other": "0조"
                      },
                      "10000000000000": {
                        "other": "00조"
                      },
                      "100000000000000": {
                        "other": "000조"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "lv": {
          "lv": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}",
                    "zero": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 tūkstotis",
                        "other": "0 tūkstoši",
                        "zero": "0 tūkstoši"
                      },
                      "10000": {
                        "one": "00 tūkstotis",
                        "other": "00 tūkstoši",
                        "zero": "00 tūkstoši"
                      },
                      "100000": {
                        "one": "000 tūkstotis",
                        "other": "000 tūkstoši",
                        "zero": "000 tūkstoši"
                      },
                      "1000000": {
                        "one": "0 miljons",
                        "other": "0 miljoni",
                        "zero": "0 miljoni"
                      },
                      "10000000": {
                        "one": "00 miljons",
                        "other": "00 miljoni",
                        "zero": "00 miljoni"
                      },
                      "100000000": {
                        "one": "000 miljons",
                        "other": "000 miljoni",
                        "zero": "000 miljoni"
                      },
                      "1000000000": {
                        "one": "0 miljards",
                        "other": "0 miljardi",
                        "zero": "0 miljardi"
                      },
                      "10000000000": {
                        "one": "00 miljards",
                        "other": "00 miljardi",
                        "zero": "00 miljardi"
                      },
                      "100000000000": {
                        "one": "000 miljards",
                        "other": "000 miljardi",
                        "zero": "000 miljardi"
                      },
                      "1000000000000": {
                        "one": "0 triljons",
                        "other": "0 triljoni",
                        "zero": "0 triljoni"
                      },
                      "10000000000000": {
                        "one": "00 triljons",
                        "other": "00 triljoni",
                        "zero": "00 triljoni"
                      },
                      "100000000000000": {
                        "one": "000 triljons",
                        "other": "000 triljoni",
                        "zero": "000 triljoni"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 tūkst'.'",
                        "other": "0 tūkst'.'",
                        "zero": "0 tūkst'.'"
                      },
                      "10000": {
                        "one": "00 tūkst'.'",
                        "other": "00 tūkst'.'",
                        "zero": "00 tūkst'.'"
                      },
                      "100000": {
                        "one": "000 tūkst'.'",
                        "other": "000 tūkst'.'",
                        "zero": "000 tūkst'.'"
                      },
                      "1000000": {
                        "one": "0 milj'.'",
                        "other": "0 milj'.'",
                        "zero": "0 milj'.'"
                      },
                      "10000000": {
                        "one": "00 milj'.'",
                        "other": "00 milj'.'",
                        "zero": "00 milj'.'"
                      },
                      "100000000": {
                        "one": "000 milj'.'",
                        "other": "000 milj'.'",
                        "zero": "000 milj'.'"
                      },
                      "1000000000": {
                        "one": "0 mljrd'.'",
                        "other": "0 mljrd'.'",
                        "zero": "0 mljrd'.'"
                      },
                      "10000000000": {
                        "one": "00 mljrd'.'",
                        "other": "00 mljrd'.'",
                        "zero": "00 mljrd'.'"
                      },
                      "100000000000": {
                        "one": "000 mljrd'.'",
                        "other": "000 mljrd'.'",
                        "zero": "000 mljrd'.'"
                      },
                      "1000000000000": {
                        "one": "0 trilj'.'",
                        "other": "0 trilj'.'",
                        "zero": "0 trilj'.'"
                      },
                      "10000000000000": {
                        "one": "00 trilj'.'",
                        "other": "00 trilj'.'",
                        "zero": "00 trilj'.'"
                      },
                      "100000000000000": {
                        "one": "000 trilj'.'",
                        "other": "000 trilj'.'",
                        "zero": "000 trilj'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "nav skaitlis",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ms": {
          "ms": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "other": "0 ribu"
                      },
                      "10000": {
                        "other": "00 ribu"
                      },
                      "100000": {
                        "other": "000 ribu"
                      },
                      "1000000": {
                        "other": "0 juta"
                      },
                      "10000000": {
                        "other": "00 juta"
                      },
                      "100000000": {
                        "other": "000 juta"
                      },
                      "1000000000": {
                        "other": "0 bilion"
                      },
                      "10000000000": {
                        "other": "00 bilion"
                      },
                      "100000000000": {
                        "other": "000 bilion"
                      },
                      "1000000000000": {
                        "other": "0 trilion"
                      },
                      "10000000000000": {
                        "other": "00 trilion"
                      },
                      "100000000000000": {
                        "other": "000 trilion"
                      }
                    },
                    "short": {
                      "1000": {
                        "other": "0K"
                      },
                      "10000": {
                        "other": "00K"
                      },
                      "100000": {
                        "other": "000K"
                      },
                      "1000000": {
                        "other": "0J"
                      },
                      "10000000": {
                        "other": "00J"
                      },
                      "100000000": {
                        "other": "000J"
                      },
                      "1000000000": {
                        "other": "0B"
                      },
                      "10000000000": {
                        "other": "00B"
                      },
                      "100000000000": {
                        "other": "000B"
                      },
                      "1000000000000": {
                        "other": "0T"
                      },
                      "10000000000000": {
                        "other": "00T"
                      },
                      "100000000000000": {
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "nb": {
          "nb": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤ #,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 tusen",
                        "other": "0 tusen"
                      },
                      "10000": {
                        "one": "00 tusen",
                        "other": "00 tusen"
                      },
                      "100000": {
                        "one": "000 tusen",
                        "other": "000 tusen"
                      },
                      "1000000": {
                        "one": "0 million",
                        "other": "0 millioner"
                      },
                      "10000000": {
                        "one": "00 million",
                        "other": "00 millioner"
                      },
                      "100000000": {
                        "one": "000 million",
                        "other": "000 millioner"
                      },
                      "1000000000": {
                        "one": "0 milliard",
                        "other": "0 milliarder"
                      },
                      "10000000000": {
                        "one": "00 milliard",
                        "other": "00 milliarder"
                      },
                      "100000000000": {
                        "one": "000 milliard",
                        "other": "000 milliarder"
                      },
                      "1000000000000": {
                        "one": "0 billion",
                        "other": "0 billioner"
                      },
                      "10000000000000": {
                        "one": "00 billioner",
                        "other": "00 billioner"
                      },
                      "100000000000000": {
                        "one": "000 billioner",
                        "other": "000 billioner"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 K",
                        "other": "0 K"
                      },
                      "10000": {
                        "one": "00 K",
                        "other": "00 K"
                      },
                      "100000": {
                        "one": "000 K",
                        "other": "000 K"
                      },
                      "1000000": {
                        "one": "0 mill",
                        "other": "0 mill"
                      },
                      "10000000": {
                        "one": "00 mill",
                        "other": "00 mill"
                      },
                      "100000000": {
                        "one": "000 mill",
                        "other": "000 mill"
                      },
                      "1000000000": {
                        "one": "0 mrd",
                        "other": "0 mrd"
                      },
                      "10000000000": {
                        "one": "00 mrd",
                        "other": "00 mrd"
                      },
                      "100000000000": {
                        "one": "000 mrd",
                        "other": "000 mrd"
                      },
                      "1000000000000": {
                        "one": "0 bill",
                        "other": "0 bill"
                      },
                      "10000000000000": {
                        "one": "00 bill",
                        "other": "00 bill"
                      },
                      "100000000000000": {
                        "one": "000 bill",
                        "other": "000 bill"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "−",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": "."
              }
            }
          }
        },
        "nl": {
          "nl": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤ #,##0.00;¤ #,##0.00-"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 duizend",
                        "other": "0 duizend"
                      },
                      "10000": {
                        "one": "00 duizend",
                        "other": "00 duizend"
                      },
                      "100000": {
                        "one": "000 duizend",
                        "other": "000 duizend"
                      },
                      "1000000": {
                        "one": "0 miljoen",
                        "other": "0 miljoen"
                      },
                      "10000000": {
                        "one": "00 miljoen",
                        "other": "00 miljoen"
                      },
                      "100000000": {
                        "one": "000 miljoen",
                        "other": "000 miljoen"
                      },
                      "1000000000": {
                        "one": "0 miljard",
                        "other": "0 miljard"
                      },
                      "10000000000": {
                        "one": "00 miljard",
                        "other": "00 miljard"
                      },
                      "100000000000": {
                        "one": "000 miljard",
                        "other": "000 miljard"
                      },
                      "1000000000000": {
                        "one": "0 biljoen",
                        "other": "0 biljoen"
                      },
                      "10000000000000": {
                        "one": "00 biljoen",
                        "other": "00 biljoen"
                      },
                      "100000000000000": {
                        "one": "000 biljoen",
                        "other": "000 biljoen"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0K",
                        "other": "0K"
                      },
                      "10000": {
                        "one": "00K",
                        "other": "00K"
                      },
                      "100000": {
                        "one": "000K",
                        "other": "000K"
                      },
                      "1000000": {
                        "one": "0 mln'.'",
                        "other": "0 mln'.'"
                      },
                      "10000000": {
                        "one": "00 mln'.'",
                        "other": "00 mln'.'"
                      },
                      "100000000": {
                        "one": "000 mln'.'",
                        "other": "000 mln'.'"
                      },
                      "1000000000": {
                        "one": "0 mld'.'",
                        "other": "0 mld'.'"
                      },
                      "10000000000": {
                        "one": "00 mld'.'",
                        "other": "00 mld'.'"
                      },
                      "100000000000": {
                        "one": "000 mld'.'",
                        "other": "000 mld'.'"
                      },
                      "1000000000000": {
                        "one": "0 bln'.'",
                        "other": "0 bln'.'"
                      },
                      "10000000000000": {
                        "one": "00 bln'.'",
                        "other": "00 bln'.'"
                      },
                      "100000000000000": {
                        "one": "000 bln'.'",
                        "other": "000 bln'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "pl": {
          "pl": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 tysiące",
                        "many": "0 tysięcy",
                        "one": "0 tysiąc",
                        "other": "0 tysiąca"
                      },
                      "10000": {
                        "few": "00 tysiące",
                        "many": "00 tysięcy",
                        "one": "00 tysiąc",
                        "other": "00 tysiąca"
                      },
                      "100000": {
                        "few": "000 tysiące",
                        "many": "000 tysięcy",
                        "one": "000 tysiąc",
                        "other": "000 tysiąca"
                      },
                      "1000000": {
                        "few": "0 miliony",
                        "many": "0 milionów",
                        "one": "0 milion",
                        "other": "0 miliona"
                      },
                      "10000000": {
                        "few": "00 miliony",
                        "many": "00 milionów",
                        "one": "00 milion",
                        "other": "00 miliona"
                      },
                      "100000000": {
                        "few": "000 miliony",
                        "many": "000 milionów",
                        "one": "000 milion",
                        "other": "000 miliona"
                      },
                      "1000000000": {
                        "few": "0 miliardy",
                        "many": "0 miliardów",
                        "one": "0 miliard",
                        "other": "0 miliarda"
                      },
                      "10000000000": {
                        "few": "00 miliardy",
                        "many": "00 miliardów",
                        "one": "00 miliard",
                        "other": "00 miliarda"
                      },
                      "100000000000": {
                        "few": "000 miliardy",
                        "many": "000 miliardów",
                        "one": "000 miliard",
                        "other": "000 miliarda"
                      },
                      "1000000000000": {
                        "few": "0 biliony",
                        "many": "0 bilionów",
                        "one": "0 bilion",
                        "other": "0 biliona"
                      },
                      "10000000000000": {
                        "few": "00 biliony",
                        "many": "00 bilionów",
                        "one": "00 bilion",
                        "other": "00 biliona"
                      },
                      "100000000000000": {
                        "few": "000 biliony",
                        "many": "000 bilionów",
                        "one": "000 bilion",
                        "other": "000 biliona"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 tys'.'",
                        "many": "0 tys'.'",
                        "one": "0 tys'.'",
                        "other": "0 tys'.'"
                      },
                      "10000": {
                        "few": "00 tys'.'",
                        "many": "00 tys'.'",
                        "one": "00 tys'.'",
                        "other": "00 tys'.'"
                      },
                      "100000": {
                        "few": "000 tys'.'",
                        "many": "000 tys'.'",
                        "one": "000 tys'.'",
                        "other": "000 tys'.'"
                      },
                      "1000000": {
                        "few": "0 mln",
                        "many": "0 mln",
                        "one": "0 mln",
                        "other": "0 mln"
                      },
                      "10000000": {
                        "few": "00 mln",
                        "many": "00 mln",
                        "one": "00 mln",
                        "other": "00 mln"
                      },
                      "100000000": {
                        "few": "000 mln",
                        "many": "000 mln",
                        "one": "000 mln",
                        "other": "000 mln"
                      },
                      "1000000000": {
                        "few": "0 mld",
                        "many": "0 mld",
                        "one": "0 mld",
                        "other": "0 mld"
                      },
                      "10000000000": {
                        "few": "00 mld",
                        "many": "00 mld",
                        "one": "00 mld",
                        "other": "00 mld"
                      },
                      "100000000000": {
                        "few": "000 mld",
                        "many": "000 mld",
                        "one": "000 mld",
                        "other": "000 mld"
                      },
                      "1000000000000": {
                        "few": "0 bln",
                        "many": "0 bln",
                        "one": "0 bln",
                        "other": "0 bln"
                      },
                      "10000000000000": {
                        "few": "00 bln",
                        "many": "00 bln",
                        "one": "00 bln",
                        "other": "00 bln"
                      },
                      "100000000000000": {
                        "few": "000 bln",
                        "many": "000 bln",
                        "one": "000 bln",
                        "other": "000 bln"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "pt": {
          "pt": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 mil",
                        "other": "0 mil"
                      },
                      "10000": {
                        "one": "00 mil",
                        "other": "00 mil"
                      },
                      "100000": {
                        "one": "000 mil",
                        "other": "000 mil"
                      },
                      "1000000": {
                        "one": "0 milhão",
                        "other": "0 milhões"
                      },
                      "10000000": {
                        "one": "00 milhão",
                        "other": "00 milhões"
                      },
                      "100000000": {
                        "one": "000 milhão",
                        "other": "000 milhões"
                      },
                      "1000000000": {
                        "one": "0 bilhão",
                        "other": "0 bilhões"
                      },
                      "10000000000": {
                        "one": "00 bilhão",
                        "other": "00 bilhões"
                      },
                      "100000000000": {
                        "one": "000 bilhão",
                        "other": "000 bilhões"
                      },
                      "1000000000000": {
                        "one": "0 trilhão",
                        "other": "0 trilhões"
                      },
                      "10000000000000": {
                        "one": "00 trilhão",
                        "other": "00 trilhões"
                      },
                      "100000000000000": {
                        "one": "000 trilhão",
                        "other": "000 trilhões"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 mil",
                        "other": "0 mil"
                      },
                      "10000": {
                        "one": "00 mil",
                        "other": "00 mil"
                      },
                      "100000": {
                        "one": "000 mil",
                        "other": "000 mil"
                      },
                      "1000000": {
                        "one": "0 mi",
                        "other": "0 mi"
                      },
                      "10000000": {
                        "one": "00 mi",
                        "other": "00 mi"
                      },
                      "100000000": {
                        "one": "000 mi",
                        "other": "000 mi"
                      },
                      "1000000000": {
                        "one": "0 bi",
                        "other": "0 bi"
                      },
                      "10000000000": {
                        "one": "00 bi",
                        "other": "00 bi"
                      },
                      "100000000000": {
                        "one": "000 bi",
                        "other": "000 bi"
                      },
                      "1000000000000": {
                        "one": "0 tri",
                        "other": "0 tri"
                      },
                      "10000000000000": {
                        "one": "00 tri",
                        "other": "00 tri"
                      },
                      "100000000000000": {
                        "one": "000 tri",
                        "other": "000 tri"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ro": {
          "ro": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 mii",
                        "one": "0 mie",
                        "other": "0 de mii"
                      },
                      "10000": {
                        "few": "00 mii",
                        "one": "00 mie",
                        "other": "00 de mii"
                      },
                      "100000": {
                        "few": "000 mii",
                        "one": "000 mie",
                        "other": "000 de mii"
                      },
                      "1000000": {
                        "few": "0 milioane",
                        "one": "0 milion",
                        "other": "0 de milioane"
                      },
                      "10000000": {
                        "few": "00 milioane",
                        "one": "00 milion",
                        "other": "00 de milioane"
                      },
                      "100000000": {
                        "few": "000 milioane",
                        "one": "000 milion",
                        "other": "000 de milioane"
                      },
                      "1000000000": {
                        "few": "0 miliarde",
                        "one": "0 miliard",
                        "other": "0 de miliarde"
                      },
                      "10000000000": {
                        "few": "00 miliarde",
                        "one": "00 miliard",
                        "other": "00 de miliarde"
                      },
                      "100000000000": {
                        "few": "000 miliarde",
                        "one": "000 miliard",
                        "other": "000 de miliarde"
                      },
                      "1000000000000": {
                        "few": "0 trilioane",
                        "one": "0 trilion",
                        "other": "0 de trilioane"
                      },
                      "10000000000000": {
                        "few": "00 trilioane",
                        "one": "00 trilion",
                        "other": "00 de trilioane"
                      },
                      "100000000000000": {
                        "few": "000 trilioane",
                        "one": "000 trilion",
                        "other": "000 de trilioane"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 K",
                        "one": "0 K",
                        "other": "0 K"
                      },
                      "10000": {
                        "few": "00 K",
                        "one": "00 K",
                        "other": "00 K"
                      },
                      "100000": {
                        "few": "000 K",
                        "one": "000 K",
                        "other": "000 K"
                      },
                      "1000000": {
                        "few": "0 mil'.'",
                        "one": "0 mil'.'",
                        "other": "0 mil'.'"
                      },
                      "10000000": {
                        "few": "00 mil'.'",
                        "one": "00 mil'.'",
                        "other": "00 mil'.'"
                      },
                      "100000000": {
                        "few": "000 mil'.'",
                        "one": "000 mil'.'",
                        "other": "000 mil'.'"
                      },
                      "1000000000": {
                        "few": "0 mld'.'",
                        "one": "0 mld'.'",
                        "other": "0 mld'.'"
                      },
                      "10000000000": {
                        "few": "00 mld'.'",
                        "one": "00 mld'.'",
                        "other": "00 mld'.'"
                      },
                      "100000000000": {
                        "few": "000 mld'.'",
                        "one": "000 mld'.'",
                        "other": "000 mld'.'"
                      },
                      "1000000000000": {
                        "few": "0 tril'.'",
                        "one": "0 tril'.'",
                        "other": "0 tril'.'"
                      },
                      "10000000000000": {
                        "few": "00 tril'.'",
                        "one": "00 tril'.'",
                        "other": "00 tril'.'"
                      },
                      "100000000000000": {
                        "few": "000 tril'.'",
                        "one": "000 tril'.'",
                        "other": "000 tril'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ru": {
          "ru": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 тысячи",
                        "many": "0 тысяч",
                        "one": "0 тысяча",
                        "other": "0 тысячи"
                      },
                      "10000": {
                        "few": "00 тысячи",
                        "many": "00 тысяч",
                        "one": "00 тысяча",
                        "other": "00 тысячи"
                      },
                      "100000": {
                        "few": "000 тысячи",
                        "many": "000 тысяч",
                        "one": "000 тысяча",
                        "other": "000 тысячи"
                      },
                      "1000000": {
                        "few": "0 миллиона",
                        "many": "0 миллионов",
                        "one": "0 миллион",
                        "other": "0 миллиона"
                      },
                      "10000000": {
                        "few": "00 миллиона",
                        "many": "00 миллионов",
                        "one": "00 миллион",
                        "other": "00 миллиона"
                      },
                      "100000000": {
                        "few": "000 миллиона",
                        "many": "000 миллионов",
                        "one": "000 миллион",
                        "other": "000 миллиона"
                      },
                      "1000000000": {
                        "few": "0 миллиарда",
                        "many": "0 миллиардов",
                        "one": "0 миллиард",
                        "other": "0 миллиарда"
                      },
                      "10000000000": {
                        "few": "00 миллиарда",
                        "many": "00 миллиардов",
                        "one": "00 миллиард",
                        "other": "00 миллиарда"
                      },
                      "100000000000": {
                        "few": "000 миллиарда",
                        "many": "000 миллиардов",
                        "one": "000 миллиард",
                        "other": "000 миллиарда"
                      },
                      "1000000000000": {
                        "few": "0 триллиона",
                        "many": "0 триллионов",
                        "one": "0 триллион",
                        "other": "0 триллиона"
                      },
                      "10000000000000": {
                        "few": "00 триллиона",
                        "many": "00 триллионов",
                        "one": "00 триллион",
                        "other": "00 триллиона"
                      },
                      "100000000000000": {
                        "few": "000 триллиона",
                        "many": "000 триллионов",
                        "one": "000 триллион",
                        "other": "000 триллиона"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 тыс'.'",
                        "many": "0 тыс'.'",
                        "one": "0 тыс'.'",
                        "other": "0 тыс'.'"
                      },
                      "10000": {
                        "few": "00 тыс'.'",
                        "many": "00 тыс'.'",
                        "one": "00 тыс'.'",
                        "other": "00 тыс'.'"
                      },
                      "100000": {
                        "few": "000 тыс'.'",
                        "many": "000 тыс'.'",
                        "one": "000 тыс'.'",
                        "other": "000 тыс'.'"
                      },
                      "1000000": {
                        "few": "0 млн",
                        "many": "0 млн",
                        "one": "0 млн",
                        "other": "0 млн"
                      },
                      "10000000": {
                        "few": "00 млн",
                        "many": "00 млн",
                        "one": "00 млн",
                        "other": "00 млн"
                      },
                      "100000000": {
                        "few": "000 млн",
                        "many": "000 млн",
                        "one": "000 млн",
                        "other": "000 млн"
                      },
                      "1000000000": {
                        "few": "0 млрд",
                        "many": "0 млрд",
                        "one": "0 млрд",
                        "other": "0 млрд"
                      },
                      "10000000000": {
                        "few": "00 млрд",
                        "many": "00 млрд",
                        "one": "00 млрд",
                        "other": "00 млрд"
                      },
                      "100000000000": {
                        "few": "000 млрд",
                        "many": "000 млрд",
                        "one": "000 млрд",
                        "other": "000 млрд"
                      },
                      "1000000000000": {
                        "few": "0 трлн",
                        "many": "0 трлн",
                        "one": "0 трлн",
                        "other": "0 трлн"
                      },
                      "10000000000000": {
                        "few": "00 трлн",
                        "many": "00 трлн",
                        "one": "00 трлн",
                        "other": "00 трлн"
                      },
                      "100000000000000": {
                        "few": "000 трлн",
                        "many": "000 трлн",
                        "one": "000 трлн",
                        "other": "000 трлн"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "не число",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "sk": {
          "sk": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 tisíc",
                        "many": "0 tisíc",
                        "one": "0 tisíc",
                        "other": "0 tisíc"
                      },
                      "10000": {
                        "few": "00 tisíc",
                        "many": "00 tisíc",
                        "one": "00 tisíc",
                        "other": "00 tisíc"
                      },
                      "100000": {
                        "few": "000 tisíc",
                        "many": "000 tisíc",
                        "one": "000 tisíc",
                        "other": "000 tisíc"
                      },
                      "1000000": {
                        "few": "0 milióny",
                        "many": "0 miliónov",
                        "one": "0 milión",
                        "other": "0 miliónov"
                      },
                      "10000000": {
                        "few": "00 milióny",
                        "many": "00 miliónov",
                        "one": "00 milión",
                        "other": "00 miliónov"
                      },
                      "100000000": {
                        "few": "000 milióny",
                        "many": "000 miliónov",
                        "one": "000 milión",
                        "other": "000 miliónov"
                      },
                      "1000000000": {
                        "few": "0 miliardy",
                        "many": "0 miliard",
                        "one": "0 miliarda",
                        "other": "0 miliard"
                      },
                      "10000000000": {
                        "few": "00 miliárdy",
                        "many": "00 miliárd",
                        "one": "00 miliarda",
                        "other": "00 miliárd"
                      },
                      "100000000000": {
                        "few": "000 miliárdy",
                        "many": "000 miliárd",
                        "one": "000 miliarda",
                        "other": "000 miliárd"
                      },
                      "1000000000000": {
                        "few": "0 bilióny",
                        "many": "0 biliónov",
                        "one": "0 bilión",
                        "other": "0 biliónov"
                      },
                      "10000000000000": {
                        "few": "00 bilióny",
                        "many": "00 biliónov",
                        "one": "00 bilión",
                        "other": "00 biliónov"
                      },
                      "100000000000000": {
                        "few": "000 bilióny",
                        "many": "000 biliónov",
                        "one": "000 bilión",
                        "other": "000 biliónov"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 tis'.'",
                        "many": "0 tis'.'",
                        "one": "0 tis'.'",
                        "other": "0 tis'.'"
                      },
                      "10000": {
                        "few": "00 tis'.'",
                        "many": "00 tis'.'",
                        "one": "00 tis'.'",
                        "other": "00 tis'.'"
                      },
                      "100000": {
                        "few": "000 tis'.'",
                        "many": "000 tis'.'",
                        "one": "000 tis'.'",
                        "other": "000 tis'.'"
                      },
                      "1000000": {
                        "few": "0 mil'.'",
                        "many": "0 mil'.'",
                        "one": "0 mil'.'",
                        "other": "0 mil'.'"
                      },
                      "10000000": {
                        "few": "00 mil'.'",
                        "many": "00 mil'.'",
                        "one": "00 mil'.'",
                        "other": "00 mil'.'"
                      },
                      "100000000": {
                        "few": "000 mil'.'",
                        "many": "000 mil'.'",
                        "one": "000 mil'.'",
                        "other": "000 mil'.'"
                      },
                      "1000000000": {
                        "few": "0 mld'.'",
                        "many": "0 mld'.'",
                        "one": "0 mld'.'",
                        "other": "0 mld'.'"
                      },
                      "10000000000": {
                        "few": "00 mld'.'",
                        "many": "00 mld'.'",
                        "one": "00 mld'.'",
                        "other": "00 mld'.'"
                      },
                      "100000000000": {
                        "few": "000 mld'.'",
                        "many": "000 mld'.'",
                        "one": "000 mld'.'",
                        "other": "000 mld'.'"
                      },
                      "1000000000000": {
                        "few": "0 bil'.'",
                        "many": "0 bil'.'",
                        "one": "0 bil'.'",
                        "other": "0 bil'.'"
                      },
                      "10000000000000": {
                        "few": "00 bil'.'",
                        "many": "00 bil'.'",
                        "one": "00 bil'.'",
                        "other": "00 bil'.'"
                      },
                      "100000000000000": {
                        "few": "000 bil'.'",
                        "many": "000 bil'.'",
                        "one": "000 bil'.'",
                        "other": "000 bil'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "sq": {
          "sq": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 mijë",
                        "other": "0 mijë"
                      },
                      "10000": {
                        "one": "00 mijë",
                        "other": "00 mijë"
                      },
                      "100000": {
                        "one": "000 mijë",
                        "other": "000 mijë"
                      },
                      "1000000": {
                        "one": "0 milion",
                        "other": "0 milion"
                      },
                      "10000000": {
                        "one": "00 milion",
                        "other": "00 milion"
                      },
                      "100000000": {
                        "one": "000 milion",
                        "other": "000 milion"
                      },
                      "1000000000": {
                        "one": "0 miliard",
                        "other": "0 miliard"
                      },
                      "10000000000": {
                        "one": "00 miliard",
                        "other": "00 miliard"
                      },
                      "100000000000": {
                        "one": "000 miliard",
                        "other": "000 miliard"
                      },
                      "1000000000000": {
                        "one": "0 bilion",
                        "other": "0 bilion"
                      },
                      "10000000000000": {
                        "one": "00 bilion",
                        "other": "00 bilion"
                      },
                      "100000000000000": {
                        "one": "000 bilion",
                        "other": "000 bilion"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 mijë",
                        "other": "0 mijë"
                      },
                      "10000": {
                        "one": "00 mijë",
                        "other": "00 mijë"
                      },
                      "100000": {
                        "one": "000 mijë",
                        "other": "000 mijë"
                      },
                      "1000000": {
                        "one": "0 Mln",
                        "other": "0 Mln"
                      },
                      "10000000": {
                        "one": "00 Mln",
                        "other": "00 Mln"
                      },
                      "100000000": {
                        "one": "000 Mln",
                        "other": "000 Mln"
                      },
                      "1000000000": {
                        "one": "0 Mld",
                        "other": "0 Mld"
                      },
                      "10000000000": {
                        "one": "00 Mld",
                        "other": "00 Mld"
                      },
                      "100000000000": {
                        "one": "000 Mld",
                        "other": "000 Mld"
                      },
                      "1000000000000": {
                        "one": "0 Bln",
                        "other": "0 Bln"
                      },
                      "10000000000000": {
                        "one": "00 Bln",
                        "other": "00 Bln"
                      },
                      "100000000000000": {
                        "one": "000 Bln",
                        "other": "000 Bln"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "sr": {
          "sr": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 хиљаде",
                        "one": "0 хиљада",
                        "other": "0 хиљада"
                      },
                      "10000": {
                        "few": "00 хиљаде",
                        "one": "00 хиљада",
                        "other": "00 хиљада"
                      },
                      "100000": {
                        "few": "000 хиљаде",
                        "one": "000 хиљада",
                        "other": "000 хиљада"
                      },
                      "1000000": {
                        "few": "0 милиона",
                        "one": "0 милион",
                        "other": "0 милиона"
                      },
                      "10000000": {
                        "few": "00 милиона",
                        "one": "00 милион",
                        "other": "00 милиона"
                      },
                      "100000000": {
                        "few": "000 милиона",
                        "one": "000 милион",
                        "other": "000 милиона"
                      },
                      "1000000000": {
                        "few": "0 милијарде",
                        "one": "0 милијарда",
                        "other": "0 милијарди"
                      },
                      "10000000000": {
                        "few": "00 милијарде",
                        "one": "00 милијарда",
                        "other": "00 милијарди"
                      },
                      "100000000000": {
                        "few": "000 милијарде",
                        "one": "000 милијарда",
                        "other": "000 милијарди"
                      },
                      "1000000000000": {
                        "few": "0 трилиона",
                        "one": "0 трилион",
                        "other": "0 трилиона"
                      },
                      "10000000000000": {
                        "few": "00 трилиона",
                        "one": "00 трилион",
                        "other": "00 трилиона"
                      },
                      "100000000000000": {
                        "few": "000 трилиона",
                        "one": "000 трилион",
                        "other": "000 трилиона"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 хиљ'.'",
                        "one": "0 хиљ'.'",
                        "other": "0 хиљ'.'"
                      },
                      "10000": {
                        "few": "00 хиљ'.'",
                        "one": "00 хиљ'.'",
                        "other": "00 хиљ'.'"
                      },
                      "100000": {
                        "few": "000 хиљ'.'",
                        "one": "000 хиљ'.'",
                        "other": "000 хиљ'.'"
                      },
                      "1000000": {
                        "few": "0 мил'.'",
                        "one": "0 мил'.'",
                        "other": "0 мил'.'"
                      },
                      "10000000": {
                        "few": "00 мил'.'",
                        "one": "00 мил'.'",
                        "other": "00 мил'.'"
                      },
                      "100000000": {
                        "few": "000 мил'.'",
                        "one": "000 мил'.'",
                        "other": "000 мил'.'"
                      },
                      "1000000000": {
                        "few": "0 млрд'.'",
                        "one": "0 млрд'.'",
                        "other": "0 млрд'.'"
                      },
                      "10000000000": {
                        "few": "00 млрд'.'",
                        "one": "00 млрд'.'",
                        "other": "00 млрд'.'"
                      },
                      "100000000000": {
                        "few": "000 млрд'.'",
                        "one": "000 млрд'.'",
                        "other": "000 млрд'.'"
                      },
                      "1000000000000": {
                        "few": "0 бил'.'",
                        "one": "0 бил'.'",
                        "other": "0 бил'.'"
                      },
                      "10000000000000": {
                        "few": "00 бил'.'",
                        "one": "00 бил'.'",
                        "other": "00 бил'.'"
                      },
                      "100000000000000": {
                        "few": "000 бил'.'",
                        "one": "000 бил'.'",
                        "other": "000 бил'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "sv": {
          "sv": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 tusen",
                        "other": "0 tusen"
                      },
                      "10000": {
                        "one": "00 tusen",
                        "other": "00 tusen"
                      },
                      "100000": {
                        "one": "000 tusen",
                        "other": "000 tusen"
                      },
                      "1000000": {
                        "one": "0 miljon",
                        "other": "0 miljoner"
                      },
                      "10000000": {
                        "one": "00 miljon",
                        "other": "00 miljoner"
                      },
                      "100000000": {
                        "one": "000 miljoner",
                        "other": "000 miljoner"
                      },
                      "1000000000": {
                        "one": "0 miljard",
                        "other": "0 miljarder"
                      },
                      "10000000000": {
                        "one": "00 miljarder",
                        "other": "00 miljarder"
                      },
                      "100000000000": {
                        "one": "000 miljarder",
                        "other": "000 miljarder"
                      },
                      "1000000000000": {
                        "one": "0 biljon",
                        "other": "0 biljoner"
                      },
                      "10000000000000": {
                        "one": "00 biljoner",
                        "other": "00 biljoner"
                      },
                      "100000000000000": {
                        "one": "000 biljoner",
                        "other": "000 biljoner"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 tn",
                        "other": "0 tn"
                      },
                      "10000": {
                        "one": "00 tn",
                        "other": "00 tn"
                      },
                      "100000": {
                        "one": "000 tn",
                        "other": "000 tn"
                      },
                      "1000000": {
                        "one": "0 mn",
                        "other": "0 mn"
                      },
                      "10000000": {
                        "one": "00 mn",
                        "other": "00 mn"
                      },
                      "100000000": {
                        "one": "000 mn",
                        "other": "000 mn"
                      },
                      "1000000000": {
                        "one": "0 md",
                        "other": "0 md"
                      },
                      "10000000000": {
                        "one": "00 md",
                        "other": "00 md"
                      },
                      "100000000000": {
                        "one": "000 md",
                        "other": "000 md"
                      },
                      "1000000000000": {
                        "one": "0 bn",
                        "other": "0 bn"
                      },
                      "10000000000000": {
                        "one": "00 bn",
                        "other": "00 bn"
                      },
                      "100000000000000": {
                        "one": "000 bn",
                        "other": "000 bn"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0 %"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "×10^",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "−",
                "nan": "¤¤¤",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "·",
                "time_separator": ":"
              }
            }
          }
        },
        "ta": {
          "ta": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤ #,##,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 ஆயிரம்",
                        "other": "0 ஆயிரம்"
                      },
                      "10000": {
                        "one": "00 ஆயிரம்",
                        "other": "00 ஆயிரம்"
                      },
                      "100000": {
                        "one": "000 ஆயிரம்",
                        "other": "000 ஆயிரம்"
                      },
                      "1000000": {
                        "one": "0 மில்லியன்",
                        "other": "0 மில்லியன்"
                      },
                      "10000000": {
                        "one": "00 மில்லியன்",
                        "other": "00 மில்லியன்"
                      },
                      "100000000": {
                        "one": "000 மில்லியன்",
                        "other": "000 மில்லியன்"
                      },
                      "1000000000": {
                        "one": "0 பில்லியன்",
                        "other": "0 பில்லியன்"
                      },
                      "10000000000": {
                        "one": "00 பில்லியன்",
                        "other": "00 பில்லியன்"
                      },
                      "100000000000": {
                        "one": "000 பில்லியன்",
                        "other": "000 பில்லியன்"
                      },
                      "1000000000000": {
                        "one": "0 டிரில்லியன்",
                        "other": "0 டிரில்லியன்"
                      },
                      "10000000000000": {
                        "one": "00 டிரில்லியன்",
                        "other": "00 டிரில்லியன்"
                      },
                      "100000000000000": {
                        "one": "000 டிரில்லியன்",
                        "other": "000 டிரில்லியன்"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0ஆ",
                        "other": "0ஆ"
                      },
                      "10000": {
                        "one": "00ஆ",
                        "other": "00ஆ"
                      },
                      "100000": {
                        "one": "000ஆ",
                        "other": "000ஆ"
                      },
                      "1000000": {
                        "one": "0மி",
                        "other": "0மி"
                      },
                      "10000000": {
                        "one": "00மி",
                        "other": "00மி"
                      },
                      "100000000": {
                        "one": "000மி",
                        "other": "000மி"
                      },
                      "1000000000": {
                        "one": "0பி",
                        "other": "0பி"
                      },
                      "10000000000": {
                        "one": "00பி",
                        "other": "00பி"
                      },
                      "100000000000": {
                        "one": "000பி",
                        "other": "000பி"
                      },
                      "1000000000000": {
                        "one": "0டி",
                        "other": "0டி"
                      },
                      "10000000000000": {
                        "one": "00டி",
                        "other": "00டி"
                      },
                      "100000000000000": {
                        "one": "000டி",
                        "other": "000டி"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "th": {
          "th": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "other": "0 พัน"
                      },
                      "10000": {
                        "other": "0 หมื่น"
                      },
                      "100000": {
                        "other": "0 แสน"
                      },
                      "1000000": {
                        "other": "0 ล้าน"
                      },
                      "10000000": {
                        "other": "00 ล้าน"
                      },
                      "100000000": {
                        "other": "000 ล้าน"
                      },
                      "1000000000": {
                        "other": "0 พันล้าน"
                      },
                      "10000000000": {
                        "other": "0 หมื่นล้าน"
                      },
                      "100000000000": {
                        "other": "0 แสนล้าน"
                      },
                      "1000000000000": {
                        "other": "0 ล้านล้าน"
                      },
                      "10000000000000": {
                        "other": "00 ล้านล้าน"
                      },
                      "100000000000000": {
                        "other": "000 ล้านล้าน"
                      }
                    },
                    "short": {
                      "1000": {
                        "other": "0 พ'.'"
                      },
                      "10000": {
                        "other": "0 ม'.'"
                      },
                      "100000": {
                        "other": "0 ส'.'"
                      },
                      "1000000": {
                        "other": "0 ล'.'"
                      },
                      "10000000": {
                        "other": "00 ล'.'"
                      },
                      "100000000": {
                        "other": "000 ล'.'"
                      },
                      "1000000000": {
                        "other": "0 พ'.'ล'.'"
                      },
                      "10000000000": {
                        "other": "0 ม'.'ล'.'"
                      },
                      "100000000000": {
                        "other": "0 ส'.'ล'.'"
                      },
                      "1000000000000": {
                        "other": "0 ล'.'ล'.'"
                      },
                      "10000000000000": {
                        "other": "00 ล'.'ล'.'"
                      },
                      "100000000000000": {
                        "other": "000 ล'.'ล'.'"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "tr": {
          "tr": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 bin",
                        "other": "0 bin"
                      },
                      "10000": {
                        "one": "00 bin",
                        "other": "00 bin"
                      },
                      "100000": {
                        "one": "000 bin",
                        "other": "000 bin"
                      },
                      "1000000": {
                        "one": "0 milyon",
                        "other": "0 milyon"
                      },
                      "10000000": {
                        "one": "00 milyon",
                        "other": "00 milyon"
                      },
                      "100000000": {
                        "one": "000 milyon",
                        "other": "000 milyon"
                      },
                      "1000000000": {
                        "one": "0 milyar",
                        "other": "0 milyar"
                      },
                      "10000000000": {
                        "one": "00 milyar",
                        "other": "00 milyar"
                      },
                      "100000000000": {
                        "one": "000 milyar",
                        "other": "000 milyar"
                      },
                      "1000000000000": {
                        "one": "0 trilyon",
                        "other": "0 trilyon"
                      },
                      "10000000000000": {
                        "one": "00 trilyon",
                        "other": "00 trilyon"
                      },
                      "100000000000000": {
                        "one": "000 trilyon",
                        "other": "000 trilyon"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": 0,
                        "other": 0
                      },
                      "10000": {
                        "one": "00 B",
                        "other": "00 B"
                      },
                      "100000": {
                        "one": "000 B",
                        "other": "000 B"
                      },
                      "1000000": {
                        "one": "0 Mn",
                        "other": "0 Mn"
                      },
                      "10000000": {
                        "one": "00 Mn",
                        "other": "00 Mn"
                      },
                      "100000000": {
                        "one": "000 Mn",
                        "other": "000 Mn"
                      },
                      "1000000000": {
                        "one": "0 Mr",
                        "other": "0 Mr"
                      },
                      "10000000000": {
                        "one": "00 Mr",
                        "other": "00 Mr"
                      },
                      "100000000000": {
                        "one": "000 Mr",
                        "other": "000 Mr"
                      },
                      "1000000000000": {
                        "one": "0 Tn",
                        "other": "0 Tn"
                      },
                      "10000000000000": {
                        "one": "00 Tn",
                        "other": "00 Tn"
                      },
                      "100000000000000": {
                        "one": "000 Tn",
                        "other": "000 Tn"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "%#,##0"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "uk": {
          "uk": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "few": "{0} {1}",
                    "many": "{0} {1}",
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "few": "0 тисячі",
                        "many": "0 тисяч",
                        "one": "0 тисяча",
                        "other": "0 тисячі"
                      },
                      "10000": {
                        "few": "00 тисячі",
                        "many": "00 тисяч",
                        "one": "00 тисяча",
                        "other": "00 тисячі"
                      },
                      "100000": {
                        "few": "000 тисячі",
                        "many": "000 тисяч",
                        "one": "000 тисяча",
                        "other": "000 тисячі"
                      },
                      "1000000": {
                        "few": "0 мільйони",
                        "many": "0 мільйонів",
                        "one": "0 мільйон",
                        "other": "0 мільйона"
                      },
                      "10000000": {
                        "few": "00 мільйони",
                        "many": "00 мільйонів",
                        "one": "00 мільйон",
                        "other": "00 мільйона"
                      },
                      "100000000": {
                        "few": "000 мільйони",
                        "many": "000 мільйонів",
                        "one": "000 мільйон",
                        "other": "000 мільйона"
                      },
                      "1000000000": {
                        "few": "0 мільярди",
                        "many": "0 мільярдів",
                        "one": "0 мільярд",
                        "other": "0 мільярда"
                      },
                      "10000000000": {
                        "few": "00 мільярди",
                        "many": "00 мільярдів",
                        "one": "00 мільярд",
                        "other": "00 мільярда"
                      },
                      "100000000000": {
                        "few": "000 мільярди",
                        "many": "000 мільярдів",
                        "one": "000 мільярд",
                        "other": "000 мільярда"
                      },
                      "1000000000000": {
                        "few": "0 трильйони",
                        "many": "0 трильйонів",
                        "one": "0 трильйон",
                        "other": "0 трильйона"
                      },
                      "10000000000000": {
                        "few": "00 трильйони",
                        "many": "00 трильйонів",
                        "one": "00 трильйон",
                        "other": "00 трильйона"
                      },
                      "100000000000000": {
                        "few": "000 трильйони",
                        "many": "000 трильйонів",
                        "one": "000 трильйон",
                        "other": "000 трильйона"
                      }
                    },
                    "short": {
                      "1000": {
                        "few": "0 тис",
                        "many": "0 тис",
                        "one": "0 тис",
                        "other": "0 тис"
                      },
                      "10000": {
                        "few": "00 тис",
                        "many": "00 тис",
                        "one": "00 тис",
                        "other": "00 тис"
                      },
                      "100000": {
                        "few": "000 тис",
                        "many": "000 тис",
                        "one": "000 тис",
                        "other": "000 тис"
                      },
                      "1000000": {
                        "few": "0 млн",
                        "many": "0 млн",
                        "one": "0 млн",
                        "other": "0 млн"
                      },
                      "10000000": {
                        "few": "00 млн",
                        "many": "00 млн",
                        "one": "00 млн",
                        "other": "00 млн"
                      },
                      "100000000": {
                        "few": "000 млн",
                        "many": "000 млн",
                        "one": "000 млн",
                        "other": "000 млн"
                      },
                      "1000000000": {
                        "few": "0 млрд",
                        "many": "0 млрд",
                        "one": "0 млрд",
                        "other": "0 млрд"
                      },
                      "10000000000": {
                        "few": "00 млрд",
                        "many": "00 млрд",
                        "one": "00 млрд",
                        "other": "00 млрд"
                      },
                      "100000000000": {
                        "few": "000 млрд",
                        "many": "000 млрд",
                        "one": "000 млрд",
                        "other": "000 млрд"
                      },
                      "1000000000000": {
                        "few": "0 трлн",
                        "many": "0 трлн",
                        "one": "0 трлн",
                        "other": "0 трлн"
                      },
                      "10000000000000": {
                        "few": "00 трлн",
                        "many": "00 трлн",
                        "one": "00 трлн",
                        "other": "00 трлн"
                      },
                      "100000000000000": {
                        "few": "000 трлн",
                        "many": "000 трлн",
                        "one": "000 трлн",
                        "other": "000 трлн"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "Е",
                "group": " ",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "Не число",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "ur": {
          "ur": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤ #,##,##0.00"
                  },
                  "unit": {
                    "one": "{0} {1}",
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "one": "0 ہزار",
                        "other": "0 ہزار"
                      },
                      "10000": {
                        "one": "00 ہزار",
                        "other": "00 ہزار"
                      },
                      "100000": {
                        "one": "0 لاکھ",
                        "other": "0 لاکھ"
                      },
                      "1000000": {
                        "one": "00 لاکھ",
                        "other": "00 لاکھ"
                      },
                      "10000000": {
                        "one": "0 کروڑ",
                        "other": "0 کروڑ"
                      },
                      "100000000": {
                        "one": "00 کروڑ",
                        "other": "00 کروڑ"
                      },
                      "1000000000": {
                        "one": "0 ارب",
                        "other": "0 ارب"
                      },
                      "10000000000": {
                        "one": "00 ارب",
                        "other": "00 ارب"
                      },
                      "100000000000": {
                        "one": "0 کھرب",
                        "other": "0 کھرب"
                      },
                      "1000000000000": {
                        "one": "00 کھرب",
                        "other": "00 کھرب"
                      },
                      "10000000000000": {
                        "one": "00 ٹریلین",
                        "other": "00 ٹریلین"
                      },
                      "100000000000000": {
                        "one": "000 ٹریلین",
                        "other": "000 ٹریلین"
                      }
                    },
                    "short": {
                      "1000": {
                        "one": "0 ہزار",
                        "other": "0 ہزار"
                      },
                      "10000": {
                        "one": "00 ہزار",
                        "other": "00 ہزار"
                      },
                      "100000": {
                        "one": "0 لاکھ",
                        "other": "0 لاکھ"
                      },
                      "1000000": {
                        "one": "00 لاکھ",
                        "other": "00 لاکھ"
                      },
                      "10000000": {
                        "one": "0 کروڑ",
                        "other": "0 کروڑ"
                      },
                      "100000000": {
                        "one": "00 کروڑ",
                        "other": "00 کروڑ"
                      },
                      "1000000000": {
                        "one": "0 ارب",
                        "other": "0 ارب"
                      },
                      "10000000000": {
                        "one": "00 ارب",
                        "other": "00 ارب"
                      },
                      "100000000000": {
                        "one": "0 کھرب",
                        "other": "0 کھرب"
                      },
                      "1000000000000": {
                        "one": "00 کھرب",
                        "other": "00 کھرب"
                      },
                      "10000000000000": {
                        "one": "00 ٹریلین",
                        "other": "00 ٹریلین"
                      },
                      "100000000000000": {
                        "one": "000 ٹریلین",
                        "other": "000 ٹریلین"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "‎-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "‎+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "vi": {
          "vi": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.00 ¤"
                  },
                  "unit": {
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "other": "0 nghìn"
                      },
                      "10000": {
                        "other": "00 nghìn"
                      },
                      "100000": {
                        "other": "000 nghìn"
                      },
                      "1000000": {
                        "other": "0 triệu"
                      },
                      "10000000": {
                        "other": "00 triệu"
                      },
                      "100000000": {
                        "other": "000 triệu"
                      },
                      "1000000000": {
                        "other": "0 tỷ"
                      },
                      "10000000000": {
                        "other": "00 tỷ"
                      },
                      "100000000000": {
                        "other": "000 tỷ"
                      },
                      "1000000000000": {
                        "other": "0 nghìn tỷ"
                      },
                      "10000000000000": {
                        "other": "00 nghìn tỷ"
                      },
                      "100000000000000": {
                        "other": "000 nghìn tỷ"
                      }
                    },
                    "short": {
                      "1000": {
                        "other": "0 N"
                      },
                      "10000": {
                        "other": "00 N"
                      },
                      "100000": {
                        "other": "000 N"
                      },
                      "1000000": {
                        "other": "0 Tr"
                      },
                      "10000000": {
                        "other": "00 Tr"
                      },
                      "100000000": {
                        "other": "000 Tr"
                      },
                      "1000000000": {
                        "other": "0 T"
                      },
                      "10000000000": {
                        "other": "00 T"
                      },
                      "100000000000": {
                        "other": "000 T"
                      },
                      "1000000000000": {
                        "other": "0 NT"
                      },
                      "10000000000000": {
                        "other": "00 NT"
                      },
                      "100000000000000": {
                        "other": "000 NT"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ",",
                "exponential": "E",
                "group": ".",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "zh": {
          "zh": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤ #,##0.00"
                  },
                  "unit": {
                    "other": "{0}{1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "other": "0千"
                      },
                      "10000": {
                        "other": "0万"
                      },
                      "100000": {
                        "other": "00万"
                      },
                      "1000000": {
                        "other": "000万"
                      },
                      "10000000": {
                        "other": "0000万"
                      },
                      "100000000": {
                        "other": "0亿"
                      },
                      "1000000000": {
                        "other": "00亿"
                      },
                      "10000000000": {
                        "other": "000亿"
                      },
                      "100000000000": {
                        "other": "0000亿"
                      },
                      "1000000000000": {
                        "other": "0兆"
                      },
                      "10000000000000": {
                        "other": "00兆"
                      },
                      "100000000000000": {
                        "other": "000兆"
                      }
                    },
                    "short": {
                      "1000": {
                        "other": "0千"
                      },
                      "10000": {
                        "other": "0万"
                      },
                      "100000": {
                        "other": "00万"
                      },
                      "1000000": {
                        "other": "000万"
                      },
                      "10000000": {
                        "other": "0000万"
                      },
                      "100000000": {
                        "other": "0亿"
                      },
                      "1000000000": {
                        "other": "00亿"
                      },
                      "10000000000": {
                        "other": "000亿"
                      },
                      "100000000000": {
                        "other": "0000亿"
                      },
                      "1000000000000": {
                        "other": "0兆"
                      },
                      "10000000000000": {
                        "other": "00兆"
                      },
                      "100000000000000": {
                        "other": "000兆"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "NaN",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        },
        "zh-Hant": {
          "zh-Hant": {
            "numbers": {
              "formats": {
                "currency": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "¤#,##0.00"
                  },
                  "unit": {
                    "other": "{0} {1}"
                  }
                },
                "decimal": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0.###",
                    "long": {
                      "1000": {
                        "other": "0 千"
                      },
                      "10000": {
                        "other": "0萬"
                      },
                      "100000": {
                        "other": "00萬"
                      },
                      "1000000": {
                        "other": "000萬"
                      },
                      "10000000": {
                        "other": "0000萬"
                      },
                      "100000000": {
                        "other": "0億"
                      },
                      "1000000000": {
                        "other": "00億"
                      },
                      "10000000000": {
                        "other": "000億"
                      },
                      "100000000000": {
                        "other": "0000億"
                      },
                      "1000000000000": {
                        "other": "0兆"
                      },
                      "10000000000000": {
                        "other": "00兆"
                      },
                      "100000000000000": {
                        "other": "000兆"
                      }
                    },
                    "short": {
                      "1000": {
                        "other": "0K"
                      },
                      "10000": {
                        "other": "00K"
                      },
                      "100000": {
                        "other": "000K"
                      },
                      "1000000": {
                        "other": "0M"
                      },
                      "10000000": {
                        "other": "00M"
                      },
                      "100000000": {
                        "other": "000M"
                      },
                      "1000000000": {
                        "other": "0B"
                      },
                      "10000000000": {
                        "other": "00B"
                      },
                      "100000000000": {
                        "other": "000B"
                      },
                      "1000000000000": {
                        "other": "0T"
                      },
                      "10000000000000": {
                        "other": "00T"
                      },
                      "100000000000000": {
                        "other": "000T"
                      }
                    }
                  }
                },
                "percent": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#,##0%"
                  }
                },
                "scientific": {
                  "number_system": "latn",
                  "patterns": {
                    "default": "#E0"
                  }
                }
              },
              "symbols": {
                "alias": "",
                "decimal": ".",
                "exponential": "E",
                "group": ",",
                "infinity": "∞",
                "list": ";",
                "minus_sign": "-",
                "nan": "非數值",
                "per_mille": "‰",
                "percent_sign": "%",
                "plus_sign": "+",
                "superscripting_exponent": "×",
                "time_separator": ":"
              }
            }
          }
        }
      }
    }
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : (this.TwitterCldrDataBundle = {}, this.TwitterCldrDataBundle);

  for (key in TwitterCldrDataBundle) {
    obj = TwitterCldrDataBundle[key];
    root[key] = obj;
  }

  if ((this.TwitterCldr != null) && !this.TwitterCldr.is_data_set()) {
    this.TwitterCldr.set_data(TwitterCldrDataBundle);
  }

}).call(this);
