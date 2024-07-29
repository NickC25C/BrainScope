import sys
import json
from ViewerFacade import ViewerFacade

def main():
    viewer = ViewerFacade()

    for input_json in sys.stdin:
        try:
            command = json.loads(input_json)
            response = {
                'id': command['id'],  # Asegúrate de incluir el ID del comando en la respuesta
                'result': None,
                'error': None
            }
            print("command")
            sys.stdout.flush()

            # Decodificar el contenido del CSV desde la entrada y procesarlo
            if command['method'] == 'transformData':
                file_content = command['params']['inputfile']
                response['result'] = viewer.transformData(file_content)
            elif command['method'] == 'getEngagementFile':
                file_content = command['params']['inputfile']
                response['result'] = viewer.getEngagementFile(file_content)
            elif command['method'] == 'getMemorizationFile':
                file_content = command['params']['inputfile']
                response['result'] = viewer.getMemorizationFile(file_content)
            elif command['method'] == 'getWorkloadFile':
                file_content = command['params']['inputfile']
                response['result'] = viewer.getWorkloadFile(file_content)
            else:
                response['error'] = 'Unknown command'

            print(json.dumps(response))
            sys.stdout.flush()

        except json.JSONDecodeError:
            print(json.dumps({'id': command.get('id'), 'error': 'No se recibió un JSON válido.'}))
        except KeyError:
            print(json.dumps({'id': command.get('id'), 'error': 'JSON no contiene los campos esperados.'}))
        except Exception as e:
            print(json.dumps({'id': command.get('id'), 'error': f"Error al procesar la entrada: {e}"}))

if __name__ == '__main__':
    main()