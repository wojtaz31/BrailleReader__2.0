#pragma once
#include <Arduino.h>
#include "esp_camera.h"
#include "mbedtls/base64.h"

#define CAMERA_MODEL_XIAO_ESP32S3
#include "camera_pins.h"

void camera_setup();
String takeScreenshot();