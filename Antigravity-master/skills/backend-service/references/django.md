# Django & DRF Guidelines

## Version Check Requirement
Check `django` version in package manifest (Django 4.x vs 5.x async ORM features).

## Best Practices
- Separate views into `APIView` or `ModelViewSet` when building REST APIs via DRF.
- Use Django serializers for request validation and response formatting.
- Move non-trivial business logic out of views into service functions.
