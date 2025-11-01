<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-user-plus" label="Função">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Funcao-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import FuncaoSettingsGeneral from "./funcao-dados/FuncaoSettingsGeneral.vue"

export default {
	components: {
		FuncaoSettingsGeneral,
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
