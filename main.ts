//% color=190 weight=100 icon="\uf205" block="SU02"
namespace SU02 {
    let SU02_I2C_ADDR = 0x55
    let ADC_REG_CONF = 0x02
    let ADC_CONF_CYC_TIME_256 = 0x80
    let ADC_REG_RESULT = 0x00
    let HIGH_STATE = 1.0
    let LOW_STATE = 0.5
    let state: boolean

    function setreg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(SU02_I2C_ADDR, buf);
    }

    function getreg(reg: number): number {
        pins.i2cWriteNumber(SU02_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(SU02_I2C_ADDR, NumberFormat.UInt8BE);
    }

    function getUInt16BE(reg: number): number {
        pins.i2cWriteNumber(SU02_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(SU02_I2C_ADDR, NumberFormat.UInt16BE);
    }


    setreg(ADC_REG_CONF, ADC_CONF_CYC_TIME_256);
    let conf: NumberFormat.Int8LE = getreg(ADC_REG_CONF);

    function readVoltage() {
        let a: NumberFormat.UInt8LE
        let b: NumberFormat.UInt8LE
        let data: NumberFormat.UInt16LE
        let voltage: number

        data = getUInt16BE(ADC_REG_RESULT);

        a = ((data & 0xFF00) >> 8);
        b = ((data & 0x00FF) >> 0);

        console.logValue("a", a)
        console.logValue("b", b)

        voltage = (((((a & 0x0F) * 256) + (b & 0xF0)) / 0x10) * (3.3 / 256));

        if (voltage > HIGH_STATE) {
            state = true;
        } else if (voltage < LOW_STATE) {
            state = false;
        }
    }

    //% blockId="getState"
    //% block="SU02 get state"
    export function getState(): boolean {
        readVoltage()
        return state
    }

}
