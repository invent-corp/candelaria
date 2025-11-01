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
				this.$router.push("/cadastros/caixas/cadastro/" + this.params.data.id_caixas)
				.catch(() => {})
			},
			confirmDeleteRecord() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Desativação`,
				text: `Corfima Desativação da Caixa: " ${this.params.data.descricao.toUpperCase()} " ?`,
				accept: this.deleteRecord,
				acceptText: "Desativar", 
				})
			},
			deleteRecord() {
				const id =  this.params.data.id_caixas
				axios.delete(`${backendUrl}/caixas/${id}`)
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
				title: 'Caixa Desativada',
				text: 'Caixa Desativada com Sucesso!'
				})
			}
        }
    }
</script>
