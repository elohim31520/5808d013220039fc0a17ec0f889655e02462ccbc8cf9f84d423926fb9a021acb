import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
	const isMenuShown = ref(false)

	function showMenu() {
		isMenuShown.value = true
	}

	function hideMenu() {
		isMenuShown.value = false
	}

	function toggleMenu() {
		isMenuShown.value = !isMenuShown.value
	}

	return {
		isMenuShown,
		showMenu,
		hideMenu,
		toggleMenu,
	}
})
