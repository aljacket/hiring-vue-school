import { useLocalStorage } from '@vueuse/core'

export const useLists = () => {
	const getList = () => {
		const savedLists = useLocalStorage('lists', {})
		return savedLists.value
	}

	const setList = list => {
		const savedLists = useLocalStorage('lists', {})
		savedLists.value[list] = {}
	}

	const setMovieList = (list, imdbID) => {
		const savedLists = useLocalStorage('lists', {})
		savedLists.value[list] = [savedLists.value[list], imdbID].flat()
	}

	return { getList, setList, setMovieList }
}
