import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import * as mongoose from 'mongoose';
import * as bodyParser  from "body-parser";

// The Express app is exported so that it can be used by serverless Functions.
export function app() {

  // Connection to database
  mongoose.connect('mongodb+srv://andrei:mongodbpass1!@cluster0-vhq8k.gcp.mongodb.net/stirisuceava?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false })
    .then(() =>  console.log('Connected to stirisuceava database '))
    .catch((err) => console.error(err));

  const server = express();
  const distFolder = join(process.cwd(), 'dist/stirisuceava-fe/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  // Body Parser Middleware
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Setup routes for REST API
  const routes = require("./controller/controller.js");
  server.use("/", routes);

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
