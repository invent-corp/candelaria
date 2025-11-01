<template>
	<div
		class  = "vs-sidebar-group"
		:class = "[
		{'vs-sidebar-group-open'            : openItems        },
		{'vs-sidebar-group-active'          : open             },
		{'disabled-item pointer-events-none': group.isDisabled }
		]"
		@mouseover = "mouseover"
		@mouseout  = "mouseout">

		<!-- Group Label -->
		<div 
			v-show="
			(this.group.name === 'Dashboards' & (this.$acl.check('50') || this.$acl.check('51') || this.$acl.check('73') || this.$acl.check('74'))) ||
			((this.group.name === 'Relatórios' || this.group.name === 'Log') & (this.$acl.check('42') || this.$acl.check('43') || this.$acl.check('44') || this.$acl.check('109'))) ||
			((this.group.name === 'Relatórios' || this.group.name === 'Produção') & (this.$acl.check('45') || this.$acl.check('46') || this.$acl.check('47') || this.$acl.check('48') || this.$acl.check('49') || this.$acl.check('67') || this.$acl.check('102') || this.$acl.check('103') || this.$acl.check('104') || this.$acl.check('75') || this.$acl.check('110') || this.$acl.check('111') || this.$acl.check('129')|| this.$acl.check('132'))) ||
			((this.group.name === 'Relatórios' || this.group.name === 'Rota') & (this.$acl.check('56') || this.$acl.check('57'))) ||
			((this.group.name === 'Relatórios' || this.group.name === 'Acesso') & (this.$acl.check('60'))) ||
			((this.group.name === 'Relatórios' || this.group.name === 'Produtos') & (this.$acl.check('115'))) ||
			
			
			((this.group.name === 'Função' || this.group.name === 'Usuários') & (this.$acl.check('5') || this.$acl.check('6'))) ||
			(this.group.name === 'Usuários' & (this.$acl.check('2') || this.$acl.check('3'))) ||
			(this.group.name === 'Grupos' & (this.$acl.check('8') || this.$acl.check('9'))) ||

			((this.group.name === 'Acessos' || this.group.name === 'Sistema') & (this.$acl.check('12') || this.$acl.check('13'))) ||
			(this.group.name === 'Sistema' & (this.$acl.check('11') || this.$acl.check('54') || this.$acl.check('55') || this.$acl.check('105'))) ||

			(this.group.name === 'Operação' & (this.$acl.check('52') || this.$acl.check('58') || this.$acl.check('59') || this.$acl.check('61') || this.$acl.check('65') || this.$acl.check('66') || this.$acl.check('76') || this.$acl.check('89') || this.$acl.check('98') || this.$acl.check('116') || this.$acl.check('117') || this.$acl.check('118') || this.$acl.check('128'))) ||

			(this.group.name === 'Rotas' & (this.$acl.check('21') || this.$acl.check('22'))) ||

			(this.group.name === 'Caixas' & (this.$acl.check('70') || this.$acl.check('71'))) ||
			(this.group.name === 'Transportadoras' & (this.$acl.check('77') || this.$acl.check('78'))) ||
			(this.group.name === 'Postos' & (this.$acl.check('80') || this.$acl.check('81'))) ||
			(this.group.name === 'Ponto de Decisão' & (this.$acl.check('86') || this.$acl.check('87'))) ||
			(this.group.name === 'Tipo Produto' & (this.$acl.check('99') || this.$acl.check('100'))) ||
			(this.group.name === 'Produtos' & (this.$acl.check('83') || this.$acl.check('84')|| this.$acl.check('130'))) ||
			(this.group.name === 'Endereços' & (this.$acl.check('36') || this.$acl.check('37'))) ||
			(this.group.name === 'Endereços Contingência' & (this.$acl.check('119') || this.$acl.check('120') || this.$acl.check('121'))) ||
//			(this.group.name === 'Endereços PTM' & (this.$acl.check('119') || this.$acl.check('120') || this.$acl.check('121'))) ||
			(this.group.name === 'Gateways' & (this.$acl.check('39') || this.$acl.check('40'))) ||
			(this.group.name === 'Franqueados' & (this.$acl.check('112') || this.$acl.check('113'))) ||

			((this.group.name === 'Coletores' || this.group.name === 'Rampas' || this.group.name === 'Sorters') & (this.$acl.check('33') || this.$acl.check('34'))) ||
			((this.group.name === 'Rampas' || this.group.name === 'Sorters') & (this.$acl.check('30') || this.$acl.check('31'))) ||
			((this.group.name === 'Mapas Sorters' || this.group.name === 'Sorters') & (this.$acl.check('24') || this.$acl.check('25'))) ||
			(this.group.name === 'Sorters' & (this.$acl.check('15') || this.$acl.check('16'))) ||

			((this.group.name === 'Mapas PTLs' || this.group.name === 'PTLs') & (this.$acl.check('27') || this.$acl.check('28'))) ||
			((this.group.name === 'Mapas Contingência' || this.group.name === 'Contingência') & (this.$acl.check('122') || this.$acl.check('123'))) ||
//			((this.group.name === 'Mapas PTM' || this.group.name === 'PTM') & (this.$acl.check('122') || this.$acl.check('123'))) ||
			(this.group.name === 'PTLs' & (this.$acl.check('18') || this.$acl.check('19')))
			(this.group.name === 'Contingência' & (this.$acl.check('125') || this.$acl.check('126')))
//			(this.group.name === 'PTM' & (this.$acl.check('125') || this.$acl.check('126')))
			"
			@click="clickGroup" class="group-header w-full">
			<span class="flex items-center w-full">

			<!-- Group Icon -->
			<feather-icon class="text-primary"
				v-if        = "group.icon  || (this.groupIndex > Math.floor(this.groupIndex))"
				:icon       = "group.icon  || 'CircleIcon'"
				:svgClasses = "{ 'w-6 h-6' : this.groupIndex % 1 != 0 }" />

			<!-- Group Name -->
			<span v-show="!verticalNavMenuItemsMin" class="truncate mr-5 select-none">{{ group.name }}</span>

			<!-- Group Tag -->
			<vs-chip class="ml-auto mr-4" :color="group.tagColor" v-if="group.tag && !verticalNavMenuItemsMin">{{ group.tag }}</vs-chip>
			</span>

			<!-- Group Collapse Icon -->
			<feather-icon 
			v-show     = "!verticalNavMenuItemsMin"
			:class     = "[{'rotate90' : openItems}, 'feather-grp-header-arrow']"
			:icon       = "$vs.rtl ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'"
			svg-classes= "w-6 h-6" />

			<!-- Group Tooltip -->
			<span class="vs-sidebar--tooltip">{{ group.name }}</span>
		</div>
		<!-- /Group Label -->

		<!-- Group Items -->
		<ul ref="items" :style="styleItems" class="vs-sidebar-group-items">
			<li v-for="(groupItem, index) in group.submenu" :key="index">

			<!-- If item is group -->
			<v-nav-menu-group 
				v-if        = "groupItem.submenu"
				:group      = "groupItem"
				:groupIndex = "Number(`${groupIndex}.${index+1}`)"
				:open       = "isGroupActive(groupItem)"
				:openHover  = "openHover" />

			<!-- Else: Item -->
			<v-nav-menu-item 
				v-else
				icon-small
				:index  = "groupIndex + '.' + index"
				:to="groupItem.slug !== 'external' ? groupItem.url : null"
				:href="groupItem.slug === 'external' ? groupItem.url : null"
				:icon   = "groupItem.icon"
				:slug   = "groupItem.slug"
				:target = "groupItem.target">
				<span class="truncate">{{ groupItem.name }}</span>
				<vs-chip class="ml-auto " :color="groupItem.tagColor" v-if="groupItem.tag">{{ groupItem.tag }}</vs-chip>
			</v-nav-menu-item>

			</li>
		</ul>
		<!-- /Group Items -->
	</div>
</template>


<script>
import VNavMenuItem from './VerticalNavMenuItem.vue'

export default {
	name  : 'v-nav-menu-group',
	props : {
		openHover  : { type: Boolean, default: false },
		open       : { type: Boolean, default: false },
		group      : { type: Object },
		groupIndex : { type: Number },
	},
	components: {
		VNavMenuItem
	},
	data: () => ({
		maxHeight : '0px',
		openItems : false,
	}),
	computed: {
		verticalNavMenuItemsMin() { 
			return this.$store.state.verticalNavMenuItemsMin 
		},
		styleItems() {
			return { maxHeight: this.maxHeight }
		},
		itemIcon() {
			return (index) => {
				if (!((index.match(/\./g) || []).length > 1)) return "CircleIcon"
		}
		},
		isGroupActive() {
			return (item) => {
				const path        = this.$route.fullPath
				let open          = false
				const routeParent = this.$route.meta ? this.$route.meta.parent : undefined

				let func = (item) => {
					if (item.submenu) {
						item.submenu.forEach((item) => {
						if ((path == item.url || routeParent == item.slug) && item.url) { open = true}
						else if (item.submenu) { func(item) }
						})
					}
				}

				func(item)
				return open
			}
		},
	},
	watch: {
		// OPEN & CLOSES DROPDOWN ON ROUTE CHANGE
		'$route'() {

		if (this.verticalNavMenuItemsMin) return

		let scrollHeight = this.scrollHeight

		// Collapse Group
		if (this.openItems && !this.open) {

			this.maxHeight = `${scrollHeight}px`
			setTimeout(()  => {
			this.maxHeight = `${0}px`
			}, 50)

		// Expand Group
		} else if (this.open) {

			this.maxHeight = `${scrollHeight}px`
			setTimeout(()  => {
			this.maxHeight = 'none'
			}, 300)
		}
		},
		maxHeight() {
			this.openItems = this.maxHeight != '0px'
			},
			// OPEN AND CLOSES DROPDOWN MENU ON NavMenu COLLAPSE AND DEFAULT VIEW
			'$store.state.verticalNavMenuItemsMin'(val) {
			let scrollHeight = this.$refs.items.scrollHeight

			if (!val && this.open) {

				this.maxHeight = `${scrollHeight}px`
				setTimeout(()  => {
				this.maxHeight = 'none'
				}, 300)
			} else {

				this.maxHeight = `${scrollHeight}px`
				setTimeout(()  => {
				this.maxHeight = '0px'
				}, 50)
			}
			if (val && this.open) {

				this.maxHeight = `${scrollHeight}px`
				setTimeout(()  => {
				this.maxHeight = '0px'
				}, 250)
			}
		}
	},
	methods: {
		clickGroup() {
			if (!this.openHover) {

				let thisScrollHeight = this.$refs.items.scrollHeight

				if (this.maxHeight == '0px') {
				this.maxHeight = `${thisScrollHeight}px`
				setTimeout(() => {
					this.maxHeight = 'none'
				}, 300)

				} else {
				this.maxHeight = `${thisScrollHeight}px`
				setTimeout(() => {
					this.maxHeight = `${0}px`
				}, 50)
				}

				this.$parent.$children.map((child) => {
				if (child.isGroupActive) {
					if (child !== this && (!child.open) && child.maxHeight != '0px') {
					setTimeout(() => {
						child.maxHeight = `${0}px`
					}, 50)
					}
				}
				})
			}
		},
		mouseover() {
			if (this.openHover) {
				let scrollHeight = this.$refs.items.scrollHeight
				this.maxHeight   = `${scrollHeight}px`
			}
		},
		mouseout() {
			if (this.openHover) {
				let scrollHeight = 0
				this.maxHeight   = `${scrollHeight}px`
			}
		}
	},
	mounted() {
		this.openItems = this.open
		if (this.open) { this.maxHeight = 'none' }
	},
}

</script>


<style lang="scss">
@import "@/assets/scss/vuexy/components/verticalNavMenuGroup.scss"
</style>
