<script setup lang="ts">
import { onAuthStateChanged, type User as UserAuth } from 'firebase/auth'
import Card from 'primevue/card'
import { onMounted } from 'vue'

import { User } from '@/database'
import { Logger } from '@/helpers/logger'
import NonVerifyLayout from '@/layouts/NonVerifyLayout.vue'
import router from '@/router'
import { auth } from '@/shared/firebase'

onMounted(() => {
  onAuthStateChanged(auth, async (userAuth) => {
    async function reload(_userAuth: UserAuth) {
      await _userAuth?.reload()
      Logger.info('reload', _userAuth)
      const user = await User.get({ authid: _userAuth.uid })
      if (!user) {
        Logger.info('checkpoint', 'user not found')
        return router.push({ name: 'login' })
      }

      if (_userAuth.emailVerified) {
        Logger.info('checkpoint', 'email verified')
        if (!user.verified) {
          Logger.info('checkpoint', 'update user')
          await User.update({ authid: _userAuth.uid, verified: _userAuth.emailVerified })
        }
        Logger.info('checkpoint', 'redirect to dashboard')
        return router.push({ name: 'dashboard' })
      }
      Logger.info('checkpoint', _userAuth.emailVerified, user.verified)
      setTimeout(reload, 1000, _userAuth)
    }
    if (userAuth) reload(userAuth)
  })
})
</script>
<template>
  <NonVerifyLayout>
    <Card class="w-screen mix-w-sm max-w-md h-1/3 bg-white drop-shadow-lg rounded-lg">
      <template #title>
        <div class="text-2xl font-medium text-gray-700">
          <span>Đang chờ xác thực email</span>
        </div>
      </template>
      <template #subtitle>
        <div class="py-3"></div>
      </template>
      <template #content>
        <div class="text-xl text-gray-700 pb-5">
          <p>Chúng tôi đã gửi một email xác nhận đến hộp thư của bạn.</p>
          <p>Vui lòng nhấn vào liên kết được gửi để tiến hành xác minh tài khoản.</p>
        </div>
        <div class="text-gray-500 text-center">
          <span>&copy; 2023 Mewbook</span>
        </div>
      </template>
    </Card>
  </NonVerifyLayout>
</template>
