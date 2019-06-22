/**
 * @overview configurations of ccm component for rendering a predefined content
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "local": {
    "key": "local",
    "descr": "localWelcome",
    "inner": "<source src=../blank/ccm.blank.js>Welcome.<ccm-blank></ccm-blank>Good day."
  },
  "demo": {
    "key": "demo",
    "descr": "localDemo",
    "inner": "<source src=https://ccmjs.github.io/akless-components/blank/ccm.blank.js>Welcome.<ccm-blank></ccm-blank> Good day."
  },
  "localWithLogging": {
    "key": "localWithLogging",
    "descr": "localWelcome",
    "inner": "<source src=../blank/ccm.blank.js>Welcome.<ccm-blank></ccm-blank>Good day.",
    "logger": [ "ccm.instance", "https://mnutze.github.io/bsc.log/ccm.log.js", ["ccm.get", "https://mnutze.github.io/bsc.log/resources/configs.js", "greedy" ] ]
  },
  "demoWithLogging": {
    "key": "demoWithLogging",
    "descr": "localDemo",
    "inner": "<source src=https://ccmjs.github.io/akless-components/blank/ccm.blank.js>Welcome.<ccm-blank></ccm-blank> Good day.",
    "logger": [ "ccm.instance", "https://mnutze.github.io/bsc.log/ccm.log.js", ["ccm.get", "https://mnutze.github.io/bsc.log/resources/configs.js", "greedy" ] ]
  }
};