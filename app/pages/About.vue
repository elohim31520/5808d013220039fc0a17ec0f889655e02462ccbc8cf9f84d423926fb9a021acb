<template>
	<div class="p-2 mx-2 font-sans leading-relaxed bg-white shadow-md rounded-10">
		<h1 class="text-2xl mb-5 text-gray-800 border-b-2 border-gray-200 pb-2.5">
			{{ $t('about.title') }}
		</h1>
		<p class="text-gray-600 mb-4">{{ $t('about.description') }}</p>

		<h2 class="text-lg my-4 mb-4 text-gray-800 border-b-2 border-gray-200 pb-2.5">
			{{ $t('about.main_features') }}
		</h2>
		<ul class="list-none p-0">
			<li class="border-l-4 mb-2.5 p-4">
				<strong class="text-gray-900 block">{{ $t('about.feature1_title') }}</strong>
				{{ $t('about.feature1_description') }}
			</li>
			<br />
			<li class="border-l-4 mb-2.5 p-4">
				<strong class="text-gray-900 block">{{ $t('about.feature2_title') }}</strong>
				{{ $t('about.feature2_description') }}
			</li>
		</ul>

		<p class="text-gray-600 mb-4">{{ $t('about.conclusion') }}</p>
		<br />
	</div>
</template>
