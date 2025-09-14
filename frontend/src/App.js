import React, { useEffect, useState } from "react"
export default function App() {
  const [ping, setPing] = useState("")
  useEffect(() => {
    fetch((process.env.REACT_APP_API || "/api") + "/ping")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(j => setPing(JSON.stringify(j)))
      .catch(() => setPing("error"))
  }, [])
  return (
    <div style={{fontFamily:"system-ui, Arial", padding:"1rem"}}>
      <h1>Employee Manager</h1>
      <p>Frontend is running on port 3000.</p>
      <p>Backend ping: {ping || "..."}</p>
    </div>
  )
}
