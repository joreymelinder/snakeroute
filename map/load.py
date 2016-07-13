import os
import map
import zipfile
from django.contrib.gis.gdal import DataSource
from django.contrib.gis.utils import LayerMapping
from .models import Road

road_mapping = {
    'linearid' : 'LINEARID',
    'fullname' : 'FULLNAME',
    'rttyp' : 'RTTYP',
    'mtfcc' : 'MTFCC',
    'geom' : 'MULTILINESTRING',
}


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
        lm = LayerMapping(
            Road, shp, road_mapping,
            transform=False, encoding='iso-8859-1',
        )
        lm.save(strict=True, verbose=verbose,progress=True)
