from django.urls import path
from userapi import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('signup/', views.apisignup , name='apisignup'),
    path('login/', views.apilogin , name='apilogin'),
    path('logout/', views.apilogout, name='apilogout'),
    path('forgotpass/', views.apiforgotpass, name='apiforgotpass'),
    path('reset/', views.apipassreset, name='apipassreset'),
    path('changepass/', views.apichangepass, name='apichangepass'),
    path('movielist/', views.movielist, name='apimovielist'),
    path('viewmovie/', views.viewmovie, name='apiviewmovie'),
    path('playmovie/', views.playmovie, name='apiplaymovie'),
    path('viewplans/', views.subplans, name='apiplans'),
    path('myplans/', views.myplan, name='apimyplan'),
    path('watchhistory/', views.watchhistory, name='apiwatchhistory'),
    path('watchlater/', views.watchlater, name='apiwatchlater'),
    path('addwatchlater/', views.addwatchlater, name='apiaddwatchlater'),
    path('delwatchlater/', views.delwatchlater, name='apidelwatchlater'),
    path('planorder/', views.plan_order, name='apiorderplan'),
    path('purchase/', views.purchase, name='purchase'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)