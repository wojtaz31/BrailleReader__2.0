from machine import Pin
import time
from sr74hc595_bitbang import SR74HC595_BITBANG
from letter_codes import letterCodes, prepareValue
    
ser = Pin(16, Pin.OUT)
rclk = Pin(17, Pin.OUT)
srclk = Pin(18, Pin.OUT)

# construct without optional pins
sr = SR74HC595_BITBANG(ser, srclk, rclk)

def sr74hc595_write(data, n):
    sr.bits(0, n*8)
    
def writeWord(word):
    for l in reversed(word):
        print(l)
        if(l == '' or l==' '):
            bytecode = 0
        else:
            bytecode = prepareValue(letterCodes[ord(l)-ord('a')])
        sr.bits(bytecode, 8)
    sr.latch()