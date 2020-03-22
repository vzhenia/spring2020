$(function(){

  $('button').on('click', function(){
    // console.log('hello')

    $.ajax({
         url: "https://public-holiday.p.rapidapi.com/2020/SR",
         type: "GET",
         beforeSend: function(xhr){
           xhr.setRequestHeader("x-rapidapi-host", "public-holiday.p.rapidapi.com");
           xhr.setRequestHeader("x-rapidapi-key",  token);
           xhr.setRequestHeader("accepts", "json");
         },
         success: function(d){
           d.map(elt => {
             const result = $('#result');

             const card1 = $(`<div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${elt.name}</h5>
                  <p class="card-text">${elt.localName}</p>
                  <a href="#" class="btn btn-primary">${elt.date}</a>
                </div>
              </div>`)

             card1.appendTo(result);
           })
         }
      });
  })
});
