import { check, sleep } from 'k6'
import http from 'k6/http'
import {Trend} from 'k6/metrics'

const apiResponseTime = new Trend('api_response_time')
const apiRequestTime = new Trend('api_request_time')
export const options = {
    
    stages: [
        {duration: '4s', target: 2}, //ramp up 2 VU's over 4 sec
        {duration: '5s', target:5}, // stay at 5 VU's for 5 sec
        {duration: '3s', target:0} // ramp down to 0 users for 3 sec
    ],
    thresholds: {
    'http_req_duration' : ['p(95) < 400'],
    'http_req_failed': ['rate < 0.5'],
    'checks': ['rate > 0.9'],
    'http_req_duration{name: api}': ['p(95) < 300'],
    'http_req_failed{name: api}': ['rate < 0.5'],
    'api_response_time' : ['p(95) < 500'],
    'api_request_time': ['p(95) < 300']
}

}



export default function() {
    const response = http.get('https://quickpizza.grafana.com/')
    apiResponseTime.add(response.timings.waiting)
    apiRequestTime.add(response.timings.sending)
    check(response, {
      'status is 200':  (response) => response.status === 200,
            'page contains pizza': (response) =>
                response.body.toLowerCase().includes('pizza')
    })

    http.get('https://quickpizza.grafana.com/api', {
        tags: {name: 'api'}
    })
    sleep(1)
}

//http_req_duration............. => Time taken to send req + time to receive response