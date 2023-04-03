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

	const searchMovies = async () => {
		const apiKey = import.meta.env.VITE_OMD_API
		const response = await axios.get(
			`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm.value}`
		)
		movies.value = response.data.Search
	}

	return { searchTerm, movies, genres, searchMovies }
}
