#!/bin/bash

# Deployment Verification Script
# Usage: ./verify-deployment.sh [WEB_URL] [API_URL]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

WEB_URL=${1:-$WEB_URL}
API_URL=${2:-$API_URL}
MAX_RETRIES=5
RETRY_DELAY=10

if [ -z "$WEB_URL" ] && [ -z "$API_URL" ]; then
    log_error "No URLs provided for verification. Usage: $0 [WEB_URL] [API_URL]"
    exit 1
fi

check_url() {
    local url=$1
    local name=$2
    local attempt=1

    log_info "Verifying $name at $url..."

    while [ $attempt -le $MAX_RETRIES ]; do
        # Check HTTP status code (follow redirects)
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
        
        if [[ "$status_code" =~ ^2 ]]; then
            log_success "$name is healthy (Status: $status_code)"
            return 0
        fi

        # Handle Vercel/Cloudflare protection (401 Unauthorized)
        if [[ "$status_code" == "401" ]]; then
            log_warning "$name is protected (Status: 401). Skipping health check."
            return 0
        fi

        log_warning "Attempt $attempt/$MAX_RETRIES failed (Status: $status_code). Retrying in ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
        attempt=$((attempt + 1))
    done

    log_error "$name verification failed after $MAX_RETRIES attempts."
    return 1
}

EXIT_CODE=0

if [ -n "$WEB_URL" ]; then
    WEB_URL=${WEB_URL%/}
    if ! check_url "$WEB_URL/api/health" "Web App"; then
        EXIT_CODE=1
    fi
fi

if [ -n "$API_URL" ]; then
    # For API, we might want to check a specific health endpoint if the root doesn't return 200
    # Assuming /health or root is fine for now.
    # If API_URL ends with /, remove it for consistency when appending paths
    API_URL=${API_URL%/}
    if ! check_url "$API_URL/health" "API Service"; then
        EXIT_CODE=1
    fi
fi

if [ $EXIT_CODE -eq 0 ]; then
    log_success "All verifications passed!"
else
    log_error "Verification failed."
fi

exit $EXIT_CODE
