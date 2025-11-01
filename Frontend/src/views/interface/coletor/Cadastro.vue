<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-rss" label="Coletor">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Coletor-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import ColetorSettingsGeneral from "./coletor-dados/ColetorSettingsGeneral.vue"

export default {
	components: {
		ColetorSettingsGeneral,
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
