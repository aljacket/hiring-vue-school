import { useLocalStorage } from '@vueuse/core'

export const useReviews = () => {
	const getReview = imdbID => {
		const savedReviews = useLocalStorage('reviews', {})
		return savedReviews.value[imdbID] || ''
	}

	const setReview = (imdbID, rating) => {
		const savedReviews = useLocalStorage('reviews', {})
		savedReviews.value[imdbID] = rating
	}

	return { getReview, setReview }
}
