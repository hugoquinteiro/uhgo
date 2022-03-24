const tbodyItens = document.getElementById('tbodyItens')
var totalPed = document.getElementsByClassName("totalPed")
var vlrDescto = document.getElementById('vlrDescto')
var totalLiq = document.getElementById('totalLiq')
var inclui = document.getElementsByTagName('button')


//Inclui item no pedido
var pedido = []
//var totalped = 0
for( var i=0; i<inclui.length; i++){
  inclui[i].addEventListener('click', function(){
    let key = this.getAttribute('key')
    //console.log(key)
    var item = []
    item =  key.split(',')  //JSON.parse

    pedido.push(item)
    
    //Carregando a tabela
    let tbody = document.getElementById('tbodyItens')
    let tr = tbody.insertRow()

    let td_codprod = tr.insertCell()
    let td_descrprod = tr.insertCell()
    let td_valor = tr.insertCell()
    let td_delete = tr.insertCell()

    td_codprod.innerText = item[0]
    td_descrprod.innerText = item[1]
    td_valor.innerText = item[2]
    td_delete.innerHTML = `<button class="btnDelete btn btn-danger" id="btnDelete">X</button>`
    td_delete.setAttribute('value', item[3] )

    //Gravando no LocalStorage
/*  Desativada essa opção no momento  
    var i
    if(!localStorage.getItem('item1')){
      i=1
      localStorage.setItem('item'+i,key)
    } else {
      i = localStorage.length + 1;
      console.log('i',i)
      localStorage.setItem('item'+i,key)
    }
  */  


    //Alert de gravação do Item
    //console.log('Item Salvo')
    var toastLiveExample = document.getElementById('liveToast')
    var toast = new bootstrap.Toast(toastLiveExample)
    toast.show()

    updateTotal()
  })

}

//Deletar itens do Pedido
const tableEl = document.querySelector('table')

//console.log(tableEl)

function deleteItem(e) {
  if(!e.target.classList.contains("btnDelete")) {
    return;
  }

  const btnDel = e.target
  btnDel.closest('tr').remove()
  updateTotal()
}
tableEl.addEventListener('click', deleteItem)
// FIM --Deletar itens do Pedido

//Atualizando Total
function updateTotal(){
var perDesc = document.getElementById('perDesc')
var  updateTotal = 0
var  updateTotalLiq = 0
const btnPedido = document.getElementById('btnPedido')
//console.log('tabela:', tbodyItens.rows.length)
for (let i =0; i < tbodyItens.rows.length; i++){
  updateTotal += parseFloat(tbodyItens.rows[i].cells[2].innerHTML)
}
  //console.log('Desc %',perDesc.value)
  if(perDesc.value>10){
    perDesc.value = "0"
    alert('Valor de desconto não autorizado', 'danger')
  }

  //Atualizando Desconto
  updateTotalLiq = updateTotal*((100-perDesc.value)/100)
  vlrDescto.innerText = `${(updateTotal - updateTotalLiq).toFixed(2)}`
  totalLiq.innerText = updateTotalLiq.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2}); //toFixed(2)}

  
//console.log('Total:', updateTotal)
let idtotalped = document.getElementById('totalped')
idtotalped.innerText = updateTotal.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2});
totalPed.innerText = updateTotal.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2});

btnPedido.innerHTML =`<i class="fas fa-dollar-sign"></i> ${updateTotal.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})}` 

}

async function Gravar(){
  //console.log(' Botão Gravar!!!')
  //console.log('tamanho tabela',tbodyItens.rows.length)

  if(tbodyItens.rows.length>0){
    var pedidoPost = {}
    pedidoItens = []
    for (let i =0; i < tbodyItens.rows.length; i++){
      let itens = []
      for (let j=0; j<4; j++){
        if (j!=3){
          itens.push(tbodyItens.rows[i].cells[j].innerHTML)
        } else {
          itens.push(tbodyItens.rows[i].cells[j].getAttribute('value'))
        }
      }
      //console.log('Descto', vlrDescto.textContent)
      itens.push(vlrDescto.textContent)
      pedidoItens.push(itens)
    }
    //console.log(pedidoItens)
    pedidoPost = pedidoItens
    
    //Limpado tabela
    tbodyItens.innerHTML=''
    perDesc.value = ""
    updateTotal()
  
    axios.post('gravar', pedidoPost)
    .then(resp => {
      //console.log('post', resp.data)
      //alert('Pedido for gravado: ' + resp.data.id )
      alert('Pedido enviado...', 'success')
      setTimeout( ()=> {
        window.location.href = '/';  
      }, 2000)

    } )
  } else {
    alert('Pedido sem Itens', 'danger')
  }
 
}

function limpaBusca(){
  var busca = document.getElementById("search");
  busca.value = ""
  buscaItem()
}

function buscaItem() {
  var input, filter, table, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.querySelectorAll("#itens");
  //console.log(table.length)
  table.forEach((e, index) => {
    //console.log(index,e.textContent)
    txtValue = e.textContent;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      table[index].style.display = "";
    } else {
      table[index].style.display = "none";
    }
  })
}


//Configuração do Alert
var alertPlaceholder = document.getElementById('alert')

var myModal = new bootstrap.Modal(document.getElementById('alertModal'), {})
var wrapper = document.createElement('div')
function alert(message, type) {
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible text-center" role="alert">' + message + '<button type="button" class="btn-close"  data-bs-dismiss="modal" aria-label="Close"></button></div>'

  alertPlaceholder.append(wrapper)
  myModal.toggle()
}


function atuaDesc(valDesc){
  perDesc.value = valDesc
  updateTotal()
}