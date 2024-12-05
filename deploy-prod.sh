#!/bin/bash
# Sync then invalidate Cloudfront
aws s3 sync ./dist/ s3://onboardian-prod-webapp
aws s3 sync ./.well-known s3://onboardian-prod-webapp/.well-known
aws cloudfront create-invalidation --distribution-id EI04NP6KXKE4U --paths '/*'
