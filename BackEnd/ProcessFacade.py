from Procesamiento_Datos.comunicator import Comunicator
import json

class ProcessFacade:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ProcessFacade, cls).__new__(cls)
            cls._instance.initialize()
        return cls._instance

    def initialize(self):
        self.comunicator = Comunicator()

    def processRawData(self, data):
        return self.comunicator.contact_with_server(data)