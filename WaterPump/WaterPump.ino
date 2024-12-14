#include <ArduinoJson.h>

const int pumps[] = {4, 5, 6, 7, 8, 9};
const char* pumpNames[] = {"A", "B", "C", "D", "Soda", "Final"};
const int buttonPin = 3;
const int button2Pin = 2;

const char* jsonData = "{\"A\":1000, \"B\":1000, \"C\":2000, \"D\":1500, \"Soda\":2500, \"Final\":4000}";

StaticJsonDocument<200> doc;

bool button2State = LOW;
bool pumpStarted = false;

void setup() {
  Serial.println("setup");
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(button2Pin, INPUT_PULLUP);
  DeserializationError error = deserializeJson(doc, jsonData);
  for (int i = 0; i < 6; i++) {
    pinMode(pumps[i], OUTPUT);
    digitalWrite(pumps[i], HIGH);
  }
}

void loop() {
  bool buttonState = digitalRead(buttonPin);
  bool button2State = digitalRead(button2Pin);

  pumpStarted = false;

  if (buttonState == LOW && !pumpStarted) {
    Serial.println("button pressed");
    pumpStarted = true;
  }

  if (pumpStarted) {
    Serial.println("pumpStarted");
    for (int i = 0; i < 5; i++) {
      int pumpTime = doc[pumpNames[i]] | 0;
      if (pumpTime > 0) {
        digitalWrite(pumps[i], LOW);
        Serial.print(pumps[i]);
        Serial.println("high");
        delay(pumpTime);
        digitalWrite(pumps[i], HIGH);
        Serial.print(pumps[i]);
        Serial.println("low");
      }
    }

    // int maxTime = 0;
    // for (int i = 0; i < 5; i++) {
    //   int pumpTime = doc[pumpNames[i]] | 0;
    //   if (pumpTime > maxTime) {
    //     maxTime = pumpTime;
    //   }
    // }

    // if (millis() - sessionStartTime >= maxTime) {
    //   pumpStarted = false;
    // }
  }

  if (button2State == LOW) {
    Serial.println("final button pressed");
    digitalWrite(pumps[5], LOW);
  }
  else{
    digitalWrite(pumps[5], HIGH);
  }
}
