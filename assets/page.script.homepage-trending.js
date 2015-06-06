jQuery(document).ready(function() {
  if($(window).width() > 600) {
    jQuery('.widget-trending-product .products-grid').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    rtl: true,
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          adaptiveHeight: true
        }
      }
    ]
  });
  }
});