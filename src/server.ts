import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string); // Connect to database

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

// Handle error from outside of the process(unhandledRejection)
process.on('unhandledRejection', (err) => {
  console.log(`unahandledRejection is detected:  ${err}`);
  if (server) {
    server.close(() => {
      mongoose.disconnect();
      process.exit(1);
    });
  }
  mongoose.disconnect();
  process.exit(1);
});

// Handle error from outside of the process(uncaughtException)
process.on('uncaughtException', (err) => {
  console.log(`uncaughtException is detected:  ${err}`);
  mongoose.disconnect();
  process.exit(1);
});
