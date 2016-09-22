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

let userName = cli.input[0].trim();

let link = `https://github.com/${userName}`;

got(link)
  .then(res => {
    let $ = cheerio.load( res.body );

    let result = $('span.d-block').children();

    if (result.length < 1) {
      console.log(`
        You might want to use another query. This one is returning an empty result.
      `);
    }

    let attribs = Object.keys(result).map( (idx) => {
      return result[idx].attribs;
    });

    // filter out junk data then push to hrefs (_root, length, prevObjects...)
    attribs.forEach( (attr, idx) => {
      if ( attr && attr.href ) {
        open(`https://github.com${ attr.href }`);
      }
      // exit at (6 - 1)th iteration because as of now 9/21/2016 the max of pinned repos is 6
      if (idx == 5) {
          process.exit()
      }
    });
  
  }).catch(err => {
    throw new Error(err);
  })

// Thanks for taking the time to read the source code
// submit a PR if something has broken (or better implementation)
