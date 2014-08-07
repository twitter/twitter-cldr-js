source "http://rubygems.org"

gemspec

# gem 'twitter_cldr', :github => 'twitter/twitter-cldr-rb', :branch => 'kl_regions'
gem 'twitter_cldr', :path => '../twitter-cldr-rb'

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
end
