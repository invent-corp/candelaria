<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-box" label="OrderStart">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Order-settings-general />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import OrderSettingsGeneral from "./order-dados/OrderSettingsGeneral.vue"

export default {
	components: {
		OrderSettingsGeneral,
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
