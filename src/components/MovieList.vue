<template>
	<NavBar />
	<div class="w-full h-full md:flex">
		<div class="w-full md:w-1/2 border-r-2 p-4 flex flex-col space-y-4">
			<!-- input search -->
			<div class="flex flex-col space-x-1 items-center justify-center">
				<label for="searchTerm">Search movies:</label>
				<input
					class="border w-full border-gray-300 rounded-md px-2 py-1"
					type="text"
					id="searchTerm"
					v-model="searchTerm"
					@input="searchMovies"
				/>
			</div>

			<!-- filter by genre -->
			<div class="flex flex-col space-x-1 items-center justify-center">
				<label for="genreFilter">Filter by genre:</label>
				<select
					id="genreFilter"
					class="w-full border border-gray-300 rounded-md px-2 py-1"
					v-model="selectedGenre"
				>
					<option value="">All genres</option>
					<option v-for="genre in genres" :key="genre" :value="genre">
						{{ genre }}
					</option>
				</select>
			</div>

			<!-- sort by release|rating|title -->
			<div class="flex flex-col space-x-1 items-center justify-center">
				<label for="sort">Sort by:</label>
				<select
					id="sort"
					class="w-full border border-gray-300 rounded-md px-2 py-1"
					v-model="sortBy"
					@change="sortMovies"
				>
					<option value="">None</option>
					<option value="year">Release year</option>
					<option value="rating">IMDb rating</option>
					<option value="title">Title</option>
				</select>
			</div>

			<!-- create playlist -->
			<div>
				<button
					class="w-full border p-1 bg-green-300 rounded-lg"
					@click="openPrompt = true"
				>
					New List
				</button>
				<PromptList :isOpen="openPrompt" @close="openPrompt = false" />
			</div>

			<!-- get movies from list -->
			<div>
				<select
					class="w-full p-1"
					@change="getMoviesFromList(movieByList)"
					v-model="movieByList"
				>
					<option value="">get movies from list</option>
					<option v-for="(list, index) in allLists" :key="index">
						{{ list }}
					</option>
				</select>
				<div v-if="moviesMatchList">
					<li v-for="movieList in moviesMatchList" :key="movieList.imdbID">
						{{ movieList.Title }}
						<button class="bg-red-400" @click="getDetails(movieList.imdbID)">
							more detail
						</button>
					</li>
				</div>
			</div>

			<ul v-if="hasMovies">
				<li v-for="movie in movies" :key="movie.imdbID">
					{{ movie.Title }} ({{ movie.Year }}) - {{ movie.Genre }}
					<button class="bg-red-400" @click="getDetails(movie.imdbID)">
						more detail
					</button>
				</li>
			</ul>
		</div>
		<div class="w-full md:w-1/2 p-4">
			<div
				v-if="movieDetail"
				class="flex flex-col items-center space-y-2 py-4 mt-5 border"
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

				<div class="my-4 flex space-x-2 items-center justify-center">
					<label for="searchTerm">Set in a List:</label>
					<select v-model="listSelected">
						<option value="">Select a list</option>
						<option
							v-for="(list, index) in allLists"
							:key="index"
							:value="list"
						>
							{{ list }}
						</option>
					</select>
					<button
						class="bg-green-300 text-white p-2 rounded-lg"
						@click="setMoveList(movieDetail.imdbID, listSelected)"
					>
						Add a list
					</button>
				</div>
			</div>
			<div v-else class="flex h-full">
				<p class="m-auto">no movie found</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	import PromptList from './PromptList.vue'
	import NavBar from './NavBar.vue'

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
		getAllLists,
		addMovieToList,
	} = useMovies()

	const selectedGenre = ref('')
	const movieDetail = ref(null)
	const rating = ref(0)
	const review = ref('')
	const openPrompt = ref(false)
	const listSelected = ref('')
	const movieByList = ref('')
	const moviesMatchList = ref([])

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

	const allLists = computed(() => {
		const object = getAllLists()
		const lists = []

		for (const property in object) {
			lists.push(property)
		}

		return lists
	})

	const updateRew = async (id, review) => {
		await updateReview(id, review)
		await getDetails(id)
	}

	const setMoveList = async (id, list) => {
		await addMovieToList(list, id)
		await getDetails(id)
	}

	const getMoviesFromList = list => {
		moviesMatchList.value = []

		const object = getAllLists()

		const arrayMovies = object[list]
			.map(list => {
				if (typeof list === 'string') {
					return list
				}
			})
			.filter(l => l !== undefined)

		arrayMovies.forEach(async m => {
			const movie = await getMovieDetails(m)
			moviesMatchList.value.push(movie)
		})
	}

	watch(selectedGenre, filterByGenre)
	watch(sortBy, sortMovies)
</script>
