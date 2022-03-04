const config = require('../config/config')


if(config.imprimecupom){
  const serialport = require('serialport')

  const port = new serialport(config.portacom)
  console.log('Impressão na COM3')
  
  port.on('open', (err) => {
  
      if (err) console.log(err)
    
      
      
       port.write("Inicializou.......\x0A")
     
  
  })
  
  
  port.on('error', (err) => console.log(err))

  module.exports = port

} else {
  module.exports = {}
}

