<template>
  <div class="flex items-center">
    <router-link :to="url" @click.stop.prevent class="text-inherit hover:text-primary">{{ params.value }}</router-link>
  </div>
</template>

<script>
    export default {
        name: 'CellRendererLink',
        computed: {
          url() {
            return "/adm/sistema/limparpostositens/" + this.params.data.id_posto
          }
        }
    }
</script>
