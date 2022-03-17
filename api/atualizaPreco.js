var axios = require('axios');
var login = require('./loginapi')

var precos =  async function(){
   return login().then( async (res) => {
    var jsId = await res
    //console.log('ID:', jsId)
  var data ={serviceName: "DbExplorerSP.executeQuery", 
            requestBody: {sql: `SELECT exc.codprod, pro.descrprod, pro.marca, pro.referencia, bar.codbarra, exc.vlrvenda 
                                FROM tgfexc exc
                                INNER JOIN tgfpro pro ON (exc.codprod = pro.codprod)
                                LEFT JOIN tgfbar bar ON (bar.codprod = pro.codprod)
                                WHERE nutab=440 AND vlrvenda IS NOT NULL
                                ORDER BY 1
                                `
      }
  }//AND exc.codprod IN (7,8,10,11, 30,31,32,148,1021)

  var config = {
    method: 'get',
    url: 'http://192.168.1.56:8280/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&application=DbExplorer&outputType=json',
    headers: { 
      'Content-Type': 'application/json', 
      'Cookie': `JSESSIONID=${jsId}`
    },
    data : data
  }


return axios(config)
.then(async function (response) {
  //console.log(response.data.responseBody.rows);
  return  response.data.responseBody.rows
})
.catch(function (error) {
  console.log(error);
});


   //return await config

})

}

  
module.exports =  precos