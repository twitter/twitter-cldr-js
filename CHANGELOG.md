# TwitterCldr.js Changelog

### 3.3.0 (Mar 19, 2023)
* Remove dependency on therubyracer.
    - Both the CoffeeScript and Uglify gems use execjs which means they can evaluate JavaScript with node and don't require a gemified runtime anymore.
* Fix edge cases for long and short decimal formatters (#93, @lionel-rowe)
* Expose available locales and file names (#94, @lionel-rowe)
* Implement data isolation with `TwitterCldr.clone()` (#96, @lionel-rowe)

### 3.2.0 (August 26, 2019)
* Fix postal codes bug causing false positive postal code validation.
* Rebuild data bundles using twitter-cldr-rb 3.1.2.

### 3.1.1
* Hardcode @name to function name. Fixes IE issues with features like NumberFormatter.

### 3.1.0
* Exposed currency display names.

### 3.0.0
* Separated data from the implementation.
    - Now, usage requires two files:
        - `core.js` (the implementation file)
        - `<locale>.js` (data bundle for the required locale, like `en.js`, `es.js`, etc)

### 2.5.0
* Added rule based number formatting.
* Fixed decimal numbers formatting for Hindi.

### 2.4.0
* Ported text segmentation and Unicode regex parser from twitter-cldr-rb.
* Updated plurals and other resources to twitter-cldr-rb v3.1.0 and CLDR v26.
* Added support for ordinal plurals.
* Fixed and issue with single quotes appearing in formatted dates.
* Removed restriction that prevented twitter-cldr-js from being used with Rails 4.

### 2.3.2
* Fixed issue with additional date/time formats where incorrect resolution of aliases in the data caused incorrect formatting.

### 2.3.1
* Fixed issue with currency formatting that ignored the precision option when set to zero.

### 2.3.0
* Fixed issue affecting additional date/time formats that was causing pattern tokens to be interpreted as plaintext.
* Moved twitter-cldr-rb from a runtime to a development dependency.

### 2.2.4
* Upgrading to twitter-cldr-rb 2.4.3 to fix abbreviated timespan issue in en-GB.
* Fixing list formatter issue causing incorrect results when lists contain fewer than 2 elements.

### 2.2.3
* Fixing bad generated javascript.
* Replacing call to trim() with regex to support IE8.

### 2.2.2
* Removing rake version requirement.

### 2.2.1
* Marking compilation dependencies as needed for development only (eg. rubyracer, uglifier, coffeescript, etc).

### 2.2.0
* Upgrading to twitter-cldr-rb 2.4.0, which contains an upgrade to CLDR v23.
* Long and short decimal formatters now respect the 'precision' option.
* Relaxing JSON dependency.

### 2.1.0
* Upgrading to twitter-cldr-rb 2.1.0.
* Added Croatian, Icelandic, and Vietnamese.
* Better currency symbols (actual symbols instead of just letters).
* Better Hebrew units.

### 2.0.0
* Added module alias for twitter.com loadbuilder.
* Added bidi algorithm.
* Included support for approximate timespans.
* Included additional date formats.
* Added short/long decimal support (eg. 1K for 1,000).
* Re-added safety closure, updated to support browser and node.
* Upgraded to twitter-cldr-rb 2.0.0.

### 1.0.0
*  Moved JavaScript compilation files out of twitter-cldr-rb and into their own gem here.
