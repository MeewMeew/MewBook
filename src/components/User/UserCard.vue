<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { type PropType, reactive, ref } from 'vue';

import { Friend } from '@/database';
import { Logger } from '@/helpers/logger';
import { mewSocket } from '@/helpers/socket';
import { useUser } from '@/stores/user';
import { type IUser, SEvent } from '@/types';

const props = defineProps({
  user: {
    type: Object as PropType<IUser>,
    required: true
  },
  mode: {
    type: String as PropType<'request' | 'suggest'>,
    required: false,
    default: 'request'
  },
  isRequest: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['reject', 'hide'])

const isRequest = ref(props.isRequest)

const loading = reactive({
  accept: false,
  reject: false,

  add: false,
  cancel: false,
})

const is = reactive({
  friend: false,
  request: false,
})

const { cuser } = storeToRefs(useUser())

const acceptRequest = async () => {
  loading.accept = true
  try {
    const event = await Friend.accept(cuser.value!.id, props.user.id)
    if (event) {
      mewSocket.emit(SEvent.FRIEND_ACCEPT, event)
      is.friend = true
    }
  } catch (error) {
    Logger.error(error)
  } finally {
    loading.accept = false
  }
}

const rejectRequest = async () => {
  loading.reject = true
  try {
    const event = await Friend.reject(cuser.value!.id, props.user.id)
    if (event) {
      mewSocket.emit(SEvent.FRIEND_REJECT, event)
      emit('reject', props.user.id)
    }
  } catch (error) {
    Logger.error(error)
  } finally {
    loading.reject = false
  }
}

const addFriend = async () => {
  loading.add = true
  try {
    const event = await Friend.add(cuser.value!.id, props.user.id)
    if (event) {
      mewSocket.emit(SEvent.FRIEND_REQUEST, event)
      is.request = true
    }
  } catch (error) {
    Logger.error(error)
  } finally {
    loading.add = false
  }
}

const cancelRequest = async () => {
  loading.cancel = true
  try {
    const event = await Friend.cancel(cuser.value!.id, props.user.id)
    if (event) {
      mewSocket.emit(SEvent.FRIEND_CANCEL, event)
      is.request = false
      isRequest.value = false
    }
  } catch (error) {
    Logger.error(error)
  } finally {
    loading.cancel = false
  }
}

const hideUser = () => {
  emit('hide', props.user.id)
}

</script>
<template>
  <Card class="w-56 min-w-[220px] h-[360px]" :pt="{
    title: 'text-lg font-medium text-center text-mb-gray-2 pt-2 truncate px-1',
    header: 'h-52 rounded-t-md',
    body: 'h-20',
    content: 'py-2 my-auto'
  }">
    <template #header>
      <router-link :to="{ name: 'user', params: { id: user.id } }">
        <img :src="user.photoURL" alt="avatar" class="h-52 object-cover w-full rounded-t-md" />
      </router-link>
    </template>
    <template #title>
      <span>{{ user.displayName }}</span>
    </template>
    <template #content>
      <div class="mx-auto px-3">
        <div v-if="mode === 'request'">
          <div v-if="!is.friend" class="mx-auto w-full space-y-2">
            <Button aria-label="Chấp nhận" size="small" :loading="loading.accept" :pt="{
              root: [
                'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center ',
                'align-bottom transition duration-200 ease-in-out focus:outline-none focus:outline-offset-0 text-white',
                'bg-blue-500 border border-blue-500 hover:bg-blue-600 hover:border-blue-600 rounded-md text-xs py-3 px-3',
                'h-full w-full justify-center space-x-2'
              ]
            }" @click="acceptRequest">
              <i v-if="loading.accept" class="pi pi-spin pi-spinner"></i>
              <img v-else src="/icons/friend/add-friend.png" class=" invert w-4 h-4" />
              <span class="font-medium text-[16px]">Chấp nhận</span>
            </Button>
            <Button aria-label="Từ chối" size="small" :loading="loading.reject" :pt="{
              root: [
                'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom transition duration-200 ease-in-out',
                'text-white bg-blue-500 border border-blue-500 hover:bg-blue-600 rounded-md text-xs py-3 px-3 space-x-2 bg-mb-gray hover:bg-mb-gray-h border-mb-gray',
                ' h-full w-full justify-center'
              ]
            }" @click="rejectRequest">
              <i v-if="loading.reject" class="pi pi-spin pi-spinner text-gray-700"></i>
              <img v-else src="/icons/friend/cancel-add-friend.png" class="w-4 h-4" />
              <span class="font-medium text-[16px] text-gray-700">Từ chối</span>
            </Button>
          </div>
          <div v-else>
            <Button aria-label="Đã chấp nhận lời mời kết bạn" size="small" disabled :pt="{
              root: [
                'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom transition duration-200 ease-in-out',
                'text-white rounded-md text-xs py-3 px-3 space-x-2 bg-mb-gray border-mb-gray',
                ' h-full w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed'
              ]
            }">
              <span class="font-medium text-[16px] text-gray-700 truncate">Đã chấp nhận lời mời kết bạn</span>
            </Button>
          </div>
        </div>
        <div v-if="mode === 'suggest'">
          <div v-if="!is.request && !isRequest" class="mx-auto w-full space-y-2">
            <Button aria-label="Chấp nhận" size="small" :loading="loading.accept" :pt="{
              root: [
                'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center ',
                'align-bottom transition duration-200 ease-in-out focus:outline-none focus:outline-offset-0 text-white',
                'bg-blue-500 border border-blue-500 hover:bg-blue-600 hover:border-blue-600 rounded-md text-xs py-3 px-3',
                'h-full w-full justify-center space-x-2'
              ]
            }" @click="addFriend">
              <i v-if="loading.accept" class="pi pi-spin pi-spinner"></i>
              <span class="font-medium text-[16px]">Thêm bạn</span>
            </Button>
            <Button aria-label="Từ chối" size="small" :loading="loading.reject" :pt="{
              root: [
                'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom transition duration-200 ease-in-out',
                'text-white bg-blue-500 border border-blue-500 hover:bg-blue-600 rounded-md text-xs py-3 px-3 space-x-2 bg-mb-gray hover:bg-mb-gray-h border-mb-gray',
                ' h-full w-full justify-center'
              ]
            }" @click="hideUser">
              <i v-if="loading.reject" class="pi pi-spin pi-spinner text-gray-700"></i>
              <span class="font-medium text-[16px] text-gray-700">Gỡ</span>
            </Button>
          </div>
          <div v-else class="mx-auto w-full space-y-2">
            <Button aria-label="Đã gửi lời mời kết bạn" size="small" disabled :pt="{
              root: [
                'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom transition duration-200 ease-in-out',
                'text-white rounded-md text-xs py-3 px-3 space-x-2 bg-mb-gray border-mb-gray',
                ' h-full w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed'
              ]
            }">
              <span class="font-medium text-[16px] text-gray-700 truncate">Đã gửi lời mời kết bạn</span>
            </Button>
            <Button aria-label="Huỷ lời mời" size="small" :loading="loading.cancel" :pt="{
              root: [
                'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom transition duration-200 ease-in-out',
                'text-white bg-blue-500 border border-blue-500 hover:bg-blue-600 rounded-md text-xs py-3 px-3 space-x-2 bg-mb-gray hover:bg-mb-gray-h border-mb-gray',
                ' h-full w-full justify-center'
              ]
            }" @click="cancelRequest">
              <i v-if="loading.cancel" class="pi pi-spin pi-spinner text-gray-700"></i>
              <img v-else src="/icons/friend/cancel-add-friend.png" class="w-4 h-4" />
              <span class="font-medium text-[16px] text-gray-700">Huỷ lời mời</span>
            </Button>
          </div>
        </div>
      </div>

    </template>
  </Card>
</template>