import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [

    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '/',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Home Route
        // =============================================================================
        {
          path: '/',
          redirect: '/pages/login'
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('./views/Home.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home', url: { name: 'home' }, active: true }
            ],
            pageTitle: 'Home',
            rule: '1'
          }
        },
        // =============================================================================
        // ESTATÍSTICAS Routes
        // =============================================================================
        {
          path: '/relatorio/msglog',
          name: 'relatorio-msg',
          component: () => import('./views/relatorio/MsgLog.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Mensagem Log', active: true },
            ],
            pageTitle: 'Mensagem Log',
            rule: '42'
          }
        },
        {
          path: '/relatorio/integralog',
          name: 'relatorio-log',
          component: () => import('./views/relatorio/IntegraLog.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Integração Log', active: true },
            ],
            pageTitle: 'Integração Log',
            rule: '43'
          }
        },
        {
          path: '/relatorio/integralogretorno',
          name: 'relatorioretorno-log',
          component: () => import('./views/relatorio/IntegraLogRetorno.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Integração Retorno Log', active: true },
            ],
            pageTitle: 'Integração Retorno Log',
            rule: '109'
          }
        },
        {
          path: '/relatorio/integrapallet',
          name: 'relatorio-integra',
          component: () => import('./views/relatorio/IntegraPallet.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Integração X Pallets', active: true },
            ],
            pageTitle: 'Integração X Pallets',
            rule: '44'
          }
        },
        {
          path: '/relatorio/prodperiodo',
          name: 'relatorio-periodo',
          component: () => import('./views/relatorio/ProdPeriodo.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Prod X Período', active: true },
            ],
            pageTitle: 'Prod X Período',
            rule: '45'
          }
        },
        {
          path: '/relatorio/prodrampa',
          name: 'relatorio-rampa',
          component: () => import('./views/relatorio/ProdRampa.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produção X Rampa', active: true },
            ],
            pageTitle: 'Produção X Rampa',
            rule: '46'
          }
        },
        {
          path: '/relatorio/volumependenterampa',
          name: 'relatorio-volume-pendente-rampa',
          component: () => import('./views/relatorio/VolumePendenteRampa.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Volumes Pendentes por Rampa', active: true },
            ],
            pageTitle: 'Volumes Pendentes por Rampa',
            rule: '129'
          }
        },
        {
          path: '/relatorio/prodvolume',
          name: 'relatorio-volume',
          component: () => import('./views/relatorio/ProdVolume.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produção X Volume', active: true },
            ],
            pageTitle: 'Produção X Volume',
            rule: '67'
          }
        },
        {
          path: '/relatorio/prodoperador',
          name: 'relatorio-producao',
          component: () => import('./views/relatorio/ProdOperador.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produção X Operador', active: true },
            ],
            pageTitle: 'Produção X Operador',
            rule: '47'
          }
        },
        {
          path: '/relatorio/palletsoperador',
          name: 'relatorio-pallets',
          component: () => import('./views/relatorio/PalletsOperador.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Pallets X Operador', active: true },
            ],
            pageTitle: 'Pallets X Operador',
            rule: '48'
          }
        },
        {
          path: '/relatorio/volumehora',
          name: 'relatorio-hora',
          component: () => import('./views/relatorio/VolumeHora.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Volume X Hora', active: true },
            ],
            pageTitle: 'Volume X Hora',
            rule: '49'
          }
        },
        {
          path: '/relatorio/ociosidade',
          name: 'relatorio-ociosidade',
          component: () => import('./views/relatorio/Ociosidade.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Tempo Ocioso', active: true },
            ],
            pageTitle: 'Relatório de Tempo Ocioso',
            rule: '132'
          }
        },
        {
          path: '/relatorio/rampacheia',
          name: 'relatorio-rampacheia',
          component: () => import('./views/relatorio/RampaCheia.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Rampa Cheia', active: true },
            ],
            pageTitle: 'Relatório de Rampa Cheia',
            rule: '133'
          }
        },
        {
          path: '/relatorio/prodfaltaleitura',
          name: 'relatorio-faltaleitura',
          component: () => import('./views/relatorio/ProdFaltaLeitura.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produto Desviado sem Pallet', active: true },
            ],
            pageTitle: 'Produto Desviado sem Pallet',
            rule: '75'
          }
        },
        {
          path: '/relatorio/ramparota',
          name: 'relatorio-ramparota',
          component: () => import('./views/relatorio/RampaRota.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Rampa X Rota', active: true },
            ],
            pageTitle: 'Rampa X Rota',
            rule: '56'
          }
        },
        {
          path: '/relatorio/pickingrota',
          name: 'relatorio-pickingrota',
          component: () => import('./views/relatorio/PickingRota.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Picking X Rota', active: true },
            ],
            pageTitle: 'Picking X Rota',
            rule: '57'
          }
        },
        {
          path: '/relatorio/acessousuario',
          name: 'relatorio-acessousuario',
          component: () => import('./views/relatorio/AcessoUsuario.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Acesso X Usuário', active: true },
            ],
            pageTitle: 'Acesso X Usuário',
            rule: '60'
          }
        },
        {
          path: '/relatorio/produtopicking',
          name: 'relatorio-produtopicking',
          component: () => import('./views/relatorio/ProdutoPicking.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produtos X Posição', active: true },
            ],
            pageTitle: 'Produtos X Posição',
            rule: '115'
          }
        },
        {
          path: '/relatorio/prodposto',
          name: 'relatorio-posto',
          component: () => import('./views/relatorio/ProdPosto.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produção X Posto', active: true },
            ],
            pageTitle: 'Produção X Posto',
            rule: '102'
          }
        },

        {
          path: '/relatorio/prodtipoproduto',
          name: 'relatorio-tipoproduto',
          component: () => import('./views/relatorio/ProdTipoProduto.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produção X Familia Produto', active: true },
            ],
            pageTitle: 'Produção X Família Produto',
            rule: '103'
          }
        },

        {
          path: '/relatorio/prodpickingproduto',
          name: 'relatorio-pickingproduto',
          component: () => import('./views/relatorio/ProdPickingProduto.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produção X Picking Produto', active: true },
            ],
            pageTitle: 'Produção X Picking Produto',
            rule: '104'
          }
        },
        {
          path: '/relatorio/prodconferencia',
          name: 'relatorio-conferencia',
          component: () => import('./views/relatorio/ProdConferencia.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Produção X Conferência', active: true },
            ],
            pageTitle: 'Produção X Conferência',
            rule: '110'
          }
        },
        {
          path: '/relatorio/prodvolumeonda',
          name: 'relatorio-volumeonda',
          component: () => import('./views/relatorio/ProdVolumeOnda.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Estatísticas' },
              { title: 'Relatório' },
              { title: 'Volume X Onda', active: true },
            ],
            pageTitle: 'Volume X Onda',
            rule: '111'
          }
        },

        // =============================================================================
        // ADMINISTRAÇÃO Routes
        // =============================================================================

        // USUARIO
        {
          path: '/adm/usuario/consulta',
          name: 'consulta-usuario',
          component: () => import('./views/adm/usuario/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Usuários' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '2'
          },
        },
        {
          path: '/adm/usuario/cadastro/',
          name: 'cadastro-usuario',
          component: () => import('./views/adm/usuario/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Usuários' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '3'
          },
        },
        {
          path: '/adm/usuario/cadastro/:id_usuario',
          name: 'editar-usuario',
          component: () => import('./views/adm/usuario/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Usuários' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '3'
          },
        },
        {
          path: '/adm/usuario/perfil/:id_usuario',
          name: 'editar-perfil',
          component: () => import('./views/adm/usuario/Perfil.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Usuários' },
              { title: 'Perfil', active: true },
            ],
            pageTitle: 'Perfil',
            rule: '1'
          },
        },
        // FUNÇÃO
        {
          path: '/adm/usuario/funcao/consulta',
          name: 'consulta-funcao',
          component: () => import('./views/adm/usuario/funcao/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Usuários', url: '/adm/usuario/cadastro' },
              { title: 'Função' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '5'
          },
        },
        {
          path: '/adm/usuario/funcao/cadastro/',
          name: 'cadastro-funcao',
          component: () => import('./views/adm/usuario/funcao/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Usuários', url: '/adm/usuario/cadastro' },
              { title: 'Função' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '6'
          },
        },
        {
          path: '/adm/usuario/funcao/cadastro/:id_funcao',
          name: 'editar-funcao',
          component: () => import('./views/adm/usuario/funcao/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Usuários', url: '/adm/usuario/cadastro' },
              { title: 'Função' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '6'
          },
        },
        // GRUPO
        {
          path: '/adm/grupo/consulta',
          name: 'consulta-grupo',
          component: () => import('./views/adm/grupo/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Grupos' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '8'
          },
        },
        {
          path: '/adm/grupo/cadastro',
          name: 'cadastro-grupo',
          component: () => import('./views/adm/grupo/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Grupos' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '9'
          },
        },
        {
          path: '/adm/grupo/cadastro/:id_grupo',
          name: 'editar-grupo',
          component: () => import('./views/adm/grupo/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Grupos' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '9'
          },
        },
        // CONFIGURAÇÃO
        {
          path: '/adm/sistema/integracao/cadastro',
          name: 'sistema-integracoes',
          component: () => import('./views/adm/sistema/integracao/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Sistema' },
              { title: 'Integrações', active: true },
            ],
            pageTitle: 'Integrações',
            rule: '54'
          },
        },
        {
          path: '/adm/sistema/servico/cadastro',
          name: 'sistema-servicos',
          component: () => import('./views/adm/sistema/servico/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Sistema' },
              { title: 'Serviços', active: true },
            ],
            pageTitle: 'Serviços',
            rule: '55'
          },
        },
        {
          path: '/adm/sistema/config/',
          name: 'config-sistema',
          component: () => import('./views/adm/sistema/Config.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Sistema' },
              { title: 'Configurações', active: true },
            ],
            pageTitle: 'Configurações',
            rule: '11'
          },
        },
        // ACESSO
        {
          path: '/adm/sistema/acesso/consulta',
          name: 'consulta-acesso',
          component: () => import('./views/adm/sistema/acesso/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Sistema' },
              { title: 'Acessos' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '12'
          },
        },
        {
          path: '/adm/sistema/acesso/cadastro',
          name: 'cadastro-acesso',
          component: () => import('./views/adm/sistema/acesso/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Sistema' },
              { title: 'Acessos' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '13'
          },
        },
        {
          path: '/adm/sistema/acesso/cadastro/:id_acesso',
          name: 'editar-acesso',
          component: () => import('./views/adm/sistema/acesso/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Sistema' },
              { title: 'Acessos' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '13'
          },
        },

        {
          path: '/adm/sistema/limparpostos',
          name: 'cadastro-limparPostos',
          component: () => import('./views/adm/sistema/limparPostos/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Sistema' },
              { title: 'Limpar Postos', active: true },
            ],
            pageTitle: 'Limpar Postos',
            rule: '105'
          },
        },
        {
          path: '/adm/sistema/limparpostositens/:id_posto',
          name: 'cadastro-limparpostositens',
          component: () => import('./views/adm/sistema/limparPostos/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Administração' },
              { title: 'Sistema' },
              { title: 'Limpar Caixas', active: true },
            ],
            pageTitle: 'Visualizar Caixas Posto',
            rule: '107'
          },
        },



        // =============================================================================
        // INTERFACE Routes
        // =============================================================================

        // SORTER
        {
          path: '/interface/sorter/consulta',
          name: 'consulta-sorter',
          component: () => import('./views/interface/sorter/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Sorter' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '15'
          },
        },
        {
          path: '/interface/sorter/cadastro/',
          name: 'cadastro-sorter',
          component: () => import('./views/interface/sorter/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Sorter' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '16'
          },
        },
        {
          path: '/interface/sorter/cadastro/:id_sorter',
          name: 'editar-sorter',
          component: () => import('./views/interface/sorter/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Sorter' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '16'
          },
        },
        // PTL
        {
          //Frontend\src\views\interface\etiqueta\Etiquetas.vue
          path: '/interface/ptl/impressao',
          name: 'impressao-ptl',
          component: () => import('./views/interface/etiqueta/Etiquetas.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'PTLs' },
              { title: 'Impressão', active: true },
            ],
            pageTitle: 'Impressão',
            rule: "17"
          },
        },
        {
          path: '/interface/ptl/consulta',
          name: 'consulta-ptl',
          component: () => import('./views/interface/ptl/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'PTL' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '18'
          },
        },
        {
          path: '/interface/ptl/cadastro/',
          name: 'cadastro-ptl',
          component: () => import('./views/interface/ptl/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'PTL' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '19'
          },
        },
        {
          path: '/interface/ptl/cadastro/:id_ptl',
          name: 'editar-ptl',
          component: () => import('./views/interface/ptl/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'PTL' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '19'
          },
        },
                // PTM
                {
                  path: '/interface/ptm/consulta',
                  name: 'consulta-ptm',
                  component: () => import('./views/interface/ptm/Consulta.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Interface' },
                          { title: 'Contingência' },
//                          { title: 'PTM' },
                          { title: 'Consulta', active: true },
                      ],
                      pageTitle: 'Consulta',
                      rule: '125'
                  },
              },
              {
                  path: '/interface/ptm/cadastro/',
                  name: 'cadastro-ptm',
                  component: () => import('./views/interface/ptm/Cadastro.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Interface' },
                          { title: 'Contingência' },
//                          { title: 'PTM' },
                          { title: 'Cadastro', active: true },
                      ],
                      pageTitle: 'Cadastro',
                      rule: '126'
                  },
              },
              {
                  path: '/interface/ptm/cadastro/:id_ptm',
                  name: 'editar-ptm',
                  component: () => import('./views/interface/ptm/Cadastro.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Interface' },
                          { title: 'Contingência' },
//                          { title: 'PTM' },
                          { title: 'Editar', active: true },
                      ],
                      pageTitle: 'Editar',
                      rule: '126'
                  },
              },


        // ROTA
        {
          path: '/interface/rota/consulta',
          name: 'consulta-rota',
          component: () => import('./views/interface/rota/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rotas' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '21'
          },
        },
        {
          path: '/interface/rota/cadastro/',
          name: 'cadastro-rota',
          component: () => import('./views/interface/rota/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rotas' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '22'
          },
        },
        {
          path: '/interface/rota/cadastro/:id_rota',
          name: 'editar-rota',
          component: () => import('./views/interface/rota/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rotas' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '22'
          },
        },
        // MAPA SORTER
        {
          path: '/interface/mapaSorter/consulta',
          name: 'consulta-mapa-sorter',
          component: () => import('./views/interface/mapaSorter/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Mapas Sorters' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '24'
          },
        },
        {
          path: '/interface/mapaSorter/cadastro/',
          name: 'cadastro-mapa-sorter',
          component: () => import('./views/interface/mapaSorter/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Mapas Sorters' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '25'
          },
        },
        {
          path: '/interface/mapaSorter/cadastro/:id_mapa_sorter',
          name: 'editar-mapa-sorter',
          component: () => import('./views/interface/mapaSorter/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Mapas Sorters' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '25'
          },
        },
        // MAPA PTL
        {
          path: '/interface/mapaPtl/consulta',
          name: 'consulta-mapa-ptl',
          component: () => import('./views/interface/mapaPtl/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Mapas PTLs' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '27'
          },
        },
        {
          path: '/interface/mapaPtl/cadastro/',
          name: 'cadastro-mapa-ptl',
          component: () => import('./views/interface/mapaPtl/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Mapas PTLs' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '28'
          },
        },
        {
          path: '/interface/mapaPtl/cadastro/:id_mapa_ptl',
          name: 'editar-mapa-ptl',
          component: () => import('./views/interface/mapaPtl/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Mapas PTLs' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '28'
          },
        },
                // MAPA PTM
                {
                  path: '/interface/mapaPtm/consulta',
                  name: 'consulta-mapa-ptm',
                  component: () => import('./views/interface/mapaPtm/Consulta.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Interface' },
                          { title: 'Mapas Contingência' },
//                          { title: 'Mapas PTM' },
                          { title: 'Consulta', active: true },
                      ],
                      pageTitle: 'Consulta',
                      rule: '122'
                  },
              },
              {
                  path: '/interface/mapaPtm/cadastro/',
                  name: 'cadastro-mapa-ptm',
                  component: () => import('./views/interface/mapaPtm/Cadastro.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Interface' },
                          { title: 'Mapas Contingência' },
//                          { title: 'Mapas PTM' },
                          { title: 'Cadastro', active: true },
                      ],
                      pageTitle: 'Cadastro',
                      rule: '123'
                  },
              },
              {
                  path: '/interface/mapaPtm/cadastro/:id_mapa_ptm',
                  name: 'editar-mapa-ptm',
                  component: () => import('./views/interface/mapaPtm/Cadastro.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Interface' },
                          { title: 'Mapas Contingência' },
//                          { title: 'Mapas PTM' },
                          { title: 'Editar', active: true },
                      ],
                      pageTitle: 'Editar',
                      rule: '123'
                  },
              },

        // RAMPA
        {
          path: '/interface/rampa/consulta',
          name: 'consulta-rampa',
          component: () => import('./views/interface/rampa/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rampas' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '30'
          },
        },
        {
          path: '/interface/rampa/cadastro/',
          name: 'cadastro-rampa',
          component: () => import('./views/interface/rampa/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rampas' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '31'
          },
        },
        {
          path: '/interface/rampa/cadastro/:id_rampa',
          name: 'editar-rampa',
          component: () => import('./views/interface/rampa/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rampas' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '31'
          },
        },
        //  COLETOR
        {
          path: '/interface/coletor/consulta',
          name: 'consulta-coletor',
          component: () => import('./views/interface/coletor/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rampas', url: '/interface/rampa/cadastro' },
              { title: 'Coletores' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '33'
          },
        },
        {
          path: '/interface/coletor/cadastro/',
          name: 'cadastro-coletor',
          component: () => import('./views/interface/coletor/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rampas', url: '/interface/rampa/cadastro' },
              { title: 'Coletores' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '34'
          },
        },
        {
          path: '/interface/coletor/cadastro/:id_coletor',
          name: 'editar-coletor',
          component: () => import('./views/interface/coletor/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Rampas', url: '/interface/rampa/cadastro' },
              { title: 'Coletores' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '34'
          },
        },
        // PICKING
        {
          path: '/interface/picking/consulta',
          name: 'consulta-picking',
          component: () => import('./views/interface/picking/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Pickings' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '36'
          },
        },
        {
          path: '/interface/picking/cadastro/',
          name: 'cadastro-picking',
          component: () => import('./views/interface/picking/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Pickings' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '37'
          },
        },
        {
          path: '/interface/picking/cadastro/:id_picking',
          name: 'editar-picking',
          component: () => import('./views/interface/picking/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Pickings' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '37'
          },
        },
        // GATEWAY
        {
          path: '/interface/gateway/consulta',
          name: 'consulta-gateway',
          component: () => import('./views/interface/gateway/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Gateways' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '39'
          },
        },
        {
          path: '/interface/gateway/cadastro/',
          name: 'cadastro-gateway',
          component: () => import('./views/interface/gateway/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Gateways' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '40'
          },
        },
        {
          path: '/interface/gateway/cadastro/:id_gateway',
          name: 'editar-gateway',
          component: () => import('./views/interface/gateway/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Gateways' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '40'
          },
        },
        // OPERAÇÃO
        {
          path: '/interface/operacao/onda/',
          name: 'cadastro-onda',
          component: () => import('./views/interface/operacao/onda/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Onda', active: true },
            ],
            pageTitle: 'Onda',
            rule: '52'
          },
        },
        {
          path: '/interface/operacao/opmapasorter/',
          name: 'cadastro-opsorter',
          component: () => import('./views/interface/operacao/opMapaSorter/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Mapa Sorter', active: true },
            ],
            pageTitle: 'Mapa Sorter',
            rule: '58'
          },
        },
        {
          path: '/interface/operacao/opmapaptl/',
          name: 'cadastro-opptl',
          component: () => import('./views/interface/operacao/opMapaPtl/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Mapa Ptl', active: true },
            ],
            pageTitle: 'Mapa Ptl',
            rule: '59'
          },
        },
        {
          path: '/interface/operacao/opmapaptm/',
          name: 'cadastro-opptm',
          component: () => import('./views/interface/operacao/opMapaPtm/Cadastro.vue'),
          meta: {
              breadcrumb: [
                  { title: 'Home' },
                  { title: 'Interface' },
                  { title: 'Operação' },
                  { title: 'Mapa Contingência', active: true },
//                  { title: 'Mapa Ptm', active: true },
              ],
              pageTitle: 'Mapa Contingência',
//              pageTitle: 'Mapa Ptm',
              rule: '128'
          },
        },
        {
          path: '/interface/operacao/oprevisapallet',
          name: 'cadastro-oprevisapallet',
          component: () => import('./views/interface/operacao/opRevisaPallet/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Revisa Pallets', active: true },
            ],
            pageTitle: 'Revisa Pallets',
            rule: '61'
          },
        },
        {
          path: '/interface/operacao/oprevisaitens/:id_pallet',
          name: 'cadastro-oprevisaitens',
          component: () => import('./views/interface/operacao/opRevisaPallet/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Revisa Itens', active: true },
            ],
            pageTitle: 'Revisa Itens',
            rule: '63'
          },
        },
        {
          path: '/interface/operacao/oprejeitados',
          name: 'cadastro-oprejeitados',
          component: () => import('./views/interface/operacao/opRejeitados/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Rejeitados', active: true },
            ],
            pageTitle: 'Rejeitados',
            rule: '65'
          },
        },
        {
          path: '/interface/operacao/opexcecao',
          name: 'cadastro-opexcecao',
          component: () => import('./views/interface/operacao/opExcecao/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Volume Exceção', active: true },
            ],
            pageTitle: 'Volume Exceção',
            rule: '66'
          },
        },
        {
          path: '/interface/operacao/opOrderStart',
          name: 'cadastro-oporderstart',
          component: () => import('./views/interface/operacao/opOrderStart/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Order Start', active: true },
            ],
            pageTitle: 'Order Start',
            rule: '89'
          },
        },
        {
          path: '/interface/operacao/opConferencia',
          name: 'cadastro-opconferencia',
          component: () => import('./views/interface/operacao/opConferencia/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Conferência', active: true },
            ],
            pageTitle: 'Conferência',
            rule: '98'
          },
        },
        {
          path: '/interface/operacao/opReprocessaOnda',
          name: 'cadastro-opReprocessaOnda',
          component: () => import('./views/interface/operacao/opReprocessaOnda/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Operação' },
              { title: 'Reprocessar Onda', active: true },
            ],
            pageTitle: 'Reprocessar Onda',
            rule: '76'
          },
        },
        {
          path: '/interface/operacao/opPTM',
          name: 'cadastro-opPTM',
          component: () => import('./views/interface/operacao/opPTM/Cadastro.vue'),
          meta: {
              breadcrumb: [
                  { title: 'Home' },
                  { title: 'Interface' },
                  { title: 'Operação' },
                  { title: 'Contingência', active: true },
//                  { title: 'PTM', active: true },
              ],
              pageTitle: 'Contingência',
//              pageTitle: 'PTM',
              rule: '118'
          },
      },

        // caixas
        {
          path: '/cadastros/caixas/consulta',
          name: 'consulta-caixas',
          component: () => import('./views/cadastros/caixas/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Caixas' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '70'
          },
        },
        {
          path: '/cadastros/caixas/cadastro/',
          name: 'cadastro-caixas',
          component: () => import('./views/cadastros/caixas/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Caixas' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '71'
          },
        },
        {
          path: '/cadastros/caixas/cadastro/:id_caixas',
          name: 'editar-caixas',
          component: () => import('./views/cadastros/caixas/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Caixas' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '71'
          },
        },

        // Franqueados
        {
          path: '/cadastros/franqueado/consulta',
          name: 'consulta-franqueado',
          component: () => import('./views/cadastros/franqueado/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Franqueados' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '112'
          },
        },
        {
          path: '/cadastros/franqueado/cadastro/',
          name: 'cadastro-franqueado',
          component: () => import('./views/cadastros/franqueado/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Franqueados' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '113'
          },
        },
        {
          path: '/cadastros/franqueado/cadastro/:id_franqueado',
          name: 'editar-franqueado',
          component: () => import('./views/cadastros/franqueado/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Franqueados' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '113'
          },
        },

        // Transportadoras
        {
          path: '/cadastros/transportadora/consulta',
          name: 'consulta-transportadoras',
          component: () => import('./views/cadastros/transportadora/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Transportadoras' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '77'
          },
        },
        {
          path: '/cadastros/transportadora/cadastro/',
          name: 'cadastro-transportadoras',
          component: () => import('./views/cadastros/transportadora/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Transportadoras' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '78'
          },
        },
        {
          path: '/cadastros/transportadora/cadastro/:id_transportadoras',
          name: 'editar-transportadoras',
          component: () => import('./views/cadastros/transportadora/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Transportadoras' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '78'
          },
        },

        // Postos
        {
          path: '/cadastros/postos/consulta',
          name: 'consulta-postos',
          component: () => import('./views/cadastros/postos/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Postos' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '80'
          },
        },
        {
          path: '/cadastros/postos/cadastro/',
          name: 'cadastro-postos',
          component: () => import('./views/cadastros/postos/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Postos' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '81'
          },
        },
        {
          path: '/cadastros/postos/cadastro/:id_posto',
          name: 'editar-postos',
          component: () => import('./views/cadastros/postos/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Postos' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '81'
          },
        },

        // Ponto de Decisão
        {
          path: '/cadastros/pontoDecisao/consulta',
          name: 'consulta-pontos',
          component: () => import('./views/cadastros/pontoDecisao/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Pontos de Decisão' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '86'
          },
        },
        {
          path: '/cadastros/pontoDecisao/cadastro/',
          name: 'cadastro-pontos',
          component: () => import('./views/cadastros/pontoDecisao/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Pontos de Decisão' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '87'
          },
        },
        {
          path: '/cadastros/pontoDecisao/cadastro/:id_pontos',
          name: 'editar-pontos',
          component: () => import('./views/cadastros/pontoDecisao/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Pontos de Decisão' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '87'
          },
        },


        // Produtos
        {
          path: '/cadastros/produtos/consulta',
          name: 'consulta-produtos',
          component: () => import('./views/cadastros/produtos/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Produtos' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '83'
          },
        },
        {
          path: '/cadastros/produtos/cadastro/',
          name: 'cadastro-produtos',
          component: () => import('./views/cadastros/produtos/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Produtos' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '83'
          },
        },
        {
          path: '/cadastros/produtos/cadastro/:id_produto',
          name: 'editar-produtos',
          component: () => import('./views/cadastros/produtos/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Produtos' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '83'
          },
        },

        // FUNÇÃO
        {
          path: '/cadastros/produtos/tipoproduto/consulta',
          name: 'consulta-tipoproduto',
          component: () => import('./views/cadastros/produtos/tipoproduto/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Produtos', url: '/cadastros/produto/cadastro' },
              { title: 'Tipo Produto' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '99'
          },
        },
        {
          path: '/cadastros/produtos/tipoproduto/cadastro/',
          name: 'cadastro-tipoproduto',
          component: () => import('./views/cadastros/produtos/tipoproduto/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Produtos', url: '/cadastros/produto/cadastro' },
              { title: 'Tipo Produto' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '100'
          },
        },
        {
          path: '/cadastros/produtos/tipoproduto/cadastro/:id_tipo_produto',
          name: 'editar-tipoproduto',
          component: () => import('./views/cadastros/produtos/tipoproduto/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Produtos', url: '/cadastros/produto/cadastro' },
              { title: 'Tipo Produto' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '100'
          },
        },
        {
          path: '/interface/importaprodutos',
          name: 'importa-produtos',
          component: () => import('./views/interface/ImportaProdutos.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Produtos' },
              { title: 'Importação de Produtos', active: true },
            ],
            pageTitle: 'Importação de Produtos',
            rule: '130'
          },
        },
        {
          path: '/interface/reimprimiretiqueta',
          name: 'reimprimir-etiqueta',
          component: () => import('./views/interface/ReimprimirEtiqueta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Interface' },
              { title: 'Reimprimir Etiqueta', active: true },
            ],
            pageTitle: 'Reimprimir Etiqueta',
            rule: '131'
          },
        },

        // Endereços
        {
          path: '/interface/picking/consulta',
          name: 'consulta-picking',
          component: () => import('./views/interface/picking/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Picking' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '36'
          },
        },
        {
          path: '/interface/picking/cadastro/',
          name: 'cadastro-picking',
          component: () => import('./views/interface/picking/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Picking' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '37'
          },
        },
        {
          path: '/interface/picking/cadastro/:id_picking',
          name: 'editar-picking',
          component: () => import('./views/interface/picking/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Picking' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '37'
          },
        },
                // Endereços PTM
                {
                  path: '/interface/enderecoPtm/consulta',
                  name: 'consulta-enderecoptm',
                  component: () => import('./views/interface/enderecoPtm/Consulta.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Cadastros' },
                          { title: 'Endereço Contingência' },
//                          { title: 'Endereço PTM' },
                          { title: 'Consulta', active: true },
                      ],
                      pageTitle: 'Consulta',
                      rule: '119'
                  },
              },
              {
                  path: '/interface/enderecoPtm/cadastro/',
                  name: 'cadastro-enderecoPtm',
                  component: () => import('./views/interface/enderecoPtm/Cadastro.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Cadastros' },
                          { title: 'Endereço Contingência' },
//                          { title: 'Endereço PTM' },
                          { title: 'Cadastro', active: true },
                      ],
                      pageTitle: 'Cadastro',
                      rule: '120'
                  },
              },
              {
                  path: '/interface/enderecoPtm/cadastro/:id_endereco_ptm',
                  name: 'editar-enderecoPtm',
                  component: () => import('./views/interface/enderecoPtm/Cadastro.vue'),
                  meta: {
                      breadcrumb: [
                          { title: 'Home' },
                          { title: 'Cadastros' },
                          { title: 'Endereço Contingência' },
//                          { title: 'Endereço PTM' },
                          { title: 'Editar', active: true },
                      ],
                      pageTitle: 'Editar',
                      rule: '120'
                  },
              },
        // GATEWAY
        {
          path: '/interface/gateway/consulta',
          name: 'consulta-gateway',
          component: () => import('./views/interface/gateway/Consulta.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Gateways' },
              { title: 'Consulta', active: true },
            ],
            pageTitle: 'Consulta',
            rule: '39'
          },
        },
        {
          path: '/interface/gateway/cadastro/',
          name: 'cadastro-gateway',
          component: () => import('./views/interface/gateway/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Gateways' },
              { title: 'Cadastro', active: true },
            ],
            pageTitle: 'Cadastro',
            rule: '40'
          },
        },
        {
          path: '/interface/gateway/cadastro/:id_gateway',
          name: 'editar-gateway',
          component: () => import('./views/interface/gateway/Cadastro.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home' },
              { title: 'Cadastros' },
              { title: 'Gateways' },
              { title: 'Editar', active: true },
            ],
            pageTitle: 'Editar',
            rule: '40'
          },
        },




      ],
    },

    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [

        // =============================================================================
        // DASHBOARD Routes
        // =============================================================================
        {
          path: '/dashboard/pdireito',
          name: 'pdireito',
          component: () => import('@/views/dashboard/PDireito.vue'),
          meta: {
            rule: '50'
          }
        },
        {
          path: '/dashboard/pesquerdo',
          name: 'pesquerdo',
          component: () => import('@/views/dashboard/PEsquerdo.vue'),
          meta: {
            rule: '51'
          }
        },

        {
          path: '/dashboard/pdireitosorter',
          name: 'pdireitosorter',
          component: () => import('@/views/dashboard/PDireitoSorter.vue'),
          meta: {
            rule: '73'
          }
        },

        {
          path: '/dashboard/pesquerdosorter',
          name: 'pesquerdosorter',
          component: () => import('@/views/dashboard/PEsquerdoSorter.vue'),
          meta: {
            rule: '74'
          }
        },

        // =============================================================================
        // PAGES
        // =============================================================================

        {
          path: '/pages/login',
          name: 'page-login',
          component: () => import('@/views/pages/Login.vue'),
          meta: {
            rule: '0'
          }
        },
        {
          path: '/pages/refresh',
          name: 'refresh',
          component: () => import('@/views/pages/Refresh.vue'),
          meta: {
            rule: '0'
          }
        },
        {
          path: '/pages/refreshcadastro',
          name: 'refreshcadastro',
          component: () => import('@/views/pages/RefreshCadastro.vue'),
          meta: {
            rule: '0'
          }
        },
        {
          path: '/pages/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error-404.vue'),
          meta: {
            rule: '0'
          }
        },
        {
          path: '/pages/not-authorized',
          name: 'page-not-authorized',
          component: () => import('@/views/pages/NotAuthorized.vue'),
          meta: {
            rule: '0'
          }
        },
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/pages/error-404'
    }
  ],
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = "none"
  }
})

export default router
