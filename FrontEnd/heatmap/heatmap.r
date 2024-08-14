# Instalar y cargar las bibliotecas necesarias
install.packages("plotly")
library(plotly)

# Leer los datos del CSV con la ruta corregida
data <- read.csv("C:/Users/niccm/Documents/4 CURSO/TFG/prueba_tfg/didi_eeg.csv", header = FALSE)

# Convertir a vector numérico
valores <- as.numeric(data[1, ])

# Asignar etiquetas
etiquetas <- c('AF7', 'Fp1', 'Fp2', 'AF8', 'F3', 'F4', 'P3', 'P4', 'PO7', 'O1', 'O2', 'PO8')

# Coordenadas aproximadas de los electrodos
coord <- data.frame(
  Etiqueta = etiquetas,
  X = c(-0.5, -0.1, 0.1, 0.5, -0.3, 0.3, -0.3, 0.3, -0.4, -0.1, 0.1, 0.4),
  Y = c(0.5, 0.7, 0.7, 0.5, 0.3, 0.3, -0.1, -0.1, -0.25, -0.4, -0.4, -0.25)
)

# Unir valores con las coordenadas
df <- data.frame(Etiqueta = etiquetas, Valor = valores)
df <- merge(coord, df, by = "Etiqueta")

# Ruta a la imagen de fondo
image_path <- "C:/Users/niccm/Downloads/DALL_E_2024-08-14_11.31.49_-_A_simple_top-down_view_outline_of_a_human_head_from_the_top__designed_for_scientific_or_medical_visualization._The_outline_should_be_clear_and_minimal_1-removebg-preview 1.png"

# Crear el gráfico interactivo con plotly
p <- plot_ly(df, x = ~X, y = ~Y, text = ~Etiqueta, 
             type = 'scatter', mode = 'markers', 
             marker = list(size = 20, color = ~Valor, 
                           colorscale = 'RdBu', showscale = TRUE,
                           colorbar = list(title = "Valor")),
             hoverinfo = 'text') %>%
  layout(xaxis = list(showgrid = FALSE, zeroline = FALSE, range = c(-1, 1), visible = FALSE),
         yaxis = list(showgrid = FALSE, zeroline = FALSE, range = c(-1.2, 1.4), visible = FALSE, scaleanchor = "x", scaleratio = 1),
         images = list(
           list(
             source =  base64enc::dataURI(file = image_path, mime = "image/png"),
             xref = "x",
             yref = "y",
             x = -1,
             y = 1.4,
             sizex = 2,
             sizey = 2,
             sizing = "stretch",
             opacity = 0.5,
             layer = "below"
           )),
         showlegend = FALSE,
         plot_bgcolor = "black",  # Fondo negro
         paper_bgcolor = "black",  # Fondo del papel negro
	   font = list(color = "white")  # Color del texto en blanco
         )

# Exportar a HTML
htmlwidgets::saveWidget(p, "mapa_calor_cabeza_con_fondo.html")