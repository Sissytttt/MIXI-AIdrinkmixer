#include <ArduinoJson.h>

const int BUFFER_SIZE = 200;
const int pumps[] = {4, 5, 6, 7, 8, 9};
const char* pumpNames[] = {"A", "B", "C", "D", "Soda", "Final"};
const int buttonPin = 3;
const int button2Pin = 2;

// char* jsonData = "{\"A\":1000, \"B\":1000, \"C\":1000, \"D\":1000, \"Soda\":1000, \"Final\":1000}";

// StaticJsonDocument<200> doc;
int buttonState;
bool button2State;
int pumpTime;
int incomingByte = 0;

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(10);
  Serial.println("setup");
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(button2Pin, INPUT_PULLUP);
  
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
  // buttonState = digitalRead(buttonPin);
  button2State = digitalRead(button2Pin);
  if (Serial.available()) {
    char jsonBuffer[BUFFER_SIZE];  // Buffer to store incoming data
    size_t len = Serial.readBytesUntil('\n', jsonBuffer, BUFFER_SIZE - 1);
    jsonBuffer[len] = '\0';  // Null-terminate the string

    // Create a JSON document
    StaticJsonDocument<BUFFER_SIZE> doc;

    // Deserialize the JSON data
    DeserializationError error = deserializeJson(doc, jsonBuffer);
    if (error) {
      Serial.print("JSON parsing failed: ");
      Serial.println(error.c_str());
      return;
    }
    Serial.println("rdata");
    buttonState = 1;

    if (buttonState) {
      buttonState = 0;
      Serial.println("button pressed");

      pumpTime = doc["A"] | 0;
      digitalWrite(4, LOW);
      Serial.print(4);
      Serial.println("high");
      Serial.println(pumpTime);
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

      // pumpTime = doc["Final"] | 0;
      // digitalWrite(9, LOW);
      // Serial.print(9);
      // Serial.println("high");
      // delay(pumpTime);
      // digitalWrite(9, HIGH);
      // Serial.print(9);
      // Serial.println("low");
    }
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

// {'Emotion_name': 'Anticipation', 'Drink_name': 'Awaited Delight', 'Emotional_Ingredient': [{'Emotion': 'Hope', 'polar_angel': 60, 'percentage': '50%'}, {'Emotion': 'Excitement', 'polar_angel': 20, 'percentage': '50%'}], 'Overall_Polar_coordinate': {'Polar_angle': 40, 'Percentage': 0.5}, 'Recipe': {'Ingredients': [{'Ingredient_name': 'mango juice', 'Proportion': '60%'}, {'Ingredient_name': 'lime juice', 'Proportion': '40%'}]}}
