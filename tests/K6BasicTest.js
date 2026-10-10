import { sleep } from 'k6'
import http from 'k6/http'

export const options = {
    vus : 3,
    duration: '10s',
    thresholds: {
    'http_req_duration' : ['p(95) < 40'],
    'http_req_failed': ['rate < 0.5']
}

}



export default function() {
    http.get('https://financial-wellness-lab-2.vercel.app/')
    sleep(1)
}

//http_req_duration............. => Time taken to send req + time to receive response