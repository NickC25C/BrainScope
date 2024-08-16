import unittest
from Peticiones.process_data import ModuleProcessData  # Asegúrate de reemplazar 'your_module' con el nombre del archivo que contiene tu clase

class TestModuleProcessData(unittest.TestCase):

    def setUp(self):
        # Instanciar la clase ModuleProcessData
        self.processor = ModuleProcessData()

        # Datos CSV simulados para pruebas
        self.csv_data = """time(s),Engagement,Memorization,Workload
1,0.5,0.4,0.3
2,0.6,0.5,0.4
3,0.7,0.6,0.5
"""

    def test_split_Engagement_csv(self):
        # Llamar al método split_Engagement_csv con los datos de prueba
        result = self.processor.split_Engagement_csv(self.csv_data)

        # Verificar el resultado esperado
        expected_result = [
            {'time(s)': 1, 'Engagement': 0.5},
            {'time(s)': 2, 'Engagement': 0.6},
            {'time(s)': 3, 'Engagement': 0.7},
        ]

        self.assertEqual(result, expected_result, "El resultado de split_Engagement_csv no es el esperado.")

    def test_split_Memorization_csv(self):
        # Llamar al método split_Memorization_csv con los datos de prueba
        result = self.processor.split_Memorization_csv(self.csv_data)

        # Verificar el resultado esperado
        expected_result = [
            {'time(s)': 1, 'Memorization': 0.4},
            {'time(s)': 2, 'Memorization': 0.5},
            {'time(s)': 3, 'Memorization': 0.6},
        ]

        self.assertEqual(result, expected_result, "El resultado de split_Memorization_csv no es el esperado.")

    def test_split_Workload_csv(self):
        # Llamar al método split_Workload_csv con los datos de prueba
        result = self.processor.split_Workload_csv(self.csv_data)

        # Verificar el resultado esperado
        expected_result = [
            {'time(s)': 1, 'Workload': 0.3},
            {'time(s)': 2, 'Workload': 0.4},
            {'time(s)': 3, 'Workload': 0.5},
        ]

        self.assertEqual(result, expected_result, "El resultado de split_Workload_csv no es el esperado.")

if __name__ == '__main__':
    unittest.main()