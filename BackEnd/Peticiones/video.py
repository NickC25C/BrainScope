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
        return math.ceil((self.parts * fragment) / self.duration)