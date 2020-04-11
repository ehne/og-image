const query = require('micro-query');
const sharp = require('sharp');
const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync(__dirname +"/fonts/bold.otf");


 console.log("loaded")

module.exports = async (req, res) => {
    console.log("inside the export")
    const text = query(req).text
    res.setHeader('Content-Type', 'image/png')
    let padder 
    console.log("set headers")
    const attributes = {fill: '#ffc53f'};
    const options = {x: 0, y: 0, fontSize: 140, anchor: 'top', attributes: attributes};

    const svg = textToSVG.getSVG(text||"", options);
    console.log("generated text svg")
    
    const card = await sharp({
        create: {
          width: 2048,
          height: 1100,
          channels: 4,
          background: "#000"
        }
      })
      .composite([{ input: __dirname +'/on-dark-hover.svg', gravity: 'southeast'},{input:Buffer(svg)}])
      .png()
      .toBuffer()
    
    const inputUse = text!=null? card :  __dirname +'/on-dark-hover.svg'
      padder = await sharp({
        create: {
            width: 2048,
            height: 1170,
            channels: 4,
            background: "#000"
        }
    })   
    .composite([{input: inputUse,top:0,left:0}])
    .png()
    .toBuffer()    
    
    res.end(padder)

}