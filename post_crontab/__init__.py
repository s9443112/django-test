from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job

from post.models import SendMailSetting
from django.forms.models import model_to_dict
from post.management.commands import export_excel


scheduler = BackgroundScheduler(timezone='Asia/Taipei')
working_list = []


def SendExcel(id='SendExcel'):
    print('SendExcel')
    export_excel.Command().handle()
    pass


def select_sendMailSetting(id='checking'):

    global scheduler

    works = SendMailSetting.objects.filter(is_open=1)

    for each in works:
        index = next((
            x for x, item in enumerate(working_list) if item["id"] == each.id), None)

        if index == None:
            working_list.append(model_to_dict(each))
            work = model_to_dict(each)
            print(work["send_time"])
            buffer_time = datetime.strptime(str(work["send_time"]),'%Y-%m-%d %H:%M:%S')
            buffer_id = str(model_to_dict(each)['id'])

            if scheduler.get_job(buffer_id):
                scheduler.remove_job(buffer_id)
            scheduler.add_job(SendExcel, 'cron', hour=buffer_time.hour,
                              minute=buffer_time.minute, args=[buffer_id], id=buffer_id)
        else:
            # print('change state')
            # print(index)

            if working_list[index]["send_time"] != each.send_time:
                working_list[index] = model_to_dict(each)
                print('not equal')
                buffer_time = datetime.strptime(str(working_list[index]["send_time"]),'%Y-%m-%d %H:%M:%S')
                buffer_id = str(model_to_dict(each)['id'])
                if scheduler.get_job(buffer_id):
                    scheduler.remove_job(buffer_id)
                scheduler.add_job(SendExcel, 'cron', hour=buffer_time.hour,
                                minute=buffer_time.minute, args=[buffer_id], id=buffer_id)
            else:
                print('equal')

        # try:

        #     scheduler.remove_job('gogo')
        #     scheduler.add_job(gogo,'interval',seconds=3,args=['gogo'],id='gogo')
        # except Exception as e:
        #     # print(e)
        #     scheduler.add_job(gogo,'interval',seconds=3,args=['gogo'],id='gogo')

        # print(model_to_dict(each)['id'])

    pass


def work_run():
    # 注册定时任务并开始
    global scheduler
    scheduler.add_jobstore(DjangoJobStore(), 'default')
    register_events(scheduler)
    scheduler.start()
    
    if scheduler.get_job('checking') == None:
        scheduler.add_job(select_sendMailSetting, 'interval',
                          seconds=60, args=['checking'], id='checking')


if __name__ == "__main__":
    work_run()
