jQuery(document).ready(function ($) {
  //anchor links
  $('.main-nav a[href*="#"], .anchor').click(function (event) {
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top - 100
    }, 500);
    event.preventDefault();
  });
});