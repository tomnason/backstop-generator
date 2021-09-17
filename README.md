# Introduction

Simple utility for generating lengthy BackstopJS test scenario configs. 

Can generate via two methods:
* Scraping a page looking for anchor selectors (as specified in env file)
* Parsing XML sitemap and including all URLs


# Installation steps
* Install latest version of node.js.
* Run `npm install` to get dependencies
* Create a `.env` file inside the folder.
   * `REFERENCE_URL` - Give the absolute reference website URL. The screenshots from this URL will be used as base URL.
   * `REFERRED_URL` - Give the absolute referred website URL. If this url is behind a htaccess, pass the credentials in the URL.
   * `REFERENCE_URL_XML_SITEMAP` - Absolute path to XML sitemap, if using this option
   * `DELAY` - Give the delay in ms. This is the time the script wait to take the screenshot. If site relies on async JS to build pages consider increasing this.
   * `LINK_SELECTOR` - Give a selector which will be used to grab all the href tests, to run visual regression tests. Keeping it empty would take all the anchor tags from the `REFERENCE_URL`.

## Generating scenarios
* `npm run default` - generates a default, largely empty config needed to run backstopJS. Template only.
* `npm run generate-html` - generates `backstop-html.json` file with all the scenarios matching the selector `LINK_SELECTOR`
* `npm run generate-xml` - as above but for sitemaps. Creates `backstop-xml.json` from all URLS found in `REFERENCE_URL_XML_SITEMAP`
* `npm run reference` to generate the screenshots for reference websites.


## Updating scenarios
Once the scripts have generated the configuration files, their role is finished. 

You will likely need to tweak scenarios to suit the use case at hand. Adding interactions, delays, showing and hiding selectors etc. See [BackstopJS](https://github.com/garris/BackstopJS) for a full list of options.

Larger test suites take a long time to run and can be brittle. Suggest splitting into individual config files and running separately. 

e.g.
```
backstop-common-elements.json //might include header, footer, menus etc
backstop-full-test.json //extensive tests for major releases that cover many scenarios
backstop-spot-test.json //quick tests of only key pages or components
```

Run individual test configs with:
```
backstop  --config="backstop-common-elements.json" --docker reference
backstop  --config="backstop-common-elements.json" --docker test
```

## Known issues

* Does not handle absolute URLs

## Credits
[BackstopJS](https://github.com/garris/BackstopJS)

[Forked generator script repo](https://github.com/gauravgoyal/backstopJS-generator)