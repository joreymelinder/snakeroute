from django.conf.urls import url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from . import views
app_name = 'map'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'get_directions', views.get_directions, name='get_directions'),
]

urlpatterns += staticfiles_urlpatterns()
