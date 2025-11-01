<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-users" label="Grupo">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Grupo-settings-general />
			</div>
		</vs-tab>
		<vs-tab icon-pack="feather" icon="icon-log-in" label="Acessos">
			<div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
				<Grupo-settings-acesso />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import GrupoSettingsGeneral from "./grupo-dados/GrupoSettingsGeneral.vue"
import GrupoSettingsAcesso from "./grupo-dados/GrupoSettingsAcesso.vue"

export default {
	components: {
		GrupoSettingsGeneral,
		GrupoSettingsAcesso,
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
