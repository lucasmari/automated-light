# frozen_string_literal: true

CSRF_HEADER = "HTTP_#{JWTSessions.csrf_header.downcase.gsub(/-/, '_').upcase}"
REFRESH_HEADER = "HTTP_#{JWTSessions.refresh_header.downcase.gsub(/-/, '_').upcase}"

module AuthorizationHelper
  def request_cookies
    request.cookies
  end

  def request_headers
    jwt_headers = {}
    jwt_headers[JWTSessions.refresh_header] = request.env[REFRESH_HEADER] if request.env[REFRESH_HEADER]
    jwt_headers[JWTSessions.csrf_header] = request.env[CSRF_HEADER] if request.env[CSRF_HEADER]
    jwt_headers
  end

  def request_method
    request.request_method
  end
end
