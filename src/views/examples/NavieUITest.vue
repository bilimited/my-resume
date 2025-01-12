<script setup lang="ts">
import { NButton, NFlex, NSpace } from 'naive-ui'
</script>

<template>
  <NFlex vertical>
    <NSpace>
      <NButton type="primary" round>
        TestButton
      </NButton>
      <NButton type="info" dashed>
        InfoButton
      </NButton>
      <NButton type="error" size="large">
        ErrorButton
      </NButton>

    </NSpace>

  </NFlex>



</template>
