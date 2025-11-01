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
				this.$router.push("/interface/ptm/cadastro/" + this.params.data.id_ptm)
				.catch(() => {})
			},
			confirmDeleteRecord() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Exclusão`,
				text: `Confirma Exclusão da Relação: " ${this.params.data.mapa_ptm.toUpperCase()} x ${this.params.data.endereco_ptm_descricao.toUpperCase()}" ?`,
				accept: this.deleteRecord,
				acceptText: "Excluir", 
				})
			},
			deleteRecord() {
				const id =  this.params.data.id_ptm
				axios.delete(`${backendUrl}/ptm/${id}`)
					.then(() => {
						this.showDeleteSuccess()
						this.$router.push("/pages/refresh/")
					})
					.catch(err => { 
						if(err.message === "Request failed with status code 400") {
							this.$vs.dialog({
								color: 'primary',
								title: 'ERRO - Rotas Cadastradas para:',
								text: `${this.params.data.mapa_ptm.toUpperCase()} x ${this.params.data.endereco_ptm_descricao.toUpperCase()}`,
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
