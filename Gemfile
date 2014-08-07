source "http://rubygems.org"

gemspec

# TODO: remove and put into gemspec once new twitter-cldr-rb is released
gem 'twitter_cldr', :github => 'twitter/twitter-cldr-rb', :branch => 'kl_regions'

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
