<template>
	<p class="ml-4">teste:</p>
</template>

<script>

import axios from 'axios'
import { backendUrl } from '@/globalComponents'

export default {
	data() {
        return {
            usuario: []
        }
    },
    methods: {
		loadData() {
			var id = 1
            axios.get(`${backendUrl}/msCadastro/${id}&${id}`)
                .then(res => {this.usuario = res.data 
					var mapaRotaId = this.usuario.id_sorter
					this.$router.push(`/pages/refreshcadastro/${mapaRotaId}/`).catch(() => {})			
				}) 
		},
    },
    mounted() {
		this.loadData() 
	},
}

</script>

