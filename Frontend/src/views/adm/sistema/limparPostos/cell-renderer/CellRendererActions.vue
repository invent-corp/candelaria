<template>

	<div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
			<feather-icon v-if="this.$acl.check('62')" icon="DeleteIcon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="confirmEditRecord" />
			<feather-icon v-if="this.$acl.check('63')" icon="SearchIcon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="searchRecord" />
    </div>

</template>

<script>
	import axios from 'axios'
	import { backendUrl } from '@/globalComponents'

    export default {
        name: 'CellRendererActions',
        methods: {
			searchRecord() {
				this.$router.push("/adm/sistema/limparpostositens/" + this.params.data.id_posto)
				.catch(() => {})
			},
			confirmEditRecord() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Limpeza`,
				text: `Confirma Limpeza do Posto: ${this.params.data.descricao} ?`,
				accept: this.editRecord,
				acceptText: "OK", 
				})
			},
			editRecord() {
				const id =  this.params.data.id_posto
				axios.put(`${backendUrl}/limparposto/${id}`)
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
				title: 'Posto',
				text: 'Posto Limpo com Sucesso!'
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
