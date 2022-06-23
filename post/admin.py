from django.contrib import admin
from .models import Device, DeviceCount, Setting, Workshop, WorkShipDispatch, DeviceDispatch, SendMailSetting, DispatchList, User
from django.db.models import Count

# Register your models here.

# class PostAdmin(admin.ModelAdmin):
#     list_display = ('id', 'title', 'content')
#     search_field = ('title', 'content')


# class HistoryAdmin(admin.ModelAdmin):
#     list_display = (
#         'id',
#         'thickness',
#         'material_temp',
#         'temp',
#         'humidity',
#         'yaw',
#         'alarm',
#         'mark',
#         'date_time',
#     )
#     search_field = (
#         'thickness',
#         'material_temp',
#         'temp',
#         'humidity',
#         'yaw',
#         'alarm',
#         'mark',
#         'date_time',
#     )
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'auth',
        'account',
        'password',
        'email'
    )
    search_field = (
        'id',
        'name',
        'auth',
        'email'
    )


class SettingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'args',
        'avg_value',
        'upper_limit',
        'lower_limit',
        'date_time',
    )
    search_field = (
        'name',
        'args',
        'avg_value',
        'upper_limit',
        'lower_limit',
        'date_time',
    )


class WorkshopAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'date_time',
    )
    list_filter = (
        'id',
        'name',
        'date_time',
    )
    search_fields = (
        'id',
        'name',
        'date_time',
    )
    ordering = ('-id', '-date_time')


class WorkshopDispatchAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'workshop',
        'all_count',
        # 'DeviceDispatch',
        'date_time',
    )
    list_filter = (
        'id',
        'workshop',
        'all_count',
        # 'DeviceDispatch',
        'date_time',
    )
    search_fields = (
        'id',
        'workshop',
        'date_time',
    )
    ordering = ('-id', '-date_time', 'all_count',)


class DispatchListAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'department',
        'dispatchNumber',
        'guess_start_date',
        'guess_end_date',
        'material_code',
        'product_name',
        'qt_count',
        'real_count',
        'error_count',
        'publish_count',
        'publish_status',
        'status'
    )
    search_fields = (
        'id',
        'department',
        'dispatchNumber',
        'guess_start_date',
        'guess_end_date',
        'material_code',
        'product_name',
        'status'
    )
    ordering = ('-id', '-status', '-guess_end_date',)


class DeviceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'workshop',
        'client_id',
        'user',
        'status',
        'date_time',
        'count',
        'dispatch_first',
        'dispatch_second',
        'dispatch_third',
    )
    list_filter = (
        'id',
        'name',
        'workshop',
        'client_id',
        'status',
        'date_time',
        'count'
    )
    search_fields = (
        'id',
        'name',
        'workshop',
        'client_id',
        'status',
        'date_time',
        'count',
        'dispatch_first',
        'dispatch_second',
        'dispatch_third',
    )
    ordering = ('-id', '-date_time', '-workshop',)


class DeviceDispatchAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'device',
        'date_time',
        'count',
        'user',
        'dispatchNumber'
    )
    list_filter = (
        'id',
        'device',
        'date_time',
        'count',
        'user',
        'dispatchNumber'
    )
    search_fields = (
        'id',
        'device',
        'date_time',
        'count',
        'user',
        'dispatchNumber'
    )
    ordering = ('-date_time',)


class DeviceCountAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'device',
        'date_time',
        'count',
        'dispatchNumber',
        'user'
    )
    list_filter = (
        # 'id',
        'device',
        'date_time',
        'dispatchNumber',
        'user'
        # 'count'
    )
    search_fields = (
        # 'id',
        'device',
        'date_time',
        'dispatchNumber',
        'user'
        # 'count'
    )
    ordering = ('-date_time',)
    # save_as = True
    # save_on_top = True
    # change_list_template = 'change_list_graph.html'


class SendMailSettingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'create_time',
        'send_time',
        'send_group'
    )
    list_filter = (
        # 'id',
        'name',
        'create_time',
        # 'count'
    )
    search_fields = (
        # 'id',
        'name',
        'create_time',
        'send_group',
        # 'count'
    )
    ordering = ('-create_time',)


# admin.site.register(Post, PostAdmin)
# admin.site.register(History, HistoryAdmin)
admin.site.register(Setting, SettingAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Workshop, WorkshopAdmin)
admin.site.register(DispatchList, DispatchListAdmin)

admin.site.register(Device, DeviceAdmin)
admin.site.register(DeviceDispatch, DeviceDispatchAdmin)
admin.site.register(WorkShipDispatch, WorkshopDispatchAdmin)
admin.site.register(DeviceCount, DeviceCountAdmin)
admin.site.register(SendMailSetting, SendMailSettingAdmin)
