import Vue from 'vue'


import VxTooltip from './layouts/components/vx-tooltip/VxTooltip.vue'
import VxCard  from './components/vx-card/VxCard.vue'
import VxBreadcrumb  from './layouts/components/VxBreadcrumb.vue'
import FeatherIcon  from './components/FeatherIcon.vue'

Vue.component(VxTooltip.name, VxTooltip)
Vue.component(VxCard.name, VxCard)
Vue.component(VxBreadcrumb.name, VxBreadcrumb)
Vue.component(FeatherIcon.name, FeatherIcon)

//LOCAL
export const backendUrl = 'http://127.0.0.1:3001'
export const wsIntegracaoUrl = 'http://127.0.0.1:4000'
//export const impressaoUrl = 'http://127.0.0.1:7000'
//HOMOLOGACAO
//export const backendUrl = 'http://192.168.0.131:3001'
//export const wsIntegracaoUrl = 'http://192.168.0.131:5000'
//export const impressaoUrl = 'http://10.90.135.139:7000'
// PRODUCAO
//export const backendUrl = 'http://192.168.0.131:3000'
//export const wsIntegracaoUrl = 'http://192.168.0.131:4000'
//export const impressaoUrl = 'http://10.90.135.138:7000'


//export const backendUrl = 'http://10.4.97.55:3000'
//export const wsIntegracaoUrl = 'http://10.4.97.55:4000'

// v-select component
import vSelect from 'vue-select'

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
	Deselect: {
		render: createElement => createElement('feather-icon', {
			props: {
				icon: 'XIcon',
				svgClasses: 'w-4 h-4 mt-1'
			}
		}),
	},
	OpenIndicator: {
		render: createElement => createElement('feather-icon', {
			props: {
				icon: 'ChevronDownIcon',
				svgClasses: 'w-5 h-5'
			}
		}),
	},
});

Vue.component(vSelect)
