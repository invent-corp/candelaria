<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-send" label="Endereço PTM">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<enderecoptm-settings-general />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import enderecoptmSettingsGeneral from "./enderecoptm-dados/EnderecoPtmSettingsGeneral.vue"


export default {
	components: {
		enderecoptmSettingsGeneral,
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
