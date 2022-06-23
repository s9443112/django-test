make model dot png 

python ./manage.py graph_models -a -X User,Group,LogEntry,ContentType,Permission,Session,AbstractUser,AbstractBaseSession -o my_project_sans_foo_bar.png


$ cd docker/iii_container

$ docker-compose up -d