#!/usr/bin/env node
'use strict';
const meow = require('meow');
const open = require('open');
const got = require('got');
const cheerio = require('cheerio');

const cli = meow(`
  Usage: vanity <username>
  -------------------------
  Examples:
  > vanity tj
  > vanity sindresorhus
  `, {
    alias: {
      'v': 'version',
      'h': 'help'
    }
});

if (cli.input.length > 1) {
  console.log(`
    Sorry, you only need the username buddy.
    -------------------------
    Here are some examples:
    > vanity tj
    > vanity sindresorhus
  `);

  // force automatic exit
  process.exit(1);
}

let userName = cli.input[0];
