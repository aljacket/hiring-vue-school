import { useLocalStorage } from '@vueuse/core'

export const useRatings = () => {
	const getRating = imdbID => {
		const savedRatings = useLocalStorage('ratings', {})
		return savedRatings.value[imdbID] || 0
	}

	const setRating = (imdbID, rating) => {
		const savedRatings = useLocalStorage('ratings', {})
		savedRatings.value[imdbID] = rating
	}

	return { getRating, setRating }
}
