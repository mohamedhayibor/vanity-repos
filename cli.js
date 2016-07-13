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

    let result = $('ul.boxed-group-inner').children().children();

    if (result.length < 1) {
      console.log(`
        You might want to use another query. This one is returning an empty result.
      `);
    }

    // console.log('result: ', result);
    let attribs = Object.keys(result).map( (idx) => {
      return result[idx].attribs;
    });

    // filter out junk data then push to hrefs (_root, length, prevObjects...)
    attribs.forEach( attr => {
      if ( attr && attr.href ) {
        open(`https://github.com${ attr.href }`);
      }
    });

  }).catch(err => {
    throw new Error(err);
  })
