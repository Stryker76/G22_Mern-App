import React from "react"
import { createRoot } from "react-dom/client"
function App(){ return (<div style={{fontFamily:"sans-serif",padding:"1rem"}}><h1>Frontend up</h1><p>Vite on port 3000</p></div>) }
createRoot(document.getElementById("root")).render(<App/>)
