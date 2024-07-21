import sys
import json
from process_raw_data import ProcessFacade

def main():
    processer = ProcessFacade()

    # Bucle infinito para mantener el proceso activo, leyendo línea por línea
    for input_json in sys.stdin:
        try:
            command = json.loads(input_json)

            # Decodificar el contenido del CSV desde la entrada y procesarlo
            if command['method'] == 'processData':
                file_content = command['params']['inputfile']
                result = processer.processRawData(file_content)  # Corrección de typo en 'trasnformData'
            else:
                result = {'error': 'Unknown command'}
            print(json.dumps(result))  # Envía el resultado como JSON
            sys.stdout.flush()  # Asegura que Python no guarde nada en buffer

        except json.JSONDecodeError:
            print("No se recibió un JSON válido.")
        except KeyError:
            print("JSON no contiene los campos esperados.")
        except Exception as e:
            print("Error al procesar la entrada:", e)

if __name__ == '__main__':
    main()