import numpy as np
import mne
import pandas as pd
import io

class ModuleRawData:
    def load_and_configure_data(self, data_string):
        # Convertir la cadena de texto a un objeto similar a archivo para leerlo como si fuera un CSV
        data_io = io.StringIO(data_string)
        
        # Cargar datos utilizando pandas, suponiendo que la cadena ya está en formato adecuado con comas como separadores
        df = pd.read_csv(data_io, delimiter=',')
        
        # Obteniendo los valores numéricos del DataFrame
        data = df.values

        # Nombres de los canales EEG como se definieron antes
        ch_names = ['AF7', 'Fp1', 'Fp2', 'AF8', 'F3', 'F4', 'P3', 'P4', 'PO7', 'O1', 'O2', 'PO8']
        sfreq = 256  # Frecuencia de muestreo
        
        # Creación de información de configuración para los datos EEG
        info = mne.create_info(ch_names, sfreq, ch_types='eeg')
        # Configurar el montaje estándar 10-20
        montage = mne.channels.make_standard_montage('standard_1020')
        info.set_montage(montage)
        
        # Crear el objeto RawArray de MNE con los datos transpuestos (necesario para que coincida con las especificaciones de MNE)
        return mne.io.RawArray(data.transpose(), info)

    def filter_signal(self, raw, low_cut=1.0, high_cut=30):
        return raw.copy().filter(low_cut, high_cut)

    def configure_and_fit_ica(self, raw, n_components=0.99, random_state=42):
        ica = mne.preprocessing.ICA(n_components=n_components, random_state=random_state)
        ica.fit(raw)
        return ica

    def find_and_exclude_artifacts(self, ica, raw, ch_names=['Fp1', 'AF8'], z_thresh=1.96):
        eog_indices, _ = ica.find_bads_eog(raw, ch_name=ch_names, threshold=z_thresh)
        ica.exclude = eog_indices
        return ica

    def apply_ica(self, ica, raw):
        return ica.apply(raw.copy())

    def save_cleaned_data(self, raw):
        data, times = raw[:]  # Extrae los datos y los tiempos del objeto Raw
        
        df = pd.DataFrame(data.T, index=times, columns=raw.ch_names)
        
        # Convertir DataFrame a un formato JSON serializable, como un diccionario
        json_data = df.to_dict(orient='records')  # 'records' convierte el DataFrame en una lista de diccionarios
        print(json_data)
        
        return json_data