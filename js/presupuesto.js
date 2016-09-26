$(function() {
    // Smooth scrolling
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    // Activate popovers
    $('[data-toggle="popover"]').popover({ trigger: "hover" });
});

d3.csv('Data/presu_agrupado.csv')
  .row(Presupuesto.processBudgetRow)
  .get(function(error, rows) {

      // finalidad y función para el bubble tree
      // se muestra solo para 2016
      var b = Presupuesto.toBubbleTree(_.filter(rows, function(d) { return d.anio === '2016' }),
                                       'vigente');
      new BubbleTree({
          data: b,
          container: '.bubbletree',
          bubbleType: 'icon',
          bubbleStyles: Presupuesto.BUBBLE_STYLES /*,
          tooltipCallback: function(node) { console.log('tt', node); } */
      });

      // secciones
      var classifications = [
          { classification: 'quien', dimension: 'jur_desc' },
          { classification: 'que', dimension: ['inciso_desc', 'ppal_desc'] },
          { classification: 'paraque', dimension: ['fin_desc', 'fun_desc']  },
          { classification: 'como', dimension: 'ff_desc' },
      ];

      classifications.forEach(function(c) {
          Presupuesto.createTreemapAreaViz('#' + c.classification, c.dimension, rows);
      });
  });

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
      Presupuesto.createGeoMapViz('#donde', 'comuna', rows);
  });
