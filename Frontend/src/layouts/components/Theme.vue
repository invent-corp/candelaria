<template>
    <div class="flex">
        <feather-icon :icon="icon" @click="(themeMode='dark')" class="cursor-pointer navbar-fuzzy-search mr-4"/>
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
        default: 'SunIcon',
        },
    },
    computed: {
        themeMode: {
            get() { return this.$store.state.theme },          
            set() { 
                if (this.$store.state.theme === "dark") {
                    this.$store.dispatch('updateTheme', "light") && (this.icon="MoonIcon")
                    this.usuario.tema_padrao = "light",
                    this.save()        
                } else {
                this.$store.dispatch('updateTheme', "dark") && (this.icon="SunIcon")
                    this.usuario.tema_padrao = "dark",
                    this.save()
                }
            },
        },
    },
    methods: {
        checkIcon() {
            if (this.$store.state.AppActiveUsuario.temaPadrao === "dark") {
                (this.icon = "SunIcon")
            } else {
                (this.icon = "MoonIcon")
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
				text: 'Tema Aplicado e Salvo com Sucesso!'
			})
		}
    },
    created() {
        this.checkIcon()
    }
}

</script>