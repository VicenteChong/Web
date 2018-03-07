mui.init();

$('.mui-icon-closeempty').on('tap', function() {
   var launchView = plus.webview.getLaunchWebview();
   mui.fire(launchView, 'CLOSE_RESULT');
});

document.addEventListener('RENDER_DATA', function(evt) {
   var inputs = evt.detail.inputs;
   $('#addHistory').data('__history__', inputs).removeClass('disabled');
   $('#resTitleText').html(inputs['type'] == 1 ? '弃电率' : '新能源装机(万千瓦)');
   $('#resValue').html(inputs['type'] == 1 ? inputs['__result__'][0] + '%' : inputs['__result__'][0]);
   $('#xnkjzyl').html(inputs['__xnkjzylValue__'][0] + '%');
   $('#xnyfdlzb').html(inputs['__xnyfdlzzfdlblValue__'][0] + '%');
   $('#zlwscf').html(inputs['__zlwsxnycfValue__'][0] + '%');
   $('#zllyxss').html(inputs['__usedHoursValue__'][0]);
});

$('#addHistory').on('click', function() {
   var $this = $(this);

   if($this.hasClass('disabled')) {
      return;
   }

   var inputs = $this.data('__history__');
   addHistory(inputs);
   $this.addClass('disabled');
});

mui.back = function() {
   var launchView = plus.webview.getLaunchWebview();
   mui.fire(launchView, 'CLOSE_RESULT');
};

mui.plusReady(function() {

});