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
				this.$router.push("/interface/rota/cadastro/" + this.params.data.id_rota)
				.catch(() => {})
			},
			confirmDeleteRecord() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Desativação`,
				text: `Corfima Desativação da Rota: " ${this.params.data.descricao.toUpperCase()} " ?`,
				accept: this.deleteRecord,
				acceptText: "Desativar", 
				})
			},
			deleteRecord() {
				const id =  this.params.data.id_rota
				axios.delete(`${backendUrl}/rota/${id}`)
					.then(() => {
						this.showDeleteSuccess()
						this.$router.push("/pages/refresh/")
					})
					.catch(err => { console.error(err) })
			},
			showDeleteSuccess() {
				this.$vs.notify({
				icon: "check",
				color: 'success',
				title: 'Rota Desativada',
				text: 'Rota Desativada com Sucesso!'
				})
			}
        }
    }
</script>
