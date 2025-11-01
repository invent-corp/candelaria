<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >

		<vs-tab icon-pack="feather" icon="icon-user-plus" label="Tipo Produto">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<TipoProduto-settings-general />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import TipoProdutoSettingsGeneral from "./tipoproduto-dados/TipoProdutoSettingsGeneral.vue"

export default {
	components: {
		TipoProdutoSettingsGeneral,
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
