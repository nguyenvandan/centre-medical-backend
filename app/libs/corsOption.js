const whitelist = process.env.CORS ? process.env.CORS.split(',') : [];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions = {
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'X-Requested-With',
      'Content-Type',
      'Authorization',
      'x-access-token'
    ]
  };
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions['origin'] = true;
  } else {
    corsOptions['origin'] = false;
  }
  callback(null, corsOptions);
};

module.exports = corsOptionsDelegate;
