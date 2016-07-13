import csv

reader=csv.DictReader(open('schooldb.csv'))
typeInt={}
typeFloat={}
typeStr={}
lens={}

for name in reader.fieldnames:
 typeInt[name]=0
 typeFloat[name]=0
 typeStr[name]=0
 lens[name]=0

for row in reader:
 print row['name']
 for name in reader.fieldnames:
  val = row[name]
  if val.replace('-','').replace('.','').isdigit():
   if val.replace('-','').isdigit():
    typeInt[name]+=1
   else:
    typeFloat[name]+=1
  else:
   typeStr[name]+=1
  if len(val)>lens[name]:
   lens[name]=len(val)

reader=csv.DictReader(open('schooldb.csv'))
for row in reader:
 s = School.objects.create(leaid=-1,schno=-1,phone=-1,zipcode=-1,zipcode4=-1,lat=-1,lng=-1)
 print row['name']
 s.name = row['name']
 try:
  s.phone = int(row['phone'])
 except:
  pass
 s.address = row['address']
 s.city=row['city']
 s.state=row['state']
 try:
  s.zipcode = int(row['zipcode'])
 except:
  pass
 try:
  s.zipcode4 = int(row['zipcode4'])
 except:
  pass
 try:
  s.lat=float(row['lat'])
 except:
  pass
 try:
  s.lng=float(row['lng'])
 except:
  pass

 s.students=row['students']
 s.teachers=row['teachers']
 s.gradeLow=row['gradeLow']
 s.gradeHigh=row['gradeHigh']
 try:
  s.leaid = int(row['leaid'])
 except:
  pass
 try:
  s.schno = int(row['schno'])
 except:
  pass
 s.lea=row['lea']
 s.save()


reader=csv.DictReader(open('schooldb.csv'))

edgecases={}
for name in reader.fieldnames:
 edgecases[name]=[]

for row in reader:
 for name in reader.fieldnames:
  if not dataType[name]:
      val = row[name]
      maxType = max(typeInt[name],typeFloat[name],typeStr[name])
      if val.replace('-','').replace('.','').isdigit():
       if val.replace('-','').isdigit():
        if maxType!=typeInt[name]:
         edgecases[name].append(val)
       else:
        if maxType!=typeFloat[name]:
          edgecases[name].append(val)
      else:
       if maxType!=typeStr[name]:
         edgecases[name].append(val)

for k in edgecases:
  if len(edgecases[k]):
   print k


for name in reader.fieldnames:
    if typeInt[name]==int(reader.line_num-1):
        dataType[name]=int
        print name+' = models.IntegerField()'
    elif typeFloat[name]==int(reader.line_num-1):
        dataType[name]=float
        print name+' = models.FloatField()'
    elif typeStr[name]==int(reader.line_num-1):
        dataType[name]=str
        print name+' = models.CharField(max_length=%s)'%lens[name]
    else:
        dataType[name]=None
        print name+' - int: %s, float: %s, str: %s, maxLen: %s'%(typeInt[name],typeFloat[name],typeStr[name],lens[name])

for name in reader.fieldnames:
    print name+' - %s'%dataType[name]
