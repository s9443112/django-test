# Generated by Django 3.1 on 2022-06-17 03:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0005_auto_20220617_0325'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.CharField(default='iii@gmail.com', max_length=100, verbose_name='Email'),
        ),
    ]
