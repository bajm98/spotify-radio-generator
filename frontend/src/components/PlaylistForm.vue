<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Generate Your Playlist</h1>

    <label class="block mb-2 font-medium">Mood</label>
    <input
      v-model="form.mood"
      type="text"
      class="w-full p-2 border rounded"
      placeholder="e.g., focus, chill, party"
    />

    <button
      @click="sendConfig"
      class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Send to Backend
    </button>
    <button
      @click="generatePlaylist"
      class="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
    >
      Generate Playlist
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        mood: '',
        musicUris: [],
        podcastShowIds: [
          "4wMWrabr79pA104WEAkcH3",
          "2iWpUooqcICF9rwKbBqnna",
          "22dXMEJz1TFoEgSHddQKE6",
          "32dMfniCyjGYCc25zZ8BFk",
          "2ceI3IzPwHJywfQTAtrQSI",
          "1UqC9vb9bmugCK23m14MLs",
          "7trRb7PXoTNX9kbEKZI5uY",
          "3IM0lmZxpFAY7CwMuv9H4g"
        ],
        playlistName: "🚀 Ma radio du matin",
        playlistDescription: "Générée avec un script",
        searchTracks: [],
        playlistIds:[
            /*"6hgpUqWNT35jbw3e6Tm9KO"*/
            "5Jpx8ZK0lOu0zWGuFuEGAw"
        ],
      }
    }
  },
  methods: {
    async sendConfig() {
      try {
        const response = await fetch('http://localhost:8888/save-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        })

        if (!response.ok) {
          throw new Error('Failed to save config')
        }

        alert('Config saved successfully!')
      } catch (err) {
        console.error(err)
        alert('Error saving config')
      }
    },

    async generatePlaylist() {
      try {
        const response = await fetch('http://localhost:8888/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        })

        if (!response.ok) {
          throw new Error('Failed to generate playlist')
        }

        const data = await response.json()
        console.log('Playlist created:', data)
        alert('Playlist generated successfully!')
      } catch (err) {
        console.error(err)
        alert('Error generating playlist')
      }
    }
  }
}
</script>

<!--<script setup>
import { reactive } from 'vue'

const form = reactive({
  mood: ''
})

// Export JSON file (e.g., playlist_config.json)
function downloadConfig() {
  const blob = new Blob([JSON.stringify(form, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'playlist_config.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>-->
