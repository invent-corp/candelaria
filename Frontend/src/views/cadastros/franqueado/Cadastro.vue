<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-send" label="Franqueados">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<franqueado-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import franqueadoSettingsGeneral from "./franqueado-dados/FranqueadoSettingsGeneral.vue"

export default {
	components: {
		franqueadoSettingsGeneral,
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
