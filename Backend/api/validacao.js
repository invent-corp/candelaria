const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    function existeOuErro(valor, msg) {
        if(!valor) throw msg
        if(Array.isArray(valor) && valor.length === 0) throw msg
        if(typeof valor === 'string' && !valor.trim()) throw msg
    }
    
    function naoExisteOuErro(valor, msg) {
        try {
            existeOuErro(valor, msg)
        }
        catch(msg) {
            return
        }
        throw msg
    }
    
    function igualOuErro(valorA, valorB, msg) {
        if(valorA !== valorB) throw msg
    }

    function validaLogin(valor, msg) {
		var Soma
		var Resto
		Soma = 0
		if (valor == "0") throw msg

 		for (i = 1; i <= 9; i++) Soma = Soma + parseInt(valor.substring(i - 1, i)) * (11 - i)
		Resto = (Soma * 10) % 11

		if ((Resto == 10) || (Resto == 11)) Resto = 0
		if (Resto != parseInt(valor.substring(9, 10))) throw msg

	 	Soma = 0
		for (i = 1; i <= 10; i++) Soma = Soma + parseInt(valor.substring(i - 1, i)) * (12 - i);
		Resto = (Soma * 10) % 11;

		if ((Resto == 10) || (Resto == 11)) Resto = 0
		if (Resto != parseInt(valor.substring(10, 11))) throw msg

	}

    function validaEmail(valor, msg) {
        var re = /\S+@\S+\.\S+/
        if(re.test(valor) == false) throw msg   
    }
    
    return { existeOuErro, naoExisteOuErro, igualOuErro, validaLogin, validaEmail }
}