<template>
  <div class="flex items-center">
    <vs-avatar color=grey :text="params.data.mapa_sorter" class="flex-shrink-0 mr-2 headline" size="30px" @click="$router.push(url)" />
    <router-link :to="url" @click.stop.prevent class="text-inherit hover:text-primary">{{ params.value }}</router-link>
  </div>
</template>

<script>
    export default {
        name: 'CellRendererLink',
        computed: {
          url() {
            return "/interface/sorter/cadastro/" + this.params.data.id_sorter
          }
        }
    }
</script>
