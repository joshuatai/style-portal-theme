$(function () {
    var series = [
        {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        },  {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 2.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        },
        {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        },  {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 2.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        },
        {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        },  {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 2.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }
      ];
    var colors = ['#509be5', '#66bf60', '#e55c5c', '#f2c849', '#9b50e5', '#5050e5', '#45bde5', '#f26d99', '#ff9866', '#b88ae5','#ff9866', '#b88ae5','#509be5', '#66bf60', '#e55c5c', '#f2c849', '#9b50e5', '#5050e5', '#45bde5', '#f26d99', '#ff9866', '#b88ae5','#ff9866', '#b88ae5'];
    
    Highcharts.chart('legend-right-container', {
        chart: {
            type: 'line',
            spacingRight: 0,
            spacingBottom: 0,
            events: {
              load: function () {
                var legend = $(".legend-right-line-charts-example .legend");
                var legendContainer = $('ul', legend);
                var legend_page = $(".with-vertical-legend .legend-page");
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
                }
                var ul_height = legendContainer.height();

                if (ul_height > legend_height) {
                    legend.addClass("scrollable");
                    ul_height = legendContainer.height();
                    var result = parseInt(ul_height) / parseInt(legend_height);
                    var totally_page = Math.ceil(result);
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: {
                  color: '#666666',
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
            plotLines: [{
                value: 0,
                width: 1,
                color: '#666666'
            }]
        },
        legend: {
            enabled: false
        },
        series: series,
        plotOptions: {
          series: {
            marker: {
              radius: 4,
              symbol: 'circle',
              states: {
                    hover: {
                        lineWidth: 3
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
            headerFormat: '<table><thead><tr><td style="padding-bottom: 5px">{point.key}</td></tr></thead>',
            pointFormat: '<tr><td style="padding-right: 20px"><span style="color:{point.color}">\u25CF</span> {series.name} </td>' +
                '<td style="text-align: right">{point.y} EUR</td></tr>',
            footerFormat: '</table>'
        }
    }, function (chart) {
        // bind events to your own custom legend
        $(document).on('click', '.legend-right-line-charts-example .legend li', function (event) {
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