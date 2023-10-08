<script setup lang="ts">

import ContactList from '@/components/Common/ContactList.vue'
import CreatePostBox from '@/components/Common/CreatePostBox.vue'
import ShortcutMenu from '@/components/Common/ShortcutMenu.vue'
import Stories from '@/components/Common/Stories.vue'
import PostList from '@/components/Post/PostList.vue'
import MainNavLayout from '@/layouts/MainNavLayout.vue'
import { useUser } from '@/stores/user'


const { cuser } = useUser()
</script>

<template>
  <MainNavLayout select="home">
    <div class="w-full bg-[#F1F2F5] flex flex-row items-start justify-center h-full">
      <ShortcutMenu class="h-full top-14 hidden sticky 2xl:block min-w-xs"/>
      <div v-if="cuser"
        class="h-full p-4 flex flex-col w-full min-w-sm max-w-3xl">
        <Stories />
        <CreatePostBox />
        <PostList scope="all" />
      </div>
      <ContactList class="xl:block min-w-[340px] "/>
    </div>
  </MainNavLayout>
</template>
