import navbarSearchAndPinList from "@/layouts/components/navbar/navbarSearchAndPinList"
import themeConfig from "@/../themeConfig.js"
import colors from "@/../themeConfig.js"

const userDefaults = {}

const userInfoLocalStorage = JSON.parse(localStorage.getItem("userInfo")) || {}

const getUserInfo = () => {
	let userInfo = {}

	Object.keys(userDefaults).forEach((key) => {
		userInfo[key] = userInfoLocalStorage[key] ?  userInfoLocalStorage[key] : userDefaults[key]
	})

	Object.keys(userInfoLocalStorage).forEach((key) => {
		if(userInfo[key] == undefined && userInfoLocalStorage[key] != null) userInfo[key] = userInfoLocalStorage[key]
	})

    // ATIVAR PARA LOGIN
    userInfo = {}

	return userInfo
}

const state = {
    AppActiveUsuario        : getUserInfo(),
    bodyOverlay             : false,
    isVerticalNavMenuActive : true,
    mainLayoutType          : themeConfig.mainLayoutType || "vertical",
    navbarSearchAndPinList  : navbarSearchAndPinList,
    reduceButton            : themeConfig.sidebarCollapsed,
    verticalNavMenuWidth    : "default",
    verticalNavMenuItemsMin : false,
    scrollY                 : 0,
    starredPages            : navbarSearchAndPinList["pages"].data.filter((page) => page.is_bookmarked),
    theme                   : themeConfig.theme || "dark",
    themePrimaryColor       : colors.primary,
    windowWidth				: null,
}

export default state
	

	

