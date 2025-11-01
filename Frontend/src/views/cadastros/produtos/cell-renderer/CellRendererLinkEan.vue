<template>
  <div class="flex items-center">
    <vs-avatar color=grey :text="params.data.descricao" class="flex-shrink-0 mr-2 headline" size="30px" @click="$router.push(url)" />
    <router-link :to="url" @click.stop.prevent class="text-inherit hover:text-primary">{{ params.value }}</router-link>
  </div>
</template>

<script>
    export default {
        name: 'CellRendererLinkEan',
        computed: {
          url() {
            return "/cadastros/produtos/cadastro/" + this.params.data.id_produto
          }
        }
    }
</script>
