const db = require('./db2')

var updateEstoque = async function (estoque){
  
  let arr =[]
  for (let i = 0; i < estoque.length; i++) {
    const el = estoque[i];
    //console.log('For', el)
    let sql = `UPDATE produto SET estoque=${el[1]} WHERE codprod=${el[0]} AND COALESCE(estoque,0)<>${el[1]};`;
    let ins = await db.query(sql)
    if (ins.rowCount===1)  {
      arr.push(el)
    }
  }
  //console.log(arr)
  return arr
}



module.exports = updateEstoque

//Teste
// updateEstoque([[7,12],[8,4],[11,52]])
// .then( res => console.log('Teste:', res))

