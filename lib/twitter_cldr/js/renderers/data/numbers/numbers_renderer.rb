# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Data
        module Numbers
          class NumbersRenderer < TwitterCldr::Js::Renderers::Base

            def tokens_for_locale(locale)
              DataReaders::NumberDataReader.types.inject({}) do |ret, type|
                ret[type] = {}
                [:positive, :negative].each do |sign|
                  ret[type][sign] = case type
                    when :short_decimal, :long_decimal
                      (DataReaders::NumberDataReader::ABBREVIATED_MIN_POWER..DataReaders::NumberDataReader::ABBREVIATED_MAX_POWER).inject({}) do |formats, i|
                        exponent = 10 ** i
                        data_reader = DataReaders::NumberDataReader.new(locale, :type => type, :format => exponent)

                        patterns = data_reader.pattern(exponent).inject({}) do |memo, (plural, pattern)|
                          if pattern.is_a?(String)
                            tokens = data_reader.tokenizer.tokenize(pattern).map(&:value)
                            # abbreviation doesn't work for negative numbers in the Ruby version, so we have to fix it here
                            memo[plural] = sign == :positive ? tokens : ["-"] + tokens[1..-1]
                          elsif pattern == 0
                            # there's no specific formatting pattern for these options, skipping them
                          else
                            puts "Invalid number pattern for locale=#{locale}, type=#{type}, sign=#{sign}, i=#{i}: #{pattern.inspect}"
                          end

                          memo
                        end

                        formats[exponent] = patterns unless patterns.empty?

                        formats
                      end
                    else
                      data_reader = DataReaders::NumberDataReader.new(locale, :type => type)
                      number = sign == :positive ? 1 : -1
                      pattern = data_reader.pattern(number)
                      data_reader.tokenizer.tokenize(pattern).map(&:value)
                  end
                end
                ret
              end
            end

            def tokens
              tokens_for_locale(@locale)
            end

            def symbols
              DataReaders::NumberDataReader.new(@locale).symbols
            end

            def currencies_data
              TwitterCldr.get_resource(:shared, :currency_digits_and_rounding)
            end

            def get_data
              {
                :NumberFormatter => {
                  :all_tokens => tokens(),
                  :symbols => symbols()
                },
                :CurrencyFormatter => {
                  :currencies_data => currencies_data()
                }
              }
            end

          end
        end
      end
    end
  end
end
