/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const injectDevServer = require('@cypress/react/plugins/react-scripts');
const { connect } = require('./db');

module.exports = async (on, config) => {
  injectDevServer(on, config);

  const db = await connect();

  on('task', {
    async clearNews() {
      console.log('Clear news');

      await db.dropCollection('news', (err, delOK) => {
        if (err) console.error('Collection doesn\'t exist');
        if (delOK) console.log('Collection dropped');
      });

      return null;
    },

    async clearUsers() {
      console.log('Clear users');

      await db.dropCollection('users', (err, delOK) => {
        if (err) console.error('Collection doesn\'t exist');
        if (delOK) console.log('Collection dropped');
      });

      return null;
    },
  });

  return config;
};
