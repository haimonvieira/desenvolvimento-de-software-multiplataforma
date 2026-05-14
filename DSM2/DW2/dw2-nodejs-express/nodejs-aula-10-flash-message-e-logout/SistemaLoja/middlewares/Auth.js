function Auth(req, res, next){
    if(req.session.usuario != undefined){
        //Permite o procedimento
        next();
        //Se nao tiver sessao
    }else{
        //Exibe a pagina de login
        res.redirect('/login');
    }
}

export default Auth;