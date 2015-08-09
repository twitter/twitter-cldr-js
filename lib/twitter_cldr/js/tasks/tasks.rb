# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Tasks

      class << self
        def update()
          build(
            :begin_msg  => "Updating build... ",
            :output_dir => File.expand_path(File.join(File.dirname(__FILE__), "../../../assets/javascripts/twitter_cldr")),
            :files      => { "%s.js" => false }
          )
        end

        def compile
          build(
            :begin_msg  => "Compiling build... ",
            :output_dir => get_output_dir,
            :files      => { "min/%s.min.js" => true, "full/%s.js" => false }
          )
        end

        def update_for_test()
          build(
            :begin_msg          => "Updating build... ",
            :output_dir         => File.expand_path(File.join(File.dirname(__FILE__), "../../../assets/javascripts/twitter_cldr")),
            :files              => { "%s.js" => false },
            :render_test_files  => true
          )
        end

        private

        def build(options = {})
          locales = get_locales
          $stdout.write(options[:begin_msg])

          compiler_options = {
            :locales => locales,
            :prerender => ENV["PRERENDER"] ? ENV["PRERENDER"] == "true" : nil,
            :source_map => ENV["SOURCE_MAP"] ? ENV["SOURCE_MAP"] == "true" : false
          }

          compiler   = TwitterCldr::Js::Compiler.new(compiler_options)
          output_dir = File.expand_path(options[:output_dir] || get_output_dir)

          build_duration = time_operation do
            implementation_file_contents = compiler.compile_implementation(:minify => false) # TODO - figure out the minification logic
            write_file([output_dir, 'twitter_cldr.js'], implementation_file_contents)

            options[:files].each_pair do |file_pattern, minify|
              compiler.compile_each(:minify => minify) do |bundle, locale|
                out_file_path = [output_dir, file_pattern % locale]
                write_file(out_file_path, bundle)
              end
            end

            if options[:render_test_files]
              file_contents = compiler.compile_test()
              write_file([output_dir, 'test_resources.js'], file_contents)
            end

          end
          puts "done"
          puts build_summary(
            :locale_count => compiler.locales.size,
            :build_duration => build_duration,
            :dir => output_dir
          )
        end

        def write_file(file_path, file_contents)
          File.write(File.join(file_path), file_contents)
        end

        def build_summary(options = {})
          %Q(Built %{locale_count} %<{ "locale_count": { "one": "locale", "other": "locales" } }> %{timespan} into %{dir}).localize % {
            :locale_count => options[:locale_count],
            :timespan     => TwitterCldr::Localized::LocalizedTimespan.new(options[:build_duration], :locale => :en).to_s.downcase,
            :dir          => options[:dir]
          }
        end

        def time_operation
          start_time = Time.now.to_i
          yield
          Time.now.to_i - start_time
        end

        def get_output_dir
          ENV["OUTPUT_DIR"] || File.join(FileUtils.getwd, "twitter_cldr")
        end

        def get_locales
          if ENV["LOCALES"]
            locales = ENV["LOCALES"].split(",").map { |locale| TwitterCldr.convert_locale(locale.strip.downcase.to_sym) }
            bad_locales = locales.select { |locale| !TwitterCldr.supported_locale?(locale) }
            puts "Ignoring unsupported locales: #{bad_locales.join(", ")}"
            locales - bad_locales
          else
            TwitterCldr.supported_locales
          end
        end
      end

    end
  end
end
