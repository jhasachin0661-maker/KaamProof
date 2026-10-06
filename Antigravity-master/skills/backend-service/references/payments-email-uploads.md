# Payments, Email Notifications & File Uploads

## Payment Integration Safety (CRITICAL Risk)
- Payment integrations (Stripe, PayPal, Razorpay) carry `CRITICAL` risk.
- **Human Review Mandatory**: Always tag payment gateway modifications with `REQUIRES HUMAN REVIEW`.
- Verify webhook cryptographic signatures (e.g. `stripe-signature`) before processing events.

## File Uploads & Email
- Restrict upload file extensions, MIME types, and maximum byte size.
- Store uploaded files on object storage (S3, GCS) using presigned URLs rather than direct server disk.
