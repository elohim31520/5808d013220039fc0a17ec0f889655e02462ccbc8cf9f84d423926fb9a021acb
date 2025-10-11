<template>
	<div class="w-full-limited overflow-hidden">
		<div class="min-h-screen bg-[#f5f5f5] pb-[6rem]">
			<div
				ref="headerWrapper"
				class="transition-all duration-300"
				:class="{ 'fixed top-0 left-0 right-0 z-50 w-full-limited pc:left-[calc(50%-240px)]': isScrolled }"
			>
				<div
					class="bg-[url('/my/bg.webp')] bg-cover bg-center bg-no-repeat p-4 pt-[3rem] text-white transition-all duration-300 ease-in-out"
					:class="isScrolled ? 'h-[10rem] pt-[5rem]' : 'h-[16rem] pt-[3rem]'"
				>
					<!-- User Info -->
					<div
						class="flex-y-center transition-all duration-300 ease-in-out"
						:class="{ '-translate-y-[2.5rem]': isScrolled }"
					>
						<div class="relative">
							<img
								:src="userStore.userInfo.picture"
								alt="avatar"
								class="rounded-full transition-all duration-300 ease-in-out"
								:class="isScrolled ? 'w-[2.5rem] h-[2.5rem]' : 'w-[4.375rem] h-[4.375rem]'"
							/>
						</div>

						<div class="ml-3 flex-1 flex-col">
							<div class="text-white">
								<div class="flex items-center">
									<span class="font-[500]">{{ userStore.userInfo.name }}</span>
									<span
										class="ml-1 bg-#FDE9FF text-#BA05C3 flex-y-center justify-center rounded-full font-[500] text-xs px-1 py-1"
									>
										Lv.{{ userInfo.level }}
									</span>
								</div>
								<div class="flex-y-center text-#FAC9FF text-xs mt-1 font-[500]">
									<span class="flex-y-center gap-5" v-if="userStore.username">
										ID:{{ userStore.username }}
										<SvgIcon name="icon_room" size="1rem" />
									</span>
								</div>
							</div>

							<!-- 持倉比例 -->
							<div v-show="!isScrolled" class="flex-y-center gap-4 transition-all duration-300 ease-in-out mt-17">
								<div class="flex flex-col">
									<span class="font-[500]">{{ cashPercentage }}%</span>
									<span class="text-#FAC9FF text-10">{{ $t('my.cash') }}</span>
								</div>
								<div class="flex-y-center flex-col">
									<span class="font-[500]">{{ portfolioPercentage }}%</span>
									<span class="text-#FAC9FF text-10">{{ $t('my.portfolio') }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="transition-all duration-300 ease-in-out" :class="isScrolled ? '-mt-[2rem]' : '-mt-[6.25rem]'">
					<!-- Wallet Info -->
					<div
						class="flex-y-center justify-between transition-all duration-300 ease-in-out bg-white"
						:class="isScrolled ? 'rounded-t-[1.25rem] p-1' : 'rounded-full px-1 mx-1 py-1'"
					>
						<div class="flex-y-center font-bold">
							<SvgIcon class="text-pink-400" name="icon_dollar_fill" size="1.6rem" />
							<span class="ml-5 font-[600] text-xl text-pink-400">
								{{ balanceStore.usdBalance }}
							</span>
							<SvgIcon class="text-pink-400 ml-5" name="icon_arrow_right" size="1rem" />
						</div>
						<div class="flex-y-center gap-2 text-white text-xs font-[500]">
							<template v-if="userStore.isLogin">
								<div
									class="flex-y-center gap-3 bg-gradient-to-r from-[#FF9021] to-[#FFB60C] rounded-2xl px-1 py-1"
									@click="showUpdateUSDFormPopup = true"
								>
									<SvgIcon name="icon_redeem" size="1.2rem" color="#fff" />
									{{ $t('my.update_balance') }}
								</div>
								<div
									@click="$router.push('/change-password')"
									class="flex-y-center gap-3 ml-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl px-1 py-1"
								>
									<SvgIcon name="icon_room_w" size="1.2rem" />
									{{ $t('my.change_password') }}
								</div>
							</template>
							<template v-else>
								<div
									class="flex-y-center gap-3 bg-gradient-to-r from-[#E124AF] to-[#CC0EFB] rounded-2xl px-1 py-1"
									@click="$router.push('/login')"
								>
									<SvgIcon name="icon_room_w" size="1.2rem" color="#fff" />
									{{ $t('my.login') }}
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>

			<ClientOnly>
				<div class="bg-white" :style="{ paddingTop: isScrolled ? headerHeight + 'px' : '0px' }">
					<!-- My Portfolio -->
					<div class="m-2 pt-5">
						<h3 class="font-[500] mb-1 text-pink-400" v-if="userStore.isLogin">{{ $t('my.my_portfolio') }}</h3>
						<h3 class="font-[500] mb-1 text-pink-400" v-else>{{ $t('my.login_to_create_portfolio') }}</h3>
						<div class="w-full">
							<PortfolioChart />
						</div>
					</div>
				</div>
			</ClientOnly>
		</div>

		<UpdateUSDFormPopup v-model="showUpdateUSDFormPopup" />

		<Footer />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
	import { useBalanceStore } from '@/stores/balance'
	import { usePortfolioStore } from '@/stores/portfolio'
	import { useUserStore } from '@/stores/user'

	const balanceStore = useBalanceStore()
	const portfolioStore = usePortfolioStore()
	const userStore = useUserStore()

	const portfolioValue = computed(() => {
		return portfolioStore.portfolioList.reduce((sum, item) => {
			return sum + item.quantity * item.avg
		}, 0)
	})

	const totalValue = computed(() => {
		return +portfolioValue.value + +balanceStore.usdBalance
	})

	const cashPercentage = computed(() => {
		if (totalValue.value === 0) {
			return '0.00'
		}
		return ((balanceStore.usdBalance / totalValue.value) * 100).toFixed(2)
	})

	const portfolioPercentage = computed(() => {
		if (totalValue.value === 0) {
			return '0.00'
		}
		return ((portfolioValue.value / totalValue.value) * 100).toFixed(2)
	})

	const isScrolled = ref(false)
	const headerWrapper = ref<HTMLDivElement | null>(null)
	const headerHeight = ref(0)
	const showUpdateUSDFormPopup = ref(false)

	const handleScroll = () => {
		isScrolled.value = window.scrollY > 50
	}

	watch(isScrolled, async (newVal) => {
		if (newVal) {
			await nextTick()
			if (headerWrapper.value) {
				headerHeight.value = headerWrapper.value.offsetHeight + 50
			}
		}
	})

	onMounted(() => {
		window.addEventListener('scroll', handleScroll, { passive: true })
		// check on initial load
		handleScroll()
		if (userStore.isLogin) {
			portfolioStore.fetchMyPortfolio()
			balanceStore.fetchMyBalance()
		} else {
			portfolioStore.fetchMockPortfolio()
		}
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
	})

	const userInfo = ref({
		level: '1',
	})
</script>
