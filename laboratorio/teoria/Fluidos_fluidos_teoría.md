# Fluidos

[Volver a la página principal de Física](https://cursos-0-fc-ugr.github.io/Fisica/)

## La densidad

La densidad de una sustancia $d$ se define como la masa $m$ por unidad de volumen $V$. Por tanto, el modo de calcularla es: $d=m/V$.

Como corresponde a su definición, la densidad se expresará en unidades de masa divididas por unidades de volumen. En el sistema MKS, kg/m³, en el CGS, g/cm³. Como ejemplo, el agua posee una densidad de 1000 kg/m³ o 1 g/cm³ a 20°C.

:::{admonition} EJEMPLO
:class: note
La densidad del acero es 7.83 g/cm³. ¿Cuál es en kg/m³?

**Solución:**
Para realizar el cambio de unidades, tendremos en cuenta que:
$1 \text{ kg} = 1000 \text{ g}$
$1 \text{ m}^3 = 10^6 \text{ cm}^3$
Por tanto:
$7.83 \text{ g/cm}^3 = 7.83 \times \frac{10^{-3} \text{ kg}}{10^{-6} \text{ m}^3} = 7830 \text{ kg/m}^3$
:::

## El Principio de Pascal

La presión aplicada a un fluido encerrado se transmite sin disminución a todas las partes del fluido y a las paredes del recipiente.

:::{admonition} EJEMPLO: Prensa Hidráulica
:class: note
¿Es posible levantar un coche de 5000 kg utilizando a una persona de 80 kg?

**Solución:**
La condición para que el sistema esté en equilibrio es que la presión en ambos pistones sea la misma:
$$\frac{F_1}{A_1} = \frac{F_2}{A_2} \rightarrow \frac{m_1 g}{\pi R_1^2} = \frac{m_2 g}{\pi R_2^2}$$
Simplificando, llegamos a:
$$\frac{m_1}{D_1^2} = \frac{m_2}{D_2^2}$$
Si el pistón pequeño tiene un diámetro $D_1 = 0.5 \text{ m}$, despejamos $D_2$:
$D_2 = D_1 \sqrt{\frac{m_2}{m_1}} = 0.5 \text{ m} \sqrt{\frac{5000 \text{ kg}}{80 \text{ kg}}} = 4 \text{ m}$
Es posible, siempre que el pistón grande tenga al menos 4 metros de diámetro.
:::

## El Principio de Arquímedes

Todo cuerpo sumergido total o parcialmente en un fluido experimenta una fuerza de empuje vertical hacia arriba igual al peso del fluido desalojado.
$$E = d_{fluido} \cdot V_{sumergido} \cdot g$$

<img src="../_static/figuras/Fluidos/fig-fluidos0.png" style="width:40.0%" />

:::{admonition} EJEMPLO: Iceberg
:class: note
¿Qué fracción de un iceberg queda por debajo del nivel del mar? (Densidad hielo: 920 kg/m³, Densidad agua mar: 1030 kg/m³).

**Solución:**
En equilibrio, el Peso es igual al Empuje ($P = E$):
$d_{hielo} \cdot V_{total} \cdot g = d_{mar} \cdot V_{sumergido} \cdot g$
La fracción sumergida es:
$\frac{V_{sumergido}}{V_{total}} = \frac{d_{hielo}}{d_{mar}} = \frac{920}{1030} \approx 0.89$
Es decir, el 89% del iceberg está sumergido.
:::

---
[Volver a la página principal de Física](https://cursos-0-fc-ugr.github.io/Fisica/)