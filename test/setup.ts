import { rm } from "fs/promises";
import { join } from "path";
import { getConnection } from 'typeorm';

global.beforeEach( async () => {
    try{
        await rm(join(__dirname , '..', 'test.sqlite'));
    } catch (err) {
        //We wont handle the error case of cant remove file that doesnt exist, just ignore if it happens.
    }
})

global.afterEach(async () => {
    const conn = getConnection();
    await conn.close();
})
