from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view , permission_classes
from rest_framework.response import Response
from django.core.paginator import Paginator
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from rest_framework import status, exceptions, authentication
from rest_framework import generics, filters
from appone.models import Subusers, movie_list, plans, watch_history, watch_later, subscription
from .serializers import UserSerializer, MovieDetailsSerializer, PlansSerializer, SubscriptionSerializer, RazorpaySerializer
from django.conf import settings
from .forms import ApiSignup
import random
import razorpay
from datetime import datetime

client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))

# @csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def apisignup(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user_data = serializer.validated_data
        
        if Subusers.objects.filter(email=user_data['email']).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        user.password = make_password(user_data['password'])
        user.save()
        
        return Response({'message': 'New Account Created'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Invalid data', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def apilogin(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if email is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},status=status.HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},status=status.HTTP_200_OK)


@api_view(['POST'])
def apilogout(request):
    user = request.user
    token = Token.objects.get(user=user)
    token.delete()
    return Response(status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def apiforgotpass(request):
    email = request.data.get('email')
    if email is None:
        return Response({'error': 'Please provide your registed email'},status=status.HTTP_400_BAD_REQUEST)
    if Subusers.objects.filter(email=email).exists():
                ad_user = Subusers.objects.get(email=email)
                random_key = random.randint(10**49, 10**50 - 1)
                ad_user.random_key = random_key
                ad_user.save()

                subject = f"Password Reset For Movie Time Admin Login"
                from_email = "passwordreset@movietime"
                recipient_list = [email]
                plain_message = 'http://127.0.0.1:3000/resetpass/'+str(random_key)+'/'
                send_mail(subject, plain_message, from_email, recipient_list)
                
                return Response({'message': 'email sent'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Please provide your registed email'},status=status.HTTP_400_BAD_REQUEST)
    

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def apipassreset(request):
    resettoken = request.data.get('resettoken')
    password = request.data.get('password')
    if Subusers.objects.filter(random_key=resettoken).exists():
         sub_user = Subusers.objects.get(random_key=resettoken)
         sub_user.password = make_password(password)
         sub_user.random_key = None
         sub_user.save()
         return Response({'message': 'Password changed'}, status=status.HTTP_200_OK)
    else:
         return Response({'error': 'Please try again'},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def apichangepass(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if Subusers.objects.filter(email=email).exists():
        sub_user = Subusers.objects.get(email=email)
        sub_user.password = make_password(password)
        sub_user.save()
        return Response({'message': 'Password changed'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Please try again'},status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def movielist(request):
     searchquery =request.data.get('searchquery')
     if searchquery is None:
        movies = movie_list.objects.all().order_by('movie_name')
        serializer = MovieDetailsSerializer(movies, many = True)
        return Response(serializer.data)
     else:
        movies = movie_list.objects.filter(Q(movie_name__icontains=searchquery) | Q(movie_description__icontains=searchquery)).order_by('movie_name')
        serializer = MovieDetailsSerializer(movies, many = True)
        return Response(serializer.data)


@api_view(['POST'])
def viewmovie(request):
     pk = request.data.get('moviepk')
     movies = movie_list.objects.filter(pk=pk).order_by('movie_name')
     serializer = MovieDetailsSerializer(movies, many = True)
     return Response(serializer.data)


@api_view(['POST'])
def playmovie(request):
     pk = request.data.get('moviepk')
     movies = movie_list.objects.filter(pk=pk)
     if movies.exists():
        movie = movies.first()
        if movie.movie_views is None:
            movie.movie_views = 0
        movie.movie_views += 1
        movie.save()
     return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def subplans(request):
     available_plans = plans.objects.filter(plan_status = 'true').order_by('plan_price')
     serializer = PlansSerializer(available_plans, many = True)
     return Response(serializer.data)


@api_view(['POST'])
def watchhistory(request):
     email = request.data.get('email')
     if Subusers.objects.filter(email=email).exists():
        user = Subusers.objects.get(email=email)

        watch_history_entries = watch_history.objects.filter(user_id=user).order_by('-date_time')
        movies = [entry.movie_id for entry in watch_history_entries]
        
        serializer = MovieDetailsSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
     else:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
   

@api_view(['POST'])
def watchlater(request):
     email = request.data.get('email')
     if Subusers.objects.filter(email=email).exists():
        user = Subusers.objects.get(email=email)

        watch_later_entries = watch_later.objects.filter(user_id=user).order_by('-date_time')
        movies = [entry.movie_id for entry in watch_later_entries]
        
        serializer = MovieDetailsSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
     else:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
     

@api_view(['POST'])
def addwatchlater(request):
    email = request.data.get('email')
    movie_id = request.data.get('movie_id')
    if Subusers.objects.filter(email=email).exists():
        user = Subusers.objects.get(email=email)
        selmovie = movie_list.objects.get(pk=movie_id)
        movie = watch_later(user_id = user, movie_id = selmovie)
        movie.save()
        return Response({'message': 'Watch Later Added'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Please try again'},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def delwatchlater(request):
    email = request.data.get('email')
    movie_id1 = request.data.get('movie_id')
    if Subusers.objects.filter(email=email).exists():
        user = Subusers.objects.get(email=email)
        user_id1 = user.id
        print(user_id1, movie_id1)
        movie = watch_later.objects.filter(user_id=user_id1, movie_id=movie_id1).first()
        print(movie)
        movie.delete()
        return Response({'message': 'Watch Later Added'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Please try again'},status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def myplan(request):
    email = request.user.email
    user = Subusers.objects.get(email=email)
    user_subscriptions = subscription.objects.filter(user_id=user).order_by('-date')
    serializer = SubscriptionSerializer(user_subscriptions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def plan_order(request):
    email = request.data.get('email')
    plan_id = request.data.get('plan_id')
    user = Subusers.objects.get(email=email)
    sel_plan = plans.objects.get(pk=plan_id)
    price = sel_plan.plan_price * 100
    receipt = "receipt"+ str(user.id) + datetime.now().strftime('%Y%m%d%H%M%S')
    DATA = {
            "amount": int(price),
            "currency": "INR",
            "receipt": receipt,
            "notes": {
                "userid": str(user.id),
                "planid": str(sel_plan.id)
                }
        }
    order_details = client.order.create(data=DATA)
    print(order_details)
    serializer = RazorpaySerializer(data = order_details)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def purchase(request):
    payment_id = request.data.get('razorpay_payment_id')
    order_id = request.data.get('razorpay_order_id')
    signature = request.data.get('razorpay_signature')
    print(payment_id,order_id,signature)
    
    return Response(status=status.HTTP_200_OK)