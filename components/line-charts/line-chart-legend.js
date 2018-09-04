$(function () {
    var series = [
        {
            name: 'Ransomware',
            data: [2, 3, 4, 5, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 6, 6, 5, 5, 5, 5, 4, 4, 3, 3]
        }, 
        {
            name: 'Anti-spyware',
            data: [5, 5, 6, 7, 8, 9, 9, 10, 10, 10, 9, 9, 9, 9, 8, 8, 8, 8, 8, 7, 7, 6, 6, 6, 6, 5, 5, 4, 4, 4]
        },  
        {
            name: 'Web Reputation',
            data: [14, 15, 16, 16, 16, 18, 20, 21, 21, 22, 21, 21, 21, 20, 20, 21, 21, 20, 20, 20, 19, 19, 18, 18, 17, 16, 16, 15, 15, 15]
        }, 
        {
            name: 'Virus/Malware',
            data: [15, 16, 17, 18, 19, 20, 21, 23, 24, 24, 22, 22, 22, 21, 21, 22, 22, 22, 23, 22, 22, 22, 21, 21, 22, 22, 22, 21, 21, 21]
        }
    ];
    var colors = ['#0096cc', '#4cc383', '#fd884e', '#5bd2ea', '#e56669', '#717eef', '#0abfa1', '#a8cf57', '#faca2a', '#d643c3'];
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
                  paddingBottom: '10px',
                  color: '#888888'
                }
            },
            tickWidth: 0
        },
        yAxis: {
            title: {
                text: 'Amount',
                style: {
                    color: '#bbbbbb'
                }
            },
            labels: {
                style: {
                  fontSize: '12px',
                  fontWeight: 'normal',
                  color: '#888888'
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
                        opacity: 0.4
                    }
                }
            }
          }
        },
        tooltip: {
            backgroundColor: '#222222',
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