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
        }, {
            name: 'Virus/Malware',
            y: 5
        }, {
            name: 'Malicious',
            y: 8
        }, {
            name: 'Network Virus',
            y: 4
        }]
    }];
    var colors = ['#33abd6', '#33ba72', '#fe9967', '#45cce7', '#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', "#e07ad3"];
    Highcharts.chart('pie-chart-legend-container', {
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
                var legend = $(".scroll-pie-chart .legend");
                var legendContainer = $('ul', legend);
                var legend_page = $(".legend-page", legend);
                var page_up = $(".tmicon-caret-up", legend_page);
                var page_down = $(".tmicon-caret-down", legend_page);
                var now_page = $(".now", legend_page);
                var total_page = $(".total", legend_page);
                var initPage = "1";
                var legend_height = legend.height();
                var totally_page;
                for (var i = 0; i < series[0].data.length; i++) {
                    var color_idx = i%10;
                    var newItem = $('<li>' + series[0].data[i].name + '</li>').addClass('color-' + colors[color_idx].replace('#', ''));
                    legendContainer.append(newItem);
                    newItem[0].series = series[0].data[i];
                    if (series[0].data[i].visible == false) {
                        newItem.addClass("mute");
                    }
                }
                var ul_height = legendContainer.height();
                if (ul_height > legend_height) {
                    drawLegendPage();
                }
                function drawLegendPage() {
                    var legend_postion = legendContainer.css("margin-top");
                    legend.addClass("scrollable");
                    ul_height = legendContainer.height();
                    var page = parseInt(ul_height) / parseInt(legend_height);
                    totally_page = Math.ceil(page);
                    total_page.text(totally_page);
                    if(legend_postion == "0px") {
                        now_page.text(initPage);
                        page_up.addClass("unable");
                    }
                    else {
                        var now = parseInt(now_page.text());
                        if (now > totally_page) {
                            changePage (totally_page);
                        }
                        else if (now < totally_page){
                            page_down.removeClass("unable");
                        }
                        else {
                            page_down.addClass("unable");
                        }
                    }
                    legend_page.addClass("show");
                }
                function changePage(pages) {
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
                $(window).on('resize', function () {
                    ul_height = legendContainer.height();
                    if (ul_height > legend_height) {
                        drawLegendPage();
                    } else {
                        legendContainer.css("margin-top","");
                        page_down.removeClass("unable");
                        page_up.addClass("unable");
                        legend_page.removeClass("show");
                        legend.removeClass("scrollable");
                    }
                });
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
        legend: {
            enabled: false
        },
        series: series,
        plotOptions: {
            pie: {
                size: 250,
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
            headerFormat: '<table><thead><tr><td>Threats</td></tr></thead>',
            pointFormat: '<tr><td><span style="color:{point.color}">\u25CF</span> {point.name} </td>' +
                '<td>{point.y:,.0f} <span>({point.percentage:.1f}%)</span></td></tr>',
            footerFormat: '</table>'
        }
    }, function (chart) {
        // bind events to your own custom legend
        $(document).on('click', '.scroll-pie-chart .legend li', function (event) {
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