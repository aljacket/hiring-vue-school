<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal" class="relative z-10">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-25" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center p-4 text-center"
				>
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						>
							<DialogTitle
								as="h3"
								class="text-lg my-2 font-medium leading-6 text-gray-900"
							>
								Create List
							</DialogTitle>

							<input type="text" class="w-full" v-model="listName" />

							<div class="mt-4">
								<button
									type="button"
									class="w-full bg-green-300 text-white p-2 rounded-lg"
									@click="create"
								>
									Create
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
	import { ref } from 'vue'
	import {
		TransitionRoot,
		TransitionChild,
		Dialog,
		DialogPanel,
		DialogTitle,
	} from '@headlessui/vue'

	import { useMovies } from '/src/composables/useMovies'

	const { createList } = useMovies()

	const props = defineProps({
		isOpen: {
			type: Boolean,
			required: true,
		},
	})

	const listName = ref('')

	const emit = defineEmits(['close'])

	const create = () => {
		createList(listName.value)
		closeModal()
	}

	function closeModal() {
		emit('close')
	}
</script>
