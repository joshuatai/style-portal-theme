$(function () {
    var series = [{
        data: [{
            name: 'Ransomware',
            y: 56
        }, {
            name: 'Antispyware',
            y: 24
        }, {
            name: 'Web Reputation',
            y: 10
        }]
    }];
    var colors = ['#33abd6', '#33ba72', '#fe9967', '#45cce7', '#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', "#e07ad3"];
    Highcharts.chart('semi-donut-chart-container', {
        chart: {
            type: 'pie',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            spacingBottom: 0,
            events: {
              load: function () {
                var legend = $(".semi-donut-chart .legend");
                var legendContainer = $('ul', legend);
                for (var i = 0; i < series[0].data.length; i++) {
                    var color_idx = i%10;
                    var newItem = $('<li>' + series[0].data[i].name + '</li>').addClass('color-' + colors[color_idx].replace('#', ''));
                    legendContainer.append(newItem);
                    newItem[0].series = series[0].data[i];
                    if (series[0].data[i].visible == false) {
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
            text: '<span class="donut-chart-title">2486</span>',
            style: {
                color: '#222222',
                fontSize: '32px'
            },
            verticalAlign: 'top',
            y: 197
        },
        subtitle: {
            text: '<span class="donut-chart-subtitle">Threats</span>',
            style: {
                color: '#222222',
                fontSize: '13px'
            },
            verticalAlign: 'top',
            y: 216
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: series,
        plotOptions: {
            pie: {
                size: 280,
                innerSize: 184,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                states: {
                    hover: {
                        halo: {
                            size: 6
                        },
                        brightness: 0.12
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        tooltip: {
            backgroundColor: '#FFFFFF',
            padding: 16,
            useHTML: true,
            headerFormat: '<table><thead><tr><td>Threats</td></tr></thead>',
            pointFormat: '<tr><td><span style="color:{point.color}">\u25CF</span> {point.name} </td>' +
                '<td>{point.y:,.0f} <span>({point.percentage:.1f}%)</span></td></tr>',
            footerFormat: '</table>'
        }
    }, function (chart) {
        // bind events to your own custom legend
        $(document).on('click', '.semi-donut-chart .legend li', function (event) {
            var target = event.target || event.srcElement;
            var target_idx = $(this).index();
            var series = chart.series[0].data[target_idx];
            if (target.closest('.legend') && target.tagName === 'LI' && series) {
              if (series.visible === true) {
                series.setVisible(false);
                target.className += ' mute';
              } else {
                target.className = target.className.replace(' mute', '')
                series.setVisible(true);
              }
            }
        });
    });
});