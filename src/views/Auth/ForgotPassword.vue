<script setup lang="ts">
import { sendPasswordResetEmail } from 'firebase/auth'
import Avatar from 'primevue/avatar'
import Divider from 'primevue/divider'
import { computed, reactive, ref } from 'vue'

import InputError from '@/components/Common/InputError.vue'
import TextInput from '@/components/Common/TextInput.vue'
import TotalButton from '@/components/Common/TotalButton.vue'
import { Attachment, User } from '@/database'
import { Logger } from '@/helpers/logger'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { auth } from '@/shared/firebase'
import type { IUser } from '@/types'

const form = reactive({
  email: '',
  errors: {
    email: '',
    notFound: false,
    fail: ''
  },
  sent: false,
  processing: false
})

const user = ref<IUser>()
const step = ref<number>(1)

const stepOne = computed(() => step.value === 1 && !user.value)
const stepTwo = computed(() => step.value === 2 && !!user.value)
const stepThree = computed(() => step.value === 3 && form.sent)

const find = async function () {
  form.errors.notFound = false
  const _user = await User.get({ email: form.email })
  if (!_user) {
    form.errors.notFound = true
    return false
  }

  if (!_user.verified) {
    form.errors.notFound = true
    return false
  }

  if (Attachment.isID(_user.photoURL)) {
    const attachment = await Attachment.get(_user.photoURL)
    if (attachment) _user.photoURL = await Attachment.cacheImage(attachment.attachments.small)
  }

  user.value = _user

  Logger.info('user', user.value)
  step.value = 2
  return true
}

const clean = function () {
  user.value = undefined
  step.value = 1
  form.email = ''
  form.errors.notFound = false
  form.errors.email = ''
}

const reset = async function () {
  form.processing = true
  await sendPasswordResetEmail(auth, form.email)
    .then((data) => {
      Logger.info('sendPasswordResetEmail', data)
      form.processing = false
      form.sent = true
      step.value = 3
    })
    .catch((error) => {
      Logger.error(error)
      form.errors.fail = error.message
      form.processing = false
    })
}
</script>
<template>
  <GuestLayout hide-logo>
    <div class="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <div class="w-full max-w-[500px] p-6 m-6 bg-white rounded-lg shadow-md" v-if="stepOne">
        <div class="text-2xl font-medium text-center text-gray-700">
          <span>Tìm lại tài khoản của bạn</span>
        </div>
        <Divider />
        <div
          class="w-full border-orange-600 border p-2 bg-[#ffebe8] my-2"
          v-if="form.errors.notFound"
        >
          <span>Không có kết quả tìm kiếm</span>
          <span>Tìm kiếm không trả về kết quả nào. Vui lòng thử lại với thông tin khác</span>
        </div>
        <div class="text-lg font-medium text-gray-600">
          <span>Vui lòng nhập địa chỉ email để tìm kiếm tài khoản của bạn.</span>
        </div>
        <div class="py-3"></div>
        <form class="space-y-6 transition-all" @submit.prevent="find">
          <div>
            <TextInput v-model="form.email" type="email" placeholder="Email của bạn" />
            <InputError class="mt-2" :message="form.errors.email" />
          </div>
          <div class="flex flex-col w-full justify-end items-center space-y-3">
            <TotalButton
              type="submit"
              :disabled="form.processing"
              class="w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg duration-100"
            >
              <span>Tìm kiếm</span>
            </TotalButton>
            <router-link
              to="/login"
              class="text-blue-500 bg-gray-100 hover:underline hover:bg-mb-gray-h p-3 rounded-lg font-medium duration-100 w-full text-center"
            >
              <span class="text-center">Huỷ</span>
            </router-link>
          </div>
        </form>
      </div>
      <div class="w-full max-w-[500px] p-6 m-6 bg-white rounded-lg shadow-md" v-if="stepTwo">
        <div class="text-2xl font-medium text-center text-gray-700">
          <span>Kiểm tra thông tin</span>
        </div>
        <Divider />
        <div class="w-full flex flex-col justify-center pb-2">
          <Avatar
            :image="user?.photoURL"
            size="large"
            shape="circle"
            :pt="{
              root: 'mx-auto w-16 h-16',
              image: 'rounded-full'
            }"
          />
          <span class="mx-auto font-medium pt-2">{{ user?.email }}</span>
          <span class="mx-auto font-normal text-gray-500">{{ user?.displayName }}</span>
          <button
            type="button"
            class="text-sm text-mb-blue hover:text-mb-blue-h hover:underline"
            @click="clean"
          >
            <span>Không phải bạn?</span>
          </button>
        </div>
        <div class="flex flex-row justify-center items-center space-x-2">
          <div class="min-w-[200px]">
            <router-link
              to="/login"
              class="text-sm text-mb-blue hover:text-mb-blue-h hover:underline"
            >
              <span>Đăng nhập bằng mật khẩu</span>
            </router-link>
          </div>
          <div class="min-w-[200px] flex flex-row justify-center space-x-2">
            <TotalButton
              type="button"
              :disabled="form.processing"
              @click="reset"
              class="w-full py-3 text-md font-semibold text-white bg-blue-500 rounded-lg duration-100"
            >
              <span>Tiếp tục</span>
            </TotalButton>
          </div>
        </div>
      </div>
      <div class="w-full max-w-[500px] p-6 m-6 bg-white rounded-lg shadow-md" v-if="stepThree">
        <div class="text-2xl font-medium text-center text-gray-700">
          <span>Kiểm tra email</span>
        </div>
        <Divider />
        <div>
          <span
            >Chúng tôi đã gửi một email dùng để thay đổi mật khẩu tới hộp thư của bạn, vui lòng kiểm
            tra.</span
          >
        </div>
        <div class="w-full justify-center items-center flex mt-3">
          <router-link
            to="/login"
            class="text-mb-blue hover:text-mb-blue-h hover:underline bg-gray-100 hover:bg-gray-200 p-3 text-center text-lg rounded-lg"
          >
            <span>Quay lại trang đăng nhập</span>
          </router-link>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
