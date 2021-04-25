/**
 * Filename: 03-enable-auth.js
 * Use: enable authentication for server
 * Creator: core
 * Date: unknown
 */

'use strict'

module.exports = function(server) {
  // server.enableAuth({dataSource: 'memory'})
  server.enableAuth()
  console.log('Auth enabled')
}
