<template>
	<div>
		<van-nav-bar :title="$t('change_password.title')" />
		<van-form @submit="onSubmit">
			<van-cell-group inset>
				<van-field
					v-model="oldPassword"
					name="oldPassword"
					:label="$t('change_password.old_password')"
					:placeholder="$t('change_password.enter_old_password')"
					:rules="[{ required: true, message: $t('change_password.fill_old_password') }]"
					type="password"
				/>
				<van-field
					v-model="newPassword"
					type="password"
					name="newPassword"
					:label="$t('change_password.new_password')"
					:placeholder="$t('change_password.enter_new_password')"
					:rules="newPasswordRules"
				/>
				<van-field
					v-model="confirmNewPassword"
					type="password"
					name="confirmNewPassword"
					:label="$t('change_password.confirm_new_password')"
					:placeholder="$t('change_password.enter_confirm_new_password')"
					:rules="[
						{ required: true, message: $t('change_password.fill_confirm_new_password') },
						{ validator: passwordValidator, message: $t('change_password.password_mismatch') },
					]"
				/>
			</van-cell-group>
			<div style="margin: 16px">
				<van-button round block type="primary" color="#f472b6" native-type="submit">
					{{ $t('change_password.confirm_change') }}
				</van-button>
			</div>
		</van-form>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useRouter } from 'vue-router'
	import { changePassword } from '../api/user'
	import { showToast } from 'vant'
	import { removeToken } from '../modules/auth'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
	const router = useRouter()
	const oldPassword = ref('')
	const newPassword = ref('')
	const confirmNewPassword = ref('')

	const newPasswordRules = computed(() => [
		{ required: true, message: t('change_password.fill_new_password') },
		{
			pattern: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,30}$/,
			message: t('change_password.password_rules'),
		},
	])

	const passwordValidator = (val: string) => {
		return val === newPassword.value
	}

	const onSubmit = async (values: any) => {
		const res = await changePassword({
			oldPassword: values.oldPassword,
			newPassword: values.newPassword,
			confirmNewPassword: values.confirmNewPassword,
		})
		if (res.success) {
			showToast(t('change_password.change_success'))
			removeToken()
			router.push('/login')
		}
	}
</script>
