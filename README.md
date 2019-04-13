# Interacción entre aplicación y página web usando Cordova

Hace un tiempo me solicitaron hacer una aplicación multiplataforma Android & iOS que interactue con el frontend de un sitio web mobile existente. Para esto podemos usar el InAppBrowser, un plugin de Cordova para incrustar contenido web en un WebView UIWebView/WKWebView. 

> La idea de este ejercicio es 
> invocar desde una aplicación híbrida 
> una pagina servida externamente 
> e interactuar con ella.

### Código

Utilizamos Vanilla Javascript y como ejercicio manejamos en la aplicación una leyenda y un botón que invoca a una página de login externa. Luego de completar el formulario, volvemos a la aplicación y mostramos el resultado.

En la carpeta /scripts se encuentra la página invocada desde la aplicación. Para una prueba local es necesario que este disponible y para ello es posible usar el servidor http provisto por python. 

### Observación

Al momento de escribir este ejercicio la versión estable del plugin era la 3.0.0, y esta API no presentaba el método "message" que si estaba en la versión de desarrollo 3.1.0-dev. El método "message" envía un mensaje desde la página a la aplicación, lo que permite una comunicación bidireccional entre la aplicación y la página. Para salvar este inconveniente, desde la aplicación podemos inyectar código javascript en la página y leer el resultado en un CallBack. De esta manera podemos monitorear una variable de salida y  verificar si el estado cambió, actuando en consecuencia. En programación llamamos a este procedimiento polling o consulta recurrente. 

El ejercicio soporta el uso de ambos plugins, el API con y sin la operación "message". Es interesante ver la implementación del polling.
