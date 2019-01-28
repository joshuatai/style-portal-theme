$(function () {
    var series = [{
        data: [{
            name: 'OfficeScan',
            y: 981
        }, {
            name: 'Remote Manager',
            y: 672
        }, {
            name: 'Safe Circle',
            y: 281
        }]
    }];
    var colors = ['#0096cc', '#4cc383', '#fd884e', '#5bd2ea', '#e56669', '#717eef', '#0abfa1', '#9cd22a', '#faca2a', '#d643c3'];
    Highcharts.chart('standard-donut-chart-container', {
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
            // events: {
            //   load: function () {
            //     var legend = $(".pie-donut-legend .legend");
            //     var legendContainer = $('ul', legend);
            //     for (var i = 0; i < series[0].data.length; i++) {
            //         var color_idx = i%10;
            //         var newItem = $('<li>' + series[0].data[i].name + '</li>').addClass('color-' + colors[color_idx].replace('#', ''));
            //         legendContainer.append(newItem);
            //         newItem[0].series = series[0].data[i];
            //         if (series[0].data[i].visible == false) {
            //             newItem.addClass("mute");
            //         }
            //     }
            //   }
            // },
            style: {
              fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif'
            }
        },
        colors: colors,
        title: {
            text: '<span class="donut-chart-title">2963</span>',
            style: {
                color: '#ffffff',
                fontSize: '32px'
            },
            verticalAlign: 'top',
            y: 169
        },
        subtitle: {
            text: '<span class="donut-chart-subtitle">Ransomware Detections</span>',
            style: {
                color: '#bbbbbb',
                fontSize: '13px'
            },
            verticalAlign: 'top',
            y: 188
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
                borderColor: '#2c2c2c',
                size: 250,
                innerSize: 186,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                states: {
                    hover: {
                        halo: {
                            size: 6,
                            opacity: 0.4
                        },
                        brightness: 0.12
                    }
                }
            }
        },
        tooltip: {
            backgroundColor: '#222222',
            useHTML: true,
            padding: 16,
            headerFormat: '<table><thead><tr><td>Ransomware Detections</td></tr></thead>',
            pointFormat: '<tr><td><span style="color:{point.color}">\u25CF</span> {point.name} </td>' +
                '<td>{point.y:,.0f} <span>({point.percentage:.1f}%)</span></td></tr>',
            footerFormat: '</table>'
        },
    }, function (chart) {
        // chart.setTitle({
        //     useHTML: true,
        //     text: "<span class='main-title'>2963</span><span class='subtitle'>Ransomware Detections</span>"
        // });
        // bind events to your own custom legend
        // $(document).on('click', '.donut-chart-legend .legend li', function (event) {
        //     var target = event.target || event.srcElement;
        //     var target_idx = $(this).index();
        //     var series = chart.series[0].data[target_idx];
        //     if (target.closest('.legend') && target.tagName === 'LI' && series) {
        //       if (series.visible === true) {
        //         series.setVisible(false);
        //         target.className += ' mute';
        //       } else {
        //         target.className = target.className.replace(' mute', '')
        //         series.setVisible(true);
        //       }
        //     }
        // });
    });
});