require('dotenv').config();

const rp = require('request-promise');
const fs = require('fs');

const referenceUrl = process.env.REFERENCE_URL;
const referredUrl = process.env.REFERRED_URL;
const delay = process.env.DELAY || 2000;
const selector = process.env.LINK_SELECTOR || 'a';

console.log("Reference Url: " + referenceUrl);
console.log("Referred Url: " + referredUrl);
console.log("Selector: " + selector);
console.log("Delay: " + delay);

rp(referenceUrl).then(html => {
  const $ = require('cheerio').load(html);
  const linkObjects = $(selector, html);
  const links = [];
  
  linkObjects.each(function (index, element) {
    let title = $(element).text().replace(/(\r\n|\n|\r)/gm, "").trim();
    if (title !== undefined && title != '' &&  element.attribs.href != '#' && !links.some(el => el.href === element.attribs.href)) {
      links.push({
          href: element.attribs.href,
          title: title
      });
      
      console.log("Scenario discovered: " + element.attribs.href)
    }
  })

  const scenarios = [];

  links.forEach(function(element) {
    scenarios.push({
      "label": element.title,
      "url": referredUrl + element.href,
      "referenceUrl": referenceUrl + element.href,
      "cookiePath": "backstop_data/engine_scripts/cookies.json",
      "readyEvent": "",
      "readySelector": "",
      "delay": parseInt(delay),
      "hideSelectors": [],
      "removeSelectors": [],
      "hoverSelector": "",
      "clickSelector": "",
      "postInteractionWait": 0,
      "selectors": [ "main"],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold" : 0.1,
      "requireSameDimensions": true
    });
  })

  console.log("Scenarios added: " + scenarios.length)

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
  fs.writeFileSync('backstop-html.json', data);

})
.catch(err => {
    console.log(err);
})
