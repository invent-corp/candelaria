<template>
	<vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs" >


		<vs-tab icon-pack="feather" icon="icon-user" label="Usuário">
			<div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
				<Usuario-settings-general />
			</div>
		</vs-tab>
		<vs-tab icon-pack="feather" icon="icon-lock" label="Senha">
			<div class="tab-change-pwd md:ml-4 md:mt-0 mt-4 ml-0">
				<Usuario-settings-change-password />
			</div>
		</vs-tab>
	</vs-tabs>
</template>

<script>

import UsuarioSettingsGeneral from "./usuario-dados/UsuarioSettingsGeneral.vue"
import UsuarioSettingsChangePassword from "./usuario-dados/UsuarioSettingsChangePassword.vue"

export default {
	components: {
		UsuarioSettingsGeneral,
		UsuarioSettingsChangePassword,
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
