# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.CodePoint
  @code_point_fields = [
    "code_point"
    "name"
    "category"
    "combining_class"
    "bidi_class"
    "decomposition"
    "digit_value"
    "non_decimal_digit_value"
    "numeric_value"
    "bidi_mirrored"
    "unicode1_name"
    "iso_comment"
    "simple_uppercase_map"
    "simple_lowercase_map"
    "simple_titlecase_map"
  ]

  decomposition_data_index = 5
  decomposition_regex = /^(?:<(.+)>\s+)?(.+)?$/
  @indices = ["category", "bidi_class", "bidi_mirrored"]
  @properties = ["sentence_break", "line_break", "word_break"]

  @data :->
    TwitterCldr.get_data()[@name]

  constructor : (@fields) ->
    for i in [0...TwitterCldr.CodePoint.code_point_fields.length] by 1
      field = TwitterCldr.CodePoint.code_point_fields[i]
      unless field is "decomposition"
        @[field] = @fields[i]

  decomposition : ->
    decomp = @fields[decomposition_data_index]
    match = decomp.match(decomposition_regex)
    if match?
      if match[2]?
        return (parseInt(s, 16) for s in match[2].match(/\S+/g))
      else
        return null
    else
      throw "decomposition " + decomp + " has invalid format"

  compatibility_decomposition_tag : ->
    decomp = @fields[decomposition_data_index]
    if (match = decomp.match(decomposition_regex))
      if match[1]? then return match[1] else return null
    else
      throw "decomposition " + decomp + " has invalid format"

  is_compatibility_decomposition : ->
    return @compatibility_decomposition_tag()?

  @code_points_for_property : (property_name, value)  ->
    property_data = @get_property_data(property_name)
    if property_data?
      property_data[value]
    else
      throw "Couldn't find property " + property_name

  # Search for code points wherein at least one property value contains prop_value.
  # For example, if prop_value is set to "Zs", this method will return all code
  # points that are considered spaces. If prop value is simply "Z", this method
  # will return all code points who have a property value that contains "Z", i.e.
  # spaces as well as line separators ("Zl") and paragraph separators ("Zp").
  @code_points_for_property_value : (prop_value) ->
    if @index_key_cache[prop_value]?
      return @index_key_cache[prop_value]

    result = []
    for index_key, index_names of @data().index_keys
      if index_key.indexOf(prop_value) > -1
        for index_name in index_names
          result = result.concat(@get_index(index_name)[index_key])

    @index_key_cache[prop_value] = result

  @index_key_cache = {}

  @get_index : (index_name) ->
    return @index_cache[index_name] if @index_cache[index_name]?
    index_data = @data().index_data[index_name]
    index_data_formatted = {}
    for k, v of index_data
      index_data_formatted[k] = []
      for range in index_data[k]
        index_data_formatted[k].push(new TwitterCldr.Range(range[0], range[1]))

    @index_cache[index_name] = index_data_formatted

  @get_regex_for_index_group : (index_name, group_name) ->
    group_data = @get_index(index_name)[group_name]
    regex = ""
    component = new TwitterCldr.Component()
    for group in group_data
      regex = regex + "|" + component.range_to_regex(group)

    regex.slice(1) # get rid of the initial '|'

  @get_property_data : (property_name) ->
    return @property_data_cache[property_name] if @property_data_cache[property_name]?
    property_data = @data().property_data[property_name]
    property_data_formatted = {}
    for k, v of property_data
      property_data_formatted[k] = []
      for range in property_data[k]
        property_data_formatted[k].push(new TwitterCldr.Range(range[0], range[1]))

    @property_data_cache[property_name] = property_data_formatted

  @index_cache = {}

  @property_data_cache = {}

  @get_block_name : (code_point) ->
    if @block_cache[code_point]?
      return @block_cache[code_point]
    for k, range of @blocks
      range = new TwitterCldr.Range(range[0], range[1])
      if range.includes(code_point)
        return @block_cache[code_point] = k
    return null
