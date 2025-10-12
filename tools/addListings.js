import db from "./mongodb.js"
import data from "./addData.json" with { type: "json" }

const result = await db.collection("house").insertMany(data)

console.log(result)
