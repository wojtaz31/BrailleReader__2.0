letterCodes= [
 0b100000,
0b101000,
0b110000,
0b110100,
0b100100,
0b111000,
0b111100,
0b101100,
0b011000,
0b011100,
0b100010,
0b101010,
0b110010,
0b110110,
0b100110,
0b111010,
0b111110,
0b101110,
0b011010,
0b011110,
0b100011,
0b101011,
0b110011, #v
 0b110011, #x
0b110111, #y
0b100111, #z
0b111111, #
0b001110,
0b000111,
0b000000,
0b000000,
0b000000,
0b000000,
0b000000,
0b000000,
0b000000,
0b000110,
0b000000,
0b001000,
0b000011,
0b000010,
0b000000,
0b100001,
0b110001,
0b100101,
0b101001,
0b110101,
0b010011,
0b011001,
0b011011,
0b111011 
 
]

def bit_set_to(number, n, x):
    return (number & ~(1 << n)) | (x << n);


def bit_check(number, n):
    return (number >> n) & 1


def prepareValue(value):
  for i in range(3):
    b1 = bit_check(value, i);
    b2 = bit_check(value, 5-i);

    value = bit_set_to(value, i, b2);
    value = bit_set_to(value, 5-i, b1);
    

  for i in range(0,6,2):
    b1 = bit_check(value, i);
    b2 = bit_check(value, i+1);

    value = bit_set_to(value, i, b2);
    value = bit_set_to(value, i+1, b1);

  value = value << 1
  return value