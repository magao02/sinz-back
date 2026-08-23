const mongoose = require('mongoose');
const config = require('@config');

module.exports = () =>  {
    const env = process.env.NODE_ENV || 'dev';
    let DB_URL;
    if (env === "prod") {
        console.log('Conectando com banco de produção...')
        DB_URL = config.db.production;
    } else if (env === "dev") {
        console.log('Conectando com banco de desenvolvimento...')
        DB_URL = config.db.develop;
    } else if (env === "teste") {
        console.log('Conectando com banco de teste...')
        DB_URL = config.db.teste;
    } else {
        console.log(`NODE_ENV value '${env}' is not recognized. Defaulting to 'dev'.`);
        DB_URL = config.db.develop;
    }
    
    mongoose.set('useFindAndModify', false);
    
    if (!DB_URL) {
        throw new Error('Database URL is undefined. Provide the environment variable DB_URL_DEV (or DB_URL_PROD/DB_URL_TESTE) and/or set NODE_ENV appropriately.');
    }
    mongoose.connection.on('connected', () => {
        console.log('Conectado com o banco de dados!');
    })

    mongoose.connection.on('error', (err) => {
        console.log("Erro na conexão com o banco de dados: " + err);
    });

    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        poolSize: 5,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
}