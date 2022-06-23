
import datetime
import json
import time as t
from post import models
from threading import Thread, Timer
import paho.mqtt.client as mqtt
import os
import sys
import django
from django.forms.models import model_to_dict
from django.db.models import F
from datetime import datetime, timedelta, time
from django.db import connection
from .mail import SendMail


class MqttClass(object):

    def __init__(self, to_mqtt: bool = True):
        self.to_mqtt = to_mqtt
        # self.client = mqtt.Client(transport='websockets',
        #              client_id='django-server-doghow', clean_session=False)
        self.client = mqtt.Client(transport='websockets', clean_session=True)
        # 設定登入帳號密碼
        self.client.username_pw_set('iii', 'iii05076416')

        # 設定連線資訊(IP, Port, 連線時間)
        self.client.connect('139.162.96.124', 8087, 60)
        self.client.reconnect_delay_set(min_delay=1, max_delay=2000)
        self.mqtt_clients = []

    # 建立mqtt連接

    def on_connect(self, client, userdata, flag, rc):

        self.mqtt_clients = []
        print("Connect with the result code " + str(rc))
        self.client.subscribe('fucker', qos=0)
        self.client.subscribe('online', qos=0)
        if str(rc) == '0':
            docs = models.Device.objects.all()
            for each in docs:
                self.mqtt_clients.append(model_to_dict(each))

    # 接收、處理mqtt消息
    def on_message(self, client, userdata, msg):

        try:

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
                        x for x in self.mqtt_clients if x["client_id"] == out['deviceID']), None)
                    if result == None:
                        print("沒有資料")
                        return
                    # print(result)

                    device = models.Device.objects.get(id=result['id'])
                    if device.dispatch_first == '' or device.dispatch_first == None:
                        self.client.publish("{}_dispatch".format(
                            out['deviceID']), 'EMPTY DP')
                        self.client.publish(out['deviceID'], '0')
                        return

                    # device_count = models.DeviceCount.objects.filter(
                    #     device=device, date_time__lte=today_end, date_time__gte=today_start).order_by("-id")[:1]
                    device_count = models.DeviceCount.objects.filter(
                        device=device, dispatchNumber=device.dispatch_first).order_by("-id")[:1]

                    if out["method"] == "-1":
                        models.DispatchList.objects.filter(
                            dispatchNumber=device.dispatch_first).update(real_count=F("real_count")-1)
                    elif out["method"] == "+1":
                        models.DispatchList.objects.filter(
                            dispatchNumber=device.dispatch_first).update(real_count=F("real_count")+1)
                    elif out["method"] == "reset":
                        # models.finish_dispatch(dispatchNumber=device.dispatch_first)

                        device.dispatch_first = device.dispatch_second
                        device.dispatch_second = device.dispatch_third
                        device.dispatch_third = device.dispatch_4
                        device.dispatch_4 = device.dispatch_5
                        device.dispatch_5 = device.dispatch_6
                        device.dispatch_6 = device.dispatch_7
                        device.dispatch_7 = device.dispatch_8
                        device.dispatch_8 = None
                        device.count = 0
                        device.save()
                        self.client.publish(device.client_id, "99999")
                        self.client.publish(device.client_id, "99999")
                        self.client.publish(device.client_id, "99999")
                        return
                    else:
                        print(out)
                        print("未知錯誤")

                        return
                    device.status = True
                    device.save()

                    # print(len(device_count))
                    count = 0
                    if len(device_count) == 0:
                        count = 1
                        models.DeviceCount.objects.create(
                            device=device, count=count, dispatchNumber=device.dispatch_first, user=device.user)
                    else:
                        # print(model_to_dict(device_count[0]))
                        # # print(device)

                        count = model_to_dict(device_count[0])['count'] + 1
                        if out["method"] == "-1":
                            count = model_to_dict(device_count[0])['count'] - 1

                        if count < 0:
                            return self.client.publish(out['deviceID'], str(0))
                        models.DeviceCount.objects.create(
                            device=device, count=count, dispatchNumber=device.dispatch_first, user=device.user)
                    models.Device.objects.filter(
                        id=result['id']).update(count=count)

                    dispatch = models.DispatchList.objects.filter(
                        dispatchNumber=device.dispatch_first)

                    if len(dispatch) == 0:
                        return

                    if dispatch[0].real_count >= dispatch[0].publish_count:
                        if dispatch[0].publish_status == 0:
                            SendMail.send_already_finish(title="工單:{} 進度水位通知".format(
                                dispatch[0].dispatchNumber), msg="工單: {} 品名: {}\n目前數量: {}, 應完工數量: {}".format(dispatch[0].dispatchNumber, dispatch[0].product_name, dispatch[0].real_count, dispatch[0].qt_count))
                            dispatch.update(publish_status=1)
                    if dispatch[0].real_count >= dispatch[0].qt_count:
                        # device.count = 0
                        # device.dispatch_first = device.dispatch_second
                        # device.dispatch_second = device.dispatch_third
                        # device.dispatch_third = None
                        # device.save()
                        # self.client.publish(out['deviceID'], "99999")

                        cursor = connection.cursor()

                        cursor.execute("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
                        where \"dispatchNumber\" ='{}'  \
                        and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
                        and pd.device_id =pd2.id  \
                        group by pd2.\"name\" ,pd.device_id ".format(device.dispatch_first))

                        queryset = cursor.fetchall()

                        if len(queryset) != 0:
                            for each in queryset:

                                each_device = models.Device.objects.get(
                                    id=each[2])

                                if each_device.dispatch_second == None:
                                    self.client.publish(
                                        each_device.client_id, str(count))
                                    continue
                                # if each_device.dispatch_second == None:
                                #     # print(out['deviceID'])
                                #     self.client.publish(each_device.client_id, str(count))
                                #     continue
                                each_device.count = 0
                                each_device.dispatch_first = each_device.dispatch_second
                                each_device.dispatch_second = each_device.dispatch_third
                                each_device.dispatch_third = each_device.dispatch_4
                                each_device.dispatch_4 = each_device.dispatch_5
                                each_device.dispatch_5 = each_device.dispatch_6
                                each_device.dispatch_6 = each_device.dispatch_7
                                each_device.dispatch_7 = each_device.dispatch_8
                                each_device.dispatch_8 = None

                                if each_device.dispatch_first != None:
                                    buf_device = models.DeviceCount.objects.filter(
                                        device=each_device, dispatchNumber=each_device.dispatch_first).order_by("-id")
                                if len(buf_device) != 0:
                                    each_device.count = buf_device[0].count

                                each_device.save()
                                # print(each_device.dispatch_first)
                                buf_dispatch = models.DispatchList.objects.get(
                                    dispatchNumber=each_device.dispatch_first)
                                if buf_dispatch.status == 0:
                                    buf_dispatch.status = 1
                                if buf_dispatch.real_start_date == None:
                                    buf_dispatch.real_start_date = datetime.today().strftime('%Y-%m-%d %H:%M:%S')
                                buf_dispatch.save()

                                t.sleep(1)
                                self.client.publish(
                                    each_device.client_id, "99999")
                                self.client.publish(
                                    each_device.client_id, "99999")
                                self.client.publish(
                                    each_device.client_id, "99999")
                                self.client.publish(
                                    each_device.client_id, "99999")
                                self.client.publish("web_reset", "")
                            # dispatch.update(status=1)

                    self.client.publish(out['deviceID'], str(count))
                    return

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
                        x for x in self.mqtt_clients if x["client_id"] == out['deviceID']), None)
                    # print(result)

                    if result == None:
                        device = models.Device.objects.create(
                            name=out['deviceID'], client_id=out['deviceID'])
                        docs = models.Device.objects.all()

                        for each in docs:
                            self.mqtt_clients.append(model_to_dict(each))
                        self.client.publish(out['deviceID'], 0)
                        return

                    device = models.Device.objects.get(id=result['id'])
                    dispatch = models.DispatchList.objects.filter(
                        dispatchNumber=device.dispatch_first)

                    if out['msg'] == 'off':
                        device.status = False
                        device.save()
                        return
                    if out['msg'] == 'reset':
                        print('{} is reset'.format(out['deviceID']))
                        models.DeviceCount.objects.create(
                            device=device, count=1)
                        # device.update(count=1)
                        models.Device.objects.filter(
                            id=result['id']).update(count=1)
                        self.client.publish(out['deviceID'], 0)

                        models.DeviceDispatch.objects.create(
                            device=device, count=device.count, dispatchNumber=device.dispatch_first)
                        return
                    device.status = True

                    # device_count = models.DeviceCount.objects.filter(
                    #     device=device, date_time__lte=today_end, date_time__gte=today_start).order_by("-id")[:1]
                    device_count = models.DeviceCount.objects.filter(
                        device=device, dispatchNumber=device.dispatch_first).order_by("-id")[:1]
                    # print(len(device_count))
                    if len(device_count) == 0:
                        device.count = 1

                        # 推播工單編號
                        # self.client.publish("{}_dispatch".format(
                        #     out['deviceID']), device.dispatch_first)

                        # 推播料件編號
                        self.client.publish("{}_dispatch".format(
                            out['deviceID']), dispatch[0].material_code)

                        self.client.publish(out['deviceID'], 0)
                        return
                    device.save()
                    device_count = model_to_dict(device_count[0])

                    # print(device_count)
                    # print(out['deviceID'])
                    # time.sleep(1)

                    # 推播工單編號
                    # self.client.publish("{}_dispatch".format(
                    #     out['deviceID']), device.dispatch_first)

                    # 推播料件編號
                    self.client.publish("{}_dispatch".format(
                        out['deviceID']), dispatch[0].material_code)
                    self.client.publish(
                        out['deviceID'], str(device_count['count']))
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

    def go_publish(self, topic, msg):
        self.client.publish(topic, msg)

    def mqttfunction(self):

        self.client.loop_forever(retry_first_connection=True)

    def mqtt_run(self):

        # 第一個參數固定，第二個參數是工程名稱.settings
        os.environ.setdefault('DJANGO_SETTING_MODULE', 'my_django.settings')
        django.setup()

        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        mqttthread = Thread(target=self.mqttfunction)
        mqttthread.start()
