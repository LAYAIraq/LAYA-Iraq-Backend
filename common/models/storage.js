'use strict';

module.exports = function(Storage) {
  //
  // set unique name
  Storage.afterRemote('upload', function(ctx, data, next) {
    const newName = ctx.req.query.name;
    const {container, name} = data.result.files.file[0];

    //
    // file wants to be renamed
    if (newName) {
      //
      // pipe old file as new with new name
      let dlData = [];
      let dlStream = Storage.downloadStream(container, name);
      let ulStream = Storage.uploadStream(container, newName);
      dlStream.pipe(ulStream);
      ulStream.on('finish', () => {
        Storage.removeFile(container, name, (err) => {
          next();
        });
      });
    } else next();
  });
};
