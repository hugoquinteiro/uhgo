const serialport = require('serialport')
    //Params
    const skip = "\x1b\x66\x31" //Espaço grande após comando
    const line = "\x0A" //Espaço grande após comando
    const reset = "\x1d\xF8\x46"
    const init = "\x1B\x40"//Initialize
    const cut = "\x1b\x77" //cut
    const cut50 = "\x1B\x6D" //Perform partial paper cut
    const esc = "\x1B"
    const limpabuffer = "\x02\x03"
    const italic = "\x1B\x34"
    const tabspace = "\x09" //Horizontal tab
    const lfmargin = "\x1B\x6C100" //Set left margin
    const rgmargin = "\x1B\x512" //Set right margin
    const condens = "\x1B\x0F" //Enable condensed mode
    const widthpaper = "\x1D\xF906h" //Set and save paper width.

    //BarCodeconst
    const height = "\x1d\x688" //height
    const width = "\x1D\x772"   //width
    const pos = "\x1d\x482"   // Choose the position of human readable information (HRI) in the barcode
                                    /* n = 0 means no HRI.
                                        n = 1 means HRI on top of barcode.
                                        n = 2 means HRI on bottom of barcode.
                                        n = 3 means HRI on both top and bottom of barcode.
                                    */
    const font = "\x1D\x661"  //Set the font to be used for human readable information (HRI)
    const margin = "\x1D\x6B\x84" //Program barcode left margin
    let ean13a = "\x1D\x6B\x02789865769065\x00"  // Print an EAN-13 barcode  Printer generates the 13th 
    let ean13b  = "\x1D\x6B\x43\x0C" //Funcionando****
     
 

var print = function imp(obj, total, usuario) {
    
    const port = new serialport('COM3')
    console.log('Impressão na COM3')
    
        var ean
        var cabecalho
        var preco
        var command ='Vendedor:'+usuario+'   T O T A L: R$ '+total+line+line

        cabecalho = 
         obj.dados.forEach(e => {
            ean = e[4].substr(0, 12)
            command +=condens+e[1]+line+'  R$ '+e[2]+line+height+ean13b+ean+line
        });
            
    
    port.on('open', (err) => {
    
        if (err) console.log(err)
      
       
        port.write(init)
//        port.write(cabecalho)
        port.write(cabecalho+command+cut)
    })
    
    port.on('error', (err) => console.log(err))
    
    port.on('close', (err) => console.log(err))

    
}

module.exports = print

