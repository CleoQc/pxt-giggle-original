
enum gigglebotWhichEye {
    //% block="both eyes"
    Both = 2,
    //% block="left eye"
    Left = 1,
    //% block="right eye"
    Right = 0
}

enum gigglebotEyeAction {
    //% block="open"
    Open,
    //% block="close"
    Close
}

enum gigglebotGigglePixels {
    Right,
    Left,
    SmileOne,
    SmileTwo,
    SmileThree,
    SmileFour,
    SmileFive,
    SmileSix,
    SmileSeven

}


//% weight=99 color=#46BFB1 icon="\uf0d1"
//% groups='["other", "variables"]'
namespace lights {

    let stripNeopixel = neopixel.create(DigitalPin.P8, 9, NeoPixelMode.RGB)
    let eyeNeopixelBoth = stripNeopixel.range(0, 2)
    let eyeNeopixelLeft = stripNeopixel.range(1, 1)
    let eyeNeopixelRight = stripNeopixel.range(0, 1)
    let eyeColorLeft = neopixel.colors(NeoPixelColors.Blue)
    let eyeColorRight = neopixel.colors(NeoPixelColors.Blue)
    let smileNeopixel = stripNeopixel.range(2, 7)
    init_neopixels()

    function init_neopixels() {
        eyeNeopixelBoth.setBrightness(10)
        eyeNeopixelLeft.setBrightness(10)
        eyeNeopixelRight.setBrightness(10)
        smileNeopixel.setBrightness(40)

        for (let _i = 0; _i < gigglebotGigglePixels.SmileSeven; _i++) {
            stripNeopixel.setPixelColor(_i, neopixel.colors(NeoPixelColors.Black))
        }
        stripNeopixel.show()

        if (gigglebot.voltageBattery() < 3400) {
            eyeColorLeft = neopixel.colors(NeoPixelColors.Red)
            eyeColorRight = neopixel.colors(NeoPixelColors.Red)
        }
        eyeNeopixelLeft.setPixelColor(0, eyeColorLeft)
        eyeNeopixelRight.setPixelColor(0, eyeColorRight)
        eyeNeopixelBoth.show()
}
    /**
     * Lets you use the blocks in the neopixel category for better control over the eyes.
     */
    //% blockId="gigglebot_eye" block="%which"
    //% group=variables
    //% weight=50
    export function whichEye(which: gigglebotWhichEye): neopixel.Strip {

        if (which == gigglebotWhichEye.Left)
            return eyeNeopixelLeft
        else if (which == gigglebotWhichEye.Right)
            return eyeNeopixelRight
        else
            return eyeNeopixelBoth
    }

    /**
     * Lets you use the blocks in the neopixel category for better control over the smile/rainbow.
     */
    //% blockId="gigglebot_get_smile" block="smile"
    //% group=variables
    //% weight=50
    export function smile(): neopixel.Strip {
        return smileNeopixel
    }

    //% blockId="gigglebot_smile" block="display a  %smile_color|smile"
    //% weight=100
    export function smileShow(smile_color: NeoPixelColors) {
        smileNeopixel.showColor(neopixel.colors(smile_color))
    }

    /**
     * Will display a rainbow of colors on the smile lights
     */
    //% blockId="gigglebot_rainbow_smile" block="display a rainbow smile"
    //% weight=99
    export function smileRainbow() {
        smileNeopixel.showRainbow(1, 315)
    }

    /**
     * Displays the colors of the rainbow on the lights and cycles through them
     * @param nbcycles how many times the rainbow will do a full cycle; eg: 3, 5, 10
     */
    //% blockId="gigglebot_rainbow_cycle" block="cycle rainbow %nbcycles| times "
    //% weight=98
    export function smileCycleRainbow(nbcycles: number = 3) {
        smileNeopixel.showRainbow(1, 315)
        for (let _i = 0; _i < (nbcycles * 7); _i++) {
            basic.pause(100)
            smileNeopixel.rotate(1)
            smileNeopixel.show()
        }
    }

    /**
     * Displays the colors of the rainbow on the lights and cycles through them based on times
     * @param delay how long to wait(in ms) before cycling; eg: 100, 200
     * @param cycle_length how long (in ms) the cycling will last for: eg: 3000
     */
    //% blockId="gigglebot_rainbow_cycle_time" block="cycle rainbow every %delay| ms for %cycle_length| ms "
    //% weight=97
    export function smileCycleRainbowTime(delay: number = 100, cycle_length: number = 3000) {
        smileNeopixel.showRainbow(1, 315)
        for (let _i = 0; _i < (cycle_length / delay); _i++) {
            basic.pause(delay)
            smileNeopixel.rotate(1)
            smileNeopixel.show()
        }
    }

    /**
     * Use the smile lights to display a line graph of a certain value on a graph of 0 to Max value
     */

    //% blockId="gigglebot_line_graph" block="display graph of %graph_value| with a max of %graph_max"
    //% weight=90
    export function smileShowGraph(graph_value: number, graph_max: number) {
        smileNeopixel.showBarGraph(graph_value, graph_max)
    }
}
//% weight=99 color=#46BFB1 icon="\uf0d1"
namespace remote {
    /**
     */

    /**
     * Use this block to turn a second Micro:bit into a remote controller.
     * Easiest approach is to put this block inside a "Forever" block.
     * You will need to use the "remote receiver mode" block on the GiggleBot itself.
     * @param radioBlock eg: 1
     */
    //% blockId="gigglebot_remote_control"
    //% block="external remote control, group %radio_block"
    //% weight=99
    export function remoteControl(radioBlock: number): void {
        let powerLeft = gigglebot.leftPower()
        let powerRight = gigglebot.rightPower()
        radio.setGroup(radioBlock)
        powerLeft = ((powerLeft * -1 * input.acceleration(Dimension.Y)) / 512) + ((50 * input.acceleration(Dimension.X)) / 512)
        powerRight = ((powerRight * -1 * input.acceleration(Dimension.Y)) / 512) - ((50 * input.acceleration(Dimension.X)) / 512)
        // limit those values from -100 to 100
        powerLeft = Math.min(Math.max(powerLeft, -100), 100)
        powerRight = Math.min(Math.max(powerRight, -100), 100)
        radio.sendValue(powerLeft + "", powerRight)
    }

    const packet = new radio.Packet();

    /**
     * Use this block on the GiggleBot to control it with a second micro:bit
     * @param radioBlock eg:1
     *
     */
    //% mutate=objectdestructuring
    //% mutateText=Packet
    //% mutateDefaults="radio_block"
    //% weight=98
    //% blockId=gigglebot_remote block="on received remote control, group %radio_block"
    export function onRemoteControl(radioBlock: number, cb: (packet: radio.Packet) => void) {
        radio.setGroup(radioBlock)
        radio.onDataReceived(() => {
            radio.receiveNumber();
            packet.receivedNumber = radio.receivedNumber();
            packet.time = radio.receivedTime();
            packet.serial = radio.receivedSerial();
            packet.receivedString = radio.receivedString();
            packet.receivedBuffer = radio.receivedBuffer();
            packet.signal = radio.receivedSignalStrength();
            cb(packet)
        });
    }

    /**
     * @param
     */
    //% blockId="gigglebot_remote_control_action"
    //% block="do remote control action"
    //% weight=97
    export function remoteControlAction(): void {
        gigglebot.setLeftPower(parseInt(packet.receivedString))
        gigglebot.setRightPower(packet.receivedNumber)
        gigglebot.motorPowerAssignBoth(gigglebot.leftPower(), gigglebot.rightPower())
    }

}
