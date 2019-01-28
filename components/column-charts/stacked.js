$(function () {
    var series = [
        {
            name: 'Ransomware',
            data: [75, 95, 110, 75, 48, 60, 95, 80, 115, 140, 115, 80]
        },
        {
            name: 'Anti-spyware',
            data: [66, 70, 40, 80, 60, 40, 35, 20, 110, 160, 113, 100]
        },
        {
            name: 'Web Reputation',
            data: [70, 50, 80, 70, 50, 55, 40, 55, 55, 50, 50, 40]
        }
    ];
    var colors = ['#0096cc', '#4cc383', '#fd884e', '#5bd2ea', '#e56669', '#717eef', '#0abfa1', '#9cd22a', '#faca2a', '#d643c3'];
    Highcharts.chart('stacked-column-chart-container', {
        chart: {
            type: 'column',
            spacingBottom: 0,
            events: {
              load: function () {
                var legend = $(".stacked-column-chart .legend");
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
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
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
            min: 0,
            title: {
                text: 'Total Scanned Traffic (GB)',
                style: {
                    color: '#bbbbbb'
                }
            },
            labels: {
                style: {
                  fontSize: '12px',
                  fontWeight: 'normal',
                  textOverflow: 'none',
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
                borderColor: '#2c2c2c',
                stacking: 'normal',
                pointWidth: 25,
                states: {
                    hover: {
                        brightness: 0.12
                    }
                }
            }
        },
        tooltip: {
            shared: true,
            backgroundColor: '#222222',
            borderColor: '#888888',
            padding: 16,
            useHTML: true,
            headerFormat: '<table><thead><tr><td>{point.x}</td></tr></thead>',
            pointFormat: '<tr><td><span style="color:{point.color}">\u25CF</span> {series.name} </td>' +
                '<td>{point.y}</td></tr>',
            footerFormat: '</table>'
        }
    }, function (chart) {
        // bind events to your own custom legend
        $(document).on('click', '.stacked-column-chart .legend li', function (event) {
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