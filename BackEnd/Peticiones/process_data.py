import pandas as pd
import io

class ModuleProcessData:

    column_sets = {
        'Engagement': ['time(s)', 'Engagement'],
        'Memorization': ['time(s)', 'Memorization'],
        'Workload': ['time(s)', 'Workload']
    }

    def split_Engagement_csv(self, data_string):
        # Crear y guardar los archivos CSV separados

        data_io = io.StringIO(data_string)
        
        # Cargar los datos en un DataFrame
        df = pd.read_csv(data_io, delimiter=',')
        
        # Filtrar las columnas específicas
        columns = self.column_sets['Engagement']
        df_filtered = df[columns]

        # Asegurarse de que df_filtered es un DataFrame antes de convertirlo a diccionario
        df_filtered = pd.DataFrame(df_filtered)
        
        # Convertir DataFrame a un formato JSON serializable, como un diccionario
        json_data = df_filtered.to_dict(orient='records')  # 'records' convierte el DataFrame en una lista de diccionarios
        
        return json_data

    def split_Memorization_csv(self, data_string):
        # Crear y guardar los archivos CSV separados
        data_io = io.StringIO(data_string)
        
        # Cargar los datos en un DataFrame
        df = pd.read_csv(data_io, delimiter=',')
        
        # Filtrar las columnas específicas
        columns = self.column_sets['Memorization']
        df_filtered = df[columns]

        # Asegurarse de que df_filtered es un DataFrame antes de convertirlo a diccionario
        df_filtered = pd.DataFrame(df_filtered)
        
        # Convertir DataFrame a un formato JSON serializable, como un diccionario
        json_data = df_filtered.to_dict(orient='records')  # 'records' convierte el DataFrame en una lista de diccionarios
        
        return json_data

    def split_Workload_csv(self, data_string):
        # Crear y guardar los archivos CSV separados

        data_io = io.StringIO(data_string)
        
        # Cargar los datos en un DataFrame
        df = pd.read_csv(data_io, delimiter=',')
        
        # Filtrar las columnas específicas
        columns = self.column_sets['Workload']
        df_filtered = df[columns]

        # Asegurarse de que df_filtered es un DataFrame antes de convertirlo a diccionario
        df_filtered = pd.DataFrame(df_filtered)
        
        # Convertir DataFrame a un formato JSON serializable, como un diccionario
        json_data = df_filtered.to_dict(orient='records')  # 'records' convierte el DataFrame en una lista de diccionarios
        
        return json_data
