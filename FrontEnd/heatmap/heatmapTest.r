# Especificar un mirror de CRAN e instalar testthat
install.packages("testthat", repos = "https://cloud.r-project.org/")

# Cargar el paquete
library(testthat)

# Cargar el archivo donde está definida la función generar_heatmap
source("heatmap.r")

# Ahora puedes escribir y ejecutar tus pruebas
test_that("generar_heatmap funciona correctamente", {
  
  # Crear un CSV temporal para la prueba
  csv_data <- "0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.4,1.5,1.6"
  temp_csv <- tempfile(fileext = ".csv")
  writeLines(csv_data, temp_csv)
  
  # Crear una carpeta temporal para la salida
  temp_dir <- tempfile()
  dir.create(temp_dir)
  
  # Ejecutar la función
  generar_heatmap(temp_csv, output_dir = temp_dir)
  
  # Verificar que el archivo HTML ha sido creado
  output_file <- file.path(temp_dir, "mapa_calor_cabeza_con_fondo.html")
  expect_true(file.exists(output_file), info = "El archivo HTML no ha sido creado.")
  
  # Opcional: Verificar el contenido básico del archivo HTML
  html_content <- readLines(output_file)
  expect_true(any(grepl("<html", html_content, fixed = TRUE)), info = "El archivo HTML parece estar corrupto o vacío.")
  
  # Limpiar archivos temporales
  unlink(temp_csv)
  unlink(temp_dir, recursive = TRUE)
})