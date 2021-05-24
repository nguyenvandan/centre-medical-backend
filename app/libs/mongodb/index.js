import mongoose from 'mongoose';
import mongodbConfig from './../../config/mongodb';

module.exports = {
  close: callback => {
    mongoose.connection.close(() => {
      callback();
    });
  },
  connect: callback => {
    // mongoose.connect("mongodb://mongo:27018/Samp_data");
    mongoose.connect(mongodbConfig.url, mongodbConfig.options);

    mongoose.connection.on('connected', () => {
      callback();
    });

    mongoose.connection.on('error', err => {
      callback(err);
    });

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log(
          'Mongoose default connection disconnected through app termination'
        );
        process.exit(0);
      });
    });
  }
};
