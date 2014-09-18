# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Calendar
  REDIRECT_PREFIX = "calendars.gregorian."

  @calendar: `{{{calendar}}}`

  @months: (options = {}) ->
    root = @get_root("months", options)
    result = []
    result[parseInt(key) - 1] = val for key, val of root
    result

  @weekdays: (options = {}) ->
    @get_root("days", options)

  @quarters: (options = {}) ->
    @get_root("quarters", options)

  @periods: (options = {}) ->
    @get_root("periods", options)

  @get_root: (key, options = {}) ->
    root = @calendar[key]
    names_form = options["names_form"] || "wide"

    format = options.format || if root?["stand-alone"]?[names_form]?
      "stand-alone"
    else
      "format"

    data = root[format][names_form]

    # handle redirects, e.g., { "days": { "stand-alone": { "wide": "calendars.gregorian.days.format.wide" } } }
    if typeof data is "string" and data.indexOf(REDIRECT_PREFIX) == 0
      [key, format, names_form] = data.slice(REDIRECT_PREFIX.length).split(".")
      @calendar[key]?[format]?[names_form] || throw "invalid redirect #{data}"
    else
      data
