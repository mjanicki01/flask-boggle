$(document).ready(function() {

  const form_input = document.getElementById("id")

  $('#form').on('submit', function(event) {
      $.ajax({
        method: "POST",
        url: "/",
        data: { input: form_input }
      }) 
      .done(function( input ) {
        $('#word_display').text(input);
      }); 
    event.preventDefault();
  });
})