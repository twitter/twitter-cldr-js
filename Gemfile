source "http://rubygems.org"

gemspec

group :test do
  gem 'rspec', '~> 2.11.0'
  gem 'rr',    '~> 1.0.4'

  platform :mri_18 do
    gem 'rcov'
  end
end

group :development, :test do
  gem 'pry'
  gem 'pry-nav'
  gem 'twitter_cldr', path: '~/workspace/twitter-cldr-rb' #, '~> 3.0.0'
  gem 'ruby-cldr', path: '~/workspace/ruby-cldr'
end
