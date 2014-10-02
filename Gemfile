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
  gem 'twitter_cldr', :github => 'twitter/twitter-cldr-rb', :branch => 'updated_plurals_v26'
end
