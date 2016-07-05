from django.shortcuts import render

def index(request):
    return render(request,'map/index.html')

def get_directions(request):
    return render(request,'map/item.html')
