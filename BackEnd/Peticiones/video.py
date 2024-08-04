from moviepy.editor import VideoFileClip
import math

class ModuleVideo:
    duration = 0
    parts = 0

    def saveInformationVideo(self, clip):
        self.duration = clip.duration  # Duración en segundos
        self.parts = math.ceil(clip.duration/10)
        print(self.duration)
    
    def getPart(self, fragment):
        return math.ceil((self.parts * fragment) / self.duration)

