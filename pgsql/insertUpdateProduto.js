const db = require('./db2')
//Insert or UPDATE

var insup = async function insertuPDATE(produto){
    
    //console.log('Teste: ', testa.rows[0].conta, 'SQL:',`SELECT COUNT(codprod) as conta  FROM produto WHERE codprod = ${produto[0]}`)
    arr = []
    console.log('tam:', produto.length)
    for (let i = 0; i < produto.length; i++) {
        //console.log('For:', produto[i])
        let testa = await db.query(`SELECT COUNT(codprod) as conta  FROM produto WHERE codprod = ${produto[i][0]}`);
        //console.log(produto)
        if (testa.rows[0].conta==1){
            sql = `UPDATE produto SET vlrvenda=${produto[i][5]} WHERE codprod=${produto[i][0]} AND vlrvenda<>${produto[i][5]};`      
            ins = await db.query(sql);
            if (ins.rowCount===1) {
                 arr.push({codprod:produto[i][0], descrprod:produto[i][1],marca: produto[i][2], referencia:produto[i][3], vlrvenda:produto[i][5]})
            }
        } else {
            let sql = `INSERT INTO produto (codprod, descrprod, marca, referencia, codbarra, vlrvenda, estoque)
            VALUES (${produto[i][0]},'${produto[i][1]}', '${produto[i][2]}', '${produto[i][3]}', '${produto[i][4]}', ${produto[i][5]}, 0)`;
    
            let ins = await db.query(sql);
            if (ins.rowCount===1){
                arr.push({codprod:produto[i][0], descrprod:produto[i][1],marca: produto[i][2], referencia:produto[i][3], vlrvenda:produto[i][5]})
            }
        }
    
    }
    return arr
  
}


module.exports = insup