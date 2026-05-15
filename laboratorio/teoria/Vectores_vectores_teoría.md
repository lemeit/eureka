

 
 # Vectores. Análisis Vectorial.

 

 [Volver a la página principal de Física](https://cursos-0-fc-ugr.github.io/Fisica/)

 
# # Propiedades generales de los vectores

 

 
En Física, algunas cantidades como el tiempo, la temperatura, la masa y la densidad, se pueden describir completamente con un número y una unidad. Diremos entonces que se trata de magnitudes escalares.

 
Sin embargo, existen otras magnitudes que están asociadas con una dirección y no pueden describirse con un sólo número. Por ejemplo, la velocidad: no solo es necesario indicar la rapidez de un avión, sino también su dirección. También ocurre igual con la magnitud física fuerza: para describirla correctamente, hay que indicar no solo su intensidad, sino también su dirección y sentido. Diremos que son magnitudes vectoriales.

 
 EJEMPLO: \vec{A} y \vec{B} son vectores con la misma magnitud y dirección, pero diferente sentido. El vector \vec{C} tiene la misma dirección que los dos vectores anteriores. Diremos que son vectores paralelos.
 
 
 
 <a data-fancybox="" href="figuras/fig-vectores0.png">
 
<img alt="" src="../_static/../_static/figuras/Vectores/Vectores/fig-vectores0.png" width="30%"/>

 </a>
 
 

 
 </article>
 
 
La magnitud de un vector es el <em>módulo</em> del vector, y se expresa en la forma |\vec{A}|. Es una cantidad escalar y siempre es positiva.

 

 
# # Operaciones con vectores

 

 
1. **Suma de vectores**:

 Supongamos que una partícula sufre un desplazamiento del punto O al punto P, definido por el vector \vec{A}=\overrightarrow{OP}, seguido de un segundo desplazamiento, del punto P al punto Q, definido entonces por el vector \vec{B}=\overrightarrow{PQ}. El resultado final será equivalente a considerar que la partícula parte del punto O y tiene como punto final el punto Q. Es decir, podemos considerar que el desplazamiento total vendrá dado por el vector \vec{C}, que se calcula como \vec{C} = {\overrightarrow{A }}+\vec{B} = \vec{B}+\vec{A}

 La suma de vectores es **conmutativa**, tal y como vemos en la siguiente figura

 
 
 
 <a data-fancybox="" href="figuras/fig-vectores01.png">
 
<img alt="" src="../_static/../_static/figuras/Vectores/Vectores/fig-vectores01.png" width="35%"/>

 </a>
 
 

 Y además, también es **asociativa**:

  \vec{A}+\vec{B}+\vec{C} \rightarrow \left ( \vec{A}+\vec{B} \right ) + \vec{C} = \vec{A} + \left ( \vec{B} + \vec{C} \right )

 Para restar dos vectores:

 \vec{A} - \vec{B} = \vec{A} + \left ( -\vec{B} \right )

 (-\vec{B}) es el vector opuesto de \vec{B}. Tiene la misma magnitud, la misma dirección, pero sentido contrario.

 También podemos multiplicar un vector por un escalar. Por ejemplo:

 \vec{B} = 2 \, \vec{A}

 \vec{B} es un vector con la misma dirección y sentido que \vec{A} pero su magnitud es el doble.

 La fuerza es una magnitud vectorial. Por tanto, de la expresión

  \vec{F}= m \, {\overrightarrow{a}} \,

 podemos deducir que la dirección de \vec{F} y {\overrightarrow{a}} es la misma, el sentido también (porque m es siempre una cantidad positiva) y la magnitud de \vec{F} es igual a la magnitud de {\overrightarrow{a}} multiplicada por la masa m.

 <article style="background-color:lightblue;border-color:blue">
 **EJEMPLO: Un senderista camina desde un refugio en una llanura 1 km hacia el norte y 2 km hacia el este. ¿A qué distancia y en qué dirección está respecto al punto de partida?**
 <button id="e1" class="button" onclick="show2('e1');">Solución</button>
 
 
 Solución: 

 
 El camino que sigue el senderista puede ser descrito mediante los vectores \vec{A}, \vec{B} y su resultante \vec{C}, tal y como se representa en la siguiente figura

 
 
 <a data-fancybox="" href="figuras/fig-vectores02.png">
 
<img alt="" src="../_static/../_static/figuras/Vectores/Vectores/fig-vectores02.png" width="35%"/>

 </a>
 
 

 La distancia al punto de partida la determinaremos mediante la magnitud del vector \vec{C}, que vendrá dada por:

 |\vec{C}| = \sqrt{1 + 4} \; {\mathrm{km}} = \sqrt{5} \; {\mathrm{km}} \, .

 La dirección nos la dará el ángulo \phi y por tanto, puede ser calculado teniendo en cuenta la magnitud de los vectores \vec{A} y \vec{B}, 1 y 2 km, respectivamente. Por tanto

 {\mathrm{tg}} \, \phi = \frac{2}{1} \;\; \rightarrow \phi=63.4^{\mathrm{o}}

1. **Componentes**

 Las componentes de los vectores nos van a permitir un método sencillo pero general para sumar vectores. Supongamos que tenemos un sistema cartesiano de ejes de coordenadas. Entonces A_x es la magnitud del vector {\overrightarrow{A_x}} y A_y es la magnitud del vector {\overrightarrow{A_y}}. A_x y A_y son las componentes del vector \vec{A}. Podemos calcular las componentes del vector \vec{A} si conocemos la magnitud y la dirección de dicho vector. Describiremos la dirección de un vector con su ángulo \theta, relativo a una dirección de referencia, que es el eje x positivo, siempre en sentido antihorario

 \frac{A_x}{|\vec{A}|} = \cos \theta \rightarrow A_x= |\vec{A}| \cos \theta \quad \quad \frac{A_y}{|\vec{A}|}= {\mathrm{sen}}\, \theta \rightarrow A_y= |\vec{A}| {\mathrm{sen}} \, \theta

 <article style="background-color:lightblue;border-color:blue">
 **EJEMPLO: Determina las componente x e y del vector \vec{D}, con magnitud |\vec{D}|=3 m y siendo \alpha=45^{\mathrm{o}} (ver figura).**
 <button id="e2" class="button" onclick="show2('e2');">Solución</button>
 
 
 Solución: 

 
 Según la figura, vemos que D_x es positiva y D_y es negativa. Por tanto

 \cos \alpha = \frac{D_x}{|\vec{D}|} \quad {\mathrm{sen}} \, \alpha = \frac{|D_y|}{|\vec{D}|} \rightarrow D_x=3/2 \sqrt{2} \quad D_y=3/2 \sqrt{2} \, .

 
 
 </article>
 
 

 - **Cálculo de vectores usando componentes**

 El uso de componentes facilita algunos cálculos que implican vectores. Veamos algunos ejemplos

 
 - <em>Cálculo y magnitud de un vector a partir de sus componentes</em>:

 Un vector queda descrito por su magnitud y dirección, pero también dando sus componentes. A partir de ellas, podemos calcular la magnitud y dirección del vector

  |\vec{A}| = \sqrt{A_x^2 + A_y^2} \quad {\mathrm{tg}} \, \theta = \frac{A_y}{A_x} \quad \theta = {\mathrm{arctg}} \, \, \frac{A_y}{A_x}

 <article style="background-color:lightblue;border-color:blue">
 **EJEMPLO: Calcula la magnitud y dirección del vector \vec{A} si A_x=2 m y A_y=-2 m.**
 <button id="e3" class="button" onclick="show2('e3');">Solución</button>
 
 
 Solución: 

  |\vec{A}| = \sqrt{A_x^2 + A_y^2} =\sqrt{8} \quad \theta = {\mathrm{arctg}} \, \,(-1) \quad \theta=315^{\mathrm{o}}

 Al introducir el valor -1 en la calculadora para obtener el valor del arco tangente, nos dará -45^{\mathrm{o}}. Este ángulo, siguiendo nuestro criterio de tomarlo respecto al eje x positivo, en sentido antihorario, es equivalente al ángulo de 315^{\mathrm{o}}.

 
 
 </article>
1. <em>Multiplicación de un vector por un escalar</em>:

  \vec{D}= c \vec{A} \rightarrow D_x = c \, A_x \quad D_y = c \, A_y

1. <em>Uso de componentes para calcular la suma de vectores</em>:

  \vec{A}, \vec{B} \quad \vec{R} = \vec{A} + \vec{B} \rightarrow R_x=A_x+B_x \quad R_y=A_y+B_y \, .

1. Las componentes de la resultante \vec{R}=\vec{A}+\vec{B}.

1. La magnitud y la dirección de \vec{R}=\vec{A}+\vec{B}.

1. Las componentes de la diferencia vectorial \vec{S}=\vec{B}-\vec{A}.

1. La magnitud y la dirección de \vec{S}=\vec{B}-\vec{A}.

</strong>
 
 <button id="e5" class="button" onclick="show2('e5');">Solución</button>
 
 
 
 Solución: 

 
1.  R_x=A_x+B_x=5.40 \; {\mathrm{cm}} \quad \quad R_y=A_y+B_y=-1.50 \; {\mathrm{cm}}

1. |\vec{R}|=\sqrt{(5.40)^2 + (1.50)^2} \; {\mathrm{cm}} = 5.60 \; {\mathrm{cm}} \quad \quad {\mathrm{tg}} \; \phi= \frac{-1.50}{5.40} \rightarrow \phi=285.52^{\mathrm{o}}

1. S_x=B_x-A_x=2.80 \; {\mathrm{cm}} \quad \quad S_y=B_y-A_y=-6.00 \; {\mathrm{cm}}

1. |\vec{S}|=\sqrt{(2.80)^2 + (6.00)^2} \; {\mathrm{cm}} = 6.62 \; {\mathrm{cm}} \quad \quad {\mathrm{tg}} \; \psi= \frac{-6.00}{2.80} \rightarrow \psi=115.02^{\mathrm{o}}

 
 
 </article>

 

 
# # Vectores unitarios

 

 
Los vectores unitarios son aquéllos con magnitud igual a 1 (sin unidades). Su única finalidad es dar una dirección en el espacio. Siempre los notaremos con un acento del tipo \hat{ }, para indicar que se trata de un vector unitario.

 
 - 
\hat{\imath} \rightarrow apunta en la dirección x positiva.

 - 
\hat{\jmath} \rightarrow apunta en la dirección y positiva

 

 
Por tanto, podemos escribir:

 
\vec{A}= A_x \, \hat{\imath} \, + \, A_y \, \hat{\jmath} \, .

 
Y la suma de vectores se haría sumando directamente componentes: \vec{A}=A_x \, \hat{\imath} \, + \, A_y \, \hat{\jmath} \quad \quad \quad \vec{B}=B_x \, \hat{\imath} \, + \, B_y \, \hat{\jmath} \quad \quad \quad \vec{R}= \vec{A}+\vec{B}=\left ( A_x+B_x \right) \hat{\imath} + \left (A_y+B_y \right) \hat{\jmath}

 <article style="background-color:lightblue;border-color:blue">
 <strong>EJEMPLO: Sean los vectores \vec{D}= \left ( 6 \hat{\imath} + 3\hat{\jmath} \right )\, {\mathrm{m}} y \vec{E}= \left ( 4 \hat{\imath} - 5 \hat{\jmath} \right ) \, {\mathrm{m}}. Calcular el vector 2 \vec{D} - \vec{E} y su magnitud.</strong>

 <button id="e6" class="button" onclick="show2('e6');">Solución</button>
 
 
 
 Solución: 

  \vec{R} = 2\, \vec{D} -\vec{E} = 2 \, \left ( 6 \hat{\imath} + 3 \hat{\jmath} \right ) - \left ( 4 \hat{\imath} - 5 \hat{\jmath} \right ) = 12 \hat{\imath} + 6 \hat{\jmath} - 4\hat{\imath} + 5 \hat{\jmath} = \left ( 8 \hat{\imath} + 11 \hat{\jmath} \right ) \, { \mathrm{m}} \, .

 
Y la magnitud del vector \vec{R} será:

 
 |\vec{R}|= \sqrt{64 \, +\, 121} = \sqrt{185} \, {\mathrm{m}} = 13.6 \, {\mathrm{m}}

 
 
 </article>

 

 
# # Producto de vectores

 

 
1. **Producto escalar de dos vectores**:

 Se denota por \vec{A} \cdot \vec{B} y el resultado es un escalar. Para calcularlo, representamos los vectores \vec{A} y \vec{B} con origen en el mismo punto.

 
 
 <a data-fancybox="" href="figuras/fig-vectores03.png">
 
<img alt="" src="../_static/../_static/figuras/Vectores/Vectores/fig-vectores03.png" width="35%"/>

 </a>
 
 

 Definimos \vec{A} \cdot \vec{B} como la magnitud de \vec{A} multiplicada por la componente de \vec{B} paralela a \vec{A}, es decir:

 \fbox{$\vec{A} \cdot \vec{B} = |\vec{A}|\, |\vec{B}| \, {\mathrm{cos}} \, \theta$ }

 Es un escalar, y puede ser positivo, negativo o cero. Si \theta= \pi /2 (vectores perpendiculares) el producto escalar es siempre cero, independientemente de la magnitud de los vectores. También podemos comprobar que el producto escalar es **conmutativo**:

 \vec{A} \cdot \vec{B} = |\vec{A}| \, |\vec{B}| \, {\mathrm{cos}} \, \theta= |\vec{B}| \, |\vec{A}| \, {\mathrm{cos}} \, \theta = \vec{B} \cdot \vec{A}

 Por ejemplo, si una fuerza constante \vec{F} se aplica a un cuerpo que sufre un desplazamiento \vec{s}, el trabajo W realizado por la fuerza se calculará como

 \fbox{$W = \vec{F} \cdot {\overrightarrow{s}}$ }

 Si queremos usar las componentes para calcular el producto escalar de los vectores \vec{A} y \vec{B}

 \vec{A}= A_x \hat{\imath} + A_y \hat{\jmath} \quad \; \vec{B}= B_x \hat{\imath} + B_y \hat{\jmath} \,

 tendremos: \vec{A} \cdot \vec{B} = \left ( A_x \hat{\imath} + A_y \hat{\jmath} \right ) \cdot \left ( B_x \hat{\imath} + B_y \hat{\jmath} \right ) = A_x \, B_x + A_y \, B_y \, , donde hemos usado que se verifica que: \hat{\imath} \cdot \hat{\imath} = \hat{\jmath} \cdot \hat{\jmath}= 1 \quad \; \hat{\imath} \cdot \hat{\jmath} = \hat{\jmath} \cdot \hat{\imath} = 0
 
 

 <article style="background-color:lightblue;border-color:blue">
 **EJEMPLO: Obtener el producto escalar de los vectores \vec{A} y \vec{B}, siendo |\vec{A}|=4, \theta_A=53^{\mathrm{o}} y |\vec{B}|=5, \theta_B=130^{\mathrm{o}} [<sup>1</sup>](# fn1)**

 
 
 
 <a data-fancybox="" href="figuras/fig-vectores04.png">
 
<img alt="" src="../_static/../_static/figuras/Vectores/Vectores/fig-vectores04.png" width="100%"/>

 </a>
 
 

 <button id="e7" class="button" onclick="show2('e7');">Solución</button>
 
 
 Solución: 

 Podemos calcular las componentes de cada uno de los vectores: A_x= |\vec{A}| \cos 53^{\mathrm{o}} = 2.407 \quad \; A_y = |\vec{A}| {\mathrm{sen}} 53^{\mathrm{o}}=3.195

 B_x= |\vec{B}| \cos 130^{\mathrm{o}} = -3.214 \quad \; B_y = |\vec{B}| {\mathrm{sen}} 130^{\mathrm{o}}=3.830 \, .

 Por tanto:

  \vec{A} \cdot \vec{B} = A_x \, B_x \, + \, A_y \, B_y = 4.499 \, .

 
 </article>
1. **Producto vectorial de dos vectores**:

 El producto vectorial de los vectores \vec{A} y \vec{B} se denota como \vec{A} \wedge \vec{B}. Definimos dicho producto vectorial como un vector, perpendicular al plano que forman los vectores \vec{A} y \vec{B}, y cuya magnitud viene dada por |\vec{A} \wedge \vec{B}| = |\vec{A}| \, |\vec{B}| \, {\mathrm{sen}} \theta \, , siendo \theta el ángulo que forman ambos vectores. La dirección y sentido del vector \vec{A} \wedge \vec{B} nos lo da la <em>regla de la mano derecha</em>. La dirección del producto vectorial está definida por la dirección del pulgar, cerrando los demás dedos en torno al vector \vec{A} primero y siguiendo con el vector \vec{B}.

 Una propiedad del producto vectorial es que cuando ambos vectores son paralelos (\theta=0, 180^{\mathrm{o}}), el producto vectorial es nulo.

 Teniendo en cuenta los vectores unitarios en el espacio tridimensional:

 
 
 <a data-fancybox="" href="figuras/unitarios.png">
 
<img alt="" src="../_static/../_static/figuras/Vectores/Vectores/unitarios.png" width="50%"/>

 </a>
 
 

 Podemos ver que verifican: \hat{\imath} \wedge \hat{\jmath} = \hat{k} \quad \; \hat{\jmath} \wedge \hat{\imath} = -\hat{k} \quad \; \hat{\imath} \wedge \hat{\imath} = 0

 \hat{\jmath} \wedge \hat{k} = \hat{\imath} \quad \; \hat{k} \wedge \hat{\jmath} = -\hat{\imath} \quad \; \hat{\jmath} \wedge \hat{\jmath} = 0

 \hat{k} \wedge \hat{\imath} = \hat{\jmath} \quad \; \hat{\imath} \wedge \hat{k} = -\hat{\jmath} \quad \; \hat{k} \wedge \hat{k} = 0

 Y esto nos sirve para escribir una expresión general para el producto vectorial \vec{A} \wedge \vec{B}:

 \vec{A} \wedge \vec{B} = \left ( A_x \hat{\imath} + A_y \hat{\jmath} + A_z \hat{k} \right ) \wedge \left (B_x \hat{\imath} + B_y \hat{\jmath} + B_z \hat{k} \right ) = \left ( A_y\, B_z\, -\, A_z\, B_y \right)\hat{\imath} + 
 \left ( A_z\, B_x\, -\, A_x\, B_z \right)\hat{\jmath} + \left ( A_x\, B_y\, -\, A_y\, B_x \right)\hat{k} \,

 que puede escribirse en forma más sencilla como un determinante:

  \vec{A} \wedge \vec{B} = \left | \begin{matrix} 
 \hat{\imath} &amp; \hat{\jmath} &amp; \hat{k} \\
 A_x &amp; A_y &amp; A_z \\
 B_x &amp; B_y &amp; B_z
 \end{matrix} \right |

 
 <article style="background-color:lightblue;border-color:blue">
 **EJEMPLO: Sea \vec{A}= 6 \, \hat{\imath} y \vec{B}= 4 \left ( \cos 30^{\mathrm{o}} \, \hat{\imath} + {\mathrm{sen}} \, 30^{\mathrm{o}} \, \hat{\jmath} \right ). Calcula \vec{A} \wedge \vec{B}. **
 
 <button id="e9" class="button" onclick="show2('e9');">Solución</button>
 
 
 Solución: 

 
 \vec{A} \wedge \vec{B} = 24 \cdot {\mathrm{sen}} \, 30^{\mathrm{o}} \, \hat{k} = 12 \, \hat{k}

 
 
 </article>

 

 [Test para repasar análisis vectorial](vectores-test.html)

 [Volver a la página principal de Física](https://cursos-0-fc-ugr.github.io/Fisica/)
 
 

<hr />

</body>
</html>
