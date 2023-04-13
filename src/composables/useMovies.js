import { ref } from 'vue'
import axios from 'axios'
import { useRatings } from './useRatings'
import { useReviews } from './useReviews'
import { useLists } from './useLists'

export const useMovies = () => {
	const searchTerm = ref('')
	const movies = ref([])
	const genres = ref([])

	const { getRating, setRating } = useRatings()
	const { getReview, setReview } = useReviews()
	const { getList, setList, setMovieList } = useLists()

	const sortBy = ref('')

	const searchMovies = async () => {
		const apiKey = import.meta.env.VITE_OMD_API
		const response = await axios.get(
			`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm.value}&r=json`
		)
		movies.value = response.data.Search

		const requests = movies.value?.map(async m => {
			return await getMovieDetails(m.imdbID)
		})

		if (requests) {
			const responses = await Promise.all(requests)

			movies.value = responses
		}
	}

	const getGenres = async () => {
		const apiKey = import.meta.env.VITE_OMD_API

		let allGenres = []

		try {
			const requests = movies.value?.flatMap(movie => {
				return axios.get(
					`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`
				)
			})

			if (requests) {
				const responses = await Promise.all(requests)

				allGenres = responses?.map(response => {
					return response.data.Genre.split(', ')
				})
			}
		} catch (error) {
			console.log('error getting genres', error)
		}

		genres.value = Array.from(new Set(allGenres?.flat()))
	}

	const sortMovies = () => {
		if (sortBy.value === 'year') {
			movies.value.sort((a, b) => b.Year - a.Year)
		} else if (sortBy.value === 'rating') {
			movies.value.sort((a, b) => {
				return b.rating - a.rating
			})
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
		movie.review = getReview(imdbID)
		return movie
	}

	const createList = list => {
		setList(list)
	}

	const getAllLists = () => {
		return getList()
	}

	const addMovieToList = (list, imdbID) => {
		setMovieList(list, imdbID)
	}

	const updateRating = (imdbID, rating) => {
		setRating(imdbID, rating)
		const movie = movies.value.find(movie => movie.imdbID === imdbID)
		movie.rating = rating
	}

	const updateReview = (imdbID, review) => {
		setReview(imdbID, review)
		const movie = movies.value.find(movie => movie.imdbID === imdbID)
		movie.review = review
	}

	return {
		searchTerm,
		movies,
		genres,
		sortBy,
		searchMovies,
		getGenres,
		sortMovies,
		getMovieDetails,
		updateRating,
		updateReview,
		createList,
		getAllLists,
		addMovieToList,
	}
}
