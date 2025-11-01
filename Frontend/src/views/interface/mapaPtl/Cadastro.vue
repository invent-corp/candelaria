<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-map" label="Mapa PTL">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<MapaPtl-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import MapaPtlSettingsGeneral from "./mapaPtl-dados/MapaPtlSettingsGeneral.vue"

export default {
	components: {
		MapaPtlSettingsGeneral,
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
