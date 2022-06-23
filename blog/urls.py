"""blog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
# from post.views import PostListView, PostDetailView
from rest_framework import routers, permissions
from post import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="pinhao@iii.org.tw"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()
# router.register(r'posts', views.PostView, 'post')
# router.register(r'historys', views.HistoryView, 'history')
router.register(r'settings', views.SettingView, 'setting')
router.register(r'devices', views.DeviceView, 'device')
router.register(r'devicecounts', views.DeviceCountView, 'deviceCount')
router.register(r'devicedispatch', views.DeviceDispatchView, 'deviceDispatch')
router.register(r'workshopdispatch', views.WorkShipDispatchView, 'workshopdispatch')
router.register(r'workshop', views.WorkShipDispatchView, 'workshop')
router.register(r'dispatchlist', views.DispatchListView, 'dispatchlist')
router.register(r'upload', views.UploadDispatchFileView, 'upload')
router.register(r'user', views.UserView, 'user')

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^swagger(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger',
        cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc',
        cache_timeout=0), name='schema-redoc'),
    # path('', PostListView.as_view()),
    # path('<pk>', PostDetailView.as_view())
    path('api/', include(router.urls)),

]
