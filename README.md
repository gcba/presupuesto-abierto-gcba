# gcba-presupuesto

`gcba-presupuesto` es un sitio estático: las visualizaciones se
construyen a partir de los datos almacenados en los archivos `CSV` que
están en el directorio `Data`.

## Requerimientos

Se requieren las herramientas `bower` y `grunt`. Instalarlas con NPM.

Instalar las dependencias con: `bower install`. Una vez instaladas, el
sitio puede ser servido desde la carpeta donde está el archivo
`index.html` (por ejemplo, con `python -m SimpleHTTPServer`).

## Compilación

Para *deployments* públicos, se recomienda procesar los archivos con
las tareas definidas en `gruntfile.js`. Instalar las dependencias de
desarrollo con `npm install`.

Para compilar el proyecto, ejecutar:

```
grunt
```

Una vez terminado el proceso, la carpeta `dist` contendrá una versión
apta para ser copiada a un servidor HTTP.

**IMPORTANTE**: en el servidor HTTP, se recomienda activar compresión
GZIP para archivos de tipo CSV (MIME type: `text/csv`)

## Generación de datos

Los datos se generan a partir de los
[datos de ejecución presupuestaria](http://data.buenosaires.gob.ar/dataset/presupuesto-ejecutado)
disponibles en Buenos Aires Data.

Los archivos CSV allí disponibles deben ser cargados en una base de
datos SQL. Las siguientes consultas generan los archivos
`Data/presu_agrupado.csv` y `Data/geo.csv` respectivamente

### `presu_agrupado.csv`

``` sql
SELECT
  anio,
  jur_desc,
  fin_desc,
  fun_desc,
  inciso_desc,
  ppal_desc,
  ff_desc,
  eco_desc,
  sum(sancion)    AS sancion,
  sum(vigente)    AS vigente,
  sum(definitivo) AS definitivo,
  sum(devengado)  AS devengado
FROM gcba
GROUP BY anio, jur_desc, fin_desc, fun_desc, inciso_desc, ppal_desc, ff_desc, eco_desc
```

### `geo.csv`

``` sql
SELECT
  anio,
  replace(geo_desc, 'Comuna ', '') as comuna,
  sum(sancion)    AS sancion,
  sum(vigente)    AS vigente,
  sum(definitivo) AS definitivo,
  sum(devengado)  AS devengado
FROM gcba
WHERE cast(left(eco, 4) AS INTEGER) IN (2211, 2212, 2213, 2218, 2222, 2223, 2224, 2225, 2226, 2231, 2233, 2241, 2242, 2243, 2244)
AND geo_desc like 'Comuna%'
GROUP BY anio, geo_desc
ORDER BY anio, geo_desc;
```
