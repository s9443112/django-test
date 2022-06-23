

from django.db import models
from typing import Dict
# from django.db.models import Count
from django.contrib.auth.models import Group
from datetime import datetime, timedelta, time
from django.forms.models import model_to_dict
from django_apscheduler.models import DjangoJob
from post.lib.mqtt_function import MqttClass
# from post.lib.mail import SendMail
from django.db import connection, transaction


class DateTimeWithoutTZField(models.DateTimeField):
    def db_type(self, connection):
        return 'timestamp'

# Create your models here.


# class Post(models.Model):

#     class Meta:
#         verbose_name = '文章'
#         verbose_name_plural = '文章'

#     title = models.CharField('標題', max_length=20)
#     content = models.CharField('內容', max_length=200)

#     def __str__(self):
#         return self.title


# class History(models.Model):
#     class Meta:
#         verbose_name = '原始歷史資料(30s)'
#         verbose_name_plural = '原始歷史資料(30s)'

#     thickness = models.FloatField('厚度', max_length=20)
#     material_temp = models.FloatField('材料溫度', max_length=20)
#     temp = models.FloatField('環境溫度', max_length=20)
#     humidity = models.FloatField('環境濕度', max_length=20)
#     yaw = models.FloatField('偏擺度', max_length=20)
#     alarm = models.BooleanField('警報', max_length=20)
#     mark = models.BooleanField('標記資料', max_length=20)
#     date_time = DateTimeWithoutTZField('時間戳記', max_length=50)
class User(models.Model):
    class Meta:
        verbose_name = '使用者'
        verbose_name_plural = '使用者'
    name = models.CharField('名稱', max_length=50)
    auth = models.IntegerField('權限', default=1)
    account = models.CharField('帳號', max_length=50, default='user')
    password = models.CharField('密碼', max_length=50, default='123456')
    email = models.CharField('Email', max_length=100, default='iii@gmail.com')

    def __str__(self):
        return self.name


class Setting(models.Model):
    class Meta:
        verbose_name = '設定'
        verbose_name_plural = '設定'

    name = models.CharField('名稱', max_length=50)
    args = models.CharField('參數', max_length=50)
    avg_value = models.FloatField('預估值', max_length=50)
    upper_limit = models.FloatField('上限', max_length=50)
    lower_limit = models.FloatField('下限', max_length=50)
    date_time = DateTimeWithoutTZField('時間戳記', max_length=50)


class Workshop(models.Model):
    class Meta:
        verbose_name = '工作站'
        verbose_name_plural = '工作站'
    name = models.CharField('名稱', max_length=50)
    date_time = DateTimeWithoutTZField(
        '時間戳記', max_length=50, auto_now_add=True)

    def __str__(self):
        return self.name


class DispatchList(models.Model):
    class Meta:
        verbose_name = '工單列表'
        verbose_name_plural = '工單列表'

    department = models.CharField(
        '部門', max_length=50, default=None, null=True, blank=True)
    dispatchNumber = models.CharField('工單編號', max_length=50)
    real_start_date = DateTimeWithoutTZField(
        '實際開工日', default=None, null=True, blank=True)
    real_end_date = DateTimeWithoutTZField(
        '實際完工日', default=None, null=True, blank=True)
    guess_start_date = DateTimeWithoutTZField(
        '預計開工日', default=datetime.now, null=True, blank=True)
    guess_end_date = DateTimeWithoutTZField(
        '預計完工日', default=datetime.now, null=True, blank=True)
    generate_start_date = DateTimeWithoutTZField(
        '建立日期', default=datetime.now, blank=True)
    material_code = models.CharField('料件編號', max_length=50)
    product_name = models.CharField('品名', max_length=50)
    specification = models.CharField('規格', max_length=50)
    qt_count = models.IntegerField('應完成數量', default=0)
    real_count = models.IntegerField(
        '實際完成數量', default=0, null=True, blank=True)
    error_count = models.IntegerField(
        '異常數量', default=0,
    )
    publish_count = models.IntegerField(
        '推播警戒值', default=0,
    )
    publish_status = models.IntegerField('推播狀態', default=0)
    # 0 未進行,1 進行中,2 已結單
    status = models.IntegerField('狀態', default=0)

    def __str__(self):
        return self.dispatchNumber


class Device(models.Model):
    class Meta:
        verbose_name = '設備'
        verbose_name_plural = '設備'
    workshop = models.ForeignKey(
        Workshop, on_delete=models.CASCADE, default=None, null=True, blank=True)
    name = models.CharField('名稱', max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    client_id = models.CharField('client_id', max_length=50)
    date_time = DateTimeWithoutTZField(
        '時間戳記', max_length=50, auto_now_add=True)
    status = models.BooleanField('是否開機', max_length=20, default=True)
    count = models.IntegerField('次數', default=0)
    dispatch_first = models.CharField(
        'dispatch_first', max_length=50, default=None, null=True, blank=True)
    dispatch_second = models.CharField(
        'dispatch_second', max_length=50, default=None, null=True, blank=True)
    dispatch_third = models.CharField(
        'dispatch_third', max_length=50, default=None, null=True, blank=True)
    dispatch_4 = models.CharField(
        'dispatch_4', max_length=50, default=None, null=True, blank=True)
    dispatch_5 = models.CharField(
        'dispatch_5', max_length=50, default=None, null=True, blank=True)
    dispatch_6 = models.CharField(
        'dispatch_6', max_length=50, default=None, null=True, blank=True)
    dispatch_7 = models.CharField(
        'dispatch_7', max_length=50, default=None, null=True, blank=True)
    dispatch_8 = models.CharField(
        'dispatch_8', max_length=50, default=None, null=True, blank=True)

    def __str__(self):
        return self.name


class DeviceDispatch(models.Model):
    class Meta:
        verbose_name = '設備報工'
        verbose_name_plural = '設備報工'
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    date_time = DateTimeWithoutTZField(default=datetime.now, blank=True)
    count = models.IntegerField('次數', default=0)
    dispatchNumber = models.CharField('工單編號', max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.date_time) + " "+self.device.name + ' 報工 ' + str(self.count)


class WorkShipDispatch(models.Model):
    class Meta:
        verbose_name = '工作站報工'
        verbose_name_plural = '工作站報工'
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE)
    all_count = models.IntegerField('總次數', default=0)
    DeviceDispatch = models.ManyToManyField(DeviceDispatch)
    date_time = DateTimeWithoutTZField(default=datetime.now, blank=True)


class DeviceCount(models.Model):
    class Meta:
        verbose_name = '設備計數'
        verbose_name_plural = '設備計數'
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    date_time = DateTimeWithoutTZField(default=datetime.now, blank=True)
    count = models.IntegerField('次數', default=0)
    dispatchNumber = models.CharField('工單編號', max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.device.name


class SendMailSetting(models.Model):
    class Meta:
        verbose_name = '寄件設定'
        verbose_name_plural = '寄件設定'
    name = models.CharField('寄件名稱', max_length=50)
    send_group = models.ForeignKey(Group, on_delete=models.CASCADE)
    send_time = DateTimeWithoutTZField(default=datetime.now, blank=True)
    # send_schedulers = models.ForeignKey(DjangoJob,on_delete=models.CASCADE)
    create_time = DateTimeWithoutTZField(
        '時間戳記', max_length=50, auto_now_add=True)
    is_open = models.BooleanField('是否啟用', max_length=20, default=True)


def Go_dispatch(**kwargs):
    # today_datetime = kwargs.get('today_datetime')
    working_dispatch_list = DispatchList.objects.filter(status=1)

    cursor = connection.cursor()

    for each in working_dispatch_list:
        cursor.execute("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
    where \"dispatchNumber\" ='{}'  \
    and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
    and pd.device_id =pd2.id  \
    group by pd2.\"name\" ,pd.device_id ".format(each.dispatchNumber))

        queryset = cursor.fetchall()

        print(queryset)
        device_dispatch_list = []
        for obj in queryset:
            device_dispatch_list.append(DeviceDispatch(
                device=Device.objects.get(id=obj[2]),
                count=obj[0],
                dispatchNumber=each.dispatchNumber,
                user=User.objects.get(id=Device.objects.get(id=obj[2]).user.id)
            ))
        DeviceDispatch.objects.bulk_create(device_dispatch_list)
    cursor.close()


def Today_dispatch(**kwargs):
    # today = kwargs.get('date')

    today = datetime.strptime(kwargs.get('date'), "%Y-%m-%d")

    # today = datetime.now().date()
    print(today)
    tomorrow = today + timedelta(1)
    today_start = datetime.combine(today, time())
    today_end = datetime.combine(tomorrow, time())

    working_dispatch_list = DispatchList.objects.filter(status=1)

    # working_dispatch_list.extend(finish_dispatch_list)
    cursor = connection.cursor()

    dispatch_list = []

    for each in working_dispatch_list:
        cursor.execute("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
    where \"dispatchNumber\" ='{}' and DATE(pd.date_time) = '{}'   \
    and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
    and pd.device_id =pd2.id  \
    group by pd2.\"name\" ,pd.device_id ".format(each.dispatchNumber, today_start.strftime('%Y-%m-%d')))

    #     print("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
    # where \"dispatchNumber\" ='{}'  \
    # and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
    # and pd.device_id =pd2.id  \
    # group by pd2.\"name\" ,pd.device_id ".format(each.dispatchNumber))
        queryset = cursor.fetchall()
        print("**************************")
        print(model_to_dict(each))

        # print(queryset)
        device_dispatch_list = []
        for obj in queryset:
            device_dispatch_list.append({
                "device_id": Device.objects.get(id=obj[2]).id,
                "device_name": Device.objects.get(id=obj[2]).name,
                "status": Device.objects.get(id=obj[2]).status,
                "user_info": model_to_dict(Device.objects.get(id=obj[2]).user),
                # "product_name": each.product_name,
                "count": obj[0],
                "every_count": obj[0]

            })

        if len(queryset) != 0:
            # 取得非今日
            cursor.execute("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
        where \"dispatchNumber\" ='{}'  and DATE(pd.date_time) != '{}'\
        and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
        and pd.device_id =pd2.id  \
        group by pd2.\"name\" ,pd.device_id ".format(each.dispatchNumber, today_start.strftime('%Y-%m-%d')))

            queryset2 = cursor.fetchall()

            print(queryset2)
            print('--------search')
            for obj in queryset2:
                findele = next((data for data in device_dispatch_list if data.get(
                    'device_id') == Device.objects.get(id=obj[2]).id), None)
                print(findele)
                if findele != None:
                    findele["count"] = findele["count"] - obj[0]
            print("------------------------------------")

            dispatch_list.append({
                "dispatchNumber": each.dispatchNumber,
                "product_name": each.product_name,
                "material_code": each.material_code,
                "device_dispatch_list": device_dispatch_list,
                "status": "working",
                "real_count": each.real_count,
                "qt_count": each.qt_count,
                "guess_end_date": each.guess_end_date
            })
    # print('-------------------next------------------------------')

    finish_dispatch_list = DispatchList.objects.filter(
        status=2, real_end_date__lte=today_end, real_end_date__gte=today_start)

    for each in finish_dispatch_list:
        cursor.execute("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
    where \"dispatchNumber\" ='{}' and  DATE(pd.date_time) = '{}' \
    and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
    and pd.device_id =pd2.id  \
    group by pd2.\"name\" ,pd.device_id ".format(each.dispatchNumber, today_start.strftime('%Y-%m-%d')))

        queryset = cursor.fetchall()

        # print(queryset)
        device_dispatch_list = []
        for obj in queryset:
            device_dispatch_list.append({
                "device_id": Device.objects.get(id=obj[2]).id,
                "device_name": Device.objects.get(id=obj[2]).name,
                "status": Device.objects.get(id=obj[2]).status,
                "user_info": model_to_dict(Device.objects.get(id=obj[2]).user),
                # "product_name": each.product_name,
                "count": obj[0],
                "every_count": obj[0]
            })
        if len(queryset) != 0:

            # 取得非今日
            cursor.execute("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
        where \"dispatchNumber\" ='{}'  and DATE(pd.date_time) != '{}'\
        and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
        and pd.device_id =pd2.id  \
        group by pd2.\"name\" ,pd.device_id ".format(each.dispatchNumber, today_start.strftime('%Y-%m-%d')))

            queryset2 = cursor.fetchall()

            print(queryset2)
            print('--------search')
            for obj in queryset2:
                findele = next((data for data in device_dispatch_list if data.get(
                    'device_id') == Device.objects.get(id=obj[2]).id), None)
                print(findele)
                if findele != None:
                    findele["count"] = findele["count"] - obj[0]
            print("------------------------------------")

            dispatch_list.append({
                "dispatchNumber": each.dispatchNumber,
                "product_name": each.product_name,
                "material_code": each.material_code,
                "device_dispatch_list": device_dispatch_list,
                "status": "finish",
                "real_count": each.real_count,
                "qt_count": each.qt_count,
                "guess_end_date": each.guess_end_date
            })

    cursor.close()
    # print(dispatch_list)
    return dispatch_list


def Go_dispatch_bk(**kwargs):
    today_datetime = kwargs.get('today_datetime')
    devices = Device.objects.all()
    device_dispatch_list = []
    for each in devices:
        device_dispatch_list.append(
            DeviceDispatch(device=each, count=each.count, date_time=today_datetime))
    DeviceDispatch.objects.bulk_create(device_dispatch_list)
    result = DeviceDispatch.objects.filter(date_time=today_datetime)
    # print(result)

    workshop_dispatch_list = []

    workshops = Workshop.objects.all()
    devices = Device.objects.all()

    for each in result:
        # print(model_to_dict(each))
        check_result = next((
            x for x in devices if model_to_dict(x)["id"] == model_to_dict(each)["device"]), None)
        # print(model_to_dict(check_result))
        if check_result != None:
            buffer = {}
            buffer["workshop"] = model_to_dict(check_result)["workshop"]
            # buffer["deviceDispatch"] = each
            # print(buffer)
            check_workshop_result_index = next((
                x for x, item in enumerate(workshop_dispatch_list) if item["workshop"] == buffer["workshop"]), None)
            if check_workshop_result_index == None:
                workshop_dispatch_list.append({
                    "workshop": buffer["workshop"],
                    "DeviceDispatch": [each]
                })
            else:
                workshop_dispatch_list[check_workshop_result_index]["DeviceDispatch"].append(
                    each)

            # workshop_dispatch_list.append({
            #     "workshop": model_to_dict(check_result)["workshop"],
            #     "_list": [each]
            # })
    for each in workshop_dispatch_list:
        check_workshop_result = next((
            x for x in workshops if model_to_dict(x)["id"] == each["workshop"]), None)
        val = WorkShipDispatch(workshop=check_workshop_result)
        val.save()
        all_count = 0
        for each in each["DeviceDispatch"]:
            val.DeviceDispatch.add(each)
            # print(model_to_dict(each))
            all_count = all_count + each.count
        print(all_count)
        val.all_count = int(all_count)
        val.save()

        # xx_workshop_dispatch_list.append(WorkShipDispatch(workshop=check_workshop_result))
        # yy_workshop_dispatch_list.append(each["DeviceDispatch"])

    # for idx, val in enumerate(xx_workshop_dispatch_list):

    #     val.save()
    #     for each in yy_workshop_dispatch_list[idx]:
    #         print(each)
    #         val.DeviceDispatch.add(each)

    # for each in devices:
    #     print(model_to_dict(each))


def get_Device_last_count(**kwargs):

    id = kwargs.get('id')
    print(id)
    today = datetime.now().date()
    tomorrow = today + timedelta(1)
    today_start = datetime.combine(today, time())
    today_end = datetime.combine(tomorrow, time())

    try:
        device = Device.objects.get(id=id)
    except Device.DoesNotExist:
        device = None
        return None

    print(device)

    queryset = DeviceCount.objects.filter(
        device=device, date_time__lte=today_end, date_time__gte=today_start).order_by("-id")[:1]
    return queryset


def get_history_between_date(**kwargs):
    start_time = kwargs.get('start_time')
    end_time = kwargs.get('end_time')
    # print(start_time)
    queryset = History.objects.filter(
        date_time__range=[start_time, end_time]).order_by("-id")
    return queryset


def get_history_last_limit(**kwargs):
    limit = kwargs.get('limit')
    queryset = History.objects.all().order_by("-id")[:limit]
    return queryset

# 開始派工


def start_dispatch(**kwargs):
    devices_first = kwargs.get('devices_first').split(
        ',') if kwargs.get('devices_first') != None else []
    devices_second = kwargs.get('devices_second').split(
        ',') if kwargs.get('devices_second') != None else []
    devices_third = kwargs.get('devices_third').split(
        ',') if kwargs.get('devices_third') != None else []
    dispatchNumber = kwargs.get('dispatchNumber')
    publish_count = kwargs.get('publish_count')
    devices_4 = kwargs.get('devices_4').split(
        ',') if kwargs.get('devices_4') != None else []
    devices_5 = kwargs.get('devices_5').split(
        ',') if kwargs.get('devices_5') != None else []
    devices_6 = kwargs.get('devices_6').split(
        ',') if kwargs.get('devices_6') != None else []
    devices_7 = kwargs.get('devices_7').split(
        ',') if kwargs.get('devices_7') != None else []
    devices_8 = kwargs.get('devices_8').split(
        ',') if kwargs.get('devices_8') != None else []

    queryset = DispatchList.objects.filter(dispatchNumber=dispatchNumber)

    if len(queryset) == 0:
        return {'status': 'failed', 'msg': 'dispatch is not found.'}

    doing_Device = Device.objects.filter(dispatch_first=dispatchNumber)
    # print(doing_Device)

    if devices_first[0] == '':
        devices_first = []

    for device in doing_Device:
        print(devices_first)

        check = next((x for x in devices_first if int(x) == device.id), None)
        # print("================================")
        # print(device)
        # print(check)
        if check == None:

            Device.objects.filter(id=device.id).update(dispatch_first=None)
            MqttClass().go_publish("{}".format(
                str(Device.objects.get(id=int(device.id)).client_id)), "99999")

    # doing_Device.update(dispatch_first=None)

    for device in devices_first:
        if device != '':

            checker = Device.objects.filter(id=int(device))
            # print("-+------------------------")
            # print(device)
            # print(checker)
            if checker[0].dispatch_first == dispatchNumber:
                continue

            buf_device = DeviceCount.objects.filter(
                device=checker[0], dispatchNumber=dispatchNumber).order_by("-id")
            count = 0

            if len(buf_device) != 0:

                # print('herre')
                # print(buf_device[0].count)
                # print(buf_device[0].dispatchNumber)
                count = buf_device[0].count

            Device.objects.filter(id=int(device)).update(
                dispatch_first=dispatchNumber, count=count)
            # print(Device.objects.get(id=int(device)).client_id)
            MqttClass().go_publish("{}_dispatch".format(
                str(Device.objects.get(id=int(device)).client_id)), dispatchNumber)
            MqttClass().go_publish("{}".format(
                str(Device.objects.get(id=int(device)).client_id)), "99999")
    for device in devices_second:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_second=dispatchNumber)
    for device in devices_third:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_third=dispatchNumber)
    for device in devices_4:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_4=dispatchNumber)
    for device in devices_5:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_5=dispatchNumber)
    for device in devices_6:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_6=dispatchNumber)
    for device in devices_7:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_7=dispatchNumber)
    for device in devices_8:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_8=dispatchNumber)

    if queryset[0].real_start_date == None:
        queryset.update(
            real_start_date=datetime.today().strftime('%Y-%m-%d %H:%M:%S'), status=1)
    else:
        queryset.update(status=1)
    print(publish_count)
    queryset.update(publish_count=publish_count)

    MqttClass().go_publish("web_reset", "")
    # print('pk')
    # print(queryset)
    return {'status': 'success', 'msg': 'ok'}


# 預先排工
def book_dispatch(**kwargs):
    devices_second = kwargs.get('devices_second').split(
        ',') if kwargs.get('devices_second') != None else []
    devices_third = kwargs.get('devices_third').split(
        ',') if kwargs.get('devices_third') != None else []
    devices_4 = kwargs.get('devices_4').split(
        ',') if kwargs.get('devices_4') != None else []
    devices_5 = kwargs.get('devices_5').split(
        ',') if kwargs.get('devices_5') != None else []
    devices_6 = kwargs.get('devices_6').split(
        ',') if kwargs.get('devices_6') != None else []
    devices_7 = kwargs.get('devices_7').split(
        ',') if kwargs.get('devices_7') != None else []
    devices_8 = kwargs.get('devices_8').split(
        ',') if kwargs.get('devices_8') != None else []

    dispatchNumber = kwargs.get('dispatchNumber')

    queryset = DispatchList.objects.filter(dispatchNumber=dispatchNumber)

    if len(queryset) == 0:
        return {'status': 'failed', 'msg': 'dispatch is not found.'}

    for device in devices_second:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_second=dispatchNumber)
    for device in devices_third:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_third=dispatchNumber)
    for device in devices_4:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_4=dispatchNumber)
    for device in devices_5:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_5=dispatchNumber)
    for device in devices_6:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_6=dispatchNumber)
    for device in devices_7:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_7=dispatchNumber)
    for device in devices_8:
        if device != '':
            Device.objects.filter(id=int(device)).update(
                dispatch_8=dispatchNumber)

    return {'status': 'success', 'msg': 'ok'}


# 查看工單每日生產情況 暫存版本
def search_dispatch_history(**kwargs):
    dispatchNumber = kwargs.get('dispatchNumber')

    dispatch = DispatchList.objects.filter(dispatchNumber=dispatchNumber)

    if len(dispatch) == 0:
        return {'status': 'failed', 'msg': 'cannot find dispatch.'}

    cursor = connection.cursor()

    cursor.execute("select DATE(pd.date_time) as date_time ,max(pd.count),pd.device_id,pd2.\"name\", pd.\"user_id\" \
    from post_devicecount pd ,post_device pd2 \
where  pd.dispatchNumber='{}' and pd.device_id =pd2.id  \
GROUP by DATE(pd.date_time),pd.device_id".format(dispatchNumber))

    print("select DATE(pd.date_time) as date_time ,max(pd.count),pd.device_id,pd2.\"name\" from post_devicecount pd ,post_device pd2 \
where  pd.dispatchNumber='{}' and pd.device_id =pd2.id  \
GROUP by DATE(pd.date_time),pd.device_id".format(dispatchNumber))

    queryset = cursor.fetchall()
    device_dispatch_list = []

    for obj in queryset:
        device_dispatch_list.append({
            "device_name": obj[3],
            "device_id": obj[2],
            "count": obj[1],
            "date_time": obj[0],
            "user": User.objects.get(id=obj[4]).name,
        })
    cursor.close()
    return device_dispatch_list

# 查看工單每日生產情況


def search_deviceDispatch_history(**kwargs):
    dispatchNumber = kwargs.get('dispatchNumber')
    dispatchlist = DeviceDispatch.objects.filter(
        dispatchNumber=dispatchNumber).order_by("-id")

    return dispatchlist

# 結單完工


def finish_dispatch(**kwargs):
    dispatchNumber = kwargs.get('dispatchNumber')

    dispatch = DispatchList.objects.filter(dispatchNumber=dispatchNumber)
    print(dispatch)

    if len(dispatch) == 0:
        return {'status': 'failed', 'msg': 'cannot find dispatch.'}

    dispatch.update(
        status=2, real_end_date=datetime.today().strftime('%Y-%m-%d %H:%M:%S'))

    cursor = connection.cursor()

    cursor.execute("select max(pd.count) as count  ,pd2.\"name\",pd.device_id,pd2.\"user_id\" ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
where \"dispatchNumber\" ='{}'  \
and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
and pd.device_id =pd2.id  \
group by pd2.\"name\" ,pd.device_id ".format(dispatchNumber))

    print("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
where \"dispatchNumber\" ='{}'  \
and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
and pd.device_id =pd2.id  \
group by pd2.\"name\" ,pd.device_id ".format(dispatchNumber))

    queryset = cursor.fetchall()
    device_dispatch_list = []

    for obj in queryset:
        device_dispatch_list.append(DeviceDispatch(
            device=Device.objects.get(id=obj[2]),
            user=User.objects.get(id=obj[3]),
            count=obj[0],
            dispatchNumber=dispatchNumber,
            # user=
        ))

    DeviceDispatch.objects.bulk_create(device_dispatch_list)
    cursor.close()

    device = Device.objects.filter(dispatch_first=dispatchNumber)
    for each in device:
        each.count = 0
        each.dispatch_first = each.dispatch_second
        each.dispatch_second = each.dispatch_third
        each.dispatch_third = each.dispatch_4
        each.dispatch_4 = each.dispatch_5
        each.dispatch_5 = each.dispatch_6
        each.dispatch_6 = each.dispatch_7
        each.dispatch_7 = each.dispatch_8
        each.dispatch_8 = None

        if each.dispatch_first != None:
            buf_device = DeviceCount.objects.filter(
                device=each, dispatchNumber=each.dispatch_first).order_by("-id")
            if len(buf_device) != 0:
                each.count = buf_device[0].count
            buf_dispatch = DispatchList.objects.get(
                dispatchNumber=each.dispatch_first)

            if buf_dispatch.status == 0:
                buf_dispatch.status = 1
            if buf_dispatch.real_start_date == None:
                buf_dispatch.real_start_date = datetime.today().strftime('%Y-%m-%d %H:%M:%S')
            buf_dispatch.save()

        MqttClass().go_publish("{}".format(
            str(Device.objects.get(id=int(each.id)))), "99999")

    Device.objects.bulk_update(device, [
                               'count', 'dispatch_first', 'dispatch_second', 'dispatch_third',
                               'dispatch_4', 'dispatch_5', 'dispatch_6', 'dispatch_7', 'dispatch_8'
                               ])

    for each in device:
        MqttClass().go_publish("{}".format(
            str(Device.objects.get(id=int(each.id)))), "99999")

    MqttClass().go_publish("web_reset", "")

# 工單查詢


def select_dispatch_by_status(**kwargs):
    status = kwargs.get('status')
    queryset = DispatchList.objects.filter(status=status)
    return queryset

# 工單查詢設備計數


def select_dispatch_by_device_limit_1(**kwargs):

    dispatchNumber = kwargs.get('dispatchNumber')

    cursor = connection.cursor()
    print("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
where \"dispatchNumber\" ='{}'  \
and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
and pd.device_id =pd2.id  \
group by pd2.\"name\" ,pd.device_id ".format(dispatchNumber))

    cursor.execute("select max(pd.count) as count  ,pd2.\"name\",pd.device_id ,max(pd.id) as id,max(pd.date_time)from post_devicecount pd, post_device pd2 \
where \"dispatchNumber\" ='{}'  \
and pd.device_id in (select distinct (device_id) device_id from post_devicecount) \
and pd.device_id =pd2.id  \
group by pd2.\"name\" ,pd.device_id ".format(dispatchNumber))

    queryset = cursor.fetchall()
    # print(queryset)
    json_data = []
    for obj in queryset:
        json_data.append({
            "count": obj[0],
            "name": obj[1],
            "device_id": obj[2],
            "date_time": obj[4]
        })
    cursor.close()

    return json_data


# 查詢deviceCount today by device
def select_deviceCount_by_device(**kwargs):

    user_id = kwargs.get('user_id')

    cursor = connection.cursor()

    cursor.execute("select max(count),dispatchNumber,DATE(date_time) from \
(select DISTINCT (dispatchNumber) dispatchNumber,count,date_time from post_devicecount where user_id ={}) \
where DATE(date_time)='{}' \
group by dispatchNumber".format(user_id, datetime.today().strftime('%Y-%m-%d')))

    queryset = cursor.fetchall()
    # print(queryset)
    json_data = []
    for obj in queryset:
        json_data.append({
            "count": obj[0],
            "date_time": obj[2],
            "user": user_id,
            "dispatchNumber": obj[1],
            "product_name": DispatchList.objects.get(dispatchNumber=obj[1]).product_name,
            "material_code": DispatchList.objects.get(dispatchNumber=obj[1]).material_code,
            "id": 0,
        })
    cursor.close()

    return json_data
