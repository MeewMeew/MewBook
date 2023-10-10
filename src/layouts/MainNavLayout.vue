<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { PropType } from 'vue'
import { ref } from 'vue'
import DotsGrid from 'vue-material-design-icons/DotsGrid.vue'
import FacebookMessenger from 'vue-material-design-icons/FacebookMessenger.vue'
import Logout from 'vue-material-design-icons/Logout.vue'

import CreatePostOverlay from '@/components/Common/CreatePostOverlay.vue'
import CropperModal from '@/components/Common/CropperModal.vue'
import IconButton from '@/components/Common/IconButton.vue'
import AppLogo from '@/components/Icons/AppLogo.vue'
import Bookmark from '@/components/Icons/Bookmark.vue'
import Friend from '@/components/Icons/Navbar/Friend.vue'
import Group from '@/components/Icons/Navbar/Group.vue'
import Home from '@/components/Icons/Navbar/Home.vue'
import PlaceMarket from '@/components/Icons/Navbar/PlaceMarket.vue'
import Watch from '@/components/Icons/Navbar/Watch.vue'
import BellButton from '@/components/Navbar/BellButton.vue'
import { useGeneral } from '@/stores/general'
import { useUser } from '@/stores/user'
const { isPostOverlay, isCropperModal } = storeToRefs(useGeneral())
const { cuser } = storeToRefs(useUser())

const showMenu = ref(false)

type SelectOption = 'home' | 'friends' | 'watch' | 'placemarket' | 'group' | 'bookmarks' | 'messenger' | 'none'

defineProps({
  select: {
    type: String as PropType<SelectOption>,
    required: true
  }
})
</script>

<template>
  <header v-if="cuser"
    class="z-50 w-full flex items-center justify-between h-[56px] bg-white shadow-sm border-b sticky top-0 px-2 font-sans text-md">
    <div class="flex items-center justify-start w-1/6">
      <router-link to="/" class="pl-1 min-w-[55px]">
        <AppLogo class="w-[40px] h-[40px]" />
      </router-link>

      <div
        class="flex relative bg-[#EFF2F5] items-center justify-center lg:rounded-[10vw] lg:w-full w-[39px] rounded-full cursor-pointer">
        <i class="pi pi-search lg:ml-2 lg:p-1 p-2 m-auto text-[#64676B] text-lg" />
        <input type="text" placeholder="Tìm kiếm trên Mewbook"
          class="outline-none border-none h-full bg-transparent pt-[.6rem] pr-[1rem] pb-[.6rem] pl-[.25rem] font-[.9rem] w-full hidden lg:block" />
      </div>
      <router-link class="block md:hidden" :to="{ name: 'bookmarks' }">
        <IconButton :disable-hidden="true">
          <Bookmark />
        </IconButton>
        <div v-if="select === 'bookmarks'" class="w-[90%] h-[4px] bg-mb-blue mx-auto rounded-full -mb-1"></div>
      </router-link>
    </div>

    <div class="hidden w-2/5 select-none md:flex justify-start md:justify-center items-center">
      <router-link :to="{ name: 'dashboard' }" class="flex flex-col">
        <IconButton>
          <Home :fill="select === 'home'" />
        </IconButton>
        <div v-if="select === 'home'" class="w-[90%] h-[4px] bg-mb-blue mx-auto rounded-full -mb-1"></div>
      </router-link>
      <router-link :to="{ name: 'friends' }">
        <IconButton>
          <Friend :fill="select === 'friends'" />
        </IconButton>
        <div v-if="select === 'friends'" class="w-[90%] h-[4px] bg-mb-blue mx-auto rounded-full -mb-1"></div>
      </router-link>
      <router-link :to="{ name: 'dashboard' }">
        <IconButton>
          <Watch :fill="select === 'watch'" />
        </IconButton>
        <div v-if="select === 'watch'" class="w-[90%] h-[4px] bg-mb-blue mx-auto rounded-full -mb-1"></div>
      </router-link>
      <router-link :to="{ name: 'dashboard' }">
        <IconButton>
          <PlaceMarket :fill="select === 'placemarket'" />
        </IconButton>
        <div v-if="select === 'placemarket'" class="w-[90%] h-[4px] bg-mb-blue mx-auto rounded-full -mb-1"></div>
      </router-link>
      <router-link :to="{ name: 'dashboard' }">
        <IconButton>
          <Group :fill="select === 'group'" />
        </IconButton>
        <div v-if="select === 'group'" class="w-[90%] h-[4px] bg-mb-blue mx-auto rounded-full -mb-1"></div>
      </router-link>
      <router-link class="block md:hidden" :to="{ name: 'bookmarks' }">
        <IconButton :disable-hidden="true">
          <Bookmark />
        </IconButton>
        <div v-if="select === 'bookmarks'" class="w-[90%] h-[4px] bg-mb-blue mx-auto rounded-full -mb-1"></div>
      </router-link>
    </div>

    <div class="flex items-center justify-end w-2/12 mr-4">
      <button class="rounded-full bg-[#E3E6EA] p-2 hover:bg-gray-300 mx-1 cursor-pointer">
        <DotsGrid :size="23" fillColor="#050505" />
      </button>
      <div class="rounded-full bg-[#E3E6EA] p-2 hover:bg-gray-300 mx-1 cursor-pointer"
        :class="{ 'hidden': select === 'messenger' }">
        <FacebookMessenger :size="23" fillColor="#050505" />
      </div>
      <BellButton />
      <div class="flex items-center justify-center relative font-medium">
        <button @click="showMenu = !showMenu">
          <img class="avatar ml-1 max-w-[39px] max-h-[39px] cursor-pointer" :src="cuser.photoURL" />
        </button>
        <div v-if="showMenu" class="absolute bg-white shadow-xl top-10 right-0 w-[330px] rounded-lg p-1 border mt-1">
          <router-link :to="{ name: 'user', params: { id: cuser.id } }" @click="showMenu = !showMenu">
            <div class="flex items-center gap-3 hover:bg-gray-200 p-2 rounded-lg">
              <img class="avatar ml-1 max-w-[35px] max-h-[35px] cursor-pointer" :src="cuser.photoURL" />
              <span class="text-[#050505]">{{ cuser.displayName }}</span>
            </div>
          </router-link>
          <router-link :to="{ name: 'logout' }" class="w-full">
            <div class="flex items-center gap-3 hover:bg-gray-200 px-2 py-2.5 rounded-lg cursor-pointer">
              <Logout class="pl-2" :size="30" />
              <span class="text-[#050505]">Logout</span>
            </div>
          </router-link>
          <div class="text-xs font-medium p-2 pt-3 border-t mt-1 text-[#65676B]">
            Privacy · Terms · Advertising · Ad Choices · Cookies · Meta © 2023
          </div>
        </div>
      </div>
    </div>
  </header>

  <slot class="relative"></slot>
  <CreatePostOverlay v-if="isPostOverlay" @showModal="isPostOverlay = false" @keyup.esc="isPostOverlay = false" />
  <CropperModal v-if="isCropperModal" @showModal="isCropperModal = false" @keyup.esc="isCropperModal = false" />
</template>

<style lang="postcss">
.active {
  fill: #0084ff;
}
</style>
