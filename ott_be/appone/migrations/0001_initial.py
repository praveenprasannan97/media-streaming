# Generated by Django 5.0.6 on 2024-08-12 06:36

import django.contrib.auth.models
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subusers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('user_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=200)),
                ('is_staff', models.BooleanField(default=False)),
                ('random_key', models.IntegerField(null=True)),
                ('status', models.CharField(default='true', max_length=5)),
                ('expiry', models.DateField()),
            ],
            options={
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='movie_list',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('movie_name', models.CharField(max_length=255)),
                ('movie_description', models.TextField()),
                ('movie_thumbnail', models.ImageField(upload_to='thumbnails/')),
                ('movie_video', models.FileField(upload_to='videos/')),
                ('movie_rating', models.DecimalField(decimal_places=1, max_digits=2, null=True)),
                ('movie_views', models.IntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='plans',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan_name', models.CharField(max_length=100)),
                ('plan_description', models.CharField(max_length=200)),
                ('plan_duration', models.IntegerField()),
                ('plan_price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('plan_status', models.CharField(default='true', max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('payment_status', models.CharField(max_length=50)),
                ('transaction_id', models.CharField(max_length=150)),
                ('expiry', models.DateField()),
                ('plan_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appone.plans')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='watch_history',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_time', models.DateTimeField(auto_now_add=True)),
                ('movie_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appone.movie_list')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='rating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField()),
                ('movie_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appone.movie_list')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user_id', 'movie_id')},
            },
        ),
        migrations.CreateModel(
            name='watch_latter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_time', models.DateTimeField(auto_now_add=True)),
                ('movie_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appone.movie_list')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user_id', 'movie_id')},
            },
        ),
    ]
