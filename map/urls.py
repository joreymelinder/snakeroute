from django.conf.urls import url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from . import views
app_name = 'map'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'get_directions', views.get_directions, name='get_directions'),
    url(r'get_school_district', views.get_school_district, name='get_school_district'),
    url(r'get_schools', views.get_schools, name='get_schools'),
    url(r'get_school_rating', views.get_school_rating, name='get_school_rating'),
]

urlpatterns += staticfiles_urlpatterns()
