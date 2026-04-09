<template>
  <div id="wrapper">
    <div class="container">
      <div class="info">
        <h1>Oops!</h1>
        <h2>Where are we?</h2>
        <arb>
          The page you are looking for was moved, removed, renamed or
          <br />might never existed.
        </arb>
        <router-link to="#" @click.native="goBack()" class="btn"
          >Go Back</router-link
        >
      </div>

      <div
        class="bear"
        :style="{
          backgroundImage: `url(${CDN_IMAGE_MINIO_S3_IMAGE}/notfound.png)`,
        }"
      >
        <div
          class="zzz"
          :style="{
            backgroundImage: `url(${CDN_IMAGE_MINIO_S3_IMAGE}/sleep.gif)`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CDN_IMAGE_MINIO_S3_IMAGE } from '@/constants/urls'
import useGeneralStore from '@/store/useGeneralStore'
const generalStore = useGeneralStore()

const goBack = () => {
  const findFirstWithUrl = (tree: any = generalStore.menuRouter): any => {
    if (!Array.isArray(tree)) return null

    for (const node of tree) {
      if (node.url) {
        return node
      }
    }
    return null
  }
  const isNewTab = !sessionStorage.getItem('tab_initialized')
  sessionStorage.setItem('tab_initialized', 'true')

  const lastValidRoute = (() => {
    try {
      const path = localStorage.getItem('last_route')
      return path ? JSON.parse(path) : null
    } catch (error) {
      console.error('Invalid path in localStorage:', error)
      return null
    }
  })()

  const hasHistory = window.history.length >= 1

  if (!isNewTab && hasHistory && lastValidRoute) {
    window.router.push(lastValidRoute)
  } else {
    const first = findFirstWithUrl()
    window.router.push(first?.url || '/')
  }
}
</script>

<style scoped lang="scss">
@use '@/css/not_found.scss';
</style>
