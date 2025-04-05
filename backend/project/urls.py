from django.contrib import admin
from django.urls import path, include  # Import include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include the app's URLs under the root path
    path('', include('rfp_analysis.urls')),  # This line is critical
]