<template>

    <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.displayName">

        <div class="text-right leading-tight hidden sm:block">
            <p class="font-semibold">{{ activeUserInfo.displayName }}</p>
            <small>Online</small>            
        </div>

        <vs-dropdown vs-custom-content  class="cursor-pointer">

            <div class="ml-3">
                <vs-avatar class="flex-shrink-0 mr-2 headline font-bold text-lg" :text="activeUserInfo.displayName.toUpperCase()" color="primary" size="40px">
                </vs-avatar>          
            </div>


            <vs-dropdown-menu class="vx-navbar-dropdown">
                <ul style="min-width: 9rem">

                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                    @click="perfil">
                    <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
                    <span class="ml-2">Perfil</span>
                </li>

                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
                    <feather-icon icon="CalendarIcon" svgClasses="w-4 h-4" />
                    <span class="ml-2">Calendário</span>
                </li>

                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
                    <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4" />
                    <span class="ml-2">Ajuda</span>
                </li>

                <vs-divider class="m-0" color="dark"/>

                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                    @click="logout">
                    <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
                    <span class="ml-2">Logout</span>
                </li>
                </ul>
            </vs-dropdown-menu>

        </vs-dropdown>

    </div>

</template>

<script>

export default {
    data() {
        return {

        }
    },
    computed: {
        activeUserInfo() {
        return this.$store.state.AppActiveUsuario
        }
    },
    methods: {
        logout() {
            // If JWT login
            if(localStorage.getItem("accessToken")) {
            localStorage.removeItem("accessToken")
            this.$router.push('/pages/login').catch(() => {})
            }

            // Change role on logout. Same value as initialRole of acj.js           
            this.$acl.change('0')
            localStorage.removeItem('userInfo')

            // This is just for demo Purpose. If user clicks on logout -> redirect
            this.$router.push('/pages/login').catch(() => {})

        },
        perfil() {
            this.$router.push('/adm/usuario/perfil/' + this.$store.state.AppActiveUsuario.uid ).catch(() => {})
        },
    }
}
</script>
