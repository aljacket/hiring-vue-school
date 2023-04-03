<template>
	<div>
		<h2 class="text-center font-bold">Movies</h2>
		<div class="my-4 flex flex-col space-x-1 items-center justify-center">
			<label for="searchTerm">Search movies:</label>
			<input
				class="border border-gray-300 rounded-md px-2 py-1"
				type="text"
				id="searchTerm"
				v-model="searchTerm"
				@input="searchMovies"
			/>
		</div>
		<ul v-if="hasMovies">
			<li v-for="movie in movies" :key="movie.imdbID">
				{{ movie.Title }} ({{ movie.Year }})
			</li>
		</ul>
		<p v-else>No movies found.</p>
	</div>
</template>

<script setup>
	import axios from 'axios'
	import { ref, computed } from 'vue'

	const movies = ref([])
	const searchTerm = ref('')

	const hasMovies = computed(() => movies.value?.length > 0)

	const searchMovies = async () => {
		const apiKey = import.meta.env.VITE_OMD_API
		const response = await axios.get(
			`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm.value}`
		)
		movies.value = response.data.Search
	}
</script>
