$(function () {
    var series = [{
        data: [{
            name: 'Cloud App Security',
            y: 981
        }, {
            name: 'Cloud Edge',
            y: 652
        }, {
            name: 'Hosted Email Security',
            y: 248
        }, {
            name: 'InterScan Web Security as a Service',
            y: 150
        },{
            name: 'Worry-Free Business Security',
            y: 90
        },{
            name: 'Worry-Free Business Security Services',
            y: 80
        },{
            name: 'OfficeScan',
            y: 75
        },{
            name: 'Remote Manager',
            y: 60
        },{
            name: 'Safe Circle',
            y: 2
        },{
            name: 'TMRM',
            y: 1
        }]
    }];
    var colors = ['#33abd6', '#33ba72', '#fe9967', '#45cce7', '#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', "#e07ad3"];
    Highcharts.chart('donut-legend-right-container', {
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
                var legend = $(".pie-donut-charts-example .legend-vertical-container .legend");
                var legendContainer = $('ul', legend);
                var legend_page = $(".pie-donut-charts-example .legend-vertical-container .legend-page");
                var page_up = $(".tmicon-caret-up", legend_page);
                var page_down = $(".tmicon-caret-down", legend_page);
                var now_page = $(".now", legend_page);
                var total_page = $(".total", legend_page);
                var initPage = "1";
                var legend_height = legend.height();
                var totally_page;

                var ul_height = legendContainer.height();

                if (ul_height > legend_height) {
                    legend.addClass("scrollable");
                    ul_height = legendContainer.height();
                    var page = parseInt(ul_height) / parseInt(legend_height);
                    totally_page = Math.ceil(page);
                    total_page.text(totally_page);
                    now_page.text(initPage);
                    page_up.addClass("unable");
                    legend_page.addClass("show");

                    page_up.on("click", function(){
                        var now = parseInt(now_page.text()) -1;
                        if (now == 1) {
                            page_up.addClass("unable");
                        }
                        page_down.removeClass("unable");
                        changePage(now);
                    });

                    page_down.on("click", function(){
                        var now = parseInt(now_page.text()) + 1;
                        if(now == totally_page) {
                            page_down.addClass("unable");
                        }
                        page_up.removeClass("unable");
                        changePage(now);
                    });
                }

                function changePage (pages) {
                    var value = pages-1;
                    var margin_value = value * legend_height;

                    if (pages < 1 || pages > totally_page) {
                        return false;
                    }
                    else {
                        now_page.text(pages); //change page
                        legendContainer.css("margin-top","-" + margin_value + "px"); //change legend
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
            text: '<span class="donut-chart-title">3095</span>',
            style: {
                color: '#222222',
                fontSize: '32px'
            },
            verticalAlign: 'top',
            y: 169
        },
        subtitle: {
            text: '<span class="donut-chart-subtitle">Ransomware Detections</span>',
            style: {
                color: '#222222',
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
                size: 250,
                innerSize: 186,
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
                }
            }
        },
        tooltip: {
            backgroundColor: '#FFFFFF',
            padding: 16,
            useHTML: true,
            headerFormat: '<table><thead><tr><td>Ransomware Detections</td></tr></thead>',
            pointFormat: '<tr><td><span style="color:{point.color}">\u25CF</span> {point.name} </td>' +
                '<td>{point.y:,.0f} <span>({point.percentage:.1f}%)</span></td></tr>',
            footerFormat: '</table>'
        },
    }, function (chart) {
        //Set percentage value at the end of each legend.
        var legend = $(".donut-legend-container .legend");
        var legendContainer = $('ul', legend);

        for (var i = 0; i < series[0].data.length; i++) {
            var color_idx = i%10;
            var percentageValue = chart.series[0].data[i].percentage.toFixed(1);
            var seriesName = "<span class='legend-series-name'>" + series[0].data[i].name + ":&nbsp;" + "</span>"
            var seriesValue = "<span>" + "<span class='legend-series-value'>" + series[0].data[i].y + "</span>" + "&nbsp;" + `(${percentageValue}%)` + "</span>"
            var newItem = $('<li>' + seriesName + seriesValue + '</li>').addClass('color-' + colors[color_idx].replace('#', ''));
            legendContainer.append(newItem);
            newItem[0].series = series[0].data[i];
            if (series[0].data[i].visible == false) {
                newItem.addClass("mute");
            }
        }

        $(document).on('click', '.donut-legend-container .legend li', function (event) {
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
        $(document).on('click', '.donut-legend-container .legend li span', function (event) {
            var target = $(this).parent();
            var target_idx = target.index();
            var series = chart.series[0].data[target_idx];
            if (target[0].nodeName === 'LI' && series) {
                console.log(series.visible);
              if (series.visible === true) {
                series.setVisible(false);
                target.addClass('mute');
              } else {
                target.removeClass('mute ')
                series.setVisible(true);
              }
            }
        });
    });
});