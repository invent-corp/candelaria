<template>
    <div class="parentx">

        <vs-sidebar
            class="v-nav-menu items-no-padding"
            v-model="isVerticalNavMenuActive"
            ref="verticalNavMenu"
            default-index="-1"
            :click-not-close="clickNotClose"
            :reduce-not-rebound="reduceNotRebound"
            :parent="parent"
            :hiddenBackground="clickNotClose"
            :reduce="reduce"
            v-hammer:swipe.left="onSwipeLeft">

            <div @mouseenter="mouseEnter" @mouseleave="mouseLeave">

                <!-- Header -->
                <div class="header-sidebar flex items-center justify-between" slot="header">

                <!-- Logo -->
                <router-link tag="div" class="vx-logo cursor-pointer flex items-center" to="/home">
                    <logo class="w-10 mr-4 fill-current text-primary" />
                    <span class="vx-logo-text text-primary" v-show="isMouseEnter || !reduce" v-if="title">{{ title }}</span>
                </router-link>
                <!-- /Logo -->

                <!-- Menu Buttons -->
                    <div>
                        <!-- Close Button -->
                        <template v-if="showCloseButton">
                        <feather-icon icon="XIcon" class="m-0 cursor-pointer" @click="$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)" />
                        </template>

                        <!-- Toggle Buttons -->
                        <template v-else-if="!showCloseButton && !verticalNavMenuItemsMin">
                        <feather-icon
                            id="btnVNavMenuMinToggler"
                            class="mr-0 cursor-pointer"
                            :icon="reduce ? 'CircleIcon' : 'DiscIcon'"
                            svg-classes="stroke-current text-primary"
                            @click="toggleReduce(!reduce)" />
                        </template>
                    </div>
                <!-- /Menu Toggle Buttons -->
                </div>
                
                <!-- /Header -->

                

                <!-- Header Shadow -->
                <div class="shadow-bottom" v-show="showShadowBottom" />

                <!-- Menu Items -->
                <VuePerfectScrollbar ref="verticalNavMenuPs" class="scroll-area-v-nav-menu pt-8" :settings="settings" @ps-scroll-y="psSectionScroll" :key="$vs.rtl">
                <template v-for="(item, index) in menuItemsUpdated">

                    

                    <!-- Group Header -->
                    <span v-show="
                    (item.header == `${estatistica_visible}`) ||
                    (item.header == `${administracao_visible}`) || 
                    (item.header == `${interface_visible}`)
                    " 
                    v-if="item.header && !verticalNavMenuItemsMin" class="navigation-header truncate text-primary font-semibold" :key="`header-${index}`">
                    {{ item.header }}
                    </span>
                    <!-- /Group Header -->

                    <template v-else-if="!item.header">

                    

                    <!-- Nav-Item -->
                    <v-nav-menu-item 
                        v-if="!item.submenu"
                        :key="`item-${index}`"
                        :index="index"
                        :to="item.slug !== 'external' ? item.url : null"
                        :href="item.slug === 'external' ? item.url : null"
                        :icon="item.icon" :target="item.target"
                        :isDisabled="item.isDisabled"
                        :slug="item.slug">
                        <span v-show="!verticalNavMenuItemsMin" class="truncate" >{{ item.name }}</span>
                        <vs-chip class="ml-auto " :color="item.tagColor" v-if="item.tag && (isMouseEnter || !reduce)">{{ item.tag }}</vs-chip>
                    </v-nav-menu-item>

                    <!-- Nav-Group -->
                    <template v-else>
                        <v-nav-menu-group
                        :key="`group-${index}`"
                        :openHover="openGroupHover"
                        :group="item"
                        :groupIndex="index"
                        :open="isGroupActive(item)" />
                    </template>
                    <!-- /Nav-Group -->
                    </template>
                </template>
                </VuePerfectScrollbar>
                <!-- /Menu Items -->
            </div>
        </vs-sidebar>

        <!-- Swipe Gesture -->
        <div
            v-if="!isVerticalNavMenuActive"
            class="v-nav-menu-swipe-area"
            v-hammer:swipe.right="onSwipeAreaSwipeRight" />
        <!-- /Swipe Gesture -->
    </div>
</template>


<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VNavMenuGroup from './VerticalNavMenuGroup.vue'
import VNavMenuItem from './VerticalNavMenuItem.vue'

import Logo from "../Logo.vue"

export default {
    name: 'v-nav-menu',
    components: {
        VNavMenuGroup,
        VNavMenuItem,
        VuePerfectScrollbar,
        Logo
    },
    props: {
        logo:             { type: String },
        openGroupHover:   { type: Boolean, default: false },
        parent:           { type: String },
        reduceNotRebound: { type: Boolean, default: true },
        navMenuItems:     { type: Array,   required: true },
        title:            { type: String },
    },
    data: () => ({
        clickNotClose       : false, // disable close navMenu on outside click
        isMouseEnter        : false,
        reduce              : false, // determines if navMenu is reduce - component property
        showCloseButton     : false, // show close button in smaller devices
        settings            : {      // perfectScrollbar settings
            maxScrollbarLength: 60,
            wheelSpeed        : 1,
            swipeEasing       : true
        },
        showShadowBottom    : false,
        estatistica_visible: '',
        administracao_visible: '',
        interface_visible: ''

    }),
    computed: {
        isGroupActive() {
            return (item) => {
                const path        = this.$route.fullPath
                const routeParent = this.$route.meta ? this.$route.meta.parent : undefined
                let open          = false

                let func = (item) => {
                if (item.submenu) {
                    item.submenu.forEach((item) => {
                    if (item.url && (path === item.url || routeParent === item.slug)) { open = true }
                    else if (item.submenu) { func(item) }
                    })
                }
                }
                func(item)
                return open
            }
        },
        menuItemsUpdated() {
        let clone = this.navMenuItems.slice()
            for(let [index, item] of this.navMenuItems.entries()) {
                if (item.header && item.items.length && (index || 1)) {
                let i = clone.findIndex(ix => ix.header === item.header)
                    for(let [subIndex, subItem] of item.items.entries()) {
                        clone.splice(i + 1 + subIndex, 0, subItem)
                    }
                }
            }
        return clone
        },
        isVerticalNavMenuActive: {
            get()    { return this.$store.state.isVerticalNavMenuActive },
            set(val) { this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', val) }
        },
        layoutType() { return this.$store.state.mainLayoutType },
        reduceButton: {
            get()    { return this.$store.state.reduceButton },
            set(val) { this.$store.commit('TOGGLE_REDUCE_BUTTON', val) }
        },
        isVerticalNavMenuReduced()   { return Boolean(this.reduce && this.reduceButton) },
        verticalNavMenuItemsMin() { return this.$store.state.verticalNavMenuItemsMin },
        windowWidth()     { return this.$store.state.windowWidth }
    },
    watch: {
        '$route'() {
        if (this.isVerticalNavMenuActive && this.showCloseButton) this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
        },
        reduce(val) {
            const verticalNavMenuWidth = val ? "reduced" : this.$store.state.windowWidth < 1200 ? "no-nav-menu" : "default"
            this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)

            setTimeout(function() {
                window.dispatchEvent(new Event('resize'))
            }, 100)
        },
        layoutType()   { this.setVerticalNavMenuWidth() },
        reduceButton() { this.setVerticalNavMenuWidth() },
        windowWidth()  { this.setVerticalNavMenuWidth() }
    },
    methods: {
        // handleWindowResize(event) {
        //   this.windowWidth = event.currentTarget.innerWidth;
        //   this.setVerticalNavMenuWidth()
        // },
        onSwipeLeft() {
            if (this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = false
        },
        onSwipeAreaSwipeRight() {
            if (!this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = true
        },
        psSectionScroll() {
            this.showShadowBottom = this.$refs.verticalNavMenuPs.$el.scrollTop > 0 ? true : false
        },
        mouseEnter() {
            if (this.reduce) this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)
            this.isMouseEnter = true
        },
        mouseLeave() {
            if (this.reduce) this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', true)
            this.isMouseEnter = false;
        },
        setVerticalNavMenuWidth() {

            if(this.windowWidth > 1200) {
                if(this.layoutType === 'vertical') {

                // Set reduce
                this.reduce = this.reduceButton ? true : false

                // Open NavMenu
                this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)

                // Set Menu Items Only Icon Mode
                const verticalNavMenuItemsMin = (this.reduceButton && !this.isMouseEnter) ? true : false
                this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

                // Menu Action buttons
                this.clickNotClose   = true
                this.showCloseButton = false

                const verticalNavMenuWidth   = this.isVerticalNavMenuReduced ? "reduced" : "default"
                this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)

                return
                }
            }

            // Close NavMenu
            this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)

            // Reduce button
            if (this.reduceButton) this.reduce = false

            // Menu Action buttons
            this.showCloseButton = true
            this.clickNotClose   = false

            // Update NavMenu Width
            this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

            // Remove Only Icon in Menu
            this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)
        },
        toggleReduce(val) {
            this.reduceButton = val
            this.setVerticalNavMenuWidth()
        },
    },
    mounted() {
        this.setVerticalNavMenuWidth()
        if( this.$acl.check('42') || 
            this.$acl.check('42') ||
            this.$acl.check('43') ||
            this.$acl.check('44') ||
            this.$acl.check('45') || 
            this.$acl.check('46') ||
            this.$acl.check('47') ||
            this.$acl.check('48') || 
            this.$acl.check('49') ||
            this.$acl.check('50') || 
            this.$acl.check('51') ||
            this.$acl.check('56') ||
            this.$acl.check('57') ||
            this.$acl.check('60') ||
            this.$acl.check('73') ||
            this.$acl.check('74') ||
            this.$acl.check('102') ||
            this.$acl.check('103') ||
            this.$acl.check('104') ||
            this.$acl.check('109') ||
            this.$acl.check('110') ||
            this.$acl.check('111') ||
            this.$acl.check('115')
            ) { this.estatistica_visible = 'Estatísticas'
        }
        if( this.$acl.check('2') ||
            this.$acl.check('3') ||
            this.$acl.check('5') ||
            this.$acl.check('6') ||
            this.$acl.check('8') ||
            this.$acl.check('9') ||
            this.$acl.check('11') ||
            this.$acl.check('12') ||
            this.$acl.check('13') ||
            this.$acl.check('53') ||
            this.$acl.check('54') ||
            this.$acl.check('55') ||
            this.$acl.check('105')
            ) { this.administracao_visible = 'Administração'
        }
        if( this.$acl.check('15') ||
            this.$acl.check('16') ||
            this.$acl.check('18') ||
            this.$acl.check('19') ||
            this.$acl.check('21') ||
            this.$acl.check('22') ||
            this.$acl.check('24') ||
            this.$acl.check('25') ||
            this.$acl.check('27') ||
            this.$acl.check('28') ||
            this.$acl.check('30') ||
            this.$acl.check('31') ||
            this.$acl.check('33') ||
            this.$acl.check('34') ||
            this.$acl.check('52') ||
            this.$acl.check('58') ||
            this.$acl.check('59') ||
            this.$acl.check('61') ||
            this.$acl.check('65') ||
            this.$acl.check('66') ||
            this.$acl.check('89') ||
            this.$acl.check('98')
            ) { this.interface_visible = 'Interface'
        }
        if( this.$acl.check('70') ||
            this.$acl.check('71') ||
            this.$acl.check('77') ||
            this.$acl.check('78') ||
            this.$acl.check('80') ||
            this.$acl.check('81') ||
            this.$acl.check('86') ||
            this.$acl.check('87') ||
            this.$acl.check('83') ||
            this.$acl.check('84') ||
            this.$acl.check('36') ||
            this.$acl.check('37') ||
            this.$acl.check('39') ||
            this.$acl.check('40') ||
            this.$acl.check('99') ||
            this.$acl.check('100') ||
            this.$acl.check('112') ||
            this.$acl.check('113') ||
            this.$acl.check('114')
            ) { this.interface_visible = 'Cadastros'
        }         
    },
}

</script>


<style lang="scss">
    @import "@/assets/scss/vuexy/components/verticalNavMenu.scss"
</style>
