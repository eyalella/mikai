
/*jQuery(document).ready(function() {
  jQuery(".sidebar .widget-featured-product .products-grid").owlCarousel({
	singleItem:true,
    navigation : true,
    rtl: true,
  });
});*/
jQuery(document).ready(function(){
    jQuery(".sidebar .widget-featured-product .products-grid").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      rtl: true,
      dots: true,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false
    });
  });