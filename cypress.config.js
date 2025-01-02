const { defineConfig } = require('cypress')

module.exports = defineConfig({
   chromeWebSecurity: false,
   e2e: {
      baseUrl: 'https://notes-serverless-app.com',
      env: {
         viewportWidthBreakpoint: 768,
      },
      defaultCommandTimeout: 15000,
      responseTimeout: 70000,
      setupNodeEvents(on, config) {
      // implement node event listeners here
      },
   },
})
