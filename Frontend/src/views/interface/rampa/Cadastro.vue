<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-package" label="Rampa">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Rampa-settings-General />
			</div>
		</vs-tab>
		<vs-tab icon-pack="feather" icon="icon-rss" label="Coletores">
			<div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
				<Rampa-settings-Coletor />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import RampaSettingsGeneral from "./rampa-dados/RampaSettingsGeneral.vue"
import RampaSettingsColetor from "./rampa-dados/RampaSettingsColetor.vue"

export default {
	components: {
		RampaSettingsGeneral,
		RampaSettingsColetor,
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
