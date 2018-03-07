mui.init();

$('.card-wrapper').on('tap', function() {
   var dtype = $(this).attr('dtype');

   mui.openWindow({
      url: 'analysis_data.html',
      extras: {
         type: dtype
      }
   });
});


mui.plusReady(function() {

});