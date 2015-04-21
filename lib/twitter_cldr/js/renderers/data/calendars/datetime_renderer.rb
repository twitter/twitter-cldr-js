# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Calendars
        class DateTimeRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/calendars/datetime.coffee"

          def tokens
            {
              :date_time => TwitterCldr::DataReaders::DateTimeDataReader,
              :time      => TwitterCldr::DataReaders::TimeDataReader,
              :date      => TwitterCldr::DataReaders::DateDataReader
            }.inject({}) do |tokens, (name, const)|
              tokens[name] = ([:default] + const.types).inject({}) do |ret, type|
                ret[type] = if type == :additional
                  pattern_list = TwitterCldr.get_locale_resource(@locale, :calendars)[@locale][:calendars]
                  # TODO: support calendar types other than default (gregorian)
                  pattern_list = pattern_list[TwitterCldr::DEFAULT_CALENDAR_TYPE][:additional_formats].keys
                  pattern_list.inject({}) do |additionals, pattern|
                    data_reader = const.new(@locale, :type => type, :additional_format => pattern.to_s)

                    additionals[pattern] = if data_reader.tokenizer.respond_to?(:full_tokenize)
                      data_reader.tokenizer.full_tokenize(data_reader.pattern)
                    else
                      data_reader.tokenizer.tokenize(data_reader.pattern)
                    end.map(&:to_hash)

                    additionals
                  end
                else
                  data_reader = const.new(@locale, :type => type)
                  data_reader.tokenizer.tokenize(data_reader.pattern).map(&:to_hash)
                end
                ret
              end
              tokens
            end.to_json
          end
        end
      end
    end
  end
end