#include "network_utils.h"

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}

bool tryReconnectWiFi(unsigned long timeoutMillis) {
  Serial.print("Próba odzyskania połączenia Wi-Fi");
  WiFi.reconnect();
  
  unsigned long startAttempt = millis();

  while (WiFi.status() != WL_CONNECTED && (millis() - startAttempt < timeoutMillis)) {
    delay(500);
    if (WiFi.status() == WL_CONNECTED) return true;
    Serial.print(".");
  }

  return WiFi.status() == WL_CONNECTED;
}