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
            data: [6, 3, 8, 13, 2, 18, 17]
        }, 
        {
            name: 'Virus/Malware',
            data: [3, 4, 5, 8, 11, 15, 17]
        }, 
        {
            name: 'Spyware/Grayeare',
            data: [0, 44, 25, 48, 15, 13, 47]
        },
        {
            name: 'URL Filtrting',
            data: [23, 44, 25, 18, 31, 25, 47],
            visible: false
        },
        {
            name: 'Behavior Monitoring',
            data: [21, 24, 5, 48, 11, 55, 17],
            visible: false
        },
        {
            name: 'Device Control',
            data: [22, 4, 15, 8, 31, 53, 12],
            visible: false
        },
        {
            name: 'Network Virus',
            data: [42, 14, 52, 3, 3, 13, 22],
            visible: false
        },
        {
            name: 'Malicious',
            data: [2, 4, 5, 31, 13, 43, 12],
            visible: false
        },
        {
            name: 'URL Filtrting',
            data: [23, 44, 25, 18, 31, 25, 47],
            visible: false
        },
        {
            name: 'Behavior Monitoring',
            data: [21, 24, 5, 48, 11, 55, 17],
            visible: false
        },
        {
            name: 'Device Control',
            data: [22, 4, 15, 8, 31, 53, 12],
            visible: false
        },
        {
            name: 'Network Virus',
            data: [42, 14, 52, 3, 3, 13, 22],
            visible: false
        },
        {
            name: 'Malicious',
            data: [2, 4, 5, 31, 13, 43, 12],
            visible: false
        }
      ];
    var colors = ['#33abd6', '#33ba72', '#fe9967', '#45cce7', '#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', "#e07ad3", '#bbbbbb', '#33abd6', '#33ba72', '#fe9967', '#45cce7'];
    
    Highcharts.chart('scroll-area-container', {
        chart: {
            type: 'area',
            spacingRight: 0,
            spacingBottom: 0,
            events: {
              load: function () {
                var legend = $(".scroll-area-chart .legend");
                var legendContainer = $('ul', legend);
                var legend_page = $(".legend-page", legend);
                var page_up = $(".fa-caret-up", legend_page);
                var page_down = $(".fa-caret-down", legend_page);
                var now_page = $(".now", legend_page);
                var total_page = $(".total", legend_page);
                var initPage = "1";
                var legend_height = legend.height();

                for (var i = 0; i < series.length; i++) {
                    var newItem = $('<li>' + series[i].name + '</li>').addClass('color-' + colors[i].replace('#', ''));  
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
                    var totally_page = parseInt(ul_height) / parseInt(legend_height);
                    total_page.text(totally_page);
                    now_page.text(initPage);
                    page_up.addClass("unable");
                    legend_page.addClass("show");

                    page_up.on("click", function(){
                        var now = parseInt(now_page.text()) -1;
                        if (now == 1) {
                            page_up.removeClass("enable");
                            page_up.addClass("unable");
                        }
                        page_down.addClass("enable");
                        changePage(now);
                    });

                    page_down.on("click", function(){
                        var now = parseInt(now_page.text()) + 1;
                        if(now == totally_page) {
                            page_down.removeClass("enable");
                            page_down.addClass("unable"); 
                        }
                        page_up.addClass("enable");
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
                  fontWeight: 'normal',
                  paddingBottom: '10px'
                }
            },
            tickWidth: 0,
            crosshair: {
                width: 1,
                color: "#dddddd"
            }
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
            shared: true,
            backgroundColor: '#FFFFFF',
            borderColor: '#BBBBBB',
            padding: 16,
            useHTML: true,
            headerFormat: '<table><thead><tr><td style="padding-bottom: 5px">{point.x:%Y/%m/%d}</td></tr></thead>',
            pointFormat: '<tr><td style="padding-right: 20px;padding-bottom: 5px;"><span style="color:{point.color}">\u25CF</span> {series.name} </td>' +
                '<td style="text-align: right">{point.y}</td></tr>',
            footerFormat: '</table>'
        }
    }, function (chart) {
        // bind events to your own custom legend
        $(document).on('click', '.scroll-area-chart .legend li', function (event) {
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