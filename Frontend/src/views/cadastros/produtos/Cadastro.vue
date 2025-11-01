<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-send" label="Produtos">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<produtos-settings-general />
			</div>
		</vs-tab>

		<vs-tab icon-pack="feather" icon="icon-rss" label="EAN Relacionados">
			<div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
				<produtos-settings-ean />
			</div>
		</vs-tab>

	</vs-tabs>
</template>

<script>

import produtosSettingsGeneral from "./produtos-dados/ProdutosSettingsGeneral.vue"
import produtosSettingsEan from "./produtos-dados/ProdutosSettingsEan.vue"

export default {
	components: {
		produtosSettingsGeneral,
		produtosSettingsEan,
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
