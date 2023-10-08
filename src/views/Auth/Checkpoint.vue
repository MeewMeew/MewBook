<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth';
import Card from 'primevue/card';
import { ref } from 'vue';

import { User } from '@/database';
import NonVerifyLayout from '@/layouts/NonVerifyLayout.vue';
import router from '@/router';
import { auth } from '@/shared/firebase';

const load = ref(0)


onAuthStateChanged(auth, async (userAuth) => {
  async function reload(userAuth: any = auth.currentUser) {
    await userAuth?.reload()
    const user = (await User.get({ authid: userAuth.uid }))
    if (!user) {
      return router.push({ name: 'login' })
    }
    load.value++
    if ((userAuth.emailVerified === true) && !user.verified) {
      await User.update({ authid: userAuth.uid, verified: userAuth.emailVerified })
      return router.push({ name: 'dashboard' })
    } else {
      setTimeout(reload, 5000, userAuth)
    }
  }
  if (userAuth) {
    reload()
  }
})
</script>
<template>
  <NonVerifyLayout>
    <Card class="w-screen mix-w-sm max-w-2xl h-1/3 bg-white drop-shadow-lg rounded-lg">
      <template #title>
        <div class="text-4xl font-bold text-gray-700">
          <span>Đang chờ xác thực email</span>
        </div>
      </template>
      <template #subtitle> <div class="py-3"></div> </template>
      <template #content>
        <div class="text-xl text-gray-700 pb-5">
          <p>Chúng tôi đã gửi một email xác nhận đến hộp thư của bạn.</p>
          <p>Vui lòng nhấn vào liên kết được gửi để tiến hành xác minh tài khoản.</p>
        </div>
      </template>
      <template #footer>
        <div class="text-gray-500 text-center">
          <span>@2023 MeewMeew</span>
        </div>
      </template>
    </Card>
  </NonVerifyLayout>
</template>