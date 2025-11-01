// MAIN COLORS - VUESAX THEME COLORS
let colors = {
	primary : '#ffc500',
	success : '#ffc500',
	danger  : '#664e00',
	warning : '#b28900',
	dark    : '#969696',
	dashred	: '#490000',
	dashgre	: '#003000',
	dashyel	: '#B14000',
	textred	: '#cc0000',
	textgre	: '#6aa84f',
}

// CONFIGS
const themeConfig = {
	disableCustomizer : false,       // options[Boolean] : true, false(default)
	disableThemeTour  : false,       // options[Boolean] : true, false(default)
	footerType        : "static",    // options[String]  : static(default) / sticky / hidden
	hideScrollToTop   : false,       // options[Boolean] : true, false(default)
	mainLayoutType    : "vertical",  // options[String]  : vertical(default) / horizontal
	navbarColor       : "#fff",      // options[String]  : HEX color / rgb / rgba / Valid HTML Color name - (default: #fff)
	navbarType        : "floating",  // options[String]  : floating(default) / static / sticky / hidden
	routerTransition  : "zoom-fade", // options[String]  : zoom-fade / slide-fade / fade-bottom / fade / zoom-out / none(default)
	rtl               : false,       // options[Boolean] : true, false(default)
	sidebarCollapsed  : false,       // options[Boolean] : true, false(default)
	theme             : "dark",      // options[String]  : "light"(default), "dark", "semi-dark"

	// Not required yet - WIP
	userInfoLocalStorageKey: "userInfo",

	// NOTE: themeTour will be disabled in screens < 1200. Please refer docs for more info.
}

import Vue from 'vue'
import Vuesax from 'vuesax'
Vue.use(Vuesax, { theme:{ colors }, rtl: themeConfig.rtl })

export default themeConfig
