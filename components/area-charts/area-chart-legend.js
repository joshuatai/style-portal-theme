$(function () {
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
            data: [6, 3, 8, 13, 16, 18, 17]
        }
      ];
    var colors = ['#0096cc', '#4cc383', '#fd884e', '#5bd2ea', '#e56669', '#717eef', '#0abfa1', '#9cd22a', '#faca2a', '#d643c3'];

    Highcharts.chart('area-chart-container', {
        chart: {
            type: 'area',
            spacingBottom: 0,
            events: {
              load: function () {
                var legend = $(".standard-area-chart .legend");
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
            dateTimeLabelFormats:{
                day: '%m/%d'
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
            area: {
                stacking: 'normal'
            },
            series: {
                pointStart: Date.UTC(2016, 9, 10),
                pointIntervalUnit: 'day',
                fillOpacity: 0.4,
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
        $(document).on('click', '.standard-area-chart .legend li', function (event) {
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