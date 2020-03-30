function attachEvents() {
    let btn = document.querySelector('#submit');
    let count = 0;

    function createHTMLElement(tagName, classNames, textContent) {

        let element = document.createElement(tagName);

        if (classNames) {
            element.classList.add(...classNames);
        };

        if (textContent) {
            element.textContent = textContent;
        };

        return element;
    };

    let imgObj = {
        'p': '⛅',
        'o': '☁',
        'r': '☂',
        'd': '°',
        's': '☀',

    };

    let firstState = function (js) {
        let { forecast, name } = js;
        let lowTemp = forecast.low;
        let highTemp = forecast.high;
        let conditionWhether = forecast.condition;
        // console.log(name);

        let forecasteDiv = createHTMLElement('div', ['forecasts']);
        let symbolSpan = createHTMLElement('span', ['condition', 'symbol'], imgObj[conditionWhether[0].toLowerCase()]);
        let conditionSpan = createHTMLElement('span', ['condition']);
        let locationSpan = createHTMLElement('span', ['forecast-data'], name)

        let temperatureString = `${lowTemp}${imgObj.d}/${highTemp}${imgObj.d}`
        let temperatureSpan = createHTMLElement('span', ['forecast-data'], temperatureString)
        let waetherTypeSpan = createHTMLElement('span', ['forecast-data'], conditionWhether)



        conditionSpan.appendChild(locationSpan);
        conditionSpan.appendChild(temperatureSpan);
        conditionSpan.appendChild(waetherTypeSpan);

        forecasteDiv.appendChild(symbolSpan);
        forecasteDiv.appendChild(conditionSpan);

        document.querySelector('#current').appendChild(forecasteDiv);


        document.querySelector('#forecast').setAttribute('style', { 'display': 'block' })


    };

    let secondState = function (params) {

    };

    let inputFild = document.querySelector('#location');
    inputFild.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            btn.click();
            inputFild.value = '';
        }
    })
    


    btn.addEventListener('click', function first() {
        let input = document.querySelector(`#location`).value;
        if (count === 1) {

            let curent = document.querySelector('#current').childNodes;
            document.querySelector('#current').removeChild(curent[3]);
            

            let childrens = document.querySelector('#upcoming').childNodes;
            document.querySelector('#upcoming').removeChild(childrens[3]);
            console.log()

            
        }
        
        // Only 3 valide input - 'New York', 'Barcelona', 'London'

        let url = 'https://judgetests.firebaseio.com/locations.json';
        fetch(url)
            .then((response) => {
                if (response.status < 400) {
                    return response.json();
                }
                else {
                    throw console.error(response.text);

                }
            })
            .then((js) => {
                // console.log(js);

                let locationCode = '';
                js.forEach(element => {
                    if (input.toLowerCase() === element.name.toLowerCase()) {
                        locationCode = element.code;
                    }
                });

                let todayUrl = `https://judgetests.firebaseio.com/forecast/today/${locationCode}.json`;
                let nextUrl = `https://judgetests.firebaseio.com/forecast/upcoming/${locationCode}.json`
                fetch(todayUrl)
                    .then((resp) => {
                        if (resp.status < 400) {
                            return resp.json();
                        }
                    })
                    .then(firstState)
                    .catch(err => console.error(err));


                fetch(nextUrl)
                    .then((resp1) => {
                        if (resp1.status < 400) {
                            return resp1.json();
                        }
                    })
                    .then((data) => {
                        // console.log(data.forecast);


                        let forecast1 = data.forecast
                        let foreCastInfoDiv = createHTMLElement('div', ['forecast-info']);

                        for (let i = 0; i < forecast1.length; i++) {
                            const { condition, high, low } = forecast1[i];

                            let upcomingSpan = createHTMLElement('span', ['upcoming']);
                            let symbolSpan = createHTMLElement('span', ['symbol'], imgObj[condition[0].toLowerCase()]);
                            let temperatureString = `${low}${imgObj.d}/${high}${imgObj.d}`;
                            let temperatureSpan = createHTMLElement('span', ['forecast-data'], temperatureString);
                            let waetherTypeSpan = createHTMLElement('span', ['forecast-data'], condition);

                            upcomingSpan.appendChild(symbolSpan);
                            upcomingSpan.appendChild(temperatureSpan);
                            upcomingSpan.appendChild(waetherTypeSpan);
                            foreCastInfoDiv.appendChild(upcomingSpan);

                        }

                        document.querySelector('#upcoming').appendChild(foreCastInfoDiv)
                        count = 1;










                    })


            })
            .catch(err => console.error(err));





    });

}

attachEvents();

