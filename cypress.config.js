const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 1080,
  experimentalModifyObstructiveThirdPartyCode: true,
  defaultCommandTimeout: 25000,
  pageLoadTimeout: 35000,
  requestTimeout: 35000,
  experimentalMemoryManagement: true,
  screenshotOnRunFailure: false,
  retries: 1,
  e2e: {
    baseUrl: "https://huai-sian.github.io/Travel-Taiwan/#/",
    testIsolation: true,
  },
  env: {
    environment: "alpha",
  },
});
