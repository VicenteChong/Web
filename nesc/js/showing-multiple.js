mui.init();
var inputs = null;
var nameMapper = {
   "1": "弃电率",
   "2": "新能源装机",
   "3": "最大负荷",
   "4": "上备用系数",
   "5": "调峰率",
   "6": "自备电厂占比"
};

mui('.mui-scroll-wrapper').scroll();

var tmpl = '<div class="desc-title">' +
               '<span>{title}</span>：' +
               '<span>{value}</span>' +
            '</div>' +
            '<ul class="mui-table-view">' +
               '<li class="mui-table-view-cell">' +
                  '<span>{xnyzjQdl}</span>' +
                  '<span class="mui-pull-right">{xnyzjQdlValue}</span>' +
               '</li>' +
               '<li class="mui-table-view-cell">' +
                  '<span>新能源发电量占总发电量比例(%)</span>' +
                  '<span class="mui-pull-right">{xnyfdlzb}</span>' +
               '</li>' +
               '<li class="mui-table-view-cell mui-collapse">' +
                  '<a class="mui-navigate-right">其他</a>' +
                  '<div class="mui-collapse-content">' +
                     '<ul class="mui-table-view">' +
                        '<li class="mui-table-view-cell">' +
                           '<span>消纳空间占有率(%)</span>' +
                           '<span class="mui-pull-right">{xnkjzyl}</span>' +
                        '</li>' +
                        '<li class="mui-table-view-cell">' +
                           '<span>直外送中新能源成分(%)</span>' +
                           '<span class="mui-pull-right">{zlwscf}</span>' +
                        '</li>' +
                        '<li class="mui-table-view-cell">' +
                           '<span>外送通道利用小时数</span>' +
                           '<span class="mui-pull-right">{zllyxss}</span>' +
                        '</li>' +
                     '</ul>' +
                  '</div>' +
               '</li>' +
            '</ul>';

var getXAxisName = function(inputs) {
   var xname = '';
   var multipleType = inputs['multipleType'];

   if(multipleType == 1) {
      xname = '最大负荷(万千瓦)';
   }
   else if(multipleType == 2) {
      xname = '调峰率(%)';
   }
   else if(multipleType == 3) {
      xname = '新能源装机(万千瓦)';
   }

   return xname;
};

var renderChart = function(inputs) {
   var iChart = echarts.init(document.getElementById('chartWrapper'));
   var xname = getXAxisName(inputs);
   var yname = inputs['type'] == 1 ? '弃电率(%)' : '新能源装机(万千瓦)';
   var xd = [];
   var yd = inputs['__result__'];
   var multipleType = inputs['multipleType'];

   if(multipleType == 2) {
      $.each(inputs['_multipleInput'], function(idx, d) {
         xd.push(d * 100);
      });
   }
   else {
      $.each(inputs['_multipleInput'], function(idx, d) {
         xd.push(d / 10);
      });
   }

   var option = {
      title: {
         text: '计算结果'
      },
      tooltip: {},
      legend: {
         data: ['销量']
      },
      xAxis: {
         name: xname,
         nameLocation: 'middle',
         nameGap: '24',
         data: xd
      },
      yAxis: {
         name: yname
      },
      series: [{
         type: 'line',
         label: {
            normal: {
               show: true
            }
         },
         data: yd
      }]
   };

   iChart.setOption(option);
};

var renderItems = function(inputs) {
   var html = '';
   var title = getXAxisName(inputs);

   for(var i in inputs['_multipleInput']) {
      var value = inputs['_multipleInput'][i];

      if(inputs['multipleType'] != 2) {
         value = value / 10;
      }
      else {
         value = value * 100;
      }

      html += tmpl.replace(/{title}/, title)
         .replace(/{value}/, value.toFixed(0))
         .replace(/{xnkjzyl}/, inputs['__xnkjzylValue__'][i])
         .replace(/{xnyfdlzb}/, inputs['__xnyfdlzzfdlblValue__'][i])
         .replace(/{zlwscf}/, inputs['__zlwsxnycfValue__'][i])
         .replace(/{zllyxss}/, inputs['__usedHoursValue__'][i])
         .replace(/{xnyzjQdl}/, nameMapper[inputs['type']])
         .replace(/{xnyzjQdlValue}/, inputs['type'] == 1 ? inputs['__result__'][i] + '%' : inputs['__result__'][i])
   }

   $('#itemContainer').html(html);
};

mui.plusReady(function(evt) {
   var webview = plus.webview.currentWebview();
   inputs = webview.inputs;

   if(webview.openby == 'history') {
      $('#addHistory').addClass('disabled');
   }

   renderChart(inputs);
   renderItems(inputs);
});