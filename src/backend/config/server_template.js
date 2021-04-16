module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: '$REACT_APP_CMS_BASE_URL',
  admin: {
    auth: {
      // url: '$PUBLIC_URL/dashboard',
      secret: env('ADMIN_JWT_SECRET', '$ADMIN_JWT_SECRET'),
    },
  },
});
 