from django import forms
from .models import movie_list, plans


class login_form(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)  # Use PasswordInput widget for password fields


class MovieForm(forms.ModelForm):
    class Meta:
        model = movie_list
        fields = ['movie_name', 'movie_description', 'movie_thumbnail', 'movie_video']


class PlansForm(forms.ModelForm):
    class Meta:
        model = plans
        fields = ['plan_name', 'plan_description', 'plan_duration', 'plan_price']


class ForgotPass(forms.Form):
    email = forms.EmailField(label='Enter your email', max_length=100)


class cpass_form(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput)
    cpassword = forms.CharField(widget=forms.PasswordInput)