import pandas as pd

class ModuleProcessData:

    column_sets = {
        'Engagement': ['time(s)', 'Engagement'],
        'Memorization': ['time(s)', 'Memorization'],
        'Workload': ['time(s)', 'Workload']
    }

    def split_Engagement_csv(self, input_file):
        # Crear y guardar los archivos CSV separados
        key, columns = self.column_sets['Engagement']
        df = input_file[columns]
        output_file = 'Engagement.csv'
        df.to_csv(output_file, index=False)
        return output_file

    def split_Memorization_csv(self, input_file):
        # Crear y guardar los archivos CSV separados
        key, columns = self.column_sets['Memorization']
        df = input_file[columns]
        output_file = 'Memorization.csv'
        df.to_csv(output_file, index=False)
        return output_file

    def split_Workload_csv(self, input_file):
        # Crear y guardar los archivos CSV separados
        key, columns = self.column_sets['Workload']
        df = input_file[columns]
        output_file = 'Workload.csv'
        df.to_csv(output_file, index=False)
        return output_file
