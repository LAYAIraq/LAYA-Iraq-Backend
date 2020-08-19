'use strict';

module.exports = function(server) {
    let {Account, Role, RoleMapping} = server.models;

  //
  // test account
    Account.findOrCreate({where: {email: 'test@laya'}}, {
        email: 'test@laya',
        username: 'test',
        password: 'test',
    }, (err, test) => {
        if (err) {
        return console.error(err);
        }

        //
        // Set Role
        Role.findOrCreate({where: {name: 'test'}}, {
        name: 'test',
        }, (err, role) => {
            if (err) {
                return console.error(err);
            }

            role.principals.find({
                where: {principalId: test.id},
            }, (err, principals) => {
                if (err) {
                return console.error(err);
                }

                // create if needed
                if (principals.length == 0) {
                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: test.id,
                }, (err, principal) => {
                    if (err) {
                    return console.error(err);
                    }
                    return console.log('Test Role Principal created:', principal);
                });
                }

                if (principals.length == 1) {
                return console.log('Test Role Principal exists');
                }

                if (principals.length > 1) {
                throw console.error('Multiple Test Role Principals exist!');
                }
            });
        });
    });
};

