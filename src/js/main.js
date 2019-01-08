jQuery(document).ready(function ($) {
  //----- Variable
  var failList = ['algerian', 'bahamian', 'bangladeshi', 'bolivian', 'batswana', 'ethiopian', 'chinese', 'cuban', 'ecuadorean', 'ghanaian', 'iranian', 'jordanian', 'macedonian', 'moroccan', 'nepalese', 'north_korean', 'pakistani', 'serbian', 'sri_lankan', 'syrian', 'sudanese', 'trinidadian_or_tobagonian', 'tunisian', 'american', 'venezuelan', 'yemeni'
  ], email, firstName, lastName, nationality, tokenButtons, toNewsletter, termsAndConditions;

  //----- Events

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
    email = $('#email');
    firstName = $('#firstName');
    lastName = $('#lastName');
    nationality = $('#nationality');
    tokenButtons = $('#tokenButtons .active').text();
    toNewsletter = $('#addToNews').prop('checked');
    termsAndConditions = $('#termsAndCond');

    var error = false;

    if (!email.val().length) {
      error = true;
      email.addClass('error');
    } else {
      email.removeClass('error');
    }

    if (!firstName.val().length) {
      error = true;
      firstName.addClass('error');
    } else {
      firstName.removeClass('error');
    }

    if (!lastName.val().length) {
      error = true;
      lastName.addClass('error');
    } else {
      lastName.removeClass('error');
    }

    if (!nationality.val().length) {
      error = true;
      nationality.addClass('error');
    } else {
      nationality.removeClass('error');
    }

    if (!termsAndConditions.prop('checked')) {
      error = true;
      termsAndConditions.addClass('error');
      $('label[for="termsAndCond"]').addClass('error');
      console.log('termsAndConditions');
    } else {
      email.removeClass('error');
    }

    if (!error) {
      addToAllContacts();
    }

  });

  // Switch investor type on popup
  $('#tokenButtons').on('click', '.token-button', function (e) {
    e.preventDefault();
    var landBlock = $('#tokenButtonsLanding');
    switchInvestorType(this, landBlock);
  });

  // Switch investor type on landing page
  $('#tokenButtonsLanding').on('click', '.token-button', function (e) {
    e.preventDefault();
    var landBlock = $('#tokenButtons');
    switchInvestorType(this, landBlock);
  });

  //----- Functions

  // Add contact to global list
  function addToAllContacts () {

    var arr = [],
      obj = {
        email: email.val(),
        first_name: firstName.val(),
        last_name: lastName.val(),
        nationality: nationality.val(),
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

  // Switch investor type
  function switchInvestorType (self, landBlock) {
    landBlock.find('.active').removeClass('active');

    if (!$(self).hasClass('active')) {
      $(self).parent().find('.active').removeClass('active');
      $(self).addClass('active');

      if($(self).hasClass('more')){
        landBlock.find('.more').addClass('active');
      } else {
        landBlock.find('.less').addClass('active');
      }
    }
  }
});