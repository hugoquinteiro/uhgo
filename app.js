const express = require('express')
const session = require('express-session')
const app = express()
//const path = require('path')
const select = require('./pgsql/select')
const insert = require('./pgsql/insert2')
const bodyParser = require('body-parser')
//const { now } = require('jquery')
const print = require('./bema/loadPort')
const config = require('./config/config')
const atualizaPreco = require('./api/atualizaPreco')
const consultaEstoque = require('./api/buscaEstoque')
const updateEstoque = require('./pgsql/updateEstoque')
const insUpProduto  = require('./pgsql/insertUpdateProduto')


//config
  //Implementação do session
  app.use(session({secret:'abc@123'}))
  //Carregando bodyParser
  app.use(bodyParser.urlencoded({extended:true}))
  app.use(bodyParser.json())  


	//template Engine
	// app.engine('handlebars',handlebars({defaultLayout:'main'}))
	// app.set('view engine', 'handlebars')
  app.set('view engine','ejs');
  app.use(express.static('public'));


  // //public
  // app.use(express.static(path.join(__dirname, "public")))

  //Rotina de Atualização do Saldo de Estoque
  setInterval(function consultaestoque(){
    let data = new Date();
    console.log('Atualização de Estoque: '+ data)
    //console.log(typeof consultaEstoque)
    consultaEstoque().then(dados=> {
      
      updateEstoque(dados).then(retorno => {
        retorno.forEach(est =>{console.log('Item: ', est[0], 'Estoque: ', est[1])})
      } )

    })
   

  }, 1000 * 60 * config.timeUpdateEstoque)

  // //Teste para ver tudo que tem na Session
  // setInterval( () =>{
  //   console.log('Session:', session.Session, session)
  // }, 1000 * 4)


app.post('/', function(req, res){
  req.session.login = (req.body.usuario).toUpperCase()
 
  if(req.session.login){
    console.log('usu: ',req.session.login )

      res.render('index', {usuario:req.session.login, logout:true, pedidos:[]})

  }
})



app.get('/', function(req, res){
  if(req.session.login){
    let pedidos = []
    const query = `SELECT * FROM pedido WHERE usuario='${req.session.login}' ORDER BY dtcria DESC LIMIT 5`
    select(query)
    .then(ret =>{
      ret.forEach(function(valor){
      pedidos.push(valor)
      })
//      console.log(pedidos)
      res.render('index', {usuario:req.session.login, logout:true, pedidos:pedidos})
    })
    
  } else {
    res.render('index', {usuario:'** SEM USUÁRIO **', logout:false})
  }
})



var tempPed = 0
app.get('/pedido', function(req, res){
  tempPed++
  console.log('carregar pedido', tempPed)
  if(req.session.login){

   const query = `SELECT codprod, descrprod, marca.marcapublico, produto.marca, referencia, vlrvenda, marca.color, marca.textcolor, estoque 
                FROM produto LEFT JOIN marca ON (produto.marca = marca.marca) 
                ORDER BY marca.ordem, descrprod`
   select(query).then(produtos => {

    var total = []
    //console.log(produtos)
    produtos.forEach(function (valor, indice){
      valor.vlrvenda2 = parseFloat(valor.vlrvenda).toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})
      total.push(valor)
    })

//    console.log(config)
    res.render('pedido', {total: total, usuario:req.session.login, config:config})
  })
    //console.log(listaProd) //teste
}else{
  res.render('index', {usuario:'SEM USUÁRIO!!', logout:false})
  console.log('SEM USUÁRIO')
}  
})

//Recebe Pedido
app.post('/gravar', (req, res) => {
  //console.log(req.body) //req.body é i array de retorno do pedido
  var pedido = req.body
  var totalItens = 0
  var vlrDescto = 0
  pedido.forEach(valor => {
    totalItens += parseFloat(valor[2])
    vlrDescto = parseFloat(valor[4].trim())
  })
  //console.log('Desc: ', vlrDescto)
  totalItens = totalItens.toFixed(2)
let dtcria = new Date()
  var cab = {}

  cab = {usuario:req.session.login, dtcria:dtcria,total:totalItens, desc:vlrDescto}
  //console.log(cab, pedido)
  insert(cab, pedido).then(retorno =>{
    //console.log('retorno',retorno)
    res.send(retorno[0])
  } )
    
  //console.log('impressão:', config.imprimecupom)
  //Preparando dados para impressão
  if (config.imprimecupom) {
    //console.log('impressão ativa:', config.imprimecupom)
    var dados = {}
    dados.dados = req.body
    //console.log('OBJETO:',dados, totalItens, req.session.login )
    //print(dados , totalItens, req.session.login)  
    //print.write("Imprime  Pedido\x0A")
    const init = "\x1B\x40"//Initialize
    const line = "\x0A" //Espaço grande após comando
    const ean13b =  "\x1D\x6B\x43\x0C" //Funcionando****
    const condens = "\x1B\x0F" //Enable condensed mode
    const cut = "\x1b\x77" //cut
    const height = "\x1d\x688" //height
  
    var ean
    var totalLiq
    totalLiq = totalItens - vlrDescto
    var command ='Vendedor:'+req.session.login+'   T O T A L: R$ '+totalLiq.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})+line
    if(vlrDescto>0){
      command += `Itens: ${totalItens}, com desconto de (${((vlrDescto/totalItens)*100).toFixed(2)}%)  R$ ${vlrDescto}${line}${line}`
    } else {
      command += line
    }
   
    dados.dados.forEach(e => {
      ean = e[3].substr(0, 12)
      command +=condens+e[1]+line+'  R$ '+e[2]+line+height+ean13b+ean+line
    });
    print.write(init+command+cut)
  }

  
})

app.get('/atualizaPreco', function(req, res){
  if(req.session.login){

    atualizaPreco()
      .then(async function (response) {
        //console.log(response.data.responseBody.rows);
        console.log('Busca Atualização')
        //console.log('API', response)
        insUpProduto(response).then(resp => {
          console.log('Atualizados', resp)
          res.render('atualizaPreco', {usuario:req.session.login, logout:true, config:config, itens: resp})
        });
      })
      .catch(function (error) {
        console.log(error);
      });

  } else {
    res.render('index', {usuario:'** SEM USUÁRIO **', logout:false})
  }
})

app.get('/params', (req, res) =>{
  if(req.session.login){
    res.render('params', {usuario:req.session.login, config:config, logout:true})
  }
})



app.get('/logout', function(req, res){
  req.session.login = null
  res.render('index', {usuario:'** SEM USUÁRIO **', logout:false})
})

app.listen(config.portahttd, ()=>{
	console.log("Servidor rodando em "+ config.portahttd)
})