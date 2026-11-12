"""Production settings."""

from .base import *  # noqa: F401, F403
import dj_database_url

DEBUG = False

DATABASES = {
    "default": dj_database_url.config(
        conn_max_age=600,
        ssl_require=True,
    )
}

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
