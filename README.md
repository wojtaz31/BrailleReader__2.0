# BrailleReader - Output Interface for the Blind

![BrailleReader](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue) ![Hardware](https://img.shields.io/badge/Hardware-ESP32S3-orange)

Projekt BrailleReader przedstawia urządzenie do automatycznego tłumaczenia tekstu drukowanego, plików tekstowych oraz publikacji internetowych na alfabet Braille'a. Głównym celem systemu jest przeciwdziałanie wykluczeniu cyfrowemu osób niewidzących i niedowidzących oraz zwiększenie ich niezależności.

## Struktura Repozytorium
Kod w repozytorium podzielony jest na foldery odpowiadające konkretnym modułom software'owym:

### `backend/`
Serwer pośredniczący. Przyjmuje zdjęcia z głównego sterownika, przeprowadza numeryczną korekcję zniekształceń i komunikuje się z API w celu wykonania procedury OCR.

### `frontend/`
Aplikacja webowa oraz moduły interfejsu użytkownika stworzone w oparciu o React.js, TypeScript, Vite oraz Tailwind CSS. Zawiera logikę aplikacji do nauki Braille'a.

### `cam/CameraWebServer/` (C++ / Arduino)
Oprogramowanie dla dwóch węzłów wizyjnych (Edge Cameras) na układach XIAO ESP32S3. Pełnią rolę bezstanowych węzłów z lekkim serwerem HTTP.
* `CameraWebServer.ino` - Główny plik wykonywalny mikrokontrolerów kamery.
* `camera_utils.cpp` / `network_utils.cpp` - Obsługa kompresji JPEG, kodowania Base64 oraz serwera HTTP.

### `driver/`
Skrypty działające na centralnym układzie XIAO ESP32S3 (Driver Orchestrator). Układ ten utrzymuje podwójny interfejs sieciowy (AP-STA), zarządza komunikacją pomiędzy urządzeniem a backendem i mapuje znaki na wektory binarne.
* `driver.py` - Główna pętla sterownika, zarządzanie zapytaniami asynchronicznymi i obsługa podsieci.
* `api_client.py` - Moduł odpowiedzialny za komunikację HTTP z węzłami kamer oraz zewnętrznym backendem.
* `wifi_setup.py` - Konfiguracja interfejsów STA (łączność z Internetem) oraz SoftAP (izolowana sieć dla kamer).
* `sr74hc595_main.py` / `sr74hc595_bitbang.py` - Niskopoziomowe sterowanie kaskadą rejestrów przesuwnych 74HC595.
* `letter_codes.py` - Mapowanie znaków alfanumerycznych na fizyczne układy wypustek Braille'a.

---

## Technologie i Komponenty

**Software:**
* **Mikrokontrolery:** C++/xtensa-esp-elf-g++.exe 14.2.0) (Kamery), MicroPython (Driver)
* **Web:** React.js, TypeScript, Vite, Tailwind CSS
* **Backend:** Node.js, express

## Autorzy
* **Wojciech Szymański** - Akademia Górniczo-Hutnicza im. Stanisława Staszica w Krakowie 
* **Miłosz Obrębski** - Politechnika Gdańska 
