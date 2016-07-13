from django.shortcuts import render
from .models import SchoolDistrict, School
from django.contrib.gis.geos import Point
from django.http import HttpResponse
from django.core.serializers import serialize
from vectorformats.Formats import Django, GeoJSON
import xml.etree.ElementTree as etree
import urllib2
import re
import json
import random

def index(request):
    return render(request,'map/index.html')

def get_directions(request):
    return render(request,'map/item.html')

def get_school_district(request):
    if request.method=='GET':
        lat = float(request.GET['lat'])
        lng = float(request.GET['lng'])
        pnt = 'POINT('+request.GET['lng']+' '+request.GET['lat']+')'
        #pnt = Point(lng,lat)
        #dis = serialize('geojson',SchoolDistrict.objects.filter(geom__contains=pnt),geometry_field='geom',)
        dis=SchoolDistrict.objects.filter(geom__contains=pnt)
        djf = Django.Django(geodjango='geom',properties=['name'])
        geoj = GeoJSON.GeoJSON()
        s = geoj.encode(djf.decode(dis))
        return HttpResponse(s,content_type="json")

def get_schools(request):
    if request.method=='GET':
        lat = float(request.GET['lat'])
        lng = float(request.GET['lng'])
        pnt = 'POINT('+request.GET['lng']+' '+request.GET['lat']+')'
        #pnt = Point(lng,lat)
        #dis = serialize('geojson',SchoolDistrict.objects.filter(geom__contains=pnt),geometry_field='geom',)
        dis=list(SchoolDistrict.objects.filter(geom__contains=pnt))[0]
        schools=dis.school_set.all()
        djf = Django.Django(geodjango='location',properties=['name','phone','address','city','state','zipcode'])
        geoj = GeoJSON.GeoJSON()
        s = geoj.encode(djf.decode(schools),to_string=False)
#        for school in s['features']:
#            school['properties']['rating']=get_rating(school)
        return HttpResponse(json.dumps(s),content_type="json")

def get_rating(school):
    regexes = [(' EL',' ELEMENTARY'),(' H S',' HIGH SCHOOL'),(' ','+')]
    term = school['properties']['name']
    for r in regexes:
        term = re.sub(r[0],r[1],term)

    url = 'http://api.greatschools.org/search/schools/?callback=?&key=ux3ec6prtm0ujzyhjenfdqxx&state='+school['properties']['state']+'&q='+term+'&limit=1'
    s=etree.parse(urllib2.urlopen(url)).find('school')
    if s is not None:
        if(s.find('gsRating') is not None):
            return float(s.find('gsRating').text)
    return -1

def get_school_rating(request):
    return HttpResponse(random.random()*10)
"""
    if request.method=='GET':
        name = request.GET['name']
        state = request.GET['state']
        regexes = [(' EL',' ELEMENTARY'),(' H S',' HIGH SCHOOL'),(' ','+')]
        term = name
        for r in regexes:
            term = re.sub(r[0],r[1],term)

        url = 'http://api.greatschools.org/search/schools/?callback=?&key=ux3ec6prtm0ujzyhjenfdqxx&state='+state+'&q='+term+'&limit=1'
        s=etree.parse(urllib2.urlopen(url)).find('school')
        if s is not None:
            if(s.find('gsRating') is not None):
                return HttpResponse(float(s.find('gsRating').text))
"""
