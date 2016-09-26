$(function() {
    $('[data-toggle="popover"]').popover({ trigger: "hover" });
    var iframes = {
        'quien': {
            dimension: 'jur_desc'
        },
        'que': {
            dimension: ['inciso_desc', 'ppal_desc']
        },
        'para-que': {
            dimension: ['fin_desc', 'fun_desc']
        },
        'como-se-financia': {
            dimension: 'ff_desc'
        }
    };
    var id = Presupuesto.getQueryVariable('id');

    switch(id) {
        case 'bubbletree':
            //d3.select('.controls').style('display', 'none');
            $('.controls').css('display', 'none');
            d3.csv('Data/presu_agrupado.csv')
              .row(Presupuesto.processBudgetRow)
              .get(function(error, rows) {
                  // crear container para el bubbletree
                  d3.select('.viz')
                    .append('div')
                    .attr('class', 'bubbletree-wrapper')
                    .append('div')
                    .attr('class', 'bubbletree');

                  var b = Presupuesto.toBubbleTree(_.filter(rows,
                                                            function(d) {
                                                                return d.anio === '2016'
                                                            }),
                                                   'vigente');
                  new BubbleTree({
                      data: b,
                      container: '.bubbletree',
                      bubbleType: 'icon',
                      bubbleStyles: Presupuesto.BUBBLE_STYLES
                  });
              });
            break;
        case 'map':
            d3.select('.chart-type').style('display', 'none');
            d3.csv('Data/geo.csv')
              .row(function(d) {
                  return Object.assign(d,
                                       _.fromPairs(
                                           _.map(['comuna'].concat(Presupuesto.MEASURES),
                                                 function(m) {
                                                     return [m, +d[m]];
                                                 })));
              })
              .get(function(error, rows) {
                  Presupuesto.createGeoMapViz('#viz', 'comuna', rows);
              });

            break;
        default:
            d3.csv('Data/presu_agrupado.csv')
              .row(Presupuesto.processBudgetRow)
              .get(function(error, rows) {
                  Presupuesto.createTreemapAreaViz('#viz',
                                                   iframes[id].dimension,
                                                   rows);
              });

    }
});
