$:.unshift File.join(File.dirname(__FILE__), 'lib')
require 'twitter_cldr/js/version'

Gem::Specification.new do |s|
  s.name     = "twitter_cldr_js"
  s.version  = ::TwitterCldr::Js::VERSION
  s.authors  = ["Cameron Dutro"]
  s.email    = ["cdutro@twitter.com"]
  s.homepage = "https://twitter.com"

  s.description = s.summary = "Provides date, time, number, and list formatting functionality for various Twitter-supported locales in Javascript."

  s.platform = Gem::Platform::RUBY
  s.summary  = "Text formatting using data from Unicode's Common Locale Data Repository (CLDR)."

  s.add_dependency 'json'
  s.add_dependency 'railties', '>= 3.0'

  s.add_development_dependency 'rake'
  s.add_development_dependency 'mustache',                '~> 0.99.4'
  s.add_development_dependency 'ruby_parser',             '~> 2.3.1'
  s.add_development_dependency 'uglifier',                '~> 1.2.4'
  s.add_development_dependency 'coffee-script',           '~> 2.2.0'
  s.add_development_dependency 'coffee-script-source',    '~> 1.8.0'
  s.add_development_dependency 'cldr-plurals',            '~> 1.0.0'
  s.add_development_dependency 'cldr-plurals-runtime-js', '~> 1.1.0'

  s.require_path = 'lib'

  gem_files       = Dir["{lib,spec}/**/*", "Gemfile", "History.txt", "LICENSE", "NOTICE", "README.md", "Rakefile", "twitter_cldr_js.gemspec"]
  excluded_files  = %w[]
  versioned_files = `git ls-files`.split("\n")

  s.files = (gem_files - excluded_files) & versioned_files
end
