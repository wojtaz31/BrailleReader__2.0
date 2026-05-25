#pragma once
#include <WiFi.h>
#include <WebServer.h>

extern WebServer server; 

void handleNotFound();
bool tryReconnectWiFi(unsigned long timeoutMillis);