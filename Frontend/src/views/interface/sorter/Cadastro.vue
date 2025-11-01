<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-map-pin" label="Sorter">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<sorter-settings-General />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import SorterSettingsGeneral from "./sorter-dados/SorterSettingsGeneral.vue"

export default {
	components: {
		SorterSettingsGeneral,
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
