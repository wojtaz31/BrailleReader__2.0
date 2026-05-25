#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include "camera_utils.h"
#include "network_utils.h"

const char* ssid = "ESP_Driver_Network";
const char* password = "siec12345";

WebServer server(80);
unsigned long lastWiFiCheck = 0;
const unsigned long reconnectCooldown = 15000;

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  camera_setup();
  delay(500);

  if (MDNS.begin("esp32")) {
    Serial.println("MDNS responder started");
  }

  server.on("/photo", []() {
    server.send(200, "text/plain", takeScreenshot());
  });

  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    server.handleClient();
  } else {
    if (millis() - lastWiFiCheck >= reconnectCooldown) {
      
      bool connected = tryReconnectWiFi(10000);

      if (connected) {
        Serial.println("Reconnecting successful!");
      } else {
        Serial.println("Reconnecting unsuccessful. Odczekam chwilę przed kolejną próbą.");
      }
      
      lastWiFiCheck = millis(); 
    }
  }
  delay(5);
}