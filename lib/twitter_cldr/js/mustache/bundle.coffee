###
// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

// TwitterCLDR (JavaScript) v{{version}}
// Authors:     Cameron Dutro [@camertron]
                Kirill Lashuk [@KL_7]
                portions by Sven Fuchs [@svenfuchs]
// Homepage:    https://twitter.com
// Description: Provides date, time, number, and list formatting functionality for various Twitter-supported locales in Javascript.
###

{{#source_map}}
###
//@ sourceMappingURL={{locale}}.map
###
{{/source_map}}

# required alias definition that adds twitter_cldr to Twitter's static build process
###<<module_def>>###

TwitterCldr = {}
{{#is_rtl?}}
TwitterCldr.is_rtl = true;
{{/is_rtl?}}
{{^is_rtl?}}
TwitterCldr.is_rtl = false;
{{/is_rtl?}}
TwitterCldr.locale = "{{current_locale}}";
{{> utilities}}
{{{contents}}}

TwitterCldr.set_data = (bundle) ->
  TwitterCldr.data = bundle
  null

TwitterCldr.get_data = ->
  if (TwitterCldr.data)?
  	TwitterCldr.data
  else
  	throw 'Data not set'

TwitterCldr.is_data_set = ->
  return (TwitterCldr.data)?

root = if exports?
  exports
else
  this.TwitterCldr = {}
  this.TwitterCldr

root[key] = obj for key, obj of TwitterCldr

if this.TwitterCldrDataBundle?
  TwitterCldr.set_data(this.TwitterCldrDataBundle)


