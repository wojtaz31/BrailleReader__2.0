import network
import time
import requests
import gc
import sys
import select
import json
import socket
from sr74hc595_main import writeWord

from wifi_setup import setup_ap_sta
from api_client import fetch_photo, fetch_ocr

#insert your wifi credentials
STA_SSID = ""
STA_PASSWORD = ""

#internal driver network credentials
AP_SSID = "ESP_Driver_Network"
AP_PASSWORD = "siec12345"

#insert your (local) addresses
CAMERA_URL = "http://[camera_esp_ip_address]/photo" 
BACKEND_URL = "http://[backend_ip_address]:1234/ocr"

setup_ap_sta(STA_SSID, STA_PASSWORD, AP_SSID, AP_PASSWORD)

server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_sock.bind(('0.0.0.0', 80))
server_sock.listen(5)

print("[OK] Serwer nasłuchuje...")

while True:
    ready_to_read, _, _ = select.select([sys.stdin, server_sock], [], [], 0)
    
    for element in ready_to_read:
        if element is sys.stdin:
            c = sys.stdin.read(1)
            if c == 's':
                gc.collect()
                data_1 = fetch_photo(CAMERA_URL)
                time.sleep(0.5)
                data_2 = fetch_photo(CAMERA_URL)
                print(len(data_1), len(data_2))
                json_string = json.dumps({
                    'buff_1' : data_1,
                    'buff_2' : data_2
                    })
                tekst = fetch_ocr(json_string, BACKEND_URL)
                if tekst is not None:
                    pass
                    #writeword(tekst.strip())
                gc.collect()
                
        elif element is server_sock:
            conn, addr = server_sock.accept()
            try:
                request = conn.recv(1024).decode('utf-8')
                
                if '\r\n\r\n' in request:
                    word = request.split('\r\n\r\n', 1)[1].strip()
                    print(f"-> Przestawiam rejestry na słowo: {word}")
                    #TODO: sterowanie rejestrami
                    
                response = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\":\"ok\"}"
                conn.send(response.encode('utf-8'))
            
            except Exception as e:
                print("Błąd obróbki żądania na ESP:", e)
            finally:
                conn.close()
            
    time.sleep(0.1)