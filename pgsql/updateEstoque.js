const db = require('./db2')

var updateEstoque = async function (estoque){
  
 return await estoque.map(async el => {
      //console.log('Cod:', el[0], 'Estoque:', el[1])
      let sql = `UPDATE produto SET estoque=${el[1]} WHERE codprod=${el[0]} AND COALESCE(estoque,0)<>${el[1]};`;
      let ins = await db.query(sql)
      if (ins.rowCount===1)  {
        console.log('item / Quantidade atualizado:', el)
        return el
      }
  })
  //console.log(console.log('retorno: ', retorno.length))
  

}



module.exports = updateEstoque
