import { ref } from 'vue'
import axios from 'axios'
import { useRatings } from './useRatings'

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
	const { getRating, setRating } = useRatings()

	const sortBy = ref('')

	const searchMovies = async () => {
		const apiKey = import.meta.env.VITE_OMD_API
		const response = await axios.get(
			`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm.value}&plot=full`
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

	const getMovieDetails = async imdbID => {
		const apiKey = import.meta.env.VITE_OMD_API
		const response = await axios.get(
			`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`
		)
		const movie = response.data
		movie.rating = getRating(imdbID)
		return movie
	}

	const updateRating = (imdbID, rating) => {
		setRating(imdbID, rating)
		const movie = movies.value.find(movie => movie.imdbID === imdbID)
		movie.rating = rating
	}

	return {
		searchTerm,
		movies,
		genres,
		sortBy,
		searchMovies,
		sortMovies,
		getMovieDetails,
		updateRating,
	}
}
