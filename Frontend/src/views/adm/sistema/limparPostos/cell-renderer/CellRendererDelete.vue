<template>

	<div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
		<feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="confirmDeleteRecord" />
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
				const id =  this.params.data.id_pallet_itens
				axios.delete(`${backendUrl}/opDeleteItens/${id}`)
					.then(() => {
						this.showOpenSuccess()
						this.$router.push("/pages/refresh/")
					})
					.catch(err => { console.error(err) })
			},
			showOpenSuccess() {
				this.$vs.notify({
				icon: "check",
				color: 'success',
				title: 'Item Excluído',
				text: 'Item Excluído com Sucesso!'
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
