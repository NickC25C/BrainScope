import requests

# La URL del endpoint de tu API
url = "http://127.0.0.1:5000/process_data"

# Hacemos la solicitud POST
try:
    response = requests.post(url)
    
    # Verificamos si la solicitud fue exitosa
    if response.status_code == 200:
        # Convertimos la respuesta JSON a un diccionario de Python
        data = response.json()
        print("Data received from API:")
        print(data)
    else:
        print(f"Failed to get data. Status code: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"An error occurred: {str(e)}")