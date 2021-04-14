module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: '$PUBLIC_URL/api',
  admin: {
    auth: {
      // url: '$PUBLIC_URL/dashboard',
      secret: env('ADMIN_JWT_SECRET', 'cde9090693ee5ce2b00542ee965a60d8'),
    },
  },
});
 