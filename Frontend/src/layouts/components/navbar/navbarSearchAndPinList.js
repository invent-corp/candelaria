export default {
	pages: {
		key: "title",
		data: [
			{title: 'Home',       		url: '/home',             			   icon: 'HomeIcon',  	   is_bookmarked: true},

			{title: 'Usuários',         url: '/adm/usuario/consulta',          icon: 'UserIcon',       is_bookmarked: false},
			{title: 'Funções',          url: '/adm/usuario/funcao/consulta',   icon: 'UserPlusIcon',   is_bookmarked: false},
			{title: 'Grupos de Acesso', url: '/adm/grupo/consulta',            icon: 'UsersIcon',      is_bookmarked: false},
			{title: 'Sistema',          url: '/adm/sistema/config/1',          icon: 'AirplayIcon',    is_bookmarked: false},
			{title: 'Acessos',          url: '/adm/sistema/acesso/consulta',   icon: 'KeyIcon',        is_bookmarked: false},

			{title: 'Sorters',          url: '/interface/sorter/consulta',     icon: 'MapPinIcon',     is_bookmarked: false},
			{title: 'PTLs',             url: '/interface/ptl/consulta',        icon: 'MapPinIcon',     is_bookmarked: false},
			{title: 'Mapas Sorters',    url: '/interface/mapaSorter/consulta', icon: 'MapIcon',        is_bookmarked: false},
			{title: 'Mapas PTLs',       url: '/interface/mapaPtl/consulta',    icon: 'MapIcon',        is_bookmarked: false},
			{title: 'Rotas',            url: '/interface/rota/consulta',       icon: 'TruckIcon',      is_bookmarked: false},
			{title: 'Rampas',           url: '/interface/rampa/consulta',      icon: 'PackageIcon',    is_bookmarked: false},
			{title: 'Coletor',          url: '/interface/coletor/consulta',    icon: 'RssIcon',        is_bookmarked: false},
			{title: 'Picking',          url: '/interface/picking/consulta',    icon: 'SendIcon',       is_bookmarked: false},
			{title: 'Caixas',           url: '/cadastros/caixas/consulta',    icon: 'SendIcon',       is_bookmarked: false},
	
		]
	}
}
