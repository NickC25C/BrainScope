import sys
import json
import io
from petitions import ViewerFacade

def main():
    try:
        viewer = ViewerFacade()
        input_json = sys.stdin.read()
        command = json.loads(input_json)

            # Decodificar el contenido del CSV desde la entrada y procesarlo
        if command['method'] == 'transformData':
            file_content = command['params']['inputfile']
            result = viewer.trasnformData(file_content)
        elif command['method'] == 'getEngagementFile':
            file_content = command['params']['inputfile']
            result = viewer.getEngagementFile(file_content)
        elif command['method'] == 'getMemorizationFile':
            file_content = command['params']['inputfile']
            result = viewer.getMemorizationFile(file_content)
        elif command['method'] == 'getWorkloadFile':
            file_content = command['params']['inputfile']
            result = viewer.getWorkloadFile(file_content)
        else:
            result = {'error': 'Unknown command'}
        print(json.dumps(result))  # Envía el resultado como JSON
        sys.stdout.flush()  # Asegura que Python no guarde nada en buffer

        # Procesar según el comando
    except json.JSONDecodeError:
        print("No se recibió un JSON válido.")
    except KeyError:
        print("JSON no contiene los campos esperados.")
    except Exception as e:
        print("Error al procesar la entrada:", e)

if __name__ == '__main__':
    main()