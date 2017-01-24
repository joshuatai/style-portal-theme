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
    var colors = ['#33abd6', '#33ba72', '#fe9967', '#45cce7', '#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', "#e07ad3"];
    
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
                  paddingBottom: '10px'
                }
            },
            tickWidth: 0
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
            area: {
                stacking: 'normal'
            },
            series: {
                pointStart: Date.UTC(2016, 9, 10),
                pointIntervalUnit: 'day',
                fillOpacity: 0.25,
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