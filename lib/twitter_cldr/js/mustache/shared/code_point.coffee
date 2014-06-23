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

  @decomposition_data_index = 5
  @decomposition_regex = /^(?:<(.+)>\s+)?(.+)?$/
  @indices = ["category", "bidi_class", "bidi_mirrored"]
  @properties = ["sentence_break", "line_break", "word_break"]	