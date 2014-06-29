# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.SegmentationTokenizer
	constructor : ->
    recognizers = [
      new TokenRecognizer("break", new RegExp "/\u00f7/", ((val) -> 
        TwitterCldr.Utilities.trim_string(val))) # ÷ character
      new TokenRecognizer("break", new RegExp "/\u00d7/", ((val) -> 
        TwitterCldr.Utilities.trim_string(val))) # × character
    ]
    ur_tokenizer = new UnicodeRegexTokenizer
    ur_tokenizer.insert_before "string", recognizers
    @tokenizer = ur_tokenizer
		

	tokenize : (pattern) ->
		result = []
		tokens = @tokenizer.tokenize pattern
		for token in tokens
			if token.value.replace(/^\s+|\s+$/g, "").length is 0
				result.push token

		result
