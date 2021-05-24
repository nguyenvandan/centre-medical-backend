import config from '../../config/index';
const { host, port, name, username, password, fullUrl } = config.db;

let url = `mongodb://${host}:${port}/${name}`;

if (username && password) {
  url = `mongodb://${username}:${password}@${host}:${port}/${name}`;
} else if (fullUrl) {
  url = `${fullUrl}/${name}`;
}

module.exports = {
  url: url,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true,
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6,
  }
};
