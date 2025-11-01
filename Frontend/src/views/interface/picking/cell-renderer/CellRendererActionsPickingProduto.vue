<template>

	<div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
		<feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="confirmDeleteRecord" />
    </div>

</template>

<script>
	import axios from 'axios'
	import { backendUrl } from '@/globalComponents'

    export default {
        name: 'CellRendererActionsEan',
        methods: {
			confirmDeleteRecord() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Desativação`,
				text: `Corfima Desativação do Ean: " ${this.params.data.descricao_ean.toUpperCase()} " ?`,
				accept: this.deleteRecord,
				acceptText: "Desativar", 
				})
			},
			deleteRecord() {
				const id =  this.params.data.id_produto_ean
				axios.delete(`${backendUrl}/produtosean/${id}`)
					.then(() => {
						this.showDeleteSuccess()
				//		this.$router.push("/pages/refresh/")
					})
					.catch(err => { console.error(err) })
			},
			showDeleteSuccess() {
				this.$vs.notify({
				icon: "check",
				color: 'success',
				title: 'Ean Desativado',
				text: 'Ean Desativado com Sucesso!'
				})
			}
        }
    }
</script>
