
import datetime
import json
import time
from post import models
from threading import Thread, Timer
import paho.mqtt.client as mqtt
import os
import sys
import django
from django.forms.models import model_to_dict
from datetime import datetime, timedelta, time

# 第一個參數固定，第二個參數是工程名稱.settings
os.environ.setdefault('DJANGO_SETTING_MODULE', 'my_django.settings')
django.setup()

# 引入mqtt包
# 使用獨立線程運行
# from app名 import models

mqtt_clients = []


# 建立mqtt連接
def on_connect(client, userdata, flag, rc):
    global mqtt_clients
    mqtt_clients = []
    print("Connect with the result code " + str(rc))
    client.subscribe('fucker', qos=0)
    client.subscribe('online', qos=0)
    if str(rc) == '0':
        docs = models.Device.objects.all()
        for each in docs:
            mqtt_clients.append(model_to_dict(each))


# 接收、處理mqtt消息
def on_message(client, userdata, msg):

    try:
        global mqtt_clients
        out = str(msg.payload.decode('utf-8'))
        print(msg.topic)
        print(out)
        # print(mqtt_clients)
        # out = json.dumps(out)
        out = json.loads(out)

        # 收到消息後執行任務
        if msg.topic == 'fucker':
            # print(out['deviceID'])

            try:

                today = datetime.now().date()
                tomorrow = today + timedelta(1)
                today_start = datetime.combine(today, time())
                today_end = datetime.combine(tomorrow, time())

                result = next((
                    x for x in mqtt_clients if x["client_id"] == out['deviceID']), None)
                if result == None:
                    print("沒有資料")
                    return
                # print(result)

                device = models.Device.objects.get(id=result['id'])
                if device.dispatch_first == '' or device.dispatch_first == None:
                    client.publish("{}_dispatch".format(out['deviceID']), 'EMPTY DP')
                    client.publish(out['deviceID'], '0')
                    return 

                device_count = models.DeviceCount.objects.filter(
                    device=device, date_time__lte=today_end, date_time__gte=today_start).order_by("-id")[:1]
                # print(len(device_count))
                count = 0
                if len(device_count) == 0:
                    count = 1
                    models.DeviceCount.objects.create(
                        device=device, count=count)
                else:
                    # print(model_to_dict(device_count[0]))
                    # # print(device)
                    
                    count = model_to_dict(device_count[0])['count'] + 1
                    if out["method"] == "-1":
                        count = model_to_dict(device_count[0])['count'] - 1

                    if count < 0:
                        return client.publish(out['deviceID'], str(0))
                    models.DeviceCount.objects.create(
                        device=device, count=count)
                models.Device.objects.filter(id=result['id']).update(count=count)
                
                client.publish(out['deviceID'], str(count))

            except Exception as e:
                print(e)
        if msg.topic == 'online':
            try:

                today = datetime.now().date()
                tomorrow = today + timedelta(1)
                today_start = datetime.combine(today, time())
                today_end = datetime.combine(tomorrow, time())

                # print(today_start)
                # print(today_end)

                result = next((
                    x for x in mqtt_clients if x["client_id"] == out['deviceID']), None)
                # print(result)

                if result == None:
                    device = models.Device.objects.create(
                        name=out['deviceID'], client_id=out['deviceID'])
                    docs = models.Device.objects.all()
                    mqtt_clients = []
                    for each in docs:
                        mqtt_clients.append(model_to_dict(each))
                    client.publish(out['deviceID'], 0)
                    return

                device = models.Device.objects.get(id=result['id'])

                if out['msg'] == 'off':
                    device.status = False
                    device.save()
                    return
                if out['msg'] == 'reset':
                    print('{} is reset'.format(out['deviceID']))
                    models.DeviceCount.objects.create(
                        device=device, count=1)
                    # device.update(count=1)
                    models.Device.objects.filter(id=result['id']).update(count=1)
                    client.publish(out['deviceID'], 0)
                    
                    models.DeviceDispatch.objects.create(device=device,count=device.count,dispatchNumber=device.dispatch_first)
                    return
                device.status = True
                
                device_count = models.DeviceCount.objects.filter(
                    device=device, date_time__lte=today_end, date_time__gte=today_start).order_by("-id")[:1]
                # print(len(device_count))
                if len(device_count) == 0:
                    device.count=1
                    client.publish("{}_dispatch".format(out['deviceID']), device.dispatch_first)
                    client.publish(out['deviceID'], 0)
                    return
                device.save()
                device_count = model_to_dict(device_count[0])
                
                # print(device_count)
                # print(out['deviceID'])
                # time.sleep(1)
                client.publish("{}_dispatch".format(out['deviceID']), device.dispatch_first)
                client.publish(out['deviceID'], str(device_count['count']))
            except Exception as e:
                print(e)
                # device = models.Device.objects.create(
                #     name=out['deviceID'], client_id=out['deviceID'])
                # docs = models.Device.objects.all()
                # mqtt_clients = []
                # for each in docs:
                #     mqtt_clients.append(model_to_dict(each))
                # client.publish(out['deviceID'], 0)
            # print('fucker: '+str(out['data']))
    except Exception as e:
        print(e)
        

        


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = Timer(sec, func_wrapper)
    t.start()
    return t


def call():
    global client
    now = datetime.now()
    now = now.strftime('%Y-%m-%d %H:%M:%S')
    client.publish('datetime', now)


# mqtt客戶端啟動函數
def mqttfunction():
    global client
    # 使用loop_start 可以避免阻塞Django進程，使用loop_forever()可能會阻塞系統進程
    # client.loop_start()
    # client.loop_forever() 有掉線重連功能
    # set_interval(call, 1)
    client.loop_forever(retry_first_connection=True)


client = mqtt.Client(transport='websockets',
                     client_id='django-server-doghow', clean_session=False)

# client = mqtt.Client()

# 啟動函數


def mqtt_run():
    client.on_connect = on_connect
    client.on_message = on_message
    # 綁定 MQTT 服務器地址
    # broker = '192.168.1.129'
    broker = '139.162.96.124'
    # MQTT服務器的端口號
    client.connect(broker, 8087, 60)
    # client.connect(broker, 1883, 60)
    client.username_pw_set('iii', 'iii05076416')
    client.reconnect_delay_set(min_delay=1, max_delay=2000)
    # 啟動
    mqttthread = Thread(target=mqttfunction)
    mqttthread.start()

# 啟動 MQTT
# mqtt_run()


if __name__ == "__main__":
    mqtt_run()
