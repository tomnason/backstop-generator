require('dotenv').config();

const rp = require('request-promise');
const fs = require('fs');

const referenceUrl = process.env.REFERENCE_URL;
const referenceUrlSitemap = process.env.REFERENCE_URL_XML_SITEMAP;
const referredUrl = process.env.REFERRED_URL;
const delay = process.env.DELAY || 2000;

console.log("Reference Url: " + referenceUrl);
console.log("Referred Url: " + referredUrl);
console.log("Sitemap: " + referenceUrlSitemap);
console.log("Delay: " + delay);


rp(referenceUrlSitemap).then(html => {
  const $ = require('cheerio').load(html, { 
    xmlMode: true,
    ignoreWhitespace: true
   });

   let urlList = $('urlset url loc').toArray().map(elem => $(elem).text().replace("https://www.tresillian.org.au", ""));

   console.log("Scenarios discovered: " + urlList.length)
  const scenarios = [];

  urlList.forEach(function(url) {
    scenarios.push({
      "label": url,
      "url": referredUrl + url,
      "referenceUrl": referenceUrl + url,
      "cookiePath": "backstop_data/engine_scripts/cookies.json",
      "readyEvent": "",
      "readySelector": "",
      "delay": parseInt(delay),
      "hideSelectors": [],
      "removeSelectors": [".addthis-smartlayers"],
      "hoverSelector": "",
      "clickSelector": "",
      "postInteractionWait": 0,
      "selectors": [
        "main"
      ],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold" : 0.1,
      "requireSameDimensions": true
    });

    console.log("Scenario discovered: " + url)
  })

  // Generate backstop.json file.
  var json = {
    "viewports": [
      {
          "label": "phone",
          "width": 360,
          "height": 740
      },
      {
          "label": "tablet_v",
          "width": 768,
          "height": 1024
      },
      {
          "label": "desktop",
          "width": 1024,
          "height": 768
      }
    ],
    "onBeforeScript": "puppet/onBefore.js",
    "onReadyScript": "puppet/onReady.js",
    "scenarios": scenarios,
    "paths": {
      "bitmaps_reference": "backstop_data/bitmaps_reference",
      "bitmaps_test": "backstop_data/bitmaps_test",
      "engine_scripts": "backstop_data/engine_scripts",
      "html_report": "backstop_data/html_report",
      "ci_report": "backstop_data/ci_report"
    },
    "report": ["browser"],
    "engine": "puppeteer",
    "engineOptions": {
      "args": ["--no-sandbox"]
    },
    "asyncCaptureLimit": 25,
    "asyncCompareLimit": 50,
    "debug": true,
    "debugWindow": false,
  };
  let data = JSON.stringify(json);
  fs.writeFileSync('backstop-xml.json', data);

})
.catch(err => {
    console.log(err);
})
