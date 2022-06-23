from dataclasses import field
from rest_framework import serializers
from .models import  Setting, Device, DeviceCount,DeviceDispatch,Workshop,WorkShipDispatch,DispatchList,User


# class PostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = ('id', 'title', 'content')


# class HistorySeializer(serializers.ModelSerializer):
#     class Meta:
#         model = History
#         fields = (
#             'id',
#             'thickness',
#             'material_temp',
#             'temp',
#             'humidity',
#             'yaw',
#             'alarm',
#             'mark',
#             'date_time',
#         )

class WorkshopSeializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = (
            'id',
            'name',
            'date_time',
        )
class WorkShipDispatchSeializer(serializers.ModelSerializer):
    class Meta:
        model = WorkShipDispatch
        fields = (
            'id',
            'workshop',
            'all_count',
            'date_time',
            'DeviceDispatch'
        )

class SettingSeializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = (
            'id',
            'name',
            'args',
            'avg_value',
            'upper_limit',
            'lower_limit',
            'date_time',
        )
class UserSeializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields=(
            'id',
            'name',
            'auth',
            'account',
            'password',
            'email'
        )

class DispatchListSeializer(serializers.ModelSerializer):
    class Meta:
        model = DispatchList
        fields = (
            'id',
            'department',
            'dispatchNumber',
            'real_start_date',
            'real_end_date',
            'guess_start_date',
            'guess_end_date',
            'generate_start_date',
            'material_code',
            'product_name',
            'specification',
            'qt_count',
            'real_count',
            'error_count',
            'publish_count',
            'publish_status',
            'status'
        )

class DeviceDispatchSeializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceDispatch
        fields = (
            'id',
            'device',
            'count',
            'user',
            'date_time',
            'dispatchNumber'
        )

class DeviceSeializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = (
            'id',
            'name',
            'client_id',
            'date_time',
            'user',
            'status',
            'count',
            'dispatch_first',
            'dispatch_second',
            'dispatch_third',
            'dispatch_4',
            'dispatch_5',
            'dispatch_6',
            'dispatch_7',
            'dispatch_8',
        )


class DeviceCountSeializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceCount
        fields = (
            'id',
            'device',
            'date_time',
            'count',
            'dispatchNumber',
            'user'
        )
