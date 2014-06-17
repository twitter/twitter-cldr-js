# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.SegmentationTokenizer
	constructor : ->
		@tokenizer ||= 
		

	@tokenize : (pattern) ->
		result = []
		tokens = @tokenizer.tokenize pattern
		for token in tokens
			if token.value.replace(/^\s+|\s+$/g, "").length is 0
				result.push token

		result



      def tokenizer
        @tokenizer ||= begin
          recognizers = [
            TokenRecognizer.new(:break, /\303\267/u) do |val|     # ÷ character
              val.strip
            end,

            TokenRecognizer.new(:no_break, /\303\227/u) do |val|  # × character
              val.strip
            end
          ]

          ur_tokenizer = UnicodeRegexTokenizer.new
          ur_tokenizer.insert_before(:string, *recognizers)
          ur_tokenizer
        end
      end

    end
  end
end