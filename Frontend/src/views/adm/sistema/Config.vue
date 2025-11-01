<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-airplay" label="Sistema">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<config-settings-general/>
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import ConfigSettingsGeneral from "./config-dados/ConfigSettingsGeneral.vue"

export default {
	components: {
		ConfigSettingsGeneral,
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
