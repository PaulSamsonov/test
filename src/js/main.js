jQuery(document).ready(function ($) {
  // Variable
  var failList = ['algerian', 'bahamian', 'bangladeshi', 'bolivian', 'batswana', 'ethiopian', 'chinese', 'cuban', 'ecuadorean', 'ghanaian', 'iranian', 'jordanian', 'macedonian', 'moroccan', 'nepalese', 'north_korean', 'pakistani', 'serbian', 'sri_lankan', 'syrian', 'sudanese', 'trinidadian_or_tobagonian', 'tunisian', 'american', 'venezuelan', 'yemeni'
  ], email, firstName, lastName, nationality, tokenButtons, toNewsletter;

  // Events

  //anchor links
  $('.main-nav a[href*="#"], .anchor').click(function (event) {
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top - 100
    }, 500);
    event.preventDefault();
  });

  // Add contact to global list and other lists
  $('#getWhitelisted').on('click', function (e) {
    e.preventDefault();
    email = $('#email').val();
    firstName = $('#firstName').val();
    lastName = $('#lastName').val();
    nationality = $('#nationality').val();
    tokenButtons = $('#tokenButtons .active').text();
    toNewsletter = $('#addToNews').prop('checked');

    addToAllContacts();

  });

  // Switch investor type
  $('#tokenButtons').on('click', '.token-button', function (e) {
    e.preventDefault();

    if (!$(this).hasClass('active')) {
      $('#tokenButtons .active').removeClass('active');
      $(this).addClass('active');
    }
  });

  // Functions

  // Add contact to global list
  function addToAllContacts () {

    var arr = [],
      obj = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        nationality: nationality,
        investor_type: tokenButtons
      };
    arr.push(obj);
    $.ajax({
      url: 'https://api.sendgrid.com/v3/contactdb/recipients',
      method: 'POST',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer  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');
      },
      data: JSON.stringify(arr),
      success: function (res) {
        if (failList.indexOf(nationality) === -1) {
          addToList(res.persisted_recipients, 6488806);
        } else {
          addToList(res.persisted_recipients, 6498852);
        }

        if (toNewsletter) {
          addToList(res.persisted_recipients, 6489205);
        }

      },
      error: function (error) {
        console.log(error.responseText);
      }
    });

  }

  // Add to pre-whitelist or fail-list or newsletter
  function addToList (recipients_id, list_id) {
    $.ajax({
      url: 'https://api.sendgrid.com/v3/contactdb/lists/' + list_id + '/recipients/' + recipients_id,
      method: 'POST',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer  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');
      },
      success: function () {
        location.reload();
      },
      error: function (error) {
        console.log(error.responseText);
      }
    });
  }

});