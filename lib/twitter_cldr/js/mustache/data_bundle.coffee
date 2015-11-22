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


TwitterCldrDataBundle =
{{{contents}}}

root = if exports?
  exports
else
  this.TwitterCldrDataBundle = {}
  this.TwitterCldrDataBundle

root[key] = obj for key, obj of TwitterCldrDataBundle

if this.TwitterCldr?
  if this.TwitterCldr.is_data_set()
    this.TwitterCldr.get_data()
  else
    this.TwitterCldr.set_data(TwitterCldrDataBundle)
