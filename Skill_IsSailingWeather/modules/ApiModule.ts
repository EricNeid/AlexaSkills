import * as Request from 'request';

import * as Out from './Logger';

let host = 'api.openweathermap.org';
let endpoint = '/data/2.5/forecast';

let apiKey = 'd0d0ebd199dd630ef800a557ef427882';

export function getCurrentForecast(
    location: string,
    onResult: (response: string) => any,
    onError: (any) => any) {
        Out.log('getCurrentForecast', [location]);
        Request(formatRequest(location), (error, response, body) => {
            if (error) {
                onError(error);
            }
            else {
                onResult(body);
            }
        });
}

function formatRequest(location: string): string {
    return `http://${host}${endpoint}?q=${location}&appid=${apiKey}&units=metric`
}
