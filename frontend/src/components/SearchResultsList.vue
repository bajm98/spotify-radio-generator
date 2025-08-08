<template>
  <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
    <li
      v-for="(podcast, index) in podcasts"
      :key="index"
      :class="
        index === 0
          ? 'pb-3 sm:pb-4'
          : index === podcasts.length - 1
          ? 'pt-3 pb-0 sm:pt-4'
          : 'py-3 sm:py-4'
      "
    >
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <div class="shrink-0">
          <!-- <img
            :src="podcast.image"
            :alt="`${podcast.name} image`"
            class="w-8 h-8 rounded-full"
          /> -->
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-black truncate">
            {{ podcast.podcastName }}
          </p>
          <!-- <p class="text-sm text-gray-500 truncate dark:text-gray-400">
            {{ podcast.email }}
          </p> -->
        </div>
        <div
          class="inline-flex items-center text-base font-semibold text-gray-900"
        >
          <button
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
const podcasts = [
  {
    podcastName: "Fifty states",
  },
];
</script>
