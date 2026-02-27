module.exports = {
  "id": "backstop_default",
  "viewports": [
    {
      "label": "phone",
      "width": 320,
      "height": 480
    },
    {
      "label": "tablet",
      "width": 1440,
      "height": 768
    }
  ],
  "scenarios": [
    {
      "label": "Osuny test : ",
      "url": "http://localhost:PORT",
      "referenceUrl": "",
      "readyEvent": "",
      "readySelector": "",
      "delay": 200,
      "hideSelectors": ['.d-help', '.orejime-Banner'],
      "removeSelectors": ['img'],
      "hoverSelector": "",
      "clickSelector": [".menu .nav-level-1 > li.has-children > a", ".header-button"],
      "postInteractionWait": 0,
      "selectors": [],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold" : 10,
      "requireSameDimensions": false
    }
  ],
  "paths": {
    "bitmaps_reference": "../../backstop_data/bitmaps_reference",
    "bitmaps_test": "../../backstop_data/bitmaps_test",
    "engine_scripts": "../../backstop_data/engine_scripts",
    "html_report": "../../backstop_data/html_report",
    "ci_report": "../../backstop_data/ci_report"
  },
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": ["--no-sandbox"]
  },
  "asyncCaptureLimit": 5,
  "asyncCompareLimit": 50,
  "debug": false,
  "debugWindow": false
}
