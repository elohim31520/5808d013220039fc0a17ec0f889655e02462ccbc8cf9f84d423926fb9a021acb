<template>
	<main class="p-4 space-y-4">
		<header>
			<h1 class="text-lg font-bold flex-center">{{ $t('home.title') }}</h1>
		</header>
		<MomentumChart />
		<HeatMap class="h-[500px] my-2.5" />
		<MarketBreadth />
		<VolatileAsset />
		<SeeMore :to="'/volatile-stock'" class="my-2.5" />
		<!-- 公司入口 -->
		<HotCompanies />
		<SeeMore :to="'/m7'" class="my-2.5" />
	</main>
</template>

<script setup lang="ts"></script>
