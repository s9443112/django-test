# Generated by Django 3.1 on 2022-06-15 08:40

import datetime
from django.db import migrations, models
import django.db.models.deletion
import post.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='名稱')),
                ('client_id', models.CharField(max_length=50, verbose_name='client_id')),
                ('date_time', post.models.DateTimeWithoutTZField(auto_now_add=True, max_length=50, verbose_name='時間戳記')),
                ('status', models.BooleanField(default=True, max_length=20, verbose_name='是否開機')),
                ('count', models.IntegerField(default=0, verbose_name='次數')),
                ('dispatch_first', models.CharField(blank=True, default=None, max_length=50, null=True, verbose_name='dispatch_first')),
                ('dispatch_second', models.CharField(blank=True, default=None, max_length=50, null=True, verbose_name='dispatch_second')),
                ('dispatch_third', models.CharField(blank=True, default=None, max_length=50, null=True, verbose_name='dispatch_third')),
            ],
            options={
                'verbose_name': '設備',
                'verbose_name_plural': '設備',
            },
        ),
        migrations.CreateModel(
            name='DeviceDispatch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_time', post.models.DateTimeWithoutTZField(blank=True, default=datetime.datetime.now)),
                ('count', models.IntegerField(default=0, verbose_name='次數')),
                ('dispatchNumber', models.CharField(max_length=50, verbose_name='工單編號')),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.device')),
            ],
            options={
                'verbose_name': '設備報工',
                'verbose_name_plural': '設備報工',
            },
        ),
        migrations.CreateModel(
            name='DispatchList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('department', models.CharField(blank=True, default=None, max_length=50, null=True, verbose_name='部門')),
                ('dispatchNumber', models.CharField(max_length=50, verbose_name='工單編號')),
                ('real_start_date', post.models.DateTimeWithoutTZField(blank=True, default=None, null=True, verbose_name='實際開工日')),
                ('real_end_date', post.models.DateTimeWithoutTZField(blank=True, default=None, null=True, verbose_name='實際完工日')),
                ('guess_start_date', post.models.DateTimeWithoutTZField(blank=True, default=datetime.datetime.now, null=True, verbose_name='預計開工日')),
                ('guess_end_date', post.models.DateTimeWithoutTZField(blank=True, default=datetime.datetime.now, null=True, verbose_name='預計完工日')),
                ('generate_start_date', post.models.DateTimeWithoutTZField(blank=True, default=datetime.datetime.now, verbose_name='建立日期')),
                ('material_code', models.CharField(max_length=50, verbose_name='料件編號')),
                ('product_name', models.CharField(max_length=50, verbose_name='品名')),
                ('specification', models.CharField(max_length=50, verbose_name='規格')),
                ('qt_count', models.IntegerField(default=0, verbose_name='應完成數量')),
                ('real_count', models.IntegerField(blank=True, default=0, null=True, verbose_name='實際完成數量')),
                ('status', models.IntegerField(default=0, verbose_name='狀態')),
            ],
            options={
                'verbose_name': '工單列表',
                'verbose_name_plural': '工單列表',
            },
        ),
        migrations.CreateModel(
            name='Setting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='名稱')),
                ('args', models.CharField(max_length=50, verbose_name='參數')),
                ('avg_value', models.FloatField(max_length=50, verbose_name='預估值')),
                ('upper_limit', models.FloatField(max_length=50, verbose_name='上限')),
                ('lower_limit', models.FloatField(max_length=50, verbose_name='下限')),
                ('date_time', post.models.DateTimeWithoutTZField(max_length=50, verbose_name='時間戳記')),
            ],
            options={
                'verbose_name': '設定',
                'verbose_name_plural': '設定',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='名稱')),
                ('auth', models.IntegerField(default=1, verbose_name='權限')),
                ('account', models.CharField(max_length=50, verbose_name='帳號')),
                ('password', models.CharField(default='123456', max_length=50, verbose_name='密碼')),
            ],
            options={
                'verbose_name': '使用者',
                'verbose_name_plural': '使用者',
            },
        ),
        migrations.CreateModel(
            name='Workshop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='名稱')),
                ('date_time', post.models.DateTimeWithoutTZField(auto_now_add=True, max_length=50, verbose_name='時間戳記')),
            ],
            options={
                'verbose_name': '工作站',
                'verbose_name_plural': '工作站',
            },
        ),
        migrations.CreateModel(
            name='WorkShipDispatch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('all_count', models.IntegerField(default=0, verbose_name='總次數')),
                ('date_time', post.models.DateTimeWithoutTZField(blank=True, default=datetime.datetime.now)),
                ('DeviceDispatch', models.ManyToManyField(to='post.DeviceDispatch')),
                ('workshop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.workshop')),
            ],
            options={
                'verbose_name': '工作站報工',
                'verbose_name_plural': '工作站報工',
            },
        ),
        migrations.CreateModel(
            name='SendMailSetting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='寄件名稱')),
                ('send_time', post.models.DateTimeWithoutTZField(blank=True, default=datetime.datetime.now)),
                ('create_time', post.models.DateTimeWithoutTZField(auto_now_add=True, max_length=50, verbose_name='時間戳記')),
                ('is_open', models.BooleanField(default=True, max_length=20, verbose_name='是否啟用')),
                ('send_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.group')),
            ],
            options={
                'verbose_name': '寄件設定',
                'verbose_name_plural': '寄件設定',
            },
        ),
        migrations.AddField(
            model_name='devicedispatch',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.user'),
        ),
        migrations.CreateModel(
            name='DeviceCount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_time', post.models.DateTimeWithoutTZField(blank=True, default=datetime.datetime.now)),
                ('count', models.IntegerField(default=0, verbose_name='次數')),
                ('dispatchNumber', models.CharField(max_length=50, verbose_name='工單編號')),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.device')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.user')),
            ],
            options={
                'verbose_name': '設備計數',
                'verbose_name_plural': '設備計數',
            },
        ),
        migrations.AddField(
            model_name='device',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.user'),
        ),
        migrations.AddField(
            model_name='device',
            name='workshop',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='post.workshop'),
        ),
    ]
