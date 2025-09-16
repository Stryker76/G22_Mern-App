const { MongoClient } = require("mongodb")
const Db = process.env.ATLAS_URI
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
})

var _db

module.exports = {
    connectToMongoDB: async function (callback) {
        try {
            console.log("Attempting to connect to MongoDB at:", Db)
            await client.connect()
            _db = client.db("employees")
            console.log("Successfully connected to MongoDB.")
            
            // Test the connection
            await _db.admin().ping()
            console.log("MongoDB connection ping successful")
            
            return callback(null)
        } catch (error) {
            console.error("MongoDB connection failed:", error.message)
            return callback(error)
        }
    },

    getDb: function () {
        if (!_db) {
            throw new Error("Database not connected! Call connectToMongoDB first.")
        }
        return _db
    }
}