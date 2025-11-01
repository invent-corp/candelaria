<template>
	<div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
		<div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
			<vx-card>
				<div slot="no-body" class="full-page-bg-color">
					<div class="vx-row no-gutter justify-center items-center">

						<div class="vx-col hidden lg:block lg:w-1/2">
							<img src="@/assets/images/logo/logo-full.png" alt="login" class="mx-auto">
						</div>

						<div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
							<div class="p-8 login-tabs-container">
								<div class="vx-card__title mb-4">
									<h4 class="mb-4">Login</h4>
									<p>Bem-vindo! Faça o Login.</p>
								</div>						
								<div class="">
									<vs-input
										name="login"
										icon-no-border
										icon="icon icon-user"
										icon-pack="feather"
										label-placeholder="Login"
										v-model="usuario.login"
										class="w-full mt-6"/>
									<vs-input
										type="password"
										name="senha"
										icon-no-border
										icon="icon icon-lock"
										icon-pack="feather"
										label-placeholder="Senha"
										v-model="usuario.senha"
										class="w-full mt-8" />
									<!-- <div class="flex flex-wrap justify-between my-5"> -->
										<!-- <router-link to="">Esqueceu a Senha?</router-link> -->
									<!-- </div> -->
									
									<div class="mt-4"></div>
									<vs-button class="float-right mb-4" @click="loginJWT">Login</vs-button>
									<vs-divider class="mb-1"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</vx-card>
		</div>
	</div>
</template>

<script>


import axios from 'axios'
import { backendUrl } from '@/globalComponents'


export default{
	data() {
		return {
		config: [],
			// ATIVAR PARA LOGIN
		usuario: {
			login: "",
			senha: ""
		},
		checkbox_remember_me: false,
		}
	},
	computed: {
		validateForm() {
		return !this.errors.any() && this.usuario.login != '' && this.usuario.senha != '';
		},
	},
	methods: {
		checkConfig() {
			axios.get(`${backendUrl}/config/1`)
                .then(res => {this.config = res.data
					// TEMA CONFIG
					if (this.config.tema_padrao == "Light") {
						this.$store.dispatch('updateTheme', "light")
					} else {
						this.$store.dispatch('updateTheme', "dark")
					}
				})
		},
		loginJWT() {
			// Loading
			this.$vs.loading()
			
			axios.post(`${backendUrl}/login`, this.usuario)
                .then(res => {
                    this.$store.commit('UPDATE_USER_INFO', res.data)
					let userInfo = JSON.parse(localStorage.getItem("userInfo"))
					this.$acl.change(userInfo.userRole)

					if (this.usuario.tema_padrao == "light") {
						this.$store.dispatch('updateTheme', "light")
					} else {
						this.$store.dispatch('updateTheme', "dark")
					}

					this.$vs.loading.close()
					this.$router.push({ path: '/home' })
					this.$vs.notify({
						title: 'Login Efetuado!',
						text: `Bem vindo(a) ${this.$store.state.AppActiveUsuario.displayName.toUpperCase()} ! `,
						icon: 'close',
						color: 'success',
						position: 'top-right',
						duration: 10000,
						click: ()=>{}
					})
                })
                .catch(err => {
				this.$vs.loading.close()
				if(err.message === "Request failed with status code 400") {
					this.$vs.notify({
						title: 'Erro',
						text: "Usuário não encontrado!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				if(err.message === "Request failed with status code 401") {
					this.$vs.notify({
						title: 'Usuário Inativo',
						text: "Verifique com Administrador do Sistema!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				if(err.message === "Request failed with status code 402") {
					this.$vs.notify({
						title: 'Senha inválida',
						text: "Verifique a Senha Digitada!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				if(err.message === "Request failed with status code 403") {
					this.$vs.notify({
						title: 'Login/Senha inválidos',
						text: "Informe Login e Senha!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				if(err.message === "Network Error") {
					this.$vs.notify({
						title: 'Backend / Banco de Dados',
						text: "Sem comunicação com Backend e/ou Banco de Dados!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				this.usuario.login = ''
				this.usuario.senha = ''
			})		
		}
	},
	created() {
		// this.checkConfig()
	},
	mounted() {
		localStorage.removeItem('userInfo')
		this.$acl.change(['0'])
	},
}

</script>

<style lang="scss">

</style>