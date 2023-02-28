radio.onReceivedValue(function (name, value) {
    ZeitstempelEmpfangen = input.runningTime()
    if (name == "F") {
        if (value == 1) {
            Fahren = true
        } else {
            Fahren = false
        }
    } else if (name == "G") {
        Geschwindigkeit = value
    } else if (name == "R") {
        Richtung = value
        RichtungMotor = Math.map(Richtung, 0, 100, LenkRegelung * -1, LenkRegelung)
    } else {
    	
    }
})
let MotorB = 0
let MotorA = 0
let LedY = 0
let LedX = 0
let RichtungMotor = 0
let Richtung = 0
let Geschwindigkeit = 0
let Fahren = false
let ZeitstempelEmpfangen = 0
let LenkRegelung = 0
let MinimumMotor = 70
LenkRegelung = 10
let Timeout = 500
radio.setGroup(1)
basic.setLedColor(0x007fff)
serial.redirectToUSB()
basic.forever(function () {
    if (Fahren && input.runningTime() < ZeitstempelEmpfangen + Timeout) {
        basic.setLedColor(0x00ff00)
        led.unplot(LedX, LedY)
        LedX = Math.map(Richtung, 0, 100, 4, 0)
        LedY = Math.map(Geschwindigkeit, 0, 100, 0, 4)
        led.plot(LedX, LedY)
        if (Geschwindigkeit > 0) {
            MotorA = Math.map(Geschwindigkeit, 0, 100, MinimumMotor, 100 - LenkRegelung) + RichtungMotor
            MotorB = Math.map(Geschwindigkeit, 0, 100, MinimumMotor, 100 - LenkRegelung) - RichtungMotor
        } else {
            MotorA = 0
            MotorB = 0
        }
        serial.writeValue("A", MotorA)
        serial.writeValue("B", MotorB)
        motors.dualMotorPower(Motor.A, MotorA)
        motors.dualMotorPower(Motor.B, MotorB)
    } else {
        basic.setLedColor(0x007fff)
        motors.dualMotorPower(Motor.A, 0)
        motors.dualMotorPower(Motor.B, 0)
    }
})
