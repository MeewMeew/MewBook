<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { Attachment } from '@/database';
import { User } from '@/database/user';
import { mewSocket } from '@/helpers/socket';
import { auth } from '@/shared/firebase'
import { useUser } from '@/stores/user'
import { SEvent } from '@/types';

const { cuser, setUser } = useUser()
const router = useRouter()

onMounted(async () => {
  if (router.currentRoute.value.name === 'logout') return;
  onAuthStateChanged(auth, async (userAuth) => {
    if (userAuth) {
      const user = (await User.get({ authid: userAuth.uid }))
      if (!user) {
        return router.push({ name: 'login' })
      }
      if (userAuth.emailVerified !== user.verified !== true) {
        await User.update({ authid: userAuth.uid, verified: userAuth.emailVerified })
      }
      const updated = await User.update({ authid: userAuth.uid, isOnline: true })
      if (Attachment.isID(updated.photoURL)) {
        const attachment = await Attachment.get(updated.photoURL)
        updated.photoURL = await Attachment.image(attachment.attachments.large)
      }
      setUser(updated)
      return mewSocket.emit(SEvent.USER_ONLINE, updated.id)
    }
    return router.push({ name: 'login' })
  })
  window.addEventListener('beforeunload', async () => {
    if (cuser?.uid) {
      const updated = await User.update({ authid: cuser?.uid, isOnline: false })
      setUser(updated)
      mewSocket.emit(SEvent.USER_OFFLINE, cuser.id)
    }
  })

  if (!cuser) return router.push({ name: 'login' })
})

</script>

<template>
  <router-view :key="$route.path" />
</template>
