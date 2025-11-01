<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center">
            <!-- <img src="@/assets/images/pages/404.png" alt="graphic-404" class="mx-auto mb-4 max-w-full"> -->
            <vx-card >
                <h1 class="sm:mx-0 mx-4 sm:mb-8 mb-8 text-4xl text-primary">Página não encontrada!</h1>
                <p class="font-semibold mb-8 text-2xl">{{ activeUserInfo.displayName }}</p>
                <p class="sm:mx-0 mx-4 sm:mb-12 mb-8 text-lg d-theme-text">Parece que você econtrou uma raridade! Pedimos desculpas pela inconveniência.</p>
                <vs-button class="mb-2" v-if="activeUserInfo.displayName !== undefined" size="large" to=/home>Página Inicial</vs-button>
				<vs-button class="mb-2" v-else size="large" :href="{url: 'http://127.0.0.1:8080'}">Página Login</vs-button>
            </vx-card>
        </div>
    </div>
</template>

<script>

export default {
	computed: {
		activeUserInfo() {
			return this.$store.state.AppActiveUsuario
		},
	},
}
</script>
