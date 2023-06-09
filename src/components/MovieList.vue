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
					<option value="rating">Rating</option>
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
					class="w-full border border-gray-300 rounded-md px-2 py-1"
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
					</li>
				</div>
			</div>

			<ul v-if="hasMovies">
				<table class="table-auto">
					<thead>
						<tr>
							<th class="border-r-2">Title</th>
							<th class="border-r-2">Year</th>
							<th class="border-r-2">Genre</th>
							<th>Details</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="movie in filterByGenre" :key="movie.imdbID">
							<td class="border-r-2">{{ movie.Title }}</td>
							<td class="border-r-2">{{ movie.Year }}</td>
							<td class="border-r-2">{{ movie.Genre }}</td>
							<td class="flex justify-center">
								<button
									class="bg-red-300 rounded-xl p-2 text-white"
									@click="getDetails(movie.imdbID)"
								>
									go
								</button>
							</td>
						</tr>
					</tbody>
				</table>
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
	import { ref, computed, watch, watchEffect } from 'vue'

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
		getGenres,
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

	const filterByGenre = computed(() => {
		if (selectedGenre.value === '') {
			return movies.value
		}

		return movies.value.filter(m => m.Genre.includes(selectedGenre.value))
	})

	const allLists = computed(() => {
		const object = getAllLists()
		const lists = []

		for (const property in object) {
			lists.push(property)
		}

		return lists
	})

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

	const setMoveList = async (id, list) => {
		await addMovieToList(list, id)
		await getDetails(id)
	}

	const getMoviesFromList = list => {
		moviesMatchList.value = []
		movies.value = []
		searchTerm.value = ''

		const object = getAllLists()

		const arrayMovies = object[list]
			?.map(list => {
				if (typeof list === 'string') {
					return list
				}
			})
			.filter(l => l !== undefined)

		console.log('arrayMovies', arrayMovies)

		arrayMovies?.forEach(async m => {
			const movie = await getMovieDetails(m)
			moviesMatchList.value.push(movie)
		})
	}

	watch(movies, async () => {
		await getGenres()
	})

	watchEffect(sortBy, sortMovies)
</script>
