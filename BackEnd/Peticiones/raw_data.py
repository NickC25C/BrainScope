import numpy as np
import mne
import pandas as pd

def load_and_configure_data(filepath):
    data = np.loadtxt(filepath, delimiter=',', usecols=(range(0,12)))
    ch_names = ['AF7', 'Fp1', 'Fp2', 'AF8', 'F3', 'F4', 'P3', 'P4', 'PO7', 'O1', 'O2', 'PO8']
    sfreq = 256
    info = mne.create_info(ch_names, sfreq, ch_types='eeg')
    montage = mne.channels.make_standard_montage('standard_1020')
    info.set_montage(montage)
    return mne.io.RawArray(data.transpose(), info)

def filter_signal(raw, low_cut=1.0, high_cut=30):
    return raw.copy().filter(low_cut, high_cut)

def configure_and_fit_ica(raw, n_components=0.99, random_state=42):
    ica = mne.preprocessing.ICA(n_components=n_components, random_state=random_state)
    ica.fit(raw)
    return ica

def find_and_exclude_artifacts(ica, raw, ch_names=['Fp1', 'AF8'], z_thresh=1.96):
    eog_indices, _ = ica.find_bads_eog(raw, ch_name=ch_names, threshold=z_thresh)
    ica.exclude = eog_indices
    return ica

def apply_ica(ica, raw):
    return ica.apply(raw.copy())

def save_cleaned_data(raw, filename='processed_data.csv'):
    data, times = raw[:]  # Extrae los datos y los tiempos del objeto Raw
    # Crear DataFrame con tiempos como índice y los nombres de los canales como columnas
    data_frame = pd.DataFrame(data.T, index=times, columns=raw.ch_names)
    data_frame.to_csv(filename, header=True, index=False)

# Ejemplo de cómo usar estas funciones
filepath = 'didi_eeg.csv'
raw = load_and_configure_data(filepath)
raw_filtered = filter_signal(raw)
ica = configure_and_fit_ica(raw_filtered)
ica = find_and_exclude_artifacts(ica, raw_filtered)
cleaned_data = apply_ica(ica, raw_filtered)
save_cleaned_data(cleaned_data)