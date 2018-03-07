/**
 * 一天的平均负荷、最大负荷
 */
var avg_and_max_load = function() {
   var sum = 0;
   var max = 0;

   for(var key in load) {
      var d = load[key];

      if(d > max) {
         max = d;
      }

      sum += d;
   }

   return {
      avg: sum / 96,
      max: max
   };
};

/**
 * 负荷偏移量
 */
var load_pyl = function(d) {
   var fhlValue = d['fhlValue'];
   // var _avg_and_max_load = avg_and_max_load();

   if(fhlValue == 1) {
      return false;
   }

   return(fhlValue * _avg_and_max_load.max - _avg_and_max_load.avg) / (1 - fhlValue);
};

/**
 * 直流曲线（一天）
 */
var zlqx = function(d) {
   var stime = d['stime'];
   var etime = d['etime'];
   var nd = new Date();
   nd.setHours(0, 0, 0, 0);
   stime = moment(stime, 'HH:mm');
   etime = moment(etime, 'HH:mm')
   var qx = {};

   for(var i = 0; i < 96; i++) {
      var _d = new Date(nd.getTime());
      _d.setMinutes(i * 15);
      var val = 0;

      if(moment(_d).isBetween(stime, etime, null, '[]')) {
         val = d['zlgffhValue'];
      } else {
         val = d['zlpdfhValue'];
      }

      qx[moment(_d).format('H:mm')] = val;
   }

   return qx;
}

/**
 * 直流电量(一天)
 */
var zldl = function(d) {
   var sum = 0;

   for(var key in _zlqx) {
      sum += _zlqx[key];
   }

   return sum / 4;
};

/**
 * 转换直流曲线到每一天
 */
var zlqx_every_day = function(d) {
   var _zlqx_every_day = {};

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _zlqx[_inner_key];
         _zlqx_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   return _zlqx_every_day;
};

/**
 * 直流现货曲线（一天）
 */
var zlxhqx = function(d) {
   var zlssnlValue = d['zlssnlValue'];
   var _zlxhqx = {};
   var zlxhValue = d['zlxhValue'];
   var isZlxh = d['isZlxh'];

   if(isZlxh) {
      for(var key in _zlqx) {
         _zlxhqx[key] = zlssnlValue - _zlqx[key];
      }
   } else {
      for(var key in _zlqx) {
         _zlxhqx[key] = (zlssnlValue - _zlqx[key]) > zlxhValue ? zlxhValue : (zlssnlValue - _zlqx[key]);
      }
   }

   return _zlxhqx;
};

/*
 * 直流现货曲线转换到每一天
 */
var zlxhqx_every_day = function(d) {
   var _zlxhqx_every_day = {};
   var _zlxhqx = zlxhqx(d);

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _zlxhqx[_inner_key];
         _zlxhqx_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   return _zlxhqx_every_day;
}

/**
 * 交流曲线（一天）
 */
var jlqx = function(d) {
   var stime2 = d['stime2'];
   var etime2 = d['etime2'];
   var nd = new Date();
   nd.setHours(0, 0, 0, 0);
   stime2 = moment(stime2, 'HH:mm');
   etime2 = moment(etime2, 'HH:mm')
   var qx = {};

   for(var i = 0; i < 96; i++) {
      var _d = new Date(nd.getTime());
      _d.setMinutes(i * 15);
      var val = 0;

      if(moment(_d).isBetween(stime2, etime2, null, '[]')) {
         val = d['jlgffhValue'];
      } else {
         val = d['jlpdfhValue'];
      }

      qx[moment(_d).format('H:mm')] = val;
   }

   return qx;
}

/**
 * 转换交流曲线到每一天
 */
var jlqx_every_day = function() {
   var _jlqx_every_day = {};

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _jlqx[_inner_key];
         _jlqx_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   return _jlqx_every_day;
};

/**
 * 交流现货曲线（一天）
 */
var jlxhqx = function(d) {
   var jlssnlValue = d['jlssnlValue'];
   var jlxhValue = d['jlxhValue'];
   var isJlxh = d['isJlxh'];
   var _jlxhqx = {};

   if(isJlxh) {
      for(var key in _jlqx) {
         _jlxhqx[key] = jlssnlValue - _jlqx[key];
      }
   } else {
      for(var key in _jlqx) {
         _jlxhqx[key] = (jlssnlValue - _jlqx[key]) > jlxhValue ? jlxhValue : (jlssnlValue - _jlqx[key]);
      }
   }

   return _jlxhqx;
};

/*
 * 交流现货曲线转换到每一天
 */
var jlxhqx_every_day = function(d) {
   var _jlxhqx_every_day = {};
   var _jlxhqx = jlxhqx(d);

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _jlxhqx[_inner_key];
         _jlxhqx_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   return _jlxhqx_every_day;
}

/**
 * 实际负荷曲线（一天）
 */
var actual_load = function(d) {
   var _actual_load = {};
   var _load_pyl = load_pyl(d);

   if(_load_pyl === false) {
      return false;
   }

   var max = _avg_and_max_load.max + _load_pyl;
   var zdfhValue = Number(d['zdfhValue']);
   var ratio = zdfhValue / max;

   for(var key in load) {
      _actual_load[key] = (load[key] + _load_pyl) * ratio + _zlqx[key] + _jlqx[key];
   }

   return _actual_load;
};

/**
 * 火电最小技术出力
 */
var hdzxjscl = function(d, _actual_load) {
   var zdfh = 0;

   for(var key in _actual_load) {
      var _temp = _actual_load[key];

      if(_temp > zdfh) {
         zdfh = _temp;
      }
   }

   return zdfh * (1 + d['sbyxsValue']) * (1 - d['hdtflValue']) * (1 - d['zbdcblValue']) +
      zdfh * (1 + d['sbyxsValue']) * (d['zbdcblValue']);
};

/**
 * 新能源消纳能力
 */
var xnyxnnl = function(d) {
   var _actual_load = actual_load(d);

   if(_actual_load === false) {
      return false;
   }

   var _hdzxjscl = hdzxjscl(d, _actual_load);
   var _xnyxnnl = {};
   var _zlxhqx = zlxhqx(d);
   var _jlxhqx = jlxhqx(d);

   for(var key in _actual_load) {
      var _val = _actual_load[key] - _hdzxjscl;

      if(_val < 0) {
         return false;
      }

      _xnyxnnl[key] = _val + (_zlxhqx ? _zlxhqx[key] : 0) + (_jlxhqx ? _jlxhqx[key] : 0);
   }

   return _xnyxnnl;
};

/**
 * 根据选择的日期，生产每一天的96点的key。结果如: {'2017/01/01': ['0:00', '0:15', ..., '23:45']}
 */
var get_time_points = function(d) {
   var sdate = new Date(2017,0,1);//d['sdate'];
   var edate = new Date(2017,11,31);//d['edate'];
   var days = moment(edate).diff(moment(sdate), 'days') + 1;
   var _time_points = {};

   for(var i = 0; i < days; i++) {
      var key = moment(sdate).add(i, 'days').format('YYYY/M/D');
      var times = [];
      var _d = new Date();
      _d.setHours(0, 0, 0, 0);

      for(var j = 0; j < 96; j++) {
         var _nd = new Date(_d.getTime());
         _nd.setMinutes(j * 15);
         times.push(moment(_nd).format('H:mm'));
      }

      _time_points[key] = times;
   }

   return _time_points;
};

/**
 * 风电曲线(计划)
 */
var fd_load_qx = function(d) {
   // 风电最大装机
   var fdzdzj = d['xnyzjValue'] * d['fdzjbValue'];
   var fd_load = {};

   for(var key in _time_points) {
      var _times = _time_points[key];
      var win_key = moment(key, 'YYYY/M/D').year(2014).format('YYYY/M/D');
      var _day_loads = wind[win_key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _day_loads[_inner_key];
         fd_load[key + ' ' + _inner_key] = _time_load * fdzdzj;
      }
   }

   return fd_load;
};

/**
 * 光伏曲线(计划)
 */
var gf_load_qx = function(d) {
   var gf_load = {};
   // 光伏最大装机
   var fdzdzj = d['xnyzjValue'] * (1 - d['fdzjbValue']);

   for(var key in _time_points) {
      var _times = _time_points[key];
      var pv_key = moment(key, 'YYYY/M/D').year(2014).format('YYYY/M/D');
      var _day_loads = photovoltaic[pv_key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _day_loads[_inner_key];
         gf_load[key + ' ' + _inner_key] = _time_load * fdzdzj;
      }
   }

   return gf_load;
};

/**
 * 新能源曲线(计划)
 */
var xny_qx = function(d) {
   var _fd_load_qx = fd_load_qx(d);
   var _gf_load_qx = gf_load_qx(d);
   var _xny_qx = {};

   for(var key in _fd_load_qx) {
      _xny_qx[key] = _fd_load_qx[key] + _gf_load_qx[key];
   }
console.log(JSON.stringify(_xny_qx));
   return _xny_qx;
};

/**
 * 转换新能源消纳能力到每一天
 */
var xnyxnnl_every_day = function(d) {
   var _xnyxnnl = xnyxnnl(d);

   var xny_load = {};

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _xnyxnnl[_inner_key];
         xny_load[key + ' ' + _inner_key] = _time_load;
      }
   }

   return xny_load;
};

/**
 * 转换实际负荷曲线到每一天
 */
var actual_load_every_day = function(d) {
   var _actual_load = actual_load(d);

   var _actual_load_every_day = {};

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _actual_load[_inner_key];
         _actual_load_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   return _actual_load_every_day;
};

/**
 * 新能源消纳能力电量
 */
var xnyxnnldl = function(d) {
   var sum = 0;

   for(var key in _xnyxnnl) {
      sum += _xnyxnnl[key];
   }

   return sum / 4;
};

/**
 * 新能源弃电量
 */
var xnyqdl = function(d) {
   var sum = 0;

   for(var key in _xny_qx) {
      var _diff = _xny_qx[key] - _xnyxnnl[key];

      if(_diff > 0) {
         sum += _diff;
      }
   }

   return sum / 4;
}

/**
 * 新能源发电量（计划）
 */
var xnyfdl = function(d) {
   var sum = 0;

   for(var key in _xny_qx) {
      sum += _xny_qx[key];
   }

   return sum / 4;
};

/**
 * 新能源发电量曲线(实际)
 */
var xnyfdlqx_sj = function(d) {
   var _xnyfdlqx_sj = {};

   for(var key in _xny_qx) {
      var _xnyVal = _xny_qx[key];
      var _xnyxnVal = _xnyxnnl[key];

      _xnyfdlqx_sj[key] = _xnyVal < _xnyxnVal ? _xnyVal : _xnyxnVal;
   }

   return _xnyfdlqx_sj;
};

/**
 * 新能源发电量(实际)
 */
var xnyfdl_sj = function(d) {
   var sum = 0;

   for(var key in _xnyfdlqx_sj) {
      sum += _xnyfdlqx_sj[key];
   }

   return sum / 4;
};

/**
 * 新能源弃电率xnyqdl(d) / xnyfdl(d);
 */

/**
 * 消纳空间占有率计算
 */
var xnkjzyl = function(d) {
   return _xnyfdl_sj / _xnyxnnldl;
};

/**
 * 新能源发电量占总发电量比例
 */
var xnyfdlzzfdlbl = function(d) {
   var _hdzxjscl = hdzxjscl(d, actual_load(d));
   var sum = 0;

   for(var key in _xnyfdlqx_sj) {
      var _v1 = _xnyfdlqx_sj[key] + _hdzxjscl;
      var _v2 = _actual_load_every_day[key];
      sum += Math.min(Math.max(_v1, _v2), _xnyxnnl[key] + _hdzxjscl);
   }

   return _xnyfdl_sj / (sum / 4);
};

/**
 * 直流外送新能源成份
 */
var zlwsxnycf = function(d) {
   _zldl_all = 0;
   var _zlqx_all_every_day = {};
   var _zlqx_every_day = zlqx_every_day(d);
   var _zlxhqx_every_day = zlxhqx_every_day(d);

   for(var key in _zlqx_every_day) {
      _zlqx_all_every_day[key] = _zlqx_every_day[key] + _zlxhqx_every_day[key];
      _zldl_all += _zlqx_all_every_day[key];

   }

   if(_zldl_all == 0) {
      return 0;
   }

// var _hdzxjscl = hdzxjscl(d, actual_load(d));
// var sum = 0;

// for(var key in _xnyfdlqx_sj) {
//    var _v1 = _xnyfdlqx_sj[key];
//    var _v2 = _actual_load_every_day[key] - _hdzxjscl;
//    var _v3 = _actual_load_every_day[key] - _zlqx_all_every_day[key] - _hdzxjscl;
//
//    if(_v1 <= _v3) {
//       sum += 0;
//    } else if(_v1 > _v3 && _v1 < _v2) {
//       sum += _v1 - _v3;
//    } else {
//       sum += _v2 - _v3;
//    }
// }

   var keys = Object.keys(_time_points);

// return sum / 4 / _zldl_all;


   var sum = 0;
   var sum_zl = 0;
   var _xnyqdl = xnyqdl(d);

   for(var key in _xnyxnnl) {
      var _val_zl = _xnyxnnl[key] - _zlxhqx_every_day[key];
      sum_zl += (((_xny_qx[key] - _val_zl) > 0 ) ? (_xny_qx[key] - _val_zl) : 0);
   }

   var qdl_xh = (sum_zl / 4) - _xnyqdl;//①

   var _actual_load_new = {};
   var _load_pyl = load_pyl(d);

   var max = _avg_and_max_load.max + _load_pyl;
   var zdfhValue = Number(d['zdfhValue']);
   var ratio = zdfhValue / max;

   for(var key in load) {
      _actual_load_new[key] = (load[key] + _load_pyl) * ratio;
   }

   var zdfh_new = 0;

   for(var key in _actual_load_new) {
      var _temp = _actual_load_new[key];

      if(_temp > zdfh_new) {
         zdfh_new = _temp;
      }
   }

   var _hdzxjscl_new =  zdfh_new * (1 + d['sbyxsValue']) * (1 - d['hdtflValue']) * (1 - d['zbdcblValue']) +
      zdfh_new * (1 + d['sbyxsValue']) * (d['zbdcblValue']);

   var _actual_load_new_every_day = {};

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _actual_load_new[_inner_key];
         _actual_load_new_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   var logvalue = {};

   for(var key in _actual_load_new_every_day) {
      var _value = _xny_qx[key] - (_actual_load_new_every_day[key] - _hdzxjscl_new);
      logvalue[key] = _value;
      sum += ((_value > 0) ? _value : 0);
   }

   console.log('logvalue ： ' + JSON.stringify(logvalue));
   console.log('_xny_qx ： ' + JSON.stringify(_xny_qx));
   console.log('_actual_load_new_every_day ： ' + JSON.stringify(_actual_load_new_every_day));
   console.log('_hdzxjscl_new ： ' + _hdzxjscl_new);

   qdl_zl = sum / 4 - ((sum_zl / 4) - _xnyqdl) - _xnyqdl;

   return (qdl_xh + qdl_zl) / ((_zldl * keys.length) + qdl_xh);

};

/**
 * 直流利用小时数计算
 */
var zllyxssjs = function(d) {
   if(d['zlssnlValue'] == 0) {
      return 0;
   }

   var keys = Object.keys(_time_points);
   var _xnyqdl_xh = 0;
   var _zlxhqx_every_day = zlxhqx_every_day(d);

   for(var key in _xnyxnnl) {
      var _val = _xnyxnnl[key] - _zlxhqx_every_day[key];
      _xnyqdl_xh += (((_xny_qx[key] - _val) > 0) ? (_xny_qx[key] - _val) : 0);
   }

   var useHours = ((_xnyqdl_xh / 4) - xnyqdl(d) + (_zldl * keys.length)) / d['zlssnlValue']
   var dateCount = moment(d['edate'] - d['sdate']);
   var monthsCount = (Number(dateCount.format('YYYY')) - 1970) * 12 + (Number(dateCount.format('MM')) - 1)

   return useHours / 12 * monthsCount;
};

//------- 根据新能源弃电率计算新能源装机
var jsxnyzj = function(d) {
   var _xnyxnnldl = _xnyxnnldl * 4;
   var mbqdl = d['mbqdlValue'];

   var fd_ratio = {};

   for(var key in _time_points) {
      var _times = _time_points[key];
      var win_key = moment(key, 'YYYY/M/D').year(2014).format('YYYY/M/D');
      var _day_loads = wind[win_key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _day_loads[_inner_key];
         fd_ratio[key + ' ' + _inner_key] = _time_load * d['fdzjbValue'];
      }
   }

   var gf_ratio = {};

   for(var key in _time_points) {
      var _times = _time_points[key];
      var win_key = moment(key, 'YYYY/M/D').year(2014).format('YYYY/M/D');
      var _day_loads = photovoltaic[win_key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _day_loads[_inner_key];
         gf_ratio[key + ' ' + _inner_key] = _time_load * (1 - d['fdzjbValue']);
      }
   }

   var belta = {};
   var belta_sum = 0;

   for(var key in fd_ratio) {
      var _beltaVal = fd_ratio[key] + gf_ratio[key];
      belta_sum += _beltaVal
      belta[key] = _beltaVal;
   }

   var _temp_arr = [];
   var _keys = [];

   for(var key in belta) {
      _keys.push(key);
      _temp_arr.push(_xnyxnnl[key] / belta[key]);
   }

   var _idxs = argsort(_temp_arr);
   var _sum = 0;
   var _index = 0;

   for(var i = 0; i < _idxs.length; i++) {
      var aa = _temp_arr[_idxs[i]];
      var _sum = 0;

      for(var key in belta) {
         var _temp_val = belta[key] - _xnyxnnl[key] / aa;

         if(_temp_val > 0) {
            _sum += _temp_val;
         }
      }

      if(_sum > (mbqdl * belta_sum)) {
         _index = i;
         break;
      }
   }

   var bb = 0;
   var cc = 0;

   for(var i = 0; i < _index; i++) {
      bb += belta[_keys[_idxs[i]]];
      cc += _xnyxnnl[_keys[_idxs[i]]];
   }

   return cc / (bb - mbqdl * belta_sum);
};

/*
 * 给定负荷率的参数负荷曲线到每一天
 */

var load_pyl_every_day = function(d) {
   var _load_pyl_qx = {};
   var _load_pyl = load_pyl(d);

   for(var key in load) {
      _load_pyl_qx[key] = load[key] + _load_pyl;
   }

   var _load_pyl_every_day = {};

   for(var key in _time_points) {
      var _times = _time_points[key];

      for(var i in _times) {
         var _inner_key = _times[i];
         var _time_load = _load_pyl_qx[_inner_key];
         _load_pyl_every_day[key + ' ' + _inner_key] = _time_load;
      }
   }

   return _load_pyl_every_day;

}

/*
 * ----------计算最大负荷
 */

var jszdfh = function(d) {
   var _xny_qx_sum = 0;
   var Z = (1 + d['sbyxsValue']) * ((1 - d['hdtflValue']) * (1 - d['zbdcblValue']) + d['zbdcblValue']);
   _load_pyl_every_day = load_pyl_every_day(d);
   var _load_pyl_every_day_max = _avg_and_max_load.max + load_pyl(d);
   var temp_mbqdl = d['mbqdlValue'];
   // var temp_mbqdl = xnyqdl(d) / xnyfdl(d);

   //直流曲线
   // var _zlqx_every_day = zlqx_every_day(d);
   //直流现货曲线
   // var _zlxhqx_every_day = zlxhqx_every_day(d);
   //交流曲线
   // var _jlqx_every_day = jlqx_every_day(d);
   //交流现货曲线
   // var _jlxhqx_every_day = jlxhqx_every_day(d);

   var jszdfh_js = _xny_qx;
   var jszdfh_fm = {};

   // for(var key in _xny_qx) {
   //    jszdfh_js[key] = _xny_qx[key] - _zlqx_every_day[key]
   //       - _zlxhqx_every_day[key] - _jlqx_every_day[key]
   //       - _jlxhqx_every_day[key];
   // }

   for(var key in _load_pyl_every_day) {
      jszdfh_fm[key] = _load_pyl_every_day[key] / _load_pyl_every_day_max - Z;
   }

   for(var key in _xny_qx) {
      _xny_qx_sum += _xny_qx[key];
   }

   var N = _xny_qx_sum * temp_mbqdl;
   var _temp_arr = [];
   var _keys = [];

   for(var key in jszdfh_js) {
      _keys.push(key);
      _temp_arr.push(jszdfh_fm[key] / jszdfh_js[key]);
   }

   var _idxs = argsort(_temp_arr);
   var _sum = 0;
   var _index = 0;

   for(var i = 0; i < _idxs.length; i++) {
      var aa = _temp_arr[_idxs[i]];
      var _sum = 0;

      for(var key in jszdfh_js) {
         var _temp_val = jszdfh_js[key] - jszdfh_fm[key] / aa;

         if(_temp_val > 0) {
            _sum += _temp_val;
         }
      }

      if(_sum > N) {
         _index = i;
         break;
      }
   }

   var bb = 0;
   var cc = 0;

   for(var i = 0; i < _index; i++) {
      bb += jszdfh_js[_keys[_idxs[i]]];
      cc += jszdfh_fm[_keys[_idxs[i]]];
   }

   return(1 / (cc / (bb - N)));
}

/*
 * 计算上备用系数
 */
var jssbyxs = function(d) {
   var _xny_qx_sum = 0;
   var temp_mbqdl = d['mbqdlValue'];
   var Z = (1 - d['hdtflValue']) * (1 - d['zbdcblValue']) + d['zbdcblValue'];
   //直流现货曲线
   var _zlxhqx_every_day = zlxhqx_every_day(d);
   //交流现货曲线
   var _jlxhqx_every_day = zlxhqx_every_day(d);

   var zdfh = 0;

   for(var key in _actual_load_every_day) {
      var _temp = _actual_load_every_day[key];

      if(_temp > zdfh) {
         zdfh = _temp;
      }
   }

   var jszdfh_js = {};
   var jszdfh_fm = {};

   for(var key in _xny_qx) {
      jszdfh_js[key] = (_xny_qx[key] - _actual_load_every_day[key] -
         _zlxhqx_every_day[key] - _jlxhqx_every_day[key] + (zdfh * Z));
   }

   for(var key in _xny_qx) {
      jszdfh_fm[key] = (zdfh * Z);
   }

   for(var key in _xny_qx) {
      _xny_qx_sum += _xny_qx[key];
   }

   var N = _xny_qx_sum * temp_mbqdl;
   var _temp_arr = [];
   var _keys = [];

   for(var key in jszdfh_js) {
      _keys.push(key);
      _temp_arr.push(jszdfh_fm[key] / (0 - jszdfh_js[key]));
   }

   var _idxs = argsort(_temp_arr);
   var _sum = 0;
   var _index = 0;

   for(var i = 0; i < _idxs.length; i++) {
      var aa = _temp_arr[_idxs[i]];
      var _sum = 0;

      for(var key in jszdfh_js) {
         var _temp_val = jszdfh_js[key] + jszdfh_fm[key] / aa;

         if(_temp_val > 0) {
            _sum += _temp_val;
         }
      }

      if(_sum > N) {
         _index = i;
         break;
      }
   }

   var bb = 0;
   var cc = 0;

   for(var i = 0; i < _index; i++) {
      bb += jszdfh_js[_keys[_idxs[i]]];
      cc += jszdfh_fm[_keys[_idxs[i]]];
   }

   return 1 / (cc / (N - bb));
}

/*
 * 计算火电调峰率
 */
var jshdtfl = function(d) {
   var _xny_qx_sum = 0;
   var temp_mbqdl = d['mbqdlValue'];
   //直流现货曲线
   var _zlxhqx_every_day = zlxhqx_every_day(d);
   //交流现货曲线
   var _jlxhqx_every_day = zlxhqx_every_day(d);

   var zdfh = 0;

   for(var key in _actual_load_every_day) {
      var _temp = _actual_load_every_day[key];

      if(_temp > zdfh) {
         zdfh = _temp;
      }
   }

   var jszdfh_js = {};
   var jszdfh_fm = {};

   for(var key in _xny_qx) {
      jszdfh_js[key] = (_xny_qx[key] - _actual_load_every_day[key] -
         _zlxhqx_every_day[key] - _jlxhqx_every_day[key] + (zdfh * (1 + d['sbyxsValue'])));
   }

   for(var key in _xny_qx) {
      jszdfh_fm[key] = (zdfh * (1 + d['sbyxsValue']) * (1 - d['zbdcblValue']));
   }

   for(var key in _xny_qx) {
      _xny_qx_sum += _xny_qx[key];
   }

   var N = _xny_qx_sum * temp_mbqdl;
   var _temp_arr = [];
   var _keys = [];

   for(var key in jszdfh_js) {
      _keys.push(key);
      _temp_arr.push(jszdfh_fm[key] / jszdfh_js[key]);
   }

   var _idxs = argsort(_temp_arr);
   var _sum = 0;
   var _index = 0;

   for(var i = 0; i < _idxs.length; i++) {
      var aa = _temp_arr[_idxs[i]];
      var _sum = 0;

      for(var key in jszdfh_js) {
         var _temp_val = jszdfh_js[key] - jszdfh_fm[key] / aa;

         if(_temp_val > 0) {
            _sum += _temp_val;
         }
      }

      if(_sum > N) {
         _index = i;
         break;
      }
   }

   var bb = 0;
   var cc = 0;

   for(var i = 0; i < _index; i++) {
      bb += jszdfh_js[_keys[_idxs[i]]];
      cc += jszdfh_fm[_keys[_idxs[i]]];
   }

   return 1 / (cc / (bb - N));
}

/*
 * 计算自备电厂比例
 */
var jszbdcbl = function(d) {
   var _xny_qx_sum = 0;
   var temp_mbqdl = d['mbqdlValue'];
   //直流现货曲线
   var _zlxhqx_every_day = zlxhqx_every_day(d);
   //交流现货曲线
   var _jlxhqx_every_day = zlxhqx_every_day(d);

   var zdfh = 0;

   for(var key in _actual_load_every_day) {
      var _temp = _actual_load_every_day[key];

      if(_temp > zdfh) {
         zdfh = _temp;
      }
   }

   var jszdfh_js = {};
   var jszdfh_fm = {};

   for(var key in _xny_qx) {
      jszdfh_js[key] = _xny_qx[key] - _actual_load_every_day[key] -
         _zlxhqx_every_day[key] - _jlxhqx_every_day[key] +
         (zdfh * (1 + d['sbyxsValue']) * (1 - d['hdtflValue']));
   }

   for(var key in _xny_qx) {
      jszdfh_fm[key] = zdfh * (1 + d['sbyxsValue']) * d['hdtflValue'];
   }

   for(var key in _xny_qx) {
      _xny_qx_sum += _xny_qx[key];
   }

   var N = _xny_qx_sum * temp_mbqdl;
   var _temp_arr = [];
   var _keys = [];

   for(var key in jszdfh_js) {
      _keys.push(key);
      _temp_arr.push(jszdfh_fm[key] / (0 - jszdfh_js[key]));
   }

   var _idxs = argsort(_temp_arr);
   var _sum = 0;
   var _index = 0;

   for(var i = 0; i < _idxs.length; i++) {
      var aa = _temp_arr[_idxs[i]];
      var _sum = 0;

      for(var key in jszdfh_js) {
         var _temp_val = jszdfh_js[key] + jszdfh_fm[key] / aa;

         if(_temp_val > 0) {
            _sum += _temp_val;
         }
      }

      if(_sum > N) {
         _index = i;
         break;
      }
   }

   var bb = 0;
   var cc = 0;

   for(var i = 0; i < _index; i++) {
      bb += jszdfh_js[_keys[_idxs[i]]];
      cc += jszdfh_fm[_keys[_idxs[i]]];
   }

   return 1 / (cc / (N - bb));
}

/*
 * 数组排序(升序)
 */
var argsort = function(arr) {
   var _temp = [];

   for(var i in arr) {
      _temp.push({
         val: arr[i],
         idx: i
      });
   }

   _temp.sort(function(a, b) {
      return a.val - b.val;
   });

   var _idx = [];

   for(var i in _temp) {
      _idx.push(_temp[i].idx);
   }

   return _idx;
}

var _avg_and_max_load = {};
var _zlqx = {};
var _zldl = 0;
var _jlqx = {};
var _time_points = {};
var _xny_qx = {};
var _xnyxnnl = {};
var _actual_load_every_day = {};
var _xnyxnnldl = 0;
var _xnyfdlqx_sj = {};
var _xnyfdl_sj = 0;

var init = function(d) {
   _avg_and_max_load = avg_and_max_load();
   _zlqx = zlqx(d);
   _zldl = zldl(d);
   _jlqx = jlqx(d);
   _time_points = get_time_points(d);
   _xny_qx = xny_qx(d);
   _xnyxnnl = xnyxnnl_every_day(d);
   _actual_load_every_day = actual_load_every_day(d);
   _xnyxnnldl = xnyxnnldl(d);
   _xnyfdlqx_sj = xnyfdlqx_sj(d);
   _xnyfdl_sj = xnyfdl_sj(d);
}