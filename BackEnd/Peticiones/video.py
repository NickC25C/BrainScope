from moviepy.editor import VideoFileClip
import math

class ModuleVideo:
    duration = 0
    parts = 0

    def saveInformationVideo(self, clip):
        video = VideoFileClip(clip)
        self.duration = video.duration  # Duración en segundos
        self.parts = math.ceil(video.duration/10)
        return self.parts
    
    def getPart(self, fragment):
        result = (self.parts * fragment) / self.duration
        # Calcular el resultado sin redondeo
        floor_result = math.floor(result)
        # Verificar si la diferencia entre el resultado y el resultado redondeado hacia abajo es menor que 0.1
        if result - floor_result < 0.15:
            return floor_result
        else:
            return math.ceil(result)