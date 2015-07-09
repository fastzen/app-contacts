/*
 * This is a custom configuration file that overrides the standard configuration.
 * A value on the aurelia-app attribute in index.html specifies this file.
 */

// https://stackoverflow.com/a/30901603
// https://github.com/aurelia/dependency-injection/issues/32#issuecomment-104233948
// https://stackoverflow.com/a/30643943
import PouchDB from 'pouchdb';

export function configure(aurelia) {

  console.log('Using custom configuration', aurelia);

  let db = new PouchDB('app-contacts');
  aurelia.container.registerInstance( 'db', db );

  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.start().then(a => a.setRoot());
}
