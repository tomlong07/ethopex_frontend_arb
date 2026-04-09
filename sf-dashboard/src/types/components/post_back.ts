export interface PostBackTestResult {
  event?: string
  duration?: number
  method?: string
  postback_url?: string
  postback_url_id?: number
  request_url?: string
  response_body?: string
  response_headers?: Record<string, string>
  status?: string
  status_code?: number
  success?: boolean,
  url?: string
}
