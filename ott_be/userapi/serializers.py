from rest_framework import serializers
from appone.models import Subusers, movie_list, plans, subscription

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subusers
        fields = ['user_name', 'email', 'password']

class MovieDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = movie_list
        fields = ['id','movie_name','movie_description','movie_thumbnail','movie_video','movie_rating',]

class PlansSerializer(serializers.ModelSerializer):
    class Meta:
        model = plans
        fields = ['id','plan_name','plan_description','plan_duration','plan_price']


class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan_id.plan_name')
    plan_description = serializers.CharField(source='plan_id.plan_description')
    plan_price = serializers.DecimalField(source='plan_id.plan_price', max_digits=7, decimal_places=2)
    plan_duration = serializers.IntegerField(source='plan_id.plan_duration')

    class Meta:
        model = subscription
        fields = ['plan_name', 'plan_description', 'plan_price', 'plan_duration', 'date', 'expiry']