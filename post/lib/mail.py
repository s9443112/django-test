from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from datetime import datetime

class SendMail(object):
   

    def send_file(email_list: list,msg: str,title:str,file: object):
        today = datetime.now().date()

        email_template = render_to_string(
            'mail.html',
            {'datetime': today}
        )

        email = EmailMessage(
            title,  # 電子郵件標題
            email_template,  # 電子郵件內容
            settings.EMAIL_HOST_USER,  # 寄件者
            email_list
            # ['s9443112@gmail.com']
            # ['s9443112@gmail.com','ryanchen01@iii.org.tw','pinhao@iii.org.tw','garyli@iii.org.tw','louislai@iii.org.tw','janli@iii.org.tw','emilywang@iii.org.tw','samuello@iii.org.tw']  # 收件者
            # ['sherry.ee06@g2.nctu.edu.tw','s9443112@gmail.com']
        )
        email.attach_file(file)
        email.fail_silently = False

        # print("肏你媽老資")
        email.send()
    def send_already_finish(msg: str,title:str):

        email_template = render_to_string(
            'finish.html',
            {'msg': msg}
        )

        email = EmailMessage(
            title,  # 電子郵件標題
            email_template,  # 電子郵件內容
            settings.EMAIL_HOST_USER,  # 寄件者
            ['s9443112@gmail.com']
            # ['s9443112@gmail.com','ryanchen01@iii.org.tw','pinhao@iii.org.tw','garyli@iii.org.tw','louislai@iii.org.tw','janli@iii.org.tw','emilywang@iii.org.tw','samuello@iii.org.tw']  # 收件者
            # ['sherry.ee06@g2.nctu.edu.tw','s9443112@gmail.com']
        )
        
        email.fail_silently = False

        # print("肏你媽老資")
        email.send()

