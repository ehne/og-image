const query = require('micro-query');
const sharp = require('sharp');
const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync(__dirname +"/fonts/bold.otf");


 console.log("loaded")

module.exports = async (req, res) => {
    console.log("inside the export")
    const text = query(req).text;
    res.setHeader('Content-Type', 'image/png')
    let padder 
    console.log("set headers")

    // themes
    const themes = {
      darcylf: {
        textColor: '#ffc53f',
        bgColor: '#000',
        imgUrl: __dirname + '/on-dark-hover.svg',
        paddingX: 0,
        paddingY: 140
      },
      cf: {
        textColor: '#000',
        bgColor: '#fff',
        imgUrl:  __dirname +  '/cf.svg',
        paddingX: 70,
        paddingY: 70
      }
    }
    const selectedTheme = themes[query(req).theme] || themes["darcylf"];
    console.log(selectedTheme);
    const attributes = {fill: selectedTheme.textColor};
    const options = {x: 0, y: 0, fontSize: 140, anchor: 'top', attributes: attributes};

    const svg = textToSVG.getSVG(text||"", options);
    console.log("generated text svg", __dirname)
    
    const card = await sharp({
        create: {
          width: 2048-selectedTheme.paddingX,
          height: 1100-selectedTheme.paddingY,
          channels: 4,
          background: selectedTheme.bgColor
        }
      })
      .composite([{ input: selectedTheme.imgUrl, gravity:'southeast'},{input: Buffer.from(svg)}])
      .png()
      .toBuffer()
    
    const inputUse = text!=null? card :  selectedTheme.imgUrl;
    const imgGrav = "center"
      padder = await sharp({
        create: {
            width: 2048,
            height: 1100,
            channels: 4,
            background: selectedTheme.bgColor
        }
    })   
    .composite([{input: inputUse,gravity:imgGrav}])
    .png()
    .toBuffer()    
    
    res.end(padder)

}