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

  constructor : (@fields) -> 
    for i in [0...TwitterCldr.CodePoint.code_point_fields.length] by 1
      field = TwitterCldr.CodePoint.code_point_fields[i]    
      unless field is "decomposition"
        @[field] = @fields[i]


  decomposition : ->
    decomp = @fields[decomposition_data_index]
    match = decomp.match(decomposition_regex)
    if (match? and match[2]?)
      match[2].match(/\S+/g).map ((s) -> #splitting by whitespace
        parseInt(s, 16)
      )
    else 
      throw "decomposition " + decomp + " has invalid format"

  compatibility_decomposition_tag : ->
    decomp = @fields[decomposition_data_index]
    if (match = decomp.match(decomposition_regex))
      if !match[1]? then return null else return match[1]
    else
      throw "decomposition " + decomp + " has invalid format"

  is_compatibility_decomposition : ->
    return @compatibility_decomposition_tag()?

  hangul_type : ->
    TwitterCldr.CodePoint.hangul_type(code_point)

  is_excluded_from_composition : ->
    TwitterCldr.CodePoint.is_excluded_from_composition(code_point)
    
  @find : (code_point) ->
    if @code_point_cache[code_point]?
      return @code_point_cache[code_point]

    target = @get_block_name(code_point)

    return null unless target?

    target_data = @block_data[target]
    code_point_data = target_data[code_point]
    if !code_point_data?
      code_point_data = @get_range_start(code_point, target_data)

    @code_point_cache[code_point] = new CodePoint(code_point_data) if code_point_data?

  @code_points_for_index_name : (index_name, value) ->
    @get_index(index_name)[value]
  
  @code_points_for_property : (property_name, value)  ->
    property_data = @get_property_data(property_name)
    if property_data?
      property_data[value]
    else
          throw "Couldn't find property " + property_name

  
  # Search for code points wherein at least one property value contains prop_value.
  # For example, if prop_value is set to :Zs, this method will return all code
  # points that are considered spaces. If prop value is simply :Z, this method
  # will return all code points who have a property value that contains :Z, i.e.
  # spaces as well as line separators (:Zl) and paragraph separators (:Zp).


  @code_points_for_property_value : (prop_value) ->
    if @index_key_cache[prop_value]?
      return @index_key_cache[prop_value]

    result = []
    for index_key, index_names of @index_keys
      if index_key.indexOf(prop_value) > -1
        for index_name in index_names
          result = result.concat(@get_index(index_name)[index_key])

    @index_key_cache[prop_value] = result

  @for_canonical_decomposition : (code_points) ->
    if @canonical_compositions[(code_points.join("|"))]? then @find(@canonical_compositions[(code_points.join("|"))]) else null


  @canonical_compositions = `{{{canonical_compositions}}}`

  @hangul_type : (code_point) ->
    if @hangul_type_cache[code_point]?
      return @hangul_type_cache[code_point]
    if code_point
      for type in ["lparts", "vparts", "tparts", "compositions"]
        for range in @hangul_blocks[type]
          range = new TwitterCldr.Range(range[0], range[1])
          return @hangul_type_cache[code_point] = type if range.includes(code_point)
      @hangul_type_cache[code_point] = null
    else
      @hangul_type_cache[code_point] = null

  @is_excluded_from_composition : (code_point) ->
    if @composition_exclusion_cache[code_point]?
      return @composition_exclusion_cache[code_point]

    for exclusion in @composition_exclusions
      range = new TwitterCldr.Range(exclusion[0], exclusion[1])
      if range.includes(code_point)
        return @composition_exclusion_cache[code_point] = true

    @composition_exclusion_cache[code_point] = false

  @index_key_cache = {}

  @index_keys = `{{{index_keys}}}`

  @indices = `{{{indices}}}`

  @get_index : (index_name) ->
    return @index_cache[index_name] if @index_cache[index_name]?
    index_data = @indices[index_name]
    index_data_formatted = {}
    for k, v of index_data
      index_data_formatted[k] = []
      for range in index_data[k]
        index_data_formatted[k].push(new TwitterCldr.Range(range[0], range[1]))

    @index_cache[index_name] = index_data_formatted

  @properties = `{{{properties}}}`

  @get_property_data : (property_name) ->
    return @property_data_cache[property_name] if @property_data_cache[property_name]?
    property_data = @properties[property_name]
    property_data_formatted = {}
    for k, v of property_data
      property_data_formatted[k] = []
      for range in property_data[k]
        property_data_formatted[k].push(new TwitterCldr.Range(range[0], range[1]))

    @property_data_cache[property_name] = property_data_formatted

  @index_cache = {}

  @property_data_cache = {}

  @hangul_type_cache = {}

  @code_point_cache = {}

  @composition_exclusion_cache = {}

  @hangul_blocks = `{{{hangul_blocks}}}`

  @composition_exclusions = `{{{composition_exclusions}}}`

  @block_cache = {}

  @get_block_name : (code_point) ->
    if @block_cache[code_point]?
      return @block_cache[code_point]
    for k, range of @blocks
      range = new TwitterCldr.Range(range[0], range[1])
      if range.includes(code_point)
        return @block_cache[code_point] = k
    return null

  @get_block_range : (block_name) ->
    if !block_name?
      return null
    block_data = @blocks[block_name]
    if block_data? then new TwitterCldr.Range(block_data[0], block_data[1]) else null


  @blocks = `{{{blocks}}}`

  @block_data = `{{{block_data}}}`


  # Check if block constitutes a range. The code point beginning a range will have a name enclosed in <>, ending with 'First'
  # eg: <CJK Ideograph Extension A, First>
  # http://unicode.org/reports/tr44/#Code_Point_Ranges
  @get_range_start : (code_point, block_data) ->
    keys = []
    for k, v of block_data
      keys.push k
    start_data = block_data[TwitterCldr.Utilities.min(keys)]
    if start_data[1]? and /<.*, First>/.test start_data[1]
      start_data = TwitterCldr.Utilities.clone (start_data)
      start_data[0] = code_point
      start_data[1] = start_data[1].replace(', First', '')
      start_data
    else
      null
