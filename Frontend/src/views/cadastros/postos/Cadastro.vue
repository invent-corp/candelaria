<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-send" label="Postos">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<postos-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import postosSettingsGeneral from "./postos-dados/PostosSettingsGeneral.vue"

export default {
	components: {
		postosSettingsGeneral,
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
