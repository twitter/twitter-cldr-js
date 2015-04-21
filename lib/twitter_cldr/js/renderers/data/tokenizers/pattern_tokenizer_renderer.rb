# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
    	module DataRenderers
	      module Tokenizers

	        class PatternTokenizerRenderer < TwitterCldr::Js::Renderers::Base
	          set_template "mustache/tokenizers/pattern_tokenizer.coffee"
	        end

	      end
	    end
	  end
	end
end
