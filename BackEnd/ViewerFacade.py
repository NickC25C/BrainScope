from Peticiones.process_data import ModuleProcessData
from Peticiones.video import ModuleVideo

class ViewerFacade:
    _instance = None
    memorization = []
    workload = []
    engagement = []

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ViewerFacade, cls).__new__(cls)
            cls._instance.initialize()
        return cls._instance

    def initialize(self):
        self.processData = ModuleProcessData()
        self.video = ModuleVideo()

    def getEngagementFile(self, inputfile):
        engagementFile = self.processData.split_Engagement_csv(inputfile)
        self.engagement = engagementFile
        return self.engagement[:2500]

    def getMemorizationFile(self, inputfile):
        memorizationFile = self.processData.split_Memorization_csv(inputfile)
        self.memorization = memorizationFile
        return self.memorization[:2500]

    def getWorkloadFile(self, inputfile):
        workloadFile = self.processData.split_Workload_csv(inputfile)
        self.workload = workloadFile
        return self.workload[:2500]

    def saveInformationVideo(self, clip):
        return self.video.saveInformationVideo(clip)
    
    def getDataGraphicWorkload(self, fragment):
        part = self.video.getPart(fragment)
        return self.workload[2500*(part - 1):2500*part]

    def getDataGraphicMemorization(self, fragment):
        part = self.video.getPart(fragment)
        return self.memorization[2500*(part - 1):2500*part]
        
    def getDataGraphicEngagement(self, fragment):
        part = self.video.getPart(fragment)
        return self.engagement[2500*(part - 1):2500*part]
