/**
 * Assign __env to the root window object.
 *
 * The goal of this file is to allow the deployment
 * process to pass in environment values into the application.
 *
 * The deployment process can overwrite this file to pass in
 * custom values:
 *
 * window.__env = window.__env || {};
 * window.__env.url = 'some-url';
 * window.__env.key = 'some-key';
 *
 * Keep the structure flat (one level of properties only) so
 * the deployment process can easily map environment keys to
 * properties.
 * Refence: http://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/
 */

(function (window) {
  window.__env = window.__env || {};
  var environment = 'Prod';
  // API url
  // For demo purposes we fetch from local file in this plunk
  // In your application this can be a url like https://api.github.com
  window.__env.apiUrl = environment == 'Prod' ? 'https://ijdomingo-api-prod.herokuapp.com/api/' : environment == 'Dev' ? 'https://ijdomingo-api.herokuapp.com/api/' : 'http://localhost:1245/api/' ;

}(this));