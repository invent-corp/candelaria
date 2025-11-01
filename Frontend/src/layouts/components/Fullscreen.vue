<template>
    <div class="flex">
        <feather-icon :icon="icon" @click="(fullscreenMode='Maximize')" class="cursor-pointer navbar-fuzzy-search mr-4"/>
    </div>
</template>

<script>

import axios from 'axios'
import { backendUrl } from '@/globalComponents'

export default {
    data() {
        return {
            usuario: {},
        }
    },
    props: {
        icon: {
            type: String,
            default: "MinimizeIcon",
        },
    },
    computed: {
        fullscreenMode: {
            set() { 
                if (this.icon === "MaximizeIcon") {
                    (this.icon = "MinimizeIcon")
                    && document.documentElement.requestFullscreen(),
                    (
                        this.usuario.fullscreen = "Sim",
                        this.save()
                    )  
                } else {
                    (this.icon = "MaximizeIcon")
                    && document.exitFullscreen(),
                        (
                            this.usuario.fullscreen = "Não",
                            this.save()
                        )
                }
            }
        },
    },
    methods: {
        checkIcon() {
            if (this.$store.state.AppActiveUsuario.fullscreen == "Sim") {
                (this.icon = "MinimizeIcon")
            } else {
                (this.icon = "MaximizeIcon")
            }
        },
        save() {
            const method = this.$store.state.AppActiveUsuario.uid ? 'put' : 'post'
            const id = this.$store.state.AppActiveUsuario.uid ? `/${this.$store.state.AppActiveUsuario.uid}` : ''
            axios[method](`${backendUrl}/usuario${id}`, this.usuario)
                .then(() => {
                    this.showUpdateSuccess()
                })
                .catch(err => { console.error(err) })
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Configurações Atualizadas',
				text: 'Fullscreen Aplicado e Salvo com Sucesso!'
			})
		}
    },
    created() {
        this.checkIcon()
    }    
}

</script>