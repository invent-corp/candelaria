<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-send" label="Ponto de Decisão">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<pontoDecisao-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import pontoDecisaoSettingsGeneral from "./pontoDecisao-dados/PontoDecisaoSettingsGeneral.vue"

export default {
	components: {
		pontoDecisaoSettingsGeneral,
	}
}
</script>

<style lang="scss">
#profile-tabs {
  .vs-tabs--content {
    padding: 0;
  }
}
</style>
