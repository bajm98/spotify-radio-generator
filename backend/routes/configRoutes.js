const express = require('express')
const fs = require('fs')
const router = express.Router()

// POST /save-config
router.post('/save-config', (req, res) => {
  const config = req.body

  fs.writeFile('playlist_config.json', JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error('Error saving config:', err)
      return res.status(500).send('Failed to save config')
    }
    res.send('Config saved successfully')
  })
})

module.exports = router
