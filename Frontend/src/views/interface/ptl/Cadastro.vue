<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-map-pin" label="PTL">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<ptl-settings-General />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import PtlSettingsGeneral from "./ptl-dados/PtlSettingsGeneral.vue"

export default {
	components: {
		PtlSettingsGeneral,
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
