<template>

	<div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
		<feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 hover:text-primary cursor-pointer" @click="confirmEditRecord" />
    </div>

</template>

<script>
	import axios from 'axios'
	import { backendUrl } from '@/globalComponents'

    export default {
        name: 'CellRendererActions',
        methods: {
			confirmEditRecord() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Cancelamento`,
				text: `Confirma Cancelamento da inicialização do Mapa: ${this.params.data.nome} ?`,
				accept: this.editRecord,
				acceptText: "OK", 
				})
			},
			editRecord() {
				const id =  this.params.data.id_mapa_ptm
				axios.delete(`${backendUrl}/opMapaPtm/${id}`)
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
				title: 'Mapa Cancelado',
				text: 'Inicialização do Mapa Cancelado com Sucesso!'
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
