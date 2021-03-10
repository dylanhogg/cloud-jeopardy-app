resource "aws_s3_bucket" "s3_bucket" {
  // Bucket name must be unique and must not contain spaces, uppercase letters or underscores.
  bucket = var.domain
  acl    = "public-read"

  // routing_rules

  website {
    index_document = "app.html"
    error_document = "error.html"
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    // allowed_origins = ["https://s3-website-test.hashicorp.com"]
    allowed_origins = ["*"]  // TODO: review
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}

resource "aws_s3_bucket_policy" "s3_bucket_policy" {
  bucket = aws_s3_bucket.s3_bucket.id

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": [
             "s3:GetObject"
          ],
          "Resource": [
             "arn:aws:s3:::${aws_s3_bucket.s3_bucket.id}/*"
          ]
      }
    ]
}
POLICY
}

# AWS S3 bucket for www-redirect
//resource "aws_s3_bucket" "website_redirect" {
//  bucket = "www.${var.website_bucket_name}"
//  acl = "public-read"
//
//  website {
//    redirect_all_requests_to = "${var.website_bucket_name}"
//  }
//}
