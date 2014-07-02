# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.UnicodeRegex
  @compile : (str, modifiers = "", symbol_table = null) ->
    new TwitterCldr.UnicodeRegex (
      @parser.parse(
        @tokenizer.tokenize(str), {"symbol_table" : symbol_table}
      ), modifiers
    )

  # All unicode characters
  @all_unicode ||= new TwitterCldr.RangeSet([new TwitterCldr.Range 0, 0x10FFFF])

  # A few <control> characters (i.e. 2..7) and public/private surrogates (i.e. 55296..57343).
  # These don't play nicely with Ruby's regular expression engine, and I think we
  # can safely disregard them.
  @invalid_regexp_chars ||= new TwitterCldr.RangeSet ([(new TwitterCldr.Range 2, 7), (new TwitterCldr.Range 55296, 57343)])
  
  @valid_regexp_chars ||= @all_unicode.subtract(@invalid_regexp_chars)
  
  @tokenizer ||= new TwitterCldr.UnicodeRegexTokenizer()

  @parser ||= new TwitterCldr.UnicodeRegexParser ()

  constructor : (@elements, modifiers = null)
    @modifiers = null

  

      extend Forwardable
      def_delegator :to_regexp, :match
      def_delegator :to_regexp, :=~

      attr_reader :elements, :modifiers

      def initialize(elements, modifiers = nil)
        @elements = elements
        @modifiers = nil
      end

      def to_regexp
        if RUBY_VERSION <= "1.8.7"
          begin
            Oniguruma::ORegexp.new(to_regexp_str, modifiers)
          rescue NameError
            raise "Unicode regular expressions require the Oniguruma gem when using Ruby 1.8. Please install, require, and retry."
          end
        else
          @regexp ||= Regexp.new(to_regexp_str, modifiers)
        end
      end

      def to_regexp_str
        @regexp_str ||= elements.map(&:to_regexp_str).join
      end

    end
  end
end
