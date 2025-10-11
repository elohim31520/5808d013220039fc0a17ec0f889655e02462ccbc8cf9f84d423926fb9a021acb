<template>
	<div class="min-h-screen flex flex-col max-w-[480px] mx-auto bg-gray-100 pb-[6rem]">
		<AppHeader class="mb-2" />

		<SideMenu />

		<main class="flex-grow">
			<NuxtRouteAnnouncer />
			<NuxtPage />
		</main>

		<Footer />
	</div>
</template>
