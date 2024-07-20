import requests

# La URL del endpoint de tu API
url = "http://158.42.185.67:5000/process_data"

class Comunicator:
    # Hacemos la solicitud POST
    def contact_with_server():
        try:
            response = requests.post(url)
            
            # Verificamos si la solicitud fue exitosa
            if response.status_code == 200:
                # Convertimos la respuesta JSON a un diccionario de Python
                data = response.json()
                return data
            else:
                print(f"Failed to get data. Status code: {response.status_code}")
                print(response.text)
        except Exception as e:
            print(f"An error occurred: {str(e)}")