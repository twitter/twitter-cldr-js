# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.TokenRecognizer
	constructor : (@token_type, @regex, @content = nil, @cleaner) -> #TODO figure out if this works. Cleaner and all. (that do thing)

	@recognizes : (text) ->
		@regex.test text

	@clean : (val) ->
		@cleaner(val)



class TwitterCldr.Tokenizer
	constructor : (@recognizers, @custom_splitter = nil, @remove_empty_entries = true) ->

	@union : (tokenizers) ->
		recognizers = 
		







      def self.union(*tokenizers)
        recognizers = tokenizers.inject([]) do |ret, tokenizer|
          ret + tokenizer.recognizers.inject([]) do |recog_ret, recognizer|
            if (block_given? && yield(recognizer)) || !block_given?
              recog_ret << recognizer
            end
            recog_ret
          end
        end

        splitter = if tokenizers.all?(&:custom_splitter)
          Regexp.compile(
            tokenizers.map do |tokenizer|
              tokenizer.custom_splitter.source
            end.join("|")
          )
        end

        new(recognizers, splitter)
      end






