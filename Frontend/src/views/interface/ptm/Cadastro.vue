<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-map-pin" label="PTM">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<ptm-settings-General />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import PtmSettingsGeneral from "./ptm-dados/PtmSettingsGeneral.vue"

export default {
	components: {
		PtmSettingsGeneral,
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
