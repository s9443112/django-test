# Generated by Django 3.1 on 2022-06-16 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0002_auto_20220615_1456'),
    ]

    operations = [
        migrations.AddField(
            model_name='dispatchlist',
            name='error_count',
            field=models.IntegerField(default=0, verbose_name='異常數量'),
        ),
    ]