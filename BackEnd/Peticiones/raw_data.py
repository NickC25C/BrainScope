import numpy as np
import pandas as pd
import mne
from mne import create_info

def traspose_data(data):
    data = np.loadtxt(data, delimiter=',', usecols=(range(0,12)))
    print("hola1")
    print(data)

    ch_names = ['AF7', 'Fp1', 'Fp2', 'AF8', 'F3', 'F4', 'P3', 'P4', 'PO7',
                'O1', 'O2', 'PO8']
    sfreq = 256  
    info = mne.create_info(ch_names, sfreq, ch_types='eeg')

    montage = mne.channels.make_standard_montage('standard_1020')
    info.set_montage(montage)

    #transpone los datos (columnas por filas)

    raw = mne.io.RawArray(data.transpose(), info)
    #raw.compute_psd().plot()

    ica_low_cut = 1.0       
    hi_cut  = 30
    raw_ica = raw.copy().filter(ica_low_cut, hi_cut)

    random_state = 42   # ensures ICA is reproducable each time it's run
    ica_n_components = .99     # Specify n_components as a decimal to set % explained variance


    ica = mne.preprocessing.ICA(n_components=ica_n_components,
                                random_state=random_state,
                                )

    ica.fit(raw_ica)


    ica_z_thresh = 1.96 
    eog_indices, eog_scores = ica.find_bads_eog(raw_ica, 
                                                ch_name=['Fp1', 'AF8'], 
                                                threshold=ica_z_thresh)
    ica.exclude = eog_indices


    info = create_info(ch_names, 1, "eeg")
    processed_data = ica.apply(raw_ica.copy())

    print(processed_data.get_data())

    print("hola")
    print(processed_data[:5, :5])

    data_process, times = processed_data[:, :]

    print("hola2")
    print(data_process)

    data_from_process_data = processed_data.get_data()  # Esto extrae todos los datos y los tiempos del objeto Raw-

    # Crear un DataFrame de pandas
    data_frame = pd.DataFrame(data_process)

    # Guardar el DataFrame en CSV
    return data_frame.to_csv('processed_data.csv', header=False, index=False)