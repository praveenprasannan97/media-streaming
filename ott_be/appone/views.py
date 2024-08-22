from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q, Avg, Count, Sum, F
from .forms import login_form, MovieForm, PlansForm, ForgotPass, cpass_form
from .models import movie_list, plans, Subusers, watch_history, subscription
from django.core.mail import send_mail
from django.http import JsonResponse
import random
import calendar

def admin_login(request):
    message = None
    if request.method == 'POST':
        form = login_form(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            user = authenticate(email=email, password=password )
            if user is not None:
                if user.is_staff==1:
                    auth_login(request, user)
                    return redirect('movielist')
                else:
                    message = {'status': 'incorrect email or password!'}
            else:
                message = {'status': 'incorrect email or password!'}
    else:
        form = login_form()
    return render(request,'login.html', {'form': form, 'message': message})

def logout(request):
    auth_logout(request)
    return redirect('login')

def forgot_password(request):
    message = None
    if request.method == 'POST':
        form = ForgotPass(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            if Subusers.objects.filter(email=email).exists():
                ad_user = Subusers.objects.get(email=email)
                random_key = random.randint(10**49, 10**50 - 1)
                ad_user.random_key = random_key
                # ad_user.random_key = None
                ad_user.save()

                subject = f"Password Reset For Movie Time Admin Login"
                from_email = "passwordreset@movietime"
                recipient_list = ["admin@mailtrap.io"]
                plain_message = 'http://127.0.0.1:8000/resetpass/'+str(random_key)+'/'
                send_mail(subject, plain_message, from_email, recipient_list)
                
                message = {'status': 'Email sent successfully, Please check Email to reset your password'}
            else:
                message = {'status': 'Email not found'}
    else:
        form = ForgotPass()

    return render(request, 'forgotpass.html', {'form': form, 'message': message})

def reset_password(request, ky):
    message = None
    if Subusers.objects.filter(random_key=ky).exists():
        ad_user = Subusers.objects.get(random_key=ky)
        form = cpass_form(request.POST)
        if form.is_valid():
            pass1 = form.cleaned_data.get('password')
            pass2 = form.cleaned_data.get('cpassword')
            if pass1 == pass2:
                ad_user.password = make_password(pass1)
                ad_user.random_key = None
                ad_user.save()
                message = {'status': "Password has been reset"}
                return redirect('login')
            else:
                message = {'status': "Passwords doesn't match"}
        else:
            form = cpass_form()
    else:
        return redirect('login')
    return render(request, 'resetpass.html', {'form': form, 'message': message, 'title': 'Reset Admin Password'})

@login_required
def change_pass(request, us):
    message = None
    ad_user = Subusers.objects.get(user_name=us)
    form = cpass_form(request.POST)
    if form.is_valid():
        pass1 = form.cleaned_data.get('password')
        pass2 = form.cleaned_data.get('cpassword')
        if pass1 == pass2:
            ad_user.password = make_password(pass1)
            ad_user.save()
            message = {'status': "Password has been reset"}
            return redirect('movielist')
        else:
            message = {'status': "Passwords doesn't match"}
    else:
            form = cpass_form()
    return render(request, 'resetpass.html', {'form': form, 'message': message, 'title': 'Change Admin Password'})

@login_required
def movie_list_page(request):

    movies = movie_list.objects.annotate(average_rating=Avg('rating__rating'))
    
    for movie in movies:
        if movie.average_rating is not None:
            movie.movie_rating = movie.average_rating
            movie.save()

    query = request.GET.get('q')

    if query:
        movies = movie_list.objects.filter(
            Q(movie_name__icontains=query) | Q(movie_description__icontains=query)
        ).order_by('-id')
    else:
        movies = movie_list.objects.all().order_by('-id')

    paginator = Paginator(movies, 5)  # no of movies per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'movielist.html', {'page_obj': page_obj, 'query': query})

@login_required
def add_movie(request):
    if request.method == 'POST':
        form = MovieForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('movielist')
    else:
        form = MovieForm()
    return render(request, 'addmovie.html', {'form': form})

@login_required
def delete_movie(request, pk):
    movie = get_object_or_404(movie_list, pk=pk)
    if request.method == 'POST':
        movie.delete()
        return redirect('movielist')
    return redirect('movielist')

@login_required
def edit_movie(request, pk):
    movie = get_object_or_404(movie_list, pk=pk)
    if request.method == 'POST':
        form = MovieForm(request.POST, request.FILES, instance=movie)
        if form.is_valid():
            form.save()
            return redirect('movielist')
    else:
        form = MovieForm(instance=movie)
    return render(request, 'editmovie.html', {'form': form, 'movie': movie})

@login_required
def view_movie(request, pk):
    movie = get_object_or_404(movie_list, pk=pk)
    return render(request, 'viewmovie.html', {'movie': movie})

@login_required
def manage_users(request):
    query = request.GET.get('q')
    if query:
        users = Subusers.objects.filter(Q(user_name__icontains=query)).filter(is_staff=0).order_by('-id')
    else:
        users = Subusers.objects.filter(is_staff=0).order_by('-id')

    paginator = Paginator(users, 5)  # no of users per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'userlist.html', {'page_obj': page_obj, 'query': query })

@login_required
def view_user(request, pk):
    user = get_object_or_404(Subusers, pk=pk)
    watch_history_list = watch_history.objects.filter(user_id=user).select_related('movie_id').order_by('-date_time')
    subscription_history_list = subscription.objects.filter(user_id=user).select_related('plan_id').order_by('-date')

    watch_history_paginator = Paginator(watch_history_list, 5)  # watch history items per page
    watch_history_page_number = request.GET.get('watch_page')
    watch_history_page_obj = watch_history_paginator.get_page(watch_history_page_number)

    subscription_paginator = Paginator(subscription_history_list, 5)  # subscription items per page
    subscription_page_number = request.GET.get('subscription_page')
    subscription_page_obj = subscription_paginator.get_page(subscription_page_number)

    return render(request, 'viewuser.html', {'user': user, 'watch_history_page_obj': watch_history_page_obj, 'subscription_page_obj': subscription_page_obj,})

@login_required
def user_toggle(request, pk):
    user = get_object_or_404(Subusers, pk=pk)
    if request.method == 'POST':
        if user.status == 'true':
            user.status = 'false'
            user.save()
        else:
            user.status = 'true'
            user.save()
    else:
        return redirect ('userlist')
    return redirect('userlist')

@login_required
def view_plans(request):
    plan = plans.objects.all().order_by('-id')
    paginator = Paginator(plan, 5)  # no of plans per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'viewplans.html', {'page_obj': page_obj,'plan' : plan})

@login_required
def plan_details(request, pk):
    plan = get_object_or_404(plans, pk=pk)
    return render(request, 'plandetails.html',{'plan': plan})

@login_required
def plan_toggle(request, pk):
    plan = get_object_or_404(plans, pk=pk)
    if request.method == 'POST':
        if plan.plan_status == 'true':
            plan.plan_status = 'false'
            plan.save()
        else:
            plan.plan_status = 'true'
            plan.save()
    else:
        return redirect ('viewplans')
    return redirect('viewplans')

@login_required
def add_plan(request):
    form = PlansForm(request.POST)

    if form.is_valid():
            form.save()
            return redirect('viewplans')
    else:
        form = PlansForm()
    return render(request, 'addplan.html')

@login_required
def month_sub(request):
    years = subscription.objects.dates('date', 'year', order='DESC').distinct()

    selected_year = request.GET.get('year', None)
    if selected_year:
        selected_year = int(selected_year)
    else:
        selected_year = years[0].year if years else None

    if selected_year:
        subscriptions = subscription.objects.filter(date__year=selected_year).values('date__month').annotate(total=Count('id')).order_by('date__month')
    else:
        subscriptions = []

    monthly_data = []
    for month_num in range(1, 13):
        month_name = calendar.month_name[month_num]
        month_data = next((item for item in subscriptions if item['date__month'] == month_num), None)
        monthly_data.append({
            'month': month_name,
            'total_subscriptions': month_data['total'] if month_data else 0
        })

    return render(request, 'monthsub.html',{'years': years, 'selected_year': selected_year, 'monthly_data': monthly_data,})

@login_required
def month_rev(request):
    years = subscription.objects.dates('date', 'year', order='DESC').distinct()

    selected_year = request.GET.get('year', None)
    if selected_year:
        selected_year = int(selected_year)
    else:
        selected_year = years[0].year if years else None

    if selected_year:
        revenues = subscription.objects.filter(date__year=selected_year)\
            .annotate(month=F('date__month'))\
            .values('month')\
            .annotate(total_revenue=Sum(F('plan_id__plan_price')))\
            .order_by('month')
    else:
        revenues = []

    monthly_revenue = []
    for month_num in range(1, 13):
        month_name = calendar.month_name[month_num]
        month_data = next((item for item in revenues if item['month'] == month_num), None)
        monthly_revenue.append({
            'month': month_name,
            'total_revenue': month_data['total_revenue'] if month_data else 0
        })

    return render(request, 'monthrev.html', {'years': years, 'selected_year': selected_year, 'monthly_revenue': monthly_revenue})

@login_required
def most_viewed(request):
    movies = movie_list.objects.all().order_by('-movie_views')

    paginator = Paginator(movies, 5)  # movies per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'mostviewed.html', {'page_obj': page_obj})

@login_required
def most_rated(request):
    movies = movie_list.objects.all().order_by('-movie_rating')
    paginator = Paginator(movies, 5)  # movies per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'mostrated.html', {'page_obj': page_obj})