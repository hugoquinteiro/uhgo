const db = require('./db2')


//INSERT

var insere = async function insertCustomer(cab, itens){
  let sql = 'INSERT INTO pedido (usuario, total, dtcria, vlrdesc) VALUES ($1, $2, $3, $4);';
  let values = [cab.usuario,cab.total, cab.dtcria, cab.desc];
  let ins = await db.query(sql, values);

  //console.log(ins.rowCount)
  //Aqui preciso verificar qual foi o ID gerado no pedido para gravar os itens
  if (ins.rowCount===1){
    //console.log(`${cab.dtcria.toISOString()}`) // console.log(yourDate.toISOString())
    const res = await db.query(`SELECT max(id) as id FROM pedido WHERE usuario= '${cab.usuario}'`);
    //console.log(res.rows[0].id)
    if(res.rows[0].id){
     
     sql = 'INSERT INTO itpedido (id, codprod, vlrvenda, codbarra) VALUES ($1, $2, $3, $4);';
     itens.forEach(async element => {
      //console.log(element)  
      values = [res.rows[0].id, element[0], element[3],element[2]]
      ins = await db.query(sql, values, (err, res)=>{
        if(err) {console.log(err)} 
        //client.release()
      });
      });
     
    }

    var newId = res.rows
    //client.release(true) //Aqui ele fecha a conexão pra liberar um novo usuário
  }
  
  return newId
}



module.exports = insere


//busca().then(x => console.log(x))
//Mais simples
//listar().then(x => console.log(x))


/* Deu Certo
	listar().then(x => x.map(a => a.nome))
		.then(nome => console.log(nome))
*/
		
