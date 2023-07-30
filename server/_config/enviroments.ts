export const environment = {
    production: {
        connect: process.env.MONGO_PRODUCTION
    },
    development: {
        connect: process.env.MONGO_DEV
    },
    local: {
        connect: process.env.MONGO_LOCAL
    }
  };
