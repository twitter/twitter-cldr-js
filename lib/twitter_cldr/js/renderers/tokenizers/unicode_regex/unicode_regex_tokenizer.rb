# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Tokenizers

        class UnicodeRegexTokenizerRenderer < TwitterCldr::Js::Renderers::Base
          self.template_file = File.expand_path(File.join(File.dirname(__FILE__), "../../..", "mustache/tokenizers/unicode_regex/unicode_regex_tokenizer.coffee"))
        end

      end
    end
  end
end