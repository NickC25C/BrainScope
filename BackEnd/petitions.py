from Peticiones.raw_data import ModuleRawData
from Peticiones.process_data import ModuleProcessData

class ViewerFacade:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ViewerFacade, cls).__new__(cls)
            cls._instance.initialize()
        return cls._instance

    def initialize(self):
        self.processData = ModuleProcessData()
        self.rawData = ModuleRawData()

    def trasnformData(self, inputfile):
        with open(inputfile, 'r') as file:
            raw = self.rawData.load_and_configure_data(file)
        raw_filtered = self.rawData.filter_signal(raw)
        ica = self.rawData.configure_and_fit_ica(raw_filtered)
        ica = self.rawData.find_and_exclude_artifacts(ica, raw_filtered)
        cleaned_data = self.rawData.apply_ica(ica, raw_filtered)
        return self.rawData.save_cleaned_data(cleaned_data)

    def getEngagementFile(self, inputfile):
        with open(inputfile, 'r') as file:
            engagementFile = self.processData.split_Engagement_csv(file)
        return engagementFile

    def getMemorizationFile(self, inputfile):
        with open(inputfile, 'r') as file:
            memorizationFile = self.processData.split_Memorization_csv(file)
        return memorizationFile

    def getWorkloadFile(self, inputfile):
        with open(inputfile, 'r') as file:
            workloadtFile = self.processData.split_Workload_csv(file)
        return workloadtFile