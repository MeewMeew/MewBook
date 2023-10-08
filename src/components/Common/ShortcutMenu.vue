<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import { useUser } from '@/stores/user';

const { cuser } = storeToRefs(useUser())
const expanded = ref(false)
const items = ref([
  {
    icon: 'feed.png',
    label: 'Bảng tin',
    to: { name: 'dashboard' },
    bgImage: false
  },
  {
    icon: 'list-icon.png',
    label: 'Tìm bạn bè',
    to: { name: 'friends' },
    bgImage: true,
    bgPosition: '0_-296px'
  },
  {
    icon: 'list-icon.png',
    label: 'Đã lưu',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_-185px'
  },
  {
    icon: 'list-icon.png',
    label: 'Nhóm của bạn',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_-37px'
  },
  {
    icon: 'list-icon.png',
    label: 'Marketplace',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_-407px',
    hide: true,
  },
  {
    icon: 'list-icon.png',
    label: 'Chơi game',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_-74px',
    hide: true,
  },
  {
    icon: 'credit-card.png',
    label: 'Đơn hàng và thanh toán',
    to: { name: 'dashboard' },
    bgImage: false,
    hide: true,
  },
  {
    icon: 'list-icon.png',
    label: 'Kỷ niệm',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_-444px',
    hide: true,
  },
  {
    icon: 'messenger.png',
    label: 'Messenger',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_0px',
    hide: true,
  },
  {
    icon: 'event.png',
    label: 'Sự kiện',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_0px',
    hide: true,
  },
  {
    icon: 'list-icon.png',
    label: 'Trang',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_-111px',
    hide: true,
  },
  {
    icon: 'video-game.png',
    label: 'Video chơi Game',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_0px',
    hide: true,
  },
  {
    icon: 'list-icon.png',
    label: 'Watch',
    to: { name: 'dashboard' },
    bgImage: true,
    bgPosition: '0_-518px',
    hide: true,
  },
])


</script>
<template>
  <div>
    <div class="py-4 flex flex-col gap-2" v-if="cuser">
      <div class="h-full p-2 flex flex-col gap-4 w-full ">
        <div class="h-[85vh]">
          <div class="animate__animated animate__fadeIn transition-all flex flex-col w-full 2xl:w-6/7">
            <div class="w-full mb-0.5 mt-2">
              <router-link :to="{ name: 'user', params: { id: cuser.id } }"
                class="px-2 py-1 rounded-lg flex items-center gap-3 hover:bg-zinc-200 duration-300">
                <img :src="cuser.photoURL" :alt="cuser.displayName" class="max-w-[36px] max-h-[36px] avatar" />
                <span class="font-sans font-medium text-sm text-[#050505]">{{ cuser.displayName }}</span>
              </router-link>
            </div>

            <div class="w-full mb-0.5" v-for="(item, index) in items" :key="index"
              v-show="item.hide ? item.hide && expanded : true">
              <router-link :to="item.to"
                class="px-2 py-1 rounded-lg flex items-center gap-3 hover:bg-zinc-200 duration-300">
                <img v-if="!item.bgImage" :src="`/icons/${item.icon}`" class="w-[36px] h-[36px] inline-block" />
                <i v-else :style="{ backgroundImage: `url(/icons/${item.icon})` }"
                  :class="`w-[36px] h-[36px] inline-block bg-no-repeat bg-auto bg-[${item.bgPosition}]`" />
                <span class="font-sans font-medium text-sm text-[#050505]">{{ item.label }}</span>
              </router-link>
            </div>

            <div class="w-full mb-0.5 cursor-pointer" v-if="!expanded" @click="expanded = !expanded">
              <div class="px-2 py-1 rounded-lg flex items-center gap-3 hover:bg-zinc-200 duration-300">
                <div class="bg-zinc-200 flex h-[36px] w-[36px] rounded-full">
                  <i class="pi pi-chevron-down text-lg m-auto" />
                </div>
                <span class="font-sans font-medium text-sm text-[#050505]">Xem thêm</span>
              </div>
            </div>
            <div class="w-full mb-0.5 cursor-pointer" v-else @click="expanded = !expanded">
              <div class="px-2 py-1 rounded-lg flex items-center gap-3 hover:bg-zinc-200 duration-300">
                <div class="bg-zinc-200 flex h-[36px] w-[36px] rounded-full">
                  <i class="pi pi-chevron-up text-lg m-auto" />
                </div>
                <span class="font-sans font-medium text-sm text-[#050505]">Ẩn bớt</span>
              </div>
            </div>
            <div role="separator" class="border-b border-[#CED0D4] mx-2 mt-1"></div>
          </div>
          <div>
            <div class="mt-3">
              <div class="flex flex-row w-full 2xl:w-3/4 justify-between">
                <h3 class="p-2">
                  <span class="text-[#65676B] font-medium">Lối tắt của bạn</span>
                </h3>
              </div>
            </div>
            <div class="flex flex-col w-full xl:w-2/3 overflow-hidden"></div>
          </div>
        </div>
      </div>
      <div class="text-xs font-medium p-2 text-[#65676B] bottom-0 relative cursor-pointer">
        Privacy · Terms · Cookies · Mew &copy; {{ new Date().getFullYear() }}
      </div>
    </div>
  </div>
</template>