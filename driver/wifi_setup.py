import network
import time

def setup_ap_sta(sta_ssid, sta_password, ap_ssid, ap_password):
    sta = network.WLAN(network.STA_IF)
    sta.active(True)
    sta.connect(sta_ssid, sta_password)
    
    if sta.isconnected():
        sta.disconnect()
    time.sleep(0.5)
    
    while not sta.isconnected():
        time.sleep(0.5)
        print(".", end="")
        
    router_channel = sta.config('channel')
    print(f"\n[OK] Połączono z routerem! IP (STA): {sta.ifconfig()[0]}, Kanał: {router_channel}")

    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    ap.config(essid=ap_ssid, password=ap_password, authmode=3, channel=router_channel) 
    
    print(f"[OK] Własna sieć utworzona! Nazwa: {ap_ssid}")
    print(f"[OK] IP Drivera (AP): {ap.ifconfig()[0]}")
    print("-" * 40)
    
    return sta, ap