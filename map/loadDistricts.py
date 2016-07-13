import os
import map
import zipfile
from django.contrib.gis.gdal import DataSource
from django.contrib.gis.utils import LayerMapping
from .models import Road, SchoolDistrict

elsd = {
    'statefp' : 'STATEFP',
    'lea' : 'ELSDLEA',
    'geoid' : 'GEOID',
    'name' : 'NAME',
    'lsad' : 'LSAD',
    'lograde' : 'LOGRADE',
    'higrade' : 'HIGRADE',
    'mtfcc' : 'MTFCC',
    'sdtyp' : 'SDTYP',
    'funcstat' : 'FUNCSTAT',
    'aland' : 'ALAND',
    'awater' : 'AWATER',
    'intptlat' : 'INTPTLAT',
    'intptlon' : 'INTPTLON',
    'geom' : 'MULTIPOLYGON',
}
scsd = {
    'statefp' : 'STATEFP',
    'lea' : 'SCSDLEA',
    'geoid' : 'GEOID',
    'name' : 'NAME',
    'lsad' : 'LSAD',
    'lograde' : 'LOGRADE',
    'higrade' : 'HIGRADE',
    'mtfcc' : 'MTFCC',
    'sdtyp' : 'SDTYP',
    'funcstat' : 'FUNCSTAT',
    'aland' : 'ALAND',
    'awater' : 'AWATER',
    'intptlat' : 'INTPTLAT',
    'intptlon' : 'INTPTLON',
    'geom' : 'MULTIPOLYGON',
}
unsd = {
    'statefp' : 'STATEFP',
    'lea' : 'UNSDLEA',
    'geoid' : 'GEOID',
    'name' : 'NAME',
    'lsad' : 'LSAD',
    'lograde' : 'LOGRADE',
    'higrade' : 'HIGRADE',
    'mtfcc' : 'MTFCC',
    'sdtyp' : 'SDTYP',
    'funcstat' : 'FUNCSTAT',
    'aland' : 'ALAND',
    'awater' : 'AWATER',
    'intptlat' : 'INTPTLAT',
    'intptlon' : 'INTPTLON',
    'geom' : 'MULTIPOLYGON',
}

mappings={'unsd':unsd,'scsd':scsd,'elsd':elsd}

data = os.path.join(os.path.dirname(map.__file__),'data')
# Auto-generated `LayerMapping` dictionary for Road model
def run(verbose=True):
    """
    for county in os.listdir(data):
        lm = LayerMapping(
            Road, os.path.join(data,county,county+'.shp'), road_mapping,
            transform=False, encoding='iso-8859-1',
        )
        lm.save(strict=True, verbose=verbose)
    """
    for z in os.listdir(data+'/zipped/'):
        zipname = z[:len(z)-4]
        zf = zipfile.ZipFile(data+'/zipped/'+z,mode='r')
        zf.extractall(path=os.path.join(data,'unzipped',zipname))
        shp=os.path.join(data,'unzipped',zipname,zipname+'.shp')
        distype = zipname[len(zipname)-4:]


        lm = LayerMapping(
            SchoolDistrict, shp, mappings[distype],
            transform=False, encoding='iso-8859-1',
        )

        lm.save(strict=True, verbose=verbose,progress=True)
