#include <ArduinoJson.h>

const int pumps[] = {4, 5, 6, 7, 8, 9};
const char* pumpNames[] = {"A", "B", "C", "D", "Soda", "Final"};
const int buttonPin = 3;
const int button2Pin = 2;

const char* jsonData = "{\"A\":1000, \"B\":1000, \"C\":2000, \"D\":1500, \"Soda\":2500, \"Final\":4000}";

StaticJsonDocument<200> doc;
bool buttonState;
bool button2State;
int pumpTime;

void setup() {
  Serial.println("setup");
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(button2Pin, INPUT_PULLUP);
  DeserializationError error = deserializeJson(doc, jsonData);
  
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  digitalWrite(4, HIGH);
  digitalWrite(5, HIGH);
  digitalWrite(6, HIGH);
  digitalWrite(7, HIGH);
  digitalWrite(8, HIGH);
  digitalWrite(9, HIGH);
}

void loop() {
  buttonState = digitalRead(buttonPin);
  button2State = digitalRead(button2Pin);

  if (buttonState == LOW) {
    Serial.println("button pressed");

    pumpTime = doc["A"] | 0;
    digitalWrite(4, LOW);
    Serial.print(4);
    Serial.println("high");
    delay(pumpTime);
    digitalWrite(4, HIGH);
    Serial.print(4);
    Serial.println("low");

    pumpTime = doc["B"] | 0;
    digitalWrite(5, LOW);
    Serial.print(5);
    Serial.println("high");
    delay(pumpTime);
    digitalWrite(5, HIGH);
    Serial.print(5);
    Serial.println("low");

    pumpTime = doc["C"] | 0;
    digitalWrite(6, LOW);
    Serial.print(6);
    Serial.println("high");
    delay(pumpTime);
    digitalWrite(6, HIGH);
    Serial.print(6);
    Serial.println("low");

    pumpTime = doc["D"] | 0;
    digitalWrite(7, LOW);
    Serial.print(7);
    Serial.println("high");
    delay(pumpTime);
    digitalWrite(7, HIGH);
    Serial.print(7);
    Serial.println("low");

    pumpTime = doc["Soda"] | 0;
    digitalWrite(8, LOW);
    Serial.print(8);
    Serial.println("high");
    delay(pumpTime);
    digitalWrite(8, HIGH);
    Serial.print(8);
    Serial.println("low");
  }

  if (button2State == LOW) {
    Serial.print("buttonState : ");
    Serial.println(buttonState);
    Serial.println("final button pressed");
    digitalWrite(9, LOW);
  }
  else{
    digitalWrite(9, HIGH);
  }
}
