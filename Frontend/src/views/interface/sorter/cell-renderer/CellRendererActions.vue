<template>

	<div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
		<feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" />
		<feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="confirmDeleteRecord" />
    </div>

</template>

<script>
	import axios from 'axios'
	import { backendUrl } from '@/globalComponents'

    export default {
        name: 'CellRendererActions',
        methods: {
			editRecord() {
				this.$router.push("/interface/sorter/cadastro/" + this.params.data.id_sorter)
				.catch(() => {})
			},
			confirmDeleteRecord() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Exclusão`,
				text: `Confirma Exclusão da Relação: " ${this.params.data.mapa_sorter.toUpperCase()} x ${this.params.data.rampa.toUpperCase()}" ?`,
				accept: this.deleteRecord,
				acceptText: "Excluir", 
				})
			},
			deleteRecord() {
				const id =  this.params.data.id_sorter
				axios.delete(`${backendUrl}/sorter/${id}`)
					.then(() => {
						this.showDeleteSuccess()
						this.$router.push("/pages/refresh/")
					})
					.catch(err => { 
						if(err.message === "Request failed with status code 400") {
							this.$vs.dialog({
								color: 'primary',
								title: 'ERRO - Rotas Cadastradas',
								text: `Para: ${this.params.data.mapa_sorter.toUpperCase()} x ${this.params.data.rampa.toUpperCase()}`,
								acceptText: 'OK'							
							})
						}
					})
			},
			showDeleteSuccess() {
				this.$vs.notify({
				icon: "check",
				color: 'success',
				title: 'Relação Excluída',
				text: `Relação Excluída com Sucesso!`
				})
			}
        },
    }
</script>
