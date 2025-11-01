<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-send" label="Caixas">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<caixas-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import caixasSettingsGeneral from "./caixas-dados/CaixasSettingsGeneral.vue"

export default {
	components: {
		caixasSettingsGeneral,
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
