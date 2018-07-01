const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const led = require('tiaoping_led_sign')
const SerialPort = require('serialport');

const devPort = "COM3"
const port = new SerialPort(devPort, {
    autoOpen: false,
    baudRate: 9600
})

port.open(function (err) {
    if (err) {
        console.log('Error opening port: ', err.message)
        return
    }
})

app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))

app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/send', (req, res) => {
    console.log(req.body)
    let txt = req.body.message
    port.drain()
    let data = `${led.start}${led.setTransition(req.body.transition)}${led.setFont("7x6", led.setColor(req.body.color, txt))}${led.end}`
    console.log(data);
    port.write(data)
    res.redirect("/")
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))