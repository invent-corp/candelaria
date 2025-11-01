<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-send" label="Picking">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<picking-settings-general />
			</div>
		</vs-tab>

		<vs-tab icon-pack="feather" icon="icon-rss" label="Endereçamento">
			<div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
				<picking-produtos-settings />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import pickingSettingsGeneral from "./picking-dados/PickingSettingsGeneral.vue"
import pickingProdutosSettings from "./picking-dados/PickingProdutosSettings.vue"


export default {
	components: {
		pickingSettingsGeneral,
		pickingProdutosSettings,
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
