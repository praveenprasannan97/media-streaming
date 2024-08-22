from django.urls import path
from appone import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.admin_login, name='login'),
    path('movielist/', views.movie_list_page, name='movielist'),
    path('logout/', views.logout, name='logout'),
    path('forgotpass/', views.forgot_password, name='forgotpass'),
    path('resetpass/<int:ky>/', views.reset_password, name='resetpass'),
    path('changepass/<str:us>/', views.change_pass, name='changepass'),
    path('addmovie/', views.add_movie, name='addmovie'),
    path('delete/<int:pk>/', views.delete_movie, name='movie_delete'),
    path('edit/<int:pk>/', views.edit_movie, name='movie_edit'),
    path('detail/<int:pk>/', views.view_movie, name='movie_detail'),
    path('userlist/', views.manage_users, name='userlist'),
    path('viewuser/<int:pk>/', views.view_user, name='viewuser'),
    path('usertoggle/<int:pk>/', views.user_toggle, name='usertoggle'),
    path('viewplans/', views.view_plans, name='viewplans'),
    path('plantoggle/<int:pk>/', views.plan_toggle, name='plantoggle'),
    path('plandetails/<int:pk>/', views.plan_details, name='plandetails'),
    path('addplan/', views.add_plan, name='addplan'),
    path('monthsub/', views.month_sub, name='monthsub'),
    path('monthrev/', views.month_rev, name='monthrev'),
    path('mostviewed/', views.most_viewed, name='mostviewed'),
    path('mostrated/', views.most_rated, name='mostrated'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)