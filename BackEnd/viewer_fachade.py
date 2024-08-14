import sys
import json
import base64
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

            if command['method'] == 'getEngagementFile':
                file_content = command['params']['inputfile']
                response['result'] = viewer.getEngagementFile(file_content)
            elif command['method'] == 'getMemorizationFile':
                file_content = command['params']['inputfile']
                response['result'] = viewer.getMemorizationFile(file_content)
            elif command['method'] == 'getWorkloadFile':
                file_content = command['params']['inputfile']
                response['result'] = viewer.getWorkloadFile(file_content)
            elif command['method'] == 'saveInformationVideo':
                clip = command['params']['clip']
                response['result'] = viewer.saveInformationVideo(clip)
            elif command['method'] == 'getDataGraphicWorkload':
                fragment = command['params']['fragment']
                response['result'] = viewer.getDataGraphicWorkload(fragment)
            elif command['method'] == 'getDataGraphicMemorization':
                fragment = command['params']['fragment']
                response['result'] = viewer.getDataGraphicMemorization(fragment)
            elif command['method'] == 'getDataGraphicEngagement':
                fragment = command['params']['fragment']
                response['result'] = viewer.getDataGraphicEngagement(fragment)
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