import { ref } from 'vue'
import axios from 'axios'

export const useMovies = () => {
	const searchTerm = ref('')
	const movies = ref([])
	const genres = [
		'action',
		'adventure',
		'animation',
		'comedy',
		'crime',
		'documentary',
		'drama',
		'family',
		'fantasy',
		'history',
		'horror',
		'music',
		'mystery',
		'romance',
		'science fiction',
		'tv movie',
		'thriller',
		'war',
		'western',
	]

	const sortBy = ref('')

	const searchMovies = async () => {
		const apiKey = import.meta.env.VITE_OMD_API
		const response = await axios.get(
			`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm.value}`
		)
		movies.value = response.data.Search
	}

	const sortMovies = () => {
		if (sortBy.value === 'year') {
			movies.value.sort((a, b) => b.Year - a.Year)
		} else if (sortBy.value === 'rating') {
			movies.value.sort((a, b) => b.imdbRating - a.imdbRating)
		} else if (sortBy.value === 'title') {
			movies.value.sort((a, b) => a.Title.localeCompare(b.Title))
		}
	}

	return { searchTerm, movies, genres, searchMovies, sortBy, sortMovies }
}
