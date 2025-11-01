<template>
    <div class="vx-card p-6">
        <div >
            <b-embed class="centraliza" width='100%' type="video" aspect="16by9" controls>
                <source src="@/assets/images/logo/Invent.mp4" type="video/mp4">
            </b-embed>
        </div>
    </div>
</template>

<script>
import { BEmbed } from 'bootstrap-vue'

export default {
  components: {
    BEmbed,
  },
}
</script>

<style lang="scss">
.centraliza {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
