$(function () {
    var series = [
        {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        },  {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 2.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }
      ];
    var colors = ['#509be5', '#66bf60', '#e55c5c', '#f2c849', '#9b50e5', '#5050e5', '#45bde5', '#f26d99', '#ff9866', '#b88ae5'];
    
    Highcharts.chart('container', {
        chart: {
            type: 'line',
            spacingRight: 0,
            spacingBottom: 0,
            events: {
              load: function () {
                var legend = $(".legend");
                var legendContainer = $('ul', legend);
                for (var i = 0; i < series.length; i++) {
                    var newItem = $('<li>' + series[i].name + '</li>').addClass('color-' + colors[i].replace('#', ''));  
                    legendContainer.append(newItem);
                    newItem[0].series = series[i];
                }
              }
            }
        },
        colors: colors,
        title: {
            text: null
        },
        credits: {
          enabled: false
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: {
                  color: '#666666',
                  fontSize: '12px',
                  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                  fontWeight: 'normal',
                  paddingBottom: '10px'
                }
            },
            tickWidth: 0
        },
        yAxis: {
            title: {
                text: 'Amount'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#666666'
            }]
        },
        legend: {
            enabled: false
        },
        series: series,
        plotOptions: {
          series: {
            marker: {  
              radius: 4,
              symbol: 'circle',
              states: {
                    hover: {
                        lineWidth: 3
                    }
                }
            },
            states: {
                hover: {
                    halo: {
                        size: 13,
                        opacity: 0.2
                    }
                }
            }
          }
        },
        tooltip: {
            backgroundColor: '#FFFFFF',
            padding: 16,
            useHTML: true,
            headerFormat: '<table style="width: 157px; height: 77px;"><thead><tr><td style="padding-bottom: 5px">{point.key}</td></tr></thead>',
            pointFormat: '<tr><td style="padding-right: 20px"><span style="color:{point.color}">\u25CF</span> {series.name} </td>' +
                '<td style="text-align: right">{point.y} EUR</td></tr>',
            footerFormat: '</table>'
        }
    }, function (chart) {
        // bind events to your own custom legend
        $(document).on('click', '.legend li', function (event) {
            var target = event.target || event.srcElement;
            var target_idx = $(this).index();
            var series = chart.series[target_idx];
            if (target.closest('.legend') && target.tagName === 'LI' && series) {
              if (series.visible === true) {
                series.hide();
                target.className += ' mute';
              } else {
                target.className = target.className.replace(' mute', '')
                series.show();
              }
            }
        });
    });
});