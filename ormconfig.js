// module.exports = {
//   type: 'sqlite',
//   database: 'db.sqlite',
//   entities:
//     process.env.Node_ENV === 'development'
//       ? ['**/*.entity.js']
//       : ['**/*.entity.ts'],
//   synchronize: false,
// };

var dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.Node_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {});
    break;
  default:
    throw new Error('Unknown Environment');
}

module.exports = dbConfig;
