<template>

	<div :style="{ 'direction': $vs.rtl ? 'rtl' : 'ltr' }">
		<feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer"
			@click="confirmDeleteRecord" />
	</div>

</template>

<script>
import axios from 'axios'
import { backendUrl } from '@/globalComponents'

export default {
	name: 'CellRendererDelete',
	methods: {
		confirmDeleteRecord() {
			this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Exclusão`,
				text: `Confirma Exclusão do Item: ${this.params.data.sku} ?`,
				accept: this.deleteRecord,
				acceptText: "OK",
			})
		},
		deleteRecord() {
			const id = this.params.data.id_pallet_itens
			axios.delete(`${backendUrl}/opDeleteItens/${id}`)
				.then(() => {
					this.showOpenSuccess()
					this.$router.push("/pages/refresh/")
				})
				.catch(err => {
					// ✅ Ponto principal da alteração
					// Verifica se o erro tem uma resposta do servidor com dados
					if (err.response && err.response.data) {
						this.showErrorNotification(err.response.data)
					} else {
						// Mensagem genérica para outros tipos de erro (ex: rede)
						this.showErrorNotification('Ocorreu um erro inesperado.')
						console.error(err) // Mantém o log do erro completo no console
					}
				})
		},
		showOpenSuccess() {
			this.$vs.notify({
				icon: "check",
				color: 'success',
				title: 'Item Excluído',
				text: 'Item Excluído com Sucesso!'
			})
		},
		showErrorNotification(message) {
			this.$vs.notify({
				icon: "check", // Ícone de alerta
				color: 'danger',
				title: 'Erro na Exclusão',
				text: message // Mensagem vinda diretamente do backend
			})
		}
	}
}

</script>

<style>
.svg-icon {
	display: inline-flex;
	align-self: center;
}
</style>
