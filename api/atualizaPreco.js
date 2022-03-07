var axios = require('axios');
var login = require('./loginapi')

console.log('Inicio...')
var consulta = login().then( async (res) => {
    //console.log(res)
    var jsId = await res
    //console.log('ID:', jsId)




var data ={serviceName: "DbExplorerSP.executeQuery", requestBody: {sql: "SELECT codprod, vlrvenda FROM tgfexc WHERE nutab=440 AND vlrvenda IS NOT NULL"
    }
}

var config = {
  method: 'get',
  url: 'http://192.168.1.56:8280/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&application=DbExplorer&outputType=json',
  headers: { 
    'Content-Type': 'application/json', 
    'Cookie': `JSESSIONID=${jsId}`
  },
  data : data
}

return config
// axios(config)
// .then(function (response) {
//   console.log(response.data.responseBody.rows);
// })
// .catch(function (error) {
//   console.log(error);
// });

})


module.exports =  consulta