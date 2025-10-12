import { MongoClient } from "mongodb";
import fs from "fs"

let uri = ""
try {
    uri = fs.readFileSync('../.env.local', 'utf8').substring(12);
} catch (err) {
    console.error('Error reading file synchronously:', err);
}

const client = new MongoClient(uri);
const db = client.db("houseFindingProject");

export default db