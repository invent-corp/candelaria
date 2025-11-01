<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-truck" label="Rota">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Rota-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import RotaSettingsGeneral from "./rota-dados/RotaSettingsGeneral.vue"

export default {
	components: {
		RotaSettingsGeneral,
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
