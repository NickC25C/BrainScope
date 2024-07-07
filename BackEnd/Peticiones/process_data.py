import pandas as pd

def split_csv(input_file):
    # Leer el archivo CSV
    data = pd.read_csv(input_file)
    
    # Definir las combinaciones de columnas
    column_sets = {
        'Engagement': ['time(s)', 'Engagement'],
        'Memorization': ['time(s)', 'Memorization'],
        'Workload': ['time(s)', 'Workload']
    }
    
    # Crear y guardar los archivos CSV separados
    for key, columns in column_sets.items():
        output_file = f'{key}.csv'
        df = data[columns]
        df.to_csv(output_file, index=False)
        print(f'Archivo creado: {output_file}')

# Usar la función con el nombre del archivo de entrada
input_file = 'archivo_unido.csv'
split_csv(input_file)