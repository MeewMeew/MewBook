<template>
  <div class="fixed z-50 top-0 left-0 w-full h-full bg-white bg-opacity-70">
    <div class="grid h-screen place-items-center p-4">
      <div class="bg-white w-full max-w-[500px] mx-auto shadow-xl rounded-xl">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
