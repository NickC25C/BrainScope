import unittest
from unittest.mock import patch, MagicMock
from Peticiones.video import ModuleVideo  # Reemplaza 'your_video_module' con el nombre del archivo que contiene tu clase

class TestModuleVideo(unittest.TestCase):

    @patch('Peticiones.video.VideoFileClip')
    def test_saveInformationVideo(self, mock_VideoFileClip):
        # Simular un video clip con una duración específica
        mock_video = MagicMock()
        mock_video.duration = 35  # Duración simulada en segundos
        mock_VideoFileClip.return_value = mock_video

        module_video = ModuleVideo()
        parts = module_video.saveInformationVideo('fake_path_to_video.mp4')

        # Verificar que la duración y las partes se calcularon correctamente
        self.assertEqual(module_video.duration, 35, "La duración del video no es la esperada.")
        self.assertEqual(parts, 4, "El número de partes calculadas no es el esperado.")  # 35/10 = 3.5, ceil(3.5) = 4

    def test_getPart(self):
        # Preparar una instancia de ModuleVideo con valores simulados
        module_video = ModuleVideo()
        module_video.duration = 40  # Simular una duración de 40 segundos
        module_video.parts = 4  # Simular que el video se dividió en 4 partes

        # Probar getPart con diferentes fragmentos
        part = module_video.getPart(10)
        self.assertEqual(part, 1, "El cálculo de la parte para el fragmento 10 no es correcto.")

        part = module_video.getPart(20)
        self.assertEqual(part, 2, "El cálculo de la parte para el fragmento 20 no es correcto.")

        part = module_video.getPart(30)
        self.assertEqual(part, 3, "El cálculo de la parte para el fragmento 30 no es correcto.")

        part = module_video.getPart(39)
        self.assertEqual(part, 4, "El cálculo de la parte para el fragmento 39 no es correcto.")
        
        part = module_video.getPart(40)
        self.assertEqual(part, 4, "El cálculo de la parte para el fragmento 40 no es correcto.")

if __name__ == '__main__':
    unittest.main()