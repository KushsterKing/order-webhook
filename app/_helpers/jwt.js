const expressJwt = require('express-jwt');
const config = require('./config');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication

            '/v1/admin/auth',
            '/v1/admin/auth/forgot-password',
            '/v1/admin/auth/change-password',
            '/v1/admin/auth/check-user',
            /^\/v1\/admin\/auth\/reset-password\/*/,
            '/v1/admin/auth/reset-password',
            /^\/v1\/admin\/auth\/tfa\/*/

        ]
    });
}

/*
async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};*/
