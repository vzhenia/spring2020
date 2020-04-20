$(function(){

  let error = '';

  $('#resetForm').on('click', function(){
    console.log('reset')
    $('#result').empty();
    $('#country').val('');
    $('#year').val('');
    $('#badge').text('0');
    $('#error').text('');
    $("#robot").prop("checked", false)
  })

  $('#getHolidays').on('click', function(){

    function showError(err){
      $('#result').empty();
      $('#badge').text('0');
      $('#error').text(err);
      setTimeout(function(){
         error = ""
      }, 1000);
    }

    let country = $('#country').val();
    if (country.length !== 2) {
      error = "Country should have 2 letters";
      showError(error);
    } else {
      country = country.toUpperCase();
    }

    const year = $('#year').val();
    if (year.toString().length !== 4) {
      error = "Year should have 4 numbers";
      showError(error);
    }

    const human = $("#robot").prop("checked");
    if (!human) {
       error = "We don't provide info to robots";
       showError(error);
    }

    if (!error) {
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
    }
  })
});
