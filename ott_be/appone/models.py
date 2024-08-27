from django.db import models
from django.contrib.auth.models import AbstractUser,AbstractBaseUser,UserManager
from .managers import CustomUserManager
import os

class Subusers(AbstractBaseUser):
    user_name = models.CharField(max_length=100,unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)
    is_staff = models.BooleanField(default=False)
    random_key = models.CharField(max_length=100,null=True)
    status = models.CharField(max_length=5, default='true')
    expiry = models.DateField(null=True)


    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['password']

    # objects = UserManager()
    objects = CustomUserManager()

    def __str__(self):
        return self.user_name
    
class movie_list(models.Model):
    movie_name = models.CharField(max_length=255)
    movie_description = models.TextField()
    movie_thumbnail = models.ImageField(upload_to='thumbnails/')
    movie_video = models.FileField(upload_to='videos/')
    movie_rating = models.DecimalField(max_digits=2, decimal_places=1, null=True)
    movie_views = models.IntegerField(null=True)

    def __str__(self):
        return self.movie_name

    def delete(self, *args, **kwargs):
        # Delete files before deleting the database entry
        if self.movie_thumbnail:
            if os.path.isfile(self.movie_thumbnail.path):
                os.remove(self.movie_thumbnail.path)

        if self.movie_video:
            if os.path.isfile(self.movie_video.path):
                os.remove(self.movie_video.path)

        #delete() method to remove the movie from the database
        super(movie_list, self).delete(*args, **kwargs)

class plans(models.Model):
    plan_name = models.CharField(max_length=100)
    plan_description = models.CharField(max_length=200)
    plan_duration = models.IntegerField()
    plan_price = models.DecimalField(max_digits= 7, decimal_places=2)
    plan_status = models.CharField (max_length = 5, default = "true" )

    def __str__(self):
        return self.plan_name

class subscription(models.Model):
    user_id = models.ForeignKey(Subusers, on_delete=models.CASCADE)
    plan_id = models.ForeignKey(plans, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    payment_status = models.CharField(max_length=50, default = "false")
    transaction_id = models.CharField(max_length=150)
    expiry = models.DateField()
    order_id = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f"{self.user_id.user_name} - {self.plan_id.plan_name}"


class rating(models.Model):
    user_id = models.ForeignKey(Subusers, on_delete=models.CASCADE)
    movie_id = models.ForeignKey(movie_list, on_delete=models.CASCADE)
    rating = models.IntegerField()

    class Meta:
        unique_together = ('user_id', 'movie_id')

    def __str__(self):
        return self.movie_id

class watch_history(models.Model):
    user_id = models.ForeignKey(Subusers, on_delete=models.CASCADE)
    movie_id = models.ForeignKey(movie_list, on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_id

class watch_later(models.Model):
    user_id = models.ForeignKey(Subusers, on_delete=models.CASCADE)
    movie_id = models.ForeignKey(movie_list, on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'movie_id')

    def __str__(self):
        return f"{self.user_id.user_name} - {self.movie_id.movie_name}"