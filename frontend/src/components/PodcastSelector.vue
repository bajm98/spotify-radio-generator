<template>
  <SearchBar @search="searchShow" />
  <SearchResultsList />
  <SelectedPodcastsList />
</template>

<script setup>
import SearchBar from "./SearchBar.vue";
import SearchResultsList from "./SearchResultsList.vue";
import SelectedPodcastsList from "./SelectedPodcastsList.vue";

const searchShow = async (query) => {
  try {
    const results = await fetch(
      `http://localhost:8888/search-show?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!results.ok) {
      throw new Error("Failed to search for show");
    }
    const data = await results.json();
    console.log("Search results:", data);
  } catch (err) {
    console.error(err);
    alert("Error searching for show");
  }
};
</script>
