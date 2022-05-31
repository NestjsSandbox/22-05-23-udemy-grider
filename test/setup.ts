import { rm } from "fs/promises";
import { join } from "path";
import { getConnection } from 'typeorm';

//Delete the test.sqlite file before starting a new test suite
global.beforeEach( async () => {
    try{
        await rm(join(__dirname , '..', 'test.sqlite'));
    } catch (err) {
        //We wont handle the error case of cant remove file that doesnt exist, just ignore if it happens.
    }
})

//Disconnect the TypeOrm from the db after each test case (after each 'it' function)
global.afterEach(async () => {
    const conn = getConnection(); //todo 'getConnection' is deprecated, update to new syntax
    await conn.close(); //todo 'getConnection.close' is deprecated, update to new syntax
})
