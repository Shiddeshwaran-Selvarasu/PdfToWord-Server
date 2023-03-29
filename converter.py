import json
import os
import sys
import json
from pdf2docx import Converter

def convert(filepath):
    split_tup = os.path.splitext(filepath)
    file_name = split_tup[0]
    file_extension = split_tup[1]
    result = {
        "status": "failure",
        "path": "null"
    }
    if file_extension == '.pdf':
        pdf_file = file_name+file_extension;
        docx_file = file_name + ".doc"
        cv = Converter(pdf_file)
        cv.convert(docx_file, multiprocessing=True, cpu_count=4)
        cv.close()
        result["status"] = "success"
        result["path"] = docx_file
    else:
        result["status"] = "failure"
        result["path"] = "-"

    return json.dumps(result)


print(convert(sys.argv[1]))
