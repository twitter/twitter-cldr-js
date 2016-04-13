# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

$:.unshift File.join(File.dirname(__FILE__), 'lib')

require 'rubygems' unless ENV['NO_RUBYGEMS']

require 'bundler'
require 'digest'
require 'fileutils'
require 'rexml/document'

require 'rspec/core/rake_task'
require 'rubygems/package_task'

require './lib/twitter_cldr/js'

Bundler::GemHelper.install_tasks

task :default => :spec

desc 'Run specs'
task :spec => ["spec:ruby", "spec:js"]

desc 'Run Ruby specs'
RSpec::Core::RakeTask.new("spec:ruby") do |t|
  t.pattern = './spec/**/*_spec.rb'
end

desc 'Run JavaScript specs'

task "spec:js" do
  run_tests()
end

task "spec:js:full" do
  ENV["FULL_TEST_SUITE"] = "True"
  run_tests()
end

def run_tests
  ENV["LOCALES"] = "en,ar,ko,ru,hi"
  Rake::Task["twitter_cldr:js:update_for_test"].invoke

  puts "\nJasmine Specs"

  if `which jasmine-node`.strip.empty?
    puts "ERROR: You need to install jasmine-node to run JavaScript tests:"
    puts "  `npm install jasmine-node -g`"
    exit 1
  else
    system "jasmine-node #{File.dirname(__FILE__)}"
    exit $?.exitstatus
  end
end

load "./lib/twitter_cldr/js/tasks/tasks.rake"
