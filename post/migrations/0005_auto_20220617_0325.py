# Generated by Django 3.1 on 2022-06-17 03:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0004_auto_20220617_0208'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='account',
            field=models.CharField(default='user', max_length=50, verbose_name='帳號'),
        ),
    ]