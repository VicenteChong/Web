var datefmt = 'YYYY-MM';
var timefmt = 'HH:mm';
var type = 1; // 1: 弃电率计算， 2: 新能源装机计算
var name = "";
var multiple = false; // 是否多值计算
var multipleType = 1; // 1: 最大负荷，2: 火电调峰率，3: 新能源装机
mui.init();
var nameMapper = {
   "1": "弃电率",
   "2": "新能源装机",
   "3": "最大负荷",
   "4": "上备用系数",
   "5": "调峰率",
   "6": "自备电厂占比",
   "8": "中长期外送",
   "9": '短期现货',
   "10": '综合利用'
};

var nameMapperWithUnit = {
   "1": "弃电率(%)",
   "2": "新能源装机(万千瓦)",
   "3": "最大负荷(万千瓦)",
   "4": "上备用系数(%)",
   "5": "调峰率(%)",
   "6": "自备电厂占比(%)",
   "8": "中长期外送",
   "9": '短期现货',
   "10": '综合利用'
};

mui('.mui-scroll-wrapper').scroll();

$(".mui-icon.mui-icon-info").on("tap", function(e) {
   e.stopPropagation();

   switch(this.id) {
      case 'fhlInfo':
         mui.alert('平均负荷占最大负荷的比例。');
         break;
      case 'sbyxsInfo':
         mui.alert('总开机容量高于最大负荷的百分比。');
         break;
      case 'hdtflInfo':
         mui.alert('总开机容量中可调节容量占其的比例。');
         break;
      case 'zbdcblInfo':
         mui.alert('总开机容量中自备电厂开机容量占比。');
         break;
      case 'fdzjbInfo':
         mui.alert('风电装机容量占新能源总装机容量的比例。');
         break;
      case 'zlzcqInfo':
         mui.alert('外送中需要长期保证的外送电力。');
         break;
      case 'zlxhInfo':
         mui.alert('外送中的现货交易部分，不需要长期保证。');
         break;
      case 'jlzcqInfo':
         mui.alert('交流外送中需要长期保证的外送电力，例如省间的年度交易。');
         break;
      case 'ksjyxhInfo':
         mui.alert('指跨省实时交易能力。');
         break;
   }
});

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
   '<span>外送中新能源成分(%)</span>' +
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

var tmpl2 = '<div class="desc-title">' +
   '<span>{title}</span>：' +
   '<span>{value}</span>' +
   '</div>' +
   '<ul class="mui-table-view">' +
   '<li class="mui-table-view-cell">' +
   '<span>{xnyzjQdl}</span>' +
   '<span class="mui-pull-right">{xnyzjQdlValue}</span>' +
   '</li>' +
   '<li class="mui-table-view-cell">' +
   '<span>外送通道利用小时数</span>' +
   '<span class="mui-pull-right">{zllyxss}</span>' +
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
   '<span>外送中新能源成分(%)</span>' +
   '<span class="mui-pull-right">{zlwscf}</span>' +
   '</li>' +
   '<li class="mui-table-view-cell">' +
   '<span>新能源发电量占总发电量比例(%)</span>' +
   '<span class="mui-pull-right">{xnyfdlzb}</span>' +
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
   } else if(multipleType == 2) {
      xname = '调峰率(%)';
   } else if(multipleType == 3) {
      xname = '新能源装机(万千瓦)';
   }

   return xname;
};

$('.tab-wrapper .tab').on('tap', function() {
   $(".tab").removeClass("selected");
   $(this).addClass("selected");
   multiple = $('#multiple').hasClass('mui-active');

   if($(this).hasClass("tab-1")) {
      $("#calcPane").show();
      $("#resultPane").hide();
      $("#mulResultPane").hide();
   } else {
      if(multiple || type == 8 || type == 9 || type == 10) {
         $("#calcPane").hide();
         $("#resultPane").hide();
         $("#mulResultPane").show();
      } else {
         $("#calcPane").hide();
         $("#resultPane").show();
         $("#mulResultPane").hide();
      }
   }
});

var itempicker = new mui.PopPicker();

$('.item-picker').on('tap', function() {
   var $this = $(this);
   $this.focus();
   var min = 0;
   var max = 100;
   var items = [];
   var selectedIndex = 0;
   var vText = $(this).find('.v-text');

   if($this.attr('min') && $this.attr('max')) {
      min = Number($this.attr('min'));
      max = Number($this.attr('max'));
   }

   var index = 0;

   for(var k = min; k <= max; k++) {
      var item = {
         text: k + '%',
         value: k + '%'
      };

      items.push(item);

      if(vText.html() == item.text) {
         selectedIndex = index;
      }

      index++;
   }

   itempicker.setData(items);

   itempicker.pickers[0].setSelectedIndex(selectedIndex);
   itempicker.show(function(res) {
      vText.html(res[0].value);
   });
});

var dates = ['sdate', 'edate'];

dates.forEach(function(id) {
   $('#' + id).on('tap', function() {
      var stimeText = $('#' + id + 'Text');

      var dtpicker = new mui.DtPicker({
         type: 'month',
         value: stimeText.html()
      });

      dtpicker.show(function(dt) {
         stimeText.html(dt.value);
      });
   });
});

var times = ['stime', 'etime', 'stime2', 'etime2'];
times.forEach(function(id) {
   $('#' + id).on('tap', function() {
      var stimeText = $('#' + id + 'Text');
      plus.nativeUI.pickTime(function(evt) {
         stimeText.html(moment(evt.date).format(timefmt));
      }, function() {

      }, {
         time: moment(stimeText.html(), timefmt).toDate()
      });
   });
});

$('input[type=range]').on('touchstart', function() {
   $(this).focus();
});

document.getElementById('multiple').addEventListener('toggle', function(evt) {
   if(evt.detail.isActive) {
      var idmapper = {};
      var actionbuttons = [];
      var multiTypeMapper = {};

      if(type == 1 || type == 4 || type == 6) {
         actionbuttons = [{
               title: '最大负荷'
            },
            {
               title: '调峰率'
            },
            {
               title: '新能源装机'
            }
         ];

         idmapper = {
            "1": "zdfhWrapper",
            "2": "fdtflWrapper",
            "3": "xnyzjWrapper"
         };

         multiTypeMapper = {
            "1": "1",
            "2": "2",
            "3": "3"
         };
      } else if(type == 2) {
         actionbuttons = [{
               title: '最大负荷'
            },
            {
               title: '调峰率'
            }
         ];

         idmapper = {
            "1": "zdfhWrapper",
            "2": "fdtflWrapper"
         };

         multiTypeMapper = {
            "1": "1",
            "2": "2"
         };
      } else if(type == 3) {
         actionbuttons = [{
               title: '调峰率'
            },
            {
               title: '新能源装机'
            }
         ];

         idmapper = {
            "1": "fdtflWrapper",
            "2": "xnyzjWrapper"
         };

         multiTypeMapper = {
            "1": "2",
            "2": "3"
         };
      } else if(type == 5) {
         actionbuttons = [{
               title: '最大负荷'
            },
            {
               title: '新能源装机'
            }
         ];

         idmapper = {
            "1": "zdfhWrapper",
            "2": "xnyzjWrapper"
         };

         multiTypeMapper = {
            "1": "1",
            "2": "3"
         };
      }

      var actionstyle = {
         title: '选择参与多值计算的项',
         cancel: '取消',
         buttons: actionbuttons
      };
      plus.nativeUI.actionSheet(actionstyle, function(_evt) {
         if(_evt.index <= 0) {
            mui("#multiple").switch().toggle();
            return;
         }

         var _idx = _evt.index;
         multipleType = multiTypeMapper[_idx];

         $('.' + idmapper[_idx] + '-single').hide();
         $('.' + idmapper[_idx] + '-multiple').show();
      });
   } else {

      $('.zdfhWrapper-multiple').hide();
      $('.fdtflWrapper-multiple').hide();
      $('.xnyzjWrapper-multiple').hide();

      if(type != 3) {
         $('.zdfhWrapper-single').show();
      }

      if(type != 5) {
         $('.fdtflWrapper-single').show();
      }

      if(type != 2) {
         $('.xnyzjWrapper-single').show();
      }
   }
});

var doCalc = function(inputs) {
   init(inputs);

   if(xnyxnnl(inputs) === false) {
      mui('#calc').button('reset');
      plus.nativeUI.alert('系统无法平衡!');
      return;
   }

   var resValue = 0;
   var usedHoursValue = zllyxssjs(inputs);
   var xnkjzylValue = xnkjzyl(inputs);
   var xnyfdlzzfdlblValue = xnyfdlzzfdlbl(inputs);
   var zlwsxnycfValue = zlwsxnycf(inputs);

   // 在这儿根据不同的type计算结果
   // type == 1: 计算弃电率
   if(type == 1 || type == 8 || type == 9 || type == 10) {
      resValue = (xnyqdl(inputs) / xnyfdl(inputs) * 100).toFixed(2);
   }
   // 计算新能源装机
   else if(type == 2) {
      resValue = (jsxnyzj(inputs) / 10).toFixed(0);
   }
   // 计算最大负荷
   else if(type == 3) {
      resValue = (jszdfh(inputs) / 10).toFixed(0);
   }
   // 上备用系数
   else if(type == 4) {
      resValue = (jssbyxs(inputs) * 100).toFixed(2);
   }
   // 火电调峰率
   else if(type == 5) {
      resValue = (jshdtfl(inputs) * 100).toFixed(2);
   }
   // 自备电厂占比
   else if(type == 6) {
      resValue = (jszbdcbl(inputs) * 100).toFixed(2);
   }

   return {
      resValue: resValue,
      usedHoursValue: usedHoursValue.toFixed(0),
      xnkjzylValue: (xnkjzylValue * 100).toFixed(2),
      xnyfdlzzfdlblValue: (xnyfdlzzfdlblValue * 100).toFixed(2),
      zlwsxnycfValue: (zlwsxnycfValue * 100).toFixed(2)
   };
};

$('#calc').on('click', function() {
   mui('#calc').button('loading');

   setTimeout(function() {
      multiple = $('#multiple').hasClass('mui-active');
      var sdate = moment($('#sdateText').html(), datefmt).startOf('month').toDate().getTime();
      var edate = moment($('#edateText').html(), datefmt).endOf('month').toDate().getTime();
      var zdfhValue = $('#zdfhIpt').val().trim() || 0;
      var zdfhzdValue = $('#zdfhzdIpt').val().trim() || 0;
      var zdfhzxValue = $('#zdfhzxIpt').val().trim() || 0;
      var zdfhjgValue = $('#zdfhjgIpt').val().trim() || 0;
      var fhlValue = $('#fhlIpt').html().replace(/%/, '');
      var sbyxsValue = $('#sbyxsIpt').html().replace(/%/, '');
      var hdtflValue = $('#hdtflIpt').html().replace(/%/, '');
      var hdtflzdValue = $('#hdtflzdIpt').html().replace(/%/, '');
      var hdtflzxValue = $('#hdtflzxIpt').html().replace(/%/, '');
      var hdtfljgValue = $('#hdtfljgIpt').html().replace(/%/, '');
      var xnyzjValue = $('#xnyzjIpt').val().trim() || 0;
      var xnyzjzdValue = $('#xnyzjzdIpt').val().trim() || 0;
      var xnyzjzxValue = $('#xnyzjzxIpt').val().trim() || 0;
      var xnyzjjgValue = $('#xnyzjjgIpt').val().trim() || 0;
      var fdzjbValue = $('#fdzjbIpt').html().replace(/%/, '');
      var mbqdlValue = $('#mbqdlIpt').html().replace(/%/, '');
      var zbdcblValue = $('#zbdcblIpt').html().replace(/%/, '');
      var zlssnlValue = $('#zlssnlIpt').val().trim() || 0;
      var stime = $('#stimeText').html();
      var etime = $('#etimeText').html();
      var zlgffhValue = $('#zlgffhIpt').val().trim() || 0;
      var zlpdfhValue = $('#zlpdfhIpt').val().trim() || 0;
      var wsjsbcValue = $('#wsjsbcIpt').val().trim() || 0;
      var zlxhValue = $('#zlxhIpt').val().trim() || 0;
      var zlxhbcValue = $('#zlxhbcIpt').val().trim() || 0;
      var isZlxh = $('#isZlxh').hasClass('mui-active');
      var jlssnlValue = $('#jlssnlIpt').val().trim() || 0;
      var stime2 = $('#stime2Text').html();
      var etime2 = $('#etime2Text').html();
      var jlgffhValue = $('#jlgffhIpt').val().trim() || 0;
      var jlpdfhValue = $('#jlpdfhIpt').val().trim() || 0;
      var jlxhValue = $('#jlxhIpt').val().trim() || 0;
      var isJlxh = $('#isJlxh').hasClass('mui-active');
      var isJsgxl = $('#isJsgxl').hasClass('mui-active');

      if(moment(edate, datefmt).isBefore(sdate, datefmt)) {
         mui.toast('结束日期不能早于开始日期');
         mui('#calc').button('reset');
         return;
      }

      if(moment(etime, timefmt).isBefore(moment(stime, timefmt))) {
         mui.toast('结束时间不能早于开始时间');
         mui('#calc').button('reset');
         return;
      }

      if((type == 8 || type == 10) &&
         ($('#zlgffhIpt').val().trim() == '' ||
            $('#zlpdfhIpt').val().trim() == '' ||
            $('#zlssnlIpt').val().trim() == '')) {
         mui.toast('外送（中长期）信息有误');
         mui('#calc').button('reset');
         return;
      }

      if(multiple) {
         if(multipleType == 1 && (!zdfhzdValue || !zdfhjgValue)) {
            mui.toast('最大负荷最大值、最小值和间隔输入有误');
            mui('#calc').button('reset');
            return;
         }

         if(multipleType == 2 && (!hdtflzdValue || !hdtfljgValue)) {
            mui.toast('调峰率最大值、最小值和间隔输入有误');
            mui('#calc').button('reset');
            return;
         }

         if(multipleType == 3 && (!xnyzjzdValue || !xnyzjjgValue)) {
            mui.toast('新能源装机最大值、最小值和间隔输入有误');
            mui('#calc').button('reset');
            return;
         }
      }

      var inputs = {
         multiple: multiple,
         multipleType: multipleType,
         type: type,
         sdate: sdate,
         edate: edate,
         zdfhValue: Number(zdfhValue) * 10,
         zdfhzdValue: Number(zdfhzdValue) * 10,
         zdfhzxValue: Number(zdfhzxValue) * 10,
         zdfhjgValue: Number(zdfhjgValue) * 10,
         fhlValue: Number(fhlValue) / 100,
         sbyxsValue: Number(sbyxsValue) / 100,
         hdtflValue: Number(hdtflValue) / 100,
         hdtflzdValue: Number(hdtflzdValue) / 100,
         hdtflzxValue: Number(hdtflzxValue) / 100,
         hdtfljgValue: Number(hdtfljgValue) / 100,
         xnyzjValue: Number(xnyzjValue) * 10,
         xnyzjzdValue: Number(xnyzjzdValue) * 10,
         xnyzjzxValue: Number(xnyzjzxValue) * 10,
         xnyzjjgValue: Number(xnyzjjgValue) * 10,
         fdzjbValue: Number(fdzjbValue) / 100,
         mbqdlValue: Number(mbqdlValue) / 100,
         zbdcblValue: Number(zbdcblValue) / 100,
         zlssnlValue: Number(zlssnlValue) * 10,
         stime: stime,
         etime: etime,
         zlgffhValue: Number(zlgffhValue) * 10,
         zlpdfhValue: Number(zlpdfhValue) * 10,
         wsjsbcValue: Number(wsjsbcValue) * 10,
         zlxhValue: Number(zlxhValue) * 10,
         zlxhbcValue: Number(zlxhValue) * 10,
         isZlxh: isZlxh,
         jlssnlValue: Number(jlssnlValue) * 10,
         stime2: stime2,
         etime2: etime2,
         jlgffhValue: Number(jlgffhValue) * 10,
         jlpdfhValue: Number(jlpdfhValue) * 10,
         jlxhValue: Number(jlxhValue) * 10,
         isJlxh: isJlxh
      };

      if(inputs.zlgffhValue + inputs.zlxhValue > inputs.zlssnlValue) {
         mui.toast('外送能力有误');
         mui('#calc').button('reset');
         return;
      }

      if((type == 8 || type == 10) && !inputs.wsjsbcValue) {
         mui.toast('必须填写高峰计算步长');
         mui('#calc').button('reset');
         return;
      }

      if(type == 9 && !inputs.zlxhbcValue) {
         mui.toast('必须填写现货计算步长');
         mui('#calc').button('reset');
         return;
      }

      if((type == 8 || type == 10) && !inputs.zlgffhValue && !inputs.zlxhValue) {
         mui.toast('外送高峰和短期现货不能同时为0');
         mui('#calc').button('reset');
         return;
      }

      if((type == 8 || type == 10) && inputs.zlpdfhValue < (inputs.zlssnlValue * 0.1)) {
         mui.toast('外送低谷电力不能小于外送能力的10%');
         mui('#calc').button('reset');
         return;
      }

      if(type == 9 && inputs.zlxhValue <= 0) {
         mui.toast('短期现货必须大于0');
         mui('#calc').button('reset');
         return;
      }

      var _multipleInput = [];
      var _resValue = [];
      var _usedHoursValue = [];
      var _xnkjzylValue = [];
      var _xnyfdlzzfdlblValue = [];
      var _zlwsxnycfValue = [];
      var gxlValues = {};

      var resCollect = function(res) {
         if(!res) {
            return;
         }

         _resValue.push(res['resValue']);
         _usedHoursValue.push(res['usedHoursValue']);
         _xnkjzylValue.push(res['xnkjzylValue']);
         _xnyfdlzzfdlblValue.push(res['xnyfdlzzfdlblValue']);
         _zlwsxnycfValue.push(res['zlwsxnycfValue']);

         return true;
      };

      var isValid = true;

      if(multiple) {
         if(multipleType == 1) {
            for(var _d = inputs['zdfhzxValue']; _d < inputs['zdfhzdValue']; _d += inputs['zdfhjgValue']) {
               inputs['zdfhValue'] = _d;
               _multipleInput.push(_d);
               isValid = resCollect(doCalc(inputs));
            }

            inputs['zdfhValue'] = inputs['zdfhzdValue'];
            _multipleInput.push(inputs['zdfhzdValue']);
            isValid = resCollect(doCalc(inputs));
         } else if(multipleType == 2) {
            for(var _d = inputs['hdtflzxValue']; _d < inputs['hdtflzdValue']; _d += inputs['hdtfljgValue']) {
               inputs['hdtflValue'] = _d;
               _multipleInput.push(_d);
               isValid = resCollect(doCalc(inputs));
            }

            inputs['hdtflValue'] = inputs['hdtflzdValue'];
            _multipleInput.push(inputs['hdtflzdValue']);
            isValid = resCollect(doCalc(inputs));
         } else if(multipleType == 3) {
            for(var _d = inputs['xnyzjzxValue']; _d < inputs['xnyzjzdValue']; _d += inputs['xnyzjjgValue']) {
               inputs['xnyzjValue'] = _d;
               _multipleInput.push(_d);
               isValid = resCollect(doCalc(inputs));
            }

            inputs['xnyzjValue'] = inputs['xnyzjzdValue'];
            _multipleInput.push(inputs['xnyzjzdValue']);
            isValid = resCollect(doCalc(inputs));
         }
      } else if(type == 8 || type == 9 || type == 10) {
         // 克隆一份
         var inputs2 = JSON.parse(JSON.stringify(inputs));
         var intervals = [-3, -2, -1, 0, 1, 2, 3];
         var wsjsbcValue = inputs2['wsjsbcValue'];
         var zlxhbcValue = inputs2['zlxhbcValue'];
         var zlssnlValue = inputs2['zlssnlValue'];
         var zlgffhValue = inputs2['zlgffhValue'];
         var zlpdfhValue = inputs2['zlpdfhValue'];
         var zlxhValue = inputs2['zlxhValue'];
         var zlpdbcValue = wsjsbcValue / zlgffhValue;

         for(var i = 0; i < intervals.length; i++) {
            var iterval = intervals[i] * wsjsbcValue;
            var itervalxh = intervals[i] * zlxhbcValue;
            var itervalpd = intervals[i] * zlpdfhValue * zlpdbcValue;
            var zlgffhValue1 = zlgffhValue + ((type == 8 || type == 10) ? iterval : 0);
            var zlpdfhValue1 = zlpdfhValue + ((type == 8 || type == 10) ? itervalpd : 0);
            var zlxhValue1 = 0;

            if(type == 9) {
               zlxhValue1 = zlxhValue + itervalxh;
            }
            else if(type == 10) {
               zlxhValue1 = zlssnlValue - zlgffhValue1;
            }

            if(zlgffhValue1 < 0 || zlpdfhValue1 < 0 || zlxhValue1 < 0) {
               continue;
            }

            if(zlgffhValue1 > zlssnlValue || zlxhValue1 > zlssnlValue) {
               break;
            }

            if(type == 8) {
               _multipleInput.push([zlgffhValue1, zlpdfhValue1]);
            }
            else if(type == 9) {
               _multipleInput.push([zlxhValue1]);
            }
            else if(type == 10) {
               _multipleInput.push([zlgffhValue1, zlpdfhValue1, zlxhValue1]);
            }

            inputs2['zlgffhValue'] = zlgffhValue1;
            inputs2['zlpdfhValue'] = zlpdfhValue1;
            inputs2['zlxhValue'] = zlxhValue1;
            isValid = resCollect(doCalc(inputs2));
         }
      } else {
         isValid = resCollect(doCalc(inputs));
      }

      mui('#calc').button('reset');

      if(!isValid) {
         return;
      }

      // 计算贡献率
      if(!multiple && isJsgxl && type == 1) {
         // 克隆一份
         var inputs2 = JSON.parse(JSON.stringify(inputs));
         // 最大负荷乘以1.1倍
         inputs2['zdfhValue'] = inputs2['zdfhValue'] * 1.1;
         var res = doCalc(inputs2);
         gxlValues['最大负荷'] = res['resValue'];

         // 负荷率乘以1.1倍
         inputs2['fhlValue'] = inputs2['fhlValue'] * 1.1;
         var res = doCalc(inputs2);
         gxlValues['负荷率'] = res['resValue'];

         // 上备用系数乘以1.1倍
         inputs2['sbyxsValue'] = inputs2['sbyxsValue'] * 1.1;
         var res = doCalc(inputs2);
         gxlValues['上备用系数'] = res['resValue'];

         // 调峰率乘以1.1倍
         inputs2['hdtflValue'] = inputs2['hdtflValue'] * 1.1;
         var res = doCalc(inputs2);
         gxlValues['调峰率'] = res['resValue'];

         // 自备电厂占比乘以1.1倍
         if(inputs2['zbdcblValue']) {
            inputs2['zbdcblValue'] = inputs2['zbdcblValue'] * 1.1;
            var res = doCalc(inputs2);
            gxlValues['自备电厂占比'] = res['resValue'];
         }

         // 计算贡献率
         var sum = 0;

         for(var key in gxlValues) {
            gxlValues[key] = gxlValues[key] - _resValue;
            sum += gxlValues[key];
         }

         for(var key in gxlValues) {
            gxlValues[key] = Number(((gxlValues[key] / sum) * 100).toFixed(2));
         }

         setTimeout(function() {
            var iChart = echarts.init(document.getElementById('gxlChartWrapper'));
            var d = [];

            for(var key in gxlValues) {
               d.push({
                  name: key,
                  value: gxlValues[key]
               });
            }

            var option = {
               title: {
                  text: '弃电贡献率'
               },
               tooltip: {},
               legend: {
                  data: ['最大负荷', '负荷率', '上备用系数', '调峰率', '自备电厂占比']
               },
               series: [{
                  type: 'pie',
                  radius: '60%',
                  data: d,
                  itemStyle: {
                     normal: {
                        label: {
                           show: true,
                           formatter: '{b}:{d}%'
                        },
                        labelLine: {
                           show: true
                        }
                     }
                  }
               }]
            };

            iChart.setOption(option);
         }, 200);
         $('#gxlChartWrapper').show();
         $('#glxTitleText').show();
      } else {
         $('#gxlChartWrapper').hide();
         $('#glxTitleText').hide();
      }

      inputs['_multipleInput'] = _multipleInput;
      inputs['__result__'] = _resValue;
      inputs['__usedHoursValue__'] = _usedHoursValue;
      inputs['__xnkjzylValue__'] = _xnkjzylValue;
      inputs['__xnyfdlzzfdlblValue__'] = _xnyfdlzzfdlblValue;
      inputs['__zlwsxnycfValue__'] = _zlwsxnycfValue;
      inputs['__time__'] = +new Date();

      if(multiple) {
         $(".tab").removeClass("selected");
         $(".tab-2").addClass("selected");
         $("#calcPane").hide();
         $("#resultPane").hide();
         $("#mulResultPane").show();

         renderChart(inputs);
         renderItems(inputs);
      } else if(type == 8 || type == 9 || type == 10) {
         $(".tab").removeClass("selected");
         $(".tab-2").addClass("selected");
         $("#calcPane").hide();
         $("#resultPane").hide();
         $("#mulResultPane").show();
         renderChart2(inputs);
         renderItems2(inputs);
      } else {
         $(".tab").removeClass("selected");
         $(".tab-2").addClass("selected");
         $("#calcPane").hide();
         $("#resultPane").show();
         $("#mulResultPane").hide();
         //       $('#resTitleText').html(inputs['type'] == 1 ? '弃电率' : '新能源装机(万千瓦)');
         $('#resValue').html((inputs['type'] == 2 || inputs['type'] == 3) ? inputs['__result__'][0] : inputs['__result__'][0] + '%');
         $('#xnkjzyl').html(inputs['__xnkjzylValue__'][0] + '%');
         $('#xnyfdlzb').html(inputs['__xnyfdlzzfdlblValue__'][0] + '%');
         $('#zlwscf').html(inputs['__zlwsxnycfValue__'][0] + '%');
         $('#zllyxss').html(inputs['__usedHoursValue__'][0]);
         renderResultInput(inputs);
      }

      $('.add-history').data('__history__', inputs).removeClass('disabled');
   }, 500);
});

$('.add-history').on('click', function() {
   var $this = $(this);

   if($this.hasClass('disabled')) {
      return;
   }

   var inputs = $this.data('__history__');
   addHistory(inputs);
   $this.addClass('disabled');
});

$('input[type="number"]').focus(function(e) {
   e.stopPropagation();

   var target = this;

   if(type != 10) {
      $(this).val('');
   }

   setTimeout(function() {
      target.scrollIntoViewIfNeeded();
   }, 400);
});

var renderInput = function(d) {
   type = d['type'];
   multiple = d['multiple'];
   var multipleType = d['multipleType'];
   //$tab = $('.tab-wrapper .tab-' + type).addClass('selected').siblings().removeClass('selected');

   $('#xnyzjWrapper').toggle(type == 1);
   $('#mbqdlWrapper').toggle(type == 2);

   $('#sdateText').html(moment(d['sdate']).format(datefmt));
   $('#edateText').html(moment(d['edate']).format(datefmt));

   $('#zdfhIpt').val(d['zdfhValue'] / 10);
   $('#hdtflIpt').html((d['hdtflValue'] * 100) + '%');
   $('#xnyzjIpt').val(d['type'] == 2 ? 0 : d['xnyzjValue'] / 10);

   if(multiple) {
      $('#multiple').addClass('mui-active');
      var $switch = mui('#multiple').switch();
      $switch.handle.style.webkitTransform = 'translate(' + $switch.handleX + 'px,0)';

      if(multipleType == 1) {
         $('#zdfhIpt').val(null);
         $('#zdfhzdIpt').val(d['zdfhzdValue'] / 10);
         $('#zdfhzxIpt').val(d['zdfhzxValue'] / 10);
         $('#zdfhjgIpt').val(d['zdfhjgValue'] / 10);
         $('.zdfhWrapper-single').hide();
         $('.zdfhWrapper-multiple').show();
      } else if(multipleType == 2) {
         $('#hdtflIpt').html(0);
         $('#hdtflzdIpt').html((d['hdtflzdValue'] * 100) + '%');
         $('#hdtflzxIpt').html((d['hdtflzxValue'] * 100) + '%');
         $('#hdtfljgIpt').html((d['hdtfljgValue'] * 100) + '%');
         $('.fdtflWrapper-single').hide();
         $('.fdtflWrapper-multiple').show();
      } else if(multipleType == 3) {
         $('#xnyzjIpt').val(null);
         $('#xnyzjzdIpt').val(d['xnyzjzdValue'] / (d['type'] == 1 ? 10 : 1));
         $('#xnyzjzxIpt').val(d['xnyzjzxValue'] / (d['type'] == 1 ? 10 : 1));
         $('#xnyzjjgIpt').val(d['xnyzjjgValue'] / (d['type'] == 1 ? 10 : 1));
         $('.xnyzjWrapper-single').hide();
         $('.xnyzjWrapper-multiple').show();
      }
   } else {
      $('#multiple').removeClass('mui-active');
      var $switch = mui('#multiple').switch();
      $switch.handle.style.webkitTransform = 'translate(0,0)';
      $('.zdfhWrapper-single').show();
      $('.zdfhWrapper-multiple').hide();
      $('.fdtflWrapper-single').show();
      $('.fdtflWrapper-multiple').hide();
      $('.xnyzjWrapper-single').show();
      $('.xnyzjWrapper-multiple').hide();
   }

   $('#fhlIpt').html((d['fhlValue'] * 100).toFixed(0) + '%');
   $('#sbyxsIpt').html((d['sbyxsValue'] * 100).toFixed(0) + '%');
   $('#fdzjbIpt').html((d['fdzjbValue'] * 100).toFixed(0) + '%');
   $('#mbqdlIpt').html((d['mbqdlValue'] * 100).toFixed(0) + '%')
   $('#zbdcblIpt').html((d['zbdcblValue'] * 100).toFixed(0) + '%');
   $('#zlssnlIpt').val(d['zlssnlValue'] / 10);
   $('#stimeText').html(d['stime']);
   $('#etimeText').html(d['etime']);
   $('#zlgffhIpt').val(d['zlgffhValue'] / 10);
   $('#zlpdfhIpt').val(d['zlpdfhValue'] / 10);
   $('#zlxhIpt').val(d['zlxhValue'] / 10);

   if(d['isZlxh']) {
      $('#isZlxh').addClass('mui-active');
   }

   $('#jlssnlIpt').val(d['jlssnlValue'] / 10);
   $('#stime2Text').html(d['stime2']);
   $('#etime2Text').html(d['etime2']);
   $('#jlgffhIpt').val(d['jlgffhValue'] / 10);
   $('#jlpdfhIpt').val(d['jlpdfhValue'] / 10);
   $('#jlxhIpt').val(d['jlxhValue'] / 10);

   if(d['isJlxh']) {
      $('#isJlxh').addClass('mui-active');
   }
};

var renderResultInput = function(d) {
   $("#ksrq").html(moment(d['sdate']).format(datefmt));
   $("#jsrq").html(moment(d['edate']).format(datefmt));
   $("#zdfhText").html(d['zdfhValue'] / 10);
   $("#fhlText").html((d['fhlValue'] * 100) + '%');
   $("#sbyxsText").html((d['sbyxsValue'] * 100) + '%');
   $("#hdtflText").html((d['hdtflValue'] * 100) + '%');
   $("#zbdczbText").html((d['zbdcblValue'] * 100) + '%');
   $("#xnyzjText").html(d['xnyzjValue'] / 10);
   $("#fdzbText").html((d['fdzjbValue'] * 100) + '%');
   $("#mbqdlText").html((d['mbqdlValue'] * 100) + '%');
   $("#zlssnlText").html(d['zlssnlValue'] / 10);
   $("#gfkssj1").html(d['stime']);
   $("#gfjssj1").html(d['etime']);
   $("#gfdl1").html(d['zlgffhValue'] / 10);
   $("#dgdl1").html(d['zlpdfhValue'] / 10);
   $("#zlxh").html(d['zlxhValue'] / 10)
   $("#sfkvzlxh").html(d['isZlxh'] ? "是" : "否");
   $("#jlssnl").html(d['jlssnlValue'] / 10);
   $("#gfkssj2").html(d['stime2']);
   $("#gfjssj2").html(d['etime2']);
   $("#gfdl2").html(d['jlgffhValue'] / 10);
   $("#dgdl2").html(d['jlpdfhValue'] / 10);
   $("#ksjyxh").html(d['jlxhValue'] / 10);
   $("#sfkvks").html(d['isJlxh'] ? "是" : "否");
};

var renderChart = function(inputs) {
   var iChart = echarts.init(document.getElementById('chartWrapper'));
   var xname = getXAxisName(inputs);
   var xd = [];
   var yd = inputs['__result__'];
   var multipleType = inputs['multipleType'];

   if(multipleType == 2) {
      $.each(inputs['_multipleInput'], function(idx, d) {
         xd.push(d * 100);
      });
   } else {
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
         name: name
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

var renderChart2 = function(inputs) {
   var iChart = echarts.init(document.getElementById('chartWrapper'));
   var xname = type == 9 ? '现货' : '高峰';
   var xd = [];
   var yd1 = inputs['__result__'];
   var yd2 = inputs['__usedHoursValue__'];

   var multipleType = inputs['multipleType'];

   $.each(inputs['_multipleInput'], function(idx, d) {
      xd.push(Number((d[0] / 10).toFixed(0)));
   });

   var option = {
      title: {
         text: '计算结果'
      },
      grid: {
         right: '15%'
      },
      tooltip: {},
      xAxis: {
         name: xname,
         nameLocation: 'middle',
         nameGap: '24',
         data: xd
      },
      yAxis: [{
            name: '弃电率(%)',
            nameTextStyle: {
               color: '#e67e22'
            },
            splitLine: {
               show: false
            }
         },
         {
            name: '利用小时数(小时)',
            nameTextStyle: {
               color: '#3498db'
            },
            splitLine: {
               show: false
            }
         }
      ],
      series: [{
            type: 'line',
            label: {
               normal: {
                  show: true,
                  textStyle: {
                     color: '#e67e22'
                  }
               }
            },
            lineStyle: {
               normal: {
                  color: '#e67e22'
               }
            },
            data: yd1
         },
         {
            type: 'line',
            label: {
               normal: {
                  show: true,
                  textStyle: {
                     color: '#3498db'
                  }
               }
            },
            yAxisIndex: 1,
            lineStyle: {
               normal: {
                  color: '#3498db'
               }
            },
            data: yd2
         }
      ]
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
      } else {
         value = value * 100;
      }

      html += tmpl.replace(/{title}/, title)
         .replace(/{value}/, value.toFixed(0))
         .replace(/{xnkjzyl}/, inputs['__xnkjzylValue__'][i])
         .replace(/{xnyfdlzb}/, inputs['__xnyfdlzzfdlblValue__'][i])
         .replace(/{zlwscf}/, inputs['__zlwsxnycfValue__'][i])
         .replace(/{zllyxss}/, inputs['__usedHoursValue__'][i])
         .replace(/{xnyzjQdl}/, nameMapperWithUnit[inputs['type']])
         .replace(/{xnyzjQdlValue}/, inputs['type'] == 1 ? inputs['__result__'][i] + '%' : inputs['__result__'][i])
   }

   $('#itemContainer').html(html);
};

var renderItems2 = function(inputs) {
   var html = '';
   var title = '';

   if(inputs['type'] == 8) {
      title = '高峰/低谷'
   }
   else if(inputs['type'] == 9) {
      title = '现货'
   }
   else if(inputs['type'] == 10) {
      title = '高峰/低谷/现货'
   }

   for(var i in inputs['_multipleInput']) {
      var value = inputs['_multipleInput'][i];
      var _val = [];

      $.each(value, function(idx, d) {
         _val.push(Number((d / 10).toFixed(0)));
      });

      html += tmpl2.replace(/{title}/, title)
         .replace(/{value}/, _val.join('/'))
         .replace(/{xnkjzyl}/, inputs['__xnkjzylValue__'][i])
         .replace(/{xnyfdlzb}/, inputs['__xnyfdlzzfdlblValue__'][i])
         .replace(/{zlwscf}/, inputs['__zlwsxnycfValue__'][i])
         .replace(/{zllyxss}/, inputs['__usedHoursValue__'][i])
         .replace(/{xnyzjQdl}/, '弃电率(%)')
         .replace(/{xnyzjQdlValue}/, inputs['type'] == 1 ? inputs['__result__'][i] + '%' : inputs['__result__'][i])
   }

   $('#itemContainer').html(html);
};

document.addEventListener('POPULATE_DATA', function(evt) {
   renderInput(evt.detail.inputs);
});

$(".mui-action-back").on("tap", function() {
   mui.back();
});

mui.ready(function() {
   var sdate = moment().startOf('year');
   var edate = moment().endOf('year');
   $('#sdateText').html(sdate.format(datefmt));
   $('#edateText').html(edate.format(datefmt));
});

mui.plusReady(function() {
   plus.webview.currentWebview().setStyle({
      softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
   });
   // plus.navigator.setStatusBarBackground('#4990E2');
   // plus.navigator.setStatusBarStyle('light');
   // plus.navigator.closeSplashscreen();
   // plus.storage.clear();

   var webview = plus.webview.currentWebview();
   type = webview.type;
   name = nameMapper[type];

   $(".mui-title").html((name + '计算器'));
   $("#resTitleText").html(name);

   $('.gxl-visible').toggle(type == 1);

   if(type == 1) {
      $('#mbqdlWrapper').hide();
      $('.mbqdl-visiable').hide();
   } else if(type == 2) {
      $('#xnyzjWrapper').hide();
      $('.xnyzj-visiable').hide();
   } else if(type == 3) {
      $('#zdfhWrapper').hide();
      $('.zdfh-visiable').hide();
   } else if(type == 4) {
      $('#sbyxsWrapper').hide();
      $('.sbyxs-visiable').hide();
   } else if(type == 5) {
      $('#hdtflWrapper').hide();
      $('.hdtfl-visiable').hide();
   } else if(type == 6) {
      $('#zbdcblWrapper').hide();
      $('.zbdczb-visiable').hide();
   } else if(type == 8 || type == 9 || type == 10) {
      if(type == 8 || type == 10) {
         $('#gfjsbcWrapper').show();
      }
      else if(type == 9) {
         $('#xhjsbcWrapper').show();
      }

      $('.hide-by-type' + type).hide();
      $('#chartWrapper').css('height', 260);
      $('#mbqdlWrapper').hide();
      $('.mbqdl-visiable').hide();
      $('#multipleContainer').hide();
   }

   if(type == 10) {
      $('#zlxhIpt').attr('readonly', true);

      $('#zlssnlIpt').on('change', function() {
         var $this = $(this);
         var val = $this.val().trim();
         var gfVal = $('#zlgffhIpt').val().trim();

         if(gfVal) {
            $('#zlxhIpt').val(Number(val) - Number(gfVal));
         }
      });

      $('#zlgffhIpt').on('change', function() {
         var $this = $(this);
         var val = $this.val().trim();
         var zlVal = $('#zlssnlIpt').val().trim();

         if(zlVal) {
            $('#zlxhIpt').val(Number(zlVal) - Number(val));
         }
      });
   }

   if(webview.inputs) {
      renderInput(webview.inputs);
   }
});