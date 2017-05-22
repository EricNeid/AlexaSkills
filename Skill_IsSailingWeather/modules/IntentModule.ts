import * as Out from './Logger';
import * as Api from './ApiModule';
import * as Parser from './ParserModule';
import * as Sailing from './IsSailingModule';
import * as Speak from './SpeakModule';
import { ApiError } from './ApiError';

export function handleIntentLaunch(onFinished: (string) => any) {
    onFinished(Speak.getLaunchMessage());
}

export function handleIntentIsSailingWeather(
    location: string,
    onFinished: (string) => any) {
    Api.getCurrentForecast(
        location,
        (result) => {

            let error = Parser.parseToError(result);
            if (error) {
                return handleApiError(location, error, onFinished);
            }

            let forecast = Parser.parseToForecast(result);
            if (!forecast || forecast.length == 0)
                return handleError(onFinished);
            
            let wind = Sailing.getWindFromForecast(forecast, Date.now());
            if (!wind)
                return handleError(onFinished);
            
            let output = Speak.getPositiveResponseForWindSpeed(wind.speedBft, location);
            onFinished(output);
        },
        (error) => {
            return handleError(onFinished);
        }
    )
}

function handleApiError(location: string, error: ApiError, onResult: (string) => any) {
    Out.log('handleApiError', [error.toString()]);

    if (error.isCityUnkown) {

        // TODO

    }
    else {
        onResult(Speak.TELL_ERROR_UNKOWN);
    }
}

function handleError(onResult: (string) => any) {
    Out.log('handleError');
    onResult(Speak.TELL_ERROR_UNKOWN);
}