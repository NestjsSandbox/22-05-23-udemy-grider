const dbConfig = {
    synchronize: false //!setting synchronize to false is the most 
                      //! important thing to remember, otherwise typeorm 
                      //! will do auto-migration and may delete whole 
                      //! colums from production db table .
}

switch(process.env.NODE_ENV){
    case 'dev' : 
        Object.assign(dbConfig, 
            {
                type: 'sqlite',
                database: 'db.sqlite',
                //for dev we use the transpiled version of the entity
                //files so we use the 'entity.js' js extension.
                entities: ['**/*.entity.js'], 
            });
    break;
     
    case 'test': 
    Object.assign(dbConfig, 
        {
            type: 'sqlite',
            database: 'test.sqlite',
            // When dealing with jest (ts-jest) it expects a 'ts'
            // file so we give it all the entity files with extension 'ts'.
            entities: ['**/*.entity.ts'],
           
        });
    break;
    case 'prod':
    break;
    default: 
        throw new Error('Unknown enviorement case.');
}

module.exports = dbConfig;