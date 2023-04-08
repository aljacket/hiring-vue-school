<template>
	<div class="p-4">
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

		<div></div>

		<ul v-if="hasMovies">
			<li v-for="movie in movies" :key="movie.imdbID">
				{{ movie.Title }} ({{ movie.Year }}) - {{ movie.Genre }}
				<button class="bg-red-400" @click="getDetails(movie.imdbID)">
					more detail
				</button>
			</li>
		</ul>
		<p v-else>No movies found.</p>

		<div
			v-if="movieDetail"
			class="flex flex-col items-center spac-y-2 py-4 mt-5 border"
		>
			<h2>{{ movieDetail.Title }}</h2>
			<p>{{ movieDetail.rating || movieDetail.imdbRating }}</p>
			<p>{{ movieDetail.review }}</p>
			<img :src="movieDetail.Poster" alt="movie image" class="h-full" />

			<div class="my-4 flex space-x-2 items-center justify-center">
				<label for="searchTerm">Rating:</label>
				<input
					class="border border-gray-300 rounded-md px-2 py-1"
					type="number"
					v-model="rating"
				/>
				<button
					class="bg-green-300 text-white p-2 rounded-lg"
					@click="updateRate(movieDetail.imdbID, rating)"
				>
					Rate
				</button>
			</div>

			<div class="my-4 flex space-x-2 items-center justify-center">
				<label for="searchTerm">Review:</label>
				<textarea
					class="border border-gray-300 rounded-md px-2 py-1"
					type="number"
					v-model="review"
				/>
				<button
					class="bg-green-300 text-white p-2 rounded-lg"
					@click="updateRew(movieDetail.imdbID, review)"
				>
					Review
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { useMovies } from '/src/composables/useMovies'
	import { ref, computed, watch } from 'vue'

	const {
		movies,
		searchTerm,
		genres,
		searchMovies,
		sortBy,
		sortMovies,
		getMovieDetails,
		updateRating,
		updateReview,
	} = useMovies()

	const selectedGenre = ref('')
	const movieDetail = ref(null)
	const rating = ref(0)
	const review = ref('')

	const hasMovies = computed(() => movies.value?.length > 0)

	const filterByGenre = () => {
		if (!selectedGenre.value) {
			return movies.value
		}

		return movies.value.filter(movie =>
			movie?.Genre?.includes(selectedGenre.value)
		)
	}

	const getDetails = async id => {
		movieDetail.value = await getMovieDetails(id)
	}

	const updateRate = async (id, rating) => {
		await updateRating(id, rating)
		await getDetails(id)
	}

	const updateRew = async (id, review) => {
		await updateReview(id, review)
		await getDetails(id)
	}

	watch(selectedGenre, filterByGenre)
	watch(sortBy, sortMovies)
</script>
