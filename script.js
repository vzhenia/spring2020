$(function(){

  // grabbing countries for dropdown
  $.ajax({
     url: `https://countries-cities.p.rapidapi.com/location/country/list`,
     type: "GET",
     beforeSend: function(xhr){
       xhr.setRequestHeader("x-rapidapi-host", "countries-cities.p.rapidapi.com");
       xhr.setRequestHeader("x-rapidapi-key",  token);
       xhr.setRequestHeader("accepts", "json");
     },
     success: function(data){
       //console.log(data.countries)
       const countries = data.countries;
       const countryKeys = Object.keys(countries);

       const select = document.getElementById("countrySelect");
       const o1 = document.createElement("option");
       o1.innerText = "Select a country please";
       o1.setAttribute("value", '');
       select.appendChild(o1);

       for (let i=0; i<countryKeys.length; i++) {
          const o = document.createElement("option");
          o.setAttribute("value", countryKeys[i]);
          o.innerText = countries[countryKeys[i]];
          select.appendChild(o)
        }

        // handling the rest of the form
        let error = '';

        $('#resetForm').on('click', function(){
          console.log('reset')
          $('#result').empty();
          $('#info').empty();
          $('#year').val('');
          $('#badge').text('0');
          $('#error').text('');
          $('#form').captcha();

          // set default option at form reset
          const ops = document.getElementById('countrySelect').children;
          for (let i=0; i<ops.length; i++) {
            if (ops[i].value == '') {
                ops[i].selected = "selected"
            }
          }
        })

        $('#form').captcha();

        $('#getHolidays').on('click', function(){

          function showError(err){
            $('#result').empty();
            $('#badge').text('0');
            $('#error').text(err);
            setTimeout(function(){
               error = ""
            }, 1000);
          }

          let country = $('#countrySelect').val();

          if (country.length !== 2) {
            error = "You have to select a country";
            showError(error);
          } else {
            country = country.toUpperCase();
          }

          const year = $('#year').val();
          if (year.toString().length !== 4) {
            error = "Year should have 4 numbers";
            showError(error);
          }

          if(!verifyCaptcha('#form')){
  					alert('Please click the captcha!');
  				}

          if (!error && verifyCaptcha('#form')) {

            let progressBar = $(`
              <div class="row">
                <div class="progress">
                  <div class="progress-bar progress-bar-striped bg-info" role="progressbar"
                    aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              `);

            progressBar.prependTo($('body'));

            setTimeout(function () {
              $.ajax({
                 url: `https://countries-cities.p.rapidapi.com/location/country/${country}`,
                 type: "GET",
                 beforeSend: function(xhr){
                   xhr.setRequestHeader("x-rapidapi-host", "countries-cities.p.rapidapi.com");
                   xhr.setRequestHeader("x-rapidapi-key",  token);
                   xhr.setRequestHeader("accepts", "json");
                 },
                 success: function(country){
                   console.log(country)
                   const info = $('#info');
                   info.empty();
                   const languages = Object.values(country.languages).map(lang => " "+lang);
                   const continent = country.continent.name;
                   const currency = country.currency.name;
                   const tz = country.timezone.timezone;
                   const area = country.area_size;
                   const time = country.timezone.time;

                   // poplation
        		       const x = country.population/1000000;
        		       let population = x.toFixed(2);
                   let popIndex = "mln";
                   if (country.population < 100000) {
                     population = country.population/1000;
                     population = population.toFixed(2);
                     popIndex = "K";
                   }

                   const flag = flags.find(f => f.name === country.code);
                   let internals = `<i>Flag icon is not available for ${country.name}</i>`;
                   let direction = 'left';
                   if (flag) {
                     internals = `<img src=${flag.src} width="32" height="21"/>`
                     direction = 'right';
                   }

                   const countryCard = $(`
                     <div class="card country-info">
                     <div class="card-body">
                       <marquee behavior="" direction="${direction}">
                        ${internals}
                       </marquee>
                       <h5 class="card-title">${country.name}</h5>
                       <h6 class="card-title">Capital:
                       <a href="https://en.wikipedia.org/wiki/${country.capital}" target="_blank">${country.capital}</a>
                       </h6>
                       <p class="card-text">Continent: ${continent}</p>
                     </div>
                     <ul class="list-group list-group-flush">
                     <li class="list-group-item">Languages: ${languages}</li>
                     <li class="list-group-item">Currency: ${currency}</li>
                     <li class="list-group-item">Population: ${population} ${popIndex}</li>
                     <li class="list-group-item">Area size: ${area}</li>
                     <li class="list-group-item">Timezone: ${tz}</li>
                     <li class="list-group-item">Current time: ${time}</li>
                     </ul>
                   </div>`)

                   countryCard.appendTo(info);
                 }
               })

              $.ajax({
                 url: `https://public-holiday.p.rapidapi.com/${year}/${country}`,
                 type: "GET",
                 beforeSend: function(xhr){
                   xhr.setRequestHeader("x-rapidapi-host", "public-holiday.p.rapidapi.com");
                   xhr.setRequestHeader("x-rapidapi-key",  token);
                   xhr.setRequestHeader("accepts", "json");
                 },
                 success: function(holidays){
                   $('#error').empty();
                   const result = $('#result');
                   result.empty()
                   holidays.map((elt, i) => {
                     const r = 0;
                     const g = Math.abs(210-10*i);
                     const b = Math.abs(210-20*i);

                     const card1 = $(`<div class="card" style="background-color:rgb(${r},${g},${b});">
                        <div class="card-body">
                          <h5 class="card-title">${elt.name}</h5>
                          <p class="card-text">${elt.localName}</p>
                          <a href="#" class="btn btn-outline-primary">${elt.date}</a>
                        </div>
                      </div>`)

                     card1.appendTo(result);
                   })
                   $('#badge').text(holidays.length);
                 },
                 error: function(error){
                   showError(error.statusText)
                 }
              });

              progressBar = document.getElementsByTagName('body')[0].firstElementChild;
              document.getElementsByTagName('body')[0].removeChild(progressBar);
            }, 2000);
          }
        })
     }
   })
});
