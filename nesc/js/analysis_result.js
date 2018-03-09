mui.init();

var types = ['xnyzj', 'tfl', 'zdfh', 'fhl', 'zbdc', 'sbyxs', 'fdzb', 'fhl_xnyzj', 'zcqws_xnyzj', 'zcqws_fhl_qdl', 'xhjy'];

mui('.mui-scroll-wrapper').scroll({
   indicators: true //是否显示滚动条
});

var data = {
   xnyzj: {
      title: '1.1 采用增加调峰率的手段对于降低弃电率效果明显',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，负荷率95%，上备用系数5%，新能源装机1500万千瓦，风电装机占比60%的孤立系统，调峰率为40%时，弃电率为26.16%，调峰率为50%时，弃电率为14.11%。通过计算不同调峰率下的弃电率，得到变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'>调峰率越大，弃电率越小，并且呈非线性关系，随着调峰率的增大，弃电率减小的速度变慢。通过实施调峰辅助服务、建设抽蓄电站等手段，能够提高调峰率，有效促进新能源消纳。</font>",
      data: [
         ['调峰率', '弃电率'],
         ['40%', '26.16%'],
         ['42%', '23.29%'],
         ['44%', '20.65%'],
         ['46%', '18.24%'],
         ['48%', '16.05%'],
         ['50%', '14.11%'],
         ['52%', '12.38%'],
         ['54%', '10.86%'],
         ['56%', '9.52%'],
         ['58%', '8.36%'],
         ['60%', '7.34%']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60],
      yd: [26.16, 23.29, 20.65, 18.24, 16.05, 14.11, 12.38, 10.86, 9.52, 8.36, 7.34],
      xname: '调峰律（%）',
      yname: '弃电率（%）'
   },
   tfl: {
      title: '1.2 加大自备电厂替代比例促进新能源消纳的本质是什么？',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，负荷率95%，上备用系数5%，调峰率40%，新能源装机1500万千瓦，风电装机占比60%的孤立系统，自备电厂占比为2%时，弃电率为27.37%，自备电厂占比为10%时，弃电率为32.57%。通过计算不同自备电厂占比下的弃电率，得到变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'>自备电厂占比越大，弃电率越大。自备电厂影响新能源消纳的本质是由于其不参与系统调峰，通过加大自备电厂替代比例，实质上提高了系统的调峰能力，能够有效降低弃电率。</font>",
      data: [
         ['自备电厂占比', '弃电率'],
         ['2%', '27.37%'],
         ['4%', '28.62%'],
         ['6%', '29.90%'],
         ['8%', '31.22%'],
         ['10%', '32.57%'],
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['调峰率', '40%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [2, 4, 6, 8, 10],
      yd: [27.37, 28.62, 29.90, 31.22, 32.57],
      xname: '自备电厂占比（%）',
      yname: '弃电率（%）'
   },
   zdfh: {
      title: '1.3 降低系统的备用容量有利于新能源消纳吗？',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，负荷率95%，调峰率40%，新能源装机1500万千瓦，风电装机占比60%的孤立系统，上备用系数为5%时，弃电率为26.16%，上备用系数为0时，弃电率为22.13%。通过计算不同上备用系数下的弃电率，得到变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'>上备用系数越小，弃电率越小。降低系统的备用容量实质上是增加了系统的调节能力。通过合理降低备用，甚至预留零备用或负备用（备用留在受端），是降低弃电率较为可行的手段。</font>",
      data: [
         ['上备用系数', '弃电率'],
         ['0', '22.13%'],
         ['1%', '22.90%'],
         ['2%', '23.69%'],
         ['3%', '24.49%'],
         ['4%', '25.32%'],
         ['5%', '26.16%']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['调峰率', '40%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [0, 1, 2, 3, 4, 5],
      yd: [22.13, 22.90, 23.69, 24.49, 25.32, 26.16],
      xname: '上备用系数（%）',
      yname: '弃电率（%）'
   },
   fhl: {
      title: '2.1 中长期外送能否全部送新能源？',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，负荷率95%，调峰率40%，上备用系数5%，新能源装机1500万千瓦，风电占比60%的系统，外送高峰/低谷电力为400/280万千瓦时，弃电率为14.41%，外送中的新能源成分为10.45%，新能源发电量占总发电量比例为20.12%，外送高峰/低谷电力为600/420万千瓦时，弃电率为10.90%，外送中的新能源成分为9.05%，新能源发电量占总发电量比例为18.50% 。通过计算不同外送规模下的弃电率，得到弃电率随外送规模的变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 中长期外送越大，弃电率越小，且呈非线性关系，随着外送的增大，弃电率减小的速度变慢。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 中长期外送增大，弃电率减小，但是新能源发电量占总发电量比例逐渐减小，说明无法通过增加中长期外送实现新能源发电量占比上升。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 中长期外送中新能源成分较小，且随着中长期外送增大，外送中新能源成分逐渐减小。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. 中长期外送的本质是增加了送端的负荷，影响送端机组开机方式。</font>",
      data: [
         ['高峰/低谷', '弃电率', '外送新能源', '新能源占总发'],
         ['400/280', '14.41%', '10.45%', '20.12%'],
         ['600/420', '10.09%', '9.05%', '18.50%'],
         ['800/560', '8.34%', '7.92%', '17.04%'],
         ['1000/700', '6.41%', '7.02%', '15.75%'],
         ['1200/840', '4.97%', '6.28%', '14.61%']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['调峰率', '40%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [400, 600, 800, 1000, 1200],
      yd: [14.41, 10.90, 7.92, 7.02, 6.28],
      xname: '中长期外送高峰电力（万千瓦）',
      yname: '弃电率（%）'
   },
   zbdc: {
      title: '2.2 现货交易的效果与中长期外送有何不同？',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，负荷率95%，调峰率40%，上备用系数5%，新能源装机1500万千瓦，风电占比60%，外送能力400万千瓦的系统，现货交易电力为50万千瓦时，弃电率为19.71%，新能源发电量占总发电量比例为25.13%，通道利用小时为429小时，现货交易电力为100万千瓦时，弃电率为14.55%，新能源发电量占总发电量比例为26.32%，通道利用小时为772小时。通过计算不同现货交易电力下的弃电率，得到弃电率随现货交易电力的变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 现货交易越大，弃电率越小，且呈非线性关系，随着现货交易的增大，弃电率减小的速度变慢。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 现货交易越大，新能源发电量占总发电量比例越大，安排现货交易有利于提高新能源发电量占总发电量比例。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 与中长期外送相比，短期现货交易对于减小弃电率更为有效，但是短期现货交易的通道利用小时不高。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. 短期现货交易的本质是由受端承担了新能源的一部分波动性，对受端的接纳能力提出了要求，对送端开机方式没有影响。</font>",
      data: [
         ['现货电力', '弃电率', '新能源占总发电比', '通道利用小时数'],
         ['50', '19.71%', '15.13%', '429'],
         ['100', '14.55%', '26.32%', '772'],
         ['150', '10.66%', '27.19%', '1030'],
         ['200', '7.81%', '27.82%', '1220'],
         ['250', '5.72%', '28.27%', '1358'],
         ['300', '4.13%', '28.61%', '1464']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['调峰率', '40%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [50, 100, 150, 200, 250, 300],
      yd: [19.71, 14.55, 10.66, 7.81, 5.72, 4.13],
      ydx2 : [492, 772, 1030, 1220, 1358, 1464],
      xname: '现货交易电力（万千瓦）',
      yname: '弃电率（%）',
      ydx2name: '利用小时数'
   },
   sbyxs: {
      title: '2.3 提高中长期外送负荷率促进新能源消纳的本质是什么？',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，负荷率95%，调峰率40%，上备用系数5%，新能源装机1500万千瓦，风电占比60%的系统，以弃电率5%为目标，外送高峰/低谷电力为400/280万千瓦时，弃电率为14.41%，外送高力/低谷电力为400/360万千瓦时，弃电率为11.70%。通过计算不同外送负荷率下的弃电率，得到弃电率随外送负荷率的变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 中长期外送负荷率越大，弃电率越小，并且呈非线性关系，随着外送负荷率的增大，弃电率减小的速度变慢。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 提高中长期外送负荷率的本质是相当于增加了系统负荷率。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 提高中长期外送负荷率有利于增加通道利用小时，提高通道利用率。",
      data: [
         ['高峰/低谷', '外送负荷率', '弃电率', '通道利用小时数'],
         ['400/240', '60%', '16.27%', '7045'],
         ['400/280', '70%', '14.41%', '7473'],
         ['400/320', '80%', '12.89%', '7902'],
         ['400/360', '90%', '11.70%', '8331'],
         ['400/400', '100%', '10.79%', '8760']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['调峰率', '40%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [60, 70, 80, 90, 100],
      yd: [16.27, 14.41, 12.89, 11.70, 10.79],
      ydx2 : [7045, 7473, 7902, 8331, 8760],
      xname: '中长期外送负荷率（%）',
      yname: '弃电率（%）',
      ydx2name: '利用小时数'
   },
   fdzb: {
      title: '2.4 外送通道运行要统筹兼顾新能源消纳和经济性',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;短期现货交易对于减小弃电率更为有效，但是外送通道运行一方面要考虑新能源消纳，另一方面也要兼顾经济性。对于最大负荷1000万千瓦，负荷率95%，调峰率40%，上备用系数5%，新能源装机1500万千瓦，风电占比60%，外送能力400万千瓦的系统，通过计算不同中长期外送和现货交易配比下的弃电率，得到的变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'>跨区现货交易电力越大，弃电率越小，但是通道利用小时也会降低，</font>对于本例中的系统，安排中长期外送300万千瓦，跨区现货交易100万千瓦，弃电率能下降至8.80%，同时也保持较高的通道利用小时(6129小时)。",
      data: [
         ['高峰/低谷', '现货交易', '弃电率', '通道利用小时数'],
         ['350/245', '50', '11.28%', '6820'],
         ['300/210', '100', '8.80%', '6129'],
         ['250/175', '150', '6.88%', '5409'],
         ['200/140', '200', '5.40%', '4667']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['调峰率', '40%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [50, 100, 150, 200],
      yd: [11.28, 8.8, 6.88, 5.4],
      ydx2: [6820, 6129, 5409, 4667],
      xname: '现货交易电力（万千瓦）',
      yname: '弃电率（%）',
      ydx2name: '利用小时数'
   },
   fhl_xnyzj: {
      title: '3.1 负荷增速慢不利于弃电率的下降',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于负荷率95%，上备用系数5%，调峰率40%，新能源装机1500万千瓦，风电装机占比60%的孤立系统，最大负荷为700万千瓦时，弃电率为42.25%，最大负荷为1500万千瓦时，弃电率为9.93%。通过计算不同最大负荷下的弃电率，得到弃电率随最大负荷的变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'>负荷越大，弃电率越小，并且呈非线性关系，随着负荷的增大，弃电率减小的速度变慢。对于负荷基数较小，且增速较慢的电网，降低弃电率的客观条件更为不利。</font>",
      data: [
         ['最大负荷（万千瓦）', '弃电率'],
         ['700', '42.25%'],
         ['900', '31.00%'],
         ['1100', '21.85%'],
         ['1300', '14.85%'],
         ['1500', '9.93%'],
         ['1700', '6.61%'],
         ['1900', '4.33%'],
         ['2100', '2.74%']
      ],
      data2: [
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['调峰率', '40%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [700, 900, 1100, 1300, 1500, 1700, 1900, 2100],
      yd: [42.25, 31.00, 21.85, 14.85, 9.93, 6.61, 4.33, 2.74],
      xname: '最大负荷（万千瓦）',
      yname: '弃电率（%）'
   },
   zcqws_xnyzj: {
      title: '3.2 通过合理引导用电来提高负荷率有利于新能源消纳吗？',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，上备用系数5%，调峰率40%，新能源装机1500万千瓦，风电装机占比60%的孤立系统，负荷率为85%时，弃电率为44.44%，负荷率为95%时，弃电率为26.16%。通过计算不同负荷率下的弃电率，得到弃电率随负荷率的变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'>负荷率越大，弃电率越小。通过峰谷电价等措施合理引导用电来提高负荷率，有利于降低弃电率。</font>",
      data: [
         ['负荷率', '弃电率'],
         ['85%', '44.44%'],
         ['86%', '42.08%'],
         ['87%', '39.86%'],
         ['88%', '37.76%'],
         ['89%', '35.79%'],
         ['90%', '33.95%'],
         ['91%', '32.22%'],
         ['92%', '30.58%'],
         ['93%', '29.03%'],
         ['94%', '27.56%'],
         ['95%', '26.16%']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500'],
         ['风电占比', '60%']
      ],
      xd: [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95],
      yd: [44.44, 42.08, 39.86, 37.76, 35.79, 33.95, 32.22, 30.58, 29.03, 27.56, 26.16],
      xname: '中长期外送高峰电力（万千瓦）',
      yname: '弃电率（%）',
   },
   zcqws_fhl_qdl: {
      title: '4.1 新能源装机不断增大使得降低弃电率更为困难',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，负荷率95%，上备用系数5%，调峰率40%，风电装机占比60%的孤立系统，新能源装机800万千瓦时，弃电率为4.57%，新能源装机1000万千瓦时，弃电率9.93%。通过计算不同新能源装机下的弃电率，得到变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：新能源装机越大，弃电率越大，<font color='red'>随着新能源装机不断增大，降低弃电率的难度进一步加大，所以合理规划新能源装机规模对于解决新能源消纳问题至关重要。</font>",
      data: [
         ['新能源装机（万千瓦）', '弃电率'],
         ['700', '2.47%'],
         ['800', '4.57%'],
         ['900', '7.08%'],
         ['1000', '9.93%'],
         ['1100', '13.08%'],
         ['1200', '16.39%'],
         ['1300', '19.76%'],
         ['1400', '23.03%'],
         ['1500', '26.16%']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['调峰率', '40%'],
         ['自备电厂占比', '0%'],
         ['风电占比', '60%']
      ],
      xd: [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
      yd: [2.47, 4.57, 7.08, 9.93, 13.08, 16.39, 19.76, 23.03, 26.16],
      xname: '新能源装机（万千瓦）',
      yname: '弃电率（%）'
   },
   xhjy: {
      title: '4.2 风电和光伏的装机比例对新能源消纳有影响吗？',
      desc: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于最大负荷1000万千瓦，负荷率95%，上备用系数5%，调峰率40%，新能源装机1500万千瓦的孤立系统，风电占比为0时，弃电率为47.73%，风电占比100%时，弃电率为38.60%，风电占比为50%时，弃电率为26.21%。通过计算不同风电占比下的弃电率，得到变化规律如图表。</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结论如下：<font color='red'>风电和光伏呈现一定的互补性，过高或过低的风电占比均会导致弃电率上升。保持风电和光伏的协调发展，能够发挥风电和光伏的互补性，有利于新能源消纳。</font>",
      data: [
         ['风电占比', '弃电率'],
         ['0%', '47.73%'],
         ['10%', '41.42%'],
         ['20%', '35.66%'],
         ['30%', '30.80%'],
         ['40%', '27.63%'],
         ['50%', '26.21%'],
         ['60%', '26.12%'],
         ['70%', '27.46%'],
         ['80%', '30.40%'],
         ['90%', '34.32%'],
         ['100%', '38.60%']
      ],
      data2: [
         ['最大负荷（万千瓦）', '1000'],
         ['负荷率', '95%'],
         ['上备用系数', '5%'],
         ['调峰率', '40%'],
         ['自备电厂占比', '0%'],
         ['新能源装机（万千瓦）', '1500']
      ],
      xd: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      yd: [47.73, 41.42, 35.66, 30.80, 27.63, 26.21, 26.16, 27.46, 30.40, 34.32, 38.60],
      xname: '风电占比',
      yname: '弃电率（%）'
   }
};

var itemTmpl = '<div dtype={dtype} class="mui-slider-item" style="opacity: 0;">' +
   '<div class="result-title"></div>' +
   '<div class="result-info-wrapper">' +
// '<label>结论:</label>' +
   '<span class="result-info"></span>' +
   '</div>' +
   '<div class="chart-wrapper" style="display:none;"></div>' +
   '<div class="chart-wrapper1" style="display:none;"></div>' +
   '<div class="table-show">示例其他参数</div>' +
   '<div class="table-wrapper">' +
   '<div class="table1-title"></div>' +
   '<table class="table1"></table>' +
   '<div class="table3-title"></div>' +
   '<table class="table3"></table>' +
   '</div>' +
   '</div>';

$('.mui-slider').on('slide', function(evt) {
   var idx = evt.originalEvent.detail.slideNumber;
   var type = types[idx];
   var container = $(this).find('.mui-slider-item')[idx];

   $('#tabContainer').find('.tab-item')
      .eq(idx)
      .addClass('selected')
      .siblings()
      .removeClass('selected');
   renderChart(container, data[type]);
});

$("#tabContainer").delegate('.tab-item', "tap", function() {
   var $this = $(this);
   $this.addClass('selected').siblings().removeClass("selected");
   var type = $this.attr("type");
   var idx = $this.index();
   var node = $('.mui-slider').find('.mui-slider-item')[idx];
   mui.data[$('.mui-slider').data('slider')].gotoItem(idx);
});

$('#menuContainer').delegate('li', 'tap', function() {
   var $this = $(this);
   var idx = $this.index();
   mui('#topPopover').popover('toggle');
   $("#tabContainer").find('.tab-item')
      .eq(idx)
      .addClass('selected')
      .siblings()
      .removeClass('selected');
   mui.data[$('.mui-slider').data('slider')].gotoItem(idx);
});

$("body").on("tap", function() {
   $("#table2Wrapper").animate({
      "right": "-230px"
   }, {
      'duration': 100
   });
});

var renderChart = function(node, resultData) {
   var $node = $(node);
   $node.find('.result-info').html(resultData['desc']);
   $node.find('.result-title').html(resultData['title'])

   if(resultData['yd']) {
      $node.find('.chart-wrapper').show();
      var iChart = echarts.init($node.find('.chart-wrapper')[0]);
      var xname = resultData['xname'];
      var yname = resultData['yname'];
      var xd = resultData['xd'];
      var yd = resultData['yd'];
      var grid = {};
      var yAxis = [{
            name: yname
         }];

      var series = [{
            type: 'line',
            label: {
               normal: {
                  show: true
               }
            },
            data: yd
         }];

      if(resultData['ydx2']) {
         grid['right'] = '15%';

         yAxis.push({
            name: resultData['ydx2name']
         });

         series.push({
            type: 'line',
            yAxisIndex: 1,
            label: {
               normal: {
                  show: true
               }
            },
            data: resultData['ydx2']
         });
      }

      var option = {
         grid: grid,
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
         yAxis: yAxis,
         series: series
      };

      iChart.setOption(option);
   }

// if(resultData['yd2']) {
//    $node.find('.chart-wrapper1').show();
//    var iChart2 = echarts.init($node.find('.chart-wrapper1')[0]);
//    var xname2 = resultData['xname2'];
//    var yname2 = resultData['yname2'];
//    var xd2 = resultData['xd2'];
//    var yd2 = resultData['yd2'];
//
//    var option2 = {
//       title: {
//          text: '计算结果'
//       },
//       tooltip: {},
//       legend: {
//          data: ['销量']
//       },
//       xAxis: {
//          name: xname,
//          nameLocation: 'middle',
//          nameGap: '24',
//          data: xd2
//       },
//       yAxis: {
//          name: yname2
//       },
//       series: [{
//          type: 'line',
//          label: {
//             normal: {
//                show: true
//             }
//          },
//          data: yd2
//       }]
//    };
//
//    iChart2.setOption(option2);
// }

   if(resultData['dataTitle']) {
      $node.find('.table1-title').html(resultData['dataTitle']);
   } else {
      $node.find('.table1-title').hide();
   }

   var tableStr = '';

   if(resultData['data']) {
      $.each(resultData['data'], function(ridx, row) {
         tableStr += '<tr>';

         $.each(row, function(cidx, col) {
            tableStr += '<td>' + col + '</td>';
         });

         tableStr += '</tr>'
      });

      $node.find('.table1').html(tableStr);
   } else {
      $node.find('.table1').hide();
   }

   if(resultData['data3Title']) {
      $node.find('.table3-title').html(resultData['data3Title']);
   } else {
      $node.find('.table3-title').hide();
   }

   var tableStr2 = '';
   if(resultData['data3']) {
      $.each(resultData['data3'], function(ridx, row) {
         tableStr2 += '<tr>';

         $.each(row, function(cidx, col) {
            tableStr2 += '<td>' + col + '</td>';
         });

         tableStr2 += '</tr>'
      });

      $node.find('.table3').html(tableStr2);
   } else {
      $node.find('.table3').hide();
   }

   var table2Str = '';

   $.each(resultData['data2'], function(idx, row) {
      table2Str += '<tr>';

      $.each(row, function(idx, col) {
         table2Str += '<td>' + col + '</td>'
      });

      table2Str += '</tr>'
   });

   $("#table2").html("");
   $("#table2").append(table2Str);

   if(!$node.data('render')) {
      $node.find('.table-show').on("tap", function(e) {
         e.stopPropagation();
         $("#table2Wrapper").animate({
            'right': '0px'
         }, {
            'duration': 200
         });
      });
   }

   $node.data('render', true)
      .css('opacity', 1);
};

var init = function() {
   var html = '';
   $.each(types, function(idx, type) {
      html += itemTmpl.replace(/{dtype}/, type);
   });

   var type = plus.webview.currentWebview().type;
   var idx = types.indexOf(type);
   var $group = $('#sliderGroup');
   $group.html(html);
   var node = $group.find('.mui-slider-item')[idx];
   $(node).addClass('mui-active');

   $("#tabContainer").find('.tab-item')
      .eq(idx)
      .addClass('selected')
      .siblings()
      .removeClass('selected');

   mui('.mui-slider').slider();

   renderChart(node, data[type]);
};

//mui.ready(init);

mui.plusReady(function() {
   init();
});