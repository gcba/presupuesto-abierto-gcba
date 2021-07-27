if (!window.Presupuesto) {
    window.Presupuesto = {};
}

var localeES = d3.locale({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["", " €"],
    "dateTime": "%A, %e de %B de %Y, %X",
    "date": "%d/%m/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    "shortDays": ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    "months": ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    "shortMonths": ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
});

//Para decimales de los Montos Totales cambiar el valor .3s (para 3 digitos) a .4s (para 4 digitos) ó .5s
var d3Format = d3.format('.4s'),
    suffixMap = {
        'M': 'M',
        'G': 'MM',
        'T': 'MMM'
    },
    formatNumber = function(num) {
        var s = d3Format(num),
            suffix = s[s.length - 1],
            abbN = s.slice(0, s.length - 1);

        if (suffixMap.hasOwnProperty(suffix)) {
            abbN += suffixMap[suffix];
        }
	
        return abbN;
    };

// patcheamos la función de formateo de BubbleTree
BubbleTree.Utils.formatNumber = formatNumber;


Presupuesto = {
    MEASURES: ['vigente', 'devengado'],
    CSCALE: ['#DF4944', '#EE9224', '#FAD448', '#1FB7DC', '#0F74C7', '#2AB186', '#88B84D', '#CBD640', '#2F3E4B', '#8A55A7', '#F04691'],
    REPLACEMENTS: {
	'fin_desc': {
	    'Servicios Económicos': 'SERVICIOS ECONOMICOS',
	    'Deuda Pública – Intereses Y Gastos': 'DEUDA PUBLICA, INTERESES Y GASTOS',
	    'Servicios Sociales': 'SERVICIOS SOCIALES',
	    'Administración Gubernamental': 'ADMINISTRACION GUBERNAMENTAL',
	    'Servicios De Seguridad': 'SERVICIOS DE SEGURIDAD',
	    'Educación': 'EDUCACION',
	    'Cultura': 'CULTURA',
	    'Salud': 'SALUD',
	    'Vivienda': 'VIVIENDA',
	    'Dirección Ejecutiva': 'DIRECCION EJECUTIVA',
            'Administración Fiscal': 'ADMINISTRACION FISCAL',
            'Transporte': 'TRANSPORTE',
            'Servicios Urbanos': 'SERVICIOS URBANOS',
            'Ecología': 'ECOLOGIA',
            'Agua Potable Y Alcantarillado': 'AGUA POTABLE Y ALCANTARILLADO',
            'Trabajo': 'TRABAJO',
            'Promocióm Y Acción Social': 'PROMOCION Y ACCION SOCIAL',
            'Control De La Gestión': 'CONTROL DE LA GESTION',
            'Legislativa': 'LEGISLATIVA',
            'Turismo': 'TURISMO'
	},
        'fun_desc': {
            'Servicios Urbanos': 'Servicios Urbano',
            'Seguridad Interior': 'Seguridad'	    
        },
        'inciso_desc': {
            'Servicio De La Deuda Y Disminución De Otros Pasivos': 'Intereses de la Deuda Pública'
        },
        'ppal_desc': {
            'Activos Intangibles': 'Software y otros Activos Intangibles'
        },
        'ff_desc': {
            'Tesoro De La Ciudad': 'Tesoro De La Ciudad'
        },
    },
    BUBBLE_STYLES: {
        id: {
            'Total': {
                color: '#cccccc',
                icon: 'icons/bubble/total.svg'
            },
            'DEUDA PUBLICA, INTERESES Y GASTOS': {
                icon: 'icons/bubbletree/deuda-publica.svg',
                color: '#f3a32d'
            },
            'SERVICIOS SOCIALES': {
                icon: 'icons/bubbletree/servicios-sociales.svg',
                color: '#2ebc98'
            },
            'SERVICIOS ECONOMICOS': {
                icon: 'icons/bubbletree/servicios-economicos.svg',
                color: '#fcda59'
            },
            'ADMINISTRACION GUBERNAMENTAL': {
                icon: 'icons/bubbletree/admin-gubernamental.svg',
                color: '#34485e'
            },
            'SERVICIOS DE SEGURIDAD': {
                icon: 'icons/bubbletree/seguridad.svg',
                color: '#0389d1'
            },
            'EDUCACION': {
                icon: 'icons/bubbletree/educacion.svg',
                //color: '#19c3e3'
            },
            'CULTURA': {
                icon: 'icons/bubbletree/cultura.svg',
                //color: '#f562a2'
            },
            'SALUD': {
                icon: 'icons/bubbletree/salud.svg',
                //color: '#2ebc98'
            },
            'VIVIENDA': {
                icon: 'icons/bubbletree/vivienda.svg'
            },
            'JUDICIAL': {
                icon: 'icons/bubbletree/judicial.svg'
            },
            'DIRECCION EJECUTIVA': {
                icon: 'icons/bubbletree/ejecutiva.svg',
                //color: '#34485e'
            },
            'ADMINISTRACION FISCAL': {
                icon: 'icons/bubbletree/fiscal.svg',
                //color: '#34485e'
            },
            'TRANSPORTE': {
                icon: 'icons/bubbletree/transporte.svg',
                //color: '#e76056'
            },
            'SERVICIOS URBANOS': {
                icon: 'icons/bubble/servicios_urbanos.svg',
                //color: '#f3a32d'
            },
            'ECOLOGIA': {
                icon: 'icons/bubbletree/medio-ambiente.svg',
                //color: '#99c25f'
            },
            'AGUA POTABLE Y ALCANTARILLADO': {
                icon: 'icons/bubbletree/agua.svg'
            },
            'TRABAJO': {
                icon: 'icons/bubbletree/trabajo.svg',
                //color: '#99c25f'
            },
            'PROMOCION Y ACCION SOCIAL': {
                icon: 'icons/bubbletree/promocion.svg'
            },
            'CONTROL DE LA GESTION': {
                icon: 'icons/bubbletree/control-de-gestion.svg'
            },
            'LEGISLATIVA': {
                icon: 'icons/bubbletree/legislativa.svg'
            },
            'TURISMO': {
                icon: 'icons/bubbletree/turismo.svg'
            }
        }
    },
    formatD3Plus: function(n, o) {
        var rv;
        if (o.key === 'share') {
            if (n === 0)
                rv = 0
            else if (n >= 100)
                rv = localeES.numberFormat(",f")(n);
            else if (n > 99)
                rv = localeES.numberFormat(".3g")(n);
            else
                rv = localeES.numberFormat(".2g")(n);
            rv += "%"
        }
        else {
            rv = formatNumber(n);
        }
        return rv;
    },
    getQueryVariable: function(variable) { // get a variable from the query string
        var query = window.location.search.substring(1),
            vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    },
    processBudgetRow: function(d) {
        // aplicar reemplazos
        Object.keys(Presupuesto.REPLACEMENTS).forEach(function(k) {
            if (d[k] in Presupuesto.REPLACEMENTS[k]) {
                d[k] = Presupuesto.REPLACEMENTS[k][d[k]];
            }
        });

        // convertir las measures a números
        var o = Object.assign(d,
                              _.fromPairs(
                                  _.map(Presupuesto.MEASURES,
                                        function(m) {
                                            return [m, +d[m]];
                                        })));
        return o;
    },
    createTreemapAreaViz: function(containerSelector, dimension, data) {
        var contSelector = containerSelector;
        var container = d3.select(containerSelector);
        var selectedChartType = container.selectAll("input[name*=chart][type=radio]:checked").node().value;
        var selectedMeasure = container.selectAll("input[name*=measure][type=radio]:checked").node().value;

        var chart = d3plus.viz()
                          .format(
                              {
                                  locale: 'es_ES',
                                  number: Presupuesto.formatD3Plus
                              }
                          )
                          .container(container.select('.viz'))
                          .data(data)
                          .id(dimension)
                          .color({
                              scale: Presupuesto.CSCALE,
                              value: _.isArray(dimension) ? dimension[0] : dimension
                          })
                          .labels({"align": "left", "valign": "top"})
                          .font({
                              family: 'Helvetica, Arial, sans-serif',
                              weight: '100'
                          });

        function updateChart() {
            switch (selectedChartType) {
                case 'tree_map':
                    chart
                            .type('tree_map')
                            .time({
                                value: 'anio',
                                solo: ['2021'], // TODO: Calculate this
                                fixed: false
                            })
                            .timeline(true)
                            .size({
                                value: selectedMeasure,
                                threshold: false
                            })
                            .legend({filters: true})
                            //.depth(_.isArray(dimension) ? 1 : 0)
                            .title({total: true})
                            .draw();
                    break;
                case 'stacked':
                    chart
                            .type('stacked')
                            .y(selectedMeasure)
                            .x({value: 'anio', label: 'Año'})
                            .time({value: 'anio', solo: []})
                            .timeline(false)
                            .depth(0)
                            .title({total: false})
                            .draw();
                    break;
            }
        }

        updateChart();

        container.selectAll("input[name*=chart][type=radio]")
          .on("change", function() {
              selectedChartType = this.value;
              updateChart();
          });

        container.selectAll("input[name*=measure][type=radio]")
          .on("change", function() {
              selectedMeasure = this.value;
              updateChart();
          });

    },
    createGeoMapViz: function(containerSelector, dimension, data) {
        var container = d3.select(containerSelector);
        var selectedMeasure = container.selectAll("input[name*=measure][type=radio]:checked").node().value;

        var map = d3plus.viz()
                        .container(container.select('.viz'))
                        .data(data)
                        .coords('Data/comunas_topo.json')
                        .type("geo_map")
                        .id(dimension)
                        .format(
                            {
                                locale: 'es_ES',
                                number: Presupuesto.formatD3Plus
                            }
                        )
                        .text(function(d) {
                            return 'Comuna-' + d.comuna;
                        })
                        .time({
                            value: 'anio',
                            solo: ['2021'], // TODO: Calculate this
                            fixed: false
                        })
                        .color(selectedMeasure)
                        .font({
                            family: 'Helvetica, Arial, sans-serif',
                            weight: '100'
                        })
                        .draw();

        container.selectAll("input[name*=measure][type=radio]")
          .on("change", function() {
              selectedMeasure = this.value;
              map.color(selectedMeasure)
                 .draw();
          });
    },
    toBubbleTree: function(rows, measure) {
        // convertir los datos a una estructura jerárquica
        // para el bubble tree
        function btData(rows, measure) {
            var total = d3.nest()
                          .rollup(function(leaves) { return d3.sum(leaves, _.property(measure)); })
                          .entries(rows);

            var bub = d3.nest()
                        .key(_.property('fin_desc'))
                        .key(_.property('fun_desc'))
                        .rollup(
                            function(leaves) {
                                return d3.sum(leaves,
                                              _.property(measure));
                            })
                        .entries(rows);
            return {
                key: 'Total',
                values: bub
            };
        }

        // para cada nodo, calcular recursivamente la suma
        // de su sub-árbol
        // También renombra los keys de los objetos, para
        // conformar a BubbleTree
        function toSumTree(n) {
            if (_.isNumber(n.values)) {
                n.label = n.key;
                n.id = n.label;
                n.amount = n.values;// / 1000;
                return;
            }

            n.children = n.values;
            delete n.values;
            n.label = n.key;
            n.id = n.label;
            delete n.key;

            n.children.forEach(toSumTree);
            n.amount = (n.amount || 0) + d3.sum(n.children, _.property('amount'));

            return n;
        }

        b = btData(rows, measure);
        toSumTree(b);

        return b;
    }
};
