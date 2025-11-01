<template>
	<vx-card no-shadow>

		<div class="flex-wrap items-center justify-start">

			<div class="flex vx-col">
				<vs-icon color='primary' class="mr-2 mt-2" icon-pack="feather" icon="icon-database"></vs-icon>
				<p class="mb-2 mt-1 text-lg">Caixa</p>
			</div>
			<label for="ArquivoCaixa"/>
			<input color="primary" class="text-primary text-md mb-0" type="file" id="ArquivoCaixa" value="Import" />
			<div class="flex vx-col w-1/1 ">
				<vs-button class="w-48 h-10 mt-8" icon-pack="feather" icon="icon-upload" @click="SaveCaixa" id="import">Integrar</vs-button>
				<vs-input id="resultcaixa" font-size=1.1rem disabled class="sm:mt-1 w-full text-lg" icon-pack="feather" icon="icon-download" label="Status da Integração"></vs-input>
			</div>
			<vs-divider class="mt-4 mb-2"/>
		
			<div class="flex vx-col">
				<vs-icon color='primary' class="mr-2 mt-2" icon-pack="feather" icon="icon-database"></vs-icon>
				<p class="mb-2 mt-1 text-lg">Caixa Corte</p>
			</div>
			<label for="ArquivoCaixaCorte"/>
			<input color="primary" class="text-primary text-md mb-0" type="file" id="ArquivoCaixaCorte" value="Import" />
			<div class="flex vx-col w-1/1">
				<vs-button class="w-48 h-10 mt-8" icon-pack="feather" icon="icon-upload" @click="SaveCaixaCorte" id="import">Integrar</vs-button>
				<vs-input id="resultcaixacorte" font-size=1.1rem disabled class="sm:mt-1 w-full text-lg" icon-pack="feather" icon="icon-download" label="Status da Integração"></vs-input>
			</div>
			<vs-divider class="mt-4 mb-2"/>
		
			<div class="flex vx-col">
				<vs-icon color='primary' class="mr-2 mt-2" icon-pack="feather" icon="icon-database"></vs-icon>
				<p class="mb-2 mt-1 text-lg">Produto Alternativo</p>
			</div>
			<label for="ArquivoProdAlter"/>
			<input color="primary" class="text-primary text-md mb-0" type="file" id="ArquivoProdAlter" value="Import" />
			<div class="flex vx-col w-1/1">
				<vs-button class="w-48 h-10 mt-8" icon-pack="feather" icon="icon-upload" @click="SaveProdAlter" id="import">Integrar</vs-button>
				<vs-input id="resultprodalter" font-size=1.1rem disabled class="sm:mt-1 w-full text-lg" icon-pack="feather" icon="icon-download" label="Status da Integração"></vs-input>
			</div>
			<vs-divider class="mt-4"/>
			
		</div>

	</vx-card>
</template>

<script>

import axios from 'axios'
import { wsIntegracaoUrl } from '@/globalComponents'

export default {
	methods: {
		Load() {
			this.$vs.dialog({
				color: 'primary',
				title: 'ATENÇÃO !',
				text: ' >> AGUARDE A CONCLUSÃO DA INTEGRAÇÃO << Ao sair da página antes de terminar, não será possível verificar o Status da Integração realizada !',
				acceptText: 'OK'							
			})
		},
		SaveCaixa() {
			const files = document.getElementById('ArquivoCaixa').files
			
			if (files.length <= 0) {
				return false
			}

			const fr = new FileReader()

			fr.onload = e => {
				try {
					const arquivo = JSON.parse(e.target.result)
					document.getElementById('resultcaixa').value = ' >> AGUARDE ! - Integração Caixa - Processando...'
					axios.post(`${wsIntegracaoUrl}/caixa`, arquivo)
					.then(() => {
						document.getElementById('resultcaixa').value = ' >> SUCESSO - Integração Caixa - Todos os Dados validados e gravados no Banco de Dados!'
						this.showUpdateSuccess()
						setTimeout(()=>{
							document.getElementById('ArquivoCaixa').value = ''
						},5000)
					})
					.catch(err => {
						if (err.message === "Network Error") {
							document.getElementById('resultcaixa').value = ' >> ERRO - Integração Caixa - '+ err +'!'
						} else {
							document.getElementById('resultcaixa').value = ' >> ERRO - Integração Caixa - Inconsistências no arquivo JSON (Campos/Valores/Formato) !'	
						}
						this.showUpdateError()
						setTimeout(()=>{
							document.getElementById('ArquivoCaixa').value = ''
						},5000)
					})
				}
				catch (e) {
					if (e instanceof SyntaxError) {
						document.getElementById('resultcaixa').value = ' >> ERRO - Integração Caixa - Formatação do arquivo JSON recebido é Inválida !'
						this.showUpdateError()
					} else {
						document.getElementById('resultcaixa').value = ' >> ERRO - Integração Caixa - '+ e +' !'
						this.showUpdateError()
					}
					setTimeout(()=>{
						document.getElementById('ArquivoCaixa').value = ''
					},5000)
				}
			}
			fr.readAsText(files.item(0))
		},
		SaveCaixaCorte() {
			const files = document.getElementById('ArquivoCaixaCorte').files
			
			if (files.length <= 0) {
				return false
			}

			const fr = new FileReader()

			fr.onload = e => {
				try {
					const arquivo = JSON.parse(e.target.result)
					document.getElementById('resultcaixa').value = ' >> AGUARDE ! - Integração Caixa Corte - Processando...'
					axios.post(`${wsIntegracaoUrl}/caixacorte`, arquivo)
					.then(() => {
						document.getElementById('resultcaixacorte').value = ' >> SUCESSO - Integração Caixa Corte - Todos os Dados validados e gravados no Banco de Dados!'
						this.showUpdateSuccess()
						setTimeout(()=>{
							document.getElementById('ArquivoCaixaCorte').value = ''
						},5000)
					})
					.catch(err => {
						if (err.message === "Network Error") {
							document.getElementById('resultcaixacorte').value = ' >> ERRO - Integração Caixa Corte - '+ err +'!'
						} else {
							document.getElementById('resultcaixacorte').value = ' >> ERRO - Integração Caixa Corte - Inconsistências no arquivo JSON (Campos/Valores/Formato) !'
						}
						this.showUpdateError()
						setTimeout(()=>{
							document.getElementById('ArquivoCaixaCorte').value = ''
						},5000)
					})
				}
				catch (e) {
					if (e instanceof SyntaxError) {
						document.getElementById('resultcaixacorte').value = ' >> ERRO - Integração Caixa Corte - Formatação do arquivo JSON recebido é Inválida !'
						this.showUpdateError()
					} else {
						document.getElementById('resultcaixacorte').value = ' >> ERRO - Integração Caixa Corte - '+ e +' !'
						this.showUpdateError()
					}
					setTimeout(()=>{
						document.getElementById('ArquivoCaixaCorte').value = ''
					},5000)
				}
			}
			fr.readAsText(files.item(0))
		},
		SaveProdAlter() {
			const files = document.getElementById('ArquivoProdAlter').files
			
			if (files.length <= 0) {
				return false
			}

			const fr = new FileReader()

			fr.onload = e => {
				try {
					const arquivo = JSON.parse(e.target.result)
					document.getElementById('resultcaixa').value = ' >> AGUARDE ! - Integração Produto - Processando...'
					axios.post(`${wsIntegracaoUrl}/produtoalternativo`, arquivo)
					.then(() => {
						document.getElementById('resultprodalter').value = ' >> SUCESSO - Integração Produto - Todos os Dados validados e gravados no Banco de Dados!'
						this.showUpdateSuccess()
						setTimeout(()=>{
							document.getElementById('ArquivoProdAlter').value = ''
						},5000)
					})
					.catch(err => {
						if (err.message === "Network Error") {
							document.getElementById('resultprodalter').value = ' >> ERRO - Integração Produto - '+ err +'!'
						} else {
							document.getElementById('resultprodalter').value = ' >> ERRO - Integração Produto - Inconsistências no arquivo JSON (Campos/Valores/Formato) !'	
						}
						this.showUpdateError()
						setTimeout(()=>{
							document.getElementById('ArquivoProdAlter').value = ''
						},5000)
					})
				}
				catch (e) {
					if (e instanceof SyntaxError) {
						document.getElementById('resultprodalter').value = ' >> ERRO - Integração Produto - Formatação do arquivo JSON recebido é Inválida !'
						this.showUpdateError()
					} else {
						document.getElementById('resultprodalter').value = ' >> ERRO - Integração Produto - '+ e +' !'
						this.showUpdateError()
					}
					setTimeout(()=>{
						document.getElementById('ArquivoProdAlter').value = ''
					},5000)
				}
			}
			fr.readAsText(files.item(0))
		},
		showUpdateSuccess() {
			this.$vs.notify({
                icon: 'check',
				color: 'success',
				title: 'Sucesso na Integração',
				text: 'Integração Efetuada com Sucesso!'
			})
		},
		showUpdateError() {
			this.$vs.notify({
                icon: 'close',
				color: 'danger',
				title: 'Falha na Integração',
				text: 'Integração NÃO Efetuada!'
			})
		},
	},
	mounted() {
		this.Load()
	}
}
</script>

<style>

	input[type=file], select {
		width: 100%;
		font-size: 1.1rem;
		border-radius: 6px;
		
	}

	input[type=file]::file-selector-button {
		border: 2px solid #ffc500;
		color: grey;
		padding: 8px 16px;
		margin: 0 16px 0 0;
		border-radius: 6px;
		background-color: transparent;
		transition: 0.5s;
	}

	input[type=file]::file-selector-button:hover {
		background-color: #ffc500;
		border: 2px solid #ffc500;
		cursor: pointer;
	}

</style>
