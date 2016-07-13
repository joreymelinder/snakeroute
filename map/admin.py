from django.contrib.gis import admin
from .models import Road,SchoolDistrict,School

# Register your models here.
admin.site.register(Road, admin.GeoModelAdmin)
admin.site.register(SchoolDistrict, admin.GeoModelAdmin)
admin.site.register(School, admin.GeoModelAdmin)
