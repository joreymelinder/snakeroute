from __future__ import unicode_literals

#from django.db import models
from django.contrib.gis.db import models

# Create your models here.
class Road(models.Model):
    linearid = models.CharField(max_length=22)
    fullname = models.CharField(max_length=100)
    rttyp = models.CharField(max_length=1)
    mtfcc = models.CharField(max_length=5)
    geom = models.MultiLineStringField(srid=4326)
    def __str__(self):
        return self.fullname+' - '+self.linearid

class SchoolDistrict(models.Model):
    statefp = models.CharField(max_length=2)
    lea = models.CharField(max_length=5)
    geoid = models.CharField(max_length=7)
    name = models.CharField(max_length=100)
    lsad = models.CharField(max_length=2)
    lograde = models.CharField(max_length=2)
    higrade = models.CharField(max_length=2)
    mtfcc = models.CharField(max_length=5)
    sdtyp = models.CharField(max_length=1)
    funcstat = models.CharField(max_length=1)
    aland = models.FloatField()
    awater = models.FloatField()
    intptlat = models.CharField(max_length=11)
    intptlon = models.CharField(max_length=12)
    geom = models.MultiPolygonField(srid=-1)
    def __unicode__(self):
        return self.name

class School(models.Model):
    name = models.CharField(max_length=50)
    phone = models.BigIntegerField()
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=25)
    state = models.CharField(max_length=2)
    zipcode = models.BigIntegerField()
    zipcode4 = models.BigIntegerField()
    lat = models.FloatField()
    lng = models.FloatField()
    gradeLow = models.CharField(max_length=5)
    gradeHigh = models.CharField(max_length=5)
    leaid = models.BigIntegerField()
    schno = models.BigIntegerField()
    lea = models.CharField(max_length=60)
    district = models.ForeignKey('SchoolDistrict',on_delete=models.SET_NULL, null=True)
    location = models.PointField(null=True)
    def __unicode__(self):
        return self.name
