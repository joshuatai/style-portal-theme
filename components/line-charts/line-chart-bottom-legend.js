$(function () {
    var now = Date.now();
    var series = [
        {
            name: 'Ransomware',
            data: [8, 5, 11, 17, 22, 24, 24]
        }, 
        {
            name: 'Anti-spyware',
            data: [7, 6, 9, 14, 18, 21, 25]
        },  
        {
            name: 'Web Reputation',
            data: [6, 3, 8, 13, 2, 18, 17]
        }, 
        {
            name: 'Virus/Malware',
            data: [3, 4, 5, 8, 11, 15, 17]
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
                    if (series[i].visible == false) {
                        newItem.addClass("mute");
                    }
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
            type: 'datetime',
            dateTimeLabelFormats:{
                day: '%m/%d'
            },
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
            pointStart: Date.UTC(2016, 9, 10),
            pointIntervalUnit: 'day',
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
            headerFormat: '<table><thead><tr><td style="padding-bottom: 5px">{point.x:%Y/%m/%d}</td></tr></thead>',
            pointFormat: '<tr><td style="padding-right: 20px"><span style="color:{point.color}">\u25CF</span> {series.name} </td>' +
                '<td style="text-align: right">{point.y}</td></tr>',
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