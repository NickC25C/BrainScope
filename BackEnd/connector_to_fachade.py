import sys
import json
import io
from ViewerFacade import ViewerFacade

def main():
    viewer = ViewerFacade()
    
    # Lee las entradas de stdin
    input_json = sys.stdin.read()
    command = json.loads(input_json)

    # Decodificar el contenido del CSV desde la entrada y procesarlo
    if command['method'] == 'transformData':
        file_content = command['params']['inputfile']
        csv_file = io.StringIO(file_content)
        result = viewer.trasnformData(csv_file)
    elif command['method'] == 'getEngagementFile':
        file_content = command['params']['inputfile']
        csv_file = io.StringIO(file_content)
        result = viewer.getEngagementFile(csv_file)
    elif command['method'] == 'getMemorizationFile':
        file_content = command['params']['inputfile']
        csv_file = io.StringIO(file_content)
        result = viewer.getMemorizationFile(csv_file)
    elif command['method'] == 'getWorkloadFile':
        file_content = command['params']['inputfile']
        csv_file = io.StringIO(file_content)
        result = viewer.getWorkloadFile(csv_file)
    else:
        result = {'error': 'Unknown command'}

    print(json.dumps(result))  # Envía el resultado como JSON
    sys.stdout.flush()  # Asegura que Python no guarde nada en buffer

if __name__ == '__main__':
    main()