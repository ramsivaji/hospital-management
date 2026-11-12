from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import (
    APIException,
    ValidationError,
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    NotFound,
    MethodNotAllowed,
)
from django.http import Http404
from django.core.exceptions import PermissionDenied as DjangoPermissionDenied


class SlotConflictError(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = "The requested slot is no longer available."
    default_code = "slot_conflict"


class CancellationWindowError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Appointments cannot be cancelled within the cancellation window."
    default_code = "cancellation_window_exceeded"


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns a consistent error format:
    { "code": "...", "message": "...", "details": {} }
    """
    # Check for custom exceptions like SlotConflictError if not caught by DRF
    if isinstance(exc, SlotConflictError):
        return Response(
            {
                "code": "slot_conflict",
                "message": str(exc.detail if hasattr(exc, "detail") else exc),
                "details": {},
            },
            status=status.HTTP_409_CONFLICT,
        )

    if isinstance(exc, CancellationWindowError):
        return Response(
            {
                "code": "cancellation_window_exceeded",
                "message": str(exc.detail if hasattr(exc, "detail") else exc),
                "details": {},
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    response = exception_handler(exc, context)

    if response is not None:
        code = "error"
        message = "An error occurred."
        details = {}

        if isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
            code = "authentication_failed"
            message = "Authentication credentials were not provided or are invalid."
        elif isinstance(exc, (PermissionDenied, DjangoPermissionDenied)):
            code = "permission_denied"
            message = "You do not have permission to perform this action."
        elif isinstance(exc, (NotFound, Http404)):
            code = "not_found"
            message = "The requested resource was not found."
        elif isinstance(exc, ValidationError):
            code = "validation_error"
            message = "Validation failed."
            if isinstance(response.data, dict):
                details = {
                    field: [str(e) for e in errs] if isinstance(errs, list) else [str(errs)]
                    for field, errs in response.data.items()
                }
            elif isinstance(response.data, list):
                details = {"errors": [str(e) for e in response.data]}
        else:
            if isinstance(response.data, dict):
                if "detail" in response.data:
                    detail = response.data["detail"]
                    message = str(detail)
                    code = getattr(detail, "code", "error") or "error"
                elif "non_field_errors" in response.data:
                    errors = response.data["non_field_errors"]
                    message = str(errors[0]) if errors else message
                    code = getattr(errors[0], "code", "invalid") if errors else "invalid"
                else:
                    details = {
                        field: [str(e) for e in errs] if isinstance(errs, list) else [str(errs)]
                        for field, errs in response.data.items()
                    }
                    message = "Validation failed."
                    code = "validation_error"
            elif isinstance(response.data, list):
                details = {"errors": [str(e) for e in response.data]}
                message = "Validation failed."
                code = "validation_error"

        response.data = {
            "code": code,
            "message": message,
            "details": details,
        }

    return response
