import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Serve dist as static
app.use(express.static(join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript')
    if (path.endsWith('.css')) res.setHeader('Content-Type', 'text/css')
  }
}))

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  const indexPath = join(__dirname, 'dist/index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send('Build not found. Run npm run build first.')
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🐴 HorseCost running on port ${PORT}`)
})
