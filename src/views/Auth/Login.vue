<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import InputError from '@/components/Common/InputError.vue'
import TextInput from '@/components/Common/TextInput.vue'
import TotalButton from '@/components/Common/TotalButton.vue'
import { User } from '@/database'
import { Logger } from '@/helpers/logger'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { auth } from '@/shared/firebase'
import { useUser } from '@/stores/user'

const { setUser, cuser } = useUser()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  errors: {
    email: '',
    password: ''
  },
  processing: false
})

if (cuser) {
  router.push({ name: 'dashboard' })
}

async function submit() {
  form.processing = true
  await signInWithEmailAndPassword(auth, form.email, form.password)
    .then(async (userCredential) => {
      const user = await User.get({ authid: userCredential.user.uid })
      if (!user) {
        form.errors.email = 'User not found'
        form.processing = false
        Logger.error('User not found')
        return
      }
      setUser(user)
      form.processing = false
      if (!user.verified) {
        Logger.warn('User not verified')
        return router.push({ name: 'checkpoint' })
      }
      return router.push({ name: 'dashboard' })
    })
    .catch((error) => {
      Logger.error(error)
      form.errors.email = error.message
      form.errors.password = error.message
      form.processing = false
    })

  setTimeout(() => {
    form.errors.email = ''
    form.errors.password = ''
  }, 3000)
}
</script>

<template>
  <GuestLayout>
    <div class="max-w-lg w-full flex flex-col lg:flex-row justify-around items-center">
      <div
        class="text-left flex flex-col lg:-mt-10 mb-10 items-center justify-center lg:items-start"
      >
        <h1 class="text-mb-blue text-7xl font-bold px-6 py-3">mewbook</h1>
        <h2 class="lg:text-2xl font-normal px-6 text-center text-md lg:text-left w-4/5 lg:w-full">
          Mewbook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
        </h2>
      </div>
      <div class="w-full md:w-3/5 text-center mx-auto">
        <form
          @submit.prevent="submit"
          class="form-container bg-white shadow-md rounded-lg py-8 px-6 w-full min-w-[400px]"
        >
          <div>
            <TextInput
              id="email"
              type="email"
              class="mt-1 block w-full"
              v-model="form.email"
              required
              autofocus
              autocomplete="username"
              placeholder="Email"
            />

            <InputError class="mt-2" :message="form.errors.email" />
          </div>

          <div class="mt-4">
            <TextInput
              id="password"
              type="password"
              class="mt-1 block w-full"
              v-model="form.password"
              required
              autocomplete="current-password"
              placeholder="Mật khẩu"
            />

            <InputError class="mt-2" :message="form.errors.password" />
          </div>

          <div class="flex items-center justify-center pt-4">
            <TotalButton
              class="w-full mb-4"
              :class="{ 'opacity-25': form.processing }"
              :disabled="form.processing"
              bstyle="primary"
            >
              Đăng nhập
            </TotalButton>
          </div>

          <div class="flex items-center justify-center mb-4">
            <router-link
              to="/forgot-password"
              class="hover:underline font-medium text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Quên mật khẩu?
            </router-link>
          </div>
          <div class="border-b border-b-gray-200"></div>
          <div class="flex items-center justify-center pt-6 pb-2">
            <router-link
              to="/register"
              class="w-full text-center px-5 py-3 text-white bg-[#42B729] hover:bg-[#37A621] text-[20px] font-bold rounded-lg"
            >
              Tạo tài khoản
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </GuestLayout>
</template>
