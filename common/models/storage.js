/**
 * Filename: storage.js
 * Use: Declare functions for storage data model
 * Creator: core
 * Date: unknown
 */

'use strict';

module.exports = (Storage) => {
  /**
   * Use: set unique name
   *
   * Author: core
   *
   * Last Updated: unknown
   */
  Storage.afterRemote('upload', (ctx, data, next) => {
    // FIXME: seems redundant because we use names from database, not file system

    // console.log(ctx)
    // console.log(ctx.req.query)
    // const newName = ctx.req.query.name
    // const { container, name } = data.result.files.file[0]

    // //
    // // file wants to be renamed
    // if (newName) {
    //   //
    //   // pipe old file as new with new name
    //   let dlData = []
    //   let dlStream = Storage.downloadStream(container, name)
    //   let ulStream = Storage.uploadStream(container, newName)
    //   dlStream.pipe(ulStream)
    //   ulStream.on('finish', () => {
    //     Storage.removeFile(container, name, (err) => {
    //       next()
    //     })
    //   })
    // } else next()
    next();
  });
};
