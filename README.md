Esta herramienta digital forma parte del catálogo de herramientas del [Banco Interamericano de Desarrollo](https://www.iadb.org). Puedes conocer más sobre la iniciativa del BID en [code.iadb.org](https://code.iadb.org)

<p align="center">
<img src="https://raw.githubusercontent.com/gcba/presupuesto-abierto-gcba/gh-pages/bastrap3/bac-header.png"> 
<img src="https://raw.githubusercontent.com/gcba/presupuesto-abierto-gcba/gh-pages/bastrap3/bac-header-2.png">
</p>

<p align="center">
  <a href="https://github.com/gcba/presupuesto-abierto-gcba/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/gcba/presupuesto-abierto-gcba?style=social"></a>
  <a href="https://github.com/gcba/presupuesto-abierto-gcba/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/gcba/presupuesto-abierto-gcba?style=social"></a>
  <a href="https://github.com/gcba/presupuesto-abierto-gcba/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/gcba/presupuesto-abierto-gcba?style=social"></a>
  <a href="https://github.com/gcba/presupuesto-abierto-gcba"><img alt="GitHub license" src="https://img.shields.io/github/license/gcba/presupuesto-abierto-gcba?style=social"></a>
</p>


## Índice

* [Introducción](#-introducción)
* [Guía de instalación y uso](#-guía-de-instalación-y-uso)
* [Compilación](#-compilación)
* [Generación de datos](#-generación-de-datos)
* [Autores](#-autores)
* [Contribuir con el proyecto](#-contribuir-con-el-proyecto)

*
 
## <img src="https://raw.githubusercontent.com/gcba/presupuesto-abierto-gcba/gh-pages/bastrap3/bac-header.png" height="28"> Introducción

`gcba-presupuesto`: Presupuesto Abierto de la Ciudad de Buenos Aires es un sitio estático: las visualizaciones se
construyen a partir de los datos almacenados en los archivos `CSV` que están en el directorio `Data`.

La información presentada corresponde a la ejecución presupuestaria al tercer trimestre de 2019. Se actualizará automáticamente en función de la disponibilidad de la información trimestral. Los datos provienen del conjunto [Presupuesto Ejecutado](https://data.buenosaires.gob.ar/dataset/presupuesto-ejecutado) disponible en [Buenos Aires Data](https://data.buenosaires.gob.ar/).


<details><summary><b>Objetivos</b></summary>

### :heavy_check_mark: Objetivos 

El presupuesto refleja lo que hace el Estado con los recursos que nos pide a todos los ciudadanos. Por eso, _desde el Gobierno de la Ciudad de Buenos Aires queremos rendir cuentas de forma directa sobre la manera en que utilizamos esos fondos. Estamos convencidos de que esa es la manera de __estimular la participación, optimizar los controles y mejorar el nivel de la discusión pública_.

</details>

## :ledger: Guía de instalación y uso

+ Se requieren las herramientas `bower` y `grunt`. Instalarlas con NPM.
<br>
+ Instalar las dependencias con: `bower install`. Una vez instaladas, el
sitio puede ser servido desde la carpeta donde está el archivo
`index.html` (por ejemplo, con `python -m SimpleHTTPServer`).

## 	:computer: Compilación

Para deployments públicos, se recomienda procesar los archivos con
las tareas definidas en `gruntfile.js`. 

Instalar las dependencias de desarrollo con `npm install`.

Si no esta el servicio `http-server` ejecutar


npm install -g http-server


Para compilar el proyecto, ejecutar:


grunt


Una vez terminado el proceso, la carpeta `dist` contendrá una versión
apta para ser copiada a un servidor HTTP.

*IMPORTANTE*: en el servidor HTTP, se recomienda activar compresión
GZIP para archivos de tipo CSV (MIME type: `text/csv`)


## 	:clipboard: Generación de datos

Los datos se generan a partir de los
[datos de ejecución presupuestaria](http://data.buenosaires.gob.ar/dataset/presupuesto-ejecutado)
disponibles en Buenos Aires Data.

Los archivos CSV allí disponibles deben ser cargados en una base de
datos SQL, si no existe la tabla [ver archivo presupuesto.sql](Data/presupuesto.sql). 

### Importar el CSV generado del trimestre desde la consola MYSQL
-Copiar el CSV a /var/lib/mysql con permisos de escritura y ownership para mysql
-O alternativamente iniciar mysql con el siguiente comando y levantar el csv desde su ubicación original:

mysql -u usuario -p --local-infile presupuesto


sql
LOAD DATA LOCAL INFILE '/var/lib/mysql/presupuesto-ejecutado-2017-tercer-trimestre.csv'
INTO TABLE gcba
CHARACTER SET UTF8
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;


### Cambiar las comas por puntos en la base de datos
sql
update presupuesto.gcba set definitivo = replace (definitivo, ',', '.');
update presupuesto.gcba set devengado = replace (devengado, ',', '.');


### Completar el año que corresponde a los datos
sql
update presupuesto.gcba set anio = 2017;


Los siguientes comandos generan los archivos `/home/desarrollo/presu_agrupado.csv` y `/home/desarrollo/geo.csv` respectivamente

### `presu_agrupado.csv`

 sql
mysql -uroot --password=root --database=presupuesto --execute='SELECT
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
GROUP BY anio, jur_desc, fin_desc, fun_desc, 
inciso_desc, ppal_desc, ff_desc, 
eco_desc' | sed "s/'/\'/;s/\t/\",\"/g;s/^/\"/;s/$/\"/;s/\n//g" > /home/desarrollo/presu_agrupado.csv


### `geo.csv`
Nota: revisar que la columna comuna, solo tenga el número de la comuna y no el texto.

 sql
mysql -uroot --password=root --database=presupuesto --execute='SELECT
  anio,
  replace(geo_desc, "COMUNA ", "") as comuna,
  sum(sancion)    AS sancion,
  sum(vigente)    AS vigente,
  sum(definitivo) AS definitivo,
  sum(devengado)  AS devengado
FROM gcba
WHERE cast(left(eco, 4) AS UNSIGNED) IN (2211, 2212, 2213, 2218, 2222, 2223, 2224, 2225, 2226, 2231, 2233, 2241, 2242, 2243, 2244)
AND geo_desc like "Comuna%"
GROUP BY anio, geo_desc
ORDER BY anio, geo_desc' | sed "s/'/\'/;s/\t/\",\"/g;s/^/\"/;s/$/\"/;s/\n//g" > /home/desarrollo/geo.csv

Luego, se sustituyen los resultados de dicho año en los CSV originales de la carpeta Data/.

## :rocket: Autores



## :handshake: Contribuir con el proyecto