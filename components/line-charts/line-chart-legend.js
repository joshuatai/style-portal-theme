$(function () {
    var series = [
        {
            name: 'Ransomware',
            data: [13, 15, 13, 17, 22, 21, 24, 26, 25, 24, 22, 23, 21, 24, 23, 25, 24, 21, 22, 23, 25, 26, 28, 27, 23, 22, 22, 21, 24, 25]
        }, 
        {
            name: 'Anti-spyware',
            data: [14, 13, 15, 14, 18, 21, 25, 22, 23, 21, 24, 24, 25, 26, 23, 21, 23, 21, 25, 24, 22, 25, 26, 25, 22, 24, 25, 26, 27, 26]
        },  
        {
            name: 'Web Reputation',
            data: [15, 14, 16, 15, 16, 19, 22, 24, 24, 23, 20, 21, 22, 23, 25, 24, 21, 20, 22, 25, 24, 26, 27, 26, 24, 23, 24, 25, 26, 24]
        }, 
        {
            name: 'Virus/Malware',
            data: [12, 14, 17, 18, 17, 20, 21, 23, 22, 24, 21, 22, 21, 24, 26, 25, 20, 22, 24, 26, 25, 27, 29, 26, 25, 24, 21, 22, 25, 27]
        }
    ];
    var colors = ['#33abd6', '#33ba72', '#fe9967', '#45cce7', '#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', "#e07ad3"];
    Highcharts.chart('line-chart-container', {
        chart: {
            type: 'line',
            spacingBottom: 0,
            events: {
              load: function () {
                var legend = $(".standard-line-chart .legend");
                var legendContainer = $('ul', legend);
                for (var i = 0; i < series.length; i++) {
                    var color_idx = i%10;
                    var newItem = $('<li>' + series[i].name + '</li>').addClass('color-' + colors[color_idx].replace('#', ''));  
                    legendContainer.append(newItem);
                    newItem[0].series = series[i];
                    if (series[i].visible == false) {
                        newItem.addClass("mute");
                    }
                }
              }
            },
            style: {
              fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif'
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
            tickInterval: 7 * 24 * 3600 * 1000,
            startOfWeek: 0,
            dateTimeLabelFormats: {
                week: '%m/%d'
            },
            labels: {
                style: {
                  fontSize: '12px',
                  fontWeight: 'normal',
                  paddingBottom: '10px'
                }
            },
            tickWidth: 0,
            lineColor: '#e6e6e6'
        },
        yAxis: {
            title: {
                text: 'Amount'
            },
            labels: {
                style: {
                  fontSize: '12px',
                  fontWeight: 'normal'
                }
            }
        },
        legend: {
            enabled: false
        },
        series: series,
        plotOptions: {
          series: {
            pointStart: Date.UTC(2016, 9, 1),
            pointIntervalUnit: 'day',
            marker: {  
              radius: 4,
              symbol: 'circle',
              states: {
                    hover: {
                        lineWidth: 3,
                        radius: 5
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
            headerFormat: '<table><thead><tr><td>{point.x:%Y/%m/%d}</td></tr></thead>',
            pointFormat: '<tr><td><span style="color:{point.color}">\u25CF</span> {series.name} </td>' +
                '<td>{point.y}</td></tr>',
            footerFormat: '</table>'
        }
    }, function (chart) {
        // bind events to your own custom legend
        $(document).on('click', '.standard-line-chart .legend li', function (event) {
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