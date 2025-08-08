<template>
  <form @submit.prevent="submit" class="mt-4 border p-4 rounded shadow">
    <label class="block mb-2">
      Playlist Name:
      <input
        v-model="form.playlistName"
        type="text"
        class="border p-2 w-full"
        required
      />
    </label>
    <PodcastSelector />
    <button
      type="submit"
      class="mt-2 bg-green-500 text-white px-4 py-2 rounded"
    >
      Submit
    </button>
  </form>
</template>

<script setup>
import { reactive } from "vue";
import PodcastSelector from "./PodcastSelector.vue";
const emit = defineEmits(["submitted"]);

const form = reactive({
  playlistName: "",
});

function submit() {
  emit("submitted", { ...form });
}
</script>
