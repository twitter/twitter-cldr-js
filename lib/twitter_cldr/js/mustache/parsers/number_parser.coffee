# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.NumberParser
  constructor: ->
    @group_separator = "{{{group_separator}}}"
    @decimal_separator = "{{{decimal_separator}}}"
    @separator_chars = ['\\.', ',', '\\s'].join("")

  parse: (number_text, options = {}) ->
    options.strict = true if options.strict is undefined
    separators = this.get_separators(options.strict)
    tokens = this.tokenize(number_text, separators.group, separators.decimal)
    num_list = []
    punct_list = []

    for token in tokens
      if token.type == "numeric"
        num_list.push(token)
      else
        punct_list.push(token)

    throw "Invalid number" unless this.is_punct_valid(punct_list)
    throw "Invalid number" unless tokens.slice(-1)[0] &&
      tokens.slice(-1)[0]["type"] == "numeric"

    if punct_list.length > 0 && punct_list.slice(-1)[0]["type"] == "decimal"
      result = parseInt((num.value for num in num_list[0..-2]).join("")) || 0
      last = num_list.slice(-1)[0];
      result + parseInt(last.value) / Math.pow(10.0, last.value.length)
    else
      parseInt((num.value for num in num_list).join(""))

  try_parse: (number_text, default_value = null, callback = null, options = {}) ->
    result = try
      this.parse(number_text, options)
    catch err
      if err.toString() == "Invalid number"
        null
      else
        throw err

    if callback
      callback(result)
    else
      result || default_value

  is_valid: (number_text, options = {}) ->
    try
      this.parse(number_text, options)
      true
    catch err
      if err.toString() == "Invalid number"
        false
      else
        throw err

  @is_numeric: (text, separators) ->
    unless separators?
      separators = new NumberParser().separator_chars

    regexp = new RegExp("^[0-9" + separators + "]+$")
    regexp.test(text)

  is_punct_valid: (punct_list) ->
    # all group, allowed one decimal at end
    valid = true

    for punct, index in punct_list
      valid = valid && (punct.type == "group" ||
        (index == (punct_list.length - 1) && punct.type == "decimal")
      )

    valid

  get_separators: (strict = false) ->
    group = if strict then @group_separator else @separator_chars
    decimal = if strict then @decimal_separator else @separator_chars
    { group: group, decimal: decimal }

  tokenize: (number_text, group, decimal) ->
    regexp = new RegExp("([\\d]*)([" + group + "]{0,1})([\\d]*)([" + decimal + "]{0,1})([\\d]*)")
    match_data = number_text.split(regexp)
    match_data = (match for match in match_data when match != "")
    tokens = (this.identify(match, group, decimal) for match in match_data)
    token for token in tokens when token.type != null

  identify: (text, group, decimal) ->
    result = { value: text }
    result.type = if NumberParser.is_numeric(result.value, "")
      "numeric"
    else
      group_regexp = new RegExp("[" + group + "]")
      decimal_regexp = new RegExp("[" + decimal + "]")

      if group_regexp.test(result.value)
        "group"
      else if decimal_regexp.test(result.value)
        "decimal"
      else
        null

    result
