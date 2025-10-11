<template>
	<div class="post-con px-4">
		<div v-if="fetchedPost">
			<h2>{{ fetchedPost.title }}</h2>
			<img :src="fetchedPost.image" :alt="fetchedPost.title" class="object-fit" />
			<div v-html="fetchedPost.htmlContent"></div>
		</div>
		<div v-else>
			<p>Loading post...</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useRoute } from 'vue-router'

	interface BlogPost {
		id: string
		title: string
		htmlContent: string
		image?: string
	}

	const route = useRoute()

	const { data: fetchedPost } = await useAsyncData(`blog-post-${route.params.id as string}`, async () => {
		const allPosts = await $fetch<BlogPost[]>('/api/blog')
		return allPosts.find((p) => p.id === (route.params.id as string)) || null
	})
</script>

<style>
	.post-con {
		h1 {
			font-size: 2.5rem;
			font-weight: 700;
			line-height: 1.2;
			margin: 2rem 0 1rem;
			color: #1a1a1a;
		}

		h2 {
			font-size: 2rem;
			font-weight: 600;
			line-height: 1.3;
			margin: 1.5rem 0 0.75rem;
			color: #2c3e50;
		}

		h3 {
			font-size: 1.5rem;
			font-weight: 500;
			line-height: 1.4;
			margin: 1.25rem 0 0.5rem;
			color: #34495e;
		}

		i,
		em {
			font-style: italic;
			color: #4a4a4a;
			font-weight: 400;
		}

		img {
			max-width: 100%;
			height: auto;
			display: block;
			margin: 1rem auto;
			border-radius: 8px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		}
		p {
			font-size: 1rem;
			line-height: 1.6;
			margin: 1rem 0;
			color: #333;
		}
	}
</style>
