const express = require("express")
const cors = require("cors")
const dbo = require("./db/conn")

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// Include the record routes
app.use("/api", require("./routes/record"))

app.get("/api/ping", (req, res) => res.json({ ok: true }))
app.get("/health", (req, res) => res.send("ok"))

// Connect to MongoDB and start server
dbo.connectToMongoDB(function (err) {
    if (err) {
        console.error("Failed to connect to MongoDB:", err)
        process.exit(1)
    }
    
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`backend listening on ${PORT}`)
        console.log("Connected to MongoDB database")
    })
})
