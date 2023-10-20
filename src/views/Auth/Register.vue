<script setup lang="ts">
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import RadioButton from 'primevue/radiobutton'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

import InputError from '@/components/Common/InputError.vue'
import TextInput from '@/components/Common/TextInput.vue'
import TotalButton from '@/components/Common/TotalButton.vue'
import { Friend, User } from '@/database'
import { Logger } from '@/helpers/logger'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { auth } from '@/shared/firebase'
import { useUser } from '@/stores/user'
import { Gender } from '@/types'
const router = useRouter()
const { cuser } = useUser()

const form = reactive({
  name: '',
  email: '',
  password: '',
  repassword: '',
  processing: false,
  gender: 0,
  errors: {
    name: '',
    email: '',
    password: '',
    repassword: ''
  }
})

onMounted(() => {
  if (cuser?.uid) {
    router.push({ path: '/' })
    return
  }
})

function submit() {
  form.processing = true

  if (!form.name) form.errors.name = 'Vui lòng nhập tên của bạn'
  if (!form.email) form.errors.email = 'Vui lòng nhập email của bạn'
  if (!form.password || !form.repassword) form.errors.password = 'Vui lòng nhập mật khẩu của bạn'
  if (form.password !== form.repassword) form.errors.repassword = 'Mật khẩu không khớp'

  setTimeout(() => {
    form.errors.name = ''
    form.errors.email = ''
    form.errors.password = ''
    form.errors.repassword = ''
  }, 5000)

  if (!form.errors.name && !form.errors.email && !form.errors.password && !form.errors.repassword) {
    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then((data) => {
        updateProfile(data.user, {
          displayName: form.name
        })
          .then(async () => {
            await sendEmailVerification(data.user)
              .catch(() => {
                Logger.error('Send email verification failed')
                form.processing = false
              })
              .then(async () => {
                Logger.info('Send email verification success')
                const user = await User.create({
                  authid: data.user.uid,
                  gender: form.gender,
                  email: data.user.email!,
                  displayName: data.user.displayName!,
                  photoURL: data.user.photoURL!
                })
                Logger.info('User created', user)
                if (!user) {
                  form.processing = false
                  return
                }
                await Friend.create(user.id)
                form.processing = false
                router.push({ name: 'checkpoint' })
              })
          })
          .catch(() => {
            form.processing = false
          })
      })
      .catch((error) => {
        if (error.message.includes('auth/email-already-in-use')) {
          form.errors.email = 'Email đã được sử dụng'
        }
        if (error.message.includes('auth/invalid-email')) {
          form.errors.email = 'Email không hợp lệ'
        }
        if (error.message.includes('auth/weak-password')) {
          form.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        form.processing = false
      })
  } else {
    form.processing = false
  }
}
</script>

<template>
  <GuestLayout>
    <div class="w-full md:w-3/5 text-center mx-auto">
      <form
        @submit.prevent="submit"
        class="form-container bg-white shadow-md rounded-lg py-8 px-6 w-full min-w-[400px]"
      >
        <div>
          <TextInput
            id="name"
            type="text"
            class="mt-1 block w-full"
            v-model="form.name"
            required
            autofocus
            autocomplete="name"
            placeholder="Tên của bạn"
          />

          <InputError class="mt-2" :message="form.errors.name" />
        </div>
        <div class="mt-4">
          <TextInput
            id="email"
            type="email"
            class="mt-1 block w-full"
            v-model="form.email"
            required
            autocomplete="email"
            placeholder="Email của bạn"
          />

          <InputError class="mt-2" :message="form.errors.email" />
        </div>

        <div class="mt-4">
          <TextInput
            id="new-password"
            type="password"
            class="mt-1 block w-full"
            v-model="form.password"
            required
            autocomplete="new-password"
            placeholder="Mật khẩu mới"
          />

          <InputError class="mt-2" :message="form.errors.password" />
        </div>
        <div class="mt-4">
          <TextInput
            id="re-password"
            type="password"
            class="mt-1 block w-full"
            v-model="form.repassword"
            required
            autocomplete="re-password"
            placeholder="Nhập lại mật khẩu"
          />

          <InputError class="mt-2" :message="form.errors.repassword" />
        </div>

        <div class="flex justify-between flex-wrap gap-3 mt-4 px-3">
          <div class="flex align-items-center">
            <RadioButton
              v-model="form.gender"
              inputId="gender1"
              name="gender"
              :value="Gender.MALE"
            />
            <label for="form.gender1" class="ml-2">Nam</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              v-model="form.gender"
              inputId="gender2"
              name="gender"
              :value="Gender.FEMALE"
            />
            <label for="form.gender2" class="ml-2">Nữ</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              v-model="form.gender"
              inputId="gender3"
              name="gender"
              :value="Gender.OTHER"
            />
            <label for="form.gender3" class="ml-2">Khác</label>
          </div>
        </div>
        <div class="flex items-center justify-center pt-4">
          <TotalButton
            class="w-full mb-4"
            :class="{ 'opacity-25': form.processing }"
            :disabled="form.processing"
            bstyle="success"
          >
            Đăng ký
          </TotalButton>
        </div>

        <div class="flex items-center justify-center mb-4">
          <router-link
            to="/login"
            class="hover:underline font-medium text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Đã có tài khoản?
          </router-link>
        </div>
      </form>
    </div>
  </GuestLayout>
</template>
