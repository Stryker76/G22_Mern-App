const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000
const ATLAS_URI = process.env.ATLAS_URI || "mongodb://appuser:pass@mongo:27017/employees?authSource=employees"

mongoose.set("strictQuery", false)
mongoose.connect(ATLAS_URI)
  .then(() => console.log("mongo connected"))
  .catch(err => console.error("mongo connect error", err.message))

app.get("/api/ping", (req, res) => res.json({ ok: true }))
app.get("/health", (req, res) => res.send("ok"))

app.listen(PORT, "0.0.0.0", () => {
  console.log(`backend listening on ${PORT}`)
})
