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
        }, 
        {
            name: 'Virus/Malware',
            data: [3, 4, 5, 8, 11, 15, 17]
        }, 
        {
            name: 'Spyware/Grayeare',
            data: [0, 4, 5, 16, 15, 13, 22],
            visible: false
        },
        {
            name: 'URL Filtrting',
            data: [3, 6, 2, 14, 17, 15, 19],
            visible: false
        },
        {
            name: 'Behavior Monitoring',
            data: [2, 7, 1, 12, 11, 15, 17],
            visible: false
        },
        {
            name: 'Device Control',
            data: [2, 4, 3, 10, 13, 11, 15],
            visible: false
        },
        {
            name: 'Network Virus',
            data: [4, 1, 2, 13, 18, 16, 12],
            visible: false
        },
        {
            name: 'Malicious',
            data: [2, 4, 8, 11, 13, 14, 19],
            visible: false
        },
        {
            name: 'URL Filtrting',
            data: [5, 8, 7, 18, 13, 15, 17],
            visible: false
        },
        {
            name: 'Behavior Monitoring',
            data: [1, 3, 5, 14, 11, 15, 20],
            visible: false
        },
        {
            name: 'Device Control',
            data: [2, 4, 6, 8, 11, 15, 19],
            visible: false
        }
      ];
    var colors = ['#33abd6', '#33ba72', '#fe9967', '#45cce7', '#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', "#e07ad3"];
    Highcharts.chart('line-legend-right-container', {
        chart: {
            type: 'line',
            spacingBottom: 0,
            events: {
              load: function () {
                var legend = $(".line-charts-example.with-vertical-legend .legend");
                var legendContainer = $('ul', legend);
                var legend_page = $(".line-charts-example.with-vertical-legend .legend-page");
                var page_up = $(".fa-caret-up", legend_page);
                var page_down = $(".fa-caret-down", legend_page);
                var now_page = $(".now", legend_page);
                var total_page = $(".total", legend_page);
                var initPage = "1";
                var legend_height = legend.height();
                var totally_page;

                for (var i = 0; i < series.length; i++) {
                    var color_idx = i%10;
                    var newItem = $('<li>' + series[i].name + '</li>').addClass('color-' + colors[color_idx].replace('#', ''));  
                    legendContainer.append(newItem);
                    newItem[0].series = series[i];
                    if (series[i].visible == false) {
                        newItem.addClass("mute");
                    }
                }
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
                
                function changePage (now) {
                    var value = now-1;
                    var margin_value = value * legend_height;

                    if (now < 1 || now > totally_page) {
                        return false;
                    }
                    else {
                        now_page.text(now); //change page
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
                  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                  fontWeight: 'normal'
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
                  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
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
            pointStart: Date.UTC(2016, 9, 10),
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
        $(document).on('click', '.line-charts-example.with-vertical-legend .legend li', function (event) {
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