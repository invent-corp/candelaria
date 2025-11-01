<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-box" label="Exceção">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Excecao-settings-general />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import ExcecaoSettingsGeneral from "./excecao-dados/ExcecaoSettingsGeneral.vue"

export default {
	components: {
		ExcecaoSettingsGeneral,
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
