# Generated by Django 5.0.6 on 2024-08-14 05:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appone', '0010_alter_subusers_random_key'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subusers',
            name='random_key',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
