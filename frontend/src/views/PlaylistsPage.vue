<template>
  <div class="p-4 bg-gray-100">
    <button
      @click="showForm = true"
      class="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Create playlist
    </button>

    <Form v-if="showForm" @submitted="handleFormSubmit" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Form from "../components/Form.vue";
import Search from "../components/SearchBar.vue";

const showForm = ref(false);

function handleFormSubmit(data) {
  console.log("Received form data:", data);
  showForm.value = false; // optional: hide after submit
}
</script>
