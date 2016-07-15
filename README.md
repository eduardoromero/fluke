# fluke

## Un prototipo rápido para determinar la velocidad promedio de descarga que me entrega mi ISP. 

Las pruebas se hacen a través de SpeedTest.net a uno de 10 servidores en USA (random). Los resultados son almacenados en DocumentDB (Azure)
y pueden ser consultados a través de **data.js** y son graficados en **chart.html**


## ¿Cómo correrlo?

- Crea una cuenta en DocumentDB (Azure) para almacenar la información
- Crea un .env con los siguientes datos:
   
   ```
  DB_HOST=http://[hostazure].documents.azure.com:443/
  MASTERKEY=TUMASTERKEY
  DOCUMENT_URL="dbs/[nombre_db]/colls/[colección]"
  DATA_PORT=8888
  USER=username
  LOCATION=office
   ```
  
  Dónde:
  
   * **DB_HOST** es la URL al DocumentDB de la cuenta de Azure. 
   * **MASTERKEY** es la llave de seguridad, proporcionada por Azure (en el panel de control).
   * **DOCUMENT_URL** es el URL a la colección, *nombre_db* es el nombre de la báse de datos, *colección* es el nombre que
  se le da a la colección de documentos (desde el panel de control).
   * **DATA_PORT** es el puerto donde se grafica los *samples*
   * **LOCATION** es usado para poder correr las pruebas desde distintos puntos (por ejemplo casa vs oficina). 
   * **USER** es necseario para identificar el usuario que está realizando las pruebas (se obtiene del OS de ser posible). 
   
   
### Instala las dependencias
  ```
  npm install
  ```

### Para hacer las pruebas de velocidad y almacenarlas:
  ```
  node app.js
  ```
  
### Para correr el UI. 

Por default el UI estará en el puerto 8888 (```DATA_PORT```) [localhost:8888/chart.html](http://localhost:8888/chart.html)
 
  ```
  node data.js
  ```

