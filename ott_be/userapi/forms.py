from django import forms
from appone.models import movie_list, plans


class ApiSignup(forms.Form):
    username = forms.CharField()
    email = forms.EmailField()
    password = forms.CharField()