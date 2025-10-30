export const HTTP_STATUSES = [
  { code: '200', options: ['OK', 'Created', 'Accepted', 'No Content'], answer: 'OK' },
  { code: '201', options: ['Created', 'OK', 'Accepted', 'No Content'], answer: 'Created' },
  { code: '204', options: ['No Content', 'Not Found', 'OK', 'Bad Request'], answer: 'No Content' },
  { code: '301', options: ['Moved Permanently', 'Found', 'Temporary Redirect', 'Permanent Redirect'], answer: 'Moved Permanently' },
  { code: '302', options: ['Found', 'Moved Permanently', 'Not Found', 'Bad Request'], answer: 'Found' },
  { code: '400', options: ['Bad Request', 'Unauthorized', 'Forbidden', 'Not Found'], answer: 'Bad Request' },
  { code: '401', options: ['Unauthorized', 'Forbidden', 'Bad Request', 'Not Found'], answer: 'Unauthorized' },
  { code: '403', options: ['Forbidden', 'Unauthorized', 'Not Found', 'Bad Request'], answer: 'Forbidden' },
  { code: '404', options: ['Not Found', 'Forbidden', 'Bad Request', 'Gone'], answer: 'Not Found' },
  { code: '500', options: ['Internal Server Error', 'Bad Gateway', 'Service Unavailable', 'Gateway Timeout'], answer: 'Internal Server Error' },
  { code: '502', options: ['Bad Gateway', 'Internal Server Error', 'Service Unavailable', 'Gateway Timeout'], answer: 'Bad Gateway' },
  { code: '503', options: ['Service Unavailable', 'Bad Gateway', 'Internal Server Error', 'Gateway Timeout'], answer: 'Service Unavailable' },
  { code: '202', options: ['Accepted', 'Created', 'OK', 'No Content'], answer: 'Accepted' },
  { code: '304', options: ['Not Modified', 'Moved Permanently', 'Found', 'Temporary Redirect'], answer: 'Not Modified' },
  { code: '307', options: ['Temporary Redirect', 'Moved Permanently', 'Found', 'Permanent Redirect'], answer: 'Temporary Redirect' },
  { code: '308', options: ['Permanent Redirect', 'Moved Permanently', 'Temporary Redirect', 'Found'], answer: 'Permanent Redirect' },
  { code: '410', options: ['Gone', 'Not Found', 'Forbidden', 'Bad Request'], answer: 'Gone' },
  { code: '429', options: ['Too Many Requests', 'Bad Request', 'Unauthorized', 'Forbidden'], answer: 'Too Many Requests' },
  { code: '504', options: ['Gateway Timeout', 'Bad Gateway', 'Service Unavailable', 'Internal Server Error'], answer: 'Gateway Timeout' }
];





