jQuery(document).ready(function ($) {
  //----- Variable
  var failList = ['algerian', 'bahamian', 'bangladeshi', 'bolivian', 'batswana', 'ethiopian', 'chinese', 'cuban', 'ecuadorean', 'ghanaian', 'iranian', 'jordanian', 'macedonian', 'moroccan', 'nepalese', 'north_korean', 'pakistani', 'serbian', 'sri_lankan', 'syrian', 'sudanese', 'trinidadian_or_tobagonian', 'tunisian', 'american', 'venezuelan', 'yemeni'
    ], email, firstName, lastName, nationality, tokenButtons, toNewsletter, termsAndConditions,
    recaptcha = false,
    fileData = false;

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
      $('.select2').addClass('error');
      $('#select2-nationality-container').css('cssText','color: darkred !important');
    } else {
      nationality.removeClass('error');
      $('.select2-selection__rendered').removeAttr('style');
      $('.select2').removeClass('error');

    }

    if (!termsAndConditions.prop('checked')) {
      error = true;
      termsAndConditions.addClass('error');
      $('label[for="termsAndCond"]').addClass('error-radio');
    } else {
      termsAndConditions.removeClass('error-radio');
      $('label[for="termsAndCond"]').removeClass('error-radio');

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

  $('#nationality').select2({
    minimumResultsForSearch: -1,
    width: '100%'
  });

  grecaptcha.ready(function () {
    grecaptcha.execute('6LcO0ocUAAAAABj11_siC5P2rZSsxviho9yi0XMh', {action: 'homepage'}).then(function (token) {

      var form = new FormData();
      form.append("secret", "6LcO0ocUAAAAAIjN4_imwakEeiP1XcTARILJmMmh");
      form.append("response", token);

      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.google.com/recaptcha/api/siteverify",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
      };

      jQuery.ajax(settings).done(function (response) {
        recaptcha = JSON.parse(response).success;
      });

    });

  });

  // Sticky slider on scrolling
  window.onscroll = function () {
    var sticky = 20;
    var header = $("#mainHeader");

    if (window.pageYOffset > sticky) {
      header.addClass("sticky-header");
    } else {
      header.removeClass("sticky-header");
    }
  };

  // Call modal proposition of registration
  $('.document-download').on('click', function (e) {
    e.preventDefault();

    fileData = {
      name: $(this).data('doc-name').toLowerCase(),
      link:  $(this).attr('href')
  };

    $('#registerModal').modal('show');

  });

  // Show register form before downloading document
  $('.show-register-form').on('click', function (e) {
    e.preventDefault();

    $('#registerModal').modal('hide');

    setTimeout(function () {
      $('#whitelistModal').modal('show');
    }, 500);

  });

  // Show download modal and set data for downloading
  $('.show-download-modal').on('click', function (e) {
    e.preventDefault();
    var downloadModal = $('#downloadModal');

    $('#registerModal').modal('hide');

    downloadModal.find('.btn').attr('href', fileData.link).text('Download ' + capitalizeFirstLetter(fileData.name));
    setTimeout(function () {
      downloadModal.modal('show');
    }, 500)
  });

  // Show thank you modal after downloading
  $('.show-thanks-modal').on('click', function () {

    $('#downloadModal').modal('hide');
    $('#checkModal').modal('hide');

    setTimeout(function () {
      $('#whitelistModalSend').find('.modal-title').html('Thank you!<br>In the meantime, you can...').end().modal('show');
    }, 500);

  });

  // Show thank you modal after registration
  $('.show-whitelist-modal').on('click', function () {
    fileData = false;
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
        $('#whitelistModal').modal('hide');

        if (fileData) {
          setTimeout(function () {
            $('#checkModal').find('.btn').attr('href', fileData.link).text('Download ' + capitalizeFirstLetter(fileData.name)).end().modal('show');
          }, 500)

        } else {
          $('#whitelistModalSend').find('.modal-title').html('Please check your email, we will contact you shortly with more information!').end().modal('show');
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

      if ($(self).hasClass('more')) {
        landBlock.find('.more').addClass('active');
      } else {
        landBlock.find('.less').addClass('active');
      }
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

});