
module.exports = app => {
    // LOGIN
    app.post('/login', app.api.autenticacao.login)
    app.post('/loginconferencia', app.api.autenticacao.loginliberaconferencia)
    app.post('/validarToken', app.api.autenticacao.validarToken)

    // SERVIÇO
    app.route('/statusplc')
        .get(app.api.servicos.statusPlc)
    
    app.route('/stopplc')
        .get(app.api.servicos.stopPlc)
    
    app.route('/startplc')
        .get(app.api.servicos.startPlc)

    app.route('/restartplc')
        .get(app.api.servicos.restartPlc)
    
    app.route('/statusptl')
        .get(app.api.servicos.statusPtl)

    app.route('/stopptl')
        .get(app.api.servicos.stopPtl)

    app.route('/startptl')
        .get(app.api.servicos.startPtl)

    app.route('/restartptl')
        .get(app.api.servicos.restartPtl)

    app.route('/statuswebservice')
        .get(app.api.servicos.statusWebService)

    app.route('/stopwebservice')
        .get(app.api.servicos.stopWebService)

    app.route('/startwebservice')
        .get(app.api.servicos.startWebService)

    app.route('/restartwebservice')
        .get(app.api.servicos.restartWebService)

    app.route('/statuswebserviceretorno')
        .get(app.api.servicos.statusWebServiceRetorno)

    app.route('/stopwebserviceretorno')
        .get(app.api.servicos.stopWebServiceRetorno)

    app.route('/startwebserviceretorno')
        .get(app.api.servicos.startWebServiceRetorno)

    app.route('/restartwebserviceretorno')
        .get(app.api.servicos.restartWebServiceRetorno)
        
    // CONFIGURAÇÃO SISTEMA
    app.route('/config')
        .post(app.api.config.salvar)
        .get(app.api.config.consultar)

    app.route('/config/:id_config')
        .put(app.api.config.salvar)
        .get(app.api.config.consultarId)

    // DASHBOARD
    app.route('/dashdireito')
        .get(app.api.dashboard.consultarDireito)

    app.route('/dashtotal')
        .get(app.api.dashboard.consultarTotal)

    app.route('/dashdireitosorter')
        .get(app.api.dashboard.consultarDireitoSorter)

    app.route('/dashesquerdo')
        .get(app.api.dashboard.consultarEsquerdo)

    app.route('/dashesquerdosorter')
        .get(app.api.dashboard.consultarEsquerdoSorter)

    app.route('/dashrejeitos')
        .get(app.api.dashboard.consultarRejeito)

    app.route('/dashrejeitossorter')
        .get(app.api.dashboard.consultarRejeitoSorter)

    // RELATÓRIOS
    app.route('/msglog')
        .get(app.api.relMsgLog.consultar)

    app.route('/msglog/:data_inicial&:data_final&:tipo')
        .get(app.api.relMsgLog.consultarData)

    app.route('/integralog')
        .get(app.api.relIntegraLog.consultar)

    app.route('/integralog/:data_inicial&:data_final')
        .get(app.api.relIntegraLog.consultarData)

    app.route('/integralogretorno')
        .get(app.api.relIntegraRetornoLog.consultar)

    app.route('/integralogretorno/:data_inicial&:data_final')
        .get(app.api.relIntegraRetornoLog.consultarData)

    app.route('/integrapallet')
        .get(app.api.relIntegraPallet.consultar)

    app.route('/integrapallet/:data_inicial&:data_final')
        .get(app.api.relIntegraPallet.consultarData)

    app.route('/prodrampa')
        .get(app.api.relprodRampa.consultar)

    app.route('/prodrampa/:data_inicial&:data_final')
        .get(app.api.relprodRampa.consultarData)

    app.route('/prodposto/:data_inicial&:data_final')
        .get(app.api.relprodPosto.consultarData)

    app.route('/prodtipoproduto/:data_inicial&:data_final')
        .get(app.api.relprodTipoProduto.consultarData)
        
    app.route('/prodpickingproduto/:data_inicial&:data_final')
        .get(app.api.relprodPickingProduto.consultarData)

    app.route('/prodoperador')
        .get(app.api.relprodOperador.consultar)

    app.route('/prodoperador/:data_inicial&:data_final')
        .get(app.api.relprodOperador.consultarData)

    app.route('/prodvolume')
        .get(app.api.relprodVolume.consultar)

    app.route('/prodvolume/:data_inicial&:data_final')
        .get(app.api.relprodVolume.consultarData)

    app.route('/prodconferencia')
       .get(app.api.relprodConferencia.consultar)

    app.route('/prodconferencia/:onda')
        .get(app.api.relprodConferencia.consultarData)

    app.route('/prodconferenciacbx')
        .get(app.api.relprodConferencia.consultarCbx)

    app.route('/prodvolumeonda')
        .get(app.api.relprodVolumeOnda.consultar)
 
     app.route('/prodvolumeonda/:onda')
         .get(app.api.relprodVolumeOnda.consultarData)
 
     app.route('/prodvolumeondacbx')
         .get(app.api.relprodVolumeOnda.consultarCbx)
 
    app.route('/palletsoperador')
        .get(app.api.relpalletsOperador.consultar)

    app.route('/palletsoperador/:data_inicial&:data_final')
        .get(app.api.relpalletsOperador.consultarData)

    app.route('/volumehora')
        .get(app.api.relvolHora.consultar)

    app.route('/volumehora/:data_inicial&:data_final')
        .get(app.api.relvolHora.consultarData)
    
    app.route('/prodperiodo')
        .get(app.api.relprodPeriodo.consultar)

    app.route('/prodperiodo/:data_inicial&:data_final')
        .get(app.api.relprodPeriodo.consultarData)

    app.route('/ramparota/:id_mapa_sorter')
        .get(app.api.relRampaRota.consultarId)

    app.route('/pickingrota/:id_mapa_ptl')
        .get(app.api.relPickingRota.consultarId)

    app.route('/volumependenterampa')
        .get(app.api.relVolumePendenteRampa.consultar)

    app.route('/volumependenterampa/:data_inicial&:data_final')
        .get(app.api.relVolumePendenteRampa.consultarData)

    app.route('/volumependenterampa/:rampa&:data_inicial&:data_final')
        .get(app.api.relVolumePendenteRampa.consultarPorRampa)

    app.route('/volumependenteramparesumo/:data_inicial&:data_final')
        .get(app.api.relVolumePendenteRampa.consultarResumo)
    
    app.route('/acessousuario/')
        .get(app.api.relAcessoUsuario.consultar)

    app.route('/produtopicking/')
        .get(app.api.relProdutoPicking.consultar)

    app.route('/faltaleituracbx')
        .get(app.api.relfaltaLeituraPallet.consultarCbx)

    app.route('/faltaleitura/:onda')
        .get(app.api.relfaltaLeituraPallet.consultarData)

    app.route('/faltaleitura')
        .get(app.api.relfaltaLeituraPallet.consultar)

    // USUÁRIO

    app.route('/usuario/')
        .post(app.api.usuario.salvar)

    app.route('/usuarioa/:adm')
        .post(app.api.usuario.salvar)
        .get(app.api.usuario.consultar)

    app.route('/senha/:id_usuario')
        .put(app.api.usuario.salvarSenha)

    app.route('/usuario/:id_usuario')
        .put(app.api.usuario.salvar)
        .get(app.api.usuario.consultarId)
        .delete(app.api.usuario.excluir)

    // FUNÇÃO
    app.route('/funcao')
        .post(app.api.funcao.salvar)
        .get(app.api.funcao.consultar)

    app.route('/funcaoAtiva/:id_funcao')
        .get(app.api.funcao.consultarAtivo)

    app.route('/funcao/:id_funcao')
        .put(app.api.funcao.salvar)
        .get(app.api.funcao.consultarId)
        .delete(app.api.funcao.excluir)


    // USUÁRIO X GRUPO
    app.route('/usuarioGrupo')
        .post(app.api.usuarioGrupo.salvar)
        .get(app.api.usuarioGrupo.consultar)

    app.route('/usuarioGrupo/:id_usuario_grupo')
        .put(app.api.usuarioGrupo.salvar)
        .get(app.api.usuarioGrupo.consultarId)
        .delete(app.api.usuarioGrupo.excluir)

    // GRUPO
    app.route('/grupoa/:adm')
        .get(app.api.grupo.consultar)

    app.route('/grupo')
        .post(app.api.grupo.salvar)

    app.route('/grupoAtivo/:adm')
        .get(app.api.grupo.consultarAtivo)

    app.route('/grupo/:id_grupo')
        .put(app.api.grupo.salvar)
        .get(app.api.grupo.consultarId)
        .delete(app.api.grupo.excluir)

    // GRUPO X ACESSO
    app.route('/grupoAcesso')
        .post(app.api.grupoAcesso.salvar)
        .get(app.api.grupoAcesso.consultar)

    app.route('/grupoAcesso/:id_grupo_acesso')
        .put(app.api.grupoAcesso.salvar)
        .get(app.api.grupoAcesso.consultarId)
        .delete(app.api.grupoAcesso.excluir)
    
    // ACESSO
    app.route('/acessoa/:adm')
        .get(app.api.acesso.consultar)

    app.route('/acesso')
        .post(app.api.acesso.salvar)

    app.route('/acessoAtivo/:adm')
        .get(app.api.acesso.consultarAtivo)

    app.route('/acesso/:id_acesso')
        .put(app.api.acesso.salvar)
        .get(app.api.acesso.consultarId)
        .delete(app.api.acesso.excluir)

    // CAIXAS
    app.route('/caixas')
        .post(app.api.caixas.salvar)
        .get(app.api.caixas.consultar)

    app.route('/caixasAtivo/:id_caixas')
        .get(app.api.caixas.consultarAtivo)

    app.route('/caixas/:id_caixas')
        .put(app.api.caixas.salvar)
        .get(app.api.caixas.consultarId)
        .delete(app.api.caixas.excluir)  
        
    // FRANQUEADO
    app.route('/franqueado')
        .post(app.api.franqueado.salvar)
        .get(app.api.franqueado.consultar)

    app.route('/franqueadoAtivo/:id_franqueado')
        .get(app.api.franqueado.consultarAtivo)

    app.route('/franqueado/:id_franqueado')
        .put(app.api.franqueado.salvar)
        .get(app.api.franqueado.consultarId)
        .delete(app.api.franqueado.excluir)         

    // TRANSPORTADORAS
    app.route('/transportadoras')
        .post(app.api.transportadoras.salvar)
        .get(app.api.transportadoras.consultar)

    app.route('/transportadorasAtivo/:id_transportadora')
        .get(app.api.transportadoras.consultarAtivo)

    app.route('/transportadoras/:id_transportadora')
        .put(app.api.transportadoras.salvar)
        .get(app.api.transportadoras.consultarId)
        .delete(app.api.transportadoras.excluir)         

    // POSTOS
    app.route('/postos')
        .post(app.api.postos.salvar)
        .get(app.api.postos.consultar)

    app.route('/postosAtivo/:id_posto')
        .get(app.api.postos.consultarAtivo)

    app.route('/postos/:id_posto')
        .put(app.api.postos.salvar)
        .get(app.api.postos.consultarId)
        .delete(app.api.postos.excluir)  

    // PRODUTOS
    app.route('/produtos')
        .post(app.api.produtos.salvar)
        .get(app.api.produtos.consultar)

    app.route('/produtosAtivo/:id_produto')
        .get(app.api.produtos.consultarAtivo)

    app.route('/produtosSku/:sku')
        .get(app.api.produtos.consultarSku)        

    app.route('/produtos/:id_produto')
        .put(app.api.produtos.salvar)
        .get(app.api.produtos.consultarId)
        .delete(app.api.produtos.excluir)  

    // PRODUTOS EAN
    app.route('/produtosean')
        .post(app.api.produtosEan.salvar)
        .get(app.api.produtosEan.consultar)

    app.route('/produtoseanAtivo/:id_produto_ean')
        .get(app.api.produtosEan.consultarAtivo)

    app.route('/produtosean/:id_produto_ean')
        .put(app.api.produtosEan.salvar)
        .get(app.api.produtosEan.consultarId)
        .delete(app.api.produtosEan.excluir)  

    app.route('/produtoseanProduto/:id_produto')
    .get(app.api.produtosEan.consultarIdProduto)


    // PICKING PRODUTO
    app.route('/pickingproduto')
        .post(app.api.pickingProduto.salvar)
        .get(app.api.pickingProduto.consultar)

    app.route('/pickingproduto/:id_picking_produto')
        .put(app.api.pickingProduto.salvar)
        .get(app.api.pickingProduto.consultarId)
        .delete(app.api.pickingProduto.excluir)  

    app.route('/pickingprodutoPicking/:id_picking')
    .get(app.api.pickingProduto.consultarIdPicking)

    app.route('/pickingprodutoProduto/:id_produto')
    .get(app.api.pickingProduto.consultarIdProdutoPicking)
   

    // MAPA SORTER
    app.route('/mapaSorter')
        .post(app.api.mapaSorter.salvar)
        .get(app.api.mapaSorter.consultar)
    
    app.route('/mapaSorterAtivo/:id_mapa_sorter')
        .get(app.api.mapaSorter.consultarAtivo)

    app.route('/mapaSorter/:id_mapa_sorter')
        .put(app.api.mapaSorter.salvar)
        .get(app.api.mapaSorter.consultarId)
        .delete(app.api.mapaSorter.excluir)

    // MAPA PTL
    app.route('/mapaPtl')
        .post(app.api.mapaPtl.salvar)
        .get(app.api.mapaPtl.consultar)
    
    app.route('/mapaPtlAtivo/:id_mapa_ptl')
        .get(app.api.mapaPtl.consultarAtivo)

    app.route('/mapaPtl/:id_mapa_ptl')
        .put(app.api.mapaPtl.salvar)
        .get(app.api.mapaPtl.consultarId)
        .delete(app.api.mapaPtl.excluir)

    // MAPA PTM
    app.route('/mapaPtm')
        .post(app.api.mapaPtm.salvar)
        .get(app.api.mapaPtm.consultar)
    
    app.route('/mapaPtmAtivo/:id_mapa_ptm')
        .get(app.api.mapaPtm.consultarAtivo)

    app.route('/mapaPtm/:id_mapa_ptm')
        .put(app.api.mapaPtm.salvar)
        .get(app.api.mapaPtm.consultarId)
        .delete(app.api.mapaPtm.excluir)

    // ROTA
    app.route('/rota')
        .post(app.api.rota.salvar)
        .get(app.api.rota.consultar)

    app.route('/rotaAtivaSorter/:id_mapa_sorter')
        .get(app.api.rota.consultarAtivoSorter)
    
    app.route('/rotaAtivaPtl/:id_mapa_ptl')
        .get(app.api.rota.consultarAtivoPtl)

    app.route('/rotaAtivaPtm/:id_mapa_ptm')
        .get(app.api.rota.consultarAtivoPtm)

    app.route('/rota/:id_rota')
        .put(app.api.rota.salvar)
        .get(app.api.rota.consultarId)
        .delete(app.api.rota.excluir)

    // ROTA X SORTER
    app.route('/rotaSorter')
        .post(app.api.rotaSorter.salvar)
        .get(app.api.rotaSorter.consultar)

    app.route('/rotaSorter/:id_rota_sorter')
        .put(app.api.rotaSorter.salvar)
        .get(app.api.rotaSorter.consultarId)
        .delete(app.api.rotaSorter.excluir)

    // SORTER
    app.route('/sorter')
        .post(app.api.sorter.salvar)
        .get(app.api.sorter.consultar)

    app.route('/sortercbx')
        .get(app.api.sorter.consultarCbx)

    app.route('/sorterCadastro/:id_mapa_sorter&:id_rampa')
        .get(app.api.sorter.consultarIdCad)

    app.route('/sorter/:id_sorter')
        .put(app.api.sorter.salvar)
        .get(app.api.sorter.consultarId)
        .delete(app.api.sorter.excluir)

    // ROTA X PTL
    app.route('/rotaPtl')
        .post(app.api.rotaPtl.salvar)
        .get(app.api.rotaPtl.consultar)

    app.route('/rotaPtl/:id_rota_ptl')
        .put(app.api.rotaPtl.salvar)
        .get(app.api.rotaPtl.consultarId)
        .delete(app.api.rotaPtl.excluir)

    // ROTA X PTL
    app.route('/rotaPtm')
        .post(app.api.rotaPtm.salvar)
        .get(app.api.rotaPtm.consultar)

    app.route('/rotaPtm/:id_rota_ptm')
        .put(app.api.rotaPtm.salvar)
        .get(app.api.rotaPtm.consultarId)
        .delete(app.api.rotaPtm.excluir)

    // PTL
    app.route('/ptl')
        .post(app.api.ptl.salvar)
        .get(app.api.ptl.consultar)

    app.route('/ptlcbx')
        .get(app.api.ptl.consultarCbx)

    app.route('/ptlCadastro/:id_mapa_ptl&:id_picking')
        .get(app.api.ptl.consultarIdCad)

    app.route('/ptl/:id_ptl')
        .put(app.api.ptl.salvar)
        .get(app.api.ptl.consultarId)
        .delete(app.api.ptl.excluir)

    // PTM
    app.route('/ptm')
        .post(app.api.ptm.salvar)
        .get(app.api.ptm.consultar)

    app.route('/ptmcbx')
        .get(app.api.ptm.consultarCbx)

    app.route('/ptmCadastro/:id_mapa_ptm&:id_endereco_ptm')
        .get(app.api.ptm.consultarIdCad)

    app.route('/ptm/:id_ptm')
        .put(app.api.ptm.salvar)
        .get(app.api.ptm.consultarId)
        .delete(app.api.ptm.excluir)

    // RAMPA
    app.route('/rampa')
        .post(app.api.rampa.salvar)
        .get(app.api.rampa.consultar)
    
    app.route('/rampaAtivaSorter/:id_rampa&:id_mapa_sorter')
        .get(app.api.rampa.consultarAtivo)

    app.route('/rampa/:id_rampa')
        .put(app.api.rampa.salvar)
        .get(app.api.rampa.consultarId)
        .delete(app.api.rampa.excluir)
    
    // RAMPA X COLETOR
    app.route('/rampaColetor')
        .post(app.api.rampaColetor.salvar)
        .get(app.api.rampaColetor.consultar)

    app.route('/rampaColetor/:id_rampa_coletor')
        .put(app.api.rampaColetor.salvar)
        .get(app.api.rampaColetor.consultarId)
        .delete(app.api.rampaColetor.excluir)

    // COLETOR
    app.route('/coletor')
        .post(app.api.coletor.salvar)
        .get(app.api.coletor.consultar)
    
    app.route('/coletorAtivo')
        .get(app.api.coletor.consultarAtivo)

    app.route('/coletor/:id_coletor')
        .put(app.api.coletor.salvar)
        .get(app.api.coletor.consultarId)
        .delete(app.api.coletor.excluir)

    // PICKING
    app.route('/picking')
        .post(app.api.picking.salvar)
        .get(app.api.picking.consultar)

    app.route('/pickingAtivoPtl/:id_picking&:id_mapa_ptl')
        .get(app.api.picking.consultarAtivo)

    app.route('/picking/:id_picking')
        .put(app.api.picking.salvar)
        .get(app.api.picking.consultarId)
        .delete(app.api.picking.excluir)

    // ENDERECO PTM
    app.route('/enderecoptm')
        .post(app.api.enderecoPtm.salvar)
        .get(app.api.enderecoPtm.consultar)

    app.route('/enderecoptmAtivoPtm/:id_endereco_ptm&:id_mapa_ptm')
        .get(app.api.enderecoPtm.consultarAtivo)

    app.route('/enderecoptm/:id_endereco_ptm')
        .put(app.api.enderecoPtm.salvar)
        .get(app.api.enderecoPtm.consultarId)
        .delete(app.api.enderecoPtm.excluir)

    // ONDA
    app.route('/onda')
        .get(app.api.onda.consultar)

    app.route('/ondacount')
        .get(app.api.onda.contar)

    app.route('/ondaAtiva/')
        .get(app.api.onda.consultarAtivo)

    app.route('/onda/:id_pedidos_log&:id_usuario')
        .put(app.api.onda.salvar)
        .get(app.api.onda.consultarId)
        .delete(app.api.onda.excluir)

    // REPROCESSAR ONDA
    app.route('/reprocessaonda')
        .get(app.api.reprocessaOnda.consultar)

    app.route('/reprocessaondaAtiva/')
        .get(app.api.reprocessaOnda.consultarAtivo)

    app.route('/reprocessaonda/:onda&:id_usuario')
        .put(app.api.reprocessaOnda.salvar)
        .get(app.api.reprocessaOnda.consultar)

    app.route('/opPTM/:etiqueta&:pallet&:tipo&:caixa&:usuario')
        .get(app.api.opPTM.salvar)


    // OPERAÇÃO MAPA SORTER
    app.route('/opMapaSorter')
        .get(app.api.operacaoSorter.consultar)

    app.route('/opMapaSortercount')
        .get(app.api.operacaoSorter.contar)

    app.route('/opMapaSorterAtivo/')
        .get(app.api.operacaoSorter.consultarAtivo)

    app.route('/opMapaSorter/:id_mapa_sorter')
        .put(app.api.operacaoSorter.salvar)
        .get(app.api.operacaoSorter.consultarId)
        .delete(app.api.operacaoSorter.excluir)

    // OPERAÇÃO MAPA PTL
    app.route('/opMapaPtl')
        .get(app.api.operacaoPtl.consultar)

    app.route('/opMapaPtlcount')
        .get(app.api.operacaoPtl.contar)

    app.route('/opMapaPtlAtivo/')
        .get(app.api.operacaoPtl.consultarAtivo)

    app.route('/opMapaPtl/:id_mapa_ptl')
        .put(app.api.operacaoPtl.salvar)
        .get(app.api.operacaoPtl.consultarId)
        .delete(app.api.operacaoPtl.excluir)

    // OPERAÇÃO MAPA PTL
    app.route('/opMapaPtm')
        .get(app.api.operacaoPtm.consultar)

    app.route('/opMapaPtmcount')
        .get(app.api.operacaoPtm.contar)

    app.route('/opMapaPtmAtivo/')
        .get(app.api.operacaoPtm.consultarAtivo)

    app.route('/opMapaPtm/:id_mapa_ptm')
        .put(app.api.operacaoPtm.salvar)
        .get(app.api.operacaoPtm.consultarId)
        .delete(app.api.operacaoPtm.excluir)

    // OPERAÇÃO REVISA PALLET
    app.route('/opPalletcbx')
        .get(app.api.operacaoPallet.consultarCbx)

    app.route('/opPalletReabre/:id_pallet')
        .put(app.api.operacaoPallet.salvar)

//    app.route('/opPallet/:onda')
    app.route('/opPallet/:data_inicial&:data_final')
        .get(app.api.operacaoPallet.consultarOnda)

    app.route('/opPalletItens/:id_pallet')
        .get(app.api.operacaoPallet.consultarItens)
    
    app.route('/opDeleteItens/:id_pallet_itens')
        .delete(app.api.operacaoPallet.excluir)

    // OPERAÇÃO REJEITADOS
    app.route('/opRejeitados/:etiqueta')
        .get(app.api.operacaoRejeitados.consultarId)

    app.route('/opRejeitadosFaltaConferencia/:etiqueta')
        .get(app.api.operacaoRejeitados.consultarFaltaConferencia)

    // ORDER START
    app.route('/opOrderStart/:id_orderstart')
        .get(app.api.operacaoOrderStart.consultarPedidosDisponiveis)

    app.route('/opOrderStartCaixa/:id_pedido_volume&:numero_caixa')
        .get(app.api.operacaoOrderStart.salvar)

    app.route('/opOrderStartCaixaProcessarPedidos')
        .get(app.api.operacaoOrderStart.processarpedidos)

    
    // CONFERENCIA
    app.route('/opConferencia/:numero_caixa')
        .get(app.api.operacaoConferencia.consultarPedidosConferencia)
    app.route('/opConferenciaQtde/:numero_caixa')
        .get(app.api.operacaoConferencia.pedidoconferidoqtde)
    app.route('/opConferenciaSalvar/:sku&:numero_caixa&:id_usuario')
        .get(app.api.operacaoConferencia.salvar)
    app.route('/opConferenciaFinalizar/:id_usuario&:numero_caixa')
        .get(app.api.operacaoConferencia.finalizar)
    app.route('/opConferenciaReiniciar/:numero_caixa')
        .get(app.api.operacaoConferencia.reiniciar)

    //TESTE
    app.route('/opExcecao/:etiqueta&:peso&:largura&:altura&:comprimento')
    .get(app.api.opExcecao.salvar)

    // GATEWAY
    app.route('/gateway')
        .post(app.api.gateway.salvar)
        .get(app.api.gateway.consultar)
    
    app.route('/gatewayAtivo/:id_gateway')
        .get(app.api.gateway.consultarAtivo)

    app.route('/gateway/:id_gateway')
        .put(app.api.gateway.salvar)
        .get(app.api.gateway.consultarId)
        .delete(app.api.gateway.excluir)


    // TIPO PRODUTO
    app.route('/tipoproduto')
        .post(app.api.tipoproduto.salvar)
        .get(app.api.tipoproduto.consultar)

    app.route('/tipoprodutoAtiva/:id_tipo_produto')
        .get(app.api.tipoproduto.consultarAtivo)

    app.route('/tipoproduto/:id_tipo_produto')
        .put(app.api.tipoproduto.salvar)
        .get(app.api.tipoproduto.consultarId)
        .delete(app.api.tipoproduto.excluir)

    // LIMPAR POSTOS
 //   app.route('/opPalletReabre/:id_pallet')
  //      .put(app.api.operacaoPallet.salvar)

    app.route('/limparpostos/')
        .get(app.api.limparPostos.consultarPostos)

    app.route('/limpartodospostos/')
        .get(app.api.limparPostos.limparTodosPostos)

    app.route('/limparpostosItens/:id_posto')
        .get(app.api.limparPostos.consultarItensPostos)

    app.route('/limparposto/:id_posto')
        .put(app.api.limparPostos.limparPosto)

 //   app.route('/opDeleteItens/:id_pallet_itens')
   //     .delete(app.api.operacaoPallet.excluir)

    // IMPORTAÇÃO DE PRODUTOS
    app.route('/importaprodutos')
        .post(app.api.importaProdutos.importar)

    app.route('/importaprodutos/template')
        .get(app.api.importaProdutos.downloadTemplate)

    // REIMPRESSÃO DE ETIQUETAS
    app.route('/reimprimir/:data_inicial&:data_final')
        .get(app.api.reimprimirEtiqueta.consultarPorPeriodo)

    app.route('/reimprimir/:idlog')
        .post(app.api.reimprimirEtiqueta.reimprimir)

    // RELATÓRIO DE OCIOSIDADE
    app.route('/relociosidade/:data_inicial&:data_final')
        .get(app.api.relOciosidade.consultarPorPeriodo)

    app.route('/relociosidade/dia/:data')
        .get(app.api.relOciosidade.consultarPorDia)

    // RELATÓRIO DE RAMPA CHEIA
    app.route('/relrampacheia/:data_inicial&:data_final')
        .get(app.api.relRampaCheia.consultarData)

    app.route('/relrampacheia/:data_inicial&:data_final&:rampa')
        .get(app.api.relRampaCheia.consultarDetalhes)


}
