const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class usersRepository{
    constructor(fileName) {
        if (!fileName) throw new Error('Creating repo requires a filename');
        this.fileName = fileName;
        try {
            fs.accessSync(this.fileName);
        } catch(error) {
            fs.writeFileSync(this.fileName, '[]');
        }
    }

    //custom json db methods

    async getAll() {
        //open this.fileName, then read it, parse it, return parsed data
        const content = JSON.parse(await fs.promises.readFile(this.fileName, {
            encoding: 'utf8'
        }));

        return content;
    }

    async create(attributes) {
        attributes.id = this.generateId();
        //hash password
        const salt = crypto.randomBytes(8).toString('hex');
        const buffer = await scrypt(attributes.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attributes,
            password: `${buffer.toString('hex')}.${salt}`
        };
        records.push(record);

        //write to file the new attributes
        await this.writeAll(records);
        return record;
    }

    async comparePass(savedPass, supplyPass) {
        const [hashedPass, salt] = savedPass.split('.');
        const supplyHashBuffer = await scrypt(supplyPass, salt, 64);

        return supplyHashBuffer.toString('hex') === hashedPass;
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.fileName, JSON.stringify(records, null, 2));
    }

    generateId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOneRecord(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRec = records.filter(record => record.id !== id);
        await this.writeAll(filteredRec);
    }

    async update(id, attributes) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id)

        if (!record) throw new Error(`Record with id: ${id} not found`);

        Object.assign(record, attributes);

        await this.writeAll(records);
    }

    async getOneAttribute(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;
            for (let key in filters) {
                if (record[key] !== filters[key]) found = false;
            }

            if (found) return record;
        }
    }
}
//we are gonna export an instance of it instead of creating a new instance in other files
module.exports = new usersRepository('users.json');