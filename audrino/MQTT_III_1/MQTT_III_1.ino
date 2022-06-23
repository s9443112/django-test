//#include <LiquidCrystal_I2C.h>
#include <LiquidCrystal_PCF8574.h>

#include <WiFi.h>
#include <AsyncMqttClient.h>
LiquidCrystal_PCF8574 lcd(0x27);
#define WIFI_SSID "Wisdom-Bonus"
#define WIFI_PASSWORD "iii05076416"
//#define WIFI_SSID "Louis_Wifi"
//#define WIFI_PASSWORD "0933405819"

#define MQTT_HOST IPAddress(139, 162, 96, 124)
#define MQTT_PORT 1887

#define MQTT_TOPIC_DATETIME "datetime"
#define MQTT_TOPIC_back "III_1"
#define MQTT_TOPIC_dispatch "III_1_dispatch" //工單頻道
const char *mqttUser = "iii";
const char *mqttPassword = "iii05076416";

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;

const char *topic = "fucker";
const char *online = "online";
const char *clientID = "III_1";
char msgBuffer[100];
char msgBuffer2[100];
String val_1 = "";
String val_2 = "";
String val_1r = "";
String val_2r = "";
String multiple_5= "";
int clickcount = 999;
int clickcount_MQTT = 999;
String dispatch ;
int check = 0;
int jk = 0;
//連上去wifi後我會做的事情 X
void connectToWifi()
{
  Serial.println("Connecting to Wi-Fi...");

  lcd.clear();
  delay(200);
  lcd.setCursor(0, 0);
  lcd.print("Connect to WIFI...");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

//我正在mqtt連線中 X
void connectToMqtt()
{
  Serial.println("Connecting to MQTT...");

  lcd.clear();
  delay(200);
  lcd.setCursor(0, 0);
  lcd.print("Connect to MQTT...");


  sprintf(msgBuffer2, "{\"deviceID\":\"%s\",\"msg\":\"off\"}", clientID);
  String msgStr2 = String(msgBuffer2);
  byte arrSize2 = msgStr2.length() + 1;
  char msg2[arrSize2];
  msgStr2.toCharArray(msg2, arrSize2);
  mqttClient.setKeepAlive(3).setWill(online, 0, false, msg2); 
  mqttClient.connect();
}

//我正在wifi連線中 X
void WiFiEvent(WiFiEvent_t event)
{
  Serial.printf("[WiFi-event] event: %d\n", event);
  switch (event)
  {
  case SYSTEM_EVENT_STA_GOT_IP:
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    // lcd.clear();
    lcd.setCursor(0, 1);
    lcd.print("WiFi Success");

    delay(1000);

    connectToMqtt();
    break;
  case SYSTEM_EVENT_STA_DISCONNECTED:
    Serial.println("WiFi lost connection");

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi lost connect");

    xTimerStop(mqttReconnectTimer, 0); // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
    xTimerStart(wifiReconnectTimer, 0);
    break;
  }
}

//mqtt連線成功後我會幹的事 O
void onMqttConnect(bool sessionPresent)
{
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);

  

  //lcd.clear();
  delay(200);
  lcd.setCursor(0, 1);
  lcd.print("Success");

  //uint16_t packetIdSub = mqttClient.subscribe(MQTT_TOPIC_SW, 2);
  uint16_t packetIdSub2 = mqttClient.subscribe(MQTT_TOPIC_DATETIME, 0);
  uint16_t packetIdSub3 = mqttClient.subscribe(MQTT_TOPIC_back, 0);
  uint16_t packetIdSub4 = mqttClient.subscribe(MQTT_TOPIC_dispatch, 0);//工單頻道

  delay(2000);

  lcd.clear();
  delay(200);
  lcd.setCursor(0, 0);
  lcd.print(dispatch);
  lcd.setCursor(0, 1);
  lcd.print("Count: " + String(clickcount));

  sprintf(msgBuffer, "{\"deviceID\":\"%s\",\"msg\":\"on\"}", clientID);
  String msgStr = String(msgBuffer);
  byte arrSize = msgStr.length() + 1;
  char msg[arrSize];
  msgStr.toCharArray(msg, arrSize);
  mqttClient.publish(online, 0, false, msg);
}

//mqtt 我斷線了 X
void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
  Serial.println("Disconnected from MQTT.");

  if (WiFi.isConnected())
  {
    xTimerStart(mqttReconnectTimer, 0);
  }
}

// mqtt 訂閱成功後 我會幹嘛 X
void onMqttSubscribe(uint16_t packetId, uint8_t qos)
{
  Serial.println("Subscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
  Serial.print("  qos: ");
  Serial.println(qos);
}

// mqtt 取消訂閱成功後 我會幹嘛 X
void onMqttUnsubscribe(uint16_t packetId)
{
  Serial.println("Unsubscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}

// mqtt 收到訂閱的訊息後 我會幹麻 要去對應 (void onMqttConnect 這件事)
void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total)
{

  Serial.println("Publish received.");
  Serial.print("  topic: ");
  Serial.println(topic);
  Serial.print("  payload: ");
 
  

  char new_payload[len + 1];
  new_payload[len] = '\0';
  strncpy(new_payload, payload, len);
  //    Serial.println(new_payload);
  
  String topic_s = topic;
  String payload_s = new_payload;

  Serial.println(payload_s);
   if (topic_s == MQTT_TOPIC_dispatch) //工單頻道
  {
      dispatch=payload_s;
      
  }

  if (topic_s == MQTT_TOPIC_back)
  {
     if(clickcount==999){
      lcd.clear();delay(300);
      clickcount = payload_s.toInt();
      lcd.setCursor(0, 0);
      lcd.print(dispatch);
      lcd.setCursor(0, 1);
      lcd.print("Count:"+String(clickcount));
       }
     check = 0;
     clickcount = payload_s.toInt();
    clickcount_MQTT = payload_s.toInt(); 
     check = 1;
  };
   //delay(100);//20220222
}
// mqtt 推波成功後 我要幹嘛 X
void onMqttPublish(uint16_t packetId)
{
  // Serial.println("Publish acknowledged.");
  // Serial.print("  packetId: ");
  // Serial.println(packetId);
}

void setup()
{
  lcd.begin(16, 2);
  lcd.setBacklight(255);
  Serial.begin(921600);
  Serial.println();
pinMode(14, OUTPUT);
pinMode(27, OUTPUT);
  mqttReconnectTimer = xTimerCreate("mqttTimer", pdMS_TO_TICKS(2000), pdFALSE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(connectToMqtt));
  wifiReconnectTimer = xTimerCreate("wifiTimer", pdMS_TO_TICKS(2000), pdFALSE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(connectToWifi));

  WiFi.onEvent(WiFiEvent);


  
  
  
  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  mqttClient.onSubscribe(onMqttSubscribe);
  mqttClient.onUnsubscribe(onMqttUnsubscribe);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.onPublish(onMqttPublish);

  
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCredentials(mqttUser, mqttPassword);

  connectToWifi();
}

void loop()
{
  // mqttClient.publish(MQTT_TOPIC_TEMP, 0, true, "Hello World!!");
  val_2 = val_1;          //加
  val_1 = digitalRead(12);//加
  val_2r = val_1r;      //減
  val_1r = digitalRead(13);//減
  if (val_1r != val_2r && val_1r == "1" && check == 1)//減按下觸發
{
  clickcount = clickcount - 1;
    sprintf(msgBuffer, "{\"deviceID\":\"%s\",\"data\":%d,\"method\":\"%s\"}", clientID, clickcount,"-1");
    String msgStr = String(msgBuffer);
    Serial.println(msgBuffer);

    byte arrSize = msgStr.length() + 1;
    char msg[arrSize];
    msgStr.toCharArray(msg, arrSize);
    mqttClient.publish(topic, 0, false, msg);  
}
if (val_1r != val_2r && val_1r == "0" && check == 1)//減彈起觸發
{

  lcd.clear();
  //  clickcount = clickcount - 1;
  //  sprintf(msgBuffer, "{\"deviceID\":\"%s\",\"data\":%d,\"method\":\"%s\"}", clientID, clickcount,"-1");
  //  String msgStr = String(msgBuffer);
  //  Serial.println(msgBuffer);

  //  byte arrSize = msgStr.length() + 1;
  //  char msg[arrSize];
  //  msgStr.toCharArray(msg, arrSize);
  //  mqttClient.publish(topic, 0, false, msg);  
    delay(200); 
  lcd.setCursor(0, 0);
  lcd.print(dispatch);
  //lcd.print("ID: " + String(clientID));
  lcd.setCursor(0, 1);
  lcd.print("Count: " + String(clickcount_MQTT));//原本是-1
  jk=0;
  digitalWrite(27, HIGH);
 delay(200);
  digitalWrite(27, LOW);
}
///////////////////////////////////////////////////////////////////////////////////--------------
  if (val_1 != val_2 && val_1 == "1" && check == 1)//加按下觸發
  {
     clickcount = clickcount + 1;

    sprintf(msgBuffer, "{\"deviceID\":\"%s\",\"data\":%d,\"method\":\"%s\"}", clientID, clickcount,"+1");
    String msgStr = String(msgBuffer);
    Serial.println(msgBuffer);

    byte arrSize = msgStr.length() + 1;
    char msg[arrSize];
    msgStr.toCharArray(msg, arrSize);
    mqttClient.publish(topic, 0, false, msg);
  }
   if (val_1 != val_2 && val_1 == "0" && check == 1)//加彈起觸發
  {
 
    lcd.clear();
   // clickcount = clickcount + 1;

   // sprintf(msgBuffer, "{\"deviceID\":\"%s\",\"data\":%d,\"method\":\"%s\"}", clientID, clickcount,"+1");
   // String msgStr = String(msgBuffer);
   // Serial.println(msgBuffer);

   // byte arrSize = msgStr.length() + 1;
   // char msg[arrSize];
   // msgStr.toCharArray(msg, arrSize);
   // mqttClient.publish(topic, 0, false, msg);

   delay(200); 
  lcd.setCursor(0, 0);
  lcd.print(dispatch);
  //lcd.print("ID: " + String(clientID));
  lcd.setCursor(0, 1);
  lcd.print("Count: " + String(clickcount_MQTT));
  jk=0;
  digitalWrite(14, HIGH);
 delay(200);
  digitalWrite(14, LOW);
  }
  if(digitalRead(12)==HIGH){jk++;}
  if(jk==60){
    //減1
    clickcount = clickcount - 1;
    sprintf(msgBuffer, "{\"deviceID\":\"%s\",\"data\":%d,\"method\":\"%s\"}", clientID, clickcount,"-1");
    String msgStr1 = String(msgBuffer);
    Serial.println(msgBuffer);

    byte arrSize1 = msgStr1.length() + 1;
    char msg1[arrSize1];
    msgStr1.toCharArray(msg1, arrSize1);
    mqttClient.publish(topic, 0, false, msg1); 
    delay(500);
    //減1
  lcd.clear();
  sprintf(msgBuffer, "{\"deviceID\":\"%s\",\"msg\":\"reset\"}", clientID);
  String msgStr = String(msgBuffer);
  byte arrSize = msgStr.length() + 1;
  char msg[arrSize];
  msgStr.toCharArray(msg, arrSize);
  mqttClient.publish(online, 0, false, msg);
  lcd.setCursor(0, 0);
  lcd.print(dispatch);
  //lcd.print("ID: " + String(clientID));
  lcd.setCursor(0, 1);
  lcd.print("Count:Reset...");
  clickcount_MQTT=0;
 delay(5000);
 ESP.restart();
 jk=0;
}
  delay(100);

}
