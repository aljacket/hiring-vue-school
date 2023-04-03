<template>
	<div>
		<h2>Movies</h2>
		<ul>
			<li v-for="movie in movies" :key="movie.imdbID">
				{{ movie.Title }} ({{ movie.Year }})
			</li>
		</ul>
	</div>
</template>

<script setup>
	import axios from 'axios'
	import { ref, onMounted } from 'vue'

	const movies = ref([])

	const getMovies = async () => {
		const apiKey = '8679ba82'
		const response = await axios.get(
			`https://www.omdbapi.com/?apikey=${apiKey}&s=Star%20Wars`
		)
		movies.value = response.data.Search
	}

	onMounted(getMovies)
</script>
