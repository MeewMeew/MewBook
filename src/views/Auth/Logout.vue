<script setup lang="ts">
import { signOut } from 'firebase/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { User } from '@/database';
import { Logger } from '@/helpers/logger';
import { auth } from '@/shared/firebase';
import { useUser } from '@/stores/user';
import type { IUser } from '@/types';

const { cuser, setUser } = useUser()
const router = useRouter();

onMounted(() => {
  signOut(auth).then(async () => {
    Logger.warn('User logged out');
    await User.update({ authid: cuser?.authid!, isOnline: false });
    setUser(null as unknown as IUser);
    router.push({ name: 'login' });
  })
})

</script>

<template>
  <div>Logging out...</div>
</template>