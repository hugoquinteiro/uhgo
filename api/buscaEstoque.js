var axios = require('axios');
var login = require('./loginapi')
const server = require('./server')

const url = `http://${server.name}/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&application=DbExplorer&outputType=json`

var consulta = async function(){
    return login().then( async (res) => {
        //console.log(res)
        var jsId = await res

        var data ={serviceName: "DbExplorerSP.executeQuery", 
                requestBody: {sql: `SELECT exc.codprod, (estoque-reservado) as saldo 
                                    FROM tgfexc exc  
                                    INNER JOIN tgfest est ON (est.codprod = exc.codprod AND  exc.nutab=440 )
                                    WHERE est.codemp=11 AND est.codlocal=2 AND est.tipo='P' AND est.codparc=0
                                    ORDER BY 1`
        }
    }
    
    var config = {
      method: 'get',
      url: url,
      headers: { 
        'Content-Type': 'application/json', 
        'Cookie': `JSESSIONID=${jsId}`
      },
      data : data
    }
    
//    return await config
    
  return axios(config)
    .then(async function (response) {
      //console.log(response.data.responseBody.rows);
      return await response.data.responseBody.rows
    })
    .catch(function (error) {
      console.log(error);
    });
    
    })
    
}



module.exports =  consulta