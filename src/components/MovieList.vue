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

		<div class="my-4 flex flex-col space-x-1 items-center justify-center">
			<label for="genreFilter">Filter by genre:</label>
			<select
				id="genreFilter"
				class="border border-gray-300 rounded-md px-2 py-1"
				v-model="selectedGenre"
			>
				<option value="">All genres</option>
				<option v-for="genre in genres" :key="genre" :value="genre">
					{{ genre }}
				</option>
			</select>
		</div>

		<div class="my-4 flex flex-col space-x-1 items-center justify-center">
			<label for="sort">Sort by:</label>
			<select
				id="sort"
				class="border border-gray-300 rounded-md px-2 py-1"
				v-model="sortBy"
				@change="sortMovies"
			>
				<option value="">None</option>
				<option value="year">Release year</option>
				<option value="rating">IMDb rating</option>
				<option value="title">Title</option>
			</select>
		</div>

		<ul v-if="hasMovies">
			<li v-for="movie in movies" :key="movie.imdbID">
				{{ movie.Title }} ({{ movie.Year }}) - {{ movie.Genre }}
			</li>
		</ul>
		<p v-else>No movies found.</p>
	</div>
</template>

<script setup>
	import { useMovies } from '/src/composables/useMovies'
	import { ref, computed, watch } from 'vue'

	const { movies, searchTerm, genres, searchMovies, sortBy, sortMovies } =
		useMovies()
	const selectedGenre = ref('')

	const hasMovies = computed(() => movies.value?.length > 0)

	const filterByGenre = () => {
		if (!selectedGenre.value) {
			return movies.value
		}

		console.log('movies.value', movies.value)

		return movies.value.filter(movie =>
			movie?.Genre?.includes(selectedGenre.value)
		)
	}

	watch(selectedGenre, filterByGenre)
	watch(sortBy, sortMovies)
</script>
