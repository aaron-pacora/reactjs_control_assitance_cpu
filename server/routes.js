const routes = require('next-routes');

// Name   Page      Pattern
module.exports = routes()                                // ----   ----      -----                                        // about  about     /about
   .add('consola/platos', '/consola/platos/:id')                           // blog   blog      /blog/:slug
