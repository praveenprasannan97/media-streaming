from django.urls import path, include

urlpatterns = [
    path('', include('appone.urls')),
    path('api/', include('userapi.urls')),
]