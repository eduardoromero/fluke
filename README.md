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
  DOCUMENT_URL="dbs/[nombre_db]/colls/[collección]"
  DATA_PORT=8888
   ```
- Instala las dependencias
  ```
  npm install
  ```

- Para hacer las pruebas de velocidad y almacenarlas:
  ```
  node app.js
  ```
  
- Para correr el UI. Por default el UI estará en el puerto 8888 (```DATA_PORT```) [localhost:8888/chart.html](http://localhost:8888/chart.html) 
  ```
  node data.js
  ```

