const express = require("express")
const cors = require("cors")
const dbo = require("./db/conn")

const app = express()

// Enhanced CORS configuration for public IP access
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true)
        
        // Allow any origin in development
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true)
        }
        
        // In production, you should specify allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'https://localhost:3000',
            'http://localhost',
            'https://localhost'
            // Add your domain here: 'https://yourdomain.com'
        ]
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

const PORT = process.env.PORT || 5000

// Include the record routes
app.use("/api", require("./routes/record"))

app.get("/api/ping", (req, res) => res.json({ ok: true }))
app.get("/health", (req, res) => res.send("ok"))

// MongoDB health check endpoint
app.get("/api/health/db", async (req, res) => {
    try {
        const db = dbo.getDb()
        await db.admin().ping()
        res.json({ 
            status: "healthy", 
            database: "connected",
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        res.status(500).json({ 
            status: "unhealthy", 
            database: "disconnected",
            error: error.message,
            timestamp: new Date().toISOString()
        })
    }
})

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
