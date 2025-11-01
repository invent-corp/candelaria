<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-database" label="Integrações">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Integracao-settings-general />
			</div>
		</vs-tab>
		<vs-tab icon-pack="feather" icon="icon-download-cloud" label="Gerar JSON">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Identificador-settings-general />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import IntegracaoSettingsGeneral from "./integracao-dados/IntegracaoSettingsGeneral.vue"
import IdentificadorSettingsGeneral from "./integracao-dados/IdentificadorSettingsGeneral.vue"

export default {
	components: {
		IntegracaoSettingsGeneral,
		IdentificadorSettingsGeneral,
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
