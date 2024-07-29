import requests
import json

# La URL del endpoint de tu API
url = "http://172.28.160.1:5000/process_data"

class Comunicator:
    # Hacemos la solicitud POST
    def contact_with_server(self, data):
        try:
            headers = {'Content-Type': 'application/json'}
            response = requests.post(url, headers=headers, data=json.dumps(data))
            
            # Verificamos si la solicitud fue exitosa
            if response.status_code == 200:
                # Convertimos la respuesta JSON a un diccionario de Python
                return response.json()
            else:
                print(f"Failed to get data. Status code: {response.status_code}")
                print(response.text)
        except Exception as e:
            print(f"An error occurred: {str(e)}")